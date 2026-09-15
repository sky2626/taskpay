"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export type SurveyQuestion = {
  id: string;
  prompt: string;
  type?: "text" | "textarea";
  required?: boolean;
};

export function SurveyRunner({ taskId, questions }: { taskId: string; questions: SurveyQuestion[] }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const answers = Object.fromEntries(questions.map((question) => [question.id, String(form.get(question.id) ?? "")]));

    const response = await fetch(`/api/surveys/${taskId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    const result = (await response.json()) as { error?: string };
    setSubmitting(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to submit survey.");
      return;
    }

    setSubmitted(true);
    router.refresh();
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.07] p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300" />
        <h2 className="mt-3 text-xl font-semibold text-white">Survey submitted</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Your response is now waiting for review. The reward will move to your wallet only after approval.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {questions.map((question, index) => (
        <label key={question.id} className="block rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Question {index + 1}</span>
          <span className="mt-2 block text-sm font-medium text-white">{question.prompt}</span>
          {question.type === "textarea" ? (
            <textarea name={question.id} required={question.required !== false} className="field-input mt-4 min-h-28 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3" />
          ) : (
            <input name={question.id} required={question.required !== false} className="field-input mt-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3" />
          )}
        </label>
      ))}

      {error ? <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div> : null}

      <button type="submit" disabled={submitting || questions.length === 0} className="inline-flex w-full items-center justify-center rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50">
        {submitting ? "Submitting..." : "Submit survey"}
      </button>
    </form>
  );
}
