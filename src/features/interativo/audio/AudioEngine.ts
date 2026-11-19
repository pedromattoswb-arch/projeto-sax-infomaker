import { FUNNEL_CONFIG, type SaxChoice } from "../funnel.config";

export type AudioStatus = "idle" | "unlocked" | "playing" | "unavailable";

/**
 * Gera um mini WAV PCM silencioso (0.2s) em memória para forçar a sessão de áudio do iOS (AVAudioSession)
 * do modo "Ambient" (mutado pela chave lateral física do iPhone) para o modo "Playback" (toca mesmo no silencioso!).
 */
function createSilentUnlockWavUrl(): string | null {
  if (typeof window === "undefined" || typeof Blob === "undefined" || typeof URL === "undefined") {
    return null;
  }
  try {
    const sampleRate = 8000;
    const numSamples = 1600; // 0.2s
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, numSamples * 2, true);
    // Quase-silêncio de baixíssima amplitude (1 LSB) para o iOS manter o canal Playback ativo
    for (let i = 0; i < numSamples; i++) {
      view.setInt16(44 + i * 2, i % 2 === 0 ? 1 : -1, true);
    }
    return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
  } catch {
    return null;
  }
}

/**
 * Motor de Áudio Mobile-First (Triple-Lock iOS + Android + Instagram/FB WebView)
 * 1. Força navigator.audioSession.type = "playback" (iOS 17+).
 * 2. Inicia <audio loop playsInline> com WAV real sincronamente no 1º toque para contornar
 *    a chave física de modo silencioso do iPhone em TODOS os iOS (12–18) e WebViews!
 * 3. Executa AudioContext.resume() + síntese + start() 100% SINCRONAMENTE dentro do gesto
 *    do usuário (zero await bloqueando o token de gesto do Safari/WebKit).
 * 4. Pré-inicia o loop sincronizado da Cena 3 dentro do toque da Cena 2 (em gain 0) para que
 *    na Cena 3 o som já esteja tocando instantaneamente sem depender de useEffect!
 */
class InterativoAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private bandGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  private iosUnlockEl: HTMLAudioElement | null = null;
  private iosUnlockUrl: string | null = null;

  private stingerBuffer: AudioBuffer | null = null;
  private dryBuffer: AudioBuffer | null = null;
  private bandBuffer: AudioBuffer | null = null;

  private drySource: AudioBufferSourceNode | null = null;
  private bandSource: AudioBufferSourceNode | null = null;

  private prefetchedRaw: Partial<Record<"stinger" | "dry" | "band", ArrayBuffer>> = {};
  private status: AudioStatus = "idle";
  private muted: boolean = false;
  private currentMix = 0;
  private duckLevel = 1;
  private isComparisonRunning = false;
  private comparisonAudible = false;
  private visibilityListenerAttached = false;
  private listeners = new Set<() => void>();

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // noop
      }
    });
  }

  public getStatus(): AudioStatus {
    return this.status;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public getFrequencyData(target: Uint8Array): boolean {
    if (!this.analyser || this.muted || this.status === "unavailable" || !this.comparisonAudible) {
      return false;
    }
    this.analyser.getByteFrequencyData(target);
    return true;
  }

  /** Prepara URLs opcionais e força audioSession = playback quando suportado */
  public preload(): void {
    if (typeof window === "undefined") return;
    this.setIOSPlaybackSession();

    if (!this.iosUnlockUrl) {
      this.iosUnlockUrl = createSilentUnlockWavUrl();
    }

    if (typeof fetch !== "function") return;
    const entries: Array<["stinger" | "dry" | "band", string]> = [
      ["stinger", FUNNEL_CONFIG.audio.stingerUrl],
      ["dry", FUNNEL_CONFIG.audio.soloDryUrl],
      ["band", FUNNEL_CONFIG.audio.soloBandUrl],
    ];
    entries.forEach(([key, url]) => {
      if (!url) return;
      fetch(url)
        .then((res) => (res.ok ? res.arrayBuffer() : null))
        .then((buf) => {
          if (buf) this.prefetchedRaw[key] = buf;
        })
        .catch(() => {});
    });
  }

  private setIOSPlaybackSession(): void {
    try {
      const nav = navigator as Navigator & { audioSession?: { type: string } };
      if (nav.audioSession) {
        nav.audioSession.type = "playback";
      }
    } catch {
      // noop
    }
  }

  /** Inicia o <audio> keep-alive sincronamente dentro de um gesto do usuário (desbloqueia modo silencioso iOS!) */
  private unlockIOSHardwareMuteSync(): void {
    if (typeof window === "undefined" || typeof Audio === "undefined") return;
    this.setIOSPlaybackSession();
    try {
      if (!this.iosUnlockUrl) {
        this.iosUnlockUrl = createSilentUnlockWavUrl();
      }
      if (!this.iosUnlockUrl) return;

      if (!this.iosUnlockEl) {
        const el = new Audio(this.iosUnlockUrl);
        el.loop = true;
        el.muted = false;
        el.volume = 1;
        el.setAttribute("playsinline", "true");
        el.setAttribute("webkit-playsinline", "true");
        this.iosUnlockEl = el;
      }

      if (this.iosUnlockEl.paused && !this.muted) {
        const p = this.iosUnlockEl.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    } catch {
      // noop
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (this.ctx) return this.ctx;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        this.status = "unavailable";
        this.emit();
        return null;
      }
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;

      const dryGain = ctx.createGain();
      const bandGain = ctx.createGain();

      dryGain.gain.value = 0;
      bandGain.gain.value = 0;

      dryGain.connect(master);
      bandGain.connect(master);
      master.connect(analyser);
      analyser.connect(ctx.destination);

      master.gain.value = this.muted ? 0 : this.duckLevel;

      this.ctx = ctx;
      this.masterGain = master;
      this.dryGain = dryGain;
      this.bandGain = bandGain;
      this.analyser = analyser;

      this.attachVisibilityHandler();
      return ctx;
    } catch {
      this.status = "unavailable";
      this.emit();
      return null;
    }
  }

  private attachVisibilityHandler() {
    if (this.visibilityListenerAttached || typeof document === "undefined") return;
    this.visibilityListenerAttached = true;
    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) {
        this.ctx.suspend().catch(() => {});
        try {
          this.iosUnlockEl?.pause();
        } catch {
          // noop
        }
      } else if (!this.muted && this.status !== "unavailable") {
        this.ctx.resume().catch(() => {});
        if (this.isComparisonRunning) {
          this.unlockIOSHardwareMuteSync();
        }
      }
    });
  }

  /**
   * 100% SÍNCRONO — Chamar diretamente no pointerdown/touchstart/click da Cena 1.
   * Força áudio em todos os dispositivos (incluindo iPhone no modo silencioso).
   */
  public unlockAndPlayStinger(): void {
    this.muted = false;
    this.duckLevel = 1;
    this.unlockIOSHardwareMuteSync();

    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    try {
      if (ctx.state !== "running") {
        void ctx.resume();
      }

      // Sintetiza o stinger sincronamente (< 4ms) para tocar na MESMA stack do gesto!
      if (!this.stingerBuffer) {
        this.stingerBuffer = this.synthesizeStingerSync(ctx);
      }

      this.masterGain.gain.setValueAtTime(1, ctx.currentTime);

      const src = ctx.createBufferSource();
      src.buffer = this.stingerBuffer;
      const g = ctx.createGain();
      g.gain.value = 1.0;
      src.connect(g);
      g.connect(this.masterGain);
      src.start(0);

      this.status = "unlocked";
      this.emit();

      // Pré-sintetiza o par sincronizado da Cena 3 em segundo plano logo após o stinger iniciar
      window.setTimeout(() => {
        if (this.ctx && (!this.dryBuffer || !this.bandBuffer)) {
          this.prepareComparisonBuffersSync(this.ctx);
        }
      }, 60);
    } catch {
      this.status = "unavailable";
      this.emit();
    }
  }

  /**
   * 100% SÍNCRONO — Chamado no toque da Cena 2 (escolha Alto Eb vs Tenor Bb).
   * Toca frase de sax real + pré-inicia silenciosamente o loop da Cena 3 dentro do gesto!
   */
  public playSaxChoiceAndWarmComparison(sax: SaxChoice): void {
    this.unlockIOSHardwareMuteSync();
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    try {
      if (ctx.state !== "running") {
        void ctx.resume();
      }

      // 1. Toca frase característica quente (Alto Eb brilhante / Tenor Bb encorpado)
      if (!this.muted) {
        const now = ctx.currentTime;
        const freqs = sax === "alto" ? [440.0, 523.25, 659.25] : [196.0, 233.08, 293.66];
        freqs.forEach((f, idx) => {
          const start = now + idx * 0.13;
          const noteDur = idx === freqs.length - 1 ? 0.72 : 0.22;

          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc1.type = "sawtooth";
          osc2.type = "triangle";
          osc1.frequency.setValueAtTime(f, start);
          osc2.frequency.setValueAtTime(f * 2, start);

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(sax === "alto" ? 2300 : 1550, start);
          filter.Q.value = 2.0;

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(0.26, start + 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + noteDur);

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);

          osc1.start(start);
          osc2.start(start);
          osc1.stop(start + noteDur + 0.03);
          osc2.stop(start + noteDur + 0.03);
        });
      }

      // 2. Pré-inicia o loop sincronizado da Cena 3 em volume 0 DENTRO deste gesto de toque!
      // Assim, quando a Cena 3 abrir 1.2s depois, o áudio JÁ está rodando sem depender de gesto novo!
      this.startComparisonNodesSilentSync(ctx);
    } catch {
      // noop
    }
  }

  private prepareComparisonBuffersSync(ctx: AudioContext): void {
    if (this.dryBuffer && this.bandBuffer) return;
    const pair = this.synthesizeSyncedJazzPair(ctx);
    this.dryBuffer = pair.dry;
    this.bandBuffer = pair.band;

    // Se houver MP3s externos pré-carregados no config, substitui assincronamente
    if (this.prefetchedRaw.dry && this.prefetchedRaw.band) {
      Promise.all([
        ctx.decodeAudioData(this.prefetchedRaw.dry.slice(0)),
        ctx.decodeAudioData(this.prefetchedRaw.band.slice(0)),
      ])
        .then(([d, b]) => {
          this.dryBuffer = d;
          this.bandBuffer = b;
        })
        .catch(() => {});
    }
  }

  private startComparisonNodesSilentSync(ctx: AudioContext): void {
    this.prepareComparisonBuffersSync(ctx);
    if (!this.dryBuffer || !this.bandBuffer || !this.dryGain || !this.bandGain) return;

    this.stopComparison();

    const startAt = ctx.currentTime + 0.02;
    const drySrc = ctx.createBufferSource();
    drySrc.buffer = this.dryBuffer;
    drySrc.loop = true;

    const bandSrc = ctx.createBufferSource();
    bandSrc.buffer = this.bandBuffer;
    bandSrc.loop = true;

    drySrc.connect(this.dryGain);
    bandSrc.connect(this.bandGain);

    this.dryGain.gain.setValueAtTime(0, ctx.currentTime);
    this.bandGain.gain.setValueAtTime(0, ctx.currentTime);

    drySrc.start(startAt);
    bandSrc.start(startAt);

    this.drySource = drySrc;
    this.bandSource = bandSrc;
    this.isComparisonRunning = true;
    this.comparisonAudible = false;
  }

  /** Revela o som da Cena 3 imediatamente (ou inicia caso o usuário tenha pulado direto) */
  public revealComparison(initialMix = 0): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      if (ctx.state !== "running") {
        void ctx.resume();
      }
      if (!this.isComparisonRunning) {
        this.startComparisonNodesSilentSync(ctx);
      }

      this.duckLevel = 1;
      this.comparisonAudible = true;
      this.applyMasterGain(0.05);
      this.setMix(initialMix, false);

      this.status = "playing";
      this.emit();
    } catch {
      // noop
    }
  }

  /** Garante áudio ativo no toque/arraste do slider na Cena 3 */
  public ensurePlayingOnGesture(mix: number): void {
    this.unlockIOSHardwareMuteSync();
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (ctx.state !== "running") {
      void ctx.resume();
    }
    if (!this.isComparisonRunning) {
      this.startComparisonNodesSilentSync(ctx);
    }
    this.comparisonAudible = true;
    this.setMix(mix, false);
  }

  /** Crossfade equal-power real: cos(x * PI/2) para solo seco e sin(x * PI/2) para banda */
  public setMix(value: number, immediate = false): void {
    const clamped = Math.max(0, Math.min(1, value));
    this.currentMix = clamped;
    if (!this.ctx || !this.dryGain || !this.bandGain) return;

    if (this.ctx.state !== "running" && !this.muted) {
      void this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const dryLevel = this.comparisonAudible ? Math.cos(clamped * Math.PI * 0.5) * 0.96 : 0;
    const bandLevel = this.comparisonAudible ? Math.sin(clamped * Math.PI * 0.5) * 1.0 : 0;

    if (immediate) {
      this.dryGain.gain.setValueAtTime(dryLevel, now);
      this.bandGain.gain.setValueAtTime(bandLevel, now);
    } else {
      this.dryGain.gain.setTargetAtTime(dryLevel, now, 0.03);
      this.bandGain.gain.setTargetAtTime(bandLevel, now, 0.03);
    }
  }

  public setDucking(level: number, timeConstant = 0.25): void {
    this.duckLevel = Math.max(0, Math.min(1, level));
    this.applyMasterGain(timeConstant);
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    if (mute) {
      try {
        this.iosUnlockEl?.pause();
      } catch {
        // noop
      }
    } else {
      this.unlockIOSHardwareMuteSync();
      if (this.ctx && this.ctx.state !== "running") {
        void this.ctx.resume();
      }
    }
    this.applyMasterGain(0.04);
    this.emit();
  }

  public toggleMute(): boolean {
    const next = !this.muted;
    this.setMuted(next);
    return next;
  }

  private applyMasterGain(timeConstant = 0.06) {
    if (!this.ctx || !this.masterGain) return;
    const target = this.muted ? 0 : this.duckLevel;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, timeConstant);
  }

  public stopComparison(): void {
    try {
      this.drySource?.stop();
      this.drySource?.disconnect();
    } catch {
      // noop
    }
    try {
      this.bandSource?.stop();
      this.bandSource?.disconnect();
    } catch {
      // noop
    }
    this.drySource = null;
    this.bandSource = null;
    this.isComparisonRunning = false;
    this.comparisonAudible = false;
  }

  /* ========================================================================
     SÍNTESE MUSICAL ESTÚDIO OTIMIZADA PARA ALTO-FALANTES DE CELULAR
     ======================================================================== */

  private synthesizeStingerSync(ctx: AudioContext): AudioBuffer {
    const sr = ctx.sampleRate;
    const dur = 0.92;
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(2, len, sr);
    const L = buf.getChannelData(0);
    const R = buf.getChannelData(1);

    // Acorde dourado brilhante em Ré menor 9 (presença forte em médios para alto-falante de celular)
    const chordFreqs = [220.0, 293.66, 349.23, 440.0, 523.25, 659.25];
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const env = Math.min(1, t / 0.04) * Math.exp(-t * 2.8);
      let sL = 0;
      let sR = 0;
      for (let k = 0; k < chordFreqs.length; k++) {
        const f = chordFreqs[k];
        const phase = 2 * Math.PI * f * t;
        const wave =
          Math.sin(phase) * 0.52 +
          Math.sin(phase * 2) * 0.3 +
          Math.sin(phase * 3) * 0.14;
        const pan = k % 2 === 0 ? 0.62 : 0.38;
        sL += wave * pan;
        sR += wave * (1 - pan);
      }
      const shimmer = (Math.random() * 2 - 1) * Math.exp(-t * 9.0) * 0.09;
      L[i] = Math.tanh((sL * 0.34 + shimmer) * env);
      R[i] = Math.tanh((sR * 0.34 - shimmer * 0.7) * env);
    }
    return buf;
  }

  private synthesizeSyncedJazzPair(ctx: AudioContext): { dry: AudioBuffer; band: AudioBuffer } {
    const sr = ctx.sampleRate;
    const bpm = FUNNEL_CONFIG.audio.bpm;
    const beatSec = 60 / bpm;
    const totalBeats = FUNNEL_CONFIG.audio.loopBars * 4;
    const duration = beatSec * totalBeats;
    const len = Math.floor(sr * duration);

    const dry = ctx.createBuffer(2, len, sr);
    const band = ctx.createBuffer(2, len, sr);

    const dL = dry.getChannelData(0);
    const dR = dry.getChannelData(1);
    const bL = band.getChannelData(0);
    const bR = band.getChannelData(1);

    const saxNotes: Array<{ start: number; dur: number; freq: number }> = [
      { start: 0.0, dur: 1.5, freq: 587.33 },
      { start: 1.5, dur: 0.5, freq: 523.25 },
      { start: 2.0, dur: 1.75, freq: 440.0 },
      { start: 4.0, dur: 1.25, freq: 493.88 },
      { start: 5.25, dur: 0.75, freq: 587.33 },
      { start: 6.0, dur: 1.85, freq: 659.25 },
      { start: 8.0, dur: 1.5, freq: 523.25 },
      { start: 9.5, dur: 0.5, freq: 493.88 },
      { start: 10.0, dur: 1.85, freq: 392.0 },
      { start: 12.0, dur: 1.25, freq: 440.0 },
      { start: 13.25, dur: 0.75, freq: 523.25 },
      { start: 14.0, dur: 1.9, freq: 554.37 },
    ];

    const chords: Array<{ start: number; dur: number; bass: number; notes: number[] }> = [
      { start: 0, dur: 4, bass: 110.0, notes: [220.0, 261.63, 329.63, 349.23, 440.0] },
      { start: 4, dur: 4, bass: 98.0, notes: [196.0, 246.94, 329.63, 349.23, 493.88] },
      { start: 8, dur: 4, bass: 130.81, notes: [196.0, 246.94, 293.66, 329.63, 392.0] },
      { start: 12, dur: 4, bass: 110.0, notes: [196.0, 233.08, 277.18, 329.63, 440.0] },
    ];

    for (const note of saxNotes) {
      const startSample = Math.floor(note.start * beatSec * sr);
      const durSamples = Math.floor(note.dur * beatSec * sr);
      for (let j = 0; j < durSamples; j++) {
        const idx = startSample + j;
        if (idx >= len) break;
        const lt = j / sr;
        const norm = j / durSamples;
        const attack = Math.min(1, lt / 0.055);
        const release = norm > 0.82 ? (1 - norm) / 0.18 : 1;
        const env = attack * release;

        const vibDepth = Math.min(1, Math.max(0, (lt - 0.14) / 0.25)) * 0.009;
        const f = note.freq * (1 + Math.sin(2 * Math.PI * 5.2 * lt) * vibDepth);
        const p = 2 * Math.PI * f * lt;

        // Timbre rico e audível em alto-falantes de celular
        const reed =
          Math.sin(p) * 0.48 +
          Math.sin(p * 2) * 0.3 +
          Math.sin(p * 3) * 0.15 +
          Math.sin(p * 4) * 0.07;
        const breath = (Math.random() * 2 - 1) * 0.02 * attack;
        const saxSample = (reed + breath) * env * 0.48;

        dL[idx] += saxSample * 0.94;
        dR[idx] += saxSample * 0.94;
        bL[idx] += saxSample * 1.0;
        bR[idx] += saxSample * 0.96;
      }
    }

    for (const chord of chords) {
      const startSample = Math.floor(chord.start * beatSec * sr);
      const durSamples = Math.floor(chord.dur * beatSec * sr);

      for (let j = 0; j < durSamples; j++) {
        const idx = startSample + j;
        if (idx >= len) break;
        const lt = j / sr;
        const norm = j / durSamples;
        const padEnv = Math.min(1, lt / 0.07) * (norm > 0.9 ? (1 - norm) / 0.1 : 1) * Math.exp(-lt * 0.28);

        let rhodesL = 0;
        let rhodesR = 0;
        const trem = 0.88 + 0.12 * Math.sin(2 * Math.PI * 3.1 * lt);
        for (let n = 0; n < chord.notes.length; n++) {
          const nf = chord.notes[n];
          const ph = 2 * Math.PI * nf * lt;
          const tone = Math.sin(ph) * 0.68 + Math.sin(ph * 2) * 0.22 * Math.exp(-lt * 2.0);
          if (n % 2 === 0) {
            rhodesL += tone * 0.135;
            rhodesR += tone * 0.085;
          } else {
            rhodesL += tone * 0.085;
            rhodesR += tone * 0.135;
          }
        }

        const beatLocal = (lt / beatSec) % 1;
        const beatIndex = Math.floor(lt / beatSec);
        const bassMult = beatIndex === 2 ? 1.5 : beatIndex === 3 ? 1.25 : 1.0;
        const bf = chord.bass * bassMult;
        const bassEnv = Math.min(1, beatLocal / 0.025) * Math.exp(-beatLocal * 3.2);
        // Harmônico de baixo reforçado para ser ouvido claramente até no alto-falante do celular
        const bassWave =
          (Math.sin(2 * Math.PI * bf * lt) * 0.62 +
            Math.sin(4 * Math.PI * bf * lt) * 0.38) *
          bassEnv *
          0.38;

        let drum = 0;
        if (beatIndex === 0 || beatIndex === 2) {
          const kickPitch = 62 + 75 * Math.exp(-beatLocal * 26);
          drum += Math.sin(2 * Math.PI * kickPitch * beatLocal * beatSec) * Math.exp(-beatLocal * 13) * 0.28;
        }
        const brush =
          (Math.random() * 2 - 1) *
          Math.exp(-beatLocal * (beatIndex % 2 === 1 ? 6.0 : 15)) *
          (beatIndex % 2 === 1 ? 0.085 : 0.035);

        bL[idx] += rhodesL * padEnv * trem + bassWave + drum + brush;
        bR[idx] += rhodesR * padEnv * (1.76 - trem) + bassWave + drum - brush * 0.85;
      }
    }

    const delaySamples = Math.floor(sr * 0.068);
    const delaySamples2 = Math.floor(sr * 0.112);
    const edgeFade = Math.floor(sr * 0.025);

    for (let i = 0; i < len; i++) {
      if (i >= delaySamples) {
        bL[i] += bR[i - delaySamples] * 0.18;
        bR[i] += bL[i - delaySamples] * 0.16;
      }
      if (i >= delaySamples2) {
        bL[i] += bL[i - delaySamples2] * 0.09;
        bR[i] += bR[i - delaySamples2] * 0.09;
      }

      let edge = 1;
      if (i < edgeFade) edge = i / edgeFade;
      else if (i > len - edgeFade) edge = (len - i) / edgeFade;

      dL[i] = Math.tanh(dL[i] * 1.15 * edge);
      dR[i] = Math.tanh(dR[i] * 1.15 * edge);
      bL[i] = Math.tanh(bL[i] * 1.05 * edge);
      bR[i] = Math.tanh(bR[i] * 1.05 * edge);
    }

    return { dry, band };
  }
}

export const audioEngine = new InterativoAudioEngine();
