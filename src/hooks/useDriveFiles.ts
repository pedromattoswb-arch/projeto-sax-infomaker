import { useState, useCallback } from "react";

export interface DriveFolder {
  id: string;
  name: string;
  type: "folder";
}

export interface DriveFile {
  id: string;
  name: string;
  type: "pdf" | "audio" | "image" | "other";
  mimeType: string;
  size: number | null;
  viewUrl: string | null;
  downloadUrl: string;
  streamUrl: string | null;
  thumbnailUrl: string | null;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

interface DriveResponse {
  folderId: string;
  isRoot: boolean;
  folders: DriveFolder[];
  files: DriveFile[];
}

const EDGE_FUNCTION_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/list-drive-files`;

export function useDriveFiles() {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: "root", name: "Acervo" },
  ]);
  const [isRoot, setIsRoot] = useState(true);

  const fetchFolder = useCallback(async (folderId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = folderId
        ? `${EDGE_FUNCTION_URL}?folderId=${folderId}`
        : EDGE_FUNCTION_URL;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao carregar arquivos");
      const data: DriveResponse = await res.json();
      setFolders(data.folders);
      setFiles(data.files);
      setIsRoot(data.isRoot);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  const navigateToFolder = useCallback(
    (folder: DriveFolder) => {
      setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
      fetchFolder(folder.id);
    },
    [fetchFolder]
  );

  const navigateToBreadcrumb = useCallback(
    (index: number) => {
      const target = breadcrumbs[index];
      setBreadcrumbs((prev) => prev.slice(0, index + 1));
      if (index === 0) {
        fetchFolder();
      } else {
        fetchFolder(target.id);
      }
    },
    [breadcrumbs, fetchFolder]
  );

  const goBack = useCallback(() => {
    if (breadcrumbs.length <= 1) return;
    navigateToBreadcrumb(breadcrumbs.length - 2);
  }, [breadcrumbs, navigateToBreadcrumb]);

  return {
    folders,
    files,
    loading,
    error,
    breadcrumbs,
    isRoot,
    fetchFolder,
    navigateToFolder,
    navigateToBreadcrumb,
    goBack,
  };
}
