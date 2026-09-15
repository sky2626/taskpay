# TaskPay

TaskPay is a human-task and rewards marketplace connecting businesses that need verified human work with workers who earn by completing legitimate tasks.

## Current implementation

The current `main` and `develop` branches include:

- Next.js + React + TypeScript
- Tailwind CSS
- React Bits registry and in-repo interactive components
- Worker registration, login, sessions and protected routes
- Worker dashboard, Earn marketplace, levels, surveys and task history
- Ledger-backed wallet balances
- Task acceptance and submission APIs
- Business dashboard and campaign builder
- PostgreSQL-backed campaign drafts
- Survey question configuration and worker survey execution
- Business submission review queue
- Idempotent reward credits when submitted work is approved
- Prisma/PostgreSQL data model
- Redis/PostgreSQL Docker services
- Dockerfile
- GitHub Actions CI

## Deployment

Vercel should deploy from the latest commit on `main`. When troubleshooting a failed deployment, create or use a fresh deployment from the newest Git commit rather than redeploying an older deployment snapshot.

## Product direction

TaskPay follows a business-funded work model: businesses fund real campaigns and workers earn from completed, approved work. Optional membership features must not represent guaranteed investment returns or use new member fees to fund existing worker earnings.

## Planned stack

- Next.js
- TypeScript
- Tailwind CSS
- React Bits
- PostgreSQL
- Prisma
- Redis
- Docker
- GitHub Actions

## Development workflow

- `main` is the stable release branch.
- `develop` is the integration branch.
- Feature work is developed on feature/phase branches and merged through pull requests.

See `docs/ROADMAP.md` for the full phased development plan.
