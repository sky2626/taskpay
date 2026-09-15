import { LedgerEntryStatus, LedgerEntryType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type WalletBalance = {
  currency: string;
  availableMinor: bigint;
  pendingMinor: bigint;
  reservedMinor: bigint;
  lifetimeEarnedMinor: bigint;
  withdrawnMinor: bigint;
};

export async function getWalletBalance(userId: string, currency = "GHS"): Promise<WalletBalance> {
  const entries = await prisma.ledgerEntry.findMany({
    where: { userId, currency },
    select: { type: true, status: true, amountMinor: true },
  });

  let availableMinor = BigInt(0);
  let pendingMinor = BigInt(0);
  let reservedMinor = BigInt(0);
  let lifetimeEarnedMinor = BigInt(0);
  let withdrawnMinor = BigInt(0);

  for (const entry of entries) {
    const isCredit =
      entry.type === LedgerEntryType.TASK_REWARD ||
      entry.type === LedgerEntryType.SURVEY_REWARD ||
      entry.type === LedgerEntryType.REFERRAL_REWARD ||
      entry.type === LedgerEntryType.REFUND ||
      entry.type === LedgerEntryType.ADJUSTMENT;

    if (isCredit && entry.amountMinor > BigInt(0)) lifetimeEarnedMinor += entry.amountMinor;
    if (
      entry.type === LedgerEntryType.WITHDRAWAL &&
      entry.amountMinor < BigInt(0) &&
      entry.status === LedgerEntryStatus.SETTLED
    ) {
      withdrawnMinor += -entry.amountMinor;
    }

    if (entry.status === LedgerEntryStatus.PENDING) pendingMinor += entry.amountMinor;

    if (entry.status === LedgerEntryStatus.RESERVED) {
      if (entry.amountMinor < BigInt(0)) {
        reservedMinor += -entry.amountMinor;
        availableMinor += entry.amountMinor;
      } else {
        reservedMinor += entry.amountMinor;
      }
    }

    const isAvailable =
      entry.status === LedgerEntryStatus.AVAILABLE ||
      entry.status === LedgerEntryStatus.SETTLED;
    if (isAvailable) {
      availableMinor += entry.amountMinor;
    }
  }

  return {
    currency,
    availableMinor: availableMinor > BigInt(0) ? availableMinor : BigInt(0),
    pendingMinor,
    reservedMinor,
    lifetimeEarnedMinor,
    withdrawnMinor,
  };
}

export function formatMoney(minor: bigint, currency = "GHS") {
  const value = Number(minor) / 100;
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(value);
}
