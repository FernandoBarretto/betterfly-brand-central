import { Link } from "wouter";
import { ArrowRight, Zap, BarChart2, Shield, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const BARLOW = "'Obviously Narrow', sans-serif";

const steps = [
  {
    num: 1,
    title: "Read the Intel Digest",
    desc: "Start with the macro view. The Intel Digest is an AI-generated competitive landscape analysis that surfaces the biggest shifts, emerging players, and strategic themes across the benefits industry. Updated twice a week.",
    cta: "Open Intel Digest",
    path: "/market-intelligence/intel-digest",
    icon: Zap,
    accent: "#19f578",
  },
  {
    num: 2,
    title: "Dive into Battle Cards",
    desc: "Go deeper on specific competitors. Each battle card breaks down their positioning, strengths, weaknesses, and the objection-handling talking points you need for conversations where they come up.",
    cta: "Open Battle Cards",
    path: "/market-intelligence/battle-cards",
    icon: Shield,
    accent: "#5FFFF3",
  },
  {
    num: 3,
    title: "Check the Competitive Overview",
    desc: "See how Betterfly's campaigns and messaging compare against the field. This view benchmarks our creative output, key claims, and positioning against what competitors are saying in market.",
    cta: "Open Competitive Overview",
    path: "/market-intelligence/trends",
    icon: BarChart2,
    accent: "#E8FB10",
  },
];

export function CompetitiveReview() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Use Case"
        title="Competitive Review"
        subtitle="Stay current on the competitive landscape and how our campaigns measure up."
      />

      <div className="px-5 sm:px-8 lg:px-16 py-12 sm:py-16">
        <div className="max-w-3xl mb-10">
          <div className="bg-green-950 rounded-2xl p-6 sm:p-8">
            <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-3">Scenario</p>
            <p className="text-white/80 text-sm leading-relaxed">
              You need to understand where Betterfly stands relative to the competition — maybe before a strategic planning session, a board update, or a pitch where you know a competitor will come up. This workflow takes you from the big picture down to specific competitor details.
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
              After completing these steps you'll have a full competitive picture — macro trends, specific competitor intel, and benchmarking data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
