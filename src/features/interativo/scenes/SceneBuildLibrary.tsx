import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { CheckCircle2, Disc3, Mail, Sparkles } from "lucide-react";
import {
  FUNNEL_CONFIG,
  type MusicalStyleChoice,
  type SaxChoice,
} from "../funnel.config";
import { audioEngine } from "../audio/AudioEngine";

interface SceneBuildLibraryProps {
  sax: SaxChoice;
  selectedStyle: MusicalStyleChoice | null;
  reducedMotion: boolean;
  onComplete: () => void;
}

export const SceneBuildLibrary = ({
  sax,
  selectedStyle,
  reducedMotion,
  onComplete,
}: SceneBuildLibraryProps) => {
  const [partiturasCount, setPartiturasCount] = useState(reducedMotion ? FUNNEL_CONFIG.metrics.totalPartituras : 0);
  const [materialValue, setMaterialValue] = useState(
    reducedMotion ? FUNNEL_CONFIG.metrics.premiumOriginalPrice + FUNNEL_CONFIG.metrics.bonusTotalValue : 0
  );
  const [showCredential, setShowCredential] = useState(reducedMotion);

  const sceneRef = useRef<HTMLDivElement | null>(null);
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const credentialRef = useRef<HTMLDivElement | null>(null);

  const songs = useMemo(() => {
    const base = [...FUNNEL_CONFIG.scene4ShowcaseSongs];
    if (selectedStyle) {
      base.sort((a, b) => (a.styleKey === selectedStyle ? -1 : b.styleKey === selectedStyle ? 1 : 0));
    }
    return base.slice(0, 9);
  }, [selectedStyle]);

  useEffect(() => {
    // Duck band smoothly in background during Scene 4
    audioEngine.setDucking(0.28, 0.45);

    const totalMaterial =
      FUNNEL_CONFIG.metrics.premiumOriginalPrice + FUNNEL_CONFIG.metrics.bonusTotalValue; // 197 + 141 = 338 (real values from /lp-3)

    if (reducedMotion) {
      setPartiturasCount(FUNNEL_CONFIG.metrics.totalPartituras);
      setMaterialValue(totalMaterial);
      setShowCredential(true);
      const t = window.setTimeout(onComplete, 1800);
      return () => window.clearTimeout(t);
    }

    const cards = shelfRef.current?.querySelectorAll<HTMLElement>(".jazz-cascade-card");
    const counterObj = { songs: 0, value: 0 };

    const tl = gsap.timeline({
      onComplete,
    });

    // 1. Staggered 3D cascade of real song cards onto angled shelf (0s -> 1.8s)
    if (cards && cards.length > 0) {
      gsap.set(cards, { opacity: 0, y: -48, rotateX: 28, scale: 0.86 });
      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.085,
          ease: "expo.out",
        },
        0.08
      );
    }

    // 2. Animated real counters (0.15s -> 2.1s)
    tl.to(
      counterObj,
      {
        songs: FUNNEL_CONFIG.metrics.totalPartituras,
        value: totalMaterial,
        duration: 1.9,
        ease: "power3.out",
        onUpdate: () => {
          setPartiturasCount(Math.round(counterObj.songs));
          setMaterialValue(Math.round(counterObj.value));
        },
      },
      0.15
    );

    // 3. Reveal 3D Glassmorphism Credential Card (~2.25s)
    tl.call(() => setShowCredential(true), [], 2.15);

    // 4. Mask Reveal Exit: expand credential smoothly into Offer Hero (~3.55s -> 4.2s)
    tl.to(
      sceneRef.current,
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1.06,
        opacity: 0,
        duration: 0.62,
        ease: "power2.inOut",
      },
      3.55
    );

    return () => {
      tl.kill();
    };
  }, [onComplete, reducedMotion]);

  useEffect(() => {
    if (!showCredential || reducedMotion || !credentialRef.current) return;
    const tween = gsap.fromTo(
      credentialRef.current,
      { opacity: 0, scale: 0.88, y: 18 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "expo.out" }
    );
    return () => {
      tween.kill();
    };
  }, [showCredential, reducedMotion]);

  const saxLabel = sax === "alto" ? "Alto (Eb)" : "Tenor (Bb)";

  return (
    <div
      ref={sceneRef}
      className="relative z-10 flex flex-col items-center justify-between w-full h-full px-4 pt-16 pb-8 sm:pt-20 sm:pb-10 text-center select-none"
    >
      {/* Top Status */}
      <div className="max-w-lg mx-auto space-y-1.5">
        <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.24em] text-[#f5d58a]">
          {FUNNEL_CONFIG.copy.scene4.eyebrow}
        </p>
        <h1 className="jazz-h2 text-white">
          {FUNNEL_CONFIG.copy.scene4.headlineTemplate(sax)}
        </h1>
      </div>

      {/* Center 3D Tilted Song Shelf Cascade */}
      <div className="relative w-full max-w-xl mx-auto my-auto py-2" style={{ perspective: "1000px" }}>
        <div
          ref={shelfRef}
          className="grid grid-cols-3 gap-2.5 sm:gap-3.5"
          style={{
            transform: reducedMotion ? undefined : "rotateX(8deg) rotateY(-3deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {songs.map((song) => (
            <div
              key={song.title}
              className="jazz-cascade-card rounded-2xl p-2.5 sm:p-3 text-left border border-[#f5d58a]/25 shadow-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${song.accentFrom}cc 0%, ${song.accentTo}f0 100%)`,
              }}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black/45 text-[#f5d58a]">
                  {sax === "alto" ? song.keyAlto : song.keyTenor}
                </span>
                <Disc3 className="w-3.5 h-3.5 text-white/75 shrink-0" />
              </div>
              <p className="text-xs sm:text-sm font-black text-white truncate leading-tight">
                {song.title}
              </p>
              <p className="text-[10px] sm:text-xs text-white/75 truncate">{song.artist}</p>
            </div>
          ))}
        </div>

        {/* Glassmorphism 3D Credential Overlay (Appears at ~2.15s) */}
        {showCredential && (
          <div
            ref={credentialRef}
            className="absolute inset-x-1 sm:inset-x-6 top-1/2 -translate-y-1/2 z-20 jazz-glass rounded-3xl p-5 sm:p-6 border border-[#f5d58a]/65 shadow-[0_28px_70px_rgba(0,0,0,0.92),0_0_40px_rgba(245,213,138,0.28)] overflow-hidden"
          >
            {/* Sweeping metallic reflection */}
            {!reducedMotion && (
              <div
                className="jazz-sax-sheen-bar pointer-events-none absolute -inset-y-10 w-1/3 left-0 opacity-45"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,244,205,0.5), transparent)",
                }}
                aria-hidden="true"
              />
            )}

            <div className="relative z-10 flex flex-col items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1ed760]/18 border border-[#1ed760]/45 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#1ed760]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Credencial VIP Pronta
              </span>

              <h2 className="text-xl sm:text-2xl font-black font-heading jazz-gold-text leading-tight">
                {FUNNEL_CONFIG.copy.scene4.badgeReadyTemplate(sax)}
              </h2>

              <p className="text-xs sm:text-sm text-[#e8dfd0] font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#f5d58a] shrink-0" />
                <span>{FUNNEL_CONFIG.copy.scene4.subCredential}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Real Animated Counters (strictly from /lp-3 numbers) */}
      <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-3">
        <div className="jazz-glass rounded-2xl p-3 text-center">
          <span className="block text-xl sm:text-2xl font-black font-heading jazz-gold-text tabular-nums">
            +{partiturasCount.toLocaleString("pt-BR")}
          </span>
          <span className="block text-[11px] sm:text-xs font-bold text-[#cdc3b2] leading-tight mt-0.5">
            partituras + playbacks p/ Sax {saxLabel}
          </span>
        </div>

        <div className="jazz-glass rounded-2xl p-3 text-center">
          <span className="inline-flex items-center gap-1 text-xl sm:text-2xl font-black font-heading text-[#1ed760] tabular-nums">
            <Sparkles className="w-4 h-4 shrink-0" />
            R$ {materialValue}
          </span>
          <span className="block text-[11px] sm:text-xs font-bold text-[#cdc3b2] leading-tight mt-0.5">
            em material + 3 bônus VIP
          </span>
        </div>
      </div>
    </div>
  );
};
