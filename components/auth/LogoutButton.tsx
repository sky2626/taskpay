"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
