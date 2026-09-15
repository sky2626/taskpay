import { WithdrawalStatus } from "@prisma/client";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { WithdrawalReviewActions } from "@/components/admin/WithdrawalReviewActions";
import { prisma } from "@/lib/prisma";

export default async function AdminWithdrawalsPage() {
  const withdrawals = await prisma.withdrawalRequest.findMany({
    where: { status: { in: [WithdrawalStatus.REQUESTED, WithdrawalStatus.REVIEWING, WithdrawalStatus.APPROVED, WithdrawalStatus.PROCESSING] } },
    include: { user: { select: { name: true, email: true, trustScore: true, verificationStatus: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-emerald-200">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Withdrawal review</h1>
        <p className="mt-3 text-sm text-slate-400">Review queued requests before settlement through a payment provider.</p>
      </header>

      <section className="mt-8 space-y-4">
        {withdrawals.length === 0 ? (
          <SpotlightCard className="p-8 text-center"><p className="text-sm text-slate-400">No withdrawals require action.</p></SpotlightCard>
        ) : withdrawals.map((item) => (
          <SpotlightCard key={item.id} className="p-6" spotlightColor="rgba(16,185,129,0.14)">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{item.user.name ?? item.user.email}</p>
                <h2 className="mt-2 text-xl font-semibold">{money(item.amountMinor)}</h2>
                <p className="mt-2 text-sm text-slate-400">{item.method.replaceAll("_", " ")} • {item.destination}</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">{item.status.replaceAll("_", " ")}</span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Trust score" value={`${item.user.trustScore}/100`} />
              <Stat label="Verification" value={item.user.verificationStatus.replaceAll("_", " ")} />
              <Stat label="Risk score" value={String(item.riskScore)} />
              <Stat label="Requested" value={item.createdAt.toLocaleString("en-GH")} />
            </div>

            <WithdrawalReviewActions withdrawalId={item.id} status={item.status} />
          </SpotlightCard>
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-sm font-medium text-white">{value}</p></div>;
}

function money(minor: bigint) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(Number(minor) / 100);
}
