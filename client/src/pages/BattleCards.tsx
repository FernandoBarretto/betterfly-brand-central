import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight, AlertTriangle, Lightbulb, XCircle, CheckCircle, Shield, MessageSquare, ThumbsDown, Star, ChevronLeft } from "lucide-react";

const competitors = [
  {
    id: "yulife",
    initials: "YU",
    name: "YuLife",
    tagline: "Gamified group life & wellness — UK-origin, US expansion",
    color: "#7B2D8B",
    bgColor: "#f3e8ff",
    founded: "2016, London",
    raised: "$206M+",
    focus: "UK, US, Japan, SA",
    extra: "Zero active Meta ads (Mar 2025)",
    extraColor: "#f59e0b",
    tags: ["B2B", "UK-Origin", "Wellness", "Gamification"],
    alert: {
      type: "warn",
      text: "YuLife runs zero active paid ads on Meta (confirmed via Ad Library, March 2025). All paid media is LinkedIn-only, targeting HR buyers. They have no US-specific creative and no consumer/employee-direct advertising. Their US expansion is real but early-stage.",
    },
    snapshot: [
      { label: "Core Claim", value: '"Insurance that inspires life" — daily gamified wellness earns YuCoin rewards' },
      { label: "Primary Buyer", value: "HR Directors & CPOs at 500–10,000 employee companies" },
      { label: "Differentiator", value: "Gamification + YuCoin reward currency redeemable at Amazon, Nike, ASOS" },
      { label: "US Weakness", value: "No US broker relationships, no US-specific creative, no consumer brand awareness" },
    ],
    objections: [
      {
        hear: '"YuLife looks really innovative — gamification is something our clients are excited about."',
        say: "Acknowledge it fully. Then reframe: 'Gamification is a brilliant engagement mechanic — and it works as a wellness overlay. The question for your client is what sits underneath it. YuLife is not a benefits administration platform. It doesn't handle enrollment, compliance, or carrier management. We do. We can integrate with wellness apps like YuLife so your client gets the engagement without sacrificing the administrative foundation.'",
      },
      {
        hear: '"They claim employees generate 3× the average engagement. That\'s a compelling ROI story."',
        say: "That stat comes from their own platform data — it measures app engagement, not health outcomes or claims reduction. We'd encourage you to ask them for actuarial evidence linking YuCoin activity to reduced claims costs. Our ROI story is more direct: faster enrollment, fewer admin errors, lower HR overhead, and higher benefits uptake. Those are numbers your clients' CFOs can verify independently.",
      },
      {
        hear: '"Their pricing is competitive. How do you stack up?"',
        say: "Pricing is always worth comparing directly. YuLife charges a per-employee-per-month wellness fee on top of the insurance premium. We'd encourage you to model the total cost of ownership — including the wellness fee, the carrier relationship management, and the admin overhead — and compare that to our all-in pricing. We're happy to model that together.",
      },
    ],
    weaknesses: [
      { title: "US Market Newcomer", body: "No established US broker relationships, no US-specific creative, and limited brand awareness among American employees and HR teams." },
      { title: "Wellness Niche Only", body: "YuLife is a wellness and gamification overlay — not a full benefits administration platform. Lacks enrollment, compliance, and carrier management." },
      { title: "Unproven Actuarial ROI", body: "Engagement metrics are self-reported. No independent actuarial data linking YuCoin activity to reduced claims or improved health outcomes." },
    ],
    proofPoints: [
      { title: "US Market Expertise", body: "Built for the US market from day one — US carrier relationships, US compliance, and US-specific broker workflows." },
      { title: "Core Platform, Not an Add-On", body: "We're the platform. Wellness gamification can sit on top of us. We're not competing with YuLife — we make YuLife possible." },
      { title: "Measurable Admin ROI", body: "Faster enrollment, fewer errors, lower HR overhead. Outcomes HR teams and CFOs can measure today, not in three years." },
    ],
    closingQ: "If their US expansion stalls or they prioritise their more established markets in the next 12 months — which is a real risk for a startup with limited US runway — what happens to your client's benefits technology strategy?",
  },
  {
    id: "beam",
    initials: "BE",
    name: "Beam Benefits",
    tagline: "Full-stack voluntary benefits carrier — dental, vision, disability, life",
    color: "#1A4FBA",
    bgColor: "#dbeafe",
    founded: "2012, Columbus OH",
    raised: "$160M+",
    focus: "SMB & Mid-Market",
    extra: "Perks Sunset: May 2025",
    extraColor: "#ef4444",
    tags: ["B2B", "US Market", "Dental-Origin", "Benefits Admin"],
    alert: {
      type: "danger",
      text: "Critical Intel — Perks Programme Sunset (May 2025): Beam discontinued their signature smart toothbrush Perks programme, citing only 4% member enrollment. This removes their most distinctive consumer-facing differentiator. All messaging has shifted away from the IoT/behaviour-change angle. They are now competing on 'benefits simplified' — a crowded, commoditised position.",
    },
    snapshot: [
      { label: "Core Claim", value: '"Benefits simplified" — single carrier for dental, vision, disability, and life with 2-year rate guarantees' },
      { label: "Primary Buyer", value: "Employee benefits brokers & consultants; HR managers at 50–1,000 employee companies" },
      { label: "Former Differentiator", value: "Smart toothbrush + IoT data → lower dental premiums (NOW DISCONTINUED)" },
      { label: "Current Positioning", value: "Broker-friendly carrier with BeamElect digital enrollment and guaranteed rates" },
    ],
    objections: [
      {
        hear: '"Beam has strong broker relationships. My clients know and trust them."',
        say: "Beam has done an excellent job building broker trust — that's real. The question is whether a carrier-owned platform is the right technology for your book of business. Beam's platform is designed to sell Beam products. Our platform is carrier-agnostic. You get the same simplicity, but with the freedom to choose the best carrier for each client. That's a more powerful position for you as a broker.",
      },
      {
        hear: '"Their 2-year rate guarantee is very attractive to my clients."',
        say: "Rate guarantees are a strong selling point — they reduce renewal anxiety. But they also lock your client into a single carrier for two years. If a better option emerges, or if your client's needs change, they're stuck. Our platform gives you the flexibility to re-market your clients every year and find the best deal. Long-term, flexibility is worth more than a short-term rate lock.",
      },
      {
        hear: '"Their \'Benefits Revolution\' campaign is compelling."',
        say: "The rebrand is well-executed — it's a smart way to reposition after discontinuing the toothbrush programme. The honest question is what the disruption actually is now that the IoT differentiator is gone. 'Benefits simplified' is a positioning, not a product innovation. Ask them what specifically is simpler today than it was two years ago.",
      },
    ],
    weaknesses: [
      { title: "Carrier Lock-In", body: "Brokers who use Beam's platform are effectively selling Beam products. No carrier-agnostic flexibility for clients with specific needs." },
      { title: "Post-Perks Identity Crisis", body: "Without the toothbrush programme, Beam is now a carrier competing on price and simplicity — a crowded and commoditised space." },
      { title: "Rate Guarantee = Lock-In", body: "The 2-year rate guarantee is marketed as a benefit but is actually a two-year lock-in. Clients can't re-market even if better options emerge." },
    ],
    proofPoints: [
      { title: "Carrier-Agnostic Freedom", body: "We work with Beam and every other carrier. Brokers choose the best carrier for each client — not the one that owns the platform." },
      { title: "Broker Independence", body: "Your technology and your carrier recommendations are separate decisions. That independence is a structural advantage in your client relationships." },
      { title: "Proven Enrollment UX", body: "Digital enrollment that's as good or better than BeamElect — without requiring your clients to buy from a specific carrier." },
    ],
    closingQ: "Now that the IoT-driven perks programme is gone, what is Beam's actual competitive advantage over a traditional carrier with a digital enrollment portal? We'd like to know what your clients are paying the platform premium for.",
  },
  {
    id: "nayya",
    initials: "NY",
    name: "Nayya",
    tagline: "AI-powered benefits decision platform — SuperAgent & personalised guidance",
    color: "#1A2E4A",
    bgColor: "#e0f2fe",
    founded: "2019, New York",
    raised: "$60M+ (Workday Ventures backed)",
    focus: "Mid-Market to Enterprise",
    extra: "AI moat narrowing rapidly",
    extraColor: "#f59e0b",
    tags: ["B2B", "US Market", "AI-Native", "HR Tech"],
    alert: {
      type: "warn",
      text: '"AI-powered" is rapidly commoditising — every platform now claims AI. Nayya\'s moat is narrowing. Their SuperAgent acquisition (Northstar, 2025) is a strategic response to this pressure. Ask prospects whether they\'ve seen a live demo of the SuperAgent in a real benefits scenario, not a scripted one.',
    },
    snapshot: [
      { label: "Core Claim", value: '"AI layer between employees and their benefits" — personalised guidance, always-on decision support' },
      { label: "Primary Buyer", value: "HR leaders at mid-market to enterprise companies; HRIS/benefits technology buyers" },
      { label: "Differentiator", value: 'AI-powered plan recommendations + "SuperAgent" that proactively manages benefits decisions' },
      { label: "Key Risk", value: '"AI-powered" is rapidly commoditising — every platform now claims AI. Their moat is narrowing.' },
    ],
    objections: [
      {
        hear: '"Nayya\'s AI is genuinely impressive — it can recommend plans and answer benefits questions in real time."',
        say: "Nayya's AI is well-executed for the decision-support use case — helping employees choose the right plan during open enrollment. The question is what happens the other 11 months of the year. Benefits administration isn't just about enrollment decisions — it's about ongoing accuracy, carrier reconciliation, compliance, and HR workflow. That's where AI recommendations don't replace operational infrastructure.",
      },
      {
        hear: '"They have Workday Ventures backing — that gives them enterprise credibility."',
        say: "Workday's investment is a strong signal of enterprise validation. It's also worth noting that Workday investments are often strategic — they want Nayya to work well within the Workday ecosystem. If your client isn't a Workday shop, the integration depth may be different. Ask them specifically about their non-Workday HRIS integration experience.",
      },
      {
        hear: '"Their SuperAgent can proactively manage benefits decisions for employees — that sounds like a game changer."',
        say: "Proactive AI guidance is genuinely valuable — if the underlying data is accurate and complete. AI is only as good as the data it's trained on. Ask Nayya how they ensure data accuracy across every carrier and plan type your client uses. The SuperAgent's recommendations are only trustworthy if the foundational data is correct. We're the platform that makes that foundational data reliable.",
      },
    ],
    weaknesses: [
      { title: "Feature, Not a Platform", body: "Nayya is an AI layer on top of existing benefits infrastructure. It requires a separate administration platform to function — it doesn't replace one." },
      { title: "Data Dependency", body: "AI recommendations are only as good as the underlying data. Nayya depends on accurate, clean data from other systems — a significant risk if those systems are unreliable." },
      { title: "Abstract Value Proposition", body: '"AI-powered benefits guidance" is difficult to quantify. What\'s the ROI? How do you measure whether the AI recommendation led to a better outcome?' },
    ],
    proofPoints: [
      { title: "Solid Data Foundation", body: "We provide the accurate, clean benefits data that any AI layer — including Nayya's — needs to function well. We're the foundation they build on." },
      { title: "Immediate, Tangible ROI", body: "Measurable outcomes: enrollment accuracy, HR time savings, carrier reconciliation. Not theoretical future value." },
      { title: "HRIS-Agnostic Integration", body: "We integrate with any HRIS, not just Workday. Broader compatibility for a more diverse client base." },
    ],
    closingQ: "If we set aside the AI narrative for a moment — what's the single biggest administrative headache your client's HR team faces with their benefits today? I'd bet it's something that happens before or after the decision point that Nayya focuses on.",
  },
  {
    id: "selerix",
    initials: "SX",
    name: "Selerix",
    tagline: "Enterprise-grade benefits administration & enrollment — BenSelect platform",
    color: "#0A6E4F",
    bgColor: "#d1fae5",
    founded: "2003, Texas",
    raised: "Private / NexPhase Capital backed",
    focus: "Enterprise & Complex Cases",
    extra: "Benefits Genius AI — ask for live demo",
    extraColor: "#f59e0b",
    tags: ["B2B", "US Market", "Enterprise", "Benefits Admin"],
    alert: {
      type: "warn",
      text: 'Selerix recently launched "Benefits Genius" — an AI-powered assistant layered on top of BenSelect. This is a direct response to competitive pressure from AI-native platforms like Nayya. The underlying platform is still legacy architecture. Ask prospects whether they\'ve seen the AI in a live environment, not just a demo.',
    },
    snapshot: [
      { label: "Core Claim", value: "Powerful, flexible benefits administration for complex cases — handles virtually any plan design or eligibility rule" },
      { label: "Primary Buyer", value: "Large employers, brokers, and carriers with complex benefits needs; enterprise HR teams" },
      { label: "Differentiator", value: "Depth of configurability — can handle almost any edge case in benefits administration" },
      { label: "Key Weakness", value: "Legacy architecture, steep learning curve, long implementation timelines, dated UX" },
    ],
    objections: [
      {
        hear: '"Selerix is a proven, established platform. We\'ve been using BenSelect for years."',
        say: "BenSelect's depth is real — it's one of the most configurable platforms in the market, and that's earned over 20+ years. The question is whether that complexity is serving you or costing you. How long does a typical implementation take? How many hours does your team spend on configuration and maintenance? We handle the vast majority of complex cases with a fraction of the setup time.",
      },
      {
        hear: '"Their \'Benefits Genius\' AI sounds interesting."',
        say: "It's a smart move to layer AI on top of an existing platform. The honest question is whether AI built on top of legacy architecture delivers the same experience as AI built natively into a modern platform. Ask them for a live demo — not a scripted one — and see how the AI handles a real, complex question.",
      },
      {
        hear: '"They have a long track record. That matters for enterprise clients."',
        say: "Track record matters enormously — and we respect what Selerix has built over 20+ years. The flip side of longevity is legacy. Their platform was built for a world of desktop browsers and paper forms. Our platform was built for mobile-first employees, real-time data, and API-driven integrations.",
      },
    ],
    weaknesses: [
      { title: "Legacy Architecture", body: "BenSelect was built for a different era of benefits administration. Modern integration requirements and mobile-first employee expectations reveal its age." },
      { title: "Complexity as a Liability", body: "Selerix's strength — deep configurability — requires dedicated administrators to maintain. That complexity is a cost centre for many clients." },
      { title: "Long Implementation Times", body: "Enterprise implementations typically take months. By the time Selerix is live, faster alternatives could have been deployed and delivering value." },
    ],
    proofPoints: [
      { title: "Modern Architecture", body: "Built for today's integration requirements — mobile-first, API-native, real-time data. No legacy technical debt to work around." },
      { title: "Faster Time-to-Value", body: "Most clients are live in weeks, not months. Faster implementation means faster ROI and lower disruption risk." },
      { title: "Intuitive UX", body: "Employee-facing experience that doesn't require training. Higher adoption rates mean better enrollment numbers for your clients." },
    ],
    closingQ: "What's the last new feature your Selerix implementation gave you without requiring a billable configuration project? Modern platforms ship continuous improvements — legacy platforms charge for every change.",
  },
  {
    id: "nava",
    initials: "NV",
    name: "Nava Benefits",
    tagline: "Tech-enabled modern brokerage — startup & SMB focused, Nava HQ platform",
    color: "#C0392B",
    bgColor: "#fee2e2",
    founded: "2019, San Francisco",
    raised: "$30M+",
    focus: "Startups & SMBs (50–500 employees)",
    extra: "Platform tied to brokerage relationship",
    extraColor: "#10b981",
    tags: ["B2B", "US Market", "Brokerage", "Startup-Focused"],
    alert: {
      type: "tip",
      text: 'Nava is a brokerage that built technology to support its brokerage services — not a technology company that sells to brokers. Their "Fix Healthcare Live 2026" conference signals ambitions to become a thought-leadership platform. Their Nava HQ platform is proprietary and tied to their brokerage relationship — clients who leave Nava lose access to the platform.',
    },
    snapshot: [
      { label: "Core Claim", value: '"Co-pilot for benefits" — tech-enabled brokerage with Nava HQ platform for modern employers' },
      { label: "Primary Buyer", value: "CEOs, CFOs, and Heads of People at startups and SMBs (50–500 employees)" },
      { label: "Differentiator", value: "Bundled brokerage + technology + curated modern carrier network in one relationship" },
      { label: "Key Risk", value: "Platform access is tied to the brokerage relationship. Clients lose technology if they change brokers." },
    ],
    objections: [
      {
        hear: '"Nava seems like a great all-in-one solution for my startup clients."',
        say: "The bundled model is appealing for simplicity, and Nava has executed it well for the startup market. The question to ask your client is: what happens to their technology if they ever want to change brokers? With Nava, the platform and the brokerage are inseparable. Our platform is independent — your client owns the technology relationship regardless of which broker they work with.",
      },
      {
        hear: '"Their \'Nava HQ\' platform looks modern and well-designed."',
        say: "Nava HQ is a well-designed platform built to support their brokerage workflow. Our platform is built to support any broker's workflow. The design philosophy is different: theirs is optimised for their service model, ours is optimised for flexibility and scale. We'd love to do a side-by-side demo on a real client scenario.",
      },
      {
        hear: '"They\'re doing great work on \'fixing healthcare\' — the mission resonates."',
        say: "The mission is genuinely compelling — and Nava is walking the talk with events and content. The question is how that mission translates into day-to-day administration for your client's HR team. Mission-driven companies are inspiring; the platform still needs to handle COBRA, carrier reconciliation, and open enrollment without errors.",
      },
    ],
    weaknesses: [
      { title: "Platform Lock-In", body: "Technology is inseparable from the brokerage relationship. Clients lose platform access if they change brokers — a significant exit barrier." },
      { title: "Limited Carrier Network", body: "Curated 'modern' carrier network is smaller than the open market. Less flexibility for clients with specific or established carrier relationships." },
      { title: "Scalability Ceiling", body: "High-touch service model is difficult to scale. May struggle to serve clients as they grow beyond the startup/SMB segment." },
    ],
    proofPoints: [
      { title: "Broker Independence", body: "Our platform works with any broker. Clients own their technology relationship independently of their brokerage choice." },
      { title: "Full Carrier Access", body: "Access to the full carrier market, not a curated subset. Best deal for every client, every year." },
      { title: "Built to Scale", body: "Platform designed to grow with clients from 50 to 5,000 employees without re-platforming or changing providers." },
    ],
    closingQ: "If your client decided to change brokers in two years — which happens — what would happen to their Nava HQ data and platform access? That's a question worth asking before they sign. Our answer is: nothing changes. They keep everything.",
  },
  {
    id: "aetna",
    initials: "AE",
    name: "Aetna Wellness",
    tagline: "Major US health carrier — CVS Health subsidiary, employer wellness programmes",
    color: "#7D0E1A",
    bgColor: "#ffe4e6",
    founded: "1853, Hartford CT",
    raised: "Part of CVS Health ($100B+ revenue)",
    focus: "Large Employers (1,000+)",
    extra: "Wellness tools tied to medical plan purchase",
    extraColor: "#f59e0b",
    tags: ["B2B", "US Market", "Large Carrier", "Employer Wellness"],
    alert: {
      type: "warn",
      text: "Aetna's wellness play centres on 'Aetna One Advocate' — a dedicated health concierge service — and employer wellness programmes tied to their medical plans. Campaign messaging is consumer-facing, not broker-facing. They compete on brand trust and network breadth, not technology innovation. Weakness is bureaucracy and legacy systems.",
    },
    snapshot: [
      { label: "Core Claim", value: '"Healthademic" employer wellness — integrated health concierge, wellness incentives, and medical plan bundling' },
      { label: "Primary Buyer", value: "Large employers (1,000+ employees) who want an integrated carrier + wellness solution from a trusted brand" },
      { label: "Differentiator", value: "Brand trust, network breadth (CVS/Aetna integration), and Aetna One Advocate concierge service" },
      { label: "Key Weakness", value: "Legacy systems, bureaucracy, one-size-fits-all approach, slow to innovate, tied to medical plan purchase" },
    ],
    objections: [
      {
        hear: '"Aetna is a huge, trusted brand. My clients are comfortable with them."',
        say: "Aetna's brand trust is absolutely real and hard-earned. We're not asking your client to replace Aetna — we're asking them to add a layer of technology that makes their Aetna (and other carrier) benefits easier to manage and more engaging for employees. We're complementary to Aetna, not competitive.",
      },
      {
        hear: '"They have an enormous provider network through CVS Health. That\'s a huge advantage."',
        say: "The CVS-Aetna network is genuinely one of the largest in the country, and for medical plan selection, it's a powerful asset. Our role is to make sure employees can actually navigate and use that network effectively — finding in-network providers, understanding their benefits, and managing their healthcare costs.",
      },
      {
        hear: '"Their \'Aetna One Advocate\' concierge service is very appealing."',
        say: "Aetna One Advocate is a strong offering for large employers who want white-glove health navigation. It's worth noting that it's only available to employers who purchase Aetna medical plans — it's a retention tool, not a standalone product. If your client values carrier independence, a dedicated benefits platform gives them the same navigation experience without being tied to a single carrier.",
      },
    ],
    weaknesses: [
      { title: "Wellness Tied to Medical Plan", body: "Aetna's wellness capabilities are only available to employers who purchase Aetna medical plans. Not a standalone product — a retention mechanism." },
      { title: "SMB Inaccessibility", body: "Aetna's employer wellness programmes are built for large employers (1,000+). SMBs cannot access the same depth of capability or concierge service." },
      { title: "Bureaucracy and Slow Innovation", body: "As part of a $100B+ conglomerate, Aetna's innovation cycles are measured in years. Startup-speed competitors outmanoeuvre them on product velocity." },
    ],
    proofPoints: [
      { title: "SMB-First Design", body: "Every feature is designed for the 10–500 employee market that Aetna can't serve well. We're not competing for large enterprise — we're winning where they can't play." },
      { title: "Carrier Independence", body: "Benefits administration and wellness without requiring a specific carrier purchase. Employers keep their existing carrier relationships and add our engagement layer." },
      { title: "Modern Technology Stack", body: "API-native, mobile-first, and built for real-time data. No legacy systems inherited from 1990s-era infrastructure." },
    ],
    closingQ: "For a client with fewer than 500 employees — what does Aetna actually offer them in wellness capabilities beyond what they'd get from a standard group health plan? If the answer is 'not much,' that's the conversation we want to have.",
  },
];

type TabKey = "snapshot" | "objections" | "weaknesses" | "betterfly";

const tabs: { key: TabKey; label: string; icon: typeof Shield }[] = [
  { key: "snapshot", label: "Overview", icon: Shield },
  { key: "objections", label: "Objections", icon: MessageSquare },
  { key: "weaknesses", label: "Weaknesses", icon: ThumbsDown },
  { key: "betterfly", label: "Our Wins", icon: Star },
];

function AlertBanner({ alert, accentColor }: { alert: { type: string; text: string }; accentColor: string }) {
  const styles = {
    danger: { icon: XCircle, iconColor: "#ef4444", label: "Critical Intel" },
    warn: { icon: AlertTriangle, iconColor: "#f59e0b", label: "Intel Note" },
    tip: { icon: Lightbulb, iconColor: "#60a5fa", label: "Strategic Note" },
  } as const;
  const s = styles[alert.type as keyof typeof styles] || styles.warn;
  const Icon = s.icon;
  return (
    <div
      className="rounded-2xl p-5 flex gap-4 border"
      style={{ backgroundColor: `${s.iconColor}10`, borderColor: `${s.iconColor}30` }}
    >
      <Icon size={16} className="shrink-0 mt-0.5" style={{ color: s.iconColor }} />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: s.iconColor }}>{s.label}</p>
        <p className="text-white/65 text-sm leading-relaxed">{alert.text}</p>
      </div>
    </div>
  );
}

export function BattleCards() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<TabKey>("snapshot");
  const c = competitors[selected];

  return (
    <div className="min-h-screen" style={{ background: "#060f08" }}>
      {/* Top bar */}
      <div className="px-8 py-4 flex items-center gap-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <Link href="/market-intelligence" className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-xs transition-colors">
          <ChevronLeft size={14} /> Market Intelligence
        </Link>
        <ChevronRight size={12} className="text-white/15" />
        <span className="text-xs font-semibold" style={{ color: "var(--color-interactive-primary-cta)" }}>Sales Battle Cards</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/20 text-xs">6 competitors · March 2025</span>
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
          >
            Internal Only
          </span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-53px)]">
        {/* Left rail — competitor selector */}
        <aside
          className="w-60 shrink-0 flex flex-col overflow-y-auto border-r"
          style={{ backgroundColor: "var(--color-interactive-primary)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="px-4 pt-6 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>Competitors</p>
          </div>
          <nav role="tablist" aria-label="Competitors" className="flex-1 px-3 pb-6 space-y-0.5">
            {competitors.map((comp, i) => (
              <button
                key={comp.id}
                role="tab"
                aria-selected={selected === i}
                onClick={() => { setSelected(i); setTab("snapshot"); }}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative"
                style={{
                  backgroundColor: selected === i ? `${comp.color}20` : "transparent",
                }}
                data-testid={`competitor-tab-${comp.id}`}
              >
                {selected === i && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                    style={{ backgroundColor: comp.color }}
                  />
                )}
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0 transition-all"
                  style={{ backgroundColor: selected === i ? comp.color : `${comp.color}50` }}
                >
                  {comp.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-xs font-bold truncate transition-colors"
                    style={{ color: selected === i ? "#fff" : "rgba(255,255,255,0.45)" }}
                  >
                    {comp.name}
                  </p>
                  <p
                    className="text-[10px] font-semibold truncate mt-0.5"
                    style={{ color: selected === i ? comp.extraColor : "rgba(255,255,255,0.2)" }}
                  >
                    {comp.extra}
                  </p>
                </div>
              </button>
            ))}
          </nav>

          {/* Left rail footer */}
          <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Last updated March 2025</p>
          </div>
        </aside>

        {/* Right panel — competitor detail */}
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: "#060f08" }}>
          {/* Competitor hero — full dark with color accent glow */}
          <div className="relative overflow-hidden px-10 pt-8 pb-7">
            {/* Subtle color glow top-right */}
            <div
              className="absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: `${c.color}25` }}
            />
            {/* Accent border line at top */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ backgroundColor: c.color, opacity: 0.7 }}
            />

            <div className="relative z-10">
              {/* Name + metadata row */}
              <div className="flex items-start gap-5 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black text-white shrink-0 ring-2 ring-offset-2"
                  style={{ backgroundColor: c.color, ringColor: `${c.color}40`, ringOffsetColor: "#060f08" }}
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h1
                    className="text-white text-2xl font-black leading-tight"
                    style={{ fontFamily: "'Obviously Narrow', sans-serif" }}
                    data-testid="competitor-name"
                  >
                    {c.name}
                  </h1>
                  <p className="text-sm mt-1 leading-snug" style={{ color: "rgba(255,255,255,0.45)" }}>{c.tagline}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${c.color}20`, color: `${c.color}cc`, border: `1px solid ${c.color}30` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Metadata chips */}
                <div className="flex gap-3 shrink-0">
                  {[
                    { label: "Founded", value: c.founded },
                    { label: "Raised", value: c.raised },
                    { label: "Focus", value: c.focus },
                  ].map((m) => (
                    <div key={m.label} className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.22)" }}>{m.label}</p>
                      <p className="text-xs font-bold text-white/70 mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert banner — dark themed */}
              <AlertBanner alert={c.alert} accentColor={c.color} />
            </div>
          </div>

          {/* Pill tabs */}
          <div
            className="sticky top-0 z-20 px-10 py-3 flex gap-2 border-b"
            style={{ backgroundColor: "#060f08", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div role="tablist" aria-label="Competitor details" className="flex gap-2">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  aria-controls={`tabpanel-${key}`}
                  id={`tab-${key}`}
                  onClick={() => setTab(key)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
                  style={
                    tab === key
                      ? { backgroundColor: c.color, color: "var(--color-interactive-primary)" }
                      : { backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }
                  }
                  data-testid={`tab-${key}`}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div
            role="tabpanel"
            id={`tabpanel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            className="px-10 py-8 space-y-4"
            data-testid={`tabpanel-${tab}`}
          >
            {/* SNAPSHOT */}
            {tab === "snapshot" && (
              <div className="grid grid-cols-2 gap-4">
                {c.snapshot.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-6 border"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", borderTopColor: c.color, borderTopWidth: 2 }}
                  >
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest mb-2"
                      style={{ color: c.color }}
                    >
                      {s.label}
                    </p>
                    <p className="text-white/75 text-sm leading-relaxed">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* OBJECTIONS */}
            {tab === "objections" && (
              <div className="space-y-4">
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  When you hear this — say this.
                </p>
                {c.objections.map((o, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden border"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}
                  >
                    {/* THEY SAY */}
                    <div
                      className="px-6 py-4 flex gap-3 border-b"
                      style={{ backgroundColor: "rgba(239,68,68,0.07)", borderColor: "rgba(239,68,68,0.15)" }}
                    >
                      <span
                        className="shrink-0 mt-1 text-[9px] font-black px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "rgba(239,68,68,0.2)", color: "#f87171" }}
                      >
                        THEY
                      </span>
                      <p className="text-white/70 text-sm font-medium italic leading-relaxed">{o.hear}</p>
                    </div>
                    {/* YOU SAY */}
                    <div
                      className="px-6 py-5 flex gap-3"
                      style={{ backgroundColor: "rgba(25,245,120,0.05)" }}
                    >
                      <span
                        className="shrink-0 mt-1 text-[9px] font-black px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "rgba(25,245,120,0.15)", color: "var(--color-interactive-primary-cta)" }}
                      >
                        YOU
                      </span>
                      <p className="text-white/65 text-sm leading-relaxed">{o.say}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WEAKNESSES */}
            {tab === "weaknesses" && (
              <div className="space-y-3">
                {c.weaknesses.map((w, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 flex gap-4 border border-l-[3px]"
                    style={{
                      backgroundColor: "rgba(239,68,68,0.05)",
                      borderColor: "rgba(239,68,68,0.12)",
                      borderLeftColor: "#ef4444",
                    }}
                  >
                    <XCircle size={16} className="shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1.5">{w.title}</h4>
                      <p className="text-white/55 text-sm leading-relaxed">{w.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BETTERFLY WINS */}
            {tab === "betterfly" && (
              <div className="space-y-3">
                {c.proofPoints.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 flex gap-4 border border-l-[3px]"
                    style={{
                      backgroundColor: "rgba(25,245,120,0.05)",
                      borderColor: "rgba(25,245,120,0.12)",
                      borderLeftColor: "#19f578",
                    }}
                  >
                    <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: "var(--color-interactive-primary-cta)" }} />
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1.5">{p.title}</h4>
                      <p className="text-white/55 text-sm leading-relaxed">{p.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Closing question — brand yellow */}
            <div
              className="mt-6 rounded-2xl p-7 relative overflow-hidden"
              style={{ backgroundColor: "#e8fb10" }}
            >
              <div
                className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full blur-2xl opacity-30 pointer-events-none"
                style={{ backgroundColor: "var(--color-interactive-primary)" }}
              />
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-3 relative z-10"
                style={{ color: "rgba(4,41,20,0.5)" }}
              >
                Closing Question
              </p>
              <p
                className="text-base leading-relaxed font-semibold italic relative z-10"
                style={{ color: "var(--color-interactive-primary)" }}
                data-testid="closing-question"
              >
                "{c.closingQ}"
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
