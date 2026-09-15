import { NextResponse } from "next/server";
import { SubmissionStatus } from "@prisma/client";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

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

  const submission = await prisma.taskSubmission.findFirst({
    where: { id: submissionId, userId: session.userId },
    include: { task: { select: { id: true, title: true } } },
  });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  if (submission.status !== SubmissionStatus.IN_PROGRESS) {
    return NextResponse.json({ error: "This task can no longer be submitted" }, { status: 409 });
  }

  const updated = await prisma.taskSubmission.update({
    where: { id: submission.id },
    data: {
      status: SubmissionStatus.SUBMITTED,
      submittedAt: new Date(),
      responseData: body,
    },
  });

  return NextResponse.json({
    submissionId: updated.id,
    status: updated.status,
    message: "Task submitted for review",
  });
}
