import { useState, useCallback, useRef, useMemo } from "react";

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

// Folder name mapping for user-friendly labels
const FOLDER_NAME_MAP: Record<string, string> = {
  "BOOKS": "Livros e Métodos de Estudo",
  "CHRISTMAS - NATAL": "Músicas de Natal",
  "CHRISTMAS": "Músicas de Natal",
  "CLASSICAL MUSIC - MUSICA ERUDITA": "Música Clássica e Erudita",
  "CLASSICAL MUSIC": "Música Clássica e Erudita",
  "COLLECTION": "Coleção Completa",
  "COLEÇÃO COMPLETA": "Coleção Completa",
  "ESTUDOS - STUDY": "Estudos e Exercícios",
  "FAMOSOS - SAXOFONISTAS [SAXOPHONISTS]": "Saxofonistas Famosos",
  "FILMES E SÉRIES": "Trilhas de Filmes e Séries",
  "TRILHAS DE FILMES E SÉRIES": "Trilhas de Filmes e Séries",
  "FILM AND SÉRIES": "Trilhas de Filmes e Séries",
  "FILM AND SERIES": "Trilhas de Filmes e Séries",
  "FILMS AND SERIES": "Trilhas de Filmes e Séries",
  "GOSPEL - EVANGÉLICA": "Músicas Gospel e Evangélicas",
  "GOSPEL": "Músicas Gospel e Evangélicas",
  "JAZZ - BLUES - FUNK - LATIN": "Jazz, Blues, Funk e Latin",
  "JAZZ STANDARD": "Jazz Standards",
  "JAZZ": "Jazz",
  "MÚSICA POP": "Música Pop",
  "POP": "Música Pop",
  "MÚSICA BRASILEIRA": "Música Brasileira",
  "MPB": "Música Popular Brasileira",
  "SERTANEJO": "Sertanejo",
  "FORRÓ": "Forró",
  "BOSSA NOVA": "Bossa Nova",
  "ROCK": "Rock",
  "BLUES": "Blues",
  "REGGAE": "Reggae",
  "SAMBA": "Samba",
  "SCORE COLLECTION - COLETANIA DE PARTITURAS": "Coletânea de Partituras",
  "VTS GOSPEL": "Partituras Gospel",
  "WEDDING - CASAMENTO": "Músicas para Casamento",
  "INTERNATIONAL": "Músicas Internacionais",
  "BRASILEIRAS": "Músicas Brasileiras",
  "ROMANTIC": "Músicas Românticas",
  "ROMANTIC SONGS": "Músicas Românticas",
  "LOVE SONGS": "Músicas Românticas",
  "WORSHIP": "Músicas de Louvor",
  "PRAISE": "Músicas de Louvor",
  "DUETS": "Duetos",
  "SOLOS": "Solos",
  "EXERCISES": "Exercícios",
  "SCALES": "Escalas",
  "STUDIES": "Estudos",
  "TECHNIQUE": "Técnica",
  "WARM UP": "Aquecimento",
  "PLAY ALONG": "Play Along",
  "BACKING TRACKS": "Playbacks",
  "SHEET MUSIC": "Partituras",
  "SCORES": "Partituras",
};

function formatFolderName(raw: string): string {
  if (FOLDER_NAME_MAP[raw.toUpperCase()]) return FOLDER_NAME_MAP[raw.toUpperCase()];
  if (FOLDER_NAME_MAP[raw]) return FOLDER_NAME_MAP[raw];
  return raw
    .toLowerCase()
    .replace(/(?:^|\s|[-/])\S/g, (match) => match.toUpperCase());
}

function getCacheKey(folderId?: string): string {
  return `drive_cache_${folderId || "root"}`;
}

function getCached(folderId?: string): DriveResponse | null {
  try {
    const raw = sessionStorage.getItem(getCacheKey(folderId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Cache valid for 10 minutes (aligned with server)
    if (Date.now() - parsed._ts > 10 * 60 * 1000) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function setCache(folderId: string | undefined, data: DriveResponse) {
  try {
    sessionStorage.setItem(
      getCacheKey(folderId),
      JSON.stringify({ data, _ts: Date.now() })
    );
  } catch {
    // sessionStorage full — silently ignore
  }
}

function applyFolderNames(folders: DriveFolder[]): DriveFolder[] {
  return folders.map((f) => ({ ...f, name: formatFolderName(f.name) }));
}

export function useDriveFiles() {
  const [folders, setFolders] = useState<DriveFolder[]>([]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: "root", name: "Acervo" },
  ]);
  const [isRoot, setIsRoot] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const fetchFolder = useCallback(async (folderId?: string) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Try cache first (stale-while-revalidate)
    const cached = getCached(folderId);
    if (cached) {
      setFolders(applyFolderNames(cached.folders));
      setFiles(cached.files);
      setIsRoot(cached.isRoot);
      setLoading(false);
      setError(null);
      // Still fetch in background to update
    }

    if (!cached) setLoading(true);
    setError(null);

    try {
      const url = folderId
        ? `${EDGE_FUNCTION_URL}?folderId=${folderId}`
        : EDGE_FUNCTION_URL;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("Erro ao carregar arquivos");
      const data: DriveResponse = await res.json();
      setCache(folderId, data);
      if (!controller.signal.aborted) {
        setFolders(applyFolderNames(data.folders));
        setFiles(data.files);
        setIsRoot(data.isRoot);
      }
    } catch (err: any) {
      if (err.name === "AbortError") return;
      if (!cached) setError(err.message || "Erro desconhecido");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
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
      setBreadcrumbs((prev) => {
        const target = prev[index];
        setTimeout(() => {
          if (index === 0) fetchFolder();
          else fetchFolder(target.id);
        }, 0);
        return prev.slice(0, index + 1);
      });
    },
    [fetchFolder]
  );

  const goBack = useCallback(() => {
    setBreadcrumbs((prev) => {
      if (prev.length <= 1) return prev;
      const newBreadcrumbs = prev.slice(0, -1);
      const target = newBreadcrumbs[newBreadcrumbs.length - 1];
      setTimeout(() => {
        if (target.id === "root") fetchFolder();
        else fetchFolder(target.id);
      }, 0);
      return newBreadcrumbs;
    });
  }, [fetchFolder]);

  return useMemo(() => ({
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
  }), [folders, files, loading, error, breadcrumbs, isRoot, fetchFolder, navigateToFolder, navigateToBreadcrumb, goBack]);
}
