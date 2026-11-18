import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import saxStageHeroArt from "@/assets/lp3/sax-stage-hero-art.jpg";

interface SaxStageIntroProps {
  onComplete: () => void;
}

const STAGE_STEPS = [
  "Preparando Aplicativo Clube do Sax...",
  "Sincronizando +10.000 Partituras & Playbacks...",
];

const SaxStageIntro = ({ onComplete }: SaxStageIntroProps) => {
  const hookReduced = useReducedMotion();
  const prefersReducedMotion =
    Boolean(hookReduced) ||
    (typeof window !== "undefined" &&
      Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches));
  const [visible, setVisible] = useState(!prefersReducedMotion);
  const [progress, setProgress] = useState(0);

  const finishIntro = useCallback(() => {
    setVisible(false);
    setTimeout(onComplete, 320);
  }, [onComplete]);

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const start = performance.now();
    const totalMs = 1850;
    let rafId: number;

    const update = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setProgress(pct);
      if (elapsed < totalMs) {
        rafId = requestAnimationFrame(update);
      } else {
        finishIntro();
      }
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [finishIntro, onComplete, prefersReducedMotion]);

  const stepIndex = progress < 55 ? 0 : 1;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sax-stage-intro"
          role="dialog"
          aria-label="Apresentação Clube do Sax"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-[#060402] px-4 select-none"
        >
          {/* Warm Velvet Stage Spotlight Cone */}
          <div
            className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-full max-w-[640px] h-[560px] rounded-full opacity-55"
            style={{
              background:
                "conic-gradient(from 155deg at 50% 0%, transparent 0deg, rgba(245,185,66,0.26) 25deg, rgba(255,235,175,0.4) 35deg, rgba(245,185,66,0.26) 45deg, transparent 70deg)",
              filter: "blur(32px)",
            }}
          />

          {/* Subtle Saxophone Stage Artwork Halo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.32, scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <img
              src={saxStageHeroArt}
              alt=""
              width={1280}
              height={720}
              className="w-full max-w-4xl h-auto object-cover"
              style={{
                maskImage: "radial-gradient(circle, black 28%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(circle, black 28%, transparent 72%)",
              }}
            />
          </motion.div>

          {/* Accessible Skip Button Top-Right (44px min touch target) */}
          <button
            type="button"
            onClick={finishIntro}
            className="absolute top-4 right-4 z-20 min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-[#f5b942]/35 bg-black/75 px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ffe49e] hover:bg-[#f5b942]/15 transition-colors cursor-pointer"
          >
            Entrar Direto
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Center Animated Golden Saxophone */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mb-4 flex items-center justify-center">
              {[0, 1].map((ring) => (
                <motion.div
                  key={ring}
                  initial={{ scale: 0.6, opacity: 0.65 }}
                  animate={{ scale: 1.55, opacity: 0 }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: ring * 0.6,
                    ease: "easeOut",
                  }}
                  className="absolute inset-4 rounded-full border border-[#f5b942]/40 pointer-events-none"
                />
              ))}

              <motion.svg
                viewBox="0 0 200 200"
                className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-[0_0_28px_rgba(245,185,66,0.5)]"
                initial={{ rotate: -6, scale: 0.9, opacity: 0 }}
                animate={{ rotate: [-4, 2, -1], scale: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="saxBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff3c4" />
                    <stop offset="45%" stopColor="#f5b942" />
                    <stop offset="85%" stopColor="#b87611" />
                    <stop offset="100%" stopColor="#ffd97d" />
                  </linearGradient>
                  <radialGradient id="pearlKeyGrad" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="65%" stopColor="#f5ead4" />
                    <stop offset="100%" stopColor="#c7b290" />
                  </radialGradient>
                </defs>

                <path
                  d="M52 28 L68 24 C78 22, 86 28, 88 38 L92 56"
                  fill="none"
                  stroke="url(#saxBrassGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M42 30 L55 27"
                  fill="none"
                  stroke="#1f1a16"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M92 54 L106 142 C109 162, 129 168, 138 150 L150 116"
                  fill="none"
                  stroke="url(#saxBrassGrad)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <path
                  d="M136 118 L168 106 C172 122, 160 136, 144 134 Z"
                  fill="url(#saxBrassGrad)"
                  stroke="#fff1be"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="153"
                  cy="112"
                  rx="17"
                  ry="7"
                  transform="rotate(-18 153 112)"
                  fill="#2a1904"
                  stroke="#ffe299"
                  strokeWidth="2.5"
                />

                {[
                  { cx: 95, cy: 74, delay: 0 },
                  { cx: 98, cy: 92, delay: 0.2 },
                  { cx: 101, cy: 110, delay: 0.4 },
                  { cx: 104, cy: 128, delay: 0.6 },
                ].map((k, idx) => (
                  <motion.circle
                    key={idx}
                    cx={k.cx}
                    cy={k.cy}
                    r="5.5"
                    fill="url(#pearlKeyGrad)"
                    stroke="#7a4f08"
                    strokeWidth="1.5"
                    animate={{ x: [0, -2, 0] }}
                    transition={{
                      duration: 0.65,
                      repeat: Infinity,
                      delay: k.delay,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {[
                  { symbol: "♪", x: 162, y: 88, delay: 0.08 },
                  { symbol: "♫", x: 176, y: 66, delay: 0.4 },
                  { symbol: "𝄞", x: 146, y: 58, delay: 0.72 },
                ].map((n, idx) => (
                  <motion.text
                    key={idx}
                    x={n.x}
                    y={n.y}
                    fontSize="20"
                    fill="#ffe299"
                    fontWeight="bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [6, -20],
                    }}
                    transition={{
                      duration: 1.25,
                      repeat: Infinity,
                      delay: n.delay,
                      ease: "easeOut",
                    }}
                  >
                    {n.symbol}
                  </motion.text>
                ))}
              </motion.svg>
            </div>

            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#f5b942]" />
              Aplicativo Clube do Sax
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              Abrindo Seu <span className="sax-gold-gradient-text italic">Estúdio Digital</span>
            </h2>

            <p className="text-sm text-[#cfc3ae] font-medium mb-5">
              {STAGE_STEPS[stepIndex]}
            </p>

            <div className="w-full max-w-[260px] bg-white/10 h-2.5 rounded-full overflow-hidden border border-[#f5b942]/25 p-0.5">
              <div
                className="h-full rounded-full transition-[width] duration-75"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #c98317 0%, #f5b942 55%, #1ed760 100%)",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaxStageIntro;
