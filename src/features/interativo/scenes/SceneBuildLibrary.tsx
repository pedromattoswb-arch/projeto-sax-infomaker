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
  const [partiturasCount, setPartiturasCount] = useState(
    reducedMotion ? FUNNEL_CONFIG.metrics.totalPartituras : 0
  );
  const [materialValue, setMaterialValue] = useState(
    reducedMotion
      ? FUNNEL_CONFIG.metrics.premiumOriginalPrice + FUNNEL_CONFIG.metrics.bonusTotalValue
      : 0
  );
  const [showCredential, setShowCredential] = useState(reducedMotion);

  const sceneRef = useRef<HTMLDivElement | null>(null);
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const credentialRef = useRef<HTMLDivElement | null>(null);

  const songs = useMemo(() => {
    const base = [...FUNNEL_CONFIG.scene4ShowcaseSongs];
    if (selectedStyle) {
      base.sort((a, b) =>
        a.styleKey === selectedStyle ? -1 : b.styleKey === selectedStyle ? 1 : 0
      );
    }
    return base.slice(0, 9);
  }, [selectedStyle]);

  useEffect(() => {
    audioEngine.setDucking(0.28, 0.45);

    const totalMaterial =
      FUNNEL_CONFIG.metrics.premiumOriginalPrice + FUNNEL_CONFIG.metrics.bonusTotalValue;

    if (reducedMotion) {
      setPartiturasCount(FUNNEL_CONFIG.metrics.totalPartituras);
      setMaterialValue(totalMaterial);
      setShowCredential(true);
      const t = window.setTimeout(onComplete, 1600);
      return () => window.clearTimeout(t);
    }

    const cards = shelfRef.current?.querySelectorAll<HTMLElement>(".jazz-cascade-card");
    const counterObj = { songs: 0, value: 0 };

    const tl = gsap.timeline({
      onComplete,
    });

    if (cards && cards.length > 0) {
      gsap.set(cards, { opacity: 0, y: -44, rotateX: 26, scale: 0.86 });
      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.52,
          stagger: 0.08,
          ease: "expo.out",
        },
        0.08
      );
    }

    tl.to(
      counterObj,
      {
        songs: FUNNEL_CONFIG.metrics.totalPartituras,
        value: totalMaterial,
        duration: 1.85,
        ease: "power3.out",
        onUpdate: () => {
          setPartiturasCount(Math.round(counterObj.songs));
          setMaterialValue(Math.round(counterObj.value));
        },
      },
      0.15
    );

    tl.call(() => setShowCredential(true), [], 2.1);

    tl.to(
      sceneRef.current,
      {
        scale: 1.06,
        opacity: 0,
        duration: 0.58,
        ease: "power2.inOut",
      },
      3.5
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
      { opacity: 1, scale: 1, y: 0, duration: 0.58, ease: "expo.out" }
    );
    return () => {
      tween.kill();
    };
  }, [showCredential, reducedMotion]);

  const saxLabel = sax === "alto" ? "Alto (Eb)" : "Tenor (Bb)";

  return (
    <div
      ref={sceneRef}
      className="relative z-10 flex flex-col items-center justify-between w-full h-full px-4 pt-[68px] pb-7 sm:pt-20 sm:pb-10 text-center select-none jazz-safe-bottom"
    >
      <div className="max-w-lg mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1ed760]/15 border border-[#1ed760]/40 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#1ed760]">
          {showCredential ? "ACERVO PRONTO • ABRINDO OFERTA" : FUNNEL_CONFIG.copy.scene4.eyebrow}
        </span>
        <h1 className="jazz-h2 text-white">
          {FUNNEL_CONFIG.copy.scene4.headlineTemplate(sax)}
        </h1>
      </div>

      {/* 3D Song Shelf Cascade + Glassmorphism VIP Credential */}
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

        {showCredential && (
          <div
            ref={credentialRef}
            className="absolute inset-x-1 sm:inset-x-6 top-1/2 -translate-y-1/2 z-20 jazz-glass rounded-3xl p-5 sm:p-6 border border-[#f5d58a]/70 shadow-[0_28px_70px_rgba(0,0,0,0.92),0_0_40px_rgba(245,213,138,0.28)] overflow-hidden"
          >
            {!reducedMotion && (
              <div
                className="jazz-sax-sheen-bar pointer-events-none absolute -inset-y-10 w-1/3 left-0 opacity-45"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,244,205,0.5), transparent)",
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

      {/* Real Animated Counters */}
      <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-3">
        <div className="jazz-glass rounded-2xl p-3 text-center">
          <span className="block text-xl sm:text-2xl font-black font-heading jazz-gold-text tabular-nums">
            +{partiturasCount.toLocaleString("pt-BR")}
          </span>
          <span className="block text-[11px] sm:text-xs font-bold text-[#e0d7c6] leading-tight mt-0.5">
            partituras + playbacks p/ Sax {saxLabel}
          </span>
        </div>

        <div className="jazz-glass rounded-2xl p-3 text-center">
          <span className="inline-flex items-center gap-1 text-xl sm:text-2xl font-black font-heading text-[#1ed760] tabular-nums">
            <Sparkles className="w-4 h-4 shrink-0" />
            R$ {materialValue}
          </span>
          <span className="block text-[11px] sm:text-xs font-bold text-[#e0d7c6] leading-tight mt-0.5">
            em material + 3 bônus VIP
          </span>
        </div>
      </div>
    </div>
  );
};
