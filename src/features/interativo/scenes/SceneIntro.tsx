import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, Pointer } from "lucide-react";
import { FUNNEL_CONFIG } from "../funnel.config";
import { SaxVisual } from "../fx/SaxVisual";
import { SplitTextHeading } from "../fx/SplitTextHeading";
import { useIdleHint } from "../hooks/useIdleHint";

interface SceneIntroProps {
  reducedMotion: boolean;
  /** Chamado SINCRONAMENTE no gesto do toque para desbloquear áudio no iOS/Instagram WebView */
  onUnlockAudio: () => void;
  onStart: () => void;
  onBurstParticles: () => void;
  onStageFlash: (warmth: number, intensity: number) => void;
}

export const SceneIntro = ({
  reducedMotion,
  onUnlockAudio,
  onStart,
  onBurstParticles,
  onStageFlash,
}: SceneIntroProps) => {
  const [triggered, setTriggered] = useState(false);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const idle4s = useIdleHint(!triggered, 4000, "scene1");

  useEffect(() => {
    onStageFlash(0.75, 0.3);
  }, [onStageFlash]);

  const unlockedRef = useRef(false);

  const ensureUnlocked = () => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    onUnlockAudio();
  };

  const handleActivate = () => {
    if (triggered) return;
    setTriggered(true);

    // 1. DESBLOQUEIA ÁUDIO SINCRONAMENTE DENTRO DO GESTO DO USUÁRIO (iOS Silent Switch Bypass + WebKit)
    ensureUnlocked();

    try {
      navigator.vibrate?.(30);
    } catch {
      // noop
    }

    onStageFlash(1, 1.18);
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
        { opacity: 0.92, scale: 1.4, duration: 0.24, ease: "power2.out" },
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
        duration: 0.7,
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
      onTouchStart={ensureUnlocked}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      className="relative z-10 flex flex-col items-center justify-between w-full h-full px-5 pt-[68px] pb-7 sm:pt-20 sm:pb-10 text-center cursor-pointer select-none will-change-transform jazz-safe-bottom"
    >
      {/* Flash Bloom Overlay on First Tap */}
      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-30 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(255, 245, 210, 0.95) 0%, rgba(245, 185, 66, 0.44) 38%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      {/* Top Headline Block */}
      <div className="max-w-lg mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5d58a]/10 border border-[#f5d58a]/30 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f5d58a]">
          {FUNNEL_CONFIG.copy.scene1.eyebrow}
        </span>

        <SplitTextHeading
          text={FUNNEL_CONFIG.copy.scene1.headline}
          as="h1"
          highlightWords={["sax", "som"]}
          className="jazz-display text-white"
          reducedMotion={reducedMotion}
          delay={0.04}
        />

        <p className="text-[15px] sm:text-lg text-[#e0d7c6] max-w-md mx-auto leading-snug">
          {FUNNEL_CONFIG.copy.scene1.subtitle}
        </p>
      </div>

      {/* Centerpiece: Floating Golden Saxophone + Concentric Pulsing Touch Target */}
      <div className="relative my-auto flex items-center justify-center">
        <div
          className={`pointer-events-none absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border ${
            idle4s ? "jazz-pulse-ring-urgent border-[#f5d58a]/90" : "jazz-pulse-ring border-[#f5d58a]/50"
          }`}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 185, 66, 0.28) 0%, rgba(245, 185, 66, 0.06) 55%, transparent 74%)",
          }}
          aria-hidden="true"
        />

        <SaxVisual
          variant="alto"
          className="h-[225px] min-[390px]:h-[265px] sm:h-[325px] w-auto"
          glowIntensity={triggered ? 1.2 : idle4s ? 0.9 : 0.52}
          floatEnabled={!triggered}
          sheenEnabled
          reducedMotion={reducedMotion}
          priority
        />

        {/* Crisp Touch Badge floating gently beside the saxophone */}
        <div
          className={`pointer-events-none absolute bottom-3 right-[-12px] sm:right-[-24px] rounded-full bg-[#0c0a06]/90 border border-[#f5d58a]/60 px-3 py-1.5 flex items-center gap-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.8)] transition-transform duration-300 ${
            idle4s ? "scale-110 border-[#f5d58a]" : ""
          }`}
          aria-hidden="true"
        >
          <Pointer className="w-3.5 h-3.5 text-[#f5d58a]" />
          <span className="text-[11px] font-black uppercase tracking-wider text-white">Toque</span>
        </div>
      </div>

      {/* Bottom Clear Highlighted Action Pill + Subtle Audio Notice */}
      <div className="w-full max-w-sm mx-auto space-y-2.5">
        <div
          className={`jazz-cta-gold w-full py-3.5 px-6 rounded-2xl text-sm sm:text-base uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-transform duration-300 ${
            idle4s ? "scale-[1.03] shadow-[0_0_34px_rgba(245,213,138,0.62)]" : ""
          }`}
        >
          <span>{idle4s ? FUNNEL_CONFIG.copy.scene1.idleHint : FUNNEL_CONFIG.copy.scene1.ctaPill}</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </div>

        <p className="text-[11px] sm:text-xs text-[#cdc3b2]/70 font-medium">
          {FUNNEL_CONFIG.copy.global.audioSubtleHint}
        </p>
      </div>
    </div>
  );
};
