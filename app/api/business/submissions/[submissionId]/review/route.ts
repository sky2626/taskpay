import { NextResponse } from "next/server";
import { LedgerEntryStatus, LedgerEntryType, SubmissionStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  decision: z.enum(["APPROVE", "REJECT"]),
  notes: z.string().trim().max(1000).optional(),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ submissionId: string }> },
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allowedRole =
    session.user.role === UserRole.BUSINESS ||
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;
  if (!allowedRole) {
    return NextResponse.json({ error: "Business account required" }, { status: 403 });
  }

  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid review request" }, { status: 400 });

  const { submissionId } = await context.params;
  const profile = await prisma.businessProfile.findUnique({ where: { userId: session.userId }, select: { id: true } });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const submission = await tx.taskSubmission.findUnique({
        where: { id: submissionId },
        include: { task: { include: { campaign: true } } },
      });

      if (!submission) throw new ReviewError("Submission not found", 404);

      const isAdmin =
        session.user.role === UserRole.ADMIN ||
        session.user.role === UserRole.SUPER_ADMIN;
      if (!isAdmin && (!profile || submission.task.campaign.businessProfileId !== profile.id)) {
        throw new ReviewError("You cannot review this submission", 403);
      }

      const reviewable =
        submission.status === SubmissionStatus.SUBMITTED ||
        submission.status === SubmissionStatus.UNDER_REVIEW;
      if (!reviewable) {
        throw new ReviewError("Submission has already been reviewed", 409);
      }

      const now = new Date();
      if (parsed.data.decision === "REJECT") {
        const updated = await tx.taskSubmission.update({
          where: { id: submission.id },
          data: {
            status: SubmissionStatus.REJECTED,
            reviewedAt: now,
            reviewNotes: parsed.data.notes,
          },
        });
        return { status: updated.status, rewardMinor: BigInt(0) };
      }

      const rewardType = submission.task.category === "SURVEY" ? LedgerEntryType.SURVEY_REWARD : LedgerEntryType.TASK_REWARD;
      await tx.ledgerEntry.create({
        data: {
          userId: submission.userId,
          type: rewardType,
          status: LedgerEntryStatus.AVAILABLE,
          amountMinor: submission.task.rewardMinor,
          currency: submission.task.currency,
          reference: submission.id,
          idempotencyKey: `submission-reward:${submission.id}`,
          metadata: { taskId: submission.taskId, campaignId: submission.task.campaignId },
          settledAt: now,
        },
      });

      const updated = await tx.taskSubmission.update({
        where: { id: submission.id },
        data: {
          status: SubmissionStatus.APPROVED,
          reviewedAt: now,
          reviewNotes: parsed.data.notes,
        },
      });

      await tx.workerProfile.update({
        where: { userId: submission.userId },
        data: { completedTasks: { increment: 1 } },
      });

      return { status: updated.status, rewardMinor: submission.task.rewardMinor };
    });

    return NextResponse.json({ status: result.status, rewardMinor: result.rewardMinor.toString() });
  } catch (error) {
    if (error instanceof ReviewError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Submission review failed", error);
    return NextResponse.json({ error: "Unable to review submission" }, { status: 500 });
  }
}

class ReviewError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}
