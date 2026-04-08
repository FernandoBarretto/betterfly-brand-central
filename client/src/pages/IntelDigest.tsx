import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ChevronDown, Zap, AlertTriangle, ArrowRight, Shield, Target, TrendingUp, TrendingDown, Radio, Layers, Repeat, Eye, Activity, Flame, RefreshCw, Loader2 } from "lucide-react";

interface DigestTheme {
  id: string;
  title: string;
  summary: string;
  severity: "high" | "medium" | "low";
  signal: string;
  players: string[];
  betterflyRead: string;
  icon: string;
}

interface DigestData {
  weekOf: string;
  overallRead: string;
  themes: DigestTheme[];
  generatedAt?: string;
}

interface TradePulseItem {
  id: string;
  publication: string;
  headline: string;
  link?: string;
  pubDate?: string;
  summary: string;
  soWhat: string;
  tier: number;
  topicCluster: string;
  relevance: "high" | "medium" | "low";
  isFallback?: boolean;
}

interface TradePulseData {
  generatedAt?: string;
  articlesScanned?: number;
  feedStatus?: string;
  items: TradePulseItem[];
}

function getNextRefreshLabel(): string {
  const now = new Date();
  const day = now.getDay();
  if (day >= 1 && day <= 3) return "Thursday 8am";
  return "Monday 8am";
}

function formatGeneratedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const iconMap: Record<string, React.ComponentType<any>> = {
  TrendingUp, TrendingDown, Zap, AlertTriangle, Shield, Target, Radio, Layers, Repeat, Eye, Activity, Flame,
};

const severityAccent: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#4DEE93",
};

const severityBadge: Record<string, { bg: string; border: string; text: string }> = {
  high: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.2)", text: "#ef4444" },
  medium: { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.2)", text: "#f59e0b" },
  low: { bg: "rgba(77,238,147,0.12)", border: "rgba(77,238,147,0.2)", text: "#4DEE93" },
};

function useInView(threshold = 0.15, forceVisible = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(forceVisible);
  useEffect(() => {
    if (forceVisible) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, forceVisible]);
  return { ref, visible };
}

const competitors = [
  { id: "yulife", initials: "YU", name: "YuLife", tagline: "Gamified group life & wellness — UK-origin, US expansion", color: "#7c3aed", tags: ["B2B", "UK-Origin", "Wellness", "Gamification"],
    alert: { type: "warn" as const, text: "YuLife runs zero active paid ads on Meta (confirmed via Ad Library, March 2025). All paid media is LinkedIn-only, targeting HR buyers. They have no US-specific creative and no consumer/employee-direct advertising. Their US expansion is real but early-stage.", date: "Mar 2025" },
    coreClaim: '"Insurance that inspires life" — daily gamified wellness earns YuCoin rewards',
    weaknesses: [{ title: "US Market Newcomer", body: "No established US broker relationships, no US-specific creative, and limited brand awareness among American employees and HR teams." }],
    ourWins: [{ title: "US Market Expertise", body: "Built for the US market from day one — US carrier relationships, US compliance, and US-specific broker workflows." }] },
  { id: "beam", initials: "BE", name: "Beam Benefits", tagline: "Full-stack voluntary benefits carrier — dental, vision, disability, life", color: "#2563eb", tags: ["B2B", "US Market", "Dental-Origin", "Benefits Admin"],
    alert: { type: "danger" as const, text: "Critical Intel — Perks Programme Sunset (May 2025): Beam discontinued their signature smart toothbrush Perks programme, citing only 4% member enrollment. This removes their most distinctive consumer-facing differentiator.", date: "May 2025" },
    coreClaim: '"Benefits simplified" — single carrier for dental, vision, disability, and life with 2-year rate guarantees',
    weaknesses: [{ title: "Carrier Lock-In", body: "Brokers who use Beam's platform are effectively selling Beam products. No carrier-agnostic flexibility for clients with specific needs." }],
    ourWins: [{ title: "Carrier-Agnostic Freedom", body: "We work with Beam and every other carrier. Brokers choose the best carrier for each client — not the one that owns the platform." }] },
  { id: "nayya", initials: "NY", name: "Nayya", tagline: "AI-powered benefits decision platform — SuperAgent & personalised guidance", color: "#0891b2", tags: ["B2B", "US Market", "AI-Native", "HR Tech"],
    alert: { type: "warn" as const, text: '"AI-powered" is rapidly commoditising — every platform now claims AI. Nayya\'s moat is narrowing. Their SuperAgent acquisition (Northstar, 2025) is a strategic response to this pressure.', date: "Mar 2025" },
    coreClaim: '"AI layer between employees and their benefits" — personalised guidance, always-on decision support',
    weaknesses: [{ title: "Feature, Not a Platform", body: "Nayya is an AI layer on top of existing benefits infrastructure. It requires a separate administration platform to function — it doesn't replace one." }],
    ourWins: [{ title: "Solid Data Foundation", body: "We provide the accurate, clean benefits data that any AI layer — including Nayya's — needs to function well." }] },
  { id: "selerix", initials: "SX", name: "Selerix", tagline: "Enterprise-grade benefits administration & enrollment — BenSelect platform", color: "#059669", tags: ["B2B", "US Market", "Enterprise", "Benefits Admin"],
    alert: { type: "warn" as const, text: 'Selerix recently launched "Benefits Genius" — an AI-powered assistant layered on top of BenSelect. This is a direct response to competitive pressure from AI-native platforms like Nayya.', date: "Feb 2025" },
    coreClaim: "Powerful, flexible benefits administration for complex cases — handles virtually any plan design or eligibility rule",
    weaknesses: [{ title: "Legacy Architecture", body: "BenSelect was built for a different era of benefits administration. Modern integration requirements and mobile-first employee expectations reveal its age." }],
    ourWins: [{ title: "Modern Architecture", body: "Built for today's integration requirements — mobile-first, API-native, real-time data. No legacy technical debt to work around." }] },
  { id: "nava", initials: "NV", name: "Nava Benefits", tagline: "Tech-enabled modern brokerage — startup & SMB focused, Nava HQ platform", color: "#dc2626", tags: ["B2B", "US Market", "Brokerage", "Startup-Focused"],
    alert: { type: "tip" as const, text: 'Nava is a brokerage that built technology to support its brokerage services. Their "Fix Healthcare Live 2026" conference signals ambitions to become a thought-leadership platform. Nava HQ is proprietary and tied to their brokerage relationship.', date: "Jan 2025" },
    coreClaim: '"Co-pilot for benefits" — tech-enabled brokerage with Nava HQ platform for modern employers',
    weaknesses: [{ title: "Platform Lock-In", body: "Technology is inseparable from the brokerage relationship. Clients lose platform access if they change brokers — a significant exit barrier." }],
    ourWins: [{ title: "Broker Independence", body: "Our platform works with any broker. Clients own their technology relationship independently of their brokerage choice." }] },
  { id: "aetna", initials: "AE", name: "Aetna Wellness", tagline: "Major US health carrier — CVS Health subsidiary, employer wellness programmes", color: "#9333ea", tags: ["B2B", "US Market", "Large Carrier", "Employer Wellness"],
    alert: { type: "warn" as const, text: "Aetna's wellness play centres on 'Aetna One Advocate' — a dedicated health concierge service — and employer wellness programmes tied to their medical plans. They compete on brand trust and network breadth, not technology innovation.", date: "Mar 2025" },
    coreClaim: '"Healthademic" employer wellness — integrated health concierge, wellness incentives, and medical plan bundling',
    weaknesses: [{ title: "Wellness Tied to Medical Plan", body: "Aetna's wellness capabilities are only available to employers who purchase Aetna medical plans. Not a standalone product — a retention mechanism." }],
    ourWins: [{ title: "SMB-First Design", body: "Every feature is designed for the 10–500 employee market that Aetna can't serve well. We're not competing for large enterprise — we're winning where they can't play." }] },
];

const competitorColorMap: Record<string, string> = {};
competitors.forEach(c => { competitorColorMap[c.name] = c.color; competitorColorMap[c.initials] = c.color; });

function getCompetitorInfo(name: string) {
  const c = competitors.find(comp => comp.name.toLowerCase() === name.toLowerCase());
  return c ? { initials: c.initials, color: c.color } : { initials: name.slice(0, 2).toUpperCase(), color: "rgba(255,255,255,0.15)" };
}

type AlertType = "danger" | "warn" | "tip";

function getStatusDot(type: AlertType) {
  if (type === "danger") return { color: "#4DEE93", shadow: "0 0 0 3px rgba(77,238,147,0.2)", pulse: true, label: "Active" };
  if (type === "warn") return { color: "#f59e0b", shadow: "0 0 0 3px rgba(245,158,11,0.2)", pulse: true, label: "Watch" };
  return { color: "rgba(255,255,255,0.2)", shadow: "none", pulse: false, label: "Quiet" };
}

const intelFeed = [...competitors]
  .filter(c => c.alert?.text)
  .sort((a, b) => {
    if (a.alert.type === "danger" && b.alert.type !== "danger") return -1;
    if (b.alert.type === "danger" && a.alert.type !== "danger") return 1;
    return 0;
  });

export function IntelDigest() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [digestLoading, setDigestLoading] = useState(false);
  const [digestError, setDigestError] = useState<string | null>(null);
  const [newsInput, setNewsInput] = useState("");
  const [newsOpen, setNewsOpen] = useState(false);
  const [bootWaiting, setBootWaiting] = useState(false);
  const [bootTimeout, setBootTimeout] = useState(false);
  const [activeTab, setActiveTab] = useState<"competitor" | "trade">("competitor");
  const [tradePulse, setTradePulse] = useState<TradePulseData | null>(null);
  const [tradePulseLoading, setTradePulseLoading] = useState(false);
  const [tradePulseError, setTradePulseError] = useState<string | null>(null);
  const themesSection = useInView(0.1);
  const feedSection = useInView(0.1);
  const pulseSection = useInView(0.1);
  const winsSection = useInView(0.1);
  const tradePulseSection = useInView(0.1, activeTab === "trade");

  useEffect(() => {
    let cancelled = false;
    let pollCount = 0;
    const pollInterval = 3000;
    const maxPolls = 10;

    function fetchDigest() {
      fetch("/api/intel-digest", { headers: { "x-passcode": "betterfly2025" } })
        .then(r => { if (!r.ok) return null; return r.json(); })
        .then(d => {
          if (cancelled) return;
          if (d && d.themes) {
            setDigest(d);
            setBootWaiting(false);
            setBootTimeout(false);
          } else {
            setBootWaiting(true);
            pollCount++;
            if (pollCount >= maxPolls) {
              setBootTimeout(true);
            } else {
              setTimeout(fetchDigest, pollInterval);
            }
          }
        })
        .catch(() => { if (!cancelled) setBootWaiting(true); });
    }

    fetchDigest();

    let tpPollCount = 0;
    function fetchTradePulse() {
      fetch("/api/trade-pulse", { headers: { "x-passcode": "betterfly2025" }, cache: "no-store" })
        .then(r => { if (!r.ok) return null; return r.json(); })
        .then(d => {
          if (cancelled) return;
          if (d && d.items && d.items.length > 0) {
            setTradePulse(d);
          } else {
            tpPollCount++;
            if (tpPollCount < 45) {
              setTimeout(fetchTradePulse, 2000);
            }
          }
        })
        .catch(() => {
          if (!cancelled) {
            tpPollCount++;
            if (tpPollCount < 45) setTimeout(fetchTradePulse, 2000);
          }
        });
    }
    fetchTradePulse();

    return () => { cancelled = true; };
  }, []);

  const runTradePulseAnalysis = async () => {
    setTradePulseLoading(true);
    setTradePulseError(null);
    try {
      const res = await fetch("/api/trade-pulse/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-passcode": "betterfly2025" },
      });
      if (!res.ok) {
        let errMsg = "Analysis failed";
        try { const errData = await res.json(); errMsg = errData.error || errMsg; } catch { errMsg = `Server error (${res.status})`; }
        throw new Error(errMsg);
      }
      const data = await res.json();
      setTradePulse(data);
    } catch (err: any) {
      setTradePulseError(err.message);
    } finally {
      setTradePulseLoading(false);
    }
  };

  const runAnalysis = async () => {
    setDigestLoading(true);
    setDigestError(null);
    try {
      const newsContext = newsInput.trim() ? newsInput.split("\n").map(s => s.trim()).filter(Boolean) : [];
      const res = await fetch("/api/intel-digest/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-passcode": "betterfly2025" },
        body: JSON.stringify({ newsContext }),
      });
      if (!res.ok) {
        let errMsg = "Analysis failed";
        try { const errData = await res.json(); errMsg = errData.error || errMsg; } catch { errMsg = `Server error (${res.status})`; }
        throw new Error(errMsg);
      }
      const data = await res.json();
      setDigest(data);
      setNewsOpen(false);
    } catch (err: any) {
      setDigestError(err.message);
    } finally {
      setDigestLoading(false);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-forest-950">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes statusPulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        @keyframes dotPulse { 0%,100% { box-shadow: 0 0 0 3px rgba(25,245,120,0.15); } 50% { box-shadow: 0 0 0 7px rgba(25,245,120,0.04); } }
        @keyframes dotPulseAmber { 0%,100% { box-shadow: 0 0 0 3px rgba(245,158,11,0.15); } 50% { box-shadow: 0 0 0 7px rgba(245,158,11,0.04); } }
        @keyframes underlineGrow { from { width:0; } to { width:100%; } }
        @keyframes shimmer { 0% { background-position: -800px 0; } 100% { background-position: 800px 0; } }
        .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 800px 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        @keyframes spinGreen { to { transform: rotate(360deg); } }
        .theme-card { transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
        .theme-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.14); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .feed-card { transition: transform 0.2s ease, border-color 0.2s ease; }
        .feed-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.15); }
        .pulse-card { transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
        .pulse-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.15); box-shadow: 0 8px 32px rgba(0,0,0,0.35); }
        .trade-pulse-card { transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
        .trade-pulse-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.35); }
        .matchup-row { transition: transform 0.2s ease, border-color 0.2s ease; }
        .matchup-row:hover { border-color: rgba(255,255,255,0.15); }
        .news-panel { transition: border-color 0.2s ease, background 0.2s ease; }
        .news-panel:hover { border-color: rgba(25,245,120,0.2); background: rgba(255,255,255,0.06); }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* SCROLL PROGRESS BAR */}
      <div style={{ position: "fixed", top: 0, left: 256, right: 0, height: 3, zIndex: 50, pointerEvents: "none" }}>
        <div className="bg-green-400" style={{ width: `${scrollProgress}%`, height: "100%", transition: "width 0.08s linear" }} />
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-900" style={{ minHeight: 320, padding: "64px 48px 80px" }}>
        <svg viewBox="0 0 200 200" className="absolute pointer-events-none" style={{ width: 400, height: 400, top: -80, right: -60, opacity: 0.04, transform: `translate(${parallax.x * 0.2}px, ${parallax.y * 0.2}px)` }}>
          <path d="M100 10 C60 10 10 50 10 100 C10 150 50 190 100 190 C80 150 80 120 100 100 C120 120 120 150 100 190 C150 190 190 150 190 100 C190 50 140 10 100 10Z" fill="#4DEE93" />
        </svg>
        <svg viewBox="0 0 200 200" className="absolute pointer-events-none" style={{ width: 300, height: 300, bottom: -40, left: -30, opacity: 0.04, transform: `translate(${parallax.x * 0.5}px, ${parallax.y * 0.5}px)` }}>
          <path d="M100 10 C60 10 10 50 10 100 C10 150 50 190 100 190 C80 150 80 120 100 100 C120 120 120 150 100 190 C150 190 190 150 190 100 C190 50 140 10 100 10Z" fill="#4DEE93" />
        </svg>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/market-intelligence/overview" className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-xs transition-colors">
              <ChevronLeft size={14} /> Market Intelligence
            </Link>
            <ChevronRight size={12} className="text-white/20" />
            <span className="text-green-400 text-xs">Intel Digest</span>
          </div>

          <p className="text-green-400 text-[11px] font-bold uppercase mb-4" style={{ letterSpacing: "0.15em", fontFamily: "monospace", animation: "fadeIn 0.4s ease-out 0.1s both" }}>
            Market Intelligence &nbsp;·&nbsp; Intel Digest
          </p>

          <h1 style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.05 }}>
            <span className="block text-white font-bold" style={{ animation: "fadeUp 0.65s ease-out 0.2s both" }}>
              What the market
            </span>
            <span className="block text-white font-bold" style={{ animation: "fadeUp 0.65s ease-out 0.4s both" }}>
              is doing right now.
            </span>
          </h1>

          <p className="max-w-[560px] mt-5" style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.6, animation: "fadeUp 0.5s ease-out 0.6s both" }}>
            {digest ? digest.overallRead : "Generate this week's analysis to see the macro view."}
          </p>

          <div className="flex items-center gap-3 mt-7" style={{ animation: "fadeIn 0.5s ease-out 0.8s both" }}>
            <span className="text-white/70 text-xs px-3.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)" }}>
              6 competitors tracked
            </span>
            <span className="text-white/70 text-xs px-3.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)" }}>
              6 publications monitored
            </span>
            <span className="text-white/70 text-xs px-3.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)" }}>
              {digest?.weekOf || "March 2026"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1 rounded-full font-semibold" style={{ background: "rgba(239,68,68,0.12)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(239,68,68,0.25)", color: "#ef4444" }}>
              <span style={{ width: 6, height: 6, background: "#ef4444", borderRadius: "50%", animation: "statusPulse 2s ease-in-out infinite" }} />
              Internal Only
            </span>
          </div>
          {digest?.generatedAt && (
            <p className="mt-3" style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, animation: "fadeIn 0.5s ease-out 1s both" }}>
              AI synthesis generated {formatGeneratedAt(digest.generatedAt)} &nbsp;&middot;&nbsp; Next refresh: {getNextRefreshLabel()}
            </p>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-12 max-w-6xl" style={{ paddingTop: 48, paddingBottom: 80 }}>

        {/* NEWS INPUT PANEL — Collapsible */}
        <div style={{ marginBottom: 48 }}>
          <button
            onClick={() => setNewsOpen(!newsOpen)}
            className="news-panel w-full flex items-center gap-3 rounded-xl cursor-pointer text-left"
            style={{ background: "rgba(255,255,255,0.04)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.08)", padding: "14px 20px" }}
          >
            <ChevronDown size={16} className="text-green-400 shrink-0" style={{ transform: newsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Add industry headlines for richer analysis</span>
          </button>

          <div style={{ maxHeight: newsOpen ? 300 : 0, opacity: newsOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.3s ease" }}>
            <div style={{ paddingTop: 16 }}>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
                Paste 3–5 headlines, article titles, or excerpts from benefits industry press this week. One per line. These feed the synthesis alongside competitive data.
              </p>
              <textarea
                value={newsInput}
                onChange={e => setNewsInput(e.target.value)}
                placeholder="e.g. &quot;Aetna launches new SMB digital platform&quot;"
                rows={5}
                className="w-full resize-none focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", borderWidth: 1, borderStyle: "solid", borderColor: newsInput ? "var(--color-border-focus)" : "rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "white", transition: "border-color 0.2s ease" }}
              />
              {digestError && <p className="text-red-400 text-xs mt-2">{digestError}</p>}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={runAnalysis}
                  disabled={digestLoading}
                  className="inline-flex items-center gap-2 font-sans font-semibold rounded-full transition-all duration-normal ease-out"
                  style={{ background: digestLoading ? "rgba(77,238,147,0.15)" : "var(--color-interactive-primary-cta)", color: digestLoading ? "var(--color-interactive-primary-cta)" : "var(--color-interactive-primary)", padding: "10px 24px", fontSize: 14 }}
                >
                  {digestLoading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Zap size={16} /> Generate Analysis</>}
                </button>
                {digest && (
                  <button
                    onClick={runAnalysis}
                    disabled={digestLoading}
                    className="inline-flex items-center gap-2 rounded-full font-sans transition-colors duration-normal text-white hover:text-green-400"
                    style={{ borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.15)", padding: "10px 20px", fontSize: 14 }}
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="flex items-center gap-1 mb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 0 }}>
          <button
            onClick={() => setActiveTab("competitor")}
            className="relative px-5 py-3 text-sm font-semibold transition-colors"
            style={{ color: activeTab === "competitor" ? "#4DEE93" : "rgba(255,255,255,0.4)" }}
          >
            Competitor Watch
            {activeTab === "competitor" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-400" />}
          </button>
          <button
            onClick={() => setActiveTab("trade")}
            className="relative px-5 py-3 text-sm font-semibold transition-colors"
            style={{ color: activeTab === "trade" ? "#5FFFF3" : "rgba(255,255,255,0.4)" }}
          >
            Trade Pulse
            {activeTab === "trade" && <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#5FFFF3" }} />}
            {tradePulse && tradePulse.items.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold" style={{ background: "rgba(95,255,243,0.15)", color: "#5FFFF3" }}>
                {tradePulse.items.length}
              </span>
            )}
          </button>
        </div>

        {/* ===== COMPETITOR WATCH TAB ===== */}
        {activeTab === "competitor" && <>

        {/* THEMES SECTION */}
        <section ref={themesSection.ref} style={{ paddingBottom: 80 }}>
          <div className="mb-10">
            <p className="text-green-400 text-[11px] font-bold uppercase mb-2" style={{ letterSpacing: "0.12em", opacity: themesSection.visible ? 1 : 0, animation: themesSection.visible ? "fadeUp 0.5s ease-out both" : "none" }}>
              This Week's Themes
            </p>
            <h2 className="text-white font-bold leading-tight" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", opacity: themesSection.visible ? 1 : 0, animation: themesSection.visible ? "fadeUp 0.6s ease-out 0.1s both" : "none" }}>
              What's{" "}
              <span className="relative inline-block">
                moving
                <span className="absolute left-0 h-[2px] bg-green-400" style={{ bottom: -3, animation: themesSection.visible ? "underlineGrow 0.6s ease-out 0.5s both" : "none", width: themesSection.visible ? "100%" : "0%" }} />
              </span>.
            </h2>
          </div>

          {digest ? (
            <div className="space-y-6">
              {digest.themes.map((theme, i) => {
                const accent = severityAccent[theme.severity] || severityAccent.low;
                const badge = severityBadge[theme.severity] || severityBadge.low;
                const IconComp = iconMap[theme.icon] || Zap;
                return (
                  <div
                    key={theme.id}
                    className="theme-card relative overflow-hidden"
                    style={{
                      background: "#0d1a10",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "rgba(255,255,255,0.07)",
                      borderRadius: 20,
                      opacity: themesSection.visible ? 1 : 0,
                      transform: themesSection.visible ? "translateY(0)" : "translateY(24px)",
                      transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms`,
                    }}
                  >
                    {/* Left accent bar */}
                    <div className="absolute top-0 left-0 bottom-0" style={{ width: 4, background: accent }} />

                    <div style={{ padding: "28px 32px 0 32px" }}>
                      {/* Theme number + severity badge */}
                      <div className="flex items-center gap-3">
                        <IconComp size={18} style={{ color: accent }} />
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 700 }}>
                          Theme {String(i + 1).padStart(2, "0")}
                        </span>
                        <span style={{ fontSize: 1, color: "rgba(255,255,255,0.15)" }}>·</span>
                        <span className="rounded-full" style={{ fontSize: 10, textTransform: "uppercase" as const, fontWeight: 700, letterSpacing: "0.06em", padding: "2px 8px", background: badge.bg, borderWidth: 1, borderStyle: "solid", borderColor: badge.border, color: badge.text }}>
                          {theme.severity} signal
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-bold" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "clamp(22px, 3vw, 38px)", lineHeight: 1.1, marginTop: 12 }}>
                        {theme.title}
                      </h3>

                      {/* Summary */}
                      <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.75)", marginTop: 12 }}>
                        {theme.summary}
                      </p>

                      {/* Divider */}
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "20px 0" }} />

                      {/* Signal */}
                      <div>
                        <p style={{ fontSize: 10, color: "var(--color-interactive-primary-cta)", letterSpacing: "0.1em", textTransform: "uppercase" as const, fontWeight: 700 }}>Signal</p>
                        <p style={{ fontSize: 13, fontStyle: "italic", color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{theme.signal}</p>
                      </div>

                      {/* Players */}
                      <div style={{ marginTop: 16 }}>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" as const, letterSpacing: "0.08em", fontWeight: 600 }}>Players exhibiting this</p>
                        <div className="flex gap-2" style={{ marginTop: 8, marginBottom: 20 }}>
                          {theme.players.map(p => {
                            const info = getCompetitorInfo(p);
                            return (
                              <div
                                key={p}
                                title={p}
                                className="flex items-center justify-center text-white font-bold shrink-0"
                                style={{ width: 28, height: 28, borderRadius: "50%", fontSize: 10, background: info.color }}
                              >
                                {info.initials}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Betterfly Read */}
                    <div style={{ background: "rgba(77,238,147,0.04)", borderTop: "1px solid rgba(77,238,147,0.1)", padding: "20px 32px" }}>
                      <div className="flex items-center gap-1.5">
                        <Shield size={14} color="var(--color-interactive-primary-cta)" />
                        <span style={{ color: "var(--color-interactive-primary-cta)", fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700 }}>Betterfly Read</span>
                      </div>
                      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, marginTop: 8 }}>{theme.betterflyRead}</p>
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 flex items-center justify-end gap-3">
                {digestError && <p className="text-red-400 text-xs">{digestError}</p>}
                <button
                  onClick={runAnalysis}
                  disabled={digestLoading}
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold px-4 py-2 rounded-full transition-all duration-normal text-green-400"
                  style={{ background: "rgba(77,238,147,0.08)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(77,238,147,0.2)" }}
                >
                  {digestLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  Re-analyze
                </button>
              </div>
            </div>
          ) : digestLoading || bootWaiting ? (
            /* LOADING SKELETON */
            <div style={{ opacity: themesSection.visible ? 1 : 0, animation: themesSection.visible ? "fadeIn 0.4s ease-out both" : "none" }}>
              <div className="space-y-6">
                {[0, 1, 2].map(i => (
                  <div key={i} className="overflow-hidden" style={{ background: "#0d1a10", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 32px" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="skeleton" style={{ width: 18, height: 18, borderRadius: 4 }} />
                      <div className="skeleton" style={{ width: 80, height: 10 }} />
                      <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 999, marginLeft: 8 }} />
                    </div>
                    <div className="skeleton" style={{ width: "70%", height: 28, marginBottom: 16 }} />
                    <div className="skeleton" style={{ width: "100%", height: 14, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: "90%", height: 14, marginBottom: 8 }} />
                    <div className="skeleton" style={{ width: "60%", height: 14, marginBottom: 24 }} />
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                      <div className="skeleton" style={{ width: 50, height: 10, marginBottom: 8 }} />
                      <div className="skeleton" style={{ width: "80%", height: 12, marginBottom: 20 }} />
                      <div className="flex gap-2">
                        {[0, 1, 2].map(j => <div key={j} className="skeleton" style={{ width: 28, height: 28, borderRadius: "50%" }} />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center gap-2 mt-8">
                <div className="flex items-center gap-3">
                  <div style={{ width: 18, height: 18, borderRadius: "50%", borderWidth: 2, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)", borderTopColor: "var(--color-interactive-primary-cta)", animation: "spinGreen 0.8s linear infinite" }} />
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                    {digestLoading ? "Analyzing 6 competitors + your headlines..." : "Generating initial analysis..."}
                  </span>
                </div>
                {bootTimeout && (
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 8, textAlign: "center", maxWidth: 400 }}>
                    Analysis is being generated for the first time.<br />
                    This takes about 15 seconds — refresh the page shortly.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* EMPTY STATE — fallback if boot analysis somehow not running */
            <div style={{ opacity: themesSection.visible ? 1 : 0, animation: themesSection.visible ? "fadeUp 0.5s ease-out 0.2s both" : "none" }}>
              <div className="text-center" style={{ padding: "64px 32px" }}>
                <Activity size={48} className="mx-auto mb-5" style={{ color: "rgba(255,255,255,0.15)" }} />
                <h3 className="text-white mb-2" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: 18, fontWeight: 700 }}>
                  No analysis generated yet.
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, marginBottom: 28, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
                  Add headlines and generate<br />this week's intelligence digest.
                </p>
                {digestError && <p className="text-red-400 text-xs mb-4">{digestError}</p>}
                <button
                  onClick={runAnalysis}
                  disabled={digestLoading}
                  className="inline-flex items-center gap-2 font-bold rounded-lg transition-colors"
                  style={{ background: "var(--color-interactive-primary-cta)", color: "var(--color-interactive-primary)", padding: "10px 24px", fontSize: 14 }}
                >
                  <Zap size={16} /> Generate Analysis
                </button>
              </div>
            </div>
          )}
        </section>

        {/* LATEST INTEL FEED */}
        <section ref={feedSection.ref} style={{ paddingBottom: 80 }}>
          <div className="mb-10">
            <p className="text-green-400 text-[11px] font-bold uppercase mb-2" style={{ letterSpacing: "0.12em", opacity: feedSection.visible ? 1 : 0, animation: feedSection.visible ? "fadeUp 0.5s ease-out both" : "none" }}>
              Latest Intel
            </p>
            <h2 className="text-white font-bold leading-tight" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", opacity: feedSection.visible ? 1 : 0, animation: feedSection.visible ? "fadeUp 0.6s ease-out 0.1s both" : "none" }}>
              What changed. Who{" "}
              <span className="relative inline-block">
                moved
                <span className="absolute left-0 h-[2px] bg-green-400" style={{ bottom: -3, animation: feedSection.visible ? "underlineGrow 0.6s ease-out 0.5s both" : "none", width: feedSection.visible ? "100%" : "0%" }} />
              </span>.
            </h2>
          </div>

          <div className="space-y-5">
            {intelFeed.map((comp, i) => {
              const isCritical = comp.alert.type === "danger";
              return (
                <div
                  key={comp.id}
                  className="feed-card rounded-2xl overflow-hidden flex"
                  style={{
                    background: "#0d1a10",
                    borderWidth: "1px 1px 1px 3px",
                    borderStyle: "solid",
                    borderColor: `rgba(255,255,255,0.07) rgba(255,255,255,0.07) rgba(255,255,255,0.07) ${comp.color}`,
                    opacity: feedSection.visible ? 1 : 0,
                    animation: feedSection.visible ? `fadeUp 0.5s ease-out ${0.2 + i * 0.1}s both` : "none",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 px-5 py-0" style={{ height: 48, backgroundColor: comp.color }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                        {comp.initials}
                      </div>
                      <span className="font-bold text-white text-sm">{comp.name}</span>
                      <span className="ml-auto inline-flex items-center gap-1.5 text-white text-[10px] font-bold uppercase tracking-wider" style={{ opacity: isCritical ? 1 : 0.8 }}>
                        {isCritical ? <Zap size={14} /> : <AlertTriangle size={14} />}
                        {isCritical ? "Critical Intel" : "Intel Note"}
                      </span>
                    </div>
                    <div className="px-6 py-5">
                      <div className="flex justify-end mb-1">
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{comp.alert.date}</span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>{comp.alert.text}</p>
                      <Link href="/market-intelligence/battle-cards" className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold text-green-400 hover:underline transition-colors">
                        <ArrowRight size={13} /> View Battle Card
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMPETITOR PULSE GRID — Supporting Context */}
        <section ref={pulseSection.ref} style={{ paddingBottom: 80 }}>
          <div className="mb-10">
            <p className="text-[11px] font-bold uppercase mb-2" style={{ letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", opacity: pulseSection.visible ? 1 : 0, animation: pulseSection.visible ? "fadeUp 0.5s ease-out both" : "none" }}>
              Supporting Signals
            </p>
            <h2 className="text-white font-bold leading-tight" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "clamp(24px, 3.5vw, 38px)", opacity: pulseSection.visible ? 1 : 0, animation: pulseSection.visible ? "fadeUp 0.6s ease-out 0.1s both" : "none" }}>
              The players behind the themes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {competitors.map((comp, i) => {
              const status = getStatusDot(comp.alert.type);
              return (
                <div
                  key={comp.id}
                  className="pulse-card overflow-hidden"
                  style={{
                    background: "#0d1a10",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "rgba(255,255,255,0.07)",
                    borderRadius: 16,
                    opacity: pulseSection.visible ? 1 : 0,
                    animation: pulseSection.visible ? `fadeUp 0.5s ease-out ${0.1 + i * 0.08}s both` : "none",
                  }}
                >
                  <div style={{ height: 6, backgroundColor: comp.color }} />
                  <div style={{ padding: 20 }}>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="flex items-center justify-center text-white font-bold shrink-0" style={{ width: 40, height: 40, borderRadius: "50%", fontSize: 12, backgroundColor: comp.color }}>
                        {comp.initials}
                      </div>
                      <span className="font-bold text-white" style={{ fontSize: 16 }}>{comp.name}</span>
                      <span
                        className="ml-auto shrink-0"
                        title={status.label}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: status.color,
                          boxShadow: status.pulse ? `0 0 0 3px ${comp.alert.type === "danger" ? "rgba(25,245,120,0.15)" : "rgba(245,158,11,0.15)"}` : "none",
                          animation: status.pulse ? "dotPulse 2.5s ease-in-out infinite" : "none",
                        }}
                      />
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 4 }}>{comp.tagline}</p>
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginTop: 4 }}>Data last updated: {comp.alert.date}</p>
                    <div className="flex flex-wrap gap-1.5" style={{ marginTop: 12, marginBottom: 16 }}>
                      {comp.tags.slice(0, 3).map((tag) => (
                        <span key={tag} style={{ background: "rgba(255,255,255,0.06)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.65)", borderRadius: 999, padding: "2px 10px", fontSize: 11 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "16px 0", paddingTop: 16 }}>
                      <p style={{ color: "var(--color-interactive-primary-cta)", fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700, marginBottom: 6 }}>Core Claim</p>
                      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.5, fontStyle: "italic" }}>"{comp.coreClaim}"</p>
                    </div>
                    <Link href="/market-intelligence/battle-cards" className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-green-400 hover:underline transition-colors" style={{ marginTop: 16 }}>
                      <ArrowRight size={12} /> Full Battle Card
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* WHERE BETTERFLY WINS */}
        <section ref={winsSection.ref}>
          <div className="mb-10">
            <p className="text-green-400 text-[11px] font-bold uppercase mb-2" style={{ letterSpacing: "0.12em", opacity: winsSection.visible ? 1 : 0, animation: winsSection.visible ? "fadeUp 0.5s ease-out both" : "none" }}>
              Where Betterfly Wins
            </p>
            <h2 className="text-white font-bold leading-tight" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", opacity: winsSection.visible ? 1 : 0, animation: winsSection.visible ? "fadeUp 0.6s ease-out 0.1s both" : "none" }}>
              Their gaps. Our{" "}
              <span className="relative inline-block">
                answers
                <span className="absolute left-0 h-[2px] bg-green-400" style={{ bottom: -3, animation: winsSection.visible ? "underlineGrow 0.6s ease-out 0.5s both" : "none", width: winsSection.visible ? "100%" : "0%" }} />
              </span>.
            </h2>
          </div>

          <div className="space-y-5">
            {competitors.map((comp, i) => (
              <div
                key={comp.id}
                className="matchup-row overflow-hidden"
                style={{
                  background: "#0d1a10",
                  borderWidth: "1px 1px 1px 3px",
                  borderStyle: "solid",
                  borderColor: `rgba(255,255,255,0.07) rgba(255,255,255,0.07) rgba(255,255,255,0.07) ${comp.color}`,
                  borderRadius: 20,
                  opacity: winsSection.visible ? 1 : 0,
                  animation: winsSection.visible ? `fadeUp 0.5s ease-out ${0.1 + i * 0.12}s both` : "none",
                }}
              >
                <div className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: comp.color }}>
                      {comp.initials}
                    </div>
                    <span className="font-bold text-white text-sm">{comp.name}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <Target size={14} /> Their Weakness
                  </span>
                </div>
                <div className="px-5 pb-4">
                  <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.6 }}>{comp.weaknesses[0]?.body}</p>
                </div>
                <div className="px-5 py-3.5" style={{ background: "rgba(77,238,147,0.04)", borderTop: "1px solid rgba(77,238,147,0.1)" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield size={14} className="text-green-400" />
                    <span className="text-green-400 text-[10px] font-bold uppercase tracking-[0.1em]">Betterfly Advantage</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6, marginTop: 4 }}>{comp.ourWins[0]?.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/market-intelligence/battle-cards"
              className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-white px-5 py-2.5 rounded-full transition-all duration-normal hover:text-green-400"
              style={{ borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.15)" }}
            >
              <ArrowRight size={14} /> Dive into Battle Cards
            </Link>
          </div>
        </section>

        </>}

        {/* ===== TRADE PULSE TAB ===== */}
        {activeTab === "trade" && (
          <section ref={tradePulseSection.ref} style={{ paddingBottom: 80 }}>
            <div className="mb-10">
              <p className="text-[11px] font-bold uppercase mb-2" style={{ letterSpacing: "0.12em", color: "#5FFFF3", opacity: tradePulseSection.visible ? 1 : 0, animation: tradePulseSection.visible ? "fadeUp 0.5s ease-out both" : "none" }}>
                Industry Trade Publications
              </p>
              <h2 className="text-white font-bold leading-tight" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", opacity: tradePulseSection.visible ? 1 : 0, animation: tradePulseSection.visible ? "fadeUp 0.6s ease-out 0.1s both" : "none" }}>
                What the{" "}
                <span className="relative inline-block">
                  industry
                  <span className="absolute left-0 h-[2px]" style={{ bottom: -3, background: "#5FFFF3", animation: tradePulseSection.visible ? "underlineGrow 0.6s ease-out 0.5s both" : "none", width: tradePulseSection.visible ? "100%" : "0%" }} />
                </span>{" "}is saying.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 12, maxWidth: 560 }}>
                Real articles from HR Dive, BenefitsPro, BenefitNews, Fierce Healthcare, Coverager, and Employee Benefit Adviser — filtered by topic relevance, analyzed for strategic impact.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {["HR Dive", "BenefitsPro", "BenefitNews", "Fierce Healthcare", "Coverager", "Employee Benefit Adviser"].map(pub => (
                <span key={pub} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(95,255,243,0.08)", border: "1px solid rgba(95,255,243,0.15)", color: "#5FFFF3" }}>
                  {pub}
                </span>
              ))}
            </div>

            {tradePulse && tradePulse.items.length > 0 ? (
              <>
                <div className="space-y-4">
                  {tradePulse.items.map((item, i) => {
                    const relevanceColors: Record<string, { bg: string; border: string; text: string }> = {
                      high: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.2)", text: "#ef4444" },
                      medium: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)", text: "#f59e0b" },
                      low: { bg: "rgba(77,238,147,0.1)", border: "rgba(77,238,147,0.15)", text: "#4DEE93" },
                    };
                    const rc = relevanceColors[item.relevance] || relevanceColors.medium;
                    return (
                      <div
                        key={item.id || i}
                        className="trade-pulse-card rounded-2xl overflow-hidden"
                        style={{
                          background: "#0d1a10",
                          borderWidth: "1px 1px 1px 3px",
                          borderStyle: "solid",
                          borderColor: `rgba(255,255,255,0.07) rgba(255,255,255,0.07) rgba(255,255,255,0.07) ${item.tier === 1 ? "#5FFFF3" : "rgba(255,255,255,0.15)"}`,
                          opacity: tradePulseSection.visible ? 1 : 0,
                          animation: tradePulseSection.visible ? `fadeUp 0.5s ease-out ${0.15 + i * 0.08}s both` : "none",
                        }}
                      >
                        <div style={{ padding: "20px 24px 0" }}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-bold" style={{ color: "#5FFFF3" }}>{item.publication}</span>
                            <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                            <span className="rounded-full text-[10px] font-bold uppercase tracking-wider px-2 py-0.5" style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.text }}>
                              {item.relevance}
                            </span>
                            <span className="rounded-full text-[10px] font-semibold px-2 py-0.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                              Tier {item.tier}
                            </span>
                            {item.isFallback && (
                              <span className="rounded-full text-[10px] font-semibold px-2 py-0.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.35)" }}>
                                Curated
                              </span>
                            )}
                            {item.pubDate && (
                              <span className="ml-auto text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                {new Date(item.pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            )}
                          </div>
                          <h3 className="text-white font-bold text-base leading-snug mb-2">
                            {item.link ? (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{item.headline}</a>
                            ) : item.headline}
                          </h3>
                          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{item.summary}</p>
                          {item.topicCluster && (
                            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
                              {item.topicCluster}
                            </span>
                          )}
                        </div>
                        <div style={{ background: "rgba(95,255,243,0.04)", borderTop: "1px solid rgba(95,255,243,0.1)", padding: "14px 24px" }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Target size={13} style={{ color: "#5FFFF3" }} />
                            <span style={{ color: "#5FFFF3", fontSize: 10, textTransform: "uppercase" as const, letterSpacing: "0.1em", fontWeight: 700 }}>So What?</span>
                          </div>
                          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.5 }}>{item.soWhat}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  {tradePulse.generatedAt && (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
                      {tradePulse.feedStatus
                        ? tradePulse.feedStatus
                        : <>RSS scan: {formatGeneratedAt(tradePulse.generatedAt)}{tradePulse.articlesScanned !== undefined && ` · ${tradePulse.articlesScanned} articles matched`}{" · "}Next refresh: {getNextRefreshLabel()}</>
                      }
                    </p>
                  )}
                  <button
                    onClick={runTradePulseAnalysis}
                    disabled={tradePulseLoading}
                    className="inline-flex items-center gap-2 text-xs font-sans font-semibold px-4 py-2 rounded-full transition-all duration-normal"
                    style={{ color: "#5FFFF3", background: "rgba(95,255,243,0.08)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(95,255,243,0.2)" }}
                  >
                    {tradePulseLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                    {tradePulseLoading ? "Scanning feeds..." : "Re-scan feeds"}
                  </button>
                </div>
                {tradePulseError && <p className="text-red-400 text-xs mt-3">{tradePulseError}</p>}
              </>
            ) : tradePulseLoading ? (
              <div style={{ opacity: tradePulseSection.visible ? 1 : 0, animation: tradePulseSection.visible ? "fadeIn 0.4s ease-out both" : "none" }}>
                <div className="space-y-4">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ background: "#0d1a10", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 24px" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="skeleton" style={{ width: 80, height: 14 }} />
                        <div className="skeleton" style={{ width: 50, height: 16, borderRadius: 999 }} />
                      </div>
                      <div className="skeleton" style={{ width: "80%", height: 18, marginBottom: 10 }} />
                      <div className="skeleton" style={{ width: "100%", height: 13, marginBottom: 6 }} />
                      <div className="skeleton" style={{ width: "70%", height: 13, marginBottom: 16 }} />
                      <div style={{ background: "rgba(95,255,243,0.04)", borderTop: "1px solid rgba(95,255,243,0.1)", margin: "0 -24px", padding: "14px 24px" }}>
                        <div className="skeleton" style={{ width: 60, height: 10, marginBottom: 8 }} />
                        <div className="skeleton" style={{ width: "90%", height: 12 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3 mt-8">
                  <div style={{ width: 18, height: 18, borderRadius: "50%", borderWidth: 2, borderStyle: "solid", borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#5FFFF3", animation: "spinGreen 0.8s linear infinite" }} />
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Scanning RSS feeds and analyzing matches...</span>
                </div>
              </div>
            ) : (
              <div className="text-center" style={{ padding: "64px 32px" }}>
                <Radio size={48} className="mx-auto mb-5" style={{ color: "rgba(255,255,255,0.15)" }} />
                <h3 className="text-white mb-2" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: 18, fontWeight: 700 }}>
                  No trade pulse generated yet.
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, marginBottom: 28, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
                  Scan RSS feeds from 6 industry publications, filter by topic relevance, and generate strategic analysis.
                </p>
                {tradePulseError && <p className="text-red-400 text-xs mb-4">{tradePulseError}</p>}
                <button
                  onClick={runTradePulseAnalysis}
                  disabled={tradePulseLoading}
                  className="inline-flex items-center gap-2 font-bold rounded-lg transition-colors"
                  style={{ background: "#5FFFF3", color: "#042914", padding: "10px 24px", fontSize: 14 }}
                >
                  <Radio size={16} /> Scan Trade Publications
                </button>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
