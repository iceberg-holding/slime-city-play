import { GRAVITY, SNAP_DOWN, STEP_UP } from './constants';
import type { Block, Body, Solid } from './types';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Surface height of a solid at (x, z) (clamped into its footprint). */
export function topAt(s: Solid, x: number, z: number): number {
  if (s.ramp === undefined) return s.maxY;
  let t = 0;
  switch (s.ramp) {
    case 0:
      t = (x - s.minX) / (s.maxX - s.minX);
      break;
    case 1:
      t = (z - s.minZ) / (s.maxZ - s.minZ);
      break;
    case 2:
      t = (s.maxX - x) / (s.maxX - s.minX);
      break;
    case 3:
      t = (s.maxZ - z) / (s.maxZ - s.minZ);
      break;
  }
  return s.minY + (s.maxY - s.minY) * clamp01(t);
}

export function blockSolid(b: Block): Solid {
  const s: Solid = { minX: b.x, minY: b.y, minZ: b.z, maxX: b.x + 1, maxY: b.y + 1, maxZ: b.z + 1 };
  if (b.shape === 'ramp') s.ramp = b.dir;
  return s;
}

const EPS = 1e-6; // touching a face exactly (float noise on grid paths) is not overlapping
function overlapsXZ(s: Solid, x: number, z: number, r: number): boolean {
  return x + r > s.minX + EPS && x - r < s.maxX - EPS && z + r > s.minZ + EPS && z - r < s.maxZ - EPS;
}

export class Collider {
  constructor(
    public statics: Solid[],
    public dynamics: Solid[] = [],
  ) {}

  private get lists(): Solid[][] {
    return [this.statics, this.dynamics];
  }

  /** True if a body footprint at (x,z) with feet at y would intersect a wall. */
  blocked(x: number, z: number, y: number, r: number, h: number): boolean {
    for (const list of this.lists)
      for (const s of list) {
        if (!overlapsXZ(s, x, z, r)) continue;
        if (s.minY >= y + h) continue;
        if (topAt(s, x, z) > y + STEP_UP) return true;
      }
    return false;
  }

  /** Highest walkable surface under the footprint that is at or below maxY. */
  groundAt(x: number, z: number, maxY: number, r: number): number {
    let g = 0;
    for (const list of this.lists)
      for (const s of list) {
        if (!overlapsXZ(s, x, z, r)) continue;
        const t = topAt(s, x, z);
        if (t <= maxY && t > g) g = t;
      }
    return g;
  }

  /** Is the point inside any solid? Returns that solid. */
  pointInside(x: number, y: number, z: number): Solid | null {
    for (const list of this.lists)
      for (const s of list) {
        if (x > s.minX && x < s.maxX && z > s.minZ && z < s.maxZ && y > s.minY && y < topAt(s, x, z)) return s;
      }
    return null;
  }

  /** Ray vs solids (as boxes) — returns distance to first hit or Infinity. */
  raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number): number {
    let best = maxDist;
    for (const s of this.statics) {
      let tmin = 0;
      let tmax = best;
      const o = [ox, oy, oz];
      const d = [dx, dy, dz];
      const mn = [s.minX, s.minY, s.minZ];
      const mx = [s.maxX, s.maxY, s.maxZ];
      let hit = true;
      for (let i = 0; i < 3; i++) {
        if (Math.abs(d[i]) < 1e-8) {
          if (o[i] < mn[i] || o[i] > mx[i]) {
            hit = false;
            break;
          }
        } else {
          let t1 = (mn[i] - o[i]) / d[i];
          let t2 = (mx[i] - o[i]) / d[i];
          if (t1 > t2) [t1, t2] = [t2, t1];
          if (t1 > tmin) tmin = t1;
          if (t2 < tmax) tmax = t2;
          if (tmin > tmax) {
            hit = false;
            break;
          }
        }
      }
      if (hit && tmin < best) best = tmin;
    }
    return best;
  }
}

/** Move a character body with gravity, step-up and wall sliding. Returns true if it bumped a wall. */
export function moveBody(b: Body, dt: number, col: Collider, half: number): boolean {
  let bumped = false;
  const { radius: r, height: h } = b;
  const nx = b.pos.x + b.vel.x * dt;
  if (col.blocked(nx, b.pos.z, b.pos.y, r, h) || Math.abs(nx) > half - r) {
    b.vel.x = 0;
    bumped = true;
  } else b.pos.x = nx;
  const nz = b.pos.z + b.vel.z * dt;
  if (col.blocked(b.pos.x, nz, b.pos.y, r, h) || Math.abs(nz) > half - r) {
    b.vel.z = 0;
    bumped = true;
  } else b.pos.z = nz;

  const wasGrounded = b.grounded;
  b.vel.y += GRAVITY * dt;
  if (b.vel.y < -40) b.vel.y = -40;
  const ny = b.pos.y + b.vel.y * dt;
  const ground = col.groundAt(b.pos.x, b.pos.z, b.pos.y + STEP_UP, r);
  if (ny <= ground || (wasGrounded && b.vel.y <= 0 && ground >= b.pos.y - SNAP_DOWN)) {
    b.pos.y = ground;
    b.vel.y = 0;
    b.grounded = true;
  } else {
    b.pos.y = ny;
    b.grounded = false;
  }
  return bumped;
}
