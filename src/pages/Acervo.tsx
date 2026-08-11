import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import WhatsAppSupport from "@/components/WhatsAppSupport";
import useNoIndex from "@/hooks/useNoIndex";
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
  
  ChevronDown,
  Gift,
  BookOpen,
  Piano,
  Globe,
  Crown,
  Lock,
  Play,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import { useDriveFiles, type DriveFile, type DriveFolder } from "@/hooks/useDriveFiles";
import FolderCard from "@/components/acervo/FolderCard";
import LockedFolderCard from "@/components/acervo/LockedFolderCard";
import FileCard from "@/components/acervo/FileCard";
import AudioPlayerBar, { type AudioPlayerHandle } from "@/components/acervo/AudioPlayerBar";
import MobileNav from "@/components/acervo/MobileNav";
import GlobalSearchPanel from "@/components/acervo/GlobalSearchPanel";
import { Skeleton } from "@/components/ui/skeleton";

type FileFilter = "all" | "pdf" | "audio";

const UPGRADE_URL = "https://pay.wiapy.com/jyPuib6Uivrl";

const LOCKED_FOLDER_NAMES = [
  "playbacks",
  "harpa cristã",
  "harpa crista",
  "material complementar",
  "materiais complementares",
  "livros e métodos de estudo",
  "livros e metodos de estudo",
  "estudos e exercícios",
  "estudos e exercicios",
  "coletânea de partituras",
  "coletanea de partituras",
];

const BONUS_VIRTUAL_FOLDERS = [
  { id: "bonus-rotina", name: "BÔNUS: Guia Rotina de Estudo", path: "/bonus/rotina-de-estudo" },
  { id: "bonus-tonalidades", name: "BÔNUS: Mapa de Tonalidades", path: "/bonus/mapa-de-tonalidades" },
  { id: "bonus-100musicas", name: "BÔNUS: 100 Músicas Essenciais", path: "/bonus/100-musicas" },
];

const MAIN_VIRTUAL_FOLDERS = [
  { id: "dire-straits", name: "ESPECIAL: Dire Straits", path: "/especial/dire-straits", isSpecial: true },
];

interface AcervoProps {
  plan?: "basic" | "premium";
}

const Acervo = ({ plan = "premium" }: AcervoProps) => {
  const isBasic = plan === "basic";
  useNoIndex();
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
  const [visiblePdfCount, setVisiblePdfCount] = useState(50);
  const [visibleAudioCount, setVisibleAudioCount] = useState(50);

  // Reactive player state synced from AudioPlayerBar
  const [playerState, setPlayerState] = useState<{ activeId: string | null; isPlaying: boolean; minimized: boolean }>({
    activeId: null,
    isPlaying: false,
    minimized: false,
  });

  const handlePlayerStateChange = useCallback((state: { activeId: string | null; isPlaying: boolean; minimized: boolean }) => {
    setPlayerState(state);
  }, []);

  const hasAudioPlaying = playerState.activeId !== null;
  const isPlayerMinimized = playerState.minimized;

  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);

  // Debounced search
  useEffect(() => {
    searchTimerRef.current = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [search]);

  const filteredFolders = useMemo(() => {
    const term = searchDebounced.trim().toLowerCase();
    return term
      ? folders.filter((f) => f.name.toLowerCase().includes(term))
      : folders;
  }, [folders, searchDebounced]);

  const allFiles = useMemo(() => {
    const term = searchDebounced.trim().toLowerCase();
    return term
      ? files.filter((f) => f.name.toLowerCase().includes(term))
      : files;
  }, [files, searchDebounced]);

  const pdfFiles = useMemo(() => allFiles.filter((f) => f.type === "pdf"), [allFiles]);
  const audioFiles = useMemo(() => allFiles.filter((f) => f.type === "audio"), [allFiles]);
  const otherFiles = useMemo(() => allFiles.filter((f) => f.type !== "pdf" && f.type !== "audio"), [allFiles]);

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
      setVisiblePdfCount(50);
      setVisibleAudioCount(50);
      navigateToFolder(folder);
      window.scrollTo(0, 0);
    },
    [navigateToFolder]
  );

  const handleBreadcrumbClick = useCallback(
    (idx: number) => {
      navigateToBreadcrumb(idx);
      window.scrollTo(0, 0);
    },
    [navigateToBreadcrumb]
  );

  const handleGoBack = useCallback(() => {
    goBack();
    window.scrollTo(0, 0);
  }, [goBack]);

  const handlePlayerClose = useCallback(() => {
    setCurrentAudio(null);
  }, []);

  const handleCloseSearch = useCallback(() => setSearchPanelOpen(false), []);

  const handleSearchFolderOpen = useCallback((folder: DriveFolder) => {
    handleFolderOpen(folder);
  }, [handleFolderOpen]);

  const handleSearchFileOpen = useCallback((file: DriveFile) => {
    if (file.type === "pdf") setViewingPdf(file);
    else if (file.type === "audio") playAudio(file);
  }, [playAudio]);

  return (
    <div className={`min-h-screen bg-background ${hasAudioPlaying && !isPlayerMinimized ? "pb-40 md:pb-28" : hasAudioPlaying && isPlayerMinimized ? "pb-6" : ""}`}>
      {/* Skip Navigation */}
      <a
        href="#acervo-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:text-sm focus:font-bold"
      >
        Ir para conteúdo
      </a>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border" role="banner">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logoClubeSax} alt="Clube do Sax" className="h-12 md:h-14 w-auto" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to={isBasic ? "/acervo-basico" : "/plano-premium-completo"} className="px-3 py-2 rounded-lg text-sm font-body font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
              Acervo
            </Link>
            {!isBasic && (
              <>
                <Link to="/bonus/rotina-de-estudo" className="px-3 py-2 rounded-lg text-sm font-body font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  Rotina de Estudo
                </Link>
                <Link to="/bonus/mapa-de-tonalidades" className="px-3 py-2 rounded-lg text-sm font-body font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  Mapa de Tonalidades
                </Link>
                <Link to="/bonus/100-musicas" className="px-3 py-2 rounded-lg text-sm font-body font-semibold text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                  100 Músicas
                </Link>
              </>
            )}
            {isBasic && (
              <a
                href={UPGRADE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Crown className="w-4 h-4" />
                Fazer Upgrade
              </a>
            )}
          </nav>

          <div className="flex items-center gap-3">
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

      {/* Upgrade Banner for Basic plan — non-sticky, subtle */}
      {isBasic && (
        <div className="bg-muted/60 border-b border-border py-2.5 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <p className="text-xs md:text-sm font-body font-medium text-muted-foreground flex-1">
              Você está no <span className="font-bold text-foreground">Plano Básico</span> — Alguns conteúdos são exclusivos do Plano Completo.
            </p>
            <a
              href={UPGRADE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-body font-bold text-xs hover:bg-primary/90 transition-colors min-h-[32px] flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              Upgrade
            </a>
          </div>
        </div>
      )}

      <MobileNav open={menuOpen} onToggle={() => setMenuOpen(false)} plan={plan} />

      <main id="acervo-content" className="max-w-5xl mx-auto px-4 py-5 md:py-8" role="main">
        {/* Main/Special Virtual Folders - shown at root level above others */}
        {isRoot && (
          <div className="mb-8" role="region" aria-label="Especial">
            <h2 className="text-xs uppercase tracking-widest text-primary font-body font-bold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 fill-primary/20" />
              Destaque ({MAIN_VIRTUAL_FOLDERS.length})
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {MAIN_VIRTUAL_FOLDERS.map((folder) =>
                isBasic ? (
                  <LockedFolderCard
                    key={folder.id}
                    folder={{ id: folder.id, name: folder.name, type: "folder" as const }}
                    upgradeUrl={UPGRADE_URL}
                  />
                ) : (
                  <Link
                    key={folder.id}
                    to={folder.path}
                    role="listitem"
                    className="group flex items-center gap-3 p-3 md:p-5 bg-card border-2 border-primary/20 rounded-2xl hover:border-primary/60 hover:shadow-lg transition-all w-full min-h-[60px] relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-1">
                      <div className="bg-primary text-[8px] text-primary-foreground px-1.5 py-0.5 rounded-bl-lg font-bold uppercase tracking-tighter">Novo</div>
                    </div>
                    <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-primary/10">
                      <Music className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="font-body font-bold text-sm md:text-base text-foreground group-hover:text-primary break-words leading-snug flex-1 transition-colors">
                      {folder.name}
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {/* Bonus Virtual Folders - shown at root level */}
        {isRoot && (
          <div className="mb-6" role="region" aria-label="Bônus">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Bônus ({BONUS_VIRTUAL_FOLDERS.length})
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {BONUS_VIRTUAL_FOLDERS.map((bonus) =>
                isBasic ? (
                  <LockedFolderCard
                    key={bonus.id}
                    folder={{ id: bonus.id, name: bonus.name, type: "folder" as const }}
                    upgradeUrl={UPGRADE_URL}
                  />
                ) : (
                  <Link
                    key={bonus.id}
                    to={bonus.path}
                    role="listitem"
                    className="group flex items-center gap-3 p-3 md:p-5 bg-card border border-border/50 rounded-2xl hover:border-primary/40 hover:shadow-md transition-all w-full min-h-[60px]"
                  >
                    <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-primary/10">
                      <Gift className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                    <span className="font-body font-bold text-sm md:text-base text-foreground group-hover:text-primary break-words leading-snug flex-1 transition-colors">
                      {bonus.name}
                    </span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}

        {/* Quick Tips Banner - locked on basic, open on premium */}
        <QuickTipsBanner locked={isBasic} upgradeUrl={UPGRADE_URL} />

        {/* Breadcrumbs - flex-wrap, no horizontal scroll */}
        <nav className="flex flex-wrap items-center gap-1 mb-4" role="navigation" aria-label="Navegação por pastas">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />}
              <button
                onClick={() => handleBreadcrumbClick(idx)}
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
              onClick={handleGoBack}
              className="shrink-0 px-3 py-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all min-h-[48px] min-w-[48px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Voltar para pasta anterior"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {/* Search trigger — opens full-screen panel */}
          <button
            onClick={() => setSearchPanelOpen(true)}
            className="relative flex-1 flex items-center gap-3 pl-11 pr-4 py-3 bg-muted border border-border rounded-xl text-base font-body text-muted-foreground hover:border-muted-foreground/30 focus-visible:ring-2 focus-visible:ring-primary transition-all min-h-[48px] text-left"
            aria-label="Abrir painel de busca"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <span>Buscar músicas, pastas...</span>
          </button>
        </div>

        {/* Global Search Panel */}
        <GlobalSearchPanel
          open={searchPanelOpen}
          onClose={handleCloseSearch}
          folders={folders}
          files={files}
          onFolderOpen={handleSearchFolderOpen}
          onFileOpen={handleSearchFileOpen}
          onPlayAudio={playAudio}
        />

        {/* Filter Tabs - always visible when there are files */}
        {!loading && !error && hasFiles && (
          <div className="sticky top-[73px] z-20 bg-background -mx-4 px-4 py-3 mb-4 border-b border-border/50">
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
          <div className="space-y-3" aria-label="Carregando conteúdo">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 md:p-5 rounded-2xl bg-card border border-border">
                <Skeleton className="w-10 h-10 md:w-12 md:h-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded" />
                </div>
              </div>
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
              <div className="mb-6" role="region" aria-label="Pastas">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Pastas ({filteredFolders.length})
                </h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3" role="list">
                  {filteredFolders.map((folder) => {
                    const isLocked = isBasic && LOCKED_FOLDER_NAMES.includes(folder.name.toLowerCase().trim());
                    return isLocked ? (
                      <LockedFolderCard key={folder.id} folder={folder} upgradeUrl={UPGRADE_URL} />
                    ) : (
                      <FolderCard key={folder.id} folder={folder} onOpen={handleFolderOpen} />
                    );
                  })}
                </div>
              </div>
            )}

            {/* PDFs (Partituras) */}
            {showPdfs && pdfFiles.length > 0 && (
              <div className="mb-6" role="region" aria-label="Partituras">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                  Partituras ({pdfFiles.length})
                </h2>
                <div className="flex flex-col gap-2" role="list" aria-live="polite">
                  {pdfFiles.slice(0, visiblePdfCount).map((file) => (
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
                {pdfFiles.length > visiblePdfCount && (
                  <button
                    onClick={() => setVisiblePdfCount((c) => c + 50)}
                    className="mt-3 w-full py-3 rounded-xl bg-muted border border-border text-sm font-body font-bold text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors min-h-[44px]"
                  >
                    Mostrar mais ({pdfFiles.length - visiblePdfCount} restantes)
                  </button>
                )}
              </div>
            )}

            {/* Audio (Playbacks) */}
            {showAudio && audioFiles.length > 0 && (
              <div className="mb-6" role="region" aria-label="Playbacks">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Playbacks ({audioFiles.length})
                </h2>
                <div className="flex flex-col gap-2" role="list" aria-live="polite">
                  {audioFiles.slice(0, visibleAudioCount).map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      isCurrentAudio={playerState.activeId === file.id}
                      isPlaying={playerState.activeId === file.id && playerState.isPlaying}
                      onPlay={playAudio}
                      onViewPdf={setViewingPdf}
                    />
                  ))}
                </div>
                {audioFiles.length > visibleAudioCount && (
                  <button
                    onClick={() => setVisibleAudioCount((c) => c + 50)}
                    className="mt-3 w-full py-3 rounded-xl bg-muted border border-border text-sm font-body font-bold text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors min-h-[44px]"
                  >
                    Mostrar mais ({audioFiles.length - visibleAudioCount} restantes)
                  </button>
                )}
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
        onClose={handlePlayerClose}
        onStateChange={handlePlayerStateChange}
      />

      {/* PDF Viewer */}
      {viewingPdf && viewingPdf.viewUrl && (
        <div
          className={`fixed inset-0 flex flex-col bg-foreground/95 animate-in fade-in duration-200 ${
            hasAudioPlaying ? "z-[45]" : "z-50"
          }`}
          style={hasAudioPlaying && !isPlayerMinimized ? { bottom: "140px" } : hasAudioPlaying && isPlayerMinimized ? { bottom: "0px" } : undefined}
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
              loading="lazy"
            />
          </div>
        </div>
      )}
      {plan === "premium" && (
        <>
          <section className="mt-16 py-12 px-4 border-t border-border bg-card/30">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="space-y-3">
                <h3 className="font-bold text-lg">Dúvidas ou problemas com seu acesso?</h3>
                <p className="text-sm text-muted-foreground">Como aluno Premium, você tem suporte prioritário via WhatsApp.</p>
                <div className="flex justify-center pt-2">
                  <WhatsAppSupport showFooterButton />
                </div>
              </div>
            </div>
          </section>
          <WhatsAppSupport />
        </>
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
  const baseClasses = "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-body font-bold transition-all min-h-[40px] sm:min-h-[48px] focus-visible:ring-2 focus-visible:ring-primary";
  
  const variantClasses = {
    default: active
      ? "bg-foreground text-background shadow-md"
      : "bg-muted border border-border text-muted-foreground hover:text-foreground hover:bg-muted/70",
    pdf: active
      ? "bg-destructive text-destructive-foreground shadow-md"
      : "bg-muted border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/5",
    audio: active
      ? "bg-primary text-primary-foreground shadow-md"
      : "bg-muted border border-border text-muted-foreground hover:text-primary hover:bg-primary/5",
  };

  const badgeClasses = {
    default: active ? "bg-background/20 text-background" : "bg-background text-muted-foreground",
    pdf: active ? "bg-destructive-foreground/20 text-destructive-foreground" : "bg-destructive/10 text-destructive",
    audio: active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary",
  };

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      {icon}
      {children}
      <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${badgeClasses[variant]}`}>
        {count}
      </span>
    </button>
  );
};

/* Quick Tips collapsible banner */
const TUTORIAL_TIPS = [
  {
    title: "📂 Navegue pelas pastas",
    description: "O acervo é organizado por pastas temáticas (gêneros, estilos). Toque em qualquer pasta para abrir e ver as partituras e playbacks dentro dela.",
  },
  {
    title: "🔍 Use a busca",
    description: "Clique no campo de busca no topo para encontrar qualquer música pelo nome. A busca procura em todas as pastas automaticamente.",
  },
  {
    title: "🎵 Ouça os playbacks",
    description: "Clique no botão ▶ ao lado de qualquer arquivo de áudio para tocar o playback. O player aparece na parte inferior da tela e você pode continuar navegando enquanto ouve.",
  },
  {
    title: "📄 Visualize partituras",
    description: "Clique em qualquer arquivo PDF para abrir a partitura em tela cheia. Você pode fazer zoom, rolar e baixar o arquivo.",
  },
  {
    title: "⬇️ Baixe os arquivos",
    description: "Todos os arquivos (partituras e playbacks) podem ser baixados. Clique no ícone de download para salvar no seu dispositivo.",
  },
  {
    title: "🎁 Acesse seus Bônus",
    description: "Na tela inicial do acervo, você encontra os bônus exclusivos: Rotina de Estudo, Mapa de Tonalidades e 100 Músicas Essenciais.",
  },
  {
    title: "🔊 Toque junto com o playback",
    description: "Abra a partitura de uma música e toque o playback ao mesmo tempo. O player fica visível enquanto você visualiza a partitura!",
  },
  {
    title: "📱 Funciona no celular",
    description: "O acervo foi otimizado para funcionar perfeitamente no celular. Use o menu ☰ no canto superior para acessar todas as seções.",
  },
];

const QuickTipsBanner = ({ locked = false, upgradeUrl = "" }: { locked?: boolean; upgradeUrl?: string }) => {
  const [open, setOpen] = useState(false);
  const [isTutorialPlaying, setIsTutorialPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayTutorial = useCallback(() => {
    setIsTutorialPlaying(true);
  }, []);

  // Auto-play once video mounts
  useEffect(() => {
    if (isTutorialPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isTutorialPlaying]);

  return (
    <div className="mb-6">
      {/* Video Tutorial — lazy mount, locked overlay on basic */}
      <div className="rounded-2xl overflow-hidden border-2 border-primary/30 bg-card shadow-lg mb-4 relative">
        <div className="p-4 bg-primary/10 border-b border-primary/20">
          <h3 className="text-base font-body font-bold text-foreground flex items-center gap-2">
            🎬 Tutorial — Como Navegar pela Clube do Sax
            {locked && <Lock className="w-4 h-4 text-muted-foreground" />}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {locked
              ? "Disponível no plano completo. Faça upgrade para assistir!"
              : "Assista antes de começar! Veja como encontrar partituras, playbacks e bônus."}
          </p>
        </div>
        <div className="aspect-video relative bg-black">
          {locked ? (
            /* Locked: static thumbnail + overlay, no <video> */
            <>
              <img
                src="/thumbnail-vsl.webp"
                alt="Tutorial bloqueado"
                className="w-full h-full object-cover opacity-60 blur-[2px]"
              />
              <a
                href={upgradeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 gap-3 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-body font-bold text-white">Disponível no Plano Completo</span>
                <span className="text-xs font-body text-primary bg-primary/20 px-4 py-1.5 rounded-full border border-primary/30 group-hover:bg-primary/30 transition-colors">
                  Fazer Upgrade →
                </span>
              </a>
            </>
          ) : !isTutorialPlaying ? (
            /* Unlocked, pre-play: static thumbnail + play button */
            <button
              onClick={handlePlayTutorial}
              className="w-full h-full relative group cursor-pointer"
              aria-label="Assistir tutorial"
            >
              <img
                src="/thumbnail-vsl.webp"
                alt="Clique para assistir o tutorial"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-transform">
                  <Play className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="currentColor" />
                </div>
              </div>
            </button>
          ) : (
            /* Unlocked, playing: real <video> */
            <video
              ref={videoRef}
              controls
              playsInline
              preload="auto"
              className="w-full h-full object-contain bg-black"
            >
              <source src="/tutorials/como-navegar-saxplay.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo.
            </video>
          )}
        </div>
      </div>

      {/* Collapsible tips */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors text-left"
      >
        <BookOpen className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm font-body font-semibold text-foreground flex-1">📚 Orientações de uso</p>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {TUTORIAL_TIPS.map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-body font-bold text-foreground break-words">{t.title}</p>
                <p className="text-xs text-muted-foreground break-words mt-0.5 leading-relaxed">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* Bonus Section visible in acervo root */
const BONUS_ITEMS = [
  { label: "Rotina de Estudo", description: "Organize sua prática diária", path: "/bonus/rotina-de-estudo", icon: BookOpen, color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Mapa de Tonalidades", description: "Domine todas as tonalidades", path: "/bonus/mapa-de-tonalidades", icon: Piano, color: "bg-violet-500/10 text-violet-600" },
  { label: "100 Músicas para Tocar", description: "Lista curada de repertório", path: "/bonus/100-musicas", icon: Globe, color: "bg-blue-500/10 text-blue-600" },
];

const BonusSection = () => (
  <div id="bonus" className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Gift className="w-5 h-5 text-primary" />
      <h2 className="text-sm uppercase tracking-widest text-foreground font-body font-bold">Seus Bônus</h2>
    </div>
    <div className="grid gap-2 sm:grid-cols-3">
      {BONUS_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
        >
          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
            <item.icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-body font-bold text-foreground group-hover:text-primary transition-colors">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </Link>
      ))}
    </div>
    <div className="mt-12 py-12 border-t border-border/50 text-center space-y-6">
      <div className="space-y-3 max-w-lg mx-auto">
        <h3 className="text-2xl font-extrabold font-heading text-foreground">Ficou com alguma dúvida?</h3>
        <p className="text-muted-foreground font-body leading-relaxed">
          Nossa equipe está disponível agora mesmo no WhatsApp para te ajudar a aproveitar ao máximo sua plataforma.
        </p>
      </div>
      <WhatsAppSupport showFooterButton />
    </div>
  </div>
);

export default Acervo;
