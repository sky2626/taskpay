import { NextResponse } from "next/server";
import { UserRole, UserStatus, VerificationStatus } from "@prisma/client";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const moderationSchema = z.object({
  status: z.nativeEnum(UserStatus).optional(),
  verificationStatus: z.nativeEnum(VerificationStatus).optional(),
  trustScore: z.number().int().min(0).max(100).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const session = await getCurrentSession();
  if (!session || ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(session.user.role)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { userId } = await params;
  if (userId === session.userId) {
    return NextResponse.json({ error: "Use a separate super-admin workflow to change your own account." }, { status: 409 });
  }

  const parsed = moderationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No valid moderation change supplied." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true, status: true, verificationStatus: true, trustScore: true } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

  if (target.role === UserRole.SUPER_ADMIN && session.user.role !== UserRole.SUPER_ADMIN) {
    return NextResponse.json({ error: "Only a super admin can moderate another super admin." }, { status: 403 });
  }

  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId },
      data: parsed.data,
      select: { id: true, status: true, verificationStatus: true, trustScore: true },
    });

    await tx.auditLog.create({
      data: {
        actorUserId: session.userId,
        action: "USER_MODERATED",
        targetType: "USER",
        targetId: userId,
        metadata: {
          before: { status: target.status, verificationStatus: target.verificationStatus, trustScore: target.trustScore },
          after: parsed.data,
        },
      },
    });

    return updated;
  });

  return NextResponse.json({ user });
}
