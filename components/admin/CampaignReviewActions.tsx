"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CampaignReviewActions({ campaignId, status }: { campaignId: string; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: "APPROVE" | "REJECT" | "PUBLISH") {
    setLoading(action);
    setError(null);
    const response = await fetch(`/api/admin/campaigns/${campaignId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const result = (await response.json()) as { error?: string };
    setLoading(null);
    if (!response.ok) {
      setError(result.error ?? "Unable to update campaign");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2">
        {status === "UNDER_REVIEW" ? (
          <>
            <button onClick={() => run("APPROVE")} disabled={Boolean(loading)} className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white disabled:opacity-50">{loading === "APPROVE" ? "Approving..." : "Approve"}</button>
            <button onClick={() => run("REJECT")} disabled={Boolean(loading)} className="rounded-xl bg-rose-500/90 px-3 py-2 text-xs font-medium text-white disabled:opacity-50">{loading === "REJECT" ? "Rejecting..." : "Reject"}</button>
          </>
        ) : null}
        {status === "APPROVED" ? (
          <button onClick={() => run("PUBLISH")} disabled={Boolean(loading)} className="rounded-xl bg-violet-500 px-3 py-2 text-xs font-medium text-white disabled:opacity-50">{loading === "PUBLISH" ? "Publishing..." : "Publish to workers"}</button>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
