import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const testimonialImages = Array.from({ length: 10 }, (_, i) => `/testimonials/depoimento-${i + 1}.png`);

const TestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="w-full">
      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-white/10" ref={emblaRef}>
          <div className="flex">
            {testimonialImages.map((src, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0">
                <img
                  src={src}
                  alt={`Depoimento de saxofonista ${index + 1}`}
                  className="w-full h-auto object-contain"
                  loading="eager"
                  decoding="async"
                  fetchPriority={index < 2 ? "high" : "auto"}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Próximo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
