import { doc, getDoc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase/config.ts';
import { handleFirestoreError, OperationType } from '../firebase/errors.ts';
import { User, PrivateProfile } from '../types/index.ts';

export const userRepository = {
  /**
   * Fetches the public user profile from users/{uid}.
   */
  async getUserProfile(uid: string): Promise<User | null> {
    const path = `users/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (!snap.exists()) return null;
      return snap.data() as User;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path, auth);
    }
  },

  /**
   * Atomically creates both user profile and isolated private profile.
   */
  async createUserProfile(user: User, privateProfile: PrivateProfile): Promise<void> {
    const batch = writeBatch(db);
    const userRef = doc(db, 'users', user.uid);
    const privateRef = doc(db, 'privateProfiles', user.uid);

    batch.set(userRef, user);
    batch.set(privateRef, privateProfile);

    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`, auth);
    }
  },

  /**
   * Updates permitted fields of user profile.
   */
  async updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    const path = `users/${uid}`;
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path, auth);
    }
  },

  /**
   * Fetches the private profile for the authenticated user.
   */
  async getPrivateProfile(uid: string): Promise<PrivateProfile | null> {
    const path = `privateProfiles/${uid}`;
    try {
      const snap = await getDoc(doc(db, 'privateProfiles', uid));
      if (!snap.exists()) return null;
      return snap.data() as PrivateProfile;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path, auth);
    }
  },

  /**
   * Updates private contact preferences.
   */
  async updatePrivateProfile(uid: string, data: Partial<PrivateProfile>): Promise<void> {
    const path = `privateProfiles/${uid}`;
    try {
      const ref = doc(db, 'privateProfiles', uid);
      await updateDoc(ref, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path, auth);
    }
  },
};
