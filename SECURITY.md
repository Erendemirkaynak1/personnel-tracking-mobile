# Security Policy

## Supported versions

Security fixes are applied to the latest version on the default branch.

## Reporting a vulnerability

Please do not publish exploit details, credentials, employee records, or personal data in public issues.

Report suspected vulnerabilities privately through GitHub's **Report a vulnerability** feature in the repository's Security tab. Include:
- affected file, route, Firebase collection or dependency;
- impact and conditions required to reproduce;
- a minimal proof of concept with all tokens, passwords, personal data and production identifiers removed.

Do not test against production employee data or attempt unauthorized access to accounts or Firebase resources.

## Credential handling

- Never commit .env files, Firebase Admin SDK credentials, private signing keys, access tokens or production exports.
- Firebase client configuration values embedded in a mobile application are public identifiers, not authorization secrets. Restrict the corresponding API key and enforce Firebase Authentication, App Check and Realtime Database rules.
- If a real credential is exposed, revoke or rotate it immediately. Removing it from the latest commit does not remove it from Git history.
