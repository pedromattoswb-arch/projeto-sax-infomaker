import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import type { Song } from "@/types/acervo";

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const AudioPlayer = ({ currentSong, isPlaying, onPlayPause, onNext, onPrev }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.audioUrl) return;

    audio.src = currentSong.audioUrl;
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentSong?.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(audio.currentTime);
    setDuration(audio.duration || 0);
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setProgress(time);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl px-4 py-3 md:py-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        muted={muted}
        preload="metadata"
      />

      <div className="max-w-4xl mx-auto flex items-center gap-3 md:gap-5">
        {/* Song info */}
        <div className="flex-1 min-w-0">
          <p className="font-heading font-bold text-sm md:text-base text-foreground truncate">{currentSong.title}</p>
          <p className="text-xs text-muted-foreground font-body truncate">{currentSong.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button onClick={onPrev} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Anterior">
            <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={onPlayPause}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
            aria-label={isPlaying ? "Pausar" : "Tocar"}
          >
            {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
          </button>
          <button onClick={onNext} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Próxima">
            <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
          <span className="text-xs text-muted-foreground font-mono w-10 text-right">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="flex-1 h-1.5 rounded-full accent-primary cursor-pointer"
          />
          <span className="text-xs text-muted-foreground font-mono w-10">{formatTime(duration)}</span>
        </div>

        {/* Volume */}
        <button
          onClick={() => setMuted(!muted)}
          className="hidden md:block p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={muted ? "Ativar som" : "Mudo"}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden mt-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 rounded-full accent-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-0.5">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
