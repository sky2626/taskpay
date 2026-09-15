import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  ClipboardCheck,
  Clock3,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { BlurText } from "@/components/react-bits/BlurText";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

const metrics = [
  { label: "Available balance", value: "GH₵ 428.50", detail: "+GH₵ 21.80 today", icon: Wallet },
  { label: "Pending", value: "GH₵ 73.20", detail: "6 tasks reviewing", icon: Clock3 },
  { label: "Trust score", value: "94 / 100", detail: "Excellent standing", icon: ShieldCheck },
  { label: "Completed tasks", value: "186", detail: "97.8% approval rate", icon: ClipboardCheck },
];

const opportunities = [
  {
    title: "Watch & Earn",
    subtitle: "MTN product campaign",
    reward: "GH₵ 0.80",
    meta: "45 sec",
    icon: PlayCircle,
  },
  {
    title: "Consumer Survey",
    subtitle: "Digital banking habits",
    reward: "GH₵ 8.00",
    meta: "~7 min",
    icon: ClipboardCheck,
  },
  {
    title: "AI Task",
    subtitle: "Categorize product images",
    reward: "GH₵ 18.00",
    meta: "~15 min",
    icon: Sparkles,
  },
];

export default function WorkerDashboardPage() {
  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-400">Tuesday, 15 September</p>
          <BlurText
            text="Welcome back to TaskPay"
            className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            delay={55}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4" /> Verified worker
            </span>
          </div>
          <Link
            href="/worker/earn"
            className="rounded-2xl bg-violet-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-400"
          >
            Find tasks
          </Link>
        </div>
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

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <SpotlightCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-violet-200">Recommended for you</p>
              <h2 className="mt-1 text-2xl font-semibold">Available earning opportunities</h2>
            </div>
            <Link href="/worker/earn" className="inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-3">
            {opportunities.map(({ title, subtitle, reward, meta, icon: Icon }) => (
              <Link
                key={title}
                href="/worker/earn"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-violet-400/30 hover:bg-violet-400/[0.06]"
              >
                <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-200">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{title}</p>
                  <p className="mt-1 truncate text-sm text-slate-400">{subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-300">{reward}</p>
                  <p className="mt-1 text-xs text-slate-500">{meta}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-violet-200" />
              </Link>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6" spotlightColor="rgba(16, 185, 129, 0.18)">
          <p className="text-sm text-slate-400">Current level</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold">Plus</p>
              <p className="mt-1 text-sm text-violet-200">Level 2</p>
            </div>
            <p className="text-sm font-medium text-slate-300">78%</p>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Complete 14 more approved tasks to qualify for your next level review.
          </p>
          <Link href="/worker/levels" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-200 hover:text-white">
            View level benefits <ArrowUpRight className="h-4 w-4" />
          </Link>
        </SpotlightCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <SpotlightCard className="p-6">
          <p className="text-sm text-slate-400">This week</p>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-4xl font-semibold">GH₵ 126.40</p>
            <p className="pb-1 text-sm text-emerald-300">+18.2%</p>
          </div>
          <p className="mt-2 text-sm text-slate-500">Across 31 approved tasks</p>
          <div className="mt-7 grid grid-cols-7 items-end gap-2">
            {[38, 62, 48, 78, 54, 86, 68].map((height, index) => (
              <div key={index} className="flex h-28 items-end rounded-xl bg-white/[0.025] p-1">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-violet-600/70 to-violet-300/80"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6" spotlightColor="rgba(14, 165, 233, 0.18)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Account quality</p>
              <h2 className="mt-1 text-xl font-semibold">Excellent standing</h2>
            </div>
            <ShieldCheck className="h-7 w-7 text-emerald-300" />
          </div>
          <div className="mt-6 space-y-4">
            <QualityRow label="Approval rate" value="97.8%" />
            <QualityRow label="Identity verification" value="Complete" />
            <QualityRow label="Task reliability" value="High" />
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}

function QualityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
