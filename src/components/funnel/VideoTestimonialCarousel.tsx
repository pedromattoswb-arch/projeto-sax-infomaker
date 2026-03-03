import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
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
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(new Set());

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handlePlay = (index: number) => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
      }
    });
  };

  const handleVideoClick = (index: number) => {
    setLoadedIndexes((prev) => new Set(prev).add(index));
    // Need a small delay so the src is set before playing
    setTimeout(() => {
      const video = videoRefs.current[index];
      if (video) {
        video.play();
        handlePlay(index);
      }
    }, 100);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex gap-3 md:gap-4">
            {videoTestimonials.map((t, i) => (
              <div
                key={i}
                className="flex-[0_0_72%] sm:flex-[0_0_48%] lg:flex-[0_0_31.5%] min-w-0"
              >
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur">
                  <div className="relative">
                    <video
                      ref={(el) => { videoRefs.current[i] = el; }}
                      src={loadedIndexes.has(i) ? t.src : t.src}
                      controls={loadedIndexes.has(i)}
                      preload="metadata"
                      playsInline
                      onPlay={() => handlePlay(i)}
                      className="w-full aspect-[9/16] object-cover bg-[hsl(240,20%,15%)]"
                    />
                    {!loadedIndexes.has(i) && (
                      <button
                        onClick={() => handleVideoClick(i)}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-black/20 via-transparent to-black/60 hover:from-black/10 transition-all"
                        aria-label={`Assistir depoimento de ${t.name}`}
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30">
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </div>
                        <span className="text-white/80 text-xs font-body font-medium">Toque para assistir</span>
                      </button>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-white font-heading font-bold text-sm md:text-base">{t.name}</p>
                    <p className="text-white/60 text-xs md:text-sm font-body">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoTestimonialCarousel;
