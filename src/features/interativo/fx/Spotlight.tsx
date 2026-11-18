import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SpotlightProps {
  /** Posição horizontal em % (25 = esquerda, 50 = centro, 75 = direita) */
  xPercent: number;
  /** 0..1 */
  intensity: number;
  /** 0 = azul frio, 1 = dourado quente */
  warmth: number;
  reducedMotion: boolean;
}

export const Spotlight = ({ xPercent, intensity, warmth, reducedMotion }: SpotlightProps) => {
  const beamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = beamRef.current;
    if (!el) return;
    if (reducedMotion) {
      el.style.left = `${xPercent}%`;
      el.style.opacity = String(intensity);
      return;
    }
    const tween = gsap.to(el, {
      left: `${xPercent}%`,
      opacity: intensity,
      duration: 0.72,
      ease: "power3.out",
      overwrite: "auto",
    });
    return () => {
      tween.kill();
    };
  }, [xPercent, intensity, reducedMotion]);

  const colorInner =
    warmth > 0.4
      ? `rgba(245, 213, 138, ${(0.28 + warmth * 0.22).toFixed(2)})`
      : "rgba(130, 178, 240, 0.22)";
  const colorMid =
    warmth > 0.4 ? "rgba(184, 137, 46, 0.14)" : "rgba(45, 82, 136, 0.12)";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      <div
        ref={beamRef}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[540px] sm:h-[640px] rounded-full"
        style={{
          left: `${xPercent}%`,
          opacity: intensity,
          background: `radial-gradient(ellipse at center, ${colorInner} 0%, ${colorMid} 42%, transparent 72%)`,
          filter: "blur(34px)",
        }}
      />
    </div>
  );
};
