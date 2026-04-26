import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";

const V = [97, 76, 100, 45, 98, 100, 99, 73, 48, 71, 115];

const SalesVideoPlayer = () => {
  const vid = V.map((c) => String.fromCharCode(c)).join("");
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  // Load YouTube IFrame API once
  useEffect(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      (window as any).onYouTubeIframeAPIReady = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initPlayer = useCallback(() => {
    if (playerRef.current) return;

    playerRef.current = new (window as any).YT.Player("yt-player-container", {
      videoId: vid,
      playerVars: {
        autoplay: 1,
        mute: 1, // Must mute for autoplay policy
        rel: 0,
        modestbranding: 1,
        controls: 1,
        fs: 1,
        iv_load_policy: 3,
        playsinline: 1,
      },
      events: {
        onReady: (event: any) => {
          setIsReady(true);
          event.target.playVideo();
          setIsPlaying(true);
          // Unmute after a short delay (user gesture not needed since they landed on page)
          setTimeout(() => {
            try {
              event.target.unMute();
              event.target.setVolume(100);
            } catch {}
          }, 500);
        },
        onStateChange: (event: any) => {
          const YT = (window as any).YT;
          if (event.data === YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED
          ) {
            setIsPlaying(false);
          }
        },
      },
    });
  }, [vid]);

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    const player = playerRef.current;
    const YT = (window as any).YT;

    try {
      const state = player.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        setShowOverlay(true);
      } else {
        player.playVideo();
        // Also try to unmute on user interaction
        try {
          player.unMute();
          player.setVolume(100);
        } catch {}
        setShowOverlay(false);
      }
    } catch {}
  };

  // Hide overlay after play starts
  useEffect(() => {
    if (isPlaying && isReady) {
      const t = setTimeout(() => setShowOverlay(false), 2000);
      return () => clearTimeout(t);
    }
  }, [isPlaying, isReady]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[560px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black mb-5 md:mb-6"
      style={{ aspectRatio: "16/9" }}
      onClick={togglePlayPause}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => isPlaying && setShowOverlay(false)}
    >
      {/* YouTube Player container */}
      <div id="yt-player-container" className="absolute inset-0 w-full h-full" />

      {/* Thumbnail shown until player is ready */}
      {!isReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black">
          <img
            src="/thumbnail-vsl.webp"
            alt="Vídeo de apresentação SaxPlay"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
          <div className="relative z-20 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl ring-4 ring-white/20 animate-pulse">
            <Play className="w-7 h-7 md:w-9 md:h-9 text-white ml-1" fill="white" />
          </div>
          <span className="relative z-20 text-white text-xs md:text-sm font-heading font-bold tracking-wide drop-shadow-md">
            CARREGANDO...
          </span>
        </div>
      )}

      {/* Play/Pause overlay button */}
      {isReady && showOverlay && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
            {isPlaying ? (
              <Pause className="w-6 h-6 md:w-8 md:h-8 text-white" fill="white" />
            ) : (
              <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="white" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesVideoPlayer;
