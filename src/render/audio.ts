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
      voice('chat');
      break;
    case 'glue':
      voice('blub');
      blip(200, 80, 0.3, 'sawtooth', 0.06);
      break;
    case 'splat':
      blip(160, 90, 0.1, 'triangle', 0.05);
      break;
    case 'pad':
      blip(300, 600, 0.15, 'sine', 0.1);
      break;
    case 'bounce':
      voice('whee');
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

// Pitch slides through two resonant formants: little vowel-like syllables.
function voice(kind: 'chat' | 'whee' | 'blub') {
  if (!ctx || ctx.state !== 'running') return;
  const ac = ctx;
  const count = kind === 'chat' ? 5 : 3;
  for (let i = 0; i < count; i++) {
    const at = ac.currentTime + i * 0.095;
    const o = ac.createOscillator(), gain = ac.createGain();
    o.type = 'sawtooth';
    const pitch = kind === 'blub' ? 110 : kind === 'whee' ? 420 + i * 110 : 210 + (i % 3) * 90;
    o.frequency.setValueAtTime(pitch, at);
    o.frequency.exponentialRampToValueAtTime(pitch * (kind === 'blub' ? 0.55 : 1.4), at + 0.12);
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(0.035, at + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, at + 0.14);
    for (const hz of [650 + i * 130, 1600 + (i % 2) * 600]) {
      const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = hz; f.Q.value = 5;
      o.connect(f); f.connect(gain);
    }
    gain.connect(ac.destination); o.start(at); o.stop(at + 0.15);
  }
}
