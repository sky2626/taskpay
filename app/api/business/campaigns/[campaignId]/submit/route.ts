import { CampaignStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, context: { params: Promise<{ campaignId: string }> }) {
  const session = await getCurrentSession();
  if (!session || session.user.role !== "BUSINESS") {
    return NextResponse.json({ error: "Business account required" }, { status: 403 });
  }

  const { campaignId } = await context.params;
  const profile = await prisma.businessProfile.findUnique({ where: { userId: session.userId }, select: { id: true } });
  if (!profile) return NextResponse.json({ error: "Business profile not found" }, { status: 403 });

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, businessProfileId: profile.id },
    include: { tasks: { select: { id: true } } },
  });

  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  const canSubmit =
    campaign.status === CampaignStatus.DRAFT ||
    campaign.status === CampaignStatus.REJECTED;
  if (!canSubmit) {
    return NextResponse.json({ error: "Campaign cannot be submitted from its current state" }, { status: 409 });
  }
  if (campaign.tasks.length === 0 || campaign.totalCostMinor <= BigInt(0)) {
    return NextResponse.json({ error: "Campaign is incomplete" }, { status: 409 });
  }

  const updated = await prisma.campaign.update({
    where: { id: campaign.id },
    data: { status: CampaignStatus.AWAITING_FUNDING, submittedForReviewAt: null, reviewedAt: null },
    select: { id: true, status: true },
  });

  return NextResponse.json({ campaign: updated });
}
