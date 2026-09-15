"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToLine } from "lucide-react";

export function WithdrawalForm({ availableMinor }: { availableMinor: string }) {
  const router = useRouter();
  const available = Number(availableMinor) / 100;
  const [amount, setAmount] = useState(Math.min(available, 50));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amountMinor: Math.round(amount * 100),
        currency: "GHS",
        method: form.get("method"),
        destination: form.get("destination"),
      }),
    });

    const result = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to request withdrawal.");
      return;
    }

    setSuccess("Withdrawal request submitted for review.");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      <label className="block">
        <span className="text-sm text-slate-300">Amount (GH₵)</span>
        <input type="number" min={10} max={available} step={0.01} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="field-input mt-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" />
      </label>

      <label className="block">
        <span className="text-sm text-slate-300">Withdrawal method</span>
        <select name="method" defaultValue="MTN_MOMO" className="field-input mt-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
          <option value="MTN_MOMO">MTN Mobile Money</option>
          <option value="TELECEL_CASH">Telecel Cash</option>
          <option value="AT_MONEY">AT Money</option>
          <option value="BANK_TRANSFER">Bank transfer</option>
        </select>
      </label>

      <label className="block">
        <span className="text-sm text-slate-300">Phone number or bank destination</span>
        <input name="destination" required minLength={5} maxLength={120} className="field-input mt-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" placeholder="e.g. 0240000000" />
      </label>

      {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div> : null}
      {success ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">{success}</div> : null}

      <button type="submit" disabled={loading || available < 10} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
        <ArrowDownToLine className="h-4 w-4" /> {loading ? "Submitting..." : "Request withdrawal"}
      </button>
      <p className="text-xs leading-5 text-slate-500">Minimum request is GH₵10. Requests are reserved immediately and remain subject to risk review and provider processing.</p>
    </form>
  );
}
