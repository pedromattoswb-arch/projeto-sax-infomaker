import { useEffect, useState, useRef, useCallback } from "react";
import {
  Search,
  Folder,
  ChevronRight,
  ArrowLeft,
  Download,
  AlertCircle,
  X,
  Menu,
  FileText,
  Music,
  PlayCircle,
  ChevronDown,
} from "lucide-react";
import logoSaxplay from "@/assets/logo-saxplay.png";
import { useDriveFiles, type DriveFile, type DriveFolder } from "@/hooks/useDriveFiles";
import FolderCard from "@/components/acervo/FolderCard";
import FileCard from "@/components/acervo/FileCard";
import AudioPlayerBar, { type AudioPlayerHandle } from "@/components/acervo/AudioPlayerBar";
import MobileNav from "@/components/acervo/MobileNav";
import GlobalSearchPanel from "@/components/acervo/GlobalSearchPanel";
import { Skeleton } from "@/components/ui/skeleton";

type FileFilter = "all" | "pdf" | "audio";

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
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [fileFilter, setFileFilter] = useState<FileFilter>("all");
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

  const pdfFiles = allFiles.filter((f) => f.type === "pdf");
  const audioFiles = allFiles.filter((f) => f.type === "audio");
  const otherFiles = allFiles.filter((f) => f.type !== "pdf" && f.type !== "audio");

  // Apply filter
  const showPdfs = fileFilter === "all" || fileFilter === "pdf";
  const showAudio = fileFilter === "all" || fileFilter === "audio";

  const hasFiles = pdfFiles.length > 0 || audioFiles.length > 0;

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
      setFileFilter("all");
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
        {/* Tutorial Banner */}
        <TutorialBanner />

        {/* Breadcrumbs - flex-wrap, no horizontal scroll */}
        <nav className="flex flex-wrap items-center gap-1 mb-4">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />}
              <button
                onClick={() => navigateToBreadcrumb(idx)}
                className={`text-xs md:text-sm font-body px-2.5 py-1.5 rounded-lg transition-colors min-h-[32px] break-words text-left ${
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
        <div className="flex gap-2 mb-4">
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

        {/* Filter Tabs - always visible when there are files */}
        {!loading && !error && hasFiles && (
          <div className="sticky top-[73px] z-20 bg-background/95 backdrop-blur-md -mx-4 px-4 py-3 mb-4 border-b border-border/50">
            <div className="flex flex-wrap gap-2">
              <FilterTab
                active={fileFilter === "all"}
                onClick={() => setFileFilter("all")}
                count={pdfFiles.length + audioFiles.length}
                variant="default"
              >
                Todos
              </FilterTab>
              <FilterTab
                active={fileFilter === "pdf"}
                onClick={() => setFileFilter("pdf")}
                count={pdfFiles.length}
                icon={<FileText className="w-4 h-4" />}
                variant="pdf"
              >
                Partituras
              </FilterTab>
              <FilterTab
                active={fileFilter === "audio"}
                onClick={() => setFileFilter("audio")}
                count={audioFiles.length}
                icon={<Music className="w-4 h-4" />}
                variant="audio"
              >
                Playbacks
              </FilterTab>
            </div>
          </div>
        )}

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
            <p className="text-destructive font-body text-base mb-4 break-words text-center">{error}</p>
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
            {showPdfs && pdfFiles.length > 0 && (
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
            {showAudio && audioFiles.length > 0 && (
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

            {/* Empty after filter */}
            {hasFiles && ((fileFilter === "pdf" && pdfFiles.length === 0) || (fileFilter === "audio" && audioFiles.length === 0)) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-body text-base">
                  Nenhum {fileFilter === "pdf" ? "partitura" : "playback"} nesta pasta.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Audio Player */}
      <AudioPlayerBar
        ref={playerRef}
        currentAudio={currentAudio}
        audioFiles={audioFiles}
        onClose={() => setCurrentAudio(null)}
      />

      {/* PDF Viewer */}
      {viewingPdf && viewingPdf.viewUrl && (
        <div
          className={`fixed inset-0 flex flex-col bg-foreground/95 animate-in fade-in duration-200 ${
            hasAudioPlaying ? "z-[45]" : "z-50"
          }`}
          style={hasAudioPlaying ? { bottom: "140px" } : undefined}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-card/10 backdrop-blur-sm border-b border-border/20">
            <div className="min-w-0 flex-1 mr-3">
              <h3 className="font-body font-bold text-sm md:text-base text-background break-words line-clamp-2">
                {viewingPdf.name}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                Partitura
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
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

/* Filter Tab component */
const FilterTab = ({ active, onClick, count, icon, variant, children }: {
  active: boolean;
  onClick: () => void;
  count: number;
  icon?: React.ReactNode;
  variant: "default" | "pdf" | "audio";
  children: React.ReactNode;
}) => {
  const baseClasses = "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-body font-bold transition-all min-h-[40px] sm:min-h-[48px]";
  
  const variantClasses = {
    default: active
      ? "bg-foreground text-background shadow-md"
      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20",
    pdf: active
      ? "bg-destructive text-destructive-foreground shadow-md"
      : "bg-card border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30",
    audio: active
      ? "bg-primary text-primary-foreground shadow-md"
      : "bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/30",
  };

  const badgeClasses = {
    default: active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground",
    pdf: active ? "bg-destructive-foreground/20 text-destructive-foreground" : "bg-destructive/10 text-destructive",
    audio: active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      {icon}
      {children}
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${badgeClasses[variant]}`}>
        {count}
      </span>
    </button>
  );
};

/* Tutorial collapsible banner */
const TUTORIALS = [
  { title: "Como navegar pelo acervo", description: "Aprenda a encontrar partituras e playbacks rapidamente" },
  { title: "Como usar os playbacks", description: "Toque junto com o playback no seu ritmo" },
  { title: "Como baixar partituras", description: "Salve as partituras no seu celular ou computador" },
  { title: "Como organizar seus estudos", description: "Dicas para montar sua rotina de prática com o acervo" },
];

const TutorialBanner = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors text-left"
      >
        <PlayCircle className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-body font-bold text-foreground">Vídeos Tutoriais</p>
          <p className="text-xs text-muted-foreground">Aprenda a usar o acervo completo</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {TUTORIALS.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-body font-bold text-foreground break-words">{t.title}</p>
                <p className="text-xs text-muted-foreground break-words">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Acervo;
