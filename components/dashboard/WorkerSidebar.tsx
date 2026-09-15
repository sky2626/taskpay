"use client";

import Link from "next/link";
import {
  BadgeDollarSign,
  Bell,
  CircleUserRound,
  ClipboardList,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Settings,
  Sparkles,
  WalletCards,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/worker", icon: LayoutDashboard },
  { label: "Earn", href: "/worker/earn", icon: BadgeDollarSign },
  { label: "Tasks", href: "/worker/tasks", icon: ListChecks },
  { label: "Surveys", href: "/worker/surveys", icon: ClipboardList },
  { label: "AI Tasks", href: "/worker/ai-tasks", icon: Sparkles },
  { label: "Wallet", href: "/worker/wallet", icon: WalletCards },
  { label: "Activity", href: "/worker/activity", icon: LineChart },
];

export function WorkerSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/55 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="mb-8 px-3">
        <p className="text-xs uppercase tracking-[0.32em] text-violet-300">TaskPay</p>
        <p className="mt-1 text-lg font-semibold text-white">Worker App</p>
      </Link>

      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon }, index) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
              index === 0
                ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/10 pt-5">
        <Link href="/worker/notifications" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          <Bell className="h-4 w-4" /> Notifications
        </Link>
        <Link href="/worker/profile" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          <CircleUserRound className="h-4 w-4" /> Profile
        </Link>
        <Link href="/worker/settings" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </div>
    </aside>
  );
}
