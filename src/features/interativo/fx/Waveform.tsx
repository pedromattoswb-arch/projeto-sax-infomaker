import { useEffect, useRef } from "react";
import { audioEngine } from "../audio/AudioEngine";

interface WaveformProps {
  /** 0 = onda fria e tímida (Sozinho), 1 = espectro dourado pulsante com bloom (Com banda) */
  mix: number;
  bpm: number;
  reducedMotion: boolean;
}

export const Waveform = ({ mix, bpm, reducedMotion }: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mixRef = useRef(mix);
  mixRef.current = mix;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      return;
    }
    if (!ctx) return;

    const freqData = new Uint8Array(128);
    let rafId = 0;
    const startTs = performance.now();

    const drawFrame = (now: number) => {
      const m = mixRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 320;
      const h = canvas.clientHeight || 88;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const hasRealAudio = audioEngine.getFrequencyData(freqData);
      const elapsedSec = (now - startTs) / 1000;
      const beatPhase = ((elapsedSec * bpm) / 60) % 1;
      const beatKick = reducedMotion ? 0.35 : Math.exp(-beatPhase * 5.2);

      const bars = 36;
      const barGap = 4;
      const barW = Math.max(2, (w - barGap * (bars - 1)) / bars);
      const midY = h / 2;

      // Color interpolates from cold steel-blue to rich golden/emerald bloom
      const r = Math.round(115 + m * (245 - 115));
      const g = Math.round(158 + m * (213 - 158));
      const b = Math.round(210 + m * (112 - 210));

      ctx.shadowBlur = m > 0.35 ? 10 + m * 14 : 0;
      ctx.shadowColor = m > 0.82 ? "rgba(30, 215, 96, 0.55)" : `rgba(${r}, ${g}, ${b}, 0.55)`;

      for (let i = 0; i < bars; i++) {
        const normPos = i / (bars - 1);
        const centerWeight = Math.sin(normPos * Math.PI); // taller in center

        let amp: number;
        if (hasRealAudio) {
          const bin = Math.min(freqData.length - 1, Math.floor(normPos * 56) + 2);
          const raw = freqData[bin] / 255;
          // At mix=0 keep waveform visibly thinner/more timid; at mix=1 full dynamic range
          amp = Math.max(0.08, raw * (0.28 + m * 0.92) * (0.55 + centerWeight * 0.55));
        } else {
          const wave = reducedMotion
            ? 0.35
            : 0.5 + 0.5 * Math.sin(elapsedSec * (3.2 + m * 2.5) + i * 0.45);
          amp = (0.12 + wave * (0.18 + m * 0.62) + beatKick * m * 0.24) * (0.45 + centerWeight * 0.65);
        }

        const barH = Math.max(4, Math.min(h - 6, amp * h));
        const x = i * (barW + barGap);
        const y = midY - barH / 2;

        const isPeakGreen = m > 0.84 && centerWeight > 0.65;
        ctx.fillStyle = isPeakGreen
          ? `rgba(30, 215, 96, ${(0.72 + m * 0.28).toFixed(2)})`
          : `rgba(${r}, ${g}, ${b}, ${(0.45 + m * 0.52).toFixed(2)})`;

        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, barW / 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    rafId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(rafId);
  }, [bpm, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[76px] sm:h-[92px] block"
      aria-hidden="true"
    />
  );
};
