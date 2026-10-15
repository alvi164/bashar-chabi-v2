/**
 * Bashar Chabi - Secure Administrator Bootstrap Script
 *
 * Section 11 & Admin Authorization Fix Compliance:
 * Administrator authority must be granted and removed ONLY through Firebase
 * Admin SDK in a privileged server environment.
 *
 * Usage:
 *   npx tsx scripts/bootstrap_admin.ts [email_or_uid] [--revoke]
 *
 * Examples:
 *   npx tsx scripts/bootstrap_admin.ts syadalvi@gmail.com
 *   npx tsx scripts/bootstrap_admin.ts syadalvi@gmail.com --revoke
 *   npx tsx scripts/bootstrap_admin.ts some-uid --revoke
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Target live Firebase project for administrative authorization.
// Strictly decouples admin bootstrap from AI Studio applet configuration files.
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'bashar-chabi';

// Initialize Firebase Admin singleton targeting the live project
const app = !getApps().length
  ? initializeApp({
      projectId,
    })
  : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

async function runBootstrap() {
  const args = process.argv.slice(2);
  const isRevoke = args.includes('--revoke');
  const targetIdentifier =
    args.find((a) => !a.startsWith('--')) ||
    process.env.ADMIN_EMAIL ||
    'syadalvi@gmail.com';

  console.log('====================================================');
  console.log('BASHAR CHABI — SECURE ADMINISTRATOR BOOTSTRAP');
  console.log('====================================================');
  console.log(`Target Identifier: ${targetIdentifier}`);
  console.log(`Action:            ${isRevoke ? 'REVOKE admin claim' : 'GRANT admin claim'}`);
  console.log(`Project ID:        ${projectId}`);
  console.log('----------------------------------------------------');

  try {
    let user: UserRecord;
    if (targetIdentifier.includes('@')) {
      try {
        user = await auth.getUserByEmail(targetIdentifier);
      } catch {
        console.warn(`User with email ${targetIdentifier} not found in Auth. Creating account...`);
        user = await auth.createUser({
          email: targetIdentifier,
          emailVerified: true,
          displayName: 'Platform Administrator',
        });
        console.log(`Created new Firebase user record: ${user.uid}`);
      }
    } else {
      user = await auth.getUser(targetIdentifier);
    }

    const currentClaims = user.customClaims || {};
    const newClaims = {
      ...currentClaims,
      admin: !isRevoke,
    };

    // Set custom user claims in Firebase Auth (Server-side privileged operation)
    await auth.setCustomUserClaims(user.uid, newClaims);

    console.log(`✓ Successfully updated custom user claims for UID: ${user.uid}`);
    console.log(`  admin: ${!isRevoke}`);

    // Immutable audit logging via Admin SDK
    try {
      const now = new Date().toISOString();
      await db.collection('auditLogs').add({
        actorId: 'system_bootstrap_cli',
        action: isRevoke ? 'admin_claim_revoked' : 'admin_claim_granted',
        targetType: 'user',
        targetId: user.uid,
        reason: isRevoke ? 'Admin rights revoked via CLI' : 'Initial administrator bootstrap provision',
        previousState: { admin: !!currentClaims.admin },
        newState: { admin: !isRevoke },
        createdAt: now,
      });
      console.log('✓ Recorded privileged event in /auditLogs');
    } catch (auditErr) {
      console.warn('Note on audit log insertion:', (auditErr as Error).message);
    }

    console.log('----------------------------------------------------');
    console.log('VERIFICATION:');
    console.log(`The user "${targetIdentifier}" (UID: ${user.uid}) now possesses:`);
    console.log(`  request.auth.token.admin == ${!isRevoke}`);
    console.log('They can sign in and pass the security rule:');
    console.log('  function isAdmin() { return request.auth != null && request.auth.token.admin == true; }');
    console.log('====================================================');
  } catch (err: unknown) {
    console.error('Bootstrap error:', (err as Error).message);
    process.exit(1);
  }
}

runBootstrap();
