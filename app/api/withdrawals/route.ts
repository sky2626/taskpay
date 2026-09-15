import { LedgerEntryStatus, LedgerEntryType, Prisma, WithdrawalStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const requestSchema = z.object({
  amountMinor: z.number().int().min(1000).max(5_000_000),
  currency: z.literal("GHS").default("GHS"),
  method: z.enum(["MTN_MOMO", "TELECEL_CASH", "AT_MONEY", "BANK_TRANSFER"]),
  destination: z.string().trim().min(5).max(120),
});

export async function GET() {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.withdrawalRequest.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    withdrawals: requests.map((item) => ({ ...item, amountMinor: item.amountMinor.toString() })),
  });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the withdrawal amount and payment details." }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const entries = await tx.ledgerEntry.findMany({
        where: { userId: session.userId, currency: parsed.data.currency },
        select: { amountMinor: true, status: true },
      });

      let spendable = BigInt(0);
      for (const entry of entries) {
        const isSpendable =
          entry.status === LedgerEntryStatus.AVAILABLE ||
          entry.status === LedgerEntryStatus.SETTLED;
        if (isSpendable) spendable += entry.amountMinor;
        if (entry.status === LedgerEntryStatus.RESERVED && entry.amountMinor < BigInt(0)) spendable += entry.amountMinor;
      }

      const amountMinor = BigInt(parsed.data.amountMinor);
      if (spendable < amountMinor) {
        throw new WithdrawalError("Insufficient available balance.", 409);
      }

      const pendingCount = await tx.withdrawalRequest.count({
        where: {
          userId: session.userId,
          status: { in: [WithdrawalStatus.REQUESTED, WithdrawalStatus.REVIEWING, WithdrawalStatus.APPROVED, WithdrawalStatus.PROCESSING] },
        },
      });

      if (pendingCount >= 3) {
        throw new WithdrawalError("You already have several withdrawals in progress.", 409);
      }

      const withdrawal = await tx.withdrawalRequest.create({
        data: {
          userId: session.userId,
          amountMinor,
          currency: parsed.data.currency,
          method: parsed.data.method,
          destination: parsed.data.destination,
          riskScore: 0,
        },
      });

      await tx.ledgerEntry.create({
        data: {
          userId: session.userId,
          type: LedgerEntryType.WITHDRAWAL,
          status: LedgerEntryStatus.RESERVED,
          amountMinor: -amountMinor,
          currency: parsed.data.currency,
          reference: withdrawal.id,
          idempotencyKey: `withdrawal:${withdrawal.id}:reserve`,
          metadata: { method: parsed.data.method },
        },
      });

      return withdrawal;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return NextResponse.json({
      withdrawal: { ...result, amountMinor: result.amountMinor.toString() },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof WithdrawalError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Withdrawal request failed", error);
    return NextResponse.json({ error: "Unable to create withdrawal request." }, { status: 500 });
  }
}

class WithdrawalError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}
