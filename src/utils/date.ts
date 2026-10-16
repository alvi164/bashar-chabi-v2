import { Language } from '../localization/types.ts';
import { toBanglaDigits } from './currency.ts';

const DHAKA_TIMEZONE = 'Asia/Dhaka';

/**
 * Formats an ISO date string using Asia/Dhaka timezone.
 */
export function formatDhakaDate(isoString: string, language: Language = 'bn'): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      timeZone: DHAKA_TIMEZONE,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    if (language === 'bn') {
      const formatted = new Intl.DateTimeFormat('bn-BD', options).format(date);
      return toBanglaDigits(formatted);
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Checks whether a given date is strictly in the future compared to now.
 */
export function isFutureDate(dateString: string): boolean {
  try {
    const target = new Date(dateString);
    const now = new Date();
    return target.getTime() > now.getTime();
  } catch {
    return false;
  }
}

/**
 * Formats a time string or slot safely.
 */
export function formatTimeSlot(slot: string, language: Language = 'bn'): string {
  if (language === 'bn') {
    return toBanglaDigits(slot);
  }
  return slot;
}
