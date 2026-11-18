import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  onEarnXp: (amount: number, reason: string) => void;
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

const HeroIphoneMockupV3 = ({ saxType, onEarnXp }: HeroIphoneMockupV3Props) => {
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
      .then(() => {
        setIsPlaying(true);
        onEarnXp(40, `Ouvindo "${track.title}" direto no iPhone!`);
      })
      .catch(() => {
        setIsPlaying(false);
      });
  };

  return (
    <div className="relative w-full max-w-[920px] mx-auto my-6 sm:my-10 flex items-center justify-center">
      {/* Hidden real HTML5 audio for instant Hero iPhone preview */}
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
        <div className="relative w-full max-w-[820px] aspect-[16/10] rounded-[40px] overflow-hidden opacity-55 sm:opacity-70">
          <img
            src={saxStageHeroArt}
            alt=""
            className="w-full h-full object-cover scale-105"
            style={{
              maskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 35%, transparent 82%)",
              WebkitMaskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 35%, transparent 82%)",
            }}
          />
        </div>
      </div>

      {/* Floating Left Callout Badge (Desktop) — Instant Email Login */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:flex items-center gap-3 sax-card rounded-2xl px-4 py-3 border border-[#1ed760]/40 absolute left-2 xl:left-6 top-16 z-20 max-w-[240px] text-left shadow-2xl"
      >
        <div className="w-10 h-10 rounded-xl bg-[#1ed760]/20 border border-[#1ed760]/40 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-[#1ed760]" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1ed760] block">
            Entrega Automática
          </span>
          <span className="text-xs font-bold text-white leading-tight block">
            Login & Senha chegam no seu E-mail na mesma hora!
          </span>
        </div>
      </motion.div>

      {/* Floating Right Callout Badge (Desktop) — Voice Search + Alto & Tenor */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="hidden lg:flex items-center gap-3 sax-card rounded-2xl px-4 py-3 border border-[#f5b942]/45 absolute right-2 xl:right-6 bottom-20 z-20 max-w-[245px] text-left shadow-2xl"
      >
        <div className="w-10 h-10 rounded-xl bg-[#f5b942]/20 border border-[#f5b942]/40 flex items-center justify-center shrink-0">
          <Mic className="w-5 h-5 text-[#f5b942]" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#ffe299] block">
            Busca Inteligente por Voz
          </span>
          <span className="text-xs font-bold text-white leading-tight block">
            Fale a música e abra Partitura + Playback em 1s
          </span>
        </div>
      </motion.div>

      {/* CENTERPIECE: Realistic iPhone 16 Pro Desert Titanium Frame */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-[312px] sm:w-[346px]"
      >
        {/* Titanium Side Physical Buttons */}
        {/* Action Button */}
        <div className="absolute -left-[3px] top-[104px] w-[3px] h-7 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        {/* Volume Up */}
        <div className="absolute -left-[3px] top-[148px] w-[3px] h-12 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        {/* Volume Down */}
        <div className="absolute -left-[3px] top-[208px] w-[3px] h-12 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        {/* Power Side Button */}
        <div className="absolute -right-[3px] top-[168px] w-[3px] h-16 rounded-r-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />

        <div className="iphone-16-frame">
          <div className="iphone-16-inner-bezel">
            <div className="iphone-16-screen text-left select-none">
              {/* Diagonal Realistic Glass Screen Reflection */}
              <div
                className="pointer-events-none absolute inset-0 z-30 opacity-20"
                style={{
                  background:
                    "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 28%, transparent 45%)",
                }}
              />

              {/* iOS Status Bar + Dynamic Island */}
              <div className="relative z-20 flex items-center justify-between px-6 pt-3 pb-2 bg-[#0c0906]">
                <span className="text-[11px] font-bold tracking-tight text-white tabular-nums">
                  9:41
                </span>

                {/* Dynamic Island with Live Equalizer */}
                <div className="h-[25px] px-3.5 min-w-[104px] rounded-full bg-black border border-white/10 flex items-center justify-between gap-2 shadow-inner">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#f5b942] to-[#b87914] flex items-center justify-center text-[8px] font-black text-black">
                    🎷
                  </div>
                  <div className="flex items-end gap-[2px] h-3">
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

                <div className="flex items-center gap-1.5 text-white">
                  <span className="text-[9px] font-extrabold">5G</span>
                  <Wifi className="w-3 h-3" />
                  <BatteryFull className="w-3.5 h-3.5 text-[#1ed760]" />
                </div>
              </div>

              {/* App Brand Header inside iPhone */}
              <div className="px-4 pt-2 pb-3 bg-gradient-to-b from-[#1a1209] to-[#0d0906] border-b border-[#f5b942]/15">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <img
                      src={logoClubeSax}
                      alt="Clube do Sax App"
                      className="h-8 w-auto drop-shadow-[0_0_8px_rgba(245,185,66,0.4)]"
                    />
                    <div>
                      <span className="text-xs font-black font-heading text-white block leading-none">
                        Clube do Sax
                      </span>
                      <span className="text-[9px] font-bold text-[#1ed760] flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Acesso Vitalício Ativo
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#f5b942]/15 border border-[#f5b942]/40 px-2.5 py-0.5 text-[9px] font-extrabold text-[#ffe299]">
                    {saxType === "alto" ? "Alto Eb" : "Tenor Bb"}
                  </span>
                </div>

                {/* App Voice Search Bar */}
                <div className="flex items-center gap-2 rounded-xl bg-black/55 border border-white/10 px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-[#c2b59f]" />
                  <span className="text-[11px] text-[#c2b59f]/80 flex-1 truncate">
                    Buscar em +10.000 músicas...
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-[#f5b942]/20 border border-[#f5b942]/40 flex items-center justify-center">
                    <Mic className="w-3 h-3 text-[#f5b942]" />
                  </div>
                </div>

                {/* Genre Pills inside iPhone */}
                <div className="flex items-center gap-1.5 mt-2.5 overflow-hidden">
                  {["Pop", "MPB", "Gospel", "Jazz", "Casamento"].map((pill, i) => (
                    <span
                      key={pill}
                      className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        i === 0
                          ? "bg-[#f5b942] text-[#1c1102]"
                          : "bg-white/5 text-[#c2b59f] border border-white/10"
                      }`}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Song List inside Hero iPhone */}
              <div className="px-3.5 py-3 bg-[#0a0806] space-y-2">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#ffe299]/80 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#f5b942]" />
                    Toque em uma música para ouvir
                  </span>
                  <span className="text-[9px] font-semibold text-[#c2b59f]">PDF + MP3</span>
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
                          : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.07]"
                      }`}
                    >
                      {/* Mini Cover */}
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${track.coverGrad} flex items-center justify-center shrink-0 relative overflow-hidden border border-white/15`}
                      >
                        <span className="text-sm">🎷</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-extrabold font-heading truncate leading-tight ${
                            playingThis ? "text-[#ffe299]" : "text-white"
                          }`}
                        >
                          {track.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-[#c2b59f] truncate">{track.artist}</span>
                          <span className="inline-flex items-center gap-0.5 text-[8px] font-bold text-[#1ed760] bg-[#1ed760]/10 px-1.5 py-0.2 rounded">
                            <FileText className="w-2 h-2" />
                            {saxType === "alto" ? "Eb" : "Bb"}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
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
                    <span className="text-[10px] font-extrabold text-white truncate">
                      {activeTrack.title} — Playback Estúdio
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTrack(activeTrack)}
                    className="text-[9px] font-black uppercase tracking-wider text-[#1ed760] shrink-0"
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
              <div className="bg-[#080604] border-t border-white/10 px-5 pt-2 pb-2">
                <div className="flex items-center justify-between text-[9px] font-semibold text-[#c2b59f]/70 mb-2">
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
                {/* iOS Home Bar */}
                <div className="w-28 h-1 rounded-full bg-white/35 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroIphoneMockupV3;
