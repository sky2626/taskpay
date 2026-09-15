"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function WithdrawalReviewActions({ withdrawalId, status }: { withdrawalId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: "REVIEW" | "APPROVE" | "REJECT" | "PROCESS" | "MARK_PAID") {
    setLoading(action);
    setError(null);
    const response = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const result = (await response.json()) as { error?: string };
    setLoading(null);
    if (!response.ok) {
      setError(result.error ?? "Unable to update withdrawal");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {status === "REQUESTED" ? <button onClick={() => run("REVIEW")} className="rounded-xl bg-slate-700 px-3 py-2 text-xs font-medium text-white">Start review</button> : null}
        {["REQUESTED", "REVIEWING"].includes(status) ? <button onClick={() => run("APPROVE")} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white">Approve</button> : null}
        {!["PAID", "REJECTED", "CANCELLED"].includes(status) ? <button onClick={() => run("REJECT")} className="rounded-xl bg-rose-500/90 px-3 py-2 text-xs font-medium text-white">Reject</button> : null}
        {status === "APPROVED" ? <button onClick={() => run("PROCESS")} className="rounded-xl bg-violet-500 px-3 py-2 text-xs font-medium text-white">Mark processing</button> : null}
        {status === "PROCESSING" ? <button onClick={() => run("MARK_PAID")} className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-medium text-white">Mark paid</button> : null}
      </div>
      {loading ? <p className="mt-2 text-xs text-slate-400">Updating {loading.toLowerCase().replaceAll("_", " ")}...</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
