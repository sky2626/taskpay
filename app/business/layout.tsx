import type { ReactNode } from "react";
import { BusinessSidebar } from "@/components/dashboard/BusinessSidebar";

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <BusinessSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
