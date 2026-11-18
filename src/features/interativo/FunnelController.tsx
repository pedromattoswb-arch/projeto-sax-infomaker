import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ArrowUpRight } from "lucide-react";
import {
  FUNNEL_CONFIG,
  type MusicalStyleChoice,
  type SaxChoice,
} from "./funnel.config";
import { audioEngine, type AudioStatus } from "./audio/AudioEngine";
import { StageBackground } from "./fx/StageBackground";
import { ParticleField, type ParticleFieldHandle } from "./fx/ParticleField";
import { Spotlight } from "./fx/Spotlight";
import { MusicStaff } from "./fx/MusicStaff";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useDeviceTier } from "./hooks/useDeviceTier";
import {
  captureEntryQueryParams,
  recordSceneDwellTime,
  trackBeforeAfterComplete,
  trackFunnelStart,
  trackLibraryBuilt,
  trackOfferViewContent,
  trackSaxSelected,
  trackSkipToOffer,
} from "./tracking/events";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneChooseSax } from "./scenes/SceneChooseSax";
import { SceneStyleStep } from "./scenes/SceneStyleStep";
import { SceneBeforeAfter } from "./scenes/SceneBeforeAfter";
import { SceneBuildLibrary } from "./scenes/SceneBuildLibrary";

const loadOfferSection = () => import("./scenes/OfferSection");
const OfferSection = lazy(loadOfferSection);

export type FunnelScene =
  | "intro"
  | "choose-sax"
  | "style-step"
  | "before-after"
  | "build-library"
  | "offer";

const SAX_STORAGE_KEY = "cs_interativo_sax";
const OFFER_SEEN_KEY = "cs_interativo_offer_seen";

function readSavedSax(): SaxChoice {
  try {
    const v = sessionStorage.getItem(SAX_STORAGE_KEY);
    if (v === "alto" || v === "tenor") return v;
  } catch {
    // noop
  }
  return "alto";
}

function readOfferAlreadySeen(): boolean {
  try {
    return sessionStorage.getItem(OFFER_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

const SCENE_PROGRESS: Record<FunnelScene, number> = {
  intro: 16,
  "choose-sax": 42,
  "style-step": 56,
  "before-after": 72,
  "build-library": 90,
  offer: 100,
};

const SCENE_NUMBER: Record<FunnelScene, number> = {
  intro: 1,
  "choose-sax": 2,
  "style-step": 2.5,
  "before-after": 3,
  "build-library": 4,
  offer: 5,
};

export const FunnelController = () => {
  const reducedMotion = useReducedMotion();
  const device = useDeviceTier(reducedMotion);

  const [scene, setScene] = useState<FunnelScene>(() =>
    readOfferAlreadySeen() ? "offer" : "intro"
  );
  const [sax, setSax] = useState<SaxChoice>(readSavedSax);
  const [selectedStyle, setSelectedStyle] = useState<MusicalStyleChoice | null>(null);

  const [stageWarmth, setStageWarmth] = useState<number>(0.75);
  const [stageIntensity, setStageIntensity] = useState<number>(0.3);
  const [beatPulse, setBeatPulse] = useState<number>(0);
  const [spotlightX, setSpotlightX] = useState<number>(50);
  const [spotlightIntensity, setSpotlightIntensity] = useState<number>(0.38);

  const [staffMode, setStaffMode] = useState<"hidden" | "draw" | "running">("hidden");
  const [comparisonMix, setComparisonMix] = useState<number>(0);

  const [isMuted, setIsMuted] = useState<boolean>(() => audioEngine.isMuted());
  const [audioStatus, setAudioStatus] = useState<AudioStatus>(() => audioEngine.getStatus());

  const particleRef = useRef<ParticleFieldHandle | null>(null);
  const sceneEnteredAtRef = useRef<number>(Date.now());
  const sceneRef = useRef<FunnelScene>(scene);
  sceneRef.current = scene;

  // Inicializa UTMs, garante áudio ligado por padrão e pré-carrega Sax Tenor em idle
  useEffect(() => {
    captureEntryQueryParams();
    audioEngine.setMuted(false);
    audioEngine.preload();

    const unsub = audioEngine.subscribe(() => {
      setIsMuted(audioEngine.isMuted());
      setAudioStatus(audioEngine.getStatus());
    });

    const idleTimer = window.setTimeout(() => {
      const img = new Image();
      img.src = FUNNEL_CONFIG.assets.saxTenorImage;
    }, 500);

    return () => {
      window.clearTimeout(idleTimer);
      unsub();
      recordSceneDwellTime(sceneRef.current, Date.now() - sceneEnteredAtRef.current);
      audioEngine.stopComparison();
    };
  }, []);

  // Histórico (botão Voltar retorna à cena anterior preservando UTMs)
  useEffect(() => {
    try {
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState({ interativoScene: sceneRef.current }, "", currentUrl);
    } catch {
      // noop
    }

    const onPopState = (ev: PopStateEvent) => {
      const target = ev.state?.interativoScene as FunnelScene | undefined;
      if (target) {
        recordSceneDwellTime(sceneRef.current, Date.now() - sceneEnteredAtRef.current);
        sceneEnteredAtRef.current = Date.now();
        if (target !== "before-after" && target !== "build-library") {
          audioEngine.stopComparison();
        }
        setStaffMode(target === "before-after" ? "running" : "hidden");
        setScene(target);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Pré-carrega o chunk da Oferta + imagens WebP de /lp-3 durante as Cenas 3 e 4 (transição 0ms!)
  useEffect(() => {
    if (scene === "before-after" || scene === "build-library") {
      void loadOfferSection();
      void import("@/components/funnel/v3/lp3MediaPreload").then((m) => m.preloadAllLp3Media());
    }
    if (scene === "offer") {
      trackOfferViewContent(sax);
      try {
        sessionStorage.setItem(OFFER_SEEN_KEY, "1");
      } catch {
        // noop
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [scene, sax]);

  const navigateToScene = useCallback((next: FunnelScene) => {
    recordSceneDwellTime(sceneRef.current, Date.now() - sceneEnteredAtRef.current);
    sceneEnteredAtRef.current = Date.now();
    try {
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      window.history.pushState({ interativoScene: next }, "", currentUrl);
    } catch {
      // noop
    }
    setScene(next);
  }, []);

  // Desbloqueio síncrono do áudio no EXATO instante do toque na Cena 1 (obrigatório p/ iOS & Instagram)
  const handleUnlockAudio = useCallback(() => {
    audioEngine.unlockAndPlayStinger();
  }, []);

  const handleScene1Start = useCallback(() => {
    trackFunnelStart();
    navigateToScene("choose-sax");
  }, [navigateToScene]);

  const handleStageFlash = useCallback((warmth: number, intensity: number) => {
    setStageWarmth(warmth);
    setStageIntensity(intensity);
  }, []);

  const handleSpotlightMove = useCallback((xPercent: number, intensity: number) => {
    setSpotlightX(xPercent);
    setSpotlightIntensity(intensity);
  }, []);

  const handleSaxSelect = useCallback(
    (choice: SaxChoice) => {
      setSax(choice);
      try {
        sessionStorage.setItem(SAX_STORAGE_KEY, choice);
      } catch {
        // noop
      }
      trackSaxSelected(choice);

      if (FUNNEL_CONFIG.flags.ENABLE_STYLE_STEP) {
        setStaffMode("hidden");
        navigateToScene("style-step");
      } else {
        setStaffMode("running");
        setComparisonMix(0);
        setStageWarmth(0);
        setStageIntensity(0.28);
        navigateToScene("before-after");
      }
    },
    [navigateToScene]
  );

  const handleStyleSelect = useCallback(
    (style: MusicalStyleChoice) => {
      setSelectedStyle(style);
      setStaffMode("running");
      setComparisonMix(0);
      setStageWarmth(0);
      setStageIntensity(0.28);
      navigateToScene("before-after");
    },
    [navigateToScene]
  );

  const handleMixChange = useCallback((mix: number) => {
    setComparisonMix(mix);
    setStageWarmth(mix);
    setStageIntensity(0.26 + mix * 0.86);
    setSpotlightIntensity(0.28 + mix * 0.68);
  }, []);

  const handleBeforeAfterLocked = useCallback(() => {
    trackBeforeAfterComplete(sax);
  }, [sax]);

  const handleAdvanceToBuild = useCallback(() => {
    setStaffMode("hidden");
    setStageWarmth(0.92);
    setStageIntensity(0.75);
    navigateToScene("build-library");
  }, [navigateToScene]);

  const handleBuildComplete = useCallback(() => {
    trackLibraryBuilt(sax);
    navigateToScene("offer");
  }, [navigateToScene, sax]);

  const handleSkipToOffer = useCallback(() => {
    trackSkipToOffer(SCENE_NUMBER[sceneRef.current]);
    audioEngine.stopComparison();
    setStaffMode("hidden");
    navigateToScene("offer");
  }, [navigateToScene]);

  const handleReplay = useCallback(() => {
    audioEngine.stopComparison();
    setStaffMode("hidden");
    setComparisonMix(0);
    setStageWarmth(0.75);
    setStageIntensity(0.3);
    try {
      sessionStorage.removeItem(OFFER_SEEN_KEY);
    } catch {
      // noop
    }
    navigateToScene("intro");
  }, [navigateToScene]);

  // CENA 5 (OFERTA): renderiza 100% no tema idêntico da /lp-3 (sem overlays competindo)
  if (scene === "offer") {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#070503] flex items-center justify-center text-[#ffe49e] text-sm font-bold tracking-wider uppercase">
            Abrindo seu acervo…
          </div>
        }
      >
        <OfferSection
          sax={sax}
          reducedMotion={reducedMotion}
          onReplayFunnel={handleReplay}
        />
      </Suspense>
    );
  }

  const progressPct = SCENE_PROGRESS[scene];

  return (
    <div
      className="theme-jazz-club is-stage-locked"
      data-tier={device.tier}
      data-backdrop={device.allowBackdropFilter ? "on" : "off"}
    >
      {/* Persistent Atmospheric Jazz Stage Background (Full-Screen 100dvh) */}
      <StageBackground
        warmth={stageWarmth}
        intensity={stageIntensity}
        beatPulse={beatPulse}
        animateSmoke={device.allowAnimatedSmoke}
        reducedMotion={reducedMotion}
      />

      {/* Cinematic Spotlight Tracking */}
      <Spotlight
        xPercent={spotlightX}
        intensity={spotlightIntensity}
        warmth={stageWarmth}
        reducedMotion={reducedMotion}
      />

      {/* Single Canvas 2D Musical Particle Field */}
      <ParticleField
        ref={particleRef}
        maxParticles={device.maxParticles}
        warmth={stageWarmth}
        activity={
          scene === "intro"
            ? 0.22
            : scene === "before-after"
            ? 0.25 + comparisonMix * 0.75
            : 0.7
        }
        enabled={!reducedMotion}
      />

      {/* GLOBAL TOP HUD FOR SCENES 1–4: Thin Gold Progress Bar + Discreet Audio Pill + "Ir para a oferta" */}
      <div className="fixed top-0 inset-x-0 z-40 pointer-events-none">
        <div className="w-full h-[3px] bg-white/[0.08]" aria-hidden="true">
          <div
            className="h-full transition-[width] duration-500 ease-out"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #8a6a2f 0%, #f5d58a 60%, #1ed760 100%)",
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 px-4 pt-2.5 jazz-safe-top">
          {/* Discreet, non-intrusive always-on audio pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              audioEngine.toggleMute();
            }}
            aria-label={isMuted ? "Ativar som da experiência" : "Silenciar som da experiência"}
            aria-pressed={!isMuted}
            className="pointer-events-auto min-h-[36px] px-3 rounded-full bg-black/45 hover:bg-black/70 border border-white/15 text-[11px] font-semibold text-[#cdc3b2] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white/55 shrink-0" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
            )}
            <span>
              {isMuted
                ? FUNNEL_CONFIG.copy.global.soundOffLabel
                : FUNNEL_CONFIG.copy.global.soundOnLabel}
            </span>
          </button>

          {/* Discreet "Ir para a oferta" link starting from Scene 2 */}
          {scene !== "intro" && (
            <button
              type="button"
              onClick={handleSkipToOffer}
              className="pointer-events-auto min-h-[36px] px-3 rounded-full bg-black/45 hover:bg-black/70 border border-white/15 text-[11px] sm:text-xs font-semibold text-[#cdc3b2] hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{FUNNEL_CONFIG.copy.global.skipToOffer}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#f5d58a]" />
            </button>
          )}
        </div>
      </div>

      {/* SEAMLESS SHARED SVG MUSIC STAFF (Bridges Scene 2 -> Scene 3 with ZERO cut!) */}
      {(scene === "choose-sax" || scene === "before-after") && staffMode !== "hidden" && (
        <div
          className={`pointer-events-none fixed inset-x-0 z-20 transition-all duration-700 ${
            scene === "choose-sax" ? "bottom-20 sm:bottom-24" : "top-[31%] sm:top-[30%]"
          }`}
        >
          <MusicStaff
            mode={staffMode}
            progress={comparisonMix}
            reducedMotion={reducedMotion}
          />
        </div>
      )}

      {/* ACTIVE FULL-SCREEN STAGE SCENE */}
      {scene === "intro" && (
        <SceneIntro
          reducedMotion={reducedMotion}
          onUnlockAudio={handleUnlockAudio}
          onStart={handleScene1Start}
          onBurstParticles={() => particleRef.current?.burst(0.5, 0.48, 54)}
          onStageFlash={handleStageFlash}
        />
      )}

      {scene === "choose-sax" && (
        <SceneChooseSax
          reducedMotion={reducedMotion}
          allowTilt={device.allowTilt}
          onSelect={handleSaxSelect}
          onSpotlightMove={handleSpotlightMove}
          onTriggerStaffDraw={() => setStaffMode("draw")}
          onBurstParticles={(x, y) => particleRef.current?.burst(x, y, 38)}
        />
      )}

      {scene === "style-step" && (
        <SceneStyleStep
          sax={sax}
          reducedMotion={reducedMotion}
          onSelectStyle={handleStyleSelect}
        />
      )}

      {scene === "before-after" && (
        <SceneBeforeAfter
          sax={sax}
          reducedMotion={reducedMotion}
          isMuted={isMuted}
          audioUnavailable={audioStatus === "unavailable"}
          onMixChange={handleMixChange}
          onBeatPulse={setBeatPulse}
          onLockedComplete={handleBeforeAfterLocked}
          onAdvance={handleAdvanceToBuild}
          onBurstParticles={() => particleRef.current?.burst(0.5, 0.52, 56)}
        />
      )}

      {scene === "build-library" && (
        <SceneBuildLibrary
          sax={sax}
          selectedStyle={selectedStyle}
          reducedMotion={reducedMotion}
          onComplete={handleBuildComplete}
        />
      )}
    </div>
  );
};
