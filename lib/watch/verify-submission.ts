import { verifyWatchChallenge } from "@/lib/watch/challenge";

type WatchResponse = {
  watchChallenge?: string;
  watchVerification?: {
    verifiedSeconds?: number;
    hiddenSeconds?: number;
    pauseCount?: number;
    seekCount?: number;
    blurCount?: number;
    visibilityStateAtSubmit?: string;
  };
};

export function verifyWatchSubmission(input: {
  response: WatchResponse;
  submissionId: string;
  taskId: string;
  userId: string;
  minimumWatchSeconds: number;
}) {
  const challenge = input.response.watchChallenge;
  if (!challenge) return { ok: false, reason: "Missing watch challenge" } as const;

  const signed = verifyWatchChallenge(challenge, {
    submissionId: input.submissionId,
    taskId: input.taskId,
    userId: input.userId,
  });
  if (!signed) return { ok: false, reason: "Invalid or expired watch challenge" } as const;

  const signals = input.response.watchVerification;
  if (!signals || (signals.verifiedSeconds ?? 0) < input.minimumWatchSeconds) {
    return { ok: false, reason: "Minimum verified watch time was not reached" } as const;
  }
  if (signals.visibilityStateAtSubmit !== "visible") {
    return { ok: false, reason: "Watch task must be submitted from a visible tab" } as const;
  }

  const riskFlags: string[] = [];
  if ((signals.hiddenSeconds ?? 0) > input.minimumWatchSeconds) riskFlags.push("EXCESSIVE_HIDDEN_TIME");
  if ((signals.seekCount ?? 0) > 5) riskFlags.push("EXCESSIVE_SEEKING");
  if ((signals.blurCount ?? 0) > 8) riskFlags.push("EXCESSIVE_WINDOW_BLUR");

  return { ok: true, riskFlags, issuedAt: signed.issuedAt } as const;
}
