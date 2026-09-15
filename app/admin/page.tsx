import { CampaignStatus, SubmissionStatus, WithdrawalStatus } from "@prisma/client";
import { Megaphone, ShieldAlert, Users, WalletCards } from "lucide-react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [users, campaignsForReview, withdrawalsForReview, submissionsForReview] = await Promise.all([
    prisma.user.count(),
    prisma.campaign.count({ where: { status: CampaignStatus.UNDER_REVIEW } }),
    prisma.withdrawalRequest.count({ where: { status: { in: [WithdrawalStatus.REQUESTED, WithdrawalStatus.REVIEWING] } } }),
    prisma.taskSubmission.count({ where: { status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.UNDER_REVIEW] } } }),
  ]);

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-emerald-200">Operations</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Admin control center</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Review campaigns, withdrawals and account activity before money or work moves through the marketplace.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Users} label="Users" value={String(users)} />
        <Metric icon={Megaphone} label="Campaigns to review" value={String(campaignsForReview)} />
        <Metric icon={WalletCards} label="Withdrawals to review" value={String(withdrawalsForReview)} />
        <Metric icon={ShieldAlert} label="Task submissions" value={String(submissionsForReview)} />
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <SpotlightCard className="p-5" spotlightColor="rgba(16, 185, 129, 0.14)">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200"><Icon className="h-5 w-5" /></div>
      </div>
    </SpotlightCard>
  );
}
