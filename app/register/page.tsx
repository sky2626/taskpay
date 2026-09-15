"use client";

import Link from "next/link";
import { FormEvent, type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        countryCode: form.get("countryCode"),
      }),
    });

    const result = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to create your account.");
      return;
    }

    router.push("/worker");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section>
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-300">
            TaskPay
          </Link>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Create your worker account and start with transparent task rewards.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
            Your account begins at the free level. Task eligibility grows with verification, quality, trust and skills—not simply because you paid for access.
          </p>
        </section>

        <SpotlightCard className="p-6 sm:p-8">
          <p className="text-sm text-violet-200">Worker registration</p>
          <h2 className="mt-2 text-2xl font-semibold">Create your account</h2>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <Field icon={UserRound} label="Full name">
              <input name="name" type="text" required minLength={2} autoComplete="name" className="field-input" placeholder="Your full name" />
            </Field>

            <Field icon={Mail} label="Email">
              <input name="email" type="email" required autoComplete="email" className="field-input" placeholder="you@example.com" />
            </Field>

            <Field icon={Globe2} label="Country code">
              <input name="countryCode" type="text" required defaultValue="GH" maxLength={3} className="field-input uppercase" aria-label="Country code" />
            </Field>

            <Field icon={LockKeyhole} label="Password">
              <input name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className="field-input" placeholder="Minimum 8 characters" />
            </Field>

            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create worker account"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Membership and higher worker levels do not guarantee earnings. Rewards depend on real funded tasks you qualify for and complete successfully.
          </p>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-violet-200 hover:text-white">
              Sign in
            </Link>
          </p>
        </SpotlightCard>
      </div>
    </main>
  );
}

type FieldProps = {
  icon: typeof UserRound;
  label: string;
  children: ReactNode;
};

function Field({ icon: Icon, label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 focus-within:border-violet-400/40">
        <Icon className="h-4 w-4 shrink-0 text-slate-500" />
        {children}
      </div>
    </label>
  );
}
