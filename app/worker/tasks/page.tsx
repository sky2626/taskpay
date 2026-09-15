import { CheckCircle2, Clock3, ListChecks, RotateCcw, XCircle } from "lucide-react";
import { BlurText } from "@/components/react-bits/BlurText";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

const items = [
  {
    title: "Digital banking habits survey",
    category: "Survey",
    reward: "GH₵ 8.00",
    status: "Under review",
    detail: "Submitted today at 14:26",
    icon: Clock3,
    tone: "text-amber-300 bg-amber-400/10 border-amber-400/20",
  },
  {
    title: "Retail product classification batch",
    category: "AI Task",
    reward: "GH₵ 18.00",
    status: "Approved",
    detail: "Reward moved to available balance",
    icon: CheckCircle2,
    tone: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    title: "Watch telecom campaign",
    category: "Watch & Earn",
    reward: "GH₵ 0.80",
    status: "Approved",
    detail: "Completed yesterday",
    icon: CheckCircle2,
    tone: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  },
  {
    title: "Checkout usability test",
    category: "Testing",
    reward: "GH₵ 35.00",
    status: "Revision requested",
    detail: "Add one missing screenshot before resubmitting",
    icon: RotateCcw,
    tone: "text-sky-300 bg-sky-400/10 border-sky-400/20",
  },
  {
    title: "Household products survey",
    category: "Survey",
    reward: "GH₵ 5.00",
    status: "Rejected",
    detail: "Attention check did not pass",
    icon: XCircle,
    tone: "text-rose-300 bg-rose-400/10 border-rose-400/20",
  },
];

export default function WorkerTasksPage() {
  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <div className="flex items-center gap-2 text-sm text-violet-200">
          <ListChecks className="h-4 w-4" /> My tasks
        </div>
        <BlurText
          text="Track every task from acceptance to payment"
          className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          delay={40}
        />
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Task status and review history stay visible so rewards, rejections and revisions remain auditable.
        </p>
      </header>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Summary label="In progress" value="3" />
        <Summary label="Under review" value="6" />
        <Summary label="Approved this month" value="42" />
        <Summary label="Approval rate" value="97.8%" />
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Recent activity</p>
            <h2 className="mt-1 text-2xl font-semibold">Task history</h2>
          </div>
        </div>

        <SpotlightCard className="mt-5 overflow-hidden">
          <div className="divide-y divide-white/10">
            {items.map(({ title, category, reward, status, detail, icon: Icon, tone }) => (
              <div key={`${title}-${status}`} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-white">{title}</h3>
                    <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-xs text-slate-400">
                      {category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{detail}</p>
                </div>
                <p className="font-semibold text-emerald-300">{reward}</p>
                <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${tone}`}>
                  <Icon className="h-3.5 w-3.5" /> {status}
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <SpotlightCard className="p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </SpotlightCard>
  );
}
