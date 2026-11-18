import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";

export type SaxType = "alto" | "tenor";

function isReducedMotionPreferred(hookVal: boolean | null): boolean {
  return (
    Boolean(hookVal) ||
    (typeof window !== "undefined" &&
      Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches))
  );
}

const AMBIENT_NOTES = [
  { symbol: "♪", left: "5%", top: "16%", duration: "9.5s", delay: "0s", size: "text-lg sm:text-xl" },
  { symbol: "♫", left: "92%", top: "24%", duration: "11s", delay: "1.4s", size: "text-xl sm:text-2xl" },
  { symbol: "𝄞", left: "8%", top: "54%", duration: "12s", delay: "2.6s", size: "text-xl sm:text-2xl" },
  { symbol: "♪", left: "91%", top: "70%", duration: "10s", delay: "0.8s", size: "text-lg sm:text-xl" },
];

/* Ambient Scroll-Parallax Stage Spotlights & Notes (Mobile + Desktop) */
export const AmbientSaxBackdrop = () => {
  const hookReduced = useReducedMotion();
  const reduced = isReducedMotionPreferred(hookReduced);
  const { scrollYProgress } = useScroll();
  const spotlightY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <motion.div
        style={reduced ? undefined : { y: spotlightY }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[480px] rounded-full opacity-35"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(245, 185, 66, 0.24) 0%, transparent 70%)",
            filter: "blur(52px)",
          }}
        />
      </motion.div>

      <div
        className="hidden md:block absolute bottom-[-160px] right-[-90px] w-[460px] h-[460px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(30, 215, 96, 0.18) 0%, transparent 70%)",
          filter: "blur(58px)",
        }}
      />

      {!reduced &&
        AMBIENT_NOTES.map((n, idx) => (
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
  );
};

/* ==========================================================================
   SCROLL-SYNCHRONIZED 3D SYMPHONIC BRIDGE BETWEEN SECTIONS (All Devices!)
   Moves musical notes, sound-spectrum bars, and 3D brass medallion with scroll
   ========================================================================== */
export const MusicalStaffDivider = ({ label }: { label?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const hookReduced = useReducedMotion();
  const reduced = isReducedMotionPreferred(hookReduced);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.35 });
  const streamLeftX = useTransform(smooth, [0, 1], ["-36px", "36px"]);
  const streamRightX = useTransform(smooth, [0, 1], ["36px", "-36px"]);
  const medallionRotateY = useTransform(smooth, [0, 0.5, 1], [-22, 0, 22]);
  const medallionScale = useTransform(smooth, [0, 0.5, 1], [0.92, 1.06, 0.92]);
  const waveScale = useTransform(smooth, [0, 0.5, 1], [0.55, 1.15, 0.55]);

  return (
    <div
      ref={ref}
      className="relative py-5 md:py-8 px-4 max-w-5xl mx-auto select-none overflow-hidden sax-3d-perspective"
      aria-hidden="true"
    >
      {/* Curved 3D Stage Horizon Glow */}
      <div
        className="pointer-events-none absolute inset-x-8 top-1/2 -translate-y-1/2 h-10 rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,185,66,0.28) 0%, rgba(30,215,96,0.08) 45%, transparent 75%)",
          filter: "blur(12px)",
        }}
      />

      <div className="relative flex items-center justify-center">
        {/* 5 Golden Pentagrama Lines */}
        <div className="w-full flex flex-col gap-[4px] opacity-35">
          {[0, 1, 2, 3, 4].map((line) => (
            <div
              key={line}
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(245,185,66,0.55) 22%, rgba(255,232,163,0.9) 50%, rgba(245,185,66,0.55) 78%, transparent 100%)",
              }}
            />
          ))}
        </div>

        {/* Left & Right Scroll-Synchronized Gliding Musical Streams (All Devices!) */}
        {!reduced && (
          <>
            <motion.div
              style={{ x: streamLeftX }}
              className="flex items-center gap-2 sm:gap-5 absolute left-[3%] sm:left-[10%] md:left-[15%] text-[#ffe49e]/65 font-serif text-xs sm:text-sm pointer-events-none"
            >
              <span>♪</span>
              <span className="hidden min-[400px]:inline text-[#1ed760]/70 text-xs">♫</span>
            </motion.div>

            <motion.div
              style={{ x: streamRightX }}
              className="flex items-center gap-2 sm:gap-5 absolute right-[3%] sm:right-[10%] md:right-[15%] text-[#ffe49e]/65 font-serif text-xs sm:text-sm pointer-events-none"
            >
              <span className="hidden min-[400px]:inline text-[#1ed760]/70 text-xs">♬</span>
              <span>♪</span>
            </motion.div>
          </>
        )}

        {/* Center 3D Scroll-Tilting Brass Medallion + Mini Spectrum */}
        <motion.div
          style={
            reduced
              ? undefined
              : {
                  rotateY: medallionRotateY,
                  scale: medallionScale,
                }
          }
          className="absolute px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0e0a06]/95 border border-[#f5b942]/45 shadow-[0_8px_28px_rgba(0,0,0,0.85),0_0_22px_rgba(245,185,66,0.22)] flex items-center gap-2 max-w-[92%]"
        >
          <span className="text-[#f5b942] text-sm sm:text-base leading-none shrink-0">𝄞</span>

          {/* Scroll-reactive mini soundwave bars */}
          <motion.div
            style={reduced ? undefined : { scaleY: waveScale }}
            className="flex items-center gap-[2px] h-3 shrink-0"
          >
            <span className="w-[2px] h-1.5 rounded-full bg-[#f5b942]" />
            <span className="w-[2px] h-3 rounded-full bg-[#1ed760]" />
            <span className="w-[2px] h-2 rounded-full bg-[#ffe49e]" />
          </motion.div>

          {label && (
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.14em] text-[#ffe49e] truncate">
              {label}
            </span>
          )}

          <span className="text-[#f5b942] text-xs sm:text-sm leading-none shrink-0">♫</span>
        </motion.div>
      </div>
    </div>
  );
};

/* ==========================================================================
   SCROLL-SYNCHRONIZED 3D DEVICE / MOCKUP STAGE (Works on Mobile & Desktop!)
   Tilts in real 3D space + sweeps a metallic light sheen as user scrolls!
   Always 100% visible (opacity: 1) so media never looks unloaded!
   ========================================================================== */
export const Scroll3DMockup = ({
  children,
  className = "",
  tiltDirection = 1,
}: {
  children: ReactNode;
  className?: string;
  tiltDirection?: 1 | -1;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hookReduced = useReducedMotion();
  const reduced = isReducedMotionPreferred(hookReduced);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 24, mass: 0.4 });
  const rotateX = useTransform(smooth, [0, 0.48, 1], [9, 0, -7]);
  const rotateY = useTransform(
    smooth,
    [0, 0.5, 1],
    [-5 * tiltDirection, 0, 5 * tiltDirection]
  );
  const scale = useTransform(smooth, [0, 0.48, 1], [0.95, 1, 0.97]);
  const y = useTransform(smooth, [0, 0.5, 1], [16, 0, -14]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`sax-3d-perspective ${className}`}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          y,
          transformStyle: "preserve-3d",
        }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ==========================================================================
   SCROLL-LINKED 3D CARD ELEVATION (Always visible, zero blank opacity delay!)
   ========================================================================== */
export const CinematicReveal = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hookReduced = useReducedMotion();
  const reduced = isReducedMotionPreferred(hookReduced);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.35 });
  const rotateX = useTransform(smooth, [0, 1], [7, 0]);
  const y = useTransform(smooth, [0, 1], [18, 0]);
  const scale = useTransform(smooth, [0, 1], [0.965, 1]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`sax-3d-perspective ${className}`}>
      <motion.div
        style={{ rotateX, y, scale }}
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ==========================================================================
   KINETIC 3D HEADLINE WRAPPER (Scroll-linked 3D subtle hinge on headings)
   ========================================================================== */
export const KineticHeading = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const hookReduced = useReducedMotion();
  const reduced = isReducedMotionPreferred(hookReduced);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "center 65%"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });
  const rotateX = useTransform(smooth, [0, 1], [14, 0]);
  const y = useTransform(smooth, [0, 1], [12, 0]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`sax-3d-perspective ${className}`}>
      <motion.div style={{ rotateX, y, transformOrigin: "center bottom" }}>
        {children}
      </motion.div>
    </div>
  );
};
