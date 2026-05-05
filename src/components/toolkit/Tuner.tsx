import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Check } from "lucide-react";

const NOTE_NAMES_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

const DEFAULT_A4 = 440;

type SaxType = "alto" | "tenor";

function frequencyToNote(freq: number, a4: number) {
  const semitones = 12 * Math.log2(freq / a4);
  const rounded = Math.round(semitones);
  const cents = Math.round((semitones - rounded) * 100);
  const noteIndex = ((rounded % 12) + 12) % 12;
  const octave = Math.floor((rounded + 9) / 12) + 4;
  return { noteIndex, octave, cents, noteNamePt: NOTE_NAMES_PT[noteIndex], freq };
}

function transposeSax(noteIndex: number, saxType: SaxType): { noteNamePt: string } {
  const offset = saxType === "alto" ? 9 : 2;
  const transposed = (noteIndex + offset) % 12;
  return { noteNamePt: NOTE_NAMES_PT[transposed] };
}

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  const size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.005) return -1;

  // Normalized autocorrelation
  const halfSize = Math.floor(size / 2);
  const corr = new Float32Array(halfSize);
  for (let lag = 0; lag < halfSize; lag++) {
    let sum = 0;
    for (let i = 0; i < halfSize; i++) {
      sum += buf[i] * buf[i + lag];
    }
    corr[lag] = sum;
  }

  // Find first dip
  let d = 1;
  while (d < halfSize - 1 && corr[d] > corr[d + 1]) d++;
  if (d >= halfSize - 1) return -1;

  // Find peak after dip
  let maxval = -1, maxpos = -1;
  for (let i = d; i < halfSize - 1; i++) {
    if (corr[i] > maxval) { maxval = corr[i]; maxpos = i; }
  }
  if (maxpos <= 0 || maxpos >= halfSize - 2) return -1;

  // Parabolic interpolation
  const x1 = corr[maxpos - 1], x2 = corr[maxpos], x3 = corr[maxpos + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  const refinedPos = a !== 0 ? maxpos - b / (2 * a) : maxpos;

  return sampleRate / refinedPos;
}

const SMOOTH_SIZE = 5;

const Tuner = () => {
  const [isListening, setIsListening] = useState(false);
  const [saxType, setSaxType] = useState<SaxType>("alto");
  const [detectedNote, setDetectedNote] = useState<ReturnType<typeof frequencyToNote> | null>(null);
  const [transposedNote, setTransposedNote] = useState<{ noteNamePt: string } | null>(null);
  const [smoothCents, setSmoothCents] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const historyRef = useRef<{ noteIndex: number; cents: number; freq: number }[]>([]);
  const saxTypeRef = useRef<SaxType>(saxType);
  const isListeningRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { saxTypeRef.current = saxType; }, [saxType]);

  // Re-transpose when saxType changes
  useEffect(() => {
    if (detectedNote && isListening) {
      setTransposedNote(transposeSax(detectedNote.noteIndex, saxType));
    }
  }, [saxType, detectedNote, isListening]);

  const detect = () => {
    if (!analyserRef.current || !audioContextRef.current || !isListeningRef.current) return;
    const analyser = analyserRef.current;
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    const freq = autoCorrelate(buf, audioContextRef.current.sampleRate);

    if (freq > 50 && freq < 2000) {
      const note = frequencyToNote(freq);

      historyRef.current.push({ noteIndex: note.noteIndex, cents: note.cents, freq: note.freq });
      if (historyRef.current.length > SMOOTH_SIZE) historyRef.current.shift();

      const counts: Record<number, number> = {};
      historyRef.current.forEach(h => { counts[h.noteIndex] = (counts[h.noteIndex] || 0) + 1; });
      let bestNote = note.noteIndex;
      let bestCount = 0;
      Object.entries(counts).forEach(([k, v]) => { if (v > bestCount) { bestCount = v; bestNote = Number(k); } });

      const relevantCents = historyRef.current.filter(h => h.noteIndex === bestNote).map(h => h.cents);
      const avgCents = Math.round(relevantCents.reduce((a, b) => a + b, 0) / relevantCents.length);

      const smoothedNote = { ...note, noteIndex: bestNote, noteNamePt: NOTE_NAMES_PT[bestNote], cents: avgCents };
      setDetectedNote(smoothedNote);
      setSmoothCents(avgCents);
      setTransposedNote(transposeSax(bestNote, saxTypeRef.current));
    }

    rafRef.current = requestAnimationFrame(detect);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      streamRef.current = stream;

      const ctx = new AudioContext();
      // Resume in case browser created it in suspended state
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0;
      source.connect(analyser);
      analyserRef.current = analyser;
      historyRef.current = [];
      isListeningRef.current = true;
      setIsListening(true);
      rafRef.current = requestAnimationFrame(detect);
    } catch (err: unknown) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError") {
        alert("Permissão do microfone negada. Habilite nas configurações do navegador.");
      } else if (name === "NotFoundError") {
        alert("Nenhum microfone encontrado.");
      } else {
        console.error("Microphone error:", err);
        alert("Erro ao acessar o microfone.");
      }
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
    setDetectedNote(null);
    setTransposedNote(null);
    setSmoothCents(0);
    historyRef.current = [];
  };

  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
    };
  }, []);

  const cents = smoothCents;
  const centsAngle = Math.max(-50, Math.min(50, cents));
  const isInTune = Math.abs(cents) <= 5;

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
          
          <path
            d="M 20 105 A 90 90 0 0 1 200 105"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.25"
          />
          
          <path
            d="M 103 17 A 90 90 0 0 1 117 17"
            fill="none"
            stroke="hsl(142 70% 45%)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.5"
          />

          {ticks.map((tick) => {
            const angle = -90 + (tick / 50) * 50;
            const rad = (angle * Math.PI) / 180;
            const cx = 110, cy = 105, r1 = 82, r2 = 92;
            const x1t = cx + r1 * Math.cos(rad);
            const y1t = cy + r1 * Math.sin(rad);
            const x2t = cx + r2 * Math.cos(rad);
            const y2t = cy + r2 * Math.sin(rad);
            const isMajor = tick === 0 || Math.abs(tick) === 50;
            return (
              <line key={tick} x1={x1t} y1={y1t} x2={x2t} y2={y2t}
                stroke={tick === 0 ? "hsl(142 70% 45%)" : "hsl(0 0% 50%)"}
                strokeWidth={isMajor ? 2 : 1}
                opacity={isMajor ? 0.8 : 0.4}
              />
            );
          })}
          
          <text x="28" y="115" fill="hsl(0 0% 50%)" fontSize="8" textAnchor="middle">-50</text>
          <text x="110" y="12" fill="hsl(142 70% 45%)" fontSize="8" textAnchor="middle" fontWeight="bold">0</text>
          <text x="192" y="115" fill="hsl(0 0% 50%)" fontSize="8" textAnchor="middle">+50</text>
          
          <line
            x1="110"
            y1="105"
            x2={110 + 78 * Math.sin((centsAngle * Math.PI) / 180)}
            y2={105 - 78 * Math.cos((centsAngle * Math.PI) / 180)}
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
