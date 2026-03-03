import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const videoTestimonials = [
  { src: "/testimonials/julio-sampaio-sp.mp4", name: "Júlio Sampaio", city: "São Paulo" },
  { src: "/testimonials/marcelo-cristian-rj.mp4", name: "Marcelo Cristian", city: "Rio de Janeiro" },
  { src: "/testimonials/marcos-mattos-bsb.mp4", name: "Marcos Mattos", city: "Brasília" },
  { src: "/testimonials/julia-costa-sp.mp4", name: "Júlia Costa", city: "São Paulo" },
  { src: "/testimonials/barbara-oliveira-floripa.mp4", name: "Bárbara Oliveira", city: "Florianópolis" },
  { src: "/testimonials/gabriela-santana-sp.mp4", name: "Gabriela Santana", city: "São Paulo" },
];

const VideoTestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handlePlay = (index: number) => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
      }
    });
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex gap-4">
            {videoTestimonials.map((t, i) => (
              <div
                key={i}
                className="flex-[0_0_85%] sm:flex-[0_0_48%] lg:flex-[0_0_31.5%] min-w-0"
              >
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur">
                  <video
                    ref={(el) => { videoRefs.current[i] = el; }}
                    src={t.src}
                    controls
                    preload="metadata"
                    playsInline
                    onPlay={() => handlePlay(i)}
                    className="w-full aspect-[9/16] object-cover bg-black"
                  />
                  <div className="px-4 py-3">
                    <p className="text-white font-heading font-bold text-sm">{t.name}</p>
                    <p className="text-white/60 text-xs font-body">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoTestimonialCarousel;
