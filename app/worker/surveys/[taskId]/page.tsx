import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { notFound } from "next/navigation";
import { TaskStatus } from "@prisma/client";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { SurveyRunner, type SurveyQuestion } from "@/components/surveys/SurveyRunner";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function SurveyPage({ params }: { params: Promise<{ taskId: string }> }) {
  const session = await getCurrentSession();
  const { taskId } = await params;
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!session || !task || task.category !== "SURVEY" || task.status !== TaskStatus.PUBLISHED) notFound();

  const worker = await prisma.workerProfile.findUnique({ where: { userId: session.userId } });
  if (!worker || worker.currentLevel < task.minimumLevel) notFound();

  const config = (task.configuration ?? {}) as { questions?: SurveyQuestion[] };
  const questions = Array.isArray(config.questions) ? config.questions : [];

  const existing = await prisma.taskSubmission.findUnique({
    where: { taskId_userId: { taskId, userId: session.userId } },
    select: { status: true },
  });

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <Link href="/worker/surveys" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to surveys</Link>
        <div className="mt-5 flex items-start gap-4">
          <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-200"><ClipboardList className="h-6 w-6" /></div>
          <div>
            <p className="text-sm text-violet-200">Survey task</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{task.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{task.description}</p>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.34fr]">
        <SpotlightCard className="p-6">
          {existing && existing.status !== "IN_PROGRESS" ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
              <h2 className="text-lg font-semibold">Already submitted</h2>
              <p className="mt-2 text-sm text-slate-400">Status: {existing.status}. You cannot submit this survey twice.</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
              <h2 className="text-lg font-semibold">Survey setup incomplete</h2>
              <p className="mt-2 text-sm text-slate-400">This campaign does not have survey questions configured yet.</p>
            </div>
          ) : (
            <SurveyRunner taskId={task.id} questions={questions} />
          )}
        </SpotlightCard>

        <SpotlightCard className="h-fit p-6" spotlightColor="rgba(16, 185, 129, 0.16)">
          <p className="text-sm text-slate-400">Reward</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">{formatMoney(task.rewardMinor)}</p>
          <div className="mt-5 space-y-3 text-sm text-slate-400">
            <p>Minimum level: <span className="text-white">Level {task.minimumLevel}</span></p>
            <p>Country: <span className="text-white">{task.countryCode ?? "Any"}</span></p>
            <p>Approval required: <span className="text-white">Yes</span></p>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}

function formatMoney(minor: bigint) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(Number(minor) / 100);
}
