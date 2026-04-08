import { X, Download, ExternalLink, FileText, Film, Presentation } from "lucide-react";
import { getDriveStreamUrl } from "@/hooks/useDriveFiles";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  downloadUrl: string;
  category: string;
  createdTime: string;
  modifiedTime: string;
  size: string;
  thumbnailLink?: string;
}

interface DriveFileModalProps {
  file: DriveFile | null;
  onClose: () => void;
}

function getPreviewContent(file: DriveFile) {
  const mime = file.mimeType;

  const streamUrl = getDriveStreamUrl(file.id);

  if (mime === "application/pdf") {
    return (
      <iframe
        src={streamUrl}
        className="w-full h-full rounded-lg"
        title={file.name}
      />
    );
  }

  if (mime.startsWith("video/")) {
    return (
      <video
        src={streamUrl}
        controls
        className="w-full max-h-[70vh] rounded-lg bg-black"
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (
    mime === "application/vnd.google-apps.document" ||
    mime === "application/vnd.google-apps.spreadsheet" ||
    mime === "application/vnd.google-apps.presentation"
  ) {
    const proxyUrl = `${window.location.origin}${streamUrl}`;
    return (
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(proxyUrl)}&embedded=true`}
        className="w-full h-full rounded-lg"
        title={file.name}
      />
    );
  }

  if (mime.startsWith("image/")) {
    return (
      <img
        src={streamUrl}
        alt={file.name}
        className="max-w-full max-h-[70vh] rounded-lg object-contain mx-auto"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <FileText size={48} className="text-neutral-200" />
      <p className="text-neutral-500 text-sm">Preview not available for this file type</p>
      <a
        href={file.webViewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-green-950 font-semibold text-sm hover:text-green-400 transition-colors"
      >
        <ExternalLink size={14} /> Open in Google Drive
      </a>
    </div>
  );
}

function getFileIcon(mime: string) {
  if (mime.startsWith("video/")) return <Film size={16} className="text-blue-500" />;
  if (
    mime.includes("presentation") ||
    mime === "application/vnd.google-apps.presentation"
  )
    return <Presentation size={16} className="text-orange-500" />;
  return <FileText size={16} className="text-green-950" />;
}

export function DriveFileModal({ file, onClose }: DriveFileModalProps) {
  if (!file) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-3 min-w-0">
            {getFileIcon(file.mimeType)}
            <h3 className="text-green-950 font-semibold text-sm truncate">
              {file.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={getDriveStreamUrl(file.id, true)}
              className="flex items-center gap-2 bg-green-400 text-green-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <Download size={14} /> Download
            </a>
            <a
              href={file.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-neutral-100 text-green-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-neutral-300 transition-colors"
            >
              <ExternalLink size={14} /> Open in Drive
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <X size={18} className="text-neutral-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 overflow-auto bg-neutral-100">
          {getPreviewContent(file)}
        </div>
      </div>
    </div>
  );
}
