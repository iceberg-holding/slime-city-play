import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { batchStatic } from './art/batch';
import { bench as studioBench, lamp as studioLamp } from './art/studio';
import { buildBlobs, wedge, wedgeTransform, type BlobSpot } from './city';
import { gable } from './harbor';
import { Kit, geo, glowTexture, waterMaterial } from './materials';
import { CHIMNEYS, OLDTOWN, oldtownHouses, pondRails, towerStair, type House } from '../sim/oldtown';
import type { Solid, World } from '../sim/types';

// Level 3 look: warm ochre / cream / salmon plaster, terracotta tile roofs, green shutters, honey stone,
// copper-green spire, deep park greens and a blue pond (level 1 is Paris stone and slate, level 2 whitewash and sea).

export const TERRACOTTA = 0xd8693e;
const TERRACOTTA_DARK = 0xb5532f;
const STONE = 0xf1e0bf;
const STONE_DARK = 0xd9c39a;
const COBBLE = 0xcdbba0;
const GRASS = 0x7cc35e;
const WOOD = 0xa86b43;
const WOOD_DARK = 0x7b4a2b;
const WHITE = 0xfffaf0;
const SHUTTERS = [0x3f8f5a, 0x2e7d8c, 0x4f9d69, 0x6b8f3a];
const COPPER = 0x5fb59a;
const GOLD = 0xffc93c;

function shade(c: number, k: number) {
  return new THREE.Color(c).multiplyScalar(k).getHex();
}

/** Plaster house with a terracotta gable (or a tiled roof terrace), shuttered windows on the face toward the square. */
export function addHouse(k: Kit, d: Kit, h: House, face: 0 | 1 | 2 | 3, i: number) {
  const w = h.maxX - h.minX, dz = h.maxZ - h.minZ, cx = (h.minX + h.maxX) / 2, cz = (h.minZ + h.maxZ) / 2;
  k.add(geo.rbox(w - 0.08, h.height, dz - 0.08, 0.18, 2), h.color, { p: [cx, h.height / 2, cz] });
  k.add(geo.rbox(w + 0.04, 0.6, dz + 0.04, 0.08, 1), shade(h.color, 0.8), { p: [cx, 0.3, cz] }); // plinth
  k.add(geo.rbox(w + 0.16, 0.22, dz + 0.16, 0.08, 1), WHITE, { p: [cx, h.height - 0.11, cz] }); // cornice
  if (h.roof === 'gable') {
    const alongX = w >= dz, span = alongX ? dz : w, len = alongX ? w : dz, rise = Math.min(3, span * 0.4);
    const ry = alongX ? Math.PI / 2 : 0;
    k.add(gable(span + 0.5, rise, len + 0.3), i % 5 === 4 ? TERRACOTTA_DARK : TERRACOTTA, { p: [cx, h.height, cz], r: [0, ry, 0], finish: 'gloss' });
    // tile courses: low ribs along the ridge on both slopes, and a rounded ridge cap
    for (const s of [-1, 1]) for (let t = 0.2; t < 0.95; t += 0.25) {
      const off = s * ((span + 0.5) / 2) * (1 - t), y = h.height + rise * t + 0.06;
      d.add(geo.cyl(0.06, 0.06, len + 0.3, 6), shade(TERRACOTTA, 0.86), { p: alongX ? [cx, y, cz + off] : [cx + off, y, cz], r: alongX ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0], cast: false });
    }
    d.add(geo.cyl(0.13, 0.13, len + 0.4, 8), TERRACOTTA_DARK, { p: [cx, h.height + rise + 0.05, cz], r: alongX ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0], finish: 'gloss' });
    if (i % 3 === 0) {
      const chx = alongX ? h.minX + w * 0.72 : cx + span * 0.22, chz = alongX ? cz + span * 0.22 : h.minZ + dz * 0.3;
      k.add(geo.rbox(0.7, 1.9, 0.7, 0.08), shade(h.color, 0.9), { p: [chx, h.height + rise * 0.6 + 0.4, chz] });
      k.add(geo.rbox(0.9, 0.18, 0.9, 0.06), WHITE, { p: [chx, h.height + rise * 0.6 + 1.4, chz] });
      d.add(geo.cyl(0.12, 0.12, 0.35, 8), TERRACOTTA_DARK, { p: [chx, h.height + rise * 0.6 + 1.6, chz], cast: false });
    }
  } else {
    // roof terrace: tiled floor, a low parapet
    k.add(geo.box(), 0xe9a27a, { p: [cx, h.height + 0.01, cz], s: [w - 0.2, 0.02, dz - 0.2], finish: 'matte', cast: false });
    for (let x = h.minX + 1; x < h.maxX; x += 1) d.add(geo.box(), 0xd38a63, { p: [x, h.height + 0.025, cz], s: [0.04, 0.01, dz - 0.3], cast: false });
    for (const [px, pz, sx, sz] of [[cx, h.minZ + 0.1, w, 0.2], [h.minX + 0.1, cz, 0.2, dz], [h.maxX - 0.1, cz, 0.2, dz]] as const)
      k.add(geo.rbox(sx, 0.35, sz, 0.06), WHITE, { p: [px, h.height + 0.17, pz] });
  }
  // the facade toward the square: shuttered windows on each floor, a door with a little canopy
  const along = face === 0 || face === 2 ? dz : w;
  const n = Math.max(1, Math.round(along / 2.4));
  const at = (u: number, y: number, out: number): [number, number, number] => {
    const t = (face === 0 || face === 2 ? h.minZ : h.minX) + (along * (u + 0.5)) / n;
    if (face === 0) return [h.maxX + out, y, t];
    if (face === 2) return [h.minX - out, y, t];
    return face === 1 ? [t, y, h.maxZ + out] : [t, y, h.minZ - out];
  };
  const ry = face === 0 || face === 2 ? Math.PI / 2 : 0;
  const shutter = SHUTTERS[i % SHUTTERS.length];
  for (let y = 2.6; y + 1.2 < h.height; y += 2.5) {
    for (let u = 0; u < n; u++) {
      if (y < 3 && u === Math.floor(n / 2)) continue; // door below
      d.add(geo.box(), WHITE, { p: at(u, y, 0.03), r: [0, ry, 0], s: [1.0, 1.35, 0.1], cast: false });
      d.add(geo.box(), 0x35617f, { p: at(u, y, 0.06), r: [0, ry, 0], s: [0.78, 1.12, 0.06], finish: 'glass', cast: false });
      for (const s of [-1, 1]) {
        const p = at(u, y, 0.06);
        if (ry) p[2] += s * 0.72; else p[0] += s * 0.72;
        d.add(geo.box(), shutter, { p, r: [0, ry, 0], s: [0.4, 1.3, 0.06], cast: false });
      }
      if ((i + u) % 3 === 0) { // flower box
        const p = at(u, y - 0.78, 0.14);
        d.add(geo.box(), TERRACOTTA, { p, r: [0, ry, 0], s: [0.9, 0.2, 0.2], cast: false });
        for (const s of [-0.28, 0, 0.28]) {
          const q = at(u, y - 0.6, 0.14);
          if (ry) q[2] += s; else q[0] += s;
          d.add(geo.sphere(0.1, 8, 6), [0xff5d73, 0xffd166, 0xff8fc0][(i + u) % 3], { p: q, cast: false });
        }
      }
    }
  }
  const door = at(Math.floor(n / 2), 1.15, 0.04);
  d.add(geo.box(), WHITE, { p: door, r: [0, ry, 0], s: [1.25, 2.3, 0.1], cast: false });
  d.add(geo.box(), [WOOD_DARK, 0x2e7d8c, 0x9b3d2c][i % 3], { p: [door[0], 1.08, door[2]], r: [0, ry, 0], s: [1.0, 2.1, 0.12], cast: false });
  const canopy = at(Math.floor(n / 2), 2.45, 0.35);
  d.add(geo.rbox(1.5, 0.08, 0.7, 0.03), TERRACOTTA, { p: canopy, r: [0.25 * (ry ? 0 : 1), ry, 0], cast: false });
}

/** Which face of a house looks into the area (toward the square / park). */
function faceOf(h: House): 0 | 1 | 2 | 3 {
  const O = OLDTOWN;
  if (h.minZ >= O.south - 0.01) return 3;
  if (h.maxZ <= O.north + 0.01) return 1;
  if (h.maxX <= O.west + 0.01) return 0;
  if (h.minX >= O.east - 0.01) return 2;
  if (h.minX >= 30) return 2;
  return 1;
}

/** Rounded park tree: trunk and three soft crown blobs. */
export function addTree(k: Kit, x: number, z: number, i: number, scale = 1) {
  k.add(geo.cyl(0.2 * scale, 0.3 * scale, 2.6 * scale, 10), 0x8a5a38, { p: [x, 1.3 * scale, z] });
  const greens = [0x4caf50, 0x5cc35e, 0x3f9f4a, 0x6fcf5a];
  for (const [dx, dy, dz, r] of [[0, 3.4, 0, 1.6], [0.8, 2.9, 0.4, 1.1], [-0.7, 3.0, -0.4, 1.15], [0.1, 4.3, -0.1, 1.0]] as const)
    k.add(geo.sphere(1, 14, 10), greens[(i + Math.round(dx * 3)) & 3], { p: [x + dx * scale, dy * scale, z + dz * scale], s: r * scale });
}

/** Thin sloped plank covering a (possibly floating) ramp solid, plus its outer balustrade. */
function plank(k: Kit, s: Solid, color: number, railSide?: 'minX' | 'maxX' | 'minZ' | 'maxZ') {
  const alongX = s.ramp === 0 || s.ramp === 2, run = alongX ? s.maxX - s.minX : s.maxZ - s.minZ, rise = s.maxY - s.minY;
  const width = alongX ? s.maxZ - s.minZ : s.maxX - s.minX, len = Math.hypot(run, rise), a = Math.atan2(rise, run);
  const cx = (s.minX + s.maxX) / 2, cz = (s.minZ + s.maxZ) / 2, cy = (s.minY + s.maxY) / 2 - 0.12;
  // rbox along x tilted by `a` about z (rising toward +x), then turned to face the ramp direction
  const yaw = s.ramp === 0 ? 0 : s.ramp === 2 ? Math.PI : s.ramp === 1 ? -Math.PI / 2 : Math.PI / 2;
  const m = new THREE.Matrix4().compose(new THREE.Vector3(cx, cy, cz), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, a, 'YXZ')), new THREE.Vector3(1, 1, 1));
  k.addMatrix(geo.rbox(len, 0.24, width, 0.06), color, m, 'soft');
  if (!railSide) return;
  const along = (t: number) => {
    const y = s.minY + rise * (s.ramp === 2 || s.ramp === 3 ? 1 - t : t);
    const x = alongX ? s.minX + run * t : railSide === 'minX' ? s.minX + 0.08 : s.maxX - 0.08;
    const z = alongX ? (railSide === 'minZ' ? s.minZ + 0.08 : s.maxZ - 0.08) : s.minZ + run * t;
    return new THREE.Vector3(x, y, z);
  };
  for (let t = 0; t <= 1.001; t += 1 / 6) { const p = along(t); k.add(geo.cyl(0.05, 0.05, 1, 6), WHITE, { p: [p.x, p.y + 0.5, p.z] }); }
  const a0 = along(0), a1 = along(1);
  k.add(new THREE.TubeGeometry(new THREE.LineCurve3(a0.clone().setY(a0.y + 1), a1.clone().setY(a1.y + 1)), 1, 0.06, 6), WHITE, {});
}

/** Static old-town meshes, split into four quadrant groups for frustum culling. */
export function buildOldTown(world: World): { root: THREE.Group; cameraBlockers: Solid[]; batteryGlow: THREE.Mesh } {
  const O = OLDTOWN;
  const root = new THREE.Group();
  const blobs: BlobSpot[] = [];
  const cameraBlockers: Solid[] = [];
  const quads = [0, 1, 2, 3].map(() => { const k = new Kit(); k.groundAO = 0.22; return k; });
  const deco = [0, 1, 2, 3].map(() => new Kit());
  const q = (x: number, z: number) => (x < 0 ? 0 : 1) + (z < -6 ? 0 : 2);

  // Ground: park grass everywhere, cobbles on the square, sandy paths through the park.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: GRASS, roughness: 0.95 }));
  ground.receiveShadow = true;
  root.add(ground);
  const flat = new Kit();
  const sqW = O.east + 8 - O.parkEdge, sqD = O.south - O.north;
  flat.add(geo.box(), COBBLE, { p: [(O.parkEdge + O.east + 8) / 2, 0.02, (O.north + O.south) / 2], s: [sqW, 0.04, sqD + 16], finish: 'matte', cast: false });
  for (let x = O.parkEdge + 2; x < O.east; x += 2) flat.add(geo.box(), 0xbca98c, { p: [x, 0.045, (O.north + O.south) / 2], s: [0.05, 0.01, sqD], finish: 'matte', cast: false });
  for (let z = O.north + 2; z < O.south; z += 2) flat.add(geo.box(), 0xbca98c, { p: [(O.parkEdge + O.east) / 2, 0.045, z], s: [O.east - O.parkEdge, 0.01, 0.05], finish: 'matte', cast: false });
  // a lighter compass rose of cobbles in front of the clock tower
  flat.add(geo.cyl(6, 6, 0.05, 40), 0xe3d3b5, { p: [O.tower.x, 0.03, O.tower.z + 9], finish: 'matte', cast: false });
  flat.add(geo.cyl(4.6, 4.6, 0.06, 40), 0xc9a985, { p: [O.tower.x, 0.035, O.tower.z + 9], finish: 'matte', cast: false });
  for (const [x0, z0, x1, z1] of [[-40, 6, -2, 6], [-20, 0, -20, 26], [-38, -24, -2, -24], [-34, -24, -34, 22]]) {
    const len = Math.hypot(x1 - x0, z1 - z0);
    flat.add(geo.box(), 0xe9d7a8, { p: [(x0 + x1) / 2, 0.025, (z0 + z1) / 2], r: [0, Math.atan2(x1 - x0, z1 - z0), 0], s: [2.6, 0.05, len], finish: 'matte', cast: false });
  }
  root.add(flat.build(true));

  // Houses.
  oldtownHouses().forEach((h, i) => {
    const qi = q((h.minX + h.maxX) / 2, (h.minZ + h.maxZ) / 2);
    addHouse(quads[qi], deco[qi], h, faceOf(h), i);
  });
  const main = new Kit();
  main.groundAO = 0.2;

  // Roof terraces: plants, a pergola on B, the outside stair and the ramp from A to B.
  const A = O.terraceA, B = O.terraceB;
  const sa = wedgeTransform(O.stairA);
  main.add(wedge(sa.w, sa.h, sa.d, 0.05), STONE, { p: [sa.x, sa.y, sa.z], r: [0, sa.ry, 0] });
  for (let x = O.stairA.minX + 0.35; x < O.stairA.maxX; x += 0.35) {
    const y = ((x - O.stairA.minX) / (O.stairA.maxX - O.stairA.minX)) * O.stairA.maxY;
    main.add(geo.box(), STONE_DARK, { p: [x, y + 0.01, (O.stairA.minZ + O.stairA.maxZ) / 2], s: [0.04, 0.02, 1.5], cast: false });
  }
  const rab = wedgeTransform(O.rampAB);
  main.add(wedge(rab.w, rab.h, rab.d, 0.05), WOOD, { p: [rab.x, rab.y, rab.z], r: [0, rab.ry, 0] });
  {
    const r = O.rampRail, z = (r.minZ + r.maxZ) / 2, y0 = O.rampAB.minY, y1 = O.rampAB.maxY;
    for (let x = r.minX; x <= r.maxX + 0.01; x += 0.6) {
      const y = y0 + ((x - O.rampAB.minX) / (O.rampAB.maxX - O.rampAB.minX)) * (y1 - y0);
      main.add(geo.cyl(0.045, 0.045, 1, 6), WHITE, { p: [x, y + 0.5, z] });
    }
    const a = new THREE.Vector3(r.minX, y0 + 0.1 + 1, z), b = new THREE.Vector3(r.maxX, y1 + 1, z);
    main.add(new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 1, 0.06, 6), WHITE, {});
  }
  for (const c of CHIMNEYS) {
    main.add(geo.rbox(c.maxX - c.minX, c.maxY - c.minY, c.maxZ - c.minZ, 0.08), 0xe8b4a0, { p: [(c.minX + c.maxX) / 2, (c.minY + c.maxY) / 2, (c.minZ + c.maxZ) / 2] });
    main.add(geo.rbox(c.maxX - c.minX + 0.2, 0.16, c.maxZ - c.minZ + 0.2, 0.05), WHITE, { p: [(c.minX + c.maxX) / 2, c.maxY + 0.08, (c.minZ + c.maxZ) / 2] });
  }
  for (const [x, z, y] of [[3, -29, A.maxY], [11, -34.8, A.maxY], [13, -30, B.maxY], [18.4, -30, B.maxY]]) {
    main.add(geo.cyl(0.32, 0.24, 0.5, 14), TERRACOTTA, { p: [x, y + 0.25, z], finish: 'gloss' });
    main.add(geo.sphere(0.45, 12, 8), 0x58b85a, { p: [x, y + 0.75, z] });
  }
  for (const [x, z] of [[13, -35.6], [18.6, -35.6], [13, -31.5], [18.6, -31.5]]) main.add(geo.cyl(0.07, 0.07, 2.4, 8), WOOD_DARK, { p: [x, B.maxY + 1.2, z] });
  for (let x = 13; x <= 18.7; x += 0.7) main.add(geo.box(), WOOD, { p: [x, B.maxY + 2.4, -33.55], s: [0.1, 0.1, 4.6] });
  for (const z of [-35.6, -31.5]) main.add(geo.box(), WOOD_DARK, { p: [15.8, B.maxY + 2.35, z], s: [5.8, 0.12, 0.12] });
  // grape vine on the pergola
  for (let x = 13.3; x < 18.6; x += 1.1) main.add(geo.sphere(0.45, 10, 8), 0x5cae4f, { p: [x, B.maxY + 2.55, -33.5 + Math.sin(x * 3) * 1.2], s: [1.3, 0.45, 1.1] });

  // Clock tower.
  const T = O.tower, tx = T.x, tz = T.z, roomTop = T.floor + T.room;
  const tw = T.maxX - T.minX;
  main.add(geo.rbox(tw, T.floor, tw, 0.12, 2), STONE, { p: [tx, T.floor / 2, tz] });
  for (let y = 0.5; y < T.floor; y += 1.2) for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const big = Math.round(y / 1.2) % 2 === 0;
    main.add(geo.rbox(big ? 0.9 : 0.6, 0.55, big ? 0.6 : 0.9, 0.06), STONE_DARK, { p: [tx + dx * (tw / 2 - 0.2), y, tz + dz * (tw / 2 - 0.2)] });
  }
  main.add(geo.rbox(tw + 0.3, 0.3, tw + 0.3, 0.08), WHITE, { p: [tx, T.floor - 0.15, tz] });
  // clock room walls (match the solids), lintel over the hatch, cornice, spire
  const wallC = 0xf6cf8a;
  main.add(geo.box(), wallC, { p: [tx, T.floor + T.room / 2, T.minZ + 0.2], s: [tw, T.room, 0.4] });
  main.add(geo.box(), wallC, { p: [T.minX + 0.2, T.floor + T.room / 2, tz], s: [0.4, T.room, tw] });
  main.add(geo.box(), wallC, { p: [T.maxX - 0.2, T.floor + T.room / 2, tz], s: [0.4, T.room, tw] });
  main.add(geo.box(), wallC, { p: [(T.minX + T.door[0]) / 2, T.floor + T.room / 2, T.maxZ - 0.2], s: [T.door[0] - T.minX, T.room, 0.4] });
  main.add(geo.box(), wallC, { p: [(T.door[1] + T.maxX) / 2, T.floor + T.room / 2, T.maxZ - 0.2], s: [T.maxX - T.door[1], T.room, 0.4] });
  main.add(geo.box(), wallC, { p: [tx, T.floor + 2.1 + (T.room - 2.1) / 2, T.maxZ - 0.2], s: [T.door[1] - T.door[0], T.room - 2.1, 0.4] });
  main.add(geo.box(), 0x8a6a50, { p: [tx, T.floor + 0.02, tz], s: [tw - 0.8, 0.04, tw - 0.8], finish: 'matte', cast: false }); // plank floor
  main.add(geo.rbox(tw + 0.6, 0.6, tw + 0.6, 0.12), WHITE, { p: [tx, roomTop + 0.3, tz] });
  main.add(new THREE.ConeGeometry(tw * 0.62, 6.5, 4, 1), COPPER, { p: [tx, T.top + 3.25, tz], r: [0, Math.PI / 4, 0], finish: 'gloss' });
  main.add(geo.sphere(0.3, 14, 10), GOLD, { p: [tx, T.top + 6.7, tz], finish: 'metal' });
  main.add(geo.cyl(0.04, 0.04, 1.6, 6), GOLD, { p: [tx, T.top + 7.5, tz], finish: 'metal' });
  main.add(geo.cone(0.18, 0.5, 8), GOLD, { p: [tx + 0.3, T.top + 7.9, tz], r: [0, 0, -Math.PI / 2], finish: 'metal' });
  // inside the clock room: big brass gear wheels and the clockwork drum
  for (const [x, y, r] of [[T.minX + 0.9, T.floor + 1.6, 0.8], [T.minX + 1.6, T.floor + 2.7, 0.5], [T.maxX - 1, T.floor + 2.2, 0.7]] as const) {
    main.add(geo.torus(r, 0.09, Math.PI * 2, 24), GOLD, { p: [x, y, T.minZ + 0.6], finish: 'metal' });
    for (let a = 0; a < 6; a++) main.add(geo.box(), GOLD, { p: [x, y, T.minZ + 0.6], r: [0, 0, a * 0.52], s: [r * 2, 0.08, 0.06], finish: 'metal' });
  }
  main.add(geo.cyl(0.35, 0.35, 1.4, 16), 0x7b4a2b, { p: [tx, T.floor + 0.7, T.minZ + 1.4], r: [0, 0, Math.PI / 2] });
  // clock faces on all four sides, the south one above the hatch
  const clock = (x: number, z: number, ry: number) => {
    const y = T.floor + 3.05;
    main.add(geo.cyl(0.95, 0.95, 0.12, 36), WHITE, { p: [x, y, z], r: [Math.PI / 2, ry, 0], finish: 'gloss' });
    main.add(geo.torus(0.95, 0.08, Math.PI * 2, 36), GOLD, { p: [x, y, z], r: [0, ry, 0], finish: 'metal' });
    const nx = Math.sin(ry), nz = Math.cos(ry);
    for (let hh = 0; hh < 12; hh++) {
      const a = (hh / 12) * Math.PI * 2, r = 0.75, ox = Math.cos(a) * r;
      main.add(geo.box(), 0x2b2d3a, { p: [x + nz * ox + nx * 0.07, y + Math.sin(a) * r, z - nx * ox + nz * 0.07], r: [0, ry, a], s: [hh % 3 ? 0.12 : 0.22, 0.05, 0.02], cast: false });
    }
    main.add(geo.box(), 0x2b2d3a, { p: [x + nx * 0.09 + nz * 0.12, y + 0.2, z + nz * 0.09 - nx * 0.12], r: [0, ry, -0.9], s: [0.06, 0.55, 0.02], cast: false });
    main.add(geo.box(), 0x2b2d3a, { p: [x + nx * 0.1, y + 0.3, z + nz * 0.1], r: [0, ry, 0.1], s: [0.05, 0.7, 0.02], cast: false });
  };
  clock(tx, T.maxZ + 0.07, 0);
  clock(tx, T.minZ - 0.07, Math.PI);
  clock(T.maxX + 0.07, tz, Math.PI / 2);
  clock(T.minX - 0.07, tz, -Math.PI / 2);
  // the hatch: a little arched wooden door standing ajar on the balcony
  const hatch = new THREE.Matrix4().compose(new THREE.Vector3(T.door[0] + 0.05, T.floor + 1.0, T.maxZ + 0.55), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 1.15, 0)), new THREE.Vector3(1, 1, 1));
  main.addMatrix(geo.rbox(0.1, 2, 1.0, 0.04).clone().translate(0, 0, 0.5), WOOD_DARK, hatch, 'soft');
  main.add(geo.torus(1, 0.06, Math.PI, 24), WOOD, { p: [tx, T.floor + 2.05, T.maxZ + 0.02] });
  // spiral stair: stone landings, wooden flights with railings, the balcony in front of the hatch
  const stair = towerStair();
  const rails: ('minX' | 'maxX' | 'minZ' | 'maxZ')[] = ['maxZ', 'maxX', 'minZ', 'minX'];
  stair.ramps.forEach((r, i) => plank(main, r, WOOD, rails[i]));
  stair.landings.forEach((l, i) => {
    const h = l.maxY - l.minY;
    main.add(geo.rbox(l.maxX - l.minX, h, l.maxZ - l.minZ, 0.08), i === 3 ? WOOD : STONE_DARK, { p: [(l.minX + l.maxX) / 2, (l.minY + l.maxY) / 2, (l.minZ + l.maxZ) / 2] });
  });
  const bal = stair.balcony;
  main.add(geo.rbox(bal.maxX - bal.minX, 0.4, bal.maxZ - bal.minZ, 0.08), WOOD, { p: [(bal.minX + bal.maxX) / 2, bal.maxY - 0.2, (bal.minZ + bal.maxZ) / 2] });
  for (let x = T.minX - T.stair + 0.1; x <= T.maxX; x += 0.6) main.add(geo.cyl(0.045, 0.045, 1, 6), WHITE, { p: [x, T.floor + 0.5, bal.maxZ - 0.08] });
  main.add(geo.box(), WHITE, { p: [(T.minX - T.stair + T.maxX) / 2, T.floor + 1, bal.maxZ - 0.08], s: [T.maxX - T.minX + T.stair, 0.1, 0.1] });
  for (const x of [T.minX + 0.6, T.maxX - 0.6]) main.add(geo.box(), WOOD_DARK, { p: [x, T.floor - 0.9, T.maxZ + 0.75], r: [0.7, 0, 0], s: [0.14, 1.6, 0.14] });
  blobs.push({ x: tx, z: tz, sx: tw + 5, sz: tw + 5 });

  // Pond: stone rim, water, lily pads, ducks; the island with a willow and the footbridge.
  const P = O.pond, I = O.island, BR = O.bridge;
  for (const s of world.solids.filter((s) => s.maxY === P.rimH)) {
    main.add(geo.rbox(s.maxX - s.minX + 0.1, P.rimH, s.maxZ - s.minZ + 0.1, 0.12), STONE_DARK, { p: [(s.minX + s.maxX) / 2, P.rimH / 2, (s.minZ + s.maxZ) / 2] });
  }
  const water = new THREE.Mesh(new THREE.PlaneGeometry(P.maxX - P.minX - 2 * P.rim + 0.2, P.maxZ - P.minZ - 2 * P.rim + 0.2).rotateX(-Math.PI / 2), waterMaterial(0x2f9fd0, { scale: 1.6, sparkle: 0.7 }));
  water.position.set((P.minX + P.maxX) / 2, 0.14, (P.minZ + P.maxZ) / 2);
  water.receiveShadow = true;
  water.name = 'pond';
  root.add(water);
  main.add(geo.rbox(I.maxX - I.minX, I.maxY, I.maxZ - I.minZ, 0.4, 2), 0x8ccf6a, { p: [(I.minX + I.maxX) / 2, I.maxY / 2, (I.minZ + I.maxZ) / 2] });
  main.add(geo.rbox(I.maxX - I.minX + 0.3, 0.3, I.maxZ - I.minZ + 0.3, 0.14), STONE_DARK, { p: [(I.minX + I.maxX) / 2, 0.15, (I.minZ + I.maxZ) / 2] });
  addTree(main, I.minX + 0.8, I.minZ + 0.9, 3, 0.75);
  main.add(geo.rbox(BR.maxX - BR.minX, 0.22, BR.maxZ - BR.minZ, 0.06), WOOD, { p: [(BR.minX + BR.maxX) / 2, BR.maxY - 0.11, (BR.minZ + BR.maxZ) / 2] });
  for (let z = BR.minZ + 0.25; z < BR.maxZ; z += 0.5) main.add(geo.box(), WOOD_DARK, { p: [(BR.minX + BR.maxX) / 2, BR.maxY + 0.005, z], s: [BR.maxX - BR.minX - 0.1, 0.01, 0.04], cast: false });
  for (const x of [BR.minX + 0.08, BR.maxX - 0.08]) {
    for (let z = BR.minZ; z <= BR.maxZ + 0.01; z += 1) main.add(geo.cyl(0.05, 0.05, 0.9, 6), WHITE, { p: [x, BR.maxY + 0.45, z] });
    main.add(geo.box(), WHITE, { p: [x, BR.maxY + 0.9, (BR.minZ + BR.maxZ) / 2], s: [0.09, 0.09, BR.maxZ - BR.minZ] });
  }
  // little white picket fence round the island (the bridge rails are drawn above)
  for (const r of pondRails().slice(2)) {
    const alongX = r.maxX - r.minX > r.maxZ - r.minZ, len = alongX ? r.maxX - r.minX : r.maxZ - r.minZ;
    const cx = (r.minX + r.maxX) / 2, cz = (r.minZ + r.maxZ) / 2;
    main.add(geo.box(), WHITE, { p: [cx, I.maxY + 0.55, cz], s: alongX ? [len, 0.08, 0.08] : [0.08, 0.08, len] });
    for (let u = 0; u <= len + 0.01; u += 0.5) main.add(geo.rbox(0.09, 0.7, 0.05, 0.02), WHITE, { p: alongX ? [r.minX + u, I.maxY + 0.35, cz] : [cx, I.maxY + 0.35, r.minZ + u], cast: false });
  }
  const brr = wedgeTransform(O.bridgeRamp);
  main.add(wedge(brr.w, brr.h, brr.d, 0.04), WOOD, { p: [brr.x, brr.y, brr.z], r: [0, brr.ry, 0] });
  for (const [x, z] of [[-27, -13], [-17, -7], [-26, -6.5], [-16.5, -13.5], [-19, -14]]) main.add(geo.cyl(0.42, 0.42, 0.03, 12), 0x4caf50, { p: [x, 0.17, z], cast: false });
  main.add(geo.sphere(0.12, 8, 6), 0xff8fc0, { p: [-26.9, 0.24, -12.9], cast: false });
  for (const [x, z, r] of [[-25.5, -14, 0.4], [-18, -11.5, 2.2], [-27.5, -7.5, -1]]) {
    main.add(geo.sphere(0.24, 12, 8), 0xffe066, { p: [x, 0.3, z], s: [1.3, 0.9, 1], finish: 'gloss' });
    main.add(geo.sphere(0.14, 10, 8), 0xffe066, { p: [x + Math.cos(r) * 0.25, 0.48, z + Math.sin(r) * 0.25], finish: 'gloss' });
    main.add(geo.cone(0.05, 0.12, 6), 0xff8c1a, { p: [x + Math.cos(r) * 0.4, 0.47, z + Math.sin(r) * 0.4], r: [0, -r - Math.PI / 2, Math.PI / 2], cast: false });
  }

  // Bandstand: raised floor, white pillars, railing, red-and-white striped pyramid roof.
  const S = O.bandstand;
  main.add(geo.rbox(S.half * 2, S.y, S.half * 2, 0.15), STONE, { p: [S.x, S.y / 2, S.z] });
  main.add(geo.rbox(S.half * 2 - 0.2, 0.06, S.half * 2 - 0.2, 0.03), 0xb4794b, { p: [S.x, S.y + 0.03, S.z], cast: false });
  for (const dx of [-1, 1]) for (const dz of [-1, 1]) {
    const x = S.x + dx * (S.half - 0.3), z = S.z + dz * (S.half - 0.3);
    main.add(geo.cyl(0.15, 0.18, S.roof - S.y, 12), WHITE, { p: [x, (S.roof + S.y) / 2, z], finish: 'gloss' });
  }
  for (const [x0, z0, x1, z1] of [[-1, -1, 1, -1], [-1, 1, 1, 1], [-1, -1, -1, 1]]) {
    const ax = S.x + x0 * (S.half - 0.3), az = S.z + z0 * (S.half - 0.3), bx = S.x + x1 * (S.half - 0.3), bz = S.z + z1 * (S.half - 0.3);
    main.add(geo.box(), WHITE, { p: [(ax + bx) / 2, S.y + 0.85, (az + bz) / 2], s: [Math.abs(bx - ax) + 0.1, 0.08, Math.abs(bz - az) + 0.1] });
    for (let t = 0.1; t < 1; t += 0.1) main.add(geo.cyl(0.03, 0.03, 0.8, 6), WHITE, { p: [ax + (bx - ax) * t, S.y + 0.45, az + (bz - az) * t], cast: false });
  }
  for (let s = 0; s < 8; s++) main.add(new THREE.ConeGeometry(S.half * 1.5, 2.2, 4, 1, false, (s / 8) * Math.PI * 2, Math.PI / 4), s % 2 ? WHITE : 0xe63946, { p: [S.x, S.roof + 1.1, S.z], r: [0, Math.PI / 4, 0], finish: 'gloss' });
  main.add(geo.sphere(0.22, 12, 8), GOLD, { p: [S.x, S.roof + 2.3, S.z], finish: 'metal' });
  const ss = wedgeTransform(O.bandstandSteps);
  main.add(wedge(ss.w, ss.h, ss.d, 0.04), STONE, { p: [ss.x, ss.y, ss.z], r: [0, ss.ry, 0] });
  cameraBlockers.push({ minX: S.x - S.half - 0.4, maxX: S.x + S.half + 0.4, minY: S.roof, maxY: S.roof + 1.6, minZ: S.z - S.half - 0.4, maxZ: S.z + S.half + 0.4 });
  blobs.push({ x: S.x, z: S.z, sx: S.half * 2 + 3, sz: S.half * 2 + 3 });

  // Park: trees, hedges, flower beds. Square: café umbrellas with tables, market stalls with fruit crates.
  world.props.forEach((p, i) => {
    const k = quads[q(p.x, p.z)];
    if (p.kind === 'tree') {
      addTree(k, p.x, p.z, i);
      cameraBlockers.push({ minX: p.x - 1.2, minY: 2.2, minZ: p.z - 1.2, maxX: p.x + 1.2, maxY: 4.6, maxZ: p.z + 1.2 });
      blobs.push({ x: p.x + 0.4, z: p.z + 0.3, sx: 4, sz: 4 });
    } else if (p.kind === 'umbrella') {
      k.add(geo.cyl(0.05, 0.05, 2.4, 8), WHITE, { p: [p.x, 1.2, p.z] });
      for (let s = 0; s < 8; s++) k.add(new THREE.ConeGeometry(1.6, 0.6, 3, 1, false, (s / 8) * Math.PI * 2, Math.PI / 4), s % 2 ? WHITE : [0x2e7d8c, 0xe63946, 0x3f8f5a][i % 3], { p: [p.x, 2.45, p.z] });
      k.add(geo.cyl(0.6, 0.6, 0.06, 20), WHITE, { p: [p.x, 0.75, p.z], finish: 'gloss' });
      for (let c = 0; c < 3; c++) {
        const a = c * 2.1 + i, cx = p.x + Math.cos(a) * 1.05, cz = p.z + Math.sin(a) * 1.05;
        k.add(geo.rbox(0.42, 0.06, 0.42, 0.02), 0x2e7d8c, { p: [cx, 0.45, cz] });
        k.add(geo.rbox(0.42, 0.42, 0.06, 0.02), 0x2e7d8c, { p: [cx + Math.cos(a) * 0.2, 0.68, cz + Math.sin(a) * 0.2], r: [0, -a + Math.PI / 2, 0] });
      }
      blobs.push({ x: p.x + 0.3, z: p.z + 0.3, sx: 3.4, sz: 3.4 });
    }
  });
  // hedges along the park edge, open where the paths cross
  for (const [z0, z1] of O.hedges) for (let z = z0; z < z1 - 0.01; z += 2) main.add(geo.rbox(1.1, 1.0, Math.min(2.05, z1 - z), 0.4), 0x3f9f4a, { p: [O.parkEdge - 0.6, 0.5, z + Math.min(2, z1 - z) / 2] });
  for (const [x, z] of [[-14, -20], [-36, 14], [-10, 16], [-36, -10]]) {
    main.add(geo.cyl(1.6, 1.8, 0.3, 20), STONE_DARK, { p: [x, 0.15, z] });
    for (let f = 0; f < 10; f++) main.add(geo.sphere(0.22, 8, 6), [0xff5d73, 0xffd166, 0xb388eb, 0xff8fc0][f % 4], { p: [x + Math.cos(f * 0.63) * 1.1, 0.45, z + Math.sin(f * 0.63) * 1.1], cast: false });
    main.add(geo.sphere(0.5, 12, 8), 0x58b85a, { p: [x, 0.5, z] });
  }
  for (const [si, s] of O.stalls.entries()) {
    const cx = (s.minX + s.maxX) / 2, cz = (s.minZ + s.maxZ) / 2, w = s.maxX - s.minX;
    main.add(geo.rbox(w, s.maxY, s.maxZ - s.minZ, 0.06), WOOD, { p: [cx, s.maxY / 2, cz] });
    for (const x of [s.minX + 0.1, s.maxX - 0.1]) main.add(geo.cyl(0.06, 0.06, 2.6, 6), WOOD_DARK, { p: [x, 1.3, s.minZ + 0.1] });
    for (let b = 0; b < 6; b++) main.add(geo.rbox(w / 6, 0.08, 2, 0.03), b % 2 ? WHITE : si ? 0x3f8f5a : 0xe63946, { p: [s.minX + (w * (b + 0.5)) / 6, 2.55, cz + 0.4], r: [0.25, 0, 0] });
    for (let c = 0; c < 3; c++) {
      main.add(geo.rbox(1, 0.3, 0.8, 0.04), 0xc99a62, { p: [s.minX + 0.7 + c * 1.3, s.maxY + 0.15, cz] });
      for (let f = 0; f < 5; f++) main.add(geo.sphere(0.13, 8, 6), [0xff3b30, 0xff9f1c, 0x8bc34a][(c + si) % 3], { p: [s.minX + 0.4 + c * 1.3 + (f % 3) * 0.28, s.maxY + 0.38, cz - 0.15 + Math.floor(f / 3) * 0.3], cast: false });
    }
    blobs.push({ x: cx, z: cz, sx: w + 1, sz: 2.5 });
  }

  // Lamps and benches share one batch.
  const furniture = new THREE.Group();
  for (const p of world.props) {
    if (p.kind !== 'lamp' && p.kind !== 'bench') continue;
    const m = p.kind === 'lamp' ? studioLamp() : studioBench();
    m.position.set(p.x, 0, p.z);
    furniture.add(m);
  }
  root.add(batchStatic(furniture));

  root.add(main.build(true));
  for (const k of [...quads, ...deco]) root.add(k.build(true));
  root.add(buildBlobs(blobs));
  cameraBlockers.push({ minX: T.minX - 0.3, maxX: T.maxX + 0.3, minY: roomTop, maxY: T.top + 4, minZ: T.minZ - 0.3, maxZ: T.maxZ + 0.3 });
  return { root, cameraBlockers, batteryGlow: buildBatteryGlow() };
}

/** Electric-blue flicker in the clock-room hatch and behind the clock faces while the battery is still up there. */
function buildBatteryGlow(): THREE.Mesh {
  const T = OLDTOWN.tower, y = T.floor + 1.1;
  const quads = [
    new THREE.PlaneGeometry(2.4, 2.6).translate(T.x, y, T.maxZ + 0.05),
    new THREE.PlaneGeometry(2.6, 2.6).translate(T.x, T.floor + 3.05, T.maxZ + 0.2),
    new THREE.PlaneGeometry(2.6, 2.6).rotateY(Math.PI / 2).translate(T.maxX + 0.2, T.floor + 3.05, T.z),
    new THREE.PlaneGeometry(2.6, 2.6).rotateY(-Math.PI / 2).translate(T.minX - 0.2, T.floor + 3.05, T.z),
    new THREE.PlaneGeometry(2.6, 2.6).rotateY(Math.PI).translate(T.x, T.floor + 3.05, T.minZ - 0.2),
  ];
  const g = mergeGeometries(quads)!;
  quads.forEach((q) => q.dispose());
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
    map: glowTexture(), color: 0x7bf7ff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
  }));
  m.name = 'battery-glow';
  m.castShadow = false;
  return m;
}
