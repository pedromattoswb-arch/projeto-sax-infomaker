import { FUNNEL_CONFIG, type SaxChoice } from "../funnel.config";
import { audioLogger, type AudioLogEntry } from "./AudioLogger";

export type AudioEngineState =
  | "locked"
  | "initializing"
  | "ready"
  | "playing"
  | "paused"
  | "loading"
  | "interrupted"
  | "error"
  | "recovering";

export type AudioTrackKey =
  | "stinger"
  | "sax-alto"
  | "sax-tenor"
  | "solo-dry"
  | "full-band"
  | "library-chime";

export interface AudioEngineSnapshot {
  state: AudioEngineState;
  activated: boolean;
  muted: boolean;
  volume: number;
  currentScene: string;
  activeTrackId: string | null;
  contextState: string;
  needsUserRecovery: boolean;
  lastError: string | null;
  recoveryAttempts: number;
}

export interface ActivationResult {
  ok: boolean;
  error?: string;
}

const AUDIO_PREF_STORAGE_KEY = "cs_interativo_audio_pref";
const MAX_AUTO_RECOVERY_ATTEMPTS = 1;

const TRACK_URLS: Record<AudioTrackKey, string> = {
  stinger: FUNNEL_CONFIG.audio.stingerUrl,
  "sax-alto": FUNNEL_CONFIG.audio.saxAltoCueUrl,
  "sax-tenor": FUNNEL_CONFIG.audio.saxTenorCueUrl,
  "solo-dry": FUNNEL_CONFIG.audio.soloDryUrl,
  "full-band": FUNNEL_CONFIG.audio.soloBandUrl,
  "library-chime": FUNNEL_CONFIG.audio.libraryReadyChimeUrl,
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function readStoredMutePreference(): boolean {
  try {
    return sessionStorage.getItem(AUDIO_PREF_STORAGE_KEY) === "muted";
  } catch {
    return false;
  }
}

function writeStoredPreference(pref: "enabled" | "muted"): void {
  try {
    sessionStorage.setItem(AUDIO_PREF_STORAGE_KEY, pref);
  } catch {
    // noop
  }
}

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext ||
    null
  );
}

/**
 * Motor Central de Áudio do Funil /interativo (Mobile-First • iOS Safari • Android Chrome • Desktop)
 *
 * Princípios arquiteturais:
 * - Fonte única de verdade para todo o áudio das etapas 1–4 e coordenação limpa com a etapa 5.
 * - Desbloqueio real e auditável dentro do evento `click` do usuário (NUNCA `touchstart` no iOS!).
 * - Reproduz arquivos reais pré-renderizados em `/interativo/audio/*.wav` (zero freeze na thread principal).
 * - Crossfade sincronizado sample-accurate (`cos` / `sin`) na Cena 3 via Web Audio `AudioBufferSourceNode`
 *   recriados a cada reprodução (nunca reutilizados).
 * - Respeita integralmente volume do aparelho, modo silencioso e escolha de silenciar do visitante.
 * - Máquina de estados explícita (9 estados) + `playbackToken` anti-race-condition + recuperação de
 *   interrupções (`visibilitychange`, `pageshow`, `pagehide`, `AudioContext.statechange === "interrupted"`).
 */
class InterativoAudioEngine {
  private state: AudioEngineState = "locked";
  private activated = false;
  private muted = false;
  private volume = FUNNEL_CONFIG.audio.defaultVolume;
  private duckLevel = 1;
  private currentScene = "intro";
  private activeTrackId: string | null = null;
  private needsUserRecovery = false;
  private lastError: string | null = null;
  private recoveryAttempts = 0;

  // Web Audio graph
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private bandGain: GainNode | null = null;
  private cueGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Active single-use Web Audio sources (recreated on every play)
  private drySource: AudioBufferSourceNode | null = null;
  private bandSource: AudioBufferSourceNode | null = null;
  private activeCueSource: AudioBufferSourceNode | null = null;

  // Dedicated managed HTMLAudioElement for real audible activation & cue fallback
  private cueEl: HTMLAudioElement | null = null;
  private cueElListenersAttached = false;

  // Caches (lazy loaded per scene, never all at once)
  private rawCache = new Map<AudioTrackKey, ArrayBuffer>();
  private inFlightFetch = new Map<AudioTrackKey, Promise<ArrayBuffer | null>>();
  private decodedCache = new Map<AudioTrackKey, AudioBuffer>();

  // Comparison playback tracking (enables seamless resume-from-offset after backgrounding!)
  private isComparisonPlaying = false;
  private comparisonShouldBeActive = false;
  private comparisonMix = 0;
  private comparisonStartedAtCtxTime = 0;
  private comparisonOffsetSec = 0;
  private comparisonDurationSec = 11.429;
  private wasPlayingBeforeHide = false;

  // Concurrency token: incremented on every scene change / play command to cancel stale async loads
  private playbackToken = 0;
  private lifecycleAttached = false;
  private listeners = new Set<() => void>();

  constructor() {
    this.muted = readStoredMutePreference();
    this.exposeDebugHandle();
  }

  private exposeDebugHandle(): void {
    if (typeof window === "undefined") return;
    (window as unknown as Record<string, unknown>).__CS_AUDIO_DEBUG__ = {
      getSnapshot: () => this.getSnapshot(),
      getLogs: (): AudioLogEntry[] => audioLogger.getEntries(),
      clearLogs: () => audioLogger.clear(),
    };
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // noop
      }
    });
  }

  private setState(next: AudioEngineState): void {
    if (this.state === next) return;
    this.state = next;
    this.emit();
  }

  public getSnapshot(): AudioEngineSnapshot {
    return {
      state: this.state,
      activated: this.activated,
      muted: this.muted,
      volume: this.volume,
      currentScene: this.currentScene,
      activeTrackId: this.activeTrackId,
      contextState: this.ctx ? (this.ctx.state as string) : "uninitialized",
      needsUserRecovery: this.needsUserRecovery,
      lastError: this.lastError,
      recoveryAttempts: this.recoveryAttempts,
    };
  }

  public getState(): AudioEngineState {
    return this.state;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public isActivated(): boolean {
    return this.activated;
  }

  /**
   * Inicializa listeners globais e pré-carrega APENAS o stinger da Cena 1 (48 KB).
   * Não tenta reproduzir nenhum áudio antes da interação válida do visitante.
   */
  public initialize(): void {
    if (typeof window === "undefined") return;
    audioLogger.log("Initializing audio engine.", {
      sceneId: this.currentScene,
      engineState: this.state,
      contextState: this.ctx ? (this.ctx.state as string) : "uninitialized",
    });

    this.attachLifecycleListeners();
    const el = this.ensureCueElement();
    if (el && TRACK_URLS.stinger && !el.src) {
      el.src = TRACK_URLS.stinger;
    }

    // Pré-carrega somente o áudio da primeira etapa (48 KB) para ativação instantânea
    void this.fetchRawTrack("stinger");
  }

  public setScene(sceneId: string): void {
    if (this.currentScene === sceneId) return;
    const prev = this.currentScene;
    this.currentScene = sceneId;
    audioLogger.log("Scene changed.", {
      stepId: sceneId,
      sceneId,
      engineState: this.state,
      contextState: this.ctx ? (this.ctx.state as string) : "uninitialized",
      trackId: this.activeTrackId ?? undefined,
    });

    // Pré-carregamento progressivo apenas da próxima etapa (sem baixar tudo simultaneamente)
    if (sceneId === "choose-sax") {
      void this.fetchRawTrack("sax-alto");
      void this.fetchRawTrack("sax-tenor");
    } else if (sceneId === "before-after") {
      void this.fetchRawTrack("solo-dry");
      void this.fetchRawTrack("full-band");
    } else if (sceneId === "build-library") {
      void this.fetchRawTrack("library-chime");
    } else if (sceneId === "offer" && prev !== "offer") {
      this.stopAllForExternalPlayer("offer");
    }

    this.emit();
  }

  private ensureCueElement(): HTMLAudioElement | null {
    if (typeof window === "undefined" || typeof Audio === "undefined") return null;
    if (!this.cueEl) {
      const el = new Audio();
      el.preload = "auto";
      el.setAttribute("playsinline", "true");
      el.setAttribute("webkit-playsinline", "true");
      el.muted = this.muted;
      el.volume = this.muted ? 0 : this.volume;
      this.cueEl = el;
    }

    if (!this.cueElListenersAttached && this.cueEl) {
      this.cueElListenersAttached = true;
      const el = this.cueEl;

      el.addEventListener("canplay", () => {
        audioLogger.log("Media loaded successfully.", {
          sceneId: this.currentScene,
          trackId: this.activeTrackId ?? undefined,
          file: el.currentSrc || el.src,
          engineState: this.state,
        });
      });

      el.addEventListener("playing", () => {
        if (this.state === "loading" || this.state === "initializing") {
          this.setState("playing");
        }
        audioLogger.log("Playback started.", {
          sceneId: this.currentScene,
          trackId: this.activeTrackId ?? undefined,
          file: el.currentSrc || el.src,
          engineState: this.state,
          contextState: this.ctx ? (this.ctx.state as string) : "uninitialized",
        });
      });

      el.addEventListener("ended", () => {
        audioLogger.log("Playback ended.", {
          sceneId: this.currentScene,
          trackId: this.activeTrackId ?? undefined,
          file: el.currentSrc || el.src,
          engineState: this.state,
        });
        if (!this.isComparisonPlaying && this.state === "playing") {
          this.setState("ready");
        }
      });

      el.addEventListener("error", () => {
        const errMsg = el.error?.message || `MediaError code ${el.error?.code ?? "unknown"}`;
        audioLogger.log(
          "Playback error.",
          {
            sceneId: this.currentScene,
            trackId: this.activeTrackId ?? undefined,
            file: el.currentSrc || el.src,
            engineState: this.state,
            error: errMsg,
          },
          "warn"
        );
      });
    }

    return this.cueEl;
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (this.ctx && this.ctx.state !== "closed") return this.ctx;

    const AudioCtx = getAudioContextCtor();
    if (!AudioCtx) {
      this.lastError = "Este navegador não suporta Web Audio API.";
      audioLogger.log("Playback error.", { error: this.lastError, sceneId: this.currentScene }, "error");
      return null;
    }

    try {
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;

      const dryGain = ctx.createGain();
      const bandGain = ctx.createGain();
      const cueGain = ctx.createGain();

      dryGain.gain.value = 0;
      bandGain.gain.value = 0;
      cueGain.gain.value = 1;
      master.gain.value = this.muted ? 0 : this.volume * this.duckLevel;

      dryGain.connect(master);
      bandGain.connect(master);
      cueGain.connect(master);
      master.connect(analyser);
      analyser.connect(ctx.destination);

      ctx.addEventListener("statechange", () => {
        const ctxState = ctx.state as string;
        audioLogger.log(`AudioContext state: ${ctxState}.`, {
          sceneId: this.currentScene,
          contextState: ctxState,
          engineState: this.state,
        });

        // iOS Safari entra no estado não-padrão "interrupted" ao bloquear tela, receber ligação ou trocar app
        if (ctxState === "interrupted" || (ctxState === "suspended" && this.activated && !this.muted)) {
          if (this.isComparisonPlaying || this.comparisonShouldBeActive) {
            this.snapshotComparisonOffset();
            this.stopComparisonNodesOnly();
            this.wasPlayingBeforeHide = true;
            this.setState("interrupted");
            audioLogger.log(
              "Playback interrupted.",
              {
                sceneId: this.currentScene,
                contextState: ctxState,
                engineState: "interrupted",
              },
              "warn"
            );
          }
        }
        this.emit();
      });

      this.ctx = ctx;
      this.masterGain = master;
      this.dryGain = dryGain;
      this.bandGain = bandGain;
      this.cueGain = cueGain;
      this.analyser = analyser;

      audioLogger.log(`AudioContext state: ${ctx.state}.`, {
        sceneId: this.currentScene,
        contextState: ctx.state,
        engineState: this.state,
      });

      return ctx;
    } catch (err) {
      this.lastError = err instanceof Error ? err.message : "Falha ao criar AudioContext.";
      audioLogger.log("Playback error.", { error: this.lastError, sceneId: this.currentScene }, "error");
      return null;
    }
  }

  private attachLifecycleListeners(): void {
    if (this.lifecycleAttached || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }
    this.lifecycleAttached = true;

    const handleBackground = () => {
      if (!this.activated) return;
      const activelyPlaying =
        this.isComparisonPlaying ||
        this.comparisonShouldBeActive ||
        Boolean(this.cueEl && !this.cueEl.paused);

      if (activelyPlaying && !this.muted) {
        this.wasPlayingBeforeHide = true;
        this.snapshotComparisonOffset();
        this.stopComparisonNodesOnly();
        try {
          this.cueEl?.pause();
        } catch {
          // noop
        }
        if (this.ctx && this.ctx.state === "running") {
          void this.ctx.suspend().catch(() => {});
        }
        this.setState("interrupted");
        audioLogger.log(
          "Playback interrupted.",
          {
            sceneId: this.currentScene,
            contextState: this.ctx ? (this.ctx.state as string) : "uninitialized",
            engineState: "interrupted",
          },
          "warn"
        );
      }
    };

    const handleForeground = () => {
      if (!this.activated || this.muted) return;
      if (this.currentScene === "offer") return;
      if (this.wasPlayingBeforeHide || this.state === "interrupted") {
        void this.attemptAutomaticRecovery();
      }
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        handleBackground();
      } else {
        handleForeground();
      }
    });

    window.addEventListener("pagehide", handleBackground);
    window.addEventListener("pageshow", (ev) => {
      // Ao voltar pelo BFCache do Safari iOS, revalida o estado real do áudio
      if (ev.persisted && this.activated && !this.muted && this.currentScene !== "offer") {
        handleForeground();
      }
    });

    // Coordenação com o Player Spotify da Cena 5 (/interativo Oferta) — evita dois áudios simultâneos!
    window.addEventListener("cs-spotify-play", () => {
      this.stopAllForExternalPlayer("spotify-takeover");
    });
  }

  private snapshotComparisonOffset(): void {
    if (!this.isComparisonPlaying || !this.ctx) return;
    const elapsed = Math.max(0, this.ctx.currentTime - this.comparisonStartedAtCtxTime);
    const dur = this.comparisonDurationSec || 11.429;
    this.comparisonOffsetSec = (this.comparisonOffsetSec + elapsed) % dur;
  }

  /**
   * FASE 4 — ATIVAÇÃO INICIAL REAL (DEVE SER CHAMADA DIRETAMENTE NO `onClick` DO BOTÃO!)
   * - Cria/recupera AudioContext e chama `ctx.resume()` sincronamente na pilha do clique.
   * - Dispara reprodução REAL e audível de `/interativo/audio/stage-stinger.wav` na mesma pilha.
   * - Valida tecnicamente que a reprodução entrou em estado ativo ANTES de confirmar sucesso.
   */
  public async activateFromUserGesture(): Promise<ActivationResult> {
    const token = ++this.playbackToken;
    this.lastError = null;
    this.needsUserRecovery = false;
    this.recoveryAttempts = 0;
    this.muted = false;
    this.duckLevel = 1;
    this.activeTrackId = "stinger";
    this.setState("initializing");

    audioLogger.log("User activation received.", {
      stepId: "scene1",
      sceneId: this.currentScene,
      trackId: "stinger",
      file: TRACK_URLS.stinger,
      engineState: "initializing",
    });

    // 1. Cria/obtém AudioContext e dispara resume() SINCRONAMENTE no gesto do usuário
    const ctx = this.ensureAudioContext();
    let ctxResumePromise: Promise<void> = Promise.resolve();
    if (ctx && ctx.state !== "running") {
      ctxResumePromise = ctx.resume().catch(() => {});
    }

    // 2. Dispara reprodução REAL e AUDÍVEL do arquivo stage-stinger.wav SINCRONAMENTE no gesto!
    const el = this.ensureCueElement();
    let htmlPlayPromise: Promise<boolean> = Promise.resolve(false);
    if (el && TRACK_URLS.stinger) {
      try {
        el.pause();
        if (!el.src || !el.src.endsWith(TRACK_URLS.stinger)) {
          el.src = TRACK_URLS.stinger;
        }
        el.muted = false;
        el.volume = this.volume;
        const p = el.play();
        if (p && typeof p.then === "function") {
          htmlPlayPromise = p.then(
            () => true,
            (err) => {
              audioLogger.log(
                "Playback error.",
                {
                  sceneId: this.currentScene,
                  trackId: "stinger",
                  file: TRACK_URLS.stinger,
                  error: err instanceof Error ? err.message : String(err),
                },
                "warn"
              );
              return false;
            }
          );
        } else {
          htmlPlayPromise = Promise.resolve(true);
        }
      } catch (err) {
        audioLogger.log(
          "Playback error.",
          {
            sceneId: this.currentScene,
            trackId: "stinger",
            file: TRACK_URLS.stinger,
            error: err instanceof Error ? err.message : String(err),
          },
          "warn"
        );
      }
    }

    // 3. Aguarda confirmação real (com limite seguro de 1.8s para nunca travar em rede lenta)
    const timeoutGuard = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1800);
    });
    await Promise.race([Promise.allSettled([ctxResumePromise, htmlPlayPromise]), timeoutGuard]);

    if (token !== this.playbackToken) {
      return { ok: false, error: "Operação substituída." };
    }

    const htmlPlayed = await Promise.race([htmlPlayPromise, Promise.resolve(false)]);
    const ctxRunning = Boolean(this.ctx && this.ctx.state === "running");

    // 4. Se HTMLAudio falhou (ex: rede lenta ou ambiente de teste), mas AudioContext está running,
    //    reproduz amostra real audível via Web Audio e confirma tecnicamente!
    let webAudioPlayed = false;
    if (!htmlPlayed && ctxRunning && this.ctx) {
      const buf = (await this.getDecodedTrack("stinger")) ?? this.createFallbackStingerBuffer(this.ctx);
      if (buf && token === this.playbackToken) {
        webAudioPlayed = this.playOneShotBuffer(buf, "stinger", 0.95);
      }
    }

    const verifiedPlaying = htmlPlayed || webAudioPlayed;

    if (!verifiedPlaying) {
      this.activated = false;
      this.lastError = "Não foi possível iniciar o áudio.";
      this.setState("error");
      audioLogger.log(
        "Playback error.",
        {
          stepId: "scene1",
          sceneId: this.currentScene,
          trackId: "stinger",
          file: TRACK_URLS.stinger,
          contextState: this.ctx ? (this.ctx.state as string) : "uninitialized",
          engineState: "error",
          error: "Neither HTMLAudioElement nor Web Audio confirmed audible playback.",
        },
        "error"
      );
      return { ok: false, error: this.lastError };
    }

    this.activated = true;
    this.lastError = null;
    writeStoredPreference("enabled");
    this.applyMasterGain(0.03);
    this.setState("playing");

    audioLogger.log("Playback started.", {
      stepId: "scene1",
      sceneId: this.currentScene,
      trackId: "stinger",
      file: TRACK_URLS.stinger,
      contextState: this.ctx ? (this.ctx.state as string) : "uninitialized",
      engineState: "playing",
    });

    // Pré-carrega os arquivos leves da Cena 2 em segundo plano (~50 KB cada)
    void this.fetchRawTrack("sax-alto");
    void this.fetchRawTrack("sax-tenor");

    return { ok: true };
  }

  /**
   * Permite que o visitante siga sem som se o dispositivo bloquear áudio (nunca trava o funil comercial).
   */
  public continueWithoutSound(): void {
    this.muted = true;
    this.activated = false;
    this.needsUserRecovery = false;
    this.lastError = null;
    writeStoredPreference("muted");
    this.stopComparison();
    try {
      this.cueEl?.pause();
    } catch {
      // noop
    }
    this.setState("paused");
  }

  /**
   * FASE 5 — Cena 2: Toca o timbre real de Sax Alto (Eb) ou Tenor (Bb) dentro do toque
   * e inicia o carregamento/decodificação assíncrono dos loops da Cena 3 (sem travar a UI).
   */
  public async playSaxChoiceCue(sax: SaxChoice): Promise<void> {
    const trackKey: AudioTrackKey = sax === "alto" ? "sax-alto" : "sax-tenor";
    const token = ++this.playbackToken;
    this.activeTrackId = trackKey;
    this.comparisonShouldBeActive = false;

    // Reforça o AudioContext sincronamente dentro do clique da Cena 2 (segurança extra no iOS!)
    const ctx = this.ensureAudioContext();
    if (ctx && ctx.state !== "running" && !this.muted) {
      void ctx.resume().catch(() => {});
    }

    // Inicia o download + decodificação dos loops da Cena 3 em paralelo em background
    void this.preloadComparisonTracks();

    if (this.muted) {
      return;
    }

    this.setState("loading");
    this.activated = true;

    // Prioriza HTMLAudioElement direto no gesto do usuário (latência zero no iOS Safari!)
    const playedHtml = await this.playCueElement(trackKey, token);
    if (playedHtml || token !== this.playbackToken) {
      return;
    }

    // Fallback Web Audio se HTMLAudio não puder iniciar
    if (ctx && ctx.state === "running") {
      const buf = await this.getDecodedTrack(trackKey);
      if (token !== this.playbackToken) return;
      if (buf) {
        this.playOneShotBuffer(buf, trackKey, 1.0);
        return;
      }
    }

    this.setState("ready");
  }

  private async playCueElement(trackKey: AudioTrackKey, token: number): Promise<boolean> {
    const el = this.ensureCueElement();
    const url = TRACK_URLS[trackKey];
    if (!el || !url) return false;

    try {
      el.pause();
      if (!el.src || !el.src.endsWith(url)) {
        el.src = url;
      }
      el.muted = this.muted;
      el.volume = this.muted ? 0 : this.volume;
      const p = el.play();
      if (p && typeof p.then === "function") {
        await p;
      }
      if (token !== this.playbackToken) {
        el.pause();
        return false;
      }
      this.setState("playing");
      return true;
    } catch (err) {
      audioLogger.log(
        "Playback error.",
        {
          sceneId: this.currentScene,
          trackId: trackKey,
          file: url,
          error: err instanceof Error ? err.message : String(err),
        },
        "warn"
      );
      return false;
    }
  }

  private playOneShotBuffer(buffer: AudioBuffer, trackId: string, gainLevel = 1.0): boolean {
    if (!this.ctx || !this.cueGain || this.muted) return false;
    try {
      this.stopActiveCueSource();
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      const g = this.ctx.createGain();
      g.gain.value = gainLevel;
      src.connect(g);
      g.connect(this.cueGain);
      src.onended = () => {
        if (this.activeCueSource === src) {
          this.activeCueSource = null;
          audioLogger.log("Playback ended.", {
            sceneId: this.currentScene,
            trackId,
            engineState: this.state,
          });
          if (!this.isComparisonPlaying && this.state === "playing") {
            this.setState("ready");
          }
        }
      };
      src.start(0);
      this.activeCueSource = src;
      this.activeTrackId = trackId;
      this.setState("playing");
      return true;
    } catch {
      return false;
    }
  }

  private stopActiveCueSource(): void {
    if (this.activeCueSource) {
      try {
        this.activeCueSource.onended = null;
        this.activeCueSource.stop();
        this.activeCueSource.disconnect();
      } catch {
        // noop
      }
      this.activeCueSource = null;
    }
  }

  /** Pré-carrega e decodifica os dois loops sincronizados da Cena 3 em segundo plano */
  public async preloadComparisonTracks(): Promise<void> {
    await Promise.all([this.fetchRawTrack("solo-dry"), this.fetchRawTrack("full-band")]);
    if (this.ctx) {
      await Promise.all([this.getDecodedTrack("solo-dry"), this.getDecodedTrack("full-band")]);
    }
  }

  /**
   * FASE 5 — Cena 3: Inicia reprodução sincronizada sample-accurate ("Sozinho" <-> "Com banda").
   * Previne duplicações em re-renders e solicita recuperação caso o navegador tenha suspendido o contexto.
   */
  public async startComparison(initialMix = 0): Promise<void> {
    this.comparisonMix = clamp01(initialMix);
    this.comparisonShouldBeActive = true;

    if (this.muted) {
      this.setState("paused");
      return;
    }

    // Evita reiniciar se o par sincronizado já está tocando na mesma cena!
    if (this.isComparisonPlaying && this.ctx?.state === "running") {
      this.setMix(this.comparisonMix, false);
      return;
    }

    const token = ++this.playbackToken;
    this.activeTrackId = "scene3-comparison";
    this.setState("loading");

    // Encerra qualquer cue residual da Cena 2 para evitar sobreposição
    try {
      this.cueEl?.pause();
    } catch {
      // noop
    }
    this.stopActiveCueSource();

    const ctx = this.ensureAudioContext();
    if (!ctx) {
      this.setState("error");
      return;
    }

    if (ctx.state !== "running") {
      try {
        await ctx.resume();
      } catch {
        // tratado abaixo
      }
    }

    if (token !== this.playbackToken || !this.comparisonShouldBeActive) return;

    if (ctx.state !== "running") {
      this.needsUserRecovery = true;
      this.setState("interrupted");
      audioLogger.log(
        "Playback interrupted.",
        {
          sceneId: this.currentScene,
          trackId: "scene3-comparison",
          contextState: ctx.state as string,
          engineState: "interrupted",
          recoveryResult: "needs_user_gesture",
        },
        "warn"
      );
      return;
    }

    const [dryBuf, bandBuf] = await Promise.all([
      this.getDecodedTrack("solo-dry"),
      this.getDecodedTrack("full-band"),
    ]);

    if (token !== this.playbackToken || !this.comparisonShouldBeActive || this.muted) {
      return;
    }

    if (!dryBuf || !bandBuf) {
      this.lastError = "Não foi possível carregar os áudios de comparação.";
      this.setState("error");
      audioLogger.log(
        "Playback error.",
        {
          sceneId: this.currentScene,
          trackId: "scene3-comparison",
          file: `${TRACK_URLS["solo-dry"]}, ${TRACK_URLS["full-band"]}`,
          error: this.lastError,
        },
        "error"
      );
      return;
    }

    this.launchComparisonNodes(ctx, dryBuf, bandBuf, this.comparisonOffsetSec);
  }

  private launchComparisonNodes(
    ctx: AudioContext,
    dryBuf: AudioBuffer,
    bandBuf: AudioBuffer,
    offsetSec: number
  ): void {
    if (!this.dryGain || !this.bandGain || !this.masterGain) return;

    // Sempre destrói nós anteriores antes de criar novos (AudioBufferSourceNode é de uso único!)
    this.stopComparisonNodesOnly();

    const dur = Math.min(dryBuf.duration, bandBuf.duration);
    this.comparisonDurationSec = dur > 0 ? dur : 11.429;
    const safeOffset = dur > 0 ? ((offsetSec % dur) + dur) % dur : 0;

    const startAt = ctx.currentTime + 0.025;
    const drySrc = ctx.createBufferSource();
    drySrc.buffer = dryBuf;
    drySrc.loop = true;

    const bandSrc = ctx.createBufferSource();
    bandSrc.buffer = bandBuf;
    bandSrc.loop = true;

    drySrc.connect(this.dryGain);
    bandSrc.connect(this.bandGain);

    this.duckLevel = 1;
    this.applyMasterGain(0.03);

    const dryLevel = Math.cos(this.comparisonMix * Math.PI * 0.5);
    const bandLevel = Math.sin(this.comparisonMix * Math.PI * 0.5);
    this.dryGain.gain.setValueAtTime(dryLevel, ctx.currentTime);
    this.bandGain.gain.setValueAtTime(bandLevel, ctx.currentTime);

    drySrc.start(startAt, safeOffset);
    bandSrc.start(startAt, safeOffset);

    this.drySource = drySrc;
    this.bandSource = bandSrc;
    this.isComparisonPlaying = true;
    this.comparisonStartedAtCtxTime = startAt;
    this.comparisonOffsetSec = safeOffset;
    this.needsUserRecovery = false;
    this.wasPlayingBeforeHide = false;
    this.lastError = null;
    this.setState("playing");

    audioLogger.log("Playback started.", {
      stepId: this.currentScene,
      sceneId: this.currentScene,
      trackId: "scene3-comparison",
      file: `${TRACK_URLS["solo-dry"]} + ${TRACK_URLS["full-band"]}`,
      contextState: ctx.state,
      engineState: "playing",
    });
  }

  /** Garante recuperação imediata caso o usuário interaja com o slider da Cena 3 */
  public ensureActiveOnUserGesture(mix: number): void {
    this.comparisonMix = clamp01(mix);
    if (this.muted) return;
    if (this.ctx && this.ctx.state !== "running") {
      void this.ctx.resume().then(() => {
        if (this.comparisonShouldBeActive && !this.isComparisonPlaying) {
          void this.startComparison(this.comparisonMix);
        }
      });
    } else if (this.comparisonShouldBeActive && !this.isComparisonPlaying) {
      void this.startComparison(this.comparisonMix);
    }
  }

  /** Crossfade equal-power real: cos(x * PI/2) para solo seco e sin(x * PI/2) para banda */
  public setMix(value: number, immediate = false): void {
    const clamped = clamp01(value);
    this.comparisonMix = clamped;
    if (!this.ctx || !this.dryGain || !this.bandGain || !this.isComparisonPlaying) return;

    const now = this.ctx.currentTime;
    const dryLevel = Math.cos(clamped * Math.PI * 0.5);
    const bandLevel = Math.sin(clamped * Math.PI * 0.5);

    if (immediate) {
      this.dryGain.gain.setValueAtTime(dryLevel, now);
      this.bandGain.gain.setValueAtTime(bandLevel, now);
    } else {
      this.dryGain.gain.setTargetAtTime(dryLevel, now, 0.03);
      this.bandGain.gain.setTargetAtTime(bandLevel, now, 0.03);
    }
  }

  public setDucking(level: number, timeConstant = 0.25): void {
    this.duckLevel = clamp01(level);
    this.applyMasterGain(timeConstant);
  }

  /** Cena 4: Toca chime sutil de conclusão quando a Credencial VIP aparece */
  public async playLibraryReadyChime(): Promise<void> {
    if (this.muted || !this.activated) return;
    const ctx = this.ensureAudioContext();
    if (ctx && ctx.state === "running") {
      const buf = await this.getDecodedTrack("library-chime");
      if (buf && this.currentScene === "build-library" && !this.muted) {
        this.playOneShotBuffer(buf, "library-chime", 0.72);
      }
    }
  }

  /** Controle explícito de volume pelo visitante (respeita preferência, não altera volume físico) */
  public setVolume(nextVolume: number): void {
    const clamped = clamp01(nextVolume);
    this.volume = clamped;
    if (clamped === 0) {
      this.muted = true;
      writeStoredPreference("muted");
    } else if (this.muted) {
      this.muted = false;
      writeStoredPreference("enabled");
    }

    if (this.cueEl) {
      this.cueEl.muted = this.muted;
      this.cueEl.volume = this.muted ? 0 : this.volume;
    }
    this.applyMasterGain(0.03);
    this.emit();
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    writeStoredPreference(mute ? "muted" : "enabled");

    if (this.cueEl) {
      this.cueEl.muted = mute;
      if (mute) {
        try {
          this.cueEl.pause();
        } catch {
          // noop
        }
      } else {
        this.cueEl.volume = this.volume;
      }
    }

    if (mute) {
      this.needsUserRecovery = false;
      this.applyMasterGain(0.03);
      if (this.isComparisonPlaying) {
        this.snapshotComparisonOffset();
      }
      this.setState("paused");
    } else {
      this.applyMasterGain(0.04);
      if (this.ctx && this.ctx.state !== "running") {
        void this.ctx.resume().then(() => {
          if (this.comparisonShouldBeActive && !this.isComparisonPlaying) {
            void this.startComparison(this.comparisonMix);
          } else if (this.isComparisonPlaying) {
            this.setState("playing");
          } else {
            this.setState("ready");
          }
        });
      } else if (this.comparisonShouldBeActive && !this.isComparisonPlaying) {
        void this.startComparison(this.comparisonMix);
      } else if (this.isComparisonPlaying) {
        this.setState("playing");
      } else if (this.activated) {
        this.setState("ready");
      }
    }

    this.emit();
  }

  public toggleMute(): boolean {
    const next = !this.muted;
    this.setMuted(next);
    return next;
  }

  /**
   * FASE 6 — Recuperação automática após retorno de segundo plano / bloqueio de tela.
   * Executa no máximo 1 tentativa automática (zero loops infinitos!).
   * Se o iOS Safari exigir nova interação, expõe `needsUserRecovery = true` para o botão "REATIVAR SOM".
   */
  private async attemptAutomaticRecovery(): Promise<void> {
    if (this.muted || !this.activated || this.currentScene === "offer") return;
    if (this.recoveryAttempts >= MAX_AUTO_RECOVERY_ATTEMPTS) {
      this.needsUserRecovery = true;
      this.setState("interrupted");
      return;
    }

    this.recoveryAttempts += 1;
    this.setState("recovering");
    audioLogger.log("Recovery initiated.", {
      sceneId: this.currentScene,
      engineState: "recovering",
      contextState: this.ctx ? (this.ctx.state as string) : "uninitialized",
      recoveryAttempt: this.recoveryAttempts,
      recoveryResult: "pending",
    });

    const ctx = this.ensureAudioContext();
    if (ctx && ctx.state !== "running") {
      try {
        await Promise.race([
          ctx.resume(),
          new Promise<void>((resolve) => window.setTimeout(resolve, 650)),
        ]);
      } catch {
        // tratado abaixo
      }
    }

    if (ctx && ctx.state === "running") {
      this.needsUserRecovery = false;
      this.recoveryAttempts = 0;
      this.wasPlayingBeforeHide = false;
      if (this.comparisonShouldBeActive && !this.isComparisonPlaying) {
        const dryBuf = this.decodedCache.get("solo-dry") ?? (await this.getDecodedTrack("solo-dry"));
        const bandBuf = this.decodedCache.get("full-band") ?? (await this.getDecodedTrack("full-band"));
        if (dryBuf && bandBuf && this.comparisonShouldBeActive && !this.muted) {
          this.launchComparisonNodes(ctx, dryBuf, bandBuf, this.comparisonOffsetSec);
        }
      } else {
        this.setState("ready");
      }
      audioLogger.log("Recovery successful.", {
        sceneId: this.currentScene,
        engineState: this.state,
        contextState: ctx.state,
        recoveryAttempt: 1,
        recoveryResult: "success",
      });
      return;
    }

    // Navegador exigiu nova interação do visitante (comportamento padrão iOS Safari após bloqueio)
    this.needsUserRecovery = true;
    this.setState("interrupted");
    audioLogger.log(
      "Playback interrupted.",
      {
        sceneId: this.currentScene,
        engineState: "interrupted",
        contextState: ctx ? (ctx.state as string) : "uninitialized",
        recoveryAttempt: this.recoveryAttempts,
        recoveryResult: "needs_user_gesture",
      },
      "warn"
    );
  }

  /**
   * FASE 6 — Recuperação explícita via toque no botão "REATIVAR SOM" (sem reiniciar o funil).
   */
  public async recoverFromUserGesture(): Promise<boolean> {
    this.muted = false;
    this.needsUserRecovery = false;
    this.recoveryAttempts = 0;
    this.lastError = null;
    this.setState("recovering");
    writeStoredPreference("enabled");

    audioLogger.log("Recovery initiated.", {
      sceneId: this.currentScene,
      engineState: "recovering",
      recoveryAttempt: 1,
      recoveryResult: "pending",
    });

    const ctx = this.ensureAudioContext();
    if (ctx && ctx.state !== "running") {
      try {
        await ctx.resume();
      } catch {
        // fallback abaixo
      }
    }

    if (ctx && ctx.state === "running") {
      this.activated = true;
      this.wasPlayingBeforeHide = false;
      if (this.comparisonShouldBeActive) {
        const [dryBuf, bandBuf] = await Promise.all([
          this.getDecodedTrack("solo-dry"),
          this.getDecodedTrack("full-band"),
        ]);
        if (dryBuf && bandBuf) {
          this.launchComparisonNodes(ctx, dryBuf, bandBuf, this.comparisonOffsetSec);
        }
      } else {
        this.setState("ready");
      }

      audioLogger.log("Recovery successful.", {
        sceneId: this.currentScene,
        engineState: this.state,
        contextState: ctx.state,
        recoveryResult: "success",
      });
      return true;
    }

    this.needsUserRecovery = true;
    this.lastError = "Não foi possível reativar o áudio. Toque novamente.";
    this.setState("error");
    audioLogger.log(
      "Playback error.",
      {
        sceneId: this.currentScene,
        engineState: "error",
        contextState: ctx ? (ctx.state as string) : "uninitialized",
        error: this.lastError,
        recoveryResult: "failed",
      },
      "error"
    );
    return false;
  }

  public getFrequencyData(target: Uint8Array): boolean {
    if (!this.analyser || this.muted || !this.isComparisonPlaying || this.state !== "playing") {
      return false;
    }
    this.analyser.getByteFrequencyData(target);
    return true;
  }

  private applyMasterGain(timeConstant = 0.05): void {
    if (!this.ctx || !this.masterGain) return;
    const target = this.muted ? 0 : this.volume * this.duckLevel;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, timeConstant);
  }

  private stopComparisonNodesOnly(): void {
    if (this.drySource) {
      try {
        this.drySource.stop();
        this.drySource.disconnect();
      } catch {
        // noop
      }
      this.drySource = null;
    }
    if (this.bandSource) {
      try {
        this.bandSource.stop();
        this.bandSource.disconnect();
      } catch {
        // noop
      }
      this.bandSource = null;
    }
    this.isComparisonPlaying = false;
  }

  public stopComparison(): void {
    this.playbackToken += 1;
    this.comparisonShouldBeActive = false;
    this.comparisonOffsetSec = 0;
    this.wasPlayingBeforeHide = false;
    this.stopComparisonNodesOnly();
    this.stopActiveCueSource();
    if (this.state === "playing" || this.state === "loading") {
      this.setState(this.activated ? "ready" : "locked");
    }
  }

  /** Encerra totalmente o áudio das cenas 1–4 ao entrar na Oferta ou quando o Spotify assume */
  public stopAllForExternalPlayer(reason: string): void {
    this.playbackToken += 1;
    this.comparisonShouldBeActive = false;
    this.comparisonOffsetSec = 0;
    this.wasPlayingBeforeHide = false;
    this.needsUserRecovery = false;
    this.stopComparisonNodesOnly();
    this.stopActiveCueSource();
    try {
      this.cueEl?.pause();
    } catch {
      // noop
    }
    if (this.state === "playing" || this.state === "loading" || this.state === "interrupted") {
      this.setState(this.activated ? "ready" : "locked");
    }
    audioLogger.log("Playback ended.", {
      sceneId: this.currentScene,
      trackId: reason,
      engineState: this.state,
    });
  }

  /** Carregamento sob demanda com 1 retry seguro em caso de oscilação de rede móvel */
  private async fetchRawTrack(key: AudioTrackKey): Promise<ArrayBuffer | null> {
    if (this.rawCache.has(key)) return this.rawCache.get(key)!;
    if (this.inFlightFetch.has(key)) return this.inFlightFetch.get(key)!;

    const url = TRACK_URLS[key];
    if (!url || typeof fetch !== "function") return null;

    const promise = (async () => {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch(attempt === 0 ? url : `${url}?r=1`, { cache: "force-cache" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const buf = await res.arrayBuffer();
          if (buf.byteLength > 44) {
            this.rawCache.set(key, buf);
            audioLogger.log("Media loaded successfully.", {
              sceneId: this.currentScene,
              trackId: key,
              file: url,
              engineState: this.state,
            });
            return buf;
          }
        } catch (err) {
          if (attempt === 1) {
            audioLogger.log(
              "Playback error.",
              {
                sceneId: this.currentScene,
                trackId: key,
                file: url,
                error: err instanceof Error ? err.message : String(err),
              },
              "warn"
            );
          }
        }
      }
      return null;
    })();

    this.inFlightFetch.set(key, promise);
    const result = await promise;
    this.inFlightFetch.delete(key);
    return result;
  }

  private async getDecodedTrack(key: AudioTrackKey): Promise<AudioBuffer | null> {
    if (this.decodedCache.has(key)) return this.decodedCache.get(key)!;
    if (!this.ctx) return null;

    const raw = await this.fetchRawTrack(key);
    if (!raw || !this.ctx) return null;

    try {
      // slice(0) garante que o ArrayBuffer em cache nunca seja detached pela decodificação
      const decoded = await this.ctx.decodeAudioData(raw.slice(0));
      this.decodedCache.set(key, decoded);
      return decoded;
    } catch (err) {
      audioLogger.log(
        "Playback error.",
        {
          sceneId: this.currentScene,
          trackId: key,
          file: TRACK_URLS[key],
          error: `Decode failed: ${err instanceof Error ? err.message : String(err)}`,
        },
        "error"
      );
      return null;
    }
  }

  /** Micro-fallback audível (0.7s, <15k samples) apenas se stage-stinger.wav estiver offline */
  private createFallbackStingerBuffer(ctx: AudioContext): AudioBuffer | null {
    try {
      const sr = ctx.sampleRate;
      const len = Math.floor(sr * 0.7);
      const buf = ctx.createBuffer(1, len, sr);
      const ch = buf.getChannelData(0);
      const freqs = [293.66, 349.23, 440.0, 523.25];
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        const env = Math.min(1, t / 0.03) * Math.exp(-t * 3.5);
        let s = 0;
        for (const f of freqs) s += Math.sin(2 * Math.PI * f * t);
        ch[i] = Math.tanh(s * 0.25 * env) * 0.75;
      }
      return buf;
    } catch {
      return null;
    }
  }
}

export const audioEngine = new InterativoAudioEngine();
