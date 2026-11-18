import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type SaxType = "alto" | "tenor";

const AMBIENT_NOTES = [
  { symbol: "♪", left: "6%", top: "20%", duration: "11s", delay: "0s", size: "text-xl" },
  { symbol: "♫", left: "92%", top: "26%", duration: "12.5s", delay: "1.8s", size: "text-2xl" },
  { symbol: "𝄞", left: "10%", top: "56%", duration: "13.5s", delay: "3.2s", size: "text-2xl" },
  { symbol: "♪", left: "90%", top: "68%", duration: "10.5s", delay: "2.4s", size: "text-lg" },
];

export const AmbientSaxBackdrop = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
    {/* Soft stage amber radial glows */}
    <div
      className="absolute -top-48 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[480px] rounded-full opacity-30"
      style={{
        background: "radial-gradient(ellipse at center, rgba(245, 185, 66, 0.22) 0%, transparent 70%)",
        filter: "blur(56px)",
      }}
    />
    <div
      className="hidden md:block absolute bottom-[-180px] right-[-100px] w-[480px] h-[480px] rounded-full opacity-20"
      style={{
        background: "radial-gradient(circle, rgba(30, 215, 96, 0.16) 0%, transparent 70%)",
        filter: "blur(60px)",
      }}
    />

    {/* Subtle Floating Golden Musical Symbols — Desktop/Tablet only for adaptive mobile performance */}
    <div className="hidden sm:block">
      {AMBIENT_NOTES.map((n, idx) => (
        <span
          key={idx}
          className={`absolute font-serif text-[#f5b942]/25 animate-sax-float-note ${n.size}`}
          style={
            {
              left: n.left,
              top: n.top,
              "--note-duration": n.duration,
              "--note-delay": n.delay,
            } as React.CSSProperties
          }
        >
          {n.symbol}
        </span>
      ))}
    </div>
  </div>
);

/* Artistic 5-line Golden Musical Pentagrama Section Divider */
export const MusicalStaffDivider = ({ label }: { label?: string }) => (
  <div className="relative py-4 md:py-6 px-4 max-w-5xl mx-auto select-none overflow-hidden" aria-hidden="true">
    <div className="relative flex items-center justify-center">
      <div className="w-full flex flex-col gap-[4px] opacity-30">
        {[0, 1, 2, 3, 4].map((line) => (
          <div
            key={line}
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(245,185,66,0.55) 25%, rgba(255,232,163,0.85) 50%, rgba(245,185,66,0.55) 75%, transparent 100%)",
            }}
          />
        ))}
      </div>

      <div className="absolute px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0d0905] border border-[#f5b942]/35 shadow-[0_0_20px_rgba(245,185,66,0.18)] flex items-center gap-2 max-w-[92%]">
        <span className="text-[#f5b942] text-sm sm:text-base leading-none shrink-0">𝄞</span>
        {label && (
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.14em] text-[#ffe49e] truncate">
            {label}
          </span>
        )}
        <span className="text-[#f5b942] text-xs sm:text-sm leading-none shrink-0">♫</span>
      </div>
    </div>
  </div>
);

/* Progressive Cinematic Section Reveal (Never hides content if reduced motion is active) */
export const CinematicReveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
