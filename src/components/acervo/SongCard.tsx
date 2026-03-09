import { Music, Play, Pause, FileText } from "lucide-react";
import type { Song } from "@/types/acervo";

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  onTogglePlay: (song: Song) => void;
  onViewPdf?: (song: Song) => void;
}

const genreColors: Record<string, string> = {
  Pop: "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  MPB: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Rock: "bg-red-500/15 text-red-700 dark:text-red-300",
  Gospel: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  Jazz: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Bossa Nova": "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  Sertanejo: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Clássico": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
};

const SongCard = ({ song, isPlaying, onTogglePlay, onViewPdf }: SongCardProps) => {
  const hasAudio = !!song.audioUrl;

  return (
    <div className="group bg-card border border-border rounded-xl p-4 md:p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-3 md:gap-4">
        {/* Play button / Icon */}
        <button
          onClick={() => hasAudio && onTogglePlay(song)}
          disabled={!hasAudio}
          className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
            isPlaying
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : hasAudio
              ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
          aria-label={isPlaying ? "Pausar" : "Tocar"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
          ) : hasAudio ? (
            <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" fill="currentColor" />
          ) : (
            <Music className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-sm md:text-base text-foreground truncate">
            {song.title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground font-body truncate">
            {song.artist}
          </p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full ${genreColors[song.genre] || "bg-muted text-muted-foreground"}`}>
              {song.genre}
            </span>
            {song.pdfUrl && (
              <span className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />
                PDF
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
