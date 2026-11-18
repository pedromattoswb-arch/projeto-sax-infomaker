import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  BadgeCheck,
  Headphones,
  ArrowRight,
  Clock,
  Disc3,
  Menu,
  X,
  Check,
  ChevronDown,
} from "lucide-react";
import type { SaxChoice } from "../../funnel.config";
import { audioEngine } from "../../audio/AudioEngine";

interface StudioTrack {
  id: string;
  title: string;
  artist: string;
  genre: "Pop & Romântico" | "MPB & Brasil" | "Rock & Jazz" | "Gospel";
  src: string;
  bpm: string;
  coverGradient: string;
  accentHex: string;
}

const STUDIO_TRACKS: StudioTrack[] = [
  { id: "careless-whisper", title: "Careless Whisper", artist: "George Michael", genre: "Pop & Romântico", src: "/playbacks/careless-whisper.mp3", bpm: "Sax Solo Clássico", coverGradient: "from-[#9333ea] via-[#be185d] to-[#4c0519]", accentHex: "#ec4899" },
  { id: "your-latest-trick", title: "Your Latest Trick", artist: "Dire Straits", genre: "Rock & Jazz", src: "/playbacks/your-latest-trick.mp3", bpm: "Groove Estúdio", coverGradient: "from-[#d97706] via-[#92400e] to-[#1c1917]", accentHex: "#f59e0b" },
  { id: "sozinho", title: "Sozinho", artist: "Caetano Veloso", genre: "MPB & Brasil", src: "/playbacks/sozinho.mp3", bpm: "Balada MPB", coverGradient: "from-[#059669] via-[#065f46] to-[#022c22]", accentHex: "#10b981" },
  { id: "dancing-queen", title: "Dancing Queen", artist: "ABBA", genre: "Pop & Romântico", src: "/playbacks/dancing-queen.mp3", bpm: "Pop Internacional", coverGradient: "from-[#2563eb] via-[#1e40af] to-[#0f172a]", accentHex: "#3b82f6" },
  { id: "endless-love", title: "Endless Love", artist: "Lionel Richie & Diana Ross", genre: "Pop & Romântico", src: "/playbacks/endless-love.mp3", bpm: "Casamento & Eventos", coverGradient: "from-[#e11d48] via-[#881337] to-[#1f0910]", accentHex: "#f43f5e" },
  { id: "alguem-me-disse", title: "Alguém Me Disse", artist: "Alcione", genre: "MPB & Brasil", src: "/playbacks/alguem-me-disse.mp3", bpm: "Bolero & Samba-Canção", coverGradient: "from-[#ca8a04] via-[#713f12] to-[#1c1306]", accentHex: "#eab308" },
  { id: "estranha-loucura", title: "Estranha Loucura", artist: "Alcione", genre: "MPB & Brasil", src: "/playbacks/estranha-loucura.mp3", bpm: "Clássico Brasileiro", coverGradient: "from-[#ea580c] via-[#7c2d12] to-[#1a0b05]", accentHex: "#f97316" },
  { id: "boate-azul", title: "Boate Azul", artist: "Clássico Sertanejo", genre: "MPB & Brasil", src: "/playbacks/boate-azul.mp3", bpm: "Seresta & Sax", coverGradient: "from-[#0284c7] via-[#075985] to-[#082f49]", accentHex: "#38bdf8" },
  { id: "tan-enamorados", title: "Tan Enamorados", artist: "Ricardo Montaner", genre: "Pop & Romântico", src: "/playbacks/tan-enamorados.mp3", bpm: "Romântico Latino", coverGradient: "from-[#c026d3] via-[#701a75] to-[#240626]", accentHex: "#d946ef" },
  { id: "espirito-espirito", title: "Espírito, Espírito", artist: "Louvor & Adoração", genre: "Gospel", src: "/playbacks/espirito-espirito.mp3", bpm: "Harpa & Louvor", coverGradient: "from-[#16a34a] via-[#14532d] to-[#052e16]", accentHex: "#22c55e" },
  { id: "tudo-e-possivel", title: "Tudo É Possível", artist: "Davi Sacer", genre: "Gospel", src: "/playbacks/tudo-e-possivel.mp3", bpm: "Adoração", coverGradient: "from-[#0d9488] via-[#115e59] to-[#042f2e]", accentHex: "#14b8a6" },
  { id: "amigo-de-deus", title: "Amigo de Deus", artist: "Trazendo a Arca", genre: "Gospel", src: "/playbacks/amigo-de-deus.mp3", bpm: "Louvor Congregacional", coverGradient: "from-[#4f46e5] via-[#312e81] to-[#0f0d2e]", accentHex: "#818cf8" },
];

const GENRE_FILTERS = ["Todos", "Pop & Romântico", "MPB & Brasil", "Rock & Jazz", "Gospel"] as const;
type GenreFilter = (typeof GENRE_FILTERS)[number];

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

interface OfferPlaybackPlayerProps {
  sax: SaxChoice;
  onScrollToPlans: () => void;
}

export const OfferPlaybackPlayer = ({ sax, onScrollToPlans }: OfferPlaybackPlayerProps) => {
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>("Todos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<StudioTrack>(STUDIO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [durationsMap, setDurationsMap] = useState<Record<string, number>>({});
  const [volume, setVolume] = useState(0.9);
  const [muted, setMuted] = useState(false);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({
    "careless-whisper": true,
    "your-latest-trick": true,
  });
  const [shuffle, setShuffle] = useState(false);
  const [repeatOne, setRepeatOne] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const filteredTracks =
    selectedGenre === "Todos"
      ? STUDIO_TRACKS
      : STUDIO_TRACKS.filter((t) => t.genre === selectedGenre);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileMenuOpen]);

  const countForGenre = (g: GenreFilter) =>
    g === "Todos" ? STUDIO_TRACKS.length : STUDIO_TRACKS.filter((t) => t.genre === g).length;

  const playSpecificTrack = useCallback(
    (track: StudioTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Garante que o áudio de fundo do funil não sobreponha os playbacks
      audioEngine.stopComparison();

      if (currentTrack.id === track.id) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          if (!audio.src || !audio.src.endsWith(track.src)) {
            audio.src = track.src;
          }
          audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
        return;
      }

      setCurrentTrack(track);
      setCurrentTime(0);
      audio.src = track.src;
      audio.volume = muted ? 0 : volume;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    },
    [currentTrack.id, isPlaying, muted, volume]
  );

  const handleNext = useCallback(() => {
    const list = filteredTracks.length > 0 ? filteredTracks : STUDIO_TRACKS;
    if (shuffle && list.length > 1) {
      const others = list.filter((t) => t.id !== currentTrack.id);
      playSpecificTrack(others[Math.floor(Math.random() * others.length)]);
      return;
    }
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    playSpecificTrack(list[(idx + 1) % list.length]);
  }, [currentTrack.id, filteredTracks, playSpecificTrack, shuffle]);

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const list = filteredTracks.length > 0 ? filteredTracks : STUDIO_TRACKS;
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    playSpecificTrack(list[(idx - 1 + list.length) % list.length]);
  }, [currentTrack.id, filteredTracks, playSpecificTrack]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <section id="offer-playbacks" className="py-12 md:py-20 px-4 sm:px-6 relative z-10">
      <audio
        ref={audioRef}
        src={STUDIO_TRACKS[0].src}
        preload="none"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          setDuration(d);
          setDurationsMap((prev) => ({ ...prev, [currentTrack.id]: d }));
        }}
        onEnded={() => {
          if (repeatOne && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          } else {
            handleNext();
          }
        }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1ed760]/12 border border-[#1ed760]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#1ed760] mb-4">
            <Headphones className="w-4 h-4 shrink-0" />
            <span>Experiência Sonora Hi-Fi • Estilo Spotify</span>
          </div>

          <h2 className="jazz-h2 text-white mb-3 jazz-reveal">
            Dê Play nos <span className="jazz-gold-text italic">Playbacks de Estúdio</span>
          </h2>

          <p className="jazz-body text-[#cdc3b2] max-w-2xl mx-auto">
            Banda real masterizada em estúdio! No aplicativo, você abre a partitura para{" "}
            <strong className="text-white">
              {sax === "alto" ? "Sax Alto (Eb)" : "Sax Tenor (Bb)"}
            </strong>{" "}
            (com ambos inclusos) e dá play no acompanhamento na mesma tela.
          </p>
        </div>

        <div className="rounded-3xl border border-white/12 bg-[#0c0c10] shadow-[0_28px_70px_rgba(0,0,0,0.9)]">
          {/* Now Playing Header */}
          <div
            className="rounded-t-3xl p-4 sm:p-7 transition-colors duration-500"
            style={{
              background: `linear-gradient(180deg, ${currentTrack.accentHex}34 0%, rgba(16, 16, 20, 0.96) 88%, #0c0c10 100%)`,
            }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8">
              <div className="relative flex items-center justify-center shrink-0">
                <div
                  className={`relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br ${currentTrack.coverGradient} p-3 flex flex-col justify-between shadow-2xl border border-white/20`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/45 text-[#f5d58a] px-2 py-0.5 rounded-full truncate">
                      Clube do Sax
                    </span>
                    <Disc3 className={`w-4 h-4 text-white/80 shrink-0 ${isPlaying ? "animate-spin" : ""}`} />
                  </div>
                  <span className="text-3xl sm:text-4xl text-center">🎷</span>
                  <p className="text-xs font-black text-white truncate">{currentTrack.title}</p>
                </div>
              </div>

              <div className="flex-1 min-w-0 text-center md:text-left w-full">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 mb-1">
                  <BadgeCheck className="w-4 h-4 text-[#1ed760] shrink-0" />
                  <span>Playlist Oficial de Estúdio • Master 320kbps</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white truncate mb-1">
                  {currentTrack.title}
                </h3>
                <p className="text-sm text-white/80 font-medium mb-4">
                  {currentTrack.artist} • <span className="text-[#f5d58a]">{currentTrack.bpm}</span> •{" "}
                  <span className="text-[#1ed760] font-semibold">
                    Partitura {sax === "alto" ? "Alto Eb" : "Tenor Bb"}
                  </span>
                </p>

                <div className="bg-black/50 border border-white/10 rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center justify-center md:justify-start gap-2 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => setShuffle(!shuffle)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
                          shuffle ? "text-[#1ed760] bg-[#1ed760]/10" : "text-white/60 hover:text-white"
                        }`}
                        aria-label="Modo aleatório"
                        aria-pressed={shuffle}
                      >
                        <Shuffle className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
                        aria-label="Faixa anterior"
                      >
                        <SkipBack className="w-5 h-5" fill="currentColor" />
                      </button>
                      <button
                        type="button"
                        onClick={() => playSpecificTrack(currentTrack)}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1ed760] hover:bg-[#23eb6b] text-black flex items-center justify-center shadow-[0_8px_24px_rgba(30,215,96,0.48)] cursor-pointer shrink-0"
                        aria-label={isPlaying ? "Pausar playback" : "Tocar playback"}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-0.5" fill="currentColor" />}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/85 hover:text-white cursor-pointer"
                        aria-label="Próxima faixa"
                      >
                        <SkipForward className="w-5 h-5" fill="currentColor" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setRepeatOne(!repeatOne)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${
                          repeatOne ? "text-[#1ed760] bg-[#1ed760]/10" : "text-white/60 hover:text-white"
                        }`}
                        aria-label="Repetir música"
                        aria-pressed={repeatOne}
                      >
                        <Repeat className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = !muted;
                          setMuted(next);
                          if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
                        }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white/75 hover:text-white cursor-pointer"
                        aria-label={muted ? "Ativar som" : "Silenciar"}
                      >
                        {muted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={muted ? 0 : volume}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setVolume(v);
                          setMuted(v === 0);
                          if (audioRef.current) audioRef.current.volume = v;
                        }}
                        aria-label="Volume do player"
                        className="w-20 accent-[#1ed760] h-1.5 bg-white/20 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-white/65 tabular-nums w-9 text-right shrink-0">
                      {formatTime(currentTime)}
                    </span>
                    <div
                      onClick={handleSeek}
                      role="slider"
                      aria-label="Progresso da música"
                      aria-valuemin={0}
                      aria-valuemax={Math.round(duration) || 100}
                      aria-valuenow={Math.round(currentTime)}
                      tabIndex={0}
                      className="flex-1 h-2.5 bg-white/15 rounded-full cursor-pointer relative flex items-center"
                    >
                      <div className="h-full rounded-full bg-[#1ed760]" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-white/65 tabular-nums w-9 shrink-0">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Mobile Hamburger Genre Filter (Zero Lateral Scroll!) + Desktop Wrapped Pills */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <div ref={menuRef} className="relative md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-expanded={mobileMenuOpen}
                  aria-haspopup="menu"
                  className="min-h-[44px] w-full flex items-center justify-between gap-2.5 rounded-xl bg-white/[0.08] border border-white/15 px-3.5 py-2.5 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    {mobileMenuOpen ? <X className="w-4 h-4 text-[#1ed760]" /> : <Menu className="w-4 h-4 text-[#1ed760]" />}
                    <span className="text-xs font-semibold text-white/70">Estilo:</span>
                    <span className="text-sm font-extrabold text-white truncate">
                      {selectedGenre} ({countForGenre(selectedGenre)})
                    </span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white/70 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileMenuOpen && (
                  <div
                    role="menu"
                    aria-label="Filtrar estilo musical"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 rounded-2xl bg-[#16161c] border border-white/15 shadow-2xl p-1.5 space-y-1"
                  >
                    {GENRE_FILTERS.map((g) => {
                      const active = selectedGenre === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          role="menuitemradio"
                          aria-checked={active}
                          onClick={() => {
                            setSelectedGenre(g);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-bold cursor-pointer ${
                            active ? "bg-[#1ed760] text-[#041d0c]" : "text-white/85 hover:bg-white/[0.07]"
                          }`}
                        >
                          <span>{g}</span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold">
                            <span>{countForGenre(g)} faixas</span>
                            {active && <Check className="w-4 h-4" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="hidden md:flex flex-wrap items-center gap-2">
                {GENRE_FILTERS.map((g) => {
                  const active = selectedGenre === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGenre(g)}
                      className={`min-h-[40px] px-4 py-2 rounded-full text-sm font-extrabold cursor-pointer ${
                        active ? "bg-[#1ed760] text-[#041d0c]" : "bg-white/[0.07] text-white/80 hover:bg-white/[0.14]"
                      }`}
                    >
                      {g} ({countForGenre(g)})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed Track List (Zero internal vertical scroll) */}
          <div className="px-2 sm:px-6 pt-2 pb-5">
            <div className="grid grid-cols-[28px_minmax(0,1fr)_auto] lg:hidden items-center gap-2.5 px-2.5 py-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/45">
              <span className="text-center">#</span>
              <span>Música & Artista</span>
              <span className="flex justify-end pr-1">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-4 divide-y lg:divide-y-0 divide-white/[0.05] mt-1">
              {filteredTracks.map((track, index) => {
                const isCurrent = currentTrack.id === track.id;
                const activePlaying = isCurrent && isPlaying;
                const isLiked = !!likedIds[track.id];
                const knownDur = durationsMap[track.id];

                return (
                  <div
                    key={track.id}
                    onClick={() => playSpecificTrack(track)}
                    className={`group grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer transition-colors lg:border-b lg:border-white/[0.05] ${
                      isCurrent ? "bg-white/[0.1]" : "hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className={`text-xs font-bold text-center tabular-nums ${isCurrent ? "text-[#1ed760]" : "text-white/55"}`}>
                      {activePlaying ? "▶" : index + 1}
                    </span>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${track.coverGradient} flex items-center justify-center shrink-0 border border-white/15`}>
                        <span className="text-xs">🎷</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold truncate leading-snug ${isCurrent ? "text-[#1ed760]" : "text-white"}`}>
                          {track.title}
                        </p>
                        <p className="text-xs text-white/60 truncate">
                          {track.artist} • {track.genre}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLikedIds((prev) => ({ ...prev, [track.id]: !prev[track.id] }));
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer"
                        aria-label={`Favoritar ${track.title}`}
                        aria-pressed={isLiked}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? "text-[#1ed760] fill-[#1ed760]" : "text-white/40"}`} />
                      </button>
                      <span className={`text-xs font-bold tabular-nums min-w-[44px] text-right ${activePlaying ? "text-[#1ed760]" : "text-white/65"}`}>
                        {knownDur ? formatTime(knownDur) : activePlaying ? "Ativo" : "Ouvir"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-b-3xl bg-[#121218] border-t border-white/10 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/80 text-center sm:text-left">
              🎧 Isso é apenas <strong className="text-white">uma pequena amostra</strong> — no app são{" "}
              <strong className="text-[#1ed760]">+10.000 partituras com playback</strong> prontas para tocar!
            </p>
            <button
              type="button"
              onClick={onScrollToPlans}
              className="jazz-cta-primary w-full sm:w-auto px-6 py-3 rounded-full text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Ativar meu acervo</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
