import { ArrowDownToLine, Clock3, History, ShieldCheck, WalletCards } from "lucide-react";
import { getCurrentSession } from "@/lib/auth/session";
import { formatMoney, getWalletBalance } from "@/lib/wallet/balance";
import { prisma } from "@/lib/prisma";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

export default async function WorkerWalletPage() {
  const session = await getCurrentSession();
  if (!session) return null;

  const [balance, recentEntries] = await Promise.all([
    getWalletBalance(session.userId),
    prisma.ledgerEntry.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-violet-200">Wallet</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Your earnings and withdrawals</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Balances are calculated from immutable ledger entries so every reward, fee, withdrawal and adjustment remains auditable.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <WalletMetric icon={WalletCards} label="Available" value={formatMoney(balance.availableMinor)} detail="Ready for eligible withdrawals" />
        <WalletMetric icon={Clock3} label="Pending" value={formatMoney(balance.pendingMinor)} detail="Awaiting task or risk checks" />
        <WalletMetric icon={ShieldCheck} label="Reserved" value={formatMoney(balance.reservedMinor)} detail="Temporarily held for processing" />
        <WalletMetric icon={History} label="Lifetime earned" value={formatMoney(balance.lifetimeEarnedMinor)} detail={`Withdrawn ${formatMoney(balance.withdrawnMinor)}`} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SpotlightCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Recent activity</p>
              <h2 className="mt-1 text-xl font-semibold">Ledger transactions</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {recentEntries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-4 py-8 text-center text-sm text-slate-500">
                No wallet transactions yet. Approved task rewards will appear here.
              </div>
            ) : (
              recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-white">{entry.type.replaceAll("_", " ")}</p>
                    <p className="mt-1 text-xs text-slate-500">{entry.createdAt.toLocaleString("en-GH")}</p>
                  </div>
                  <div className="text-right">
                    <p className={entry.amountMinor >= 0n ? "font-semibold text-emerald-300" : "font-semibold text-rose-300"}>
                      {formatMoney(entry.amountMinor, entry.currency)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{entry.status.replaceAll("_", " ")}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6" spotlightColor="rgba(16, 185, 129, 0.18)">
          <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-200 w-fit">
            <ArrowDownToLine className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-xl font-semibold">Withdraw earnings</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Withdrawal providers will be connected after we finish the ledger and risk-review flow. Only available funds will be withdrawable.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Available now</p>
            <p className="mt-2 text-3xl font-semibold">{formatMoney(balance.availableMinor)}</p>
          </div>
          <button disabled className="mt-5 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-slate-500 disabled:cursor-not-allowed">
            Withdrawal setup coming next
          </button>
        </SpotlightCard>
      </section>
    </div>
  );
}

function WalletMetric({ icon: Icon, label, value, detail }: { icon: typeof WalletCards; label: string; value: string; detail: string }) {
  return (
    <SpotlightCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{detail}</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-violet-200"><Icon className="h-5 w-5" /></div>
      </div>
    </SpotlightCard>
  );
}
