import { NextResponse } from "next/server";
import { Prisma, TaskStatus } from "@prisma/client";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  context: { params: Promise<{ taskId: string }> },
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await context.params;

  const worker = await prisma.workerProfile.findUnique({
    where: { userId: session.userId },
    select: { currentLevel: true },
  });

  if (!worker) {
    return NextResponse.json({ error: "Worker profile not found" }, { status: 403 });
  }

  try {
    const submission = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id: taskId },
        select: {
          id: true,
          status: true,
          minimumLevel: true,
          capacity: true,
          startsAt: true,
          endsAt: true,
        },
      });

      if (!task || task.status !== TaskStatus.PUBLISHED) {
        throw new TaskAcceptanceError("Task is not available", 404);
      }

      const now = new Date();
      if (task.startsAt && task.startsAt > now) {
        throw new TaskAcceptanceError("Task has not started yet", 409);
      }
      if (task.endsAt && task.endsAt <= now) {
        throw new TaskAcceptanceError("Task has ended", 409);
      }
      if (worker.currentLevel < task.minimumLevel) {
        throw new TaskAcceptanceError("Your worker level does not meet this task requirement", 403);
      }

      if (task.capacity) {
        const claimed = await tx.taskSubmission.count({ where: { taskId } });
        if (claimed >= task.capacity) {
          throw new TaskAcceptanceError("Task capacity has been reached", 409);
        }
      }

      return tx.taskSubmission.create({
        data: {
          taskId,
          userId: session.userId,
        },
      });
    });

    return NextResponse.json({ submissionId: submission.id, status: submission.status }, { status: 201 });
  } catch (error) {
    if (error instanceof TaskAcceptanceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "You already accepted this task" }, { status: 409 });
    }

    console.error("Task acceptance failed", error);
    return NextResponse.json({ error: "Unable to accept task" }, { status: 500 });
  }
}

class TaskAcceptanceError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}
