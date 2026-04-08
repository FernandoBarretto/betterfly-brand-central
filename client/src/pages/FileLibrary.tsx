import { useState, useMemo, useEffect } from "react";
import {
  Search, FileText, Presentation, Image, Film, Globe, LayoutTemplate,
  Download, ExternalLink, ArrowRight, X, BookOpen, Eye,
  Shield, BarChart2, Target, Users, Building2, TrendingUp, Zap
} from "lucide-react";
import { Link, useLocation } from "wouter";

type FileType = "All" | "PDF" | "Deck" | "One-Pager" | "Social" | "Playbook" | "Guide" | "Report" | "Template";
type Audience = "All" | "Carriers" | "Brokers" | "Employers" | "Employees" | "Internal";

interface FileItem {
  id: string;
  title: string;
  desc: string;
  type: Exclude<FileType, "All">;
  audience: Exclude<Audience, "All">;
  format: string;
  tags: string[];
  action: "download" | "open" | "link";
  href?: string;
  to?: string;
}

const files: FileItem[] = [
  // ── Real downloadable files ────────────────────────────────────────────────
  {
    id: "3pager-us-v2",
    title: "Betterfly 3-Pager (US) v2",
    desc: "The definitive US market overview document. Covers value proposition, product summary, and target audiences in three pages.",
    type: "One-Pager",
    audience: "Brokers",
    format: "PDF",
    tags: ["US Market", "Product Overview", "Print-Ready"],
    action: "download",
    href: "/files/betterfly-3-pager-us-v2.pdf",
  },
  {
    id: "brokers-extended",
    title: "Meet Betterfly — For Brokers (Extended)",
    desc: "Extended broker enablement deck. Covers Betterfly's full product, commission structure, onboarding process, and competitive positioning.",
    type: "Deck",
    audience: "Brokers",
    format: "PDF",
    tags: ["Broker Enablement", "Commission", "Onboarding"],
    action: "download",
    href: "/files/meet-betterfly-for-brokers.pdf",
  },

  {
    id: "accident-insurance",
    title: "Accident Insurance — Product Sheet",
    desc: "Individual Accident insurance product overview. Covers Basic, Preferred, and Premier plans with benefit schedules, optional riders, and composite rate structure. FL-applicable.",
    type: "PDF",
    audience: "Brokers",
    format: "PDF",
    tags: ["Product Sheet", "Accident", "Voluntary Benefits", "Colonial Life"],
    action: "download",
    href: "/files/betterfly-accident-insurance.pdf",
  },
  {
    id: "cancer-insurance",
    title: "Cancer Insurance — Product Sheet",
    desc: "Individual Cancer insurance product overview. Four benefit levels with detailed schedules for treatment, hospital confinement, surgical procedures, and optional riders including Initial Diagnosis.",
    type: "PDF",
    audience: "Brokers",
    format: "PDF",
    tags: ["Product Sheet", "Cancer", "Voluntary Benefits", "Colonial Life"],
    action: "download",
    href: "/files/betterfly-cancer-insurance.pdf",
  },
  {
    id: "critical-illness",
    title: "Critical Illness 1.0 — Product Sheet",
    desc: "Specified Critical Illness insurance with lump-sum benefits for heart attack, stroke, major organ failure, cancer (optional), and more. Includes premium tables by age and tobacco status.",
    type: "PDF",
    audience: "Brokers",
    format: "PDF",
    tags: ["Product Sheet", "Critical Illness", "Voluntary Benefits", "Colonial Life"],
    action: "download",
    href: "/files/betterfly-critical-illness.pdf",
  },
  {
    id: "hospital-indemnity",
    title: "Hospital Indemnity (Medical Bridge) — Product Sheet",
    desc: "Individual Medical Bridge Plan 1. HSA-compliant hospital confinement indemnity with observation room, rehabilitation, and optional Medical Treatment Package. Age-banded rates included.",
    type: "PDF",
    audience: "Brokers",
    format: "PDF",
    tags: ["Product Sheet", "Hospital Indemnity", "HSA", "Voluntary Benefits", "Colonial Life"],
    action: "download",
    href: "/files/betterfly-hospital-indemnity.pdf",
  },
  {
    id: "voluntary-group-term-life",
    title: "Voluntary Group Term Life — Product Sheet",
    desc: "Group term life insurance with guaranteed issue, AD&D options, accelerated death benefit, and portability. Coverage up to $500,000 with five-year age-banded rates.",
    type: "PDF",
    audience: "Brokers",
    format: "PDF",
    tags: ["Product Sheet", "Group Life", "AD&D", "Voluntary Benefits", "Colonial Life"],
    action: "download",
    href: "/files/betterfly-voluntary-group-term-life.pdf",
  },

  // ── In-app resources (link to page) ──────────────────────────────────────
  {
    id: "battle-cards",
    title: "Sales Battle Cards",
    desc: "Objection handling, weaknesses, and closing questions for 6 key competitors — YuLife, Beam, Nayya, Selerix, Nava, and Aetna.",
    type: "Guide",
    audience: "Internal",
    format: "Interactive",
    tags: ["Competitive", "YuLife", "Beam", "Nayya", "Sales Prep"],
    action: "open",
    to: "/market-intelligence/battle-cards",
  },
  {
    id: "campaign-analysis",
    title: "Competitive Campaign Analysis",
    desc: "7-dimension creative and messaging analysis for 6 competitors. Includes comparison matrix and whitespace opportunities.",
    type: "Report",
    audience: "Internal",
    format: "Interactive",
    tags: ["Competitive", "Campaign", "Creative", "Positioning"],
    action: "open",
    to: "/market-intelligence/trends",
  },
  {
    id: "brand-guidelines",
    title: "Brand Guidelines",
    desc: "The full Betterfly brand rulebook: logo usage, colour palette, typography, spacing, and do/don't examples.",
    type: "Guide",
    audience: "Internal",
    format: "Interactive",
    tags: ["Brand", "Logo", "Colour", "Typography"],
    action: "open",
    to: "/brand-guidelines",
  },
  {
    id: "visual-identity",
    title: "Visual Identity System",
    desc: "Colour swatches, font specimens, iconography, and photography direction for the Betterfly visual system.",
    type: "Guide",
    audience: "Internal",
    format: "Interactive",
    tags: ["Brand", "Colour", "Photography", "Icons"],
    action: "open",
    to: "/brand-guidelines/visual-identity",
  },
  {
    id: "brand-voice",
    title: "Brand Voice & Messaging Guide",
    desc: "Tone of voice, messaging hierarchy, core proof points, and audience-specific language guidance.",
    type: "Guide",
    audience: "Internal",
    format: "Interactive",
    tags: ["Messaging", "Tone", "Copy", "Language"],
    action: "open",
    to: "/brand-guidelines/tone",
  },
  {
    id: "carrier-overview",
    title: "Carrier Audience Playbook",
    desc: "Full sales playbook for carrier conversations: pain points, objections, partnership angles, and talking points.",
    type: "Playbook",
    audience: "Carriers",
    format: "Interactive",
    tags: ["Carriers", "Partnership", "Distribution"],
    action: "open",
    to: "/playbooks/carriers/overview",
  },
  {
    id: "broker-overview",
    title: "Broker Audience Playbook",
    desc: "Broker-specific playbook covering SMB pitch frameworks, objection handling, and comp structure talking points.",
    type: "Playbook",
    audience: "Brokers",
    format: "Interactive",
    tags: ["Brokers", "SMB", "Commission", "Pitch"],
    action: "open",
    to: "/playbooks/brokers/overview",
  },

  // ── Templates ─────────────────────────────────────────────────────────────
  {
    id: "tmpl-linkedin-smb",
    title: "LinkedIn Carousel — SMB Benefits Overview",
    desc: "6-slide carousel explaining Betterfly's core value prop for HR decision-makers.",
    type: "Template",
    audience: "Employers",
    format: "Social / Figma",
    tags: ["LinkedIn", "Social", "Carousel"],
    action: "link",
    to: "/templates",
  },
  {
    id: "tmpl-broker-onepager",
    title: "Broker Enablement One-Pager",
    desc: "Editable one-page template for broker reps to share with SMB prospects.",
    type: "Template",
    audience: "Brokers",
    format: "PDF / Editable",
    tags: ["Broker", "Print", "One-Pager"],
    action: "link",
    to: "/templates",
  },
  {
    id: "tmpl-carrier-deck",
    title: "Carrier Partnership Pitch Deck",
    desc: "Editable 14-slide deck covering distribution opportunity, data, and co-brand model.",
    type: "Template",
    audience: "Carriers",
    format: "PPTX / Keynote",
    tags: ["Carrier", "Pitch", "Partnership"],
    action: "link",
    to: "/templates",
  },
  {
    id: "tmpl-broker-demo",
    title: "Broker Demo Deck",
    desc: "Editable 8-slide walkthrough of the platform for broker discovery meetings.",
    type: "Template",
    audience: "Brokers",
    format: "PPTX",
    tags: ["Broker", "Demo", "Pitch"],
    action: "link",
    to: "/templates",
  },
  {
    id: "tmpl-employee-welcome",
    title: "Employee Welcome Sheet",
    desc: "Editable onboarding guide: what Betterfly is and how to get started.",
    type: "Template",
    audience: "Employees",
    format: "PDF / Editable",
    tags: ["Employees", "Onboarding", "Print"],
    action: "link",
    to: "/templates",
  },
  {
    id: "tmpl-ig-betterflies",
    title: "Instagram Story — Betterflies Launch",
    desc: "Editable story template announcing Betterflies rewards program.",
    type: "Template",
    audience: "Employees",
    format: "Instagram / Figma",
    tags: ["Social", "Betterflies", "Instagram"],
    action: "link",
    to: "/templates",
  },
  {
    id: "tmpl-email-digest",
    title: "Email Header — Monthly Digest",
    desc: "Branded header for monthly HR digest emails. Clean and minimal.",
    type: "Template",
    audience: "Employers",
    format: "HTML / PNG",
    tags: ["Email", "Header", "Monthly"],
    action: "link",
    to: "/templates",
  },
  {
    id: "tmpl-enrollment-lp",
    title: "Enrollment Campaign Landing Page",
    desc: "Clean landing page template for company-specific open enrollment campaigns.",
    type: "Template",
    audience: "Employees",
    format: "HTML / Figma",
    tags: ["Landing Page", "Enrollment", "HTML"],
    action: "link",
    to: "/templates",
  },
  {
    id: "tmpl-webinar-reg",
    title: "Webinar Registration Page",
    desc: "Registration page for Betterfly-hosted broker education webinars.",
    type: "Template",
    audience: "Brokers",
    format: "HTML / Figma",
    tags: ["Webinar", "Registration", "Brokers"],
    action: "link",
    to: "/templates",
  },

];

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  Deck: Presentation,
  "One-Pager": FileText,
  Social: Image,
  Playbook: Target,
  Guide: BookOpen,
  Report: BarChart2,
  "Case Study": TrendingUp,
  Template: LayoutTemplate,
  Webinar: Film,
  Interactive: Globe,
};

const typeColors: Record<string, { bg: string; text: string; dot: string }> = {
  PDF:          { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  Deck:         { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  "One-Pager":  { bg: "#fef9c3", text: "#854d0e", dot: "#eab308" },
  Social:       { bg: "#fae8ff", text: "#7e22ce", dot: "#a855f7" },
  Playbook:     { bg: "#dcfce7", text: "#166534", dot: "#19f578" },
  Guide:        { bg: "#042914", text: "#19f578", dot: "#19f578" },
  Report:       { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  "Case Study": { bg: "#fff7ed", text: "#9a3412", dot: "#f97316" },
  Template:     { bg: "#f1f5f9", text: "#334155", dot: "#64748b" },
  Webinar:      { bg: "#eff6ff", text: "#1d4ed8", dot: "#60a5fa" },
};

const audienceIcons: Record<string, typeof FileText> = {
  Carriers: Building2,
  Brokers: TrendingUp,
  Employers: Zap,
  Employees: Users,
  Internal: Shield,
};

const fileTypes: FileType[] = ["All", "PDF", "Deck", "One-Pager", "Playbook", "Guide", "Report", "Template", "Social"];
const audiences: Audience[] = ["All", "Carriers", "Brokers", "Employers", "Employees", "Internal"];

// ── PDF Preview Modal ──────────────────────────────────────────────────────
function PreviewModal({ item, onClose }: { item: FileItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [item, onClose]);

  if (!item || !item.href) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
      data-testid="preview-modal"
    >
      {/* Modal chrome */}
      <div
        className="flex items-center gap-4 px-6 py-4 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-0.5">Preview</p>
          <p className="text-white font-bold text-sm truncate">{item.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={item.href}
            download
            className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all"
            style={{ backgroundColor: "#19f578", color: "var(--color-interactive-primary)" }}
            data-testid="modal-download"
          >
            <Download size={13} /> Download PDF
          </a>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            data-testid="modal-close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* PDF iframe */}
      <div
        className="flex-1 mx-6 mb-6 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={item.href}
          title={item.title}
          className="w-full h-full border-0"
          data-testid="preview-iframe"
        />
      </div>
    </div>
  );
}

// ── File Card ──────────────────────────────────────────────────────────────
function FileCard({
  item,
  onPreview,
}: {
  item: FileItem;
  onPreview: (item: FileItem) => void;
}) {
  const [, navigate] = useLocation();
  const TypeIcon = typeIcons[item.type] || FileText;
  const AudienceIcon = audienceIcons[item.audience] || Users;
  const colors = typeColors[item.type] || { bg: "#f7f7f5", text: "#042914", dot: "#042914" };

  const isDownload = item.action === "download";
  const isNavigable = item.action === "open" || item.action === "link";

  function handleCardClick() {
    if (isDownload) onPreview(item);
    else if (isNavigable && item.to) {
      if (item.to.endsWith('.html')) window.open(item.to, '_blank');
      else navigate(item.to);
    }
  }

  const cardContent = (
    <div className="p-5 flex flex-col gap-3.5 h-full">
      {/* Top row: type badge + format */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
          {item.type}
        </span>
        <span className="text-[10px] font-mono text-neutral-300 shrink-0 truncate max-w-[100px]">{item.format}</span>
      </div>

      {/* Icon + title */}
      <div className="flex gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: `${colors.dot}15` }}
        >
          <TypeIcon size={18} style={{ color: colors.dot }} />
        </div>
        <div className="min-w-0">
          <h3 className="text-green-950 font-bold text-sm leading-snug mb-1.5">{item.title}</h3>
          <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">{item.desc}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: audience + action(s) */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-200">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-400">
          <AudienceIcon size={11} />
          {item.audience}
        </span>

        {/* Action buttons — stop propagation so card click doesn't double-fire */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {isDownload && item.href && (
            <>
              <button
                onClick={() => onPreview(item)}
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-300 text-green-950 transition-all"
                data-testid={`preview-${item.id}`}
              >
                <Eye size={11} /> Preview
              </button>
              <a
                href={item.href}
                download
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                style={{ backgroundColor: "#19f578", color: "var(--color-interactive-primary)" }}
                data-testid={`download-${item.id}`}
              >
                <Download size={11} /> Download
              </a>
            </>
          )}
          {item.action === "open" && item.to && (
            <Link
              href={item.to}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
              style={{ backgroundColor: "var(--color-interactive-primary)", color: "var(--color-interactive-primary-cta)" }}
              data-testid={`open-${item.id}`}
            >
              <ExternalLink size={11} /> Open
            </Link>
          )}
          {item.action === "link" && item.to && (
            <a
              href={item.to}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-300 text-green-950 transition-all"
              data-testid={`view-${item.id}`}
              onClick={e => e.stopPropagation()}
            >
              <ArrowRight size={11} /> View
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      role={isDownload || isNavigable ? "button" : undefined}
      tabIndex={isDownload || isNavigable ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
      className={`bg-white border border-neutral-200 rounded-2xl flex flex-col transition-all group ${
        isDownload || isNavigable
          ? "cursor-pointer hover:shadow-lg hover:border-neutral-300 hover:-translate-y-0.5"
          : ""
      }`}
      data-testid={`file-card-${item.id}`}
    >
      {cardContent}
    </div>
  );
}

const DOWNLOAD_ITEMS = files.filter((f) => f.action === "download");

export function FileLibrary() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FileType>("All");
  const [audienceFilter, setAudienceFilter] = useState<Audience>("All");
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return files.filter((f) => {
      const matchType = typeFilter === "All" || f.type === typeFilter;
      const matchAudience = audienceFilter === "All" || f.audience === audienceFilter;
      const matchSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.desc.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q)) ||
        f.format.toLowerCase().includes(q) ||
        f.audience.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q);
      return matchType && matchAudience && matchSearch;
    });
  }, [search, typeFilter, audienceFilter]);

  const hasActiveFilters = typeFilter !== "All" || audienceFilter !== "All";

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Hero */}
      <div className="relative overflow-hidden bg-green-950 px-16 pt-12 pb-10">
        <div className="absolute top-[-60px] right-[-40px] w-96 h-96 bg-green-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#f7f7f5] to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <p className="text-green-400 text-[10px] font-bold uppercase tracking-widest mb-4">Resource Library</p>
          <h1
            className="text-white text-5xl font-black leading-tight mb-3"
            style={{ fontFamily: "'Obviously Narrow', sans-serif" }}
          >
            Every file.<br />
            <span style={{ color: "var(--color-interactive-primary-cta)" }}>One place.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            All approved, ready-to-download assets including PDFs, decks, and reports. {files.length} resources searchable in one place.
          </p>
        </div>

        {/* Quick-access download pills */}
        {DOWNLOAD_ITEMS.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-3 mt-8">
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest w-full mb-1">Direct downloads</p>
            {DOWNLOAD_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                download
                className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all bg-white/8 text-white hover:bg-green-400 hover:text-green-950 border border-white/10"
                data-testid={`quick-download-${item.id}`}
              >
                <Download size={12} />
                {item.title}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Search + filters bar */}
      <div className="bg-white border-b border-neutral-200 px-16 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-300" />
            <input
              type="text"
              placeholder="Search files, tags, audiences…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              data-testid="file-search"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Type filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {fileTypes.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  typeFilter === t
                    ? "bg-green-950 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-300"
                }`}
                data-testid={`type-filter-${t.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Audience filter */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="flex gap-1">
              {audiences.filter(a => a !== "All").map((a) => (
                <button
                  key={a}
                  onClick={() => setAudienceFilter(audienceFilter === a ? "All" : a)}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                    audienceFilter === a
                      ? "bg-green-400 text-green-950"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-300"
                  }`}
                  data-testid={`audience-filter-${a.toLowerCase()}`}
                >
                  {a}
                </button>
              ))}
              {audienceFilter !== "All" && (
                <button
                  onClick={() => setAudienceFilter("All")}
                  className="text-[10px] text-neutral-400 hover:text-black px-2 py-1.5"
                >
                  <X size={11} />
                </button>
              )}
            </div>
            <span className="text-neutral-300 text-xs pl-2 border-l border-neutral-200">
              {filtered.length} of {files.length}
            </span>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="px-16 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-2xl font-black text-green-950/30 mb-2">Nothing found</p>
            <p className="text-neutral-300 text-sm mb-6">Try a different search term or clear your filters</p>
            <button
              onClick={() => { setSearch(""); setTypeFilter("All"); setAudienceFilter("All"); }}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-green-950 text-white hover:bg-green-950/80 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Download files first — pinned section */}
            {(typeFilter === "All" || ["PDF", "Deck", "One-Pager"].includes(typeFilter)) &&
              audienceFilter === "All" &&
              !search &&
              DOWNLOAD_ITEMS.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-400">
                    <Download size={12} /> Available to Download
                  </span>
                  <div className="flex-1 h-px bg-green-400/20" />
                </div>
                <div className="grid grid-cols-3 gap-5">
                  {DOWNLOAD_ITEMS.map((item) => (
                    <FileCard key={item.id} item={item} onPreview={setPreviewItem} />
                  ))}
                </div>
              </div>
            )}

            {/* All other results */}
            <div className="mb-5">
              {(typeFilter !== "All" || audienceFilter !== "All" || search || DOWNLOAD_ITEMS.length === 0) ? null : (
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">All Resources</span>
                  <div className="flex-1 h-px bg-black/8" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-5">
              {filtered
                .filter((f) =>
                  !(
                    typeFilter === "All" &&
                    audienceFilter === "All" &&
                    !search &&
                    f.action === "download"
                  )
                )
                .map((item) => (
                  <FileCard key={item.id} item={item} onPreview={setPreviewItem} />
                ))}
            </div>
          </>
        )}
      </div>

      <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
}
