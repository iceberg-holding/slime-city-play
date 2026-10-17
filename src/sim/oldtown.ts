import type { Building, GameState, Prop, Solid, Vec3, World } from './types';

// Level 3: an old town. A park with a pond, island and bandstand in the west; a cobbled square with terracotta-roofed
// houses, two walkable roof terraces and a clock tower with an outside spiral stair in the east.
// Everything the renderer draws with collision is described here so sim and view can't drift apart.

const box = (minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): Solid => ({ minX, minY, minZ, maxX, maxY, maxZ });

export const OLDTOWN = {
  west: -44, east: 44, north: -40, south: 30,
  /** park west of x = parkEdge, cobbled square east of it */
  parkEdge: -2,
  pond: { minX: -30, maxX: -14, minZ: -16, maxZ: -4, rim: 0.5, rimH: 0.45 },
  island: box(-24, 0, -12, -20, 0.8, -8),
  bridge: box(-23, 0, -8, -21, 0.8, -3),
  bridgeRamp: { minX: -23, minY: 0, minZ: -3, maxX: -21, maxY: 0.8, maxZ: 0, ramp: 3 } as Solid,
  bandstand: { x: -26, z: 14, half: 3.5, y: 1, roof: 4.2 },
  bandstandSteps: { minX: -22.5, minY: 0, minZ: 12.5, maxX: -20, maxY: 1, maxZ: 15.5, ramp: 2 } as Solid,
  /** clock tower: solid body up to the clock room floor, a room with a hatch door on the south side, spire on top */
  tower: { minX: 20, maxX: 26, minZ: -26, maxZ: -20, floor: 9.6, room: 4, x: 23, z: -23, top: 14.2, stair: 1.6, door: [22, 24] as [number, number] },
  /** flat-roofed terrace houses: A (stairs up from the square) and the taller B (ramp up from A's roof) */
  terraceA: box(2, 0, -36, 12, 4.2, -28),
  stairA: { minX: 2, minY: 0, minZ: -28, maxX: 9, maxY: 4.2, maxZ: -26.4, ramp: 0 } as Solid,
  terraceB: box(12, 0, -36, 19, 7.2, -29),
  rampAB: { minX: 6, minY: 4.2, minZ: -35.6, maxX: 12, maxY: 7.2, maxZ: -34, ramp: 0 } as Solid,
  /** railing along the ramp's open side: it is climbed from its foot, not stepped onto sideways */
  rampRail: box(6.6, 4.2, -34, 12, 8.2, -33.85),
  /** hedges along the park edge (z ranges), open where the park paths cross */
  hedges: [[-34, -26], [-22, 2], [10, 24]] as [number, number][],
  /** market stall counters on the square */
  stalls: [box(27, 0, -7, 31, 1, -5.5), box(33, 0, -7, 37, 1, -5.5)],
};

/** Spiral stair round the clock tower: four ramps (one per face) joined by corner landings, ending on a balcony
 *  in front of the clock-room hatch. Each ramp rises 2.4 m over 6 m. */
export function towerStair(): { ramps: Solid[]; landings: Solid[]; balcony: Solid } {
  const T = OLDTOWN.tower, w = T.stair, rise = T.floor / 4;
  const ramps: Solid[] = [
    { minX: T.minX, maxX: T.maxX, minZ: T.maxZ, maxZ: T.maxZ + w, minY: 0, maxY: rise, ramp: 0 }, // south face, east-bound
    { minX: T.maxX, maxX: T.maxX + w, minZ: T.minZ, maxZ: T.maxZ, minY: rise, maxY: rise * 2, ramp: 3 }, // east face, north-bound
    { minX: T.minX, maxX: T.maxX, minZ: T.minZ - w, maxZ: T.minZ, minY: rise * 2, maxY: rise * 3, ramp: 2 }, // north face, west-bound
    { minX: T.minX - w, maxX: T.minX, minZ: T.minZ, maxZ: T.maxZ, minY: rise * 3, maxY: T.floor, ramp: 1 }, // west face, south-bound
  ];
  const landings = [
    box(T.maxX, 0, T.maxZ, T.maxX + w, rise, T.maxZ + w), // SE
    box(T.maxX, 0, T.minZ - w, T.maxX + w, rise * 2, T.minZ), // NE
    box(T.minX - w, 0, T.minZ - w, T.minX, rise * 3, T.minZ), // NW
    box(T.minX - w, T.floor - 0.4, T.maxZ, T.minX, T.floor, T.maxZ + w), // SW, high above the stair foot
  ];
  const balcony = box(T.minX, T.floor - 0.4, T.maxZ, T.maxX, T.floor, T.maxZ + w);
  return { ramps, landings, balcony };
}

/** Bridge railings and a low fence round the island (open toward the bridge) keep walkers out of the water. */
export function pondRails(): Solid[] {
  const I = OLDTOWN.island, B = OLDTOWN.bridge, y = B.maxY + 1, t = 0.15;
  return [
    box(B.minX, 0, B.minZ, B.minX + t, y, B.maxZ), box(B.maxX - t, 0, B.minZ, B.maxX, y, B.maxZ),
    box(I.minX, 0, I.minZ, I.minX + t, y, I.maxZ), box(I.maxX - t, 0, I.minZ, I.maxX, y, I.maxZ), box(I.minX, 0, I.minZ, I.maxX, y, I.minZ + t),
    box(I.minX, 0, I.maxZ - t, B.minX, y, I.maxZ), box(B.maxX, 0, I.maxZ - t, I.maxX, y, I.maxZ),
  ];
}

/** Pond water: inside the rim, off the island and bridge, near the water line. */
export function inPond(x: number, y: number, z: number) {
  const P = OLDTOWN.pond, I = OLDTOWN.island, B = OLDTOWN.bridge;
  if (y > 0.3 || x < P.minX + P.rim || x > P.maxX - P.rim || z < P.minZ + P.rim || z > P.maxZ - P.rim) return false;
  const on = (s: Solid) => x > s.minX && x < s.maxX && z > s.minZ && z < s.maxZ;
  return !on(I) && !on(B);
}

/** Old-town pond: splash and climb out back at the spawn. */
export function pondWet(state: GameState, x: number, y: number, z: number) {
  if (state.world.theme !== 'oldtown' || !inPond(x, y, z)) return false;
  state.events.push({ type: 'splat', x, y: 0.2, z });
  return true;
}

export const OLDTOWN_SPAWN: Vec3 = { x: 2, y: 0, z: 10 };

export const OLDTOWN_CREATURES = [
  { x: -10, z: 4 }, { x: -32, z: 0 }, { x: -16, z: 18 }, { x: 12, z: -10 }, { x: 24, z: 2 }, { x: 30, z: -12 }, { x: 4, z: 20 },
];

/** a pyshka who loiters by the clock tower and gossips about the buzzing up in the clock room */
export const OLDTOWN_HINT = { x: 15.5, z: -16 };

const WALLS = [0xf4c48a, 0xfbe3b4, 0xf2a488, 0xfff1d6, 0xd9e8b8, 0xf6cfa0, 0xe8b4a0, 0xfde7a0];

/** Houses: box from the ground to the eaves; gable roofs (ridge along the long side) or flat terraces. */
export interface House { minX: number; minZ: number; maxX: number; maxZ: number; height: number; color: number; roof: 'gable' | 'flat' }

function houseRow(houses: House[], from: number, to: number, fixedMin: number, fixedMax: number, alongX: boolean, seed: number) {
  let i = seed;
  for (let a = from; a < to - 0.1; i++) {
    const w = [6, 5, 7, 5.5, 6.5][i % 5], b = Math.min(to, a + w);
    const h = [7, 8.5, 6.5, 9, 7.5, 10][i % 6];
    houses.push(alongX
      ? { minX: a, maxX: b, minZ: fixedMin, maxZ: fixedMax, height: h, color: WALLS[i % WALLS.length], roof: 'gable' }
      : { minX: fixedMin, maxX: fixedMax, minZ: a, maxZ: b, height: h, color: WALLS[i % WALLS.length], roof: 'gable' });
    a = b;
  }
}

/** Every house in the area (perimeter rows closing the playable area plus the houses on the square). */
export function oldtownHouses(): House[] {
  const O = OLDTOWN, houses: House[] = [];
  houseRow(houses, O.west - 8, O.east + 8, O.south, O.south + 8, true, 0); // south row
  houseRow(houses, O.west - 8, O.east + 8, O.north - 8, O.north, true, 3); // north row
  houseRow(houses, O.north, O.south, O.west - 8, O.west, false, 1); // west row
  houseRow(houses, O.north, O.south, O.east, O.east + 8, false, 4); // east row
  // the square: a terrace pair on the north side, a few tall houses along the east
  const A = O.terraceA, B = O.terraceB;
  houses.push({ minX: A.minX, maxX: A.maxX, minZ: A.minZ, maxZ: A.maxZ, height: A.maxY, color: 0xf2a488, roof: 'flat' });
  houses.push({ minX: B.minX, maxX: B.maxX, minZ: B.minZ, maxZ: B.maxZ, height: B.maxY, color: 0xfbe3b4, roof: 'flat' });
  houses.push({ minX: 36, maxX: O.east, minZ: -30, maxZ: -22, height: 8, color: 0xd9e8b8, roof: 'gable' });
  houses.push({ minX: 36, maxX: O.east, minZ: -22, maxZ: -14, height: 9.5, color: 0xf6cfa0, roof: 'gable' });
  houses.push({ minX: 38, maxX: O.east, minZ: 14, maxZ: 22, height: 7, color: 0xe8b4a0, roof: 'gable' });
  return houses;
}

/** Gable roofs as collision: two stacked slabs under the ridge, so a drone lands on the roof rather than inside it. */
export function roofSolids(h: House): Solid[] {
  if (h.roof === 'flat') return [];
  const alongX = h.maxX - h.minX >= h.maxZ - h.minZ;
  const span = alongX ? h.maxZ - h.minZ : h.maxX - h.minX, rise = Math.min(3, span * 0.4);
  const slab = (k: number, y0: number, y1: number) => {
    const c = alongX ? (h.minZ + h.maxZ) / 2 : (h.minX + h.maxX) / 2, half = (span / 2) * k;
    return alongX ? box(h.minX, y0, c - half, h.maxX, y1, c + half) : box(c - half, y0, h.minZ, c + half, y1, h.maxZ);
  };
  return [slab(0.66, h.height, h.height + rise * 0.5), slab(0.33, h.height + rise * 0.5, h.height + rise * 0.85)];
}

/** Chimneys on the walkable terraces (solid) */
export const CHIMNEYS = [box(3, 4.2, -35.5, 3.9, 6, -34.6), box(10.4, 4.2, -30.2, 11.3, 5.8, -29.3), box(17.6, 7.2, -35.4, 18.5, 9, -34.5)];

/** Park trees, lamps and benches (trunks/posts are solid). */
export const PARK_PROPS: Prop[] = [
  ...[[-38, -30], [-30, -30], [-20, -32], [-8, -30], [-38, -18], [-36, -2], [-8, -16], [-6, -2], [-38, 10], [-34, 22], [-16, 8], [-12, 22], [-4, 14], [-26, 4]]
    .map(([x, z]) => ({ kind: 'tree' as const, x, z })),
  ...[[-10, -6], [-18, 2], [-30, 8.2], [0, -14], [16, 6], [32, 4]].map(([x, z]) => ({ kind: 'lamp' as const, x, z })),
  ...[[-14, 2], [-30, -20], [-8, 10]].map(([x, z]) => ({ kind: 'bench' as const, x, z })),
  ...[[12, 2], [18, 4], [14, 8]].map(([x, z]) => ({ kind: 'umbrella' as const, x, z })),
];

export function createOldTown(): World {
  const O = OLDTOWN;
  const solids: Solid[] = [];
  const buildings: Building[] = [];
  for (const h of oldtownHouses()) {
    solids.push(box(h.minX, 0, h.minZ, h.maxX, h.height, h.maxZ), ...roofSolids(h));
    buildings.push({ minX: h.minX, minZ: h.minZ, maxX: h.maxX, maxZ: h.maxZ, height: h.height, color: h.color, mansard: false });
  }
  // Terrace stairs, the railed ramp from terrace A up to B, chimneys.
  solids.push(O.stairA, O.rampAB, O.rampRail, ...CHIMNEYS);

  // Pond: a low stone rim (too high to step over), the island with its footbridge.
  const P = O.pond;
  solids.push(box(P.minX, 0, P.minZ, P.maxX, P.rimH, P.minZ + P.rim), box(P.minX, 0, P.maxZ - P.rim, O.bridge.minX, P.rimH, P.maxZ),
    box(O.bridge.maxX, 0, P.maxZ - P.rim, P.maxX, P.rimH, P.maxZ), box(P.minX, 0, P.minZ, P.minX + P.rim, P.rimH, P.maxZ), box(P.maxX - P.rim, 0, P.minZ, P.maxX, P.rimH, P.maxZ));
  solids.push(O.island, O.bridge, O.bridgeRamp, ...pondRails());

  // Bandstand: raised floor, steps on the east side, slim pillars at the corners.
  const S = O.bandstand;
  solids.push(box(S.x - S.half, 0, S.z - S.half, S.x + S.half, S.y, S.z + S.half), O.bandstandSteps);
  for (const dx of [-1, 1]) for (const dz of [-1, 1]) {
    const x = S.x + dx * (S.half - 0.3), z = S.z + dz * (S.half - 0.3);
    solids.push(box(x - 0.15, 0, z - 0.15, x + 0.15, S.roof, z + 0.15));
  }

  // Clock tower: body, clock room walls with the hatch door on the south side, roof; spiral stair outside.
  const T = O.tower, top = T.floor + T.room;
  solids.push(box(T.minX, 0, T.minZ, T.maxX, T.floor, T.maxZ));
  solids.push(box(T.minX, T.floor, T.minZ, T.maxX, top, T.minZ + 0.4), box(T.minX, T.floor, T.minZ, T.minX + 0.4, top, T.maxZ),
    box(T.maxX - 0.4, T.floor, T.minZ, T.maxX, top, T.maxZ), box(T.minX, T.floor, T.maxZ - 0.4, T.door[0], top, T.maxZ),
    box(T.door[1], T.floor, T.maxZ - 0.4, T.maxX, top, T.maxZ));
  solids.push(box(T.minX - 0.3, top, T.minZ - 0.3, T.maxX + 0.3, T.top, T.maxZ + 0.3));
  const stair = towerStair();
  solids.push(...stair.ramps, ...stair.landings, stair.balcony);

  // Hedges, market stalls and park furniture.
  for (const [z0, z1] of O.hedges) solids.push(box(O.parkEdge - 1.15, 0, z0, O.parkEdge - 0.05, 1, z1));
  solids.push(...O.stalls);
  for (const p of PARK_PROPS) {
    const r = p.kind === 'tree' ? 0.35 : p.kind === 'bench' ? 0 : 0.15;
    if (p.kind === 'bench') solids.push(box(p.x - 1, 0, p.z - 0.35, p.x + 1, 0.5, p.z + 0.35));
    else solids.push(box(p.x - r, 0, p.z - r, p.x + r, p.kind === 'tree' ? 3.2 : p.kind === 'umbrella' ? 2.4 : 3.6, p.z + r));
  }

  return {
    theme: 'oldtown', half: 900, solids, buildings, ramps: [O.stairA, O.rampAB, O.bridgeRamp, O.bandstandSteps, ...stair.ramps],
    platforms: [O.terraceA, O.terraceB, O.island], cars: [], props: PARK_PROPS, plazaRadius: 0,
  };
}
