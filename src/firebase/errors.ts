import { Auth } from 'firebase/auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  auth?: Auth
): never {
  const currentUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Maps Firebase Auth errors (from Email/Password and Google OAuth)
 * to clear, user-facing, localized bilingual messages.
 */
export function mapAuthError(err: unknown, language: 'bn' | 'en' = 'bn'): string {
  if (!err) return '';
  const msg = err instanceof Error ? err.message : String(err);

  if (
    msg.includes('operation-not-allowed') ||
    msg.includes('OPERATION_NOT_ALLOWED')
  ) {
    return language === 'bn'
      ? 'ইমেইল/পাসওয়ার্ড সাইন-ইন এই মুহূর্তে নিষ্ক্রিয় রয়েছে। অনুগ্রহ করে ফায়ারবেস কনসোলে Email/Password প্রোভাইডার সচল করুন অথবা গুগল দিয়ে সাইন-ইন করুন।'
      : 'Email/Password sign-in is disabled in Firebase Console. Please enable the Email/Password provider or use Google Sign-In.';
  }

  if (
    msg.includes('email-already-in-use') ||
    msg.includes('EMAIL_EXISTS')
  ) {
    return language === 'bn'
      ? 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।'
      : 'This email is already registered. Please sign in instead.';
  }

  if (
    msg.includes('user-not-found') ||
    msg.includes('wrong-password') ||
    msg.includes('invalid-credential') ||
    msg.includes('INVALID_LOGIN_CREDENTIALS')
  ) {
    return language === 'bn'
      ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।'
      : 'Invalid email or password.';
  }

  if (
    msg.includes('invalid-email') ||
    msg.includes('INVALID_EMAIL')
  ) {
    return language === 'bn'
      ? 'প্রদত্ত ইমেইল ঠিকানাটির ফরম্যাট সঠিক নয়।'
      : 'The provided email address format is invalid.';
  }

  if (
    msg.includes('weak-password') ||
    msg.includes('WEAK_PASSWORD')
  ) {
    return language === 'bn'
      ? 'পাসওয়ার্ড অত্যন্ত দুর্বল। কমপক্ষে ৬টি অক্ষর বা সংখ্যার মিশ্রণ ব্যবহার করুন।'
      : 'Password is too weak. Please use at least 6 characters.';
  }

  if (msg.includes('popup-closed-by-user')) {
    return language === 'bn'
      ? 'গুগল সাইন-ইন পপ-আপ উইন্ডোটি বন্ধ করা হয়েছে।'
      : 'Google sign-in popup window was closed before completion.';
  }

  if (msg.includes('popup-blocked')) {
    return language === 'bn'
      ? 'ব্রাউজার পপ-আপ উইন্ডোটি ব্লক করেছে। অনুগ্রহ করে ব্রাউজার সেটিংসে পপ-আপ অনুমোদন দিন।'
      : 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
  }

  if (msg.includes('unauthorized-domain')) {
    return language === 'bn'
      ? 'বর্তমান ডোমেইনটি ফায়ারবেস কনসোলে অনুমোদিত নয়। ফায়ারবেস অথেন্টিকেশন সেটিংসে Authorized Domains এ যুক্ত করুন।'
      : 'This domain is not authorized in Firebase Console settings (Authentication > Settings > Authorized domains).';
  }

  if (msg.includes('user-disabled')) {
    return language === 'bn'
      ? 'এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।'
      : 'This user account has been disabled.';
  }

  if (msg.includes('too-many-requests')) {
    return language === 'bn'
      ? 'অতিরিক্ত চেষ্টার কারণে সাময়িকভাবে ব্লক করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।'
      : 'Too many attempts. Access is temporarily disabled. Please try again later.';
  }

  if (msg.includes('network-request-failed')) {
    return language === 'bn'
      ? 'নেটওয়ার্ক সংযোগ ত্রুটি। আপনার ইন্টারনেট সংযোগ পরীক্ষা করে পুনরায় চেষ্টা করুন।'
      : 'Network request failed. Please check your internet connection and try again.';
  }

  // Friendly fallback preserving clean detail for transparent debugging
  const cleanDetail = msg.replace(/^FirebaseError:\s*/, '').replace(/^Firebase:\s*/, '');
  return language === 'bn'
    ? `সাইন-ইন সম্পন্ন করা যায়নি: ${cleanDetail}`
    : `Authentication error: ${cleanDetail}`;
}
