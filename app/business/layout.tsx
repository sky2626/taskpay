import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { BusinessSidebar } from "@/components/dashboard/BusinessSidebar";
import { getCurrentSession } from "@/lib/auth/session";

export default async function BusinessLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "BUSINESS") {
    redirect(session.user.role === "WORKER" ? "/worker" : "/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <BusinessSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
