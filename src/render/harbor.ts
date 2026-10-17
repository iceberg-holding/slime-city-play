import * as THREE from 'three';
import { batchStatic } from './art/batch';
import { bench as studioBench, lamp as studioLamp } from './art/studio';
import { buildBlobs, wedge, wedgeTransform, type BlobSpot } from './city';
import { Kit, geo, lathe, waterMaterial } from './materials';
import { HARBOR, HARBOR_GEAR } from '../sim/harbor';
import type { Solid, World } from '../sim/types';

// Level 2 look: whitewash, terracotta, sand, sea teal and sunny boat colours (level 1 is pastel Paris stone and slate).

const SAND = 0xf3dca8;
const PAVING = 0xe6d2b0;
const WOOD = 0xb4794b;
const WOOD_DARK = 0x8a5a38;
const STONE = 0xc9c2b4;
const TERRACOTTA = 0xd9643a;
const WHITE = 0xfffaf0;
const NAVY = 0x23406e;

/** Triangular gable roof prism: width along x, ridge along z. */
export function gable(w: number, h: number, d: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0);
  s.lineTo(w / 2, 0);
  s.lineTo(0, h);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 1 });
  g.translate(0, 0, -d / 2);
  return g;
}

/** Static harbor meshes, split into four quadrant groups for frustum culling. */
export function buildHarbor(world: World): { root: THREE.Group; cameraBlockers: Solid[]; water: THREE.Mesh } {
  const H = HARBOR;
  const root = new THREE.Group();
  const blobs: BlobSpot[] = [];
  const quads = [0, 1, 2, 3].map(() => {
    const k = new Kit();
    k.groundAO = 0.22;
    return k;
  });
  const deco = [0, 1, 2, 3].map(() => new Kit());
  const q = (x: number, z: number) => (x < 0 ? 0 : 1) + (z < -6 ? 0 : 2);

  // Sand everywhere on land, a big sea plane to the north.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 160).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.95 }));
  ground.position.set(0, 0, 66);
  ground.receiveShadow = true;
  root.add(ground);
  const water = buildWater();
  root.add(water);

  const main = new Kit();
  main.groundAO = 0.2;
  const flat = new Kit();
  // Promenade paving with a darker border and tile lines.
  const pw = H.east - H.beachMaxX, pz = H.south - H.seawallZ;
  flat.add(geo.rbox(pw, 0.1, pz, 0.04), PAVING, { p: [(H.east + H.beachMaxX) / 2, 0, (H.south + H.seawallZ) / 2], finish: 'matte', cast: false });
  flat.add(geo.rbox(0.6, 0.12, pz, 0.04), 0xcdb48c, { p: [H.beachMaxX + 0.3, 0.01, (H.south + H.seawallZ) / 2], finish: 'matte', cast: false });
  for (let x = H.beachMaxX + 3; x < H.east; x += 3) flat.add(geo.box(), 0xd8c29d, { p: [x, 0.055, (H.south + H.seawallZ) / 2], s: [0.06, 0.01, pz], finish: 'matte', cast: false });
  for (let z = H.seawallZ + 3; z < H.south; z += 3) flat.add(geo.box(), 0xd8c29d, { p: [(H.east + H.beachMaxX) / 2, 0.055, z], s: [pw, 0.01, 0.06], finish: 'matte', cast: false });
  // Wet sand strip along the waterline.
  flat.add(geo.box(), 0xdcc28d, { p: [(H.west + H.beachMaxX) / 2, 0.005, H.seawallZ + 1.2], s: [H.beachMaxX - H.west, 0.01, 2.4], finish: 'matte', cast: false });
  // Towels on the beach.
  for (const [x, z, c] of [[-29, -7, 0xff6f91], [-18, -7.5, 0x4dc9ff], [-27, 12, 0xffd166], [-16, 9, 0x7ee081]] as const) {
    flat.add(geo.rbox(1, 0.04, 1.9, 0.02), c, { p: [x, 0.02, z], r: [0, 0.3, 0], finish: 'matte', cast: false });
    flat.add(geo.rbox(1, 0.045, 0.3, 0.02), WHITE, { p: [x, 0.025, z], r: [0, 0.3, 0], finish: 'matte', cast: false });
  }
  root.add(flat.build(true));

  // Seawall: stone with a white coping and posts; a rope fence along the beach.
  const wall = main;
  for (const s of world.solids.filter((s) => s.maxZ === H.seawallZ && s.maxY === 1)) {
    const w = s.maxX - s.minX, cx = (s.minX + s.maxX) / 2;
    const beach = s.maxX <= H.beachMaxX + 0.01;
    if (beach) {
      for (let x = s.minX + 1; x < s.maxX; x += 3) wall.add(geo.cyl(0.09, 0.11, 1.1, 10), WOOD, { p: [x, 0.55, H.seawallZ - 0.2] });
      wall.add(geo.box(), 0xe8d6a4, { p: [cx, 0.85, H.seawallZ - 0.2], s: [w, 0.06, 0.06] });
      wall.add(geo.box(), 0xe8d6a4, { p: [cx, 0.45, H.seawallZ - 0.2], s: [w, 0.05, 0.05] });
    } else {
      wall.add(geo.rbox(w, 0.75, 0.6, 0.12), STONE, { p: [cx, 0.375, H.seawallZ - 0.25] });
      wall.add(geo.rbox(w + 0.1, 0.12, 0.7, 0.05), WHITE, { p: [cx, 0.8, H.seawallZ - 0.25] });
      for (let x = s.minX + 0.6; x < s.maxX; x += 2.4) wall.add(geo.capsule(0.05, 0.45, 8), NAVY, { p: [x, 1.05, H.seawallZ - 0.25], finish: 'metal' });
      wall.add(geo.capsule(0.04, w, 8), NAVY, { p: [cx, 1.25, H.seawallZ - 0.25], r: [0, 0, Math.PI / 2], finish: 'metal' });
    }
  }

  // Houses along the south edge (tall, narrow, colourful) and striped beach huts by the dunes.
  world.buildings.forEach((b, i) => {
    const k = quads[q((b.minX + b.maxX) / 2, b.minZ)], d = deco[q((b.minX + b.maxX) / 2, b.minZ)];
    const w = b.maxX - b.minX, dz = b.maxZ - b.minZ, cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
    const hut = b.height < 3;
    if (hut) {
      for (let s = 0; s < 5; s++) k.add(geo.rbox(w, b.height, dz / 5, 0.05), s % 2 ? WHITE : b.color, { p: [cx, b.height / 2, b.minZ + dz * (s + 0.5) / 5] });
      k.add(gable(dz + 0.5, 1, w + 0.4), TERRACOTTA, { p: [cx, b.height, cz], r: [0, Math.PI / 2, 0] });
      d.add(geo.rbox(0.12, 1.7, 1, 0.04), NAVY, { p: [b.maxX + 0.02, 0.9, cz], cast: false });
      blobs.push({ x: cx + 0.4, z: cz, sx: w + 1.6, sz: dz + 1 });
      return;
    }
    k.add(geo.rbox(w - 0.1, b.height, dz, 0.2, 2), b.color, { p: [cx, b.height / 2, cz] });
    k.add(geo.rbox(w + 0.05, 0.5, dz + 0.1, 0.1), shade(b.color, 0.82), { p: [cx, 0.25, cz] });
    k.add(gable(w + 0.5, 2.2 + (i % 3) * 0.5, dz + 0.6), i % 4 === 3 ? 0x4b6b8a : TERRACOTTA, { p: [cx, b.height, cz], finish: 'gloss' });
    k.add(geo.rbox(w + 0.2, 0.2, 0.3, 0.08), WHITE, { p: [cx, b.height - 0.1, b.minZ - 0.1] });
    // Front (north) facade: door, windows with shutters, a little balcony every other house.
    const n = Math.max(1, Math.round(w / 2.6));
    for (let y = 3.4; y + 1 < b.height; y += 2.4) {
      for (let c = 0; c < n; c++) {
        const x = b.minX + (w * (c + 0.5)) / n;
        d.add(geo.rbox(1.1, 1.5, 0.12, 0.05), WHITE, { p: [x, y, b.minZ - 0.03], cast: false });
        d.add(geo.rbox(0.82, 1.22, 0.1, 0.04), 0x2d5d8a, { p: [x, y, b.minZ - 0.07], finish: 'glass', cast: false });
        for (const s of [-1, 1]) d.add(geo.rbox(0.36, 1.4, 0.08, 0.03), i % 2 ? 0x2a9d8f : 0x3d7cc9, { p: [x + s * 0.75, y, b.minZ - 0.06], cast: false });
      }
      if (i % 2 === 0 && y < 4) {
        k.add(geo.rbox(w * 0.6, 0.12, 0.8, 0.05), WHITE, { p: [cx, y - 0.85, b.minZ - 0.4] });
        for (let x = cx - w * 0.28; x <= cx + w * 0.28 + 0.01; x += 0.4) d.add(geo.cyl(0.03, 0.03, 0.7, 6), NAVY, { p: [x, y - 0.45, b.minZ - 0.75], cast: false });
      }
    }
    d.add(geo.rbox(1.1, 2.1, 0.12, 0.08), i % 3 === 0 ? 0x2a9d8f : i % 3 === 1 ? NAVY : 0xb5523b, { p: [cx, 1.05, b.minZ - 0.04], cast: false });
    // Striped café awning on some houses.
    if (i % 3 === 1) {
      for (let s = 0; s < 6; s++) k.add(geo.rbox(w * 0.8 / 6, 0.08, 1.4, 0.03), s % 2 ? WHITE : 0xe63946, { p: [b.minX + w * 0.1 + (w * 0.8 * (s + 0.5)) / 6, 2.55, b.minZ - 0.65], r: [0.35, 0, 0] });
    }
  });

  // Wooden pier: planks, pilings, rails, lifebuoys.
  const P = H.pier;
  const pier = main;
  pier.add(geo.rbox(P.maxX - P.minX, 0.3, P.maxZ - P.minZ, 0.08), WOOD, { p: [(P.minX + P.maxX) / 2, P.y - 0.15, (P.minZ + P.maxZ) / 2] });
  for (let z = P.minZ + 0.5; z < P.maxZ; z += 1) pier.add(geo.box(), WOOD_DARK, { p: [(P.minX + P.maxX) / 2, P.y + 0.005, z], s: [P.maxX - P.minX - 0.1, 0.01, 0.05], cast: false });
  for (let z = P.minZ + 0.6; z < P.maxZ; z += 4) for (const x of [P.minX + 0.3, P.maxX - 0.3]) pier.add(geo.cyl(0.18, 0.2, P.y + 0.6, 10), WOOD_DARK, { p: [x, (P.y - 0.6) / 2, z] });
  const rail = (x: number, z0: number, z1: number) => {
    for (let z = z0 + 0.15; z <= z1; z += 2) pier.add(geo.rbox(0.14, 1, 0.14, 0.04), WHITE, { p: [x, P.y + 0.5, z] });
    pier.add(geo.rbox(0.12, 0.12, z1 - z0, 0.05), WHITE, { p: [x, P.y + 1, (z0 + z1) / 2] });
  };
  rail(P.minX + 0.12, P.minZ, P.maxZ);
  rail(P.maxX - 0.12, P.minZ, P.boardFrom);
  rail(P.maxX - 0.12, P.boardTo, P.maxZ);
  pier.add(geo.rbox(P.maxX - P.minX, 0.12, 0.12, 0.05), WHITE, { p: [(P.minX + P.maxX) / 2, P.y + 1, P.minZ + 0.12] });
  for (const z of [-30, -18]) pier.add(geo.torus(0.32, 0.1, Math.PI * 2, 20), z === -30 ? 0xff5d5d : 0xffffff, { p: [P.minX + 0.05, P.y + 0.55, z], r: [0, Math.PI / 2, 0], finish: 'gloss' });
  const pr = wedgeTransform(H.pierRamp);
  pier.add(wedge(pr.w, pr.h, pr.d, 0.06), WOOD, { p: [pr.x, pr.y, pr.z], r: [0, pr.ry, 0] });

  // Moored fishing boat (walkable) plus two decorative boats out at sea.
  boat(main, H.boat, 0xffc93c, true);
  boat(main, { minX: 8, maxX: 12, minZ: -32, maxZ: -23, y: 1.2 }, 0xe63946, false);
  boat(main, { minX: -22, maxX: -18.5, minZ: -30, maxZ: -22, y: 1 }, 0x4dc9ff, false);
  sailboat(main, -40, -48);

  // Stone jetty, lighthouse and its gallery.
  const J = H.jetty, L = H.lighthouse;
  const jet = main;
  jet.add(geo.rbox(J.maxX - J.minX, J.y + 0.4, J.maxZ - J.minZ, 0.15), STONE, { p: [(J.minX + J.maxX) / 2, (J.y - 0.4) / 2, (J.minZ + J.maxZ) / 2] });
  for (const x of [J.minX + 0.15, J.maxX - 0.15]) jet.add(geo.rbox(0.3, 1, J.maxZ - J.minZ, 0.1), 0xb8b0a1, { p: [x, J.y + 0.5, (J.minZ + J.maxZ) / 2] });
  jet.add(geo.rbox(J.maxX - J.minX, 1, 0.3, 0.1), 0xb8b0a1, { p: [(J.minX + J.maxX) / 2, J.y + 0.5, J.minZ + 0.15] });
  for (let z = J.minZ + 2; z < J.maxZ; z += 3) jet.add(geo.sphere(0.9, 10, 8), 0x9c9587, { p: [J.minX - 0.6, 0, z], s: [1, 0.6, 1.3] });
  for (let z = J.minZ + 3.5; z < J.maxZ; z += 3.3) jet.add(geo.sphere(0.8, 10, 8), 0xa39c8e, { p: [J.maxX + 0.6, 0, z], s: [1.2, 0.6, 1] });
  // Striped tower with a lantern room.
  const bands = 6, bandH = L.height / bands;
  for (let b = 0; b < bands; b++) {
    const r0 = L.half * (1 - 0.18 * (b / bands)), r1 = L.half * (1 - 0.18 * ((b + 1) / bands));
    jet.add(geo.cyl(r1, r0, bandH, 28), b % 2 ? 0xe63946 : WHITE, { p: [L.x, b * bandH + bandH / 2, L.z], finish: 'gloss' });
  }
  jet.add(geo.cyl(L.half * 1.05, L.half * 1.05, 0.25, 28), NAVY, { p: [L.x, L.height + 0.12, L.z] });
  for (let a = 0; a < 10; a++) jet.add(geo.cyl(0.04, 0.04, 1.4, 6), NAVY, { p: [L.x + Math.cos((a / 10) * Math.PI * 2) * 1.1, L.height + 0.9, L.z + Math.sin((a / 10) * Math.PI * 2) * 1.1], finish: 'metal' });
  jet.add(geo.cone(1.45, 1.2, 28), 0xe63946, { p: [L.x, L.height + 2.2, L.z], finish: 'gloss' });
  jet.add(geo.sphere(0.2, 12, 8), 0xffd166, { p: [L.x, L.height + 2.9, L.z], finish: 'gloss' });
  const G = H.gallery, GR = H.galleryRamp;
  jet.add(geo.rbox(G.maxX - G.minX, 0.35, G.maxZ - G.minZ, 0.08), WOOD, { p: [(G.minX + G.maxX) / 2, G.maxY - 0.17, (G.minZ + G.maxZ) / 2] });
  for (const x of [G.minX + 0.3, G.maxX - 0.3]) for (const z of [G.minZ + 0.3, G.maxZ - 0.3]) jet.add(geo.cyl(0.13, 0.13, G.maxY, 8), WOOD_DARK, { p: [x, G.maxY / 2, z] });
  const gr = wedgeTransform(GR);
  jet.add(wedge(gr.w, gr.h, gr.d, 0.06), WOOD, { p: [gr.x, gr.y, gr.z], r: [0, gr.ry, 0] });
  // Railings matching the gallery/ramp guard solids.
  for (let z = G.minZ; z <= GR.maxZ; z += 1.5) {
    const top = z < GR.minZ ? G.maxY : GR.minY + ((GR.maxZ - z) / (GR.maxZ - GR.minZ)) * (GR.maxY - GR.minY);
    jet.add(geo.cyl(0.05, 0.05, top + 1, 6), WHITE, { p: [J.minX + 0.15, (top + 1) / 2, z] });
  }
  for (let x = G.maxX - 0.15, z = G.minZ; z <= G.maxZ; z += 0.65) jet.add(geo.cyl(0.05, 0.05, 1, 6), WHITE, { p: [x, G.maxY + 0.5, z] });
  jet.add(geo.rbox(0.12, 0.12, G.maxZ - G.minZ, 0.05), WHITE, { p: [G.maxX - 0.15, G.maxY + 1, (G.minZ + G.maxZ) / 2] });
  // Sloped handrail over the ramp.
  const handrail = new THREE.CatmullRomCurve3([new THREE.Vector3(J.minX + 0.15, GR.minY + 1, GR.maxZ), new THREE.Vector3(J.minX + 0.15, GR.maxY + 1, GR.minZ), new THREE.Vector3(J.minX + 0.15, G.maxY + 1, G.minZ)]);
  jet.add(new THREE.TubeGeometry(handrail, 8, 0.06, 6, false), WHITE, { cast: false });
  // The lantern itself glows.
  const lantern = new THREE.Mesh(geo.cyl(0.9, 0.9, 1.3, 20), new THREE.MeshStandardMaterial({ color: 0xfff4c2, emissive: 0xffd36b, emissiveIntensity: 1.4, roughness: 0.2 }));
  lantern.position.set(L.x, L.height + 0.9, L.z);
  lantern.name = 'lighthouse-lantern';
  root.add(lantern);

  // Lifeguard tower: stilts, platform, hut with a striped roof, ramp.
  const LG = H.lifeguard, LR = H.lifeguardRamp;
  const life = main;
  const lx = (LG.minX + LG.maxX) / 2, lz = (LG.minZ + LG.maxZ) / 2;
  life.add(geo.rbox(LG.maxX - LG.minX, 0.3, LG.maxZ - LG.minZ, 0.08), WOOD, { p: [lx, LG.maxY - 0.15, lz] });
  for (const x of [LG.minX + 0.3, LG.maxX - 0.3]) for (const z of [LG.minZ + 0.3, LG.maxZ - 0.3]) life.add(geo.cyl(0.12, 0.14, LG.maxY, 8), WHITE, { p: [x, LG.maxY / 2, z] });
  for (const z of [LG.minZ + 0.3, LG.maxZ - 0.3]) for (const x of [LG.minX + 0.3, LG.maxX - 0.3]) life.add(geo.cyl(0.06, 0.06, 2.4, 6), WHITE, { p: [x, LG.maxY + 1.2, z] });
  for (let s = 0; s < 4; s++) life.add(new THREE.ConeGeometry(2.3, 0.9, 1, 1, false, (s / 4) * Math.PI * 2, Math.PI / 2), s % 2 ? WHITE : 0xe63946, { p: [lx, LG.maxY + 2.85, lz], r: [0, Math.PI / 4, 0], finish: 'gloss' });
  life.add(geo.rbox(1.6, 0.5, 0.08, 0.04), 0xe63946, { p: [lx, LG.maxY + 0.45, LG.minZ + 0.1], cast: false });
  life.add(geo.rbox(0.3, 0.3, 0.09, 0.03), WHITE, { p: [lx, LG.maxY + 0.45, LG.minZ + 0.06], cast: false });
  const lr = wedgeTransform(LR);
  life.add(wedge(lr.w, lr.h, lr.d, 0.06), WOOD, { p: [lr.x, lr.y, lr.z], r: [0, lr.ry, 0] });
  blobs.push({ x: lx, z: lz, sx: 4.5, sz: 4.5 });

  // Umbrellas and palms.
  const props = main;
  const UMB = [0xff6f91, 0x4dc9ff, 0xffd166, 0x7ee081, 0xb388eb];
  world.props.forEach((p, i) => {
    if (p.kind === 'umbrella') {
      props.add(geo.cyl(0.05, 0.05, 2.4, 8), WHITE, { p: [p.x, 1.2, p.z] });
      for (let s = 0; s < 8; s++) {
        props.add(new THREE.ConeGeometry(1.5, 0.7, 3, 1, false, (s / 8) * Math.PI * 2, Math.PI / 4), s % 2 ? WHITE : UMB[i % UMB.length], { p: [p.x, 2.45, p.z] });
      }
      props.add(geo.sphere(0.08, 8, 6), WHITE, { p: [p.x, 2.82, p.z] });
      blobs.push({ x: p.x + 0.4, z: p.z + 0.3, sx: 3, sz: 3 });
    } else if (p.kind === 'palm') {
      for (let s = 0; s < 6; s++) props.add(geo.cyl(0.2 - s * 0.015, 0.24 - s * 0.015, 0.75, 10), s % 2 ? 0xa97a4f : 0xc08e5c, { p: [p.x + s * s * 0.012, 0.37 + s * 0.72, p.z], r: [0, 0, -0.05 - s * 0.02] });
      const tx = p.x + 0.45, ty = 4.6;
      for (let a = 0; a < 7; a++) {
        const ang = (a / 7) * Math.PI * 2 + i;
        props.add(geo.sphere(1, 12, 6), a % 2 ? 0x3fae6b : 0x52c27c, { p: [tx + Math.cos(ang) * 1.1, ty - 0.25, p.z + Math.sin(ang) * 1.1], r: [0, -ang, 0.35], s: [1.5, 0.12, 0.42] });
      }
      for (const [dx, dz] of [[0.2, 0], [-0.1, 0.18], [-0.1, -0.18]]) props.add(geo.sphere(0.16, 10, 8), 0x7a5230, { p: [tx + dx, ty - 0.35, p.z + dz] });
      blobs.push({ x: p.x + 0.5, z: p.z, sx: 2.8, sz: 2.8 });
    }
  });
  // Lamps and benches share one batch.
  const furniture = new THREE.Group();
  for (const p of world.props) {
    if (p.kind !== 'lamp' && p.kind !== 'bench') continue;
    const m = p.kind === 'lamp' ? studioLamp() : studioBench();
    m.position.set(p.x, 0, p.z);
    furniture.add(m);
  }
  root.add(batchStatic(furniture));

  // West dunes with beach grass; east warehouses with a harbor crane.
  const edge = main;
  for (let z = H.seawallZ + 1; z < H.south + 12; z += 4.5) {
    edge.add(geo.sphere(1, 16, 10), z % 2 ? 0xead09a : 0xe2c48b, { p: [H.west - 2, 0, z], s: [4.2, 5.8 + Math.sin(z) * 1.2, 3.4] });
    for (let g = 0; g < 3; g++) edge.add(geo.cone(0.25, 1, 5), 0x8cbf5a, { p: [H.west + 0.3 + g * 0.2, 0.4, z + g - 1], r: [0, 0, -0.3 + g * 0.2], cast: false });
  }
  for (let z = H.seawallZ; z < H.south + 12; z += 11) {
    const c = [0x4d96ff, 0xe76f51, 0x2a9d8f][Math.abs(Math.round(z)) % 3];
    edge.add(geo.rbox(6, 7, 10.6, 0.2), c, { p: [H.east + 3, 3.5, z + 5.5] });
    for (let x = 0; x < 9; x++) edge.add(geo.box(), shade(c, 0.85), { p: [H.east + 0.02, 3.5, z + 0.8 + x * 1.15], s: [0.06, 6.6, 0.5], cast: false });
    edge.add(geo.rbox(0.15, 3.6, 3.2, 0.06), 0xf1f1f1, { p: [H.east - 0.02, 1.8, z + 5.5], cast: false });
    edge.add(gable(10.8, 1.4, 6.4), 0x9aa4b2, { p: [H.east + 3, 7, z + 5.5], r: [0, Math.PI / 2, 0] });
  }
  // crane at the head of the east quay
  edge.add(geo.rbox(0.6, 14, 0.6, 0.1), 0xffb703, { p: [H.east + 2, 7, H.seawallZ - 2] });
  edge.add(geo.rbox(12, 0.6, 0.6, 0.1), 0xffb703, { p: [H.east - 1, 14, H.seawallZ - 2] });
  edge.add(geo.rbox(1.6, 1.4, 1.6, 0.15), 0x2b2d3a, { p: [H.east + 2, 13, H.seawallZ - 2] });
  edge.add(geo.cyl(0.03, 0.03, 6, 4), 0x2b2d3a, { p: [H.east - 6, 11, H.seawallZ - 2], cast: false });
  edge.add(geo.rbox(2.4, 1.2, 1.4, 0.1), 0xe63946, { p: [H.east - 6, 7.6, H.seawallZ - 2] });

  // Fishing gear: crates with slats, banded barrels, a rope coil and a draped net.
  for (const g of HARBOR_GEAR) {
    if (g.kind === 'crate') {
      main.add(geo.rbox(g.w, g.h, g.d, 0.05), 0xc99a62, { p: [g.x, g.h / 2, g.z] });
      for (const y of [0.25, 0.65]) main.add(geo.box(), WOOD_DARK, { p: [g.x, g.h * y, g.z], s: [g.w + 0.02, 0.06, g.d + 0.02], cast: false });
    } else {
      main.add(geo.cyl(g.w / 2, g.w / 2 * 0.92, g.h, 14), 0x3d7cc9, { p: [g.x, g.h / 2, g.z] });
      for (const y of [0.2, 0.8]) main.add(geo.torus(g.w / 2, 0.03, Math.PI * 2, 14), 0x23406e, { p: [g.x, g.h * y, g.z], r: [Math.PI / 2, 0, 0], finish: 'metal', cast: false });
    }
    blobs.push({ x: g.x, z: g.z, sx: g.w + 0.9, sz: g.d + 0.9 });
  }
  main.add(geo.torus(0.32, 0.09, Math.PI * 2, 18), 0xe8d6a4, { p: [17, 0.99, -13.1], r: [Math.PI / 2, 0, 0], cast: false });
  main.add(geo.sphere(0.6, 12, 6), 0x2a9d8f, { p: [18.15, 0.78, -13.1], s: [1, 0.25, 1], cast: false });

  // Seagulls on the seawall and a few buoys bobbing out at sea.
  const bits = main;
  for (const [x, z] of [[-14, -14.2], [12, -14.2], [27, -16], [-24, -14.2]]) {
    bits.add(geo.sphere(0.18, 12, 8), WHITE, { p: [x, x < H.beachMaxX ? 1 : 1.42, z], s: [1, 0.9, 1.5] });
    bits.add(geo.sphere(0.1, 10, 8), WHITE, { p: [x, x < H.beachMaxX ? 1.18 : 1.6, z - 0.2] });
    bits.add(geo.cone(0.04, 0.12, 6), 0xffb703, { p: [x, x < H.beachMaxX ? 1.17 : 1.59, z - 0.33], r: [-Math.PI / 2, 0, 0] });
    bits.add(geo.sphere(0.12, 8, 6), 0x9aa6b8, { p: [x, x < H.beachMaxX ? 1.03 : 1.45, z + 0.05], s: [1.6, 0.4, 1.2] });
  }
  for (const [x, z, c] of [[4, -40, 0xff5d5d], [-14, -44, 0xffd166], [32, -46, 0xff5d5d], [15, -55, 0xffffff]] as const) {
    bits.add(geo.sphere(0.5, 14, 10), c, { p: [x, 0.1, z], s: [1, 0.8, 1], finish: 'gloss' });
    bits.add(geo.cone(0.25, 0.8, 10), c, { p: [x, 0.7, z], finish: 'gloss' });
  }

  root.add(main.build(true));
  for (const k of [...quads, ...deco]) root.add(k.build(true));
  root.add(buildBlobs(blobs));
  return { root, cameraBlockers: [], water };
}

function shade(c: number, k: number) {
  return new THREE.Color(c).multiplyScalar(k).getHex();
}

/** Simple fishing boat with a rounded hull, wheelhouse and mast; walkable decks keep the hull top at `y`. */
function boat(k: Kit, b: { minX: number; maxX: number; minZ: number; maxZ: number; y: number }, hull: number, walkable: boolean) {
  const w = b.maxX - b.minX, d = b.maxZ - b.minZ, cx = (b.minX + b.maxX) / 2, cz = (b.minZ + b.maxZ) / 2;
  const g = geo.rbox(w, b.y + 0.4, d, Math.min(w, d) * 0.3, 3).clone();
  // Taper the bow (min z) and round the keel.
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getZ(i) + d / 2) / d;
    const bow = Math.max(0, 1 - t * 2.2);
    const low = 1 - (pos.getY(i) + (b.y + 0.4) / 2) / (b.y + 0.4);
    pos.setX(i, pos.getX(i) * (1 - 0.6 * bow * bow) * (1 - 0.25 * low));
  }
  g.computeVertexNormals();
  k.add(g, hull, { p: [cx, (b.y + 0.4) / 2 - 0.4, cz], finish: 'gloss' });
  k.add(geo.box(), WHITE, { p: [cx, b.y - 0.35, cz], s: [w * 0.98, 0.14, d * 0.9], cast: false });
  k.add(geo.rbox(w - 0.5, 0.1, d - 1.2, 0.04), 0xd9b48a, { p: [cx, b.y + 0.01, cz + 0.4], cast: false });
  // gunwale
  k.add(geo.rbox(0.3, 0.8, d - 0.8, 0.1), shade(hull, 0.85), { p: [b.maxX - 0.15, b.y + 0.4, cz + 0.3] });
  if (!walkable) k.add(geo.rbox(0.3, 0.8, d - 0.8, 0.1), shade(hull, 0.85), { p: [b.minX + 0.15, b.y + 0.4, cz + 0.3] });
  k.add(geo.rbox(w - 0.6, 0.8, 0.3, 0.1), shade(hull, 0.85), { p: [cx, b.y + 0.4, b.maxZ - 0.15] });
  // wheelhouse
  k.add(geo.rbox(w * 0.5, 0.8, 0.3, 0.1), shade(hull, 0.85), { p: [cx, b.y + 0.4, b.minZ + 0.3] });
  // wheelhouse (matches the walkable boat's solid)
  k.add(geo.rbox(w - 1.6, 1.9, 2.7, 0.15), WHITE, { p: [cx + 0.2, b.y + 0.95, b.maxZ - 1.65] });
  k.add(geo.rbox(w - 1.5, 0.2, 3, 0.08), NAVY, { p: [cx + 0.2, b.y + 1.95, b.maxZ - 1.65] });
  k.add(geo.rbox(w - 1.7, 0.6, 0.08, 0.04), 0x2d5d8a, { p: [cx + 0.2, b.y + 1.35, b.maxZ - 3.02], finish: 'glass', cast: false });
  k.add(geo.cyl(0.07, 0.07, 3.5, 8), WHITE, { p: [cx, b.y + 2, b.minZ + 2.5] });
  k.add(geo.torus(0.3, 0.08, Math.PI * 2, 16), 0xff5d5d, { p: [b.maxX + 0.05, b.y - 0.1, cz], r: [0, Math.PI / 2, 0], finish: 'gloss', cast: false });
  for (const z of [b.minZ + 3, cz + 0.5]) k.add(geo.rbox(0.8, 0.5, 0.6, 0.06), 0x7bc8f6, { p: [cx - 0.6, b.y + 0.3, z] });
}

function sailboat(k: Kit, x: number, z: number) {
  k.add(lathe([[0.001, -0.5], [0.9, -0.3], [1.1, 0.4], [0.001, 0.4]], 16), WHITE, { p: [x, 0.1, z], s: [1, 1, 3], finish: 'gloss' });
  k.add(geo.cyl(0.06, 0.06, 7, 8), WOOD_DARK, { p: [x, 3.9, z] });
  const sail = new THREE.BufferGeometry();
  sail.setAttribute('position', new THREE.Float32BufferAttribute([0, 0.8, 0.3, 0, 7, 0.3, 0, 0.8, 3, 0, 0.8, -0.3, 0, 6, -0.3, 0, 0.8, -2.6], 3));
  sail.computeVertexNormals();
  k.add(sail, WHITE, { p: [x + 0.08, 0.4, z] });
  k.add(sail, 0xffd166, { p: [x - 0.08, 0.4, z], r: [0, Math.PI, 0] });
}

/** Opaque sea with a cheap animated vertex-free shader: depth tint, fresnel to the sky, sparkles. */
function buildWater(): THREE.Mesh {
  const g = new THREE.PlaneGeometry(320, 160, 1, 1).rotateX(-Math.PI / 2);
  // shallow, lighter water right along the shore
  const m = waterMaterial(0x1fa8c4);
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(0, 0.02, HARBOR.seawallZ - 0.4 - 80);
  mesh.receiveShadow = true;
  mesh.name = 'sea';
  return mesh;
}
