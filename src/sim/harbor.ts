import type { Building, GameState, Prop, Solid, Vec3, World } from './types';

// Level 2: a seaside harbor. Sea to the north behind a seawall, a wooden pier with a moored boat,
// a stone jetty out to the lighthouse, a beach with a lifeguard tower in the west, harbor houses to the south.
// Everything the renderer draws with collision is described here so sim and view can't drift apart.

const box = (minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): Solid => ({ minX, minY, minZ, maxX, maxY, maxZ });

export const HARBOR = {
  seawallZ: -14,
  beachMaxX: -10,
  pier: { minX: -8, maxX: -3, minZ: -34, maxZ: -14, y: 1, boardFrom: -27, boardTo: -24 },
  pierRamp: { minX: -8, minY: 0, minZ: -14, maxX: -3, maxY: 1, maxZ: -10, ramp: 3 } as Solid,
  boat: { minX: -3, maxX: 1, minZ: -30, maxZ: -21, y: 1.2 },
  jetty: { minX: 20, maxX: 26, minZ: -38, maxZ: -14, y: 0.4 },
  lighthouse: { x: 23, z: -35, half: 2, height: 13 },
  gallery: box(20.3, 0, -33, 25.7, 4, -31),
  galleryRamp: { minX: 20.3, minY: 0, minZ: -31, maxX: 22.3, maxY: 4, maxZ: -22, ramp: 3 } as Solid,
  lifeguard: box(-27, 0, -6, -24, 2.6, -3),
  lifeguardRamp: { minX: -24, minY: 0, minZ: -5.5, maxX: -17, maxY: 2.6, maxZ: -3.5, ramp: 2 } as Solid,
  /** walls closing the playable area: west dunes, east warehouses */
  west: -36,
  east: 36,
  south: 20,
};

/** In the water: below the seawall line and down at sea level (not on the pier, boat or jetty). */
export function inSea(x: number, y: number, z: number) {
  return z < HARBOR.seawallZ - 0.4 && y < 0.2 && x > HARBOR.west - 40 && x < HARBOR.east + 40;
}

/** Harbor water: splash and swim back to shore. */
export function wet(state: GameState, x: number, y: number, z: number) {
  if (state.world.theme !== 'harbor' || state.race.phase === 'racing' || !inSea(x, y, z)) return false;
  state.events.push({ type: 'splat', x, y: 0.2, z });
  return true;
}

/** crates (w×d×h boxes) and barrels (w = diameter) by the jetty, shared with the renderer */
export const HARBOR_GEAR = [
  { kind: 'crate', x: 17, z: -13.1, w: 1.1, d: 1.1, h: 0.9 },
  { kind: 'crate', x: 18.15, z: -13.1, w: 1, d: 1, h: 0.75 },
  { kind: 'barrel', x: 16.1, z: -12.6, w: 0.8, d: 0.8, h: 1 },
  { kind: 'barrel', x: 19.2, z: -12.9, w: 0.75, d: 0.75, h: 0.95 },
] as const;

export const HARBOR_SPAWN: Vec3 = { x: 0, y: 0, z: 6 };

export const HARBOR_CREATURES = [
  { x: 2, z: -8 }, { x: 12, z: -4 }, { x: -16, z: -8 }, { x: -22, z: 6 }, { x: 16, z: 4 }, { x: -4, z: 12 }, { x: 20, z: 14 },
];

const HOUSE_COLORS = [0xff8a80, 0xffd27f, 0x8fd3f4, 0xb9f0c8, 0xf7a8d8, 0xfff1c9, 0x9fb7ff, 0xffb48a];

export function createHarbor(): World {
  const H = HARBOR;
  const solids: Solid[] = [];
  const buildings: Building[] = [];
  const props: Prop[] = [];

  // Seawall along the shore, open where the pier and jetty start.
  const gaps = [[H.pier.minX, H.pier.maxX], [H.jetty.minX, H.jetty.maxX]];
  let x0 = H.west;
  for (const [a, b] of gaps) { solids.push(box(x0, 0, H.seawallZ - 0.4, a, 1, H.seawallZ)); x0 = b; }
  solids.push(box(x0, 0, H.seawallZ - 0.4, H.east, 1, H.seawallZ));
  // Dunes and warehouses close the sides.
  solids.push(box(H.west - 4, 0, H.seawallZ - 0.4, H.west, 6, H.south + 12));
  solids.push(box(H.east, 0, H.seawallZ - 0.4, H.east + 4, 7, H.south + 12));

  // Harbor houses: a tight colourful row along the south edge.
  let i = 0;
  for (let x = H.west; x < H.east - 0.1; i++) {
    const w = [6, 5, 7, 5.5, 6.5][i % 5];
    const maxX = Math.min(H.east, x + w);
    const height = [7, 9, 6, 8, 10, 7.5][i % 6];
    buildings.push({ minX: x, minZ: H.south, maxX, maxZ: H.south + 8, height, color: HOUSE_COLORS[i % HOUSE_COLORS.length], mansard: false });
    solids.push(box(x, 0, H.south, maxX, height, H.south + 8));
    x = maxX;
  }

  // Wooden pier with rails; a gap on the east side lets you board the moored boat.
  const p = H.pier;
  solids.push(box(p.minX, 0, p.minZ, p.maxX, p.y, p.maxZ), H.pierRamp);
  solids.push(box(p.minX, 0, p.minZ, p.minX + 0.25, p.y + 1, p.maxZ));
  solids.push(box(p.maxX - 0.25, 0, p.minZ, p.maxX, p.y + 1, p.boardFrom));
  solids.push(box(p.maxX - 0.25, 0, p.boardTo, p.maxX, p.y + 1, p.maxZ));
  solids.push(box(p.minX, 0, p.minZ, p.maxX, p.y + 1, p.minZ + 0.25));
  // Boat hull with gunwales on the three open-water sides.
  const b = H.boat;
  solids.push(box(b.minX, 0, b.minZ, b.maxX, b.y, b.maxZ));
  solids.push(box(b.maxX - 0.3, 0, b.minZ, b.maxX, b.y + 0.8, b.maxZ));
  solids.push(box(b.minX, 0, b.minZ, b.maxX, b.y + 0.8, b.minZ + 0.3));
  solids.push(box(b.minX, 0, b.maxZ - 0.3, b.maxX, b.y + 0.8, b.maxZ));
  // Wheelhouse at the stern.
  solids.push(box(b.minX + 1, 0, b.maxZ - 3, b.maxX - 0.6, b.y + 1.9, b.maxZ - 0.3));

  // Stone jetty out to the lighthouse, gallery ramp up its side.
  const j = H.jetty;
  solids.push(box(j.minX, 0, j.minZ, j.maxX, j.y, j.maxZ));
  solids.push(box(j.minX, 0, j.minZ, j.minX + 0.3, j.y + 1, j.maxZ));
  solids.push(box(j.maxX - 0.3, 0, j.minZ, j.maxX, j.y + 1, j.maxZ));
  solids.push(box(j.minX, 0, j.minZ, j.maxX, j.y + 1, j.minZ + 0.3));
  const l = H.lighthouse;
  solids.push(box(l.x - l.half, 0, l.z - l.half, l.x + l.half, l.height, l.z + l.half));
  solids.push(H.gallery, H.galleryRamp);
  // Railings up the ramp and round the gallery so the high walkway can't spill into the sea.
  solids.push(box(j.minX, 0, H.gallery.minZ, j.minX + 0.3, 5, H.galleryRamp.maxZ));
  solids.push(box(H.gallery.maxX - 0.3, 0, H.gallery.minZ, H.gallery.maxX, 5, H.gallery.maxZ));

  // Beach: lifeguard tower, umbrellas, huts against the dunes.
  solids.push(H.lifeguard, H.lifeguardRamp);
  for (const z of [-10, -2, 6, 14]) {
    buildings.push({ minX: H.west, minZ: z - 1.6, maxX: H.west + 3, maxZ: z + 1.6, height: 2.8, color: HOUSE_COLORS[(z + 20) % 8], mansard: false });
    solids.push(box(H.west, 0, z - 1.6, H.west + 3, 2.8, z + 1.6));
  }
  for (const [x, z] of [[-31, -10], [-20, -10], [-14, 0], [-30, 10], [-20, 13]]) {
    props.push({ kind: 'umbrella', x, z });
    solids.push(box(x - 0.1, 0, z - 0.1, x + 0.1, 2.4, z + 0.1));
  }

  // Fishing gear stacked against the seawall by the jetty.
  for (const c of HARBOR_GEAR) solids.push(box(c.x - c.w / 2, 0, c.z - c.d / 2, c.x + c.w / 2, c.h, c.z + c.d / 2));

  // Promenade: palms, lamps, benches facing the sea.
  for (const x of [-12, 4, 14, 30]) {
    props.push({ kind: 'palm', x, z: -11.5 });
    solids.push(box(x - 0.3, 0, -11.8, x + 0.3, 4, -11.2));
  }
  for (const [x, z] of [[-1, -12], [9, -12], [18, 16], [-8, 17]]) {
    props.push({ kind: 'lamp', x, z });
    solids.push(box(x - 0.15, 0, z - 0.15, x + 0.15, 3.6, z + 0.15));
  }
  for (const x of [-12, 2]) {
    props.push({ kind: 'bench', x, z: 0 });
    solids.push(box(x - 1, 0, -0.35, x + 1, 0.5, 0.35));
  }

  return {
    theme: 'harbor', half: 620, solids, buildings, ramps: [H.pierRamp, H.galleryRamp, H.lifeguardRamp],
    platforms: [H.gallery, H.lifeguard], cars: [], props, plazaRadius: 0,
  };
}
