import {
  BrainCircuit,
  ClipboardList,
  MapPinCheck,
  PlayCircle,
  Search,
  SlidersHorizontal,
  Smartphone,
} from "lucide-react";
import { BlurText } from "@/components/react-bits/BlurText";
import { TaskCard } from "@/components/tasks/TaskCard";

const categories = ["All", "Watch & Earn", "Surveys", "AI Tasks", "Testing", "Local Tasks"];

const tasks = [
  {
    title: "Watch MTN product campaign",
    description: "Watch a verified 45-second product video and answer one attention-check question.",
    reward: "GH₵ 0.80",
    duration: "45 sec",
    category: "Watch & Earn",
    icon: PlayCircle,
    badge: "Instant review",
  },
  {
    title: "Digital banking habits survey",
    description: "Share your experience using mobile banking, mobile money and online financial services.",
    reward: "GH₵ 8.00",
    duration: "~7 min",
    category: "Survey",
    icon: ClipboardList,
    badge: "Popular",
  },
  {
    title: "Categorize product images",
    description: "Review product photos and assign the most accurate category from a provided label list.",
    reward: "GH₵ 18.00",
    duration: "~15 min",
    category: "AI Task",
    icon: BrainCircuit,
    minimumLevel: "Level 2+",
  },
  {
    title: "Test a mobile checkout flow",
    description: "Complete a test purchase flow and report any usability problems or confusing steps.",
    reward: "GH₵ 35.00",
    duration: "~20 min",
    category: "Testing",
    icon: Smartphone,
    minimumLevel: "Level 2+",
  },
  {
    title: "Verify a local retail location",
    description: "Confirm that a listed business location is open and submit the required verification details.",
    reward: "GH₵ 12.00",
    duration: "~10 min",
    category: "Local Task",
    icon: MapPinCheck,
    minimumLevel: "Verified",
  },
  {
    title: "Short consumer preference survey",
    description: "Answer 12 questions about household shopping preferences and brand awareness.",
    reward: "GH₵ 5.00",
    duration: "~5 min",
    category: "Survey",
    icon: ClipboardList,
  },
];

export default function EarnPage() {
  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-violet-200">Task marketplace</p>
        <BlurText
          text="Find work that fits your time and skills"
          className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          delay={40}
        />
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Rewards are shown before you accept a task. Eligibility depends on campaign requirements, level, trust score and verification status.
        </p>
      </header>

      <section className="mt-7 rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              aria-label="Search tasks"
              placeholder="Search tasks, campaigns or categories"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.07] hover:text-white">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`rounded-full px-4 py-2 text-sm transition ${
                index === 0
                  ? "bg-violet-500 text-white"
                  : "border border-white/10 bg-white/[0.035] text-slate-400 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Available now</p>
            <h2 className="mt-1 text-2xl font-semibold">Recommended opportunities</h2>
          </div>
          <p className="text-sm text-slate-500">6 shown</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.title} {...task} />
          ))}
        </div>
      </section>
    </div>
  );
}
