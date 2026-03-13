import { useState, useRef, useCallback } from "react";
import { Play, Pause, Music2, Music } from "lucide-react";

interface Track {
  id: string;
  name: string;
  artist: string;
  genre: string;
  file?: string; // undefined = no local audio, show as "no acervo"
}

// Only songs confirmed to exist in Google Drive acervo
const tracks: Track[] = [
  // WITH local audio preview (confirmed in Drive)
  { id: "careless-whisper", name: "Careless Whisper", artist: "George Michael", genre: "Pop", file: "/playbacks/careless-whisper.mp3" },
  { id: "sozinho", name: "Sozinho", artist: "Caetano Veloso", genre: "MPB", file: "/playbacks/sozinho.mp3" },
  { id: "dancing-queen", name: "Dancing Queen", artist: "ABBA", genre: "Pop", file: "/playbacks/dancing-queen.mp3" },
  { id: "endless-love", name: "Endless Love", artist: "Lionel Richie", genre: "Pop", file: "/playbacks/endless-love.mp3" },
  { id: "amigo-de-deus", name: "Amigo de Deus", artist: "Trazendo a Arca", genre: "Gospel", file: "/playbacks/amigo-de-deus.mp3" },
  { id: "tudo-e-possivel", name: "Tudo É Possível", artist: "Davi Sacer", genre: "Gospel", file: "/playbacks/tudo-e-possivel.mp3" },
  { id: "alegria-coracao", name: "Alegria Está no Coração", artist: "Kléber Lucas", genre: "Gospel", file: "/playbacks/alegria-esta-no-coracao.mp3" },
  { id: "jingle-bells", name: "Jingle Bells", artist: "Tradicional", genre: "Natal", file: "/playbacks/jingle-bells.mp3" },
  // WITHOUT local audio (confirmed in Drive — shows as catalog entry)
  { id: "can-you-feel", name: "Can You Feel the Love Tonight", artist: "Elton John", genre: "Pop" },
  { id: "perfect", name: "Perfect", artist: "Ed Sheeran", genre: "Romântico" },
  { id: "hallelujah", name: "Hallelujah (Aleluia)", artist: "Leonard Cohen", genre: "Casamento" },
  { id: "marry-you", name: "Marry You", artist: "Bruno Mars", genre: "Pop" },
  { id: "nao-deixe-samba", name: "Não Deixe O Samba Morrer", artist: "Alcione", genre: "MPB" },
  { id: "ave-maria", name: "Ave Maria", artist: "Gounod", genre: "Clássico" },
  { id: "a-thousand-years", name: "A Thousand Years", artist: "Christina Perri", genre: "Romântico" },
  { id: "thats-what-i-like", name: "That's What I Like", artist: "Bruno Mars", genre: "Pop" },
  { id: "sampa", name: "Sampa", artist: "Caetano Veloso", genre: "MPB" },
  { id: "over-the-rainbow", name: "Over The Rainbow", artist: "Israel Kamakawiwoʻole", genre: "Pop" },
];

const genreColors: Record<string, string> = {
  Pop: "bg-pink-500/20 text-pink-300",
  MPB: "bg-amber-500/20 text-amber-300",
  Sertanejo: "bg-orange-500/20 text-orange-300",
  Rock: "bg-blue-500/20 text-blue-300",
  Gospel: "bg-emerald-500/20 text-emerald-300",
  "Trilha Sonora": "bg-cyan-500/20 text-cyan-300",
  "Romântico": "bg-rose-500/20 text-rose-300",
  "Natal": "bg-red-500/20 text-red-300",
  "Casamento": "bg-violet-500/20 text-violet-300",
  "Clássico": "bg-sky-500/20 text-sky-300",
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

  const playableTracks = tracks.filter(t => t.file);

  const handlePlay = useCallback((id: string) => {
    const track = tracks.find(t => t.id === id);
    if (!track?.file) return; // can't play tracks without audio

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
    const idx = playableTracks.findIndex(t => t.id === id);
    const next = playableTracks[idx + 1];
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
  }, [playableTracks]);

  const handleSeek = useCallback((id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRefs.current[id];
    if (!audio || !durations[id]) return;
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * durations[id];
  }, [durations]);

  return (
    <section className="pb-10 md:pb-14 pt-6 md:pt-8 px-4 md:px-8 bg-[hsl(220,30%,12%)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-5 md:mb-7">
          <h3 className="text-xl md:text-2xl font-bold font-heading text-white flex items-center justify-center gap-2 mb-2">
            <Music2 className="w-6 h-6 text-primary" />
            Ouça Alguns dos +10.000 Playbacks do Acervo
          </h3>
          <p className="text-white/60 text-sm md:text-base font-body max-w-lg mx-auto">
            Todas essas músicas estão no acervo real — ouça os que têm preview e veja a variedade que te espera
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {tracks.map((track, index) => {
            const hasAudio = !!track.file;
            const isPlaying = playingId === track.id;
            const dur = durations[track.id] || 0;
            const cur = progress[track.id] || 0;
            const pct = dur > 0 ? (cur / dur) * 100 : 0;

            return (
              <div
                key={track.id}
                className={`flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3 md:py-3.5 transition-colors duration-200 ${
                  hasAudio ? "cursor-pointer" : "cursor-default"
                } ${
                  isPlaying ? "bg-primary/10" : hasAudio ? "hover:bg-white/[0.04]" : ""
                } ${index > 0 ? "border-t border-white/[0.06]" : ""}`}
                onClick={() => handlePlay(track.id)}
              >
                {hasAudio ? (
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
                ) : (
                  <div className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white/10">
                    <Music className="w-5 h-5 text-white/40" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex flex-col min-w-0">
                        <span className={`text-base md:text-lg font-bold font-heading truncate ${isPlaying ? "text-primary" : hasAudio ? "text-white" : "text-white/60"}`}>
                          {track.name}
                        </span>
                        <span className={`text-xs font-body truncate ${hasAudio ? "text-white/40" : "text-white/30"}`}>{track.artist}</span>
                      </div>
                      <span className={`hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${genreColors[track.genre] || "bg-white/10 text-white/60"}`}>
                        {track.genre}
                      </span>
                    </div>
                    {hasAudio ? (
                      <span className="text-xs md:text-sm text-white/50 font-body tabular-nums whitespace-nowrap">
                        {formatTime(cur)} / {formatTime(dur)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/30 font-body whitespace-nowrap italic">
                        no acervo
                      </span>
                    )}
                  </div>

                  {hasAudio ? (
                    <div
                      className="w-full h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer group"
                      onClick={(e) => handleSeek(track.id, e)}
                    >
                      <div
                        className={`h-full rounded-full transition-[width] duration-150 ${isPlaying ? "bg-primary" : "bg-white/30"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-2 rounded-full bg-white/5" />
                  )}
                </div>

                {hasAudio && (
                  <audio
                    ref={(el) => registerAudio(track.id, el)}
                    src={track.file}
                    preload="none"
                    onTimeUpdate={(e) => handleTimeUpdate(track.id, e.currentTarget)}
                    onLoadedMetadata={(e) => handleLoadedMetadata(track.id, e.currentTarget)}
                    onEnded={() => handleEnded(track.id)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-white/30 text-xs mt-3 font-body">
          Clique para ouvir • {playableTracks.length} com preview de áudio • {tracks.length - playableTracks.length} disponíveis no acervo
        </p>
      </div>
    </section>
  );
};

export default PlaybackSamples;
