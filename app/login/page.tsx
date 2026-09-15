"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const result = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to sign in.");
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
            Sign in and continue building your earning history.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
            Access verified tasks, surveys, testing work, your wallet, level progress and account quality from one worker dashboard.
          </p>
        </section>

        <SpotlightCard className="p-6 sm:p-8">
          <p className="text-sm text-violet-200">Worker sign in</p>
          <h2 className="mt-2 text-2xl font-semibold">Welcome back</h2>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block">
              <span className="text-sm text-slate-300">Email</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 focus-within:border-violet-400/40">
                <Mail className="h-4 w-4 text-slate-500" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-slate-300">Password</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 focus-within:border-violet-400/40">
                <LockKeyhole className="h-4 w-4 text-slate-500" />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </label>

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
              {loading ? "Signing in..." : "Sign in"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to TaskPay?{" "}
            <Link href="/register" className="font-medium text-violet-200 hover:text-white">
              Create a worker account
            </Link>
          </p>
        </SpotlightCard>
      </div>
    </main>
  );
}
