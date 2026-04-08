import { FolderOpen } from "lucide-react";

export function DriveSetupBanner() {
  return (
    <div className="mx-16 mt-6 bg-yellow-400/20 border border-[#e8fb10] rounded-xl p-5 flex items-start gap-4">
      <FolderOpen size={20} className="text-green-950 shrink-0 mt-0.5" />
      <div>
        <p className="text-green-950 font-semibold text-sm mb-1">
          No files uploaded yet
        </p>
        <p className="text-green-950/70 text-xs leading-relaxed">
          Add files to the{" "}
          <code className="bg-green-950/10 px-1.5 py-0.5 rounded text-xs font-mono">content/</code>{" "}
          folder in this project. PDFs, PowerPoints, videos, images, and Word docs are all supported —
          they'll appear here automatically.
        </p>
      </div>
    </div>
  );
}
