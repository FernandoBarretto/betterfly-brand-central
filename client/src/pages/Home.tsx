import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Search, X, Target, Mic2, Palette, FolderOpen, Ruler, Sparkles, ChevronDown, FileText, BarChart2, BookOpen, Layers, Heart, Compass, Briefcase } from "lucide-react";
import { search, groupResults, type SearchResult } from "@/lib/searchIndex";

const BARLOW = "'Obviously Narrow', sans-serif";
const DISPLAY = 'var(--font-display)';

const sections = [
  { icon: Sparkles, title: "Asset Generator", desc: "From brief to brand-approved one-pager, deck, or post in minutes", path: "/asset-generator", highlight: true },
  { icon: Target, title: "Audience Playbooks", desc: "Employer, broker, carrier \u2014 the right message for every audience", path: "/playbooks" },
  { icon: Mic2, title: "Brand Voice", desc: "How we sound, what we say, and the language that makes people repeat us", path: "/brand-guidelines/tone" },
  { icon: Palette, title: "Visual Identity", desc: "Colors, typography, logos \u2014 the visual system behind the Betterfly Way", path: "/brand-guidelines/visual-identity" },
  { icon: FolderOpen, title: "Templates", desc: "Ready-to-use formats for social, events, decks, and outreach", path: "/templates" },
  { icon: Ruler, title: "Brand Guidelines", desc: "The rules that protect consistency as we scale, including social media governance", path: "/brand-guidelines" },
  { icon: Heart, title: "Social Impact", desc: "The Betterfly Effect \u2014 how healthy habits become real-world donations. B-Corp certified.", path: "/social-impact" },
];

const marqueeContent = "PREVENTION-FIRST  \ud83e\udd8b  BUILT ON INSURANCE  \ud83e\udd8b  HEALTHIER WORKPLACES  \ud83e\udd8b  LITTLE STEPS, BIG CHANGES  \ud83e\udd8b  THE RIPPLE EFFECT  \ud83e\udd8b  FOCUS ON THE ROOT  \ud83e\udd8b  ";

const valueChunks = [
  { text: "Betterfly is an employee benefits platform built on insurance \u2014 designed to make it easy for companies to invest in their people and rewarding for people to invest in themselves.", highlights: ["built on insurance"] },
  { text: "By combining insurance, preventive health, and technology, Betterfly turns traditional coverage into something people actually use \u2014 helping organizations create healthier workplaces across Latin America, Europe, and now the United States.", highlights: ["something people actually use", "healthier workplaces"] },
  { text: "From day one, employees receive real protection, personalized health insights, and rewards for healthy habits.", highlights: ["rewards for healthy habits"] },
  { text: "Meanwhile, employers get a simple way to drive engagement, understand workforce health trends, and build stronger, more productive teams.", highlights: ["stronger, more productive teams"] },
];

const butterflyConfigs = [
  { x: "8%", y: "12%", size: "2rem", opacity: 0.1, duration: 10, delay: 0, rotate: -12, img: "angled" },
  { x: "85%", y: "8%", size: "1.6rem", opacity: 0.07, duration: 12, delay: 1, rotate: 15, img: "front" },
  { x: "72%", y: "55%", size: "1.2rem", opacity: 0.05, duration: 9, delay: 2.5, rotate: -8, img: "angled" },
  { x: "15%", y: "70%", size: "1.8rem", opacity: 0.08, duration: 11, delay: 0.8, rotate: 20, img: "front" },
  { x: "92%", y: "40%", size: "0.8rem", opacity: 0.04, duration: 14, delay: 3, rotate: -5, img: "angled" },
  { x: "45%", y: "5%", size: "1rem", opacity: 0.06, duration: 13, delay: 1.5, rotate: 10, img: "front" },
  { x: "55%", y: "80%", size: "1.4rem", opacity: 0.09, duration: 8, delay: 2, rotate: -18, img: "angled" },
  { x: "30%", y: "35%", size: "0.6rem", opacity: 0.04, duration: 12, delay: 4, rotate: 7, img: "front" },
];

const threeDecks = [
  { num: "01", title: "OUR POSITIONING", desc: "Prevention-first. Built on insurance. Designed for people who want to live their best lives \u2014 not just avoid illness.", footer: "This is where we stand. Everything else follows.", cta: "Explore Positioning", path: "/playbooks", gif: "/icon-sphere.gif" },
  { num: "02", title: "OUR NARRATIVE", desc: "From reactive care to proactive health. From safety net to active partner. The story that makes people repeat us.", footer: "Origin. Belief. Tension. Promise.", cta: "Explore Narrative", path: "/brand-guidelines/tone", gif: "/icon-heart.gif" },
  { num: "03", title: "SANDY'S RULES", desc: "Visual rules. Tone rules. Decision filters. The system that keeps every touchpoint consistent as we scale globally.", footer: "This is what protects the brand at scale.", cta: "Explore Standards", path: "/brand-guidelines", gif: "/icon-shield.gif" },
];

const actionTiles = [
  { icon: FileText, label: "Generate a one-pager", desc: "Brief to brand-approved output in minutes \u2014 rooted in the value prop, every time.", path: "/asset-generator" },
  { icon: BarChart2, label: "Pull competitive intel", desc: "See how we compare. Weekly-updated analysis so you never speak in a vacuum.", path: "/market-intelligence/battle-cards" },
  { icon: BookOpen, label: "Find the right voice", desc: "Employer, broker, or end user \u2014 audience-specific tone guides, ready to go.", path: "/playbooks" },
  { icon: Layers, label: "Run a brand check", desc: "Cross-reference any claim against our guidelines. Stay consistent, stay credible.", path: "/brand-guidelines" },
];

function useInView(threshold = 0.15) {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(reducedMotion);
  useEffect(() => {
    if (reducedMotion || inView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, reducedMotion, inView]);
  return { ref, inView, noTransition: reducedMotion };
}

function HighlightedText({ text, highlights, visible }: { text: string; highlights: string[]; visible: boolean }) {
  let parts: { text: string; highlight: boolean }[] = [];
  let remaining = text;
  const sorted = [...highlights].sort((a, b) => text.indexOf(a) - text.indexOf(b));
  for (const phrase of sorted) {
    const idx = remaining.indexOf(phrase);
    if (idx === -1) continue;
    if (idx > 0) parts.push({ text: remaining.slice(0, idx), highlight: false });
    parts.push({ text: phrase, highlight: true });
    remaining = remaining.slice(idx + phrase.length);
  }
  if (remaining) parts.push({ text: remaining, highlight: false });
  if (parts.length === 0) parts = [{ text, highlight: false }];
  return (
    <span>
      {parts.map((p, i) =>
        p.highlight ? (
          <mark key={i} className="relative bg-transparent text-white/90 font-medium" style={{ paddingBottom: "2px" }}>
            {p.text}
            <span className="absolute bottom-0 left-0 h-[2px] bg-green-400" style={{ width: visible ? "100%" : "0%", transition: "width 400ms cubic-bezier(0.16, 1, 0.3, 1) 200ms" }} />
          </mark>
        ) : <span key={i}>{p.text}</span>
      )}
    </span>
  );
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const results = search(query);
  const grouped = groupResults(results.slice(0, 20));
  useEffect(() => {
    function handleClick(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  function go(r: SearchResult) { setQuery(""); setOpen(false); navigate(r.path); }
  return (
    <div ref={ref} className="relative w-full max-w-xl" data-testid="global-search">
      <div className="relative">
        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" aria-hidden="true" />
        <input type="text" placeholder="Search playbooks, templates, guidelines..." value={query}
          aria-label="Search Brand Central"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (query) setOpen(true); }}
          className="w-full pl-12 pr-12 py-4 bg-white/8 border border-white/15 rounded-2xl font-sans text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-green-400/60 transition-all duration-normal"
          data-testid="input-global-search" />
        {query && <button onClick={() => { setQuery(""); setOpen(false); }} aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white" data-testid="button-clear-search"><X size={16} /></button>}
      </div>
      {open && query && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-neutral-200 max-h-[420px] overflow-y-auto z-50" data-testid="search-results-dropdown">
          {results.length === 0 ? (
            <div className="px-5 py-8 text-center text-neutral-400 text-sm">No results found for &ldquo;{query}&rdquo;</div>
          ) : Object.entries(grouped).map(([section, items]) => (
            <div key={section}>
              <div className="px-4 pt-3 pb-1.5 sticky top-0 bg-white/95 backdrop-blur-sm"><p className="text-green-950/40 text-[10px] font-bold uppercase tracking-widest">{section}</p></div>
              {items.map((r, i) => (
                <button key={`${r.path}-${r.title}-${i}`} onClick={() => go(r)} className="w-full text-left px-4 py-3 hover:bg-neutral-100 transition-colors flex items-start gap-3 group" data-testid={`search-result-${section.toLowerCase().replace(/\s+/g, "-")}-${i}`}>
                  <ArrowRight size={12} className="text-green-400 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="min-w-0"><p className="text-green-950 font-sans text-sm font-semibold truncate">{r.title}</p><p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-1">{r.excerpt}</p></div>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const prefersReduced = useRef(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => localStorage.getItem("betterfly-onboarding-dismissed") === "1");

  useEffect(() => { prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);

  const mouseRaf = useRef<number>(0);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReduced.current || "ontouchstart" in window || mouseRaf.current) return;
    mouseRaf.current = requestAnimationFrame(() => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect) {
        setMouseOffset({ x: (e.clientX - rect.left - rect.width / 2) * 0.02, y: (e.clientY - rect.top - rect.height / 2) * 0.02 });
      }
      mouseRaf.current = 0;
    });
  }, []);

  useEffect(() => {
    if (prefersReduced.current) return;
    let ticking = false;
    function onScroll() {
      if (!ticking) { requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false; }); ticking = true; }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const chunk0 = useInView(0.3); const chunk1 = useInView(0.3); const chunk2 = useInView(0.3); const chunk3 = useInView(0.3);
  const chunkRefs = [chunk0, chunk1, chunk2, chunk3];
  const doctrineReveal = useInView(0.3);
  const decksReveal = useInView(0.15);
  const cardsReveal = useInView(0.15);
  const useItReveal = useInView(0.15);
  const tilesReveal = useInView(0.15);
  const closingReveal = useInView(0.2);

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes bf-float-1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
        @keyframes bf-float-2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(12px) rotate(-4deg); } }
        @keyframes bf-float-3 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
        @keyframes gp-1 { 0%,100% { opacity: 0.03; } 50% { opacity: 0.06; } }
        @keyframes gp-2 { 0%,100% { opacity: 0.04; } 50% { opacity: 0.07; } }
        @keyframes gp-3 { 0%,100% { opacity: 0.02; } 50% { opacity: 0.05; } }
        @keyframes mq-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes hero-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-down { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
        .hero-el { opacity: 0; animation: hero-in 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .hero-el { opacity: 1; animation: none; }
          .bf-el { animation: none !important; }
          .glow-el { animation: none !important; }
          .mq-track { animation: none !important; }
          .bounce-el { animation: none !important; }
        }
      `}</style>
      {/* ===== 1. HERO ===== */}
      <section ref={heroRef} onMouseMove={handleMouseMove} className="relative overflow-hidden flex flex-col justify-center items-center text-center bg-green-950" style={{ minHeight: "100vh" }}>
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "256px" }} />
        <div className="glow-el absolute w-[500px] h-[500px] rounded-full bg-green-400 blur-[120px] pointer-events-none" style={{ top: "10%", left: "20%", animation: "gp-1 7s ease-in-out infinite alternate" }} />
        <div className="glow-el absolute w-[400px] h-[400px] rounded-full bg-green-400 blur-[100px] pointer-events-none" style={{ top: "50%", right: "10%", animation: "gp-2 6s ease-in-out infinite alternate" }} />
        <div className="glow-el absolute w-[350px] h-[350px] rounded-full bg-green-400 blur-[140px] pointer-events-none" style={{ bottom: "5%", left: "50%", animation: "gp-3 8s ease-in-out infinite alternate" }} />

        <div className="absolute inset-0 pointer-events-none z-[2]" style={{ transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`, willChange: "transform", transition: "transform 150ms ease-out" }}>
          {butterflyConfigs.map((b, i) => (
            <div key={i} className="absolute" style={{ left: b.x, top: b.y, width: b.size, height: b.size, transform: `rotate(${b.rotate}deg) translateY(${scrollY * -0.3}px)`, willChange: "transform" }}>
              <img src={b.img === "angled" ? "/butterfly-angled.png" : "/butterfly-front.png"} alt="" className="bf-el w-full h-full object-contain" style={{ opacity: b.opacity, animation: `bf-float-${(i % 3) + 1} ${b.duration}s ease-in-out infinite`, animationDelay: `${b.delay}s` }} />
            </div>
          ))}
        </div>

        <div className="relative z-10 px-5 sm:px-8 max-w-4xl">
          <p className="hero-el text-green-400 text-[11px] font-bold tracking-[0.2em] mb-8" style={{ animationDelay: "60ms" }}>THE BETTERFLY WAY &middot; BRAND CENTRAL</p>
          <h1 style={{ fontFamily: BARLOW }}>
            <span className="hero-el block text-white uppercase leading-[0.95]" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 800, animationDelay: "180ms" }}>One mission.</span>
            <span className="hero-el block text-white uppercase leading-[0.95] mt-1" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 800, animationDelay: "300ms" }}>One voice.</span>
          </h1>
          <p className="hero-el text-neutral-600 text-lg mt-6 max-w-xl mx-auto leading-relaxed font-sans" style={{ animationDelay: "450ms" }}>
            Empowering people to live their best lives. This is where our positioning, narrative, and operating standards live &mdash; so every team speaks with the same conviction.
          </p>
          <div className="hero-el mt-8 flex justify-center" style={{ animationDelay: "550ms" }}>
            <Link href="/playbooks" className="inline-flex items-center gap-2 border border-green-400 text-green-400 px-8 py-3.5 rounded-full font-sans font-semibold text-sm hover:bg-green-400 hover:text-green-950 transition-all duration-normal ease-out">
              Explore the Brand <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-green-400">
          <span className="bounce-el block" style={{ animation: "bounce-down 1.8s ease-in-out infinite" }}><ChevronDown size={24} /></span>
        </div>
      </section>
      {/* ===== START HERE ONBOARDING ===== */}
      {!onboardingDismissed && (
        <section className="bg-green-950 px-5 sm:px-8 pt-8">
          <div className="max-w-4xl mx-auto relative rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => { setOnboardingDismissed(true); localStorage.setItem("betterfly-onboarding-dismissed", "1"); }}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors z-10"
              data-testid="dismiss-onboarding"
            >
              <X size={14} />
            </button>
            <div className="px-8 pt-7 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Compass size={14} className="text-green-400" />
                <p className="text-green-400 text-xs font-bold uppercase tracking-widest">Start Here</p>
              </div>
              <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                Brand Central has everything you need to create, check, and ship — all in one place. Here's the lay of the land:
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-8 py-5">
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center shrink-0"><Sparkles size={14} className="text-green-400" /></div>
                <div><p className="text-white text-sm font-semibold mb-0.5">Asset Generator</p><p className="text-white/40 text-xs leading-relaxed">Create brand-approved docs, decks, and posts from a brief</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center shrink-0"><Target size={14} className="text-green-400" /></div>
                <div><p className="text-white text-sm font-semibold mb-0.5">Use Cases & Playbooks</p><p className="text-white/40 text-xs leading-relaxed">Guided workflows for sales prep, campaigns, and competitive review</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center shrink-0"><Ruler size={14} className="text-green-400" /></div>
                <div><p className="text-white text-sm font-semibold mb-0.5">Brand Guidelines</p><p className="text-white/40 text-xs leading-relaxed">Tone of voice, visual identity, colors, and typography rules</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center shrink-0"><BarChart2 size={14} className="text-green-400" /></div>
                <div><p className="text-white text-sm font-semibold mb-0.5">Market Intelligence</p><p className="text-white/40 text-xs leading-relaxed">Intel digest, battle cards, and competitive trends analysis</p></div>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* ===== VALUE PROP (scroll-reveal) ===== */}
      <section className="bg-green-950 py-12 sm:py-20 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">The Value Proposition</p>
          <h2 className="text-white uppercase mb-10" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>This is what we stand for. Everything else stems from here.</h2>
          <div className="space-y-5">
            {valueChunks.map((chunk, i) => (
              <div key={i} ref={chunkRefs[i].ref} style={{ opacity: chunkRefs[i].inView ? 1 : 0, transform: chunkRefs[i].inView ? "translateY(0)" : "translateY(20px)", transition: `opacity 700ms ease ${i * 100}ms, transform 700ms ease ${i * 100}ms` }}>
                <p className="text-white/70 text-lg leading-relaxed">
                  <HighlightedText text={chunk.text} highlights={chunk.highlights} visible={chunkRefs[i].inView} />
                </p>
              </div>
            ))}
          </div>
          <div className="pt-10">
            <div className="flex items-center gap-2 mb-3">
              <Search size={14} className="text-green-400" />
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest">Search Brand Central</p>
            </div>
            <GlobalSearch />
          </div>
        </div>
      </section>
      {/* ===== DOCTRINE STRIP ===== */}
      <section className="bg-forest-900 py-12 sm:py-20 px-5 sm:px-8" ref={doctrineReveal.ref}>
        <div className="max-w-3xl mx-auto text-center" style={{ opacity: doctrineReveal.inView ? 1 : 0, transform: doctrineReveal.inView ? "none" : "translateY(30px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <h2 className="text-white leading-tight" style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            More than moodboards.{"\n"}
            <br />
            This is the{" "}
            <span className="relative inline-block">
              Betterway.
              <span className="absolute bottom-1 left-0 h-[3px] bg-green-400" style={{ width: doctrineReveal.inView ? "100%" : "0%", transition: "width 0.6s ease-out 0.3s" }} />
            </span>
          </h2>
          <p className="text-neutral-600 text-base mt-6 font-sans">We don&rsquo;t just treat symptoms. We don&rsquo;t just cover risk. We help people thrive.</p>
        </div>
      </section>
      {/* ===== 3. THREE DECKS ===== */}
      <section className="bg-green-950 py-16 sm:py-24 px-5 sm:px-8" ref={decksReveal.ref}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-400 text-[13px] font-normal uppercase tracking-[0.2em] mb-4">The Brand Framework</p>
            <h2 className="text-white uppercase" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>Our secret ingredients</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {threeDecks.map((deck, i) => (
              <div key={deck.num} className="relative rounded-2xl p-8 border transition-all duration-300 hover:border-green-400/30 hover:shadow-[0_0_32px_rgba(25,245,120,0.08)] group overflow-hidden" style={{
                background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)",
                opacity: decksReveal.inView ? 1 : 0, transform: decksReveal.inView ? "none" : "translateY(30px)",
                transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms, border-color 0.3s, box-shadow 0.3s`,
              }}>
                <img src={deck.gif} alt="" className="absolute top-4 right-4 w-16 h-16 object-contain pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500" style={{ mixBlendMode: "screen" }} />
                <p className="text-[48px] font-bold leading-none mb-4" style={{ fontFamily: BARLOW, color: "rgba(25,245,120,0.2)" }}>{deck.num}</p>
                <h3 className="text-white text-[22px] font-bold mb-3" style={{ fontFamily: BARLOW }}>{deck.title}</h3>
                <p className="text-neutral-600 text-[15px] leading-relaxed mb-4 font-sans">{deck.desc}</p>
                <p className="text-green-400 text-[13px] italic mb-6">{deck.footer}</p>
                <Link href={deck.path} className="text-green-400 text-sm font-sans font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  {deck.cta} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ===== 4. MARQUEE ===== */}
      <section className="bg-forest-900 overflow-hidden whitespace-nowrap">
        <div className="mq-track flex" style={{ animation: "mq-scroll 40s linear infinite", width: "max-content" }}>
          {[0, 1, 2].map(n => (
            <span key={n} className="text-green-400/60 text-[20px] font-bold tracking-wide uppercase shrink-0" style={{ fontFamily: BARLOW, paddingTop: "16px", paddingBottom: "16px" }}>
              {marqueeContent}
            </span>
          ))}
        </div>
      </section>
      {/* ===== 5. SECTION CARDS ===== */}
      <section className="px-5 sm:px-8 lg:px-16 py-12 sm:py-20 bg-green-950 relative overflow-hidden" ref={cardsReveal.ref}>
        <div className="max-w-5xl mx-auto">
          <div className="relative z-10 mb-12">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Your Brand Toolkit</p>
            <h2 className="text-white text-3xl sm:text-5xl font-black" style={{ fontFamily: BARLOW }}>Build with conviction</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {sections.map(({ icon: SectionIcon, title, desc, path, highlight }, i) => (
              <Link key={path} href={path}
                className={`relative rounded-lg p-6 transition-all duration-normal group flex items-start gap-4 overflow-hidden ${
                  highlight ? "bg-green-400 hover:bg-green-300 border border-transparent" : "border hover:shadow-[0_0_32px_rgba(25,245,120,0.08)]"
                }`}
                style={{
                  background: highlight ? undefined : "rgba(255,255,255,0.04)",
                  borderColor: highlight ? "transparent" : "rgba(255,255,255,0.08)",
                  opacity: cardsReveal.inView ? 1 : 0, transform: cardsReveal.inView ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 500ms ease ${i * 80}ms, transform 500ms ease ${i * 80}ms, background-color 200ms, box-shadow 200ms, border-color 200ms`,
                }}
                data-testid={`section-link-${path.slice(1)}`}>
                <SectionIcon size={120} className={`absolute bottom-[-20px] right-[-20px] pointer-events-none ${highlight ? "text-green-950" : "text-white"}`} style={{ opacity: 0.04 }} />
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${highlight ? "bg-green-950/15" : "bg-green-400/15"}`}>
                  <SectionIcon size={18} className={highlight ? "text-green-950" : "text-green-400"} />
                </div>
                <div className="relative z-10">
                  <h3 className={`font-sans font-semibold text-base mb-1 ${highlight ? "text-green-950" : "text-white"}`}>{title}</h3>
                  <p className={`font-sans text-sm leading-relaxed ${highlight ? "text-green-950/60" : "text-neutral-600"}`}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* ===== USE IT TO ===== */}
      <section className="bg-forest-900 py-16 sm:py-24 px-5 sm:px-8" ref={useItReveal.ref}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center" style={{ opacity: useItReveal.inView ? 1 : 0, transform: useItReveal.inView ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <h2 className="text-white uppercase" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)" }}>From Brief to Brand-Approved.</h2>
            <p className="text-neutral-600 text-[17px] mt-4 max-w-xl mx-auto font-sans">Every tool you need to create, check, and ship &mdash; rooted in the value prop, aligned to the Betterfly Way.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" ref={tilesReveal.ref}>
            {actionTiles.map(({ icon: Icon, label, desc, path }, i) => (
              <Link key={path} href={path}
                className="rounded-lg p-aura-20 border border-white/10 flex items-start gap-4 transition-all duration-normal hover:border-green-400/30 hover:shadow-[0_0_32px_rgba(25,245,120,0.08)] group bg-gradient-to-br from-forest-900 to-forest-950"
                style={{
                  opacity: tilesReveal.inView ? 1 : 0, transform: tilesReveal.inView ? "none" : "translateY(20px)",
                  transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms, border-color 0.3s, box-shadow 0.3s`,
                }}>
                <div className="w-10 h-10 rounded-xl bg-green-400/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-sans font-semibold text-base mb-1">{label}</h3>
                  <p className="text-neutral-600 font-sans text-sm leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* ===== 8. CLOSING CTA ===== */}
      <section ref={closingReveal.ref} className="bg-green-400 py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center" style={{ opacity: closingReveal.inView ? 1 : 0, transform: closingReveal.inView ? "scale(1)" : "scale(0.97)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <img src="/buddy-butterfly.gif" alt="" className="w-20 h-20 mx-auto mb-6 rounded-full object-cover" />
          <h2 className="text-green-950 uppercase leading-[0.95]" style={{ fontFamily: BARLOW, fontWeight: 900, fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
            One Mission.<br />One Voice.<br />Right Here.
          </h2>
          <p className="text-green-950/75 font-sans text-lg mt-5">Not in scattered files. Not in Slack threads. Not improvised. Documented.</p>
          <div className="mt-8">
            <Link href="/playbooks" className="inline-flex items-center gap-2 bg-green-950 text-green-400 px-10 py-4 rounded-full font-sans font-semibold text-sm hover:bg-green-950/90 transition-colors duration-normal ease-out">
              Go Build Something Meaningful <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      {/* ===== FOOTER ===== */}
      <footer className="px-5 sm:px-16 py-8 sm:py-10 bg-forest-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/betterfly-icon.png" alt="Betterfly" className="w-8 h-8 rounded-full object-cover" />
          <div>
            <p className="text-white font-sans font-semibold text-sm">Betterfly Brand Central</p>
            <p className="text-white/30 font-sans text-xs mt-0.5">For internal use only &middot; &copy; 2025 Betterfly</p>
          </div>
        </div>
        <span className="text-green-400 text-xs font-mono">v2.0 &middot; Jan 2026</span>
      </footer>
    </div>
  );
}
