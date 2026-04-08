import { useRef } from "react";
import { Link } from "wouter";
import { Shield, TrendingUp, ArrowRight, Lock, ChevronRight, Target, Zap, BarChart2 } from "lucide-react";

const competitors = [
  { name: "YuLife", desc: "Gamified group life & wellness", color: "#7B2D8B" },
  { name: "Beam Benefits", desc: "Full-stack voluntary benefits carrier", color: "#1A4FBA" },
  { name: "Nayya", desc: "AI-powered benefits decision platform", color: "#1A2E4A" },
  { name: "Selerix", desc: "Enterprise benefits admin", color: "#0A6E4F" },
  { name: "Nava Benefits", desc: "Tech-enabled modern brokerage", color: "#C0392B" },
  { name: "Aetna Wellness", desc: "CVS Health integrated wellness", color: "#7D0E1A" },
];

const stats = [
  { value: "6", label: "Competitors tracked" },
  { value: "7", label: "Dimensions analyzed" },
  { value: "Mar 2025", label: "Last updated" },
  { value: "Internal", label: "Classification" },
];

export function MarketIntelligence() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Hero — parallax-style layered */}
      <div className="relative overflow-hidden bg-green-950 min-h-[400px] flex flex-col justify-end">
        {/* Gradient orbs */}
        <div className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] bg-green-400/12 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-40px] w-[400px] h-[400px] bg-yellow-400/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-green-400/6 rounded-full blur-[80px] pointer-events-none" />

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#19f578 1px, transparent 1px), linear-gradient(90deg, #19f578 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 px-16 pt-16 pb-10">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={12} className="text-green-400/60" />
            <span className="text-green-400/60 text-[10px] font-bold uppercase tracking-[0.2em]">Internal Use Only — Do Not Distribute</span>
          </div>
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <div className="max-w-2xl">
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">Market Intelligence · March 2025</p>
              <h1
                className="text-white text-6xl font-black leading-[1] tracking-tight mb-4"
                style={{ fontFamily: "'Obviously Narrow', sans-serif" }}
              >
                Know your<br />
                <span className="text-green-400">landscape.</span>
              </h1>
              <p className="text-white/50 text-base leading-relaxed max-w-xl">
                Competitive intelligence, campaign analysis, and objection-handling resources for broker and carrier conversations.
              </p>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[120px]" data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <p className="text-green-400 text-2xl font-black mb-0.5">{s.value}</p>
                  <p className="text-white/40 text-xs font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f7f7f5] to-transparent pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="px-16 pt-12 pb-20 max-w-6xl">
        {/* Section nav cards */}
        <div className="grid grid-cols-2 gap-6 mb-16">
          {/* Battle Cards */}
          <Link
            href="/market-intelligence/battle-cards"
            className="group relative overflow-hidden bg-green-950 rounded-3xl p-10 flex flex-col justify-between min-h-[300px] hover:scale-[1.01] transition-transform duration-300"
            data-testid="card-battle-cards"
          >
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-green-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-green-400/18 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#19f578] to-[#e8fb10] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-green-400/15 rounded-2xl flex items-center justify-center border border-green-400/20">
                  <Shield size={24} className="text-green-400" />
                </div>
                <span className="text-green-400/40 text-xs font-bold uppercase tracking-widest">6 Competitors</span>
              </div>
              <h2
                className="text-white text-3xl font-black leading-tight mb-3"
                style={{ fontFamily: "'Obviously Narrow', sans-serif" }}
              >
                Sales Battle Cards
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                Objection-handling scripts, weaknesses, and closing questions for 6 competitors — ready to use in broker conversations.
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-8">
              <div className="flex items-center gap-2 text-green-400 text-sm font-bold group-hover:gap-3 transition-all">
                Open Battle Cards <ArrowRight size={14} />
              </div>
              <div className="flex gap-1.5">
                {competitors.slice(0, 4).map((c) => (
                  <span
                    key={c.name}
                    className="w-7 h-7 rounded-full border-2 border-green-950 flex items-center justify-center text-[9px] font-black text-white"
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  >
                    {c.name.slice(0, 2).toUpperCase()}
                  </span>
                ))}
                <span className="w-7 h-7 rounded-full bg-white/10 border-2 border-green-950 flex items-center justify-center text-[9px] font-bold text-white/60">+2</span>
              </div>
            </div>
          </Link>

          {/* Campaign Analysis */}
          <Link
            href="/market-intelligence/trends"
            className="group relative overflow-hidden bg-white border border-neutral-200 rounded-3xl p-10 flex flex-col justify-between min-h-[300px] hover:shadow-xl hover:border-green-400/30 hover:scale-[1.01] transition-all duration-300"
            data-testid="card-campaign-analysis"
          >
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-green-400/6 rounded-full blur-2xl pointer-events-none group-hover:bg-green-400/12 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#042914] to-[#19f578] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 bg-green-400/12 rounded-2xl flex items-center justify-center border border-green-400/20">
                  <BarChart2 size={24} className="text-green-950" />
                </div>
                <span className="text-green-950/30 text-xs font-bold uppercase tracking-widest">7 Dimensions</span>
              </div>
              <h2
                className="text-green-950 text-3xl font-black leading-tight mb-3"
                style={{ fontFamily: "'Obviously Narrow', sans-serif" }}
              >
                Campaign Analysis
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Creative maturity, messaging strategy, positioning gaps, and whitespace opportunities across the competitive landscape.
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-8">
              <div className="flex items-center gap-2 text-green-950 text-sm font-bold group-hover:gap-3 transition-all">
                Open Analysis <ArrowRight size={14} />
              </div>
              <div className="flex gap-1.5">
                {["High", "Med", "Low"].map((lvl) => (
                  <span key={lvl} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-green-950/60">{lvl}</span>
                ))}
              </div>
            </div>
          </Link>
        </div>

        {/* Betterfly position callout */}
        <div className="bg-yellow-400 rounded-3xl p-10 mb-12 relative overflow-hidden">
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.06]">
            <Zap size={180} />
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <p className="text-green-950/50 text-xs font-bold uppercase tracking-widest mb-3">Our Position</p>
              <h3
                className="text-green-950 text-3xl font-black mb-3 leading-tight"
                style={{ fontFamily: "'Obviously Narrow', sans-serif" }}
              >
                Only guaranteed-issue insurance with ongoing wellness engagement
              </h3>
              <p className="text-green-950/60 text-sm leading-relaxed max-w-xl">
                No competitor combines guaranteed-issue insurance with a daily engagement loop. That structural differentiation cannot be easily replicated.
              </p>
            </div>
            <div className="flex flex-col gap-3 justify-center">
              {[
                { icon: Target, label: "SMB & Startup gap" },
                { icon: Zap, label: "Bilingual by default" },
                { icon: TrendingUp, label: "LATAM → US bridge" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-green-950/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-green-950" />
                  </div>
                  <p className="text-green-950 text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitors covered */}
        <div>
          <p className="text-green-950/40 text-xs font-bold uppercase tracking-widest mb-5">Competitors Covered</p>
          <div className="grid grid-cols-3 gap-4">
            {competitors.map((c, i) => (
              <div
                key={c.name}
                className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:border-neutral-200 transition-all"
                data-testid={`competitor-card-${c.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ backgroundColor: c.color }}
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="text-green-950 font-bold text-sm">{c.name}</p>
                  <p className="text-neutral-400 text-xs leading-snug">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
