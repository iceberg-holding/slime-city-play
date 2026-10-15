import { PLAYER_HEIGHT, PLAYER_RADIUS, STEP_UP } from './constants';
import type { Collider } from './physics';
import type { Vec3 } from './types';

// Walkability search over the same collision rules moveBody uses (step-up, falls, walls) — no jumps, blocks or pads.
// Used by tests (and window.__game.reach) to prove every mission part can be reached on foot.

const GRID = 0.5;
/** how close the player's center must get to a part (pickup radius is 1.5) */
export const REACH_DIST = 1.35;

interface Node {
  ix: number;
  iz: number;
  y: number;
  parent: Node | null;
}

const key = (ix: number, iz: number, y: number) => `${ix},${iz},${Math.round(y * 100)}`;

/**
 * Breadth-first search from `from` over grid cells. Returns, for each target, a list of waypoints
 * (player feet positions) ending within REACH_DIST of the target, or null if unreachable.
 */
export function findWalkPaths(col: Collider, half: number, from: Vec3, targets: Vec3[]): (Vec3[] | null)[] {
  const r = PLAYER_RADIUS;
  const h = PLAYER_HEIGHT;
  const cx = (i: number) => (i + 0.5) * GRID;
  const sx = Math.floor(from.x / GRID);
  const sz = Math.floor(from.z / GRID);
  const start: Node = { ix: sx, iz: sz, y: col.groundAt(cx(sx), cx(sz), from.y + STEP_UP, r), parent: null };
  const seen = new Set<string>([key(sx, sz, start.y)]);
  const queue: Node[] = [start];
  const found: (Node | null)[] = targets.map(() => null);
  let remaining = targets.length;
  const check = (n: Node) => {
    targets.forEach((t, i) => {
      if (found[i]) return;
      const dx = cx(n.ix) - t.x;
      const dy = n.y + 0.9 - t.y;
      const dz = cx(n.iz) - t.z;
      if (dx * dx + dy * dy + dz * dz < REACH_DIST * REACH_DIST) {
        found[i] = n;
        remaining--;
      }
    });
  };
  check(start);
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (let qi = 0; qi < queue.length && remaining > 0; qi++) {
    const n = queue[qi];
    for (const [dx, dz] of dirs) {
      const ix = n.ix + dx;
      const iz = n.iz + dz;
      const x = cx(ix);
      const z = cx(iz);
      if (Math.abs(x) > half - r || Math.abs(z) > half - r) continue;
      if (col.blocked(x, z, n.y, r, h)) continue;
      const y = col.groundAt(x, z, n.y + STEP_UP, r);
      const k = key(ix, iz, y);
      if (seen.has(k)) continue;
      seen.add(k);
      const m: Node = { ix, iz, y, parent: n };
      queue.push(m);
      check(m);
    }
  }
  return found.map((n) => {
    if (!n) return null;
    const path: Vec3[] = [];
    for (let c: Node | null = n; c; c = c.parent) path.push({ x: cx(c.ix), y: c.y, z: cx(c.iz) });
    return path.reverse();
  });
}
