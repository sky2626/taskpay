import { NextResponse } from "next/server";
import { Prisma, TaskStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const campaignSchema = z.object({
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(4000),
  category: z.enum(["WATCH", "SURVEY", "AI", "TEST"]),
  countryCode: z.string().trim().min(2).max(3).transform((value) => value.toUpperCase()),
  minimumLevel: z.number().int().min(0).max(10),
  participants: z.number().int().min(1).max(1_000_000),
  rewardMinor: z.number().int().min(1),
  configuration: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allowedRole =
    session.user.role === UserRole.BUSINESS ||
    session.user.role === UserRole.ADMIN ||
    session.user.role === UserRole.SUPER_ADMIN;
  if (!allowedRole) {
    return NextResponse.json({ error: "Business account required" }, { status: 403 });
  }

  const profile = await prisma.businessProfile.findUnique({ where: { userId: session.userId } });
  if (!profile) return NextResponse.json({ error: "Business profile not found" }, { status: 403 });

  const parsed = campaignSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid campaign data", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const workerBudgetMinor = BigInt(data.participants) * BigInt(data.rewardMinor);
  const platformFeeMinor = workerBudgetMinor / BigInt(4);
  const totalCostMinor = workerBudgetMinor + platformFeeMinor;
  const configuration = data.configuration as Prisma.InputJsonValue | undefined;

  const campaign = await prisma.$transaction(async (tx) => {
    const created = await tx.campaign.create({
      data: {
        businessProfileId: profile.id,
        name: data.name,
        description: data.description,
        currency: "GHS",
        budgetMinor: workerBudgetMinor,
        platformFeeMinor,
        totalCostMinor,
        targetCountryCode: data.countryCode,
      },
    });

    await tx.task.create({
      data: {
        campaignId: created.id,
        title: data.name,
        description: data.description,
        category: data.category,
        status: TaskStatus.DRAFT,
        rewardMinor: BigInt(data.rewardMinor),
        currency: "GHS",
        countryCode: data.countryCode,
        minimumLevel: data.minimumLevel,
        capacity: data.participants,
        configuration,
      },
    });

    return created;
  });

  return NextResponse.json({
    campaignId: campaign.id,
    status: "DRAFT",
    workerBudgetMinor: workerBudgetMinor.toString(),
    platformFeeMinor: platformFeeMinor.toString(),
    totalCostMinor: totalCostMinor.toString(),
  }, { status: 201 });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.businessProfile.findUnique({ where: { userId: session.userId } });
  if (!profile) return NextResponse.json({ error: "Business profile not found" }, { status: 403 });

  const campaigns = await prisma.campaign.findMany({
    where: { businessProfileId: profile.id },
    include: { tasks: { select: { id: true, category: true, status: true, capacity: true, rewardMinor: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    campaigns: campaigns.map((campaign) => ({
      ...campaign,
      budgetMinor: campaign.budgetMinor.toString(),
      platformFeeMinor: campaign.platformFeeMinor.toString(),
      totalCostMinor: campaign.totalCostMinor.toString(),
      tasks: campaign.tasks.map((task) => ({ ...task, rewardMinor: task.rewardMinor.toString() })),
    })),
  });
}
