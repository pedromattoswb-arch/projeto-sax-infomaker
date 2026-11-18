import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MusicStaffProps {
  /** 'draw' anima a pauta sendo desenhada (Cena 2); 'running' corre e ilumina notas (Cena 3) */
  mode: "hidden" | "draw" | "running";
  /** 0..1 na Cena 3 controla brilho e acendimento das notas */
  progress?: number;
  reducedMotion: boolean;
}

const STAFF_NOTES = [
  { cx: 145, cy: 52, stemDir: -1, threshold: 0.08 },
  { cx: 210, cy: 40, stemDir: 1, threshold: 0.2 },
  { cx: 275, cy: 46, stemDir: -1, threshold: 0.34 },
  { cx: 342, cy: 34, stemDir: 1, threshold: 0.48 },
  { cx: 412, cy: 42, stemDir: -1, threshold: 0.62 },
  { cx: 482, cy: 30, stemDir: 1, threshold: 0.74 },
  { cx: 552, cy: 38, stemDir: -1, threshold: 0.85 },
];

export const MusicStaff = ({ mode, progress = 0, reducedMotion }: MusicStaffProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const trackRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || mode === "hidden") return;

    const lines = svg.querySelectorAll<SVGPathElement>(".staff-draw-line");
    if (mode === "draw") {
      if (reducedMotion) {
        lines.forEach((l) => {
          l.style.strokeDashoffset = "0";
        });
        return;
      }
      const tl = gsap.timeline();
      lines.forEach((line, idx) => {
        const len = typeof line.getTotalLength === "function" ? line.getTotalLength() : 640;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(
          line,
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          idx * 0.06
        );
      });
      return () => {
        tl.kill();
      };
    }

    // Running mode: ensure drawn
    lines.forEach((l) => {
      l.style.strokeDashoffset = "0";
    });
  }, [mode, reducedMotion]);

  useEffect(() => {
    if (mode !== "running" || reducedMotion || !trackRef.current) return;
    const tween = gsap.to(trackRef.current, {
      x: -24,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [mode, reducedMotion]);

  if (mode === "hidden") return null;

  const goldStroke = progress > 0.35 ? "#f5d58a" : "#94a3b8";

  return (
    <div
      className="pointer-events-none w-full max-w-2xl mx-auto px-2 select-none"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 640 84"
        className="w-full h-14 sm:h-16 overflow-visible"
        fill="none"
      >
        <defs>
          <linearGradient id="jazzStaffGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor={goldStroke} stopOpacity="0.65" />
            <stop offset="50%" stopColor="#fff2c2" stopOpacity="0.95" />
            <stop offset="85%" stopColor={goldStroke} stopOpacity="0.65" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* 5 pentagrama lines drawn smoothly via stroke-dashoffset */}
        {[22, 32, 42, 52, 62].map((y, idx) => (
          <path
            key={idx}
            className="staff-draw-line"
            d={`M 12 ${y} Q 320 ${y - 4} 628 ${y}`}
            stroke="url(#jazzStaffGrad)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        ))}

        {/* Treble clef accent */}
        <text
          x="52"
          y="58"
          fill={progress > 0.35 || mode === "draw" ? "#f5d58a" : "#94a3b8"}
          fontSize="44"
          fontFamily="Georgia, serif"
          opacity={mode === "draw" ? 0.92 : 0.7 + progress * 0.3}
        >
          𝄞
        </text>

        {/* Illuminated musical notes gliding across the staff */}
        <g ref={trackRef}>
          {STAFF_NOTES.map((note, idx) => {
            const lit = mode === "draw" || progress >= note.threshold;
            const fill = lit ? (progress > 0.8 ? "#1ed760" : "#f5d58a") : "rgba(148,163,184,0.38)";
            return (
              <g
                key={idx}
                style={{
                  opacity: lit ? 1 : 0.42,
                  transition: "opacity 220ms ease",
                }}
              >
                {lit && (
                  <circle
                    cx={note.cx}
                    cy={note.cy}
                    r="11"
                    fill={progress > 0.8 ? "rgba(30,215,96,0.22)" : "rgba(245,213,138,0.24)"}
                  />
                )}
                <ellipse
                  cx={note.cx}
                  cy={note.cy}
                  rx="6.2"
                  ry="4.5"
                  transform={`rotate(-18 ${note.cx} ${note.cy})`}
                  fill={fill}
                />
                <line
                  x1={note.cx + (note.stemDir < 0 ? 5.2 : -5.2)}
                  y1={note.cy}
                  x2={note.cx + (note.stemDir < 0 ? 5.2 : -5.2)}
                  y2={note.cy + note.stemDir * 24}
                  stroke={fill}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
