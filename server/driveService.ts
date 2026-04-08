import { google, type drive_v3 } from "googleapis";
import { Readable } from "stream";

export type DriveFileCategory =
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

export interface DriveFileInfo {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  downloadUrl: string;
  category: DriveFileCategory;
  createdTime: string;
  modifiedTime: string;
  size: string;
  thumbnailLink?: string;
}

const FOLDER_ID = "13bDFiXXANhSg7FFuhJptn5p_Mek0pTR8";

function getServiceAccountClient(): drive_v3.Drive | null {
  const saJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!saJson) return null;
  try {
    const credentials = JSON.parse(saJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    return google.drive({ version: "v3", auth });
  } catch (e) {
    console.error("Failed to initialize Google Drive service account client:", e);
    return null;
  }
}

function inferCategory(name: string, mimeType: string): DriveFileCategory {
  const lower = name.toLowerCase();

  if (
    mimeType.startsWith("video/") ||
    lower.includes("webinar") ||
    lower.includes("recording")
  ) {
    if (lower.includes("webinar") || lower.includes("recording") || lower.includes("session")) {
      return "webinar";
    }
    return "video";
  }

  if (lower.includes("competitive") || lower.includes("competitor")) return "competitive-analysis";
  if (lower.includes("case study") || lower.includes("case-study")) return "case-study";
  if (lower.includes("research") || lower.includes("report")) return "research";
  if (lower.includes("blog") || lower.includes("article")) return "blog";
  if (lower.includes("one-pager") || lower.includes("one pager") || lower.includes("onepager")) return "one-pager";

  if (
    mimeType === "application/vnd.google-apps.presentation" ||
    mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    lower.includes("pitch") ||
    lower.includes("deck")
  ) {
    return "presentation";
  }

  if (lower.includes("template")) return "template";
  return "other";
}

interface DriveFileRaw {
  id?: string;
  name?: string;
  mimeType?: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  thumbnailLink?: string;
}

async function listFilesRecursiveSA(
  drive: drive_v3.Drive,
  folderId: string
): Promise<drive_v3.Schema$File[]> {
  const allFiles: drive_v3.Schema$File[] = [];
  let pageToken: string | undefined;
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType, webViewLink, createdTime, modifiedTime, size, thumbnailLink)",
      pageSize: 100,
      pageToken,
    });
    const files = res.data.files || [];
    for (const f of files) {
      if (f.mimeType === "application/vnd.google-apps.folder") {
        const sub = await listFilesRecursiveSA(drive, f.id!);
        allFiles.push(...sub);
      } else {
        allFiles.push(f);
      }
    }
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);
  return allFiles;
}

function mapFiles(rawFiles: DriveFileRaw[]): DriveFileInfo[] {
  return rawFiles.map((f) => ({
    id: f.id!,
    name: f.name || "Untitled",
    mimeType: f.mimeType || "application/octet-stream",
    webViewLink: f.webViewLink || "",
    downloadUrl: `/api/drive/files/${f.id}/preview`,
    category: inferCategory(f.name || "", f.mimeType || ""),
    createdTime: f.createdTime || new Date().toISOString(),
    modifiedTime: f.modifiedTime || new Date().toISOString(),
    size: f.size || "0",
    thumbnailLink: f.thumbnailLink,
  }));
}

export async function listDriveFiles(): Promise<{ files: DriveFileInfo[]; configured: boolean }> {
  const saClient = getServiceAccountClient();
  if (!saClient) {
    console.warn("Google Drive not configured — set GOOGLE_SERVICE_ACCOUNT_JSON env var");
    return { files: [], configured: false };
  }

  try {
    const raw = await listFilesRecursiveSA(saClient, FOLDER_ID);
    return { files: mapFiles(raw as DriveFileRaw[]), configured: true };
  } catch (e) {
    console.error("Service account Drive listing failed:", e);
    return { files: [], configured: false };
  }
}

export async function streamDriveFile(fileId: string): Promise<{ stream: Readable; mimeType: string; name: string } | null> {
  const saClient = getServiceAccountClient();
  if (!saClient) return null;

  try {
    const meta = await saClient.files.get({ fileId, fields: "name, mimeType" });
    const mimeType = meta.data.mimeType || "application/octet-stream";
    const name = meta.data.name || "file";

    if (mimeType.startsWith("application/vnd.google-apps.")) {
      let exportMime = "application/pdf";
      if (mimeType === "application/vnd.google-apps.spreadsheet")
        exportMime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      else if (mimeType === "application/vnd.google-apps.presentation")
        exportMime = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      const res = await saClient.files.export({ fileId, mimeType: exportMime }, { responseType: "stream" });
      const stream = res.data instanceof Readable ? res.data : Readable.from(res.data);
      return { stream, mimeType: exportMime, name };
    }

    const res = await saClient.files.get({ fileId, alt: "media" }, { responseType: "stream" });
    const stream = res.data instanceof Readable ? res.data : Readable.from(res.data);
    return { stream, mimeType, name };
  } catch (e) {
    console.error("Service account stream failed:", e);
    return null;
  }
}

export async function isFileInFolder(fileId: string): Promise<boolean> {
  const saClient = getServiceAccountClient();
  if (!saClient) return false;

  try {
    const res = await saClient.files.list({
      q: `'${FOLDER_ID}' in parents and id = '${fileId}' and trashed = false`,
      fields: "files(id)",
    });
    return (res.data.files || []).length > 0;
  } catch {
    return false;
  }
}
