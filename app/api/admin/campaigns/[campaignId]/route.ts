import { CampaignStatus, TaskStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const actionSchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "PUBLISH"]),
  notes: z.string().trim().max(2000).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ campaignId: string }> },
) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Admin account required" }, { status: 403 });
  }

  const parsed = actionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid review action" }, { status: 400 });

  const { campaignId } = await context.params;
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: { tasks: { select: { id: true, status: true } } },
  });

  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });

  const now = new Date();
  const { action, notes } = parsed.data;

  if (action === "APPROVE") {
    if (campaign.status !== CampaignStatus.UNDER_REVIEW) {
      return NextResponse.json({ error: "Only campaigns under review can be approved" }, { status: 409 });
    }

    await prisma.$transaction([
      prisma.campaign.update({
        where: { id: campaignId },
        data: { status: CampaignStatus.APPROVED, reviewedAt: now, adminReviewNotes: notes ?? null },
      }),
      prisma.task.updateMany({ where: { campaignId }, data: { status: TaskStatus.APPROVED } }),
    ]);

    return NextResponse.json({ status: CampaignStatus.APPROVED });
  }

  if (action === "REJECT") {
    if (![CampaignStatus.UNDER_REVIEW, CampaignStatus.APPROVED].includes(campaign.status)) {
      return NextResponse.json({ error: "Campaign is not in a reviewable state" }, { status: 409 });
    }

    await prisma.$transaction([
      prisma.campaign.update({
        where: { id: campaignId },
        data: { status: CampaignStatus.REJECTED, reviewedAt: now, adminReviewNotes: notes ?? null },
      }),
      prisma.task.updateMany({ where: { campaignId }, data: { status: TaskStatus.DRAFT } }),
    ]);

    return NextResponse.json({ status: CampaignStatus.REJECTED });
  }

  if (campaign.status !== CampaignStatus.APPROVED) {
    return NextResponse.json({ error: "Only approved campaigns can be published" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.campaign.update({
      where: { id: campaignId },
      data: { status: CampaignStatus.PUBLISHED, publishedAt: now },
    }),
    prisma.task.updateMany({ where: { campaignId }, data: { status: TaskStatus.PUBLISHED, startsAt: now } }),
  ]);

  return NextResponse.json({ status: CampaignStatus.PUBLISHED });
}
