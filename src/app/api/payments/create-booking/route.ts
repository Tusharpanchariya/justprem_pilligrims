import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { supabaseServer } from '@/lib/supabase-server';
import { calculateAllPaymentPlans } from '@/lib/payments/plans';
import { DEFAULT_DEPARTURE_DATE, DEFAULT_PACKAGE_PRICE_CENTS } from '@/lib/payments/catalog';
import { SUPPORTED_COUNTRIES } from '@/lib/payments/countries';
import type { PlanType } from '@/lib/payments/types';

function generateBookingReference(): string {
  return `JP-2027-${randomBytes(6).toString('hex').toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, countryCode, planType, termsAccepted, acceptedTermsVersion, acceptedCancellationPolicyVersion,
            pilgrimageSlug = 'nepal-himalaya-2027' } = body;

    if (!name || !email || !phone || !countryCode || !planType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!SUPPORTED_COUNTRIES.some((country) => country.code === countryCode)) {
      return NextResponse.json({ error: 'Select a supported country.' }, { status: 400 });
    }

    if (!['full', 'two_parts', 'three_parts'].includes(planType)) {
      return NextResponse.json({ error: 'Select a valid payment plan.' }, { status: 400 });
    }

    let approvedTermsVersion: string | null = null;
    let approvedTermsText: string | null = null;
    let approvedCancellationPolicyVersion: string | null = null;
    let approvedCancellationPolicyText: string | null = null;
    if (planType !== 'full') {
      if (!termsAccepted) {
        return NextResponse.json({ error: 'Accept the current booking terms to choose scheduled payments.' }, { status: 400 });
      }
      const [{ data: globalSettings, error: globalError }, { data: countrySettings, error: settingsError }] = await Promise.all([
        supabaseServer.from('payment_system_settings').select('allow_new_installment_plans').eq('singleton', true).maybeSingle(),
        supabaseServer.from('country_payment_settings')
          .select('payment_plan_enabled, approved_plan_types, approved_terms_version, approved_terms_text, approved_cancellation_policy_version, approved_cancellation_policy_text, legal_review_date, legal_review_reference, emergency_disabled')
          .eq('country_code', countryCode).maybeSingle(),
      ]);

      if (globalError || !globalSettings?.allow_new_installment_plans || settingsError || !countrySettings || !countrySettings.payment_plan_enabled || countrySettings.emergency_disabled ||
          !Array.isArray(countrySettings.approved_plan_types) || !countrySettings.approved_plan_types.includes(planType)) {
        return NextResponse.json({ error: 'Scheduled payments are not enabled for your country.' }, { status: 409 });
      }
      if (!countrySettings.approved_terms_version || !countrySettings.approved_terms_text ||
          !countrySettings.approved_cancellation_policy_version || !countrySettings.approved_cancellation_policy_text ||
          !countrySettings.legal_review_date || !countrySettings.legal_review_reference) {
        return NextResponse.json({ error: 'Approved terms, cancellation policy, and legal review details are required for your country.' }, { status: 409 });
      }
      if (acceptedTermsVersion !== countrySettings.approved_terms_version ||
          acceptedCancellationPolicyVersion !== countrySettings.approved_cancellation_policy_version) {
        return NextResponse.json({ error: 'The approved terms changed. Review them and accept again.' }, { status: 409 });
      }
      approvedTermsVersion = countrySettings.approved_terms_version;
      approvedTermsText = countrySettings.approved_terms_text;
      approvedCancellationPolicyVersion = countrySettings.approved_cancellation_policy_version;
      approvedCancellationPolicyText = countrySettings.approved_cancellation_policy_text;
    }

    if (pilgrimageSlug !== 'nepal-himalaya-2027') {
      return NextResponse.json({ error: 'Unknown pilgrimage package.' }, { status: 400 });
    }

    const bookingReference = generateBookingReference();
    const bookingId = crypto.randomUUID();
    const planId = crypto.randomUUID();

    const packagePriceCents = DEFAULT_PACKAGE_PRICE_CENTS;
    const departureDate = DEFAULT_DEPARTURE_DATE;
    const plans = calculateAllPaymentPlans({ totalPriceCents: packagePriceCents, departureDate, countryCode, isCountryPlanEnabled: true, approvedPlanTypes: [planType as PlanType] });

    const selectedPlan = plans.find((p) => p.planType === planType) || plans[0];

    // Insert booking
    const bookingData = {
      id: bookingId,
      booking_reference: bookingReference,
      customer_name: name.trim(),
      customer_email: email.trim().toLowerCase(),
      customer_phone: phone.trim(),
      customer_country: SUPPORTED_COUNTRIES.find((country) => country.code === countryCode)?.name || countryCode,
      country_code: countryCode,
      pilgrimage_slug: pilgrimageSlug,
      pilgrimage_title: 'Heart of the Himalayas',
      departure_date: departureDate,
      total_price_cents: packagePriceCents,
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
      country_code: countryCode,
      terms_version: approvedTermsVersion || 'not_applicable',
      terms_accepted_at: planType === 'full' ? null : new Date().toISOString(),
      terms_text: approvedTermsText,
      cancellation_policy_version: approvedCancellationPolicyVersion,
      cancellation_policy_text: approvedCancellationPolicyText,
      legal_eligibility_status: planType === 'full' ? 'not_applicable' : 'approved',
    };
    const { error: saveError } = await supabaseServer.rpc('create_booking_payment_plan', {
      p_booking: bookingData,
      p_plan: planData,
      p_installments: installmentInserts,
    });
    if (saveError) {
      console.error('[create-booking] Atomic booking persistence failed:', saveError);
      return NextResponse.json({ error: 'Unable to save booking. Please try again.' }, { status: 503 });
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
