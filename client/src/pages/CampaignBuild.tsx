import { Link } from "wouter";
import { ArrowRight, Mic2, Palette, Sparkles, FolderOpen, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const BARLOW = "'Obviously Narrow', sans-serif";

const steps = [
  {
    num: 1,
    title: "Review the Brand Voice",
    desc: "Before writing anything, check the tone guidelines, approved terminology, and audience-specific messaging rules. This ensures every word in your campaign sounds like Betterfly.",
    cta: "Open Brand Voice",
    path: "/brand-guidelines/tone",
    icon: Mic2,
    accent: "#19f578",
  },
  {
    num: 2,
    title: "Check Visual Identity",
    desc: "Pull the latest color palette, typography rules, and logo usage guidelines. Use these as your design foundation — every visual element should trace back to the brand system.",
    cta: "Open Visual Identity",
    path: "/brand-guidelines/visual-identity",
    icon: Palette,
    accent: "#5FFFF3",
  },
  {
    num: 3,
    title: "Grab Templates",
    desc: "Browse the template library for pre-built formats — social posts, event materials, slide decks, and outreach emails. Start from a template to save time and stay consistent.",
    cta: "Open Templates",
    path: "/templates",
    icon: FolderOpen,
    accent: "#fbbf24",
  },
  {
    num: 4,
    title: "Generate Campaign Assets",
    desc: "Use the Asset Generator to create one-pagers, decks, or LinkedIn posts grounded in your brand context. Claude drafts it using playbook data, proof points, and brand voice — ready in seconds.",
    cta: "Open Asset Generator",
    path: "/asset-generator",
    icon: Sparkles,
    accent: "#E8FB10",
  },
];

export function CampaignBuild() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="Use Case"
        title="Campaign Build"
        subtitle="Build on-brand campaigns using Betterfly's visual and messaging standards."
      />

      <div className="px-5 sm:px-8 lg:px-16 py-12 sm:py-16">
        <div className="max-w-3xl mb-10">
          <div className="bg-green-950 rounded-2xl p-6 sm:p-8">
            <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-3">Scenario</p>
            <p className="text-white/80 text-sm leading-relaxed">
              You're launching a campaign — maybe a LinkedIn series, an event push, or a new broker outreach sequence. This workflow walks you through the brand foundations first, then helps you build assets that are on-brand from the start. No retroactive fixes, no brand review bottlenecks.
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
              After completing these steps you'll have brand-aligned messaging, visuals, and ready-to-publish campaign assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
