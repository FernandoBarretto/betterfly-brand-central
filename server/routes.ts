import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { listLocalFiles, resolveFileId } from "./contentService";
import { buildPlaybookContext, buildBrandVoiceContext, playbooks, brandVoice, visualTokens } from "./brandContext";
import Anthropic from "@anthropic-ai/sdk";
import cron from "node-cron";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import mime from "mime-types";

const PASSCODE = "betterfly2025";
const ADMIN_PASSCODE = "betterfly-admin-2025";
const DATA_DIR = path.join(process.cwd(), "server/data");
const BRAND_GUIDELINES_PATH = path.join(process.cwd(), "data/brand-guidelines.md");
const TRENDS_PATH = path.join(DATA_DIR, "trends.json");
const COMPETITORS_PATH = path.join(DATA_DIR, "competitors.json");
const SOURCES_PATH = path.join(DATA_DIR, "sources.json");
const STAGING_PATH = path.join(DATA_DIR, "staging.json");
const JOB_LOGS_PATH = path.join(DATA_DIR, "job_logs.json");
const FOUNDATIONS_PATH = path.join(DATA_DIR, "foundations.json");
const IMPACT_STORIES_PATH = path.join(DATA_DIR, "impact-stories.json");
const API_KEYS_PATH = path.join(DATA_DIR, "api-keys.json");

interface ApiKeyRecord {
  id: string;
  key: string;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
  usageCount: number;
  active: boolean;
}

function readApiKeys(): ApiKeyRecord[] {
  return readJson<ApiKeyRecord[]>(API_KEYS_PATH, []);
}

function writeApiKeys(keys: ApiKeyRecord[]) {
  writeJson(API_KEYS_PATH, keys);
}

function generateApiKey(): string {
  return "bf_" + crypto.randomBytes(24).toString("hex");
}

function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing API key. Use Authorization: Bearer <key>" });

  const keys = readApiKeys();
  const record = keys.find(k => k.key === token && k.active);
  if (!record) return res.status(401).json({ error: "Invalid or revoked API key" });

  record.lastUsedAt = new Date().toISOString();
  record.usageCount += 1;
  writeApiKeys(keys);

  next();
}

const anthropic = new Anthropic({
  apiKey: (process.env.ANTHROPIC_API_KEY || "").trim(),
});

function requirePasscode(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["x-passcode"] || req.query.passcode;
  if (auth === PASSCODE) return next();
  res.status(401).json({ error: "Unauthorized" });
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["x-admin-passcode"] || req.query.adminPasscode;
  if (auth === ADMIN_PASSCODE) return next();
  res.status(401).json({ error: "Admin access required" });
}

function readJson<T>(filePath: string, fallback: T): T {
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); }
  catch { return fallback; }
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function readBrandGuidelines(): { loaded: boolean; content: string } {
  try {
    const content = fs.readFileSync(BRAND_GUIDELINES_PATH, "utf-8").trim();
    if (!content) return { loaded: false, content: "" };
    return { loaded: true, content };
  } catch {
    return { loaded: false, content: "" };
  }
}

function readTrends() {
  return readJson(TRENDS_PATH, { report_date: new Date().toISOString().split("T")[0], themes: [] });
}

function writeTrends(data: object) {
  writeJson(TRENDS_PATH, data);
}

function readStaging() {
  return readJson(STAGING_PATH, { trend_updates: [], competitor_updates: [] });
}

function writeStaging(data: object) {
  writeJson(STAGING_PATH, data);
}

function isDataPointVerified(dp: any): boolean {
  if (typeof dp === "string") return false;
  return dp?.verified === true;
}

function buildSystemPrompt(format: string, audience: string, trendsData: any): { prompt: string; hasUnverified: boolean } {
  const playbookCtx = audience !== "industry" ? buildPlaybookContext(audience) : "";
  const voiceCtx = buildBrandVoiceContext();

  let hasUnverified = false;
  const trendsCtx = trendsData.themes.map((t: any) => {
    // Only inject verified data points into prompts
    const verifiedPoints = (t.data_points || []).filter((dp: any) => isDataPointVerified(dp));
    const allPoints = t.data_points || [];
    if (allPoints.some((dp: any) => !isDataPointVerified(dp))) hasUnverified = true;

    const dpText = verifiedPoints.length > 0
      ? verifiedPoints.map((dp: any) => dp.text || dp).join(" | ")
      : "(no verified data points for this theme)";

    return `• ${t.title}: ${t.summary}\n  Verified Data: ${dpText}\n  Source: ${t.source}`;
  }).join("\n\n");

  const isDoc = format === "one-pager" || format === "two-pager" || format === "social-impact-one-pager";
  const isDeck = format === "short-deck";
  const isLinkedIn = format === "linkedin-post";
  let formatInstructions = "";

  if (isDoc) {
    const sectionCount = format === "one-pager" || format === "social-impact-one-pager" ? "exactly 3 sections" : "5-6 sections";
    formatInstructions = `Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "headline": "string — main headline, max 12 words",
  "subheadline": "string — supporting line, max 20 words",
  "intro": "string — 2-3 sentence opening paragraph",
  "pillar": "string or null — one of: 'The Betterfly Effect' | 'Built Around Your Habits' | 'Protection That Grows With You' | null. Pick the closest match to the asset's core message.",
  "header_glow": "string — 'green' | 'pink' | 'cyan'. Default 'green'. Use 'pink' for community/health, 'cyan' for tech/data.",
  "sections": [{"title": "string", "body": "string — 2-3 sentences each", "icon": "string or null — one of: metric, emotional_health, restaurant, donation, sleep, contract, doctor, metabolic, cells, water, book, telemedicine, globe, lotus, hourglass, salad, accident, giftcard, reward, vet, sneakers. Pick the best match for this section's topic, or null."}],
  "proof_points": ["string — use only verified proof points from the playbook data provided"],
  "proof_style": "string — 'forest' (default dark green bg + green text) | 'cyan' (Flash Cyan #00C7B1 bg + forest text). Use 'cyan' when proof points are the focal element.",
  "cta": "string — closing call to action",
  "source_references": ["string — e.g. 'Brokers Playbook — Messaging Pillar 2'"],
  "ambiguity_warning": false
}
Include ${sectionCount}. NEVER invent statistics — only use verified proof points from the playbook data above. If objective is broad/vague, set ambiguity_warning to true.
If you reference any stat or data point that came from unverified trend data, add "unverified_flags": ["exact sentence containing unverified data", ...]. Otherwise omit or set to [].
Always choose a pillar, header_glow, proof_style, and section icons that match the asset content. Use the CANONICAL MESSAGING PILLARS section above for visual rules per pillar.`;
  }

  if (isDeck) {
    formatInstructions = `Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "title_slide": {"title": "string", "subtitle": "string", "presenter_note": "string"},
  "slides": [
    {
      "slide_title": "string",
      "body": ["bullet 1", "bullet 2", "bullet 3"],
      "presenter_note": "string",
      "stat_callout": "string or null — only use verified stats from playbook/trends data"
    }
  ],
  "closing_slide": {"headline": "string", "cta": "string"},
  "source_references": ["string"],
  "ambiguity_warning": false
}
Include 3-7 content slides. If objective is vague, set ambiguity_warning to true.
If you reference any stat or data point that came from unverified trend data, add "unverified_flags": ["exact sentence containing unverified data", ...]. Otherwise omit or set to [].`;
  }

  if (isLinkedIn) {
    formatInstructions = `Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "hook": "string — opening 1-2 lines to stop the scroll. No question marks, no clichés.",
  "body": ["paragraph or single-line statement 1", "2", "3"],
  "proof_point": "string or null — one verified stat from trends or playbook data only",
  "cta": "string — closing line inviting engagement, not a hard sell",
  "hashtags": ["#tag1", "#tag2"],
  "character_count": 0,
  "source_references": ["string"],
  "ambiguity_warning": false
}
Include 3-5 body items and 2-4 hashtags (max 4). Set character_count to hook+body+cta combined character total. Must be under 2800 chars. If objective is vague, set ambiguity_warning to true.
If you reference any stat or data point that came from unverified trend data, add "unverified_flags": ["exact sentence containing unverified data", ...]. Otherwise omit or set to [].`;
  }

  let socialImpactCtx = "";
  if (format === "social-impact-one-pager") {
    const foundations = readJson<any[]>(FOUNDATIONS_PATH, []);
    const impactStories = readJson<any[]>(IMPACT_STORIES_PATH, []);
    const foundationList = foundations.map((f: any) => `- ${f.name} (${f.category}): ${f.description}`).join("\n");
    const storiesList = impactStories.map((s: any) => `- ${s.title}: "${s.body}" — ${s.attribution}`).join("\n");
    socialImpactCtx = `
## Betterfly Social Impact Data

### The Betterfly Effect
Betterfly is a B-Corp certified benefits platform. Its core mechanic — the Betterfly Effect — converts
employee health actions into donations to vetted foundations. When employees engage with their policies,
their coverage grows and Betterfly generates donations automatically. No extra cost. No opt-in required.

### Foundation Partners
${foundationList}

### Impact Stories
${storiesList}

### Key Differentiator
Broker feedback (Hylant): "The donation component is a thoughtful element and not something often
seen in comparable solutions."

### B-Corp Note
Betterfly is B-Corp certified — independently verified to meet the highest standards of social and
environmental performance. This is a legal commitment, not a marketing claim.
`;
  }

  const brandGuidelines = readBrandGuidelines();
  const brandCtxBlock = brandGuidelines.loaded
    ? `[BRAND CONTEXT — read before generating]\n${brandGuidelines.content}\n\n[GENERATION TASK]\n`
    : "";

  const prompt = `${brandCtxBlock}You are a senior brand content strategist for Betterfly, a prevention-first employee benefits platform built for SMBs.

Generate on-brand marketing assets grounded in Betterfly's approved messaging, proof points, and brand voice. NEVER invent statistics, proof points, or data — only use what is explicitly provided below.

${voiceCtx}

${playbookCtx ? playbookCtx + "\n" : ""}${socialImpactCtx}
=== INDUSTRY TRENDS REPORT (last updated: ${trendsData.report_date}) ===
${trendsCtx}

=== BETTERFLY DESIGN SYSTEM ===

COLORS (use only these — no substitutions):
  #19F578  Betterfly Green — CTAs, active states, headline accents, Buddy character
  #042914  Forest Green — dark backgrounds, primary text on light
  #E8FB10  Betterfly Yellow — badges, labels, selected CTAs ONLY. Never fill large areas or dominate layout. Reserve for small badge chips, stat callout labels, one selected CTA at most.
  #E2E0D9  Warm Neutral — inactive states, subtle fills
  #F7F7F5  Off White — card and section backgrounds
  #00C7B1  Flash Cyan — Proof Point badges, tech/data callouts, Flash-family accents. Pair with Forest Green text and Elipse_Flash glow. Never use as page background.
  #000000  Pure Black — body text on light backgrounds

TYPOGRAPHY (only two font families — never use system fonts or any other typeface):
  H1 (hero):       font-family: 'Obviously Narrow', sans-serif; font-weight: 700; font-size: 72px; line-height: 100%;
  H2 (section):    font-family: 'Obviously Narrow', sans-serif; font-weight: 700; font-size: 48px; line-height: 52px;
  H3 (subsection): font-family: 'Obviously Narrow', sans-serif; font-weight: 700; font-size: 32px; line-height: 36px;
  Subhead:         Roboto, 700 Bold, 21px / 21pt lh
  Body:            Roboto, 400 Regular, 18px / 24pt lh
  Caption/label:   Roboto, 400 Regular, 14px / 18pt lh
  IMPORTANT: For headlines/display text, always use font-family: 'Obviously Narrow', sans-serif (loaded locally via @font-face).

SPACING: Base unit 4px. Page gutters 64px. Column gap 20px. Max content width 1200px.
Border radius: 8px (chips/tags) · 12px (inputs, small cards) · 16px (cards, modals) · 20px (feature sections).

=== BRAND VOICE ===
Betterfly speaks like a brilliant friend who knows benefits and wants you to actually understand them — warm, direct, rooted in outcomes.
Rules:
  1. Lead with the benefit, not the feature. Every headline anchors in what changes for the reader.
  2. Write for one person. Even mass-distributed assets should feel personally addressed.
  3. Match tone to context. Employee-facing: warm, second-person ("you/your"), contractions OK. HR/broker-facing: third-person, data-driven, more formal.
  4. Be specific. Vague wellness promises don't build trust. Concrete details do.
  5. Structure for scanning. Key point first, short paragraphs, one clear next step.

VOCABULARY:
  Avoid jargon: claims · policy · users · compliance · perks
  Use instead: coverage · protection · benefits · employees · people · health engagement
  Approved terms: Betterflies (in-app reward currency) · Prevention-first (core philosophy) · Voluntary benefits (supplemental coverage) · SMB (10–500 employees) · Wellbeing journey · Benefit milestone · Enrollment (not "sign-up") · Health engagement (not "usage")

=== ASSET LIBRARY (web-served paths) ===

LOGOS:
  Dark backgrounds → /betterfly-wordmark.png (light wordmark)
  Light backgrounds → /betterfly-icon.png (dark icon)
  Rules: maintain clear space. Never stretch, rotate, recolor, or shadow.

BUDDY (green blob mascot — one pose per asset, never on plain white):
  /brand-assets/buddy/Buddy_Standing.png — neutral hero/intro
  /brand-assets/buddy/Buddy_PosesWaving.png — greetings, onboarding
  /brand-assets/buddy/Buddy_Running.png — momentum, activation
  /brand-assets/buddy/Buddy_Meditating.png — calm, wellness
  /brand-assets/buddy/Buddy_Thinking.png — insights, tips

GRADIENT GLOWS — DO NOT use image files. Instead use CSS radial-gradient() effects:
  Green glow (primary brand energy): background: radial-gradient(ellipse at top right, rgba(25, 245, 120, 0.3) 0%, transparent 70%);
  Yellow glow (accent energy): background: radial-gradient(ellipse at top right, rgba(232, 251, 16, 0.2) 0%, transparent 70%);
  Pink glow (community, health): background: radial-gradient(ellipse at top right, rgba(255, 100, 150, 0.25) 0%, transparent 70%);
  Cyan glow (tech, data): background: radial-gradient(ellipse at bottom right, rgba(0, 200, 220, 0.25) 0%, transparent 70%);
  Place ONE glow per section using a pseudo-element or overlay div. Never stack multiple.

BUTTERFLY DECORATIVE SHAPES — use these existing images as decorative accents on dark sections:
  /butterfly-angled.png — use at 20-40% opacity, scattered 2-3 per dark section with varying rotation
  /butterflies.png — alternative butterfly accent image
  Apply CSS transform: rotate() for variety. Position absolutely at corners/edges.

ILLUSTRATED ICONS (3D style) — use for feature callouts, benefit cards, proof points. Reference path: /brand-assets/icons/
Available icons (use the closest match): metric, emotional_health, restaurant (food/nutrition), donation, sleep, contract (enrollment/benefits/protection), doctor, metabolic, cells, water, book (education), telemedicine, globe (community), lotus (mindfulness), hourglass (time), salad, accident (coverage), giftcard, reward, vet, sneakers (movement/habits/exercise/activity)
Style: 3D rendered, colorful, playful. Use SVG when available.

CANONICAL MESSAGING PILLARS — when these appear in an asset, use exactly:
"The Betterfly Effect": focal element = butterfly shape centered at 50-70% opacity behind headline; glow = green; badge = Forest Green bg (#042914) + Betterfly Green text (#19F578); tone = lead with one transformative number
"Built Around Your Habits": primary icon = sneakers; secondary = reward/metric/lotus; glow = green; badge = Betterfly Green (#19F578) chip + Forest Green text; tone = second-person active
"Protection That Grows With You": primary icon = contract; secondary = accident/doctor/telemedicine; glow = green or pink; badge = Off White (#F7F7F5) chip + Forest Green text; tone = reassuring
Proof Points: badge = Flash Cyan (#00C7B1) bg + Forest Green text; glow = cyan; butterfly shapes at edges 25-35% opacity; stat number in Obviously Narrow Bold 64px; never invent statistics

CONTEXT MATCHING:
  All content types → green CSS radial-gradient glow + /butterfly-angled.png decorations
  Tech/data → cyan CSS radial-gradient glow
  Community/HR → pink CSS radial-gradient glow

=== FORMAT PLAYBOOKS ===

ONE-PAGER (cold outreach / email intro):
  One message only. One CTA. No feature lists.
  Header (≈35%): Forest Green bg · /betterfly-wordmark.png logo · green CSS radial-gradient glow · 2–3 butterfly-angled.png at corners (30% opacity)
  Headline: Obviously Narrow 700 48px white — one outcome statement
  Body: Roboto Regular 18px on Off White — max 3 proof points
  CTA: #19F578 button, Forest Green text
  Footer: /betterfly-icon.png small, left-aligned on Forest Green strip

TWO-PAGER (leave-behind for a specific role):
  Page 1 (dark): Forest Green bg · /betterfly-wordmark.png logo · CSS radial-gradient glow · 4–5 butterfly-angled.png (20–50% opacity) · Obviously Narrow 700 64px headline white · two Roboto lines in #19F578
  Page 2 (light): Off White bg · 2–3 sections · Obviously Narrow 700 32px subheads Forest Green · Roboto Regular 18px body · yellow only on badge labels · #19F578 CTA button · /betterfly-icon.png bottom-right

SHORT DECK (live meeting, 3–8 slides):
  One idea per slide. Max 40 body words per slide.
  Cover: Forest Green · /betterfly-wordmark.png logo · green CSS glow centered · 3–4 butterfly-angled.png (30–50% opacity) · Obviously Narrow 700 72px title · Roboto 21px subtitle in #19F578
  Content: alternate dark and light spreads. Yellow only on stat callouts or badge chips — never as slide bg.
  Final: dark spread · single takeaway headline · one CTA · Buddy_Standing bottom-right · /betterfly-wordmark.png bottom-left

LINKEDIN POST (thought leadership):
  Open with specific observation/data — not a brand claim. First person, 300–600 words. No generic wellness platitudes. One clear takeaway in final paragraph. Max 4 hashtags at end only.

SOCIAL IMPACT ONE-PAGER (broker/employer pitch):
  Three equal sections on Off White. No invented statistics.
  Section 1 — The Betterfly Effect: key impact metric · Obviously Narrow 700 64px · Forest Green
  Section 2 — B-Corp: certification context · Roboto body · yellow badge chip on header
  Section 3 — Foundation partner: one partner + one outcome sentence
  Decorative: 2 butterfly-angled.png at edges (25% opacity) · pink CSS radial-gradient behind Section 1 (15% opacity) · /betterfly-icon.png bottom-left

Footer on all assets: "Generated by Betterfly Brand Central · Internal use only"

=== OUTPUT FORMAT ===
${formatInstructions}

CRITICAL RULES:
1. Use ONLY verified proof points and statistics from the playbook and trends data provided
2. Follow brand voice — approved terminology, what to avoid, tone for audience
3. Return ONLY the JSON object — no markdown fences, no explanation, nothing else`;

  return { prompt, hasUnverified };
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  app.get("/api/healthz", (_req, res) => res.json({ ok: true }));

  // ── Page Analytics ──────────────────────────────────────────────────────
  const ANALYTICS_FILE = path.join(DATA_DIR, "page-analytics.json");

  interface PageView {
    path: string;
    ip: string;
    userAgent: string;
    timestamp: string;
  }

  function readAnalytics(): PageView[] {
    return readJson<PageView[]>(ANALYTICS_FILE, []);
  }

  app.post("/api/analytics/pageview", (req: Request, res: Response) => {
    const { path: pagePath } = req.body || {};
    if (!pagePath) return res.status(400).json({ error: "path required" });
    const views = readAnalytics();
    const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "unknown").split(",")[0].trim();
    views.push({
      path: pagePath,
      ip,
      userAgent: req.headers["user-agent"] || "unknown",
      timestamp: new Date().toISOString(),
    });
    writeJson(ANALYTICS_FILE, views);
    res.json({ ok: true });
  });

  app.get("/api/analytics/summary", requireAdmin, (req: Request, res: Response) => {
    const views = readAnalytics();
    const pagePath = (req.query.path as string) || "/ny-event";
    const days = parseInt(req.query.days as string) || 7;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const filtered = views.filter((v) => v.path === pagePath && v.timestamp >= cutoff);
    const uniqueIPs = new Set(filtered.map((v) => v.ip));

    const byDay: Record<string, { total: number; uniqueIPs: Set<string> }> = {};
    filtered.forEach((v) => {
      const day = v.timestamp.split("T")[0];
      if (!byDay[day]) byDay[day] = { total: 0, uniqueIPs: new Set() };
      byDay[day].total++;
      byDay[day].uniqueIPs.add(v.ip);
    });

    const daily = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, totalViews: data.total, uniqueVisitors: data.uniqueIPs.size }));

    res.json({
      path: pagePath,
      period: `last ${days} days`,
      totalPageViews: filtered.length,
      uniqueVisitors: uniqueIPs.size,
      daily,
    });
  });

  app.post("/api/verify-passcode", (req: Request, res: Response) => {
    const { passcode } = req.body || {};
    if (typeof passcode === "string" && passcode.toLowerCase().trim() === PASSCODE) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false });
    }
  });

  // ── Marketing Budget ──────────────────────────────────────────────────────
  const BUDGET_FILE = path.join(DATA_DIR, "budget.json");
  const BUDGET_PASSWORD = "Dollars";

  app.post("/api/verify-budget-password", (req: Request, res: Response) => {
    const { password } = req.body || {};
    if (typeof password === "string" && password === BUDGET_PASSWORD) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false });
    }
  });

  function readBudget() {
    return readJson<{ allocations: Record<string, number>; totalAnnualBudget: number; expenses: any[] }>(BUDGET_FILE, {
      allocations: {
        "Paid Media": 0,
        "Events & Sponsorships": 0,
        "Content Production": 0,
        "Design & Creative": 0,
        "Agency Fees": 0,
        "PR & Communications": 0,
        "Tools & Software": 0,
        "Miscellaneous": 0,
      },
      totalAnnualBudget: 0,
      expenses: [],
    });
  }

  app.get("/api/budget", requirePasscode, (_req, res) => {
    res.json(readBudget());
  });

  app.put("/api/budget", requirePasscode, (req: Request, res: Response) => {
    const current = readBudget();
    const { allocations, totalAnnualBudget } = req.body;
    if (allocations) current.allocations = allocations;
    if (totalAnnualBudget !== undefined) current.totalAnnualBudget = totalAnnualBudget;
    writeJson(BUDGET_FILE, current);
    res.json(current);
  });

  app.post("/api/budget/expenses", requirePasscode, (req: Request, res: Response) => {
    const current = readBudget();
    const expense = { ...req.body, id: crypto.randomUUID() };
    current.expenses.push(expense);
    writeJson(BUDGET_FILE, current);
    res.json(expense);
  });

  app.put("/api/budget/expenses/:id", requirePasscode, (req: Request, res: Response) => {
    const current = readBudget();
    const idx = current.expenses.findIndex((e: any) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    current.expenses[idx] = { ...current.expenses[idx], ...req.body, id: req.params.id };
    writeJson(BUDGET_FILE, current);
    res.json(current.expenses[idx]);
  });

  app.delete("/api/budget/expenses/:id", requirePasscode, (req: Request, res: Response) => {
    const current = readBudget();
    current.expenses = current.expenses.filter((e: any) => e.id !== req.params.id);
    writeJson(BUDGET_FILE, current);
    res.json({ ok: true });
  });

  app.get("/api/brand-context-status", requirePasscode, (_req, res) => {
    const { loaded } = readBrandGuidelines();
    res.json({ loaded });
  });

  // ── Asset Generation ─────────────────────────────────────────────────────────
  app.post("/api/generate", requirePasscode, async (req: Request, res: Response) => {
    try {
      const { format, audience, objective, refineInstruction, previousResult } = req.body;
      if (!format || !audience || !objective)
        return res.status(400).json({ error: "format, audience, and objective are required" });

      const trendsData = readTrends();
      const { prompt: systemPrompt, hasUnverified } = buildSystemPrompt(format, audience, trendsData);

      let userMessage: string;
      if (refineInstruction && previousResult) {
        userMessage = `Here is the previously generated asset:\n${JSON.stringify(previousResult, null, 2)}\n\nRefine it with this instruction: "${refineInstruction}"\n\nReturn the complete updated JSON in the same format.`;
      } else {
        const formatLabel =
          format === "one-pager" ? "One-Pager (1 page PDF)"
          : format === "two-pager" ? "Two-Pager (2 page PDF)"
          : format === "short-deck" ? "Short Deck (3-8 slides PPTX)"
          : format === "social-impact-one-pager" ? "Social Impact One-Pager (1 page PDF)"
          : "LinkedIn Post";
        const audienceLabel = audience === "industry"
          ? "Industry / General audience"
          : `${audience.charAt(0).toUpperCase() + audience.slice(1)} audience`;
        userMessage = `Generate a ${formatLabel} for the ${audienceLabel} with this objective:\n\n"${objective}"\n\nUse only approved brand content. Return only the JSON.`;
      }

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      const rawText = message.content[0].type === "text" ? message.content[0].text : "";
      const cleaned = rawText.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();

      let result;
      try {
        result = JSON.parse(cleaned);
      } catch {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) result = JSON.parse(jsonMatch[0]);
        else return res.status(500).json({ error: "Failed to parse generated content", raw: rawText });
      }

      console.log("[Asset Generator] Claude returned:", JSON.stringify({ pillar: result.pillar, header_glow: result.header_glow, proof_style: result.proof_style, sections_icons: result.sections?.map((s: any) => s.icon) }, null, 2));

      const ambiguityWarning = result.ambiguity_warning === true;
      delete result.ambiguity_warning;
      const unverifiedFlags: string[] = Array.isArray(result.unverified_flags) ? result.unverified_flags : [];
      delete result.unverified_flags;

      res.json({ result, format, audience, ambiguityWarning, hasUnverifiedData: hasUnverified, unverifiedFlags, trendsDate: trendsData.report_date });
    } catch (err: any) {
      console.error("Generate error:", err);
      res.status(500).json({ error: err.message || "Generation failed" });
    }
  });

  // ── Industry Trends (public read) ─────────────────────────────────────────────
  app.get("/api/trends", requirePasscode, (_req, res) => res.json(readTrends()));

  // ── Competitors (public read) ─────────────────────────────────────────────────
  app.get("/api/competitors", requirePasscode, (_req, res) => {
    res.json(readJson(COMPETITORS_PATH, { competitors: [] }));
  });

  // ── Admin: Trends ─────────────────────────────────────────────────────────────
  app.get("/api/admin/trends", requireAdmin, (_req, res) => res.json(readTrends()));

  app.put("/api/admin/trends", requireAdmin, (req: Request, res: Response) => {
    const data = req.body;
    data.report_date = new Date().toISOString().split("T")[0];
    writeTrends(data);
    res.json({ ok: true, report_date: data.report_date });
  });

  app.post("/api/admin/trends/theme", requireAdmin, (req: Request, res: Response) => {
    const data = readTrends() as any;
    const theme = { ...req.body, id: `trend-${Date.now()}` };
    data.themes.push(theme);
    writeTrends(data);
    res.json(theme);
  });

  app.patch("/api/admin/trends/theme/:id", requireAdmin, (req: Request, res: Response) => {
    const data = readTrends() as any;
    const idx = data.themes.findIndex((t: any) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Theme not found" });
    data.themes[idx] = { ...data.themes[idx], ...req.body };
    writeTrends(data);
    res.json(data.themes[idx]);
  });

  app.delete("/api/admin/trends/theme/:id", requireAdmin, (req: Request, res: Response) => {
    const data = readTrends() as any;
    data.themes = data.themes.filter((t: any) => t.id !== req.params.id);
    writeTrends(data);
    res.json({ ok: true });
  });

  app.post("/api/admin/trends/extract", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { rawText } = req.body;
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `Extract structured industry trends from the following text for a voluntary benefits / SMB HR platform called Betterfly.

Return ONLY a JSON array of theme objects with:
- title (string)
- summary (2-4 sentences)
- data_points: array of objects each with { text, source_name, source_url, verified }
  - verified should be true only if the exact stat/fact is explicitly stated in the source
  - source_url should be empty string "" if not available
- source (string — publication name)
- relevance (array from: Carriers, Brokers, Employers, Employees, General)

Text:\n${rawText}\n\nReturn only the JSON array, no markdown.`,
        }],
      });
      const raw = message.content[0].type === "text" ? message.content[0].text : "[]";
      const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
      const themes = JSON.parse(cleaned.match(/\[[\s\S]*\]/)?.[0] || "[]");
      res.json({ themes });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Admin: Competitors ─────────────────────────────────────────────────────────
  app.get("/api/admin/competitors", requireAdmin, (_req, res) => {
    res.json(readJson(COMPETITORS_PATH, { competitors: [] }));
  });

  app.put("/api/admin/competitors/:id", requireAdmin, (req: Request, res: Response) => {
    const data = readJson(COMPETITORS_PATH, { competitors: [] }) as any;
    const idx = data.competitors.findIndex((c: any) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Competitor not found" });
    data.competitors[idx] = { ...data.competitors[idx], ...req.body, last_updated: new Date().toISOString().split("T")[0] };
    writeJson(COMPETITORS_PATH, data);
    res.json(data.competitors[idx]);
  });

  // ── Admin: Sources ─────────────────────────────────────────────────────────────
  app.get("/api/admin/sources", requireAdmin, (_req, res) => {
    res.json(readJson(SOURCES_PATH, { trusted_domains: [], rss_feeds: [] }));
  });

  app.put("/api/admin/sources", requireAdmin, (req: Request, res: Response) => {
    writeJson(SOURCES_PATH, req.body);
    res.json({ ok: true });
  });

  // ── Admin: Staging ─────────────────────────────────────────────────────────────
  app.get("/api/admin/staging", requireAdmin, (_req, res) => res.json(readStaging()));

  app.post("/api/admin/staging/accept/:id", requireAdmin, (req: Request, res: Response) => {
    const staging = readStaging() as any;
    let found = false;
    for (const arr of [staging.trend_updates, staging.competitor_updates]) {
      const item = arr.find((i: any) => i.id === req.params.id);
      if (item) { item.status = "accepted"; found = true; break; }
    }
    if (!found) return res.status(404).json({ error: "Staged item not found" });
    writeStaging(staging);
    res.json({ ok: true });
  });

  app.delete("/api/admin/staging/:id", requireAdmin, (req: Request, res: Response) => {
    const staging = readStaging() as any;
    staging.trend_updates = staging.trend_updates.filter((i: any) => i.id !== req.params.id);
    staging.competitor_updates = staging.competitor_updates.filter((i: any) => i.id !== req.params.id);
    writeStaging(staging);
    res.json({ ok: true });
  });

  app.post("/api/admin/staging/publish", requireAdmin, (req: Request, res: Response) => {
    const staging = readStaging() as any;
    const trendsData = readTrends() as any;
    const competitorsData = readJson(COMPETITORS_PATH, { competitors: [] }) as any;

    let publishedTrends = 0;
    let publishedCompetitors = 0;

    // Apply accepted trend updates
    for (const item of staging.trend_updates) {
      if (item.status !== "accepted") continue;
      trendsData.themes.push({ ...item.proposed, id: `trend-${Date.now()}-${Math.random().toString(36).slice(2,6)}` });
      publishedTrends++;
    }

    // Apply accepted competitor updates
    for (const item of staging.competitor_updates) {
      if (item.status !== "accepted") continue;
      const comp = competitorsData.competitors.find((c: any) => c.id === item.competitor_id);
      if (comp) {
        if (item.field === "positioning") {
          comp.positioning = item.proposed_value;
        } else if (item.field === "key_differentiator" || item.field === "new_feature") {
          comp.key_differentiators = comp.key_differentiators || [];
          comp.key_differentiators.push(item.proposed_value);
        }
        comp.last_updated = new Date().toISOString().split("T")[0];
        publishedCompetitors++;
      }
    }

    // Update report date and clear published items
    trendsData.report_date = new Date().toISOString().split("T")[0];
    staging.trend_updates = staging.trend_updates.filter((i: any) => i.status !== "accepted");
    staging.competitor_updates = staging.competitor_updates.filter((i: any) => i.status !== "accepted");

    writeTrends(trendsData);
    writeJson(COMPETITORS_PATH, competitorsData);
    writeStaging(staging);

    res.json({ ok: true, publishedTrends, publishedCompetitors, report_date: trendsData.report_date });
  });

  // ── Admin: Job Logs ───────────────────────────────────────────────────────────
  app.get("/api/admin/job-logs", requireAdmin, (_req, res) => {
    res.json(readJson(JOB_LOGS_PATH, []));
  });

  // Manual job trigger (runs inline — use for testing only)
  app.post("/api/admin/run-job", requireAdmin, async (_req, res: Response) => {
    res.json({ ok: true, message: "Job triggered. Check Job History tab in ~2 minutes." });
    // Run asynchronously — don't await in request
    import("child_process").then(({ spawn }) => {
      const proc = spawn("tsx", ["server/intelligenceJob.ts"], {
        env: process.env,
        stdio: "inherit",
      });
      proc.on("error", (err) => console.error("Job spawn error:", err.message));
    });
  });

  // ── Intel Digest (LLM Analysis) ─────────────────────────────────────────────
  let cachedDigest: any = null;

  function buildCompetitorContext(): string {
    const compData = readJson(COMPETITORS_PATH, { competitors: [] }) as any;
    return compData.competitors.map((c: any) => `
### ${c.name}
- Tagline: ${c.tagline}
- Founded: ${c.founded}
- Markets: ${c.markets}
- Maturity: ${c.maturity}
- Positioning: ${c.positioning?.text || 'N/A'}
- Key Differentiators: ${(c.key_differentiators || []).map((d: any) => d.text).join('; ')}
- Strategic Gaps: ${(c.analyses || []).find((a: any) => a.label === 'Strategic Gaps')?.text || 'N/A'}
- Matrix: ${JSON.stringify(c.matrix || {})}
    `.trim()).join('\n\n');
  }

  async function generateIntelDigest(newsContext: string[] = []): Promise<any> {
    const systemPrompt = `
You are a senior competitive intelligence analyst for Betterfly — a prevention-first employee benefits platform built on insurance, currently launching in the US (Florida, Q2 2026) after proven success across Latin America and Europe.

Analyze the competitive landscape and surface MACRO themes — patterns, tensions, and movements across the market as a whole. Do NOT summarize individual competitors. Look for what multiple players are doing simultaneously, what is converging, what is diverging, and what it signals about where the market is heading.

## Betterfly's Positioning
- Prevention-first benefits platform built on insurance
- Guaranteed-issue group term life, critical illness, accident, hospital indemnity
- Year-round engagement engine (not just a policy)
- B-Corp certified — social impact is structural, not marketing
- SMB-focused: no minimum group size, no long-term contracts
- Bilingual (ENG/SPA), designed for diverse workforces

## Competitive Landscape Data
${buildCompetitorContext()}

## Industry Headlines This Week
${newsContext.length > 0 ? newsContext.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n') : 'No external headlines provided — analyze from competitive data only.'}

## Output Format
Return valid JSON only. No markdown, no commentary outside the JSON.
{
  "weekOf": "[current date, formatted as Month DD, YYYY]",
  "overallRead": "[2-3 sentences — the single most important thing to understand about where this market stands right now]",
  "themes": [
    {
      "id": "slug-format-id",
      "title": "[Punchy theme title, 4-7 words, editorial tone — not a company name]",
      "summary": "[2-3 sentences describing the pattern or movement across the field]",
      "severity": "high|medium|low",
      "signal": "[1 sentence — specific observable evidence: what players are doing, what headlines confirm]",
      "players": ["only competitor names from the landscape data"],
      "betterflyRead": "[2-3 sentences — direct, opinionated read on what this theme means for Betterfly positioning, messaging, or strategy]",
      "icon": "TrendingUp|TrendingDown|Zap|AlertTriangle|Shield|Target|Radio|Layers|Repeat|Eye|Activity|Flame"
    }
  ]
}

Rules:
- Return 3–5 themes. Quality over quantity.
- Never name a theme after a single competitor. Frame around market dynamics.
- If fewer than 3 meaningful themes exist in the data, return fewer and say so in overallRead.
- Tone: direct, intelligent, slightly opinionated. Respects the reader's time.
`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{ role: "user", content: "Generate the Intel Digest analysis now." }],
      system: systemPrompt,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse LLM response");
    }

    const result = JSON.parse(jsonMatch[0]);
    result.generatedAt = new Date().toISOString();
    cachedDigest = result;
    return result;
  }

  const TRADE_PULSE_DATA = {
    generatedAt: new Date().toISOString(),
    articlesScanned: 10,
    items: [
      {
        id: "voluntary-benefits-expansion-2027",
        publication: "HR Dive",
        headline: "Nearly 1 in 3 employers plan to expand voluntary benefits by 2027",
        link: "https://www.hrdive.com/news/employers-to-expand-voluntary-benefits-by-2027/752934/",
        pubDate: "2025-01-15T12:00:00Z",
        summary: "A major industry survey finds 31% of employers plan to add or expand voluntary benefit offerings — critical illness, accident, hospital indemnity — by 2027. Cost neutrality and employee retention are the top drivers.",
        soWhat: "Direct validation of Betterfly's core market. Use this stat in every broker pitch: employers are actively seeking exactly what we offer, with zero employer cost.",
        tier: 1,
        topicCluster: "Voluntary Benefits",
        relevance: "high" as const,
      },
      {
        id: "benefits-predictions-2026",
        publication: "HR Dive",
        headline: "5 benefits predictions for 2026",
        link: "https://www.hrdive.com/news/5-benefits-predictions-for-2026/808275/",
        pubDate: "2025-12-18T12:00:00Z",
        summary: "Industry analysts predict personalization, AI-driven enrollment, year-round engagement, and preventive health incentives will dominate the 2026 benefits landscape. Traditional annual-enrollment-only models are losing ground.",
        soWhat: "Betterfly checks every box on this prediction list. Package these trends into the 2026 sales narrative — we're not ahead of the curve, we are the curve.",
        tier: 1,
        topicCluster: "Benefits Technology",
        relevance: "high" as const,
      },
      {
        id: "personalized-benefits-demand",
        publication: "HR Dive",
        headline: "Workers want personalized benefits, but companies are struggling to keep up",
        link: "https://www.hrdive.com/news/workers-want-personalized-benefits-companies-struggling/756248/",
        pubDate: "2025-02-20T12:00:00Z",
        summary: "Employees increasingly expect benefits tailored to their life stage and health profile, but most employers lack the technology to deliver. The gap is widest among SMBs with limited HR infrastructure.",
        soWhat: "Position Betterfly's engagement engine as the answer to the personalization gap — especially for SMBs who can't build custom benefits tech in-house.",
        tier: 1,
        topicCluster: "Benefits Technology",
        relevance: "high" as const,
      },
      {
        id: "retention-through-benefits",
        publication: "BenefitsPro",
        headline: "Strong benefits packages boost employee retention for over 60% of workers",
        link: "https://www.benefitspro.com/2025/04/03/strong-benefits-packages-boost-employee-retention-for-over-60-of-workers/",
        pubDate: "2025-04-03T12:00:00Z",
        summary: "New research confirms that 60%+ of employees cite benefits quality as a primary reason for staying with their employer. Voluntary and wellness benefits are the fastest-growing categories influencing retention.",
        soWhat: "Lead every employer conversation with this: Betterfly's voluntary products directly drive the retention metric that keeps CEOs up at night — at zero employer cost.",
        tier: 1,
        topicCluster: "Employee Wellbeing",
        relevance: "high" as const,
      },
      {
        id: "wellness-predictions-2025",
        publication: "BenefitsPro",
        headline: "2025 employee benefits & workplace predictions: Employee wellness",
        link: "https://www.benefitspro.com/2025/01/08/2025-employee-benefits--workplace-predictions-employee-wellness/",
        pubDate: "2025-01-08T12:00:00Z",
        summary: "Benefits experts predict that holistic wellness — combining physical health, mental health, and financial wellness into a single engagement platform — will become the standard by 2025. Point solutions are losing favor.",
        soWhat: "Betterfly's all-in-one prevention platform is exactly the integrated model the market is moving toward. Use to counter competitors selling siloed point solutions.",
        tier: 1,
        topicCluster: "Employee Wellbeing",
        relevance: "high" as const,
      },
      {
        id: "employer-cost-increase-2026",
        publication: "Fierce Healthcare",
        headline: "Employers brace for a 9% cost increase in 2026: Business Group on Health survey",
        link: "https://www.fiercehealthcare.com/payers/employers-brace-9-cost-increase-2026-business-group-health-survey",
        pubDate: "2025-08-19T15:22:00Z",
        summary: "Large employers expect healthcare costs to rise 9% in 2026, the highest projected increase in over a decade. Prevention and early intervention are cited as the top cost-containment strategies.",
        soWhat: "When employers are facing 9% cost increases, Betterfly's prevention-first model and zero-cost voluntary products become even more compelling. Lead with cost containment in Q1 pitches.",
        tier: 2,
        topicCluster: "Employer Benefits Cost",
        relevance: "high" as const,
      },
      {
        id: "employer-wellbeing-strategies",
        publication: "Fierce Healthcare",
        headline: "Business Group on Health: A look at employers' evolving strategies around well-being",
        link: "https://www.fiercehealthcare.com/payers/business-group-health-look-employers-evolving-strategies-around-wellbeing",
        pubDate: "2024-05-29T17:00:00Z",
        summary: "Major employers are shifting well-being strategies from reactive disease management to proactive prevention and engagement. Companies with active wellness platforms report measurably lower claims and higher employee satisfaction.",
        soWhat: "Validates Betterfly's prevention-first thesis with data from the largest employers. Adapt these findings for SMB pitch decks — if it works for Fortune 500, it scales down too.",
        tier: 1,
        topicCluster: "Employee Wellbeing",
        relevance: "medium" as const,
      },
      {
        id: "healthcare-trends-2026",
        publication: "Employee Benefit News",
        headline: "The biggest trends in healthcare for 2026",
        link: "https://www.benefitnews.com/news/the-biggest-trends-in-healthcare-for-2026",
        pubDate: "2025-12-10T12:00:00Z",
        summary: "EBN identifies AI-powered benefits navigation, preventive health incentives, bilingual communication, and voluntary benefit expansion as the defining healthcare trends for 2026. Traditional carriers are scrambling to add engagement layers.",
        soWhat: "Betterfly already delivers on every trend EBN identified. Use this article as third-party validation in broker education materials and webinar content.",
        tier: 1,
        topicCluster: "Benefits Technology",
        relevance: "high" as const,
      },
      {
        id: "ai-startups-healthcare",
        publication: "Employee Benefit News",
        headline: "AI startups changing healthcare benefits",
        link: "https://www.benefitnews.com/news/ai-startups-changing-healthcare-benefits",
        pubDate: "2025-06-15T12:00:00Z",
        summary: "A wave of AI-powered startups is transforming how employers administer and employees interact with healthcare benefits. Platforms that combine coverage with engagement are attracting the most employer interest.",
        soWhat: "Position Betterfly in this narrative — we're not just another AI startup, we're a licensed carrier with embedded engagement. That's a structural moat competitors can't replicate quickly.",
        tier: 2,
        topicCluster: "Benefits Technology",
        relevance: "medium" as const,
      },
      {
        id: "insurtech-ai-next-gen",
        publication: "Coverager",
        headline: "Going Into the Next Generation of Insurance Smarter and Stronger with AI-Powered Tech",
        link: "https://coverager.com/going-into-the-next-generation-of-insurance-smarter-and-stronger-with-ai-powered-tech/",
        pubDate: "2025-09-12T12:00:00Z",
        summary: "Coverager profiles the next wave of insurtechs leveraging AI for underwriting, engagement, and claims — with benefits platforms leading adoption. The editorial argues that insurtechs with built-in engagement loops will outperform pure distribution plays.",
        soWhat: "Reinforces Betterfly's competitive positioning as a benefits-native insurtech with engagement built in, not bolted on. Share with investor and partner audiences.",
        tier: 1,
        topicCluster: "Insurtech",
        relevance: "medium" as const,
      },
    ],
  };

  let cachedTradePulse: any = TRADE_PULSE_DATA;

  async function runScheduledAnalysis() {
    console.log("[Intel Digest] Running scheduled analysis...");
    try {
      await generateIntelDigest([]);
      console.log("[Intel Digest] Analysis complete and cached.");
    } catch (err: any) {
      console.error("[Intel Digest] Analysis failed:", err.message || err);
    }
    console.log("[Trade Pulse] Curated dataset loaded (" + cachedTradePulse.items.length + " articles).");
  }

  runScheduledAnalysis();

  cron.schedule("0 8 * * 1,4", () => {
    runScheduledAnalysis();
  });

  app.get("/api/intel-digest", requirePasscode, (_req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.json(cachedDigest || null);
  });

  app.get("/api/trade-pulse", requirePasscode, (_req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.json(cachedTradePulse || null);
  });

  app.post("/api/trade-pulse/analyze", requirePasscode, async (_req: Request, res: Response) => {
    cachedTradePulse = { ...TRADE_PULSE_DATA, generatedAt: new Date().toISOString() };
    res.json(cachedTradePulse);
  });

  app.post("/api/intel-digest/analyze", requirePasscode, async (req: Request, res: Response) => {
    try {
      const newsContext: string[] = req.body.newsContext || [];
      const result = await generateIntelDigest(newsContext);
      res.json(result);
    } catch (err: any) {
      console.error("Intel Digest analysis error:", err.message);
      res.status(500).json({ error: "Analysis failed: " + err.message });
    }
  });

  // ── Content / Drive ──────────────────────────────────────────────────────────
  app.get("/api/social-impact/foundations", requirePasscode, (_req, res) => {
    res.json(readJson(FOUNDATIONS_PATH, []));
  });

  app.get("/api/social-impact/stories", requirePasscode, (_req, res) => {
    res.json(readJson(IMPACT_STORIES_PATH, []));
  });

  app.get("/api/drive/files", requirePasscode, (_req, res) => {
    try {
      res.json(listLocalFiles());
    } catch (e) {
      res.status(500).json({ error: "Failed to list files" });
    }
  });

  app.get("/api/drive/files/:fileId/preview", requirePasscode, (req, res) => {
    try {
      const absPath = resolveFileId(String(req.params.fileId));
      if (!absPath) return res.status(404).json({ error: "File not found" });
      const download = req.query.download === "true";
      const mimeType = (mime.lookup(absPath) || "application/octet-stream").toString();
      const filename = absPath.split("/").pop() || "file";
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Disposition", `${download ? "attachment" : "inline"}; filename="${encodeURIComponent(filename)}"`);
      res.sendFile(absPath, (err) => {
        if (err && !res.headersSent) res.status(500).json({ error: "Failed to send file" });
      });
    } catch {
      if (!res.headersSent) res.status(500).json({ error: "Failed to serve file" });
    }
  });

  // ── Admin: API Key Management ────────────────────────────────────────────────
  app.get("/api/admin/api-keys", requireAdmin, (_req, res) => {
    const keys = readApiKeys().map(k => ({
      id: k.id,
      label: k.label,
      keyPreview: k.key.slice(0, 7) + "..." + k.key.slice(-4),
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      usageCount: k.usageCount,
      active: k.active,
    }));
    res.json({ keys });
  });

  app.post("/api/admin/api-keys", requireAdmin, (req: Request, res: Response) => {
    const { label } = req.body;
    if (!label || typeof label !== "string") return res.status(400).json({ error: "label is required" });

    const keys = readApiKeys();
    const newKey: ApiKeyRecord = {
      id: crypto.randomUUID(),
      key: generateApiKey(),
      label: label.trim(),
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      usageCount: 0,
      active: true,
    };
    keys.push(newKey);
    writeApiKeys(keys);

    res.json({ id: newKey.id, key: newKey.key, label: newKey.label, createdAt: newKey.createdAt });
  });

  app.delete("/api/admin/api-keys/:id", requireAdmin, (req: Request, res: Response) => {
    const keys = readApiKeys();
    const key = keys.find(k => k.id === req.params.id);
    if (!key) return res.status(404).json({ error: "Key not found" });
    key.active = false;
    writeApiKeys(keys);
    res.json({ ok: true, revoked: key.id });
  });

  // ── External API v1 (API key auth) ─────────────────────────────────────────

  app.get("/api/v1/brand/voice", requireApiKey, (_req, res) => {
    res.json({
      oneLiner: brandVoice.oneLiner,
      elevatorPitch: brandVoice.elevatorPitch,
      positioning: brandVoice.positioning,
      toneGuidelines: brandVoice.toneGuidelines,
      doSay: brandVoice.doSay,
      dontSay: brandVoice.dontSay,
      glossary: brandVoice.glossary,
    });
  });

  app.get("/api/v1/brand/visual", requireApiKey, (_req, res) => {
    res.json(visualTokens);
  });

  app.get("/api/v1/playbooks", requireApiKey, (_req, res) => {
    const audiences = Object.keys(playbooks);
    const summary = audiences.map(a => {
      const p = playbooks[a as keyof typeof playbooks];
      return { audience: a, title: p.title, tagline: p.tagline };
    });
    res.json({ playbooks: summary });
  });

  app.get("/api/v1/playbooks/:audience", requireApiKey, (req, res) => {
    const audience = req.params.audience as keyof typeof playbooks;
    const p = playbooks[audience];
    if (!p) return res.status(404).json({ error: `Playbook not found. Available: ${Object.keys(playbooks).join(", ")}` });
    res.json(p);
  });

  app.get("/api/v1/trends", requireApiKey, (_req, res) => {
    res.json(readTrends());
  });

  app.get("/api/v1/competitors", requireApiKey, (_req, res) => {
    res.json(readJson(COMPETITORS_PATH, { competitors: [] }));
  });

  app.get("/api/v1/intel-digest", requireApiKey, (_req, res) => {
    res.json(cachedDigest || null);
  });

  app.post("/api/v1/generate", requireApiKey, async (req: Request, res: Response) => {
    try {
      const { format, audience, objective } = req.body;
      if (!format || !audience || !objective)
        return res.status(400).json({ error: "format, audience, and objective are required" });

      const validFormats = ["one-pager", "two-pager", "short-deck", "linkedin-post", "social-impact-one-pager"];
      if (!validFormats.includes(format))
        return res.status(400).json({ error: `Invalid format. Use one of: ${validFormats.join(", ")}` });

      const validAudiences = ["carriers", "brokers", "employers", "employees", "industry"];
      if (!validAudiences.includes(audience))
        return res.status(400).json({ error: `Invalid audience. Use one of: ${validAudiences.join(", ")}` });

      const trendsData = readTrends();
      const { prompt: systemPrompt, hasUnverified } = buildSystemPrompt(format, audience, trendsData);

      const formatLabel =
        format === "one-pager" ? "One-Pager (1 page PDF)"
        : format === "two-pager" ? "Two-Pager (2 page PDF)"
        : format === "short-deck" ? "Short Deck (3-8 slides PPTX)"
        : format === "social-impact-one-pager" ? "Social Impact One-Pager (1 page PDF)"
        : "LinkedIn Post";
      const audienceLabel = audience === "industry"
        ? "Industry / General audience"
        : `${audience.charAt(0).toUpperCase() + audience.slice(1)} audience`;
      const userMessage = `Generate a ${formatLabel} for the ${audienceLabel} with this objective:\n\n"${objective}"\n\nUse only approved brand content. Return only the JSON.`;

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      const rawText = message.content[0].type === "text" ? message.content[0].text : "";
      const cleaned = rawText.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();

      let result;
      try {
        result = JSON.parse(cleaned);
      } catch {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) result = JSON.parse(jsonMatch[0]);
        else return res.status(500).json({ error: "Failed to parse generated content" });
      }

      delete result.ambiguity_warning;
      delete result.unverified_flags;

      res.json({ result, format, audience, hasUnverifiedData: hasUnverified, trendsDate: trendsData.report_date });
    } catch (err: any) {
      console.error("API v1 generate error:", err);
      res.status(500).json({ error: err.message || "Generation failed" });
    }
  });

  return httpServer;
}
