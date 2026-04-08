import fs from "fs";
import path from "path";
import mime from "mime-types";

export type FileCategory =
  | "video"
  | "one-pager"
  | "blog"
  | "template"
  | "presentation"
  | "competitive-analysis"
  | "case-study"
  | "research"
  | "webinar"
  | "other";

export interface ContentFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  downloadUrl: string;
  category: FileCategory;
  createdTime: string;
  modifiedTime: string;
  size: string;
  thumbnailLink?: string;
}

const CONTENT_DIR = path.resolve(process.cwd(), "content");

const IGNORED = new Set(["README.md", ".gitkeep", ".DS_Store"]);
const ALLOWED_EXTS = new Set([
  ".pdf", ".pptx", ".ppt", ".docx", ".doc",
  ".xlsx", ".xls", ".csv",
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp",
  ".mp4", ".mov", ".webm",
]);

function toFileId(relPath: string): string {
  return Buffer.from(relPath).toString("base64url");
}

function fromFileId(id: string): string | null {
  try {
    const rel = Buffer.from(id, "base64url").toString("utf8");
    const abs = path.resolve(CONTENT_DIR, rel);
    if (!abs.startsWith(CONTENT_DIR + path.sep) && abs !== CONTENT_DIR) return null;
    return abs;
  } catch {
    return null;
  }
}

function inferCategory(name: string, mimeType: string): FileCategory {
  const lower = name.toLowerCase();
  if (mimeType.startsWith("video/") || lower.includes("webinar") || lower.includes("recording")) {
    if (lower.includes("webinar") || lower.includes("recording") || lower.includes("session")) return "webinar";
    return "video";
  }
  if (lower.includes("competitive") || lower.includes("competitor")) return "competitive-analysis";
  if (lower.includes("case study") || lower.includes("case-study")) return "case-study";
  if (lower.includes("research") || lower.includes("report")) return "research";
  if (lower.includes("blog") || lower.includes("article")) return "blog";
  if (lower.includes("one-pager") || lower.includes("one pager") || lower.includes("onepager")) return "one-pager";
  if (
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    lower.includes("pitch") || lower.includes("deck")
  ) return "presentation";
  if (lower.includes("template")) return "template";
  return "other";
}

function scanDir(dir: string, base: string): ContentFile[] {
  const results: ContentFile[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED.has(entry.name) || entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(base, fullPath);

    if (entry.isDirectory()) {
      results.push(...scanDir(fullPath, base));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXTS.has(ext)) continue;

      const stat = fs.statSync(fullPath);
      const mimeType = (mime.lookup(entry.name) || "application/octet-stream").toString();
      const id = toFileId(relPath);

      results.push({
        id,
        name: path.basename(entry.name, ext).replace(/[-_]/g, " "),
        mimeType,
        webViewLink: `/api/drive/files/${id}/preview`,
        downloadUrl: `/api/drive/files/${id}/preview`,
        category: inferCategory(entry.name, mimeType),
        createdTime: stat.birthtime.toISOString(),
        modifiedTime: stat.mtime.toISOString(),
        size: String(stat.size),
      });
    }
  }
  return results;
}

export function listLocalFiles(): { files: ContentFile[]; configured: boolean } {
  const files = scanDir(CONTENT_DIR, CONTENT_DIR);
  return { files, configured: true };
}

export function resolveFileId(id: string): string | null {
  const abs = fromFileId(id);
  if (!abs || !fs.existsSync(abs)) return null;
  return abs;
}
