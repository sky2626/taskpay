"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, ShieldCheck, Users, WalletCards } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Campaign review", href: "/admin/campaigns", icon: Megaphone },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: WalletCards },
  { label: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/55 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="mb-8 px-3">
        <p className="text-xs uppercase tracking-[0.32em] text-emerald-300">TaskPay</p>
        <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
          <ShieldCheck className="h-5 w-5" /> Admin
        </p>
      </Link>

      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                active
                  ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
