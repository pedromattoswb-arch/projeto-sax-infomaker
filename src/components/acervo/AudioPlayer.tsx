import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2 } from "lucide-react";
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = pct * duration;
    setProgress(pct * duration);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{ backgroundColor: 'hsl(var(--player))' }}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
        muted={muted}
        preload="metadata"
      />

      {/* Progress bar - clickable */}
      <div
        className="w-full h-1.5 cursor-pointer group relative"
        onClick={handleSeek}
        style={{ backgroundColor: 'hsl(var(--player-muted) / 0.3)' }}
      >
        <div
          className="h-full bg-primary transition-[width] duration-100 relative"
          style={{ width: `${progressPct}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-md" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-3">
        {/* Album art + song info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'hsl(var(--player-muted) / 0.2)' }}>
            <Music2 className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
          </div>
          <div className="min-w-0">
            <p className="font-heading font-bold text-sm md:text-base truncate" style={{ color: 'hsl(var(--player-foreground))' }}>
              {currentSong.title}
            </p>
            <p className="text-xs truncate" style={{ color: 'hsl(var(--player-muted))' }}>
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5 md:gap-1.5 shrink-0">
          <button
            onClick={onPrev}
            className="p-2 transition-colors rounded-full hover:bg-white/10"
            style={{ color: 'hsl(var(--player-muted))' }}
            aria-label="Anterior"
          >
            <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={onPlayPause}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
            aria-label={isPlaying ? "Pausar" : "Tocar"}
          >
            {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
          </button>
          <button
            onClick={onNext}
            className="p-2 transition-colors rounded-full hover:bg-white/10"
            style={{ color: 'hsl(var(--player-muted))' }}
            aria-label="Próxima"
          >
            <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Desktop time */}
        <div className="hidden md:flex items-center gap-2 min-w-[100px]">
          <span className="text-xs font-mono" style={{ color: 'hsl(var(--player-muted))' }}>{formatTime(progress)}</span>
          <span className="text-xs" style={{ color: 'hsl(var(--player-muted) / 0.5)' }}>/</span>
          <span className="text-xs font-mono" style={{ color: 'hsl(var(--player-muted))' }}>{formatTime(duration)}</span>
        </div>

        {/* Volume */}
        <button
          onClick={() => setMuted(!muted)}
          className="hidden md:flex p-2 transition-colors rounded-full hover:bg-white/10 items-center justify-center"
          style={{ color: 'hsl(var(--player-muted))' }}
          aria-label={muted ? "Ativar som" : "Mudo"}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile time */}
      <div className="md:hidden flex justify-between text-[10px] font-mono px-4 pb-2" style={{ color: 'hsl(var(--player-muted))' }}>
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
