# TaskPay Security Model

## Security goals

Protect user identities, campaign funds, worker rewards, business data and the integrity of task completion.

## Identity and access

- Role-based access control for WORKER, BUSINESS, ADMIN and SUPER_ADMIN.
- Strong session management and secure cookies.
- Email verification for normal accounts; stronger verification for payouts and sensitive operations.
- MFA required for admins before production launch.
- Authorization checks must occur server-side for every protected action.

## Application security

- Strict input validation using shared schemas.
- CSRF protection for state-changing browser flows.
- XSS-safe rendering and CSP/security headers.
- ORM parameterization and least-privilege database credentials.
- Rate limits on authentication, task acceptance, submissions and payment endpoints.
- Secrets stored outside source control.

## Financial security

- Ledger-first accounting.
- Idempotency for reward, funding and withdrawal operations.
- No direct balance edits; all changes use auditable entries.
- High-value withdrawals and manual adjustments require stronger controls.
- Provider webhook signatures must be verified.

## Marketplace fraud controls

Signals may include duplicate accounts, device reuse, IP risk, impossible completion speeds, repeated response patterns, automation, suspicious referrals, unusual withdrawal behavior and campaign-specific anomalies.

Risk outcomes: ALLOW, REVIEW, LIMIT, SUSPEND or BLOCK. High-risk decisions should preserve evidence and reasoning for admin review.

## Data protection

- Collect only data needed for product, compliance and risk purposes.
- Encrypt transport with TLS and protect sensitive fields at rest where appropriate.
- Separate public profile data from identity/KYC data.
- Apply retention/deletion policies and access logging for sensitive records.

## Operational security

- Automated dependency and code checks in CI.
- Production changes through reviewed pull requests and controlled deployments.
- Database backups, recovery tests and incident procedures before public launch.
- Security review and penetration testing before handling significant funds.
