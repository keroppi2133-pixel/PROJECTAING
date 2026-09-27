// Audio manager handling both the real song track (TOGETHER! by Jannabi)
// and romantic Web Audio chime effects

class SoundEffects {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private volume: number = 0.65;
  private isMuted: boolean = false;
  private audioSrc: string = '/audio/together.mp3';

  constructor() {
    // Audio element will be linked once DOM is ready or dynamically created
    if (typeof window !== 'undefined') {
      this.getAudioElement();
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;

    let el = document.getElementById('song') as HTMLAudioElement | null;
    if (!el) {
      el = document.createElement('audio');
      el.id = 'song';
      el.preload = 'auto';
      el.src = this.audioSrc;
      el.loop = true;
      document.body.appendChild(el);
    } else if (!el.src || !el.src.includes('together.mp3')) {
      el.src = this.audioSrc;
      el.loop = true;
    }
    this.audioElement = el;
    this.audioElement.volume = this.isMuted ? 0 : this.volume;
    return this.audioElement;
  }

  // Keypad tap chime
  playKeyTap(frequency = 520) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.7, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio context might be restricted
    }
  }

  // Shaking error sound
  playErrorTone() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(110, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // ignore
    }
  }

  // Romantic unlock fanfare / fairy chime
  playUnlockChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const time = this.ctx!.currentTime + idx * 0.09;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(this.volume * 0.35, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(time);
        osc.stop(time + 0.6);
      });
    } catch {
      // ignore
    }
  }

  // Heart burst sparkle
  playSparkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [880, 1174.66, 1396.91, 1760];
      freqs.forEach((f, i) => {
        const time = this.ctx!.currentTime + i * 0.05;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);
        gain.gain.setValueAtTime(this.volume * 0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(time);
        osc.stop(time + 0.3);
      });
    } catch {
      // ignore
    }
  }

  // Play TOGETHER! audio track
  startMusic(): Promise<void> {
    this.initCtx();
    const audio = this.getAudioElement();
    if (!audio) return Promise.resolve();

    audio.volume = this.isMuted ? 0 : this.volume;
    return audio
      .play()
      .then(() => {
        this.isMusicPlaying = true;
      })
      .catch(err => {
        console.warn('Autoplay prevented or pending user interaction:', err);
      });
  }

  stopMusic() {
    const audio = this.getAudioElement();
    if (audio) {
      audio.pause();
    }
    this.isMusicPlaying = false;
  }

  resetMusic() {
    const audio = this.getAudioElement();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.isMusicPlaying = false;
  }

  toggleMusic(): boolean {
    const audio = this.getAudioElement();
    if (!audio) return false;

    if (!audio.paused && this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  getIsPlaying(): boolean {
    const audio = this.getAudioElement();
    return audio ? !audio.paused : this.isMusicPlaying;
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    const audio = this.getAudioElement();
    if (audio && !this.isMuted) {
      audio.volume = this.volume;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    const audio = this.getAudioElement();
    if (audio) {
      audio.volume = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundManager = new SoundEffects();
