import { PageHeader } from "@/components/PageHeader";

const doItems = [
  { title: "Use approved color palette", desc: "Stick to Betterfly Green (#19F578), Yellow (#E8FB10), Forest Green (#042914), and neutrals. No substitutions." },
  { title: "Lead with outcomes", desc: "Every headline and opener should anchor in a tangible benefit for the audience. What changes for them?" },
  { title: "Use Obviously Narrow for display", desc: "Headlines, hero copy, and section titles use Obviously Narrow Bold. Body copy uses Roboto Regular." },
  { title: "Maintain clear space around the logo", desc: "Minimum clear space = height of the 'B' icon mark on all four sides." },
  { title: "Credit partner carriers correctly", desc: "Partner logos must appear at equal or smaller size than the Betterfly logo. Use approved co-brand lockups." },
  { title: "Use the approved terminology glossary", desc: "Refer to the Brand Voice section. Terms like 'Betterflies', 'voluntary benefits', and 'wellbeing journey' have specific approved uses." },
  { title: "Apply content type badges", desc: "All content pieces (white papers, webinars, case studies) must carry the appropriate type badge using approved badge colors." },
];

const dontItems = [
  { title: "Don't alter the logo", desc: "No stretching, rotating, recoloring, dropping shadows, or adding outlines to any logo asset." },
  { title: "Don't use 'insurance' as a lead word", desc: "In employee-facing and marketing contexts, lead with 'coverage', 'protection', or 'benefits'. Reserve 'insurance' for legal/compliance contexts." },
  { title: "Don't use unapproved fonts", desc: "No system fonts, web-safe fallbacks, or third-party display fonts outside Obviously Narrow and Roboto." },
  { title: "Don't overuse the yellow", desc: "#E8FB10 is an accent. It should never dominate a layout. Use for badges, highlights, and selected CTAs only." },
  { title: "Don't place logo on busy backgrounds", desc: "Logo requires solid or sufficiently contrasted backgrounds. Never place it over imagery without a backdrop." },
  { title: "Don't use the icon mark at small sizes", desc: "Below 24px rendered size, use the full wordmark or text-only variant only." },
  { title: "Don't mix co-brand without approval", desc: "Partner and carrier co-branding must be approved by the Betterfly brand team before any external use." },
];

const toneDoItems = [
  { title: "Write in second person", desc: "Directly to the person (\"you\", \"your\"). Never write about the audience in third person in consumer-facing copy." },
  { title: "Lead with outcomes or human truths", desc: "Every headline and opener should anchor in an outcome or a human truth — not a feature, not a product name." },
  { title: "Short sentences signal confidence", desc: "Use short sentences as a signal of confidence. \"Easy.\" is a complete sentence. \"Full stop.\" is a complete sentence." },
  { title: "Earn the ask before making it", desc: "Only request something from a user (data, a decision, an enrollment) after you've given them a concrete reason to say yes." },
  { title: "Be transparent about the model", desc: "Be transparent about how Betterfly works — the model is good for users, so explain it plainly." },
  { title: "Frame coverage as personal decisions", desc: "Frame coverage decisions as personal decisions, not purchases. Anchor them in real life scenarios." },
  { title: "Lead with 'coverage' or 'protection'", desc: "Use \"coverage\" or \"protection\" as the lead word in employee-facing and marketing contexts. Use \"built on insurance\" to establish credibility when needed." },
  { title: "Write like a supportive friend", desc: "Write like a supportive friend who knows benefits — warm, direct, plain." },
];

const toneDontItems = [
  { title: "Don't use passive voice", desc: "Don't use passive voice. Ever." },
  { title: "Don't lead with 'insurance'", desc: "Don't lead with \"insurance\" in marketing or employee-facing contexts — it creates anxiety before value is established." },
  { title: "Don't use corporate-speak", desc: "Don't use corporate-speak or HR-speak (no \"synergies,\" no \"robust solutions,\" no \"seamless experience\")." },
  { title: "Don't use 'perks'", desc: "It undersells the category. Use \"benefits\" or \"wellbeing benefits.\"" },
  { title: "Don't use 'mandatory' or 'required'", desc: "Don't use \"mandatory\" or \"required\" for anything — Betterfly is always opt-in and choice-driven." },
  { title: "Don't lead with features", desc: "Lead with the employee or employer experience instead." },
  { title: "Don't position as 'another wellness tool'", desc: "Betterfly is voluntary benefits, insurance-backed, with engagement built in." },
  { title: "Don't add hype to milestones", desc: "Don't add hype or fanfare to milestone moments. Celebrate warmly, not loudly." },
];

const approvedVocabulary = [
  { use: "coverage / protection / benefits", not: "insurance (as a lead word)", context: "Employee, marketing, social" },
  { use: "wellbeing benefits", not: "perks", context: "Employer context" },
  { use: "built on insurance", not: "insurance platform / insurance product", context: "Carrier, broker context" },
  { use: "healthy habits", not: "lifestyle", context: "Rewards and engagement context" },
  { use: "Betterflies (the currency)", not: "coins / points / rewards points", context: "In-product" },
  { use: "wellbeing journey", not: "wellness program", context: "General brand" },
  { use: "voluntary benefits", not: "supplemental insurance", context: "Broker context" },
  { use: "opt-in / choice-driven", not: "mandatory / required", context: "Employer context" },
  { use: "protection / coverage", not: "policy / plan", context: "Employee-facing copy" },
  { use: "donate / give back", not: "charitable contribution", context: "Rewards redemption context" },
];

const cobrandRules = [
  "Partner logo must appear separate from the Betterfly logo — never merged or combined",
  "Use a dividing line or 'x' mark at equal weight to connect partner + Betterfly marks",
  "Partner logo may be equal size to Betterfly logo but not larger",
  "On dark backgrounds, Betterfly Green version of our logo; partner uses their reversed variant",
  "Minimum co-brand clear space: 16px between logos, 32px from any edge",
  "All co-branded materials require brand team approval at draft stage",
];

const socialRules = [
  "LinkedIn posts must include the Betterfly logo in the first 3 frames of any carousel",
  "All social imagery must use approved templates from the Templates Library",
  "Personal employee posts about Betterfly must include 'Views are my own' where required by employer",
  "Don't share unreleased product features or revenue figures on social",
  "Response time SLA for brand-tagged posts: 4 hours during business days",
  "Employee advocacy encouraged — share approved content from the Templates Library",
];

export function BrandGuidelines() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="📐 Brand Guidelines"
        title="Rules of the brand"
        subtitle="How to use Betterfly's brand correctly — and what to absolutely avoid. These are non-negotiable standards for all internal and external communications."
      />

      <div className="px-16 py-16 space-y-16 max-w-5xl">
        {/* Dos and Don'ts */}
        <section id="dos-donts">
          <h2 className="text-green-950 text-2xl font-bold mb-8">Dos & Don'ts</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-green-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-green-950 text-xs font-black">✓</span>
                Do
              </h3>
              <div className="space-y-3">
                {doItems.map((item, i) => (
                  <div key={i} className="bg-green-100 border border-green-400/20 rounded-xl p-5">
                    <h4 className="text-green-950 font-bold text-sm mb-1.5">{item.title}</h4>
                    <p className="text-green-950/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-xs font-black">✕</span>
                Don't
              </h3>
              <div className="space-y-3">
                {dontItems.map((item, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-5">
                    <h4 className="text-red-900 font-bold text-sm mb-1.5">{item.title}</h4>
                    <p className="text-red-700/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tone Rules */}
        <section id="tone-rules">
          <h2 className="text-green-950 text-2xl font-bold mb-8">Tone Rules</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-green-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-green-950 text-xs font-black">✓</span>
                Do
              </h3>
              <div className="space-y-3">
                {toneDoItems.map((item, i) => (
                  <div key={i} className="bg-green-100 border border-green-400/20 rounded-xl p-5">
                    <h4 className="text-green-950 font-bold text-sm mb-1.5">{item.title}</h4>
                    <p className="text-green-950/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-red-500 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-xs font-black">✕</span>
                Don't
              </h3>
              <div className="space-y-3">
                {toneDontItems.map((item, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-5">
                    <h4 className="text-red-900 font-bold text-sm mb-1.5">{item.title}</h4>
                    <p className="text-red-700/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Approved Vocabulary */}
        <section id="approved-vocabulary">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Approved Vocabulary</h2>
          <div className="border border-neutral-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-950 text-white">
                  <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-widest">Use this</th>
                  <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-widest">Not this</th>
                  <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-widest">Context</th>
                </tr>
              </thead>
              <tbody>
                {approvedVocabulary.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                    <td className="px-6 py-4 text-green-950 font-semibold">{row.use}</td>
                    <td className="px-6 py-4 text-red-600 line-through opacity-70">{row.not}</td>
                    <td className="px-6 py-4 text-neutral-500">{row.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Co-branding */}
        <section id="cobranding">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Co-Branding Rules</h2>
          <div className="bg-green-950 rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-green-950 font-black text-xl" style={{ fontFamily: "'Obviously Narrow', sans-serif" }}>B</span>
                </div>
                <span className="text-white font-extrabold text-xl" style={{ fontFamily: "'Obviously Narrow', sans-serif" }}>Betterfly</span>
              </div>
              <span className="text-white/40 font-bold text-lg">×</span>
              <div className="w-32 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white/30 text-xs font-semibold">Partner Logo</span>
              </div>
            </div>
            <p className="text-white/50 text-sm">Sample co-brand lockup — partner logo at equal weight, separated by a × mark</p>
          </div>
          <div className="space-y-3">
            {cobrandRules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4 bg-neutral-100 rounded-xl">
                <span className="w-5 h-5 bg-green-950 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-green-950 text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social media governance */}
        <section id="social">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Social Media Governance</h2>
          <div className="border border-neutral-200 rounded-2xl overflow-hidden">
            {socialRules.map((rule, i) => (
              <div key={i} className={`flex items-start gap-4 px-6 py-5 ${i % 2 === 0 ? "bg-white" : "bg-neutral-100"}`}>
                <span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 shrink-0" />
                <p className="text-green-950 text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick reference */}
        <section className="bg-yellow-400 rounded-2xl p-10">
          <h2 className="text-green-950 text-2xl font-bold mb-2">Quick Reference Card</h2>
          <p className="text-green-950/60 text-sm mb-8">Print this and keep it at your desk.</p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: "Primary font", value: "Obviously Narrow Bold (display) · Roboto (body)" },
              { label: "Primary color", value: "#19F578 Betterfly Green" },
              { label: "Dark base", value: "#042914 Forest Green" },
              { label: "Accent", value: "#E8FB10 Yellow" },
              { label: "Lead with", value: "Outcomes, not features" },
              { label: "Avoid", value: "'Insurance' in marketing copy" },
              { label: "Tone model", value: "That's fair. Most insurance works that way. Betterfly works better." },
              { label: "Earn the ask", value: "Give value before requesting data, enrollment, or a decision." },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-green-950/50 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-green-950 font-semibold text-sm">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
