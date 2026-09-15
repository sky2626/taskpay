# TaskPay Wallet and Ledger Rules

## Source of truth

The immutable-style transaction ledger is the financial source of truth. Displayed balances are derived from ledger entries or from projections that can be reconciled back to the ledger.

## Amount storage

Store monetary values in minor units using integers (for example, 1050 = GHS 10.50). Never use floating-point values for persisted money.

## Core states

- PENDING: created but not yet spendable/withdrawable.
- AVAILABLE: worker may withdraw subject to policy.
- RESERVED: temporarily locked for an operation.
- SETTLED: final external settlement completed.
- FAILED: attempted operation failed.
- REVERSED: neutralized by a compensating financial event.

## Required controls

- Idempotency keys for payment and reward operations.
- Currency recorded on every entry.
- External/provider references when applicable.
- No destructive editing of settled financial history.
- Adjustments use explicit adjustment entries with actor/reason metadata.
- Reconciliation jobs compare provider transactions, ledger entries and projected balances.

## Reward flow

Task approved -> reward ledger entry created as PENDING -> review/hold window satisfied -> entry becomes AVAILABLE -> withdrawal reserves amount -> provider payment executes -> withdrawal settles or reverses.

## Campaign funding

Campaign budgets must be reserved before tasks are exposed at scale. Task completion must not create liabilities larger than the campaign's funded/approved budget.
