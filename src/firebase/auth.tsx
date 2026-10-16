import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config.ts';
import { userRepository } from '../repositories/userRepository.ts';
import { User, PrivateProfile, NormalUserRole } from '../types/index.ts';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  privateProfile: PrivateProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    role: NormalUserRole,
    area: string
  ) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (role: NormalUserRole, area: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [privateProfile, setPrivateProfile] = useState<PrivateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserData = async (fUser: FirebaseUser, forceRefresh = false) => {
    try {
      // Check custom claims for server-authorized administrator status
      const tokenResult = await fUser.getIdTokenResult(forceRefresh);
      setIsAdmin(!!tokenResult.claims.admin);

      const profile = await userRepository.getUserProfile(fUser.uid);
      setUserProfile(profile);

      if (profile) {
        const priv = await userRepository.getPrivateProfile(fUser.uid);
        setPrivateProfile(priv);
      }
    } catch (err) {
      console.error('[Auth] Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setCurrentUser(fUser);
      if (fUser) {
        await fetchUserData(fUser);
      } else {
        setUserProfile(null);
        setPrivateProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchUserData(currentUser, true);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const fUser = result.user;

    // Check if user profile already exists
    const existing = await userRepository.getUserProfile(fUser.uid);
    if (!existing) {
      // Create initial profile defaulting to tenant until onboarding confirms
      const now = new Date().toISOString();
      const newUser: User = {
        uid: fUser.uid,
        displayName: fUser.displayName || 'User',
        photoURL: fUser.photoURL || undefined,
        selectedRole: 'tenant',
        area: 'Mirpur',
        language: 'bn',
        status: 'active',
        onboardingComplete: false,
        createdAt: now,
        updatedAt: now,
      };

      const newPrivate: PrivateProfile = {
        uid: fUser.uid,
        phone: fUser.phoneNumber || '',
        contactPreference: 'phone',
        consentVersion: 'v1.0-mvp',
        consentedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      await userRepository.createUserProfile(newUser, newPrivate);
      setUserProfile(newUser);
      setPrivateProfile(newPrivate);
    } else {
      setUserProfile(existing);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    await fetchUserData(cred.user);
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    role: NormalUserRole,
    area: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanDisplayName = displayName.trim() || 'User';
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    const fUser = cred.user;

    await updateProfile(fUser, { displayName: cleanDisplayName });

    const now = new Date().toISOString();
    const newUser: User = {
      uid: fUser.uid,
      displayName: cleanDisplayName,
      selectedRole: role,
      area,
      language: 'bn',
      status: 'active',
      onboardingComplete: true,
      createdAt: now,
      updatedAt: now,
    };

    const newPrivate: PrivateProfile = {
      uid: fUser.uid,
      phone: '',
      contactPreference: 'phone',
      consentVersion: 'v1.0-mvp',
      consentedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await userRepository.createUserProfile(newUser, newPrivate);
    setUserProfile(newUser);
    setPrivateProfile(newPrivate);
  };

  const completeOnboarding = async (role: NormalUserRole, area: string) => {
    if (!currentUser) throw new Error('Not authenticated');

    await userRepository.updateUserProfile(currentUser.uid, {
      selectedRole: role,
      area,
      onboardingComplete: true,
    });

    await refreshProfile();
  };

  const sendPasswordReset = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, cleanEmail);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
    setPrivateProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        privateProfile,
        loading,
        isAdmin,
        signInWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        signOut,
        completeOnboarding,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
