import Link from "next/link";
import { ArrowUpRight, BarChart3, CircleDollarSign, Megaphone, UsersRound } from "lucide-react";
import { BlurText } from "@/components/react-bits/BlurText";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

const metrics = [
  { label: "Campaign spend", value: "GH₵ 0.00", detail: "No funded campaigns yet", icon: CircleDollarSign },
  { label: "Workers reached", value: "0", detail: "Launch your first campaign", icon: UsersRound },
  { label: "Completed tasks", value: "0", detail: "Verified completions", icon: BarChart3 },
  { label: "Active campaigns", value: "0", detail: "Drafts do not count", icon: Megaphone },
];

export default function BusinessDashboardPage() {
  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Business workspace</p>
          <BlurText
            text="Run transparent human-task campaigns"
            className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            delay={45}
          />
        </div>
        <Link
          href="/business/campaigns/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400"
        >
          Create campaign <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <SpotlightCard key={label} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</p>
                <p className="mt-2 text-xs text-slate-500">{detail}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 text-violet-200">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </SpotlightCard>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SpotlightCard className="p-6">
          <p className="text-sm text-violet-200">Get started</p>
          <h2 className="mt-2 text-2xl font-semibold">Create your first campaign</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Define the work, worker reward, target audience, capacity and quality requirements. Campaigns remain drafts until reviewed and funded.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Watch & Earn",
              "Survey research",
              "AI data task",
              "Website testing",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
          <Link href="/business/campaigns/new" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-200 hover:text-white">
            Open campaign builder <ArrowUpRight className="h-4 w-4" />
          </Link>
        </SpotlightCard>

        <SpotlightCard className="p-6" spotlightColor="rgba(16, 185, 129, 0.18)">
          <p className="text-sm text-slate-400">Platform principle</p>
          <h2 className="mt-2 text-xl font-semibold">Fund real work, not recruitment.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Worker rewards come from business-funded campaigns. TaskPay keeps campaign economics auditable and separates worker membership benefits from task reward funding.
          </p>
        </SpotlightCard>
      </section>
    </div>
  );
}
