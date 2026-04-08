import { useState, useCallback, useEffect, useRef } from "react";
import { Download, Play, X, ExternalLink, ChevronRight } from "lucide-react";

const FONT_DISPLAY = "'Obviously Narrow', sans-serif";
const HUBSPOT_URL = "https://betterfly.com/en/get-in-touch/?utm_campaign=41121845-us-gtm&utm_source=boton-landing&utm_medium=referral&utm_content=lets-talk";

const cards = [
  {
    id: "2pager",
    type: "pdf" as const,
    title: "What is Betterfly",
    desc: "A 2-page overview of how Betterfly works — protection, prevention, and engagement from day one.",
    href: "/files/betterfly-ny-event-2-pager.pdf",
    label: "Download 2-Pager",
    thumbnail: "/files/thumb-2pager.jpg",
  },
  {
    id: "video1",
    type: "video" as const,
    title: "How Betterfly Works",
    desc: "See how employees get protected, get clear on their health, and stay engaged — all in one platform.",
    videoId: "sK94HkbXyyE",
    thumbnail: "https://img.youtube.com/vi/sK94HkbXyyE/maxresdefault.jpg",
  },
  {
    id: "video2",
    type: "video" as const,
    title: "What is Betterfly",
    desc: "The 60-second story: insurance that keeps you healthy and rewards you for it.",
    videoId: "tcVM0Avw9ks",
    thumbnail: "https://img.youtube.com/vi/tcVM0Avw9ks/maxresdefault.jpg",
  },
  {
    id: "6pager",
    type: "pdf" as const,
    title: "Meet Betterfly — For Brokers",
    desc: "The extended broker deck: coverage, engagement, broker portal, and everything your clients need to know.",
    href: "/files/betterfly-ny-event-6-pager.pdf",
    label: "Download 6-Pager",
    thumbnail: "/files/thumb-6pager.jpg",
  },
];

function VideoModal({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Close video"
        >
          <X size={28} />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Betterfly Video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function NYEventLandingPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/ny-event" }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const existing = document.querySelector('script[src*="hsforms"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://js.hsforms.net/forms/embed/v2.js";
      script.charset = "utf-8";
      script.async = true;
      script.onload = () => {
        (window as any).hbspt?.forms?.create({
          portalId: "14487275",
          formId: "29e26fae-0d96-4877-81db-fa749718a858",
          region: "na1",
          target: "#contact-form",
          onFormReady: () => {
            const btn = document.querySelector("#contact-form .hs-button") as HTMLElement;
            if (btn) btn.textContent = "Let's talk";
          },
        });
      };
      document.head.appendChild(script);
    } else {
      (window as any).hbspt?.forms?.create({
        portalId: "14487275",
        formId: "29e26fae-0d96-4877-81db-fa749718a858",
        region: "na1",
        target: "#contact-form",
        onFormReady: () => {
          const btn = document.querySelector("#contact-form .hs-button") as HTMLElement;
          if (btn) btn.textContent = "Let's talk";
        },
      });
    }
  }, []);

  const handleDownload = useCallback((href: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = "";
    a.click();
  }, []);

  return (
    <div className="min-h-screen bg-[#042914] text-white overflow-x-hidden">
      {activeVideo && (
        <VideoModal videoId={activeVideo} onClose={() => setActiveVideo(null)} />
      )}

      <header className="relative overflow-hidden">
        <div
          className="absolute -top-32 -right-24 w-[500px] h-[500px] pointer-events-none rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.25) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-[400px] h-[400px] pointer-events-none rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(0, 199, 177, 0.15) 0%, transparent 70%)" }}
        />
        <img
          src="/butterfly-angled.png"
          alt=""
          className="absolute top-6 right-8 w-16 opacity-20 pointer-events-none md:w-24"
          style={{ transform: "rotate(15deg)" }}
        />
        <img
          src="/butterfly-angled.png"
          alt=""
          className="absolute bottom-4 left-12 w-12 opacity-10 pointer-events-none md:w-16"
          style={{ transform: "rotate(-20deg)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-12 md:pt-16 md:pb-20">
          <a href="https://betterfly.com/en/" target="_blank" rel="noopener noreferrer">
            <img
              src="/betterfly-wordmark.png"
              alt="Betterfly"
              className="h-6 md:h-8 mb-8"
            />
          </a>
          <div className="inline-block bg-[#19F578] rounded-full px-4 py-1.5 mb-6">
            <span className="text-[#042914] text-xs font-bold uppercase tracking-widest">
              New York · March 30–31, 2026
            </span>
          </div>
          <h1
            className="text-white uppercase leading-[0.95] mb-4"
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(40px, 8vw, 72px)" }}
          >
            Hi. We're<br />Betterfly.
          </h1>
          <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-lg">
            Insurance that keeps you healthy — and rewards you for it. Everything you need to know, right here.
          </p>
          <a
            href={HUBSPOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#19F578] text-[#042914] font-bold text-sm uppercase tracking-wider rounded-full px-8 py-4 hover:bg-[#19F578]/90 transition-colors active:scale-[0.98] shadow-lg shadow-[#19F578]/20 mt-8 w-full sm:w-auto justify-center"
          >
            Let's Chat
            <ChevronRight size={16} />
          </a>
        </div>
      </header>

      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:bg-white/[0.1] transition-colors group"
            >
              {card.type === "video" && (
                <button
                  onClick={() => setActiveVideo(card.videoId!)}
                  className="relative w-full aspect-video overflow-hidden cursor-pointer"
                >
                  <img
                    src={card.thumbnail}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-[#19F578] flex items-center justify-center shadow-lg shadow-[#19F578]/30">
                      <Play size={22} className="text-[#042914] ml-1" fill="#042914" />
                    </div>
                  </div>
                </button>
              )}

              {card.type === "pdf" && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <img
                    src={card.thumbnail}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 bg-[#19F578] rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-lg">
                    <Download size={12} className="text-[#042914]" />
                    <span className="text-[#042914] text-[10px] font-bold uppercase tracking-wider">PDF</span>
                  </div>
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="text-white uppercase text-sm mb-2"
                  style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: "0.02em" }}
                >
                  {card.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed mb-4 flex-1">{card.desc}</p>

                {card.type === "pdf" && (
                  <button
                    onClick={() => handleDownload(card.href!)}
                    className="flex items-center gap-2 bg-[#19F578] text-[#042914] text-xs font-bold uppercase tracking-wider rounded-xl px-4 py-3 hover:bg-[#19F578]/90 transition-colors w-full justify-center active:scale-[0.98]"
                  >
                    <Download size={14} />
                    {card.label}
                  </button>
                )}

                {card.type === "video" && (
                  <button
                    onClick={() => setActiveVideo(card.videoId!)}
                    className="flex items-center gap-2 bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl px-4 py-3 hover:bg-white/20 transition-colors w-full justify-center active:scale-[0.98]"
                  >
                    <Play size={14} />
                    Watch Video
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative border-t border-white/10">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.12) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
          <h2
            className="text-white uppercase mb-4"
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 5vw, 48px)" }}
          >
            Ready to learn more?
          </h2>
          <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
            Talk to our team about bringing Betterfly to your clients. No pressure, no pitch deck — just a conversation.
          </p>
          <div id="contact-form" className="max-w-md mx-auto text-left [&_input]:!rounded-xl [&_input]:!border-white/20 [&_input]:!bg-white/10 [&_input]:!text-white [&_input]:!placeholder-white/40 [&_textarea]:!rounded-xl [&_textarea]:!border-white/20 [&_textarea]:!bg-white/10 [&_textarea]:!text-white [&_textarea]:!placeholder-white/40 [&_select]:!rounded-xl [&_select]:!border-white/20 [&_select]:!bg-white/10 [&_select]:!text-white [&_label]:!text-white/70 [&_label]:!text-sm [&_.hs-button]:!bg-[#19F578] [&_.hs-button]:!text-[#042914] [&_.hs-button]:!font-bold [&_.hs-button]:!rounded-xl [&_.hs-button]:!border-0 [&_.hs-button]:!px-8 [&_.hs-button]:!py-3 [&_.hs-button]:!uppercase [&_.hs-button]:!tracking-wider [&_.hs-button]:!text-sm [&_.hs-button]:!cursor-pointer" />
        </div>
      </section>

      <footer className="border-t border-white/5 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <img
            src="/betterfly-wordmark.png"
            alt="Betterfly"
            className="h-4 opacity-30"
          />
          <p className="text-white/20 text-[10px] tracking-wider">
            Betterfly · New York 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
