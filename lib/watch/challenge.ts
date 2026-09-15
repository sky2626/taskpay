import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_AGE_SECONDS = 60 * 60;

type WatchChallengePayload = {
  submissionId: string;
  taskId: string;
  userId: string;
  issuedAt: number;
  expiresAt: number;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is required for watch verification.");
  return value;
}

export function issueWatchChallenge(input: Omit<WatchChallengePayload, "issuedAt" | "expiresAt">) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload: WatchChallengePayload = { ...input, issuedAt, expiresAt: issuedAt + MAX_AGE_SECONDS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyWatchChallenge(token: string, expected: { submissionId: string; taskId: string; userId: string }) {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSignature = createHmac("sha256", secret()).update(encoded).digest("base64url");
  const actual = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (actual.length !== expectedBuffer.length || !timingSafeEqual(actual, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as WatchChallengePayload;
    if (payload.expiresAt < Math.floor(Date.now() / 1000)) return null;
    if (payload.submissionId !== expected.submissionId || payload.taskId !== expected.taskId || payload.userId !== expected.userId) return null;
    return payload;
  } catch {
    return null;
  }
}
