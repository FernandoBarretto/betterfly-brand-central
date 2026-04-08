import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Copy, Check, ArrowRight, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

function CopyBlock({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-6 group relative">
      <p className="text-green-950/50 text-xs font-semibold uppercase tracking-widest mb-3">{label}</p>
      <p className="text-green-950 text-base leading-relaxed">{content}</p>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:text-green-950 hover:border-green-400 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        {copied ? "Copied!" : "Copy this message"}
      </button>
    </div>
  );
}

const playbooks: Record<string, {
  title: string;
  tagline: string;
  valueProp: string;
  pillars: { title: string; desc: string }[];
  messages: { label: string; content: string }[];
  proofPoints: string[];
  avoid: string[];
}> = {
  carriers: {
    title: "Carriers",
    tagline: "A platform built on insurance that turns coverage into something people actually use",
    valueProp: "Betterfly is built on insurance — but we've reimagined how it reaches people. By combining insurance, preventive health, and technology, we turn traditional coverage into something employees actually use. For carriers, that means a new distribution surface embedded directly into the daily habits and wellbeing journeys of SMB employees — driving enrollment without the traditional friction.",
    pillars: [
      { title: "Distribution at scale", desc: "Reach thousands of SMB employees through a platform built on insurance that rewards healthy habits — no additional sales infrastructure required." },
      { title: "Prevention-first framing", desc: "Benefits shown in the context of healthy habits convert at higher rates. When people invest in themselves, they discover and enroll in coverage that fits their lives — prevention over claims." },
      { title: "Seamless enrollment", desc: "One-click enrollment embedded in the Betterfly experience — from healthy habit to real protection in seconds, reducing drop-off significantly." },
    ],
    messages: [
      { label: "Elevator pitch", content: "Betterfly is the employee benefits platform built on insurance that turns traditional coverage into something people actually use. We combine insurance, preventive health, and technology to reach SMB employees at the moment they're most engaged — driving higher enrollment and healthier workplaces." },
      { label: "Partner pitch (to carrier decision-maker)", content: "We're not another broker channel. We're a platform built on insurance that rewards healthy habits with real protection — putting your products in front of employees when they've already chosen to invest in themselves. That changes everything about conversion and claims." },
      { label: "Co-marketing headline", content: "[Carrier Name] + Betterfly: Coverage people actually use — built on insurance, powered by healthy habits." },
    ],
    proofPoints: [
      "2.3x higher enrollment rate vs. traditional carrier direct",
      "SMB market penetration without a dedicated sales team",
      "Prevention-linked claims reduction across active users",
      "95% employer satisfaction rate across 500+ SMB partners",
    ],
    avoid: [
      "Don't lead with 'insurance' alone — lead with outcomes. Say 'built on insurance' to frame the foundation, then pivot to engagement",
      "Avoid leading with price — lead with the fact that employees actually use the coverage",
      "Don't position as a replacement — position as a distribution layer that makes it easy for companies to invest in their people",
    ],
  },
  brokers: {
    title: "Brokers",
    tagline: "Expand your revenue while keeping your clients loyal",
    valueProp: "Betterfly is how forward-thinking brokers differentiate themselves and grow. We've rebuilt voluntary benefits from the ground up: built on insurance, powered by real health engagement, designed to work at scale for SMBs. For your clients, that means higher voluntary benefit adoption, stronger employee retention, and a benefit package their teams actually use. For you, it means a new revenue lever with 42% above-average attach rates, a retention weapon with measurable ROI from day one, and proof of differentiation that changes employee behavior and business outcomes.",
    pillars: [
      { title: "Revenue, Not Just Coverage", desc: "Brokers who add Betterfly see voluntary benefit attach rates jump 42% on average. That's not incremental revenue — that's a new line item on your P&L. And because employees stay enrolled and engaged, it's predictable, recurring revenue." },
      { title: "Stickier Clients Through Real Outcomes", desc: "Employers choose brokers who solve their biggest people problem: retention. Betterfly's prevention-first design drives actual engagement. Your clients see lower turnover. They stay." },
      { title: "You Own the Relationship", desc: "Betterfly partners with brokers — not around them. Your dedicated broker success team handles implementation, co-marketing, and day-two support. You stay the trusted advisor; we handle the heavy lifting." },
    ],
    messages: [
      { label: "Elevator pitch", content: "Betterfly is the voluntary benefits platform that solves the attach rate problem. It's built on insurance, designed for engagement, and sized perfectly for SMBs. Clients see 42% higher voluntary adoption on average, and you get a new commission stream without any operational drag. We handle onboarding, they get real results, and you stay the hero." },
      { label: "Prospect pitch", content: "Your employees want coverage that actually fits their lives — prevention, protection, and peace of mind. Betterfly combines insurance protection with real health engagement: rewards for healthy habits, personalized health insights, and benefits that work. And your broker can have it live in under 30 minutes. No HR infrastructure needed. Your team gets healthier. Your turnover goes down." },
      { label: "Internal pitch", content: "Voluntary benefits used to be a checkbox. Betterfly makes it a growth story. Your clients get a platform their employees actually use, you get a new revenue stream with 42% higher adoption rates, and our success team makes sure it all works. It's differentiation + recurring revenue + zero operational risk." },
      { label: "Value prop headline", content: "Built on insurance. Powered by engagement. Designed for brokers who want to grow." },
    ],
    proofPoints: [
      "42% average increase in voluntary benefit adoption — real attach rate improvement, not vanity metrics",
      "Dedicated broker success team — onboarding, training, go-live support, and ongoing co-marketing built in",
      "$0 implementation cost — Betterfly absorbs setup complexity; you look like a hero to your clients",
      "Sub-30-minute admin setup — no HR infrastructure required; works within existing benefit admin workflows",
      "Recurring revenue stream — employees stay enrolled; commissions don't expire at renewal",
      "Co-marketing program — lead gen, case studies, event co-hosting to help you sell and grow",
      "SMB-designed — built for 10–500 employee companies; not a watered-down enterprise tool",
    ],
    avoid: [
      "Don't oversell as an HR platform replacement — stay in the lane: 'We make voluntary benefits work'",
      "Don't lead with insurance language — avoid: policy, claims, coverage limits, ERISA compliance, plan design",
      "Don't bury the revenue story — lead with attach rate, retention, and recurring revenue impact",
      "Don't promise outcomes you can't measure — stick to adoption rates, retention lift, onboarding speed",
      "Don't position as 'another wellness tool' — Betterfly is voluntary benefits (insurance-backed protection + engagement)",
    ],
  },
  employers: {
    title: "Employers",
    tagline: "Retain your best people with benefits they actually want",
    valueProp: "Betterfly gives HR teams the clearest possible signal that benefits are working — real utilization data, real engagement, zero added complexity. Employees who engage with Betterfly are 2x more likely to renew. That's retention, not just benefits.",
    pillars: [
      { title: "Retention through engagement", desc: "Employees who use wellbeing benefits stay longer. Betterfly ties wellness habits to benefit discovery, turning a passive offering into an active retention tool." },
      { title: "Zero admin overhead", desc: "Set up in under an hour. No dedicated HR tech staff required. We handle onboarding communications. You get the data dashboard. That's it." },
      { title: "Real data, real insights", desc: "HR dashboard shows utilization, enrollment trends, and population wellbeing scores in real time. Stop guessing if your benefits are working." },
    ],
    messages: [
      { label: "Elevator pitch", content: "Betterfly is the employee benefits platform that turns passive benefit offerings into active health engagement — without adding HR complexity." },
      { label: "HR decision-maker pitch", content: "Stop guessing if your benefits are working. Betterfly gives you real utilization data while giving your employees a reason to log in, engage, and stay." },
      { label: "All-hands / town hall line", content: "We're giving every one of you access to Betterfly — your personal wellness and benefits hub. It's free, it takes five minutes to set up, and it's designed around you." },
    ],
    proofPoints: [
      "38% reduction in voluntary benefit confusion and claims issues",
      "Employees who engage with Betterfly are 2x more likely to renew",
      "Average 4.6/5 employee satisfaction score across SMB clients",
      "NPS of 71 among HR administrators",
      "Average setup time: under one hour, no dedicated HR tech staff required",
    ],
    avoid: [
      "Don't use 'perks' — it undersells the category. Use 'benefits' or 'wellbeing benefits.'",
      "Don't lead with features — lead with the employee experience and the retention outcome.",
      "Avoid 'mandatory' or 'required' — this is opt-in and choice-driven.",
      "Don't position this as an HR platform replacement. Stay in the lane: Betterfly makes voluntary benefits work.",
    ],
  },
  employees: {
    title: "Employees",
    tagline: "Your health, your way — benefits that actually work for you",
    valueProp: "Betterfly meets employees where they are — including the skeptics. From day one, you receive real protection, personalized health insights, and rewards for healthy habits. The more you invest in your health, the more Betterfly rewards you for it. That's not coincidence. That's the whole idea.",
    pillars: [
      { title: "Rewards for healthy habits", desc: "Earn Betterflies by walking, meditating, and sleeping well — then redeem them for real coverage upgrades, cash-equivalent benefits, or a donation to a cause you care about." },
      { title: "Benefits made simple", desc: "No confusing plan documents. Discover coverage that fits your life, explained in plain language, in minutes. Your employer already set you up with the basics — now build from there." },
      { title: "Prevention over claims", desc: "We help you stay well so you're not scrambling when things go wrong. Biomarker testing, telemedicine, a prevention marketplace — tools that keep you out of the doctor's office in the first place." },
    ],
    messages: [
      { label: "App onboarding message", content: "Welcome to Betterfly. This is your space to build healthy habits, explore your benefits, and protect what matters most — all in one place. Let's start with a quick goal." },
      { label: "Enrollment nudge", content: "You've earned 500 Betterflies this month. Did you know you can put those toward life insurance, dental coverage, or a donation to a cause you care about? Take two minutes to explore." },
      { label: "Monthly check-in message", content: "You walked 48,000 steps this month. That's 480 Betterflies and one step closer to your next benefit milestone. Keep going — your future self will thank you." },
      { label: "Data trust moment", content: "We know 'health data' sounds intense. Here's the truth: we use it to make Betterfly work for you. We personalize your experience, power your insights, and reward you for your healthy habits. We never sell it. We never share it with your employer. HIPAA protected. Full stop." },
    ],
    proofPoints: [
      "Average 4.8/5 app rating across 200k+ users",
      "8 in 10 users say Betterfly made benefits easy to understand",
      "40% of users enroll in at least one voluntary benefit within 60 days",
      "Top-rated wellbeing app in the voluntary benefits category",
      "Betterfly users have collectively earned over a quarter billion dollars in life insurance through their healthy habits",
    ],
    avoid: [
      "Never use 'insurance' as the lead — it creates anxiety before value is established. Say 'protection' or 'coverage.'",
      "Don't use passive voice — be direct and warm.",
      "Avoid corporate-speak. Write like a supportive friend who knows benefits.",
      "Don't add hype to milestone moments — celebrate warmly, not loudly.",
      "Don't ask for data, permissions, or enrollment decisions before you've given the employee a concrete reason to say yes.",
    ],
  },
};

const audiences = [
  { key: "carriers", label: "Carriers" },
  { key: "brokers", label: "Brokers" },
  { key: "employers", label: "Employers" },
  { key: "employees", label: "Employees" },
];

export function AudiencePlaybooks() {
  const [location] = useLocation();
  const segments = location.split("/").filter(Boolean);
  const selectedKey = segments[1] || null;
  const playbook = selectedKey ? playbooks[selectedKey] : null;

  if (!selectedKey || !playbook) {
    return (
      <div className="min-h-screen">
        <PageHeader
          eyebrow="🎯 Audience Playbooks"
          title="Choose your audience"
          subtitle="Each playbook contains messaging pillars, approved language, proof points, and copy blocks ready to use."
        />
        <div className="px-16 py-16 grid grid-cols-2 gap-6">
          {audiences.map(({ key, label }) => (
            <Link
              key={key}
              href={`/playbooks/${key}`}
              className="bg-white border border-neutral-200 rounded-2xl p-8 hover:shadow-lg transition-all group flex items-center justify-between"
            >
              <div>
                <h2 className="text-green-950 text-2xl font-bold mb-2">{label}</h2>
                <p className="text-neutral-500 text-sm">{playbooks[key].tagline}</p>
              </div>
              <ArrowRight size={20} className="text-green-950/30 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-green-950 px-16 pt-8 pb-0 relative overflow-hidden">
        <div className="flex items-center gap-2 text-white/40 text-xs mb-6 relative z-10">
          <Link href="/playbooks" className="hover:text-white transition-colors">Playbooks</Link>
          <ChevronRight size={12} />
          <span className="text-green-400">{playbook.title}</span>
        </div>
      </div>
      <PageHeader
        eyebrow={`🎯 ${playbook.title} Playbook`}
        title={playbook.title}
        subtitle={playbook.tagline}
      />

      <div className="px-16 py-16 space-y-16 max-w-4xl">
        {selectedKey === "carriers" && (
          <div>
            <Link
              href="/playbooks/carriers/overview"
              className="inline-flex items-center gap-2 bg-green-950 text-white font-semibold px-5 py-3 rounded-xl text-sm hover:bg-green-950/90 transition-all"
              data-testid="link-carrier-overview"
            >
              Carrier Overview <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {selectedKey === "brokers" && (
          <div>
            <Link
              href="/playbooks/brokers/overview"
              className="inline-flex items-center gap-2 bg-green-950 text-white font-semibold px-5 py-3 rounded-xl text-sm hover:bg-green-950/90 transition-all"
              data-testid="link-broker-overview"
            >
              Broker Overview <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <section id="value-prop">
          <h2 className="text-green-950 text-2xl font-bold mb-4">Core Value Proposition</h2>
          <p className="text-green-950/80 text-base leading-relaxed border-l-4 border-green-400 pl-6 py-2">{playbook.valueProp}</p>
        </section>

        <section id="pillars">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Messaging Pillars</h2>
          <div className="grid grid-cols-3 gap-4">
            {playbook.pillars.map((p, i) => (
              <div key={i} className="bg-green-950 rounded-xl p-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3 block">Pillar {i + 1}</span>
                <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {selectedKey === "employees" && (
          <section id="what-employees-get">
            <h2 className="text-green-950 text-2xl font-bold mb-6">What Employees Actually Get</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-green-950 rounded-xl p-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3 block">Protection Layer</span>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Employer-provided, always on</p>
                <ul className="space-y-2">
                  {[
                    "Group Life Insurance — active from day one, no action needed",
                    "Optional add-ons: Accident Insurance, Critical Illness / Cancer Coverage",
                    "Life insurance coverage that grows with your healthy habits",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm leading-snug">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0 mt-1.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-950 rounded-xl p-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3 block">Prevention Layer</span>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Employer-sponsored</p>
                <ul className="space-y-2">
                  {[
                    "Biomarker Lab Testing — a clear, plain-language picture of what's actually happening inside your body",
                    "Telemedicine — a doctor whenever you need one. No waiting rooms.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm leading-snug">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0 mt-1.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-950 rounded-xl p-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3 block">Marketplace</span>
                <ul className="space-y-2">
                  {[
                    "Exclusive access to preventive health services at rates most people never get",
                    "Nutrition, mental wellness, fitness, and lab services — the things that keep you out of the doctor's office in the first place",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm leading-snug">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0 mt-1.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-950 rounded-xl p-6">
                <span className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3 block">Rewards Layer</span>
                <ul className="space-y-2">
                  {[
                    "Betterflies (points) earned from steps, sleep, and activity tracked via connected wearable or health app",
                    "Redeem for coverage improvements, cash-equivalent benefits, or charitable donations",
                    "Betterfly users have collectively earned over a quarter billion dollars in life insurance through their healthy habits",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/70 text-sm leading-snug">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0 mt-1.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section id="messages">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Approved Messages</h2>
          <div className="space-y-4">
            {playbook.messages.map((m, i) => (
              <CopyBlock key={i} label={m.label} content={m.content} />
            ))}
          </div>
        </section>

        <section id="proof-points">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Proof Points</h2>
          <div className="grid grid-cols-2 gap-3">
            {playbook.proofPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-3 bg-neutral-100 rounded-xl p-5">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 shrink-0" />
                <p className="text-green-950 text-sm font-medium">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="avoid">
          <h2 className="text-green-950 text-2xl font-bold mb-6">What to Avoid</h2>
          <div className="space-y-3">
            {playbook.avoid.map((a, i) => (
              <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-5">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-red-500 text-xs font-bold">✕</span>
                </span>
                <p className="text-red-800 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-200 pt-12">
          <p className="text-neutral-400 text-sm font-semibold uppercase tracking-widest mb-4">Other Playbooks</p>
          <div className="flex gap-3 flex-wrap">
            {audiences.filter(a => a.key !== selectedKey).map(({ key, label }) => (
              <Link
                key={key}
                href={`/playbooks/${key}`}
                className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-green-950 font-semibold px-4 py-2.5 rounded-xl text-sm hover:border-green-400 hover:bg-green-400/5 transition-all"
              >
                {label} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
