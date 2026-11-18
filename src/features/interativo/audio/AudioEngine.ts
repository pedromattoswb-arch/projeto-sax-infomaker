import { FUNNEL_CONFIG } from "../funnel.config";

export type AudioStatus = "idle" | "unlocked" | "playing" | "unavailable";

const MUTE_STORAGE_KEY = "cs_interativo_muted";

/**
 * Motor de Áudio Cinematográfico (Web Audio API)
 * - Suporta carregamento de MP3s externos configurados em FUNNEL_CONFIG.audio (<= 250KB).
 * - Quando os MP3s ainda estão em modo placeholder, gera via OfflineAudioContext duas trilhas
 *   100% sincronizadas no mesmo BPM (84 BPM, 4 compassos = 11.428s, loop sem clique):
 *   1) solo-seco: saxofone melódico quente e seco num quarto silencioso;
 *   2) solo-banda: o MESMO solo de sax + Rhodes jazz chords + baixo acústico + bateria escovada + hall.
 * - Crossfade equal-power real (cos/sin) via dois GainNodes ligados ao AnalyserNode (fftSize=256).
 * - Pausa automaticamente em visibilitychange, respeita mudo persistente e faz ducking suave na Cena 4/Oferta.
 */
class InterativoAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private bandGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  private stingerBuffer: AudioBuffer | null = null;
  private dryBuffer: AudioBuffer | null = null;
  private bandBuffer: AudioBuffer | null = null;

  private drySource: AudioBufferSourceNode | null = null;
  private bandSource: AudioBufferSourceNode | null = null;

  private prefetchedRaw: Partial<Record<"stinger" | "dry" | "band", ArrayBuffer>> = {};
  private status: AudioStatus = "idle";
  private muted: boolean = false;
  private currentMix = 0; // 0 = Sozinho, 1 = Com banda
  private duckLevel = 1; // 1 = full, 0.25 = ducked, 0 = faded out
  private isComparisonRunning = false;
  private visibilityListenerAttached = false;
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.muted = sessionStorage.getItem(MUTE_STORAGE_KEY) === "1";
      } catch {
        this.muted = false;
      }
    }
  }

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

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getFrequencyData(target: Uint8Array): boolean {
    if (!this.analyser || this.muted || this.status === "unavailable" || !this.isComparisonRunning) {
      return false;
    }
    this.analyser.getByteFrequencyData(target);
    return true;
  }

  /** Inicia prefetch dos MP3s opcionais assim que a Cena 1 renderiza */
  public preload(): void {
    if (typeof window === "undefined" || typeof fetch !== "function") return;
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
        .catch(() => {
          console.warn(`[AudioEngine] Falha ao pré-carregar ${url}; usando fallback sintetizado.`);
        });
    });
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
      } else if (!this.muted && this.status !== "unavailable") {
        this.ctx.resume().catch(() => {});
      }
    });
  }

  /** Deve ser chamado dentro do primeiro gesto do usuário (toque na Cena 1) */
  public async unlockAndPlayStinger(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      this.status = "unlocked";
      this.emit();

      // Decodifica ou sintetiza stinger imediatamente
      if (!this.stingerBuffer) {
        this.stingerBuffer = await this.loadOrSynthesizeStinger(ctx);
      }

      if (this.stingerBuffer && !this.muted && this.masterGain) {
        const src = ctx.createBufferSource();
        src.buffer = this.stingerBuffer;
        const stingerGain = ctx.createGain();
        stingerGain.gain.value = 0.85;
        src.connect(stingerGain);
        stingerGain.connect(this.masterGain);
        src.start(ctx.currentTime);
      }

      // Em paralelo, prepara buffers sincronizados para a Cena 3
      void this.prepareComparisonBuffers(ctx);
      return true;
    } catch {
      this.status = "unavailable";
      this.emit();
      return false;
    }
  }

  private async prepareComparisonBuffers(ctx: AudioContext): Promise<void> {
    if (this.dryBuffer && this.bandBuffer) return;

    try {
      if (this.prefetchedRaw.dry && this.prefetchedRaw.band) {
        const [d, b] = await Promise.all([
          ctx.decodeAudioData(this.prefetchedRaw.dry.slice(0)),
          ctx.decodeAudioData(this.prefetchedRaw.band.slice(0)),
        ]);
        this.dryBuffer = d;
        this.bandBuffer = b;
        return;
      }
    } catch {
      console.warn("[AudioEngine] Erro ao decodificar MP3s externos; usando estúdio sintetizado.");
    }

    const pair = this.synthesizeSyncedJazzPair(ctx);
    this.dryBuffer = pair.dry;
    this.bandBuffer = pair.band;
  }

  /** Inicia as duas faixas da Cena 3 sincronizadas no mesmo currentTime */
  public async startComparison(initialMix = 0): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      await this.prepareComparisonBuffers(ctx);
      if (!this.dryBuffer || !this.bandBuffer || !this.dryGain || !this.bandGain) {
        return false;
      }

      this.stopComparison();

      const startAt = ctx.currentTime + 0.04;
      const drySrc = ctx.createBufferSource();
      drySrc.buffer = this.dryBuffer;
      drySrc.loop = true;

      const bandSrc = ctx.createBufferSource();
      bandSrc.buffer = this.bandBuffer;
      bandSrc.loop = true;

      drySrc.connect(this.dryGain);
      bandSrc.connect(this.bandGain);

      this.duckLevel = 1;
      this.applyMasterGain(0.06);
      this.setMix(initialMix, true);

      drySrc.start(startAt);
      bandSrc.start(startAt);

      this.drySource = drySrc;
      this.bandSource = bandSrc;
      this.isComparisonRunning = true;
      this.status = "playing";
      this.emit();
      return true;
    } catch {
      return false;
    }
  }

  /** Crossfade equal-power: cos(x * PI/2) para solo seco e sin(x * PI/2) para banda */
  public setMix(value: number, immediate = false): void {
    const clamped = Math.max(0, Math.min(1, value));
    this.currentMix = clamped;
    if (!this.ctx || !this.dryGain || !this.bandGain) return;

    const now = this.ctx.currentTime;
    const dryLevel = Math.cos(clamped * Math.PI * 0.5) * 0.92;
    const bandLevel = Math.sin(clamped * Math.PI * 0.5) * 0.98;

    if (immediate) {
      this.dryGain.gain.setValueAtTime(dryLevel, now);
      this.bandGain.gain.setValueAtTime(bandLevel, now);
    } else {
      this.dryGain.gain.setTargetAtTime(dryLevel, now, 0.035);
      this.bandGain.gain.setTargetAtTime(bandLevel, now, 0.035);
    }
  }

  public getMix(): number {
    return this.currentMix;
  }

  /** Ducking suave na Cena 4 e fade-out ao rolar além do Hero da Oferta */
  public setDucking(level: number, timeConstant = 0.25): void {
    this.duckLevel = Math.max(0, Math.min(1, level));
    this.applyMasterGain(timeConstant);
  }

  public setMuted(mute: boolean): void {
    this.muted = mute;
    try {
      sessionStorage.setItem(MUTE_STORAGE_KEY, mute ? "1" : "0");
    } catch {
      // noop
    }
    this.applyMasterGain(0.05);
    this.emit();
  }

  public toggleMute(): boolean {
    const next = !this.muted;
    this.setMuted(next);
    if (!next && this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return next;
  }

  private applyMasterGain(timeConstant = 0.08) {
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
  }

  public dispose(): void {
    this.stopComparison();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
      this.masterGain = null;
      this.dryGain = null;
      this.bandGain = null;
      this.analyser = null;
    }
    this.status = "idle";
  }

  /* ========================================================================
     SÍNTESE MUSICAL ESTÚDIO (PLACEHOLDER ZERO-ERRO / ZERO-CLIQUES)
     Substituído automaticamente assim que MP3s forem preenchidos no config.
     ======================================================================== */

  private async loadOrSynthesizeStinger(ctx: AudioContext): Promise<AudioBuffer> {
    if (this.prefetchedRaw.stinger) {
      try {
        return await ctx.decodeAudioData(this.prefetchedRaw.stinger.slice(0));
      } catch {
        // fallback sintetizado
      }
    }

    const sr = ctx.sampleRate;
    const dur = 0.95;
    const len = Math.floor(sr * dur);
    const buf = ctx.createBuffer(2, len, sr);
    const L = buf.getChannelData(0);
    const R = buf.getChannelData(1);

    // Acorde quente de metais em Ré menor 9 (D3, F3, A3, C4, E4) com swell dourado
    const chordFreqs = [146.83, 220.0, 261.63, 329.63, 349.23, 587.33];
    for (let i = 0; i < len; i++) {
      const t = i / sr;
      const env = Math.min(1, t / 0.055) * Math.exp(-t * 3.1);
      let sL = 0;
      let sR = 0;
      for (let k = 0; k < chordFreqs.length; k++) {
        const f = chordFreqs[k];
        const phase = 2 * Math.PI * f * t;
        // Timbre rico de brass (fundamental + 2º + 3º harmônicos quentes)
        const wave =
          Math.sin(phase) * 0.55 +
          Math.sin(phase * 2) * 0.28 +
          Math.sin(phase * 3) * 0.12;
        const pan = k % 2 === 0 ? 0.62 : 0.38;
        sL += wave * pan;
        sR += wave * (1 - pan);
      }
      // Subtle cymbal shimmer on attack
      const shimmer = (Math.random() * 2 - 1) * Math.exp(-t * 9.5) * 0.08;
      L[i] = Math.tanh((sL * 0.22 + shimmer) * env);
      R[i] = Math.tanh((sR * 0.22 - shimmer * 0.7) * env);
    }
    return buf;
  }

  private synthesizeSyncedJazzPair(ctx: AudioContext): { dry: AudioBuffer; band: AudioBuffer } {
    const sr = ctx.sampleRate;
    const bpm = FUNNEL_CONFIG.audio.bpm; // 84 BPM
    const beatSec = 60 / bpm;
    const totalBeats = FUNNEL_CONFIG.audio.loopBars * 4; // 16 tempos (~11.43s)
    const duration = beatSec * totalBeats;
    const len = Math.floor(sr * duration);

    const dry = ctx.createBuffer(2, len, sr);
    const band = ctx.createBuffer(2, len, sr);

    const dL = dry.getChannelData(0);
    const dR = dry.getChannelData(1);
    const bL = band.getChannelData(0);
    const bR = band.getChannelData(1);

    // Frase expressiva de balada jazz para Sax em Dm9 -> G13 -> Cmaj9 -> A7alt
    const saxNotes: Array<{ start: number; dur: number; freq: number }> = [
      { start: 0.0, dur: 1.5, freq: 587.33 }, // D5
      { start: 1.5, dur: 0.5, freq: 523.25 }, // C5
      { start: 2.0, dur: 1.75, freq: 440.0 }, // A4
      { start: 4.0, dur: 1.25, freq: 493.88 }, // B4
      { start: 5.25, dur: 0.75, freq: 587.33 }, // D5
      { start: 6.0, dur: 1.85, freq: 659.25 }, // E5
      { start: 8.0, dur: 1.5, freq: 523.25 }, // C5
      { start: 9.5, dur: 0.5, freq: 493.88 }, // B4
      { start: 10.0, dur: 1.85, freq: 392.0 }, // G4
      { start: 12.0, dur: 1.25, freq: 440.0 }, // A4
      { start: 13.25, dur: 0.75, freq: 523.25 }, // C5
      { start: 14.0, dur: 1.9, freq: 554.37 }, // C#5 -> resolve p/ D5 no loop
    ];

    // Acordes Rhodes + Baixo Acústico (4 compassos)
    const chords: Array<{ start: number; dur: number; bass: number; notes: number[] }> = [
      { start: 0, dur: 4, bass: 73.42, notes: [220.0, 261.63, 329.63, 349.23] }, // Dm9
      { start: 4, dur: 4, bass: 98.0, notes: [196.0, 246.94, 329.63, 349.23] }, // G13
      { start: 8, dur: 4, bass: 65.41, notes: [196.0, 246.94, 293.66, 329.63] }, // Cmaj9
      { start: 12, dur: 4, bass: 110.0, notes: [196.0, 233.08, 277.18, 329.63] }, // A7b9
    ];

    // 1. Renderiza melodia do Sax (idêntica em tempo e afinação nas duas faixas!)
    for (const note of saxNotes) {
      const startSample = Math.floor(note.start * beatSec * sr);
      const durSamples = Math.floor(note.dur * beatSec * sr);
      for (let j = 0; j < durSamples; j++) {
        const idx = startSample + j;
        if (idx >= len) break;
        const lt = j / sr;
        const norm = j / durSamples;
        const attack = Math.min(1, lt / 0.065);
        const release = norm > 0.82 ? (1 - norm) / 0.18 : 1;
        const env = attack * release;

        // Vibrato natural de saxofone entrando após 0.18s
        const vibDepth = Math.min(1, Math.max(0, (lt - 0.14) / 0.25)) * 0.0085;
        const f = note.freq * (1 + Math.sin(2 * Math.PI * 5.2 * lt) * vibDepth);
        const p = 2 * Math.PI * f * lt;

        // Timbre quente de palheta (reed)
        const reed =
          Math.sin(p) * 0.52 +
          Math.sin(p * 2) * 0.28 +
          Math.sin(p * 3) * 0.14 +
          Math.sin(p * 4) * 0.06;
        const breath = (Math.random() * 2 - 1) * 0.018 * attack;
        const saxSample = (reed + breath) * env * 0.34;

        // Faixa SECA (mono-centralizada, mais intimista e crua)
        dL[idx] += saxSample * 0.88;
        dR[idx] += saxSample * 0.88;

        // Faixa COM BANDA (sax encorpado + leve ambiência estéreo)
        bL[idx] += saxSample * 0.96;
        bR[idx] += saxSample * 0.92;
      }
    }

    // 2. Renderiza Banda de Estúdio APENAS na faixa `band` (Rhodes + Contrabaixo + Bateria Escovada)
    for (const chord of chords) {
      const startSample = Math.floor(chord.start * beatSec * sr);
      const durSamples = Math.floor(chord.dur * beatSec * sr);

      for (let j = 0; j < durSamples; j++) {
        const idx = startSample + j;
        if (idx >= len) break;
        const lt = j / sr;
        const norm = j / durSamples;
        const padEnv = Math.min(1, lt / 0.08) * (norm > 0.9 ? (1 - norm) / 0.1 : 1) * Math.exp(-lt * 0.32);

        // Rhodes elétrico quente com tremolo sutil estéreo
        let rhodesL = 0;
        let rhodesR = 0;
        const trem = 0.88 + 0.12 * Math.sin(2 * Math.PI * 3.1 * lt);
        for (let n = 0; n < chord.notes.length; n++) {
          const nf = chord.notes[n];
          const ph = 2 * Math.PI * nf * lt;
          const tone = Math.sin(ph) * 0.72 + Math.sin(ph * 2) * 0.16 * Math.exp(-lt * 2.5);
          if (n % 2 === 0) {
            rhodesL += tone * 0.11;
            rhodesR += tone * 0.07;
          } else {
            rhodesL += tone * 0.07;
            rhodesR += tone * 0.11;
          }
        }

        // Contrabaixo acústico tocando em semínimas quentes (walking/ballad feel)
        const beatLocal = (lt / beatSec) % 1;
        const beatIndex = Math.floor(lt / beatSec);
        const bassMult = beatIndex === 2 ? 1.5 : beatIndex === 3 ? 1.25 : 1.0;
        const bf = chord.bass * bassMult;
        const bassEnv = Math.min(1, beatLocal / 0.03) * Math.exp(-beatLocal * 3.4);
        const bassWave =
          (Math.sin(2 * Math.PI * bf * lt) * 0.78 + Math.sin(4 * Math.PI * bf * lt) * 0.22) *
          bassEnv *
          0.32;

        // Bumbo suave nos tempos 1 e 3 + vassourinha jazz (brush ride) nos tempos 2 e 4
        let drum = 0;
        if (beatIndex === 0 || beatIndex === 2) {
          const kickPitch = 52 + 65 * Math.exp(-beatLocal * 28);
          drum += Math.sin(2 * Math.PI * kickPitch * beatLocal * beatSec) * Math.exp(-beatLocal * 14) * 0.22;
        }
        const brush =
          (Math.random() * 2 - 1) *
          Math.exp(-beatLocal * (beatIndex % 2 === 1 ? 6.5 : 16)) *
          (beatIndex % 2 === 1 ? 0.055 : 0.025);

        bL[idx] += rhodesL * padEnv * trem + bassWave + drum + brush;
        bR[idx] += rhodesR * padEnv * (1.76 - trem) + bassWave + drum - brush * 0.85;
      }
    }

    // 3. Leve reverb de clube de jazz na faixa `band` + micro-fade nas bordas (loop 100% sem clique)
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

      dL[i] = Math.tanh(dL[i] * edge);
      dR[i] = Math.tanh(dR[i] * edge);
      bL[i] = Math.tanh(bL[i] * 0.92 * edge);
      bR[i] = Math.tanh(bR[i] * 0.92 * edge);
    }

    return { dry, band };
  }
}

export const audioEngine = new InterativoAudioEngine();
