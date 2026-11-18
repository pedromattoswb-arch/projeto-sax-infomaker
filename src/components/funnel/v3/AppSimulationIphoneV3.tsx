import {
  Folder,
  Search,
  Play,
  Mic,
  ChevronRight,
  FileText,
  Headphones,
  ArrowRight,
  Wifi,
  BatteryFull,
  Smartphone,
  Cloud,
} from "lucide-react";

import logoClubeSax from "@/assets/lp3/logo-clube-do-sax.webp";
import { KineticHeading, Scroll3DMockup, CinematicReveal } from "./SaxThematicEffects";

const APP_FOLDERS_PREVIEW = [
  { name: "MPB & Clássicos Brasil", count: "850+ músicas", emoji: "🇧🇷" },
  { name: "Gospel & Harpa Cristã", count: "1.420+ músicas", emoji: "🙌" },
  { name: "Pop & Românticas", count: "820+ músicas", emoji: "🎷" },
  { name: "Jazz, Bossa & Standards", count: "970+ músicas", emoji: "🎺" },
  { name: "Casamento & Eventos", count: "690+ músicas", emoji: "💍" },
];

interface AppSimulationIphoneV3Props {
  onScrollToOffers: () => void;
}

const AppSimulationIphoneV3 = ({ onScrollToOffers }: AppSimulationIphoneV3Props) => {
  return (
    <section id="simulador-app" className="sax-section">
      <div className="sax-container">
        {/* Mobile-First Flow: 1. Title -> 2. 3D Scroll-Synced iPhone Mockup -> 3. Paired Visual Highlights + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_364px] gap-y-6 lg:gap-y-5 lg:gap-x-14 items-center">
          {/* 1. TITLE BLOCK */}
          <div className="order-1 lg:col-start-1 lg:row-start-1 lg:self-end text-center lg:text-left">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-4">
              <Smartphone className="w-4 h-4 text-[#f5b942] shrink-0" />
              <span>Interface Oficial do Aluno</span>
            </div>

            <KineticHeading>
              <h2 className="sax-h2 text-white">
                Navegue Pela Plataforma <br className="hidden sm:block" />
                <span className="sax-gold-gradient-text italic">Como um Aplicativo de Verdade</span>
              </h2>
            </KineticHeading>
          </div>

          {/* 2. 3D SCROLL-SYNCHRONIZED IPHONE 16 PRO MOCKUP (Immediately after Title!) */}
          <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 flex justify-center my-1 lg:my-0">
            <Scroll3DMockup
              tiltDirection={-1}
              className="relative w-full max-w-[292px] min-[375px]:max-w-[328px] sm:max-w-[356px] px-1"
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[56px] opacity-35"
                style={{
                  background:
                    "radial-gradient(circle, rgba(245,185,66,0.26) 0%, rgba(30,215,96,0.12) 50%, transparent 72%)",
                  filter: "blur(26px)",
                }}
              />

              {/* Titanium Hardware Side Buttons */}
              <div className="hidden min-[360px]:block absolute left-[1px] top-[100px] w-[3px] h-7 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
              <div className="hidden min-[360px]:block absolute left-[1px] top-[142px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
              <div className="hidden min-[360px]:block absolute left-[1px] top-[198px] w-[3px] h-11 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
              <div className="hidden min-[360px]:block absolute right-[1px] top-[160px] w-[3px] h-14 rounded-r-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />

              <div className="iphone-16-frame relative z-10">
                <div className="iphone-16-inner-bezel">
                  <div className="iphone-16-screen select-none flex flex-col text-left">
                    {/* iOS Top Status Bar + Dynamic Island */}
                    <div className="flex items-center justify-between px-4 sm:px-5 pt-2.5 pb-2 bg-[#0b0805] gap-1">
                      <span className="text-[11px] font-bold text-white tabular-nums">9:41</span>

                      <div className="h-[23px] px-3 min-w-[92px] sm:min-w-[106px] rounded-full bg-black border border-white/12 flex items-center justify-between gap-1.5">
                        <span className="text-[10px]" aria-hidden="true">
                          🎷
                        </span>
                        <span className="text-[9px] font-bold text-[#ffe49e] truncate">
                          SaxApp
                        </span>
                        <div className="flex items-end gap-[2px] h-2.5" aria-hidden="true">
                          <span className="w-[2px] rounded-full bg-[#1ed760] animate-sax-eq-1" />
                          <span className="w-[2px] rounded-full bg-[#f5b942] animate-sax-eq-2" />
                          <span className="w-[2px] rounded-full bg-[#1ed760] animate-sax-eq-3" />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-white">
                        <Wifi className="w-3 h-3" />
                        <BatteryFull className="w-3.5 h-3.5 text-[#1ed760]" />
                      </div>
                    </div>

                    {/* App Header Bar inside iPhone */}
                    <div className="px-3.5 py-2.5 bg-[#130e08] border-b border-[#f5b942]/15 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={logoClubeSax}
                          alt="Clube do Sax"
                          width={38}
                          height={28}
                          loading="eager"
                          decoding="sync"
                          className="h-6 sm:h-7 w-auto shrink-0"
                        />
                        <span className="font-heading font-black text-xs text-white truncate">
                          Clube do Sax
                        </span>
                      </div>

                      <span className="rounded-lg bg-[#f5b942]/15 border border-[#f5b942]/35 px-2 py-0.5 text-[10px] font-black text-[#ffe49e] shrink-0">
                        Eb & Bb
                      </span>
                    </div>

                    {/* Clean Search + Voice Bar */}
                    <div className="px-3.5 py-2.5 bg-[#0e0a06] border-b border-white/5">
                      <div className="w-full flex items-center gap-2 rounded-xl bg-black/60 border border-white/12 px-3 py-2">
                        <Search className="w-3.5 h-3.5 text-[#cfc3ae] shrink-0" />
                        <span className="text-[11px] text-[#cfc3ae]/85 flex-1 truncate">
                          Pesquisar por texto ou voz...
                        </span>
                        <span className="w-6 h-6 rounded-lg bg-[#f5b942]/20 text-[#f5b942] border border-[#f5b942]/40 flex items-center justify-center shrink-0">
                          <Mic className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Organized Folders Preview inside iPhone */}
                    <div className="bg-[#090705] px-3.5 py-3 space-y-2">
                      <div className="flex items-center justify-between gap-2 px-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#ffe49e]/90 flex items-center gap-1 truncate">
                          <Folder className="w-3 h-3 text-[#f5b942] shrink-0" />
                          Bibliotecas (+18 Estilos)
                        </span>
                        <span className="text-[10px] text-[#1ed760] font-bold shrink-0">
                          Organizado
                        </span>
                      </div>

                      {APP_FOLDERS_PREVIEW.map((folder) => (
                        <div
                          key={folder.name}
                          className="flex items-center gap-2.5 p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08]"
                        >
                          <div className="w-8 h-8 rounded-xl bg-[#f5b942]/15 border border-[#f5b942]/30 flex items-center justify-center text-sm shrink-0">
                            {folder.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-extrabold text-white block truncate leading-tight">
                              {folder.name}
                            </span>
                            <span className="text-[10px] font-bold text-[#f5b942]">
                              {folder.count}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#cfc3ae]/70 shrink-0" />
                        </div>
                      ))}
                    </div>

                    {/* Paired PDF + MP3 Preview Strip */}
                    <div className="px-3.5 py-2.5 bg-[#0e0a06] border-t border-white/5 space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#cfc3ae]/75">
                        Partitura + Acompanhamento Juntos
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-white/90">
                        <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">Careless Whisper (Sax Alto & Tenor).pdf</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-white/90">
                        <Headphones className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
                        <span className="truncate">Careless Whisper — Playback Master.mp3</span>
                      </div>
                    </div>

                    {/* Bottom Mini-Player + Home Bar */}
                    <div className="bg-[#120d08] border-t border-[#f5b942]/20 px-4 pt-2.5 pb-2">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#1ed760] text-black flex items-center justify-center shrink-0">
                          <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-white truncate">
                            Careless Whisper — Estúdio
                          </p>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                            <div className="h-full w-[42%] bg-gradient-to-r from-[#f5b942] to-[#1ed760] rounded-full" />
                          </div>
                        </div>
                      </div>
                      <div className="w-24 h-1 rounded-full bg-white/30 mx-auto mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Scroll3DMockup>
          </div>

          {/* 3. DESCRIPTION + VISUAL FEATURE CARDS (Every point paired with its visual icon/tag!) */}
          <div className="order-3 lg:col-start-1 lg:row-start-2 lg:self-start text-center lg:text-left">
            <p className="sax-body-lg text-[#cfc3ae] mb-6 max-w-xl mx-auto lg:mx-0">
              Encontre qualquer música em segundos, abra a{" "}
              <strong className="text-white">partitura em alta definição</strong> e dê play no{" "}
              <strong className="text-[#ffe49e]">playback profissional na mesma tela</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 text-left mb-7">
              {[
                {
                  icon: Smartphone,
                  title: "iPhone, Android, Tablet & PC",
                  sub: "Roda direto no navegador como um App",
                  accent: "text-[#ffe49e] bg-[#f5b942]/15 border-[#f5b942]/30",
                },
                {
                  icon: Cloud,
                  title: "Zero Memória Ocupada",
                  sub: "+10.000 arquivos salvos na nuvem",
                  accent: "text-[#1ed760] bg-[#1ed760]/15 border-[#1ed760]/30",
                },
                {
                  icon: FileText,
                  title: "Partitura + MP3 na Mesma Tela",
                  sub: "Sax Alto (Eb) e Sax Tenor (Bb)",
                  accent: "text-[#ffe49e] bg-[#f5b942]/15 border-[#f5b942]/30",
                },
                {
                  icon: Mic,
                  title: "Busca por Texto ou Voz",
                  sub: "Localize qualquer música em 1s",
                  accent: "text-[#1ed760] bg-[#1ed760]/15 border-[#1ed760]/30",
                },
              ].map((card, idx) => (
                <CinematicReveal key={idx}>
                  <div className="sax-card h-full rounded-2xl p-3.5 flex items-start gap-3 border border-white/10">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${card.accent}`}
                    >
                      <card.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black font-heading text-white leading-snug">
                        {card.title}
                      </p>
                      <p className="text-xs text-[#cfc3ae] mt-0.5 leading-snug">{card.sub}</p>
                    </div>
                  </div>
                </CinematicReveal>
              ))}
            </div>

            <button
              type="button"
              onClick={onScrollToOffers}
              className="sax-cta-btn w-full sm:w-auto px-8 py-4 rounded-2xl text-sm sm:text-base uppercase tracking-wider inline-flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>Quero Ter Esse App no Meu Bolso</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppSimulationIphoneV3;
