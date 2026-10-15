import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../firebase/config.ts';
import { handleFirestoreError, OperationType } from '../firebase/errors.ts';
import { Property, PropertyStatus, AuditLog } from '../types/index.ts';
import { validatePropertyInput } from '../utils/validation.ts';

export const propertyRepository = {
  /**
   * 1. Creates a property draft.
   * Derives landlordId strictly from authenticated uid - never from user input.
   */
  async createDraft(
    landlordId: string,
    initialData: Partial<Property>
  ): Promise<Property> {
    if (!landlordId || !auth.currentUser || auth.currentUser.uid !== landlordId) {
      throw new Error('Unauthorized: landlordId must match authenticated user');
    }

    const propertiesRef = collection(db, 'properties');
    const newDocRef = doc(propertiesRef);
    const now = new Date().toISOString();

    const monthlyRent = Number(initialData.monthlyRent) || 20000;
    if (monthlyRent <= 0) {
      throw new Error('Monthly rent must be a positive number');
    }

    const draftProperty: Omit<Property, 'privateAddress'> = {
      id: newDocRef.id,
      landlordId,
      titleBn: initialData.titleBn || '',
      titleEn: initialData.titleEn || '',
      descriptionBn: initialData.descriptionBn || '',
      descriptionEn: initialData.descriptionEn || '',
      propertyType: initialData.propertyType || 'apartment',
      monthlyRent,
      deposit: Number(initialData.deposit) || 0,
      serviceCharge: Number(initialData.serviceCharge) || 0,
      area: initialData.area || 'Mirpur',
      neighbourhood: initialData.neighbourhood || '',
      bedrooms: Number(initialData.bedrooms) || 2,
      bathrooms: Number(initialData.bathrooms) || 1,
      sizeSqFt: Number(initialData.sizeSqFt) || 800,
      furnishing: initialData.furnishing || 'unfurnished',
      tenantEligibility: initialData.tenantEligibility || 'family',
      utilities: initialData.utilities || {
        gas: true,
        water: true,
        electricity: true,
        generator: false,
        lift: false,
        security: true,
        wifi: false,
        parking: false,
      },
      availableFrom: initialData.availableFrom || new Date().toISOString().split('T')[0],
      imageUrls: initialData.imageUrls || [],
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    try {
      await setDoc(newDocRef, draftProperty);

      // Isolate privateAddress into owner/admin-only document path: propertyPrivate/{propertyId}
      if (initialData.privateAddress && initialData.privateAddress.trim()) {
        try {
          await setDoc(doc(db, 'propertyPrivate', newDocRef.id), {
            propertyId: newDocRef.id,
            landlordId,
            privateAddress: initialData.privateAddress.trim(),
            createdAt: now,
            updatedAt: now,
          });
        } catch (privErr) {
          console.warn('Could not save propertyPrivate document:', privErr);
        }
      }

      return {
        ...draftProperty,
        privateAddress: initialData.privateAddress || '',
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `properties/${newDocRef.id}`, auth);
    }
  },

  /**
   * 2. Loads all properties owned by the specified landlord.
   */
  async getOwnedProperties(landlordId: string): Promise<Property[]> {
    if (!landlordId) return [];
    try {
      const q = query(
        collection(db, 'properties'),
        where('landlordId', '==', landlordId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const items = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const propData = docSnap.data() as Omit<Property, 'id'>;
          let privateAddress = propData.privateAddress || '';
          try {
            const privSnap = await getDoc(doc(db, 'propertyPrivate', docSnap.id));
            if (privSnap.exists()) {
              privateAddress = privSnap.data().privateAddress || privateAddress;
            }
          } catch {
            // Protected
          }
          return {
            id: docSnap.id,
            ...propData,
            privateAddress,
          };
        })
      );
      return items;
    } catch (err) {
      // Fallback without server-side ordering if composite index is provisioning
      try {
        const fallbackQ = query(
          collection(db, 'properties'),
          where('landlordId', '==', landlordId)
        );
        const snapshot = await getDocs(fallbackQ);
        const items = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const propData = docSnap.data() as Omit<Property, 'id'>;
            let privateAddress = propData.privateAddress || '';
            try {
              const privSnap = await getDoc(doc(db, 'propertyPrivate', docSnap.id));
              if (privSnap.exists()) {
                privateAddress = privSnap.data().privateAddress || privateAddress;
              }
            } catch {
              // Protected
            }
            return {
              id: docSnap.id,
              ...propData,
              privateAddress,
            };
          })
        );
        return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      } catch (innerErr) {
        handleFirestoreError(innerErr, OperationType.LIST, 'properties', auth);
      }
    }
  },

  /**
   * 3. Fetches a property by ID.
   * If caller is owner or admin, confidential privateAddress from propertyPrivate/{id} is attached.
   */
  async getPropertyById(propertyId: string): Promise<Property | null> {
    const path = `properties/${propertyId}`;
    try {
      const snap = await getDoc(doc(db, 'properties', propertyId));
      if (!snap.exists()) return null;
      const data = snap.data() as Omit<Property, 'id'>;
      let privateAddress = data.privateAddress || '';

      const currentUid = auth.currentUser?.uid;
      if (currentUid && (currentUid === data.landlordId)) {
        try {
          const privSnap = await getDoc(doc(db, 'propertyPrivate', propertyId));
          if (privSnap.exists()) {
            privateAddress = privSnap.data().privateAddress || privateAddress;
          }
        } catch {
          // Protected
        }
      }

      return {
        id: snap.id,
        ...data,
        privateAddress,
      };
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path, auth);
    }
  },

  /**
   * 4. Updates an owned draft or rejected property.
   * Strips forbidden moderation/status fields to prevent tampering.
   * Keeps privateAddress isolated in propertyPrivate/{propertyId}.
   */
  async updateDraft(
    propertyId: string,
    landlordId: string,
    updates: Partial<Property>
  ): Promise<void> {
    const path = `properties/${propertyId}`;
    const existing = await this.getPropertyById(propertyId);
    if (!existing) {
      throw new Error('Property not found');
    }
    if (existing.landlordId !== landlordId) {
      throw new Error('Forbidden: You do not own this property');
    }
    if (existing.status !== 'draft' && existing.status !== 'rejected') {
      throw new Error(`Cannot edit property in status: ${existing.status}`);
    }

    // Strip forbidden and moderation fields
    const {
      id: _id,
      landlordId: _lid,
      status: _status,
      publishedAt: _pat,
      expiresAt: _eat,
      rejectionReason: _rr,
      privateAddress: privAddressUpdate,
      ...safeUpdates
    } = updates;

    const now = new Date().toISOString();

    try {
      const ref = doc(db, 'properties', propertyId);
      await updateDoc(ref, {
        ...safeUpdates,
        updatedAt: now,
      });

      // Update isolated private address document if provided
      if (privAddressUpdate !== undefined) {
        try {
          await setDoc(
            doc(db, 'propertyPrivate', propertyId),
            {
              propertyId,
              landlordId,
              privateAddress: privAddressUpdate.trim(),
              createdAt: existing.createdAt || now,
              updatedAt: now,
            },
            { merge: true }
          );
        } catch (privErr) {
          console.warn('Could not update propertyPrivate document:', privErr);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path, auth);
    }
  },

  /**
   * 5. Deletes an owned draft after user confirmation.
   * Cleans up both public property doc and isolated privateAddress doc.
   */
  async deleteDraft(propertyId: string, landlordId: string): Promise<void> {
    const path = `properties/${propertyId}`;
    const existing = await this.getPropertyById(propertyId);
    if (!existing) {
      throw new Error('Property not found');
    }
    if (existing.landlordId !== landlordId) {
      throw new Error('Forbidden: You do not own this property');
    }
    if (existing.status !== 'draft') {
      throw new Error('Only draft properties can be deleted');
    }

    try {
      await deleteDoc(doc(db, 'properties', propertyId));
      try {
        await deleteDoc(doc(db, 'propertyPrivate', propertyId));
      } catch {
        // Ignored
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path, auth);
    }
  },

  /**
   * 6. Submits a draft or resubmits a rejected listing for administrator review.
   * Performs rigorous validation on all required fields.
   */
  async submitForReview(
    propertyId: string,
    landlordId: string,
    completeData?: Partial<Property>
  ): Promise<void> {
    const path = `properties/${propertyId}`;
    const existing = await this.getPropertyById(propertyId);
    if (!existing) {
      throw new Error('Property not found');
    }
    if (existing.landlordId !== landlordId) {
      throw new Error('Forbidden: You do not own this property');
    }
    if (existing.status !== 'draft' && existing.status !== 'rejected') {
      throw new Error(`Cannot submit property with status: ${existing.status}`);
    }

    const merged = { ...existing, ...(completeData || {}) };

    // Validate required fields
    const validation = validatePropertyInput({
      titleBn: merged.titleBn,
      titleEn: merged.titleEn,
      monthlyRent: merged.monthlyRent,
      deposit: merged.deposit,
      serviceCharge: merged.serviceCharge,
      area: merged.area,
      neighbourhood: merged.neighbourhood,
      bedrooms: merged.bedrooms,
      bathrooms: merged.bathrooms,
      sizeSqFt: merged.sizeSqFt,
      descriptionBn: merged.descriptionBn,
      descriptionEn: merged.descriptionEn,
      imageUrls: merged.imageUrls,
      propertyType: merged.propertyType,
      furnishing: merged.furnishing,
      tenantEligibility: merged.tenantEligibility,
      availableFrom: merged.availableFrom,
    });

    if (!validation.isValid) {
      const errorMsg = Object.values(validation.errors).join(', ');
      throw new Error(`Validation failed: ${errorMsg}`);
    }

    if (!merged.availableFrom) {
      throw new Error('Validation failed: availableFrom date is required');
    }

    const {
      id: _id,
      landlordId: _lid,
      publishedAt: _pat,
      expiresAt: _eat,
      rejectionReason: _rr,
      privateAddress: privAddress,
      ...safeSubmissionData
    } = merged;

    try {
      const ref = doc(db, 'properties', propertyId);
      const now = new Date().toISOString();
      await updateDoc(ref, {
        ...safeSubmissionData,
        status: 'pending_review' as PropertyStatus,
        updatedAt: now,
      });

      if (privAddress !== undefined) {
        try {
          await setDoc(
            doc(db, 'propertyPrivate', propertyId),
            {
              propertyId,
              landlordId,
              privateAddress: privAddress.trim(),
              createdAt: existing.createdAt || now,
              updatedAt: now,
            },
            { merge: true }
          );
        } catch (privErr) {
          console.warn('Could not update propertyPrivate document on submit:', privErr);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path, auth);
    }
  },

  /**
   * 7. Loads properties awaiting review (for administrator queue).
   * Attaches confidential privateAddress for admin inspection.
   */
  async getPendingProperties(): Promise<Property[]> {
    try {
      const q = query(
        collection(db, 'properties'),
        where('status', '==', 'pending_review'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const items = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const propData = docSnap.data() as Omit<Property, 'id'>;
          let privateAddress = propData.privateAddress || '';
          try {
            const privSnap = await getDoc(doc(db, 'propertyPrivate', docSnap.id));
            if (privSnap.exists()) {
              privateAddress = privSnap.data().privateAddress || privateAddress;
            }
          } catch {
            // Admin fallback
          }
          return {
            id: docSnap.id,
            ...propData,
            privateAddress,
          };
        })
      );
      return items;
    } catch (err) {
      try {
        const fallbackQ = query(
          collection(db, 'properties'),
          where('status', '==', 'pending_review')
        );
        const snapshot = await getDocs(fallbackQ);
        const items = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const propData = docSnap.data() as Omit<Property, 'id'>;
            let privateAddress = propData.privateAddress || '';
            try {
              const privSnap = await getDoc(doc(db, 'propertyPrivate', docSnap.id));
              if (privSnap.exists()) {
                privateAddress = privSnap.data().privateAddress || privateAddress;
              }
            } catch {
              // Admin fallback
            }
            return {
              id: docSnap.id,
              ...propData,
              privateAddress,
            };
          })
        );
        return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      } catch (innerErr) {
        handleFirestoreError(innerErr, OperationType.LIST, 'properties', auth);
      }
    }
  },

  /**
   * 8. Protected administrator operation: Approve property.
   * Sets status to 'published', assigns publishedAt and 30-day expiresAt,
   * and records an immutable audit log.
   */
  async approveProperty(propertyId: string, adminId: string): Promise<void> {
    const path = `properties/${propertyId}`;
    const now = new Date();
    const publishedAt = now.toISOString();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const ref = doc(db, 'properties', propertyId);
      await updateDoc(ref, {
        status: 'published' as PropertyStatus,
        publishedAt,
        expiresAt,
        updatedAt: publishedAt,
      });

      // Immutable audit log recording
      await this.recordAuditLog({
        actorId: adminId,
        action: 'property_approved',
        targetType: 'property',
        targetId: propertyId,
        previousState: { status: 'pending_review' },
        newState: { status: 'published', publishedAt, expiresAt },
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path, auth);
    }
  },

  /**
   * 9. Protected administrator operation: Reject property with MANDATORY reason.
   */
  async rejectProperty(
    propertyId: string,
    adminId: string,
    rejectionReason: string
  ): Promise<void> {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new Error('Mandatory rejection reason must be provided');
    }

    const path = `properties/${propertyId}`;
    const now = new Date().toISOString();

    try {
      const ref = doc(db, 'properties', propertyId);
      await updateDoc(ref, {
        status: 'rejected' as PropertyStatus,
        rejectionReason: rejectionReason.trim(),
        updatedAt: now,
      });

      // Immutable audit log recording
      await this.recordAuditLog({
        actorId: adminId,
        action: 'property_rejected',
        targetType: 'property',
        targetId: propertyId,
        reason: rejectionReason.trim(),
        previousState: { status: 'pending_review' },
        newState: { status: 'rejected', rejectionReason: rejectionReason.trim() },
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path, auth);
    }
  },

  /**
   * 10. Audit logs reader for administrators.
   */
  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const q = query(collection(db, 'auditLogs'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AuditLog, 'id'>),
      }));
    } catch {
      // If composite index is building or client cannot write directly
      try {
        const snap = await getDocs(collection(db, 'auditLogs'));
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AuditLog, 'id'>),
        }));
        return items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      } catch {
        return [];
      }
    }
  },

  /**
   * Internal audit log dispatcher. Attempts server endpoint first to satisfy
   * immutable server-write rule (allow write: if false;).
   */
  async recordAuditLog(
    logData: Omit<AuditLog, 'id' | 'createdAt'>
  ): Promise<void> {
    const fullLog = {
      ...logData,
      createdAt: new Date().toISOString(),
    };

    try {
      // Attempt privileged server route if available
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        await fetch('/api/admin/audit-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fullLog),
        });
      }
    } catch (err) {
      // Server-side audit logging attempt handled gracefully in frontend
      console.warn('[AuditLog] Note on server audit log sync:', err);
    }
  },
};
