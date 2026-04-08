import { PageHeader } from "@/components/PageHeader";

const colors = [
  { name: "Betterfly Green", hex: "#19F578", rgb: "25, 245, 120", cmyk: "90, 0, 51, 4", bg: "bg-green-400", text: "text-green-950", role: "Primary Accent" },
  { name: "Betterfly Yellow", hex: "#E8FB10", rgb: "232, 251, 16", cmyk: "8, 0, 94, 2", bg: "bg-yellow-400", text: "text-green-950", role: "Secondary Accent" },
  { name: "Forest Green", hex: "#042914", rgb: "4, 41, 20", cmyk: "90, 0, 51, 84", bg: "bg-green-950", text: "text-white", role: "Brand Dark" },
  { name: "Warm Neutral", hex: "#E2E0D9", rgb: "226, 224, 217", cmyk: "0, 1, 4, 11", bg: "bg-neutral-300", text: "text-green-950", role: "Background Neutral" },
  { name: "Off White", hex: "#F7F7F5", rgb: "247, 247, 245", cmyk: "0, 0, 1, 3", bg: "bg-neutral-100", text: "text-green-950", role: "Surface" },
  { name: "Pure Black", hex: "#000000", rgb: "0, 0, 0", cmyk: "0, 0, 0, 100", bg: "bg-black", text: "text-white", role: "Type Black" },
];

const DISPLAY = "'Obviously Narrow', sans-serif";
const ROBOTO = '"Roboto", Helvetica, sans-serif';

const typeScale = [
  { name: "Headline 1", font: "Obviously Narrow Bold", weight: "900 Black", size: "72px / 100% lh", sample: "Waves of positive change", style: { fontFamily: DISPLAY, fontSize: "52px", fontWeight: 900, lineHeight: "100%", letterSpacing: "-0.5px" } },
  { name: "Headline 2", font: "Obviously Narrow Bold", weight: "900 Black", size: "48px / 52pt lh", sample: "Personalized group protection platform", style: { fontFamily: DISPLAY, fontSize: "36px", fontWeight: 900, lineHeight: "108%", letterSpacing: "-0.3px" } },
  { name: "Headline 3", font: "Obviously Narrow Bold", weight: "900 Black", size: "32px / 36pt lh", sample: "Giving back that actually moves your business forward", style: { fontFamily: DISPLAY, fontSize: "26px", fontWeight: 900, lineHeight: "112%", letterSpacing: "-0.2px" } },
  { name: "Subhead 1", font: "Roboto Bold", weight: "700 Bold", size: "21px / 21pt lh", sample: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.", style: { fontFamily: ROBOTO, fontSize: "18px", fontWeight: 700, lineHeight: "100%" } },
  { name: "Body", font: "Roboto Regular", weight: "400 Regular", size: "18px / 24pt lh", sample: "We build health engagement tools that drive real utilization across every SMB team.", style: { fontFamily: ROBOTO, fontSize: "16px", fontWeight: 400, lineHeight: "140%" } },
  { name: "Caption", font: "Roboto Regular", weight: "400 Regular", size: "14px / 18pt lh", sample: "Filter by audience or content type to find exactly what you need.", style: { fontFamily: ROBOTO, fontSize: "13px", fontWeight: 400, lineHeight: "138%" } },
];

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

const tokens = [
  { token: "--font-display", value: "Obviously Narrow Bold", use: "All headlines H1–H3" },
  { token: "--font-body", value: "Roboto Regular / Bold", use: "Subheads, body, captions" },
  { token: "--primary-green", value: "#19F578", use: "Interactive elements, CTAs, active states" },
  { token: "--secondary-yellow", value: "#E8FB10", use: "Badges, highlights, callouts" },
  { token: "--brand-dark", value: "#042914", use: "Dark backgrounds, primary text on light" },
  { token: "--neutral-bg", value: "#E2E0D9", use: "Inactive states, subtle backgrounds" },
  { token: "--surface", value: "#F7F7F5", use: "Card backgrounds, section fills" },
  { token: "--radius-sm", value: "8px", use: "Chips, tags, small elements" },
  { token: "--radius-md", value: "12px", use: "Inputs, small cards" },
  { token: "--radius-lg", value: "16px", use: "Cards, modals, panels" },
  { token: "--radius-xl", value: "20px", use: "Feature cards, hero sections" },
];

export function VisualIdentity() {
  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="🎨 Visual Identity"
        title="The Betterfly look"
        subtitle="Colors, typography, and design tokens that define how Betterfly shows up in the world. Use them consistently."
      />

      <div className="px-16 py-16 space-y-20 max-w-5xl">
        {/* Logo */}
        <section id="logo">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Logo Suite</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-950 border border-neutral-200 rounded-2xl p-10 flex flex-col items-center gap-4">
              <img src="/betterfly-icon.png" alt="Betterfly icon mark" className="w-20 h-20 rounded-full object-cover" />
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">Icon Mark</p>
            </div>
            <div className="bg-green-950 rounded-2xl p-10 flex flex-col items-center justify-center gap-4">
              <img src="/betterfly-wordmark.png" alt="Betterfly wordmark" className="h-10 w-auto object-contain" />
              <p className="text-white/30 text-xs font-semibold uppercase tracking-widest">Wordmark (Dark BG)</p>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src="/betterfly-banner.png" alt="Betterfly banner" className="w-full h-full object-cover" style={{ minHeight: "160px" }} />
            </div>
          </div>
          <div className="mt-4 bg-neutral-100 rounded-xl p-5 text-sm text-neutral-600 leading-relaxed">
            <strong className="text-green-950">Logo usage rules:</strong> Always maintain clear space equal to the height of the "B" mark on all sides. Never stretch, rotate, or recolor the logo outside approved palette. The icon mark may be used alone only at sizes above 24px.
          </div>
        </section>

        {/* Colors */}
        <section id="colors">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Color Palette</h2>
          <div className="grid grid-cols-3 gap-4">
            {colors.map(c => (
              <div key={c.hex} className="border border-neutral-200 rounded-2xl overflow-hidden">
                <div className={`${c.bg} h-28 flex items-end px-4 pb-3`}>
                  <span className={`${c.text} text-xs font-bold opacity-60`}>{c.role}</span>
                </div>
                <div className="bg-white p-4">
                  <p className="text-green-950 font-bold text-sm mb-1">{c.name}</p>
                  <div className="space-y-0.5">
                    <p className="text-neutral-400 text-xs font-mono">HEX {c.hex}</p>
                    <p className="text-neutral-400 text-xs font-mono">RGB {c.rgb}</p>
                    <p className="text-neutral-400 text-xs font-mono">CMYK {c.cmyk}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section id="typography">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Typography Scale</h2>
          <div className="space-y-2">
            {typeScale.map(t => (
              <div key={t.name} className="flex items-center gap-6 bg-neutral-100 rounded-xl px-6 py-5 hover:bg-white border border-transparent hover:border-neutral-200 transition-all">
                <div className="w-36 shrink-0">
                  <p className="text-green-950 text-xs font-bold">{t.name}</p>
                  <p className="text-neutral-400 text-xs">{t.font} · {t.weight}</p>
                  <p className="text-neutral-400 text-xs">{t.size}</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p style={t.style} className="text-green-950 truncate">{t.sample}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacing */}
        <section id="spacing">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Spacing & Grid</h2>
          <div className="flex items-end gap-4 flex-wrap bg-neutral-100 rounded-2xl p-8">
            {spacing.map(s => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className="bg-green-400" style={{ width: `${Math.min(s, 64)}px`, height: `${Math.min(s, 64)}px`, borderRadius: "4px" }} />
                <span className="text-neutral-500 text-xs font-mono">{s}px</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-neutral-500 text-sm">Base unit: 4px. All spacing values are multiples of 4. Page gutters: 64px. Column gap: 20px. Max content width: 1200px.</p>
        </section>

        {/* Design Tokens */}
        <section id="tokens">
          <h2 className="text-green-950 text-2xl font-bold mb-6">Design Tokens Reference</h2>
          <div className="border border-neutral-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-green-950 px-6 py-3 text-white/50 text-xs font-semibold uppercase tracking-widest">
              <span>Token</span><span>Value</span><span>Use</span>
            </div>
            {tokens.map((t, i) => (
              <div key={t.token} className={`grid grid-cols-3 px-6 py-4 text-sm gap-4 ${i % 2 === 0 ? "bg-white" : "bg-neutral-100"}`}>
                <code className="text-green-950 font-mono text-xs">{t.token}</code>
                <span className="text-neutral-600 font-medium">{t.value}</span>
                <span className="text-neutral-500">{t.use}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
