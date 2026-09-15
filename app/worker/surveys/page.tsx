import Link from "next/link";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import { TaskStatus } from "@prisma/client";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function WorkerSurveysPage() {
  const session = await getCurrentSession();
  const worker = session
    ? await prisma.workerProfile.findUnique({ where: { userId: session.userId }, select: { currentLevel: true, countryCode: true } })
    : null;

  const surveys = worker
    ? await prisma.task.findMany({
        where: {
          category: "SURVEY",
          status: TaskStatus.PUBLISHED,
          minimumLevel: { lte: worker.currentLevel },
          OR: [{ countryCode: null }, { countryCode: worker.countryCode ?? undefined }],
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      })
    : [];

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-violet-200">Survey & Earn</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Available surveys</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Complete eligible research surveys. Rewards are credited only after the submission is reviewed and approved.</p>
      </header>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {surveys.length === 0 ? (
          <SpotlightCard className="p-8 text-center lg:col-span-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200"><ClipboardList className="h-6 w-6" /></div>
            <h2 className="mt-5 text-xl font-semibold">No surveys available right now</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">New surveys will appear here when a funded and approved campaign matches your level and country.</p>
          </SpotlightCard>
        ) : (
          surveys.map((survey) => (
            <SpotlightCard key={survey.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Survey</p>
                  <h2 className="mt-2 text-xl font-semibold">{survey.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">{survey.description}</p>
                </div>
                <p className="shrink-0 font-semibold text-emerald-300">{formatMoney(survey.rewardMinor)}</p>
              </div>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <p className="text-xs text-slate-500">Level {survey.minimumLevel}+ · {survey.capacity ?? "Open"} slots</p>
                <Link href={`/worker/surveys/${survey.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-violet-200 hover:text-white">Start survey <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            </SpotlightCard>
          ))
        )}
      </section>
    </div>
  );
}

function formatMoney(minor: bigint) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(Number(minor) / 100);
}
