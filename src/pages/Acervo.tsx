import { useEffect, useState, useRef, useCallback } from "react";
import {
  Search,
  Folder,
  FileText,
  Music as MusicIcon,
  Image,
  File,
  ChevronRight,
  ArrowLeft,
  Download,
  Loader2,
  AlertCircle,
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import logoSaxplay from "@/assets/logo-saxplay.png";
import { useDriveFiles, type DriveFile, type DriveFolder } from "@/hooks/useDriveFiles";

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
  const [viewingPdf, setViewingPdf] = useState<DriveFile | null>(null);

  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentAudio, setCurrentAudio] = useState<DriveFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);

  // Filter by search
  const filteredFolders = search.trim()
    ? folders.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : folders;
  const filteredFiles = search.trim()
    ? files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : files;

  const audioFiles = filteredFiles.filter((f) => f.type === "audio");

  // Audio controls
  const playAudio = useCallback(
    (file: DriveFile) => {
      if (currentAudio?.id === file.id) {
        setIsPlaying((p) => !p);
      } else {
        setCurrentAudio(file);
        setIsPlaying(true);
      }
    },
    [currentAudio?.id]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAudio?.streamUrl) return;
    audio.src = currentAudio.streamUrl;
    if (isPlaying) audio.play().catch(() => {});
  }, [currentAudio?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
    setDuration(audio.duration || 0);
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setProgress(time);
  };

  const playNext = useCallback(() => {
    if (!currentAudio || audioFiles.length === 0) return;
    const idx = audioFiles.findIndex((f) => f.id === currentAudio.id);
    const next = audioFiles[(idx + 1) % audioFiles.length];
    setCurrentAudio(next);
    setIsPlaying(true);
  }, [currentAudio, audioFiles]);

  const playPrev = useCallback(() => {
    if (!currentAudio || audioFiles.length === 0) return;
    const idx = audioFiles.findIndex((f) => f.id === currentAudio.id);
    const prev = audioFiles[(idx - 1 + audioFiles.length) % audioFiles.length];
    setCurrentAudio(prev);
    setIsPlaying(true);
  }, [currentAudio, audioFiles]);

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-5 h-5 text-red-500" />;
      case "audio":
        return <MusicIcon className="w-5 h-5 text-primary" />;
      case "image":
        return <Image className="w-5 h-5 text-emerald-500" />;
      default:
        return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className={`min-h-screen bg-background ${currentAudio ? "pb-32 md:pb-24" : ""}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <img src={logoSaxplay} alt="SaxPlay" className="h-8 md:h-10 w-auto" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Folder className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm font-body font-medium">
              {folders.length} pastas · {files.length} arquivos
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.id} className="flex items-center gap-1 shrink-0">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />}
              <button
                onClick={() => navigateToBreadcrumb(idx)}
                className={`text-xs md:text-sm font-body px-2 py-1 rounded-md transition-colors ${
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
        <div className="flex gap-2 mb-6">
          {!isRoot && (
            <button
              onClick={goBack}
              className="shrink-0 px-3 py-3 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nesta pasta..."
              className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-xl text-sm md:text-base font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground font-body text-sm">Carregando arquivos...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-10 h-10 text-destructive mb-3" />
            <p className="text-destructive font-body text-sm mb-3">{error}</p>
            <button
              onClick={() => fetchFolder(breadcrumbs[breadcrumbs.length - 1]?.id === "root" ? undefined : breadcrumbs[breadcrumbs.length - 1]?.id)}
              className="text-sm text-primary hover:underline font-body"
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
                <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-body font-semibold mb-3">
                  Pastas ({filteredFolders.length})
                </h2>
                <div className="grid gap-2 md:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setSearch("");
                        navigateToFolder(folder);
                      }}
                      className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:shadow-md hover:border-primary/30 transition-all duration-200 text-left"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Folder className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-body font-semibold text-sm text-foreground truncate flex-1">
                        {folder.name}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {filteredFiles.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-body font-semibold mb-3">
                  Arquivos ({filteredFiles.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-3 p-3 md:p-4 bg-card border rounded-xl transition-all duration-200 ${
                        currentAudio?.id === file.id && isPlaying
                          ? "border-primary shadow-md bg-primary/5"
                          : "border-border hover:shadow-sm hover:border-primary/20"
                      }`}
                    >
                      {/* Icon / Play button */}
                      {file.type === "audio" ? (
                        <button
                          onClick={() => playAudio(file)}
                          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            currentAudio?.id === file.id && isPlaying
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                          }`}
                          aria-label={currentAudio?.id === file.id && isPlaying ? "Pausar" : "Tocar"}
                        >
                          {currentAudio?.id === file.id && isPlaying ? (
                            <Pause className="w-4 h-4" fill="currentColor" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                          )}
                        </button>
                      ) : (
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                      )}

                      {/* File name */}
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-sm text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          {file.type === "pdf" ? "PDF" : file.type === "audio" ? "Áudio" : file.type === "image" ? "Imagem" : "Arquivo"}
                          {file.size ? ` · ${formatFileSize(file.size)}` : ""}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {file.type === "pdf" && file.viewUrl && (
                          <button
                            onClick={() => setViewingPdf(file)}
                            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors text-xs font-semibold font-body flex items-center gap-1"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="hidden md:inline">Ver</span>
                          </button>
                        )}
                        <a
                          href={file.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          aria-label={`Baixar ${file.name}`}
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty */}
            {filteredFolders.length === 0 && filteredFiles.length === 0 && (
              <div className="text-center py-16">
                <Folder className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-body text-sm">
                  {search ? "Nenhum resultado encontrado." : "Esta pasta está vazia."}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="mt-3 text-sm text-primary hover:underline font-body"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Audio Player */}
      {currentAudio && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl px-4 py-3 md:py-4">
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={playNext}
            muted={muted}
            preload="metadata"
          />
          <div className="max-w-4xl mx-auto flex items-center gap-3 md:gap-5">
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-sm md:text-base text-foreground truncate">
                {currentAudio.name}
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <button onClick={playPrev} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
              </button>
              <button onClick={playNext} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
              <span className="text-xs text-muted-foreground font-mono w-10 text-right">{formatTime(progress)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={handleSeek}
                className="flex-1 h-1.5 rounded-full accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground font-mono w-10">{formatTime(duration)}</span>
            </div>
            <button
              onClick={() => setMuted(!muted)}
              className="hidden md:block p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
          <div className="md:hidden mt-2">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 rounded-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      {viewingPdf && viewingPdf.viewUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-foreground/95 animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-card/10 backdrop-blur-sm border-b border-border/20">
            <div className="min-w-0 flex-1 mr-3">
              <h3 className="font-heading font-bold text-sm md:text-base text-background truncate">
                {viewingPdf.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={viewingPdf.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 md:p-2.5 rounded-lg bg-background/10 hover:bg-background/20 text-background transition-colors"
              >
                <Download className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <button
                onClick={() => setViewingPdf(null)}
                className="p-2 md:p-2.5 rounded-lg bg-destructive/80 hover:bg-destructive text-destructive-foreground transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
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
