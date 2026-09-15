"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CampaignSubmitButton({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/business/campaigns/${campaignId}/submit`, { method: "POST" });
    const result = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to submit campaign.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-4">
      <button onClick={submit} disabled={loading} className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium transition hover:bg-violet-400 disabled:opacity-50">
        {loading ? "Submitting..." : "Continue to funding"}
      </button>
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
