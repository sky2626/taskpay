import { Check, Crown, Gem, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { BlurText } from "@/components/react-bits/BlurText";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

const levels = [
  {
    name: "Free",
    price: "GH₵ 0",
    current: false,
    benefits: ["Basic ads and surveys", "Standard withdrawal fees", "Access to public tasks"],
  },
  {
    name: "Starter",
    price: "GH₵ 30 / month",
    current: false,
    benefits: ["More task opportunities", "Task alerts", "Lower service fees"],
  },
  {
    name: "Plus",
    price: "GH₵ 60 / month",
    current: true,
    benefits: ["Priority surveys", "Microtasks", "Earlier campaign access"],
  },
  {
    name: "Pro",
    price: "GH₵ 100 / month",
    current: false,
    benefits: ["AI tasks", "Software testing", "Premium opportunities"],
  },
  {
    name: "Expert",
    price: "GH₵ 150 / month",
    current: false,
    benefits: ["High-value skilled work", "Qualification-based jobs", "Priority support"],
  },
  {
    name: "Elite",
    price: "GH₵ 250 / month",
    current: false,
    benefits: ["Highest-value projects", "Lowest platform fees", "Advanced worker analytics"],
  },
];

export default function WorkerLevelsPage() {
  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <div className="flex items-center gap-2 text-sm text-violet-200">
          <Gem className="h-4 w-4" /> Worker levels
        </div>
        <BlurText
          text="Build trust, skills and access to better work"
          className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          delay={40}
        />
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
          Paid levels provide platform benefits and task eligibility. They do not guarantee income, task volume or returns.
        </p>
      </header>

      <section className="mt-7 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SpotlightCard className="p-6" spotlightColor="rgba(16, 185, 129, 0.18)">
          <p className="text-sm text-slate-400">Your current level</p>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold text-white">Plus</p>
              <p className="mt-1 text-sm text-violet-200">Level 2</p>
            </div>
            <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-slate-400">Progress to Pro review</span>
            <span className="font-medium text-white">78%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400" />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Complete 14 more approved tasks and maintain a high trust score to qualify for the next level review.
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Level rules</p>
              <h2 className="mt-1 text-xl font-semibold">Access is earned and verified</h2>
            </div>
            <Sparkles className="h-6 w-6 text-violet-300" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <RuleCard title="Quality" text="Maintain strong task approval and reliability." />
            <RuleCard title="Trust" text="Verification and account standing affect eligibility." />
            <RuleCard title="Skills" text="Some higher-value work requires qualification tests." />
          </div>
        </SpotlightCard>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Membership options</p>
            <h2 className="mt-1 text-2xl font-semibold">Compare worker levels</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {levels.map((level, index) => (
            <SpotlightCard
              key={level.name}
              className={`p-5 ${level.current ? "ring-1 ring-violet-400/40" : ""}`}
              spotlightColor={level.current ? "rgba(124, 58, 237, 0.28)" : "rgba(255, 255, 255, 0.08)"}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Level {index}</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">{level.name}</h3>
                </div>
                {index >= 4 ? <Crown className="h-5 w-5 text-amber-300" /> : <Gem className="h-5 w-5 text-violet-300" />}
              </div>
              <p className="mt-4 text-lg font-medium text-white">{level.price}</p>
              <div className="mt-5 space-y-3">
                {level.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-2 text-sm text-slate-400">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <button
                disabled={!level.current}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${
                  level.current
                    ? "bg-violet-500 text-white"
                    : "cursor-not-allowed border border-white/10 bg-white/[0.03] text-slate-500"
                }`}
              >
                {level.current ? "Current level" : <><LockKeyhole className="h-4 w-4" /> Coming through level engine</>}
              </button>
            </SpotlightCard>
          ))}
        </div>
      </section>
    </div>
  );
}

function RuleCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-medium text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}
