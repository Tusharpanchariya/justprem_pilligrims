import { NextRequest, NextResponse } from 'next/server';
import { getCountryByCode } from '@/lib/payments/countries';
import { isInstallmentBookingWindowOpen } from '@/lib/payments/catalog';
import { CANCELLATION_POLICY_TEXT, CANCELLATION_POLICY_VERSION, INSTALLMENT_TERMS_TEXT, INSTALLMENT_TERMS_VERSION } from '@/lib/payments/installment-terms';

export async function GET(req: NextRequest) {
  const countryCode = req.nextUrl.searchParams.get('countryCode')?.toUpperCase() || 'GB';
  const country = getCountryByCode(countryCode);

  // EMI / installment payment is approved for all countries worldwide
  const approvedPlanTypes = isInstallmentBookingWindowOpen() ? ['two_parts', 'three_parts'] : [];
  return NextResponse.json({
    approvedPlanTypes,
    countryCode: country.code,
    countryName: country.name,
    termsVersion: INSTALLMENT_TERMS_VERSION,
    termsText: INSTALLMENT_TERMS_TEXT,
    cancellationPolicyVersion: CANCELLATION_POLICY_VERSION,
    cancellationPolicyText: CANCELLATION_POLICY_TEXT,
  });
}
