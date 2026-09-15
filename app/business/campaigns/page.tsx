import Link from "next/link";
import { ArrowUpRight, Megaphone, PlusCircle } from "lucide-react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

export default function CampaignsPage() {
  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Business</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Campaigns</h1>
          <p className="mt-3 text-sm text-slate-400">Manage drafts, review status, publishing and campaign performance.</p>
        </div>
        <Link
          href="/business/campaigns/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-medium transition hover:bg-violet-400"
        >
          <PlusCircle className="h-4 w-4" /> New campaign
        </Link>
      </header>

      <section className="mt-8">
        <SpotlightCard className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
            <Megaphone className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-xl font-semibold">No campaigns yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Start with a draft. You can define the task, target workers, capacity and reward before any campaign is reviewed or made available to workers.
          </p>
          <Link href="/business/campaigns/new" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-200 hover:text-white">
            Create your first campaign <ArrowUpRight className="h-4 w-4" />
          </Link>
        </SpotlightCard>
      </section>
    </div>
  );
}
