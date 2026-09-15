"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  status: string;
  verificationStatus: string;
  trustScore: number;
};

export function UserModerationControls({ userId, status, verificationStatus, trustScore }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(change: Record<string, string | number>) {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/admin/users/${userId}/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(change),
    });
    const result = (await response.json()) as { error?: string };
    setLoading(false);
    if (!response.ok) {
      setError(result.error ?? "Unable to update account.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
      <div className="flex flex-wrap gap-2">
        <select defaultValue={status} disabled={loading} onChange={(event) => update({ status: event.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-200">
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
        <select defaultValue={verificationStatus} disabled={loading} onChange={(event) => update({ verificationStatus: event.target.value })} className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-200">
          <option value="UNVERIFIED">Unverified</option>
          <option value="PENDING">Verification pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Verification rejected</option>
        </select>
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs text-slate-400">
          Trust
          <input
            type="number"
            min={0}
            max={100}
            defaultValue={trustScore}
            disabled={loading}
            onBlur={(event) => {
              const next = Number(event.target.value);
              if (Number.isInteger(next) && next >= 0 && next <= 100 && next !== trustScore) update({ trustScore: next });
            }}
            className="w-14 bg-transparent text-white outline-none"
          />
        </label>
      </div>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
