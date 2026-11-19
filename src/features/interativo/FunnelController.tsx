import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, SlidersHorizontal, Volume1, Volume2, VolumeX } from "lucide-react";
import {
  FUNNEL_CONFIG,
  type MusicalStyleChoice,
  type SaxChoice,
} from "./funnel.config";
import {
  audioEngine,
  type ActivationResult,
  type AudioEngineSnapshot,
} from "./audio/AudioEngine";
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
  intro: 18,
  "choose-sax": 45,
  "style-step": 60,
  "before-after": 75,
  "build-library": 92,
  offer: 100,
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

  const [audioSnap, setAudioSnap] = useState<AudioEngineSnapshot>(() =>
    audioEngine.getSnapshot()
  );
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);

  const particleRef = useRef<ParticleFieldHandle | null>(null);
  const volumeBoxRef = useRef<HTMLDivElement | null>(null);
  const sceneEnteredAtRef = useRef<number>(Date.now());
  const sceneRef = useRef<FunnelScene>(scene);
  sceneRef.current = scene;

  // Inicializa UTMs e prepara o Motor Central de Áudio (SEM autoplay antes da interação!)
  useEffect(() => {
    captureEntryQueryParams();
    audioEngine.initialize();

    const unsub = audioEngine.subscribe(() => {
      setAudioSnap(audioEngine.getSnapshot());
    });

    const idleTimer = window.setTimeout(() => {
      const img = new Image();
      img.src = FUNNEL_CONFIG.assets.saxTenorImage;
    }, 500);

    return () => {
      window.clearTimeout(idleTimer);
      unsub();
      recordSceneDwellTime(sceneRef.current, Date.now() - sceneEnteredAtRef.current);
      audioEngine.stopAllForExternalPlayer("unmount");
    };
  }, []);

  // Sincroniza máquina de estados do AudioEngine com a cena ativa
  useEffect(() => {
    audioEngine.setScene(scene);
  }, [scene]);

  // Fecha popover de volume ao tocar fora
  useEffect(() => {
    if (!volumeOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (volumeBoxRef.current && !volumeBoxRef.current.contains(e.target as Node)) {
        setVolumeOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [volumeOpen]);

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

  // Ativação real e auditável dentro do `onClick` da Cena 1 (FASE 4)
  const handleActivateAudio = useCallback((): Promise<ActivationResult> => {
    return audioEngine.activateFromUserGesture();
  }, []);

  const handleContinueWithoutSound = useCallback(() => {
    audioEngine.continueWithoutSound();
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
  const isMuted = audioSnap.muted;
  const volumePct = Math.round(audioSnap.volume * 100);

  const audioPillLabel = isMuted
    ? FUNNEL_CONFIG.copy.global.soundOffLabel
    : audioSnap.needsUserRecovery
    ? FUNNEL_CONFIG.copy.global.soundInterruptedLabel
    : audioSnap.activated
    ? FUNNEL_CONFIG.copy.global.soundOnLabel
    : FUNNEL_CONFIG.copy.global.soundLockedLabel;

  return (
    <div
      className="theme-jazz-club is-stage-locked"
      data-tier={device.tier}
      data-backdrop={device.allowBackdropFilter ? "on" : "off"}
      data-audio-state={audioSnap.state}
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

      {/* GLOBAL TOP HUD FOR SCENES 1–4: Progress Bar + Status/Mute + Volume Control (No "Ir para a oferta") */}
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
          {/* Audio Status + Mute Toggle + Expandable Volume Slider */}
          <div ref={volumeBoxRef} className="pointer-events-auto relative flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (audioSnap.needsUserRecovery) {
                  void audioEngine.recoverFromUserGesture();
                } else {
                  audioEngine.toggleMute();
                }
              }}
              aria-label={isMuted ? "Ativar som da experiência" : "Silenciar som da experiência"}
              aria-pressed={!isMuted}
              className="min-h-[34px] px-3 rounded-full bg-black/55 hover:bg-black/75 border border-white/15 text-[11px] font-semibold text-[#ded4c4] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-white/55 shrink-0" />
              ) : audioSnap.needsUserRecovery ? (
                <RefreshCw className="w-3.5 h-3.5 text-[#f5d58a] shrink-0" />
              ) : audioSnap.volume < 0.45 ? (
                <Volume1 className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#1ed760] shrink-0" />
              )}
              <span>{audioPillLabel}</span>
            </button>

            {scene !== "intro" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setVolumeOpen((prev) => !prev);
                }}
                aria-label="Ajustar volume do áudio"
                aria-expanded={volumeOpen}
                className="min-h-[34px] min-w-[34px] rounded-full bg-black/55 hover:bg-black/75 border border-white/15 text-[#ded4c4] inline-flex items-center justify-center cursor-pointer transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            )}

            {volumeOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute left-0 top-[calc(100%+6px)] z-50 rounded-2xl bg-[#120f0b]/95 border border-[#f5d58a]/35 px-3.5 py-2.5 shadow-2xl flex items-center gap-2.5 min-w-[190px]"
              >
                <span className="text-[11px] font-bold text-[#e0d7c6] shrink-0">Volume</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : audioSnap.volume}
                  onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                  aria-label="Controle de volume da experiência"
                  className="flex-1 h-1.5 accent-[#f5d58a] cursor-pointer"
                />
                <span className="text-[11px] font-bold tabular-nums text-[#f5d58a] w-8 text-right">
                  {isMuted ? "0%" : `${volumePct}%`}
                </span>
              </div>
            )}
          </div>

          {scene !== "intro" && (
            <span className="hidden sm:inline text-[11px] font-medium text-[#cdc3b2]/70 pr-1 text-right">
              {FUNNEL_CONFIG.copy.global.audioSubtleHint}
            </span>
          )}
        </div>
      </div>

      {/* FASE 6 — BANNER DE RECUPERAÇÃO QUANDO O NAVEGADOR MOBILE INTERROMPE O ÁUDIO */}
      {audioSnap.needsUserRecovery && scene !== "intro" && (
        <div
          role="alertdialog"
          aria-label="Reativação de áudio"
          className="fixed inset-x-4 bottom-5 z-50 max-w-md mx-auto rounded-2xl bg-[#14100a]/95 border border-[#f5d58a]/60 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.92)] flex flex-col gap-3 text-center jazz-safe-bottom"
        >
          <p className="text-sm font-semibold text-white leading-snug">
            {FUNNEL_CONFIG.copy.global.recoveryMessage}
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => void audioEngine.recoverFromUserGesture()}
              className="jazz-cta-gold flex-1 min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>{FUNNEL_CONFIG.copy.global.recoveryCta}</span>
            </button>
            <button
              type="button"
              onClick={() => audioEngine.continueWithoutSound()}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-white/15 text-xs font-semibold text-[#cdc3b2] hover:text-white cursor-pointer"
            >
              {FUNNEL_CONFIG.copy.global.continueMutedCta}
            </button>
          </div>
        </div>
      )}

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
          onActivateAudio={handleActivateAudio}
          onContinueWithoutSound={handleContinueWithoutSound}
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
          audioState={audioSnap.state}
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
