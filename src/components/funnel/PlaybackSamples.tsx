import { useState, useRef, useCallback } from "react";
import { Play, Pause, Music2, ArrowRight } from "lucide-react";

const STREAM_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/stream-audio?id=`;

interface Track {
  id: string;
  name: string;
  artist: string;
  genre: string;
  driveId: string;
}

const tracks: Track[] = [
  { id: "careless-whisper", name: "Careless Whisper", artist: "George Michael", genre: "Pop", driveId: "13n4UHAiwWAbBq3oxN27pyaUWI-mAaAmK" },
  { id: "sozinho", name: "Sozinho", artist: "Caetano Veloso", genre: "MPB", driveId: "1emyGuhMVPofGsDcCzmw9f0lvLRCX9YUF" },
  { id: "dancing-queen", name: "Dancing Queen", artist: "ABBA", genre: "Pop", driveId: "1YvCovPr_r6JRqT-cojpoLJLqnv_l4M6U" },
  { id: "perfect", name: "Perfect", artist: "Ed Sheeran", genre: "Romântico", driveId: "1rYfT6_VjOOfVRRuq4CMe98SLvFWguF5V" },
  { id: "hallelujah", name: "Hallelujah", artist: "Leonard Cohen", genre: "Casamento", driveId: "1r6jbvLeAMp3e3ZF2q3bVZ_u7yPDJdlJM" },
  { id: "a-thousand-years", name: "A Thousand Years", artist: "Christina Perri", genre: "Romântico", driveId: "1QpZ07kcLRKaRwlR0u-k3Y-aquYzTQ8He" },
  { id: "sampa", name: "Sampa", artist: "Caetano Veloso", genre: "MPB", driveId: "1WbmEiL97NnXC7EsGM1UFSmQUDQvNZCvZ" },
  { id: "nao-deixe-samba", name: "Não Deixe O Samba Morrer", artist: "Alcione", genre: "MPB", driveId: "1GzbWWOnMbeLAbL-O9fR4k6xXIy7ZBD_U" },
  { id: "can-you-feel", name: "Can You Feel the Love Tonight", artist: "Elton John", genre: "Pop", driveId: "1gF2be1OrCFZPfykTSL5uR7YNjMkRocO9" },
  { id: "sobre-as-aguas", name: "Sobre as Águas", artist: "Davi Sacer", genre: "Gospel", driveId: "1bkTt64OFtfCHFwZDc3YW5DdIL3Mu74bt" },
  { id: "deus-cuida-de-mim", name: "Deus Cuida de Mim", artist: "Kléber Lucas", genre: "Gospel", driveId: "1L_91rlg54WSdXamAkkkgoDGs1OwtKHWp" },
  { id: "perto-quero-estar", name: "Perto Quero Estar", artist: "Trazendo a Arca", genre: "Gospel", driveId: "14vWvqZDM0RRCRgIOSlXJ816popMd4C8l" },
];

const genreColors: Record<string, string> = {
  Pop: "bg-pink-500/20 text-pink-300",
  MPB: "bg-amber-500/20 text-amber-300",
  Gospel: "bg-emerald-500/20 text-emerald-300",
  "Romântico": "bg-rose-500/20 text-rose-300",
  "Casamento": "bg-violet-500/20 text-violet-300",
};

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const scrollToOffers = () => {
  document.getElementById("ofertas")?.scrollIntoView({ behavior: "smooth" });
};

const PlaybackSamples = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<string | null>(null);
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
      setLoading(id);
      audio.play().then(() => setLoading(null)).catch(() => setLoading(null));
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
        setLoading(next.id);
        nextAudio.play().then(() => setLoading(null)).catch(() => setLoading(null));
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
    <section className="pb-10 md:pb-14 pt-6 md:pt-8 px-4 md:px-8 bg-[hsl(220,30%,12%)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-5 md:mb-7">
          <h3 className="text-xl md:text-2xl font-bold font-heading text-white flex items-center justify-center gap-2 mb-2">
            <Music2 className="w-6 h-6 text-primary" />
            Ouça os Playbacks — Cada Partitura Vem com o Acompanhamento
          </h3>
          <p className="text-white/70 text-sm md:text-base font-body max-w-lg mx-auto">
            Na plataforma, você abre a partitura e dá play no playback na mesma tela. <strong className="text-white">É só tocar junto.</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {tracks.map((track, index) => {
            const isPlaying = playingId === track.id;
            const isLoading = loading === track.id;
            const dur = durations[track.id] || 0;
            const cur = progress[track.id] || 0;
            const pct = dur > 0 ? (cur / dur) * 100 : 0;

            return (
              <div
                key={track.id}
                className={`flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3 md:py-3.5 cursor-pointer transition-colors duration-200 ${
                  isPlaying ? "bg-primary/10" : "hover:bg-white/[0.04]"
                } ${index > 0 ? "border-t border-white/[0.06]" : ""}`}
                onClick={() => handlePlay(track.id)}
              >
                <button
                  className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isPlaying
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                      : "bg-primary/80 text-primary-foreground hover:bg-primary hover:scale-105"
                  }`}
                  aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex flex-col min-w-0">
                        <span className={`text-base md:text-lg font-bold font-heading truncate ${isPlaying ? "text-primary" : "text-white"}`}>
                          {track.name}
                        </span>
                        <span className="text-xs text-white/40 font-body truncate">{track.artist}</span>
                      </div>
                      <span className={`hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${genreColors[track.genre] || "bg-white/10 text-white/60"}`}>
                        {track.genre}
                      </span>
                    </div>
                    <span className="text-xs md:text-sm text-white/50 font-body tabular-nums whitespace-nowrap">
                      {formatTime(cur)} / {formatTime(dur)}
                    </span>
                  </div>

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

                <audio
                  ref={(el) => registerAudio(track.id, el)}
                  src={`${STREAM_BASE}${track.driveId}`}
                  preload="none"
                  crossOrigin="anonymous"
                  onTimeUpdate={(e) => handleTimeUpdate(track.id, e.currentTarget)}
                  onLoadedMetadata={(e) => handleLoadedMetadata(track.id, e.currentTarget)}
                  onEnded={() => handleEnded(track.id)}
                />
              </div>
            );
          })}
        </div>

        <div className="text-center mt-5">
          <button
            onClick={scrollToOffers}
            className="gradient-cta text-white font-bold font-heading py-3.5 px-8 rounded-xl text-sm shadow-cta hover:shadow-cta-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-2"
          >
            QUERO TOCAR JUNTO — ESCOLHER MEU PLANO
            <ArrowRight className="w-4 h-4 animate-arrow-bounce" />
          </button>
          <p className="text-white/30 text-xs mt-3 font-body">
            Clique em qualquer música para ouvir • A playlist avança automaticamente
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlaybackSamples;
