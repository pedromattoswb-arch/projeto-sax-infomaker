// Synthesize a warm, velvety saxophone-like jazz major-9th arpeggio via Web Audio API
export function playWarmSaxChord(transposeSemitones = 0) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const baseFreqs = [233.08, 349.23, 440.0, 523.25, 587.33];
    const ratio = Math.pow(2, transposeSemitones / 12);

    baseFreqs.forEach((f, idx) => {
      const freq = f * ratio;
      const start = now + idx * 0.085;
      const dur = 1.05;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(freq, start);
      osc2.frequency.setValueAtTime(freq * 1.002, start);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.2;
      lfoGain.gain.value = 2.4;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(380, start);
      filter.frequency.exponentialRampToValueAtTime(1650, start + 0.14);
      filter.frequency.exponentialRampToValueAtTime(750, start + dur);
      filter.Q.value = 2.2;

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.055, start + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(start);
      osc2.start(start);
      lfo.start(start);
      osc1.stop(start + dur + 0.05);
      osc2.stop(start + dur + 0.05);
      lfo.stop(start + dur + 0.05);
    });

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 2200);
  } catch {
    // Ignore audio context errors when blocked
  }
}

export function playSingleSaxNote(freq: number) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const dur = 0.65;

    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    sub.type = "triangle";
    osc.frequency.setValueAtTime(freq * 0.985, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.045);
    sub.frequency.setValueAtTime(freq, now);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = 3.2;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(420, now);
    filter.frequency.exponentialRampToValueAtTime(2100, now + 0.08);
    filter.frequency.exponentialRampToValueAtTime(880, now + dur);
    filter.Q.value = 2.8;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + dur);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    sub.start(now);
    lfo.start(now);
    osc.stop(now + dur + 0.04);
    sub.stop(now + dur + 0.04);
    lfo.stop(now + dur + 0.04);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 900);
  } catch {
    // Ignore if blocked
  }
}
