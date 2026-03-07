import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Music2 } from "lucide-react";

const tracks = [
  { id: "dancing-queen", name: "Dancing Queen", genre: "Pop", file: "/playbacks/dancing-queen.mp3" },
  { id: "estranha-loucura", name: "Estranha Loucura", genre: "MPB", file: "/playbacks/estranha-loucura.mp3" },
  { id: "boate-azul", name: "Boate Azul", genre: "Sertanejo", file: "/playbacks/boate-azul.mp3" },
  { id: "sozinho", name: "Sozinho", genre: "MPB", file: "/playbacks/sozinho.mp3" },
  { id: "your-latest-trick", name: "Your Latest Trick", genre: "Rock", file: "/playbacks/your-latest-trick.mp3" },
  { id: "amigo-de-deus", name: "Amigo de Deus", genre: "Gospel", file: "/playbacks/amigo-de-deus.mp3" },
  { id: "jingle-bells", name: "Jingle Bells", genre: "Clássico", file: "/playbacks/jingle-bells.mp3" },
  { id: "prince-ali", name: "Prince Ali", genre: "Trilha Sonora", file: "/playbacks/prince-ali.mp3" },
  { id: "alegria-coracao", name: "Alegria Está no Coração", genre: "Gospel", file: "/playbacks/alegria-esta-no-coracao.mp3" },
  { id: "espirito", name: "Espírito Espírito", genre: "Gospel", file: "/playbacks/espirito-espirito.mp3" },
];

const genreColors: Record<string, string> = {
  Pop: "bg-pink-500/20 text-pink-300",
  MPB: "bg-amber-500/20 text-amber-300",
  Sertanejo: "bg-orange-500/20 text-orange-300",
  Rock: "bg-blue-500/20 text-blue-300",
  Gospel: "bg-emerald-500/20 text-emerald-300",
  "Clássico": "bg-violet-500/20 text-violet-300",
  "Trilha Sonora": "bg-cyan-500/20 text-cyan-300",
};

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const PlaybackSamples = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const handlePlay = useCallback((id: string) => {
    // Pause all others
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key !== id) {
        audio.pause();
      }
    });

    const audio = audioRefs.current[id];
    if (!audio) return;

    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      audio.play();
      setPlayingId(id);
    }
  }, [playingId]);

  const registerAudio = useCallback((id: string, el: HTMLAudioElement | null) => {
    if (el) {
      audioRefs.current[id] = el;
    }
  }, []);

  const handleTimeUpdate = useCallback((id: string, audio: HTMLAudioElement) => {
    setProgress(prev => ({ ...prev, [id]: audio.currentTime }));
  }, []);

  const handleLoadedMetadata = useCallback((id: string, audio: HTMLAudioElement) => {
    setDurations(prev => ({ ...prev, [id]: audio.duration }));
  }, []);

  const handleEnded = useCallback((id: string) => {
    setPlayingId(prev => prev === id ? null : prev);
    setProgress(prev => ({ ...prev, [id]: 0 }));
  }, []);

  const handleSeek = useCallback((id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRefs.current[id];
    if (!audio || !durations[id]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * durations[id];
  }, [durations]);

  return (
    <section className="pb-10 md:pb-14 pt-6 md:pt-8 px-4 md:px-8 bg-[hsl(240,20%,10%)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-[20px] md:text-2xl font-bold font-heading text-white flex items-center justify-center gap-2 mb-2">
            🎧 Ouça Alguns Playbacks de Amostra
          </h3>
          <p className="text-white/50 text-xs md:text-sm font-body max-w-lg mx-auto">
            Isso é só uma amostra — no acervo completo você terá acesso a <strong className="text-white/70">muito mais playbacks</strong> em diversos estilos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {tracks.map((track) => {
            const isPlaying = playingId === track.id;
            const dur = durations[track.id] || 0;
            const cur = progress[track.id] || 0;
            const pct = dur > 0 ? (cur / dur) * 100 : 0;

            return (
              <div
                key={track.id}
                className={`relative rounded-xl border transition-all duration-300 p-3 md:p-4 flex items-center gap-3 md:gap-4 group cursor-pointer ${
                  isPlaying
                    ? "bg-white/10 border-primary/40 shadow-lg shadow-primary/10"
                    : "bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20"
                }`}
                onClick={() => handlePlay(track.id)}
              >
                {/* Play button */}
                <button
                  className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                    isPlaying
                      ? "bg-primary text-primary-foreground scale-105 animate-pulse"
                      : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground group-hover:scale-110"
                  }`}
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" fill="currentColor" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm md:text-base font-bold font-heading text-white truncate">
                      {track.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full ${genreColors[track.genre] || "bg-white/10 text-white/60"}`}>
                      {track.genre}
                    </span>
                    <span className="text-[10px] text-white/30 font-body">
                      {formatTime(cur)} / {formatTime(dur)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeek(track.id, e);
                    }}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-200"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Hidden audio element */}
                <audio
                  ref={(el) => registerAudio(track.id, el)}
                  src={track.file}
                  preload="metadata"
                  onTimeUpdate={(e) => handleTimeUpdate(track.id, e.currentTarget)}
                  onLoadedMetadata={(e) => handleLoadedMetadata(track.id, e.currentTarget)}
                  onEnded={() => handleEnded(track.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlaybackSamples;
