import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronLeft, TrendingUp, AlertTriangle, Zap, Target, RefreshCw } from "lucide-react";

const PASSCODE = "betterfly2025";

interface DataPoint {
  text: string;
  source_name: string;
  source_url: string;
  verified: boolean;
}

interface Analysis {
  label: string;
  text: string;
  source_url?: string;
}

interface MatrixRow {
  primary_model: string;
  core_buyer: string;
  engagement_loop: string;
  gamification: string;
  ai_personalisation: string;
  market_geography: string;
  paid_social_meta: string;
  creative_maturity: string;
}

interface Competitor {
  id: string;
  initials: string;
  name: string;
  tagline: string;
  color: string;
  bg: string;
  founded: string;
  markets: string;
  maturity: string;
  maturityColor: string;
  last_updated: string;
  watch_urls: string[];
  positioning: { text: string; source_name: string; source_url: string };
  key_differentiators: DataPoint[];
  analyses: Analysis[];
  matrix: MatrixRow;
}

interface CompetitorsData {
  competitors: Competitor[];
  last_job_run: string | null;
}

const WHITESPACE_ITEMS = [
  { type: "opp", title: "SMB & Startup Gap", body: "YuLife targets enterprise (500+ employees), Aetna targets large employers (1,000+), Selerix serves complex enterprise, Beam serves 50–1,000. True SMB (10–200 employees) with high-quality voluntary benefits and modern UX is underserved. Betterfly's Florida SMB focus directly targets this gap." },
  { type: "opp", title: "Guaranteed-Issue + Engagement", body: "No competitor combines guaranteed-issue insurance (no medical underwriting) with an ongoing wellness engagement loop. YuLife has the engagement loop but not guaranteed-issue. Betterfly is the only platform with both — a structural differentiation that cannot easily be replicated." },
  { type: "opp", title: "LATAM → US Bridge", body: "Betterfly's 2,000+ company track record across Latin America and Europe is a unique proof point that no US-native competitor can claim. Trusted at scale outside the US, entering the US market — this is a compelling story for risk-averse HR buyers." },
  { type: "opp", title: "Bilingual (ENG/SPA) by Default", body: "No competitor offers bilingual onboarding and communications as a default feature. Florida's SMB market has a significant Spanish-speaking workforce. A bilingual-first platform is not just a feature — it's a market access advantage." },
  { type: "risk", title: "AI Narrative Commoditising", body: "Every platform is now claiming AI. Nayya's moat is narrowing; Selerix's Benefits Genius is a defensive move. The 'AI-powered' claim is losing differentiation value rapidly. Betterfly should frame AI capabilities as table stakes — not the headline — and lead with engagement outcomes instead." },
  { type: "risk", title: "Data Privacy in Wellness", body: "As wellness platforms collect more behavioural data (steps, sleep, nutrition), regulatory scrutiny is increasing. GDPR in Europe and emerging LATAM data protection laws create compliance risk. A privacy-first positioning could differentiate on trust — but requires proactive communication." },
];

const MATRIX_DIMS = [
  { key: "primary_model" as keyof MatrixRow, label: "Primary Model" },
  { key: "core_buyer" as keyof MatrixRow, label: "Core Buyer" },
  { key: "engagement_loop" as keyof MatrixRow, label: "Employee Engagement Loop" },
  { key: "gamification" as keyof MatrixRow, label: "Gamification" },
  { key: "ai_personalisation" as keyof MatrixRow, label: "AI / Personalisation" },
  { key: "market_geography" as keyof MatrixRow, label: "Market Geography" },
  { key: "paid_social_meta" as keyof MatrixRow, label: "Paid Social (Meta)" },
  { key: "creative_maturity" as keyof MatrixRow, label: "Creative Maturity" },
];

const NEGATIVE_VALS = new Set(["None", "Zero active", "None visible", "Sunset May 2025"]);
const POSITIVE_STARTS = ["High", "Core", "Agentic", "Daily", "Active"];

function valCell(val: string) {
  if (NEGATIVE_VALS.has(val)) return "text-red-500 font-semibold";
  if (POSITIVE_STARTS.some(s => val.startsWith(s))) return "text-[#10b981] font-semibold";
  return "text-neutral-600";
}
function valPrefix(val: string): string {
  if (NEGATIVE_VALS.has(val)) return "— ";
  if (POSITIVE_STARTS.some(s => val.startsWith(s))) return "+ ";
  return "";
}

export function CampaignAnalysis() {
  const [selected, setSelected] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const { data: competitorsData, isLoading, isError } = useQuery<CompetitorsData>({
    queryKey: ["/api/competitors"],
    queryFn: () => fetch("/api/competitors", { headers: { "x-passcode": PASSCODE } }).then(r => r.json()),
  });

  const platforms = competitorsData?.competitors || [];
  const p = platforms[selected] || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-400">
          <RefreshCw size={16} className="animate-spin" />
          <span className="text-sm">Loading competitive intelligence...</span>
        </div>
      </div>
    );
  }

  if (isError || !platforms.length) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={24} className="text-orange-400 mx-auto mb-3" />
          <p className="text-green-950 font-bold mb-1">Unable to load competitor data</p>
          <p className="text-neutral-400 text-sm">Check the server connection and try refreshing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Top bar */}
      <div className="bg-green-950 px-8 py-5 flex items-center gap-3 border-b border-white/10">
        <Link href="/market-intelligence" className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors">
          <ChevronLeft size={14} /> Market Intelligence
        </Link>
        <ChevronRight size={12} className="text-white/20" />
        <span className="text-green-400 text-xs font-semibold">Competitive Campaign Analysis</span>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setShowComparison(!showComparison)}
            aria-expanded={showComparison}
            aria-controls="comparison-table"
            className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${showComparison ? "bg-green-400 text-green-950" : "bg-white/10 text-white hover:bg-white/15"}`}
            data-testid="toggle-comparison"
          >
            {showComparison ? "Hide" : "Show"} Comparison Table
          </button>
          <span className="text-white/20 text-xs">7 dimensions · {platforms[0]?.last_updated ? `Updated ${platforms[0].last_updated}` : "Live data"}</span>
        </div>
      </div>

      {/* Comparison table */}
      {showComparison && (
        <div id="comparison-table" className="bg-white border-b border-neutral-200 overflow-x-auto">
          <div className="px-8 pt-5 pb-2">
            <p className="text-green-950/40 text-xs font-bold uppercase tracking-widest mb-4">Competitive Matrix</p>
          </div>
          <table className="w-full text-xs min-w-[900px]">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-6 py-3 text-left text-green-950/40 font-bold uppercase tracking-widest text-[10px] w-44">Dimension</th>
                {platforms.map(pl => (
                  <th key={pl.id} className="px-4 py-3 text-center">
                    <span className="flex flex-col items-center gap-1">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: pl.color }}>
                        {pl.initials}
                      </span>
                      <span className="text-green-950 font-bold text-[10px]">{pl.name.split(" ")[0]}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_DIMS.map((dim, i) => (
                <tr key={dim.key} className={i % 2 === 0 ? "bg-neutral-100/60" : "bg-white"}>
                  <td className="px-6 py-3 text-green-950 font-semibold text-[11px]">{dim.label}</td>
                  {platforms.map((pl, vi) => {
                    const val = pl.matrix?.[dim.key] || "—";
                    return (
                      <td key={vi} className={`px-4 py-3 text-center text-[11px] ${valCell(val)}`} data-testid={`matrix-cell-${i}-${vi}`}>
                        <span>{valPrefix(val)}{val}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="h-4" />
        </div>
      )}

      {/* Competitor selector tabs */}
      <div role="tablist" aria-label="Competitors" className="bg-white border-b border-neutral-200 px-8 flex gap-1 overflow-x-auto shadow-sm">
        {platforms.map((pl, i) => (
          <button
            key={pl.id}
            role="tab"
            aria-selected={selected === i}
            aria-controls={`platform-panel-${pl.id}`}
            id={`platform-tab-${pl.id}`}
            onClick={() => setSelected(i)}
            className={`flex items-center gap-2.5 py-4 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap shrink-0 ${
              selected === i ? "border-green-400 text-green-950" : "border-transparent text-neutral-400 hover:text-green-950/80 hover:border-neutral-200"
            }`}
            data-testid={`tab-${pl.id}`}
          >
            <span className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black text-white shrink-0" style={{ backgroundColor: pl.color }}>
              {pl.initials}
            </span>
            {pl.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {p && (
        <div id={`platform-panel-${p.id}`} role="tabpanel" aria-labelledby={`platform-tab-${p.id}`}>
          {/* Competitor header */}
          <div className="px-8 py-7 border-b border-neutral-200" style={{ backgroundColor: p.bg }}>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0" style={{ backgroundColor: p.color }}>
                {p.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2 className="font-black text-green-950 text-xl">{p.name}</h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: p.maturityColor + "22", color: p.maturityColor }}>
                    {p.maturity} creative maturity
                  </span>
                  {p.last_updated && (
                    <span className="text-[10px] text-neutral-400 font-medium">Updated {p.last_updated}</span>
                  )}
                </div>
                <p className="text-green-950/60 text-sm mb-2">{p.tagline}</p>
                <div className="flex gap-4 text-[11px] text-green-950/50">
                  <span>{p.founded}</span>
                  <span>·</span>
                  <span>{p.markets}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis sections */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 gap-4">
              {(p.analyses || []).map((analysis, i) => (
                <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-5">
                  <h3 className="text-green-950 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                    {i === 0 && <Target size={12} />}
                    {i === 1 && <Zap size={12} />}
                    {i >= 2 && <TrendingUp size={12} />}
                    {analysis.label}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{analysis.text}</p>
                </div>
              ))}
            </div>

            {/* Key differentiators */}
            {p.key_differentiators?.length > 0 && (
              <div className="mt-5 bg-green-950 rounded-2xl p-5">
                <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-3">Key Differentiators</p>
                <ul className="space-y-2">
                  {p.key_differentiators.map((kd, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400 text-xs mt-0.5 shrink-0">→</span>
                      <span className="text-white text-xs leading-relaxed">
                        {kd.text}
                        {kd.source_url && (
                          <a href={kd.source_url} target="_blank" rel="noreferrer" className="ml-2 text-green-400/50 hover:text-green-400 text-[10px] transition-colors">[source]</a>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Whitespace Analysis */}
      <div className="px-8 py-8 border-t border-neutral-200 bg-white">
        <p className="text-green-950/40 text-xs font-bold uppercase tracking-widest mb-5">Betterfly Whitespace & Risk Analysis</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WHITESPACE_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 border ${
                item.type === "opp"
                  ? "bg-green-400/5 border-green-400/20"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.type === "opp" ? "bg-green-400/15 text-green-950" : "bg-orange-100 text-orange-700"}`}>
                  {item.type === "opp" ? "Opportunity" : "Risk"}
                </span>
                <h4 className="font-bold text-green-950 text-xs">{item.title}</h4>
              </div>
              <p className="text-neutral-600 text-xs leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
