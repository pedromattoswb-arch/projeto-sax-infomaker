import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FUNNEL_CONFIG, type SaxChoice } from "../funnel.config";

interface SaxVisualProps {
  variant: SaxChoice;
  className?: string;
  /** 0.2 = apagado/discreto, 1 = palco aceso com bloom dourado */
  glowIntensity?: number;
  floatEnabled?: boolean;
  sheenEnabled?: boolean;
  reducedMotion: boolean;
  priority?: boolean;
  alt?: string;
}

export const SaxVisual = ({
  variant,
  className = "h-56 sm:h-64 w-auto",
  glowIntensity = 0.55,
  floatEnabled = true,
  sheenEnabled = true,
  reducedMotion,
  priority = false,
  alt,
}: SaxVisualProps) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const src = variant === "alto" ? FUNNEL_CONFIG.assets.saxAltoImage : FUNNEL_CONFIG.assets.saxTenorImage;
  const label = alt || (variant === "alto" ? "Saxofone Alto dourado (Eb)" : "Saxofone Tenor dourado (Bb)");

  useEffect(() => {
    if (!floatEnabled || reducedMotion || !wrapRef.current) return;
    const tween = gsap.to(wrapRef.current, {
      y: variant === "alto" ? -9 : -11,
      rotation: variant === "alto" ? 1.4 : -1.4,
      duration: variant === "alto" ? 2.6 : 2.9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [floatEnabled, reducedMotion, variant]);

  const shadowAlpha = Math.max(0.18, Math.min(0.85, glowIntensity * 0.72));
  const shadowRadius = Math.round(14 + glowIntensity * 28);

  return (
    <div ref={wrapRef} className="relative inline-flex items-center justify-center select-none will-change-transform">
      <div className="relative overflow-hidden">
        <img
          src={src}
          alt={label}
          width={600}
          height={800}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          draggable={false}
          className={`${className} object-contain pointer-events-none`}
          style={{
            filter: `drop-shadow(0 0 ${shadowRadius}px rgba(245, 185, 66, ${shadowAlpha.toFixed(2)})) drop-shadow(0 18px 28px rgba(0, 0, 0, 0.85))`,
          }}
        />

        {/* Metallic reflection sweep masked cleanly along the brass silhouette */}
        {sheenEnabled && !reducedMotion && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen"
            style={{
              WebkitMaskImage: `url(${src})`,
              maskImage: `url(${src})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
            aria-hidden="true"
          >
            <div
              className="jazz-sax-sheen-bar absolute -inset-y-8 w-[42%] left-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 244, 200, 0.52) 50%, transparent 100%)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
