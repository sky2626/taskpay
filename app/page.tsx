const pillars = [
  { title: "Earn", text: "Complete verified ads, surveys, testing and microtasks." },
  { title: "Grow", text: "Build trust, skills and access to higher-value opportunities." },
  { title: "Launch", text: "Businesses fund campaigns and pay for legitimate human work." },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-10">
      <nav className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Human task marketplace</p>
          <h1 className="mt-1 text-2xl font-semibold">TaskPay</h1>
        </div>
        <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
          Foundation build
        </span>
      </nav>

      <section className="grid flex-1 items-center gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            Real tasks. Transparent rewards. Business-funded work.
          </p>
          <h2 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
            A trusted marketplace for people to <span className="text-violet-300">earn by doing real work.</span>
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
            TaskPay connects businesses that need verified human participation with workers completing ads, surveys,
            software tests, research and data tasks.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-2xl bg-violet-500 px-6 py-3 font-medium text-white shadow-lg shadow-violet-900/30">
              Worker experience
            </button>
            <button className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-medium text-white">
              Business experience
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-6">
            <p className="text-sm text-slate-400">Available balance</p>
            <p className="mt-2 text-4xl font-semibold">GH₵ 428.50</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs text-slate-400">Pending</p>
                <p className="mt-1 text-xl font-medium">GH₵ 73.20</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs text-slate-400">Trust score</p>
                <p className="mt-1 text-xl font-medium">94 / 100</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
              <div className="flex justify-between text-sm">
                <span>Level 2 — Plus</span>
                <span>78%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-violet-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 pb-12 md:grid-cols-3">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h3 className="text-xl font-semibold">{pillar.title}</h3>
            <p className="mt-3 leading-7 text-slate-400">{pillar.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
