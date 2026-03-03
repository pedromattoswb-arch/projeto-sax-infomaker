import { useCallback, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const videoTestimonials = [
  { src: "/testimonials/julio-sampaio-sp.mp4", name: "Júlio Sampaio", city: "São Paulo", initials: "JS" },
  { src: "/testimonials/marcelo-cristian-rj.mp4", name: "Marcelo Cristian", city: "Rio de Janeiro", initials: "MC" },
  { src: "/testimonials/marcos-mattos-bsb.mp4", name: "Marcos Mattos", city: "Brasília", initials: "MM" },
  { src: "/testimonials/julia-costa-sp.mp4", name: "Júlia Costa", city: "São Paulo", initials: "JC" },
  { src: "/testimonials/barbara-oliveira-floripa.mp4", name: "Bárbara Oliveira", city: "Florianópolis", initials: "BO" },
  { src: "/testimonials/gabriela-santana-sp.mp4", name: "Gabriela Santana", city: "São Paulo", initials: "GS" },
];

// Generate a poster from the video's first frame
const generatePoster = (videoSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = videoSrc;

    video.addEventListener("loadeddata", () => {
      video.currentTime = 0.5; // Grab frame at 0.5s
    });

    video.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 360;
        canvas.height = video.videoHeight || 640;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } else {
          resolve("");
        }
      } catch {
        resolve("");
      }
    });

    video.addEventListener("error", () => resolve(""));

    // Timeout fallback
    setTimeout(() => resolve(""), 5000);
  });
};

const VideoTestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [posters, setPosters] = useState<Record<number, string>>({});

  // Generate posters on mount
  useEffect(() => {
    videoTestimonials.forEach((t, i) => {
      generatePoster(t.src).then((dataUrl) => {
        if (dataUrl) {
          setPosters((prev) => ({ ...prev, [i]: dataUrl }));
        }
      });
    });
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const handlePlay = (index: number) => {
    setActiveIndex(index);
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
      }
    });
  };

  const handleVideoClick = (index: number) => {
    setActiveIndex(index);
    setTimeout(() => {
      const video = videoRefs.current[index];
      if (video) {
        video.play();
      }
    }, 50);
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
                    {activeIndex === i ? (
                      <video
                        ref={(el) => { videoRefs.current[i] = el; }}
                        src={t.src}
                        controls
                        autoPlay
                        preload="auto"
                        playsInline
                        onPlay={() => handlePlay(i)}
                        poster={posters[i] || undefined}
                        className="w-full aspect-[9/16] object-cover bg-[hsl(240,20%,12%)]"
                      />
                    ) : (
                      <button
                        onClick={() => handleVideoClick(i)}
                        className="relative w-full aspect-[9/16] flex flex-col items-center justify-center cursor-pointer group"
                        aria-label={`Assistir depoimento de ${t.name}`}
                      >
                        {/* Poster image or gradient placeholder */}
                        {posters[i] ? (
                          <img
                            src={posters[i]}
                            alt={`Thumbnail ${t.name}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(240,20%,18%)] via-[hsl(240,15%,22%)] to-[hsl(240,20%,12%)] flex flex-col items-center justify-center gap-2">
                            <span className="text-3xl font-heading font-bold text-white/20">{t.initials}</span>
                          </div>
                        )}

                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50 group-hover:from-black/5 group-hover:to-black/40 transition-all" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 md:w-7 md:h-7 text-white fill-white ml-0.5" />
                          </div>
                          <span className="text-white/70 text-[11px] md:text-xs font-body font-medium">Assistir</span>
                        </div>
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
