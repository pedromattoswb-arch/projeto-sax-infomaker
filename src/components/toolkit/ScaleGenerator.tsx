import { useState, useCallback, useRef } from "react";
import { Volume2, Music } from "lucide-react";

const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const ROOTS_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

type SaxType = "alto" | "tenor";
type ViewMode = "scales" | "arpeggios";

const SCALE_TYPES: Record<string, { name: string; intervals: number[] }> = {
  major: { name: "Maior", intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { name: "Menor Natural", intervals: [0, 2, 3, 5, 7, 8, 10] },
  harmonic_minor: { name: "Menor Harmônica", intervals: [0, 2, 3, 5, 7, 8, 11] },
  melodic_minor: { name: "Menor Melódica", intervals: [0, 2, 3, 5, 7, 9, 11] },
  pentatonic_major: { name: "Pentatônica Maior", intervals: [0, 2, 4, 7, 9] },
  pentatonic_minor: { name: "Pentatônica Menor", intervals: [0, 3, 5, 7, 10] },
  blues: { name: "Blues", intervals: [0, 3, 5, 6, 7, 10] },
  dorian: { name: "Dórico", intervals: [0, 2, 3, 5, 7, 9, 10] },
  mixolydian: { name: "Mixolídio", intervals: [0, 2, 4, 5, 7, 9, 10] },
  lydian: { name: "Lídio", intervals: [0, 2, 4, 6, 7, 9, 11] },
};

const ARPEGGIO_TYPES: Record<string, { name: string; intervals: number[] }> = {
  triad_major: { name: "Tríade Maior", intervals: [0, 4, 7] },
  triad_minor: { name: "Tríade Menor", intervals: [0, 3, 7] },
  seventh_major: { name: "Tétrade Maj7", intervals: [0, 4, 7, 11] },
  seventh_minor: { name: "Tétrade m7", intervals: [0, 3, 7, 10] },
  seventh_dom: { name: "Tétrade 7 (dom)", intervals: [0, 4, 7, 10] },
};

function transposeForSax(rootIndex: number, saxType: SaxType): number {
  const offset = saxType === "alto" ? 9 : 2;
  return (rootIndex + offset) % 12;
}

function getNotesFromIntervals(rootIndex: number, intervals: number[]): { name: string; semitone: number }[] {
  return intervals.map((i) => ({
    name: ROOTS_PT[(rootIndex + i) % 12],
    semitone: i,
  }));
}

const ScaleGenerator = () => {
  const [rootIndex, setRootIndex] = useState(0);
  const [scaleType, setScaleType] = useState("major");
  const [saxType, setSaxType] = useState<SaxType>("alto");
  const [viewMode, setViewMode] = useState<ViewMode>("scales");
  const [playingNote, setPlayingNote] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const transposedRoot = transposeForSax(rootIndex, saxType);
  const currentType = viewMode === "scales" ? SCALE_TYPES : ARPEGGIO_TYPES;
  const currentKey = viewMode === "scales" ? scaleType : (Object.keys(ARPEGGIO_TYPES).includes(scaleType) ? scaleType : "triad_major");
  const selected = (viewMode === "scales" ? SCALE_TYPES : ARPEGGIO_TYPES)[currentKey];
  
  const concertNotes = selected ? getNotesFromIntervals(rootIndex, selected.intervals) : [];
  const saxNotes = selected ? getNotesFromIntervals(transposedRoot, selected.intervals) : [];

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playNote = useCallback((semitone: number, index: number) => {
    const ctx = getAudioCtx();
    const baseFreq = 261.63 * Math.pow(2, (rootIndex) / 12);
    const freq = baseFreq * Math.pow(2, semitone / 12);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
    setPlayingNote(index);
    setTimeout(() => setPlayingNote(null), 500);
  }, [rootIndex, getAudioCtx]);

  const playAll = useCallback(() => {
    if (!selected) return;
    const ctx = getAudioCtx();
    const baseFreq = 261.63 * Math.pow(2, rootIndex / 12);

    selected.intervals.forEach((interval, i) => {
      const freq = baseFreq * Math.pow(2, interval / 12);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const startTime = ctx.currentTime + i * 0.35;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }, [rootIndex, selected, getAudioCtx]);

  // When switching view mode, reset to a valid type
  const handleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "scales" && !SCALE_TYPES[scaleType]) setScaleType("major");
    if (mode === "arpeggios" && !ARPEGGIO_TYPES[scaleType]) setScaleType("triad_major");
  };

  return (
    <div className="flex flex-col gap-5 py-6 px-4 max-w-lg mx-auto">
      {/* Sax selector */}
      <div className="flex gap-2 justify-center">
        {(["alto", "tenor"] as SaxType[]).map((t) => (
          <button
            key={t}
            onClick={() => setSaxType(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold font-heading transition-all ${
              saxType === t
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            Sax {t === "alto" ? "Alto (Eb)" : "Tenor (Bb)"}
          </button>
        ))}
      </div>

      {/* View mode tabs */}
      <div className="flex gap-1 bg-card rounded-xl p-1 border border-border">
        <button
          onClick={() => handleViewMode("scales")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-heading transition-all flex items-center justify-center gap-2 ${
            viewMode === "scales" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Music className="w-4 h-4" />
          Escalas
        </button>
        <button
          onClick={() => handleViewMode("arpeggios")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold font-heading transition-all flex items-center justify-center gap-2 ${
            viewMode === "arpeggios" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Volume2 className="w-4 h-4" />
          Arpejos
        </button>
      </div>

      {/* Root note */}
      <div>
        <label className="text-xs text-muted-foreground font-bold font-heading uppercase tracking-wider mb-2 block">
          Tonalidade (Concert Pitch)
        </label>
        <div className="grid grid-cols-6 gap-1.5">
          {ROOTS_PT.map((note, i) => (
            <button
              key={i}
              onClick={() => setRootIndex(i)}
              className={`py-2.5 rounded-lg text-xs font-bold font-heading transition-all ${
                rootIndex === i
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Type selector */}
      <div>
        <label className="text-xs text-muted-foreground font-bold font-heading uppercase tracking-wider mb-2 block">
          {viewMode === "scales" ? "Tipo de Escala" : "Tipo de Arpejo"}
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(currentType).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setScaleType(key)}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold font-heading transition-all text-left ${
                currentKey === key
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {selected && (
        <div className="glass-card rounded-2xl p-5 space-y-4 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-heading text-lg">
              {ROOTS_PT[rootIndex]} {selected.name}
            </h3>
            <button
              onClick={playAll}
              className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-all active:scale-90"
              title="Tocar todas as notas"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Concert notes - clickable */}
          <div>
            <span className="text-xs text-muted-foreground font-heading uppercase">Concert Pitch:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {concertNotes.map((note, i) => (
                <button
                  key={i}
                  onClick={() => playNote(note.semitone, i)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold font-heading transition-all active:scale-90 cursor-pointer ${
                    playingNote === i
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/40"
                      : i === 0
                      ? "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                      : "bg-surface border border-border text-foreground hover:border-primary/30"
                  }`}
                >
                  {note.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sax notes */}
          <div>
            <span className="text-xs text-muted-foreground font-heading uppercase">
              No seu Sax ({saxType === "alto" ? "Alto" : "Tenor"}):
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {saxNotes.map((note, i) => (
                <span
                  key={i}
                  className={`px-4 py-2 rounded-xl text-sm font-bold font-heading ${
                    i === 0
                      ? "bg-[hsl(142,70%,45%)]/20 text-[hsl(142,70%,45%)] border border-[hsl(142,70%,45%)]/30"
                      : "bg-surface border border-border text-foreground"
                  }`}
                >
                  {note.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick arpeggios reference when in scale mode */}
      {viewMode === "scales" && selected && (
        <div className="glass-card rounded-2xl p-5 space-y-3 border border-border">
          <h3 className="font-bold font-heading text-base">Arpejos em {ROOTS_PT[rootIndex]}</h3>
          {Object.entries(ARPEGGIO_TYPES).map(([key, arp]) => {
            const saxArp = getNotesFromIntervals(transposedRoot, arp.intervals);
            const concertArp = getNotesFromIntervals(rootIndex, arp.intervals);
            return (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border last:border-0">
                <span className="text-xs font-bold font-heading text-muted-foreground w-28 shrink-0">
                  {arp.name}
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {saxArp.map((note, i) => (
                    <span key={i} className="text-sm font-heading font-bold text-primary">
                      {note.name}
                      {i < saxArp.length - 1 && <span className="text-muted-foreground mx-0.5">·</span>}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  ({concertArp.map(n => n.name).join(" · ")})
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ScaleGenerator;
