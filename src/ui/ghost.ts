import { GHOST_HZ } from '../sim/constants';
import type { GameState } from '../sim/types';

// Ghost replay of the best run: vehicle x/y/z/yaw sampled at 10 Hz during a race, quantized to int16 and stored
// base64-encoded in localStorage per level (~8 bytes per sample, ~12 kB for a two-minute run).

const CAP = GHOST_HZ * 300; // five minutes
const key = (level: number) => `slimecity.ghost.L${level}`;

export class GhostRecorder {
  private buf = new Int16Array(CAP * 4);
  private n = 0;
  private next = 0;

  reset() {
    this.n = 0;
    this.next = 0;
  }

  /** Call every sim tick while racing; stores a sample each 1/GHOST_HZ seconds of race time. */
  sample(s: GameState) {
    if (s.race.elapsed + 1e-6 < this.next || this.n >= CAP) return;
    const p = s.players[0], v = s.vehicles.find((x) => x.id === p?.riding);
    if (!v) return;
    this.next = (this.n + 1) / GHOST_HZ;
    const yaw = Math.atan2(Math.sin(v.yaw), Math.cos(v.yaw));
    this.buf.set([Math.round(v.pos.x * 10), Math.round(v.pos.y * 20), Math.round(v.pos.z * 10), Math.round(yaw * 10000)], this.n * 4);
    this.n++;
  }

  save(level: number) {
    const bytes = new Uint8Array(this.buf.buffer, 0, this.n * 8);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 4096) bin += String.fromCharCode(...bytes.subarray(i, i + 4096));
    try {
      localStorage.setItem(key(level), JSON.stringify({ v: 1, hz: GHOST_HZ, data: btoa(bin) }));
    } catch {
      /* private mode or full: no ghost */
    }
  }
}

/** Decoded ghost path: Float32Array of [x, y, z, yaw] per sample at GHOST_HZ, or null. */
export function loadGhost(level: number): Float32Array | null {
  try {
    const raw = JSON.parse(localStorage.getItem(key(level)) ?? 'null');
    if (!raw || raw.v !== 1 || raw.hz !== GHOST_HZ) return null;
    const bin = atob(raw.data), bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const q = new Int16Array(bytes.buffer, 0, bytes.length >> 1), out = new Float32Array(q.length);
    for (let i = 0; i < q.length; i += 4) {
      out[i] = q[i] / 10;
      out[i + 1] = q[i + 1] / 20;
      out[i + 2] = q[i + 2] / 10;
      out[i + 3] = q[i + 3] / 10000;
    }
    return out.length >= 8 ? out : null;
  } catch {
    return null;
  }
}
