import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      verificationStatus: true,
      trustScore: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <p className="text-sm text-emerald-200">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Users</h1>
        <p className="mt-3 text-sm text-slate-400">Review account role, status, verification and trust score.</p>
      </header>

      <section className="mt-8 space-y-3">
        {users.map((user) => (
          <SpotlightCard key={user.id} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-medium text-white">{user.name ?? "Unnamed account"}</p>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Role" value={user.role} />
                <Stat label="Status" value={user.status} />
                <Stat label="Verification" value={user.verificationStatus} />
                <Stat label="Trust" value={`${user.trustScore}/100`} />
              </div>
            </div>
          </SpotlightCard>
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="min-w-28 rounded-2xl border border-white/10 bg-white/[0.025] p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xs font-medium text-white">{value.replaceAll("_", " ")}</p></div>;
}
