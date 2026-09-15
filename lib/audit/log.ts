import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditInput = {
  actorUserId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export async function writeAuditLog(input: AuditInput) {
  return prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      metadata: input.metadata,
    },
  });
}
