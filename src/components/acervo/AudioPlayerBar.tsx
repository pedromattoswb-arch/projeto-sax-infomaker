import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, Music2 } from "lucide-react";
import type { DriveFile } from "@/hooks/useDriveFiles";

interface AudioPlayerBarProps {
  currentAudio: DriveFile | null;
  audioFiles: DriveFile[];
  onClose: () => void;
}

export interface AudioPlayerHandle {
  play: (file: DriveFile) => void;
  toggle: () => void;
  isPlaying: boolean;
  currentId: string | null;
}

const formatTime = (s: number) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const AudioPlayerBar = forwardRef<AudioPlayerHandle, AudioPlayerBarProps>(
  ({ currentAudio, audioFiles, onClose }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [muted, setMuted] = useState(false);
    const [internalFile, setInternalFile] = useState<DriveFile | null>(currentAudio);

    const activeFile = internalFile || currentAudio;

    useEffect(() => {
      if (currentAudio) {
        setInternalFile(currentAudio);
        setIsPlaying(true);
      }
    }, [currentAudio?.id]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio || !activeFile?.streamUrl) return;
      audio.src = activeFile.streamUrl;
      if (isPlaying) audio.play().catch(() => {});
    }, [activeFile?.id]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) audio.play().catch(() => {});
      else audio.pause();
    }, [isPlaying]);

    const handleTimeUpdate = useCallback(() => {
      const audio = audioRef.current;
      if (audio) {
        setProgress(audio.currentTime);
        setDuration(audio.duration || 0);
      }
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

    const playNext = useCallback(() => {
      if (!activeFile || audioFiles.length === 0) return;
      const idx = audioFiles.findIndex((f) => f.id === activeFile.id);
      const next = audioFiles[(idx + 1) % audioFiles.length];
      setInternalFile(next);
      setIsPlaying(true);
    }, [activeFile, audioFiles]);

    const playPrev = useCallback(() => {
      if (!activeFile || audioFiles.length === 0) return;
      const idx = audioFiles.findIndex((f) => f.id === activeFile.id);
      const prev = audioFiles[(idx - 1 + audioFiles.length) % audioFiles.length];
      setInternalFile(prev);
      setIsPlaying(true);
    }, [activeFile, audioFiles]);

    useImperativeHandle(ref, () => ({
      play: (file: DriveFile) => {
        if (activeFile?.id === file.id) {
          setIsPlaying((p) => !p);
        } else {
          setInternalFile(file);
          setIsPlaying(true);
        }
      },
      toggle: () => setIsPlaying((p) => !p),
      isPlaying,
      currentId: activeFile?.id || null,
    }), [activeFile?.id, isPlaying]);

    if (!activeFile) return null;

    const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ backgroundColor: 'hsl(var(--player))' }}>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          muted={muted}
          preload="auto"
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
          {/* Album art placeholder + song info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'hsl(var(--player-muted) / 0.2)' }}>
              <Music2 className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <div className="min-w-0">
              <p className="font-body font-bold text-xs sm:text-sm line-clamp-1 break-words" style={{ color: 'hsl(var(--player-foreground))' }}>
                {activeFile.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'hsl(var(--primary))' }}>
                  Playback
                </span>
                <span className="text-[10px] md:hidden" style={{ color: 'hsl(var(--player-muted))' }}>
                  {formatTime(progress)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-0.5 md:gap-1.5 shrink-0">
            <button
              onClick={playPrev}
              className="p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10"
              style={{ color: 'hsl(var(--player-muted))' }}
              aria-label="Música anterior"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
            </button>
            <button
              onClick={playNext}
              className="p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10"
              style={{ color: 'hsl(var(--player-muted))' }}
              aria-label="Próxima música"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop time */}
          <div className="hidden md:flex items-center gap-2 min-w-[100px]">
            <span className="text-xs font-mono" style={{ color: 'hsl(var(--player-muted))' }}>{formatTime(progress)}</span>
            <span className="text-xs" style={{ color: 'hsl(var(--player-muted) / 0.5)' }}>/</span>
            <span className="text-xs font-mono" style={{ color: 'hsl(var(--player-muted))' }}>{formatTime(duration)}</span>
          </div>

          {/* Mute + Close */}
          <div className="hidden md:flex items-center gap-0.5">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 transition-colors rounded-full hover:bg-white/10"
              style={{ color: 'hsl(var(--player-muted))' }}
              aria-label={muted ? "Ativar som" : "Silenciar"}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={() => { setIsPlaying(false); onClose(); }}
            className="p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10"
            style={{ color: 'hsl(var(--player-muted))' }}
            aria-label="Fechar reprodutor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

AudioPlayerBar.displayName = "AudioPlayerBar";
export default AudioPlayerBar;
