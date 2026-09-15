"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

export function ReviewActions({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"APPROVE" | "REJECT" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function review(decision: "APPROVE" | "REJECT") {
    setLoading(decision);
    setError(null);
    const response = await fetch(`/api/business/submissions/${submissionId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    const result = (await response.json()) as { error?: string };
    setLoading(null);

    if (!response.ok) {
      setError(result.error ?? "Unable to review submission.");
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => review("APPROVE")} disabled={loading !== null} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-400 disabled:opacity-50">
          <CheckCircle2 className="h-4 w-4" /> {loading === "APPROVE" ? "Approving..." : "Approve & pay"}
        </button>
        <button onClick={() => review("REJECT")} disabled={loading !== null} className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-medium text-rose-200 transition hover:bg-rose-400/15 disabled:opacity-50">
          <XCircle className="h-4 w-4" /> {loading === "REJECT" ? "Rejecting..." : "Reject"}
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
