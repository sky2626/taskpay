import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { TaskStatus } from "@prisma/client";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function WatchEarnPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const profile = await prisma.workerProfile.findUnique({ where: { userId: session.userId } });
  if (!profile) return null;

  const tasks = await prisma.task.findMany({
    where: {
      category: "WATCH",
      status: TaskStatus.PUBLISHED,
      minimumLevel: { lte: profile.currentLevel },
      OR: [{ countryCode: null }, { countryCode: profile.countryCode }],
      NOT: { submissions: { some: { userId: session.userId } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-violet-200">Watch & Earn</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Promotional video tasks</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Watch eligible sponsored videos, complete the verification step, and submit the task for review.</p>
      </header>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {tasks.length === 0 ? (
          <SpotlightCard className="p-8 text-center lg:col-span-2"><p className="text-sm text-slate-400">No Watch & Earn campaigns are available for your account right now.</p></SpotlightCard>
        ) : tasks.map((task) => (
          <SpotlightCard key={task.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Sponsored video</p>
                <h2 className="mt-2 text-xl font-semibold">{task.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{task.description}</p>
              </div>
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-200"><PlayCircle className="h-5 w-5" /></div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div><p className="text-xs text-slate-500">Reward</p><p className="mt-1 font-semibold text-emerald-300">{money(task.rewardMinor)}</p></div>
              <Link href={`/worker/watch/${task.id}`} className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-400">Open task</Link>
            </div>
          </SpotlightCard>
        ))}
      </section>
    </div>
  );
}

function money(minor: bigint) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(Number(minor) / 100);
}
