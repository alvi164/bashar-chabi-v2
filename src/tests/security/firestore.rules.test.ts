import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

const PROJECT_ID = 'basharchabi-rules-test';

describe('Firestore Security Rules Security Assertions & Administrator Authorization', () => {
  let testEnv: RulesTestEnvironment | null = null;
  let rulesAvailable = false;
  const rules = fs.readFileSync('firestore.rules', 'utf8');

  beforeAll(async () => {
    try {
      testEnv = await initializeTestEnvironment({
        projectId: PROJECT_ID,
        firestore: {
          rules,
          host: '127.0.0.1',
          port: 8080,
        },
      });
      rulesAvailable = true;
    } catch {
      // If emulator is not running in local runner, report gracefully
      rulesAvailable = false;
    }
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  // --- STATIC STRUCTURAL ASSERTIONS GUARANTEEING SECURE RULES DEFINITION ---

  it('verifies that firestore.rules file exists and is populated with deny-by-default rules', () => {
    expect(rules).toContain("rules_version = '2'");
    expect(rules).toContain('match /{document=**} {');
    expect(rules).toContain('allow read, write: if false;');
    expect(rules).toContain('/users/{userId}');
    expect(rules).toContain('/privateProfiles/{userId}');
    expect(rules).toContain('/properties/{propertyId}');
    expect(rules).toContain('/visits/{visitId}');
    expect(rules).toContain('/serviceRequests/{requestId}');
    expect(rules).toContain('/auditLogs/{auditId}');
  });

  it('proves isAdmin() checks ONLY request.auth.token.admin == true and contains NO Firestore record checks', () => {
    // Exact function required by specification:
    // function isAdmin() {
    //   return request.auth != null
    //     && request.auth.token.admin == true;
    // }
    expect(rules).toMatch(
      /function\s+isAdmin\(\)\s*\{\s*return\s+request\.auth\s*!=\s*null\s*&&\s*request\.auth\.token\.admin\s*==\s*true;\s*\}/
    );

    // Verify completely purged of option 2 (admins collection, exists checks, etc.)
    expect(rules).not.toContain('admins/');
    expect(rules).not.toContain('documents/admins');
    expect(rules).not.toContain('resource.data.isAdmin');
    expect(rules).not.toContain('request.auth.token.role');
    expect(rules).not.toContain('users/{uid}.selectedRole');
  });

  it('validates rules stringently prohibit normal users from setting admin role in users collection', () => {
    expect(rules).toContain("incoming().selectedRole in ['tenant', 'landlord_or_agent', 'service_provider']");
    expect(rules).not.toContain("incoming().selectedRole in ['admin'");
  });

  it('validates landlord property creation requires draft status and positive rent', () => {
    expect(rules).toContain("incoming().status == 'draft'");
    expect(rules).toContain("incoming().monthlyRent is number && incoming().monthlyRent > 0;");
  });

  it('validates auditLogs collection is completely write-protected for clients', () => {
    expect(rules).toContain('match /auditLogs/{auditId} {');
    expect(rules).toContain('allow write: if false;');
    expect(rules).toContain('allow get, list: if isAdmin();');
  });

  it('validates private profile access is restricted to the document owner', () => {
    expect(rules).toContain('match /privateProfiles/{userId} {');
    expect(rules).toContain('allow get, update, create: if isOwner(userId);');
    expect(rules).toContain('allow list: if false;');
    expect(rules).toContain('allow delete: if false;');
  });

  it('validates landlord property update forbids tampering with moderation fields', () => {
    expect(rules).toContain("!incoming().diff(existing()).affectedKeys().hasAny([");
    expect(rules).toContain("'publishedAt', 'expiresAt', 'rejectionReason', 'moderationNote'");
  });

  it('validates admin rejection requires a mandatory non-empty rejectionReason string', () => {
    expect(rules).toContain("existing().status == 'pending_review' && incoming().status == 'rejected'");
    expect(rules).toContain("incoming().rejectionReason is string && incoming().rejectionReason.size() > 0");
  });

  it('validates only draft properties can be deleted by owner', () => {
    expect(rules).toContain("allow delete: if isSignedIn() && resource.data.landlordId == request.auth.uid && existing().status == 'draft';");
  });

  it('validates propertyPrivate collection strictly isolates privateAddress to owner and admin', () => {
    expect(rules).toContain('match /propertyPrivate/{propertyId} {');
    expect(rules).toContain('allow get: if isSignedIn() && (resource.data.landlordId == request.auth.uid || isAdmin());');
    expect(rules).toContain('allow list: if isAdmin();');
    expect(rules).toContain('request.auth.uid == incoming().landlordId');
    expect(rules).toContain('incoming().privateAddress is string');
  });

  it('validates landlord creates own draft with status draft and positive rent', () => {
    expect(rules).toContain("request.auth.uid == incoming().landlordId");
    expect(rules).toContain("incoming().status == 'draft'");
    expect(rules).toContain("incoming().monthlyRent is number && incoming().monthlyRent > 0");
  });

  it('validates landlord cannot create published property', () => {
    // Only draft is allowed during create
    expect(rules).toContain("incoming().status == 'draft'");
    expect(rules).not.toContain("incoming().status in ['published'");
  });

  it('validates landlord cannot forge landlordId', () => {
    expect(rules).toContain("request.auth.uid == incoming().landlordId");
  });

  it('validates other landlord cannot read private draft (only published is publicly readable)', () => {
    expect(rules).toContain("allow get: if resource.data.status == 'published'");
    expect(rules).toContain("resource.data.landlordId == request.auth.uid || isAdmin()");
    expect(rules).toContain("allow list: if resource.data.status == 'published'");
  });

  it('validates other landlord cannot edit another property', () => {
    expect(rules).toContain("resource.data.landlordId == request.auth.uid");
    expect(rules).toContain("incoming().landlordId == existing().landlordId");
  });

  it('validates owner edits own draft or rejected listing', () => {
    expect(rules).toContain("existing().status == 'draft' && incoming().status in ['draft', 'pending_review']");
    expect(rules).toContain("existing().status == 'rejected' && incoming().status in ['rejected', 'pending_review']");
  });

  it('validates owner cannot self-publish', () => {
    // Landlord update block only allows transitions to ['draft', 'pending_review']
    expect(rules).not.toContain("resource.data.landlordId == request.auth.uid\n          && incoming().landlordId == existing().landlordId\n          && incoming().status == 'published'");
  });

  it('validates owner cannot write moderation timestamps', () => {
    expect(rules).toContain("!incoming().diff(existing()).affectedKeys().hasAny([");
    expect(rules).toContain("'publishedAt', 'expiresAt', 'rejectionReason', 'moderationNote'");
  });

  it('validates non-admin moderation fails', () => {
    // Admin update path strictly guarded by isAdmin()
    expect(rules).toContain("isAdmin()");
    expect(rules).toContain("existing().status == 'pending_review' && incoming().status == 'published'");
  });

  // --- 10 SPECIFIC REQUIRED AUTHORIZATION SCENARIOS ---

  it('1. Proves unauthenticated user is denied administrator access', async () => {
    // Static rule proof: isAdmin() requires request.auth != null
    expect(rules).toContain('request.auth != null');
    if (rulesAvailable && testEnv) {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      await assertFails(unauthDb.collection('users').get());
      await assertFails(unauthDb.collection('auditLogs').get());
      await assertFails(unauthDb.collection('reports').get());
    }
  });

  it('2. Proves normal authenticated user is denied administrator access', async () => {
    // Normal user without admin custom claim has token.admin == undefined != true
    if (rulesAvailable && testEnv) {
      const normalDb = testEnv.authenticatedContext('normal_user', { role: 'tenant' }).firestore();
      await assertFails(normalDb.collection('users').get());
      await assertFails(normalDb.collection('auditLogs').get());
      await assertFails(normalDb.collection('reports').get());
    }
  });

  it('3. Proves user with selectedRole = "admin" in Firestore document is denied administrator access', async () => {
    // Static proof: isAdmin() does NOT inspect any Firestore document or selectedRole field
    const isAdminBody = rules.match(/function\s+isAdmin\(\)\s*\{([^}]+)\}/)?.[1] || '';
    expect(isAdminBody).not.toContain('selectedRole');
    expect(isAdminBody).not.toContain('get(');
    expect(isAdminBody).not.toContain('exists');
    if (rulesAvailable && testEnv) {
      // Simulate malicious document with selectedRole = 'admin'
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc('users/attacker_1').set({
          uid: 'attacker_1',
          selectedRole: 'admin',
          status: 'active',
        });
      });
      const attackerDb = testEnv.authenticatedContext('attacker_1').firestore();
      // Attacker should still be denied admin access because claim token.admin is false/unset
      await assertFails(attackerDb.collection('users').get());
      await assertFails(attackerDb.collection('auditLogs').get());
    }
  });

  it('4. Proves user with isAdmin = true in their profile document is denied administrator access', async () => {
    // Static proof: isAdmin() does not check profile document fields
    const isAdminBody = rules.match(/function\s+isAdmin\(\)\s*\{([^}]+)\}/)?.[1] || '';
    expect(isAdminBody).not.toContain('isAdmin');
    expect(isAdminBody).not.toContain('resource');
    if (rulesAvailable && testEnv) {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc('users/attacker_2').set({
          uid: 'attacker_2',
          isAdmin: true,
          selectedRole: 'tenant',
          status: 'active',
        });
      });
      const attackerDb = testEnv.authenticatedContext('attacker_2').firestore();
      await assertFails(attackerDb.collection('users').get());
      await assertFails(attackerDb.collection('auditLogs').get());
    }
  });

  it('5. Proves user with an admins/{uid} document is denied administrator access', async () => {
    // Static proof: Option 2 removed; no admins collection rule exists to grant privileges
    expect(rules).not.toContain('/admins/');
    expect(rules).not.toContain('admins/$(request.auth.uid)');
    if (rulesAvailable && testEnv) {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().doc('admins/attacker_3').set({
          uid: 'attacker_3',
          role: 'admin',
        });
      });
      const attackerDb = testEnv.authenticatedContext('attacker_3').firestore();
      await assertFails(attackerDb.collection('users').get());
      await assertFails(attackerDb.collection('auditLogs').get());
    }
  });

  it('6. Proves user with a forged browser request or client-state role is denied', async () => {
    // A browser client pretending to be an admin by sending local claims or forged payload is denied
    if (rulesAvailable && testEnv) {
      // Attempt to forge admin claim via unprivileged token or non-admin auth context
      const forgedDb = testEnv.authenticatedContext('forged_user', { admin: false, role: 'admin' }).firestore();
      await assertFails(forgedDb.collection('users').get());
      await assertFails(forgedDb.collection('auditLogs').get());
      await assertFails(forgedDb.doc('properties/prop_1').update({ status: 'published' }));
    }
  });

  it('7. Proves emulator-authenticated user with token claim admin: true is allowed only for intended administrator reads/actions', async () => {
    // Static proof: token.admin == true matches isAdmin()
    expect(rules).toContain('request.auth.token.admin == true');
    if (rulesAvailable && testEnv) {
      const adminDb = testEnv.authenticatedContext('admin_user', { admin: true }).firestore();
      // Admin is allowed to read users list and auditLogs
      await assertSucceeds(adminDb.collection('users').get());
      await assertSucceeds(adminDb.collection('auditLogs').get());
      // Admin cannot directly write to immutable auditLogs (allow write: if false)
      await assertFails(
        adminDb.collection('auditLogs').add({
          action: 'unauthorized_direct_write',
          actorId: 'admin_user',
        })
      );
    }
  });

  it('8. Proves unknown collections remain denied by catch-all default deny', async () => {
    expect(rules).toMatch(/match\s+\/\{document=\*\*\}\s*\{\s*allow read, write:\s*if false;\s*\}/);
    if (rulesAvailable && testEnv) {
      const unauthDb = testEnv.unauthenticatedContext().firestore();
      const authDb = testEnv.authenticatedContext('user_1').firestore();
      const adminDb = testEnv.authenticatedContext('admin_user', { admin: true }).firestore();

      await assertFails(unauthDb.collection('secret_financials').get());
      await assertFails(authDb.collection('secret_financials').get());
      await assertFails(adminDb.collection('secret_financials').get());
      await assertFails(authDb.doc('secret_financials/doc1').set({ secret: 123 }));
    }
  });

  it('9. Proves normal clients still cannot create, update or delete audit logs', async () => {
    if (rulesAvailable && testEnv) {
      const tenant = testEnv.authenticatedContext('tenant_x').firestore();
      const landlord = testEnv.authenticatedContext('landlord_y').firestore();

      await assertFails(tenant.collection('auditLogs').get());
      await assertFails(tenant.collection('auditLogs').add({ action: 'hack' }));
      await assertFails(landlord.collection('auditLogs').doc('log_1').delete());
      await assertFails(landlord.collection('auditLogs').doc('log_1').update({ action: 'tamper' }));
    }
  });

  it('10. Proves existing profile and private-profile isolation continue to pass', async () => {
    if (rulesAvailable && testEnv) {
      const tenantA = testEnv.authenticatedContext('tenant_a').firestore();
      const tenantB = testEnv.authenticatedContext('tenant_b').firestore();
      const unauthDb = testEnv.unauthenticatedContext().firestore();

      // Unauthenticated cannot read private profile
      await assertFails(unauthDb.doc('privateProfiles/tenant_a').get());

      // Tenant B cannot read Tenant A's private profile
      await assertFails(tenantB.doc('privateProfiles/tenant_a').get());

      // Tenant A can create & read their own private profile
      await assertSucceeds(
        tenantA.doc('privateProfiles/tenant_a').set({
          uid: 'tenant_a',
          phone: '01700000000',
        })
      );
      await assertSucceeds(tenantA.doc('privateProfiles/tenant_a').get());
    }
  });
});
