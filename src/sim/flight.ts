import { courseAt, courseHeightAt, courseNear, makeCourse, type Course } from './track';
import type { Solid } from './types';
import { roofSolids, type House } from './oldtown';

// Level 3 flight course: a 3D route over old-town rooftops and two parks, east of the town. The polyline gives the
// route on the ground; `heights` is the guide altitude (drone feet) along it. Rings, stars, scenery and obstacles
// are all derived deterministically from this data so the simulation and the renderer always agree.

export const COURSE3: Course = makeCourse(
  [[160, 10], [160, -60], [185, -120], [185, -190], [160, -250], [160, -320], [190, -370], [230, -370], [255, -330], [255, -260], [235, -200], [255, -140], [255, -60]],
  {
    jumps: [], optionalJump: null, gap: null, rampHeight: 0, rampLength: 0, rail: 9, ringLift: 0,
    air: {
      // climb out of the start square over the roofs, dive into the first park, up over the cathedral quarter,
      // low along the river park and under the aqueduct arch, back up over the roofs, down into the finish square
      heights: [[0, 2.2], [25, 4], [60, 10], [125, 10.5], [150, 4.6], [255, 4.4], [285, 12], [330, 14], [390, 12.5], [420, 5], [470, 3.4], [530, 3.4], [560, 6], [600, 11], [700, 10.5], [740, 5.5], [762, 4.5]],
      rings: [45, 105, 170, 230, 300, 375, 440, 497, 610, 700],
      ringRadius: 2.2,
    },
  },
);

/** progress ranges of the two parks (trees instead of houses) and where the aqueduct crosses */
export const FLIGHT_SECTIONS = { parks: [[140, 268], [405, 560]] as [number, number][], arch: 505, cathedral: 360 };

const box = (minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): Solid => ({ minX, minY, minZ, maxX, maxY, maxZ });
const inPark = (d: number) => FLIGHT_SECTIONS.parks.some(([a, b]) => d >= a && d <= b);

export interface FlightTree { x: number; z: number; s: number; d: number }
export interface FlightScenery {
  houses: (House & { d: number })[];
  trees: FlightTree[];
  /** aqueduct: two piers and the deck you fly under */
  arch: { piers: Solid[]; deck: Solid; d: number };
  /** cathedral bell tower just left of the route */
  cathedral: Solid & { d: number };
  /** chimney stacks on roofs under the route */
  chimneys: (Solid & { d: number })[];
  solids: Solid[];
}

const WALLS = [0xf4c48a, 0xfbe3b4, 0xf2a488, 0xfff1d6, 0xd9e8b8, 0xf6cfa0, 0xe8b4a0, 0xfde7a0];
let cache: FlightScenery | null = null;

/** Houses on a 9 m grid round the route: tall "canyon" houses beyond the drone's reach on either side, low houses
 *  right under the route (their roofs stay ≥ 2.4 m under the guide altitude), trees instead of houses in the parks. */
export function flightScenery(c: Course = COURSE3): FlightScenery {
  if (cache) return cache;
  const houses: FlightScenery['houses'] = [], trees: FlightTree[] = [], chimneys: FlightScenery['chimneys'] = [];
  const xs = c.points.map((p) => p.x), zs = c.points.map((p) => p.z);
  const G = 9, minX = Math.min(...xs) - 30, maxX = Math.max(...xs) + 30, minZ = Math.min(...zs) - 30, maxZ = Math.max(...zs) + 30;
  const archD = FLIGHT_SECTIONS.arch, cathD = FLIGHT_SECTIONS.cathedral;
  const arch = courseAt(c, archD), cath = courseAt(c, cathD);
  const cathedral = { ...box(cath.x + cath.dz * 6 - 2.5, 0, cath.z - cath.dx * 6 - 2.5, cath.x + cath.dz * 6 + 2.5, 24, cath.z - cath.dx * 6 + 2.5), d: cathD };
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let gx = minX; gx < maxX; gx += G) for (let gz = minZ; gz < maxZ; gz += G) {
    const cx = gx + G / 2, cz = gz + G / 2, mid = courseNear(c, cx, cz);
    if (mid.distance > 27) continue;
    // nearest distance / lowest guide over the cell's footprint
    let near = Infinity, guide = Infinity;
    for (const [x, z] of [[gx, gz], [gx + G, gz], [gx, gz + G], [gx + G, gz + G], [cx, cz], [cx, gz], [cx, gz + G], [gx, cz], [gx + G, cz]]) {
      const n = courseNear(c, x, z);
      near = Math.min(near, n.distance);
      guide = Math.min(guide, courseHeightAt(c, n.progress));
    }
    const d = mid.progress, r = rnd();
    if (d < 14 && near < 16) continue; // open start square
    if (d > c.length - 10 && near < 14) continue; // finish square
    if (Math.hypot(cx - cathedral.minX - 2.5, cz - cathedral.minZ - 2.5) < 9) continue;
    if (Math.abs(d - archD) < 9 && near < 14) continue;
    if (inPark(d)) {
      if (near >= 5 && r < 0.8) trees.push({ x: cx + (rnd() - 0.5) * 3, z: cz + (rnd() - 0.5) * 3, s: 0.9 + rnd() * 0.4, d });
      continue;
    }
    const inset = 0.5, color = WALLS[Math.floor(rnd() * WALLS.length)];
    // slightly oblong footprints so the ridges run both ways
    const ix = inset + (r < 0.5 ? 0.9 : 0), iz = inset + (r < 0.5 ? 0 : 0.9);
    const footprint = { minX: gx + ix, maxX: gx + G - ix, minZ: gz + iz, maxZ: gz + G - iz };
    if (near >= 10.3) {
      houses.push({ ...footprint, height: 9 + Math.floor(r * 5), color, roof: 'gable', d });
    } else {
      // roof (ridge included) at least 2.4 m under the lowest guide altitude over the footprint
      const span = Math.min(footprint.maxX - footprint.minX, footprint.maxZ - footprint.minZ), rise = Math.min(3, span * 0.4), height = Math.min(7, guide - 2.4 - rise * 0.85);
      if (height < 3) continue;
      houses.push({ ...footprint, height: Math.round(height * 10) / 10, color, roof: 'gable', d });
      if (r < 0.35) {
        const x = footprint.minX + 1.2, z = footprint.minZ + 1.2, top = Math.min(height + rise + 0.6, guide - 1.2);
        if (top > height + 0.6) chimneys.push({ ...box(x - 0.45, height, z - 0.45, x + 0.45, top, z + 0.45), d });
      }
    }
  }
  // aqueduct across the river park: piers beyond the route's centre, a deck to fly under (or over)
  const ax = arch.x, az = arch.z, along = Math.abs(arch.dx) > Math.abs(arch.dz);
  const lat = (o: number) => ({ x: ax - arch.dz * o, z: az + arch.dx * o });
  const pierAt = (o: number) => { const p = lat(o), a = along ? 1.6 : 1.3, b = along ? 1.3 : 1.6; return box(p.x - a, 0, p.z - b, p.x + a, 6.2, p.z + b); };
  const deckA = lat(-10.5), deckB = lat(10.5);
  const deck = box(Math.min(deckA.x, deckB.x) - (along ? 1.8 : 0), 6.2, Math.min(deckA.z, deckB.z) - (along ? 0 : 1.8), Math.max(deckA.x, deckB.x) + (along ? 1.8 : 0), 8.2, Math.max(deckA.z, deckB.z) + (along ? 0 : 1.8));
  const piers = [pierAt(-8.7), pierAt(8.7)];

  const solids: Solid[] = [];
  for (const h of houses) solids.push(box(h.minX, 0, h.minZ, h.maxX, h.height, h.maxZ), ...roofSolids(h));
  for (const t of trees) solids.push(box(t.x - 0.3, 0, t.z - 0.3, t.x + 0.3, 3 * t.s, t.z + 0.3), box(t.x - 1.5 * t.s, 2.2 * t.s, t.z - 1.5 * t.s, t.x + 1.5 * t.s, 5.4 * t.s, t.z + 1.5 * t.s));
  solids.push(...chimneys, ...piers, deck, cathedral);
  cache = { houses, trees, arch: { piers, deck, d: archD }, cathedral, chimneys, solids };
  return cache;
}
