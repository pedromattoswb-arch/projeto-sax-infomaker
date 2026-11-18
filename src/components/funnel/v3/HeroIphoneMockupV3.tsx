import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Play,
  Pause,
  Search,
  Mic,
  Wifi,
  BatteryFull,
  Mail,
  CheckCircle2,
  FileText,
  Headphones,
  Sparkles,
  Home,
  Compass,
  FolderOpen,
  User,
} from "lucide-react";
import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import saxStageHeroArt from "@/assets/lp3/sax-stage-hero-art.jpg";
import type { SaxType } from "./SaxThematicEffects";

interface HeroIphoneMockupV3Props {
  saxType: SaxType;
  onSaxTypeChange: (t: SaxType) => void;
}

const HERO_PHONE_TRACKS = [
  {
    id: "careless",
    title: "Careless Whisper",
    artist: "George Michael",
    genre: "Pop",
    src: "/playbacks/careless-whisper.mp3",
    coverGrad: "from-amber-600 via-rose-700 to-purple-900",
  },
  {
    id: "sozinho",
    title: "Sozinho",
    artist: "Caetano Veloso",
    genre: "MPB",
    src: "/playbacks/sozinho.mp3",
    coverGrad: "from-emerald-600 via-teal-800 to-slate-900",
  },
  {
    id: "latest-trick",
    title: "Your Latest Trick",
    artist: "Dire Straits",
    genre: "Jazz/Rock",
    src: "/playbacks/your-latest-trick.mp3",
    coverGrad: "from-yellow-600 via-amber-800 to-stone-900",
  },
  {
    id: "espirito",
    title: "Espírito, Espírito",
    artist: "Louvor & Harpa",
    genre: "Gospel",
    src: "/playbacks/espirito-espirito.mp3",
    coverGrad: "from-sky-600 via-indigo-800 to-slate-900",
  },
];

const HeroIphoneMockupV3 = ({ saxType, onSaxTypeChange }: HeroIphoneMockupV3Props) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeTrackId, setActiveTrackId] = useState<string>("careless");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPct, setProgressPct] = useState(34);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = HERO_PHONE_TRACKS.find((t) => t.id === activeTrackId) || HERO_PHONE_TRACKS[0];

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const toggleTrack = (track: (typeof HERO_PHONE_TRACKS)[number]) => {
    if (!audioRef.current) return;

    if (activeTrackId === track.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (activeTrackId !== track.id) {
      setActiveTrackId(track.id);
      audioRef.current.src = track.src;
    } else if (!audioRef.current.src) {
      audioRef.current.src = track.src;
    }

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  return (
    <div className="relative w-full max-w-[940px] mx-auto my-6 sm:my-10 flex items-center justify-center">
      {/* Real HTML5 audio for instant Hero iPhone preview */}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration > 0) {
            setProgressPct(Math.min(100, (el.currentTime / el.duration) * 100));
          }
        }}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Golden Stage Backdrop Illustration Winged Behind the iPhone */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
        <div className="relative w-full max-w-[820px] aspect-[16/9] rounded-[36px] overflow-hidden opacity-50 sm:opacity-65">
          <img
            src={saxStageHeroArt}
            alt=""
            width={1280}
            height={720}
            decoding="async"
            className="w-full h-full object-cover"
            style={{
              maskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 32%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 32%, transparent 80%)",
            }}
          />
        </div>
      </div>

      {/* Floating Left Callout Badge (Desktop >= 1024px) */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:flex items-center gap-3 sax-card rounded-2xl px-4 py-3.5 border border-[#1ed760]/40 absolute left-0 xl:left-4 top-16 z-20 max-w-[250px] text-left shadow-2xl"
      >
        <div className="w-10 h-10 rounded-xl bg-[#1ed760]/20 border border-[#1ed760]/40 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-[#1ed760]" />
        </div>
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#1ed760] block">
            Entrega Automática
          </span>
          <span className="text-xs font-bold text-white leading-snug block">
            Login & Senha chegam no seu E-mail na mesma hora!
          </span>
        </div>
      </motion.div>

      {/* Floating Right Callout Badge (Desktop >= 1024px) */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="hidden lg:flex items-center gap-3 sax-card rounded-2xl px-4 py-3.5 border border-[#f5b942]/45 absolute right-0 xl:right-4 bottom-20 z-20 max-w-[255px] text-left shadow-2xl"
      >
        <div className="w-10 h-10 rounded-xl bg-[#f5b942]/20 border border-[#f5b942]/40 flex items-center justify-center shrink-0">
          <Mic className="w-5 h-5 text-[#f5b942]" />
        </div>
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#ffe49e] block">
            Busca Inteligente por Voz
          </span>
          <span className="text-xs font-bold text-white leading-snug block">
            Fale a música e abra Partitura + Playback em 1s
          </span>
        </div>
      </motion.div>

      {/* CENTERPIECE: Fluid 320px-safe iPhone 16 Pro Desert Titanium Frame */}
      <div className="relative z-10 w-full max-w-[300px] min-[375px]:max-w-[334px] sm:max-w-[356px] mx-auto px-1">
        {/* Titanium Side Physical Buttons (Hidden below 360px so zero edge bleed) */}
        <div className="hidden min-[360px]:block absolute left-[1px] top-[100px] w-[3px] h-7 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        <div className="hidden min-[360px]:block absolute left-[1px] top-[142px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        <div className="hidden min-[360px]:block absolute left-[1px] top-[198px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        <div className="hidden min-[360px]:block absolute right-[1px] top-[160px] w-[3px] h-14 rounded-r-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />

        <div className="iphone-16-frame">
          <div className="iphone-16-inner-bezel">
            <div className="iphone-16-screen text-left select-none">
              {/* Diagonal Glass Screen Reflection */}
              <div
                className="pointer-events-none absolute inset-0 z-30 opacity-15"
                style={{
                  background:
                    "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 28%, transparent 45%)",
                }}
              />

              {/* iOS Status Bar + Dynamic Island */}
              <div className="relative z-20 flex items-center justify-between px-4 sm:px-5 pt-2.5 pb-2 bg-[#0c0906] gap-1">
                <span className="text-[11px] font-bold tracking-tight text-white tabular-nums">
                  9:41
                </span>

                {/* Dynamic Island with Live Equalizer */}
                <div className="h-[24px] px-3 min-w-[92px] sm:min-w-[104px] rounded-full bg-black border border-white/10 flex items-center justify-between gap-2 shadow-inner">
                  <span className="text-[10px]" aria-hidden="true">
                    🎷
                  </span>
                  <div className="flex items-end gap-[2px] h-3" aria-hidden="true">
                    <span
                      className={`w-[2.5px] rounded-full bg-[#1ed760] ${
                        isPlaying ? "animate-sax-eq-1" : "h-1.5 opacity-60"
                      }`}
                    />
                    <span
                      className={`w-[2.5px] rounded-full bg-[#f5b942] ${
                        isPlaying ? "animate-sax-eq-2" : "h-2.5 opacity-75"
                      }`}
                    />
                    <span
                      className={`w-[2.5px] rounded-full bg-[#1ed760] ${
                        isPlaying ? "animate-sax-eq-3" : "h-1 opacity-60"
                      }`}
                    />
                    <span
                      className={`w-[2.5px] rounded-full bg-[#f5b942] ${
                        isPlaying ? "animate-sax-eq-4" : "h-2 opacity-75"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-white">
                  <span className="text-[9px] font-extrabold hidden min-[350px]:inline">5G</span>
                  <Wifi className="w-3 h-3" />
                  <BatteryFull className="w-3.5 h-3.5 text-[#1ed760]" />
                </div>
              </div>

              {/* App Brand Header inside iPhone */}
              <div className="px-3.5 sm:px-4 pt-2 pb-3 bg-gradient-to-b from-[#1a1209] to-[#0d0906] border-b border-[#f5b942]/15">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={logoClubeSax}
                      alt="Clube do Sax App"
                      width={44}
                      height={32}
                      className="h-7 sm:h-8 w-auto shrink-0 drop-shadow-[0_0_8px_rgba(245,185,66,0.4)]"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-black font-heading text-white block leading-none truncate">
                        Clube do Sax
                      </span>
                      <span className="text-[10px] font-bold text-[#1ed760] flex items-center gap-1 mt-0.5 truncate">
                        <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                        App Oficial
                      </span>
                    </div>
                  </div>

                  {/* Clean Sax Alto / Tenor Switch right inside the App */}
                  <div
                    className="inline-flex rounded-lg bg-black/60 p-0.5 border border-[#f5b942]/35 shrink-0"
                    role="group"
                    aria-label="Selecionar afinação do Saxofone"
                  >
                    <button
                      type="button"
                      onClick={() => onSaxTypeChange("alto")}
                      className={`px-2 py-1 rounded-md text-[10px] font-black transition-colors cursor-pointer ${
                        saxType === "alto"
                          ? "bg-[#f5b942] text-[#1c1102]"
                          : "text-[#cfc3ae] hover:text-white"
                      }`}
                    >
                      Alto Eb
                    </button>
                    <button
                      type="button"
                      onClick={() => onSaxTypeChange("tenor")}
                      className={`px-2 py-1 rounded-md text-[10px] font-black transition-colors cursor-pointer ${
                        saxType === "tenor"
                          ? "bg-[#f5b942] text-[#1c1102]"
                          : "text-[#cfc3ae] hover:text-white"
                      }`}
                    >
                      Tenor Bb
                    </button>
                  </div>
                </div>

                {/* App Voice Search Bar */}
                <div className="flex items-center gap-2 rounded-xl bg-black/55 border border-white/10 px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-[#cfc3ae] shrink-0" />
                  <span className="text-[11px] text-[#cfc3ae]/85 flex-1 truncate">
                    Buscar em +10.000 músicas...
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-[#f5b942]/20 border border-[#f5b942]/40 flex items-center justify-center shrink-0">
                    <Mic className="w-3 h-3 text-[#f5b942]" />
                  </div>
                </div>

                {/* Genre Pills inside iPhone (Wrapped/clipped cleanly, no scroll) */}
                <div className="flex items-center gap-1.5 mt-2.5 overflow-hidden">
                  {["Pop", "MPB", "Gospel", "Jazz"].map((pill, i) => (
                    <span
                      key={pill}
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                        i === 0
                          ? "bg-[#f5b942] text-[#1c1102]"
                          : "bg-white/5 text-[#cfc3ae] border border-white/10"
                      }`}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Song List inside Hero iPhone */}
              <div className="px-3 sm:px-3.5 py-3 bg-[#0a0806] space-y-2">
                <div className="flex items-center justify-between px-1 mb-1 gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffe49e] flex items-center gap-1 truncate">
                    <Sparkles className="w-3 h-3 text-[#f5b942] shrink-0" />
                    Toque para testar o som
                  </span>
                  <span className="text-[10px] font-semibold text-[#cfc3ae] shrink-0">
                    PDF + MP3
                  </span>
                </div>

                {HERO_PHONE_TRACKS.map((track) => {
                  const playingThis = activeTrackId === track.id && isPlaying;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => toggleTrack(track)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-2xl border text-left transition-all cursor-pointer ${
                        playingThis
                          ? "bg-[#f5b942]/15 border-[#f5b942]/50 shadow-[0_0_16px_rgba(245,185,66,0.15)]"
                          : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.07]"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${track.coverGrad} flex items-center justify-center shrink-0 border border-white/15`}
                      >
                        <span className="text-sm">🎷</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-extrabold font-heading truncate leading-tight ${
                            playingThis ? "text-[#ffe49e]" : "text-white"
                          }`}
                        >
                          {track.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                          <span className="text-[11px] text-[#cfc3ae] truncate">{track.artist}</span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1ed760] bg-[#1ed760]/12 px-1.5 py-0.5 rounded shrink-0">
                            <FileText className="w-2.5 h-2.5" />
                            {saxType === "alto" ? "Eb" : "Bb"}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                          playingThis
                            ? "bg-[#1ed760] text-[#041d0c] scale-105"
                            : "bg-[#f5b942] text-[#1c1102]"
                        }`}
                      >
                        {playingThis ? (
                          <Pause className="w-3.5 h-3.5" fill="currentColor" />
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Now Playing Mini-Bar inside iPhone */}
              <div className="mx-3 mb-2 rounded-2xl bg-gradient-to-r from-[#1c140b] to-[#121c15] border border-[#f5b942]/30 px-3 py-2.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Headphones className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
                    <span className="text-[11px] font-extrabold text-white truncate">
                      {activeTrack.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTrack(activeTrack)}
                    className="text-[10px] font-black uppercase tracking-wider text-[#1ed760] shrink-0 cursor-pointer"
                  >
                    {isPlaying ? "Pausar" : "Ouvir"}
                  </button>
                </div>
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#f5b942] to-[#1ed760] transition-all duration-200"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* iOS Bottom Tab Navigation + Home Indicator */}
              <div className="bg-[#080604] border-t border-white/10 px-4 sm:px-5 pt-2 pb-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-[#cfc3ae]/75 mb-2">
                  <div className="flex flex-col items-center gap-0.5 text-[#f5b942]">
                    <Home className="w-3.5 h-3.5" />
                    <span>Início</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Buscar</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Pastas</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <User className="w-3.5 h-3.5" />
                    <span>VIP</span>
                  </div>
                </div>
                <div className="w-24 sm:w-28 h-1 rounded-full bg-white/35 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroIphoneMockupV3;
