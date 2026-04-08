import { useQuery } from "@tanstack/react-query";
import type { DriveFile } from "@/components/DriveFileModal";

interface DriveFilesResponse {
  files: DriveFile[];
  configured: boolean;
}

const PASSCODE = "betterfly2025";

export function useDriveFiles() {
  return useQuery<DriveFilesResponse>({
    queryKey: ["/api/drive/files"],
    queryFn: async () => {
      const res = await fetch("/api/drive/files", {
        headers: { "x-passcode": PASSCODE },
      });
      if (!res.ok) throw new Error("Failed to fetch drive files");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function getDriveStreamUrl(fileId: string, download?: boolean): string {
  const base = `/api/drive/files/${fileId}/preview?passcode=${encodeURIComponent(PASSCODE)}`;
  return download ? `${base}&download=true` : base;
}
