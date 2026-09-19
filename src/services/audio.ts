// Web Audio API ambient sound synthesizer & personal audio player
// Fully offline, zero external dependencies, infinite soothing loop

class AudioEngine {
  private ctx: AudioContext | null = null;
  private ambientGainNode: GainNode | null = null;
  private currentAmbientType: string | null = null;
  private ambientActive = false;
  private ambientNodes: Array<{ stop?: () => void; disconnect: () => void }> = [];

  // Personal track
  private personalAudio: HTMLAudioElement | null = null;
  private personalGain: number = 0.35;
  private personalActive = false;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // --- Ambient Track Methods ---
  public setAmbientVolume(volume: number) {
    if (this.ambientGainNode) {
      this.ambientGainNode.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx?.currentTime || 0, 0.05);
    }
  }

  public playAmbient(type: string, volume: number) {
    this.stopAmbient();
    const ctx = this.initContext();

    this.ambientGainNode = ctx.createGain();
    this.ambientGainNode.gain.setValueAtTime(volume, ctx.currentTime);
    this.ambientGainNode.connect(ctx.destination);

    this.currentAmbientType = type;
    this.ambientActive = true;

    switch (type) {
      case 'rain':
        this.createRainSound(ctx, this.ambientGainNode);
        break;
      case 'fireplace':
        this.createFireplaceSound(ctx, this.ambientGainNode);
        break;
      case 'waves':
        this.createWavesSound(ctx, this.ambientGainNode);
        break;
      case 'whitenoise':
        this.createWhiteNoise(ctx, this.ambientGainNode);
        break;
      case 'cafe':
        this.createCafeSound(ctx, this.ambientGainNode);
        break;
      default:
        this.createWhiteNoise(ctx, this.ambientGainNode);
        break;
    }
  }

  public stopAmbient() {
    this.ambientActive = false;
    this.currentAmbientType = null;
    this.ambientNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.ambientNodes = [];
  }

  public isAmbientPlaying(): boolean {
    return this.ambientActive;
  }

  public getCurrentAmbientType(): string | null {
    return this.currentAmbientType;
  }

  // Synthesizers
  private createWhiteNoise(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make it soft pink/brown noise
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    whiteNoise.connect(filter);
    filter.connect(destination);
    whiteNoise.start(0);

    this.ambientNodes.push(whiteNoise, filter);
  }

  private createRainSound(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'peaking';
    bandpass.frequency.value = 600;
    bandpass.Q.value = 1.2;
    bandpass.gain.value = 4;

    rainSource.connect(filter);
    filter.connect(bandpass);
    bandpass.connect(destination);
    rainSource.start(0);

    this.ambientNodes.push(rainSource, filter, bandpass);
  }

  private createWavesSound(ctx: AudioContext, destination: AudioNode) {
    // Noise source modulated by slow sine LFO
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.04 * white) / 1.04;
      lastOut = output[i];
      output[i] *= 3.0;
    }

    const waveSource = ctx.createBufferSource();
    waveSource.buffer = noiseBuffer;
    waveSource.loop = true;

    const waveFilter = ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.value = 450;

    // LFO to modulate filter frequency slowly (ocean swell)
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12; // 1 wave cycle every ~8 seconds

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 350;

    lfo.connect(lfoGain);
    lfoGain.connect(waveFilter.frequency);

    waveSource.connect(waveFilter);
    waveFilter.connect(destination);

    waveSource.start(0);
    lfo.start(0);

    this.ambientNodes.push(waveSource, waveFilter, lfo, lfoGain);
  }

  private createFireplaceSound(ctx: AudioContext, destination: AudioNode) {
    // Warm low rumble + crackle
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Occasional pops & crackles
      const crackle = Math.random() < 0.003 ? (Math.random() * 2 - 1) * 2.5 : 0;
      output[i] = (Math.random() * 0.2 - 0.1) + crackle;
    }

    const fireSource = ctx.createBufferSource();
    fireSource.buffer = noiseBuffer;
    fireSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 950;

    fireSource.connect(filter);
    filter.connect(destination);
    fireSource.start(0);

    this.ambientNodes.push(fireSource, filter);
  }

  private createCafeSound(ctx: AudioContext, destination: AudioNode) {
    // Multi-layered gentle chatter drone with high shelf dampening
    const bufferSize = 3 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.sin(i * 0.01) * 0.08 + (Math.random() * 0.2 - 0.1);
    }

    const cafeSource = ctx.createBufferSource();
    cafeSource.buffer = noiseBuffer;
    cafeSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 550;
    filter.Q.value = 0.8;

    cafeSource.connect(filter);
    filter.connect(destination);
    cafeSource.start(0);

    this.ambientNodes.push(cafeSource, filter);
  }

  // --- Personal Audio Track Methods ---
  public playPersonalAudio(src: string, volume: number) {
    this.stopPersonalAudio();
    this.personalGain = volume;
    this.personalAudio = new Audio(src);
    this.personalAudio.loop = true;
    this.personalAudio.volume = Math.max(0, Math.min(1, volume));
    this.personalAudio.play().then(() => {
      this.personalActive = true;
    }).catch((err) => {
      console.warn('Personal audio play blocked or error:', err);
    });
  }

  public setPersonalVolume(volume: number) {
    this.personalGain = volume;
    if (this.personalAudio) {
      this.personalAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public stopPersonalAudio() {
    if (this.personalAudio) {
      this.personalAudio.pause();
      this.personalAudio.currentTime = 0;
      this.personalAudio = null;
    }
    this.personalActive = false;
  }

  public isPersonalPlaying(): boolean {
    return this.personalActive && !!this.personalAudio && !this.personalAudio.paused;
  }

  // --- Session Completed Chime ---
  public playCompletionChime() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Gentle maritime bell chime (two harmonious sine tones)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.5); // E5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.1); // G5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.6); // C6

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.1);
      osc1.stop(now + 2.0);
      osc2.stop(now + 2.0);
    } catch {
      // ignore
    }
  }
}

export const audioEngine = new AudioEngine();
