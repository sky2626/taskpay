import { SubmissionStatus } from "@prisma/client";
import { ClipboardCheck } from "lucide-react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { ReviewActions } from "@/components/business/ReviewActions";
import { getCurrentSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export default async function BusinessReviewsPage() {
  const session = await getCurrentSession();
  const profile = session
    ? await prisma.businessProfile.findUnique({ where: { userId: session.userId }, select: { id: true } })
    : null;

  const submissions = profile
    ? await prisma.taskSubmission.findMany({
        where: {
          status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.UNDER_REVIEW] },
          task: { campaign: { businessProfileId: profile.id } },
        },
        include: {
          user: { select: { name: true, email: true, trustScore: true } },
          task: { include: { campaign: { select: { name: true } } } },
        },
        orderBy: { submittedAt: "asc" },
        take: 100,
      })
    : [];

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-violet-200">Quality review</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Submission queue</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Review submitted work and approve eligible rewards or reject submissions that do not meet campaign requirements.</p>
      </header>

      <section className="mt-8 space-y-4">
        {submissions.length === 0 ? (
          <SpotlightCard className="p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200"><ClipboardCheck className="h-6 w-6" /></div>
            <h2 className="mt-5 text-xl font-semibold">No submissions waiting</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">Submitted worker tasks will appear here for review.</p>
          </SpotlightCard>
        ) : (
          submissions.map((submission) => (
            <SpotlightCard key={submission.id} className="p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_0.34fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{submission.task.campaign.name}</span><span>•</span><span>{submission.task.category}</span><span>•</span><span>{submission.status}</span></div>
                  <h2 className="mt-2 text-xl font-semibold">{submission.task.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">Worker: {submission.user.name ?? submission.user.email} · Trust {submission.user.trustScore}/100</p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Submitted response</p>
                    <pre className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">{JSON.stringify(submission.responseData, null, 2)}</pre>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-xs text-slate-500">Task reward</p>
                  <p className="mt-1 text-2xl font-semibold text-emerald-300">{formatMoney(submission.task.rewardMinor)}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Approval creates one auditable ledger reward for this submission.</p>
                  <div className="mt-5"><ReviewActions submissionId={submission.id} /></div>
                </div>
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
