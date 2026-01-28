import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import partitura1 from "@/assets/partituras/partitura-exemplo-1.png";
import partitura2 from "@/assets/partituras/partitura-exemplo-2.png";
import partitura3 from "@/assets/partituras/partitura-exemplo-3.png";

const sheetMusicImages = [
  { src: partitura1, label: "Jazz" },
  { src: partitura2, label: "Pop Ballad" },
  { src: partitura3, label: "Gospel" },
];

const SheetMusicPreview = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: false,
    align: "center",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="w-full space-y-2">
      <h3 className="text-sm font-bold text-foreground text-center">
        📄 Veja exemplos de partituras:
      </h3>

      <div className="relative">
        {/* Embla Carousel */}
        <div className="overflow-hidden rounded-xl border border-border bg-card/30" ref={emblaRef}>
          <div className="flex">
            {sheetMusicImages.map((item, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative"
              >
                <img
                  src={item.src}
                  alt={`Partitura exemplo ${index + 1}`}
                  className="w-full h-48 object-cover object-top"
                  draggable={false}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-2">
                  <span className="text-xs font-medium text-foreground">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Deslize para ver mais exemplos →
      </p>
    </div>
  );
};

export default SheetMusicPreview;
