export interface SupportedCountry {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  dialCode: string;
  isEU: boolean;
  defaultPlanEnabled: boolean;
  legalReviewReference: string;
}

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', dialCode: '+49', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', dialCode: '+33', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', currencySymbol: '€', dialCode: '+31', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', currencySymbol: '€', dialCode: '+32', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'ES', name: 'Spain', currency: 'EUR', currencySymbol: '€', dialCode: '+34', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€', dialCode: '+39', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', currencySymbol: '€', dialCode: '+351', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'AT', name: 'Austria', currency: 'EUR', currencySymbol: '€', dialCode: '+43', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', currencySymbol: '€', dialCode: '+353', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'FI', name: 'Finland', currency: 'EUR', currencySymbol: '€', dialCode: '+358', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', currencySymbol: 'kr', dialCode: '+46', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', currencySymbol: 'kr.', dialCode: '+45', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'PL', name: 'Poland', currency: 'PLN', currencySymbol: 'zł', dialCode: '+48', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK', currencySymbol: 'Kč', dialCode: '+420', isEU: true, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', currencySymbol: 'CHF', dialCode: '+41', isEU: false, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'NO', name: 'Norway', currency: 'NOK', currencySymbol: 'kr', dialCode: '+47', isEU: false, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', dialCode: '+44', isEU: false, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', dialCode: '+1', isEU: false, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'CA$', dialCode: '+1', isEU: false, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', dialCode: '+61', isEU: false, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', currencySymbol: 'NZ$', dialCode: '+64', isEU: false, defaultPlanEnabled: false, legalReviewReference: '' },
  { code: 'OTHER', name: 'Other International Country', currency: 'EUR', currencySymbol: '€', dialCode: '+', isEU: false, defaultPlanEnabled: false, legalReviewReference: '' }
];

export function getCountryByCode(code: string): SupportedCountry {
  const found = SUPPORTED_COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found || SUPPORTED_COUNTRIES.find((c) => c.code === 'OTHER') || SUPPORTED_COUNTRIES[0];
}

export function getCurrencyConversionDisclosure(countryCode: string): string | null {
  const country = getCountryByCode(countryCode);
  if (country.currency === 'EUR') {
    return null;
  }
  return `The contractual pilgrimage price is in Euros (€). When paying in ${country.currency}, your card issuer or bank will automatically convert the charge at their prevailing interbank rate. JustPrem does not charge any currency conversion fee.`;
}

