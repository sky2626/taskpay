"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ClipboardList, PlayCircle, Sparkles, TestTube2 } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";

const campaignTypes = [
  { id: "WATCH", label: "Watch & Earn", description: "Verified promotional video engagement", icon: PlayCircle },
  { id: "SURVEY", label: "Survey", description: "Structured research and questionnaires", icon: ClipboardList },
  { id: "AI", label: "AI Task", description: "Human labeling and evaluation work", icon: Sparkles },
  { id: "TEST", label: "Testing", description: "Website and application testing", icon: TestTube2 },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [type, setType] = useState("SURVEY");
  const [participants, setParticipants] = useState(100);
  const [reward, setReward] = useState(5);
  const [surveyQuestions, setSurveyQuestions] = useState("How often do you use mobile banking?\nWhat feature matters most to you?\nWhat would make you switch providers?");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimate = useMemo(() => {
    const workerCost = Math.max(0, participants) * Math.max(0, reward);
    const platformFee = workerCost * 0.25;
    return { workerCost, platformFee, total: workerCost + platformFee };
  }, [participants, reward]);

  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const questions = surveyQuestions
      .split("\n")
      .map((question) => question.trim())
      .filter(Boolean)
      .map((prompt, index) => ({ id: `q${index + 1}`, prompt, type: index === 0 ? "text" : "textarea", required: true }));

    const response = await fetch("/api/business/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description"),
        category: type,
        countryCode: form.get("countryCode"),
        minimumLevel: Number(form.get("minimumLevel")),
        participants,
        rewardMinor: Math.round(reward * 100),
        configuration: type === "SURVEY" ? { questions } : {},
      }),
    });

    const result = (await response.json()) as { error?: string; campaignId?: string };
    setSaving(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to save campaign draft.");
      return;
    }

    router.push("/business/campaigns");
    router.refresh();
  }

  return (
    <div className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <header className="border-b border-white/10 pb-7">
        <Link href="/business" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="h-4 w-4" /> Business dashboard</Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Create a campaign</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Build the campaign first. Funding, review, fraud controls and publishing are separate steps before workers can see it.</p>
      </header>

      <form onSubmit={saveDraft} className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <SpotlightCard className="p-6">
            <p className="text-sm text-violet-200">Step 1</p>
            <h2 className="mt-1 text-xl font-semibold">Choose campaign type</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {campaignTypes.map(({ id, label, description, icon: Icon }) => {
                const selected = id === type;
                return (
                  <button key={id} type="button" onClick={() => setType(id)} className={`rounded-2xl border p-4 text-left transition ${selected ? "border-violet-400/40 bg-violet-500/10" : "border-white/10 bg-white/[0.025] hover:border-white/20"}`}>
                    <div className="flex items-start gap-3"><div className="rounded-xl bg-white/5 p-2 text-violet-200"><Icon className="h-5 w-5" /></div><div><p className="font-medium text-white">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div></div>
                  </button>
                );
              })}
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6">
            <p className="text-sm text-violet-200">Step 2</p>
            <h2 className="mt-1 text-xl font-semibold">Campaign details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2"><span className="text-sm text-slate-300">Campaign name</span><input name="name" required minLength={3} className="field-input mt-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" placeholder="e.g. Mobile banking research" /></label>
              <label className="block sm:col-span-2"><span className="text-sm text-slate-300">Instructions</span><textarea name="description" required minLength={10} className="field-input mt-2 min-h-28 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" placeholder="Explain exactly what workers need to do." /></label>
              <label className="block"><span className="text-sm text-slate-300">Country</span><select name="countryCode" className="field-input mt-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" defaultValue="GH"><option value="GH">Ghana</option></select></label>
              <label className="block"><span className="text-sm text-slate-300">Minimum worker level</span><select name="minimumLevel" className="field-input mt-2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" defaultValue="0"><option value="0">Free / Level 0</option><option value="1">Level 1+</option><option value="2">Level 2+</option><option value="3">Level 3+</option></select></label>
            </div>
          </SpotlightCard>

          {type === "SURVEY" ? (
            <SpotlightCard className="p-6">
              <p className="text-sm text-violet-200">Survey setup</p>
              <h2 className="mt-1 text-xl font-semibold">Questions</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Enter one question per line. This is the MVP survey builder; richer question types can be added later.</p>
              <textarea value={surveyQuestions} onChange={(event) => setSurveyQuestions(event.target.value)} className="field-input mt-5 min-h-40 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" />
            </SpotlightCard>
          ) : null}

          <SpotlightCard className="p-6">
            <p className="text-sm text-violet-200">Step 3</p>
            <h2 className="mt-1 text-xl font-semibold">Capacity and worker reward</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block"><span className="text-sm text-slate-300">Participants</span><input type="number" min={1} value={participants} onChange={(event) => setParticipants(Number(event.target.value))} className="field-input mt-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" /></label>
              <label className="block"><span className="text-sm text-slate-300">Reward per completed task (GH₵)</span><input type="number" min={0.1} step={0.1} value={reward} onChange={(event) => setReward(Number(event.target.value))} className="field-input mt-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3" /></label>
            </div>
          </SpotlightCard>
        </div>

        <div>
          <SpotlightCard className="sticky top-8 p-6" spotlightColor="rgba(16, 185, 129, 0.16)">
            <p className="text-sm text-slate-400">Draft estimate</p><h2 className="mt-1 text-xl font-semibold">Campaign economics</h2>
            <div className="mt-6 space-y-3 text-sm"><PriceRow label="Worker rewards" value={estimate.workerCost} /><PriceRow label="Platform fee (25%)" value={estimate.platformFee} /><div className="border-t border-white/10 pt-3"><PriceRow label="Estimated total" value={estimate.total} strong /></div></div>
            <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4 text-xs leading-5 text-emerald-100/80">This is an estimate only. Creating a draft does not charge the business or publish tasks to workers.</div>
            {error ? <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div> : null}
            <button type="submit" disabled={saving || (type === "SURVEY" && surveyQuestions.trim().length === 0)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 px-4 py-3 text-sm font-medium transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"><CheckCircle2 className="h-4 w-4" /> {saving ? "Saving draft..." : "Save draft"}</button>
          </SpotlightCard>
        </div>
      </form>
    </div>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return <div className="flex items-center justify-between gap-4"><span className={strong ? "font-medium text-white" : "text-slate-400"}>{label}</span><span className={strong ? "text-lg font-semibold text-white" : "text-slate-200"}>{new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(value || 0)}</span></div>;
}
