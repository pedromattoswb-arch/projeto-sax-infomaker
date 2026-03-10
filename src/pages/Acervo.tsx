import { useEffect, useState, useRef, useCallback, lazy, Suspense } from "react";
import {
  Search,
  Folder,
  ChevronRight,
  ArrowLeft,
  Download,
  AlertCircle,
  X,
  Menu,
} from "lucide-react";
import logoSaxplay from "@/assets/logo-saxplay.png";
import { useDriveFiles, type DriveFile, type DriveFolder } from "@/hooks/useDriveFiles";
import FolderCard from "@/components/acervo/FolderCard";
import FileCard from "@/components/acervo/FileCard";
import AudioPlayerBar, { type AudioPlayerHandle } from "@/components/acervo/AudioPlayerBar";
import MobileNav from "@/components/acervo/MobileNav";
import { Skeleton } from "@/components/ui/skeleton";

const Acervo = () => {
  const {
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
  } = useDriveFiles();

  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [viewingPdf, setViewingPdf] = useState<DriveFile | null>(null);
  const [currentAudio, setCurrentAudio] = useState<DriveFile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const playerRef = useRef<AudioPlayerHandle>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);

  // Debounced search
  useEffect(() => {
    searchTimerRef.current = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [search]);

  const filteredFolders = searchDebounced.trim()
    ? folders.filter((f) => f.name.toLowerCase().includes(searchDebounced.toLowerCase()))
    : folders;

  const allFiles = searchDebounced.trim()
    ? files.filter((f) => f.name.toLowerCase().includes(searchDebounced.toLowerCase()))
    : files;

  // Sort: PDFs first, then audio
  const pdfFiles = allFiles.filter((f) => f.type === "pdf");
  const audioFiles = allFiles.filter((f) => f.type === "audio");
  const otherFiles = allFiles.filter((f) => f.type !== "pdf" && f.type !== "audio");

  const playAudio = useCallback((file: DriveFile) => {
    if (playerRef.current) {
      playerRef.current.play(file);
    } else {
      setCurrentAudio(file);
    }
  }, []);

  const handleFolderOpen = useCallback(
    (folder: DriveFolder) => {
      setSearch("");
      setSearchDebounced("");
      navigateToFolder(folder);
    },
    [navigateToFolder]
  );

  const hasAudioPlaying = currentAudio !== null;

  return (
    <div className={`min-h-screen bg-background ${hasAudioPlaying ? "pb-36 md:pb-24" : ""}`}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logoSaxplay} alt="SaxPlay" className="h-12 md:h-14 w-auto" />
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <Folder className="w-4 h-4 text-primary" />
              <span className="text-sm font-body font-medium">
                {folders.length} pastas · {files.length} arquivos
              </span>
            </div>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onToggle={() => setMenuOpen(false)} />

      <main className="max-w-5xl mx-auto px-4 py-5 md:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 mb-5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center gap-1 shrink-0">
              {idx > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground/40" />}
              <button
                onClick={() => navigateToBreadcrumb(idx)}
                className={`text-sm font-body px-3 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                  idx === breadcrumbs.length - 1
                    ? "font-bold text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </nav>

        {/* Search + Back */}
        <div className="flex gap-2 mb-5">
          {!isRoot && (
            <button
              onClick={goBack}
              className="shrink-0 px-3 py-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nesta pasta..."
              className="w-full pl-11 pr-11 py-3 bg-card border border-border rounded-xl text-base font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all min-h-[48px]"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setSearchDebounced(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-12 h-12 text-destructive mb-3" />
            <p className="text-destructive font-body text-base mb-4">{error}</p>
            <button
              onClick={() => fetchFolder(breadcrumbs[breadcrumbs.length - 1]?.id === "root" ? undefined : breadcrumbs[breadcrumbs.length - 1]?.id)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-body font-bold text-sm hover:opacity-90 transition-opacity min-h-[44px]"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Folders */}
            {filteredFolders.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Pastas ({filteredFolders.length})
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFolders.map((folder) => (
                    <FolderCard key={folder.id} folder={folder} onOpen={handleFolderOpen} />
                  ))}
                </div>
              </div>
            )}

            {/* PDFs (Partituras) */}
            {pdfFiles.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                  Partituras ({pdfFiles.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {pdfFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      isCurrentAudio={false}
                      isPlaying={false}
                      onPlay={playAudio}
                      onViewPdf={setViewingPdf}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Audio (Playbacks) */}
            {audioFiles.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Playbacks ({audioFiles.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {audioFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      isCurrentAudio={playerRef.current?.currentId === file.id}
                      isPlaying={playerRef.current?.isPlaying ?? false}
                      onPlay={playAudio}
                      onViewPdf={setViewingPdf}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other files */}
            {otherFiles.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3">
                  Outros ({otherFiles.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {otherFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      isCurrentAudio={false}
                      isPlaying={false}
                      onPlay={playAudio}
                      onViewPdf={setViewingPdf}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty */}
            {filteredFolders.length === 0 && allFiles.length === 0 && (
              <div className="text-center py-20">
                <Folder className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-body text-base">
                  {search ? "Nenhum resultado encontrado." : "Esta pasta está vazia."}
                </p>
                {search && (
                  <button
                    onClick={() => { setSearch(""); setSearchDebounced(""); }}
                    className="mt-4 px-5 py-2.5 bg-muted text-foreground rounded-xl font-body font-bold text-sm hover:bg-muted/80 transition-colors min-h-[44px]"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Audio Player (persists below PDF overlay) */}
      <AudioPlayerBar
        ref={playerRef}
        currentAudio={currentAudio}
        audioFiles={audioFiles}
        onClose={() => setCurrentAudio(null)}
      />

      {/* PDF Viewer - overlay that doesn't block audio player */}
      {viewingPdf && viewingPdf.viewUrl && (
        <div
          className={`fixed inset-0 flex flex-col bg-foreground/95 animate-in fade-in duration-200 ${
            hasAudioPlaying ? "z-[45]" : "z-50"
          }`}
          style={hasAudioPlaying ? { bottom: "140px" } : undefined}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-card/10 backdrop-blur-sm border-b border-border/20">
            <div className="min-w-0 flex-1 mr-3">
              <h3 className="font-body font-bold text-sm md:text-base text-background truncate">
                {viewingPdf.name}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                Partitura
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={viewingPdf.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-background/10 hover:bg-background/20 text-background transition-colors font-body font-bold text-xs min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Baixar</span>
              </a>
              <button
                onClick={() => setViewingPdf(null)}
                className="p-2.5 rounded-xl bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1">
            <iframe
              src={viewingPdf.viewUrl}
              className="w-full h-full"
              title={viewingPdf.name}
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Acervo;
