import { useState, useRef, useEffect } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

function CopyBlock({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-6 group relative">
      <p className="text-green-950/50 text-xs font-semibold uppercase tracking-widest mb-3">{label}</p>
      <p className="text-green-950 text-base leading-relaxed">{content}</p>
      <button
        onClick={() => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:text-green-950 hover:border-green-400 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function RuleCard({ num, title, desc, bad, good, badLabel, goodLabel }: {
  num: number; title: string; desc: string;
  bad?: string; good?: string; badLabel?: string; goodLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const hasExamples = bad || good;
  return (
    <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => hasExamples && setOpen(!open)}
        className={`w-full text-left px-6 py-5 flex items-start gap-4 ${hasExamples ? "cursor-pointer hover:bg-neutral-50" : "cursor-default"} transition-colors`}
      >
        <span className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-green-400 text-sm font-bold">{num}</span>
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="text-green-950 font-bold text-base mb-1">{title}</h4>
          <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
        </div>
        {hasExamples && (
          <ChevronDown size={16} className={`text-neutral-400 shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      {hasExamples && open && (
        <div className="px-6 pb-5 pt-0 grid grid-cols-2 gap-3 ml-12">
          {bad && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mb-2">{badLabel || "Don\u2019t"}</p>
              <p className="text-red-800 text-sm leading-relaxed italic">{bad}</p>
            </div>
          )}
          {good && (
            <div className="bg-green-50 border border-green-400/20 rounded-xl p-4">
              <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-2">{goodLabel || "Do"}</p>
              <p className="text-green-950 text-sm leading-relaxed italic">{good}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const valueProps = [
  { text: "Betterfly is an employee benefits platform built on insurance \u2014 designed to make it easy for companies to invest in their people and rewarding for people to invest in themselves.", highlight: "built on insurance" },
  { text: "By combining insurance, preventive health, and technology, Betterfly turns traditional coverage into something people actually use \u2014 helping organizations create healthier workplaces across Latin America, Europe, and now the United States.", highlight: "something people actually use" },
  { text: "From day one, employees receive real protection, personalized health insights, and rewards for healthy habits.", highlight: "rewards for healthy habits" },
  { text: "Meanwhile, employers get a simple way to drive engagement, understand workforce health trends, and build stronger, more productive teams.", highlight: "stronger, more productive teams" },
];

const contentRules: { num: number; title: string; desc: string; bad?: string; good?: string; badLabel?: string; goodLabel?: string }[] = [
  {
    num: 1,
    title: "Benefits first, features second",
    desc: "Think like a restaurant menu. You don\u2019t sell \u201Cwe use a special oven at 400 degrees\u201D \u2014 you sell \u201Cthe perfect pizza to share with friends.\u201D People care less about how you do it and more about what they get. Always lead with the benefit, then explain the how (only if it adds value).",
    bad: "\u201COur AI-powered diagnostic platform provides comprehensive health analytics.\u201D",
    good: "\u201CGet personalized insights that actually help you take control of your health.\u201D",
  },
  {
    num: 2,
    title: "Buddy speaks as \u201Cwe,\u201D not \u201CI\u201D",
    desc: "Buddy helps us sound less corporate and more human, but the focus should always be on the person reading and how Betterfly can help them. Buddy speaks as \u201Cwe\u201D (Betterfly), never as \u201CI\u201D (Buddy). This keeps Betterfly as the primary brand while Buddy facilitates communication.",
    bad: "\u201CHi! I\u2019m Buddy, I think you should try this new feature!\u201D",
    good: "\u201CWe noticed your team has great participation in the health challenges. Here\u2019s another recommendation.\u201D",
  },
  {
    num: 3,
    title: "Every message is part of a conversation",
    desc: "Each communication should feel like part of an ongoing conversation, not a random message out of nowhere. People are busy. They aren\u2019t thinking about your last message when they open the new one. Do the hard work for them: orient them, give context, and make them feel like we\u2019ve been waiting for them.",
    bad: "\u201CComplete your health survey now.\u201D",
    good: "\u201CHi [name], a few days ago we sent your Betterfly invitation, but we noticed you haven\u2019t activated your account yet. We don\u2019t want you to miss the benefits that [Company] has ready for you\u2026\u201D",
  },
  {
    num: 4,
    title: "Set the right tone from the first line",
    desc: "People decide in seconds whether to pay attention. The tone you use in that first interaction tells them exactly what kind of relationship they\u2019ll have with us. If you start very formal in the first email and then go casual, they feel confused. If you start too relaxed for something serious, they lose trust.",
    bad: "\u201CHey there!! Your health data is ready, check it out!\u201D (for a serious health report)",
    good: "\u201CYour checkup results are ready \u2014 here\u2019s what they mean for you.\u201D (clear, direct, trustworthy)",
    badLabel: "Mismatched tone",
    goodLabel: "Right tone",
  },
  {
    num: 5,
    title: "Earn your exclamation marks",
    desc: "Exclamation marks are like shouting \u2014 do it all the time and people stop listening. In health, credibility is everything. Reserve excitement for when there\u2019s genuinely something to celebrate. When someone actually improves their cholesterol or hits an important goal, that\u2019s the moment. The rest of the time, let the quality of your information speak for itself.",
    bad: "\u201CHere are your health stats! Don\u2019t forget to complete your assessment!\u201D",
    good: "\u201CYour cholesterol improved by 20 points! Congratulations \u2014 your team hit their health goal this month!\u201D",
    badLabel: "Routine info",
    goodLabel: "Genuine celebration",
  },
  {
    num: 6,
    title: "Write for one person, not everyone",
    desc: "When you write for \u201Ceveryone,\u201D you end up writing for no one. People can immediately sense when a message was mass-produced versus thoughtfully written. Even if you\u2019re technically sending the same email to 500 people, each one is reading it alone, in their own context. Write for that individual person \u2014 the difference is obvious.",
    bad: "\u201CDear valued users, we are pleased to announce new features available to all participants.\u201D",
    good: "\u201CYou\u2019ve been consistent with your sleep tracking this month. Here\u2019s a new feature we think you\u2019ll love.\u201D",
  },
  {
    num: 7,
    title: "Answer the silent questions",
    desc: "Unspoken questions kill action. \u201CIs this going to take forever?\u201D \u201CWill they share my data?\u201D \u201CWhat\u2019s actually in this for me?\u201D If you don\u2019t answer these doubts before people even think them, you lose credibility and participation. Proactively address concerns at every friction point.",
    bad: "\u201CComplete your health assessment to continue.\u201D",
    good: "\u201CIt only takes 3 minutes and your information is 100% private.\u201D",
  },
  {
    num: 8,
    title: "Be specific, not vague",
    desc: "People have heard a thousand vague promises about \u201Cimproving their wellbeing.\u201D When you\u2019re specific, you prove you actually know what you\u2019re talking about. Concrete details make people believe this could work for them. Instead of promising \u201Cbetter health,\u201D explain exactly what they\u2019ll be able to do, see, or feel.",
    bad: "\u201CImprove your wellbeing.\u201D",
    good: "\u201CWith Betterfly, you can track your sleep patterns and get personalized tips to wake up more rested.\u201D",
  },
  {
    num: 9,
    title: "Respect intelligence, simplify complexity",
    desc: "Explain technical terms, but don\u2019t assume people are clueless. Give context about why something matters, but trust that they can process nuanced information. The goal is to make the complex accessible \u2014 not to make simple what isn\u2019t. Important: we don\u2019t speak about health as medical experts issuing diagnoses. We\u2019re a catalyst that delivers content from validated sources without alarmism, always from the side of education.",
  },
  {
    num: 10,
    title: "Structure for scanning",
    desc: "People scan before they read. Design content the way people actually consume information: visual organization and structural clarity. People look for key points, clear next steps, and want to quickly understand if something is relevant to them. If they have to work to find the important information, they won\u2019t.",
  },
];

const glossary = [
  { term: "Betterflies", def: "The in-app reward currency earned through healthy habits and benefit actions." },
  { term: "Prevention-first", def: "Our core philosophy: address health before it becomes a problem." },
  { term: "Voluntary benefits", def: "Supplemental coverage employees choose and often fund themselves. Never just say 'insurance'." },
  { term: "SMB", def: "Small and medium businesses \u2014 our primary employer market (10\u2013500 employees)." },
  { term: "Wellbeing journey", def: "The ongoing, personal process of building healthy habits through the platform." },
  { term: "Benefit milestone", def: "A reward threshold tied to habit engagement \u2014 unlocks new coverage options." },
  { term: "Enrollment", def: "The act of a user signing up for a specific voluntary benefit. Not 'sign-up'." },
  { term: "Health engagement", def: "Active participation in wellness activities within the platform. Not 'usage'." },
];

const doSay = [
  "Prevention-first benefits experience",
  "Voluntary and supplemental coverage",
  "Built for SMBs and their people",
  "Health engagement that drives outcomes",
  "Benefits your employees will actually use",
  "Simple, intuitive, human",
];

const dontSay = [
  "Insurance (as a lead word \u2014 creates anxiety)",
  "Claims (in employee-facing comms)",
  "Policy (too formal and clinical)",
  "Users (say 'people' or 'employees')",
  "Compliance (unless in legal/HR context)",
  "Perks (undersells the category)",
];

export function BrandVoice() {
  const vpReveal = useInView(0.1);
  const rulesReveal = useInView(0.05);

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="\u270D\uFE0F Brand Voice & Messaging"
        title="How Betterfly speaks"
        subtitle="Warm, direct, and rooted in outcomes. We speak like a brilliant friend who knows benefits and actually wants you to understand them."
      />

      <div className="px-16 py-16 space-y-16 max-w-4xl">
        <section id="value-prop" ref={vpReveal.ref}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">The Value Proposition</span>
            <span className="h-px flex-1 bg-green-400/20" />
          </div>
          <p className="text-green-950/50 text-sm mb-6">This is the foundation. Every piece of messaging below derives from these four sentences.</p>
          <div className="bg-green-950 rounded-2xl p-8 space-y-5">
            {valueProps.map((vp, i) => {
              const idx = vp.text.indexOf(vp.highlight);
              const before = vp.text.slice(0, idx);
              const after = vp.text.slice(idx + vp.highlight.length);
              return (
                <p
                  key={i}
                  className="text-white/70 text-[17px] leading-relaxed"
                  style={{
                    opacity: vpReveal.inView ? 1 : 0,
                    transform: vpReveal.inView ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 600ms ease ${i * 120}ms, transform 600ms ease ${i * 120}ms`,
                  }}
                >
                  {before}
                  <span className="relative text-white/90 font-medium">
                    {vp.highlight}
                    <span className="absolute bottom-0 left-0 h-[2px] bg-green-400" style={{ width: vpReveal.inView ? "100%" : "0%", transition: `width 400ms ease ${200 + i * 120}ms` }} />
                  </span>
                  {after}
                </p>
              );
            })}
          </div>
        </section>

        <section id="descriptions">
          <h2 className="text-green-950 text-2xl font-bold mb-2">How We Describe Ourselves</h2>
          <p className="text-green-950/50 text-sm mb-6">Each version below distills the value proposition into a ready-to-use format. Copy what you need.</p>
          <div className="space-y-4">
            <CopyBlock
              label="One-liner"
              content="Betterfly is an employee benefits platform built on insurance \u2014 making it easy for companies to invest in their people and rewarding for people to invest in themselves."
            />
            <CopyBlock
              label="Elevator pitch (30 sec)"
              content="Betterfly turns traditional coverage into something people actually use. By combining insurance, preventive health, and technology, we reward healthy habits with real protection and personalized coverage \u2014 all in one app. For employers, that means higher engagement, better retention, and healthier, more productive teams."
            />
            <CopyBlock
              label="Long form (90 sec)"
              content="Most employees don\u2019t think about their benefits until something goes wrong. Betterfly changes that. We\u2019ve built a platform built on insurance that meets people in the daily moments that matter \u2014 a walk, a good night\u2019s sleep, a meditation \u2014 and turns those healthy habits into real protection for them and their families. From day one, employees receive personalized health insights and rewards that unlock coverage options. Meanwhile, employers get a simple way to drive engagement, understand workforce health trends, and build stronger, more productive teams. We\u2019re creating healthier workplaces across Latin America, Europe, and now the United States \u2014 because when people invest in themselves, everyone benefits."
            />
            <CopyBlock
              label="Positioning statement"
              content="For employers and their teams, Betterfly is the prevention-first benefits platform built on insurance that transforms passive coverage into something people actually use \u2014 making it easy for companies to invest in their people, and rewarding for people to invest in themselves."
            />
          </div>
        </section>

        <section id="audience-mindset">
          <h2 className="text-green-950 text-2xl font-bold mb-2">Know Your Audience\u2019s Mindset</h2>
          <p className="text-green-950/50 text-sm mb-6">Before writing anything, understand where people are starting from. These are the real thoughts in their heads.</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-green-950 rounded-2xl p-7">
              <h3 className="text-green-400 font-bold text-sm uppercase tracking-widest mb-5">Employees</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">What they\u2019re thinking</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "They don\u2019t know much, but expect some kind of insurance",
                  "HR asked them to download the app",
                  "They\u2019re excited about coverage but don\u2019t fully understand what they\u2019re getting",
                  "They\u2019ve heard the app is interactive",
                  "They heard they have benefits available and want to know more",
                ].map(t => (
                  <li key={t} className="flex items-start gap-2 text-white/70 text-sm leading-snug">
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full shrink-0 mt-1.5" />{t}
                  </li>
                ))}
              </ul>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">What we want them to do</p>
              <ul className="space-y-2">
                {[
                  "Activate benefits and use the platform",
                  "Connect health devices and complete the health survey",
                  "Accumulate Betterflies: challenges, community, donations, content",
                ].map(t => (
                  <li key={t} className="flex items-start gap-2 text-white/70 text-sm leading-snug">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0 mt-1.5" />{t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">How we want them to feel</p>
                <ul className="space-y-2">
                  {[
                    "Inspired and motivated to improve their health",
                    "Accompanied, protected, and empowered in their journey",
                    "Part of something bigger than their individual health",
                  ].map(t => (
                    <li key={t} className="flex items-start gap-2 text-green-400/80 text-sm leading-snug">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0 mt-1.5" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-green-950 rounded-2xl p-7">
              <h3 className="text-green-400 font-bold text-sm uppercase tracking-widest mb-5">Admins / HR</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">What they\u2019re thinking</p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "They need the experience to be easy to manage",
                  "They\u2019re evaluating whether Betterfly will actually work for their org",
                  "They want to know how to communicate this to their employees",
                  "They need data and results that justify the investment",
                  "They want their employees to actually use and value the benefit",
                ].map(t => (
                  <li key={t} className="flex items-start gap-2 text-white/70 text-sm leading-snug">
                    <span className="w-1.5 h-1.5 bg-white/30 rounded-full shrink-0 mt-1.5" />{t}
                  </li>
                ))}
              </ul>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">What we want them to do</p>
              <ul className="space-y-2">
                {[
                  "Implement successfully and communicate value to employees",
                  "Monitor adoption and optimize with reports",
                  "Act as promoters and ambassadors; renew their subscription",
                ].map(t => (
                  <li key={t} className="flex items-start gap-2 text-white/70 text-sm leading-snug">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0 mt-1.5" />{t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">How we want them to feel</p>
                <ul className="space-y-2">
                  {[
                    "Confident in the real value for their organization",
                    "Proud to offer a benefit their team actually values",
                    "At ease with implementation and support",
                  ].map(t => (
                    <li key={t} className="flex items-start gap-2 text-green-400/80 text-sm leading-snug">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0 mt-1.5" />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="content-rules" ref={rulesReveal.ref}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">10 Rules of Content Strategy</span>
            <span className="h-px flex-1 bg-green-400/20" />
          </div>
          <p className="text-green-950/50 text-sm mb-6">When the tone is right, the connection is immediate: people pay attention, trust, and engage. When the tone is wrong, you\u2019ve lost them before they finish reading the first line. These rules apply whether you\u2019re writing an email, a push notification, or onboarding copy.</p>
          <div className="space-y-3">
            {contentRules.map((rule, i) => (
              <div
                key={rule.num}
                style={{
                  opacity: rulesReveal.inView ? 1 : 0,
                  transform: rulesReveal.inView ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 400ms ease ${i * 60}ms, transform 400ms ease ${i * 60}ms`,
                }}
              >
                <RuleCard {...rule} />
              </div>
            ))}
          </div>
        </section>

        <section id="tone">
          <h2 className="text-green-950 text-2xl font-bold mb-2">Tone by Context</h2>
          <p className="text-green-950/50 text-sm mb-6">The tone you set in the first interaction tells people what kind of relationship they\u2019ll have with us. Match the context.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-950 rounded-2xl p-6">
              <h4 className="text-green-400 font-bold text-xs uppercase tracking-widest mb-3">Professional contexts</h4>
              <p className="text-white/40 text-[10px] mb-3">HR dashboards, admin reports, broker/carrier pitches</p>
              <p className="text-white/70 text-sm leading-relaxed italic">&ldquo;Here\u2019s what the data shows about your team\u2019s health trends\u2026&rdquo;</p>
              <ul className="space-y-1.5 mt-4">
                {["Authority with approachability", "Data-driven language", "Third-person references", "No contractions in long-form"].map(t => (
                  <li key={t} className="flex items-center gap-2 text-white/60 text-xs">
                    <span className="w-1 h-1 bg-green-400 rounded-full shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-400 rounded-2xl p-6">
              <h4 className="text-green-950 font-bold text-xs uppercase tracking-widest mb-3">Personal health contexts</h4>
              <p className="text-green-950/50 text-[10px] mb-3">App copy, health insights, wellbeing nudges, onboarding</p>
              <p className="text-green-950/80 text-sm leading-relaxed italic">&ldquo;Let\u2019s see how your month has been going\u2026&rdquo;</p>
              <ul className="space-y-1.5 mt-4">
                {["Supportive and motivating", "Second-person ('you', 'your')", "Conversational, contractions OK", "Celebrate progress, not perfection"].map(t => (
                  <li key={t} className="flex items-center gap-2 text-green-950/60 text-xs">
                    <span className="w-1 h-1 bg-green-950 rounded-full shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h4 className="text-green-950 font-bold text-xs uppercase tracking-widest mb-3">Urgent / Important</h4>
              <p className="text-neutral-400 text-[10px] mb-3">Health results, coverage updates, time-sensitive actions</p>
              <p className="text-green-950/80 text-sm leading-relaxed italic">&ldquo;Your checkup results are ready \u2014 here\u2019s what they mean\u2026&rdquo;</p>
              <ul className="space-y-1.5 mt-4">
                {["Clear and direct", "Lead with the most important info", "No filler or pleasantries", "Explain what comes next"].map(t => (
                  <li key={t} className="flex items-center gap-2 text-neutral-500 text-xs">
                    <span className="w-1 h-1 bg-green-950 rounded-full shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="tone-principles">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-green-400 text-xs font-bold uppercase tracking-widest">The 10 Tone Principles</span>
            <span className="h-px flex-1 bg-green-400/20" />
          </div>
          <p className="text-green-950/50 text-sm mb-6">These principles are extracted from the 2026 Onboarding deck and apply to all employee-facing, employer-facing, and marketing communications. They are not guidelines — they are non-negotiable.</p>
          <div className="space-y-3">
            {[
              { num: 1, title: "Meet people where they actually are — including the skeptics.", desc: "Write for the person who is indifferent or skeptical first. Acknowledge friction before dissolving it. Never write for an ideal engaged user who doesn't exist yet." },
              { num: 2, title: "Speak directly, in second person.", desc: "\"You,\" \"your,\" always. Never describe the audience in third person in consumer-facing copy." },
              { num: 3, title: "Short sentences signal confidence.", desc: "\"Easy.\" is a complete sentence. \"Full stop.\" is a complete sentence. The shorter the sentence, the more certain it sounds." },
              { num: 4, title: "Earn the ask before making it.", desc: "Only request something — data, a decision, an enrollment — after you've given the person a concrete reason to say yes. This is a comms principle, not just a UX principle." },
              { num: 5, title: "Be transparent about the model.", desc: "The Betterfly model is genuinely good for users. Explain it plainly. Transparency is a feature of our voice, not a legal disclaimer mode." },
              { num: 6, title: "Frame protection as personal, not transactional.", desc: "Coverage discussions anchor in the person's real life — their family, their scenarios, their situation. Not premiums, not policy language, not plan design." },
              { num: 7, title: "Never lead with \"insurance.\"", desc: "In employee-facing and marketing contexts, lead with \"coverage,\" \"protection,\" or \"benefits.\" Use \"built on insurance\" to establish credibility when needed, then pivot to the human outcome." },
              { num: 8, title: "Write like a supportive friend who knows benefits.", desc: "Warm without condescension. Expert without jargon. Clear without being clinical." },
              { num: 9, title: "Warm handoffs, no fanfare.", desc: "Celebrate warmly, not loudly. Milestone moments, mascot introductions, and transitions are genuine — not hype." },
              { num: 10, title: "Corporate-speak is always off-brand.", desc: "No \"perks,\" no \"mandatory,\" no \"synergies,\" no \"robust,\" no passive voice. Ever." },
            ].map((principle) => (
              <div key={principle.num} className="border border-neutral-200 rounded-2xl overflow-hidden bg-white px-6 py-5 flex items-start gap-4">
                <span className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-green-400 text-sm font-bold">{principle.num}</span>
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-green-950 font-bold text-base mb-1">{principle.title}</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed">{principle.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="tonal-model">
          <div className="bg-yellow-400 rounded-2xl p-8 border-l-4 border-green-950">
            <p className="text-green-950/50 text-xs font-bold uppercase tracking-widest mb-4">Tonal Model</p>
            <p className="text-green-950 text-xl font-bold leading-snug mb-2" style={{ fontFamily: "'Obviously Narrow', sans-serif" }}>"That's fair. Most insurance works that way. Betterfly works better."</p>
            <p className="text-green-950/60 text-sm italic">This three-sentence sequence is the tonal template. Short. Confident. No filler.</p>
          </div>
        </section>

        <section id="say-dont">
          <h2 className="text-green-950 text-2xl font-bold mb-6">What We Say / What We Don't</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-green-400 text-sm font-bold uppercase tracking-widest mb-4">&check; We say</h3>
              <div className="space-y-2">
                {doSay.map(s => (
                  <div key={s} className="flex items-center gap-3 bg-green-100 border border-green-400/20 rounded-xl px-4 py-3">
                    <span className="text-green-400 text-sm">&check;</span>
                    <span className="text-green-950 text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-4">&cross; We don&rsquo;t say</h3>
              <div className="space-y-2">
                {dontSay.map(s => (
                  <div key={s} className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <span className="text-red-400 text-sm">&cross;</span>
                    <span className="text-red-800 text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="writing-checklist">
          <h2 className="text-green-950 text-2xl font-bold mb-2">Writing Checklist</h2>
          <p className="text-green-950/50 text-sm mb-6">Before you hit send, run through these.</p>
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-100">
            {[
              "Does this lead with the benefit, not the feature?",
              "Am I writing for one person, not an audience?",
              "Does this feel like part of a conversation, or a message from nowhere?",
              "Is the tone matched to the context (professional / personal / urgent)?",
              "Have I answered the silent questions before they arise?",
              "Am I being specific enough to build credibility?",
              "Is this structured for scanning (key point first, short paragraphs, clear next step)?",
              "Did I earn my exclamation marks?",
              "Does Buddy speak as \u201Cwe,\u201D not \u201CI\u201D?",
              "Would I explain it this way to a friend?",
            ].map((q, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <span className="w-5 h-5 rounded border-2 border-neutral-200 shrink-0" />
                <span className="text-green-950 text-sm">{q}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="glossary">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Approved Terminology Glossary</h2>
          <div className="divide-y divide-black/8 border border-neutral-200 rounded-2xl overflow-hidden">
            {glossary.map(({ term, def }) => (
              <div key={term} className="flex gap-8 px-6 py-5 bg-white hover:bg-neutral-100 transition-colors">
                <span className="text-green-950 font-bold text-sm w-40 shrink-0">{term}</span>
                <span className="text-neutral-600 text-sm leading-relaxed">{def}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
