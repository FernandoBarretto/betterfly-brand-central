import { Link } from "wouter";
import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronRight, Shield, Activity, Sparkles, Heart, Zap, Users, Home, Brain, User, ShoppingBag, BarChart3, FileText, Headphones, PieChart, Eye, Wrench } from "lucide-react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const goBeyond = [
  { icon: Shield, title: "Protect", desc: "Guaranteed-issue group term life insurance — no medical underwriting, no barriers to enrollment." },
  { icon: Activity, title: "Understand", desc: "68-biomarker health snapshot plus a physician consultation to give every employee clarity about their health." },
  { icon: Sparkles, title: "Engage", desc: "Personalized missions and rewards that drive coverage increases and premium discounts through healthy habits." },
];

const everyoneWins = [
  { title: "Employees", items: ["Insurance they actually use", "Real clarity about their health", "Ongoing guidance", "Healthy habits that stick"] },
  { title: "Employers", items: ["Single cohesive benefit", "Workforce health visibility", "Year-round engagement", "Measurable ROI"] },
  { title: "Brokers", items: ["Higher take-up", "Higher retention", "Faster quoting", "Real-time enrollment visibility"] },
];

const coverageCards = [
  { title: "Group Term Life", desc: "Guaranteed-issue, no medical underwriting", icon: Shield },
  { title: "Critical Illness", desc: "Lump-sum benefit on diagnosis of cancer, heart disease, stroke", icon: Heart },
  { title: "Accident Insurance", desc: "Covers unexpected injury costs — ER visits, treatments, recovery", icon: Zap },
  { title: "Hospital Indemnity", desc: "Daily cash benefit for hospital stays", icon: Activity },
];

const appSections = [
  { icon: Home, title: "Home", items: ["Weekly progress", "Upcoming rewards", "Today's missions", "100+ synced apps and wearables"] },
  { icon: Users, title: "Community", items: ["Circles", "Challenges", "Leaderboards", "Friendly accountability"] },
  { icon: Brain, title: "Buddy AI", items: ["Personalized guidance", "Celebrates wins", "Shares health insights"] },
  { icon: User, title: "You", items: ["Complete coverage visibility", "Care options", "Telehealth & lab tests", "Personalized recommendations"] },
  { icon: ShoppingBag, title: "Marketplace", items: ["Betterflies → discounts", "Wellness products", "Health services", "Additional protection"] },
];

const brokerPortalFeatures = [
  { icon: Eye, title: "Monitor enrollment in real time", desc: "See exactly where your groups stand — from pending to confirmed — in a single dashboard." },
  { icon: BarChart3, title: "Quote multiple products in one place", desc: "Generate quotes across life, accident, critical illness, and hospital indemnity — all from one screen." },
  { icon: Wrench, title: "Broker Resource Toolkit", desc: "Sales collateral, one-pagers, enrollment guides, and co-branded assets ready to download." },
  { icon: Headphones, title: "Zero admin burden", desc: "Seamless experience from quoting to enrollment — no paper, no friction, no manual follow-ups." },
  { icon: PieChart, title: "Full pipeline & commission visibility", desc: "Track your full pipeline with commission visibility at every stage of the relationship." },
  { icon: FileText, title: "Everything you need to grow and protect your book", desc: "The tools, data, and visibility to show up as a true advisor — at every renewal, check-in, and new opportunity." },
];

const credentials = [
  "Launching in Florida Q2 2026",
  "Trusted by 2,000+ companies across Latin America and Europe",
  "No minimum group size",
  "No long-term contracts",
  "Designed for growing companies",
];

const employerItems = [
  "Configure policies and plan options",
  "Manage enrollment in real time",
  "Track adoption and participation rates",
  "View engagement levels and early risk signals",
  "See preventive action correlation with utilization and claims",
  "Bi-lingual (ENG/SPA) onboarding and communications",
];

export function BrokersOverview() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [phoneFloating, setPhoneFloating] = useState(false);

  const heroRef = useInView(0.1);
  const beyondRef = useInView(0.1);
  const beyondGridRef = useInView(0.1);
  const winsRef = useInView(0.1);
  const winsGridRef = useInView(0.1);
  const credRef = useInView(0.2);
  const insuranceRef = useInView(0.1);
  const insuranceGridRef = useInView(0.1);
  const communityRef = useInView(0.15);
  const insightsRef = useInView(0.1);
  const insightsGridRef = useInView(0.1);
  const appRef = useInView(0.1);
  const appGridRef = useInView(0.1);
  const employerRef = useInView(0.1);
  const employerCardRef = useInView(0.15);
  const brokerRef = useInView(0.1);
  const brokerGridRef = useInView(0.1);
  const closingRef = useInView(0.2);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) setScrollProgress((window.scrollY / docH) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setPhoneFloating(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = useCallback((inView: boolean, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  }), []);

  const slideLeft = useCallback((inView: boolean, delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateX(0)" : "translateX(-24px)",
    transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
  }), []);

  return (
    <div className="min-h-screen relative">
      <style>{`
        @keyframes floatPhone { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes fadeUpIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes growLine { from { height: 0; } to { height: 100%; } }
        @keyframes glowPulse1 { 0%,100% { opacity: 0.04; } 50% { opacity: 0.09; } }
        @keyframes glowPulse2 { 0%,100% { opacity: 0.03; } 50% { opacity: 0.07; } }
        @keyframes bfFloat1 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
        @keyframes bfFloat2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(8px) rotate(-2deg); } }
        .phone-float { animation: floatPhone 4s ease-in-out infinite; }
        .hero-fade-1 { opacity: 0; animation: fadeIn 0.5s ease-out 0.1s forwards; }
        .hero-fade-2 { opacity: 0; animation: fadeUpIn 0.7s ease-out 0.3s forwards; }
        .hero-fade-3 { opacity: 0; animation: fadeUpIn 0.6s ease-out 0.6s forwards; }
        .phone-entrance { opacity: 0; animation: fadeUpIn 1s cubic-bezier(0.16,1,0.3,1) 0.4s forwards; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(25,245,120,0.1); }
        .card-hover-subtle { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover-subtle:hover { transform: translateY(-3px); box-shadow: 0 6px 24px rgba(0,0,0,0.08); }
        .animated-underline { position: relative; display: inline; }
        .animated-underline::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: #19F578; transition: width 0.6s ease 0.3s; }
        .animated-underline.in-view::after { width: 100%; }
        .noise-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 9999; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E"); background-repeat: repeat; background-size: 256px; }
        .border-line-grow { position: relative; }
        .border-line-grow::before { content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 0; background: #19F578; border-radius: 2px; transition: height 0.6s ease-out 0.2s; }
        .border-line-grow.in-view::before { height: 100%; }
        @media (prefers-reduced-motion: reduce) {
          .phone-float, .hero-fade-1, .hero-fade-2, .hero-fade-3, .phone-entrance { animation: none !important; opacity: 1 !important; }
          .card-hover:hover, .card-hover-subtle:hover { transform: none; }
          .animated-underline::after { width: 100%; }
        }
      `}</style>

      <div className="noise-overlay" />

      <div
        style={{ position: "fixed", top: 0, left: 0, width: `${scrollProgress}%`, height: "3px", background: "linear-gradient(90deg, #19F578, #E8FB10)", zIndex: 10000, transition: "width 0.08s linear" }}
      />

      <div className="bg-green-950 px-16 pt-8 pb-0 relative overflow-hidden" ref={heroRef.ref}>
        <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, background: "#19f578", filter: "blur(120px)", top: "-10%", right: "10%", animation: "glowPulse1 7s ease-in-out infinite alternate" }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 300, height: 300, background: "#19f578", filter: "blur(100px)", bottom: "5%", left: "5%", animation: "glowPulse2 5s ease-in-out infinite alternate" }} />

        <img
          src="/butterflies.png" alt=""
          className="absolute pointer-events-none"
          style={{ top: -10, right: 30, width: 140, opacity: 0.05, mixBlendMode: "screen", animation: "bfFloat1 8s ease-in-out infinite", transform: `translate(${parallax.x * 0.15}px, ${parallax.y * 0.15}px)` }}
        />
        <img
          src="/butterflies.png" alt=""
          className="absolute pointer-events-none"
          style={{ bottom: 40, left: 20, width: 90, opacity: 0.05, mixBlendMode: "screen", animation: "bfFloat2 10s ease-in-out infinite", transform: `translate(${parallax.x * 0.45}px, ${parallax.y * 0.45}px) scaleX(-1)` }}
        />

        <div className="flex items-center gap-2 text-white/40 text-xs mb-10 relative z-10 hero-fade-1">
          <Link href="/playbooks" className="hover:text-white transition-colors">Playbooks</Link>
          <ChevronRight size={12} />
          <Link href="/playbooks/brokers" className="hover:text-white transition-colors">Brokers</Link>
          <ChevronRight size={12} />
          <span className="text-green-400">Broker Overview</span>
        </div>

        <div className="relative z-10 flex items-end gap-12">
          <div className="max-w-[55%] pb-16">
            <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-4 hero-fade-1" data-testid="text-eyebrow">
              For Brokers · Partner Overview · Confidential · March 2026
            </p>
            <h1 className="font-display text-white text-4xl font-bold leading-[1.1] tracking-tight mb-6 hero-fade-2" data-testid="text-hero-title">
              Better books start with better benefits
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-2xl hero-fade-3">
              Betterfly is an employee benefits platform that transforms voluntary insurance into a year-round engagement engine — combining guaranteed-issue protection, preventive health insights, and measurable participation.
            </p>
          </div>
          <div className="flex-1 flex justify-center items-end self-end">
            <div
              className={`phone-entrance ${phoneFloating ? "phone-float" : ""}`}
              style={{ transform: `translate(${parallax.x * -0.3}px, ${parallax.y * -0.3}px)` }}
            >
              <img src="/phone-mockup.png" alt="Betterfly app" className="h-[340px] w-auto" style={{ mixBlendMode: "screen", display: "block" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-16 py-16 space-y-20 max-w-5xl">

        <section data-testid="section-go-beyond" ref={beyondRef.ref}>
          <h2 className="text-green-950 text-3xl font-bold mb-3" style={slideLeft(beyondRef.inView)}>Go Beyond Standard Coverage</h2>
          <p className="text-neutral-500 text-sm mb-8" style={fadeUp(beyondRef.inView, 150)}>Three pillars that differentiate Betterfly for your clients and their employees.</p>
          <div className="grid grid-cols-3 gap-6" ref={beyondGridRef.ref}>
            {goBeyond.map((item, i) => (
              <div key={item.title} className="bg-green-950 rounded-xl p-8 card-hover" style={fadeUp(beyondGridRef.inView, i * 120)}>
                <item.icon
                  size={24} className="text-green-400 mb-4"
                  style={{
                    opacity: beyondGridRef.inView ? 1 : 0,
                    transform: beyondGridRef.inView ? "scale(1)" : "scale(0.7)",
                    transition: `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 120 + 80}ms, opacity 0.3s ease ${i * 120 + 80}ms`,
                  }}
                />
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="section-everyone-wins" ref={winsRef.ref}>
          <h2 className="text-green-950 text-3xl font-bold mb-6" style={slideLeft(winsRef.inView)}>Everyone Wins</h2>
          <div className="grid grid-cols-3 gap-6" ref={winsGridRef.ref}>
            {everyoneWins.map((col, ci) => (
              <div key={col.title} className="bg-neutral-100 border border-neutral-200 rounded-2xl p-8 card-hover-subtle" style={fadeUp(winsGridRef.inView, ci * 120)}>
                <h3 className="text-green-950 font-bold text-lg mb-5">{col.title}</h3>
                <ul className="space-y-3">
                  {col.items.map((item, ii) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-neutral-600 text-sm leading-snug"
                      style={{
                        opacity: winsGridRef.inView ? 1 : 0,
                        transform: winsGridRef.inView ? "translateY(0)" : "translateY(12px)",
                        transition: `opacity 0.4s ease ${ci * 120 + ii * 80 + 200}ms, transform 0.4s ease ${ci * 120 + ii * 80 + 200}ms`,
                      }}
                    >
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="section-launch-callout" ref={credRef.ref}>
          <div
            className="bg-yellow-400 rounded-2xl px-10 py-6 flex items-center gap-6 flex-wrap"
            style={{
              opacity: credRef.inView ? 1 : 0,
              transform: credRef.inView ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {credentials.map((item, i) => (
              <span
                key={i}
                className="text-green-950 text-sm font-semibold flex items-center gap-3"
                style={{
                  opacity: credRef.inView ? 1 : 0,
                  transition: `opacity 0.4s ease ${200 + i * 120}ms`,
                }}
              >
                {item}
                {i < 4 && (
                  <span
                    className="text-green-950/30"
                    style={{
                      opacity: credRef.inView ? 1 : 0,
                      transition: `opacity 0.3s ease ${200 + i * 120 + 60}ms`,
                    }}
                  >·</span>
                )}
              </span>
            ))}
          </div>
        </section>

        <section data-testid="section-insurance" ref={insuranceRef.ref}>
          <h2 className="text-green-950 text-3xl font-bold mb-3" style={slideLeft(insuranceRef.inView)}>What Teams Get — Insurance</h2>
          <p className="text-neutral-500 text-sm mb-8" style={fadeUp(insuranceRef.inView, 150)}>Four core coverage products, all guaranteed-issue.</p>
          <div className="grid grid-cols-2 gap-6" ref={insuranceGridRef.ref}>
            {coverageCards.map((card, i) => (
              <div key={card.title} className="bg-neutral-100 border border-neutral-200 rounded-2xl p-8 flex items-start gap-5 card-hover-subtle" style={fadeUp(insuranceGridRef.inView, i * 100)}>
                <div className="w-12 h-12 bg-green-400/15 rounded-xl flex items-center justify-center shrink-0">
                  <card.icon size={22} className="text-green-950" />
                </div>
                <div>
                  <h3 className="text-green-950 font-bold text-base mb-1">{card.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="section-community" ref={communityRef.ref}>
          <h2 className="text-green-950 text-3xl font-bold mb-4" style={fadeUp(communityRef.inView)}>A community that makes healthy habits social and sticky</h2>
          <div
            className={`pl-6 space-y-4 border-line-grow ${communityRef.inView ? "in-view" : ""}`}
            style={{ borderLeft: "none" }}
          >
            <p className="text-green-950/80 text-base leading-relaxed" style={fadeUp(communityRef.inView, 150)}>
              Circles, challenges, and leaderboards keep employees connected and accountable. When healthy habits become social, they stick — driving higher engagement and better outcomes for your clients.
            </p>
            <p className="text-green-950/80 text-base leading-relaxed" style={fadeUp(communityRef.inView, 250)}>
              Employees access the Marketplace where earned Betterflies translate into real value — discounts, wellness products, health services, and additional protection. The more they engage, the more their rate increases.
            </p>
          </div>
        </section>

        <section data-testid="section-insights" ref={insightsRef.ref}>
          <h2 className="text-green-950 text-3xl font-bold mb-4" style={slideLeft(insightsRef.inView)}>Personalized insights that get smarter over time</h2>
          <div className="grid grid-cols-2 gap-6" ref={insightsGridRef.ref}>
            {[
              { title: "Contextual Recommendations", desc: "Need-based recommendations powered by activity data, health signals, and engagement patterns. Every employee gets a personalized pathway — not a generic benefits brochure." },
              { title: "Rewards That Matter", desc: "Healthy habits earn Betterflies that convert into real rewards — discounts, gift cards, charitable donations, and upgraded coverage. Engagement isn't theoretical; it's tangible." },
            ].map((card, i) => (
              <div key={card.title} className="bg-neutral-100 border border-neutral-200 rounded-2xl p-8 card-hover-subtle" style={fadeUp(insightsGridRef.inView, i * 120)}>
                <h3 className="text-green-950 font-bold text-base mb-3">{card.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="section-app" ref={appRef.ref}>
          <h2 className="text-green-950 text-3xl font-bold mb-3" style={fadeUp(appRef.inView)}>The Betterfly App</h2>
          <p className="text-neutral-500 text-sm mb-8" style={fadeUp(appRef.inView, 150)}>Five core experiences inside a single employee-facing app.</p>
          <div className="grid grid-cols-5 gap-4" ref={appGridRef.ref}>
            {appSections.map((sec, si) => (
              <div key={sec.title} className="bg-green-950 rounded-xl p-6 min-h-[220px] card-hover" style={fadeUp(appGridRef.inView, si * 80)}>
                <sec.icon size={20} className="text-green-400 mb-3" />
                <h3 className="text-white font-bold text-sm mb-3">{sec.title}</h3>
                <ul className="space-y-2">
                  {sec.items.map((item, ii) => (
                    <li
                      key={item}
                      className="text-white/50 text-xs leading-snug flex items-start gap-1.5"
                      style={{
                        opacity: appGridRef.inView ? 1 : 0,
                        transform: appGridRef.inView ? "translateY(0)" : "translateY(10px)",
                        transition: `opacity 0.3s ease ${si * 80 + ii * 60 + 150}ms, transform 0.3s ease ${si * 80 + ii * 60 + 150}ms`,
                      }}
                    >
                      <span className="w-1 h-1 bg-green-400 rounded-full mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="section-employer-portal" ref={employerRef.ref}>
          <h2 className="text-green-950 text-3xl font-bold mb-3" style={slideLeft(employerRef.inView)}>What Companies Get</h2>
          <p className="text-green-950/60 text-lg font-semibold mb-6" style={fadeUp(employerRef.inView, 150)}>Healthier employees, stronger teams, lower costs</p>
          <div className="bg-neutral-100 border border-neutral-200 rounded-2xl p-8 card-hover-subtle" ref={employerCardRef.ref} style={fadeUp(employerCardRef.inView)}>
            <h3 className="text-green-950 font-bold text-base mb-5">Employer Portal</h3>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3">
              {employerItems.map((item, i) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-neutral-600 text-sm leading-snug"
                  style={{
                    opacity: employerCardRef.inView ? 1 : 0,
                    transform: employerCardRef.inView ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 0.4s ease ${i * 80 + 200}ms, transform 0.4s ease ${i * 80 + 200}ms`,
                  }}
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-testid="section-broker-portal" ref={brokerRef.ref}>
          <h2 className="text-green-950 text-3xl font-bold mb-3" style={slideLeft(brokerRef.inView)}>What Brokers Get</h2>
          <p className="text-green-950/60 text-lg font-semibold mb-6" style={fadeUp(brokerRef.inView, 150)}>Higher take-up. Stronger renewals. Real proof.</p>
          <div className="grid grid-cols-3 gap-5" ref={brokerGridRef.ref}>
            {brokerPortalFeatures.map((feat, i) => {
              const row = Math.floor(i / 3);
              const col = i % 3;
              const delay = row * 150 + col * 100;
              return (
                <div key={feat.title} className="bg-neutral-100 border border-neutral-200 rounded-2xl p-7 card-hover" style={fadeUp(brokerGridRef.inView, delay)}>
                  <div className="w-10 h-10 bg-green-400/15 rounded-xl flex items-center justify-center mb-4">
                    <feat.icon size={18} className="text-green-950" />
                  </div>
                  <h3 className="text-green-950 font-bold text-sm mb-2">{feat.title}</h3>
                  <p className="text-neutral-500 text-xs leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section data-testid="section-closing" className="border-t border-neutral-200 pt-12" ref={closingRef.ref}>
          <div
            className="bg-green-950 rounded-2xl p-10 text-center"
            style={{
              opacity: closingRef.inView ? 1 : 0,
              transform: closingRef.inView ? "scale(1)" : "scale(0.97)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <p className="text-white text-lg font-bold leading-relaxed italic max-w-3xl mx-auto mb-4">
              "The Betterfly Broker Portal gives you the visibility, data, and tools to show up as a <span className={`animated-underline ${closingRef.inView ? "in-view" : ""}`}>true advisor</span> — at every renewal, every check-in, and every new opportunity."
            </p>
            <p
              className="text-white/40 text-sm font-semibold"
              style={{
                opacity: closingRef.inView ? 1 : 0,
                transition: "opacity 0.5s ease 0.6s",
              }}
            >— Betterfly Partner Team</p>
          </div>
        </section>

        <div className="flex gap-3 pt-4">
          <Link
            href="/playbooks/brokers"
            className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-green-950 font-semibold px-5 py-3 rounded-xl text-sm hover:border-green-400 hover:bg-green-400/5 transition-all"
            data-testid="link-back-brokers"
          >
            ← Back to Brokers Playbook
          </Link>
        </div>
      </div>
    </div>
  );
}
