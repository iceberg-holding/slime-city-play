import { buildHeroPart as studioPart } from './art/studio';
import * as THREE from 'three';
import type { HeroSlot } from '../sim/hero';
import type { Look } from '../sim/types';
import { Kit, geo } from './materials';

// Procedural rounded toy hero. Origin at the feet, facing -z. Each animated piece is one Kit (few draw calls).

const SKIN = 0xffd2b0;
const DARK = 0x1d1f33;
const WHITE = 0xffffff;
const BLUSH = 0xff9eb5;

export interface CharacterRig {
  root: THREE.Group;
  inner: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  head: THREE.Group;
}

type V3 = [number, number, number];

function face(k: Kit, y: number, z: number, o: { spread?: number; r?: number; eye?: number; smile?: boolean; blush?: boolean } = {}) {
  const sp = o.spread ?? 0.11;
  const r = o.r ?? 0.055;
  for (const s of [-sp, sp]) {
    k.add(geo.sphere(r, 20, 14), o.eye ?? DARK, { p: [s, y, z], s: [1, 1.25, 0.6], finish: 'gloss', cast: false });
    k.add(geo.sphere(r * 0.35, 10, 8), WHITE, { p: [s + r * 0.3, y + r * 0.45, z - r * 0.45], finish: 'glow', cast: false });
    if (o.blush !== false) k.add(geo.sphere(0.05, 16, 10), BLUSH, { p: [s * 1.55, y - 0.09, z + 0.015], s: [1.3, 0.7, 0.4], finish: 'soft', cast: false });
  }
  if (o.smile !== false) k.add(geo.torus(0.055, 0.014, Math.PI, 16), 0x7a2a3a, { p: [0, y - 0.11, z + 0.005], r: [0, 0, Math.PI], finish: 'soft', cast: false });
}

function buildHead(i: number): THREE.Group {
  const k = new Kit();
  switch (i) {
    case 0: // cube head
      k.add(geo.rbox(0.56, 0.52, 0.52, 0.17), SKIN, { p: [0, 0.27, 0] });
      k.add(geo.rbox(0.6, 0.18, 0.56, 0.09), 0x7a4a2a, { p: [0, 0.54, 0.01] });
      k.add(geo.rbox(0.6, 0.34, 0.16, 0.08), 0x7a4a2a, { p: [0, 0.4, 0.22] });
      face(k, 0.3, -0.265);
      break;
    case 1: // big head with a cap
      k.add(geo.sphere(0.42), 0xffd93d, { p: [0, 0.4, 0], finish: 'gloss' });
      k.add(geo.sphere(0.43, 32, 16), 0xff4d6d, { p: [0, 0.47, 0], s: [1, 0.75, 1], finish: 'soft' });
      k.add(geo.rbox(0.42, 0.05, 0.3, 0.025), 0xff4d6d, { p: [0, 0.6, -0.38], r: [0.15, 0, 0] });
      k.add(geo.sphere(0.05), WHITE, { p: [0, 0.8, 0] });
      face(k, 0.38, -0.39, { spread: 0.14, r: 0.075 });
      break;
    case 2: // robot
      k.add(geo.rbox(0.56, 0.5, 0.5, 0.16), 0xc9d3de, { p: [0, 0.27, 0], finish: 'metal' });
      k.add(geo.rbox(0.44, 0.17, 0.06, 0.06), 0x33e6ff, { p: [0, 0.3, -0.25], finish: 'glow', cast: false });
      k.add(geo.capsule(0.025, 0.3), 0x8a95a5, { p: [0, 0.62, 0], finish: 'metal' });
      k.add(geo.sphere(0.07), 0xff3355, { p: [0, 0.79, 0], finish: 'glow' });
      for (const x of [-0.3, 0.3]) k.add(geo.cyl(0.1, 0.1, 0.07), 0xff9f1c, { p: [x, 0.27, 0], r: [0, 0, Math.PI / 2], finish: 'gloss' });
      k.add(geo.rbox(0.2, 0.05, 0.03, 0.02), DARK, { p: [0, 0.13, -0.25], cast: false });
      break;
    case 3: // cat
      k.add(geo.sphere(0.31), 0xffa94d, { p: [0, 0.28, 0], s: [1.05, 0.92, 1] });
      for (const x of [-0.17, 0.17]) {
        k.add(geo.cone(0.1, 0.2), 0xffa94d, { p: [x, 0.58, 0.02], r: [0, 0, -x * 1.2] });
        k.add(geo.cone(0.055, 0.12), 0xffc2d1, { p: [x, 0.57, -0.03], r: [0, 0, -x * 1.2], cast: false });
      }
      face(k, 0.32, -0.27, { eye: 0x2b9348, r: 0.06, smile: false });
      k.add(geo.sphere(0.035), 0xff6b9a, { p: [0, 0.24, -0.3], finish: 'gloss', cast: false });
      for (const s of [-1, 1]) for (const a of [-0.12, 0.12]) k.add(geo.capsule(0.006, 0.2, 6), WHITE, { p: [s * 0.2, 0.23, -0.26], r: [0, 0, Math.PI / 2 + a * s], cast: false });
      break;
    case 4: // knight helmet
      k.add(geo.capsule(0.28, 0.66), 0xd7dee6, { p: [0, 0.3, 0], finish: 'metal' });
      k.add(geo.rbox(0.36, 0.06, 0.08, 0.03), DARK, { p: [0, 0.34, -0.26], cast: false });
      k.add(geo.rbox(0.06, 0.24, 0.08, 0.03), DARK, { p: [0, 0.22, -0.26], cast: false });
      for (let j = 0; j < 4; j++) k.add(geo.sphere(0.1 - j * 0.012), 0xff4d6d, { p: [0, 0.68 - j * 0.03, 0.02 + j * 0.1], finish: 'soft' });
      break;
    default: // alien
      k.add(geo.sphere(0.3), 0x7ed957, { p: [0, 0.34, 0], s: [1, 1.18, 1], finish: 'gloss' });
      for (const x of [-0.12, 0.12]) {
        k.add(geo.sphere(0.1), DARK, { p: [x, 0.38, -0.24], s: [1, 0.7, 0.5], r: [0, 0, x * 3], finish: 'gloss', cast: false });
        k.add(geo.capsule(0.018, 0.28), 0x7ed957, { p: [x * 1.2, 0.76, 0], r: [0, 0, -x * 2.5], finish: 'soft' });
        k.add(geo.sphere(0.055), 0xfff275, { p: [x * 1.6, 0.9, 0], finish: 'glow' });
      }
      k.add(geo.torus(0.04, 0.01, Math.PI, 12), 0x2d6a2d, { p: [0, 0.2, -0.29], r: [0, 0, Math.PI], cast: false });
      break;
  }
  return k.build();
}

const BODY_COLORS = [0xff5d73, 0x4d96ff, 0x8f9bb3, 0x24263a, 0x5ee06a, 0xf8f8f8];
const SLEEVES = [0xff5d73, 0x4d96ff, 0x8f9bb3, 0x24263a, 0x5ee06a, 0xf8f8f8];

function buildBody(i: number): THREE.Group {
  const k = new Kit();
  const c = BODY_COLORS[i] ?? BODY_COLORS[0];
  switch (i) {
    case 0: // t-shirt
      k.add(geo.rbox(0.64, 0.62, 0.38, 0.17), c, { p: [0, 0.31, 0] });
      k.add(geo.sphere(0.09, 20, 14), 0xffd166, { p: [0, 0.38, -0.18], s: [1, 1, 0.3], cast: false });
      break;
    case 1: // hoodie
      k.add(geo.rbox(0.66, 0.64, 0.4, 0.18), c, { p: [0, 0.32, 0] });
      k.add(geo.torus(0.2, 0.08, Math.PI * 2, 24), c, { p: [0, 0.6, 0.1], r: [Math.PI / 2 - 0.3, 0, 0] });
      k.add(geo.rbox(0.4, 0.16, 0.06, 0.05), 0x3a7be0, { p: [0, 0.16, -0.2], cast: false });
      for (const x of [-0.07, 0.07]) k.add(geo.capsule(0.012, 0.16, 6), WHITE, { p: [x, 0.48, -0.21], cast: false });
      break;
    case 2: // tank armor
      k.add(geo.rbox(0.76, 0.66, 0.48, 0.2), 0x7c8aa5, { p: [0, 0.33, 0], finish: 'metal' });
      k.add(geo.rbox(0.5, 0.36, 0.08, 0.08), 0xffc300, { p: [0, 0.38, -0.24], finish: 'gloss' });
      for (const x of [-0.42, 0.42]) k.add(geo.sphere(0.17), 0x9aa7bd, { p: [x, 0.58, 0], s: [1, 0.7, 1], finish: 'metal' });
      for (const x of [-0.18, 0.18]) for (const y of [0.24, 0.5]) k.add(geo.sphere(0.025), 0x4a5568, { p: [x, y, -0.29], finish: 'metal', cast: false });
      break;
    case 3: // tuxedo
      k.add(geo.rbox(0.62, 0.62, 0.38, 0.17), c, { p: [0, 0.31, 0], finish: 'gloss' });
      k.add(geo.rbox(0.22, 0.5, 0.04, 0.04), WHITE, { p: [0, 0.34, -0.19], cast: false });
      for (const s of [-1, 1]) k.add(geo.cone(0.06, 0.12, 16), 0xe63946, { p: [s * 0.06, 0.56, -0.22], r: [0, 0, (s * Math.PI) / 2], finish: 'gloss', cast: false });
      k.add(geo.sphere(0.03), 0xe63946, { p: [0, 0.56, -0.22], finish: 'gloss', cast: false });
      for (const y of [0.4, 0.28, 0.16]) k.add(geo.sphere(0.022), DARK, { p: [0, y, -0.22], cast: false });
      break;
    case 4: // slime suit
      k.add(geo.sphere(0.4), c, { p: [0, 0.32, 0], s: [0.92, 0.85, 0.66], finish: 'gloss' });
      k.add(geo.torus(0.3, 0.04, Math.PI * 2, 32), 0x2d6a4f, { p: [0, 0.12, 0], r: [Math.PI / 2, 0, 0], s: [1.15, 0.85, 1] });
      k.add(geo.sphere(0.07), 0xb7ffb7, { p: [0.14, 0.42, -0.24], finish: 'gloss', cast: false });
      break;
    default: // marinière
      k.add(geo.rbox(0.62, 0.62, 0.38, 0.17), c, { p: [0, 0.31, 0] });
      for (let j = 0; j < 3; j++) k.add(geo.rbox(0.635, 0.06, 0.395, 0.03), 0x1d3557, { p: [0, 0.13 + j * 0.16, 0] });
      k.add(geo.torus(0.17, 0.05, Math.PI * 2, 24), 0xe63946, { p: [0, 0.6, 0], r: [Math.PI / 2, 0, 0] });
      break;
  }
  return k.build();
}

function buildArm(body: number, right: boolean): THREE.Group {
  const k = new Kit();
  const metal = body === 2;
  k.add(geo.capsule(0.1, 0.34), SLEEVES[body] ?? SKIN, { p: [0, -0.15, 0], finish: metal ? 'metal' : body === 4 ? 'gloss' : 'soft' });
  k.add(geo.sphere(0.09), metal ? 0x5a667a : SKIN, { p: [0, -0.38, 0], finish: metal ? 'metal' : 'soft' });
  const g = k.build();
  g.name = right ? 'armR' : 'armL';
  return g;
}

function helix(): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const a = t * Math.PI * 2 * 5;
    pts.push(new THREE.Vector3(Math.cos(a) * 0.09, -0.08 - t * 0.48, Math.sin(a) * 0.09));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.025, 8, false);
}
let helixGeo: THREE.BufferGeometry | null = null;

function buildLeg(i: number): THREE.Group {
  const k = new Kit(); // pivot at hip; leg extends down to y=-0.7
  switch (i) {
    case 0: // jeans
      k.add(geo.capsule(0.12, 0.62), 0x3d6fb6, { p: [0, -0.31, 0] });
      k.add(geo.rbox(0.25, 0.13, 0.36, 0.06), WHITE, { p: [0, -0.64, -0.05] });
      k.add(geo.rbox(0.26, 0.04, 0.37, 0.02), 0xff5d73, { p: [0, -0.69, -0.05], finish: 'rubber' });
      break;
    case 1: // shorts
      k.add(geo.capsule(0.14, 0.3), 0xff8c42, { p: [0, -0.13, 0] });
      k.add(geo.capsule(0.09, 0.42), SKIN, { p: [0, -0.4, 0] });
      k.add(geo.rbox(0.24, 0.14, 0.36, 0.06), 0x4d96ff, { p: [0, -0.63, -0.05], finish: 'gloss' });
      break;
    case 2: // robo legs
      k.add(geo.capsule(0.09, 0.62), 0xb8c4d2, { p: [0, -0.3, 0], finish: 'metal' });
      k.add(geo.sphere(0.12), 0xff9f1c, { p: [0, -0.33, 0], finish: 'gloss' });
      k.add(geo.rbox(0.28, 0.12, 0.4, 0.05), 0x6b778a, { p: [0, -0.64, -0.05], finish: 'metal' });
      break;
    case 3: // springs
      k.add((helixGeo ??= helix()), 0xffd23f, { finish: 'metal' });
      k.add(geo.sphere(0.12), 0xff8fab, { p: [0, -0.04, 0], s: [1, 0.7, 1], finish: 'gloss' });
      k.add(geo.rbox(0.28, 0.12, 0.38, 0.06), 0xff8fab, { p: [0, -0.64, -0.04], finish: 'gloss' });
      break;
    case 4: // boots
      k.add(geo.capsule(0.12, 0.42), 0x52b788, { p: [0, -0.2, 0] });
      k.add(geo.rbox(0.3, 0.32, 0.32, 0.12), 0x9c6644, { p: [0, -0.52, 0], finish: 'gloss' });
      k.add(geo.rbox(0.31, 0.14, 0.46, 0.07), 0x7f4f24, { p: [0, -0.63, -0.06], finish: 'gloss' });
      break;
    default: // wheels
      k.add(geo.capsule(0.11, 0.5), 0xc77dff, { p: [0, -0.25, 0] });
      k.add(geo.rbox(0.26, 0.18, 0.38, 0.08), WHITE, { p: [0, -0.54, -0.04], finish: 'gloss' });
      for (const z of [-0.17, 0.09]) k.add(geo.torus(0.05, 0.03, Math.PI * 2, 20), 0xff006e, { p: [0, -0.66, z], r: [0, Math.PI / 2, 0], finish: 'gloss' });
      break;
  }
  return k.build();
}

function buildGun(i: number): THREE.Group {
  // Held in the right hand; barrel points -z.
  const k = new Kit();
  const tube = (color: number, r: number, len: number, p: V3, finish: 'gloss' | 'metal' = 'gloss') =>
    k.add(geo.capsule(r, len), color, { p, r: [Math.PI / 2, 0, 0], finish });
  switch (i) {
    case 0: // blaster
      k.add(geo.rbox(0.18, 0.22, 0.4, 0.08), 0xff7b00, { p: [0, 0, -0.1], finish: 'gloss' });
      tube(0x7ae582, 0.07, 0.34, [0, 0.04, -0.4]);
      k.add(geo.sphere(0.09), 0x7ae582, { p: [0, 0.16, 0.0], finish: 'gloss' });
      k.add(geo.rbox(0.1, 0.18, 0.1, 0.04), 0x444455, { p: [0, -0.14, 0.02] });
      break;
    case 1: // rapid fire
      k.add(geo.cyl(0.13, 0.13, 0.22), 0x00b4d8, { p: [0, 0, -0.05], r: [Math.PI / 2, 0, 0], finish: 'gloss' });
      for (let j = 0; j < 4; j++) {
        const a = (j / 4) * Math.PI * 2;
        tube(0xdfe6ee, 0.03, 0.42, [Math.cos(a) * 0.065, Math.sin(a) * 0.065, -0.35], 'metal');
      }
      k.add(geo.sphere(0.12), 0xffd60a, { p: [0, 0.16, 0.05], finish: 'gloss' });
      break;
    case 2: // bazooka
      tube(0x5aa36b, 0.15, 0.95, [0, 0.12, -0.15]);
      k.add(geo.torus(0.15, 0.04, Math.PI * 2, 28), 0x2f6f45, { p: [0, 0.12, -0.62], finish: 'gloss' });
      k.add(geo.rbox(0.08, 0.16, 0.1, 0.03), 0x2f6f45, { p: [0, -0.06, 0] });
      break;
    case 3: // bubble wand
      tube(0xff70a6, 0.035, 0.5, [0, 0, -0.2]);
      k.add(geo.torus(0.14, 0.03, Math.PI * 2, 28), 0x70d6ff, { p: [0, 0, -0.52], finish: 'gloss' });
      k.add(geo.sphere(0.12), 0xd8f3ff, { p: [0, 0, -0.52], s: [1, 1, 0.3], finish: 'glass', cast: false });
      break;
    case 4: // twin shot
      k.add(geo.rbox(0.3, 0.18, 0.34, 0.07), 0x6a4c93, { p: [0, 0, -0.1], finish: 'gloss' });
      tube(0xdfe6ee, 0.05, 0.42, [-0.07, 0.03, -0.42], 'metal');
      tube(0xdfe6ee, 0.05, 0.42, [0.07, 0.03, -0.42], 'metal');
      break;
    default: // ray gun
      k.add(geo.sphere(0.14), 0xf2f2f2, { p: [0, 0, -0.06], s: [1, 1, 1.5], finish: 'gloss' });
      tube(0xef476f, 0.05, 0.36, [0, 0.0, -0.36]);
      for (const z of [-0.3, -0.42]) k.add(geo.torus(0.08, 0.02, Math.PI * 2, 24), 0x06d6a0, { p: [0, 0, z], finish: 'metal' });
      k.add(geo.sphere(0.06), 0xffd166, { p: [0, 0, -0.56], finish: 'glow' });
      break;
  }
  return k.build();
}

export function buildCharacter(look: Look): CharacterRig {
  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);
  const [h, bo, l, gn] = look;

  const legL = new THREE.Group();
  legL.add(buildLeg(l));
  legL.position.set(-0.15, 0.7, 0);
  const legR = new THREE.Group();
  legR.add(buildLeg(l));
  legR.position.set(0.15, 0.7, 0);
  inner.add(legL, legR);

  const body = buildBody(bo);
  body.position.y = 0.68;
  inner.add(body);

  const shoulder = bo === 2 ? 0.48 : 0.42;
  const armL = new THREE.Group();
  armL.position.set(-shoulder, 1.22, 0);
  armL.add(buildArm(bo, false));
  const armR = new THREE.Group();
  armR.position.set(shoulder, 1.22, 0);
  armR.add(buildArm(bo, true));
  const gun = buildGun(gn);
  gun.position.set(0, -0.42, 0);
  gun.rotation.x = -Math.PI / 2; // compensates the arm raise so the barrel points forward
  armR.add(gun);
  armR.rotation.x = Math.PI / 2;
  inner.add(armL, armR);

  const head = new THREE.Group();
  head.add(buildHead(h));
  head.position.y = 1.3;
  inner.add(head);
  // Studio parts share the feet origin, with +Z forward.
  inner.clear();
  const studio = new THREE.Group(); studio.rotation.y = Math.PI;
  (['head', 'body', 'legs', 'gun'] as HeroSlot[]).forEach((slot, i) => studio.add(studioPart(slot, look[i])));
  inner.add(studio);
  return { root, inner, legL, legR, armL, armR, head };
}

/** One hero part on its own, centered for a builder-card thumbnail. */
export function buildHeroPart(slot: HeroSlot, i: number): THREE.Group {
  const g = new THREE.Group();
  if (slot === 'head') g.add(buildHead(i));
  else if (slot === 'body') {
    g.add(buildBody(i));
    const shoulder = i === 2 ? 0.48 : 0.42;
    for (const s of [-1, 1]) {
      const a = buildArm(i, s > 0);
      a.position.set(s * shoulder, 0.54, 0);
      a.rotation.z = s * 0.25;
      g.add(a);
    }
  } else if (slot === 'legs') {
    for (const s of [-1, 1]) {
      const leg = buildLeg(i);
      leg.position.set(s * 0.17, 0.7, 0);
      g.add(leg);
    }
  } else {
    const gun = buildGun(i);
    gun.rotation.y = -Math.PI / 2.6;
    g.add(gun);
  }
  g.clear();
  const part = studioPart(slot, i);
  part.rotation.y = Math.PI;
  const box = new THREE.Box3().setFromObject(part);
  const center = box.getCenter(new THREE.Vector3());
  part.position.sub(center);
  g.add(part);
  return g;
}

export function animateCharacter(rig: CharacterRig, phase: number, speed: number, airborne: boolean, t: number) {
  const s = Math.min(1, speed / 5);
  const swing = airborne ? 0.6 : Math.sin(phase * 4) * 0.7 * s;
  rig.legL.rotation.x = swing;
  rig.legR.rotation.x = airborne ? -0.4 : -swing;
  rig.armL.rotation.x = airborne ? -2.4 : -swing * 0.8;
  rig.inner.position.y = airborne ? 0 : Math.abs(Math.sin(phase * 4)) * 0.06 * s;
  rig.head.rotation.z = Math.sin(t * 2) * 0.04;
}
