import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface ParticleFieldHandle {
  burst: (originXRatio?: number, originYRatio?: number, count?: number) => void;
}

interface ParticleFieldProps {
  maxParticles: number;
  /** 0 = frio, 1 = dourado quente */
  warmth: number;
  /** 0.15 = poucas partículas em suspensão, 1 = fluxo intenso musical */
  activity: number;
  enabled: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  kind: "dust" | "note" | "spark";
  symbol: string;
}

const NOTE_SYMBOLS = ["♪", "♫", "♬"];

export const ParticleField = forwardRef<ParticleFieldHandle, ParticleFieldProps>(
  ({ maxParticles, warmth, activity, enabled }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const poolRef = useRef<Particle[]>([]);
    const propsRef = useRef({ maxParticles, warmth, activity, enabled });
    propsRef.current = { maxParticles, warmth, activity, enabled };

    useImperativeHandle(ref, () => ({
      burst(originXRatio = 0.5, originYRatio = 0.46, count = 48) {
        if (!propsRef.current.enabled) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        const ox = w * originXRatio;
        const oy = h * originYRatio;
        const limit = Math.min(count, propsRef.current.maxParticles);

        for (let i = 0; i < limit; i++) {
          const angle = (Math.PI * 2 * i) / limit + (Math.random() - 0.5) * 0.4;
          const speed = 1.6 + Math.random() * 5.2;
          const isNote = i % 5 === 0;
          poolRef.current.push({
            x: ox,
            y: oy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            size: isNote ? 13 + Math.random() * 8 : 1.8 + Math.random() * 2.8,
            alpha: 0.95,
            life: 0,
            maxLife: 45 + Math.random() * 45,
            kind: isNote ? "note" : "spark",
            symbol: NOTE_SYMBOLS[i % NOTE_SYMBOLS.length],
          });
        }
        // Cap pool size
        const cap = Math.max(propsRef.current.maxParticles + 40, 60);
        if (poolRef.current.length > cap) {
          poolRef.current.splice(0, poolRef.current.length - cap);
        }
      },
    }));

    useEffect(() => {
      if (!enabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let rafId = 0;
      let width = 0;
      let height = 0;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      resize();
      window.addEventListener("resize", resize, { passive: true });

      const spawnAmbient = (initial = false): Particle => {
        const isNote = Math.random() < 0.18 * propsRef.current.activity;
        return {
          x: Math.random() * width,
          y: initial ? Math.random() * height : height + 16,
          vx: (Math.random() - 0.5) * 0.45,
          vy: -(0.22 + Math.random() * (0.55 + propsRef.current.activity * 0.7)),
          size: isNote ? 12 + Math.random() * 7 : 1.1 + Math.random() * 2.2,
          alpha: 0.2 + Math.random() * 0.55,
          life: 0,
          maxLife: 180 + Math.random() * 220,
          kind: isNote ? "note" : "dust",
          symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
        };
      };

      // Seed ambient dust
      const initialCount = Math.min(28, Math.floor(propsRef.current.maxParticles * 0.35));
      poolRef.current = Array.from({ length: initialCount }, () => spawnAmbient(true));

      const loop = () => {
        const { maxParticles: maxP, warmth: wm, activity: act } = propsRef.current;
        const targetAmbient = Math.max(10, Math.floor(maxP * (0.22 + act * 0.65)));

        if (poolRef.current.length < targetAmbient && Math.random() < 0.38) {
          poolRef.current.push(spawnAmbient(false));
        }

        ctx.clearRect(0, 0, width, height);

        const r = Math.round(148 + wm * (245 - 148));
        const g = Math.round(182 + wm * (213 - 182));
        const b = Math.round(230 + wm * (138 - 230));

        for (let i = poolRef.current.length - 1; i >= 0; i--) {
          const p = poolRef.current[i];
          p.life += 1;
          p.x += p.vx;
          p.y += p.vy;

          if (p.kind === "spark") {
            p.vx *= 0.965;
            p.vy = p.vy * 0.965 + 0.03;
          }

          const progress = p.life / p.maxLife;
          if (progress >= 1 || p.y < -30 || p.x < -30 || p.x > width + 30) {
            poolRef.current.splice(i, 1);
            continue;
          }

          const fade = progress < 0.15 ? progress / 0.15 : 1 - Math.max(0, (progress - 0.65) / 0.35);
          const a = Math.max(0, Math.min(1, p.alpha * fade));

          if (p.kind === "note") {
            ctx.font = `600 ${p.size}px Georgia, serif`;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(a * 0.85).toFixed(3)})`;
            ctx.fillText(p.symbol, p.x, p.y);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
            ctx.fill();
          }
        }

        rafId = requestAnimationFrame(loop);
      };

      rafId = requestAnimationFrame(loop);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        poolRef.current = [];
      };
    }, [enabled]);

    if (!enabled) return null;

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[2] w-full h-full"
        aria-hidden="true"
      />
    );
  }
);

ParticleField.displayName = "ParticleField";
