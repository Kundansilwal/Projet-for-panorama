import type { BiomeId, SfxType } from '../core/types';
import { worldState } from '../state/session';

/** Procedural audio engine: ambient drone + one-shot SFX via Web Audio API. */
export class AudioDirector {
  private context?: AudioContext;
  private oscillator?: OscillatorNode;
  private gain?: GainNode;
  private targetMusicVolume = 0.03;

  unlock(): void {
    if (!this.context) this.context = new AudioContext();
    void this.context.resume();
  }

  crossfade(biome: BiomeId, tension: number): void {
    this.unlock();
    if (!this.context) return;
    const frequency: Record<BiomeId, number> = { forest: 174, pass: 196, bamboo: 220, cavern: 130, summit: 262 };
    const now = this.context.currentTime;
    this.gain?.gain.linearRampToValueAtTime(0.0001, now + 0.35);
    const oldOsc = this.oscillator;
    if (oldOsc) oldOsc.stop(now + 0.37);

    this.targetMusicVolume = 0.018 + tension * 0.018;
    const vol = worldState.musicEnabled ? this.targetMusicVolume : 0.0001;

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.45);
    gain.connect(this.context.destination);
    const oscillator = this.context.createOscillator();
    oscillator.type = tension > 0.55 ? 'triangle' : 'sine';
    oscillator.frequency.value = frequency[biome] * (1 + tension * 0.12);
    oscillator.connect(gain); oscillator.start();
    this.oscillator = oscillator; this.gain = gain;
  }

  setMusicEnabled(enabled: boolean): void {
    if (!this.gain || !this.context) return;
    const now = this.context.currentTime;
    this.gain.gain.linearRampToValueAtTime(enabled ? this.targetMusicVolume : 0.0001, now + 0.3);
  }

  playSfx(type: SfxType): void {
    if (!worldState.sfxEnabled) return;
    this.unlock();
    if (!this.context) return;
    const ctx = this.context;
    const now = ctx.currentTime;

    const playTone = (freq: number, duration: number, wave: OscillatorType, vol: number, delay = 0) => {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now + delay);
      g.gain.linearRampToValueAtTime(vol, now + delay + 0.015);
      g.gain.linearRampToValueAtTime(0.0001, now + delay + duration);
      g.connect(ctx.destination);
      const o = ctx.createOscillator();
      o.type = wave;
      o.frequency.setValueAtTime(freq, now + delay);
      o.connect(g);
      o.start(now + delay);
      o.stop(now + delay + duration + 0.02);
    };

    switch (type) {
      case 'click':
        playTone(880, 0.06, 'sine', 0.08);
        playTone(1100, 0.04, 'sine', 0.05, 0.03);
        break;
      case 'shrine':
        playTone(523, 0.3, 'sine', 0.07);
        playTone(659, 0.25, 'sine', 0.06, 0.12);
        playTone(784, 0.35, 'sine', 0.05, 0.25);
        break;
      case 'gate-open':
        playTone(330, 0.2, 'triangle', 0.07);
        playTone(440, 0.2, 'triangle', 0.06, 0.1);
        playTone(550, 0.3, 'triangle', 0.05, 0.2);
        playTone(660, 0.35, 'sine', 0.04, 0.3);
        break;
      case 'gate-choose':
        playTone(440, 0.15, 'sine', 0.08);
        playTone(554, 0.15, 'sine', 0.07, 0.08);
        playTone(660, 0.2, 'sine', 0.06, 0.16);
        playTone(880, 0.3, 'sine', 0.05, 0.24);
        break;
      case 'transition':
        playTone(220, 0.4, 'sine', 0.04);
        playTone(165, 0.5, 'sine', 0.03, 0.2);
        break;
      case 'ending':
        playTone(523, 0.3, 'sine', 0.07);
        playTone(659, 0.3, 'sine', 0.06, 0.2);
        playTone(784, 0.3, 'sine', 0.06, 0.4);
        playTone(1047, 0.5, 'sine', 0.07, 0.6);
        playTone(784, 0.25, 'triangle', 0.04, 0.9);
        playTone(1047, 0.6, 'sine', 0.06, 1.05);
        break;
    }
  }

  dispose(): void { this.oscillator?.stop(); this.oscillator = undefined; this.gain?.disconnect(); this.gain = undefined; }
}
