import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  Search,
  Play,
  Pause,
  Mic,
  ChevronRight,
  ArrowLeft,
  FileText,
  Headphones,
  ArrowRight,
  Wifi,
  BatteryFull,
  Sparkles,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

import logoClubeSax from "@/assets/logo-clube-do-sax.png";
import sheetRainbow from "@/assets/partituras-exemplo/partitura-1.png";
import sheetHorizonte from "@/assets/partituras-exemplo/partitura-3.png";
import type { SaxType } from "./SaxThematicEffects";

interface SimSong {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  sheetSrc: string;
}

interface SimFolder {
  id: string;
  name: string;
  count: string;
  emoji: string;
  songs: SimSong[];
}

const SIM_FOLDERS: SimFolder[] = [
  {
    id: "mpb",
    name: "MPB & Clássicos Brasil",
    count: "850+ arquivos",
    emoji: "🇧🇷",
    songs: [
      {
        id: "sozinho",
        title: "Sozinho",
        artist: "Caetano Veloso",
        audioSrc: "/playbacks/sozinho.mp3",
        sheetSrc: sheetHorizonte,
      },
      {
        id: "alguem",
        title: "Alguém Me Disse",
        artist: "Alcione",
        audioSrc: "/playbacks/alguem-me-disse.mp3",
        sheetSrc: sheetHorizonte,
      },
    ],
  },
  {
    id: "pop",
    name: "Pop & Românticas",
    count: "820+ arquivos",
    emoji: "🎷",
    songs: [
      {
        id: "careless",
        title: "Careless Whisper",
        artist: "George Michael",
        audioSrc: "/playbacks/careless-whisper.mp3",
        sheetSrc: sheetRainbow,
      },
      {
        id: "endless",
        title: "Endless Love",
        artist: "Lionel Richie",
        audioSrc: "/playbacks/endless-love.mp3",
        sheetSrc: sheetRainbow,
      },
    ],
  },
  {
    id: "gospel",
    name: "Gospel & Harpa Cristã",
    count: "1.420+ arquivos",
    emoji: "🙌",
    songs: [
      {
        id: "espirito",
        title: "Espírito, Espírito",
        artist: "Louvor & Harpa",
        audioSrc: "/playbacks/espirito-espirito.mp3",
        sheetSrc: sheetRainbow,
      },
      {
        id: "amigo",
        title: "Amigo de Deus",
        artist: "Trazendo a Arca",
        audioSrc: "/playbacks/amigo-de-deus.mp3",
        sheetSrc: sheetHorizonte,
      },
    ],
  },
  {
    id: "rock",
    name: "Rock, Jazz & Dire Straits",
    count: "1.100+ arquivos",
    emoji: "🎸",
    songs: [
      {
        id: "trick",
        title: "Your Latest Trick",
        artist: "Dire Straits",
        audioSrc: "/playbacks/your-latest-trick.mp3",
        sheetSrc: sheetRainbow,
      },
      {
        id: "queen",
        title: "Dancing Queen",
        artist: "ABBA",
        audioSrc: "/playbacks/dancing-queen.mp3",
        sheetSrc: sheetHorizonte,
      },
    ],
  },
  {
    id: "casamento",
    name: "Casamento, Eventos & Seresta",
    count: "690+ arquivos",
    emoji: "💍",
    songs: [
      {
        id: "tan",
        title: "Tan Enamorados",
        artist: "Romântico",
        audioSrc: "/playbacks/tan-enamorados.mp3",
        sheetSrc: sheetRainbow,
      },
      {
        id: "boate",
        title: "Boate Azul",
        artist: "Sertanejo & Sax",
        audioSrc: "/playbacks/boate-azul.mp3",
        sheetSrc: sheetHorizonte,
      },
    ],
  },
];

interface AppSimulationIphoneV3Props {
  saxType: SaxType;
  onSaxTypeChange: (t: SaxType) => void;
  onScrollToOffers: () => void;
  onEarnXp?: (amount: number, reason: string) => void;
}

const AppSimulationIphoneV3 = ({
  saxType,
  onSaxTypeChange,
  onScrollToOffers,
  onEarnXp,
}: AppSimulationIphoneV3Props) => {
  const [selectedFolder, setSelectedFolder] = useState<SimFolder | null>(null);
  const [viewingSong, setViewingSong] = useState<SimSong | null>(null);
  const [voiceSearching, setVoiceSearching] = useState(false);
  const [activeAudioSong, setActiveAudioSong] = useState<SimSong>(SIM_FOLDERS[1].songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPct, setProgressPct] = useState(28);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const playSongInPhone = (song: SimSong) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (activeAudioSong.id === song.id && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    setActiveAudioSong(song);
    audio.src = song.audioSrc;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        onEarnXp?.(40, `Testou "${song.title}" no simulador iPhone!`);
      })
      .catch(() => setIsPlaying(false));
  };

  const triggerVoiceDemo = () => {
    if (voiceSearching) return;
    setVoiceSearching(true);
    onEarnXp?.(50, "Busca por Voz Inteligente testada!");
    setTimeout(() => {
      setVoiceSearching(false);
      const targetFolder = SIM_FOLDERS[1];
      setSelectedFolder(targetFolder);
      setViewingSong(targetFolder.songs[0]);
    }, 1550);
  };

  return (
    <section className="py-16 md:py-28 px-5 md:px-10 relative overflow-hidden">
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

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-center">
          {/* LEFT COLUMN: Interactive Controls & Explanation */}
          <div className="text-center lg:text-left">
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
              <Smartphone className="w-3.5 h-3.5 text-[#f5b942]" />
              Simulador Interativo Real • iPhone Pro
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-white mb-4 leading-[1.1]">
              Navegue Pelo Aplicativo <br className="hidden sm:block" />
              <span className="sax-gold-gradient-text italic">Antes Mesmo de Entrar</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Clique direto dentro do iPhone ao lado (ou abaixo no celular) para abrir pastas, visualizar
              uma <strong className="text-white">partitura real com playback na mesma tela</strong> e testar
              nossa <strong className="text-[#ffe299]">Busca por Voz Inteligente</strong>!
            </p>

            {/* Quick Interactive Demo Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto lg:mx-0 mb-8 text-left">
              <button
                type="button"
                onClick={triggerVoiceDemo}
                className="sax-card rounded-2xl p-4 flex items-center gap-3.5 border border-[#f5b942]/35 hover:border-[#f5b942] cursor-pointer text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f5b942]/20 border border-[#f5b942]/40 flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5 text-[#f5b942]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1ed760] block">
                    Clique para Simular
                  </span>
                  <span className="text-sm font-black font-heading text-white">
                    🎤 Testar Busca por Voz
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedFolder(SIM_FOLDERS[0]);
                  setViewingSong(SIM_FOLDERS[0].songs[0]);
                  onEarnXp?.(30, "Abriu Partitura + Playback juntos no iPhone!");
                }}
                className="sax-card rounded-2xl p-4 flex items-center gap-3.5 border border-[#1ed760]/35 hover:border-[#1ed760] cursor-pointer text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-[#1ed760]/20 border border-[#1ed760]/40 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#ffe299] block">
                    Clique para Ver
                  </span>
                  <span className="text-sm font-black font-heading text-white">
                    🎼 Ver Partitura + Player
                  </span>
                </div>
              </button>
            </div>

            {/* Key Value Checklist */}
            <div className="space-y-2.5 max-w-xl mx-auto lg:mx-0 text-left mb-8">
              {[
                "Funciona em qualquer iPhone, Android, Tablet ou Computador",
                "Não ocupa memória do seu aparelho — tudo salvo na nuvem",
                "Partitura e Playback na mesma tela para você tocar sem parar",
              ].map((line, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#faf6ef]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#1ed760] shrink-0" />
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onScrollToOffers}
              className="sax-cta-btn px-8 py-4 rounded-2xl text-sm uppercase tracking-wider inline-flex items-center gap-2.5"
            >
              Quero Ter Esse App no Meu Bolso
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* RIGHT COLUMN: REALISTIC INTERACTIVE IPHONE 16 PRO MOCKUP */}
          <div className="flex justify-center">
            <div className="relative w-[320px] sm:w-[364px]">
              {/* Ambient Golden Halo Behind Phone */}
              <div
                className="pointer-events-none absolute -inset-6 rounded-[64px] opacity-45"
                style={{
                  background:
                    "radial-gradient(circle, rgba(245,185,66,0.28) 0%, rgba(30,215,96,0.12) 50%, transparent 72%)",
                  filter: "blur(32px)",
                }}
              />

              {/* Titanium Hardware Side Buttons */}
              <div className="absolute -left-[3px] top-[106px] w-[3px] h-7 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
              <div className="absolute -left-[3px] top-[152px] w-[3px] h-12 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
              <div className="absolute -left-[3px] top-[212px] w-[3px] h-12 rounded-l-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />
              <div className="absolute -right-[3px] top-[170px] w-[3px] h-16 rounded-r-md bg-gradient-to-b from-[#7a6445] to-[#3a2f20]" />

              <div className="iphone-16-frame relative z-10">
                <div className="iphone-16-inner-bezel">
                  <div className="iphone-16-screen select-none flex flex-col min-h-[640px]">
                    {/* iOS Top Status Bar + Live Dynamic Island */}
                    <div className="flex items-center justify-between px-6 pt-3 pb-2 bg-[#0b0805]">
                      <span className="text-[11px] font-bold text-white tabular-nums">9:41</span>

                      <div className="h-[26px] px-3.5 min-w-[114px] rounded-full bg-black border border-white/12 flex items-center justify-between gap-2">
                        <span className="text-[10px]">🎷</span>
                        <span className="text-[9px] font-bold text-[#ffe299] truncate max-w-[54px]">
                          {voiceSearching ? "Voz IA" : isPlaying ? "Tocando" : "SaxApp"}
                        </span>
                        <div className="flex items-end gap-[2px] h-3">
                          <span
                            className={`w-[2px] rounded-full bg-[#1ed760] ${
                              isPlaying || voiceSearching ? "animate-sax-eq-1" : "h-1.5 opacity-50"
                            }`}
                          />
                          <span
                            className={`w-[2px] rounded-full bg-[#f5b942] ${
                              isPlaying || voiceSearching ? "animate-sax-eq-2" : "h-2.5 opacity-65"
                            }`}
                          />
                          <span
                            className={`w-[2px] rounded-full bg-[#1ed760] ${
                              isPlaying || voiceSearching ? "animate-sax-eq-3" : "h-1 opacity-50"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-white">
                        <Wifi className="w-3 h-3" />
                        <BatteryFull className="w-3.5 h-3.5 text-[#1ed760]" />
                      </div>
                    </div>

                    {/* App Header Bar inside iPhone */}
                    <div className="px-4 py-3 bg-[#130e08] border-b border-[#f5b942]/15 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {(selectedFolder || viewingSong) && (
                          <button
                            type="button"
                            onClick={() => {
                              if (viewingSong) setViewingSong(null);
                              else setSelectedFolder(null);
                            }}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                            aria-label="Voltar"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <img src={logoClubeSax} alt="Clube do Sax" className="h-7 w-auto" />
                        <span className="font-heading font-black text-xs text-white">
                          Clube do Sax
                        </span>
                      </div>

                      {/* Sax Alto / Tenor Switch inside iPhone */}
                      <div className="inline-flex rounded-lg bg-black/60 p-0.5 border border-[#f5b942]/30">
                        <button
                          type="button"
                          onClick={() => onSaxTypeChange("alto")}
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-colors ${
                            saxType === "alto"
                              ? "bg-[#f5b942] text-[#1c1102]"
                              : "text-[#c2b59f]"
                          }`}
                        >
                          Alto Eb
                        </button>
                        <button
                          type="button"
                          onClick={() => onSaxTypeChange("tenor")}
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black transition-colors ${
                            saxType === "tenor"
                              ? "bg-[#f5b942] text-[#1c1102]"
                              : "text-[#c2b59f]"
                          }`}
                        >
                          Tenor Bb
                        </button>
                      </div>
                    </div>

                    {/* Interactive Search + Voice Mic Bar */}
                    <div className="px-4 py-2.5 bg-[#0e0a06] border-b border-white/5">
                      <button
                        type="button"
                        onClick={triggerVoiceDemo}
                        className="w-full flex items-center gap-2.5 rounded-xl bg-black/60 border border-white/12 hover:border-[#f5b942]/50 px-3 py-2 text-left transition-colors cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5 text-[#c2b59f]" />
                        <span className="text-[11px] text-[#c2b59f] flex-1 truncate">
                          {voiceSearching
                            ? "🎤 Ouvindo: 'Careless Whisper'..."
                            : "Toque no 🎤 para testar busca por voz"}
                        </span>
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            voiceSearching
                              ? "bg-[#1ed760] text-black animate-pulse"
                              : "bg-[#f5b942]/20 text-[#f5b942] border border-[#f5b942]/40"
                          }`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>

                    {/* DYNAMIC SCREEN CONTENT INSIDE IPHONE */}
                    <div className="flex-1 bg-[#090705] px-3.5 py-3 overflow-y-auto relative">
                      <AnimatePresence initial={false}>
                        {voiceSearching ? (
                          <motion.div
                            key="voice-overlay"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-4"
                          >
                            <div className="w-16 h-16 rounded-full bg-[#1ed760]/20 border-2 border-[#1ed760] flex items-center justify-center mb-4 animate-pulse">
                              <Mic className="w-7 h-7 text-[#1ed760]" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-[#1ed760] mb-1">
                              Reconhecimento Inteligente
                            </p>
                            <p className="text-sm font-bold text-white">
                              “Careless Whisper — Sax {saxType === "alto" ? "Alto Eb" : "Tenor Bb"}”
                            </p>
                            <p className="text-[11px] text-[#c2b59f] mt-2">
                              Localizando partitura em PDF + Playback Master...
                            </p>
                          </motion.div>
                        ) : viewingSong ? (
                          /* SHEET MUSIC + PLAYBACK SPLIT VIEW INSIDE IPHONE */
                          <motion.div
                            key={`song-${viewingSong.id}`}
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -14 }}
                            className="space-y-2.5"
                          >
                            <div className="flex items-center justify-between bg-[#161009] border border-[#f5b942]/30 rounded-xl px-3 py-2">
                              <div className="min-w-0">
                                <p className="text-xs font-black text-white truncate">
                                  {viewingSong.title}
                                </p>
                                <p className="text-[10px] text-[#ffe299]">
                                  Partitura {saxType === "alto" ? "Sax Alto (Eb)" : "Sax Tenor (Bb)"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => playSongInPhone(viewingSong)}
                                className="px-3 py-1.5 rounded-full bg-[#1ed760] text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0"
                              >
                                {activeAudioSong.id === viewingSong.id && isPlaying ? (
                                  <>
                                    <Pause className="w-3 h-3" fill="currentColor" /> Pausar
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-3 h-3" fill="currentColor" /> Dar Play
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Crisp Sheet Music Page inside iPhone */}
                            <div className="rounded-xl overflow-hidden bg-white border border-white/20 max-h-[295px] overflow-y-auto p-1.5">
                              <img
                                src={viewingSong.sheetSrc}
                                alt={`Partitura ${viewingSong.title}`}
                                className="w-full h-auto rounded"
                              />
                            </div>
                          </motion.div>
                        ) : selectedFolder ? (
                          /* INSIDE A FOLDER: PAIRED PDF + MP3 SONGS */
                          <motion.div
                            key={`folder-${selectedFolder.id}`}
                            initial={{ opacity: 0, x: 14 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -14 }}
                            className="space-y-2.5"
                          >
                            <div className="flex items-center justify-between px-1 mb-2">
                              <span className="text-xs font-black text-[#ffe299]">
                                {selectedFolder.emoji} {selectedFolder.name}
                              </span>
                              <span className="text-[10px] text-[#c2b59f]">
                                {selectedFolder.count}
                              </span>
                            </div>

                            {selectedFolder.songs.map((song) => (
                              <div
                                key={song.id}
                                className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-black text-white">{song.title}</p>
                                    <p className="text-[10px] text-[#c2b59f]">{song.artist}</p>
                                  </div>
                                  <span className="text-[9px] font-bold bg-[#f5b942]/15 text-[#ffe299] px-2 py-0.5 rounded-full">
                                    {saxType === "alto" ? "Eb" : "Bb"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setViewingSong(song)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#f5b942]/15 hover:bg-[#f5b942]/25 border border-[#f5b942]/35 py-1.5 text-[10px] font-extrabold text-[#ffe299]"
                                  >
                                    <FileText className="w-3 h-3" /> Abrir PDF
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => playSongInPhone(song)}
                                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1ed760]/15 hover:bg-[#1ed760]/25 border border-[#1ed760]/40 py-1.5 text-[10px] font-extrabold text-[#1ed760]"
                                  >
                                    <Headphones className="w-3 h-3" />
                                    {activeAudioSong.id === song.id && isPlaying ? "Pausar" : "Playback"}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        ) : (
                          /* ROOT FOLDERS LIST INSIDE IPHONE */
                          <motion.div
                            key="root-folders"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between px-1 mb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#ffe299]/80 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#f5b942]" />
                                Pastas do Acervo (+18 Estilos)
                              </span>
                              <span className="text-[9px] text-[#1ed760] font-bold">
                                Toque para abrir
                              </span>
                            </div>

                            {SIM_FOLDERS.map((folder) => (
                              <button
                                key={folder.id}
                                type="button"
                                onClick={() => {
                                  setSelectedFolder(folder);
                                  onEarnXp?.(20, `Explorou a pasta "${folder.name}"!`);
                                }}
                                className="w-full flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.04] hover:bg-[#f5b942]/12 border border-white/[0.08] hover:border-[#f5b942]/40 transition-all text-left cursor-pointer"
                              >
                                <div className="w-9 h-9 rounded-xl bg-[#f5b942]/15 border border-[#f5b942]/30 flex items-center justify-center text-base shrink-0">
                                  {folder.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-xs font-extrabold text-white block truncate">
                                    {folder.name}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#f5b942]">
                                    {folder.count}
                                  </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#c2b59f]" />
                              </button>
                            ))}

                            <div className="pt-1 text-center">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#c2b59f]/75">
                                <Folder className="w-3 h-3 text-[#f5b942]" />+ 13 outras pastas completas no App
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Persistent Bottom Playback Mini-Deck inside iPhone */}
                    <div className="bg-[#120d08] border-t border-[#f5b942]/20 px-4 pt-2.5 pb-2">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          type="button"
                          onClick={() => playSongInPhone(activeAudioSong)}
                          className="w-9 h-9 rounded-full bg-[#1ed760] text-black flex items-center justify-center shrink-0 shadow-md"
                          aria-label="Play/Pause no simulador"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" fill="currentColor" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[11px] font-black text-white truncate">
                            {activeAudioSong.title} — Playback
                          </p>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-gradient-to-r from-[#f5b942] to-[#1ed760] rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* iOS Bottom Home Bar */}
                      <div className="w-28 h-1 rounded-full bg-white/30 mx-auto mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppSimulationIphoneV3;
