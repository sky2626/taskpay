import { LedgerEntryStatus, WithdrawalStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { calculateWithdrawalRisk } from "@/lib/risk/withdrawal";

const actionSchema = z.object({
  action: z.enum(["REVIEW", "APPROVE", "REJECT", "PROCESS", "MARK_PAID"]),
  notes: z.string().trim().max(2000).optional(),
  providerRef: z.string().trim().max(200).optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ withdrawalId: string }> }) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Admin account required" }, { status: 403 });
  }

  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid withdrawal action" }, { status: 400 });

  const { withdrawalId } = await context.params;
  const withdrawal = await prisma.withdrawalRequest.findUnique({ where: { id: withdrawalId } });
  if (!withdrawal) return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });

  const { action, notes, providerRef } = parsed.data;
  const audit = (event: string, metadata?: Record<string, string | number | null>) => ({
    actorUserId: session.userId,
    action: event,
    targetType: "WITHDRAWAL",
    targetId: withdrawalId,
    metadata: metadata ?? {},
  });

  if (action === "REVIEW") {
    if (withdrawal.status !== WithdrawalStatus.REQUESTED) return NextResponse.json({ error: "Withdrawal is not awaiting review" }, { status: 409 });
    const riskScore = await calculateWithdrawalRisk(withdrawal.userId, withdrawal.amountMinor);
    await prisma.$transaction(async (tx) => {
      await tx.withdrawalRequest.update({ where: { id: withdrawalId }, data: { status: WithdrawalStatus.REVIEWING, reviewNotes: notes ?? null, riskScore } });
      await tx.auditLog.create({ data: audit("WITHDRAWAL_REVIEW_STARTED", { riskScore }) });
    });
    return NextResponse.json({ status: WithdrawalStatus.REVIEWING, riskScore });
  }

  if (action === "APPROVE") {
    if (![WithdrawalStatus.REQUESTED, WithdrawalStatus.REVIEWING].includes(withdrawal.status)) return NextResponse.json({ error: "Withdrawal is not reviewable" }, { status: 409 });
    await prisma.$transaction(async (tx) => {
      await tx.withdrawalRequest.update({ where: { id: withdrawalId }, data: { status: WithdrawalStatus.APPROVED, reviewNotes: notes ?? null } });
      await tx.auditLog.create({ data: audit("WITHDRAWAL_APPROVED", { riskScore: withdrawal.riskScore }) });
    });
    return NextResponse.json({ status: WithdrawalStatus.APPROVED });
  }

  if (action === "REJECT") {
    if ([WithdrawalStatus.PAID, WithdrawalStatus.REJECTED, WithdrawalStatus.CANCELLED].includes(withdrawal.status)) return NextResponse.json({ error: "Withdrawal cannot be rejected from its current state" }, { status: 409 });
    await prisma.$transaction(async (tx) => {
      await tx.withdrawalRequest.update({ where: { id: withdrawalId }, data: { status: WithdrawalStatus.REJECTED, reviewNotes: notes ?? null, processedAt: new Date() } });
      await tx.ledgerEntry.updateMany({ where: { reference: withdrawalId, status: LedgerEntryStatus.RESERVED }, data: { status: LedgerEntryStatus.REVERSED } });
      await tx.auditLog.create({ data: audit("WITHDRAWAL_REJECTED", { riskScore: withdrawal.riskScore }) });
    });
    return NextResponse.json({ status: WithdrawalStatus.REJECTED });
  }

  if (action === "PROCESS") {
    if (withdrawal.status !== WithdrawalStatus.APPROVED) return NextResponse.json({ error: "Withdrawal must be approved first" }, { status: 409 });
    await prisma.$transaction(async (tx) => {
      await tx.withdrawalRequest.update({ where: { id: withdrawalId }, data: { status: WithdrawalStatus.PROCESSING, providerRef: providerRef ?? withdrawal.providerRef } });
      await tx.auditLog.create({ data: audit("WITHDRAWAL_PROCESSING") });
    });
    return NextResponse.json({ status: WithdrawalStatus.PROCESSING });
  }

  if (withdrawal.status !== WithdrawalStatus.PROCESSING) return NextResponse.json({ error: "Withdrawal must be processing before it can be marked paid" }, { status: 409 });

  await prisma.$transaction(async (tx) => {
    await tx.withdrawalRequest.update({ where: { id: withdrawalId }, data: { status: WithdrawalStatus.PAID, providerRef: providerRef ?? withdrawal.providerRef, processedAt: new Date() } });
    await tx.ledgerEntry.updateMany({ where: { reference: withdrawalId, status: LedgerEntryStatus.RESERVED }, data: { status: LedgerEntryStatus.SETTLED, settledAt: new Date() } });
    await tx.auditLog.create({ data: audit("WITHDRAWAL_PAID") });
  });

  return NextResponse.json({ status: WithdrawalStatus.PAID });
}
