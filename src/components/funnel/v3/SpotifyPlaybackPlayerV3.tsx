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
import type { SaxType } from "./SaxThematicEffects";

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
  {
    id: "careless-whisper",
    title: "Careless Whisper",
    artist: "George Michael",
    genre: "Pop & Romântico",
    src: "/playbacks/careless-whisper.mp3",
    bpm: "Sax Solo Clássico",
    coverGradient: "from-[#9333ea] via-[#be185d] to-[#4c0519]",
    accentHex: "#ec4899",
  },
  {
    id: "your-latest-trick",
    title: "Your Latest Trick",
    artist: "Dire Straits",
    genre: "Rock & Jazz",
    src: "/playbacks/your-latest-trick.mp3",
    bpm: "Groove Estúdio",
    coverGradient: "from-[#d97706] via-[#92400e] to-[#1c1917]",
    accentHex: "#f59e0b",
  },
  {
    id: "sozinho",
    title: "Sozinho",
    artist: "Caetano Veloso",
    genre: "MPB & Brasil",
    src: "/playbacks/sozinho.mp3",
    bpm: "Balada MPB",
    coverGradient: "from-[#059669] via-[#065f46] to-[#022c22]",
    accentHex: "#10b981",
  },
  {
    id: "dancing-queen",
    title: "Dancing Queen",
    artist: "ABBA",
    genre: "Pop & Romântico",
    src: "/playbacks/dancing-queen.mp3",
    bpm: "Pop Internacional",
    coverGradient: "from-[#2563eb] via-[#1e40af] to-[#0f172a]",
    accentHex: "#3b82f6",
  },
  {
    id: "endless-love",
    title: "Endless Love",
    artist: "Lionel Richie & Diana Ross",
    genre: "Pop & Romântico",
    src: "/playbacks/endless-love.mp3",
    bpm: "Casamento & Eventos",
    coverGradient: "from-[#e11d48] via-[#881337] to-[#1f0910]",
    accentHex: "#f43f5e",
  },
  {
    id: "alguem-me-disse",
    title: "Alguém Me Disse",
    artist: "Alcione",
    genre: "MPB & Brasil",
    src: "/playbacks/alguem-me-disse.mp3",
    bpm: "Bolero & Samba-Canção",
    coverGradient: "from-[#ca8a04] via-[#713f12] to-[#1c1306]",
    accentHex: "#eab308",
  },
  {
    id: "estranha-loucura",
    title: "Estranha Loucura",
    artist: "Alcione",
    genre: "MPB & Brasil",
    src: "/playbacks/estranha-loucura.mp3",
    bpm: "Clássico Brasileiro",
    coverGradient: "from-[#ea580c] via-[#7c2d12] to-[#1a0b05]",
    accentHex: "#f97316",
  },
  {
    id: "boate-azul",
    title: "Boate Azul",
    artist: "Clássico Sertanejo",
    genre: "MPB & Brasil",
    src: "/playbacks/boate-azul.mp3",
    bpm: "Seresta & Sax",
    coverGradient: "from-[#0284c7] via-[#075985] to-[#082f49]",
    accentHex: "#38bdf8",
  },
  {
    id: "tan-enamorados",
    title: "Tan Enamorados",
    artist: "Ricardo Montaner",
    genre: "Pop & Romântico",
    src: "/playbacks/tan-enamorados.mp3",
    bpm: "Romântico Latino",
    coverGradient: "from-[#c026d3] via-[#701a75] to-[#240626]",
    accentHex: "#d946ef",
  },
  {
    id: "espirito-espirito",
    title: "Espírito, Espírito",
    artist: "Louvor & Adoração",
    genre: "Gospel",
    src: "/playbacks/espirito-espirito.mp3",
    bpm: "Harpa & Louvor",
    coverGradient: "from-[#16a34a] via-[#14532d] to-[#052e16]",
    accentHex: "#22c55e",
  },
  {
    id: "tudo-e-possivel",
    title: "Tudo É Possível",
    artist: "Davi Sacer",
    genre: "Gospel",
    src: "/playbacks/tudo-e-possivel.mp3",
    bpm: "Adoração",
    coverGradient: "from-[#0d9488] via-[#115e59] to-[#042f2e]",
    accentHex: "#14b8a6",
  },
  {
    id: "amigo-de-deus",
    title: "Amigo de Deus",
    artist: "Trazendo a Arca",
    genre: "Gospel",
    src: "/playbacks/amigo-de-deus.mp3",
    bpm: "Louvor Congregacional",
    coverGradient: "from-[#4f46e5] via-[#312e81] to-[#0f0d2e]",
    accentHex: "#818cf8",
  },
];

const GENRE_FILTERS = [
  "Todos",
  "Pop & Romântico",
  "MPB & Brasil",
  "Rock & Jazz",
  "Gospel",
] as const;

type GenreFilter = (typeof GENRE_FILTERS)[number];

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

interface SpotifyPlaybackPlayerV3Props {
  saxType: SaxType;
  onScrollToOffers: () => void;
}

const SpotifyPlaybackPlayerV3 = ({
  saxType,
  onScrollToOffers,
}: SpotifyPlaybackPlayerV3Props) => {
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
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Close compact mobile hamburger menu when tapping outside or pressing Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [mobileMenuOpen]);

  const countForGenre = (g: GenreFilter) =>
    g === "Todos" ? STUDIO_TRACKS.length : STUDIO_TRACKS.filter((t) => t.genre === g).length;

  const playSpecificTrack = useCallback(
    (track: StudioTrack) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (currentTrack.id === track.id) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          if (!audio.src || !audio.src.endsWith(track.src)) {
            audio.src = track.src;
          }
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
        return;
      }

      setCurrentTrack(track);
      setCurrentTime(0);
      audio.src = track.src;
      audio.volume = muted ? 0 : volume;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    },
    [currentTrack.id, isPlaying, muted, volume]
  );

  const handleNext = useCallback(() => {
    const list = filteredTracks.length > 0 ? filteredTracks : STUDIO_TRACKS;
    if (shuffle && list.length > 1) {
      const others = list.filter((t) => t.id !== currentTrack.id);
      const randomTrack = others[Math.floor(Math.random() * others.length)];
      playSpecificTrack(randomTrack);
      return;
    }
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    const nextTrack = list[(idx + 1) % list.length];
    playSpecificTrack(nextTrack);
  }, [currentTrack.id, filteredTracks, playSpecificTrack, shuffle]);

  const handlePrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const list = filteredTracks.length > 0 ? filteredTracks : STUDIO_TRACKS;
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    const prevTrack = list[(idx - 1 + list.length) % list.length];
    playSpecificTrack(prevTrack);
  }, [currentTrack.id, filteredTracks, playSpecificTrack]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const nextTime = ratio * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setMuted(v === 0);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <section id="playbacks" className="sax-section">
      {/* Single Master HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={STUDIO_TRACKS[0].src}
        preload="metadata"
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

      <div className="sax-container max-w-5xl">
        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1ed760]/12 border border-[#1ed760]/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#1ed760] mb-4">
            <Headphones className="w-4 h-4 shrink-0" />
            <span>Experiência Sonora Hi-Fi • Estilo Spotify</span>
          </div>

          <h2 className="sax-h2 text-white mb-3">
            Dê Play nos <span className="sax-gold-gradient-text italic">Playbacks de Estúdio</span>
          </h2>

          <p className="sax-body-lg text-[#cfc3ae] max-w-2xl mx-auto">
            Banda real masterizada em estúdio! No aplicativo, você abre a partitura para{" "}
            <strong className="text-white">
              {saxType === "alto" ? "Sax Alto (Eb)" : "Sax Tenor (Bb)"}
            </strong>{" "}
            e dá play no acompanhamento na mesma tela.
          </p>
        </div>

        {/* SPOTIFY PREMIUM CONTAINER — 100% FIXED, ZERO INTERNAL OR HORIZONTAL SCROLL */}
        <div className="rounded-3xl sm:rounded-[28px] border border-white/12 bg-[#0c0c0e] shadow-[0_28px_70px_rgba(0,0,0,0.9)]">
          {/* TOP SPOTIFY FEATURED NOW-PLAYING HEADER */}
          <div
            className="relative rounded-t-3xl sm:rounded-t-[28px] p-4 sm:p-7 md:p-8 transition-colors duration-500"
            style={{
              background: `linear-gradient(180deg, ${currentTrack.accentHex}38 0%, rgba(18, 18, 20, 0.96) 88%, #0c0c0e 100%)`,
            }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8">
              {/* Album Cover + Peeking Spinning Vinyl Disc (Fluid 320px-safe dimensions) */}
              <div className="relative flex items-center justify-center shrink-0">
                <div
                  className={`w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-zinc-900 via-black to-zinc-800 border-2 border-[#f5b942]/35 shadow-2xl flex items-center justify-center -mr-10 sm:-mr-14 z-0 transition-transform duration-500 ${
                    isPlaying ? "animate-sax-vinyl translate-x-3 sm:translate-x-4" : "translate-x-1"
                  }`}
                  aria-hidden="true"
                >
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-white/10 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#ffe299] to-[#b87914] flex items-center justify-center shadow-inner">
                      <div className="w-2.5 h-2.5 rounded-full bg-black" />
                    </div>
                  </div>
                </div>

                {/* Main Album Sleeve */}
                <div
                  className={`relative z-10 w-28 h-28 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br ${currentTrack.coverGradient} p-3 sm:p-4 flex flex-col justify-between shadow-[0_18px_44px_rgba(0,0,0,0.75)] border border-white/20 overflow-hidden`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/45 text-[#ffe299] px-2 py-0.5 rounded-full truncate">
                      Clube do Sax
                    </span>
                    <Disc3
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 shrink-0 ${
                        isPlaying ? "animate-spin" : ""
                      }`}
                    />
                  </div>

                  <div className="my-auto text-center">
                    <span className="text-3xl sm:text-5xl drop-shadow-lg block">🎷</span>
                  </div>

                  <div className="text-left">
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider truncate">
                      {currentTrack.genre}
                    </p>
                    <p className="text-xs font-black font-heading text-white truncate">
                      {currentTrack.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Playlist / Now Playing Metadata */}
              <div className="flex-1 min-w-0 text-center md:text-left w-full">
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/90 mb-1">
                  <BadgeCheck className="w-4 h-4 text-[#1ed760] shrink-0" />
                  <span>Playlist Oficial de Estúdio • Master 320kbps</span>
                </div>

                <h3 className="text-xl sm:text-3xl md:text-4xl font-black font-heading text-white tracking-tight truncate mb-1">
                  {currentTrack.title}
                </h3>

                <p className="text-sm sm:text-base text-white/80 font-medium mb-4">
                  {currentTrack.artist} •{" "}
                  <span className="text-[#ffe49e]">{currentTrack.bpm}</span> •{" "}
                  <span className="text-[#1ed760] font-semibold">
                    Partitura {saxType === "alto" ? "Alto Eb" : "Tenor Bb"}
                  </span>
                </p>

                {/* MASTER TRANSPORT CONTROLS + SCRUBBER BAR */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 sm:gap-4 mb-3">
                    <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-3 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => setShuffle(!shuffle)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
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
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/85 hover:text-white transition-colors active:scale-95 cursor-pointer"
                        aria-label="Faixa anterior"
                      >
                        <SkipBack className="w-5 h-5" fill="currentColor" />
                      </button>

                      <button
                        type="button"
                        onClick={() => playSpecificTrack(currentTrack)}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1ed760] hover:bg-[#23eb6b] text-black flex items-center justify-center shadow-[0_8px_24px_rgba(30,215,96,0.48)] active:scale-95 transition-all cursor-pointer shrink-0"
                        aria-label={isPlaying ? "Pausar playback" : "Tocar playback"}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" fill="currentColor" />
                        ) : (
                          <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/85 hover:text-white transition-colors active:scale-95 cursor-pointer"
                        aria-label="Próxima faixa"
                      >
                        <SkipForward className="w-5 h-5" fill="currentColor" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setRepeatOne(!repeatOne)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          repeatOne ? "text-[#1ed760] bg-[#1ed760]/10" : "text-white/60 hover:text-white"
                        }`}
                        aria-label="Repetir música"
                        aria-pressed={repeatOne}
                      >
                        <Repeat className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Desktop Equalizer + Volume */}
                    <div className="hidden md:flex items-center gap-3">
                      <div
                        className="flex items-end gap-[3px] h-4 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10"
                        aria-hidden="true"
                      >
                        <span
                          className={`w-[3px] rounded-full bg-[#1ed760] ${
                            isPlaying ? "animate-sax-eq-1" : "h-1.5 opacity-40"
                          }`}
                        />
                        <span
                          className={`w-[3px] rounded-full bg-[#1ed760] ${
                            isPlaying ? "animate-sax-eq-2" : "h-2.5 opacity-40"
                          }`}
                        />
                        <span
                          className={`w-[3px] rounded-full bg-[#1ed760] ${
                            isPlaying ? "animate-sax-eq-3" : "h-1 opacity-40"
                          }`}
                        />
                        <span
                          className={`w-[3px] rounded-full bg-[#1ed760] ${
                            isPlaying ? "animate-sax-eq-4" : "h-2 opacity-40"
                          }`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white/75 hover:text-white transition-colors cursor-pointer"
                        aria-label={muted ? "Ativar som" : "Silenciar"}
                      >
                        {muted || volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={muted ? 0 : volume}
                        onChange={handleVolumeChange}
                        aria-label="Volume do player"
                        className="w-20 accent-[#1ed760] h-1.5 bg-white/20 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Interactive Scrubbing Progress Bar */}
                  <div className="flex items-center gap-2.5 sm:gap-3">
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
                      className="group flex-1 h-2.5 bg-white/15 rounded-full cursor-pointer relative flex items-center"
                    >
                      <div
                        className="h-full rounded-full bg-[#1ed760] group-hover:bg-[#2bf074] transition-[width] duration-100 relative"
                        style={{ width: `${progressPct}%` }}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-white shadow-md absolute -right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-white/65 tabular-nums w-9 shrink-0">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* GENRE NAVIGATION: COMPACT PRACTICAL HAMBURGER ON MOBILE (NO HORIZONTAL SCROLL!) + WRAPPED PILLS ON DESKTOP */}
            <div className="mt-5 pt-4 border-t border-white/10">
              {/* Mobile Compact Hamburger Menu (< 768px) */}
              <div ref={menuContainerRef} className="relative md:hidden">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    aria-expanded={mobileMenuOpen}
                    aria-haspopup="menu"
                    className="min-h-[44px] flex-1 flex items-center justify-between gap-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 px-3.5 py-2.5 text-left transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      {mobileMenuOpen ? (
                        <X className="w-4 h-4 text-[#1ed760] shrink-0" />
                      ) : (
                        <Menu className="w-4 h-4 text-[#1ed760] shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-white/70 shrink-0">Estilo:</span>
                      <span className="text-sm font-extrabold text-white truncate">
                        {selectedGenre} ({countForGenre(selectedGenre)})
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/70 shrink-0 transition-transform duration-200 ${
                        mobileMenuOpen ? "rotate-180 text-[#1ed760]" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Compact Floating Dropdown Menu — Takes minimal space, zero scroll */}
                {mobileMenuOpen && (
                  <div
                    role="menu"
                    aria-label="Filtrar estilo musical"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 rounded-2xl bg-[#16161a] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.92)] p-1.5 space-y-1"
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
                          className={`w-full min-h-[42px] flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                            active
                              ? "bg-[#1ed760] text-[#041d0c]"
                              : "text-white/85 hover:bg-white/[0.07]"
                          }`}
                        >
                          <span>{g}</span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold">
                            <span className={active ? "text-[#041d0c]/80" : "text-white/45"}>
                              {countForGenre(g)} faixas
                            </span>
                            {active && <Check className="w-4 h-4" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tablet & Desktop Wrapped Pills (>= 768px — Zero horizontal scroll!) */}
              <div className="hidden md:flex md:flex-wrap items-center gap-2">
                {GENRE_FILTERS.map((g) => {
                  const active = selectedGenre === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGenre(g)}
                      className={`min-h-[40px] px-4 py-2 rounded-full text-sm font-extrabold transition-all cursor-pointer ${
                        active
                          ? "bg-[#1ed760] text-[#041d0c] shadow-[0_4px_16px_rgba(30,215,96,0.35)]"
                          : "bg-white/[0.07] text-white/80 hover:bg-white/[0.14] hover:text-white"
                      }`}
                    >
                      {g} ({countForGenre(g)})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SPOTIFY PLAYLIST TRACKLIST — 100% FIXED (NO MAX-HEIGHT, NO OVERFLOW SCROLL!) */}
          <div className="px-2 sm:px-6 pt-2 pb-5">
            {/* Column Header (Desktop single-column or mobile header) */}
            <div className="grid grid-cols-[28px_minmax(0,1fr)_auto] sm:grid-cols-[36px_minmax(0,1.5fr)_minmax(0,1fr)_84px_76px] lg:hidden items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-white/45">
              <span className="text-center">#</span>
              <span>Música & Artista</span>
              <span className="hidden sm:block">Estilo</span>
              <span className="hidden sm:block text-center">Tom</span>
              <span className="flex justify-end pr-1">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Fixed Track List: 1 column on Mobile/Tablet, clean 2-column Studio Deck on Large Desktop */}
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
                    className={`group grid grid-cols-[28px_minmax(0,1fr)_auto] sm:grid-cols-[36px_minmax(0,1.5fr)_minmax(0,1fr)_84px_76px] lg:grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2.5 rounded-xl cursor-pointer transition-colors lg:border-b lg:border-white/[0.05] ${
                      isCurrent ? "bg-white/[0.1]" : "hover:bg-white/[0.05]"
                    }`}
                  >
                    {/* # / Equalizer */}
                    <div className="flex items-center justify-center">
                      {activePlaying ? (
                        <div className="flex items-end gap-[2px] h-3.5" aria-hidden="true">
                          <span className="w-[2.5px] bg-[#1ed760] rounded-full animate-sax-eq-1" />
                          <span className="w-[2.5px] bg-[#1ed760] rounded-full animate-sax-eq-2" />
                          <span className="w-[2.5px] bg-[#1ed760] rounded-full animate-sax-eq-3" />
                        </div>
                      ) : (
                        <>
                          <span
                            className={`text-xs font-bold tabular-nums sm:group-hover:hidden ${
                              isCurrent ? "text-[#1ed760]" : "text-white/55"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <Play
                            className="w-4 h-4 text-white hidden sm:group-hover:block"
                            fill="currentColor"
                          />
                        </>
                      )}
                    </div>

                    {/* Cover + Title + Artist */}
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.coverGradient} flex items-center justify-center shrink-0 border border-white/15 shadow-sm`}
                      >
                        <span className="text-sm">🎷</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm sm:text-[15px] font-bold font-heading truncate leading-snug ${
                            isCurrent ? "text-[#1ed760]" : "text-white"
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-xs text-white/60 truncate">
                          {track.artist}
                          <span className="lg:inline sm:hidden text-white/40"> • {track.genre}</span>
                        </p>
                      </div>
                    </div>

                    {/* Tablet Middle Columns */}
                    <div className="hidden sm:flex lg:hidden flex-col min-w-0">
                      <span className="text-xs font-semibold text-white/80 truncate">
                        {track.genre}
                      </span>
                      <span className="text-[11px] text-white/50 truncate">{track.bpm}</span>
                    </div>

                    <div className="hidden sm:flex lg:hidden justify-center">
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[#f5b942]/15 text-[#ffe49e] border border-[#f5b942]/30">
                        Eb + Bb
                      </span>
                    </div>

                    {/* Right Action: Like + Duration / Play Status */}
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLikedIds((prev) => ({ ...prev, [track.id]: !prev[track.id] }));
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label={`Favoritar ${track.title}`}
                        aria-pressed={isLiked}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isLiked ? "text-[#1ed760] fill-[#1ed760]" : "text-white/40 hover:text-white"
                          }`}
                        />
                      </button>
                      <span
                        className={`text-xs font-bold tabular-nums min-w-[44px] text-right ${
                          activePlaying ? "text-[#1ed760]" : "text-white/65"
                        }`}
                      >
                        {knownDur ? formatTime(knownDur) : activePlaying ? "Ativo" : "Ouvir"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Studio Footer Strip */}
          <div className="rounded-b-3xl sm:rounded-b-[28px] bg-[#121215] border-t border-white/10 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/80 text-center sm:text-left">
              🎧 Isso é apenas <strong className="text-white">uma pequena amostra</strong> — no app são{" "}
              <strong className="text-[#1ed760]">+10.000 partituras com playback</strong> prontas para tocar!
            </p>
            <button
              type="button"
              onClick={onScrollToOffers}
              className="sax-cta-btn w-full sm:w-auto px-6 py-3.5 rounded-full text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Liberar +10.000 Playbacks</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotifyPlaybackPlayerV3;
