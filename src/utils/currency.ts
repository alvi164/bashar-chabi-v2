import { Language } from '../localization/types.ts';

const BANGLA_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts English digits to Bangla numerals.
 */
export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => BANGLA_DIGITS[digit] || digit);
}

/**
 * Formats currency as Bangladeshi Taka:
 * In Bangla: ৳২৫,০০০
 * In English: ৳25,000
 */
export function formatTaka(amount: number, language: Language = 'bn'): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return language === 'bn' ? '৳০' : '৳0';
  }

  // Format with standard thousands separator
  const formattedEn = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.floor(amount)));

  if (language === 'bn') {
    return `৳${toBanglaDigits(formattedEn)}`;
  }

  return `৳${formattedEn}`;
}
