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
    case 'babble':
      break; // Conversations stay visual; no droning vowel synth.
    case 'note':
    case 'glue':
    case 'bounce':
      pyshkaNote(e);
      break;
    case 'splat':
      blip(160, 90, 0.1, 'triangle', 0.05);
      break;
    case 'pad':
      blip(300, 600, 0.15, 'sine', 0.1);
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
    case 'pickup':
    case 'deliver':
      blip(660, 1320, 0.15, 'triangle', 0.12);
      setTimeout(() => blip(880, 1760, 0.2, 'triangle', 0.12), 120);
      break;
    case 'built':
    case 'trick':
      [392, 523, 659, 784].forEach((f, i) => setTimeout(() => blip(f, f * 1.5, 0.18, 'triangle', 0.12), i * 90));
      break;
    case 'mount':
      blip(80, 160, 0.4, 'sawtooth', 0.07);
      break;
    case 'dismount':
      blip(300, 200, 0.1, 'sine', 0.06);
      break;
    case 'win':
      [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => blip(f, f, 0.25, 'triangle', 0.12), i * 150));
      break;
  }
}

// C major pentatonic, C4–A5. Every creature keeps its own pitch.
const scale = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 784, 880];
const lastNote = new Map<number, number>();
let lastAny = -1;
function pyshkaNote(e: GameEvent) {
  if (!ctx || e.who === undefined) return;
  const now = ctx.currentTime;
  if (now - (lastNote.get(e.who) ?? -1) < 0.45 || now - lastAny < 0.09) return;
  lastNote.set(e.who, now); lastAny = now;
  const f = scale[e.who % scale.length];
  const notes = e.type === 'bounce' ? [f, f * 1.25, f * 1.5, f * 2] : [e.type === 'glue' ? f / 2 : f];
  notes.forEach((hz, i) => {
    const at = ctx!.currentTime + i * 0.09;
    for (const [ratio, volume] of [[1, 0.065], [2, 0.012]]) {
      const o = ctx!.createOscillator(), g = ctx!.createGain();
      o.type = 'sine'; o.frequency.value = hz * ratio;
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(volume, at + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.65);
      o.connect(g).connect(ctx!.destination); o.start(at); o.stop(at + 0.7);
    }
  });
}
