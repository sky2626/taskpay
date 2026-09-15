import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const taskTypes = [
  {
    icon: PlayCircle,
    title: "Watch & Earn",
    text: "Complete verified viewing tasks and answer simple checks when required.",
  },
  {
    icon: ClipboardCheck,
    title: "Paid Surveys",
    text: "Share useful opinions through structured surveys created by businesses and researchers.",
  },
  {
    icon: Sparkles,
    title: "AI & Data Tasks",
    text: "Help with labeling, validation, research and other human-in-the-loop tasks.",
  },
  {
    icon: BadgeCheck,
    title: "Testing Tasks",
    text: "Test websites, apps and product experiences and submit structured feedback.",
  },
];

const steps = [
  { number: "01", title: "Create an account", text: "Register as a worker or business and complete the required profile details." },
  { number: "02", title: "Find or launch work", text: "Workers discover eligible tasks while businesses create targeted campaigns." },
  { number: "03", title: "Verify completion", text: "TaskPay records submissions and verification signals before a reward is approved." },
  { number: "04", title: "Track your money", text: "Approved rewards appear in the worker wallet with a transparent transaction history." },
];

const trustPoints = [
  "Business-funded campaigns rather than promised investment returns",
  "Task review and approval before rewards are credited",
  "Account trust scores and moderation tools",
  "Ledger-backed wallet and withdrawal records",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08111f]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500 font-bold text-white shadow-lg shadow-violet-950/40 transition group-hover:scale-105">
              TP
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">TaskPay</p>
              <p className="hidden text-[10px] uppercase tracking-[0.28em] text-slate-500 sm:block">Human task marketplace</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
            <a className="transition hover:text-white" href="#how-it-works">How it works</a>
            <a className="transition hover:text-white" href="#opportunities">Opportunities</a>
            <a className="transition hover:text-white" href="#businesses">For businesses</a>
            <a className="transition hover:text-white" href="#trust">Trust & safety</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-4">
              Log in
            </Link>
            <Link href="/register" className="rounded-xl bg-violet-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-400 sm:px-4">
              Start earning
            </Link>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:pb-28 lg:pt-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-200">
              <ShieldCheck className="h-4 w-4" /> Verified work. Transparent rewards.
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Turn your time and skills into <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">real earning opportunities.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              TaskPay connects people with legitimate paid tasks from businesses — including surveys, ad-viewing tasks, testing, research, AI data work and other verified microtasks.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-500 px-6 py-3.5 font-medium text-white shadow-xl shadow-violet-950/35 transition hover:-translate-y-0.5 hover:bg-violet-400">
                Create worker account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/register-business" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                Advertise with TaskPay <BriefcaseBusiness className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Free worker registration</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Trackable task history</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Wallet-based rewards</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-8 rounded-[3rem] bg-violet-500/10 blur-3xl" />
            <div className="relative w-full max-w-xl rounded-[2.2rem] border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="rounded-[1.7rem] border border-white/10 bg-[#0b1422]/90 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Available balance</p>
                    <p className="mt-2 text-4xl font-semibold tracking-tight">GH₵ 428.50</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <CircleDollarSign className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-xs text-slate-500">Pending review</p>
                    <p className="mt-1 text-xl font-medium">GH₵ 73.20</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-xs text-slate-500">Trust score</p>
                    <p className="mt-1 text-xl font-medium">94 / 100</p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
                  <div className="flex justify-between text-sm">
                    <span>Level 2 — Plus</span>
                    <span className="text-violet-200">78%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[78%] rounded-full bg-violet-400" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3"><PlayCircle className="h-5 w-5 text-violet-300" /><div><p className="text-sm font-medium">Watch & verify</p><p className="text-xs text-slate-500">Approx. 3 minutes</p></div></div>
                    <span className="text-sm font-medium text-emerald-300">GH₵ 2.50</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-violet-300" /><div><p className="text-sm font-medium">Consumer survey</p><p className="text-xs text-slate-500">8 questions</p></div></div>
                    <span className="text-sm font-medium text-emerald-300">GH₵ 5.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="opportunities" className="border-y border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-violet-300">Worker opportunities</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Different ways to earn from completed work</h2>
            <p className="mt-4 leading-7 text-slate-400">Task availability and reward values depend on active business campaigns, eligibility and successful task review.</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {taskTypes.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-3xl border border-white/10 bg-[#0b1422]/70 p-6 transition hover:-translate-y-1 hover:border-violet-400/30">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-medium text-violet-300">How TaskPay works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A clear path from task to reward</h2>
            <p className="mt-5 leading-7 text-slate-400">The platform is being designed around verified completion, reviewable submissions and transparent wallet records.</p>
            <Link href="/register" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-violet-200 hover:text-white">Join as a worker <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step) => (
              <article key={step.number} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-semibold text-violet-300">{step.number}</p>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="businesses" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-violet-400/20 bg-gradient-to-br from-violet-500/15 via-white/[0.035] to-emerald-400/5 p-7 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-200"><BriefcaseBusiness className="h-6 w-6" /></div>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Need verified human participation?</h2>
              <p className="mt-5 max-w-2xl leading-7 text-slate-300">Create campaigns, define worker eligibility, set task rewards, review submissions and track campaign activity from one business dashboard.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/register-business" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Create business account <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/login" className="inline-flex items-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5">Business login</Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Metric icon={Users} label="Audience targeting" value="Level + country" />
              <Metric icon={BarChart3} label="Campaign control" value="Draft to publish" />
              <Metric icon={ClipboardCheck} label="Submission review" value="Approve or reject" />
              <Metric icon={CircleDollarSign} label="Budget visibility" value="Reward + fee" />
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="border-y border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-sm font-medium text-emerald-300">Trust & safety</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Built around accountable work, not guaranteed income</h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-400">TaskPay is a work marketplace. Earnings depend on available tasks, eligibility, successful completion and approval. The platform does not promise fixed or guaranteed returns.</p>
          </div>
          <div className="space-y-3">
            {trustPoints.map((point) => (
              <div key={point} className="flex gap-3 rounded-2xl border border-white/10 bg-[#0b1422]/70 p-4 text-sm text-slate-300">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-violet-300">Ready to begin?</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Choose how you want to use TaskPay.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">Join as a worker to find paid opportunities or create a business account to launch campaigns.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/register" className="rounded-2xl bg-violet-500 px-6 py-3.5 font-medium text-white transition hover:bg-violet-400">Join as worker</Link>
            <Link href="/register-business" className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-medium text-white transition hover:bg-white/10">Join as business</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#060d17]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500 font-bold text-white">TP</div>
                <div><p className="font-semibold">TaskPay</p><p className="text-xs text-slate-500">Work. Verify. Earn.</p></div>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">A marketplace connecting businesses with people who complete legitimate, reviewable human tasks.</p>
            </div>

            <FooterColumn title="Workers" links={[['Create account','/register'],['Log in','/login'],['How it works','#how-it-works'],['Opportunities','#opportunities']]} />
            <FooterColumn title="Businesses" links={[['Business registration','/register-business'],['Business login','/login'],['Campaigns','#businesses'],['Trust & safety','#trust']]} />
            <FooterColumn title="Platform" links={[['Home','/'],['Trust & safety','#trust'],['Login','/login'],['Get started','/register']]} />
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} TaskPay. All rights reserved.</p>
            <p>Rewards are subject to task availability, eligibility, verification and approval.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#08111f]/65 p-5">
      <Icon className="h-5 w-5 text-violet-300" />
      <p className="mt-4 text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
        {links.map(([label, href]) => href.startsWith('#') ? (
          <a key={label} href={href} className="transition hover:text-white">{label}</a>
        ) : (
          <Link key={label} href={href} className="transition hover:text-white">{label}</Link>
        ))}
      </div>
    </div>
  );
}
