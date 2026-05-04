import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";

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
  return { noteIndex, octave, cents, noteName: NOTE_NAMES[noteIndex], noteNamePt: NOTE_NAMES_PT[noteIndex] };
}

function transposeSax(noteIndex: number, saxType: SaxType): { noteIndex: number; noteNamePt: string } {
  // Alto (Eb): concert pitch is 9 semitones below sax pitch → sax reads +9
  // Tenor (Bb): concert pitch is 2 semitones below sax pitch → sax reads +2
  const offset = saxType === "alto" ? 9 : 2;
  const transposed = (noteIndex + offset) % 12;
  return { noteIndex: transposed, noteNamePt: NOTE_NAMES_PT[transposed] };
}

function autoCorrelate(buf: Float32Array, sampleRate: number): number {
  let size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

  let r1 = 0, r2 = size - 1;
  const thresh = 0.2;
  for (let i = 0; i < size / 2; i++) { if (Math.abs(buf[i]) < thresh) { r1 = i; break; } }
  for (let i = 1; i < size / 2; i++) { if (Math.abs(buf[size - i]) < thresh) { r2 = size - i; break; } }

  buf = buf.slice(r1, r2);
  size = buf.length;

  const c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] += buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;

  let maxval = -1, maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }

  let T0 = maxpos;
  const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

const Tuner = () => {
  const [isListening, setIsListening] = useState(false);
  const [saxType, setSaxType] = useState<SaxType>("alto");
  const [detectedNote, setDetectedNote] = useState<ReturnType<typeof frequencyToNote> | null>(null);
  const [transposedNote, setTransposedNote] = useState<{ noteIndex: number; noteNamePt: string } | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const detect = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;
    const analyser = analyserRef.current;
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);
    const freq = autoCorrelate(buf, audioContextRef.current.sampleRate);

    if (freq > 50 && freq < 2000) {
      const note = frequencyToNote(freq);
      setDetectedNote(note);
      setTransposedNote(transposeSax(note.noteIndex, saxType));
    }

    rafRef.current = requestAnimationFrame(detect);
  }, [saxType]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
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

  const cents = detectedNote?.cents ?? 0;
  const centsAngle = Math.max(-45, Math.min(45, cents * 0.9));
  const isInTune = Math.abs(cents) <= 5;

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4">
      {/* Sax selector */}
      <div className="flex gap-2">
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

      {/* Gauge */}
      <div className="relative w-64 h-40 flex items-end justify-center">
        {/* Arc background */}
        <svg viewBox="0 0 200 110" className="w-full">
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0 70% 50%)" />
              <stop offset="35%" stopColor="hsl(40 80% 50%)" />
              <stop offset="50%" stopColor="hsl(142 70% 45%)" />
              <stop offset="65%" stopColor="hsl(40 80% 50%)" />
              <stop offset="100%" stopColor="hsl(0 70% 50%)" />
            </linearGradient>
          </defs>
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.3"
          />
          {/* Center green zone */}
          <path
            d="M 93 22 A 80 80 0 0 1 107 22"
            fill="none"
            stroke="hsl(142 70% 45%)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={100 + 70 * Math.sin((centsAngle * Math.PI) / 180)}
            y2={100 - 70 * Math.cos((centsAngle * Math.PI) / 180)}
            stroke={isInTune ? "hsl(142 70% 45%)" : "hsl(var(--primary))"}
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-all duration-150"
          />
          <circle cx="100" cy="100" r="5" fill="hsl(var(--primary))" />
        </svg>
      </div>

      {/* Note display */}
      <div className="text-center space-y-1">
        {detectedNote ? (
          <>
            <div className="text-6xl font-extrabold font-heading tracking-tight">
              {detectedNote.noteNamePt}
              <sub className="text-xl text-muted-foreground ml-1">{detectedNote.octave}</sub>
            </div>
            <div className={`text-lg font-bold font-heading ${isInTune ? "text-[hsl(142,70%,45%)]" : "text-primary"}`}>
              {cents > 0 ? `+${cents}` : cents} cents
            </div>
            <div className="glass-card inline-block rounded-lg px-4 py-2 mt-2">
              <span className="text-xs text-muted-foreground">No seu Sax:</span>
              <span className="text-lg font-bold font-heading text-primary ml-2">
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
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isListening
            ? "bg-red-500/20 border-2 border-red-500 text-red-400 animate-pulse"
            : "gradient-cta text-white"
        }`}
      >
        {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
      </button>
      <span className="text-xs text-muted-foreground font-body">
        {isListening ? "Toque para parar" : "Toque para ativar o afinador"}
      </span>
    </div>
  );
};

export default Tuner;
