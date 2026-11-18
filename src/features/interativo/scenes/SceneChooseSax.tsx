import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FUNNEL_CONFIG, type SaxChoice } from "../funnel.config";
import { SaxVisual } from "../fx/SaxVisual";
import { SplitTextHeading } from "../fx/SplitTextHeading";
import { useIdleHint } from "../hooks/useIdleHint";

interface SceneChooseSaxProps {
  reducedMotion: boolean;
  allowTilt: boolean;
  onSelect: (sax: SaxChoice) => void;
  onSpotlightMove: (xPercent: number, intensity: number) => void;
  onTriggerStaffDraw: () => void;
  onBurstParticles: (xRatio: number, yRatio: number) => void;
}

export const SceneChooseSax = ({
  reducedMotion,
  allowTilt,
  onSelect,
  onSpotlightMove,
  onTriggerStaffDraw,
  onBurstParticles,
}: SceneChooseSaxProps) => {
  const [chosen, setChosen] = useState<SaxChoice | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const altoRef = useRef<HTMLButtonElement | null>(null);
  const tenorRef = useRef<HTMLButtonElement | null>(null);
  const idle4s = useIdleHint(!chosen, 4000, "scene2");

  // Scene entrance
  useEffect(() => {
    onSpotlightMove(50, 0.72);
    if (reducedMotion || !containerRef.current) return;
    const tween = gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.55, ease: "expo.out" }
    );
    return () => {
      tween.kill();
    };
  }, [onSpotlightMove, reducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!allowTilt || reducedMotion || chosen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -ny * 9, ry: nx * 12 });
  };

  const handlePick = (sax: SaxChoice) => {
    if (chosen) return;
    setChosen(sax);

    try {
      navigator.vibrate?.(25);
    } catch {
      // noop
    }

    const xRatio = sax === "alto" ? 0.28 : 0.72;
    onSpotlightMove(sax === "alto" ? 28 : 72, 1.0);
    onBurstParticles(xRatio, 0.48);
    onTriggerStaffDraw();

    if (reducedMotion) {
      window.setTimeout(() => onSelect(sax), 950);
      return;
    }

    const pickedEl = sax === "alto" ? altoRef.current : tenorRef.current;
    const otherEl = sax === "alto" ? tenorRef.current : altoRef.current;

    const tl = gsap.timeline({
      onComplete: () => onSelect(sax),
    });

    if (otherEl) {
      tl.to(
        otherEl,
        {
          opacity: 0,
          scale: 0.82,
          filter: "blur(10px)",
          duration: 0.45,
          ease: "power2.in",
        },
        0
      );
    }

    if (pickedEl) {
      tl.to(
        pickedEl,
        {
          x: sax === "alto" ? "26%" : "-26%",
          scale: 1.12,
          rotateY: sax === "alto" ? 12 : -12,
          duration: 0.65,
          ease: "expo.out",
        },
        0.05
      );
    }

    // Center spotlight gently after sax glides toward center
    tl.call(() => onSpotlightMove(50, 0.95), [], 0.28);

    // Hold briefly while SVG staff draws (~1.2s total) then fade seamlessly into Scene 3
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        y: -14,
        duration: 0.42,
        ease: "power2.inOut",
      },
      1.18
    );
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
      className="relative z-10 flex flex-col items-center justify-between w-full h-full px-4 pt-16 pb-8 sm:pt-20 sm:pb-10 text-center select-none"
      style={{ perspective: "1000px" }}
    >
      {/* Top Question */}
      <div className="max-w-lg mx-auto space-y-2">
        <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#f5d58a]/85">
          {FUNNEL_CONFIG.copy.scene2.eyebrow}
        </p>

        <SplitTextHeading
          text={FUNNEL_CONFIG.copy.scene2.headline}
          as="h1"
          highlightWords={["sax"]}
          className="jazz-display text-white"
          reducedMotion={reducedMotion}
          delay={0.04}
        />

        <p className="text-base text-[#cdc3b2] max-w-sm mx-auto leading-snug">
          {FUNNEL_CONFIG.copy.scene2.subtitle}
        </p>
      </div>

      {/* Two Floating Saxophones Side-by-Side */}
      <div
        className="grid grid-cols-2 gap-3 sm:gap-8 w-full max-w-xl mx-auto my-auto items-center"
        style={
          allowTilt && !reducedMotion && !chosen
            ? {
                transform: `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
                transition: "transform 160ms ease-out",
                transformStyle: "preserve-3d",
              }
            : undefined
        }
      >
        {/* ALTO (Eb) */}
        <button
          ref={altoRef}
          type="button"
          onClick={() => handlePick("alto")}
          disabled={chosen !== null}
          aria-label="Escolher Sax Alto Mi bemol (Eb)"
          className="group relative flex flex-col items-center justify-center rounded-3xl py-4 px-2 sm:p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-[#f5d58a]/25 hover:border-[#f5d58a]/70 transition-all cursor-pointer active:scale-95"
        >
          <div
            className="pointer-events-none absolute inset-x-4 top-6 bottom-12 rounded-full opacity-55 group-hover:opacity-90 transition-opacity"
            style={{
              background:
                "radial-gradient(circle, rgba(245, 213, 138, 0.25) 0%, transparent 70%)",
              filter: "blur(18px)",
            }}
            aria-hidden="true"
          />

          <SaxVisual
            variant="alto"
            className="h-[195px] min-[390px]:h-[225px] sm:h-[275px] w-auto relative z-10"
            glowIntensity={chosen === "alto" ? 1.15 : 0.65}
            floatEnabled={!chosen}
            sheenEnabled
            reducedMotion={reducedMotion}
            priority
          />

          <div className="relative z-10 mt-3 text-center">
            <span className="block font-heading font-black text-xl sm:text-2xl tracking-wider jazz-gold-text">
              {FUNNEL_CONFIG.copy.scene2.altoLabel}
            </span>
            <span className="block text-xs sm:text-sm font-semibold text-[#cdc3b2] mt-0.5">
              {FUNNEL_CONFIG.copy.scene2.altoSub}
            </span>
          </div>
        </button>

        {/* TENOR (Bb) */}
        <button
          ref={tenorRef}
          type="button"
          onClick={() => handlePick("tenor")}
          disabled={chosen !== null}
          aria-label="Escolher Sax Tenor Si bemol (Bb)"
          className="group relative flex flex-col items-center justify-center rounded-3xl py-4 px-2 sm:p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-[#f5d58a]/25 hover:border-[#f5d58a]/70 transition-all cursor-pointer active:scale-95"
        >
          <div
            className="pointer-events-none absolute inset-x-4 top-6 bottom-12 rounded-full opacity-55 group-hover:opacity-90 transition-opacity"
            style={{
              background:
                "radial-gradient(circle, rgba(245, 213, 138, 0.25) 0%, transparent 70%)",
              filter: "blur(18px)",
            }}
            aria-hidden="true"
          />

          <SaxVisual
            variant="tenor"
            className="h-[195px] min-[390px]:h-[225px] sm:h-[275px] w-auto relative z-10"
            glowIntensity={chosen === "tenor" ? 1.15 : 0.65}
            floatEnabled={!chosen}
            sheenEnabled
            reducedMotion={reducedMotion}
            priority
          />

          <div className="relative z-10 mt-3 text-center">
            <span className="block font-heading font-black text-xl sm:text-2xl tracking-wider jazz-gold-text">
              {FUNNEL_CONFIG.copy.scene2.tenorLabel}
            </span>
            <span className="block text-xs sm:text-sm font-semibold text-[#cdc3b2] mt-0.5">
              {FUNNEL_CONFIG.copy.scene2.tenorSub}
            </span>
          </div>
        </button>
      </div>

      {/* Bottom Calibrating Text OR Idle Hint (leaves clean space for shared SVG MusicStaff) */}
      <div className="min-h-[68px] flex flex-col items-center justify-center">
        {chosen ? (
          <SplitTextHeading
            text={FUNNEL_CONFIG.copy.scene2.adjustingTemplate(chosen)}
            as="p"
            mode="chars"
            className="text-sm sm:text-base font-bold text-[#f5d58a] tracking-wide"
            reducedMotion={reducedMotion}
            delay={0.05}
          />
        ) : (
          <p
            className={`text-xs sm:text-sm font-semibold transition-all duration-300 ${
              idle4s
                ? "text-[#f5d58a] bg-[#f5d58a]/12 border border-[#f5d58a]/40 rounded-full px-4 py-1.5"
                : "text-[#cdc3b2]/75"
            }`}
          >
            {idle4s
              ? FUNNEL_CONFIG.copy.scene2.idleHint
              : "Ambos vêm inclusos — escolha o seu principal para personalizar"}
          </p>
        )}
      </div>
    </div>
  );
};
