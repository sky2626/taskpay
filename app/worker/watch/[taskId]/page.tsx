import { notFound } from "next/navigation";
import { TaskStatus } from "@prisma/client";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { WatchTaskSession } from "@/components/worker/WatchTaskSession";
import { prisma } from "@/lib/prisma";

type WatchConfig = { videoUrl?: string; minimumWatchSeconds?: number; verificationQuestion?: string };

export default async function WatchTaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.category !== "WATCH" || task.status !== TaskStatus.PUBLISHED) notFound();

  const config = (task.configuration ?? {}) as WatchConfig;
  if (!config.videoUrl) notFound();

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-violet-200">Watch & Earn</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{task.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{task.description}</p>
      </header>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SpotlightCard className="p-6">
          <WatchTaskSession taskId={task.id} videoUrl={config.videoUrl} minimumWatchSeconds={Math.max(5, config.minimumWatchSeconds ?? 30)} verificationQuestion={config.verificationQuestion ?? "What was shown in the video?"} />
        </SpotlightCard>
        <SpotlightCard className="p-6">
          <p className="text-sm text-slate-400">Task reward</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-300">{money(task.rewardMinor)}</p>
          <p className="mt-5 text-sm leading-6 text-slate-400">Complete the viewing timer and verification prompt. Approved submissions are credited to the worker ledger.</p>
        </SpotlightCard>
      </div>
    </div>
  );
}

function money(minor: bigint) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(Number(minor) / 100);
}
