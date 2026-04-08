import { Link } from "wouter";
import { ArrowRight, Shield, Target, Sparkles, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const BARLOW = "'Obviously Narrow', sans-serif";

const steps = [
  {
    num: 1,
    title: "Check the Battle Card",
    desc: "Start with the latest competitive intel. See how Betterfly — built on insurance but designed for engagement — stacks up against the carriers and platforms your broker already knows. Objection handling, win themes, and positioning traps to avoid.",
    cta: "Open Battle Cards",
    path: "/market-intelligence/battle-cards",
    icon: Shield,
    accent: "#19f578",
  },
  {
    num: 2,
    title: "Pull the Brokers Playbook",
    desc: "Get the audience-specific messaging pillars — rooted in the core value prop — along with approved proof points and elevator pitches designed for broker conversations. Everything here is pre-approved — no guesswork.",
    cta: "Open Brokers Playbook",
    path: "/playbooks/brokers",
    icon: Target,
    accent: "#5FFFF3",
  },
  {
    num: 3,
    title: "Create Custom Materials",
    desc: "Use the Asset Generator to create a brand-compliant leave-behind that echoes the value prop. Pick \"One-Pager\" as the format, select \"Brokers\" as your audience, describe the meeting context, and it drafts in seconds.",
    cta: "Open Asset Generator",
    path: "/asset-generator",
    icon: Sparkles,
    accent: "#E8FB10",
  },
];

export function BrokerMeetingPrep() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Use Case"
        title="Get Smart"
        subtitle="Prepare for broker and carrier conversations with competitive context and audience insight."
      />

      <div className="px-5 sm:px-8 lg:px-16 py-12 sm:py-16">
        <div className="max-w-3xl mb-10">
          <div className="bg-green-950 rounded-2xl p-6 sm:p-8">
            <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-3">Scenario</p>
            <p className="text-white/80 text-sm leading-relaxed">
              You have a broker meeting coming up — maybe it's a first call with a new partner, a renewal conversation, or a pitch alongside a carrier. Remember: Betterfly is built on insurance, but what we're really selling is coverage people actually use. This workflow gets you prepped in three steps: know the competition, know your messaging, and walk in with a polished leave-behind.
            </p>
          </div>
        </div>

        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-8">Your workflow</p>

        <div className="max-w-3xl space-y-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-[23px] top-[56px] bottom-[-24px] w-px bg-neutral-200" />
              )}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-5">
                  <div
                    className="w-[46px] h-[46px] rounded-2xl flex items-center justify-center shrink-0 relative z-10"
                    style={{ backgroundColor: step.accent + "18" }}
                  >
                    <span
                      className="font-black text-lg"
                      style={{ fontFamily: BARLOW, color: step.accent === "#E8FB10" ? "#042914" : step.accent }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-green-950 font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-5">{step.desc}</p>
                    <Link
                      href={step.path}
                      className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-green-950 text-white hover:bg-green-950/80 transition-colors"
                    >
                      <step.icon size={14} />
                      {step.cta}
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mt-10">
          <div className="flex items-center gap-3 bg-green-400/10 rounded-xl px-5 py-4">
            <CheckCircle2 size={18} className="text-green-400 shrink-0" />
            <p className="text-green-950 text-sm font-medium">
              After completing these steps you'll have competitive context, value-prop-aligned messaging, and a leave-behind ready to share.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
