import {
  Play,
  Search,
  Mic,
  Wifi,
  BatteryFull,
  Mail,
  CheckCircle2,
  FileText,
  Headphones,
  Home,
  Compass,
  FolderOpen,
  User,
} from "lucide-react";
import logoClubeSax from "@/assets/lp3/logo-clube-do-sax.webp";
import saxStageHeroArt from "@/assets/lp3/sax-stage-hero-art.webp";
import { Scroll3DMockup } from "./SaxThematicEffects";

const HERO_APP_SONGS = [
  {
    title: "Careless Whisper",
    artist: "George Michael",
    coverGrad: "from-amber-600 via-rose-700 to-purple-900",
    active: true,
  },
  {
    title: "Garota de Ipanema",
    artist: "Tom Jobim",
    coverGrad: "from-emerald-600 via-teal-800 to-slate-900",
    active: false,
  },
  {
    title: "Sozinho",
    artist: "Caetano Veloso",
    coverGrad: "from-yellow-600 via-amber-800 to-stone-900",
    active: false,
  },
  {
    title: "Espírito, Espírito",
    artist: "Louvor & Harpa Cristã",
    coverGrad: "from-sky-600 via-indigo-800 to-slate-900",
    active: false,
  },
];

const HeroIphoneMockupV3 = () => {
  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Golden Stage Backdrop Illustration Behind the iPhone (Compressed WebP, Eager Loaded) */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
        <div className="relative w-full max-w-[680px] aspect-[16/10] rounded-[32px] overflow-hidden opacity-55 sm:opacity-70">
          <img
            src={saxStageHeroArt}
            alt=""
            width={960}
            height={536}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="w-full h-full object-cover"
            style={{
              maskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 30%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(ellipse 72% 68% at 50% 50%, black 30%, transparent 78%)",
            }}
          />
        </div>
      </div>

      {/* Levitating Desktop Callout Badges */}
      <div className="hidden xl:flex items-center gap-3 sax-card rounded-2xl px-4 py-3 border border-[#1ed760]/40 absolute -left-4 top-14 z-20 max-w-[220px] text-left shadow-2xl animate-sax-levitate">
        <div className="w-9 h-9 rounded-xl bg-[#1ed760]/20 border border-[#1ed760]/40 flex items-center justify-center shrink-0">
          <Mail className="w-4 h-4 text-[#1ed760]" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1ed760] block">
            Entrega Imediata
          </span>
          <span className="text-xs font-bold text-white leading-snug block">
            Login enviado no seu E-mail na hora
          </span>
        </div>
      </div>

      <div className="hidden xl:flex items-center gap-3 sax-card rounded-2xl px-4 py-3 border border-[#f5b942]/45 absolute -right-4 bottom-16 z-20 max-w-[225px] text-left shadow-2xl animate-sax-levitate-delayed">
        <div className="w-9 h-9 rounded-xl bg-[#f5b942]/20 border border-[#f5b942]/40 flex items-center justify-center shrink-0">
          <Mic className="w-4 h-4 text-[#f5b942]" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#ffe49e] block">
            Busca por Voz
          </span>
          <span className="text-xs font-bold text-white leading-snug block">
            Partitura + Playback juntos em 1s
          </span>
        </div>
      </div>

      {/* CENTERPIECE: Scroll-Synchronized 3D iPhone 16 Pro Desert Titanium Mockup */}
      <Scroll3DMockup
        tiltDirection={1}
        className="relative z-10 w-full max-w-[292px] min-[375px]:max-w-[324px] sm:max-w-[344px] mx-auto px-1"
      >
        {/* Titanium Side Physical Buttons */}
        <div className="hidden min-[360px]:block absolute left-[1px] top-[96px] w-[3px] h-7 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        <div className="hidden min-[360px]:block absolute left-[1px] top-[138px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        <div className="hidden min-[360px]:block absolute left-[1px] top-[192px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
        <div className="hidden min-[360px]:block absolute right-[1px] top-[156px] w-[3px] h-14 rounded-r-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />

        <div className="iphone-16-frame">
          <div className="iphone-16-inner-bezel">
            <div className="iphone-16-screen text-left select-none">
              {/* Diagonal Specular Glass Reflection */}
              <div
                className="pointer-events-none absolute inset-0 z-30 opacity-18"
                style={{
                  background:
                    "linear-gradient(125deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.04) 28%, transparent 45%)",
                }}
              />

              {/* iOS Status Bar + Dynamic Island */}
              <div className="relative z-20 flex items-center justify-between px-4 sm:px-5 pt-2.5 pb-2 bg-[#0c0906] gap-1">
                <span className="text-[11px] font-bold tracking-tight text-white tabular-nums">
                  9:41
                </span>

                <div className="h-[23px] px-3 min-w-[90px] sm:min-w-[102px] rounded-full bg-black border border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[10px]" aria-hidden="true">
                    🎷
                  </span>
                  <div className="flex items-end gap-[2px] h-3" aria-hidden="true">
                    <span className="w-[2.5px] rounded-full bg-[#1ed760] animate-sax-eq-1" />
                    <span className="w-[2.5px] rounded-full bg-[#f5b942] animate-sax-eq-2" />
                    <span className="w-[2.5px] rounded-full bg-[#1ed760] animate-sax-eq-3" />
                    <span className="w-[2.5px] rounded-full bg-[#f5b942] animate-sax-eq-4" />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-white">
                  <span className="text-[9px] font-extrabold hidden min-[350px]:inline">5G</span>
                  <Wifi className="w-3 h-3" />
                  <BatteryFull className="w-3.5 h-3.5 text-[#1ed760]" />
                </div>
              </div>

              {/* App Brand Header inside iPhone */}
              <div className="px-3.5 sm:px-4 pt-2 pb-2.5 bg-gradient-to-b from-[#1a1209] to-[#0d0906] border-b border-[#f5b942]/15">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={logoClubeSax}
                      alt="Aplicativo Clube do Sax"
                      width={40}
                      height={29}
                      loading="eager"
                      decoding="sync"
                      className="h-7 w-auto shrink-0 drop-shadow-[0_0_8px_rgba(245,185,66,0.4)]"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-black font-heading text-white block leading-none truncate">
                        Clube do Sax
                      </span>
                      <span className="text-[10px] font-bold text-[#1ed760] flex items-center gap-1 mt-0.5 truncate">
                        <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                        Acesso Vitalício
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-[#f5b942]/15 border border-[#f5b942]/40 px-2.5 py-0.5 text-[10px] font-extrabold text-[#ffe49e] shrink-0">
                    Alto Eb • Tenor Bb
                  </span>
                </div>

                {/* App Search Bar Preview */}
                <div className="flex items-center gap-2 rounded-xl bg-black/55 border border-white/10 px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-[#cfc3ae] shrink-0" />
                  <span className="text-[11px] text-[#cfc3ae]/85 flex-1 truncate">
                    Buscar música ou artista...
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-[#f5b942]/20 border border-[#f5b942]/40 flex items-center justify-center shrink-0">
                    <Mic className="w-3 h-3 text-[#f5b942]" />
                  </div>
                </div>

                {/* Genre Pills Preview */}
                <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
                  {["Pop", "MPB", "Gospel", "Jazz", "Casamento"].map((pill, i) => (
                    <span
                      key={pill}
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${
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

              {/* Clean Song List Preview inside iPhone */}
              <div className="px-3 sm:px-3.5 py-2.5 bg-[#0a0806] space-y-2">
                <div className="flex items-center justify-between px-1 gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffe49e]/90 truncate">
                    Acervo Completo (+10.000)
                  </span>
                  <span className="text-[10px] font-semibold text-[#cfc3ae] shrink-0">
                    PDF + MP3
                  </span>
                </div>

                {HERO_APP_SONGS.map((song) => (
                  <div
                    key={song.title}
                    className={`flex items-center gap-2.5 p-2 rounded-2xl border ${
                      song.active
                        ? "bg-[#f5b942]/14 border-[#f5b942]/45"
                        : "bg-white/[0.03] border-white/[0.07]"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${song.coverGrad} flex items-center justify-center shrink-0 border border-white/15`}
                    >
                      <span className="text-xs">🎷</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-extrabold font-heading truncate leading-tight ${
                          song.active ? "text-[#ffe49e]" : "text-white"
                        }`}
                      >
                        {song.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                        <span className="text-[10px] text-[#cfc3ae] truncate">{song.artist}</span>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#1ed760] bg-[#1ed760]/12 px-1.5 py-0.2 rounded shrink-0">
                          <FileText className="w-2.5 h-2.5" />
                          Eb/Bb
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        song.active
                          ? "bg-[#1ed760] text-[#041d0c]"
                          : "bg-[#f5b942]/90 text-[#1c1102]"
                      }`}
                    >
                      <Play className="w-3 h-3 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Now Playing Bar inside iPhone */}
              <div className="mx-3 mb-2 rounded-2xl bg-gradient-to-r from-[#1c140b] to-[#121c15] border border-[#f5b942]/30 px-3 py-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Headphones className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
                    <span className="text-[10px] font-extrabold text-white truncate">
                      Careless Whisper — Playback
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#cfc3ae] tabular-nums shrink-0">
                    01:24
                  </span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-[#f5b942] to-[#1ed760]" />
                </div>
              </div>

              {/* iOS Bottom Tab Navigation + Home Bar */}
              <div className="bg-[#080604] border-t border-white/10 px-4 sm:px-5 pt-1.5 pb-2">
                <div className="flex items-center justify-between text-[9px] font-semibold text-[#cfc3ae]/75 mb-1.5">
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
                <div className="w-24 h-1 rounded-full bg-white/35 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </Scroll3DMockup>
    </div>
  );
};

export default HeroIphoneMockupV3;
