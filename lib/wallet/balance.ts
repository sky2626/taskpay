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

  let availableMinor = 0n;
  let pendingMinor = 0n;
  let reservedMinor = 0n;
  let lifetimeEarnedMinor = 0n;
  let withdrawnMinor = 0n;

  for (const entry of entries) {
    const isCredit = [
      LedgerEntryType.TASK_REWARD,
      LedgerEntryType.SURVEY_REWARD,
      LedgerEntryType.REFERRAL_REWARD,
      LedgerEntryType.REFUND,
      LedgerEntryType.ADJUSTMENT,
    ].includes(entry.type);

    if (isCredit && entry.amountMinor > 0n) {
      lifetimeEarnedMinor += entry.amountMinor;
    }

    if (entry.type === LedgerEntryType.WITHDRAWAL && entry.amountMinor < 0n) {
      withdrawnMinor += -entry.amountMinor;
    }

    if (entry.status === LedgerEntryStatus.PENDING) {
      pendingMinor += entry.amountMinor;
    }

    if (entry.status === LedgerEntryStatus.RESERVED) {
      reservedMinor += entry.amountMinor;
    }

    if ([LedgerEntryStatus.AVAILABLE, LedgerEntryStatus.SETTLED].includes(entry.status)) {
      availableMinor += entry.amountMinor;
    }
  }

  return {
    currency,
    availableMinor,
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
