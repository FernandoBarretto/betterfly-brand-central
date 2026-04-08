import { useState } from "react";
import { Download, Eye, Search, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DriveFileModal, type DriveFile } from "@/components/DriveFileModal";
import { DriveSetupBanner } from "@/components/DriveSetupBanner";
import { useDriveFiles, getDriveStreamUrl } from "@/hooks/useDriveFiles";

type Format = "All" | "Social" | "One-Pager" | "Pitch Deck" | "Landing Page" | "Event Invite" | "Email Header" | "Drive File";

interface TemplateItem {
  title: string;
  format: Exclude<Format, "All">;
  audience: string;
  desc: string;
  color: string;
  tag: string;
  driveFile?: DriveFile;
}

const hardcodedTemplates: TemplateItem[] = [
  { title: "LinkedIn Carousel — SMB Benefits Overview", format: "Social", audience: "Employers", desc: "6-slide carousel explaining Betterfly's core value prop for HR decision-makers.", color: "bg-green-950", tag: "LinkedIn" },
  { title: "Instagram Story — Betterflies Launch", format: "Social", audience: "Employees", desc: "Animated story template announcing Betterflies rewards program.", color: "bg-green-400", tag: "Instagram" },
  { title: "LinkedIn Post — Prevention Stats", format: "Social", audience: "Carriers", desc: "Single-image post with prevention-first messaging and engagement hook.", color: "bg-green-950", tag: "LinkedIn" },
  { title: "Broker Enablement One-Pager", format: "One-Pager", audience: "Brokers", desc: "One-page overview for broker reps to share with SMB prospects.", color: "bg-yellow-400", tag: "PDF" },
  { title: "Employer Benefits Overview", format: "One-Pager", audience: "Employers", desc: "HR-facing summary of Betterfly's employee wellbeing platform.", color: "bg-neutral-100", tag: "PDF" },
  { title: "Employee Welcome Sheet", format: "One-Pager", audience: "Employees", desc: "Printable onboarding guide: what Betterfly is and how to get started.", color: "bg-white", tag: "Print / PDF" },
  { title: "Carrier Partnership Pitch Deck", format: "Pitch Deck", audience: "Carriers", desc: "14-slide deck covering distribution opportunity, data, and co-brand model.", color: "bg-green-950", tag: "PPTX / Keynote" },
  { title: "Broker Demo Deck", format: "Pitch Deck", audience: "Brokers", desc: "8-slide walkthrough of the platform for broker discovery meetings.", color: "bg-green-400", tag: "PPTX" },
  { title: "Enrollment Campaign Landing Page", format: "Landing Page", audience: "Employees", desc: "Clean landing page template for company-specific open enrollment campaigns.", color: "bg-green-950", tag: "HTML / Figma" },
  { title: "Webinar Registration Page", format: "Landing Page", audience: "Brokers", desc: "Registration page for Betterfly-hosted broker education webinars.", color: "bg-yellow-400", tag: "HTML / Figma" },
  { title: "Benefits Fair Event Invite", format: "Event Invite", audience: "Employees", desc: "Email + printed invite for employer benefits fair featuring Betterfly.", color: "bg-green-400", tag: "Email / Print" },
  { title: "Webinar Invite — Broker Edition", format: "Event Invite", audience: "Brokers", desc: "Email invite template for quarterly broker education webinar series.", color: "bg-green-950", tag: "Email" },
  { title: "Email Header — Monthly Digest", format: "Email Header", audience: "Employers", desc: "Branded header for monthly HR digest emails. Clean and minimal.", color: "bg-neutral-100", tag: "HTML / PNG" },
  { title: "Email Header — Employee Nudge", format: "Email Header", audience: "Employees", desc: "Warm, friendly header for benefit enrollment reminder emails.", color: "bg-green-400", tag: "HTML / PNG" },
];

const colorCycle = ["bg-green-950", "bg-green-400", "bg-yellow-400", "bg-neutral-100"];

function mimeToTag(mimeType: string): string {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.includes("presentation")) return "PPTX";
  if (mimeType.includes("document") || mimeType === "application/vnd.google-apps.document") return "Google Doc";
  if (mimeType.includes("spreadsheet")) return "Spreadsheet";
  return mimeType.split("/").pop()?.toUpperCase() || "File";
}

function mapDriveCategoryToFormat(category: string): Exclude<Format, "All"> {
  switch (category) {
    case "one-pager": return "One-Pager";
    case "presentation": return "Pitch Deck";
    default: return "Drive File";
  }
}

function driveToTemplate(file: DriveFile, idx: number): TemplateItem {
  return {
    title: file.name.replace(/\.[^.]+$/, ""),
    format: mapDriveCategoryToFormat(file.category),
    audience: "All",
    desc: `From Google Drive — ${mimeToTag(file.mimeType)} file`,
    color: colorCycle[idx % colorCycle.length],
    tag: mimeToTag(file.mimeType),
    driveFile: file,
  };
}

function PreviewCard({ t, onPreview }: { t: TemplateItem; onPreview: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="border border-neutral-200 rounded-2xl overflow-hidden group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`${t.color} h-40 relative flex items-center justify-center transition-all`}>
        <div className={`text-center transition-all ${hovered ? "opacity-100" : "opacity-0"} absolute inset-0 bg-black/40 flex items-center justify-center gap-3`}>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="flex items-center gap-2 bg-white text-green-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-400 transition-colors"
          >
            <Eye size={14} /> Preview
          </button>
          {t.driveFile ? (
            <a
              href={getDriveStreamUrl(t.driveFile.id, true)}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 bg-green-400 text-green-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <Download size={14} /> Download
            </a>
          ) : (
            <button className="flex items-center gap-2 bg-green-400 text-green-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
              <Download size={14} /> Download
            </button>
          )}
        </div>
        <div className="text-center px-4">
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${t.color === "bg-white" || t.color === "bg-neutral-100" || t.color === "bg-yellow-400" ? "text-green-950/40" : "text-white/40"}`}>{t.format}</p>
          <p className={`text-sm font-bold ${t.color === "bg-white" || t.color === "bg-neutral-100" || t.color === "bg-yellow-400" ? "text-green-950" : "text-white"}`}>{t.title}</p>
        </div>
      </div>
      <div className="bg-white p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-neutral-100 text-green-950 text-xs font-semibold px-2.5 py-1 rounded-full">{t.format}</span>
          <span className="text-neutral-300 text-xs font-mono">{t.tag}</span>
        </div>
        <h3 className="text-green-950 font-semibold text-sm mb-1 leading-snug">{t.title}</h3>
        <p className="text-neutral-500 text-xs leading-relaxed">{t.desc}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">{t.audience}</span>
        </div>
      </div>
    </div>
  );
}

export function Templates() {
  const [filter, setFilter] = useState<Format>("All");
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);

  const { data: driveData, isLoading } = useDriveFiles();

  const driveTemplates: TemplateItem[] = (driveData?.files || [])
    .filter((f) => ["one-pager", "template", "presentation"].includes(f.category))
    .map((f, i) => driveToTemplate(f, i));

  const allTemplates = driveTemplates.length > 0 ? [...driveTemplates, ...hardcodedTemplates] : hardcodedTemplates;

  const formats: Format[] = ["All", "Social", "One-Pager", "Pitch Deck", "Landing Page", "Event Invite", "Email Header"];
  if (driveTemplates.length > 0 && driveTemplates.some(t => t.format === "Drive File")) {
    formats.push("Drive File");
  }

  const filtered = allTemplates.filter(t => {
    const matchFormat = filter === "All" || t.format === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.audience.toLowerCase().includes(search.toLowerCase());
    return matchFormat && matchSearch;
  });

  return (
    <div className="min-h-screen">
      <PageHeader
        eyebrow="📁 Templates Library"
        title="Ready-to-use templates"
        subtitle="Editable source files and formats for creating new materials. Browse, preview, and download approved templates for every format and audience."
      />

      {driveData && !driveData.configured && <DriveSetupBanner />}

      <div className="px-16 py-8 bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-56"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {formats.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${filter === f ? "bg-green-950 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-300"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-neutral-300 text-sm ml-auto">
            {isLoading && <Loader2 size={14} className="inline animate-spin mr-1" />}
            {filtered.length} templates
          </span>
        </div>
      </div>

      <div className="px-16 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-xl font-semibold mb-2">No templates found</p>
            <p className="text-sm">Try a different filter or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {filtered.map((t, i) => (
              <PreviewCard
                key={i}
                t={t}
                onPreview={() => t.driveFile ? setPreviewFile(t.driveFile) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <DriveFileModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}
