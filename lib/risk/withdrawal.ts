import { prisma } from "@/lib/prisma";

export async function calculateWithdrawalRisk(userId: string, amountMinor: bigint) {
  const [user, recentWithdrawals, approvedTasks] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { trustScore: true, verificationStatus: true, createdAt: true },
    }),
    prisma.withdrawalRequest.count({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.taskSubmission.count({ where: { userId, status: "APPROVED" } }),
  ]);

  if (!user) return 100;

  let score = 0;
  if (user.verificationStatus !== "VERIFIED") score += 25;
  if (user.trustScore < 60) score += 20;
  if (user.trustScore < 40) score += 15;
  if (recentWithdrawals >= 2) score += 15;
  if (approvedTasks < 3) score += 10;
  if (amountMinor >= 100_000n) score += 10;
  if (Date.now() - user.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000) score += 10;

  return Math.min(100, score);
}
