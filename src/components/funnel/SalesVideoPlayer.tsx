import { useState } from "react";
import { Play } from "lucide-react";

const V = [97,76,100,45,98,100,99,73,48,71,115];

const SalesVideoPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const vid = V.map(c => String.fromCharCode(c)).join("");

  const customThumb = "/thumbnail-vsl.webp";

  return (
    <div
      className="relative w-full max-w-[560px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black mb-5 md:mb-6"
      style={{ aspectRatio: "16/9" }}
    >
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 cursor-pointer group"
          aria-label="Assistir vídeo de apresentação"
        >
          {/* Thumbnail with fallback */}
          <img
            src={customThumb}
            alt="Vídeo de apresentação SaxPlay"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70 group-hover:via-black/40 transition-all duration-300" />

          {/* Play button */}
          <div className="relative z-20 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-primary transition-all duration-300 ring-4 ring-white/20">
            <Play className="w-7 h-7 md:w-9 md:h-9 text-white ml-1" fill="white" />
          </div>
          <span className="relative z-20 text-white text-xs md:text-sm font-heading font-bold tracking-wide drop-shadow-md">
            ▶ ASSISTIR APRESENTAÇÃO
          </span>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1&controls=1&fs=1&iv_load_policy=3`}
          title="Apresentação SaxPlay"
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ border: 0 }}
        />
      )}
    </div>
  );
};

export default SalesVideoPlayer;
