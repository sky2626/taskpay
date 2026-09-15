import { NextResponse } from "next/server";
import { Prisma, SubmissionStatus, TaskStatus } from "@prisma/client";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  answers: z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ taskId: string }> },
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid survey response" }, { status: 400 });

  const { taskId } = await context.params;
  const worker = await prisma.workerProfile.findUnique({ where: { userId: session.userId } });
  if (!worker) return NextResponse.json({ error: "Worker profile not found" }, { status: 403 });

  try {
    const submission = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });
      if (!task || task.category !== "SURVEY" || task.status !== TaskStatus.PUBLISHED) {
        throw new SurveyError("Survey is not available", 404);
      }

      const now = new Date();
      if (task.startsAt && task.startsAt > now) throw new SurveyError("Survey has not started yet", 409);
      if (task.endsAt && task.endsAt <= now) throw new SurveyError("Survey has ended", 409);
      if (worker.currentLevel < task.minimumLevel) throw new SurveyError("Your worker level does not meet this survey requirement", 403);

      const existing = await tx.taskSubmission.findUnique({
        where: { taskId_userId: { taskId, userId: session.userId } },
      });

      if (existing && existing.status !== SubmissionStatus.IN_PROGRESS) {
        throw new SurveyError("You already submitted this survey", 409);
      }

      if (!existing && task.capacity) {
        const claimed = await tx.taskSubmission.count({ where: { taskId } });
        if (claimed >= task.capacity) throw new SurveyError("Survey capacity has been reached", 409);
      }

      if (existing) {
        return tx.taskSubmission.update({
          where: { id: existing.id },
          data: {
            status: SubmissionStatus.SUBMITTED,
            responseData: parsed.data.answers as Prisma.InputJsonValue,
            submittedAt: now,
          },
        });
      }

      return tx.taskSubmission.create({
        data: {
          taskId,
          userId: session.userId,
          status: SubmissionStatus.SUBMITTED,
          responseData: parsed.data.answers as Prisma.InputJsonValue,
          submittedAt: now,
        },
      });
    });

    return NextResponse.json({ submissionId: submission.id, status: submission.status }, { status: 201 });
  } catch (error) {
    if (error instanceof SurveyError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Survey submission failed", error);
    return NextResponse.json({ error: "Unable to submit survey" }, { status: 500 });
  }
}

class SurveyError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}
