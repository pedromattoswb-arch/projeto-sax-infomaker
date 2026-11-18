import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Volume2 } from "lucide-react";
import { FUNNEL_CONFIG } from "../funnel.config";
import { SaxVisual } from "../fx/SaxVisual";
import { SplitTextHeading } from "../fx/SplitTextHeading";
import { useIdleHint } from "../hooks/useIdleHint";

interface SceneIntroProps {
  reducedMotion: boolean;
  onStart: () => void;
  onBurstParticles: () => void;
  onStageFlash: (warmth: number, intensity: number) => void;
}

export const SceneIntro = ({
  reducedMotion,
  onStart,
  onBurstParticles,
  onStageFlash,
}: SceneIntroProps) => {
  const [triggered, setTriggered] = useState(false);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const idle4s = useIdleHint(!triggered, 4000, "scene1");

  useEffect(() => {
    onStageFlash(0.75, 0.28);
  }, [onStageFlash]);

  const handleActivate = () => {
    if (triggered) return;
    setTriggered(true);

    // Haptic feedback on Android (silently ignored on iOS/unsupported)
    try {
      navigator.vibrate?.(30);
    } catch {
      // noop
    }

    onStageFlash(1, 1.15);
    onBurstParticles();

    if (reducedMotion || !sceneRef.current) {
      window.setTimeout(onStart, 220);
      return;
    }

    const tl = gsap.timeline({
      onComplete: onStart,
    });

    if (flashRef.current) {
      tl.fromTo(
        flashRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.9, scale: 1.4, duration: 0.24, ease: "power2.out" },
        0
      ).to(flashRef.current, { opacity: 0, duration: 0.45, ease: "power2.inOut" }, 0.2);
    }

    // Scale & Zoom exit into stage (<= 900ms)
    tl.to(
      sceneRef.current,
      {
        scale: 1.15,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.72,
        ease: "power2.inOut",
      },
      0.12
    );
  };

  return (
    <div
      ref={sceneRef}
      role="button"
      tabIndex={0}
      aria-label="Toque para ligar o som e iniciar a experiência do Clube do Sax"
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      className="relative z-10 flex flex-col items-center justify-between w-full h-full px-5 pt-16 pb-8 sm:pt-20 sm:pb-12 text-center cursor-pointer select-none will-change-transform"
    >
      {/* Flash Bloom Overlay on First Tap */}
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-30 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(255, 245, 210, 0.95) 0%, rgba(245, 185, 66, 0.42) 38%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      {/* Top Headline Block */}
      <div className="max-w-lg mx-auto space-y-2.5 sm:space-y-3">
        <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.26em] text-[#f5d58a]/85">
          {FUNNEL_CONFIG.copy.scene1.eyebrow}
        </p>

        <SplitTextHeading
          text={FUNNEL_CONFIG.copy.scene1.headline}
          as="h1"
          highlightWords={["sax", "som"]}
          className="jazz-display text-white"
          reducedMotion={reducedMotion}
          delay={0.05}
        />

        <p className="text-base sm:text-lg text-[#cdc3b2] max-w-md mx-auto leading-snug pt-1">
          {FUNNEL_CONFIG.copy.scene1.subtitle}
        </p>
      </div>

      {/* Centerpiece: Floating Golden Saxophone + Pulsing Touch Ring */}
      <div className="relative my-auto py-2 flex items-center justify-center">
        {/* Pulsing golden rings */}
        <div
          className={`pointer-events-none absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-[#f5d58a]/45 ${
            idle4s ? "jazz-pulse-ring-urgent border-[#f5d58a]/85" : "jazz-pulse-ring"
          }`}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 185, 66, 0.24) 0%, rgba(245, 185, 66, 0.05) 55%, transparent 72%)",
          }}
          aria-hidden="true"
        />

        <SaxVisual
          variant="alto"
          className="h-[250px] min-[390px]:h-[285px] sm:h-[340px] w-auto"
          glowIntensity={triggered ? 1.15 : idle4s ? 0.85 : 0.45}
          floatEnabled={!triggered}
          sheenEnabled
          reducedMotion={reducedMotion}
          priority
        />
      </div>

      {/* Bottom Invitation & Audio Hint */}
      <div className="space-y-2.5 pb-1">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 border transition-all duration-300 ${
            idle4s
              ? "bg-[#f5d58a] text-[#140d02] border-[#fff0c2] shadow-[0_0_28px_rgba(245,213,138,0.55)] scale-105"
              : "bg-white/[0.06] text-[#f5d58a] border-[#f5d58a]/35"
          }`}
        >
          {idle4s && <Volume2 className="w-4 h-4 shrink-0" />}
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">
            {idle4s ? FUNNEL_CONFIG.copy.scene1.idleHint : FUNNEL_CONFIG.copy.scene1.soundHint}
          </span>
        </div>

        <p className="text-xs text-[#cdc3b2]/75 font-medium">
          Toque em qualquer ponto para acender o palco
        </p>
      </div>
    </div>
  );
};
