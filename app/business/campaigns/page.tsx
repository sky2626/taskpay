import Link from "next/link";
import { ArrowUpRight, Megaphone, PlusCircle } from "lucide-react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function CampaignsPage() {
  const session = await getCurrentSession();
  const profile = session
    ? await prisma.businessProfile.findUnique({ where: { userId: session.userId }, select: { id: true } })
    : null;

  const campaigns = profile
    ? await prisma.campaign.findMany({
        where: { businessProfileId: profile.id },
        include: { tasks: { select: { category: true, status: true, capacity: true, rewardMinor: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Business</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Campaigns</h1>
          <p className="mt-3 text-sm text-slate-400">Manage drafts, review status, publishing and campaign performance.</p>
        </div>
        <Link href="/business/campaigns/new" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-400">
          <PlusCircle className="h-4 w-4" /> New campaign
        </Link>
      </header>

      <section className="mt-8">
        {campaigns.length === 0 ? (
          <SpotlightCard className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200"><Megaphone className="h-6 w-6" /></div>
            <h2 className="mt-5 text-xl font-semibold">No campaigns yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">Start with a draft. You can define the task, target workers, capacity and reward before any campaign is reviewed or made available to workers.</p>
            <Link href="/business/campaigns/new" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-200 hover:text-white">Create your first campaign <ArrowUpRight className="h-4 w-4" /></Link>
          </SpotlightCard>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {campaigns.map((campaign) => {
              const task = campaign.tasks[0];
              return (
                <SpotlightCard key={campaign.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-300">{task?.category ?? "Campaign"}</p>
                      <h2 className="mt-2 text-xl font-semibold">{campaign.name}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{campaign.description}</p>
                    </div>
                    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">{task?.status ?? "DRAFT"}</span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                    <Stat label="Capacity" value={String(task?.capacity ?? 0)} />
                    <Stat label="Reward" value={formatMoney(task?.rewardMinor ?? 0n)} />
                    <Stat label="Total" value={formatMoney(campaign.totalCostMinor)} />
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-medium text-white">{value}</p></div>;
}

function formatMoney(minor: bigint) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(Number(minor) / 100);
}
