import { useState, useCallback, useRef } from "react";
import { Volume2 } from "lucide-react";

const ROOTS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const ROOTS_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

type SaxType = "alto" | "tenor";

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

function getNotesFromIntervals(rootIndex: number, intervals: number[]): string[] {
  return intervals.map((i) => ROOTS_PT[(rootIndex + i) % 12]);
}

const ScaleGenerator = () => {
  const [rootIndex, setRootIndex] = useState(0);
  const [scaleType, setScaleType] = useState("major");
  const [saxType, setSaxType] = useState<SaxType>("alto");
  const audioCtxRef = useRef<AudioContext | null>(null);

  const transposedRoot = transposeForSax(rootIndex, saxType);
  const scale = SCALE_TYPES[scaleType];
  const concertNotes = getNotesFromIntervals(rootIndex, scale.intervals);
  const saxNotes = getNotesFromIntervals(transposedRoot, scale.intervals);

  const playScale = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;

    const baseFreq = 261.63 * Math.pow(2, (rootIndex - 0) / 12); // C4 based

    scale.intervals.forEach((interval, i) => {
      const freq = baseFreq * Math.pow(2, interval / 12);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const startTime = ctx.currentTime + i * 0.4;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }, [rootIndex, scale.intervals]);

  return (
    <div className="flex flex-col gap-6 py-6 px-4 max-w-lg mx-auto">
      {/* Sax selector */}
      <div className="flex gap-2 justify-center">
        {(["alto", "tenor"] as SaxType[]).map((t) => (
          <button
            key={t}
            onClick={() => setSaxType(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold font-heading transition-all ${
              saxType === t
                ? "bg-primary text-primary-foreground shadow-lg"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            Sax {t === "alto" ? "Alto (Eb)" : "Tenor (Bb)"}
          </button>
        ))}
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
              className={`py-2 rounded-lg text-xs font-bold font-heading transition-all ${
                rootIndex === i
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      {/* Scale type */}
      <div>
        <label className="text-xs text-muted-foreground font-bold font-heading uppercase tracking-wider mb-2 block">
          Tipo de Escala
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(SCALE_TYPES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setScaleType(key)}
              className={`py-2 px-3 rounded-lg text-xs font-bold font-heading transition-all text-left ${
                scaleType === key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* Scale result */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold font-heading text-base">
            {ROOTS_PT[rootIndex]} {scale.name}
          </h3>
          <button
            onClick={playScale}
            className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-all"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Concert notes */}
        <div>
          <span className="text-xs text-muted-foreground font-heading uppercase">Concert Pitch:</span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {concertNotes.map((note, i) => (
              <span
                key={i}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold font-heading ${
                  i === 0
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-surface border border-border text-foreground"
                }`}
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Sax notes */}
        <div>
          <span className="text-xs text-muted-foreground font-heading uppercase">
            No seu Sax ({saxType === "alto" ? "Alto" : "Tenor"}):
          </span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {saxNotes.map((note, i) => (
              <span
                key={i}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold font-heading ${
                  i === 0
                    ? "bg-[hsl(142,70%,45%)]/20 text-[hsl(142,70%,45%)] border border-[hsl(142,70%,45%)]/30"
                    : "bg-surface border border-border text-foreground"
                }`}
              >
                {note}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Arpeggios */}
      <div className="glass-card rounded-2xl p-5 space-y-3">
        <h3 className="font-bold font-heading text-base">Arpejos</h3>
        {Object.entries(ARPEGGIO_TYPES).map(([key, arp]) => {
          const concertArp = getNotesFromIntervals(rootIndex, arp.intervals);
          const saxArp = getNotesFromIntervals(transposedRoot, arp.intervals);
          return (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-border last:border-0">
              <span className="text-xs font-bold font-heading text-muted-foreground w-28 shrink-0">
                {arp.name}
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {saxArp.map((note, i) => (
                  <span key={i} className="text-sm font-heading font-bold text-primary">
                    {note}
                    {i < saxArp.length - 1 && <span className="text-muted-foreground mx-0.5">·</span>}
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({concertArp.join(" · ")})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScaleGenerator;
