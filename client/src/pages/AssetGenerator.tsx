import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  FileText, Presentation, Linkedin, Zap, Building2, TrendingUp, Users,
  Globe, ChevronRight, ChevronLeft, Sparkles, Download, Copy, Check,
  RefreshCw, AlertTriangle, BookOpen, X, Printer, ShieldAlert, Layers, Heart,
  CheckCircle2, AlertCircle, Clock, Trash2, ClipboardCopy, RotateCcw, ExternalLink,
} from "lucide-react";

type Format = "one-pager" | "two-pager" | "short-deck" | "linkedin-post" | "social-impact-one-pager";
type Audience = "carriers" | "brokers" | "employers" | "employees" | "industry";
type Step = 1 | 2 | 3 | "generating" | "done";

interface DocResult {
  headline: string;
  subheadline: string;
  intro: string;
  pillar?: string | null;
  header_glow?: "green" | "pink" | "cyan";
  sections: { title: string; body: string; icon?: string | null }[];
  proof_points: string[];
  proof_style?: "forest" | "cyan";
  cta: string;
  source_references: string[];
}
interface DeckSlide {
  slide_title: string;
  body: string[];
  presenter_note: string;
  stat_callout?: string | null;
}
interface DeckResult {
  title_slide: { title: string; subtitle: string; presenter_note: string };
  slides: DeckSlide[];
  closing_slide: { headline: string; cta: string };
  source_references: string[];
}
interface LinkedInResult {
  hook: string;
  body: string[];
  proof_point?: string | null;
  cta: string;
  hashtags: string[];
  character_count: number;
  source_references: string[];
}
type GeneratedResult = DocResult | DeckResult | LinkedInResult;

interface SavedAsset {
  id: string;
  format: Format;
  audience: Audience;
  objective: string;
  result: GeneratedResult;
  timestamp: number;
  headline: string;
}

const HISTORY_KEY = "betterfly-asset-history";
const MAX_HISTORY = 10;

function loadHistory(): SavedAsset[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedAsset[];
  } catch {
    return [];
  }
}

function saveToHistory(asset: SavedAsset): SavedAsset[] {
  const existing = loadHistory().filter(a => a.id !== asset.id);
  const updated = [asset, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

function removeFromHistory(id: string): SavedAsset[] {
  const updated = loadHistory().filter(a => a.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}

function getAssetHeadline(result: GeneratedResult, format: Format): string {
  if (format === "linkedin-post") return (result as LinkedInResult).hook?.slice(0, 60) || "LinkedIn Post";
  if (format === "short-deck") return (result as DeckResult).title_slide?.title?.slice(0, 60) || "Deck";
  return (result as DocResult).headline?.slice(0, 60) || "Asset";
}

function resultToPlainText(result: GeneratedResult, format: Format): string {
  if (format === "linkedin-post") {
    const r = result as LinkedInResult;
    return [r.hook, ...r.body, r.proof_point, r.cta, "", r.hashtags?.join(" ")].filter(Boolean).join("\n\n");
  }
  if (format === "short-deck") {
    const r = result as DeckResult;
    const slides = r.slides.map((s, i) => `--- Slide ${i + 1}: ${s.slide_title} ---\n${s.body.map(b => `• ${b}`).join("\n")}${s.stat_callout ? `\n[${s.stat_callout}]` : ""}`);
    return [`${r.title_slide.title}\n${r.title_slide.subtitle}`, ...slides, `---\n${r.closing_slide.headline}\n${r.closing_slide.cta}`].join("\n\n");
  }
  const r = result as DocResult;
  const sections = r.sections.map(s => `${s.title}\n${s.body}`).join("\n\n");
  const proofs = r.proof_points.map(p => `→ ${p}`).join("\n");
  return [`${r.headline}\n${r.subheadline}`, r.intro, sections, `Proof Points:\n${proofs}`, `CTA: ${r.cta}`].join("\n\n");
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const FORMAT_PLACEHOLDERS: Record<Format, string> = {
  "one-pager": "A quick overview of the broker portal for a new SMB broker we're pitching next week",
  "two-pager": "Explain Betterfly's prevention-first model to an HR director at a 200-person company comparing us to traditional benefits",
  "short-deck": "A 5-slide deck for a carrier partnership meeting — covering distribution, enrollment, and co-brand opportunity",
  "linkedin-post": "A founder POV on why prevention-first benefits are the future of SMB retention, tied to the latest industry data we have",
  "social-impact-one-pager": "A leave-behind for a broker meeting explaining how Betterfly's donation mechanic works and why it matters for ESG reporting",
};

const FORMATS = [
  {
    id: "one-pager" as Format,
    label: "One-Pager",
    desc: "1 page · PDF",
    icon: FileText,
    accent: "#19f578",
    gradientFrom: "#e2fcee",
    gradientVia: "#f0fdf6",
    bestFor: "Cold outreach and email intros.",
    body: "One focused message, backed by your strongest proof points. The goal is to open a door — not tell the whole story. Keep it tight.",
    avoid: "Cramming in multiple messages or feature lists.",
  },
  {
    id: "two-pager" as Format,
    label: "Two-Pager",
    desc: "2 pages · PDF",
    icon: Layers,
    accent: "#818cf8",
    gradientFrom: "#eef2ff",
    gradientVia: "#f5f3ff",
    bestFor: "A leave-behind for a specific person or role.",
    body: "More room to tailor the message to what actually matters to your audience. Use the second page to go deeper on the angle most relevant to them.",
    avoid: "Treating it like a brochure — pick one narrative and own it.",
  },
  {
    id: "short-deck" as Format,
    label: "Short Deck",
    desc: "3–8 slides · PPTX",
    icon: Presentation,
    accent: "#fbbf24",
    gradientFrom: "#fffbeb",
    gradientVia: "#fefce8",
    bestFor: "Live meetings and conversations.",
    body: "Built to be walked through, not read solo. It gives you structure to go as deep as the room wants to go.",
    avoid: "Sending it as a standalone email — it needs you in the room to land properly.",
  },
  {
    id: "linkedin-post" as Format,
    label: "LinkedIn Post",
    desc: "Thought leadership copy",
    icon: Linkedin,
    accent: "#38bdf8",
    gradientFrom: "#f0f9ff",
    gradientVia: "#e0f2fe",
    bestFor: "Sharing your POV with the people already paying attention.",
    body: "Give your network a peek into what you're building and why it matters. Your perspective is the asset — make it specific, make it yours.",
    avoid: "Generic brand announcements. The posts that travel are the ones that sound like a real person thought them.",
  },
  {
    id: "social-impact-one-pager" as Format,
    label: "Social Impact One-Pager",
    desc: "1 page · PDF",
    icon: Heart,
    accent: "#f472b6",
    gradientFrom: "#fdf2f8",
    gradientVia: "#fce7f3",
    bestFor: "Broker meetings and employer pitches where you need to explain the donation mechanic quickly.",
    body: "Covers the Betterfly Effect, B-Corp certification, foundation partners, and a proof point — all grounded in verified data, not invented claims.",
    avoid: "When the conversation is purely about benefits features or when the audience hasn't been introduced to the product yet.",
  },
];
const AUDIENCES = [
  { id: "carriers" as Audience, label: "Carriers", icon: Building2 },
  { id: "brokers" as Audience, label: "Brokers", icon: TrendingUp },
  { id: "employers" as Audience, label: "Employers", icon: Zap },
  { id: "employees" as Audience, label: "Employees", icon: Users },
];
const LINKEDIN_AUDIENCES = [...AUDIENCES, { id: "industry" as Audience, label: "Industry / General", icon: Globe }];

function getBaseUrl(): string {
  return window.location.origin;
}

function buildDocHTML(result: DocResult, format: Format): string {
  const base = getBaseUrl();
  const isSocialImpact = format === "social-impact-one-pager";
  const isCyanProof = result.proof_style === "cyan";
  const glowKey = result.header_glow || (isSocialImpact ? "pink" : "green");
  const glowCSS: Record<string, string> = {
    green: "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.35) 0%, transparent 70%)",
    pink: "radial-gradient(ellipse at center, rgba(255, 100, 150, 0.3) 0%, transparent 70%)",
    cyan: "radial-gradient(ellipse at center, rgba(0, 199, 177, 0.35) 0%, transparent 70%)",
  };

  const pillarBadges: Record<string, { bg: string; text: string }> = {
    "The Betterfly Effect": { bg: "#042914", text: "#19F578" },
    "Built Around Your Habits": { bg: "#19F578", text: "#042914" },
    "Protection That Grows With You": { bg: "#F7F7F5", text: "#042914" },
  };

  const matchedPillarKey = result.pillar
    ? Object.keys(pillarBadges).find(k => k.toLowerCase() === result.pillar!.toLowerCase()) || null
    : null;
  const pillarHTML = matchedPillarKey
    ? `<span class="pillar-badge" style="background:${pillarBadges[matchedPillarKey].bg};color:${pillarBadges[matchedPillarKey].text};${pillarBadges[matchedPillarKey].bg === "#F7F7F5" ? "border:1px solid #E2E0D9;" : ""}">${matchedPillarKey}</span>`
    : "";

  const sections = result.sections.map(s => {
    const iconSrc = getIconSrc(s.icon);
    const iconHTML = iconSrc ? `<img class="section-icon" src="${base}${iconSrc}" alt="" />` : "";
    return `<div class="section"><div class="section-inner">${iconHTML}<div><h3 class="section-title">${s.title}</h3><p class="section-body">${s.body}</p></div></div></div>`;
  }).join("");
  const proofPoints = result.proof_points.map(p => `<li>${p}</li>`).join("");

  const proofBg = isCyanProof ? "#00C7B1" : "#042914";
  const proofLabelColor = isCyanProof ? "#042914" : "#19f578";
  const proofTextColor = isCyanProof ? "#042914" : "white";
  const proofArrowColor = isCyanProof ? "#042914" : "#19f578";
  const proofGlowCSS = isCyanProof
    ? "radial-gradient(ellipse at center, rgba(0, 199, 177, 0.4) 0%, transparent 70%)"
    : "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.3) 0%, transparent 70%)";
  const proofButterflies = isCyanProof
    ? `<img class="header-butterfly" style="width:50px;opacity:0.3;top:5px;right:20px;transform:rotate(20deg);" src="${base}/butterfly-angled.png" alt="" /><img class="header-butterfly" style="width:40px;opacity:0.25;bottom:10px;left:20px;transform:rotate(-15deg);" src="${base}/butterfly-angled.png" alt="" />`
    : "";

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>${result.headline}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f7f7f5; }
  .page { width: 8.5in; min-height: 11in; background: white; margin: 0 auto; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .header { background: #042914; padding: 48px 56px 44px; position: relative; overflow: hidden; }
  .header-glow { position: absolute; top: -120px; right: -80px; width: 500px; height: 500px; pointer-events: none; z-index: 0; background: ${glowCSS[glowKey] || glowCSS.green}; border-radius: 50%; }
  .header-butterfly { position: absolute; pointer-events: none; z-index: 0; }
  .bf-1 { width: 80px; opacity: 0.3; top: 10px; right: 40px; transform: rotate(15deg); }
  .bf-2 { width: 60px; opacity: 0.2; bottom: 20px; right: 160px; transform: rotate(-25deg); }
  .bf-3 { width: 50px; opacity: 0.15; bottom: 10px; left: 60%; transform: rotate(40deg); }
  .header-content { position: relative; z-index: 1; }
  .logo { height: 28px; margin-bottom: 24px; }
  .pillar-badge { display: inline-block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; border-radius: 20px; padding: 4px 14px; margin-bottom: 14px; }
  .headline { font-family: 'Obviously Narrow', sans-serif; font-size: 48px; font-weight: 900; color: white; line-height: 1.0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: -0.01em; }
  .subheadline { color: rgba(255,255,255,0.65); font-size: 15px; line-height: 1.5; font-weight: 400; }
  .body-content { padding: 36px 56px; flex: 1; }
  .intro { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 28px; }
  .sections { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .section { background: #f7f7f5; border-radius: 12px; padding: 20px; }
  .section-inner { display: flex; align-items: flex-start; gap: 14px; }
  .section-icon { width: 40px; height: 40px; flex-shrink: 0; margin-top: 2px; }
  .section-title { font-family: 'Obviously Narrow', sans-serif; font-weight: 800; font-size: 15px; color: #042914; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 8px; }
  .section-body { font-size: 13px; line-height: 1.65; color: #444; }
  .proof-box { background: ${proofBg}; border-radius: 12px; padding: 24px 28px; margin-bottom: 20px; position: relative; overflow: hidden; }
  .proof-glow { position: absolute; top: -60px; right: -40px; width: 200px; height: 200px; pointer-events: none; background: ${proofGlowCSS}; border-radius: 50%; }
  .proof-label { color: ${proofLabelColor}; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; position: relative; z-index: 1; }
  .proof-box ul { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; position: relative; z-index: 1; }
  .proof-box li { color: ${proofTextColor}; font-size: 12px; line-height: 1.5; padding-left: 16px; position: relative; }
  .proof-box li::before { content: '→'; color: ${proofArrowColor}; position: absolute; left: 0; font-size: 11px; top: 1px; }
  .cta-box { background: #19f578; border-radius: 12px; padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; }
  .cta-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #042914; margin-bottom: 4px; }
  .cta-text { font-family: 'Obviously Narrow', sans-serif; font-size: 16px; font-weight: 800; color: #042914; }
  .footer { background: #042914; padding: 14px 56px; display: flex; align-items: center; justify-content: space-between; }
  .footer-text { color: rgba(255,255,255,0.25); font-size: 8px; letter-spacing: 0.06em; }
  .footer-logo { height: 16px; opacity: 0.4; }
  @media print { body { background: white; } .page { width: 100%; box-shadow: none; } }
</style></head><body>
<div class="page">
  <div class="header">
    <div class="header-glow"></div>
    <img class="header-butterfly bf-1" src="${base}/butterfly-angled.png" alt="" />
    <img class="header-butterfly bf-2" src="${base}/butterfly-angled.png" alt="" />
    <img class="header-butterfly bf-3" src="${base}/butterflies.png" alt="" />
    <div class="header-content">
      <img class="logo" src="${base}/betterfly-wordmark.png" alt="Betterfly" />
      ${pillarHTML}
      <div class="headline">${result.headline}</div>
      <div class="subheadline">${result.subheadline}</div>
    </div>
  </div>
  <div class="body-content">
    <p class="intro">${result.intro}</p>
    <div class="sections">${sections}</div>
    <div class="proof-box">
      <div class="proof-glow"></div>
      ${proofButterflies}
      <div class="proof-label">Proof Points</div>
      <ul>${proofPoints}</ul>
    </div>
    <div class="cta-box">
      <div>
        <div class="cta-label">Next Step</div>
        <div class="cta-text">${result.cta}</div>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="footer-text">Generated by Betterfly Brand Central · Internal use only</div>
    <img class="footer-logo" src="${base}/betterfly-wordmark.png" alt="Betterfly" />
  </div>
</div>
</body></html>`;
}

async function downloadPPTX(result: DeckResult) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  const GREEN = "19F578"; const DARK = "042914"; const WHITE = "FFFFFF";
  const OFFWHITE = "F7F7F5"; const YELLOW = "E8FB10";
  const FOOTER = "Generated by Betterfly Brand Central · Internal use only";

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: DARK };
  titleSlide.addText("BETTERFLY", { x: 0.6, y: 0.4, w: 9, h: 0.35, fontSize: 11, bold: true, color: GREEN, charSpacing: 5, fontFace: "Inter" });
  titleSlide.addText(result.title_slide.title.toUpperCase(), { x: 0.6, y: 1.2, w: 8.5, h: 2.4, fontSize: 44, bold: true, color: WHITE, fontFace: "Obviously Narrow" });
  if (result.title_slide.subtitle) {
    titleSlide.addText(result.title_slide.subtitle, { x: 0.6, y: 3.8, w: 8, h: 0.7, fontSize: 18, color: GREEN, fontFace: "Inter" });
  }
  titleSlide.addText(FOOTER, { x: 0.5, y: 6.75, w: 9, h: 0.2, fontSize: 7, color: GREEN, align: "center", fontFace: "Inter" });

  result.slides.forEach((slide, idx) => {
    const isDark = idx % 2 !== 0;
    const s = pptx.addSlide();
    s.background = { color: isDark ? DARK : OFFWHITE };

    if (!isDark) {
      s.addShape("rect" as any, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
    }

    const textColor = isDark ? WHITE : DARK;
    const bodyColor = isDark ? "CCCCCC" : "333333";

    s.addText(slide.slide_title.toUpperCase(), {
      x: 0.6, y: 0.35, w: slide.stat_callout ? 6.5 : 8.8, h: 0.7,
      fontSize: 26, bold: true, color: textColor, fontFace: "Obviously Narrow",
    });

    const bullets = slide.body.map(b => ({
      text: b, options: { bullet: { type: "bullet" as const, color: GREEN }, fontSize: 15, color: bodyColor, paraSpaceAfter: 8, fontFace: "Inter" },
    }));
    s.addText(bullets as any, { x: 0.6, y: 1.2, w: slide.stat_callout ? 6.5 : 8.8, h: 4.5, valign: "top" });

    if (slide.stat_callout) {
      s.addShape("roundRect" as any, { x: 7.4, y: 1.4, w: 2.2, h: 2.2, fill: { color: isDark ? GREEN : YELLOW }, rectRadius: 0.12 });
      s.addText(slide.stat_callout, { x: 7.4, y: 1.4, w: 2.2, h: 2.2, fontSize: 13, bold: true, color: DARK, align: "center", valign: "middle", wrap: true, fontFace: "Inter" });
    }

    s.addText(FOOTER, { x: 0.5, y: 6.85, w: 9, h: 0.2, fontSize: 7, color: isDark ? "555555" : "AAAAAA", align: "center", fontFace: "Inter" });
  });

  const closingSlide = pptx.addSlide();
  closingSlide.background = { color: DARK };
  closingSlide.addText(result.closing_slide.headline.toUpperCase(), {
    x: 0.8, y: 1.6, w: 8.4, h: 2, fontSize: 38, bold: true, color: WHITE, align: "center", fontFace: "Obviously Narrow",
  });
  closingSlide.addText(result.closing_slide.cta, {
    x: 1.5, y: 4.0, w: 7, h: 0.7, fontSize: 18, color: GREEN, align: "center", fontFace: "Inter",
  });
  closingSlide.addText(FOOTER, { x: 0.5, y: 6.75, w: 9, h: 0.2, fontSize: 7, color: GREEN, align: "center", fontFace: "Inter" });
  await pptx.writeFile({ fileName: "betterfly-deck.pptx" });
}

function highlightUnverified(text: string, flags: string[]): React.ReactNode {
  if (!flags.length) return text;
  let parts: React.ReactNode[] = [text];
  for (const flag of flags) {
    const next: React.ReactNode[] = [];
    for (const part of parts) {
      if (typeof part !== "string") { next.push(part); continue; }
      const lower = part.toLowerCase();
      const flagLower = flag.toLowerCase();
      let startIdx = 0;
      let idx: number;
      let found = false;
      while ((idx = lower.indexOf(flagLower, startIdx)) !== -1) {
        found = true;
        if (idx > startIdx) next.push(part.slice(startIdx, idx));
        next.push(
          <span key={`uv-${idx}-${flag.slice(0, 8)}`} className="bg-yellow-200/70 border-b-2 border-yellow-400 px-0.5 rounded-sm" title="Unverified — review before sharing">{part.slice(idx, idx + flag.length)}</span>
        );
        startIdx = idx + flag.length;
      }
      if (!found) { next.push(part); } else if (startIdx < part.length) { next.push(part.slice(startIdx)); }
    }
    parts = next;
  }
  return <>{parts}</>;
}

const GLOW_GRADIENTS: Record<string, string> = {
  green: "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.35) 0%, transparent 70%)",
  pink: "radial-gradient(ellipse at center, rgba(255, 100, 150, 0.3) 0%, transparent 70%)",
  cyan: "radial-gradient(ellipse at center, rgba(0, 199, 177, 0.35) 0%, transparent 70%)",
};

const PILLAR_BADGES: Record<string, { bg: string; text: string }> = {
  "The Betterfly Effect": { bg: "#042914", text: "#19F578" },
  "Built Around Your Habits": { bg: "#19F578", text: "#042914" },
  "Protection That Grows With You": { bg: "#F7F7F5", text: "#042914" },
};

const ICON_FILE_MAP: Record<string, string> = {
  metric: "Icon_2.png", emotional_health: "Icon_3.png", restaurant: "Icon_4.png",
  donation: "Icon_5.png", sleep: "Icon_6.png", contract: "Icon_7.png",
  doctor: "Icon_8.png", metabolic: "Icon_9.png", cells: "Icon_10.png",
  water: "Icon_11.png", book: "Icon_12.png", telemedicine: "Icon_13.png",
  globe: "Icon_14.png", lotus: "Icon_15.png", hourglass: "Icon_16.png",
  salad: "Icon_17.png", accident: "Icon_18.png", giftcard: "Icon_19.png",
  reward: "Icon_20.png", vet: "Icon_21.png", sneakers: "Icon_22.png",
};

function getIconSrc(icon: string | null | undefined): string | null {
  if (!icon) return null;
  const file = ICON_FILE_MAP[icon];
  return file ? `/brand-assets/pictograms/${file}` : null;
}

function DocPreview({ result, format, unverifiedFlags = [] }: { result: DocResult; format: Format; unverifiedFlags?: string[] }) {
  const [copied, setCopied] = useState(false);
  const isSocialImpact = format === "social-impact-one-pager";
  const basePath = "";
  const glowStyle = GLOW_GRADIENTS[result.header_glow || (isSocialImpact ? "pink" : "green")];
  const matchedPillar = result.pillar
    ? Object.keys(PILLAR_BADGES).find(k => k.toLowerCase() === result.pillar!.toLowerCase()) || null
    : null;
  const pillarBadge = matchedPillar ? PILLAR_BADGES[matchedPillar] : null;
  const isCyanProof = result.proof_style === "cyan";

  function handlePrint() {
    const html = buildDocHTML(result, format);
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 500);
  }
  function handleCopy() {
    navigator.clipboard.writeText(resultToPlainText(result, format));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200">
        <span className="text-xs font-bold text-green-950/50 uppercase tracking-widest">Preview</span>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-green-950 hover:bg-neutral-100 transition-colors" data-testid="copy-doc">
            {copied ? <><Check size={12} /> Copied!</> : <><ClipboardCopy size={12} /> Copy Text</>}
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-950 text-white hover:bg-green-950/80 transition-colors" data-testid="download-pdf">
            <Printer size={12} /> Save as PDF
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#e8e6e1] p-6">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden max-w-2xl mx-auto text-sm">
          <div className="bg-[#042914] px-10 py-8 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-16 w-[360px] h-[360px] pointer-events-none rounded-full"
              style={{ background: glowStyle }}
            />
            <img
              src="/butterfly-angled.png"
              alt=""
              className="absolute top-2 right-8 w-16 opacity-25 pointer-events-none"
              style={{ transform: "rotate(15deg)" }}
            />
            <img
              src="/butterfly-angled.png"
              alt=""
              className="absolute bottom-4 right-36 w-12 opacity-15 pointer-events-none"
              style={{ transform: "rotate(-20deg)" }}
            />
            <div className="relative z-10">
              <img
                src="/betterfly-wordmark.png"
                alt="Betterfly"
                className="h-5 mb-5"
              />
              {pillarBadge && matchedPillar && (
                <span
                  className="inline-block text-[9px] font-bold uppercase tracking-widest rounded-full px-3 py-1 mb-3"
                  style={{ backgroundColor: pillarBadge.bg, color: pillarBadge.text, border: pillarBadge.bg === "#F7F7F5" ? "1px solid #E2E0D9" : "none" }}
                >
                  {matchedPillar}
                </span>
              )}
              <h1 className="text-white leading-[1.0] mb-2 uppercase" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "32px", fontWeight: 900 }}>
                {result.headline}
              </h1>
              <p className="text-white/55 text-sm leading-relaxed">{result.subheadline}</p>
            </div>
          </div>
          <div className="px-10 py-7">
            <p className="text-[#333] text-[13px] leading-relaxed mb-6">{highlightUnverified(result.intro, unverifiedFlags)}</p>
            <div className={`grid gap-3 mb-5 ${result.sections.length >= 4 ? "grid-cols-2" : "grid-cols-1"}`}>
              {result.sections.map((s, i) => {
                const iconSrc = getIconSrc(s.icon);
                return (
                  <div key={i} className="bg-[#f7f7f5] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      {iconSrc && <img src={iconSrc} alt="" className="w-8 h-8 shrink-0 mt-0.5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                      <div>
                        <h3 className="text-[#042914] text-xs uppercase tracking-wider mb-2" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontWeight: 800 }}>{s.title}</h3>
                        <p className="text-neutral-500 text-xs leading-relaxed">{highlightUnverified(s.body, unverifiedFlags)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`rounded-xl p-5 mb-4 relative overflow-hidden ${isCyanProof ? "bg-[#00C7B1]" : "bg-[#042914]"}`}>
              <div
                className="absolute -top-12 -right-8 w-40 h-40 pointer-events-none rounded-full"
                style={{ background: isCyanProof
                  ? "radial-gradient(ellipse at center, rgba(0, 199, 177, 0.4) 0%, transparent 70%)"
                  : "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.3) 0%, transparent 70%)" }}
              />
              {isCyanProof && (
                <>
                  <img src="/butterfly-angled.png" alt="" className="absolute top-1 right-4 w-10 opacity-30 pointer-events-none" style={{ transform: "rotate(20deg)" }} />
                  <img src="/butterfly-angled.png" alt="" className="absolute bottom-2 left-4 w-8 opacity-25 pointer-events-none" style={{ transform: "rotate(-15deg)" }} />
                </>
              )}
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-3 relative z-10 ${isCyanProof ? "text-[#042914]" : "text-[#19f578]"}`}>Proof Points</p>
              <div className="grid grid-cols-2 gap-2 relative z-10">
                {result.proof_points.map((p, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`text-xs mt-0.5 shrink-0 ${isCyanProof ? "text-[#042914]" : "text-[#19f578]"}`}>→</span>
                    <span className={`text-xs leading-relaxed ${isCyanProof ? "text-[#042914]" : "text-white"}`}>{highlightUnverified(p, unverifiedFlags)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#19f578] rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-[#042914] text-[9px] font-bold uppercase tracking-wider mb-1">Next Step</p>
                <p className="text-[#042914] text-sm" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontWeight: 800 }}>{result.cta}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#042914] px-10 py-3 flex items-center justify-between">
            <p className="text-white/20 text-[7px] tracking-wider">Generated by Betterfly Brand Central · Internal use only</p>
            <img
              src="/betterfly-wordmark.png"
              alt="Betterfly"
              className="h-3 opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DeckPreview({ result, unverifiedFlags = [] }: { result: DeckResult; unverifiedFlags?: string[] }) {
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const allSlides = [
    { type: "title", data: result.title_slide },
    ...result.slides.map((s, i) => ({ type: "content", data: s, idx: i })),
    { type: "closing", data: result.closing_slide },
  ];
  const total = allSlides.length;
  const current = allSlides[slide];
  function handleCopy() {
    navigator.clipboard.writeText(resultToPlainText(result, "short-deck"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200">
        <span className="text-xs font-bold text-green-950/50 uppercase tracking-widest">Slide {slide + 1} of {total}</span>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-green-950 hover:bg-neutral-100 transition-colors" data-testid="copy-deck">
            {copied ? <><Check size={12} /> Copied!</> : <><ClipboardCopy size={12} /> Copy Text</>}
          </button>
          <button onClick={() => downloadPPTX(result)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-950 text-white hover:bg-green-950/80 transition-colors" data-testid="download-pptx">
            <Download size={12} /> Download PPTX
          </button>
        </div>
      </div>
      <div className="flex-1 bg-[#e8e6e1] p-6 flex flex-col items-center justify-center gap-4">
        <div className="w-full max-w-2xl aspect-video shadow-xl rounded-xl overflow-hidden">
          {current.type === "title" && (
            <div className="w-full h-full bg-[#042914] p-10 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -top-16 -right-12 w-72 h-72 pointer-events-none rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.35) 0%, transparent 70%)" }} />
              <img src="/butterfly-angled.png" alt="" className="absolute top-3 right-6 w-14 opacity-20 pointer-events-none" style={{ transform: "rotate(15deg)" }} />
              <img src="/butterfly-angled.png" alt="" className="absolute bottom-6 right-24 w-10 opacity-15 pointer-events-none" style={{ transform: "rotate(-20deg)" }} />
              <div className="relative z-10">
                <img src="/betterfly-wordmark.png" alt="Betterfly" className="h-4 mb-5" />
                <h2 className="text-white leading-tight mb-4 uppercase" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "36px", fontWeight: 900 }}>{(current.data as any).title}</h2>
                <p className="text-[#19f578] text-sm">{(current.data as any).subtitle}</p>
              </div>
            </div>
          )}
          {current.type === "content" && (() => {
            const contentIdx = (current as any).idx || 0;
            const isDark = contentIdx % 2 !== 0;
            return (
              <div className={`w-full h-full ${isDark ? "bg-[#042914]" : "bg-[#f7f7f5]"} p-8 flex flex-col relative overflow-hidden`}>
                {!isDark && <div className="absolute top-0 left-0 right-0 h-1 bg-[#19f578]" />}
                {isDark && <div className="absolute -bottom-16 -right-12 w-48 h-48 pointer-events-none rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(0, 200, 220, 0.25) 0%, transparent 70%)" }} />}
                <div className="flex gap-6 flex-1 relative z-10 mt-1">
                  <div className="flex-1">
                    <h2 className={`mb-4 leading-tight uppercase ${isDark ? "text-white" : "text-[#042914]"}`} style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "24px", fontWeight: 900 }}>
                      {(current.data as DeckSlide).slide_title}
                    </h2>
                    <ul className="space-y-2">
                      {(current.data as DeckSlide).body.map((b, i) => (
                        <li key={i} className={`flex gap-2 text-xs leading-relaxed ${isDark ? "text-white/80" : "text-[#333]"}`}>
                          <span className="text-[#19f578] mt-0.5 shrink-0">•</span><span>{highlightUnverified(b, unverifiedFlags)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {(current.data as DeckSlide).stat_callout && (
                    <div className={`w-24 shrink-0 ${isDark ? "bg-[#19f578]" : "bg-[#E8FB10]"} rounded-xl flex items-center justify-center p-3`}>
                      <p className="text-[#042914] font-bold text-xs text-center leading-snug">{highlightUnverified((current.data as DeckSlide).stat_callout!, unverifiedFlags)}</p>
                    </div>
                  )}
                </div>
                <p className={`text-[8px] text-center mt-auto pt-3 ${isDark ? "text-white/15" : "text-[#aaa]"}`}>Generated by Betterfly Brand Central · Internal use only</p>
              </div>
            );
          })()}
          {current.type === "closing" && (
            <div className="w-full h-full bg-[#042914] flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.3) 0%, transparent 70%)" }} />
              <img src="/brand-assets/buddy/Buddy_Standing.png" alt="" className="absolute bottom-4 right-8 h-28 opacity-40 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-white leading-tight mb-4 uppercase" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontSize: "36px", fontWeight: 900 }}>{(current.data as any).headline}</h2>
                <p className="text-[#19f578] text-sm font-medium">{(current.data as any).cta}</p>
              </div>
              <img src="/betterfly-wordmark.png" alt="Betterfly" className="absolute bottom-4 left-8 h-3 opacity-30" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button disabled={slide === 0} onClick={() => setSlide(s => Math.max(0, s - 1))} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-30 hover:bg-neutral-100 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-1.5">
            {allSlides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === slide ? "bg-[#042914] w-4" : "bg-[#042914]/20"}`} />
            ))}
          </div>
          <button disabled={slide === total - 1} onClick={() => setSlide(s => Math.min(total - 1, s + 1))} className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center disabled:opacity-30 hover:bg-neutral-100 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LinkedInPreview({ result, unverifiedFlags = [] }: { result: LinkedInResult; unverifiedFlags?: string[] }) {
  const [copied, setCopied] = useState(false);
  const fullText = [result.hook, ...result.body, result.proof_point, result.cta].filter(Boolean).join("\n\n") + "\n\n" + result.hashtags.join(" ");
  function handleCopy() { navigator.clipboard.writeText(fullText); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-200">
        <span className="text-xs font-bold text-green-950/50 uppercase tracking-widest">LinkedIn Preview</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-950 text-white hover:bg-green-950/80 transition-colors" data-testid="copy-linkedin">
          {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Post</>}
        </button>
      </div>
      <div className="flex-1 overflow-auto bg-[#e8e6e1] p-6">
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/betterfly-icon.png"
              alt="Betterfly"
              className="w-11 h-11 rounded-full object-contain bg-[#f7f7f5] p-1.5"
            />
            <div>
              <p className="font-bold text-sm text-[#191919]">Betterfly</p>
              <p className="text-xs text-[#666]">Prevention-first benefits platform · Just now</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-bold text-[#191919] text-sm leading-relaxed">{highlightUnverified(result.hook, unverifiedFlags)}</p>
            {result.body.map((p, i) => <p key={i} className="text-[#191919] text-sm leading-relaxed">{highlightUnverified(p, unverifiedFlags)}</p>)}
            {result.proof_point && (
              <div className="bg-[#042914] rounded-xl px-4 py-3 my-4 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-28 h-28 pointer-events-none rounded-full" style={{ background: "radial-gradient(ellipse at center, rgba(25, 245, 120, 0.3) 0%, transparent 70%)" }} />
                <p className="text-[#19f578] font-bold text-sm relative z-10">{highlightUnverified(result.proof_point, unverifiedFlags)}</p>
              </div>
            )}
            <p className="text-[#191919] text-sm leading-relaxed">{result.cta}</p>
            <p className="text-[#0073b1] text-sm font-medium leading-relaxed">{result.hashtags.join(" ")}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-[#666]">
            <span>{result.character_count || fullText.length} characters</span>
            <span className={result.character_count > 2800 ? "text-red-500 font-bold" : "text-green-400 font-bold"}>
              {result.character_count > 2800 ? "Over limit" : "Within limit"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssetGenerator() {
  const [step, setStep] = useState<Step>(1);
  const [format, setFormat] = useState<Format | null>(null);
  const [audience, setAudience] = useState<Audience | null>(null);
  const [objective, setObjective] = useState("");
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [resultFormat, setResultFormat] = useState<Format | null>(null);
  const [ambiguityWarning, setAmbiguityWarning] = useState(false);
  const [hasUnverifiedData, setHasUnverifiedData] = useState(false);
  const [unverifiedFlags, setUnverifiedFlags] = useState<string[]>([]);
  const [trendsDate, setTrendsDate] = useState<string | null>(null);
  const [refineText, setRefineText] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandContextLoaded, setBrandContextLoaded] = useState<boolean | null>(null);
  const [history, setHistory] = useState<SavedAsset[]>(() => loadHistory());

  useEffect(() => {
    fetch("/api/brand-context-status", { headers: { "x-passcode": "betterfly2025" } })
      .then(r => r.json())
      .then(d => setBrandContextLoaded(d.loaded))
      .catch(() => setBrandContextLoaded(false));
  }, []);

  const audienceOptions = format === "linkedin-post" ? LINKEDIN_AUDIENCES : AUDIENCES;
  const canGenerate = format !== null && audience !== null && objective.trim().length > 10;

  const daysSinceUpdate = trendsDate
    ? Math.floor((new Date().getTime() - new Date(trendsDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const trendsOld = daysSinceUpdate !== null && daysSinceUpdate > 14;

  const persistAsset = useCallback((genResult: GeneratedResult, genFormat: Format, genAudience: Audience, genObjective: string) => {
    const saved: SavedAsset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      format: genFormat,
      audience: genAudience,
      objective: genObjective,
      result: genResult,
      timestamp: Date.now(),
      headline: getAssetHeadline(genResult, genFormat),
    };
    setHistory(saveToHistory(saved));
  }, []);

  function loadSavedAsset(saved: SavedAsset) {
    setFormat(saved.format);
    setAudience(saved.audience);
    setObjective(saved.objective);
    setResult(saved.result);
    setResultFormat(saved.format);
    setAmbiguityWarning(false);
    setHasUnverifiedData(false);
    setStep("done");
    setError(null);
    setRefineText("");
  }

  function deleteSavedAsset(id: string) {
    setHistory(removeFromHistory(id));
  }

  async function generate(refineInstruction?: string) {
    setError(null);
    if (refineInstruction) setIsRefining(true);
    else setStep("generating");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-passcode": "betterfly2025" },
        body: JSON.stringify({ format, audience, objective, refineInstruction, previousResult: refineInstruction ? result : undefined }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Generation failed"); }
      const data = await res.json();
      console.log("[Asset Generator] Full result from API:", JSON.stringify(data.result, null, 2));
      setResult(data.result);
      setResultFormat(data.format);
      setAmbiguityWarning(data.ambiguityWarning);
      setHasUnverifiedData(data.hasUnverifiedData || false);
      setUnverifiedFlags(data.unverifiedFlags || []);
      setTrendsDate(data.trendsDate);
      setStep("done");
      setRefineText("");
      if (format && audience) persistAsset(data.result, format, audience, objective);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Try again.");
      if (!refineInstruction) setStep(3);
    } finally {
      setIsRefining(false);
    }
  }

  function reset() {
    setStep(1); setFormat(null); setAudience(null); setObjective(""); setResult(null);
    setError(null); setRefineText(""); setHasUnverifiedData(false); setTrendsDate(null);
  }

  if (step === "generating") {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-950 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Sparkles size={28} className="text-green-400" />
          </div>
          <p className="text-green-950 font-black text-2xl mb-2 uppercase" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontWeight: 900 }}>Claude is writing...</p>
          <p className="text-neutral-400 text-sm leading-relaxed">Injecting brand context, playbook pillars,<br />and proof points. This takes 15–30 seconds.</p>
        </div>
      </div>
    );
  }

  if (step === "done" && result && resultFormat) {
    const sourceRefs = (result as any).source_references || [];
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col">
        <div className="bg-green-950 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-green-400/20 flex items-center justify-center">
              <Sparkles size={14} className="text-green-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Asset Generated</p>
              <p className="text-white/30 text-xs capitalize">{resultFormat.replace("-", " ")} · {audience}</p>
            </div>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors" data-testid="generate-new">
            <X size={12} /> New asset
          </button>
        </div>

        {trendsOld && (
          <div className="bg-orange-50 border-b border-orange-200 px-8 py-2.5 flex items-center gap-2.5 shrink-0" data-testid="staleness-banner">
            <AlertTriangle size={13} className="text-orange-500 shrink-0" />
            <p className="text-orange-700 text-xs font-semibold">
              Industry data is {daysSinceUpdate} days old — last updated {trendsDate}. Consider refreshing trend data before sharing externally.
            </p>
          </div>
        )}

        {ambiguityWarning && (
          <div className="bg-yellow-400 px-8 py-3 flex items-center gap-3 shrink-0">
            <AlertTriangle size={14} className="text-green-950 shrink-0" />
            <p className="text-green-950 text-xs font-semibold">Some sections may need review — the objective was broad. Consider refining with the prompt below.</p>
          </div>
        )}

        {hasUnverifiedData && (
          <div className="bg-orange-100 border-b border-orange-300 px-8 py-2.5 flex items-center gap-2.5 shrink-0" data-testid="unverified-data-warning">
            <ShieldAlert size={13} className="text-orange-600 shrink-0" />
            <p className="text-orange-800 text-xs font-semibold flex-1">
              Some industry data points haven't been source-verified yet. Review highlighted sections before sharing externally.
            </p>
            <Link href="/brand-guidelines/tone" className="flex items-center gap-1 text-orange-700 text-xs font-bold hover:text-orange-900 transition-colors shrink-0 underline underline-offset-2">
              <ExternalLink size={10} /> View Verification Checklist
            </Link>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 shrink-0 bg-white border-r border-neutral-200 flex flex-col overflow-y-auto">
            <div className="p-5 border-b border-neutral-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                <BookOpen size={10} className="inline mr-1" /> Sources Used
              </p>
              <ul className="space-y-1.5">
                {sourceRefs.map((ref: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400 text-xs mt-0.5 shrink-0">•</span>
                    <span className="text-xs text-neutral-600 leading-relaxed">{ref}</span>
                  </li>
                ))}
              </ul>
            </div>

            {trendsDate && (
              <div className={`px-5 py-3 border-b border-neutral-200 ${trendsOld ? "bg-orange-50" : ""}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 mb-1">Industry Data</p>
                <p className="text-xs text-neutral-500">Last updated: {trendsDate}</p>
                {trendsOld && (
                  <p className="text-[10px] text-orange-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertTriangle size={9} /> {daysSinceUpdate} days old
                  </p>
                )}
              </div>
            )}

            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Refine this asset</p>
              <textarea
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                placeholder="Refine this asset (e.g., Make the tone more formal)"
                className="w-full text-xs resize-none border border-neutral-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-neutral-100 text-green-950 placeholder:text-neutral-400 leading-relaxed mb-3"
                rows={4}
                data-testid="refine-input"
              />
              <button
                disabled={!refineText.trim() || isRefining}
                onClick={() => generate(refineText)}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-green-950 text-white disabled:opacity-40 hover:bg-green-950/80 transition-colors"
                data-testid="regenerate-button"
              >
                {isRefining ? <><RefreshCw size={11} className="animate-spin" /> Applying...</> : <><RefreshCw size={11} /> Apply Refinement</>}
              </button>
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 mt-2 rounded-xl border border-neutral-200 text-neutral-500 hover:text-green-950 hover:border-neutral-300 transition-colors"
                data-testid="start-over-button"
              >
                <RotateCcw size={11} /> Start Over
              </button>
            </div>

            {history.length > 0 && (
              <div className="p-5 border-t border-neutral-200 flex-1 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
                  <Clock size={10} className="inline mr-1" /> Saved Assets
                </p>
                <ul className="space-y-2" data-testid="saved-assets-list">
                  {history.map((saved) => {
                    const formatIcon = saved.format === "linkedin-post" ? Linkedin
                      : saved.format === "short-deck" ? Presentation
                      : saved.format === "social-impact-one-pager" ? Heart
                      : saved.format === "two-pager" ? Layers
                      : FileText;
                    const FmtIcon = formatIcon;
                    const timeAgo = formatTimeAgo(saved.timestamp);
                    return (
                      <li key={saved.id} className="group">
                        <button
                          onClick={() => loadSavedAsset(saved)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                          data-testid={`saved-asset-${saved.id}`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-lg bg-green-400/10 flex items-center justify-center shrink-0 mt-0.5">
                              <FmtIcon size={11} className="text-green-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-green-950 truncate leading-tight">{saved.headline}</p>
                              <p className="text-[10px] text-neutral-400 mt-0.5 capitalize">
                                {saved.format.replace(/-/g, " ")} · {saved.audience} · {timeAgo}
                              </p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteSavedAsset(saved.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 transition-all shrink-0"
                              title="Remove from history"
                            >
                              <Trash2 size={11} className="text-neutral-300 hover:text-red-400" />
                            </button>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {(resultFormat === "one-pager" || resultFormat === "two-pager" || resultFormat === "social-impact-one-pager") && <DocPreview result={result as DocResult} format={resultFormat} unverifiedFlags={unverifiedFlags} />}
            {resultFormat === "short-deck" && <DeckPreview result={result as DeckResult} unverifiedFlags={unverifiedFlags} />}
            {resultFormat === "linkedin-post" && <LinkedInPreview result={result as LinkedInResult} unverifiedFlags={unverifiedFlags} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="relative overflow-hidden bg-green-950 px-16 pt-12 pb-14">
        <div className="absolute top-[-60px] right-[-40px] w-96 h-96 bg-green-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-4">Asset Generator</p>
          <h1 className="text-white text-5xl leading-tight mb-3 uppercase" style={{ fontFamily: "'Obviously Narrow', sans-serif", fontWeight: 900 }}>
            Brand-grounded assets.<br /><span style={{ color: "var(--color-interactive-primary-cta)" }}>Generated in seconds.</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Choose a format, define your audience, describe your goal — Claude drafts it using your playbooks, proof points, and brand voice.
          </p>
        </div>
      </div>

      <div className="px-16 py-10">
        {brandContextLoaded !== null && (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${
            brandContextLoaded
              ? "bg-green-400/15 text-green-700"
              : "bg-yellow-400/20 text-yellow-700"
          }`} data-testid="brand-context-badge">
            {brandContextLoaded
              ? <><CheckCircle2 size={13} /> Brand Context: Loaded</>
              : <><AlertCircle size={13} /> Brand Context: Not configured</>
            }
          </div>
        )}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                step === s || (step === "done" && s === 3) ? "bg-green-400 text-green-950"
                  : (typeof step === "number" && step > s) || step === "done" ? "bg-green-950 text-white"
                  : "bg-neutral-200 text-neutral-400"
              }`}>
                {(typeof step === "number" && step > s) || step === "done" ? <Check size={12} /> : s}
              </div>
              <span className={`text-xs font-semibold ${step === s ? "text-green-950" : "text-neutral-300"}`}>
                {s === 1 ? "Format" : s === 2 ? "Audience" : "Objective"}
              </span>
              {s < 3 && <div className="w-8 h-px bg-black/15" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-green-950 text-xl font-black mb-6">What are you creating?</h2>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {FORMATS.map(({ id, label, desc, icon: Icon, accent, gradientFrom, gradientVia, bestFor, body, avoid }) => {
                const selected = format === id;
                return (
                  <button
                    key={id}
                    onClick={() => { setFormat(id); if (audience && !LINKEDIN_AUDIENCES.find(a => a.id === audience) && id === "linkedin-post") setAudience(null); setStep(2); }}
                    className={`flex flex-col p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                      selected
                        ? "border-green-400 shadow-xl shadow-[#042914]/20"
                        : "border-neutral-200 hover:border-neutral-300 hover:shadow-lg"
                    }`}
                    style={selected
                      ? { background: "var(--color-interactive-primary)" }
                      : { background: `linear-gradient(150deg, ${gradientFrom} 0%, ${gradientVia} 40%, #ffffff 100%)` }
                    }
                    data-testid={`format-${id}`}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: selected ? accent : accent + "22" }}
                      >
                        <Icon size={22} style={{ color: selected ? "#042914" : accent }} />
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-lg leading-none"
                        style={selected
                          ? { backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }
                          : { backgroundColor: accent + "18", color: accent }
                        }
                      >
                        {desc}
                      </span>
                    </div>

                    <p
                      className="font-black text-2xl mb-1 leading-tight tracking-tight"
                      style={{ fontFamily: "'Obviously Narrow', sans-serif", fontWeight: 900, color: selected ? "#ffffff" : "#042914" }}
                    >
                      {label}
                    </p>

                    <div className="h-px my-4" style={{ backgroundColor: selected ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)" }} />

                    <div className="space-y-3 flex-1">
                      <p className="text-[11px] font-semibold italic leading-relaxed" style={{ color: accent }}>
                        Best for {bestFor}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: selected ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.58)" }}>
                        {body}
                      </p>
                      <p className="text-[11px] leading-relaxed" style={{ color: selected ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)" }}>
                        <span className="mr-1">⚠</span>{avoid}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-green-950 text-xl font-black mb-2">{format === "linkedin-post" ? "Who is this post speaking to or about?" : "Who is this for?"}</h2>
            <p className="text-neutral-400 text-sm mb-6">This determines which playbook content Claude draws from.</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {audienceOptions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setAudience(id); setStep(3); }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm ${audience === id ? "border-green-400 bg-green-950" : "border-neutral-200 bg-white hover:border-green-400/40"}`}
                  data-testid={`audience-${id}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${audience === id ? "bg-green-400" : "bg-neutral-100"}`}>
                    <Icon size={16} className={audience === id ? "text-green-950" : "text-green-950/60"} />
                  </div>
                  <p className={`font-bold text-sm ${audience === id ? "text-white" : "text-green-950"}`}>{label}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-green-950/80 transition-colors">
              <ChevronLeft size={13} /> Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-green-950 text-xl font-black mb-2">Describe your objective</h2>
            <p className="text-neutral-400 text-sm mb-5">What do you need this asset to do? Who is it for and what should they walk away knowing or doing?</p>

            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder={format ? FORMAT_PLACEHOLDERS[format] : "Describe your goal..."}
              className="w-full border-2 border-neutral-200 rounded-2xl px-5 py-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-green-950 placeholder:text-neutral-400 leading-relaxed mb-6"
              rows={5}
              data-testid="objective-input"
            />

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm mb-4 bg-red-50 px-4 py-3 rounded-xl">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                disabled={!canGenerate}
                onClick={() => generate()}
                className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl bg-green-950 text-white disabled:opacity-40 hover:bg-green-950/80 transition-colors"
                data-testid="generate-button"
              >
                <Sparkles size={16} /> Generate Asset
              </button>
              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-green-950/80 transition-colors">
                <ChevronLeft size={13} /> Back
              </button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Clock size={11} className="inline mr-1.5" /> Recent Assets
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-testid="recent-assets-grid">
              {history.map((saved) => {
                const formatIcon = saved.format === "linkedin-post" ? Linkedin
                  : saved.format === "short-deck" ? Presentation
                  : saved.format === "social-impact-one-pager" ? Heart
                  : saved.format === "two-pager" ? Layers
                  : FileText;
                const FmtIcon = formatIcon;
                return (
                  <button
                    key={saved.id}
                    onClick={() => loadSavedAsset(saved)}
                    className="group flex items-start gap-3 p-4 bg-white border border-neutral-200 rounded-xl text-left hover:shadow-md hover:border-green-400/40 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center shrink-0">
                      <FmtIcon size={14} className="text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-950 truncate">{saved.headline}</p>
                      <p className="text-[11px] text-neutral-400 mt-1 capitalize">
                        {saved.format.replace(/-/g, " ")} · {saved.audience} · {formatTimeAgo(saved.timestamp)}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-neutral-300 group-hover:text-green-400 transition-colors mt-1 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
