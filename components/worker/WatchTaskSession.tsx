"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function WatchTaskSession({ taskId, videoUrl, minimumWatchSeconds, verificationQuestion }: { taskId: string; videoUrl: string; minimumWatchSeconds: number; verificationQuestion: string }) {
  const router = useRouter();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [answer, setAnswer] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [started]);

  async function begin() {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/tasks/${taskId}/accept`, { method: "POST" });
    const result = (await response.json()) as { error?: string; submissionId?: string };
    setLoading(false);
    if (!response.ok || !result.submissionId) {
      setError(result.error ?? "Unable to start this task.");
      return;
    }
    setSubmissionId(result.submissionId);
    setStarted(true);
  }

  async function submit() {
    if (!submissionId) return;
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/submissions/${submissionId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responseData: { watchedSeconds: seconds, verificationAnswer: answer.trim() } }),
    });
    const result = (await response.json()) as { error?: string };
    setLoading(false);
    if (!response.ok) {
      setError(result.error ?? "Unable to submit task.");
      return;
    }
    router.push("/worker/tasks");
    router.refresh();
  }

  const complete = seconds >= minimumWatchSeconds;

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
        {started ? <video src={videoUrl} controls autoPlay className="aspect-video w-full" /> : <div className="flex aspect-video items-center justify-center text-sm text-slate-500">Start the task to load the campaign video.</div>}
      </div>

      {!started ? <button onClick={begin} disabled={loading} className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium text-white disabled:opacity-60">{loading ? "Starting..." : "Start Watch & Earn task"}</button> : null}

      {started ? (
        <>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-4 text-sm"><span className="text-slate-400">Verified watch timer</span><span className={complete ? "font-medium text-emerald-300" : "font-medium text-white"}>{Math.min(seconds, minimumWatchSeconds)} / {minimumWatchSeconds}s</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${Math.min(100, (seconds / minimumWatchSeconds) * 100)}%` }} /></div>
          </div>

          <label className="block"><span className="text-sm text-slate-300">{verificationQuestion}</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} className="field-input mt-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" placeholder="Your answer" /></label>

          <button onClick={submit} disabled={loading || !complete || answer.trim().length < 2} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Submitting..." : "Submit for review"}</button>
        </>
      ) : null}

      {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div> : null}
    </div>
  );
}
