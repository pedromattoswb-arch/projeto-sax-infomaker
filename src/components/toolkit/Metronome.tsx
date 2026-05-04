import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Square, Plus, Minus } from "lucide-react";

type TimeSignature = "2/4" | "3/4" | "4/4" | "6/8";

const TIME_SIGNATURES: TimeSignature[] = ["2/4", "3/4", "4/4", "6/8"];

function getBeatsPerMeasure(ts: TimeSignature): number {
  return parseInt(ts.split("/")[0]);
}

const Metronome = () => {
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>("4/4");
  const [currentBeat, setCurrentBeat] = useState(0);
  const [progressive, setProgressive] = useState(false);
  const [bpmIncrement, setBpmIncrement] = useState(5);
  const [measuresPerStep, setMeasuresPerStep] = useState(4);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number>(0);
  const beatRef = useRef(0);
  const measureCountRef = useRef(0);
  const bpmRef = useRef(bpm);

  bpmRef.current = bpm;

  const playClick = useCallback((accent: boolean) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = accent ? 1000 : 700;
    gain.gain.setValueAtTime(accent ? 0.6 : 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }, []);

  const startMetronome = useCallback(() => {
    beatRef.current = 0;
    measureCountRef.current = 0;
    setCurrentBeat(0);
    setIsPlaying(true);

    const beatsPerMeasure = getBeatsPerMeasure(timeSignature);

    const tick = () => {
      const isAccent = beatRef.current % beatsPerMeasure === 0;
      playClick(isAccent);
      setCurrentBeat(beatRef.current % beatsPerMeasure);

      beatRef.current++;

      if (beatRef.current % beatsPerMeasure === 0) {
        measureCountRef.current++;
        if (progressive && measureCountRef.current >= measuresPerStep) {
          measureCountRef.current = 0;
          const newBpm = Math.min(bpmRef.current + bpmIncrement, 220);
          setBpm(newBpm);
        }
      }

      const interval = 60000 / bpmRef.current;
      intervalRef.current = window.setTimeout(tick, interval);
    };

    tick();
  }, [timeSignature, progressive, bpmIncrement, measuresPerStep, playClick]);

  const stopMetronome = useCallback(() => {
    clearTimeout(intervalRef.current);
    setIsPlaying(false);
    setCurrentBeat(0);
    beatRef.current = 0;
  }, []);

  useEffect(() => {
    return () => clearTimeout(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [timeSignature]);

  const beatsPerMeasure = getBeatsPerMeasure(timeSignature);

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">
      {/* BPM Display */}
      <div className="text-center">
        <div className="text-7xl font-extrabold font-heading text-foreground tracking-tight">{bpm}</div>
        <div className="text-sm text-muted-foreground font-body mt-1">BPM</div>
      </div>

      {/* BPM Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setBpm((b) => Math.max(40, b - 5))}
          className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-surface/80 transition-all active:scale-90"
        >
          <Minus className="w-5 h-5" />
        </button>
        <input
          type="range"
          min={40}
          max={220}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-40 accent-primary"
        />
        <button
          onClick={() => setBpm((b) => Math.min(220, b + 5))}
          className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-surface/80 transition-all active:scale-90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Beat indicators */}
      <div className="flex gap-3">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-heading transition-all duration-100 ${
              isPlaying && currentBeat === i
                ? i === 0
                  ? "bg-primary text-primary-foreground scale-125 shadow-lg shadow-primary/40"
                  : "bg-[hsl(142,70%,45%)] text-white scale-110 shadow-lg"
                : "glass-card text-muted-foreground"
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Time signature */}
      <div className="flex gap-2">
        {TIME_SIGNATURES.map((ts) => (
          <button
            key={ts}
            onClick={() => setTimeSignature(ts)}
            className={`px-4 py-2 rounded-xl text-sm font-bold font-heading transition-all ${
              timeSignature === ts
                ? "bg-primary text-primary-foreground shadow-lg"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {ts}
          </button>
        ))}
      </div>

      {/* Progressive mode */}
      <div className="glass-card rounded-xl p-4 w-full max-w-sm space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={progressive}
            onChange={(e) => setProgressive(e.target.checked)}
            className="w-5 h-5 accent-primary rounded"
          />
          <div>
            <span className="font-bold font-heading text-sm">Modo Progressivo</span>
            <p className="text-xs text-muted-foreground">Aumenta o BPM automaticamente</p>
          </div>
        </label>
        {progressive && (
          <div className="flex gap-4 text-sm">
            <div>
              <label className="text-xs text-muted-foreground">+BPM</label>
              <select
                value={bpmIncrement}
                onChange={(e) => setBpmIncrement(Number(e.target.value))}
                className="block w-full mt-1 bg-background border border-border rounded-lg px-2 py-1.5 text-sm"
              >
                {[2, 3, 5, 10].map((v) => (
                  <option key={v} value={v}>+{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">A cada</label>
              <select
                value={measuresPerStep}
                onChange={(e) => setMeasuresPerStep(Number(e.target.value))}
                className="block w-full mt-1 bg-background border border-border rounded-lg px-2 py-1.5 text-sm"
              >
                {[2, 4, 8, 16].map((v) => (
                  <option key={v} value={v}>{v} compassos</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Play/Stop */}
      <button
        onClick={isPlaying ? stopMetronome : startMetronome}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isPlaying
            ? "bg-red-500/20 border-2 border-red-500 text-red-400"
            : "gradient-cta text-white"
        }`}
      >
        {isPlaying ? <Square className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
      </button>
    </div>
  );
};

export default Metronome;
