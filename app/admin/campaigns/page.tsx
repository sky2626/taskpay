import { CampaignStatus } from "@prisma/client";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { CampaignReviewActions } from "@/components/admin/CampaignReviewActions";
import { prisma } from "@/lib/prisma";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: { in: [CampaignStatus.UNDER_REVIEW, CampaignStatus.APPROVED] } },
    include: { businessProfile: { select: { companyName: true } }, tasks: true },
    orderBy: { updatedAt: "asc" },
  });

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-emerald-200">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Campaign review</h1>
        <p className="mt-3 text-sm text-slate-400">Review campaign details before they become available in the marketplace.</p>
      </header>
      <section className="mt-8 space-y-4">
        {campaigns.length === 0 ? (
          <SpotlightCard className="p-8 text-center"><p className="text-sm text-slate-400">No campaigns require action.</p></SpotlightCard>
        ) : campaigns.map((campaign) => {
          const task = campaign.tasks[0];
          return (
            <SpotlightCard key={campaign.id} className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{campaign.businessProfile.companyName}</p>
                  <h2 className="mt-2 text-xl font-semibold">{campaign.name}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{campaign.description}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{campaign.status.replaceAll("_", " ")}</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <Stat label="Category" value={task?.category ?? "-"} />
                <Stat label="Capacity" value={String(task?.capacity ?? 0)} />
                <Stat label="Worker level" value={`Level ${task?.minimumLevel ?? 0}+`} />
                <Stat label="Reward" value={money(task?.rewardMinor ?? 0n)} />
                <Stat label="Total" value={money(campaign.totalCostMinor)} />
              </div>
              <CampaignReviewActions campaignId={campaign.id} status={campaign.status} />
            </SpotlightCard>
          );
        })}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-white">{value}</p></div>;
}

function money(minor: bigint) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(Number(minor) / 100);
}
