import { useState, useRef, useCallback } from "react";
import { Play, Pause, Music2 } from "lucide-react";

const tracks = [
  { id: "dancing-queen", name: "Dancing Queen", genre: "Pop", file: "/playbacks/dancing-queen.mp3" },
  { id: "estranha-loucura", name: "Estranha Loucura", genre: "MPB", file: "/playbacks/estranha-loucura.mp3" },
  { id: "boate-azul", name: "Boate Azul", genre: "Sertanejo", file: "/playbacks/boate-azul.mp3" },
  { id: "sozinho", name: "Sozinho", genre: "MPB", file: "/playbacks/sozinho.mp3" },
  { id: "your-latest-trick", name: "Your Latest Trick", genre: "Rock", file: "/playbacks/your-latest-trick.mp3" },
  { id: "careless-whisper", name: "Careless Whisper", genre: "Pop", file: "/playbacks/careless-whisper.mp3" },
  { id: "endless-love", name: "Endless Love", genre: "Pop", file: "/playbacks/endless-love.mp3" },
  { id: "amigo-de-deus", name: "Amigo de Deus", genre: "Gospel", file: "/playbacks/amigo-de-deus.mp3" },
  { id: "tudo-e-possivel", name: "Tudo É Possível ao Que Crê", genre: "Gospel", file: "/playbacks/tudo-e-possivel.mp3" },
  { id: "alegria-coracao", name: "Alegria Está no Coração", genre: "Gospel", file: "/playbacks/alegria-esta-no-coracao.mp3" },
  { id: "espirito", name: "Espírito Espírito", genre: "Gospel", file: "/playbacks/espirito-espirito.mp3" },
  { id: "jingle-bells", name: "Jingle Bells", genre: "Clássico", file: "/playbacks/jingle-bells.mp3" },
  { id: "prince-ali", name: "Prince Ali", genre: "Trilha Sonora", file: "/playbacks/prince-ali.mp3" },
  { id: "tan-enamorados", name: "Tan Enamorados", genre: "Romântico", file: "/playbacks/tan-enamorados.mp3" },
  { id: "alguem-me-disse", name: "Alguém Me Disse", genre: "MPB", file: "/playbacks/alguem-me-disse.mp3" },
];

const genreColors: Record<string, string> = {
  Pop: "bg-pink-500/20 text-pink-300",
  MPB: "bg-amber-500/20 text-amber-300",
  Sertanejo: "bg-orange-500/20 text-orange-300",
  Rock: "bg-blue-500/20 text-blue-300",
  Gospel: "bg-emerald-500/20 text-emerald-300",
  "Clássico": "bg-violet-500/20 text-violet-300",
  "Trilha Sonora": "bg-cyan-500/20 text-cyan-300",
  "Romântico": "bg-rose-500/20 text-rose-300",
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
    Object.entries(audioRefs.current).forEach(([key, audio]) => {
      if (key !== id) audio.pause();
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
    if (el) audioRefs.current[id] = el;
  }, []);

  const handleTimeUpdate = useCallback((id: string, audio: HTMLAudioElement) => {
    setProgress(prev => ({ ...prev, [id]: audio.currentTime }));
  }, []);

  const handleLoadedMetadata = useCallback((id: string, audio: HTMLAudioElement) => {
    setDurations(prev => ({ ...prev, [id]: audio.duration }));
  }, []);

  const handleEnded = useCallback((id: string) => {
    const idx = tracks.findIndex(t => t.id === id);
    const next = tracks[idx + 1];
    if (next) {
      const nextAudio = audioRefs.current[next.id];
      if (nextAudio) {
        nextAudio.play();
        setPlayingId(next.id);
      }
    } else {
      setPlayingId(null);
    }
    setProgress(prev => ({ ...prev, [id]: 0 }));
  }, []);

  const handleSeek = useCallback((id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRefs.current[id];
    if (!audio || !durations[id]) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * durations[id];
  }, [durations]);

  return (
    <section className="pb-10 md:pb-14 pt-6 md:pt-8 px-4 md:px-8 bg-[hsl(240,20%,10%)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-5 md:mb-7">
          <h3 className="text-xl md:text-2xl font-bold font-heading text-white flex items-center justify-center gap-2 mb-2">
            <Music2 className="w-6 h-6 text-primary" />
            Ouça Alguns Playbacks de Amostra
          </h3>
          <p className="text-white/60 text-sm md:text-base font-body max-w-lg mx-auto">
            Isso é só uma amostra — no acervo completo você terá acesso a <strong className="text-white/80">muito mais playbacks</strong> em diversos estilos
          </p>
        </div>

        {/* Playlist container */}
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {tracks.map((track, index) => {
            const isPlaying = playingId === track.id;
            const dur = durations[track.id] || 0;
            const cur = progress[track.id] || 0;
            const pct = dur > 0 ? (cur / dur) * 100 : 0;

            return (
              <div
                key={track.id}
                className={`flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3 md:py-3.5 cursor-pointer transition-colors duration-200 ${
                  isPlaying
                    ? "bg-primary/10"
                    : "hover:bg-white/[0.04]"
                } ${index > 0 ? "border-t border-white/[0.06]" : ""}`}
                onClick={() => handlePlay(track.id)}
              >
                {/* Play button */}
                <button
                  className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isPlaying
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                      : "bg-primary/80 text-primary-foreground hover:bg-primary hover:scale-105"
                  }`}
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  )}
                </button>

                {/* Info + progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-base md:text-lg font-bold font-heading truncate ${isPlaying ? "text-primary" : "text-white"}`}>
                        {track.name}
                      </span>
                      <span className={`hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${genreColors[track.genre] || "bg-white/10 text-white/60"}`}>
                        {track.genre}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-white/50 font-body tabular-nums whitespace-nowrap">
                      {formatTime(cur)} / {formatTime(dur)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className="w-full h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer group"
                    onClick={(e) => handleSeek(track.id, e)}
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-150 ${isPlaying ? "bg-primary" : "bg-white/30"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Hidden audio */}
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

        <p className="text-center text-white/30 text-xs mt-3 font-body">
          Clique em qualquer música para ouvir • A playlist avança automaticamente
        </p>
      </div>
    </section>
  );
};

export default PlaybackSamples;
