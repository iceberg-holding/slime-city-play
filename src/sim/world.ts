import type { Building, Car, Prop, Solid, Vec3, World } from './types';

// One Paris-ish city block: a ring of buildings around an open street + plaza with a fountain.

const PALETTE = [0xf3e3c3, 0xf7c6c7, 0xbfe6d0, 0xbcd8f2, 0xfbe39b, 0xd9c9f0, 0xf6cfa4];

function box(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): Solid {
  return { minX, minY, minZ, maxX, maxY, maxZ };
}

export const PLAYER_SPAWN: Vec3 = { x: 0, y: 0, z: 14 };

export const CREATURE_SPAWNS: { x: number; z: number }[] = [
  { x: 12, z: -3 },
  { x: -12, z: -1 },
  { x: 14, z: -13 },
  { x: -13, z: -11 },
  { x: 3, z: -15 },
  { x: -14, z: 12 },
  { x: 9, z: 3 },
];

export function createWorld(): World {
  const half = 900; // the race road runs ~860 m north
  const buildings: Building[] = [];
  let ci = 0;
  const b = (minX: number, minZ: number, maxX: number, maxZ: number, height: number, mansard = true) => {
    buildings.push({ minX, minZ, maxX, maxZ, height, color: PALETTE[ci++ % PALETTE.length], mansard });
  };
  // North row
  b(-32, -32, -20, -21, 9);
  b(-20, -32, -8, -21, 5);
  b(-8, -32, 7, -21, 7);
  b(7, -32, 20, -21, 4, false);
  // Northeast tower has an open lobby and separate floor slabs.
  // South row
  b(-32, 21, -18, 32, 6);
  b(-18, 21, -6, 32, 3, false);
  b(-6, 21, 9, 32, 8);
  b(9, 21, 32, 32, 5);
  // West column
  b(-32, -21, -21, -4, 7);
  b(-32, -4, -21, 21, 4, false);
  // East column
  b(21, -21, 32, 0, 6);
  b(21, 0, 32, 21, 9);

  const solids: Solid[] = [];
  for (const bd of buildings) {
    solids.push(box(bd.minX, 0, bd.minZ, bd.maxX, bd.height, bd.maxZ));
    if (bd.mansard) {
      const m = mansardBox(bd);
      solids.push(m);
    }
  }

  // Slabs leave the exterior elevator shaft open.
  for (const y of [0.26, 11.57, 22.1325]) solids.push(box(21.8, y - 0.2, -30.2, 30.2, y, -21.8));
  solids.push(box(21.8, 0.26, -30.2, 22.1, 22.1, -21.8));
  solids.push(box(22.1, 0.26, -30.2, 30.2, 22.1, -29.9));
  const ramps: Solid[] = [
    // Up to the 5m roof on the north row, rising toward -x
    { minX: -17.5, minY: 0, minZ: -21, maxX: -6, maxY: 5, maxZ: -18.6, ramp: 2 },
    // Up to the 6m roof on the east side, rising toward -z
    { minX: 18.6, minY: 0, minZ: -18.5, maxX: 21, maxY: 6, maxZ: -4, ramp: 3 },
    // Up to the low café roof (3m) on the south row, rising toward -x
    { minX: -16, minY: 0, minZ: 19.1, maxX: -8, maxY: 3, maxZ: 21, ramp: 2 },
  ];
  // flat landings at the top of each ramp, flush with the roof
  const platforms: Solid[] = [
    box(-20, 0, -21, -17.5, 5, -18.6),
    box(18.6, 0, -21, 21, 6, -18.5),
    box(-18, 0, 19.1, -16, 3, 21),
  ];
  solids.push(...ramps, ...platforms);

  const props: Prop[] = [];
  // Crate staircase up to the 5m south-east roof
  const crates = [
    { x: 14, h: 1 },
    { x: 15.5, h: 2 },
    { x: 17, h: 3 },
    { x: 18.5, h: 4 },
  ];
  for (const c of crates) {
    for (let y = 0; y < c.h; y++) {
      props.push({ kind: 'crate', x: c.x, z: 20.25, w: 1.5, d: 1.5, h: 1, y });
    }
    solids.push(box(c.x - 0.75, 0, 19.5, c.x + 0.75, c.h, 21));
  }
  // Trees around the plaza
  const plazaRadius = 9;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const x = Math.cos(a) * (plazaRadius + 0.5);
    const z = Math.sin(a) * (plazaRadius + 0.5);
    props.push({ kind: 'tree', x, z });
    solids.push(box(x - 0.25, 0, z - 0.25, x + 0.25, 2.2, z + 0.25));
  }
  // Lamps at street corners
  for (const [x, z] of [
    [-17.5, -17.5],
    [17, -17.5],
    [-19, 19],
    [19, 19],
    [0, -19.5],
    [-3, 19.5],
  ]) {
    props.push({ kind: 'lamp', x, z });
    solids.push(box(x - 0.15, 0, z - 0.15, x + 0.15, 3.6, z + 0.15));
  }
  // Benches in the plaza
  for (const [x, z] of [
    [-5.5, 0],
    [5.5, 0],
    [0, -5.5],
  ]) {
    props.push({ kind: 'bench', x, z });
    const alongX = Math.abs(z) > Math.abs(x);
    solids.push(alongX ? box(x - 1, 0, z - 0.35, x + 1, 0.5, z + 0.35) : box(x - 0.35, 0, z - 1, x + 0.35, 0.5, z + 1));
  }

  const cars: Car[] = [
    { x: -15.5, z: 4, alongX: false, color: 0xe63946 },
    { x: 15.5, z: 7, alongX: false, color: 0x2a9df4 },
    { x: 6, z: -16, alongX: true, color: 0xffb703 },
    { x: -6, z: 16, alongX: true, color: 0x8ac926 },
    { x: 15.5, z: 14, alongX: false, color: 0xb388eb },
    { x: -11, z: -15.5, alongX: true, color: 0xff7f50 },
  ];
  for (const c of cars) {
    const [hl, hw] = c.alongX ? [2, 0.95] : [0.95, 2];
    solids.push(box(c.x - hl, 0, c.z - hw, c.x + hl, 1.1, c.z + hw));
    const [cl, cw] = c.alongX ? [1.1, 0.85] : [0.85, 1.1];
    solids.push(box(c.x - cl, 1.1, c.z - cw, c.x + cl, 1.75, c.z + cw));
  }

  // a low step ring lets you walk up onto the basin rim without jumping
  const fountain = { x: 0, z: 0, stepHalf: 3.2, stepH: 0.35, basinHalf: 2.6, basinH: 0.7, pillarHalf: 0.6, pillarH: 2.0 };
  solids.push(box(-fountain.stepHalf, 0, -fountain.stepHalf, fountain.stepHalf, fountain.stepH, fountain.stepHalf));
  solids.push(box(-fountain.basinHalf, 0, -fountain.basinHalf, fountain.basinHalf, fountain.basinH, fountain.basinHalf));
  solids.push(box(-fountain.pillarHalf, 0, -fountain.pillarHalf, fountain.pillarHalf, fountain.pillarH, fountain.pillarHalf));

  return { theme: 'city', half, solids, buildings, ramps, platforms, cars, props, fountain, plazaRadius };
}

export function mansardBox(bd: Building): Solid {
  const inset = 1.6;
  return box(bd.minX + inset, bd.height, bd.minZ + inset, bd.maxX - inset, bd.height + 1.6, bd.maxZ - inset);
}
