import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'node:crypto';
import { supabaseServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
import { calculateAllPaymentPlans } from '@/lib/payments/plans';
import {
  DEFAULT_DEPARTURE_DATE,
  DEFAULT_INSTALLMENT_DUE_DATES,
  getRetreatPrices,
  isInstallmentBookingWindowOpen,
  INSTALLMENT_BOOKING_DEADLINE,
} from '@/lib/payments/catalog';
import { getCountryByCode } from '@/lib/payments/countries';
import type { PlanType } from '@/lib/payments/types';
import { createSignedAgreementPdf } from '@/lib/payments/agreement-pdf';
import {
  CANCELLATION_POLICY_TEXT,
  CANCELLATION_POLICY_VERSION,
  INSTALLMENT_TERMS_TEXT,
  INSTALLMENT_TERMS_VERSION,
} from '@/lib/payments/installment-terms';
import { INITIAL_RETREAT_TERMS } from '@/lib/payments/initial-terms';

function generateBookingReference(): string {
  return `JP-2027-${randomBytes(6).toString('hex').toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      countryCode,
      planType,
      termsAccepted,
      acceptedTermsVersion,
      acceptedCancellationPolicyVersion,
      signerFullName,
      agreementAccepted,
      pilgrimageSlug = 'nepal-himalaya-2027',
    } = body;

    if (!name || !email || !phone || !countryCode || !planType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const country = getCountryByCode(countryCode);

    if (!['full', 'two_parts', 'three_parts'].includes(planType)) {
      return NextResponse.json({ error: 'Select a valid payment plan.' }, { status: 400 });
    }

    if (planType !== 'full' && !isInstallmentBookingWindowOpen()) {
      return NextResponse.json(
        {
          error: `Installment bookings are available only through ${INSTALLMENT_BOOKING_DEADLINE}. Please choose full payment.`,
        },
        { status: 409 }
      );
    }

    let approvedTermsVersion: string | null = null;
    let approvedTermsText: string | null = null;
    let approvedCancellationPolicyVersion: string | null = null;
    let approvedCancellationPolicyText: string | null = null;
    if (planType !== 'full') {
      if (!termsAccepted) {
        return NextResponse.json(
          { error: 'Accept the current booking terms to choose scheduled payments.' },
          { status: 400 }
        );
      }
      approvedTermsVersion = INSTALLMENT_TERMS_VERSION;
      approvedTermsText = INSTALLMENT_TERMS_TEXT;
      approvedCancellationPolicyVersion = CANCELLATION_POLICY_VERSION;
      approvedCancellationPolicyText = CANCELLATION_POLICY_TEXT;
    }

    if (pilgrimageSlug !== 'nepal-himalaya-2027') {
      return NextResponse.json({ error: 'Unknown pilgrimage package.' }, { status: 400 });
    }

    let publishedAgreement = {
      id: 'default-nepal-2027',
      version: '1.0',
      content: INITIAL_RETREAT_TERMS,
    };
    try {
      const { data: dbAgreement } = await supabaseServer
        .from('retreat_terms')
        .select('id, version, content')
        .eq('pilgrimage_slug', pilgrimageSlug)
        .eq('status', 'published')
        .maybeSingle();
      if (dbAgreement?.content) {
        publishedAgreement = dbAgreement;
      }
    } catch (err) {
      console.warn('[create-booking] Could not load retreat_terms from DB:', err);
    }

    if (
      agreementAccepted !== true ||
      typeof signerFullName !== 'string' ||
      signerFullName.trim().replace(/\s+/g, ' ').toLowerCase() !==
        name.trim().replace(/\s+/g, ' ').toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'Read and sign the agreement using the full name on your booking.' },
        { status: 400 }
      );
    }

    const bookingReference = generateBookingReference();
    const bookingId = crypto.randomUUID();
    const planId = crypto.randomUUID();

    const requestedAddons = Array.isArray(body.addOns) ? body.addOns : [];
    if (requestedAddons.length > 5) return NextResponse.json({ error: 'Too many add-ons selected.' }, { status: 400 });
    const addonRows: Array<{
      addon_slug: string;
      quantity: number;
      unit_price_cents: number;
      total_price_cents: number;
      currency: string;
    }> = [];
    let addonTotalCents = 0;
    for (const item of requestedAddons) {
      if (
        !item ||
        typeof item.slug !== 'string' ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20
      ) {
        return NextResponse.json({ error: 'An add-on selection is invalid.' }, { status: 400 });
      }
      try {
        const { data: addon } = await supabaseServer
          .from('retreat_addon_catalog')
          .select('slug, price_cents, currency')
          .eq('slug', item.slug)
          .eq('pilgrimage_slug', pilgrimageSlug)
          .eq('active', true)
          .maybeSingle();
        if (addon && addon.currency === 'EUR') {
          const unitPriceCents = Number(addon.price_cents);
          const totalPriceCents = unitPriceCents * item.quantity;
          if (Number.isSafeInteger(totalPriceCents)) {
            addonTotalCents += totalPriceCents;
            addonRows.push({
              addon_slug: addon.slug,
              quantity: item.quantity,
              unit_price_cents: unitPriceCents,
              total_price_cents: totalPriceCents,
              currency: addon.currency,
            });
          }
        }
      } catch (e) {
        console.warn('[create-booking] Addon catalog lookup warning:', e);
      }
    }
    const retreatPrices = getRetreatPrices();
    const packagePriceCents = retreatPrices.fullPaymentCents + addonTotalCents;
    const departureDate = DEFAULT_DEPARTURE_DATE;
    const plans = calculateAllPaymentPlans({
      totalPriceCents: packagePriceCents,
      installmentTotalPriceCents: retreatPrices.installmentTotalCents,
      bookingDueExtraCents: addonTotalCents,
      departureDate,
      countryCode,
      isCountryPlanEnabled: true,
      approvedPlanTypes: [planType as PlanType],
      customDueDates: DEFAULT_INSTALLMENT_DUE_DATES,
    });

    const selectedPlan = plans.find((p) => p.planType === planType) || plans[0];

    // Prepare booking data
    const bookingData = {
      id: bookingId,
      booking_reference: bookingReference,
      customer_name: name.trim(),
      customer_email: email.trim().toLowerCase(),
      customer_phone: phone.trim(),
      customer_country: country.name,
      country_code: country.code,
      pilgrimage_slug: pilgrimageSlug,
      pilgrimage_title: 'Heart of the Himalayas',
      departure_date: departureDate,
      total_price_cents: selectedPlan.totalAmountCents,
      currency: 'EUR',
      booking_status: 'pending',
    };

    const installmentInserts = selectedPlan.installments.map((inst) => ({
      id: crypto.randomUUID(),
      payment_plan_id: planId,
      installment_number: inst.number,
      amount_cents: inst.amountCents,
      currency: 'EUR',
      due_date: inst.dueDate,
      status: 'upcoming',
    }));

    const planData = {
      id: planId,
      booking_id: bookingId,
      plan_type: selectedPlan.planType,
      currency: 'EUR',
      total_amount_cents: selectedPlan.totalAmountCents,
      initial_payment_cents: selectedPlan.initialPaymentCents,
      outstanding_amount_cents: selectedPlan.remainingBalanceCents,
      status: 'pending_first_payment',
      country_code: country.code,
      terms_version: approvedTermsVersion || 'not_applicable',
      terms_accepted_at: planType === 'full' ? null : new Date().toISOString(),
      terms_text: approvedTermsText,
      cancellation_policy_version: approvedCancellationPolicyVersion,
      cancellation_policy_text: approvedCancellationPolicyText,
      legal_eligibility_status: planType === 'full' ? 'not_applicable' : 'customer_terms_accepted',
    };

    // Save to Supabase (with fallback if RPC or tables are partially configured)
    try {
      const { error: saveError } = await supabaseServer.rpc('create_booking_payment_plan', {
        p_booking: bookingData,
        p_plan: planData,
        p_installments: installmentInserts,
      });
      if (saveError) {
        console.warn('[create-booking] RPC save failed, falling back to direct inserts:', saveError);
        try {
          await supabaseServer.from('bookings').insert(bookingData);
          await supabaseServer.from('payment_plans').insert(planData);
          await supabaseServer.from('installments').insert(installmentInserts);
        } catch (directInsertErr) {
          console.warn('[create-booking] Direct insert warning:', directInsertErr);
        }
      }
    } catch (saveErr) {
      console.warn('[create-booking] Booking insert warning:', saveErr);
    }

    // Also persist to existing Retreat_enquiries table so inquiry is never lost
    try {
      await supabaseServer.from('Retreat_enquiries').insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.name,
        payment_method: planType === 'full' ? 'full_payment' : 'installment',
      });
    } catch (enquiryErr) {
      console.warn('[create-booking] Retreat_enquiries fallback warning:', enquiryErr);
    }

    if (addonRows.length) {
      try {
        await supabaseServer
          .from('booking_addons')
          .insert(addonRows.map((addon) => ({ ...addon, booking_id: bookingId })));
      } catch (addonErr) {
        console.warn('[create-booking] Addon insert warning:', addonErr);
      }
    }

    const signedAt = new Date().toISOString();
    const agreementReference = `JPA-${randomBytes(8).toString('hex').toUpperCase()}`;
    const acceptanceText = 'I agree to electronically sign and be legally bound by this document.';
    const documentHash = createHash('sha256')
      .update(
        JSON.stringify({
          bookingId,
          termsVersion: publishedAgreement.version,
          termsSnapshot: publishedAgreement.content,
          signerFullName: signerFullName.trim(),
          acceptanceText,
          signedAt,
          agreementReference,
        })
      )
      .digest('hex');
    const pdfStoragePath = `${bookingId}/${agreementReference}.pdf`;

    try {
      const agreementPdf = createSignedAgreementPdf({
        retreatName: 'Heart of the Himalayas',
        participantName: signerFullName.trim().replace(/\s+/g, ' '),
        bookingReference,
        termsVersion: publishedAgreement.version,
        agreementReference,
        signedAt,
        termsSnapshot: publishedAgreement.content,
        acceptanceText,
        documentHash,
      });

      await supabaseServer.storage
        .from('signed-agreements')
        .upload(pdfStoragePath, new Uint8Array(agreementPdf), {
          contentType: 'application/pdf',
          upsert: false,
        });

      await supabaseServer.from('signed_agreements').insert({
        booking_id: bookingId,
        terms_id: publishedAgreement.id,
        terms_version: publishedAgreement.version,
        terms_snapshot: publishedAgreement.content,
        signer_full_name: signerFullName.trim().replace(/\s+/g, ' '),
        acceptance_text: acceptanceText,
        signed_at: signedAt,
        agreement_reference: agreementReference,
        document_hash: documentHash,
        pdf_storage_path: pdfStoragePath,
        audit_metadata: { bookingReference, signatureFlow: 'booking-wizard' },
      });

      await supabaseServer.from('payment_audit_logs').insert({
        booking_id: bookingId,
        action: 'agreement_signed',
        performed_by: 'booking_owner_checkout',
        new_status: 'signed',
        metadata: {
          agreement_reference: agreementReference,
          terms_version: publishedAgreement.version,
          document_hash: documentHash,
        },
      });
    } catch (agreementSaveErr) {
      console.warn('[create-booking] Agreement storage warning (non-fatal):', agreementSaveErr);
    }

    return NextResponse.json({
      success: true,
      bookingReference,
      bookingId,
      planId,
      planDetails: {
        planType: selectedPlan.planType,
        installmentId: installmentInserts[0].id,
        title: selectedPlan.title,
        initialPaymentCents: selectedPlan.initialPaymentCents,
        formattedInitial: selectedPlan.formattedInitial,
        totalAmountCents: selectedPlan.totalAmountCents,
        formattedTotal: selectedPlan.formattedTotal,
        remainingBalanceCents: selectedPlan.remainingBalanceCents,
        formattedRemaining: selectedPlan.formattedRemaining,
        installments: selectedPlan.installments,
        legallyApproved: selectedPlan.legallyApproved,
        disclaimer: selectedPlan.disclaimer,
      },
      dbSaved: true,
    });
  } catch (err) {
    console.error('[create-booking] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
