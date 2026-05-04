import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Check } from "lucide-react";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

const A4 = 440;

type SaxType = "alto" | "tenor";

function frequencyToNote(freq: number) {
  const semitones = 12 * Math.log2(freq / A4);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = Math.floor((rounded + 9) / 12) + 4;
  return { noteIndex, octave, cents, noteName: NOTE_NAMES[noteIndex], noteNamePt: NOTE_NAMES_PT[noteIndex], freq };
}

function transposeSax(noteIndex: number, saxType: SaxType): { noteIndex: number; noteNamePt: string } {
  const offset = saxType === "alto" ? 9 : 2;
  const transposed = (noteIndex + offset) % 12;
  return { noteIndex: transposed, noteNamePt: NOTE_NAMES_PT[transposed] };
}

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.008) return -1;

  // Trim edges
  let r1 = 0, r2 = size - 1;
  const thresh = 0.15;
  for (let i = 0; i < size / 2; i++) { if (Math.abs(buf[i]) < thresh) { r1 = i; break; } }
  for (let i = 1; i < size / 2; i++) { if (Math.abs(buf[size - i]) < thresh) { r2 = size - i; break; } }

  buf = buf.slice(r1, r2);
  size = buf.length;
  if (size < 2) return -1;

  const c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (d < size - 1 && c[d] > c[d + 1]) d++;
  if (d >= size - 1) return -1;

  let maxval = -1, maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }
  if (maxpos <= 0 || maxpos >= size - 1) return -1;

  let T0 = maxpos;
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

// Smoothing buffer for stable readings
const SMOOTH_SIZE = 5;

const Tuner = () => {
  const [isListening, setIsListening] = useState(false);
  const [saxType, setSaxType] = useState<SaxType>("alto");
  const [detectedNote, setDetectedNote] = useState<ReturnType<typeof frequencyToNote> | null>(null);
  const [transposedNote, setTransposedNote] = useState<{ noteIndex: number; noteNamePt: string } | null>(null);
  const [smoothCents, setSmoothCents] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const historyRef = useRef<{ noteIndex: number; cents: number; freq: number }[]>([]);

  const detect = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;
    const analyser = analyserRef.current;
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    const freq = autoCorrelate(buf, audioContextRef.current.sampleRate);

    if (freq > 50 && freq < 2000) {
      const note = frequencyToNote(freq);
      
      // Push to smoothing buffer
      historyRef.current.push({ noteIndex: note.noteIndex, cents: note.cents, freq: note.freq });
      if (historyRef.current.length > SMOOTH_SIZE) historyRef.current.shift();

      // Find most common note in buffer
      const counts: Record<number, number> = {};
      historyRef.current.forEach(h => { counts[h.noteIndex] = (counts[h.noteIndex] || 0) + 1; });
      let bestNote = note.noteIndex;
      let bestCount = 0;
      Object.entries(counts).forEach(([k, v]) => { if (v > bestCount) { bestCount = v; bestNote = Number(k); } });

      // Average cents for the dominant note
      const relevantCents = historyRef.current.filter(h => h.noteIndex === bestNote).map(h => h.cents);
      const avgCents = Math.round(relevantCents.reduce((a, b) => a + b, 0) / relevantCents.length);

      const smoothedNote = { ...note, noteIndex: bestNote, noteNamePt: NOTE_NAMES_PT[bestNote], cents: avgCents };
      setDetectedNote(smoothedNote);
      setSmoothCents(avgCents);
      setTransposedNote(transposeSax(bestNote, saxType));
    }

    rafRef.current = requestAnimationFrame(detect);
  }, [saxType]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;
      historyRef.current = [];
      setIsListening(true);
      rafRef.current = requestAnimationFrame(detect);
    } catch {
      console.error("Microphone access denied");
    }
  };

  const stopListening = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioContextRef.current?.close();
    setIsListening(false);
    setDetectedNote(null);
    setTransposedNote(null);
    historyRef.current = [];
  };

  useEffect(() => {
    if (detectedNote && isListening) {
      setTransposedNote(transposeSax(detectedNote.noteIndex, saxType));
    }
  }, [saxType, detectedNote, isListening]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
    };
  }, []);

  const cents = smoothCents;
  const centsAngle = Math.max(-50, Math.min(50, cents));
  const isInTune = Math.abs(cents) <= 5;

  // Generate tick marks for the gauge
  const ticks = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">
      {/* Sax selector */}
      <div className="flex gap-2">
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

      {/* Enhanced Gauge */}
      <div className="relative w-72 h-44 flex items-end justify-center">
        <svg viewBox="0 0 220 120" className="w-full">
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0 70% 50%)" />
              <stop offset="30%" stopColor="hsl(40 80% 50%)" />
              <stop offset="50%" stopColor="hsl(142 70% 45%)" />
              <stop offset="70%" stopColor="hsl(40 80% 50%)" />
              <stop offset="100%" stopColor="hsl(0 70% 50%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 20 105 A 90 90 0 0 1 200 105"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.25"
          />
          
          {/* Green center zone */}
          <path
            d="M 103 17 A 90 90 0 0 1 117 17"
            fill="none"
            stroke="hsl(142 70% 45%)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Tick marks */}
          {ticks.map((tick) => {
            const angle = -90 + (tick / 50) * 50;
            const rad = (angle * Math.PI) / 180;
            const cx = 110, cy = 105, r1 = 82, r2 = 92;
            const x1 = cx + r1 * Math.cos(rad);
            const y1 = cy + r1 * Math.sin(rad);
            const x2 = cx + r2 * Math.cos(rad);
            const y2 = cy + r2 * Math.sin(rad);
            const isMajor = tick === 0 || Math.abs(tick) === 50;
            return (
              <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={tick === 0 ? "hsl(142 70% 45%)" : "hsl(0 0% 50%)"}
                strokeWidth={isMajor ? 2 : 1}
                opacity={isMajor ? 0.8 : 0.4}
              />
            );
          })}
          
          {/* Labels */}
          <text x="28" y="115" fill="hsl(0 0% 50%)" fontSize="8" textAnchor="middle">-50</text>
          <text x="110" y="12" fill="hsl(142 70% 45%)" fontSize="8" textAnchor="middle" fontWeight="bold">0</text>
          <text x="192" y="115" fill="hsl(0 0% 50%)" fontSize="8" textAnchor="middle">+50</text>
          
          {/* Needle */}
          <line
            x1="110"
            y1="105"
            x2={110 + 78 * Math.sin((centsAngle * Math.PI) / 180 * 1)}
            y2={105 - 78 * Math.cos((centsAngle * Math.PI) / 180 * 1)}
            stroke={isInTune ? "hsl(142 70% 45%)" : "hsl(var(--primary))"}
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-200"
            filter={isInTune ? "url(#glow)" : undefined}
          />
          <circle cx="110" cy="105" r="6" fill="hsl(var(--primary))" />
          <circle cx="110" cy="105" r="3" fill="hsl(var(--background))" />
        </svg>
      </div>

      {/* In-tune indicator */}
      {isListening && detectedNote && isInTune && (
        <div className="flex items-center gap-2 bg-[hsl(142,70%,45%)]/15 border border-[hsl(142,70%,45%)]/30 rounded-full px-5 py-2 animate-pulse">
          <Check className="w-5 h-5 text-[hsl(142,70%,45%)]" />
          <span className="text-sm font-bold font-heading text-[hsl(142,70%,45%)]">AFINADO!</span>
        </div>
      )}

      {/* Note display */}
      <div className="text-center space-y-1.5">
        {detectedNote ? (
          <>
            <div className="text-7xl font-extrabold font-heading tracking-tight">
              {detectedNote.noteNamePt}
              <sub className="text-xl text-muted-foreground ml-1">{detectedNote.octave}</sub>
            </div>
            <div className={`text-lg font-bold font-heading ${isInTune ? "text-[hsl(142,70%,45%)]" : "text-primary"}`}>
              {cents > 0 ? `+${cents}` : cents} cents
            </div>
            <div className="text-xs text-muted-foreground font-body">
              {detectedNote.freq.toFixed(1)} Hz
            </div>
            <div className="glass-card inline-block rounded-xl px-5 py-2.5 mt-2 border border-primary/20">
              <span className="text-xs text-muted-foreground font-heading">No seu Sax:</span>
              <span className="text-xl font-bold font-heading text-primary ml-2">
                {transposedNote?.noteNamePt}
              </span>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground font-body text-lg">
            {isListening ? "Toque uma nota..." : "Ative o microfone para começar"}
          </div>
        )}
      </div>

      {/* Mic button */}
      <button
        onClick={isListening ? stopListening : startListening}
        className={`w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isListening
            ? "bg-red-500/20 border-2 border-red-500 text-red-400 animate-pulse"
            : "gradient-cta text-white"
        }`}
        style={{ width: 72, height: 72 }}
      >
        {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
      </button>
      <span className="text-xs text-muted-foreground font-body">
        {isListening ? "Toque para parar" : "Toque para ativar o afinador"}
      </span>
    </div>
  );
};

export default Tuner;
