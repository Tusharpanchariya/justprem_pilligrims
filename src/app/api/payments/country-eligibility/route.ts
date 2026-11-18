import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { SUPPORTED_COUNTRIES } from '@/lib/payments/countries';

export async function GET(req: NextRequest) {
  const countryCode = req.nextUrl.searchParams.get('countryCode')?.toUpperCase();
  if (!countryCode || !SUPPORTED_COUNTRIES.some((country) => country.code === countryCode)) {
    return NextResponse.json({ approvedPlanTypes: [] }, { status: 400 });
  }

  const [{ data: globalSettings, error: globalError }, { data: countrySettings, error: countryError }] = await Promise.all([
    supabaseServer.from('payment_system_settings').select('allow_new_installment_plans').eq('singleton', true).maybeSingle(),
    supabaseServer.from('country_payment_settings')
      .select('payment_plan_enabled, approved_plan_types, approved_terms_version, approved_terms_text, approved_cancellation_policy_version, approved_cancellation_policy_text, legal_review_date, legal_review_reference, emergency_disabled')
      .eq('country_code', countryCode).maybeSingle(),
  ]);

  if (globalError || countryError || !globalSettings?.allow_new_installment_plans || !countrySettings ||
      !countrySettings.payment_plan_enabled || countrySettings.emergency_disabled || !countrySettings.approved_terms_version ||
      !countrySettings.approved_terms_text || !countrySettings.approved_cancellation_policy_version ||
      !countrySettings.approved_cancellation_policy_text || !countrySettings.legal_review_date || !countrySettings.legal_review_reference) {
    return NextResponse.json({ approvedPlanTypes: [] });
  }

  const approvedPlanTypes = Array.isArray(countrySettings.approved_plan_types)
    ? countrySettings.approved_plan_types.filter((type: string) => ['two_parts', 'three_parts'].includes(type))
    : [];
  return NextResponse.json({
    approvedPlanTypes,
    termsVersion: countrySettings.approved_terms_version,
    termsText: countrySettings.approved_terms_text,
    cancellationPolicyVersion: countrySettings.approved_cancellation_policy_version,
    cancellationPolicyText: countrySettings.approved_cancellation_policy_text,
  });
}
