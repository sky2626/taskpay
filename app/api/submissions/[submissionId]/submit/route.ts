import { NextResponse } from "next/server";
import { SubmissionStatus } from "@prisma/client";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { verifyWatchSubmission } from "@/lib/watch/verify-submission";

type WatchConfig = { minimumWatchSeconds?: number };

export async function POST(
  request: Request,
  context: { params: Promise<{ submissionId: string }> },
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { submissionId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const responseData = body?.responseData ?? body;

  const submission = await prisma.taskSubmission.findFirst({
    where: { id: submissionId, userId: session.userId },
    include: { task: { select: { id: true, title: true, category: true, configuration: true } } },
  });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  if (submission.status !== SubmissionStatus.IN_PROGRESS) {
    return NextResponse.json({ error: "This task can no longer be submitted" }, { status: 409 });
  }

  if (submission.task.category === "WATCH") {
    const config = (submission.task.configuration ?? {}) as WatchConfig;
    const verification = verifyWatchSubmission({
      response: responseData,
      submissionId: submission.id,
      taskId: submission.task.id,
      userId: session.userId,
      minimumWatchSeconds: Math.max(5, config.minimumWatchSeconds ?? 30),
    });

    if (!verification.ok) {
      return NextResponse.json({ error: verification.reason }, { status: 400 });
    }

    responseData.watchVerificationResult = {
      verified: true,
      riskFlags: verification.riskFlags,
      challengeIssuedAt: verification.issuedAt,
    };
  }

  const updated = await prisma.taskSubmission.update({
    where: { id: submission.id },
    data: {
      status: SubmissionStatus.SUBMITTED,
      submittedAt: new Date(),
      responseData,
    },
  });

  return NextResponse.json({
    submissionId: updated.id,
    status: updated.status,
    message: "Task submitted for review",
  });
}
