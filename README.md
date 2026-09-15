# TaskPay

TaskPay is a human-task and rewards marketplace connecting businesses that need verified human work with workers who earn by completing legitimate tasks.

## Initial Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Bits
- PostgreSQL
- Prisma
- Redis
- Auth.js-style session architecture
- Docker
- GitHub Actions

## Current Build Status

The repository now contains the first working product foundations:

- Worker authentication and protected routes
- Worker dashboard and React Bits-powered interaction layer
- Earn marketplace and task acceptance/submission APIs
- Worker levels and task history
- Ledger-backed wallet views
- Business dashboard shell
- Campaign list and campaign-builder foundation
- Prisma domain schema for users, sessions, campaigns, tasks, submissions, ledger entries and withdrawal requests

## Product Roadmap

The detailed product and engineering roadmap is available in [`docs/ROADMAP.md`](docs/ROADMAP.md).

The project is organized into six major milestones:

1. Foundation — product rules, engineering setup, design system, authentication.
2. Worker MVP — dashboard, levels, marketplace, Watch & Earn, surveys, wallet, withdrawals.
3. Business Platform — advertiser dashboard, campaign builder, billing.
4. Growth & Safety — referrals, trust score, anti-fraud, admin, notifications.
5. Higher-Value Work — AI tasks, testing marketplace, analytics.
6. Scale & Launch — PWA/mobile, international expansion, security hardening, infrastructure, CI/CD, beta and public launch.

## Core Product Rule

Businesses fund task rewards. Worker subscriptions may provide legitimate platform benefits, but must never be used as promised returns for other workers.
