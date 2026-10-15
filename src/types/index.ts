/**
 * Bashar Chabi - Domain Models and TypeScript Interfaces
 * Strictly defined according to the technical specifications.
 */

// User Roles
export type UserRole = 'tenant' | 'landlord_or_agent' | 'service_provider' | 'admin';
export type NormalUserRole = 'tenant' | 'landlord_or_agent' | 'service_provider';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  uid: string;
  displayName: string;
  photoURL?: string;
  selectedRole: NormalUserRole;
  area: string;
  language: 'bn' | 'en';
  status: UserStatus;
  onboardingComplete: boolean;
  createdAt: string; // ISO string / Firestore Timestamp
  updatedAt: string;
}

export interface PrivateProfile {
  uid: string;
  phone: string;
  contactPreference: 'phone' | 'whatsapp' | 'email';
  consentVersion: string;
  consentedAt: string;
  createdAt: string;
  updatedAt: string;
}

// Property Models
export type PropertyType = 'apartment' | 'house' | 'room' | 'sublet' | 'mess_seat';
export type FurnishingStatus = 'unfurnished' | 'semi_furnished' | 'furnished';
export type TenantEligibility = 'family' | 'bachelor_male' | 'bachelor_female' | 'any';
export type PropertyStatus =
  | 'draft'
  | 'pending_review'
  | 'published'
  | 'rejected'
  | 'expired'
  | 'rented'
  | 'suspended';

export interface Property {
  id: string;
  landlordId: string;
  titleBn: string;
  titleEn?: string;
  descriptionBn: string;
  descriptionEn?: string;
  propertyType: PropertyType;
  monthlyRent: number;
  deposit: number;
  serviceCharge: number;
  area: string;
  neighbourhood: string;
  privateAddress?: string; // Visible only to owner and server-authorized admin
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  furnishing: FurnishingStatus;
  tenantEligibility: TenantEligibility;
  utilities: {
    gas: boolean;
    water: boolean;
    electricity: boolean;
    generator: boolean;
    lift: boolean;
    security: boolean;
    wifi: boolean;
    parking: boolean;
  };
  availableFrom: string;
  imageUrls: string[]; // Up to 8 HTTPS image URLs
  status: PropertyStatus;
  rejectionReason?: string;
  lastConfirmedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  rentedAt?: string;
}

export interface PropertyPrivate {
  propertyId: string;
  landlordId: string;
  privateAddress: string;
  createdAt: string;
  updatedAt: string;
}

// Property Favourite
export interface Favourite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
}

// Visit Request
export type VisitStatus = 'requested' | 'confirmed' | 'declined' | 'cancelled' | 'completed';

export interface Visit {
  id: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  preferredDate: string;
  preferredTime: string; // e.g., "10:00 - 12:00"
  note?: string; // max 300 characters
  status: VisitStatus;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
}

// Service Provider
export type ProviderVerificationStatus = 'pending' | 'approved' | 'rejected';
export type ProviderStatus = 'active' | 'suspended';

export interface ServiceProvider {
  id: string;
  userId: string;
  displayName: string;
  categories: ServiceCategory[];
  serviceAreas: string[];
  experienceSummary: string;
  workingHours: string;
  verificationStatus: ProviderVerificationStatus;
  status: ProviderStatus;
  createdAt: string;
  updatedAt: string;
}

// Household Services
export type ServiceCategory =
  | 'moving'
  | 'cleaning'
  | 'plumbing'
  | 'electrical'
  | 'ac_service'
  | 'appliance_repair';

export type ServiceRequestStatus =
  | 'requested'
  | 'reviewing'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export interface ServiceRequest {
  id: string;
  customerId: string;
  assignedProviderId?: string;
  category: ServiceCategory;
  area: string;
  preferredDate: string;
  preferredTime: string;
  description: string; // max 800 characters
  contactPreference: 'phone' | 'whatsapp';
  status: ServiceRequestStatus;
  adminNote?: string;
  cancellationReason?: string;
  disputeReason?: string;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  completedAt?: string;
}

// User Reports
export type ReportTargetType = 'property' | 'user' | 'provider' | 'service_request';
export type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

// Audit Logs
export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  previousState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  reason?: string;
  createdAt: string;
}

// Filter and Search Parameters
export interface PropertyFilterParams {
  area?: string;
  minRent?: number;
  maxRent?: number;
  propertyType?: PropertyType;
  minBedrooms?: number;
  furnishing?: FurnishingStatus;
  tenantEligibility?: TenantEligibility;
  availableFrom?: string;
  sortBy?: 'newest' | 'rent_asc' | 'rent_desc';
}
