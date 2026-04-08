/**
 * Betterfly Weekly Intelligence Job
 * Runs every Monday at 8am via Replit Scheduled Deployment.
 * Fetches RSS feeds + competitor watch URLs, extracts insights via Claude,
 * writes to staging.json for admin review. Never auto-publishes.
 */

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import RSSParser from "rss-parser";
import * as pdfParseModule from "pdf-parse";
const pdfParse = (pdfParseModule as any).default || pdfParseModule;

const DATA_DIR = path.join(process.cwd(), "server/data");
const SOURCES_PATH = path.join(DATA_DIR, "sources.json");
const STAGING_PATH = path.join(DATA_DIR, "staging.json");
const JOB_LOGS_PATH = path.join(DATA_DIR, "job_logs.json");
const COMPETITORS_PATH = path.join(DATA_DIR, "competitors.json");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface JobLog {
  run_id: string;
  started_at: string;
  completed_at: string | null;
  trends_fetched: number;
  competitors_processed: number;
  staging_written: number;
  errors: string[];
  status: "running" | "success" | "error";
}

interface SourcesConfig {
  notification_webhook: string;
  notification_email: string;
  rss_feeds: Array<{ url: string; label: string; domain: string }>;
  trusted_domains: Array<{ domain: string; category: string; type: string }>;
  pdf_domains: string[];
}

interface StagingData {
  trend_updates: any[];
  competitor_updates: any[];
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, data: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function isTrustedDomain(url: string, trusted: SourcesConfig["trusted_domains"]): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return trusted.some((t) => hostname === t.domain || hostname.endsWith(`.${t.domain}`));
  } catch {
    return false;
  }
}

function getDomainCategory(url: string, trusted: SourcesConfig["trusted_domains"]): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const match = trusted.find((t) => hostname === t.domain || hostname.endsWith(`.${t.domain}`));
    return match?.category || "unknown";
  } catch {
    return "unknown";
  }
}

function isPdfDomain(url: string, pdfDomains: string[]): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return pdfDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

async function fetchPageContent(url: string, pdfDomains: string[]): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Betterfly-Intelligence-Bot/1.0 (internal research tool)" },
    signal: AbortSignal.timeout(15000),
  });

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/pdf") || isPdfDomain(url, pdfDomains)) {
    const buffer = Buffer.from(await response.arrayBuffer());
    try {
      const parsed = await pdfParse(buffer);
      return parsed.text.slice(0, 8000);
    } catch {
      return "";
    }
  }

  const html = await response.text();
  // Strip HTML tags, collapse whitespace
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
  return text;
}

async function extractTrendsFromContent(
  content: string,
  sourceUrl: string,
  sourceLabel: string,
  category: string
): Promise<any[]> {
  if (!content.trim()) return [];

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Extract any data points, statistics, or trends relevant to voluntary benefits, SMB health engagement, benefits technology, or insurance distribution from the source text below. Return ONLY facts that appear explicitly in the source — do not add context, inferences, or your own knowledge.

For each data point return a JSON object with:
- "text": the specific stat or finding (verbatim or closely paraphrased from source)
- "source_name": "${sourceLabel}"
- "source_url": "${sourceUrl}"
- "category": "${category}"
- "verified": true

Also return a theme object wrapping related data points:
{
  "title": "short descriptive title",
  "summary": "2-3 sentence summary of the finding",
  "data_points": [...array of data point objects above...],
  "relevance": [...array from: Carriers, Brokers, Employers, Employees, General...]
}

Source URL: ${sourceUrl}
Source text:
${content}

Return ONLY a JSON array of theme objects (may be empty if no relevant content found). No markdown.`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "[]";
  const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) return [];
  return JSON.parse(match[0]);
}

async function extractCompetitorUpdates(
  content: string,
  competitor: any,
  sourceUrl: string
): Promise<any[]> {
  if (!content.trim()) return [];

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Based ONLY on the content provided below, extract any new or changed information about ${competitor.name}'s product positioning, pricing, features, or partnerships. Do not infer or add anything not present in the source. Return structured JSON.

Current known positioning: "${competitor.positioning?.text || ""}"

For each change found, return a JSON object:
{
  "competitor_id": "${competitor.id}",
  "competitor_name": "${competitor.name}",
  "field": "positioning | key_differentiator | new_feature | partnership | other",
  "proposed_value": {
    "text": "the new information",
    "source_url": "${sourceUrl}",
    "source_name": "${competitor.name} — monitored page"
  },
  "significance": "high | medium | low"
}

Source URL: ${sourceUrl}
Content:
${content}

Return ONLY a JSON array of change objects (may be empty if nothing new). No markdown.`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "[]";
  const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) return [];
  return JSON.parse(match[0]);
}

async function sendNotification(
  sources: SourcesConfig,
  log: JobLog,
  stagingCounts: { trends: number; competitors: number }
): Promise<void> {
  const message = `Weekly Intelligence Draft Ready\n${stagingCounts.trends} trend updates and ${stagingCounts.competitors} competitor changes pending review.\nReview at /admin/trends → Pending Review tab.\nJob ID: ${log.run_id}`;

  if (sources.notification_webhook) {
    try {
      await fetch(sources.notification_webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
        signal: AbortSignal.timeout(10000),
      });
    } catch (err: any) {
      console.error("Notification webhook failed:", err.message);
    }
  }

  console.log("\n📬 NOTIFICATION:", message);
}

async function main(): Promise<void> {
  const runId = `run-${Date.now()}`;
  const startedAt = new Date().toISOString();
  console.log(`[${startedAt}] Starting intelligence job ${runId}`);

  const log: JobLog = {
    run_id: runId,
    started_at: startedAt,
    completed_at: null,
    trends_fetched: 0,
    competitors_processed: 0,
    staging_written: 0,
    errors: [],
    status: "running",
  };

  const sources = readJson<SourcesConfig>(SOURCES_PATH, {
    notification_webhook: "",
    notification_email: "",
    rss_feeds: [],
    trusted_domains: [],
    pdf_domains: [],
  });

  const competitorsData = readJson<{ competitors: any[] }>(COMPETITORS_PATH, { competitors: [] });
  const staging = readJson<StagingData>(STAGING_PATH, { trend_updates: [], competitor_updates: [] });

  const rssParser = new RSSParser();
  const newTrendUpdates: any[] = [];
  const newCompetitorUpdates: any[] = [];

  // ── 1. Fetch RSS feeds ───────────────────────────────────────────────────────
  for (const feed of sources.rss_feeds) {
    if (!isTrustedDomain(feed.url, sources.trusted_domains)) {
      log.errors.push(`Rejected non-trusted feed: ${feed.url}`);
      continue;
    }

    console.log(`  Fetching RSS: ${feed.label}`);
    try {
      const parsed = await rssParser.parseURL(feed.url);
      const items = (parsed.items || []).slice(0, 5); // max 5 recent items per feed

      for (const item of items) {
        const articleUrl = item.link || item.guid || "";
        if (!articleUrl || !isTrustedDomain(articleUrl, sources.trusted_domains)) continue;

        const category = getDomainCategory(articleUrl, sources.trusted_domains);
        const contentText = item.contentSnippet || item.content || item.summary || "";
        if (!contentText || contentText.length < 50) continue;

        try {
          const themes = await extractTrendsFromContent(contentText, articleUrl, feed.label, category);
          for (const theme of themes) {
            if (!theme.title || !theme.data_points?.length) continue;
            newTrendUpdates.push({
              id: `staged-trend-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              type: "trend_update",
              status: "pending",
              fetched_at: new Date().toISOString(),
              source_feed: feed.label,
              category,
              proposed: {
                id: `trend-${Date.now()}`,
                title: theme.title,
                summary: theme.summary,
                data_points: theme.data_points,
                source: feed.label,
                relevance: theme.relevance || ["General"],
              },
            });
            log.trends_fetched++;
          }
        } catch (err: any) {
          log.errors.push(`Claude extract error (${feed.label}): ${err.message}`);
        }
      }
    } catch (err: any) {
      log.errors.push(`RSS fetch error (${feed.label}): ${err.message}`);
    }
  }

  // ── 2. Crawl competitor watch URLs ──────────────────────────────────────────
  for (const competitor of competitorsData.competitors) {
    if (!competitor.watch_urls?.length) continue;
    console.log(`  Crawling competitor: ${competitor.name}`);

    for (const watchUrl of competitor.watch_urls) {
      if (!isTrustedDomain(watchUrl, sources.trusted_domains)) {
        log.errors.push(`Rejected non-trusted competitor URL: ${watchUrl}`);
        continue;
      }

      try {
        const content = await fetchPageContent(watchUrl, sources.pdf_domains);
        if (!content || content.length < 100) continue;

        const updates = await extractCompetitorUpdates(content, competitor, watchUrl);
        for (const update of updates) {
          newCompetitorUpdates.push({
            id: `staged-comp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            type: "competitor_update",
            status: "pending",
            fetched_at: new Date().toISOString(),
            ...update,
          });
        }
        log.competitors_processed++;
      } catch (err: any) {
        log.errors.push(`Crawl error (${competitor.name} — ${watchUrl}): ${err.message}`);
      }
    }
  }

  // ── 3. Write to staging ──────────────────────────────────────────────────────
  staging.trend_updates = [...staging.trend_updates, ...newTrendUpdates];
  staging.competitor_updates = [...staging.competitor_updates, ...newCompetitorUpdates];
  writeJson(STAGING_PATH, staging);
  log.staging_written = newTrendUpdates.length + newCompetitorUpdates.length;

  // ── 4. Send notification ────────────────────────────────────────────────────
  await sendNotification(sources, log, {
    trends: newTrendUpdates.length,
    competitors: newCompetitorUpdates.length,
  });

  // ── 5. Write log ────────────────────────────────────────────────────────────
  log.completed_at = new Date().toISOString();
  log.status = log.errors.length > 0 && log.staging_written === 0 ? "error" : "success";

  const logs = readJson<JobLog[]>(JOB_LOGS_PATH, []);
  logs.unshift(log); // most recent first
  writeJson(JOB_LOGS_PATH, logs.slice(0, 50)); // keep last 50 runs

  // Update last_job_run in competitors.json
  competitorsData.last_job_run = log.completed_at;
  writeJson(COMPETITORS_PATH, competitorsData);

  console.log(`[${log.completed_at}] Job complete. Staged: ${log.staging_written}. Errors: ${log.errors.length}.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal job error:", err);
  process.exit(1);
});
