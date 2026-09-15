# TaskPay Architecture

## Current approach

TaskPay starts as a modular Next.js application rather than premature microservices. Domain boundaries are kept explicit so services can be extracted later if scale requires it.

## Primary modules

- Identity and access
- Worker profile and levels
- Business profile and campaigns
- Task marketplace and submissions
- Wallet and ledger
- Withdrawals and payments
- Trust and fraud
- Notifications
- Administration and audit

## Application layers

### UI
Next.js App Router, React, TypeScript, Tailwind CSS and React Bits-inspired interactive components. Financial and security-critical flows should prioritize clarity over animation.

### Application/domain
Server-side services encapsulate business rules. UI components should not perform financial calculations or authorization decisions.

### Data
PostgreSQL with Prisma. Redis is reserved for caching, rate limits, short-lived state and queues as those features are introduced.

### Infrastructure
Docker for reproducible local/production builds and GitHub Actions for quality gates.

## Intended route structure

```text
app/
  (public)/
  (auth)/
  worker/
  business/
  admin/
  api/
components/
  ui/
  react-bits/
  dashboard/
  tasks/
  wallet/
  campaigns/
lib/
services/
prisma/
docs/
```

## Financial boundary

All money-changing operations must flow through a dedicated financial service and ledger rules. UI/API callers request an operation; they never directly mutate balances.

## Scaling path

When operational load justifies it, background processing, notifications, analytics and selected payment/task functions can move into independent workers/services without changing the core domain contracts.
