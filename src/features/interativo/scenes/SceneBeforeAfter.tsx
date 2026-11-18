import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronsRight, Sparkles, Volume2 } from "lucide-react";
import { FUNNEL_CONFIG, type SaxChoice } from "../funnel.config";
import { audioEngine } from "../audio/AudioEngine";
import { Waveform } from "../fx/Waveform";
import { SplitTextHeading } from "../fx/SplitTextHeading";
import { useIdleHint } from "../hooks/useIdleHint";

interface SceneBeforeAfterProps {
  sax: SaxChoice;
  reducedMotion: boolean;
  isMuted: boolean;
  audioUnavailable: boolean;
  onMixChange: (mix: number) => void;
  onBeatPulse: (pulse: number) => void;
  onLockedComplete: () => void;
  onAdvance: () => void;
  onBurstParticles: () => void;
}

const CrowdParallaxLayers = ({ mix }: { mix: number }) => {
  const m = Math.max(0, Math.min(1, mix));
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[2] h-28 sm:h-36 overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 180"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-full transition-transform duration-150"
        style={{ opacity: m * 0.42, transform: `translate3d(0, ${(1 - m) * 44}px, 0)` }}
      >
        <path
          d="M0,180 L0,118 C45,95 75,112 118,96 C158,82 188,108 232,92 C282,74 316,105 362,88 C410,70 448,100 495,84 C548,66 588,96 635,82 C682,68 724,98 776,82 C824,66 868,100 918,86 C966,72 1010,104 1062,88 C1110,74 1152,102 1200,90 L1200,180 Z"
          fill="#1b1409"
        />
      </svg>
      <svg
        viewBox="0 0 1200 180"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-full transition-transform duration-150"
        style={{ opacity: m * 0.65, transform: `translate3d(0, ${(1 - m) * 68}px, 0)` }}
      >
        <path
          d="M0,180 L0,132 Q40,94 82,128 Q132,84 185,126 Q236,92 292,130 Q348,82 406,126 Q460,90 518,130 Q574,80 632,126 Q692,88 748,128 Q806,82 864,126 Q924,90 982,130 Q1040,84 1102,128 Q1152,96 1200,126 L1200,180 Z"
          fill="#0f0b06"
          stroke="rgba(245, 213, 138, 0.22)"
          strokeWidth="1.5"
        />
      </svg>
      <svg
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-24 sm:h-28 transition-transform duration-150"
        style={{ opacity: m * 0.88, transform: `translate3d(0, ${(1 - m) * 90}px, 0)` }}
      >
        <path
          d="M0,160 L0,124 C55,96 95,122 140,122 C185,92 230,118 280,124 C340,92 385,124 440,124 C505,88 555,122 612,124 C670,92 715,122 775,124 C835,90 880,120 945,124 C1005,92 1060,122 1125,122 C1160,104 1184,114 1200,122 L1200,160 Z"
          fill="#07070a"
        />
      </svg>
    </div>
  );
};

export const SceneBeforeAfter = ({
  sax,
  reducedMotion,
  isMuted,
  audioUnavailable,
  onMixChange,
  onBeatPulse,
  onLockedComplete,
  onAdvance,
  onBurstParticles,
}: SceneBeforeAfterProps) => {
  const [mix, setMix] = useState(0);
  const [locked, setLocked] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const lockedRef = useRef(false);

  const idle4s = useIdleHint(!hasInteracted && !locked, 4000, "scene3-ghost");
  const idle10s = useIdleHint(!locked, 10000, "scene3-fallback");

  useEffect(() => {
    onMixChange(0);
    void audioEngine.startComparison(0);
  }, [onMixChange]);

  useEffect(() => {
    if (reducedMotion) return;
    let rafId = 0;
    const bpm = FUNNEL_CONFIG.audio.bpm;
    const start = performance.now();
    const tick = (now: number) => {
      const sec = (now - start) / 1000;
      const beatPhase = ((sec * bpm) / 60) % 1;
      const pulse = Math.exp(-beatPhase * 5.8) * Math.max(0, mix - 0.15);
      onBeatPulse(pulse);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      onBeatPulse(0);
    };
  }, [mix, onBeatPulse, reducedMotion]);

  // 4s Ghost Drag Demonstration
  useEffect(() => {
    if (!idle4s || hasInteracted || locked || reducedMotion) return;
    const proxy = { v: 0 };
    const tl = gsap.timeline();
    tl.to(proxy, {
      v: 0.42,
      duration: 0.72,
      ease: "power2.inOut",
      onUpdate: () => {
        if (!draggingRef.current && !lockedRef.current) {
          setMix(proxy.v);
          audioEngine.setMix(proxy.v);
          onMixChange(proxy.v);
        }
      },
    }).to(proxy, {
      v: 0,
      duration: 0.65,
      ease: "power2.inOut",
      delay: 0.18,
      onUpdate: () => {
        if (!draggingRef.current && !lockedRef.current) {
          setMix(proxy.v);
          audioEngine.setMix(proxy.v);
          onMixChange(proxy.v);
        }
      },
    });
    return () => {
      tl.kill();
    };
  }, [idle4s, hasInteracted, locked, onMixChange, reducedMotion]);

  const commitLock = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    setMix(1);
    audioEngine.setMix(1);
    onMixChange(1);
    onBurstParticles();
    onLockedComplete();

    try {
      navigator.vibrate?.([20, 30, 40]);
    } catch {
      // noop
    }

    if (!reducedMotion && flashRef.current) {
      gsap.fromTo(
        flashRef.current,
        { opacity: 0 },
        { opacity: 0.72, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }
  }, [onBurstParticles, onLockedComplete, onMixChange, reducedMotion]);

  const applyRatio = useCallback(
    (rawRatio: number) => {
      const clamped = Math.max(0, Math.min(1, rawRatio));
      setHasInteracted(true);
      if (clamped >= 0.85) {
        commitLock();
        return;
      }
      setMix(clamped);
      audioEngine.setMix(clamped);
      onMixChange(clamped);
    },
    [commitLock, onMixChange]
  );

  const ratioFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const usable = Math.max(1, rect.width - 60);
    return (clientX - rect.left - 30) / usable;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (locked) return;
    draggingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // noop
    }
    const ratio = ratioFromClientX(e.clientX);
    // Se o usuário tocar direto no lado direito (>= 0.65), anima suavemente até travar em 100%!
    if (ratio >= 0.65 && mix < 0.25 && !reducedMotion) {
      setHasInteracted(true);
      const proxy = { v: mix };
      gsap.to(proxy, {
        v: 1,
        duration: 0.45,
        ease: "power2.out",
        onUpdate: () => {
          if (!lockedRef.current) {
            setMix(proxy.v);
            audioEngine.setMix(proxy.v);
            onMixChange(proxy.v);
          }
        },
        onComplete: commitLock,
      });
      return;
    }
    applyRatio(ratio);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || locked) return;
    applyRatio(ratioFromClientX(e.clientX));
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (locked) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      applyRatio(mix + 0.15);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      applyRatio(mix - 0.15);
    } else if (e.key === "End") {
      e.preventDefault();
      applyRatio(1);
    } else if (e.key === "Home") {
      e.preventDefault();
      applyRatio(0);
    }
  };

  const handleProceed = () => {
    if (reducedMotion || !sceneRef.current) {
      onAdvance();
      return;
    }
    gsap.to(sceneRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.42,
      ease: "power2.inOut",
      onComplete: onAdvance,
    });
  };

  const showCta = locked || idle10s;
  const pct = Math.round(mix * 100);

  return (
    <div
      ref={sceneRef}
      className="relative z-10 flex flex-col items-center justify-between w-full h-full px-5 pt-[68px] pb-7 sm:pt-20 sm:pb-10 text-center select-none jazz-safe-bottom"
    >
      <CrowdParallaxLayers mix={mix} />

      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 z-30 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 242, 198, 0.9) 0%, rgba(245, 185, 66, 0.35) 45%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Top Headline & Clear Step Badge */}
      <div className="max-w-lg mx-auto space-y-2 relative z-10">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] border transition-colors duration-300 ${
            locked
              ? "bg-[#1ed760]/18 border-[#1ed760]/50 text-[#1ed760]"
              : mix > 0.45
              ? "bg-[#f5d58a]/15 border-[#f5d58a]/45 text-[#f5d58a]"
              : "bg-slate-800/80 border-slate-400/40 text-slate-200"
          }`}
        >
          <span>
            {locked
              ? `Sax ${sax === "alto" ? "Alto (Eb)" : "Tenor (Bb)"} • Palco Completo ✓`
              : FUNNEL_CONFIG.copy.scene3.eyebrow}
          </span>
        </div>

        {locked ? (
          <SplitTextHeading
            text={FUNNEL_CONFIG.copy.scene3.lockedHeadline}
            as="h1"
            highlightWords={["soar"]}
            className="jazz-display text-white"
            reducedMotion={reducedMotion}
            delay={0.02}
          />
        ) : (
          <h1 className="jazz-display text-white">
            Sinta a diferença de tocar{" "}
            <span className={mix > 0.45 ? "jazz-gold-text italic" : "text-sky-200 italic"}>
              {mix > 0.45 ? "com banda real." : "sozinho."}
            </span>
          </h1>
        )}

        <p className="text-[15px] sm:text-base text-[#e0d7c6] max-w-md mx-auto leading-snug">
          {locked
            ? FUNNEL_CONFIG.copy.scene3.lockedSub
            : "Compare o estudo seco com o palco de estúdio em tempo real:"}
        </p>
      </div>

      {/* Middle Stage: Real-time Audio-Reactive Waveform */}
      <div className="w-full max-w-lg mx-auto my-auto relative z-10 space-y-2.5">
        <div
          className={`rounded-3xl p-4 sm:p-5 border transition-all duration-300 ${
            mix > 0.45
              ? "bg-[#120e09]/85 border-[#f5d58a]/40 shadow-[0_18px_48px_rgba(245,185,66,0.18)]"
              : "bg-[#0d1320]/85 border-slate-500/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider mb-2">
            <span className={mix < 0.5 ? "text-sky-300" : "text-white/45"}>
              {FUNNEL_CONFIG.copy.scene3.leftLabel}
            </span>
            <span className="tabular-nums text-[#f5d58a]">{pct}%</span>
            <span className={mix >= 0.5 ? "text-[#1ed760]" : "text-white/55"}>
              {FUNNEL_CONFIG.copy.scene3.rightLabel}
            </span>
          </div>

          <Waveform mix={mix} bpm={FUNNEL_CONFIG.audio.bpm} reducedMotion={reducedMotion} />
        </div>

        {/* Discreet audio reminder (calm, never intrusive) */}
        <p className="inline-flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-medium text-[#cdc3b2]/75">
          <Volume2 className="w-3.5 h-3.5 text-[#f5d58a]/80 shrink-0" />
          <span>
            {isMuted || audioUnavailable
              ? FUNNEL_CONFIG.copy.scene3.silentNotice
              : FUNNEL_CONFIG.copy.global.audioSubtleHint}
          </span>
        </p>
      </div>

      {/* Bottom Interactive Slider with Crystal-Clear Directional Guide + CTA */}
      <div className="w-full max-w-md mx-auto relative z-10 space-y-3">
        {!locked && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f5d58a]/15 border border-[#f5d58a]/45 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#f5d58a]">
            <span>{idle4s ? FUNNEL_CONFIG.copy.scene3.idleHint : FUNNEL_CONFIG.copy.scene3.sliderGuide}</span>
            <ChevronsRight className="w-4 h-4 shrink-0" />
          </div>
        )}

        {/* Accessible Custom Slider (Tap right side OR Drag handle!) */}
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Comparar som do sax sozinho versus com banda de estúdio"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-valuetext={pct >= 85 ? "Com banda de estúdio (100%)" : `${pct}% banda`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          className={`relative h-[64px] w-full rounded-full border p-1 cursor-grab active:cursor-grabbing touch-none transition-colors duration-300 ${
            locked
              ? "bg-[#1ed760]/18 border-[#1ed760]/65 shadow-[0_0_32px_rgba(30,215,96,0.3)]"
              : "bg-black/75 border-[#f5d58a]/55 shadow-[0_0_24px_rgba(245,185,66,0.18),inset_0_2px_12px_rgba(0,0,0,0.85)]"
          }`}
        >
          <div
            className="absolute left-1 top-1 bottom-1 rounded-full pointer-events-none transition-[width] duration-75"
            style={{
              width: `calc(${mix * 100}% - ${mix * 60 - 58}px)`,
              minWidth: "56px",
              maxWidth: "calc(100% - 8px)",
              background: locked
                ? "linear-gradient(90deg, #b8892e 0%, #f5d58a 50%, #1ed760 100%)"
                : "linear-gradient(90deg, rgba(138,106,47,0.6) 0%, rgba(245,213,138,0.85) 100%)",
            }}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-16">
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.12em] text-white truncate">
              {locked
                ? "Banda Ativada ✓"
                : mix < 0.25
                ? FUNNEL_CONFIG.copy.scene3.sliderPrompt
                : "Continue arrastando →"}
            </span>
          </div>

          <div
            className="pointer-events-none absolute top-1 w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-[0_6px_22px_rgba(245,185,66,0.65)] border-2 border-[#fff3cc]"
            style={{
              left: `calc(${mix} * (100% - 64px) + 4px)`,
              background: locked
                ? "linear-gradient(145deg, #43f07d 0%, #16b54e 100%)"
                : "linear-gradient(145deg, #fff1c2 0%, #f5b942 52%, #9a6d1a 100%)",
            }}
          >
            {locked ? (
              <Sparkles className="w-6 h-6 text-[#031a0b]" />
            ) : (
              <ArrowRight className="w-6 h-6 text-[#1a1003]" />
            )}
          </div>
        </div>

        {/* CTA Button (appears immediately on > 85% lock OR automatically after 10s fallback) */}
        <div className="min-h-[56px] flex items-center justify-center">
          {showCta ? (
            <button
              type="button"
              onClick={handleProceed}
              className="jazz-cta-primary w-full py-4 px-6 rounded-2xl text-base uppercase tracking-wider inline-flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>{FUNNEL_CONFIG.copy.scene3.ctaLabel}</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
          ) : (
            <p className="text-xs font-medium text-[#cdc3b2]/75">
              Ou toque diretamente no lado direito da barra
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
