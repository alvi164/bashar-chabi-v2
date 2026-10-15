import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with the exact firestoreDatabaseId from configuration
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Local Emulator Support (Optional for local development / testing)
if (
  typeof window !== 'undefined' &&
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true'
) {
  try {
    const authHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
    const firestoreHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST || 'localhost:8080';
    const [fHost, fPort] = firestoreHost.split(':');
    connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });
    connectFirestoreEmulator(db, fHost, Number(fPort));
    console.info('[Firebase] Connected to local Emulators');
  } catch (err) {
    console.warn('[Firebase] Emulator connection warning:', err);
  }
}

// Validate Firestore connection on boot as mandated
async function testConnection() {
  if (typeof window === 'undefined') return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Firestore client is offline. Check network or configuration.');
    }
  }
}

testConnection();
