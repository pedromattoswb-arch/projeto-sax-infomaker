import React, { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X } from "lucide-react";
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

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio) return;
      const time = Number(e.target.value);
      audio.currentTime = time;
      setProgress(time);
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

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/98 backdrop-blur-xl border-t border-border shadow-2xl">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={playNext}
          muted={muted}
          preload="metadata"
        />
        
        {/* Mobile progress bar on top */}
        <div className="md:hidden">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 rounded-none accent-primary cursor-pointer appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3"
            style={{ margin: 0, padding: 0, display: "block" }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Song name */}
          <div className="flex-1 min-w-0">
            <p className="font-body font-bold text-sm text-foreground truncate">
              {activeFile.name}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Playback
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <button onClick={playPrev} className="p-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
            </button>
            <button onClick={playNext} className="p-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop progress */}
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

          {/* Mute + Close */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={() => { setIsPlaying(false); onClose(); }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile time */}
        <div className="md:hidden flex justify-between text-[10px] text-muted-foreground font-mono px-4 pb-2">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    );
  }
);

AudioPlayerBar.displayName = "AudioPlayerBar";
export default AudioPlayerBar;
