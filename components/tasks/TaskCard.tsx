import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Clock3, ShieldCheck } from "lucide-react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

type TaskCardProps = {
  title: string;
  description: string;
  reward: string;
  duration: string;
  category: string;
  icon: LucideIcon;
  href?: string;
  minimumLevel?: string;
  badge?: string;
};

export function TaskCard({
  title,
  description,
  reward,
  duration,
  category,
  icon: Icon,
  href = "/worker/tasks",
  minimumLevel = "Free",
  badge,
}: TaskCardProps) {
  return (
    <SpotlightCard className="h-full p-5">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-200">
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-emerald-300">{reward}</p>
            <p className="mt-1 text-xs text-slate-500">per completion</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
            {category}
          </span>
          {badge ? (
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              {badge}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.035] px-3 py-2">
            <Clock3 className="h-3.5 w-3.5" /> {duration}
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.035] px-3 py-2">
            <ShieldCheck className="h-3.5 w-3.5" /> {minimumLevel}
          </div>
        </div>

        <Link
          href={href}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400"
        >
          View task <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </SpotlightCard>
  );
}
