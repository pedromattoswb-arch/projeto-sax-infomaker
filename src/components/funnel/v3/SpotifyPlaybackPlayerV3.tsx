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

const formatTime = (seconds: number) => {
  if (!isFinite(seconds) || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

interface SpotifyPlaybackPlayerV3Props {
  saxType: SaxType;
  onScrollToOffers: () => void;
  onEarnXp?: (amount: number, reason: string) => void;
}

const SpotifyPlaybackPlayerV3 = ({
  saxType,
  onScrollToOffers,
  onEarnXp,
}: SpotifyPlaybackPlayerV3Props) => {
  const [selectedGenre, setSelectedGenre] = useState<(typeof GENRE_FILTERS)[number]>("Todos");
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
            .then(() => {
              setIsPlaying(true);
              onEarnXp?.(35, `Playback "${track.title}" em reprodução!`);
            })
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
        .then(() => {
          setIsPlaying(true);
          onEarnXp?.(35, `Playback "${track.title}" em reprodução!`);
        })
        .catch(() => setIsPlaying(false));
    },
    [currentTrack.id, isPlaying, muted, onEarnXp, volume]
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
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-10 relative">
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

      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1ed760]/12 border border-[#1ed760]/35 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#1ed760] mb-4">
            <Headphones className="w-3.5 h-3.5" />
            Experiência Sonora Hi-Fi • Estilo Spotify
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-heading tracking-tight text-white mb-3">
            Dê Play nos <span className="sax-gold-gradient-text italic">Playbacks de Estúdio</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] max-w-2xl mx-auto">
            Banda real masterizada em estúdio! No aplicativo, você abre a partitura para{" "}
            <strong className="text-white">
              {saxType === "alto" ? "Sax Alto (Eb)" : "Sax Tenor (Bb)"}
            </strong>{" "}
            e dá play no acompanhamento na mesma tela.
          </p>
        </div>

        {/* SPOTIFY PREMIUM CONTAINER */}
        <div className="rounded-[28px] overflow-hidden border border-white/12 bg-[#0c0c0e] shadow-[0_32px_80px_rgba(0,0,0,0.92)]">
          {/* TOP SPOTIFY FEATURED NOW-PLAYING HEADER */}
          <div
            className="relative p-5 sm:p-8 transition-colors duration-700"
            style={{
              background: `linear-gradient(180deg, ${currentTrack.accentHex}38 0%, rgba(18, 18, 20, 0.96) 88%, #0c0c0e 100%)`,
            }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
              {/* Album Cover + Peeking Spinning Vinyl Disc */}
              <div className="relative flex items-center shrink-0">
                {/* Spinning Gold-Grooved Vinyl Disc */}
                <div
                  className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-zinc-900 via-black to-zinc-800 border-2 border-[#f5b942]/35 shadow-2xl flex items-center justify-center -mr-14 sm:-mr-16 z-0 transition-transform duration-500 ${
                    isPlaying ? "animate-sax-vinyl translate-x-5" : "translate-x-2"
                  }`}
                >
                  <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ffe299] to-[#b87914] flex items-center justify-center shadow-inner">
                      <div className="w-3 h-3 rounded-full bg-black" />
                    </div>
                  </div>
                </div>

                {/* Main Album Sleeve */}
                <div
                  className={`relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-br ${currentTrack.coverGradient} p-4 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.75)] border border-white/20 overflow-hidden`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-black/45 backdrop-blur-sm text-[#ffe299] px-2 py-0.5 rounded-full">
                      Clube do Sax
                    </span>
                    <Disc3
                      className={`w-4 h-4 text-white/80 ${isPlaying ? "animate-spin" : ""}`}
                    />
                  </div>

                  <div className="my-auto text-center">
                    <span className="text-4xl sm:text-5xl drop-shadow-lg block">🎷</span>
                  </div>

                  <div className="text-left">
                    <p className="text-[10px] font-bold text-white/75 uppercase tracking-wider truncate">
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
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white/90 mb-1.5">
                  <BadgeCheck className="w-4 h-4 text-[#1ed760] fill-[#1ed760]/20" />
                  <span>Playlist Oficial de Estúdio • Master 320kbps</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black font-heading text-white tracking-tight truncate mb-1">
                  {currentTrack.title}
                </h3>

                <p className="text-sm sm:text-base text-white/75 font-semibold mb-4">
                  {currentTrack.artist} •{" "}
                  <span className="text-[#ffe299]">{currentTrack.bpm}</span> •{" "}
                  <span className="text-[#1ed760]">
                    Partitura {saxType === "alto" ? "Alto Eb" : "Tenor Bb"} Inclusa
                  </span>
                </p>

                {/* MASTER TRANSPORT CONTROLS + SCRUBBER BAR (SPOTIFY DECK) */}
                <div className="bg-black/45 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 sm:p-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    {/* Left Controls: Shuffle + Prev + Big Emerald Play/Pause + Next + Repeat */}
                    <div className="flex items-center gap-2.5 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => setShuffle(!shuffle)}
                        className={`p-1.5 rounded-full transition-colors ${
                          shuffle ? "text-[#1ed760]" : "text-white/50 hover:text-white"
                        }`}
                        aria-label="Modo aleatório"
                        title="Modo aleatório"
                      >
                        <Shuffle className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={handlePrev}
                        className="p-1.5 text-white/80 hover:text-white transition-colors active:scale-90"
                        aria-label="Faixa anterior"
                      >
                        <SkipBack className="w-5 h-5" fill="currentColor" />
                      </button>

                      <button
                        type="button"
                        onClick={() => playSpecificTrack(currentTrack)}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1ed760] hover:bg-[#23eb6b] text-black flex items-center justify-center shadow-[0_8px_28px_rgba(30,215,96,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
                        className="p-1.5 text-white/80 hover:text-white transition-colors active:scale-90"
                        aria-label="Próxima faixa"
                      >
                        <SkipForward className="w-5 h-5" fill="currentColor" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setRepeatOne(!repeatOne)}
                        className={`p-1.5 rounded-full transition-colors ${
                          repeatOne ? "text-[#1ed760]" : "text-white/50 hover:text-white"
                        }`}
                        aria-label="Repetir música"
                        title="Repetir música"
                      >
                        <Repeat className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Right Controls: Live Equalizer Pill + Volume */}
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-end gap-[3px] h-4 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
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

                      <div className="hidden md:flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="text-white/70 hover:text-white transition-colors"
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
                          aria-label="Volume"
                          className="w-20 accent-[#1ed760] h-1 bg-white/20 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Spotify Scrubbing Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-white/60 tabular-nums w-9 text-right">
                      {formatTime(currentTime)}
                    </span>
                    <div
                      onClick={handleSeek}
                      className="group flex-1 h-2 bg-white/15 rounded-full cursor-pointer relative flex items-center"
                    >
                      <div
                        className="h-full rounded-full bg-[#1ed760] group-hover:bg-[#2bf074] transition-[width] duration-100 relative"
                        style={{ width: `${progressPct}%` }}
                      >
                        <span className="w-3 h-3 rounded-full bg-white shadow-md absolute -right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-white/60 tabular-nums w-9">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* GENRE FILTER CHIPS */}
            <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 no-scrollbar">
              {GENRE_FILTERS.map((g) => {
                const active = selectedGenre === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGenre(g)}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? "bg-[#1ed760] text-[#041d0c] shadow-[0_4px_16px_rgba(30,215,96,0.35)]"
                        : "bg-white/[0.07] text-white/75 hover:bg-white/[0.14] hover:text-white"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SPOTIFY PLAYLIST TRACK TABLE */}
          <div className="px-2 sm:px-6 pb-4">
            {/* Table Column Header */}
            <div className="grid grid-cols-[36px_1fr_auto] sm:grid-cols-[42px_1.5fr_1fr_90px_56px] items-center gap-3 px-3 py-2.5 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-white/45">
              <span className="text-center">#</span>
              <span>Título & Artista</span>
              <span className="hidden sm:block">Estilo & Arranjo</span>
              <span className="hidden sm:block text-center">Partitura</span>
              <span className="flex justify-end pr-1">
                <Clock className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Track Rows */}
            <div className="divide-y divide-white/[0.04] max-h-[430px] overflow-y-auto pr-1">
              {filteredTracks.map((track, index) => {
                const isCurrent = currentTrack.id === track.id;
                const activePlaying = isCurrent && isPlaying;
                const isLiked = !!likedIds[track.id];
                const knownDur = durationsMap[track.id];

                return (
                  <div
                    key={track.id}
                    onClick={() => playSpecificTrack(track)}
                    className={`group grid grid-cols-[36px_1fr_auto] sm:grid-cols-[42px_1.5fr_1fr_90px_56px] items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      isCurrent ? "bg-white/[0.09]" : "hover:bg-white/[0.05]"
                    }`}
                  >
                    {/* # Column / Equalizer / Hover Play */}
                    <div className="flex items-center justify-center">
                      {activePlaying ? (
                        <div className="flex items-end gap-[2px] h-3.5">
                          <span className="w-[2.5px] bg-[#1ed760] rounded-full animate-sax-eq-1" />
                          <span className="w-[2.5px] bg-[#1ed760] rounded-full animate-sax-eq-2" />
                          <span className="w-[2.5px] bg-[#1ed760] rounded-full animate-sax-eq-3" />
                        </div>
                      ) : (
                        <>
                          <span
                            className={`text-xs font-bold tabular-nums group-hover:hidden ${
                              isCurrent ? "text-[#1ed760]" : "text-white/50"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <Play
                            className="w-4 h-4 text-white hidden group-hover:block"
                            fill="currentColor"
                          />
                        </>
                      )}
                    </div>

                    {/* Cover + Title + Artist */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.coverGradient} flex items-center justify-center shrink-0 border border-white/15 shadow-md`}
                      >
                        <span className="text-base">🎷</span>
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-bold font-heading truncate ${
                            isCurrent ? "text-[#1ed760]" : "text-white"
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-xs text-white/55 truncate">{track.artist}</p>
                      </div>
                    </div>

                    {/* Genre & Groove */}
                    <div className="hidden sm:flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white/75 truncate">
                        {track.genre}
                      </span>
                      <span className="text-[10px] text-white/45 truncate">{track.bpm}</span>
                    </div>

                    {/* Sax Key Badge */}
                    <div className="hidden sm:flex justify-center">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#f5b942]/15 text-[#ffe299] border border-[#f5b942]/30">
                        Eb + Bb
                      </span>
                    </div>

                    {/* Like Heart + Duration / Action */}
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLikedIds((prev) => ({ ...prev, [track.id]: !prev[track.id] }));
                        }}
                        className="p-1 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Favoritar música"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isLiked ? "text-[#1ed760] fill-[#1ed760]" : "text-white/35 hover:text-white"
                          }`}
                        />
                      </button>
                      <span className="text-xs font-semibold text-white/55 tabular-nums w-9 text-right">
                        {knownDur ? formatTime(knownDur) : activePlaying ? "Tocando" : "Play"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Studio Footer Strip */}
          <div className="bg-[#121215] border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-white/75 text-center sm:text-left">
              🎧 Isso é apenas <strong className="text-white">0,1% do acervo</strong> — lá dentro são{" "}
              <strong className="text-[#1ed760]">+10.000 partituras com playback</strong> prontas para tocar!
            </p>
            <button
              type="button"
              onClick={onScrollToOffers}
              className="sax-cta-btn px-6 py-3 rounded-full text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 shrink-0"
            >
              Liberar +10.000 Playbacks
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotifyPlaybackPlayerV3;
