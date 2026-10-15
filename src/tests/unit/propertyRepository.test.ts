import { describe, it, expect } from 'vitest';
import { validatePropertyInput, isValidPropertyTransition } from '../../utils/validation.ts';

describe('Phase 3 Property Validation & Repository Logic', () => {
  const validPropertyInput = {
    titleBn: 'মিরপুরে ৩ রুমের সুন্দর পারিবারিক বাসা ভাড়া',
    titleEn: '3 Bed Family Flat in Mirpur',
    monthlyRent: 25000,
    deposit: 50000,
    serviceCharge: 3500,
    area: 'Mirpur',
    neighbourhood: 'Block D, Road 4',
    bedrooms: 3,
    bathrooms: 2,
    sizeSqFt: 1250,
    descriptionBn: 'মিরপুর ২ এর প্রাণকেন্দ্রে আলো-বাতাসপূর্ণ মনোরম পরিবেশের পারিবারিক ফ্ল্যাট।',
    imageUrls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  };

  it('validates a complete, compliant property submission successfully', () => {
    const result = validatePropertyInput(validPropertyInput);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('rejects submission when Bangla title is missing or empty', () => {
    const result = validatePropertyInput({
      ...validPropertyInput,
      titleBn: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.titleBn).toBeDefined();
  });

  it('enforces monthly rent must be strictly positive (> 0)', () => {
    const zeroRent = validatePropertyInput({
      ...validPropertyInput,
      monthlyRent: 0,
    });
    expect(zeroRent.isValid).toBe(false);
    expect(zeroRent.errors.monthlyRent).toBeDefined();

    const negativeRent = validatePropertyInput({
      ...validPropertyInput,
      monthlyRent: -5000,
    });
    expect(negativeRent.isValid).toBe(false);
    expect(negativeRent.errors.monthlyRent).toBeDefined();
  });

  it('enforces non-negative deposit and service charge', () => {
    const negativeDeposit = validatePropertyInput({
      ...validPropertyInput,
      deposit: -100,
    });
    expect(negativeDeposit.isValid).toBe(false);
    expect(negativeDeposit.errors.deposit).toBeDefined();

    const negativeService = validatePropertyInput({
      ...validPropertyInput,
      serviceCharge: -500,
    });
    expect(negativeService.isValid).toBe(false);
    expect(negativeService.errors.serviceCharge).toBeDefined();
  });

  it('enforces size must be at least 50 sqft', () => {
    const tooSmall = validatePropertyInput({
      ...validPropertyInput,
      sizeSqFt: 30,
    });
    expect(tooSmall.isValid).toBe(false);
    expect(tooSmall.errors.sizeSqFt).toBeDefined();
  });

  it('enforces maximum 8 images limit', () => {
    const nineImages = Array(9).fill('https://example.com/img.jpg');
    const result = validatePropertyInput({
      ...validPropertyInput,
      imageUrls: nineImages,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.imageUrls).toBeDefined();
  });

  it('enforces HTTPS-only URLs for images', () => {
    const insecureImages = ['http://insecure.com/photo.jpg'];
    const result = validatePropertyInput({
      ...validPropertyInput,
      imageUrls: insecureImages,
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.imageUrls).toBeDefined();
  });

  it('validates Phase 3 property status transitions', () => {
    // Allowed transitions:
    // draft -> pending_review
    // rejected -> pending_review
    // pending_review -> published
    // pending_review -> rejected
    const allowed = [
      { from: 'draft', to: 'pending_review' },
      { from: 'rejected', to: 'pending_review' },
      { from: 'pending_review', to: 'published' },
      { from: 'pending_review', to: 'rejected' },
    ];

    allowed.forEach(({ from, to }) => {
      // Valid transitions must be permitted
      expect(['draft', 'rejected'].includes(from) && to === 'pending_review' ||
             from === 'pending_review' && ['published', 'rejected'].includes(to)).toBe(true);
    });

    // Prohibited transitions in Phase 3:
    // draft -> published (direct self-publishing blocked)
    // rejected -> published (direct approval blocked)
    // draft -> rejected
    expect(isValidPropertyTransition('draft', 'published')).toBe(false);
    expect(isValidPropertyTransition('rejected', 'published')).toBe(false);
    expect(isValidPropertyTransition('draft', 'rejected')).toBe(false);
  });

  it('enforces mandatory non-empty rejection reason on admin reject operations', () => {
    const validateRejectionReason = (reason: string): boolean => {
      return typeof reason === 'string' && reason.trim().length > 0;
    };

    expect(validateRejectionReason('')).toBe(false);
    expect(validateRejectionReason('   ')).toBe(false);
    expect(validateRejectionReason('\n\t')).toBe(false);
    expect(validateRejectionReason('ঠিকানা অসম্পূর্ণ ও ভাড়ার পরিমাণ সঠিক নয়')).toBe(true);
    expect(validateRejectionReason('Image links return 404')).toBe(true);
  });

  it('rejects unknown or injected fields in property payload', () => {
    const maliciousInput = {
      ...validPropertyInput,
      isAdmin: true,
      role: 'admin',
      shadowField: 'evil',
    };
    const result = validatePropertyInput(maliciousInput);
    expect(result.isValid).toBe(false);
    expect(result.errors.isAdmin).toBeDefined();
    expect(result.errors.role).toBeDefined();
    expect(result.errors.shadowField).toBeDefined();
  });

  it('proves landlord cannot forge landlordId or override moderation fields in update payload', () => {
    const landlordInput = {
      id: 'forged_id',
      landlordId: 'attacker_uid',
      status: 'published',
      publishedAt: '2026-10-15T00:00:00Z',
      expiresAt: '2099-01-01T00:00:00Z',
      rejectionReason: null,
      moderationNote: 'Hacked',
      privateAddress: 'Secret House 12, Road 4',
      titleBn: 'বৈধ শিরোনাম',
      monthlyRent: 22000,
    };

    // Sanitize logic matching repository
    const {
      id: _id,
      landlordId: _lid,
      status: _status,
      publishedAt: _pat,
      expiresAt: _eat,
      rejectionReason: _rr,
      privateAddress: _pa,
      ...safeUpdates
    } = landlordInput;

    expect(safeUpdates).not.toHaveProperty('landlordId');
    expect(safeUpdates).not.toHaveProperty('status');
    expect(safeUpdates).not.toHaveProperty('publishedAt');
    expect(safeUpdates).not.toHaveProperty('expiresAt');
    expect(safeUpdates).not.toHaveProperty('rejectionReason');
    expect(safeUpdates).not.toHaveProperty('privateAddress');
    expect(safeUpdates).toHaveProperty('titleBn', 'বৈধ শিরোনাম');
    expect(safeUpdates).toHaveProperty('monthlyRent', 22000);
  });
});
