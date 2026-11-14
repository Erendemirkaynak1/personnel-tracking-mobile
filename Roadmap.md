# Security Hardening Roadmap

**Repository:** Erendemirkaynak1/personnel-tracking-mobile  
**Application directory:** Personel takip projes/  
**Working branch:** security/hardening  
**Release policy:** Keep the repository private until every Public Release Gate below is verified.

This roadmap distinguishes code changes committed to this branch from Firebase Console / account-owner actions that cannot be completed safely through repository file edits alone.

## Security findings from the initial review

| Finding | Risk | Evidence / impact | Status |
|---|---|---|---|
| Client-side password check against Realtime Database login node | Critical | The old loginUser read the entire node and compared loginData.pass directly with the supplied password. | Fixed in app code; legacy data cleanup pending |
| No verified authorization boundary on database operations | Critical | App directly reads and writes employee, device, department, bonus and time-record collections. Live deployed rules were not accessible during repository review. | Fail-closed rules authored; deployment and live verification pending |
| No route-level authentication guard | High | Non-login screens could be opened directly without an app-level session check. | Fixed in app code; runtime tests pending |
| Firebase client configuration committed | Informational by itself | Firebase Web API keys and app identifiers are client configuration, not Admin SDK credentials. Abuse risk depends on API restrictions, Authentication and database rules. | Documented; Google Cloud restrictions pending |
| .env and credential ignore coverage incomplete | Medium | Standard .env, Firebase Admin credential files and some local signing material were not excluded. | Fixed in .gitignore |
| Duplicate placeholder Firebase module | Low | Unused services/firebase.ts contained template-only credentials and could cause configuration confusion. | Removal pending verification |
| Git history contains Firebase client configuration | Informational by itself | Initial upload commit includes the same Firebase client config. No service-account private key, GitHub PAT or OAuth client secret was identified in the reviewed commit diffs. | Reviewed; history rewrite not indicated for this public client config |

## Work completed on security/hardening

- [x] Created isolated security/hardening branch; main was not changed.
- [x] Replaced the Realtime Database password lookup with Firebase Authentication email/password sign-in.
- [x] Require the trusted Firebase custom claim admin: true before accepting a management-app session.
- [x] Added React Native Firebase Auth persistence using the already-installed AsyncStorage dependency.
- [x] Added a route guard for every non-login route in the tabs navigator.
- [x] Removed password-bearing user-data return behavior from the login flow.
- [x] Updated login UI to request an email address rather than a username.
- [x] Added fail-closed Realtime Database rules: all application data collections require an authenticated user with the trusted admin custom claim; the legacy login node is denied.
- [x] Added Firebase CLI configuration pointing to the rules file.
- [x] Expanded .gitignore coverage for environment files, Firebase Admin credentials, signing keys and local Firebase state.

## Remaining implementation and verification plan

### Phase 1 — Firebase identity and admin provisioning (blocking)

- [ ] In Firebase Console, enable Authentication → Email/Password.
- [ ] Create or migrate administrator accounts into Firebase Authentication. Existing usernames/passwords stored under Realtime Database login do not automatically become Firebase Authentication accounts.
- [ ] Assign the custom claim admin: true only from a trusted server/Admin SDK environment. Never set custom claims from the mobile app.
- [ ] Store any Admin SDK service-account key outside the repository (secret manager or protected local environment); never commit it.
- [ ] Verify an ordinary authenticated user without the admin claim is rejected by the app and database rules.
- [ ] Plan a controlled password reset for existing users; do not copy plaintext legacy passwords into Firebase Authentication.

### Phase 2 — Deploy and verify database rules (blocking)

- [ ] Back up the current Realtime Database before changing production rules.
- [ ] Review the current live rules in Firebase Console and confirm whether unauthenticated reads/writes are currently possible.
- [ ] Review existing data shape and all collections used by the app. Current code references employees, devices, departments, bonus, timeRecords and legacy login.
- [ ] Confirm that the single-admin access model is intended. If multiple roles are needed, design explicit role claims and per-collection permissions before relaxing these rules.
- [ ] From the application directory, deploy with: firebase deploy --only database --project personeltakip-60760.
- [ ] Test unauthenticated read and write attempts against every collection; all must be denied.
- [ ] Test authenticated non-admin read and write attempts; all must be denied.
- [ ] Test admin read and write attempts; only intended operations must succeed.
- [ ] Confirm the legacy login node cannot be read or written. After backup and a data-owner decision, remove the legacy node and any plaintext passwords from the live database.

**Important:** The rules file in Git does not protect the live database until deployment succeeds. Do not make the repository public before live rule tests pass.

### Phase 3 — Application security and correctness

- [ ] Install dependencies from the lockfile and run Expo lint / TypeScript checks.
- [ ] Confirm the installed Firebase SDK exports getReactNativePersistence in the configured React Native build environment.
- [ ] Test sign-in, token refresh, app restart persistence, sign-out, expired sessions and offline behavior on Android and iOS.
- [ ] Test direct navigation/deep links to every protected screen while signed out.
- [ ] Add an explicit sign-out control and verify it clears the Firebase Auth session.
- [ ] Review all direct Realtime Database calls and ensure none bypass the same admin-only authorization model.
- [ ] Add automated tests for login failures, non-admin rejection and protected route behavior.
- [ ] Avoid logging credentials, ID tokens, personal employee data or complete Firebase records.

### Phase 4 — Firebase and Google Cloud hardening

- [ ] Restrict the Firebase API key to the actual Android application identifier and signing certificate fingerprints; add iOS bundle restrictions when an iOS bundle ID is configured.
- [ ] Restrict the key to only the APIs the app needs. Verify restrictions do not break Firebase Authentication or Realtime Database.
- [ ] Configure Firebase App Check for supported platforms and enforce it for Realtime Database after monitoring legitimate traffic.
- [ ] Enable appropriate Authentication password policy, email enumeration protection and abuse protections.
- [ ] Review Authentication authorized domains and provider settings.
- [ ] Review Storage rules and Cloud Storage access if the project uses Firebase Storage.
- [ ] Enable billing alerts / usage monitoring and review Firebase/Google Cloud audit logs.

### Phase 5 — Repository and supply-chain checks

- [ ] Scan the complete current tree and all Git history with a secret scanner (for example Gitleaks) before public release.
- [ ] Scan dependencies for known vulnerabilities; update unsupported or vulnerable packages and regenerate the lockfile.
- [ ] Confirm no .env, service-account JSON, private signing key, keystore, certificate or local build artifact is tracked.
- [ ] Confirm no real employee personal data, database exports, screenshots, backups or production logs are committed.
- [ ] If a true secret is ever found in Git history: revoke/rotate it first, then rewrite history with a coordinated force-push plan and invalidate affected caches/forks where possible. Deleting the file in a later commit is not sufficient.
- [ ] Add CI checks for secret scanning, dependency auditing, linting and tests on every pull request.
- [ ] Protect main with pull-request review and passing checks; restrict force pushes and deletion.

## Public Release Gate — all required

- [ ] Firebase Authentication is enabled and administrator accounts are provisioned.
- [ ] Admin custom claims are assigned through a trusted environment only.
- [ ] Live Realtime Database rules match the reviewed rules file and pass unauthenticated / non-admin denial tests.
- [ ] The legacy plaintext login data is backed up, inaccessible, and removed when safe.
- [ ] Android/iOS builds pass authentication, route-guard and database integration tests.
- [ ] Full repository and Git-history secret scans report no active secrets.
- [ ] Dependency and static checks pass with no unresolved critical/high findings.
- [ ] No real personal or production data is present in the repository.
- [ ] Firebase API key restrictions and App Check are configured and verified.
- [ ] Repository README and configuration documentation contain no credentials and explain safe local setup.

## Current release decision

**NOT READY FOR PUBLIC RELEASE.**

Code-level authentication and authorization hardening has been committed to the isolated branch, but the live Firebase rules, administrator provisioning, production data migration, platform testing, API-key restrictions and full history/dependency scans still require verification. Keep the repository private until every release gate is checked.
