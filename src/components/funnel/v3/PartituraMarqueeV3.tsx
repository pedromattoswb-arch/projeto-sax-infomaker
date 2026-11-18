import { useState } from "react";
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

// Curated 100% full, dense A4 pages (excluding half-blank second pages so there are zero visual holes)
const FULL_SHEETS: SheetItem[] = [
  { id: "s1", src: p1, title: "Over The Rainbow", artist: "Clássico Internacional", genre: "Cinema & Pop" },
  { id: "s2", src: p3, title: "Além do Horizonte", artist: "Roberto Carlos", genre: "MPB Clássico" },
  { id: "s3", src: p5, title: "A Viagem", artist: "Roupa Nova", genre: "Pop Brasil" },
  { id: "s4", src: p6, title: "A Sua", artist: "Marisa Monte", genre: "MPB & Soul" },
  { id: "s5", src: p8, title: "Ainda Lembro", artist: "Marisa Monte & Ed Motta", genre: "MPB Groove" },
  { id: "s6", src: p4, title: "Além do Horizonte (Arr. II)", artist: "Roberto Carlos", genre: "MPB Clássico" },
  { id: "s7", src: p9, title: "Ainda Lembro (Arr. Completo)", artist: "Marisa Monte", genre: "MPB Groove" },
];

// Double inside each half (~3900px per half) so even 4K ultrawide screens never see a gap
const HALF_TRACK_SHEETS = [...FULL_SHEETS, ...FULL_SHEETS];

interface PartituraMarqueeV3Props {
  saxType: SaxType;
  onEarnXp?: (amount: number, reason: string) => void;
}

const PartituraMarqueeV3 = ({ saxType, onEarnXp }: PartituraMarqueeV3Props) => {
  const [zoomedSheet, setZoomedSheet] = useState<SheetItem | null>(null);

  const handleInspect = (sheet: SheetItem) => {
    setZoomedSheet(sheet);
    onEarnXp?.(25, `Partitura "${sheet.title}" inspecionada em HD!`);
  };

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-5 text-center mb-8 md:mb-10">
        <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
          <FileText className="w-3.5 h-3.5 text-[#f5b942]" />
          Diagramação Limpa em Alta Definição
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-heading tracking-tight text-white mb-3">
          Veja a Qualidade Real das <span className="sax-gold-gradient-text italic">Partituras</span>
        </h2>

        <p className="text-sm sm:text-base md:text-lg text-[#c2b59f] max-w-2xl mx-auto">
          Folhas limpas, revisadas compasso a compasso, prontas para ler no celular, tablet ou imprimir — já transpostas para{" "}
          <strong className="text-[#ffe299]">
            {saxType === "alto" ? "Sax Alto (Eb)" : "Sax Tenor (Bb)"}
          </strong>{" "}
          e acompanhadas de playback.
        </p>

        {/* Quick Quality Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-5 text-xs font-bold text-[#ffe299]">
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5b942]/25 rounded-full px-3.5 py-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1ed760]" />
            Notas Grandes e Legíveis
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5b942]/25 rounded-full px-3.5 py-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1ed760]" />
            Cifras + Melodia Completa
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-[#f5b942]/25 rounded-full px-3.5 py-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-[#f5b942]" />
            Clique em qualquer folha para ampliar
          </span>
        </div>
      </div>

      {/* Continuous Seamless Non-Stop Ribbon — Side-by-Side Sheets Without Any Gaps */}
      <div className="relative w-full sax-marquee-wrapper py-2">
        {/* Soft Left & Right Stage Edge Vignette */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-r from-[#070503] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-24 bg-gradient-to-l from-[#070503] to-transparent z-10" />

        <div className="overflow-hidden w-full">
          <div className="sax-marquee-track">
            {/* Two identical halves for mathematically seamless -50% loop */}
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
                    onClick={() => handleInspect(sheet)}
                    className="group relative w-[220px] sm:w-[250px] md:w-[272px] shrink-0 rounded-2xl overflow-hidden bg-white border-2 border-[#f5b942]/35 shadow-[0_18px_40px_rgba(0,0,0,0.75)] hover:border-[#f5b942] hover:-translate-y-1.5 transition-all duration-300 text-left flex flex-col cursor-pointer"
                  >
                    {/* Top Studio Header Strip on Each Sheet */}
                    <div className="bg-[#120d07] text-white px-3 py-2 flex items-center justify-between border-b border-[#f5b942]/25">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#ffe299] truncate">
                        <Music className="w-3 h-3 text-[#f5b942] shrink-0" />
                        {sheet.genre}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#1ed760]/20 text-[#1ed760] shrink-0">
                        {saxType === "alto" ? "Alto Eb" : "Tenor Bb"}
                      </span>
                    </div>

                    {/* Uniform A4 Crisp Sheet Area — Zero Blank Holes */}
                    <div className="relative w-full aspect-[210/288] bg-white overflow-hidden">
                      <img
                        src={sheet.src}
                        alt={`Partitura ${sheet.title} — ${sheet.artist}`}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="eager"
                        draggable={false}
                      />

                      {/* Subtle Hover Zoom Pill */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 rounded-full bg-[#0d0905]/90 border border-[#f5b942]/60 px-3.5 py-1.5 text-xs font-bold text-[#ffe299] shadow-xl">
                          <ZoomIn className="w-3.5 h-3.5 text-[#f5b942]" />
                          Ampliar Folha
                        </span>
                      </div>
                    </div>

                    {/* Bottom Song Metadata Footer */}
                    <div className="bg-[#faf6ef] px-3.5 py-2.5 border-t border-black/10 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-black font-heading text-[#181109] truncate leading-tight">
                          {sheet.title}
                        </p>
                        <p className="text-[10px] font-semibold text-[#6b5a45] truncate">
                          {sheet.artist}
                        </p>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[#181109] text-[#ffe299] px-2 py-1 rounded-md shrink-0">
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

      {/* Full HD Sheet Lightbox Modal */}
      {zoomedSheet && (
        <div
          className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedSheet(null)}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] bg-[#120d07] border border-[#f5b942]/45 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#f5b942]/20">
              <div>
                <h3 className="text-base font-black font-heading text-white">
                  {zoomedSheet.title} — <span className="text-[#ffe299]">{zoomedSheet.artist}</span>
                </h3>
                <p className="text-xs text-[#c2b59f]">
                  Amostra real em PDF de alta resolução • Incluso Playback de Estúdio
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomedSheet(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 bg-white flex justify-center">
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
