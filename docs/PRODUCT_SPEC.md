# TaskPay Product Specification

## 1. Product purpose

TaskPay is a human-task and rewards marketplace. Businesses fund legitimate campaigns and human-work tasks; workers complete eligible tasks and receive transparent rewards. TaskPay earns service fees and commissions for facilitating the marketplace.

## 2. Product principles

1. Business-funded work: task rewards originate from advertiser/client campaign budgets, not from later worker membership payments.
2. No guaranteed income: subscriptions or levels may unlock features and eligibility, but never promise fixed returns.
3. Transparent economics: workers see the reward and requirements before accepting a task.
4. Ledger-first finance: every money movement is represented by an auditable ledger entry.
5. Risk-aware access: eligibility can depend on level, trust score, location, verification and task-specific qualifications.
6. Human-quality marketplace: anti-bot, anti-duplication and quality controls are first-class product capabilities.

## 3. Primary actors

### Worker
Completes ads, surveys, research, testing, AI/data and other approved tasks for rewards.

### Business
Creates and funds campaigns, defines task requirements, reviews submissions and receives campaign analytics.

### Admin
Operates the marketplace, handles risk, disputes, campaign review, payments and user support.

### Super Admin
Manages platform-wide controls and high-risk administrative actions.

## 4. MVP task categories

- Watch & Earn
- Surveys
- Simple microtasks
- Website/app testing
- Research/data collection

Later categories include AI evaluation/data labeling, local verification and professional/freelance tasks.

## 5. Worker lifecycle

Register -> verify account -> complete profile -> discover eligible tasks -> accept -> perform -> submit -> review -> reward pending -> reward available -> withdraw.

## 6. Business lifecycle

Register -> verify business -> create campaign -> define audience and task -> fund campaign -> admin/risk review -> publish -> receive submissions -> review/auto-review -> analytics/reporting -> close/refund remainder.

## 7. Worker levels

Levels are eligibility/benefit tiers, not investments. The initial conceptual tiers are Free, Starter, Plus, Pro, Expert and Elite. Exact prices and benefits remain configurable rather than hardcoded.

Possible benefits include earlier task access, reduced platform fees, learning resources, advanced analytics, premium support and eligibility for higher-complexity tasks.

## 8. Wallet concepts

- Pending: reward earned but not yet releasable.
- Available: funds eligible for withdrawal.
- Reserved: funds temporarily held for an in-progress action.
- Withdrawn: successfully paid out.
- Lifetime earned: cumulative approved rewards.

Balances must be derived from ledger entries or maintained as validated projections of the ledger, never used as the sole financial source of truth.

## 9. Initial launch market

Ghana is the first operational market. The architecture must remain multi-country and multi-currency ready from the start.

## 10. MVP success criteria

The first production-capable MVP must support worker onboarding, task discovery/completion, campaign creation/funding, ledger-based rewards, withdrawal requests, basic trust/fraud controls and admin operations. It should be tested with a controlled beta before broad public launch.
