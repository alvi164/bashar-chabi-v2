import {
  NormalUserRole,
  ServiceCategory,
  ServiceRequestStatus,
  VisitStatus,
  PropertyStatus,
} from '../types/index.ts';

// Allowed normal user roles
export const ALLOWED_USER_ROLES: readonly NormalUserRole[] = [
  'tenant',
  'landlord_or_agent',
  'service_provider',
] as const;

export function isValidUserRole(role: string): role is NormalUserRole {
  return (ALLOWED_USER_ROLES as readonly string[]).includes(role);
}

// Allowed household service categories
export const ALLOWED_SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  'moving',
  'cleaning',
  'plumbing',
  'electrical',
  'ac_service',
  'appliance_repair',
] as const;

export function isValidServiceCategory(category: string): category is ServiceCategory {
  return (ALLOWED_SERVICE_CATEGORIES as readonly string[]).includes(category);
}

// HTTPS Image URL Validation
export function isValidHttpsUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateImageUrls(urls: string[]): { valid: boolean; error?: string } {
  if (!Array.isArray(urls)) {
    return { valid: false, error: 'Images must be an array of URLs' };
  }
  if (urls.length > 8) {
    return { valid: false, error: 'Maximum 8 images allowed' };
  }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (!isValidHttpsUrl(url)) {
      return {
        valid: false,
        error: `Image URL #${i + 1} must be a valid secure HTTPS link (https://)`,
      };
    }
  }
  return { valid: true };
}

// Service Request State Transitions
const VALID_SERVICE_TRANSITIONS: Record<ServiceRequestStatus, ServiceRequestStatus[]> = {
  requested: ['reviewing', 'cancelled'],
  reviewing: ['assigned', 'cancelled'],
  assigned: ['in_progress', 'cancelled', 'disputed'],
  in_progress: ['completed', 'disputed'],
  completed: ['disputed'],
  disputed: [],
  cancelled: [],
};

export function isValidServiceTransition(
  current: ServiceRequestStatus,
  next: ServiceRequestStatus
): boolean {
  const allowed = VALID_SERVICE_TRANSITIONS[current];
  return allowed ? allowed.includes(next) : false;
}

// Visit Request State Transitions
const VALID_VISIT_TRANSITIONS: Record<VisitStatus, VisitStatus[]> = {
  requested: ['confirmed', 'declined', 'cancelled'],
  confirmed: ['cancelled', 'completed'],
  declined: [],
  cancelled: [],
  completed: [],
};

export function isValidVisitTransition(current: VisitStatus, next: VisitStatus): boolean {
  const allowed = VALID_VISIT_TRANSITIONS[current];
  return allowed ? allowed.includes(next) : false;
}

// Property State Transitions
// Phase 3 Allowed transitions:
// - draft -> pending_review
// - rejected -> pending_review
// - pending_review -> published
// - pending_review -> rejected
// All other transitions in Phase 3 are strictly blocked.
const VALID_PROPERTY_TRANSITIONS: Record<PropertyStatus, PropertyStatus[]> = {
  draft: ['pending_review'],
  pending_review: ['published', 'rejected'],
  published: ['rented', 'expired', 'suspended'],
  rejected: ['pending_review'],
  expired: ['draft', 'pending_review'],
  rented: ['draft', 'pending_review'],
  suspended: ['published', 'draft'],
};

export function isValidPropertyTransition(
  current: PropertyStatus,
  next: PropertyStatus
): boolean {
  const allowed = VALID_PROPERTY_TRANSITIONS[current];
  return allowed ? allowed.includes(next) : false;
}

// String sanitization
export function sanitizeString(val: unknown, maxLength = 500): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLength);
}

// Allowed Property Types & Enums
export const ALLOWED_PROPERTY_TYPES = ['apartment', 'house', 'room', 'sublet', 'mess_seat'] as const;
export const ALLOWED_FURNISHING = ['unfurnished', 'semi_furnished', 'furnished'] as const;
export const ALLOWED_ELIGIBILITY = ['family', 'bachelor_male', 'bachelor_female', 'any'] as const;

export const ALLOWED_PROPERTY_INPUT_KEYS = new Set([
  'titleBn',
  'titleEn',
  'descriptionBn',
  'descriptionEn',
  'propertyType',
  'monthlyRent',
  'deposit',
  'serviceCharge',
  'area',
  'neighbourhood',
  'privateAddress',
  'bedrooms',
  'bathrooms',
  'sizeSqFt',
  'furnishing',
  'tenantEligibility',
  'utilities',
  'availableFrom',
  'imageUrls',
]);

// Property input validation helper
export interface PropertyValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validatePropertyInput(data: Record<string, any>): PropertyValidationResult {
  const errors: Record<string, string> = {};

  // Check for unknown fields
  for (const key of Object.keys(data)) {
    if (!ALLOWED_PROPERTY_INPUT_KEYS.has(key)) {
      errors[key] = `অননুমোদিত ফিল্ড: ${key} (Unknown field not allowed)`;
    }
  }

  if (!data.titleBn || typeof data.titleBn !== 'string' || data.titleBn.trim().length < 3) {
    errors.titleBn = 'বাংলা শিরোনাম আবশ্যক (কমপক্ষে ৩ অক্ষর)';
  } else if (data.titleBn.length > 140) {
    errors.titleBn = 'শিরোনাম সর্বোচ্চ ১৪০ অক্ষর হতে পারে';
  }

  if (data.titleEn !== undefined && data.titleEn !== null && data.titleEn !== '') {
    if (typeof data.titleEn !== 'string' || data.titleEn.length > 140) {
      errors.titleEn = 'ইংরেজি শিরোনাম সর্বোচ্চ ১৪০ অক্ষর হতে পারে';
    }
  }

  if (typeof data.monthlyRent !== 'number' || data.monthlyRent <= 0) {
    errors.monthlyRent = 'মাসিক ভাড়া অবশ্যই শূন্যের চেয়ে বেশি হতে হবে';
  }

  if (typeof data.deposit === 'number' && data.deposit < 0) {
    errors.deposit = 'অগ্রিম জামানত ঋণাত্মক হতে পারে না';
  }

  if (typeof data.serviceCharge === 'number' && data.serviceCharge < 0) {
    errors.serviceCharge = 'সার্ভিস চার্জ ঋণাত্মক হতে পারে না';
  }

  if (!data.area || typeof data.area !== 'string' || data.area.trim().length === 0) {
    errors.area = 'এলাকা নির্বাচন আবশ্যক';
  }

  if (data.propertyType && !ALLOWED_PROPERTY_TYPES.includes(data.propertyType)) {
    errors.propertyType = 'অবৈধ প্রোপার্টি টাইপ';
  }

  if (data.furnishing && !ALLOWED_FURNISHING.includes(data.furnishing)) {
    errors.furnishing = 'অবৈধ ফার্নিশিং স্ট্যাটাস';
  }

  if (data.tenantEligibility && !ALLOWED_ELIGIBILITY.includes(data.tenantEligibility)) {
    errors.tenantEligibility = 'অবৈধ ভাড়াটিয়া যোগ্যতা';
  }

  if (typeof data.bedrooms !== 'number' || data.bedrooms < 0 || data.bedrooms > 20) {
    errors.bedrooms = 'সঠিক বেডরুম সংখ্যা উল্লেখ করুন (০ - ২০)';
  }

  if (typeof data.bathrooms !== 'number' || data.bathrooms < 0 || data.bathrooms > 20) {
    errors.bathrooms = 'সঠিক বাথরুম সংখ্যা উল্লেখ করুন (০ - ২০)';
  }

  if (typeof data.sizeSqFt !== 'number' || data.sizeSqFt < 50 || data.sizeSqFt > 20000) {
    errors.sizeSqFt = 'সঠিক আয়তন উল্লেখ করুন (কমপক্ষে ৫০ বর্গফুট)';
  }

  if (!data.descriptionBn || typeof data.descriptionBn !== 'string' || data.descriptionBn.trim().length < 10) {
    errors.descriptionBn = 'বিস্তারিত বাংলা বিবরণ আবশ্যক (কমপক্ষে ১০ অক্ষর)';
  } else if (data.descriptionBn.length > 2000) {
    errors.descriptionBn = 'বিবরণ সর্বোচ্চ ২০০০ অক্ষর হতে পারে';
  }

  if (data.descriptionEn !== undefined && data.descriptionEn !== null && data.descriptionEn !== '') {
    if (typeof data.descriptionEn !== 'string' || data.descriptionEn.length > 2000) {
      errors.descriptionEn = 'ইংরেজি বিবরণ সর্বোচ্চ ২০০০ অক্ষর হতে পারে';
    }
  }

  if (data.availableFrom) {
    const parsedDate = new Date(data.availableFrom);
    if (isNaN(parsedDate.getTime())) {
      errors.availableFrom = 'সঠিক তারিখ প্রদান করুন (YYYY-MM-DD)';
    }
  }

  if (data.imageUrls) {
    const imgCheck = validateImageUrls(data.imageUrls);
    if (!imgCheck.valid && imgCheck.error) {
      errors.imageUrls = imgCheck.error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
