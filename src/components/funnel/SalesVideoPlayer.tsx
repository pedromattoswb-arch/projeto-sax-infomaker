import { useState, useRef } from "react";
import { Play } from "lucide-react";

const SalesVideoPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Encoded to avoid plain-text exposure in source
  const _k = [97,76,100,45,98,100,99,73,48,71,115];
  const _v = _k.map(c => String.fromCharCode(c)).join("");

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[560px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black"
      style={{ aspectRatio: "16/9" }}
    >
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-black/30 via-black/60 to-black/80 cursor-pointer group transition-all"
          aria-label="Assistir vídeo de apresentação"
        >
          {/* Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${_v}/maxresdefault.jpg`}
            alt="Vídeo de apresentação SaxPlay"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

          {/* Play button */}
          <div className="relative z-20 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
            <Play className="w-7 h-7 md:w-9 md:h-9 text-white ml-1" fill="white" />
          </div>
          <span className="relative z-20 text-white/90 text-xs md:text-sm font-heading font-bold tracking-wide">
            ▶ ASSISTIR APRESENTAÇÃO
          </span>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${_v}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=1&fs=1&iv_load_policy=3&cc_load_policy=0`}
          title="Apresentação"
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          style={{ border: 0 }}
        />
      )}
    </div>
  );
};

export default SalesVideoPlayer;
