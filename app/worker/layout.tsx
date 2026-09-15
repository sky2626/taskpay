import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { WorkerSidebar } from "@/components/dashboard/WorkerSidebar";
import { getCurrentSession } from "@/lib/auth/session";

export default async function WorkerLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "WORKER") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <WorkerSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
