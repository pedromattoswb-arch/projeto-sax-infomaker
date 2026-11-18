import { FUNNEL_CONFIG } from "../funnel.config";

interface StageBackgroundProps {
  /** 0 = frio/quarto escuro, 1 = palco dourado aceso */
  warmth: number;
  /** 0.15 = palco apagado (Cena 1), 1 = pleno brilho */
  intensity: number;
  /** Pulso no BPM (0..1) */
  beatPulse?: number;
  animateSmoke: boolean;
  reducedMotion: boolean;
  /** Em Cena 5 (oferta) reduz a opacidade para não competir com leitura */
  subtle?: boolean;
}

export const StageBackground = ({
  warmth,
  intensity,
  beatPulse = 0,
  animateSmoke,
  reducedMotion,
  subtle = false,
}: StageBackgroundProps) => {
  const w = Math.max(0, Math.min(1, warmth));
  const inten = Math.max(0.12, Math.min(1.25, intensity));
  const coldOpacity = Math.max(0, (1 - w) * (subtle ? 0.18 : 0.65));
  const warmOpacity = w * inten * (subtle ? 0.22 : 0.85) + beatPulse * 0.14;
  const smokeOpacity = subtle ? 0.14 : 0.22 + inten * 0.16;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base deep obsidian jazz club */}
      <div className="absolute inset-0 bg-[#07070a]" />

      {/* Cold blue room wash (visible on Scene 3 "Sozinho" side) */}
      <div
        className="absolute inset-0 transition-opacity duration-150"
        style={{
          opacity: coldOpacity,
          background:
            "radial-gradient(ellipse 80% 65% at 50% 35%, rgba(56, 102, 166, 0.32) 0%, rgba(17, 27, 46, 0.45) 48%, rgba(7, 7, 10, 0.95) 85%)",
        }}
      />

      {/* Overhead volumetric stage beam (conic light shaft) */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-[135vw] max-w-[960px] h-[76vh] transition-opacity duration-200"
        style={{
          opacity: Math.min(1, 0.18 + inten * 0.62 + beatPulse * 0.12),
          background:
            w > 0.35
              ? "conic-gradient(from 180deg at 50% 0%, transparent 142deg, rgba(245, 213, 138, 0.22) 168deg, rgba(255, 240, 196, 0.34) 180deg, rgba(245, 185, 66, 0.2) 192deg, transparent 218deg)"
              : "conic-gradient(from 180deg at 50% 0%, transparent 152deg, rgba(168, 198, 238, 0.14) 174deg, rgba(214, 230, 250, 0.2) 180deg, rgba(168, 198, 238, 0.14) 186deg, transparent 208deg)",
          filter: "blur(24px)",
        }}
      />

      {/* Warm golden stage bloom */}
      <div
        className="absolute inset-0 transition-opacity duration-150"
        style={{
          opacity: Math.min(1, warmOpacity),
          background:
            "radial-gradient(ellipse 75% 58% at 50% 42%, rgba(245, 185, 66, 0.26) 0%, rgba(184, 137, 46, 0.12) 44%, transparent 74%)",
        }}
      />

      {/* Atmospheric smoke WebP texture layers (graceful static fallback on low-tier/reduced-motion) */}
      <img
        src={FUNNEL_CONFIG.assets.smokeTexture}
        alt=""
        width={1024}
        height={576}
        loading="eager"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover mix-blend-screen ${
          animateSmoke && !reducedMotion ? "jazz-smoke-a" : ""
        }`}
        style={{ opacity: smokeOpacity }}
      />
      {!subtle && animateSmoke && !reducedMotion && (
        <img
          src={FUNNEL_CONFIG.assets.smokeTexture}
          alt=""
          width={1024}
          height={576}
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen jazz-smoke-b scale-x-[-1]"
          style={{ opacity: smokeOpacity * 0.55 }}
        />
      )}

      {/* Subtle floor vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, transparent 45%, rgba(4, 4, 7, 0.84) 100%)",
        }}
      />
    </div>
  );
};
