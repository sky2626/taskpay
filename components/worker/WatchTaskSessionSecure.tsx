"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function WatchTaskSessionSecure(props: { taskId: string; videoUrl: string; minimumWatchSeconds: number; verificationQuestion: string }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [submissionId, setSubmissionId] = useState("");
  const [challenge, setChallenge] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [answer, setAnswer] = useState("");
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!started) return;
    const timer = window.setInterval(() => {
      const video = videoRef.current;
      if (document.visibilityState === "visible" && video && !video.paused && !video.ended && video.readyState >= 2) {
        setSeconds((value) => value + 1);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started]);

  async function begin() {
    setBusy(true);
    setError("");
    const accepted = await fetch(`/api/tasks/${props.taskId}/accept`, { method: "POST" });
    const acceptedData = await accepted.json() as { submissionId?: string; error?: string };
    if (!accepted.ok || !acceptedData.submissionId) {
      setBusy(false);
      setError(acceptedData.error ?? "Unable to start task.");
      return;
    }

    const issued = await fetch(`/api/watch/${acceptedData.submissionId}/challenge`, { method: "POST" });
    const issuedData = await issued.json() as { challenge?: string; error?: string };
    setBusy(false);
    if (!issued.ok || !issuedData.challenge) {
      setError(issuedData.error ?? "Unable to create verification session.");
      return;
    }

    setSubmissionId(acceptedData.submissionId);
    setChallenge(issuedData.challenge);
    setStarted(true);
  }

  async function submit() {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/submissions/${submissionId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responseData: {
        verificationAnswer: answer.trim(),
        watchChallenge: challenge,
        watchVerification: { verifiedSeconds: seconds, visibilityStateAtSubmit: visible ? "visible" : "hidden" },
      } }),
    });
    const data = await response.json() as { error?: string };
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Unable to submit task.");
      return;
    }
    router.push("/worker/tasks");
    router.refresh();
  }

  const complete = seconds >= props.minimumWatchSeconds;

  return <div className="space-y-5">
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      {started ? <video ref={videoRef} src={props.videoUrl} controls playsInline className="aspect-video w-full" /> : <div className="flex aspect-video items-center justify-center text-sm text-slate-500">Start the task to load the video.</div>}
    </div>
    {!started ? <button onClick={begin} disabled={busy} className="w-full rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium disabled:opacity-50">{busy ? "Starting..." : "Start verified session"}</button> : <>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm"><div className="flex justify-between"><span className="text-slate-400">Verified active time</span><span>{Math.min(seconds, props.minimumWatchSeconds)} / {props.minimumWatchSeconds}s</span></div></div>
      <label className="block"><span className="text-sm text-slate-300">{props.verificationQuestion}</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} className="field-input mt-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" /></label>
      <button onClick={submit} disabled={busy || !complete || !visible || answer.trim().length < 2} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-medium disabled:opacity-50">{busy ? "Submitting..." : "Submit for review"}</button>
    </>}
    {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div> : null}
  </div>;
}
