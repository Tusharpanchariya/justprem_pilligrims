import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { createSignedAgreementPdf } from '@/lib/payments/agreement-pdf';
import { INITIAL_RETREAT_TERMS } from '@/lib/payments/initial-terms';

const ACCEPTANCE = 'I agree to electronically sign and be legally bound by this document.';

function validAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET || '';
  const supplied = req.headers.get('x-admin-secret') || '';
  const left = Buffer.from(secret); const right = Buffer.from(supplied);
  return !!secret && left.length === right.length && timingSafeEqual(left, right);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  if (url.searchParams.get('admin') === '1') {
    if (!validAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data, error } = await supabaseServer.from('retreat_terms').select('id, pilgrimage_slug, version, title, content, status, published_at, created_at').order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: 'Unable to load agreement versions.' }, { status: 503 });
    return NextResponse.json({ terms: data || [] });
  }
  if (url.searchParams.get('download') === '1') {
    const ref = url.searchParams.get('ref')?.trim().toUpperCase();
    const email = url.searchParams.get('email')?.trim().toLowerCase();
    if (!ref || !email) return NextResponse.json({ error: 'Booking reference and email are required.' }, { status: 400 });
    const { data: booking } = await supabaseServer.from('bookings').select('id, booking_reference, customer_email, pilgrimage_title').eq('booking_reference', ref).eq('customer_email', email).maybeSingle();
    if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    const { data: signed } = await supabaseServer.from('signed_agreements').select('terms_version, terms_snapshot, signer_full_name, acceptance_text, signed_at, agreement_reference, document_hash, pdf_storage_path').eq('booking_id', booking.id).maybeSingle();
    if (!signed) return NextResponse.json({ error: 'No signed agreement is available for this booking.' }, { status: 404 });
    let pdf: Uint8Array;
    if (signed.pdf_storage_path) {
      const { data: storedPdf, error: downloadError } = await supabaseServer.storage.from('signed-agreements').download(signed.pdf_storage_path);
      if (storedPdf && !downloadError) pdf = new Uint8Array(await storedPdf.arrayBuffer());
      else {
        console.error('[agreements] Stored agreement PDF unavailable:', downloadError);
        return NextResponse.json({ error: 'The signed agreement PDF is temporarily unavailable.' }, { status: 503 });
      }
    } else {
      pdf = createSignedAgreementPdf({ retreatName: booking.pilgrimage_title, participantName: signed.signer_full_name,
        bookingReference: booking.booking_reference, termsVersion: signed.terms_version,
        agreementReference: signed.agreement_reference, signedAt: signed.signed_at,
        termsSnapshot: signed.terms_snapshot, acceptanceText: signed.acceptance_text, documentHash: signed.document_hash });
    }
    const pdfBlob = new Blob([Uint8Array.from(pdf).buffer as ArrayBuffer], { type: 'application/pdf' });
    return new NextResponse(pdfBlob, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${signed.agreement_reference}.pdf"`, 'Cache-Control': 'private, no-store' } });
  }
  if (!slug || !/^[a-z0-9-]{2,100}$/.test(slug)) return NextResponse.json({ error: 'A valid retreat identifier is required.' }, { status: 400 });
  try {
    const { data } = await supabaseServer
      .from('retreat_terms')
      .select('id, version, title, content, published_at')
      .eq('pilgrimage_slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (data) return NextResponse.json({ agreement: data });
  } catch (err) {
    console.warn('[agreements] Could not fetch retreat_terms from DB:', err);
  }

  return NextResponse.json({
    agreement: {
      id: 'default-nepal-2027',
      version: '1.0',
      title: 'Heart of the Himalayas Retreat Terms & Conditions',
      content: INITIAL_RETREAT_TERMS,
      published_at: '2026-11-01T00:00:00.000Z',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === 'manage_terms') {
      if (!validAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const slug = typeof body.pilgrimageSlug === 'string' ? body.pilgrimageSlug.trim() : '';
      const version = typeof body.version === 'string' ? body.version.trim() : '';
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const content = typeof body.content === 'string' ? body.content.trim() : '';
      const status = body.status === 'published' ? 'published' : 'draft';
      if (!/^[a-z0-9-]{2,100}$/.test(slug) || !/^[a-zA-Z0-9._-]{1,40}$/.test(version) || !title || title.length > 180 || content.length < 300 || content.length > 60000) {
        return NextResponse.json({ error: 'Check the retreat, version, title, and agreement content (300–60,000 characters).'}, { status: 400 });
      }
      if (status === 'published' && body.legalReviewed !== true) return NextResponse.json({ error: 'Confirm jurisdiction-specific clauses have been reviewed before publishing.' }, { status: 400 });
      if (status === 'published') {
        const { error: archiveError } = await supabaseServer.from('retreat_terms').update({ status: 'archived' }).eq('pilgrimage_slug', slug).eq('status', 'published');
        if (archiveError) return NextResponse.json({ error: 'Unable to archive the current agreement version.' }, { status: 503 });
      }
      const { data, error } = await supabaseServer.from('retreat_terms').upsert({ pilgrimage_slug: slug, version, title, content, status, published_at: status === 'published' ? new Date().toISOString() : null }, { onConflict: 'pilgrimage_slug,version' }).select('id, version, status, published_at').single();
      if (error) return NextResponse.json({ error: 'Unable to save this agreement version.' }, { status: 503 });
      await supabaseServer.from('payment_audit_logs').insert({ action: status === 'published' ? 'retreat_terms_published' : 'retreat_terms_saved', performed_by: 'admin_secret', new_status: status, metadata: { pilgrimage_slug: slug, version, legal_review_confirmed: body.legalReviewed === true } });
      return NextResponse.json({ success: true, terms: data });
    }
    const bookingReference = typeof body.bookingReference === 'string' ? body.bookingReference.trim().toUpperCase() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const signerFullName = typeof body.signerFullName === 'string' ? body.signerFullName.trim().replace(/\s+/g, ' ') : '';
    if (!bookingReference || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || signerFullName.length < 2 || signerFullName.length > 160 || body.accepted !== true) {
      return NextResponse.json({ error: 'Enter your full legal name and confirm electronic signing.' }, { status: 400 });
    }
    const { data: booking } = await supabaseServer.from('bookings').select('id, booking_reference, customer_name, customer_email, pilgrimage_slug, booking_status').eq('booking_reference', bookingReference).eq('customer_email', email).maybeSingle();
    if (!booking) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    if (booking.booking_status === 'cancelled') return NextResponse.json({ error: 'This booking cannot be signed.' }, { status: 409 });
    if (signerFullName.toLocaleLowerCase() !== booking.customer_name.trim().replace(/\s+/g, ' ').toLocaleLowerCase()) return NextResponse.json({ error: 'The signature name must match the name on the booking.' }, { status: 400 });
    const { data: prior } = await supabaseServer.from('signed_agreements').select('agreement_reference, terms_version, signed_at').eq('booking_id', booking.id).maybeSingle();
    if (prior) return NextResponse.json({ success: true, agreement: prior });
    const { data: terms, error: termsError } = await supabaseServer.from('retreat_terms').select('id, version, title, content').eq('pilgrimage_slug', booking.pilgrimage_slug).eq('status', 'published').maybeSingle();
    if (termsError || !terms) return NextResponse.json({ error: 'The current agreement is unavailable. Please contact JustPrem.' }, { status: 409 });
    const signedAt = new Date().toISOString();
    const agreementReference = `JPA-${randomBytes(8).toString('hex').toUpperCase()}`;
    const auditMetadata = { userAgent: req.headers.get('user-agent')?.slice(0, 500) || null, networkFingerprint: createHash('sha256').update(req.headers.get('x-forwarded-for') || 'unknown').digest('hex'), bookingReference: booking.booking_reference };
    const documentHash = createHash('sha256').update(JSON.stringify({ bookingId: booking.id, termsVersion: terms.version, termsSnapshot: terms.content, signerFullName, acceptanceText: ACCEPTANCE, signedAt, agreementReference })).digest('hex');
    const { error: saveError } = await supabaseServer.from('signed_agreements').insert({ booking_id: booking.id, terms_id: terms.id, terms_version: terms.version, terms_snapshot: terms.content, signer_full_name: signerFullName, acceptance_text: ACCEPTANCE, signed_at: signedAt, agreement_reference: agreementReference, document_hash: documentHash, audit_metadata: auditMetadata });
    if (saveError) {
      if (saveError.code === '23505') return NextResponse.json({ error: 'This booking already has a signed agreement. Reload the booking to continue.' }, { status: 409 });
      console.error('[agreements] Unable to persist signature:', saveError);
      return NextResponse.json({ error: 'The signature could not be stored. Please try again.' }, { status: 503 });
    }
    await supabaseServer.from('payment_audit_logs').insert({ booking_id: booking.id, action: 'agreement_signed', performed_by: 'booking_owner_email_verified', new_status: 'signed', metadata: { agreement_reference: agreementReference, terms_version: terms.version, document_hash: documentHash } });
    return NextResponse.json({ success: true, agreement: { agreementReference, termsVersion: terms.version, signedAt } });
  } catch (error) {
    console.error('[agreements] Signing failed:', error);
    return NextResponse.json({ error: 'The agreement could not be signed.' }, { status: 500 });
  }
}
