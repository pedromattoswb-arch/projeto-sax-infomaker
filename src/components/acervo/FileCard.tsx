import React from "react";
import { FileText, Music, Download, Play, Pause, Eye } from "lucide-react";
import type { DriveFile } from "@/hooks/useDriveFiles";

interface FileCardProps {
  file: DriveFile;
  isCurrentAudio: boolean;
  isPlaying: boolean;
  onPlay: (file: DriveFile) => void;
  onViewPdf: (file: DriveFile) => void;
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const FileCard = React.memo(({ file, isCurrentAudio, isPlaying, onPlay, onViewPdf }: FileCardProps) => {
  const isPdf = file.type === "pdf";
  const isAudio = file.type === "audio";
  const isActive = isCurrentAudio && isPlaying;

  return (
    <div
      className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl border-l-4 transition-all duration-200 ${
        isPdf
          ? "border-l-destructive bg-card border border-border"
          : isAudio
          ? isActive
            ? "border-l-primary bg-primary/5 border border-primary/30 shadow-md"
            : "border-l-primary bg-card border border-border"
          : "border-l-muted bg-card border border-border"
      }`}
    >
      {/* Type badge + icon */}
      {isAudio ? (
        <button
          onClick={() => onPlay(file)}
          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            isActive
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
          }`}
          aria-label={isActive ? "Pausar" : "Ouvir"}
        >
          {isActive ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          )}
        </button>
      ) : (
        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
          isPdf ? "bg-destructive/10" : "bg-muted"
        }`}>
          {isPdf ? (
            <FileText className="w-6 h-6 text-destructive" />
          ) : (
            <Music className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-bold text-sm md:text-base text-foreground truncate">
          {file.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
              isPdf
                ? "bg-destructive/10 text-destructive"
                : isAudio
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isPdf ? "Partitura" : isAudio ? "Playback" : "Arquivo"}
          </span>
          {file.size ? (
            <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {isPdf && file.viewUrl && (
          <button
            onClick={() => onViewPdf(file)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs font-bold font-body transition-colors min-h-[44px]"
          >
            <Eye className="w-4 h-4" />
            <span>Ver</span>
          </button>
        )}
        {isAudio && !isActive && (
          <button
            onClick={() => onPlay(file)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold font-body transition-colors min-h-[44px] md:flex hidden"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            <span>Ouvir</span>
          </button>
        )}
        <a
          href={file.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-bold font-body transition-colors min-h-[44px]"
          aria-label={`Baixar ${file.name}`}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Baixar</span>
        </a>
      </div>
    </div>
  );
});

FileCard.displayName = "FileCard";
export default FileCard;
