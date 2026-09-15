# TaskPay Business Rules

## Funding and rewards

- A task cannot become payable unless its campaign has sufficient funded budget.
- Worker subscriptions do not fund promised task returns.
- A worker must see the reward amount, currency and key completion requirements before accepting a task.
- Rewards may move through pending and available states after quality/risk checks.
- Campaign remainders are handled according to explicit close/refund rules.

## Levels

- Levels are product-access tiers, not investments.
- Paid tiers must provide genuine platform benefits and must not guarantee earnings.
- Task eligibility may require a minimum level, but level alone never guarantees task availability.
- Pricing and benefits must be configurable by market and versioned over time.

## Tasks

- One user may not claim the same single-completion task more than once unless the task explicitly permits repeats.
- Tasks may be restricted by geography, verification, skill, trust score, device or other lawful campaign criteria.
- Rejected work must store a reason and preserve an audit trail.
- High-risk or disputed rewards can be held for manual review.

## Referrals

- Referral rewards must come from TaskPay's marketing/service economics, not direct recruitment payments between users.
- No multi-level/downline commission structure.
- Referral rewards should be tied to eligible productive activity and limited by time and anti-abuse rules.

## Withdrawals

- Only available funds may be withdrawn.
- Withdrawal requests are subject to minimum amounts, provider limits, verification and fraud checks.
- Every withdrawal must be idempotent and traceable to provider references.
- Failed or reversed withdrawals must create compensating ledger entries rather than silently mutating history.

## Administration

- High-impact actions such as manual balance adjustments, account bans, campaign refunds and verification overrides require audit logs.
- Sensitive administrative actions should support dual approval as the platform matures.
