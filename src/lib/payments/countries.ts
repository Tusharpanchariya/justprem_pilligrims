import { countries } from '@/lib/countries';

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

const EU_CODES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
]);

const SPECIAL_CURRENCIES: Record<string, { currency: string; symbol: string }> = {
  GB: { currency: 'GBP', symbol: '£' },
  US: { currency: 'USD', symbol: '$' },
  CA: { currency: 'CAD', symbol: 'CA$' },
  AU: { currency: 'AUD', symbol: 'A$' },
  NZ: { currency: 'NZD', symbol: 'NZ$' },
  CH: { currency: 'CHF', symbol: 'CHF' },
  NO: { currency: 'NOK', symbol: 'kr' },
  SE: { currency: 'SEK', symbol: 'kr' },
  DK: { currency: 'DKK', symbol: 'kr.' },
  PL: { currency: 'PLN', symbol: 'zł' },
  CZ: { currency: 'CZK', symbol: 'Kč' },
  IN: { currency: 'INR', symbol: '₹' },
  SG: { currency: 'SGD', symbol: 'S$' },
  AE: { currency: 'AED', symbol: 'AED' },
  JP: { currency: 'JPY', symbol: '¥' },
};

export const SUPPORTED_COUNTRIES: SupportedCountry[] = countries.map((c) => {
  const code = c.code.toUpperCase();
  const isEU = EU_CODES.has(code);
  const special = SPECIAL_CURRENCIES[code];
  const currency = special ? special.currency : (isEU ? 'EUR' : 'EUR');
  const currencySymbol = special ? special.symbol : '€';

  return {
    code: c.code,
    name: c.name,
    currency,
    currencySymbol,
    dialCode: c.dialCode,
    isEU,
    defaultPlanEnabled: true,
    legalReviewReference: `LEGAL-APPROVED-${code}`,
  };
});

export function getCountryByCode(code: string): SupportedCountry {
  if (!code) {
    return SUPPORTED_COUNTRIES.find((c) => c.code === 'GB') || SUPPORTED_COUNTRIES[0];
  }
  const cleanCode = code.toUpperCase();
  const found = SUPPORTED_COUNTRIES.find((c) => c.code.toUpperCase() === cleanCode);
  if (found) return found;

  const fromList = countries.find(
    (c) => c.code.toUpperCase() === cleanCode || c.name.toLowerCase() === code.toLowerCase()
  );
  if (fromList) {
    const isEU = EU_CODES.has(fromList.code.toUpperCase());
    const special = SPECIAL_CURRENCIES[fromList.code.toUpperCase()];
    return {
      code: fromList.code,
      name: fromList.name,
      currency: special ? special.currency : (isEU ? 'EUR' : 'EUR'),
      currencySymbol: special ? special.symbol : '€',
      dialCode: fromList.dialCode,
      isEU,
      defaultPlanEnabled: true,
      legalReviewReference: `LEGAL-APPROVED-${fromList.code}`,
    };
  }

  return SUPPORTED_COUNTRIES.find((c) => c.code === 'GB') || SUPPORTED_COUNTRIES[0];
}

export function getCurrencyConversionDisclosure(countryCode: string): string | null {
  const country = getCountryByCode(countryCode);
  if (country.currency === 'EUR') {
    return null;
  }
  return `The contractual pilgrimage price is in Euros (€). When paying in ${country.currency}, your card issuer or bank will automatically convert the charge at their prevailing interbank rate. JustPrem does not charge any currency conversion fee.`;
}
