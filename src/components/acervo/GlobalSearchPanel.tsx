import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, X, Mic, MicOff, Folder, FileText, Music, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import type { DriveFolder, DriveFile } from "@/hooks/useDriveFiles";

interface GlobalSearchPanelProps {
  open: boolean;
  onClose: () => void;
  folders: DriveFolder[];
  files: DriveFile[];
  onFolderOpen: (folder: DriveFolder) => void;
  onFileOpen: (file: DriveFile) => void;
  onPlayAudio: (file: DriveFile) => void;
}

const SUGGESTIONS = [
  "Careless Whisper",
  "Dancing Queen",
  "Gospel",
  "Jazz",
  "Bossa Nova",
  "Hallelujah",
  "Casamento",
];

const SEARCH_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/search-drive`;

const GlobalSearchPanel: React.FC<GlobalSearchPanelProps> = ({
  open,
  onClose,
  onFolderOpen,
  onFileOpen,
  onPlayAudio,
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchFolders, setSearchFolders] = useState<DriveFolder[]>([]);
  const [searchFiles, setSearchFiles] = useState<DriveFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const abortRef = useRef<AbortController | null>(null);

  // Check voice support
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setDebouncedQuery("");
      setSearchFolders([]);
      setSearchFiles([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      stopListening();
    }
  }, [open]);

  // Debounce
  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  // Recursive search via edge function
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setSearchFolders([]);
      setSearchFiles([]);
      setSearching(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSearching(true);

    fetch(`${SEARCH_URL}?q=${encodeURIComponent(q)}`, {
      signal: controller.signal,
      headers: {
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
    })
      .then(res => res.json())
      .then((data: { folders?: DriveFolder[]; files?: DriveFile[] }) => {
        if (!controller.signal.aborted) {
          setSearchFolders(data.folders || []);
          setSearchFiles(data.files || []);
          setSearching(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
          setSearching(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setQuery(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const q = debouncedQuery.toLowerCase().trim();
  const hasQuery = q.length > 0;

  const matchedFolders = searchFolders;
  const matchedPdfs = useMemo(() => searchFiles.filter((f) => f.type === "pdf"), [searchFiles]);
  const matchedAudio = useMemo(() => searchFiles.filter((f) => f.type === "audio"), [searchFiles]);
  const totalResults = useMemo(() => matchedFolders.length + matchedPdfs.length + matchedAudio.length, [matchedFolders.length, matchedPdfs.length, matchedAudio.length]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Painel de busca"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Fale ou digite o nome da música, pasta ou gênero..."
            className="flex-1 bg-transparent text-base md:text-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[48px]"
            aria-label="Campo de busca"
          />
          {voiceSupported && (
            <button
              onClick={isListening ? stopListening : startListening}
              className={`shrink-0 p-2.5 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isListening
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
              aria-label={isListening ? "Parar gravação de voz" : "Buscar por voz"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={onClose}
            className="shrink-0 p-2.5 rounded-xl bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Fechar busca"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {isListening && (
          <div className="max-w-3xl mx-auto px-4 pb-3">
            <div className="flex items-center gap-2 text-destructive text-xs font-body font-bold">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              Ouvindo... fale o nome da música
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto" aria-live="polite">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Empty state — suggestions */}
          {!hasQuery && (
            <div className="text-center py-8">
              <Sparkles className="w-10 h-10 text-primary/30 mx-auto mb-4" />
              <p className="text-base font-body font-bold text-foreground mb-2">
                O que você quer tocar hoje?
              </p>
              <p className="text-sm text-muted-foreground font-body mb-6">
                Digite o nome da música, artista ou gênero musical
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-body font-semibold hover:bg-muted/70 hover:text-foreground transition-colors min-h-[40px]"
                  >
                    {s}
                  </button>
                ))}
              </div>
              {voiceSupported && (
                <button
                  onClick={startListening}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-muted text-foreground font-body font-bold text-sm hover:bg-muted/70 transition-colors min-h-[48px]"
                >
                  <Mic className="w-5 h-5 text-muted-foreground" />
                  Buscar por Voz
                </button>
              )}
            </div>
          )}

          {/* Loading */}
          {hasQuery && searching && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground font-body">
                Buscando em todo o acervo...
              </p>
            </div>
          )}

          {/* No results */}
          {hasQuery && !searching && totalResults === 0 && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-base font-body font-bold text-foreground mb-2">
                Nenhum resultado para "{debouncedQuery}"
              </p>
              <p className="text-sm text-muted-foreground font-body mb-4">
                Tente buscar por outro nome ou gênero musical
              </p>
              <button
                onClick={() => setQuery("")}
                className="px-5 py-2.5 rounded-xl bg-muted text-foreground font-body font-bold text-sm hover:bg-muted/80 transition-colors min-h-[44px]"
              >
                Limpar busca
              </button>
            </div>
          )}

          {/* Folders */}
          {matchedFolders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                <Folder className="w-4 h-4 text-primary" />
                Pastas ({matchedFolders.length})
              </h3>
              <div className="flex flex-col gap-2">
                {matchedFolders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => {
                      onFolderOpen(folder);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all text-left w-full min-h-[52px]"
                    aria-label={`Abrir pasta ${folder.name}`}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Folder className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-body font-bold text-sm text-foreground break-words flex-1">
                      {folder.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Partituras */}
          {matchedPdfs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                Partituras ({matchedPdfs.length})
              </h3>
              <div className="flex flex-col gap-2">
                {matchedPdfs.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      onFileOpen(file);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border border-l-4 border-l-destructive hover:shadow-md transition-all text-left w-full min-h-[52px]"
                    aria-label={`Ver partitura ${file.name}`}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body font-bold text-sm text-foreground break-words leading-snug">
                        {file.name}
                      </p>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-destructive">
                        Partitura
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Playbacks */}
          {matchedAudio.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                Playbacks ({matchedAudio.length})
              </h3>
              <div className="flex flex-col gap-2">
                {matchedAudio.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      onPlayAudio(file);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border border-l-4 border-l-primary hover:shadow-md transition-all text-left w-full min-h-[52px]"
                    aria-label={`Ouvir playback ${file.name}`}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-body font-bold text-sm text-foreground break-words leading-snug">
                        {file.name}
                      </p>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        Playback
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchPanel;
