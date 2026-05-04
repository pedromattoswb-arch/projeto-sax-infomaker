import { useState, useRef, useCallback, useEffect } from "react";
import { Play, Square, Plus, Minus, Hand } from "lucide-react";

type TimeSignature = "2/4" | "3/4" | "4/4" | "6/8";

const TIME_SIGNATURES: TimeSignature[] = ["2/4", "3/4", "4/4", "6/8"];

const BPM_PRESETS = [
  { label: "Lento", bpm: 60 },
  { label: "Moderado", bpm: 100 },
  { label: "Rápido", bpm: 140 },
  { label: "Muito Rápido", bpm: 180 },
];

function getBeatsPerMeasure(ts: TimeSignature): number {
  return parseInt(ts.split("/")[0]);
}

const Metronome = () => {
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>("4/4");
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [progressive, setProgressive] = useState(false);
  const [bpmIncrement, setBpmIncrement] = useState(5);
  const [measuresPerStep, setMeasuresPerStep] = useState(4);
  const [tapTimes, setTapTimes] = useState<number[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextBeatTimeRef = useRef(0);
  const beatIndexRef = useRef(0);
  const measureCountRef = useRef(0);
  const bpmRef = useRef(bpm);
  const schedulerRef = useRef<number>(0);
  const isPlayingRef = useRef(false);

  bpmRef.current = bpm;

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const scheduleClick = useCallback((time: number, accent: boolean) => {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = accent ? 1000 : 700;
    gain.gain.setValueAtTime(accent ? 0.7 : 0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.start(time);
    osc.stop(time + 0.1);
  }, [getAudioCtx]);

  const scheduler = useCallback(() => {
    if (!isPlayingRef.current) return;
    const ctx = getAudioCtx();
    const beatsPerMeasure = getBeatsPerMeasure(timeSignature);
    const scheduleAheadTime = 0.1;

    while (nextBeatTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const isAccent = beatIndexRef.current % beatsPerMeasure === 0;
      scheduleClick(nextBeatTimeRef.current, isAccent);

      const beatInMeasure = beatIndexRef.current % beatsPerMeasure;
      setCurrentBeat(beatInMeasure);

      beatIndexRef.current++;

      if (beatIndexRef.current % beatsPerMeasure === 0) {
        measureCountRef.current++;
        if (progressive && measureCountRef.current >= measuresPerStep) {
          measureCountRef.current = 0;
          const newBpm = Math.min(bpmRef.current + bpmIncrement, 220);
          setBpm(newBpm);
        }
      }

      const interval = 60.0 / bpmRef.current;
      nextBeatTimeRef.current += interval;
    }

    schedulerRef.current = window.setTimeout(scheduler, 25);
  }, [timeSignature, progressive, bpmIncrement, measuresPerStep, scheduleClick, getAudioCtx]);

  const startMetronome = useCallback(() => {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") ctx.resume();
    beatIndexRef.current = 0;
    measureCountRef.current = 0;
    nextBeatTimeRef.current = ctx.currentTime + 0.05;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setCurrentBeat(0);
    scheduler();
  }, [scheduler, getAudioCtx]);

  const stopMetronome = useCallback(() => {
    isPlayingRef.current = false;
    clearTimeout(schedulerRef.current);
    setIsPlaying(false);
    setCurrentBeat(-1);
    beatIndexRef.current = 0;
  }, []);

  // Tap tempo
  const handleTap = useCallback(() => {
    const now = performance.now();
    setTapTimes(prev => {
      const recent = [...prev, now].filter(t => now - t < 3000);
      if (recent.length >= 3) {
        const intervals: number[] = [];
        for (let i = 1; i < recent.length; i++) {
          intervals.push(recent[i] - recent[i - 1]);
        }
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const detectedBpm = Math.round(60000 / avg);
        if (detectedBpm >= 40 && detectedBpm <= 220) {
          setBpm(detectedBpm);
        }
      }
      return recent;
    });
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(schedulerRef.current);
      isPlayingRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      setTimeout(() => startMetronome(), 50);
    }
  }, [timeSignature]);

  const beatsPerMeasure = getBeatsPerMeasure(timeSignature);

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      {/* BPM Display */}
      <div className="text-center">
        <div className="text-8xl font-extrabold font-heading text-foreground tracking-tight leading-none">{bpm}</div>
        <div className="text-sm text-muted-foreground font-body mt-1">BPM</div>
      </div>

      {/* BPM Presets */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {BPM_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setBpm(preset.bpm)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all ${
              bpm === preset.bpm
                ? "bg-primary/20 text-primary border border-primary/30"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {preset.label}
          </button>
        ))}
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
            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-heading transition-all duration-75 ${
              isPlaying && currentBeat === i
                ? i === 0
                  ? "bg-primary text-primary-foreground scale-130 shadow-lg shadow-primary/50"
                  : "bg-[hsl(142,70%,45%)] text-white scale-115 shadow-lg shadow-[hsl(142,70%,45%)]/40"
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
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {ts}
          </button>
        ))}
      </div>

      {/* Tap Tempo */}
      <button
        onClick={handleTap}
        className="glass-card rounded-xl px-6 py-3 flex items-center gap-2 text-sm font-bold font-heading text-muted-foreground hover:text-foreground transition-all active:scale-95 border border-border"
      >
        <Hand className="w-4 h-4" />
        TAP TEMPO
      </button>

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
