import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { issueWatchChallenge } from "@/lib/watch/challenge";

export async function POST(_request: Request, context: { params: Promise<{ submissionId: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "WORKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { submissionId } = await context.params;
  const submission = await prisma.taskSubmission.findFirst({
    where: { id: submissionId, userId: session.userId, status: "IN_PROGRESS" },
    include: { task: { select: { id: true, category: true } } },
  });

  if (!submission || submission.task.category !== "WATCH") {
    return NextResponse.json({ error: "Watch task session not found" }, { status: 404 });
  }

  const challenge = issueWatchChallenge({
    submissionId: submission.id,
    taskId: submission.task.id,
    userId: session.userId,
  });

  return NextResponse.json({ challenge });
}
