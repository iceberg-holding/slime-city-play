import type { GameEvent } from '../sim/types';

// Tiny synth blips — no audio files.
let ctx: AudioContext | null = null;

export function unlockAudio() {
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      ctx = null;
    }
  }
  if (ctx && ctx.state === 'suspended') void ctx.resume();
}

function blip(freq: number, to: number, dur: number, type: OscillatorType = 'sine', vol = 0.15) {
  if (!ctx || ctx.state !== 'running') return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function playEvent(e: GameEvent) {
  switch (e.type) {
    case 'shoot':
      blip(500, 200, 0.12, 'triangle', 0.08);
      break;
    case 'glue':
      blip(200, 80, 0.3, 'sawtooth', 0.06);
      break;
    case 'splat':
      blip(160, 90, 0.1, 'triangle', 0.05);
      break;
    case 'pad':
      blip(300, 600, 0.15, 'sine', 0.1);
      break;
    case 'bounce':
      blip(200, 900, 0.35, 'sine', 0.15);
      break;
    case 'bonk':
      blip(120, 60, 0.25, 'square', 0.06);
      break;
    case 'jump':
      blip(300, 500, 0.1, 'sine', 0.06);
      break;
    case 'block':
      blip(220, 180, 0.08, 'square', 0.05);
      break;
    case 'noroom':
      blip(110, 100, 0.12, 'square', 0.05);
      break;
    case 'donut':
      blip(660, 1320, 0.15, 'triangle', 0.12);
      setTimeout(() => blip(880, 1760, 0.2, 'triangle', 0.12), 120);
      break;
    case 'win':
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, f, 0.25, 'triangle', 0.12), i * 150));
      break;
  }
}
