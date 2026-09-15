"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  PlusCircle,
  Settings,
  UsersRound,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/business", icon: LayoutDashboard },
  { label: "Campaigns", href: "/business/campaigns", icon: Megaphone },
  { label: "Create campaign", href: "/business/campaigns/new", icon: PlusCircle },
  { label: "Audience", href: "/business/audience", icon: UsersRound },
  { label: "Analytics", href: "/business/analytics", icon: BarChart3 },
  { label: "Billing", href: "/business/billing", icon: CreditCard },
];

export function BusinessSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/55 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="mb-8 px-3">
        <p className="text-xs uppercase tracking-[0.32em] text-violet-300">TaskPay</p>
        <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-white">
          <Building2 className="h-5 w-5" /> Business
        </p>
      </Link>

      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/business" && pathname.startsWith(`${href}/`));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${
                active
                  ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-5">
        <Link href="/business/settings" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </div>
    </aside>
  );
}
