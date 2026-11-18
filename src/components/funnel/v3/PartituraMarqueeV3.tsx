import { useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { FileText, ZoomIn, X, CheckCircle2, Music } from "lucide-react";

import p1 from "@/assets/partituras-exemplo/partitura-1.png";
import p3 from "@/assets/partituras-exemplo/partitura-3.png";
import p4 from "@/assets/partituras-exemplo/partitura-4.png";
import p5 from "@/assets/partituras-exemplo/partitura-5.png";
import p6 from "@/assets/partituras-exemplo/partitura-6.png";
import p8 from "@/assets/partituras-exemplo/partitura-8.png";
import p9 from "@/assets/partituras-exemplo/partitura-9.png";
import type { SaxType } from "./SaxThematicEffects";

interface SheetItem {
  id: string;
  src: string;
  title: string;
  artist: string;
  genre: string;
}

const FULL_SHEETS: SheetItem[] = [
  { id: "s1", src: p1, title: "Over The Rainbow", artist: "Clássico Internacional", genre: "Cinema & Pop" },
  { id: "s2", src: p3, title: "Além do Horizonte", artist: "Roberto Carlos", genre: "MPB Clássico" },
  { id: "s3", src: p5, title: "A Viagem", artist: "Roupa Nova", genre: "Pop Brasil" },
  { id: "s4", src: p6, title: "A Sua", artist: "Marisa Monte", genre: "MPB & Soul" },
  { id: "s5", src: p8, title: "Ainda Lembro", artist: "Marisa Monte & Ed Motta", genre: "MPB Groove" },
  { id: "s6", src: p4, title: "Além do Horizonte (Arr. II)", artist: "Roberto Carlos", genre: "MPB Clássico" },
  { id: "s7", src: p9, title: "Ainda Lembro (Arr. Completo)", artist: "Marisa Monte", genre: "MPB Groove" },
];

const HALF_TRACK_SHEETS = [...FULL_SHEETS, ...FULL_SHEETS];

interface PartituraMarqueeV3Props {
  saxType: SaxType;
}

const PartituraMarqueeV3 = ({ saxType }: PartituraMarqueeV3Props) => {
  const hookReduced = useReducedMotion();
  const prefersReducedMotion =
    Boolean(hookReduced) ||
    (typeof window !== "undefined" &&
      Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches));
  const [zoomedSheet, setZoomedSheet] = useState<SheetItem | null>(null);

  useEffect(() => {
    if (!zoomedSheet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedSheet(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomedSheet]);

  return (
    <section id="partituras" className="py-12 md:py-16 relative">
      {/* 1. Title */}
      <div className="sax-container max-w-5xl px-4 sm:px-6 text-center mb-6 md:mb-8">
        <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-4">
          <FileText className="w-4 h-4 text-[#f5b942] shrink-0" />
          <span>Diagramação Limpa em Alta Definição</span>
        </div>

        <h2 className="sax-h2 text-white">
          Veja a Qualidade Real das <span className="sax-gold-gradient-text italic">Partituras</span>
        </h2>
      </div>

      {/* 2. Sheet Music Showcase (Directly below Title!) */}
      {prefersReducedMotion ? (
        <div className="sax-container px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {FULL_SHEETS.map((sheet) => (
            <button
              key={sheet.id}
              type="button"
              onClick={() => setZoomedSheet(sheet)}
              className="rounded-2xl overflow-hidden bg-white border-2 border-[#f5b942]/35 shadow-lg text-left flex flex-col cursor-pointer"
            >
              <div className="bg-[#120d07] text-white px-3 py-2 flex items-center justify-between gap-1">
                <span className="text-[11px] font-extrabold text-[#ffe49e] truncate">
                  {sheet.genre}
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1ed760]/20 text-[#1ed760] shrink-0">
                  Eb/Bb
                </span>
              </div>
              <div className="aspect-[210/288] bg-white overflow-hidden">
                <img
                  src={sheet.src}
                  alt={`Partitura ${sheet.title} — ${sheet.artist}`}
                  width={260}
                  height={356}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="bg-[#faf6ef] px-3 py-2 border-t border-black/10">
                <p className="text-xs font-black text-[#181109] truncate">{sheet.title}</p>
                <p className="text-[11px] font-semibold text-[#6b5a45] truncate">{sheet.artist}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="relative w-full sax-marquee-wrapper py-2 mb-6">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#070503] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#070503] to-transparent z-10" />

          <div className="overflow-hidden w-full">
            <div className="sax-marquee-track">
              {[0, 1].map((halfIdx) => (
                <div
                  key={halfIdx}
                  className="flex items-stretch gap-3.5 pr-3.5 shrink-0"
                  aria-hidden={halfIdx === 1 ? "true" : undefined}
                >
                  {HALF_TRACK_SHEETS.map((sheet, idx) => (
                    <button
                      key={`${halfIdx}-${sheet.id}-${idx}`}
                      type="button"
                      tabIndex={halfIdx === 1 ? -1 : 0}
                      onClick={() => setZoomedSheet(sheet)}
                      className="group relative w-[206px] sm:w-[244px] md:w-[268px] shrink-0 rounded-2xl overflow-hidden bg-white border-2 border-[#f5b942]/35 shadow-[0_16px_36px_rgba(0,0,0,0.72)] hover:border-[#f5b942] hover:-translate-y-1 transition-all duration-300 text-left flex flex-col cursor-pointer"
                    >
                      <div className="bg-[#120d07] text-white px-3 py-2 flex items-center justify-between gap-2 border-b border-[#f5b942]/25">
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#ffe49e] truncate">
                          <Music className="w-3 h-3 text-[#f5b942] shrink-0" />
                          {sheet.genre}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#1ed760]/20 text-[#1ed760] shrink-0">
                          {saxType === "alto" ? "Eb & Bb" : "Eb & Bb"}
                        </span>
                      </div>

                      <div className="relative w-full aspect-[210/288] bg-white overflow-hidden">
                        <img
                          src={sheet.src}
                          alt={`Partitura ${sheet.title} — ${sheet.artist}`}
                          width={268}
                          height={368}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                          draggable={false}
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 rounded-full bg-[#0d0905]/90 border border-[#f5b942]/60 px-3.5 py-1.5 text-xs font-bold text-[#ffe49e] shadow-xl">
                            <ZoomIn className="w-3.5 h-3.5 text-[#f5b942]" />
                            Ampliar Folha
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#faf6ef] px-3.5 py-2.5 border-t border-black/10 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-black font-heading text-[#181109] truncate leading-tight">
                            {sheet.title}
                          </p>
                          <p className="text-[11px] font-semibold text-[#5c4c38] truncate">
                            {sheet.artist}
                          </p>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#181109] text-[#ffe49e] px-2 py-1 rounded-md shrink-0">
                          PDF + MP3
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Description (Subtitle) + Quality Pills */}
      <div className="sax-container max-w-4xl px-4 sm:px-6 text-center">
        <p className="sax-body-lg text-[#cfc3ae] max-w-2xl mx-auto">
          Folhas limpas, revisadas compasso a compasso, prontas para ler no celular, tablet ou
          imprimir — já transpostas para{" "}
          <strong className="text-[#ffe49e]">Sax Alto (Eb) e Sax Tenor (Bb)</strong> e acompanhadas
          de playback profissional.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-5 text-xs sm:text-sm font-bold text-[#ffe49e]">
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5b942]/25 rounded-full px-3.5 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1ed760] shrink-0" />
            Notas Grandes e Legíveis
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5b942]/25 rounded-full px-3.5 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1ed760] shrink-0" />
            Cifras + Melodia Completa
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5b942]/25 rounded-full px-3.5 py-1.5">
            <ZoomIn className="w-4 h-4 text-[#f5b942] shrink-0" />
            Clique na folha para dar zoom
          </span>
        </div>
      </div>

      {/* Full HD Sheet Lightbox Modal */}
      {zoomedSheet && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Visualização da partitura ${zoomedSheet.title}`}
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          onClick={() => setZoomedSheet(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] bg-[#120d07] border border-[#f5b942]/45 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-[#f5b942]/20">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-black font-heading text-white truncate">
                  {zoomedSheet.title} — <span className="text-[#ffe49e]">{zoomedSheet.artist}</span>
                </h3>
                <p className="text-xs text-[#cfc3ae]">
                  Amostra real em PDF de alta resolução • Incluso Playback de Estúdio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomedSheet(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer"
                aria-label="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-3 sm:p-4 bg-white flex justify-center">
              <img
                src={zoomedSheet.src}
                alt={zoomedSheet.title}
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PartituraMarqueeV3;
