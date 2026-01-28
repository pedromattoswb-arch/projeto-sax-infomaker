import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import depoimento1 from "@/assets/testimonials/depoimento-1.png";
import depoimento2 from "@/assets/testimonials/depoimento-2.png";
import depoimento3 from "@/assets/testimonials/depoimento-3.png";
import depoimento4 from "@/assets/testimonials/depoimento-4.png";
import depoimento5 from "@/assets/testimonials/depoimento-5.png";
import depoimento6 from "@/assets/testimonials/depoimento-6.png";
import depoimento7 from "@/assets/testimonials/depoimento-7.png";
import depoimento8 from "@/assets/testimonials/depoimento-8.png";
import depoimento9 from "@/assets/testimonials/depoimento-9.png";
import depoimento10 from "@/assets/testimonials/depoimento-10.png";

const testimonialImages = [
  depoimento1,
  depoimento2,
  depoimento3,
  depoimento4,
  depoimento5,
  depoimento6,
  depoimento7,
  depoimento8,
  depoimento9,
  depoimento10,
];

const TestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="w-full space-y-3">
      <h3 className="text-base font-bold text-foreground text-center">
        💬 O que dizem os saxofonistas:
      </h3>

      <div className="relative">
        {/* Embla Carousel */}
        <div className="overflow-hidden rounded-xl border border-border bg-card/30" ref={emblaRef}>
          <div className="flex">
            {testimonialImages.map((src, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0"
              >
                <img
                  src={src}
                  alt={`Depoimento de saxofonista ${index + 1} sobre o acervo de partituras`}
                  className="w-full h-auto object-contain"
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
