const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require('@firebase/rules-unit-testing');
const { ref, get, set } = require('firebase/database');

const projectId = 'demo-personnel-security';
const rules = fs.readFileSync(path.join(__dirname, '..', 'database.rules.json'), 'utf8');
const collections = ['employees', 'devices', 'departments', 'bonus', 'timeRecords'];

async function main() {
  const env = await initializeTestEnvironment({
    projectId,
    database: { rules, host: '127.0.0.1', port: 9000 },
  });

  try {
    const unauthenticated = env.unauthenticatedContext().database();
    const ordinaryUser = env.authenticatedContext('ordinary-user', { email: 'user@example.test' }).database();
    const admin = env.authenticatedContext('admin-user', { admin: true, email: 'admin@example.test' }).database();

    for (const collection of collections) {
      await assertFails(get(ref(unauthenticated, collection)));
      await assertFails(set(ref(unauthenticated, collection + '/security-test'), { test: true }));

      await assertFails(get(ref(ordinaryUser, collection)));
      await assertFails(set(ref(ordinaryUser, collection + '/security-test'), { test: true }));

      await assertSucceeds(set(ref(admin, collection + '/security-test'), { test: true }));
      await assertSucceeds(get(ref(admin, collection)));
      await assertSucceeds(set(ref(admin, collection + '/security-test'), null));
    }

    // The legacy plaintext-password collection must remain denied even to admins.
    await assertFails(get(ref(admin, 'login')));
    await assertFails(set(ref(admin, 'login/security-test'), { username: 'x', pass: 'x' }));
    console.log('PASS: unauthenticated and non-admin access denied; admin access allowed; legacy login denied.');
  } finally {
    await env.cleanup();
  }
}

main().catch((error) => {
  console.error('Realtime Database security rules test failed:', error);
  process.exitCode = 1;
});
