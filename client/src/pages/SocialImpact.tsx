import { useState, useEffect, useRef } from "react";
import { Activity, TrendingUp, Heart, ExternalLink, Plus, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const BARLOW = "'Obviously Narrow', sans-serif";

interface Foundation {
  name: string;
  category: string;
  description: string;
  logo_url: string | null;
  website: string | null;
}

interface ImpactStory {
  category: string;
  title: string;
  body: string;
  attribution: string;
}

const talkingPoints = [
  {
    q: "How do you bring up impact in a pitch without it feeling like a distraction from the core benefits story?",
    a: "Lead with the product. Once they understand how coverage works and grows, introduce the donation mechanic as the \"and then something else happens\" moment. The fact that impact is automatic — no extra cost, no separate program — is the hook. They get benefits AND their employees generate real-world change just by living well.",
  },
  {
    q: "What do employers in the US typically respond to when they hear about the donation component?",
    a: "Most are surprised it exists — brokers like Hylant have specifically said it's \"not something often seen in comparable solutions.\" Frame it as a talent and retention advantage: employees feel like their daily choices have meaning beyond themselves. For companies with ESG or DEI commitments, it's also a reportable benefit.",
  },
  {
    q: "How does B-Corp certification come up in a sales conversation?",
    a: "Bring it up when the buyer mentions sustainability, corporate responsibility, or vendor vetting criteria. B-Corp is the gold standard — it means Betterfly isn't just claiming social values, they're legally accountable to them. For HR buyers at companies with ESG reporting requirements, this is a meaningful differentiator.",
  },
  {
    q: "What's relevant about the US market specifically for this story?",
    a: "The US employee benefits market is increasingly responsive to purpose-driven benefits. Employee Benefits Day (April 2) and the growing focus on holistic wellbeing have opened the door. Additionally, the donation mechanic is genuinely rare — most platforms don't have it at all, let alone built into the core product loop.",
  },
];

const donationSteps = [
  {
    icon: Activity,
    label: "Healthy action",
    description: "Employees engage with their policies, complete health activities, or hit wellness milestones through the Betterfly platform.",
  },
  {
    icon: TrendingUp,
    label: "Benefits expand",
    description: "As engagement increases, they are rewarded and earn value automatically — no paperwork, no re-enrollment.",
  },
  {
    icon: Heart,
    label: "Impact happens",
    description: "Betterfly generates donations to vetted social and environmental foundations on the employee's behalf. Every action creates a ripple.",
  },
];

const loopSteps = [
  "Protection",
  "Improve",
  "Connect",
  "Reward",
  "Impact",
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

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-5 flex items-start gap-3 group">
        <span className="shrink-0 mt-0.5 text-green-400">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
        <span className="text-white font-semibold text-[15px] leading-relaxed group-hover:text-green-400 transition-colors">{q}</span>
      </button>
      {open && (
        <div className="pl-9 pb-5">
          <p className="text-neutral-600 text-[15px] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function SocialImpact() {
  const [foundations, setFoundations] = useState<Foundation[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);

  useEffect(() => {
    fetch("/api/social-impact/foundations", { headers: { "x-passcode": sessionStorage.getItem("betterfly_passcode") || "betterfly2025" } })
      .then(r => r.ok ? r.json() : [])
      .then(setFoundations)
      .catch(() => {});
    fetch("/api/social-impact/stories", { headers: { "x-passcode": sessionStorage.getItem("betterfly_passcode") || "betterfly2025" } })
      .then(r => r.ok ? r.json() : [])
      .then(setStories)
      .catch(() => {});
  }, []);

  const heroReveal = useInView(0.2);
  const stepsReveal = useInView(0.15);
  const bcorpReveal = useInView(0.15);
  const foundationsReveal = useInView(0.15);
  const storiesReveal = useInView(0.15);
  const proofReveal = useInView(0.15);

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes si-float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
        @keyframes si-glow-1 { 0%,100% { opacity: 0.04; } 50% { opacity: 0.08; } }
        @keyframes si-glow-2 { 0%,100% { opacity: 0.03; } 50% { opacity: 0.06; } }
        @keyframes si-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .si-el { opacity: 0; animation: si-in 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .si-el { opacity: 1; animation: none; }
          .si-float-el { animation: none !important; }
        }
      `}</style>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-green-950 py-20 sm:py-28 lg:py-36 px-5 sm:px-8">
        <div className="absolute inset-0 pointer-events-none z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "256px" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-green-400 blur-[140px] pointer-events-none" style={{ top: "10%", left: "15%", animation: "si-glow-1 7s ease-in-out infinite alternate" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-green-400 blur-[120px] pointer-events-none" style={{ bottom: "5%", right: "10%", animation: "si-glow-2 6s ease-in-out infinite alternate" }} />

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="si-el text-green-400 text-[11px] font-bold tracking-[0.2em] mb-6" style={{ animationDelay: "60ms" }}>SOCIAL IMPACT</p>
            <h1 className="si-el uppercase" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 0.95, animationDelay: "180ms" }}>
              <span className="text-white block">The Betterfly</span>
              <span className="text-green-400 block mt-1">Effect.</span>
            </h1>
            <p className="si-el text-[#A8C4B0] text-lg mt-6 max-w-lg leading-relaxed" style={{ animationDelay: "320ms" }}>
              When employees take positive actions, their coverage grows &mdash; and Betterfly generates donations to social and environmental causes on their behalf. No extra cost. No opt-in. Impact happens automatically.
            </p>
            <div className="si-el mt-8 flex flex-wrap gap-3" style={{ animationDelay: "440ms" }}>
              {loopSteps.map((step, i) => (
                <span key={step} className="flex items-center gap-2 text-sm">
                  <span className="text-white/80 font-medium">{step}</span>
                  {i < loopSteps.length - 1 && <ArrowRight size={12} className="text-green-400/50" />}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="si-el si-float-el relative" style={{ animationDelay: "300ms", animation: "si-float 8s ease-in-out infinite" }}>
              <img src="/betterfly-heart.png" alt="The Betterfly Effect" className="w-56 sm:w-72 lg:w-80 h-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS - DONATION STEPS ===== */}
      <section className="bg-forest-900 py-16 sm:py-24 px-5 sm:px-8" ref={stepsReveal.ref}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14" style={{ opacity: stepsReveal.inView ? 1 : 0, transform: stepsReveal.inView ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <p className="text-green-400 text-[13px] font-normal uppercase tracking-[0.2em] mb-4">The Mechanic</p>
            <h2 className="text-white uppercase" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>How the Donation Loop Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {donationSteps.map((step, i) => (
              <div key={step.label} className="relative rounded-2xl p-8 border transition-all duration-300 hover:border-green-400/30 hover:shadow-[0_0_32px_rgba(25,245,120,0.08)] group overflow-hidden" style={{
                background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)",
                opacity: stepsReveal.inView ? 1 : 0, transform: stepsReveal.inView ? "none" : "translateY(30px)",
                transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms, border-color 0.3s, box-shadow 0.3s`,
              }}>
                <p className="absolute top-4 right-5 text-[48px] font-bold leading-none" style={{ fontFamily: BARLOW, color: "rgba(25,245,120,0.15)" }}>{String(i + 1).padStart(2, "0")}</p>
                <div className="w-12 h-12 rounded-xl bg-green-400/15 flex items-center justify-center mb-5">
                  <step.icon size={22} className="text-green-400" />
                </div>
                <h3 className="text-white text-lg font-bold mb-3" style={{ fontFamily: BARLOW }}>{step.label}</h3>
                <p className="text-neutral-600 text-[15px] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 max-w-2xl mx-auto text-center" style={{ opacity: stepsReveal.inView ? 1 : 0, transition: "opacity 0.6s ease 0.5s" }}>
            <p className="text-green-400 text-[15px] italic leading-relaxed">
              &ldquo;The donation component is a thoughtful element and not something often seen
              in comparable solutions.&rdquo;
            </p>
            <p className="text-neutral-600/60 text-sm mt-2">&mdash; Hylant, Benefits Broker</p>
          </div>
        </div>
      </section>

      {/* ===== B-CORP CERTIFICATION ===== */}
      <section className="bg-green-950 py-16 sm:py-24 px-5 sm:px-8" ref={bcorpReveal.ref}>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl p-8 sm:p-12 border" style={{
            background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)",
            opacity: bcorpReveal.inView ? 1 : 0, transform: bcorpReveal.inView ? "none" : "translateY(30px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 items-start">
              <div>
                <p className="text-green-400 text-[13px] font-normal uppercase tracking-[0.2em] mb-4">Independently Verified</p>
                <h2 className="text-white uppercase mb-6" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>Certified B Corporation</h2>
                <div className="space-y-4 text-neutral-600 text-[15px] leading-relaxed">
                  <p>
                    B-Corp certification means Betterfly has been independently verified to meet the
                    highest standards of social and environmental performance, accountability, and
                    transparency. It is not a marketing claim &mdash; it is a legal commitment embedded
                    in how we operate and make decisions.
                  </p>
                  <p>
                    For HR buyers and benefits consultants evaluating vendors on ESG criteria,
                    B-Corp certification is the most credible signal available.
                  </p>
                </div>

                <div className="mt-8 border-l-4 border-green-400 bg-green-400/5 rounded-r-lg p-5">
                  <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-2">Broker talking point</p>
                  <p className="text-white/70 text-[15px] leading-relaxed italic">
                    &ldquo;Unlike most benefits platforms, Betterfly is B-Corp certified &mdash; meaning social
                    impact isn&rsquo;t a feature they added. It&rsquo;s how the company is legally structured
                    to operate.&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="w-32 h-32 rounded-full border-[3px] border-green-400/40 flex items-center justify-center" style={{ background: "rgba(25,245,120,0.06)" }}>
                  <div className="text-center">
                    <p className="text-green-400 text-xs font-bold uppercase tracking-wider">Certified</p>
                    <p className="text-white text-xl font-black" style={{ fontFamily: BARLOW }}>B Corp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOUNDATION PARTNERS ===== */}
      <section className="bg-forest-900 py-16 sm:py-24 px-5 sm:px-8" ref={foundationsReveal.ref}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12" style={{ opacity: foundationsReveal.inView ? 1 : 0, transform: foundationsReveal.inView ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <p className="text-green-400 text-[13px] font-normal uppercase tracking-[0.2em] mb-4">Where Impact Lands</p>
            <h2 className="text-white uppercase" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>Our Foundation Partners</h2>
            <p className="text-neutral-600 text-[15px] leading-relaxed mt-4 max-w-3xl">
              Donations go to verified social and environmental organizations &mdash; chosen for their
              transparency, effectiveness, and alignment with human flourishing.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {foundations.map((f, i) => (
              <div key={f.name} className="rounded-2xl p-6 border transition-all duration-300 hover:border-green-400/30 hover:shadow-[0_0_32px_rgba(25,245,120,0.08)]" style={{
                background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)",
                opacity: foundationsReveal.inView ? 1 : 0, transform: foundationsReveal.inView ? "none" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms, border-color 0.3s, box-shadow 0.3s`,
              }}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">{f.category}</span>
                <h3 className="text-white font-bold text-base mt-4 mb-2">{f.name}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{f.description}</p>
                {f.website && (
                  <a href={f.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-400 text-xs font-medium mt-4 hover:underline">
                    Visit website <ExternalLink size={11} />
                  </a>
                )}
              </div>
            ))}
            <div className="rounded-2xl border-2 border-dashed border-white/10 p-6 flex flex-col items-center justify-center text-center min-h-[160px]">
              <Plus size={24} className="text-white/15 mb-2" />
              <p className="text-white/30 text-sm font-medium">Add Foundation Partner</p>
              <p className="text-white/15 text-xs mt-1">Update server/data/foundations.json</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== IMPACT STORIES ===== */}
      <section className="bg-green-950 py-16 sm:py-24 px-5 sm:px-8" ref={storiesReveal.ref}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12" style={{ opacity: storiesReveal.inView ? 1 : 0, transform: storiesReveal.inView ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <p className="text-green-400 text-[13px] font-normal uppercase tracking-[0.2em] mb-4">Real Stories</p>
            <h2 className="text-white uppercase" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>Impact in Action</h2>
            <p className="text-neutral-600 text-[15px] leading-relaxed mt-4">
              Social impact isn&rsquo;t a stat on a slide. Here&rsquo;s what it looks like in practice.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story, i) => (
              <div key={story.title} className="rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:border-green-400/30 hover:shadow-[0_0_32px_rgba(25,245,120,0.08)] relative overflow-hidden" style={{
                background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)",
                opacity: storiesReveal.inView ? 1 : 0, transform: storiesReveal.inView ? "none" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms, border-color 0.3s, box-shadow 0.3s`,
              }}>
                <Heart size={100} className="absolute bottom-[-15px] right-[-15px] text-white pointer-events-none" style={{ opacity: 0.03 }} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">{story.category}</span>
                <h3 className="text-white font-bold text-lg mt-3 mb-4" style={{ fontFamily: BARLOW }}>{story.title}</h3>
                <p className="text-neutral-600 text-[15px] leading-relaxed italic">&ldquo;{story.body}&rdquo;</p>
                <p className="text-white/30 text-sm mt-4">&mdash; {story.attribution}</p>
              </div>
            ))}
            <div className="rounded-2xl border-2 border-dashed border-white/10 p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
              <Plus size={24} className="text-white/15 mb-2" />
              <p className="text-white/30 text-sm font-medium">Add an Impact Story</p>
              <p className="text-white/15 text-xs mt-1">Stories can be added in server/data/impact-stories.json</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROOF POINTS ===== */}
      <section className="bg-forest-900 py-16 sm:py-24 px-5 sm:px-8" ref={proofReveal.ref}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12" style={{ opacity: proofReveal.inView ? 1 : 0, transform: proofReveal.inView ? "none" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <p className="text-green-400 text-[13px] font-normal uppercase tracking-[0.2em] mb-4">For Brokers &amp; Employers</p>
            <h2 className="text-white uppercase" style={{ fontFamily: BARLOW, fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>Proof Points</h2>
            <p className="text-neutral-600 text-[15px] leading-relaxed mt-4">
              Talking points and responses for common broker and employer conversations.
            </p>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
            <div className="divide-y divide-white/8 px-5 sm:px-8">
              {talkingPoints.map((tp) => (
                <AccordionItem key={tp.q} q={tp.q} a={tp.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="bg-green-950 py-16 sm:py-24 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-white leading-tight" style={{ fontFamily: BARLOW, fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Impact isn&rsquo;t an add-on.{" "}
            <span className="relative inline-block">
              <span className="text-green-400">It&rsquo;s the product.</span>
            </span>
          </h2>
          <p className="text-[#A8C4B0] text-base mt-6 max-w-xl mx-auto">
            Generate a Social Impact One-Pager to share the Betterfly Effect story with your next prospect.
          </p>
          <div className="mt-8">
            <Link href="/asset-generator" className="inline-flex items-center gap-2 border border-green-400 text-green-400 px-8 py-3.5 rounded-full font-medium text-sm hover:bg-green-400 hover:text-green-950 transition-all duration-200">
              Generate Impact Assets <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
