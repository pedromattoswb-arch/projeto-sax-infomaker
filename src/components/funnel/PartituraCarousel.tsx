import { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, Settings } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import p1 from "@/assets/partituras-exemplo/partitura-1.png";
import p3 from "@/assets/partituras-exemplo/partitura-3.png";
import p4 from "@/assets/partituras-exemplo/partitura-4.png";
import p5 from "@/assets/partituras-exemplo/partitura-5.png";
import p6 from "@/assets/partituras-exemplo/partitura-6.png";
import p7 from "@/assets/partituras-exemplo/partitura-7.png";
import p8 from "@/assets/partituras-exemplo/partitura-8.png";
import p9 from "@/assets/partituras-exemplo/partitura-9.png";

const allPartituras = [
  { id: "p1", src: p1 },
  { id: "p3", src: p3 },
  { id: "p4", src: p4 },
  { id: "p5", src: p5 },
  { id: "p6", src: p6 },
  { id: "p7", src: p7 },
  { id: "p8", src: p8 },
  { id: "p9", src: p9 },
];

const HIDDEN_KEY = "partitura-carousel-hidden";

const getHidden = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(HIDDEN_KEY) || "[]");
  } catch {
    return [];
  }
};

const PartituraCarousel = () => {
  const [hiddenIds, setHiddenIds] = useState<string[]>(getHidden);
  const [adminMode, setAdminMode] = useState(false);

  const visiblePartituras = useMemo(
    () => allPartituras.filter((p) => !hiddenIds.includes(p.id)),
    [hiddenIds]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false, align: "start" },
    [Autoplay({ delay: 3000, stopOnInteraction: false, playOnInit: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const hideImage = (id: string) => {
    const next = [...hiddenIds, id];
    setHiddenIds(next);
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(next));
  };

  const restoreAll = () => {
    setHiddenIds([]);
    localStorage.removeItem(HIDDEN_KEY);
  };

  if (visiblePartituras.length === 0) return null;

  return (
    <section className="pt-10 md:pt-14 pb-4 md:pb-6 px-0 bg-transparent overflow-hidden">
      <div className="max-w-3xl mx-auto text-center px-4 mb-6 md:mb-8 relative">
        <h2 className="text-[22px] md:text-3xl font-bold font-heading mb-2 text-white">
          Veja a Qualidade das Partituras que Você Vai Receber
        </h2>
        <p className="text-white/70 text-sm md:text-base font-body">
          Todas as partituras são profissionais, revisadas e vêm com playback para tocar junto
        </p>

        {/* Admin toggle */}
        <button
          onClick={() => setAdminMode(!adminMode)}
          className="absolute top-0 right-4 w-7 h-7 rounded-full flex items-center justify-center text-white/20 hover:text-white/60 transition-colors"
          aria-label="Modo admin"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Admin bar */}
      {adminMode && (
        <div className="max-w-3xl mx-auto px-4 mb-4 flex items-center justify-between">
          <p className="text-white/50 text-xs font-body">
            🛠 Modo admin — clique no <strong className="text-white/80">X</strong> para remover uma partitura do carrossel
          </p>
          {hiddenIds.length > 0 && (
            <button
              onClick={restoreAll}
              className="text-xs text-primary font-body font-semibold hover:underline"
            >
              Restaurar todas ({hiddenIds.length})
            </button>
          )}
        </div>
      )}

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[hsl(240,20%,10%)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[hsl(240,20%,10%)] to-transparent z-10 pointer-events-none" />

        {/* Navigation arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-1 md:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-1 md:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Próximo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {visiblePartituras.map((p, index) => (
              <div
                key={p.id}
                className="flex-[0_0_200px] md:flex-[0_0_260px] min-w-0 mx-2 md:mx-3 relative group/card"
              >
                {adminMode && (
                  <button
                    onClick={() => hideImage(p.id)}
                    className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    aria-label="Remover partitura"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <img
                  src={p.src}
                  alt={`Exemplo de partitura`}
                  className="w-full h-auto rounded-lg md:rounded-xl border border-white/10 shadow-lg shadow-black/30 bg-white"
                  loading={index < 3 ? "eager" : "lazy"}
                  draggable={false}
                  width={260}
                  height={367}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartituraCarousel;
