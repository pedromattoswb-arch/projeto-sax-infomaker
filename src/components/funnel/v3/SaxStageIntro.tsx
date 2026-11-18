import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowRight, Sparkles } from "lucide-react";
import saxStageHeroArt from "@/assets/lp3/sax-stage-hero-art.jpg";
import { playWarmSaxChord } from "./saxAudioSynth";

interface SaxStageIntroProps {
  onComplete: () => void;
}

const STAGE_STEPS = [
  "Afinando Sax Alto (Eb) & Sax Tenor (Bb)...",
  "Sincronizando +10.000 Partituras & Playbacks...",
  "Preparando Palco VIP Clube do Sax...",
];

const SaxStageIntro = ({ onComplete }: SaxStageIntroProps) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [soundPlayed, setSoundPlayed] = useState(false);

  const finishIntro = useCallback(() => {
    setVisible(false);
    setTimeout(onComplete, 420);
  }, [onComplete]);

  useEffect(() => {
    const start = performance.now();
    const totalMs = 2650;
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
  }, [finishIntro]);

  const stepIndex = progress < 36 ? 0 : progress < 76 ? 1 : 2;

  const handleSoundTap = () => {
    if (!soundPlayed) {
      playWarmSaxChord();
      setSoundPlayed(true);
    }
    finishIntro();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="sax-stage-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-[#060402] px-5 select-none"
        >
          {/* Warm Velvet Stage Spotlight Cone */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full opacity-60"
            style={{
              background:
                "conic-gradient(from 155deg at 50% 0%, transparent 0deg, rgba(245,185,66,0.28) 25deg, rgba(255,235,175,0.42) 35deg, rgba(245,185,66,0.28) 45deg, transparent 70deg)",
              filter: "blur(36px)",
            }}
          />

          {/* Subtle Saxophone Stage Artwork Halo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 0.34, scale: 1.02 }}
            transition={{ duration: 2.4, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <img
              src={saxStageHeroArt}
              alt=""
              className="w-full max-w-4xl h-auto object-cover rounded-full blur-[2px]"
              style={{
                maskImage: "radial-gradient(circle, black 28%, transparent 72%)",
                WebkitMaskImage: "radial-gradient(circle, black 28%, transparent 72%)",
              }}
            />
          </motion.div>

          {/* Skip Button Top-Right */}
          <button
            onClick={finishIntro}
            className="absolute top-5 right-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-[#f5b942]/30 bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ffe299] hover:bg-[#f5b942]/15 transition-colors backdrop-blur-md"
          >
            Entrar Direto
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Center Animated Golden Saxophone + Pressing Pearl Keys + Blooming Notes */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-5 flex items-center justify-center">
              {/* Expanding Golden Soundwave Rings */}
              {[0, 1, 2].map((ring) => (
                <motion.div
                  key={ring}
                  initial={{ scale: 0.55, opacity: 0.7 }}
                  animate={{ scale: 1.65, opacity: 0 }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: ring * 0.55,
                    ease: "easeOut",
                  }}
                  className="absolute inset-4 rounded-full border border-[#f5b942]/45 pointer-events-none"
                />
              ))}

              {/* Animated Vector Golden Saxophone with Pressing Pearl Keys */}
              <motion.svg
                viewBox="0 0 200 200"
                className="w-40 h-40 sm:w-44 sm:h-44 drop-shadow-[0_0_32px_rgba(245,185,66,0.55)]"
                initial={{ rotate: -8, scale: 0.86, opacity: 0 }}
                animate={{ rotate: [ -6, 2, -2 ], scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
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

                {/* Mouthpiece & Neck (Tudel) */}
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

                {/* Saxophone Main Body Tube & J-Bow */}
                <path
                  d="M92 54 L106 142 C109 162, 129 168, 138 150 L150 116"
                  fill="none"
                  stroke="url(#saxBrassGrad)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />

                {/* Saxophone Flared Bell (Campana) */}
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

                {/* 4 Animated Mother-of-Pearl Keys pressing sequentially */}
                {[
                  { cx: 95, cy: 74, delay: 0 },
                  { cx: 98, cy: 92, delay: 0.22 },
                  { cx: 101, cy: 110, delay: 0.44 },
                  { cx: 104, cy: 128, delay: 0.66 },
                ].map((k, idx) => (
                  <motion.circle
                    key={idx}
                    cx={k.cx}
                    cy={k.cy}
                    r="5.5"
                    fill="url(#pearlKeyGrad)"
                    stroke="#7a4f08"
                    strokeWidth="1.5"
                    animate={{
                      r: [5.5, 4.1, 5.5],
                      x: [0, -2, 0],
                    }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      delay: k.delay,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Musical Notes Blooming from the Bell */}
                {[
                  { symbol: "♪", x: 162, y: 88, delay: 0.1 },
                  { symbol: "♫", x: 176, y: 66, delay: 0.45 },
                  { symbol: "𝄞", x: 146, y: 58, delay: 0.8 },
                ].map((n, idx) => (
                  <motion.text
                    key={idx}
                    x={n.x}
                    y={n.y}
                    fontSize="20"
                    fill="#ffe299"
                    fontWeight="bold"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{
                      opacity: [0, 1, 0],
                      y: [8, -22],
                      x: [0, idx % 2 === 0 ? 8 : -6],
                    }}
                    transition={{
                      duration: 1.35,
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

            {/* Gamified Stage Badge */}
            <div className="sax-brass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#f5b942]" />
              Experiência Oficial Clube do Sax
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              Preparando Seu <span className="sax-gold-gradient-text italic">Estúdio de Sax</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#c2b59f] font-medium h-5 mb-5 transition-all">
              {STAGE_STEPS[stepIndex]}
            </p>

            {/* Stage VU Meter & Golden Progress Bar */}
            <div className="w-full max-w-xs bg-white/10 h-2.5 rounded-full overflow-hidden border border-[#f5b942]/25 p-0.5 mb-5">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #c98317 0%, #f5b942 55%, #1ed760 100%)",
                }}
              />
            </div>

            {/* Interactive Sound + Instant Enter CTA */}
            <button
              onClick={handleSoundTap}
              className="inline-flex items-center gap-2 rounded-full bg-[#f5b942]/15 hover:bg-[#f5b942]/25 border border-[#f5b942]/45 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#ffe7a3] transition-all active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-[#1ed760]" />
              Toque para Ouvir o Acorde de Sax & Entrar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaxStageIntro;
