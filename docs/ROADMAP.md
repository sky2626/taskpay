# TaskPay Product & Engineering Roadmap

TaskPay is a human-task and rewards marketplace connecting businesses that need verified human work with workers who earn by completing legitimate tasks. The platform must be designed so that businesses fund task rewards, while worker subscriptions only provide legitimate platform benefits such as lower fees, priority access, training, analytics, or eligibility for higher-skill work.

## Guiding Product Principles

- Businesses fund task rewards; worker subscription payments must never be used to promise returns to other workers.
- Every task must show the reward before acceptance.
- Financial records must be auditable through a transaction ledger.
- Fraud prevention, identity controls, and trust scoring are part of the product from the beginning.
- Ghana is the initial launch market, but the architecture should support multiple countries and currencies later.
- Start as a modular monolith. Split into services only when scale makes that necessary.
- React Bits is the preferred interaction/animation layer for the UI, while financial and security-critical screens remain simple and predictable.

---

# Milestone 1 — Foundation

## Phase 0 — Product Definition & Business Rules

Define and document the rules before implementing money-related flows.

### Scope

- Worker roles and account states
- Business roles and account states
- Admin roles and permissions
- Task categories
- Worker levels
- Subscription benefits and restrictions
- Wallet rules
- Withdrawal rules
- Referral rules
- Trust score model
- Fraud rules
- Campaign funding rules
- Platform commission rules
- Task approval/rejection flow
- Dispute process
- Currency and country model
- Compliance assumptions and legal review checklist

### Deliverables

- `docs/product-spec.md`
- `docs/business-rules.md`
- `docs/task-lifecycle.md`
- `docs/wallet-rules.md`
- `docs/security-model.md`

---

## Phase 1 — Engineering Foundation

### Core Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Bits
- PostgreSQL
- Prisma ORM
- Redis
- Auth.js
- Docker / Docker Compose
- GitHub Actions

### Planned Application Structure

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
hooks/
prisma/
types/
utils/
docs/
tests/
docker/
```

### Engineering Standards

- TypeScript strict mode
- ESLint
- Prettier
- Environment validation
- Standard API responses
- Centralized error handling
- Input validation
- Application logging
- Rate-limiting foundation
- Reusable UI components
- Unit and integration tests

### Git Workflow

- `main` — stable production branch
- `develop` — integration branch
- feature branches such as:
  - `feature/auth`
  - `feature/worker-dashboard`
  - `feature/tasks`
  - `feature/wallet`
  - `feature/business-dashboard`

Feature work should merge through pull requests.

---

## Phase 2 — Design System & React Bits UI

Create a consistent visual system before building many pages.

### Design System

- Typography
- Spacing scale
- Card styles
- Border radii
- Shadows
- Icons
- Gradients
- Light mode
- Dark mode
- Success, warning, error, and pending states

### React Bits Usage

Use React Bits for:

- Landing-page effects
- Animated counters
- Balance displays
- Level-progress visuals
- Achievement states
- Dashboard transitions
- Campaign metrics
- Onboarding flows

Avoid excessive motion on financial, authentication, and security-critical screens.

### Main Application Shells

#### Worker

- Dashboard
- Earn
- Jobs
- Surveys
- Watch & Earn
- AI Tasks
- Testing
- Wallet
- Levels
- Achievements
- Referrals
- Notifications
- Profile

#### Business

- Dashboard
- Campaigns
- Create Campaign
- Audience
- Tasks
- Workers
- Analytics
- Billing
- Invoices
- Team
- Settings

#### Admin

- Dashboard
- Users
- Businesses
- Campaigns
- Tasks
- Transactions
- Withdrawals
- Fraud
- Disputes
- Reports
- System

---

## Phase 3 — Authentication & User Accounts

### Roles

```text
WORKER
BUSINESS
ADMIN
SUPER_ADMIN
```

### Account States

```text
PENDING
ACTIVE
SUSPENDED
BANNED
DELETED
```

### Authentication Features

- Email/password
- Email verification
- Password reset
- Optional Google sign-in later
- Optional phone verification
- MFA later for high-risk actions

### Worker Profile

- Full name
- Country
- Date of birth
- Phone number
- Skills
- Languages
- Interests
- Occupation
- Preferred task types
- Payment method
- Verification status

### Business Profile

- Company name
- Registration details
- Address
- Primary contact
- Billing information
- Verification status
- Team members

---

# Milestone 2 — Worker MVP

## Phase 4 — Worker Dashboard

The main worker workspace should show:

- Available balance
- Pending balance
- Today’s earnings
- Weekly earnings
- Lifetime earnings
- Current level
- Trust score
- Tasks completed
- Tasks pending approval
- Available tasks
- Recommended tasks
- Recent activity
- Notifications
- Withdrawal shortcut

---

## Phase 5 — Worker Levels

The level system should be configurable, not hardcoded throughout the app.

### Example Levels

#### Free
- Fee: GH₵0
- Basic ads
- Basic surveys
- Basic tasks

#### Starter
- Example fee: GH₵30/month
- More task opportunities
- Lower service fees
- Task alerts

#### Plus
- Example fee: GH₵60/month
- More surveys
- Microtasks
- Earlier access to selected jobs

#### Pro
- Example fee: GH₵100/month
- AI tasks
- Software testing
- Premium opportunities

#### Expert
- Example fee: GH₵150/month
- Skill-test requirement
- High-trust-score requirement
- Higher-value work

#### Elite
- Example fee: GH₵250/month
- Premium projects
- Advanced analytics
- Priority support

### Rule

Paid membership must never guarantee income. The UI must clearly state that earning depends on task availability, eligibility, and completed work.

---

## Phase 6 — Task Marketplace

### Core Task Fields

- Task ID
- Campaign ID
- Category
- Reward
- Currency
- Requirements
- Country
- Minimum worker level
- Minimum trust score
- Capacity
- Start date
- End date
- Status
- Instructions
- Submission requirements

### Task Categories

- Watch Ads
- Surveys
- Microtasks
- AI Tasks
- Website Testing
- App Testing
- Local Tasks
- Data Collection
- Research
- Product Testing
- Freelance Tasks

### Task Lifecycle

```text
Draft
  ↓
Approved
  ↓
Published
  ↓
Accepted
  ↓
In Progress
  ↓
Submitted
  ↓
Under Review
  ↓
Approved / Rejected
  ↓
Payment Released
```

---

## Phase 7 — Watch & Earn

### Worker Experience

- Show campaign title
- Video duration
- Reward
- Remaining slots
- Eligibility
- Watch & Earn action

### Verification Controls

- Minimum watch duration
- Active-window checks where appropriate
- Duplicate-completion prevention
- Session token
- Optional verification question
- Risk score before crediting the reward

### Completion States

- Completed
- Pending verification
- Approved
- Rejected

---

## Phase 8 — Survey System

### Internal Surveys

Question types:

- Multiple choice
- Checkboxes
- Rating scale
- Short text
- Long text
- Number
- Yes/No
- Dropdown

### Targeting

Where legally appropriate and relevant:

- Age range
- Location
- Employment
- Industry
- Interests
- Education

### External Surveys

Add third-party survey integrations later after the internal system works reliably.

---

## Phase 9 — Wallet & Financial Ledger

Do not store money as only one mutable `balance` field.

### Ledger Transaction Fields

- Transaction ID
- User or business ID
- Type
- Amount
- Currency
- Reference
- Status
- Created timestamp
- Updated timestamp

### Transaction Types

```text
TASK_REWARD
SURVEY_REWARD
REFERRAL
WITHDRAWAL
WITHDRAWAL_FEE
REFUND
SUBSCRIPTION
ADJUSTMENT
BUSINESS_DEPOSIT
CAMPAIGN_HOLD
CAMPAIGN_RELEASE
```

### Balance Views

- Available
- Pending
- Reserved
- Lifetime earned
- Total withdrawn

The balance shown to users should be calculated from auditable ledger entries.

---

## Phase 10 — Withdrawals

Initial launch focus: Ghana.

### Initial Channels

- MTN Mobile Money
- Telecel Cash
- AT Money
- Bank transfer

### Workflow

```text
Worker requests withdrawal
  ↓
Risk checks
  ↓
Verification
  ↓
Approval
  ↓
Payment initiated
  ↓
Provider confirmation
  ↓
Ledger finalized
```

### Withdrawal States

```text
REQUESTED
REVIEWING
APPROVED
PROCESSING
PAID
FAILED
REJECTED
```

---

# Milestone 3 — Business Platform

## Phase 11 — Business Dashboard

Businesses should be able to:

- Create campaigns
- Fund campaigns
- Target eligible workers
- Review submissions
- Approve/reject work
- View analytics
- Download reports
- Manage billing
- Manage team members

Key dashboard metrics:

- Campaign spend
- Workers reached
- Completed tasks
- Active campaigns
- Average cost per completion
- Pending approvals

---

## Phase 12 — Campaign Builder

### Campaign Types

- Watch & Earn
- Survey
- Website Testing
- AI Task
- Local Task
- Data Collection
- Custom Task

### Targeting Inputs

- Country
- Region
- Age range where appropriate
- Interests
- Skills
- Worker level
- Trust score
- Number of participants

### Pricing Engine

The system should calculate:

- Worker reward total
- Platform fee
- Verification/fraud fee if applicable
- Taxes where applicable
- Campaign total

Campaigns should not go live until adequately funded.

---

## Phase 13 — Business Billing

Businesses need a separate financial account.

### Features

- Deposit funds
- Fund campaigns
- Receive unused campaign refunds
- Download invoices
- View spending history
- View credits and adjustments

---

# Milestone 4 — Growth & Safety

## Phase 14 — Referral System

Referrals should reward productive activity, not recruitment alone.

### Model

- Referrer
- Referred user
- Eligible transaction
- Commission rate
- Commission amount
- Expiry date

Referral rewards should come from TaskPay’s commission or a defined marketing budget, not from new-user membership payments.

---

## Phase 15 — Trust Score

Each worker should have a score from 0–100.

### Possible Inputs

- Task approval rate
- Identity verification
- Account age
- Dispute history
- Completion rate
- Response consistency
- Suspicious-device signals
- Duplicate-account indicators

Higher trust scores can unlock better tasks.

---

## Phase 16 — Anti-Fraud Engine

### Detection Areas

- Duplicate accounts
- Suspicious IP patterns
- Multiple accounts per device
- Impossible task-completion speed
- Repeated survey patterns
- Scripted or automated interactions
- VPN/proxy risk signals where relevant
- Unusual withdrawals
- Referral abuse
- Frequent device switching

### Risk Actions

```text
ALLOW
REVIEW
LIMIT
SUSPEND
BLOCK
```

All high-risk decisions should generate audit records.

---

## Phase 17 — Admin Dashboard

### User Administration

Search/filter by:

- Name
- Email
- Phone
- Country
- User ID
- Trust score
- Account status

Actions:

- Verify
- Suspend
- Unsuspend
- Ban
- Investigate

### Campaign Administration

- Approve
- Pause
- Reject
- Refund
- Investigate

### Financial Administration

- Deposits
- Earnings
- Withdrawals
- Platform commission
- Outstanding balances
- Refunds
- Adjustments

---

## Phase 18 — Notifications

### Channels

- In-app
- Email
- Push notifications later
- SMS later

### Events

- New task
- Task approved
- Task rejected
- Reward credited
- Withdrawal processed
- Level changed
- New survey
- Campaign ending
- Security alert

---

# Milestone 5 — Higher-Value Work

## Phase 19 — AI Tasks

Create a higher-value B2B offering for human intelligence work.

### Task Types

- Image classification
- Text labeling
- Audio transcription
- Sentiment analysis
- AI-response comparison
- Content categorization
- Dataset verification
- Document annotation

Potential future product name: **TaskPay Human Intelligence**.

---

## Phase 20 — Testing Marketplace

Companies can submit websites/apps for real-user testing.

### Worker Submission Data

- Steps completed
- Screenshots
- Written notes
- Bug reports
- Screen recordings where required
- Severity rating
- Device/browser information

---

## Phase 21 — Analytics

### Worker Analytics

- Earnings trend
- Best-performing task categories
- Approval percentage
- Time spent
- Level progress

### Business Analytics

- Completion rate
- Audience breakdown
- Cost per completed task
- Engagement
- Fraud/rejection percentage
- Campaign ROI indicators

### Admin Analytics

- Gross marketplace volume
- Platform revenue
- Worker growth
- Business growth
- Active users
- Withdrawal totals
- Fraud losses

---

# Milestone 6 — Scale & Launch

## Phase 22 — Mobile / PWA

### First

- Progressive Web App
- Installable worker experience
- Push notifications when supported

### Later

- React Native / Expo mobile application

---

## Phase 23 — International Expansion

### Initial Market

- Ghana

### Potential Next Markets

- Nigeria
- Kenya
- South Africa
- Selected international markets

### Currency Support

```text
GHS
NGN
KES
ZAR
USD
EUR
GBP
```

Country-specific payment, compliance, and verification rules should live behind configurable modules.

---

## Phase 24 — Security Hardening

Before significant scale:

- CSRF protection
- XSS protection
- SQL injection protection
- Secure cookies
- Strong password hashing
- MFA
- Encryption at rest/in transit where appropriate
- Secrets management
- Rate limiting
- Audit logs
- Dependency scanning
- Security headers
- Backup strategy
- Disaster recovery
- Penetration testing

---

## Phase 25 — Production Infrastructure

Long-term architecture may evolve toward:

```text
Cloudflare / Edge
       │
Load Balancer
       │
TaskPay Web
       │
Application Services
   ┌───┼───────────────┐
   │   │               │
PostgreSQL          Redis
                     │
                   Queue
                     │
                  Workers
                     │
     ┌───────────────┼───────────────┐
     │               │               │
 Payments        Email/SMS       Analytics
```

Do not begin with unnecessary microservices. Keep a modular monolith until usage and team size justify separation.

---

## Phase 26 — CI/CD

GitHub Actions pipeline:

```text
Push / Pull Request
  ↓
Lint
  ↓
Type Check
  ↓
Unit Tests
  ↓
Integration Tests
  ↓
Build
  ↓
Security Scan
  ↓
Deploy Staging
```

Production deployment should require explicit approval.

---

## Phase 27 — Beta Launch

Recommended rollout:

- 100 verified workers
- 500 workers
- 1,000 workers
- 5–10 real businesses

Measure:

- Task completion rate
- Fraud rate
- Withdrawal success rate
- Business satisfaction
- Worker retention
- Average reward
- Platform margin

---

## Phase 28 — Ghana Public Launch

Target initial public scale:

- 10,000+ workers

Initial task focus:

- Watch & Earn
- Surveys
- Microtasks
- Testing

Add AI tasks after the core marketplace is stable.

---

## Phase 29 — Scale

Growth milestones:

```text
10,000 users
  ↓
50,000
  ↓
100,000
  ↓
500,000
  ↓
1,000,000+
```

At larger scale, evaluate separating services for:

- Identity
- Tasks
- Campaigns
- Payments
- Fraud
- Notifications
- Analytics

---

# MVP Priority Matrix

| Priority | Feature |
|---|---|
| P0 | Authentication |
| P0 | Worker profiles |
| P0 | Worker dashboard |
| P0 | Task marketplace |
| P0 | Watch & Earn |
| P0 | Surveys |
| P0 | Wallet ledger |
| P0 | Withdrawals |
| P0 | Business campaigns |
| P0 | Admin dashboard |
| P0 | Fraud controls |
| P1 | Levels |
| P1 | Referrals |
| P1 | Notifications |
| P1 | Trust score |
| P2 | AI tasks |
| P2 | Testing marketplace |
| P2 | Advanced analytics |
| P3 | Mobile apps |
| P3 | International expansion |

---

# Recommended Build Sequence

## Milestone 1 — Foundation
Phases 0–3

## Milestone 2 — Worker MVP
Phases 4–10

## Milestone 3 — Business Platform
Phases 11–13

## Milestone 4 — Growth & Safety
Phases 14–18

## Milestone 5 — Higher-Value Work
Phases 19–21

## Milestone 6 — Scale & Launch
Phases 22–29

The immediate engineering priority is **Phase 0 + Phase 1**: establish the product documentation, branch strategy, project scaffold, database foundation, authentication skeleton, development environment, and CI baseline before implementing worker-facing features.
