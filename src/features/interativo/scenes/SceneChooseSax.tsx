import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { FUNNEL_CONFIG, type SaxChoice } from "../funnel.config";
import { audioEngine } from "../audio/AudioEngine";
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

  useEffect(() => {
    onSpotlightMove(50, 0.78);
    if (reducedMotion || !containerRef.current) return;
    const tween = gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.52, ease: "expo.out" }
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
    setTilt({ rx: -ny * 8, ry: nx * 11 });
  };

  const handlePick = (sax: SaxChoice) => {
    if (chosen) return;
    setChosen(sax);

    // Toca timbre real pré-renderizado (Alto Eb ou Tenor Bb) e pré-carrega Cena 3 em segundo plano
    void audioEngine.playSaxChoiceCue(sax);

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
      window.setTimeout(() => onSelect(sax), 900);
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
          scale: 0.84,
          filter: "blur(10px)",
          duration: 0.42,
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
          scale: 1.1,
          rotateY: sax === "alto" ? 10 : -10,
          duration: 0.62,
          ease: "expo.out",
        },
        0.04
      );
    }

    tl.call(() => onSpotlightMove(50, 0.95), [], 0.26);

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
      className="relative z-10 flex flex-col items-center justify-between w-full h-full px-4 pt-[68px] pb-7 sm:pt-20 sm:pb-10 text-center select-none jazz-safe-bottom"
      style={{ perspective: "1000px" }}
    >
      {/* Top Guided Header */}
      <div className="max-w-lg mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5d58a]/12 border border-[#f5d58a]/35 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f5d58a]">
          {FUNNEL_CONFIG.copy.scene2.eyebrow}
        </span>

        <SplitTextHeading
          text={FUNNEL_CONFIG.copy.scene2.headline}
          as="h1"
          highlightWords={["sax"]}
          className="jazz-display text-white"
          reducedMotion={reducedMotion}
          delay={0.04}
        />

        <p className="text-[15px] sm:text-base text-[#e0d7c6] max-w-sm mx-auto leading-snug">
          {FUNNEL_CONFIG.copy.scene2.subtitle}
        </p>
      </div>

      {/* Two Clear Interactive Instrument Cards Side-by-Side */}
      <div
        className="grid grid-cols-2 gap-3 sm:gap-7 w-full max-w-xl mx-auto my-auto items-stretch"
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
          className={`group relative flex flex-col items-center justify-between rounded-3xl py-4 px-2.5 sm:p-6 bg-white/[0.04] hover:bg-white/[0.08] border transition-all cursor-pointer active:scale-95 ${
            idle4s ? "border-[#f5d58a]/80 shadow-[0_0_28px_rgba(245,213,138,0.22)]" : "border-[#f5d58a]/35 hover:border-[#f5d58a]"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-x-4 top-6 bottom-14 rounded-full opacity-60 group-hover:opacity-95 transition-opacity"
            style={{
              background: "radial-gradient(circle, rgba(245, 213, 138, 0.26) 0%, transparent 70%)",
              filter: "blur(18px)",
            }}
            aria-hidden="true"
          />

          <SaxVisual
            variant="alto"
            className="h-[175px] min-[390px]:h-[210px] sm:h-[260px] w-auto relative z-10"
            glowIntensity={chosen === "alto" ? 1.15 : 0.7}
            floatEnabled={!chosen}
            sheenEnabled
            reducedMotion={reducedMotion}
            priority
          />

          <div className="relative z-10 mt-2.5 w-full text-center space-y-2">
            <div>
              <span className="block font-heading font-black text-xl sm:text-2xl tracking-wider jazz-gold-text leading-none">
                {FUNNEL_CONFIG.copy.scene2.altoLabel}
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-[#e0d7c6] mt-1">
                {FUNNEL_CONFIG.copy.scene2.altoSub}
              </span>
            </div>

            <span className="w-full inline-flex items-center justify-center gap-1 rounded-xl bg-[#f5d58a]/15 group-hover:bg-[#f5d58a] text-[#f5d58a] group-hover:text-[#181003] border border-[#f5d58a]/45 py-2 px-2.5 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-colors">
              <span>{FUNNEL_CONFIG.copy.scene2.altoAction}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
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
          className={`group relative flex flex-col items-center justify-between rounded-3xl py-4 px-2.5 sm:p-6 bg-white/[0.04] hover:bg-white/[0.08] border transition-all cursor-pointer active:scale-95 ${
            idle4s ? "border-[#f5d58a]/80 shadow-[0_0_28px_rgba(245,213,138,0.22)]" : "border-[#f5d58a]/35 hover:border-[#f5d58a]"
          }`}
        >
          <div
            className="pointer-events-none absolute inset-x-4 top-6 bottom-14 rounded-full opacity-60 group-hover:opacity-95 transition-opacity"
            style={{
              background: "radial-gradient(circle, rgba(245, 213, 138, 0.26) 0%, transparent 70%)",
              filter: "blur(18px)",
            }}
            aria-hidden="true"
          />

          <SaxVisual
            variant="tenor"
            className="h-[175px] min-[390px]:h-[210px] sm:h-[260px] w-auto relative z-10"
            glowIntensity={chosen === "tenor" ? 1.15 : 0.7}
            floatEnabled={!chosen}
            sheenEnabled
            reducedMotion={reducedMotion}
            priority
          />

          <div className="relative z-10 mt-2.5 w-full text-center space-y-2">
            <div>
              <span className="block font-heading font-black text-xl sm:text-2xl tracking-wider jazz-gold-text leading-none">
                {FUNNEL_CONFIG.copy.scene2.tenorLabel}
              </span>
              <span className="block text-xs sm:text-sm font-semibold text-[#e0d7c6] mt-1">
                {FUNNEL_CONFIG.copy.scene2.tenorSub}
              </span>
            </div>

            <span className="w-full inline-flex items-center justify-center gap-1 rounded-xl bg-[#f5d58a]/15 group-hover:bg-[#f5d58a] text-[#f5d58a] group-hover:text-[#181003] border border-[#f5d58a]/45 py-2 px-2.5 text-[11px] sm:text-xs font-black uppercase tracking-wider transition-colors">
              <span>{FUNNEL_CONFIG.copy.scene2.tenorAction}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </span>
          </div>
        </button>
      </div>

      {/* Bottom Calibrating Text OR Idle Hint */}
      <div className="min-h-[60px] flex flex-col items-center justify-center">
        {chosen ? (
          <SplitTextHeading
            text={FUNNEL_CONFIG.copy.scene2.adjustingTemplate(chosen)}
            as="p"
            mode="chars"
            className="text-sm sm:text-base font-bold text-[#f5d58a] tracking-wide"
            reducedMotion={reducedMotion}
            delay={0.04}
          />
        ) : (
          <p
            className={`text-xs sm:text-sm font-semibold transition-all duration-300 ${
              idle4s
                ? "text-[#140d02] bg-[#f5d58a] rounded-full px-4 py-1.5 font-extrabold shadow-lg"
                : "text-[#cdc3b2]/85"
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
