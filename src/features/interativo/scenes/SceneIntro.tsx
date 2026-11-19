import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, CheckCircle2, Loader2, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { FUNNEL_CONFIG } from "../funnel.config";
import type { ActivationResult } from "../audio/AudioEngine";
import { SaxVisual } from "../fx/SaxVisual";
import { SplitTextHeading } from "../fx/SplitTextHeading";
import { useIdleHint } from "../hooks/useIdleHint";

type ActivationPhase = "idle" | "preparing" | "activated" | "error";

interface SceneIntroProps {
  reducedMotion: boolean;
  /** Executa ativação real e audível dentro do evento `click` (nunca `touchstart` no iOS!) */
  onActivateAudio: () => Promise<ActivationResult>;
  onContinueWithoutSound: () => void;
  onStart: () => void;
  onBurstParticles: () => void;
  onStageFlash: (warmth: number, intensity: number) => void;
}

export const SceneIntro = ({
  reducedMotion,
  onActivateAudio,
  onContinueWithoutSound,
  onStart,
  onBurstParticles,
  onStageFlash,
}: SceneIntroProps) => {
  const [phase, setPhase] = useState<ActivationPhase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const busyRef = useRef(false);
  const idle4s = useIdleHint(phase === "idle", 4000, "scene1");

  useEffect(() => {
    onStageFlash(0.75, 0.3);
  }, [onStageFlash]);

  const runExitTransition = () => {
    try {
      navigator.vibrate?.(25);
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
      ).to(flashRef.current, { opacity: 0, duration: 0.42, ease: "power2.inOut" }, 0.2);
    }

    tl.to(
      sceneRef.current,
      {
        scale: 1.12,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.65,
        ease: "power2.inOut",
      },
      0.16
    );
  };

  /**
   * IMPORTANTE iOS SAFARI:
   * Disparado exclusivamente via `onClick` (gesto de ativação válido no WebKit).
   * Jamais usar `onTouchStart` para ativação de áudio no iPhone!
   */
  const handleActivateClick = async () => {
    if (busyRef.current || phase === "activated") return;
    busyRef.current = true;
    setPhase("preparing");
    setErrorMessage(null);

    const result = await onActivateAudio();

    if (!result.ok) {
      busyRef.current = false;
      setPhase("error");
      setErrorMessage(result.error || FUNNEL_CONFIG.copy.scene1.errorTitle);
      return;
    }

    // Só exibe sucesso e inicia a transição após confirmação técnica real da reprodução audível!
    setPhase("activated");
    runExitTransition();
  };

  const handleFallbackSilent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase === "activated") return;
    onContinueWithoutSound();
    runExitTransition();
  };

  return (
    <div
      ref={sceneRef}
      className="relative z-10 flex flex-col items-center justify-between w-full h-full px-5 pt-[68px] pb-7 sm:pt-20 sm:pb-10 text-center select-none will-change-transform jazz-safe-bottom"
    >
      {/* Flash Bloom Overlay on Activation */}
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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f5d58a]">
          {FUNNEL_CONFIG.copy.scene1.eyebrow}
        </span>

        <SplitTextHeading
          text={FUNNEL_CONFIG.copy.scene1.headline}
          as="h1"
          highlightWords={["experiência", "começar!"]}
          className="jazz-display text-white"
          reducedMotion={reducedMotion}
          delay={0.04}
        />

        <p className="text-[15px] sm:text-lg text-[#e0d7c6] max-w-md mx-auto leading-snug">
          {FUNNEL_CONFIG.copy.scene1.subtitle}
        </p>
      </div>

      {/* Centerpiece: Floating Golden Saxophone (clicking it also activates audio cleanly via `onClick`) */}
      <button
        type="button"
        onClick={() => void handleActivateClick()}
        disabled={phase === "preparing" || phase === "activated"}
        aria-label="Tocar no saxofone para ativar o som"
        className="relative my-auto flex items-center justify-center bg-transparent border-0 p-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d58a] rounded-full"
      >
        <div
          className={`pointer-events-none absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border ${
            phase === "activated"
              ? "border-[#1ed760]/80"
              : idle4s
              ? "jazz-pulse-ring-urgent border-[#f5d58a]/90"
              : "jazz-pulse-ring border-[#f5d58a]/50"
          }`}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full"
          style={{
            background:
              phase === "activated"
                ? "radial-gradient(circle, rgba(30, 215, 96, 0.3) 0%, rgba(245, 185, 66, 0.1) 55%, transparent 74%)"
                : "radial-gradient(circle, rgba(245, 185, 66, 0.28) 0%, rgba(245, 185, 66, 0.06) 55%, transparent 74%)",
          }}
          aria-hidden="true"
        />

        <SaxVisual
          variant="alto"
          className="h-[210px] min-[390px]:h-[250px] sm:h-[310px] w-auto"
          glowIntensity={phase === "activated" ? 1.2 : idle4s ? 0.9 : 0.55}
          floatEnabled={phase !== "activated"}
          sheenEnabled
          reducedMotion={reducedMotion}
          priority
        />
      </button>

      {/* Bottom Activation Button + Explicit Technical Status Feedback + Volume Complement */}
      <div className="w-full max-w-sm mx-auto space-y-2.5">
        <button
          type="button"
          onClick={() => void handleActivateClick()}
          disabled={phase === "preparing" || phase === "activated"}
          data-audio-activation-btn="true"
          className={`w-full min-h-[56px] py-4 px-6 rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider inline-flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
            phase === "activated"
              ? "bg-[#1ed760] text-[#031a0b] shadow-[0_0_32px_rgba(30,215,96,0.45)]"
              : phase === "error"
              ? "bg-amber-400 text-[#181003] shadow-[0_0_24px_rgba(245,185,66,0.4)]"
              : `jazz-cta-gold ${
                  idle4s ? "scale-[1.03] shadow-[0_0_34px_rgba(245,213,138,0.62)]" : ""
                }`
          }`}
        >
          {phase === "preparing" && (
            <>
              <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
              <span>{FUNNEL_CONFIG.copy.scene1.preparingLabel}</span>
            </>
          )}

          {phase === "activated" && (
            <>
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{FUNNEL_CONFIG.copy.scene1.activatedLabel}</span>
            </>
          )}

          {phase === "error" && (
            <>
              <RefreshCw className="w-5 h-5 shrink-0" />
              <span>{FUNNEL_CONFIG.copy.scene1.retryLabel}</span>
            </>
          )}

          {phase === "idle" && (
            <>
              <Volume2 className="w-5 h-5 shrink-0" />
              <span>{FUNNEL_CONFIG.copy.scene1.ctaPill}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>

        {/* Live Status Region (Accessible & Transparent) */}
        <div role="status" aria-live="polite" className="min-h-[20px]">
          {phase === "error" ? (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#ffe49e]">
                {errorMessage || FUNNEL_CONFIG.copy.scene1.errorTitle}
              </p>
              <button
                type="button"
                onClick={handleFallbackSilent}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#cdc3b2]/85 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>{FUNNEL_CONFIG.copy.global.continueMutedCta}</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-[#cdc3b2]/85 font-medium">
              {FUNNEL_CONFIG.copy.global.audioSubtleHint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
