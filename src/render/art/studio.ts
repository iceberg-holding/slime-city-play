import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Winning entry of the Slime City art competition (Claude studio, /workspace/slime-city-studio/claude/art.ts),
// copied in and extended for the game: 6 options per hero slot (crown + visor heads after AGY's ideas,
// tuxedo/sailor bodies, springs/wheels legs, rapid/twin guns), named pyshka face parts for expressions,
// a walkable skyscraper matching sim/tower.ts (open elevator cabin, terrace floor, recessed pool with
// Codex's pergola / loungers / teal tiles) and individual city prop builders.
// Convention: characters face +Z, feet at y=0 (the game rig turns them around).

// ---------------------------------------------------------------------------
// Shared caches — every geometry/material is built once and reused.
// ---------------------------------------------------------------------------

const geoCache = new Map<string, THREE.BufferGeometry>();
const matCache = new Map<string, THREE.Material>();

function cachedGeo<T extends THREE.BufferGeometry>(key: string, make: () => T): T {
  let g = geoCache.get(key) as T | undefined;
  if (!g) {
    g = make();
    geoCache.set(key, g);
  }
  return g;
}

function cachedMat<T extends THREE.Material>(key: string, make: () => T): T {
  let m = matCache.get(key) as T | undefined;
  if (!m) {
    m = make();
    matCache.set(key, m);
  }
  return m;
}

type Col = THREE.ColorRepresentation;

/** Glossy toy plastic with a lacquer clearcoat. */
function gloss(color: Col, rough = 0.3): THREE.MeshPhysicalMaterial {
  return cachedMat(`gloss:${color}:${rough}`, () =>
    new THREE.MeshPhysicalMaterial({ color, roughness: rough, clearcoat: 1, clearcoatRoughness: 0.06 }),
  );
}

/** Soft satin finish (fabric, foliage, stone). */
function soft(color: Col, rough = 0.7): THREE.MeshStandardMaterial {
  return cachedMat(`soft:${color}:${rough}`, () => new THREE.MeshStandardMaterial({ color, roughness: rough }));
}

function sheen(color: Col, sheenColor: Col = '#ffffff'): THREE.MeshPhysicalMaterial {
  return cachedMat(`sheen:${color}:${sheenColor}`, () =>
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.62, sheen: 1, sheenRoughness: 0.45, sheenColor }),
  );
}

function metal(color: Col, rough = 0.22): THREE.MeshStandardMaterial {
  return cachedMat(`metal:${color}:${rough}`, () => new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: rough }));
}

function glow(color: Col, intensity = 2): THREE.MeshStandardMaterial {
  return cachedMat(`glow:${color}:${intensity}`, () =>
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 }),
  );
}

function glass(color: Col = '#dff4ff', opacity = 0.28): THREE.MeshPhysicalMaterial {
  return cachedMat(`glass:${color}:${opacity}`, () =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.04,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
      envMapIntensity: 1.6,
    }),
  );
}

/** Dark glossy visor / screen glass. */
function visor(color: Col = '#10141f'): THREE.MeshPhysicalMaterial {
  return cachedMat(`visor:${color}`, () =>
    new THREE.MeshPhysicalMaterial({ color, roughness: 0.08, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.8 }),
  );
}

function iridescent(color: Col): THREE.MeshPhysicalMaterial {
  return cachedMat(`irid:${color}`, () =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.05,
      metalness: 0,
      iridescence: 1,
      iridescenceIOR: 1.6,
      iridescenceThicknessRange: [200, 800],
      clearcoat: 1,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  );
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

const SPHERE = () => cachedGeo('sphere', () => new THREE.SphereGeometry(1, 32, 22));
const SPHERE_LO = () => cachedGeo('sphereLo', () => new THREE.SphereGeometry(1, 16, 12));
const HEMI = () => cachedGeo('hemi', () => new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2));

function rbox(w: number, h: number, d: number, r: number, seg = 3): THREE.BufferGeometry {
  const rr = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
  return cachedGeo(`rbox:${w}:${h}:${d}:${rr}:${seg}`, () => new RoundedBoxGeometry(w, h, d, seg, rr));
}

function cyl(rt: number, rb: number, h: number, seg = 28, open = false): THREE.BufferGeometry {
  return cachedGeo(`cyl:${rt}:${rb}:${h}:${seg}:${open}`, () => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open));
}

function capsule(r: number, len: number): THREE.BufferGeometry {
  return cachedGeo(`cap:${r}:${len}`, () => new THREE.CapsuleGeometry(r, len, 6, 16));
}

function torus(R: number, r: number, arc = Math.PI * 2, rs = 12, ts = 40): THREE.BufferGeometry {
  return cachedGeo(`torus:${R}:${r}:${arc}:${rs}:${ts}`, () => new THREE.TorusGeometry(R, r, rs, ts, arc));
}

function cone(r: number, h: number, seg = 24, open = false): THREE.BufferGeometry {
  return cachedGeo(`cone:${r}:${h}:${seg}:${open}`, () => new THREE.ConeGeometry(r, h, seg, 1, open));
}

function mesh(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  parent?: THREE.Object3D,
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}

function ball(r: number | [number, number, number], mat: THREE.Material, x: number, y: number, z: number, parent?: THREE.Object3D, lo = false) {
  const m = mesh(lo ? SPHERE_LO() : SPHERE(), mat, x, y, z, parent);
  if (Array.isArray(r)) m.scale.set(r[0], r[1], r[2]);
  else m.scale.setScalar(r);
  return m;
}

const UP = new THREE.Vector3(0, 1, 0);
const FWD = new THREE.Vector3(0, 0, 1);

/** Capsule spanning two points (arms, legs, pipes). */
function limb(a: THREE.Vector3Like, b: THREE.Vector3Like, r: number, mat: THREE.Material, parent: THREE.Object3D) {
  const va = new THREE.Vector3(a.x, a.y, a.z);
  const vb = new THREE.Vector3(b.x, b.y, b.z);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  const m = mesh(capsule(r, Math.round(len * 100) / 100), mat, 0, 0, 0, parent);
  m.position.copy(va).add(vb).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UP, dir.normalize());
  return m;
}

/** Place an object on a sphere surface with its +Z facing outward. */
function onSphere(obj: THREE.Object3D, c: THREE.Vector3Like, r: number, yaw: number, pitch: number, out = 0) {
  const dir = new THREE.Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
  obj.position.set(c.x, c.y, c.z).addScaledVector(dir, r + out);
  obj.quaternion.setFromUnitVectors(FWD, dir);
  return obj;
}

function v(x: number, y: number, z: number) {
  return new THREE.Vector3(x, y, z);
}

// ---------------------------------------------------------------------------
// Face kit — big glossy toy eyes, smiles, blush
// ---------------------------------------------------------------------------

const WHITE_GLOW = () => glow('#ffffff', 1.2);

function toyEye(size = 1, iris: Col = '#141826'): THREE.Group {
  const g = new THREE.Group();
  ball([0.055 * size, 0.072 * size, 0.03 * size], gloss(iris, 0.12), 0, 0, 0, g);
  ball(0.019 * size, WHITE_GLOW(), 0.017 * size, 0.027 * size, 0.024 * size, g, true);
  ball(0.009 * size, WHITE_GLOW(), -0.018 * size, -0.022 * size, 0.026 * size, g, true);
  return g;
}

function smile(R: number, tube: number, mat: THREE.Material): THREE.Mesh {
  const m = mesh(torus(R, tube, Math.PI, 8, 20), mat);
  m.rotation.z = Math.PI;
  return m;
}

function blush(size: number): THREE.Mesh {
  const m = new THREE.Mesh(SPHERE_LO(), cachedMat('blush', () => new THREE.MeshStandardMaterial({ color: '#ff7aa2', roughness: 0.6, transparent: true, opacity: 0.55, depthWrite: false })));
  m.scale.set(size, size * 0.6, size * 0.2);
  return m;
}

/** Cute face on a sphere head. */
function sphereFace(g: THREE.Group, c: THREE.Vector3, r: number, opts: { eyeSize?: number; spread?: number; eyePitch?: number; mouth?: boolean; cheeks?: boolean } = {}) {
  const spread = opts.spread ?? 0.36;
  const ep = opts.eyePitch ?? 0.02;
  for (const s of [-1, 1]) {
    const e = toyEye(opts.eyeSize ?? 1);
    onSphere(e, c, r, s * spread, ep, -0.008);
    g.add(e);
    if (opts.cheeks !== false) {
      const b = blush(0.045);
      onSphere(b, c, r, s * (spread + 0.22), -0.22, -0.004);
      g.add(b);
    }
  }
  if (opts.mouth !== false) {
    const m = new THREE.Group();
    m.add(smile(0.035, 0.009, gloss('#3a1d2a', 0.3)));
    onSphere(m, c, r, 0, -0.2, -0.002);
    g.add(m);
  }
}

// ---------------------------------------------------------------------------
// Heroes
// ---------------------------------------------------------------------------

export const HERO_SLOTS = { head: 6, body: 6, legs: 6, gun: 6 };

type Slot = 'head' | 'body' | 'legs' | 'gun';

const SKIN = '#ffd2b0';
const HEAD_C = v(0, 1.55, 0.01);
const HEAD_R = 0.28;
const HAND = v(0.45, 0.95, 0.2);

function buildHead(i: number): THREE.Group {
  const g = new THREE.Group();
  g.name = `head${i}`;
  const c = HEAD_C;
  // neck
  mesh(cyl(0.085, 0.095, 0.12), soft(SKIN, 0.55), 0, 1.31, 0, g);
  switch (i) {
    case 0: {
      // Astro helmet: white shell, black glass visor with LED eyes, orange ear pods
      ball(HEAD_R + 0.03, gloss('#f7f8fb', 0.25), c.x, c.y, c.z, g);
      const vis = mesh(
        cachedGeo('visorGeo', () => new THREE.SphereGeometry(1, 32, 16, Math.PI * 0.14, Math.PI * 0.72, Math.PI * 0.26, Math.PI * 0.42)),
        visor(),
        c.x, c.y, c.z, g,
      );
      vis.scale.setScalar(HEAD_R + 0.04);
      for (const s of [-1, 1]) {
        const eye = mesh(capsule(0.025, 0.035), glow('#5ff6ff', 2.5));
        onSphere(eye, c, HEAD_R + 0.045, s * 0.3, 0.06);
        g.add(eye);
        const pod = mesh(cyl(0.085, 0.085, 0.08), gloss('#ff8a3d', 0.25), s * (HEAD_R + 0.05), c.y, c.z, g);
        pod.rotation.z = Math.PI / 2;
        ball(0.03, glow('#ffe066', 1.8), s * (HEAD_R + 0.095), c.y, c.z, g, true);
      }
      const smileM = new THREE.Group();
      smileM.add(smile(0.04, 0.012, glow('#5ff6ff', 2.5)));
      onSphere(smileM, c, HEAD_R + 0.046, 0, -0.12);
      g.add(smileM);
      // little antenna
      limb(v(0.12, c.y + 0.25, -0.05), v(0.17, c.y + 0.42, -0.06), 0.012, metal('#cfd6e3'), g);
      ball(0.035, glow('#ff5f8f', 2), 0.17, c.y + 0.44, -0.06, g, true);
      break;
    }
    case 1: {
      // Kitty: pastel lilac head, ears with pink inner, whiskers, big eyes
      const fur = gloss('#c9b6ff', 0.38);
      ball([HEAD_R, HEAD_R * 0.95, HEAD_R * 0.96], fur, c.x, c.y, c.z, g);
      for (const s of [-1, 1]) {
        const ear = mesh(cone(0.1, 0.2, 20), fur, s * 0.17, c.y + 0.24, c.z - 0.02, g);
        ear.rotation.z = -s * 0.45;
        const inner = mesh(cone(0.06, 0.12, 16), gloss('#ffa6c9', 0.4), s * 0.175, c.y + 0.235, c.z + 0.035, g);
        inner.rotation.z = -s * 0.45;
        for (const k of [-1, 1]) {
          const w = mesh(cyl(0.004, 0.004, 0.14, 6), soft('#6b5a8e'), s * 0.26, c.y - 0.06 + k * 0.025, c.z + 0.2, g);
          w.rotation.z = Math.PI / 2 + k * s * 0.15;
        }
      }
      sphereFace(g, c, HEAD_R * 0.96, { eyeSize: 1.25, spread: 0.38 });
      const nose = ball([0.022, 0.016, 0.014], gloss('#ff7aa2', 0.2), 0, 0, 0, g, true);
      onSphere(nose, c, HEAD_R * 0.96, 0, -0.1, 0.004);
      // bow
      const bow = new THREE.Group();
      ball([0.07, 0.05, 0.035], gloss('#ff5f8f', 0.25), -0.06, 0, 0, bow, true).rotation.z = 0.3;
      ball([0.07, 0.05, 0.035], gloss('#ff5f8f', 0.25), 0.06, 0, 0, bow, true).rotation.z = -0.3;
      ball(0.03, gloss('#ff5f8f', 0.25), 0, 0, 0.01, bow, true);
      onSphere(bow, c, HEAD_R, -0.7, 0.75, 0.01);
      g.add(bow);
      break;
    }
    case 2: {
      // Bot: rounded mint cube head with screen face
      mesh(rbox(0.56, 0.48, 0.5, 0.14, 4), gloss('#5fe0c0', 0.28), c.x, c.y, c.z, g);
      mesh(rbox(0.44, 0.3, 0.06, 0.07, 3), visor('#0b1220'), c.x, c.y - 0.01, c.z + 0.235, g);
      for (const s of [-1, 1]) {
        const eye = mesh(torus(0.045, 0.014, Math.PI, 8, 16), glow('#7dfcff', 2.6), s * 0.1, c.y + 0.01, c.z + 0.27, g);
        eye.rotation.z = 0;
        const ear = mesh(cyl(0.07, 0.07, 0.06), gloss('#ffd23f', 0.25), s * 0.3, c.y, c.z, g);
        ear.rotation.z = Math.PI / 2;
        ball(0.025, glow('#ff5f8f', 2), s * 0.12, c.y - 0.08, c.z + 0.268, g, true);
      }
      const m = mesh(torus(0.04, 0.011, Math.PI, 8, 16), glow('#7dfcff', 2.6), 0, c.y - 0.07, c.z + 0.27, g);
      m.rotation.z = Math.PI;
      mesh(cyl(0.012, 0.012, 0.16, 8), metal('#d7dde8'), 0, c.y + 0.31, c.z, g);
      ball(0.045, glow('#ff5f8f', 2.2), 0, c.y + 0.4, c.z, g, true);
      break;
    }
    case 4: {
      // Slime Monarch (after AGY): big glossy strawberry head with a tilted golden crown
      const big = HEAD_R * 1.32;
      const hc = v(c.x, c.y - 0.02, c.z);
      ball([big * 1.06, big * 0.95, big * 1.02], gloss('#ff5c8d', 0.14), hc.x, hc.y, hc.z, g);
      sphereFace(g, hc, big * 1.0, { eyeSize: 1.45, spread: 0.36 });
      const crown = new THREE.Group();
      const gold = metal('#ffcf4a', 0.16);
      mesh(cyl(0.17, 0.15, 0.09, 24), gold, 0, 0, 0, crown);
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        mesh(cone(0.04, 0.12, 10), gold, Math.cos(a) * 0.14, 0.09, Math.sin(a) * 0.14, crown);
        ball(0.028, k === 0 ? gloss('#ff3b55', 0.1) : gloss('#ffffff', 0.15), Math.cos(a) * 0.14, 0.16, Math.sin(a) * 0.14, crown, true);
      }
      crown.position.set(0.06, hc.y + big * 0.92, hc.z - 0.02);
      crown.rotation.z = -0.18;
      g.add(crown);
      break;
    }
    case 5: {
      // Visor mech (after AGY): white unibody helmet, black OLED visor with ^ ^ eyes, crest fin, copper vents
      mesh(rbox(0.56, 0.48, 0.52, 0.16, 4), gloss('#f5f6fa', 0.24), c.x, c.y, c.z, g);
      mesh(rbox(0.46, 0.23, 0.12, 0.08, 3), visor('#0a0d14'), c.x, c.y + 0.02, c.z + 0.22, g);
      for (const s of [-1, 1]) {
        const bar = mesh(rbox(0.1, 0.036, 0.02, 0.012, 2), glow('#00f0ff', 3), s * 0.11, c.y + 0.03, c.z + 0.285, g);
        bar.rotation.z = -s * 0.28;
        bar.castShadow = false;
        const vent = mesh(cyl(0.08, 0.08, 0.06, 20), metal('#e8875f', 0.3), s * 0.29, c.y, c.z, g);
        vent.rotation.z = Math.PI / 2;
      }
      mesh(rbox(0.06, 0.16, 0.34, 0.03), gloss('#ff5376', 0.28), 0, c.y + 0.28, c.z - 0.04, g);
      break;
    }
    default: {
      // Kid with a glossy cap and hair tufts
      ball(HEAD_R, gloss(SKIN, 0.45), c.x, c.y, c.z, g);
      sphereFace(g, c, HEAD_R, { eyeSize: 1.15, spread: 0.34, eyePitch: 0.0 });
      const capM = gloss('#ff4d5e', 0.28);
      const capTop = mesh(HEMI(), capM, c.x, c.y + 0.03, c.z - 0.01, g);
      capTop.scale.set(HEAD_R + 0.025, HEAD_R * 0.95, HEAD_R + 0.025);
      capTop.rotation.x = -0.18;
      const brim = mesh(cyl(0.2, 0.2, 0.025, 28), capM, 0, c.y + 0.1, c.z + 0.27, g);
      brim.scale.set(1, 1, 0.7);
      brim.rotation.x = 0.12;
      ball(0.035, gloss('#ffffff', 0.3), 0, c.y + 0.32, c.z - 0.04, g, true);
      mesh(rbox(0.12, 0.06, 0.02, 0.01), gloss('#ffffff', 0.3), 0, c.y + 0.2, c.z + 0.255, g).rotation.x = -0.35;
      for (const s of [-1, 1]) {
        ball([0.09, 0.05, 0.06], gloss('#6b3f2a', 0.4), s * 0.24, c.y + 0.02, c.z - 0.06, g, true);
        ball(0.05, gloss(SKIN, 0.45), s * 0.285, c.y - 0.02, c.z, g, true);
      }
    }
  }
  return g;
}

function arms(g: THREE.Group, sleeve: THREE.Material, glove: THREE.Material, r = 0.085) {
  // left arm hangs relaxed
  limb(v(-0.36, 1.17, 0), v(-0.44, 0.84, 0.03), r, sleeve, g);
  ball(0.09, glove, -0.45, 0.79, 0.04, g);
  // right arm reaches forward to grip the gun
  const elbow = v(0.43, 0.97, -0.05);
  limb(v(0.36, 1.17, 0), elbow, r, sleeve, g);
  limb(elbow, HAND.clone().add(v(0, 0, -0.06)), r * 0.95, sleeve, g);
  ball(0.088, glove, HAND.x, HAND.y, HAND.z, g);
  for (const s of [-1, 1]) ball(r * 1.18, sleeve, s * 0.35, 1.18, 0, g);
}

function buildBody(i: number): THREE.Group {
  const g = new THREE.Group();
  g.name = `body${i}`;
  const torso = (col: Col, rough = 0.32) => mesh(rbox(0.6, 0.62, 0.42, 0.17, 4), gloss(col, rough), 0, 0.97, 0, g);
  switch (i) {
    case 0: {
      // Space suit
      torso('#f5f6fa', 0.3);
      mesh(rbox(0.36, 0.26, 0.06, 0.06), gloss('#ff8a3d', 0.25), 0, 1.04, 0.2, g);
      const cols = ['#5ff6ff', '#ffe066', '#ff5f8f'];
      cols.forEach((cc, k) => {
        const b = mesh(cyl(0.028, 0.028, 0.02, 16), glow(cc, 2), -0.09 + k * 0.09, 1.06, 0.235, g);
        b.rotation.x = Math.PI / 2;
      });
      mesh(rbox(0.62, 0.08, 0.44, 0.04), gloss('#2c3548', 0.3), 0, 0.72, 0, g);
      mesh(rbox(0.1, 0.07, 0.04, 0.02), metal('#e9edf5', 0.15), 0, 0.72, 0.22, g);
      // collar ring
      mesh(torus(0.13, 0.04), gloss('#d6dbe6', 0.25), 0, 1.28, 0, g).rotation.x = Math.PI / 2;
      arms(g, gloss('#f5f6fa', 0.3), gloss('#ff8a3d', 0.3));
      break;
    }
    case 1: {
      // Hero armor
      torso('#2f6bff', 0.28);
      const plate = mesh(rbox(0.46, 0.34, 0.1, 0.08), gloss('#ffd23f', 0.18), 0, 1.04, 0.18, g);
      plate.rotation.x = -0.06;
      const star = mesh(cyl(0.06, 0.06, 0.03, 5), glow('#ffffff', 1.4), 0, 1.05, 0.24, g);
      star.rotation.x = Math.PI / 2;
      for (const s of [-1, 1]) {
        const pad = ball([0.16, 0.11, 0.16], gloss('#ffd23f', 0.18), s * 0.36, 1.22, 0, g);
        pad.rotation.z = -s * 0.35;
      }
      mesh(rbox(0.62, 0.08, 0.44, 0.04), gloss('#16245a', 0.3), 0, 0.72, 0, g);
      // cape
      const cape = mesh(rbox(0.52, 0.66, 0.04, 0.02), sheen('#ff4d5e', '#ffc0c8'), 0, 0.92, -0.24, g);
      cape.rotation.x = 0.12;
      arms(g, gloss('#2f6bff', 0.28), gloss('#ffffff', 0.35));
      break;
    }
    case 2: {
      // Hoodie
      const hoodie = sheen('#ff7eb6', '#ffd6ea');
      mesh(rbox(0.62, 0.62, 0.43, 0.18, 4), hoodie, 0, 0.97, 0, g);
      mesh(rbox(0.34, 0.15, 0.05, 0.05), sheen('#ff5fa2', '#ffd6ea'), 0, 0.82, 0.2, g);
      const hood = mesh(torus(0.17, 0.07), hoodie, 0, 1.28, -0.05, g);
      hood.rotation.x = Math.PI / 2 - 0.3;
      for (const s of [-1, 1]) {
        mesh(cyl(0.008, 0.008, 0.16, 6), soft('#ffffff'), s * 0.05, 1.13, 0.22, g);
        ball(0.016, gloss('#ffffff'), s * 0.05, 1.05, 0.22, g, true);
      }
      mesh(rbox(0.63, 0.07, 0.44, 0.03), sheen('#ff5fa2'), 0, 0.69, 0, g);
      arms(g, hoodie, gloss(SKIN, 0.45));
      break;
    }
    case 4: {
      // Tuxedo: midnight satin, white shirt front, red bow tie
      torso('#262a3d', 0.22);
      mesh(rbox(0.2, 0.5, 0.05, 0.04), gloss('#ffffff', 0.3), 0, 1.0, 0.2, g);
      for (const s of [-1, 1]) {
        const lapel = mesh(rbox(0.12, 0.36, 0.04, 0.02), gloss('#3a3f58', 0.18), s * 0.15, 1.08, 0.205, g);
        lapel.rotation.z = s * 0.35;
        const wing = mesh(cone(0.06, 0.12, 16), gloss('#ff3b55', 0.2), s * 0.065, 1.23, 0.24, g);
        wing.rotation.z = (s * Math.PI) / 2;
      }
      ball(0.032, gloss('#ff3b55', 0.2), 0, 1.23, 0.245, g, true);
      for (const y of [1.08, 0.96, 0.84]) ball(0.018, gloss('#262a3d', 0.2), 0, y, 0.228, g, true);
      mesh(rbox(0.62, 0.08, 0.44, 0.04), gloss('#16182a', 0.3), 0, 0.72, 0, g);
      arms(g, gloss('#262a3d', 0.22), gloss('#ffffff', 0.35));
      break;
    }
    case 5: {
      // Sailor: white top with navy stripes, red neckerchief
      const top = sheen('#fbfbff', '#ffffff');
      mesh(rbox(0.6, 0.62, 0.42, 0.17, 4), top, 0, 0.97, 0, g);
      for (let k = 0; k < 3; k++) mesh(rbox(0.615, 0.055, 0.435, 0.025), gloss('#24408f', 0.3), 0, 0.8 + k * 0.15, 0, g);
      mesh(rbox(0.5, 0.2, 0.06, 0.04), gloss('#24408f', 0.3), 0, 1.2, -0.21, g);
      const knot = ball([0.07, 0.05, 0.04], gloss('#ff4d5e', 0.22), 0, 1.16, 0.22, g, true);
      knot.castShadow = false;
      for (const s of [-1, 1]) {
        const tail = mesh(cone(0.05, 0.16, 12), gloss('#ff4d5e', 0.22), s * 0.04, 1.06, 0.225, g);
        tail.rotation.z = Math.PI + s * 0.3;
      }
      arms(g, top, gloss(SKIN, 0.45));
      break;
    }
    default: {
      // Jetpack explorer
      torso('#7ad151', 0.3);
      mesh(rbox(0.5, 0.42, 0.06, 0.1), gloss('#2c3548', 0.3), 0, 1.0, 0.195, g);
      mesh(rbox(0.06, 0.4, 0.07, 0.03), metal('#e9edf5', 0.15), 0, 1.0, 0.22, g);
      // straps
      for (const s of [-1, 1]) mesh(rbox(0.07, 0.6, 0.46, 0.03), gloss('#2c3548', 0.3), s * 0.18, 1.0, 0, g);
      // jetpack
      mesh(rbox(0.44, 0.42, 0.14, 0.06), gloss('#e9edf5', 0.25), 0, 1.02, -0.26, g);
      for (const s of [-1, 1]) {
        mesh(capsule(0.09, 0.3), gloss('#ff8a3d', 0.22), s * 0.13, 1.0, -0.35, g);
        mesh(cone(0.07, 0.08, 16), metal('#9aa6b8'), s * 0.13, 0.78, -0.35, g).rotation.x = Math.PI;
        const flame = mesh(cone(0.055, 0.18, 16), glow('#ffb347', 3), s * 0.13, 0.66, -0.35, g);
        flame.rotation.x = Math.PI;
        flame.castShadow = false;
      }
      arms(g, gloss('#7ad151', 0.3), gloss('#2c3548', 0.35));
    }
  }
  return g;
}

function buildLegs(i: number): THREE.Group {
  const g = new THREE.Group();
  g.name = `legs${i}`;
  const pelvis = (col: THREE.Material) => mesh(rbox(0.5, 0.24, 0.38, 0.1), col, 0, 0.6, 0, g);
  const shoe = (s: number, body: THREE.Material, sole: THREE.Material, h = 0.14) => {
    mesh(rbox(0.21, h, 0.32, 0.07, 3), body, s * 0.14, h / 2 + 0.03, 0.05, g);
    mesh(rbox(0.22, 0.05, 0.34, 0.025), sole, s * 0.14, 0.025, 0.05, g);
  };
  switch (i) {
    case 0: {
      const pants = gloss('#f5f6fa', 0.32);
      pelvis(pants);
      for (const s of [-1, 1]) {
        limb(v(s * 0.14, 0.56, 0), v(s * 0.14, 0.2, 0), 0.105, pants, g);
        ball([0.11, 0.06, 0.11], gloss('#ff8a3d', 0.3), s * 0.14, 0.38, 0.02, g);
        shoe(s, gloss('#ff8a3d', 0.25), gloss('#2c3548', 0.5), 0.18);
      }
      break;
    }
    case 1: {
      const pants = sheen('#26335f', '#7a8cd6');
      pelvis(pants);
      for (const s of [-1, 1]) {
        limb(v(s * 0.14, 0.56, 0), v(s * 0.14, 0.2, 0), 0.1, pants, g);
        shoe(s, gloss('#ff4d5e', 0.25), gloss('#ffffff', 0.4));
        mesh(rbox(0.1, 0.02, 0.12, 0.008), gloss('#ffffff', 0.3), s * 0.14, 0.175, 0.1, g);
      }
      break;
    }
    case 2: {
      // Robot legs
      pelvis(gloss('#d7dde8', 0.25));
      const m = metal('#b9c3d3', 0.2);
      for (const s of [-1, 1]) {
        limb(v(s * 0.14, 0.55, 0), v(s * 0.14, 0.36, 0), 0.07, m, g);
        ball(0.085, gloss('#5fe0c0', 0.25), s * 0.14, 0.34, 0.01, g);
        limb(v(s * 0.14, 0.32, 0), v(s * 0.14, 0.14, 0), 0.06, m, g);
        const foot = ball([0.13, 0.08, 0.17], gloss('#5fe0c0', 0.25), s * 0.14, 0.08, 0.05, g);
        foot.scale.y = 0.08;
        const ring = mesh(torus(0.12, 0.012, Math.PI * 2, 8, 32), glow('#7dfcff', 2.4), s * 0.14, 0.02, 0.05, g);
        ring.rotation.x = Math.PI / 2;
        ring.scale.set(1, 1.35, 1);
      }
      break;
    }
    case 4: {
      // Springs: candy pelvis, chrome coil springs, bouncy pads
      pelvis(gloss('#ff7eb6', 0.22));
      const coil = cachedGeo('coil', () => {
        const pts: THREE.Vector3[] = [];
        for (let k = 0; k <= 90; k++) {
          const t = k / 90;
          const a = t * Math.PI * 2 * 5;
          pts.push(new THREE.Vector3(Math.cos(a) * 0.09, 0.52 - t * 0.36, Math.sin(a) * 0.09));
        }
        return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 180, 0.024, 8, false);
      });
      for (const s of [-1, 1]) {
        mesh(coil, metal('#ffd23f', 0.18), s * 0.14, 0, 0, g);
        mesh(cyl(0.11, 0.11, 0.05, 24), gloss('#ff7eb6', 0.22), s * 0.14, 0.53, 0, g);
        shoe(s, gloss('#ff7eb6', 0.22), gloss('#ffffff', 0.4));
      }
      break;
    }
    case 5: {
      // Wheels: lilac leggings, roller boots with glowing wheels
      const tights = gloss('#b388ff', 0.3);
      pelvis(tights);
      for (const s of [-1, 1]) {
        limb(v(s * 0.14, 0.56, 0), v(s * 0.14, 0.26, 0), 0.095, tights, g);
        mesh(rbox(0.22, 0.2, 0.32, 0.08, 3), gloss('#ffffff', 0.25), s * 0.14, 0.2, 0.04, g);
        mesh(rbox(0.12, 0.04, 0.3, 0.02), metal('#d7dde8', 0.2), s * 0.14, 0.085, 0.04, g);
        for (const z of [-0.07, 0.15]) {
          const w = mesh(torus(0.045, 0.024, Math.PI * 2, 10, 20), gloss('#ff4fa3', 0.15), s * 0.14, 0.05, z, g);
          w.rotation.y = Math.PI / 2;
        }
      }
      break;
    }
    default: {
      // Shorts, socks, sneakers
      pelvis(sheen('#ffc93c', '#fff1b8'));
      for (const s of [-1, 1]) {
        limb(v(s * 0.15, 0.56, 0), v(s * 0.15, 0.44, 0), 0.12, sheen('#ffc93c', '#fff1b8'), g);
        limb(v(s * 0.14, 0.42, 0), v(s * 0.14, 0.24, 0), 0.075, gloss(SKIN, 0.45), g);
        mesh(cyl(0.085, 0.08, 0.12, 20), soft('#ffffff', 0.6), s * 0.14, 0.2, 0, g);
        mesh(torus(0.085, 0.012, Math.PI * 2, 8, 24), gloss('#3ec5ff'), s * 0.14, 0.24, 0, g).rotation.x = Math.PI / 2;
        shoe(s, gloss('#3ec5ff', 0.25), gloss('#ffffff', 0.4));
      }
    }
  }
  return g;
}

function buildGun(i: number): THREE.Group {
  const g = new THREE.Group();
  g.name = `gun${i}`;
  const h = HAND;
  const grip = (mat: THREE.Material) => {
    const gr = mesh(rbox(0.07, 0.2, 0.1, 0.03), mat, h.x, h.y - 0.04, h.z, g);
    gr.rotation.x = -0.25;
  };
  const along = (geo: THREE.BufferGeometry, mat: THREE.Material, z: number, y = h.y + 0.08) => {
    const m = mesh(geo, mat, h.x, y, z, g);
    m.rotation.x = Math.PI / 2;
    return m;
  };
  switch (i) {
    case 0: {
      // Splash blaster: orange body, bubble tank, teal nozzle
      grip(gloss('#2f6bff', 0.3));
      mesh(rbox(0.13, 0.15, 0.42, 0.06), gloss('#ff8a3d', 0.22), h.x, h.y + 0.08, h.z + 0.12, g);
      along(cyl(0.04, 0.045, 0.22), gloss('#ffd23f', 0.22), h.z + 0.42);
      along(torus(0.05, 0.018), gloss('#2f6bff', 0.25), h.z + 0.53);
      ball(0.085, glass('#7fe3ff', 0.55), h.x, h.y + 0.21, h.z + 0.1, g);
      ball(0.06, glow('#3ec5ff', 0.8), h.x, h.y + 0.19, h.z + 0.1, g, true);
      mesh(rbox(0.04, 0.06, 0.08, 0.015), gloss('#ffd23f', 0.3), h.x, h.y - 0.01, h.z + 0.09, g);
      break;
    }
    case 1: {
      // Retro ray gun: chrome bulb, fins, glowing rings
      grip(gloss('#ff4d5e', 0.25));
      ball([0.1, 0.1, 0.16], metal('#e6ebf3', 0.12), h.x, h.y + 0.09, h.z + 0.08, g);
      along(cyl(0.035, 0.05, 0.3), metal('#e6ebf3', 0.12), h.z + 0.32, h.y + 0.09);
      for (let k = 0; k < 3; k++) along(torus(0.06 - k * 0.006, 0.014), glow('#b388ff', 2.4), h.z + 0.24 + k * 0.08, h.y + 0.09);
      ball(0.04, glow('#7dfcff', 3), h.x, h.y + 0.09, h.z + 0.49, g, true);
      const fin = mesh(rbox(0.02, 0.12, 0.14, 0.01), gloss('#ff4d5e', 0.25), h.x, h.y + 0.2, h.z + 0.04, g);
      fin.rotation.x = -0.4;
      break;
    }
    case 2: {
      // Slime cannon: chunky lime with glowing slime tank
      grip(gloss('#2c3548', 0.3));
      mesh(rbox(0.16, 0.18, 0.46, 0.07), gloss('#9cff57', 0.22), h.x, h.y + 0.09, h.z + 0.14, g);
      const tank = mesh(capsule(0.065, 0.16), glass('#d4ffe0', 0.4), h.x, h.y + 0.25, h.z + 0.1, g);
      tank.rotation.x = Math.PI / 2;
      const goo = mesh(capsule(0.05, 0.14), glow('#5dff7a', 1.4), h.x, h.y + 0.24, h.z + 0.1, g);
      goo.rotation.x = Math.PI / 2;
      along(cyl(0.085, 0.07, 0.14), gloss('#2c3548', 0.3), h.z + 0.43, h.y + 0.09);
      along(torus(0.08, 0.02), glow('#5dff7a', 2.2), h.z + 0.5, h.y + 0.09);
      break;
    }
    case 4: {
      // Rapid: mini gatling with a spinning barrel cluster
      grip(gloss('#2c3548', 0.3));
      mesh(capsule(0.09, 0.2), gloss('#3ec5ff', 0.22), h.x, h.y + 0.09, h.z + 0.08, g).rotation.x = Math.PI / 2;
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2;
        const b = mesh(cyl(0.022, 0.022, 0.34, 10), metal('#e6ebf3', 0.12), h.x + Math.cos(a) * 0.05, h.y + 0.09 + Math.sin(a) * 0.05, h.z + 0.36, g);
        b.rotation.x = Math.PI / 2;
      }
      along(torus(0.075, 0.016), glow('#ffd23f', 2.2), h.z + 0.5, h.y + 0.09);
      along(torus(0.075, 0.016), gloss('#3ec5ff', 0.22), h.z + 0.24, h.y + 0.09);
      break;
    }
    case 5: {
      // Twin shot: purple body, two chrome barrels with glowing tips
      grip(gloss('#ffd23f', 0.25));
      mesh(rbox(0.22, 0.14, 0.36, 0.06), gloss('#7d5cff', 0.22), h.x, h.y + 0.08, h.z + 0.1, g);
      for (const s of [-1, 1]) {
        along(cyl(0.035, 0.04, 0.3), metal('#e6ebf3', 0.12), h.z + 0.38, h.y + 0.09).position.x = h.x + s * 0.055;
        ball(0.03, glow('#5dff7a', 2.4), h.x + s * 0.055, h.y + 0.09, h.z + 0.54, g, true);
      }
      break;
    }
    default: {
      // Bubble launcher: lilac body, wand ring, iridescent bubbles
      grip(gloss('#ffffff', 0.3));
      mesh(rbox(0.12, 0.13, 0.36, 0.06), gloss('#b388ff', 0.22), h.x, h.y + 0.08, h.z + 0.1, g);
      along(cyl(0.03, 0.03, 0.16), gloss('#ff7eb6', 0.22), h.z + 0.34);
      const ring = mesh(torus(0.08, 0.016), gloss('#ff7eb6', 0.2), h.x, h.y + 0.08, h.z + 0.44, g);
      ring.rotation.x = 0;
      const film = mesh(cachedGeo('disc', () => new THREE.CircleGeometry(1, 24)), iridescent('#ffffff'), h.x, h.y + 0.08, h.z + 0.44, g);
      film.scale.setScalar(0.075);
      film.castShadow = false;
      const bubs: [number, number, number, number][] = [[0.04, 0.2, 0.62, 0.06], [-0.05, 0.3, 0.75, 0.045], [0.06, 0.4, 0.86, 0.035]];
      for (const [x, y, z, r] of bubs) {
        const b = ball(r, iridescent('#ffffff'), h.x + x, h.y + y - 0.1, h.z + z - 0.1, g);
        b.castShadow = false;
      }
    }
  }
  return g;
}

export function buildHeroPart(slot: Slot, index: number): THREE.Group {
  const i = ((index % 6) + 6) % 6;
  switch (slot) {
    case 'head':
      return buildHead(i);
    case 'body':
      return buildBody(i);
    case 'legs':
      return buildLegs(i);
    default:
      return buildGun(i);
  }
}

// ---------------------------------------------------------------------------
// Pyshka — glossy slime bun
// ---------------------------------------------------------------------------

function rng(seed: number) {
  let a = (seed * 2654435761) >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bun radius profile, used both for the lathe and to place the face. */
function bunProfile(t: number) {
  const c = Math.max(Math.cos(t), 0);
  const s = Math.sin(t);
  return { x: 0.55 * Math.pow(c, 0.62), y: 0.3 + (s < 0 ? 0.3 * s : 0.62 * s) };
}

const PYSHKA_COLORS = ['#6ff59a', '#ff8fbf', '#71ceff', '#ffcf4a', '#b89cff', '#ff9f6b', '#5fe8dd'];

export function buildPyshka(seed: number): THREE.Group {
  const r = rng(seed + 7);
  const g = new THREE.Group();
  g.name = `pyshka${seed}`;
  const base = new THREE.Color(PYSHKA_COLORS[Math.abs(seed) % PYSHKA_COLORS.length]);
  base.offsetHSL((r() - 0.5) * 0.04, 0, (r() - 0.5) * 0.04);
  const hex = base.getHexString();
  const mat = cachedMat(`slime:${hex}`, () => {
    const light = base.clone().lerp(new THREE.Color('#ffffff'), 0.6);
    return new THREE.MeshPhysicalMaterial({
      color: base,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      sheen: 0.6,
      sheenColor: light,
      sheenRoughness: 0.35,
      emissive: base,
      emissiveIntensity: 0.14,
      envMapIntensity: 1.2,
    });
  });

  const bunGeo = cachedGeo('bun', () => {
    const pts: THREE.Vector2[] = [];
    const N = 28;
    for (let k = 0; k <= N; k++) {
      const t = -Math.PI / 2 + (Math.PI * k) / N;
      const p = bunProfile(t);
      pts.push(new THREE.Vector2(Math.max(p.x, 1e-4), p.y));
    }
    const geo = new THREE.LatheGeometry(pts, 44);
    geo.computeVertexNormals();
    return geo;
  });

  const body = new THREE.Group();
  body.name = 'squish';
  g.add(body);
  const sx = 1 + (r() - 0.5) * 0.12;
  mesh(bunGeo, mat, 0, 0, 0, body).scale.set(sx, 0.92 + r() * 0.16, sx);

  // goo puddle rim
  const rim = mesh(torus(0.47, 0.09, Math.PI * 2, 10, 44), mat, 0, 0.04, 0, body);
  rim.rotation.x = Math.PI / 2;
  rim.scale.set(sx, sx, 0.45);

  // swirl tip
  const tip = ball([0.11, 0.15, 0.11], mat, 0.03, 0.9, 0, body);
  tip.rotation.z = -0.5;
  ball(0.06, mat, 0.1, 1.0, 0, body, true);

  // face — placed on the bun surface
  const faceY = 0.5;
  const surfR = (y: number) => bunProfile(Math.asin(Math.min((y - 0.3) / 0.62, 1))).x * sx;
  const R = surfR(faceY);
  const style = seed % 5 === 3 ? 2 : seed % 5 === 1 ? 1 : 0;
  const eyeSize = 2.1 + r() * 0.4;
  for (const s of [-1, 1]) {
    const yaw = s * 0.33;
    const pos = v(Math.sin(yaw) * R, faceY, Math.cos(yaw) * R);
    const n = v(Math.sin(yaw), 0.18, Math.cos(yaw)).normalize();
    let eye: THREE.Object3D;
    if (style === 2) {
      // happy closed eyes ^ ^
      eye = new THREE.Group();
      const arc = mesh(torus(0.075, 0.02, Math.PI, 8, 16), gloss('#1d1630', 0.2));
      eye.add(arc);
    } else {
      eye = toyEye(eyeSize);
    }
    eye.position.copy(pos).addScaledVector(n, -0.01);
    eye.quaternion.setFromUnitVectors(FWD, n);
    body.add(eye);
    const b = blush(0.075);
    const yawB = s * 0.55;
    const rb = surfR(faceY - 0.1) - 0.012;
    b.position.set(Math.sin(yawB) * rb, faceY - 0.1, Math.cos(yawB) * rb);
    b.quaternion.setFromUnitVectors(FWD, v(Math.sin(yawB), 0, Math.cos(yawB)));
    body.add(b);
  }
  const mouth = new THREE.Group();
  if (style === 1) {
    // open "o" mouth
    ball([0.055, 0.065, 0.025], gloss('#3a1d2a', 0.2), 0, 0, 0, mouth, true);
    ball([0.035, 0.02, 0.012], gloss('#ff7aa2', 0.3), 0, -0.022, 0.012, mouth, true);
  } else {
    mouth.add(smile(0.07, 0.016, gloss('#3a1d2a', 0.3)));
  }
  mouth.position.set(0, faceY - 0.12, surfR(faceY - 0.12) - 0.008);
  mouth.quaternion.setFromUnitVectors(FWD, v(0, -0.1, 1).normalize());
  body.add(mouth);

  // accessory
  const acc = Math.floor(r() * 4);
  if (acc === 0) {
    // leaf sprout
    mesh(cyl(0.012, 0.015, 0.14, 8), soft('#3fae5a', 0.5), -0.05, 1.0, 0, body);
    for (const s of [-1, 1]) {
      const leaf = ball([0.09, 0.025, 0.05], gloss('#5cd36f', 0.3), -0.05 + s * 0.08, 1.08, 0, body, true);
      leaf.rotation.z = s * 0.4;
    }
  } else if (acc === 1) {
    // tiny gold crown
    const cr = new THREE.Group();
    mesh(cyl(0.11, 0.1, 0.07, 20, true), metal('#ffcf4a', 0.18), 0, 0, 0, cr).material = cachedMat('crownM', () => {
      const m = metal('#ffcf4a', 0.18).clone();
      m.side = THREE.DoubleSide;
      return m;
    });
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      ball(0.025, gloss('#ff5f8f', 0.15), Math.cos(a) * 0.105, 0.06, Math.sin(a) * 0.105, cr, true);
    }
    cr.position.set(-0.12, 0.86, -0.02);
    cr.rotation.z = 0.25;
    body.add(cr);
  } else if (acc === 2) {
    // bow
    const bow = new THREE.Group();
    ball([0.08, 0.055, 0.04], gloss('#ffffff', 0.25), -0.07, 0, 0, bow, true).rotation.z = 0.35;
    ball([0.08, 0.055, 0.04], gloss('#ffffff', 0.25), 0.07, 0, 0, bow, true).rotation.z = -0.35;
    ball(0.035, gloss('#ffffff', 0.25), 0, 0, 0.01, bow, true);
    bow.position.set(-0.25, 0.8, 0.2);
    bow.rotation.set(-0.4, -0.5, 0.3);
    body.add(bow);
  }
  return g;
}

// ---------------------------------------------------------------------------
// Skyscraper
// ---------------------------------------------------------------------------

interface PathPt {
  x: number;
  z: number;
  nx: number;
  nz: number;
}

/** Rounded rectangle outline in the XZ plane with outward normals. */
function rrPath(w: number, d: number, r: number, seg = 8): PathPt[] {
  const pts: PathPt[] = [];
  const cx = w / 2 - r;
  const cz = d / 2 - r;
  const corners: [number, number][] = [[cx, cz], [-cx, cz], [-cx, -cz], [cx, -cz]];
  corners.forEach(([ox, oz], q) => {
    for (let k = 0; k <= seg; k++) {
      const a = (q + k / seg) * (Math.PI / 2);
      const nx = Math.cos(a);
      const nz = Math.sin(a);
      pts.push({ x: ox + nx * r, z: oz + nz * r, nx, nz });
    }
  });
  return pts;
}

/** Vertical ribbon wall following a rounded-rect path. U runs along arc length / uScale. */
function ribbonGeo(w: number, d: number, r: number, h: number, uScale = 1): THREE.BufferGeometry {
  return cachedGeo(`ribbon:${w}:${d}:${r}:${h}:${uScale}`, () => {
    const path = rrPath(w, d, r);
    path.push(path[0]);
    const pos: number[] = [];
    const nor: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    let arc = 0;
    path.forEach((p, i) => {
      if (i > 0) arc += Math.hypot(p.x - path[i - 1].x, p.z - path[i - 1].z);
      pos.push(p.x, 0, p.z, p.x, h, p.z);
      nor.push(p.nx, 0, p.nz, p.nx, 0, p.nz);
      uv.push(arc / uScale, 0, arc / uScale, 1);
      if (i > 0) {
        const a = (i - 1) * 2;
        const b = i * 2;
        idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    return geo;
  });
}

function rrShape(w: number, d: number, r: number, cx = 0, cy = 0): THREE.Shape {
  const s = new THREE.Shape();
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - d / 2, y1 = cy + d / 2;
  s.moveTo(x0 + r, y0);
  s.lineTo(x1 - r, y0);
  s.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x1, y1 - r);
  s.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
  s.lineTo(x0 + r, y1);
  s.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x0, y0 + r);
  s.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Rounded slab, base at y=0, extruded upward with soft bevels. */
function slabGeo(w: number, d: number, r: number, h: number, bevel = 0.1, hole?: [number, number, number]): THREE.BufferGeometry {
  return cachedGeo(`slab:${w}:${d}:${r}:${h}:${bevel}:${hole}`, () => {
    const shape = rrShape(w, d, r);
    if (hole) shape.holes.push(rrShape(hole[0], hole[1], hole[2]));
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(h - bevel * 2, 0.001),
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 3,
      curveSegments: 10,
    });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, bevel, 0);
    geo.computeVertexNormals();
    return geo;
  });
}

function flatShapeGeo(w: number, d: number, r: number): THREE.BufferGeometry {
  return cachedGeo(`flat:${w}:${d}:${r}`, () => {
    const g = new THREE.ShapeGeometry(rrShape(w, d, r), 10);
    g.rotateX(-Math.PI / 2);
    return g;
  });
}

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, srgb = true): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/** Facade glass: sky reflection gradient over softly lit interiors and slim mullions. */
function facadeTexture(seed: number): THREE.CanvasTexture {
  const r = rng(seed * 31 + 3);
  return canvasTex(1024, 256, (c) => {
    const W = 1024, H = 256, bays = 8, bw = W / bays;
    for (let b = 0; b < bays; b++) {
      const x = b * bw;
      const lit = r();
      const g = c.createLinearGradient(0, 0, 0, H);
      if (lit > 0.45) {
        g.addColorStop(0, '#fff1d6');
        g.addColorStop(0.35, '#ffd9a6');
        g.addColorStop(1, '#f2b98a');
      } else {
        g.addColorStop(0, '#cfe9ff');
        g.addColorStop(0.5, '#8cc7f2');
        g.addColorStop(1, '#5a9ad6');
      }
      c.fillStyle = g;
      c.fillRect(x, 0, bw, H);
      // ceiling light strip
      if (lit > 0.45) {
        c.fillStyle = 'rgba(255,255,255,0.85)';
        c.fillRect(x + 14, 10, bw - 28, 8);
      }
      // furniture / plants silhouettes
      if (r() > 0.5) {
        c.fillStyle = lit > 0.45 ? 'rgba(90,170,90,0.75)' : 'rgba(60,120,110,0.5)';
        c.beginPath();
        c.arc(x + 25 + r() * (bw - 50), H - 70, 22 + r() * 10, 0, Math.PI * 2);
        c.fill();
        c.fillRect(x + 20 + r() * (bw - 40), H - 56, 10, 40);
      }
      if (r() > 0.55) {
        c.fillStyle = 'rgba(255,255,255,0.35)';
        c.fillRect(x + 10, H - 64, bw - 20, 30);
      }
    }
    // sky reflection sweep
    const sweep = c.createLinearGradient(0, 0, W, H);
    sweep.addColorStop(0, 'rgba(255,255,255,0.35)');
    sweep.addColorStop(0.3, 'rgba(255,255,255,0.0)');
    sweep.addColorStop(0.55, 'rgba(255,255,255,0.22)');
    sweep.addColorStop(0.62, 'rgba(255,255,255,0.0)');
    sweep.addColorStop(1, 'rgba(255,255,255,0.18)');
    c.fillStyle = sweep;
    c.fillRect(0, 0, W, H);
    // mullions
    c.fillStyle = '#f4f7fb';
    for (let b = 0; b <= bays; b++) c.fillRect(b * bw - 4, 0, 8, H);
    c.fillRect(0, H - 12, W, 12);
    c.fillStyle = 'rgba(255,255,255,0.7)';
    c.fillRect(0, H * 0.72, W, 3);
  });
}

function causticTexture(): THREE.CanvasTexture {
  return canvasTex(256, 256, (c) => {
    c.fillStyle = '#000';
    c.fillRect(0, 0, 256, 256);
    const r = rng(99);
    c.strokeStyle = 'rgba(255,255,255,0.75)';
    c.lineCap = 'round';
    for (let k = 0; k < 70; k++) {
      c.lineWidth = 1.5 + r() * 2.5;
      const x = r() * 256, y = r() * 256, rad = 10 + r() * 22;
      c.beginPath();
      c.arc(x, y, rad, r() * 6, r() * 6 + 1.6 + r() * 1.5);
      c.stroke();
    }
  });
}

let _caustic: THREE.CanvasTexture | null = null;
function waterMat(color: Col, strength = 0.5): THREE.MeshPhysicalMaterial {
  return cachedMat(`water:${color}:${strength}`, () => {
    _caustic ??= causticTexture();
    const t = _caustic.clone();
    t.needsUpdate = true;
    t.repeat.set(2, 2);
    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0,
      emissive: '#d9fbff',
      emissiveMap: t,
      emissiveIntensity: strength,
      envMapIntensity: 1.4,
    });
  });
}

function waterSheetMat(): THREE.MeshPhysicalMaterial {
  return cachedMat('waterSheet', () => {
    const t = canvasTex(64, 256, (c) => {
      const g = c.createLinearGradient(0, 0, 64, 0);
      for (let k = 0; k <= 8; k++) g.addColorStop(k / 8, k % 2 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.35)');
      c.fillStyle = g;
      c.fillRect(0, 0, 64, 256);
      for (let y = 0; y < 256; y += 32) {
        c.fillStyle = 'rgba(255,255,255,0.4)';
        c.fillRect(0, y, 64, 10);
      }
    }, false);
    t.repeat.set(6, 1);
    return new THREE.MeshPhysicalMaterial({
      color: '#bdf2ff',
      roughness: 0.05,
      alphaMap: t,
      transparent: true,
      opacity: 0.6,
      emissive: '#7fe3ff',
      emissiveIntensity: 0.15,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  });
}

/** Animation hook: showcase calls userData.tick(t) on any object that has it. */
function addTick(obj: THREE.Object3D, fn: (t: number) => void) {
  obj.userData.tick = fn;
}

function lounger(towel: Col): THREE.Group {
  const g = new THREE.Group();
  const white = gloss('#ffffff', 0.3);
  mesh(rbox(0.75, 0.12, 1.5, 0.05), white, 0, 0.32, 0.2, g);
  const back = mesh(rbox(0.75, 0.1, 0.75, 0.05), white, 0, 0.5, -0.78, g);
  back.rotation.x = -0.55;
  mesh(rbox(0.66, 0.07, 1.4, 0.035), sheen(towel), 0, 0.41, 0.2, g);
  const tb = mesh(rbox(0.66, 0.07, 0.66, 0.035), sheen(towel), 0, 0.57, -0.74, g);
  tb.rotation.x = -0.55;
  for (const sx of [-1, 1]) for (const sz of [-0.4, 0.8]) mesh(cyl(0.03, 0.03, 0.28, 10), metal('#c7cfdb'), sx * 0.3, 0.14, sz, g);
  return g;
}

function umbrella(col: Col): THREE.Group {
  const g = new THREE.Group();
  mesh(cyl(0.04, 0.04, 2.3, 10), metal('#e6ebf3', 0.2), 0, 1.15, 0, g);
  const top = mesh(cone(1.25, 0.45, 24, true), cachedMat(`umb:${col}`, () => new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.5, sheen: 1, sheenColor: '#ffffff', side: THREE.DoubleSide })), 0, 2.25, 0, g);
  top.castShadow = true;
  ball(0.07, gloss('#ffffff'), 0, 2.5, 0, g, true);
  mesh(cyl(0.25, 0.3, 0.12, 20), gloss('#ffffff', 0.3), 0, 0.06, 0, g);
  return g;
}

function planterBush(r = 0.55, col: Col = '#57c46a'): THREE.Group {
  const g = new THREE.Group();
  mesh(cyl(r, r * 0.8, r * 0.9, 24), gloss('#f4f1ea', 0.35), 0, r * 0.45, 0, g);
  ball([r * 0.95, r * 0.8, r * 0.95], sheen(col, '#d8ffc8'), 0, r * 1.2, 0, g);
  ball(r * 0.55, sheen('#7ad97a', '#e8ffd8'), r * 0.35, r * 1.6, r * 0.2, g);
  return g;
}

export function buildSkyscraper(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'skyscraper';
  const W = 13; // slab size
  const SR = 2.2; // slab corner radius
  const GW = 12.2; // glass band size
  const GR = 1.7;
  const plinthH = 0.4;
  const lobbyH = 4.6;
  const floorH = 3.2;
  const FLOORS = 9; // plus lobby = 10
  const slabT = 0.5;
  const white = gloss('#fbfbfd', 0.32);
  const stone = soft('#ece8e1', 0.55);

  // plinth + entrance steps
  mesh(slabGeo(16, 16, 3, plinthH, 0.12), stone, 0, 0, 0, g);
  for (let k = 0; k < 2; k++) mesh(rbox(6 - k * 0.6, 0.14, 1.0, 0.05), stone, 0, 0.07 + k * 0.14, 8.3 - k * 0.5, g);

  // ---- lobby
  const lobby = new THREE.Group();
  lobby.position.y = plinthH;
  g.add(lobby);
  mesh(flatShapeGeo(GW - 0.6, GW - 0.6, GR - 0.3), soft('#f6efe6', 0.4), 0, 0.01, 0, lobby).receiveShadow = true;
  const lg = mesh(ribbonGeo(GW - 0.6, GW - 0.6, GR - 0.3, lobbyH), glass('#e8f7ff', 0.22), 0, 0, 0, lobby);
  lg.castShadow = false;
  // reception desk, sofas, planters, pendant lights
  mesh(rbox(3.4, 1.0, 0.9, 0.3), white, 0, 0.5, -1.2, lobby);
  mesh(rbox(3.5, 0.08, 1.0, 0.04), soft('#c8946a', 0.45), 0, 1.03, -1.2, lobby);
  for (const s of [-1, 1]) {
    mesh(rbox(1.8, 0.45, 0.8, 0.2), sheen('#ff8fbf', '#ffe0ef'), s * 3.4, 0.3, 2.6, lobby);
    mesh(rbox(1.8, 0.5, 0.25, 0.12), sheen('#ff8fbf', '#ffe0ef'), s * 3.4, 0.65, 2.9, lobby);
    const p = planterBush(0.6);
    p.position.set(s * 4.2, 0, -3.8);
    lobby.add(p);
    for (let k = 0; k < 3; k++) {
      mesh(cyl(0.01, 0.01, 1.4, 4), metal('#9aa6b8'), s * (1.2 + k * 1.1), lobbyH - 0.7, 0.8, lobby);
      ball(0.22, glow('#ffe2b0', 1.6), s * (1.2 + k * 1.1), lobbyH - 1.45, 0.8, lobby, true).castShadow = false;
    }
  }
  // columns around lobby
  for (const p of rrPath(W - 0.8, W - 0.8, SR - 0.4, 1)) {
    if (Math.abs(p.nx) > 0.2 && Math.abs(p.nz) > 0.2) continue;
    mesh(cyl(0.18, 0.18, lobbyH, 20), white, p.x, lobbyH / 2, p.z, lobby);
  }
  for (const s of [-1, 1]) mesh(cyl(0.16, 0.16, lobbyH, 20), white, s * 2.4, lobbyH / 2, W / 2 - 0.4, lobby);
  // revolving door
  mesh(cyl(1.0, 1.0, 2.8, 28, true), glass('#e8f7ff', 0.3), 0, 1.4, GW / 2 - 0.3, lobby).castShadow = false;
  mesh(cyl(1.08, 1.08, 0.25, 28), white, 0, 2.92, GW / 2 - 0.3, lobby);
  const doorWing = mesh(rbox(1.9, 2.6, 0.05, 0.02), glass('#cfeeff', 0.35), 0, 1.35, GW / 2 - 0.3, lobby);
  doorWing.castShadow = false;
  addTick(doorWing, (t) => (doorWing.rotation.y = t * 0.6));
  // canopy with sign
  mesh(rbox(7.2, 0.28, 3.4, 0.14), white, 0, lobbyH - 0.6, W / 2 + 1.0, lobby);
  const signTex = canvasTex(1024, 128, (c) => {
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, 1024, 128);
    const gr = c.createLinearGradient(0, 0, 1024, 0);
    gr.addColorStop(0, '#2f6bff');
    gr.addColorStop(0.5, '#b388ff');
    gr.addColorStop(1, '#ff7eb6');
    c.fillStyle = gr;
    c.font = '800 84px -apple-system, "SF Pro Display", "Helvetica Neue", Arial, sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('SLIME  TOWER', 512, 68);
  });
  signTex.wrapS = signTex.wrapT = THREE.ClampToEdgeWrapping;
  const sign = mesh(cachedGeo('signPlane', () => new THREE.PlaneGeometry(6.4, 0.8)), new THREE.MeshStandardMaterial({ map: signTex, emissive: '#ffffff', emissiveMap: signTex, emissiveIntensity: 0.35, roughness: 0.4 }), 0, lobbyH - 0.15, W / 2 + 2.62, lobby);
  sign.castShadow = false;
  mesh(rbox(6.6, 0.95, 0.16, 0.08), white, 0, lobbyH - 0.15, W / 2 + 2.52, lobby);

  // ---- floors
  const facadeMats = [0, 1, 2].map((k) =>
    cachedMat(`facade${k}`, () => {
      const t = facadeTexture(k);
      return new THREE.MeshPhysicalMaterial({
        map: t,
        emissive: '#ffffff',
        emissiveMap: t,
        emissiveIntensity: 0.28,
        roughness: 0.12,
        metalness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 1.3,
      });
    }),
  );
  const hedge: THREE.Matrix4[] = [];
  const tmpM = new THREE.Matrix4();
  const tmpQ = new THREE.Quaternion();
  const hr = rng(5);
  for (let f = 0; f <= FLOORS; f++) {
    const y = plinthH + lobbyH + f * floorH;
    mesh(slabGeo(W, W, SR, slabT, 0.14), white, 0, y - slabT / 2, 0, g);
    if (f < FLOORS) {
      const band = mesh(ribbonGeo(GW, GW, GR, floorH - slabT, 12.8), facadeMats[f % 3], 0, y + slabT / 2, 0, g);
      band.castShadow = f === 0;
    }
    // planted balcony rims on some floors
    if (f % 3 === 2) {
      for (const p of rrPath(W - 0.35, W - 0.35, SR - 0.2, 3)) {
        for (let k = 0; k < 2; k++) {
          const s = 0.28 + hr() * 0.14;
          const jx = (hr() - 0.5) * 0.4;
          tmpM.compose(new THREE.Vector3(p.x - p.nz * jx * k, y + slabT / 2 + s * 0.4, p.z + p.nx * jx * k), tmpQ, new THREE.Vector3(s, s * 0.8, s));
          hedge.push(tmpM.clone());
        }
      }
      // also straight runs between corners
      const half = (W - 0.35) / 2;
      for (let t = -half + SR; t <= half - SR; t += 0.55) {
        for (const [x, z] of [[t, half], [t, -half], [half, t], [-half, t]]) {
          if (x > half - 0.1 && Math.abs(z) < 1.3) continue; // leave room for the elevator bridge
          const s = 0.26 + hr() * 0.14;
          tmpM.compose(new THREE.Vector3(x, y + slabT / 2 + s * 0.4, z), tmpQ, new THREE.Vector3(s, s * 0.8, s));
          hedge.push(tmpM.clone());
        }
      }
    }
  }
  const hedgeMesh = new THREE.InstancedMesh(SPHERE_LO(), sheen('#5cc96b', '#e0ffd0'), hedge.length);
  hedge.forEach((m, k) => hedgeMesh.setMatrixAt(k, m));
  const hc = new THREE.Color();
  for (let k = 0; k < hedge.length; k++) hedgeMesh.setColorAt(k, hc.setHSL(0.3 + hr() * 0.06, 0.55, 0.42 + hr() * 0.12));
  hedgeMesh.castShadow = true;
  hedgeMesh.receiveShadow = true;
  g.add(hedgeMesh);

  const roofY = plinthH + lobbyH + FLOORS * floorH + slabT / 2;

  // ---- exterior glass elevator shaft on +X
  const shaftX = W / 2 + 1.05;
  const shaftR = 0.95;
  const shaftTop = roofY + 3.2;
  const tube = mesh(cyl(shaftR, shaftR, shaftTop - plinthH, 32, true), glass('#e3f6ff', 0.2), shaftX, (shaftTop + plinthH) / 2, 0, g);
  tube.castShadow = false;
  for (const s of [-1, 1]) mesh(cyl(0.05, 0.05, shaftTop - plinthH, 8), metal('#d7dde8'), shaftX + 0.55, (shaftTop + plinthH) / 2, s * 0.5, g);
  for (let f = 0; f <= FLOORS + 1; f++) {
    const y = f === 0 ? plinthH + 0.1 : f <= FLOORS + 0 ? plinthH + lobbyH + (f - 1) * floorH : shaftTop;
    const ring = mesh(torus(shaftR, 0.08, Math.PI * 2, 10, 40), white, shaftX, y, 0, g);
    ring.rotation.x = Math.PI / 2;
    if (f > 0 && f <= FLOORS) mesh(rbox(1.2, 0.4, 1.6, 0.12), white, W / 2 - 0.1, y, 0, g);
  }
  const dome = mesh(HEMI(), gloss('#ffffff', 0.25), shaftX, shaftTop, 0, g);
  dome.scale.set(shaftR + 0.08, 0.7, shaftR + 0.08);
  ball(0.16, glow('#ff5f8f', 2.2), shaftX, shaftTop + 0.8, 0, g, true);
  const cabin = new THREE.Group();
  mesh(cyl(0.75, 0.75, 1.9, 28), gloss('#ffcf4a', 0.22), 0, 0, 0, cabin);
  mesh(cyl(0.77, 0.77, 0.9, 28), glow('#fff4d6', 0.9), 0, 0.15, 0, cabin).castShadow = false;
  mesh(cyl(0.8, 0.8, 0.1, 28), white, 0, 0.98, 0, cabin);
  mesh(cyl(0.8, 0.8, 0.1, 28), white, 0, -0.98, 0, cabin);
  cabin.position.set(shaftX, 10, 0);
  g.add(cabin);
  const minY = plinthH + 1.1;
  const maxY = roofY + 1.1;
  addTick(cabin, (t) => {
    const k = 0.5 - 0.5 * Math.cos(t * 0.25);
    const e = k * k * (3 - 2 * k);
    cabin.position.y = minY + (maxY - minY) * e;
  });

  // ---- rooftop
  const roof = new THREE.Group();
  roof.position.y = roofY;
  g.add(roof);
  mesh(flatShapeGeo(W - 0.5, W - 0.5, SR - 0.25), soft('#d9b48f', 0.55), 0, 0.01, 0, roof);
  // deck planks hint
  for (let k = -5; k <= 5; k++) mesh(rbox(0.04, 0.012, W - 1.6, 0.005), soft('#c49c76', 0.6), k * 1.05, 0.02, 0, roof).castShadow = false;
  const rail = mesh(ribbonGeo(W - 0.25, W - 0.25, SR - 0.12, 1.1), glass('#e8f8ff', 0.25), 0, 0, 0, roof);
  rail.castShadow = false;
  const railPts = rrPath(W - 0.25, W - 0.25, SR - 0.12, 8).map((p) => new THREE.Vector3(p.x, 1.12, p.z));
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPts, true), 160, 0.05, 8, true), white, 0, 0, 0, roof);

  // pool
  const poolX = -2.3, poolZ = -2.6, pw = 6.2, pd = 3.4;
  const pool = new THREE.Group();
  pool.position.set(poolX, 0, poolZ);
  roof.add(pool);
  mesh(slabGeo(pw + 0.8, pd + 0.8, 1.3, 0.3, 0.08, [pw, pd, 0.95]), white, 0, 0, 0, pool);
  const water = mesh(flatShapeGeo(pw, pd, 0.95), waterMat('#29c4f2', 0.55), 0, 0.22, 0, pool);
  water.castShadow = false;
  const wm = water.material as THREE.MeshPhysicalMaterial;
  addTick(water, (t) => {
    wm.emissiveMap!.offset.set(t * 0.03, t * 0.017);
  });
  for (const s of [-1, 1]) {
    const lad = mesh(torus(0.22, 0.03, Math.PI, 8, 16), metal('#e6ebf3', 0.15), pw / 2 - 0.9 + s * 0.25, 0.3, pd / 2 + 0.08, pool);
    lad.rotation.y = Math.PI / 2;
  }
  // spa
  const spa = new THREE.Group();
  spa.position.set(2.7, 0, -3.4);
  roof.add(spa);
  mesh(cyl(1.35, 1.4, 0.55, 36), gloss('#ffffff', 0.28), 0, 0.27, 0, spa);
  const spaRim = mesh(torus(1.3, 0.12, Math.PI * 2, 10, 48), gloss('#ffffff', 0.28), 0, 0.55, 0, spa);
  spaRim.rotation.x = Math.PI / 2;
  const spaWater = mesh(cachedGeo('disc', () => new THREE.CircleGeometry(1, 24)), waterMat('#5ff0e0', 0.8), 0, 0.5, 0, spa);
  spaWater.rotation.x = -Math.PI / 2;
  spaWater.scale.setScalar(1.22);
  const bubbleMesh = new THREE.InstancedMesh(SPHERE_LO(), gloss('#ffffff', 0.1), 26);
  const br = rng(11);
  const bubbleBase: THREE.Vector3[] = [];
  for (let k = 0; k < 26; k++) {
    const a = br() * Math.PI * 2, rad = Math.sqrt(br()) * 1.05;
    bubbleBase.push(new THREE.Vector3(Math.cos(a) * rad, 0.5, Math.sin(a) * rad));
  }
  spa.add(bubbleMesh);
  addTick(bubbleMesh, (t) => {
    bubbleBase.forEach((p, k) => {
      const s = 0.03 + 0.03 * (0.5 + 0.5 * Math.sin(t * 3 + k * 1.7));
      tmpM.compose(p, tmpQ, new THREE.Vector3(s, s, s));
      bubbleMesh.setMatrixAt(k, tmpM);
    });
    bubbleMesh.instanceMatrix.needsUpdate = true;
  });
  bubbleMesh.userData.tick(0);

  // loungers + umbrellas
  const towels = ['#ff7eb6', '#3ec5ff', '#ffcf4a', '#7ad151'];
  towels.forEach((col, k) => {
    const l = lounger(col);
    l.position.set(-4.2 + k * 1.55, 0, 2.2);
    l.rotation.y = Math.PI;
    roof.add(l);
  });
  const u1 = umbrella('#ff7eb6');
  u1.position.set(-3.45, 0, 3.6);
  roof.add(u1);
  const u2 = umbrella('#3ec5ff');
  u2.position.set(-0.35, 0, 3.6);
  roof.add(u2);
  // planters at corners
  for (const [x, z] of [[-5, -5], [-5, 5], [4.6, 4.8], [5.1, -0.2]]) {
    const p = planterBush(0.6);
    p.position.set(x, 0, z);
    roof.add(p);
  }
  // elevator lobby kiosk on roof
  mesh(rbox(1.4, 2.6, 2.2, 0.5), white, W / 2 - 1.1, 1.3, 0, roof);
  mesh(rbox(0.06, 2.0, 1.4, 0.03), visor('#1b2a40'), W / 2 - 1.83, 1.05, 0, roof);
  mesh(rbox(0.07, 0.12, 0.5, 0.04), glow('#7dfcff', 2), W / 2 - 1.84, 2.3, 0, roof);
  // bar cart
  mesh(rbox(1.6, 0.9, 0.7, 0.2), gloss('#ffcf4a', 0.25), 2.6, 0.45, 2.6, roof);
  mesh(rbox(1.7, 0.08, 0.8, 0.04), white, 2.6, 0.94, 2.6, roof);
  ball(0.12, glow('#ff7eb6', 1.4), 2.2, 1.06, 2.6, roof, true);
  ball(0.12, glow('#5ff0e0', 1.4), 2.9, 1.06, 2.6, roof, true);

  return g;
}

// ---------------------------------------------------------------------------
// City props
// ---------------------------------------------------------------------------

function latheGeo(key: string, pts: [number, number][], seg = 40): THREE.BufferGeometry {
  return cachedGeo(`lathe:${key}`, () => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg));
}

function fountain(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'fountain';
  const stone = gloss('#f6f4f0', 0.35);
  const accent = gloss('#9fd9ff', 0.25);
  // outer basin: rounded rim profile
  const basin = latheGeo('basin', [
    [0, 0], [2.6, 0], [2.72, 0.06], [2.78, 0.3], [2.76, 0.55], [2.68, 0.66], [2.56, 0.66], [2.5, 0.58], [2.48, 0.3], [0, 0.3],
  ], 56);
  mesh(basin, stone, 0, 0, 0, g);
  const pool = mesh(cachedGeo('disc', () => new THREE.CircleGeometry(1, 24)), waterMat('#36c9f5', 0.6), 0, 0.5, 0, g);
  pool.rotation.x = -Math.PI / 2;
  pool.scale.setScalar(2.52);
  pool.castShadow = false;
  const pm = pool.material as THREE.MeshPhysicalMaterial;
  // pedestal + bowls
  mesh(latheGeo('pedestal', [[0, 0], [0.5, 0], [0.42, 0.2], [0.26, 0.5], [0.22, 1.1], [0.3, 1.35], [0, 1.35]], 32), stone, 0, 0.3, 0, g);
  const bowl = latheGeo('bowl', [[0, 0], [0.3, 0], [0.7, 0.12], [1.05, 0.32], [1.12, 0.42], [1.06, 0.46], [0.9, 0.36], [0, 0.34]], 44);
  mesh(bowl, stone, 0, 1.6, 0, g);
  const bw = mesh(cachedGeo('disc', () => new THREE.CircleGeometry(1, 24)), waterMat('#36c9f5', 0.6), 0, 1.96, 0, g);
  bw.rotation.x = -Math.PI / 2;
  bw.scale.setScalar(0.95);
  mesh(cyl(0.12, 0.16, 0.7, 20), stone, 0, 2.3, 0, g);
  const small = mesh(bowl, stone, 0, 2.6, 0, g);
  small.scale.set(0.45, 0.6, 0.45);
  ball(0.16, accent, 0, 2.95, 0, g);
  // water sheets falling from the bowls
  const sheetMat = waterSheetMat();
  const sheet1 = mesh(cyl(1.1, 1.2, 1.45, 44, true), sheetMat, 0, 1.3, 0, g);
  sheet1.castShadow = false;
  const sheet2 = mesh(cyl(0.48, 0.56, 0.6, 32, true), sheetMat, 0, 2.6, 0, g);
  sheet2.castShadow = false;
  // top jet
  const jet = mesh(cyl(0.03, 0.08, 0.7, 12, true), sheetMat, 0, 3.4, 0, g);
  jet.castShadow = false;
  const drop = ball(0.09, glass('#d6f6ff', 0.7), 0, 3.8, 0, g);
  drop.castShadow = false;
  // ripple rings
  const ripples: THREE.Mesh[] = [];
  const rippleMat = cachedMat('ripple', () => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5, depthWrite: false }));
  for (let k = 0; k < 3; k++) {
    const rr = new THREE.Mesh(torus(1, 0.012, Math.PI * 2, 6, 64), rippleMat.clone());
    rr.rotation.x = Math.PI / 2;
    rr.position.y = 0.51;
    g.add(rr);
    ripples.push(rr);
  }
  addTick(g, (t) => {
    pm.emissiveMap!.offset.set(t * 0.04, -t * 0.02);
    (sheetMat.alphaMap as THREE.Texture).offset.y = t * 0.9;
    ripples.forEach((rr, k) => {
      const p = (t * 0.35 + k / 3) % 1;
      rr.scale.setScalar(1.25 + p * 1.2);
      (rr.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - p);
    });
    drop.position.y = 3.75 + Math.abs(Math.sin(t * 3)) * 0.12;
  });
  // ring of mini jets around the pedestal
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    ball(0.07, accent, Math.cos(a) * 1.9, 0.5, Math.sin(a) * 1.9, g, true);
    const j = mesh(cyl(0.015, 0.045, 0.4, 8, true), sheetMat, Math.cos(a) * 1.9, 0.7, Math.sin(a) * 1.9, g);
    j.castShadow = false;
  }
  return g;
}

function car(color: Col): THREE.Group {
  const g = new THREE.Group();
  g.name = 'car';
  const paint = cachedMat(`paint:${color}`, () =>
    new THREE.MeshPhysicalMaterial({ color, metalness: 0.35, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.3 }),
  );
  mesh(rbox(2.0, 0.8, 3.8, 0.38, 5), paint, 0, 0.75, 0, g);
  mesh(rbox(1.7, 0.78, 2.0, 0.36, 5), paint, 0, 1.38, -0.25, g);
  // windows: slightly larger dark glass band inset into the cabin
  mesh(rbox(1.74, 0.5, 1.84, 0.22, 4), visor('#1a2436'), 0, 1.42, -0.25, g);
  mesh(rbox(1.5, 0.08, 1.6, 0.04), paint, 0, 1.78, -0.25, g);
  // bumpers
  for (const s of [-1, 1]) mesh(rbox(2.05, 0.28, 0.3, 0.13), gloss('#f2f4f8', 0.3), 0, 0.5, s * 1.85, g);
  // lights
  for (const s of [-1, 1]) {
    const hl = ball([0.17, 0.14, 0.06], glow('#fffbe6', 2.5), s * 0.65, 0.82, 1.9, g, true);
    hl.castShadow = false;
    const tl = mesh(rbox(0.38, 0.12, 0.06, 0.04), glow('#ff3b55', 2), s * 0.62, 0.86, -1.9, g);
    tl.castShadow = false;
    ball(0.07, gloss('#f2f4f8', 0.3), s * 1.0, 1.2, 0.55, g, true);
  }
  // wheels
  const tire = gloss('#23262e', 0.6);
  const hub = metal('#e6ebf3', 0.15);
  for (const sx of [-1, 1]) for (const sz of [-1.15, 1.2]) {
    const t = mesh(torus(0.3, 0.14, Math.PI * 2, 14, 28), tire, sx * 0.93, 0.44, sz, g);
    t.rotation.y = Math.PI / 2;
    const h = mesh(cyl(0.22, 0.22, 0.14, 24), hub, sx * 0.97, 0.44, sz, g);
    h.rotation.z = Math.PI / 2;
    const cap = mesh(cyl(0.08, 0.08, 0.16, 16), gloss(color, 0.25), sx * 0.99, 0.44, sz, g);
    cap.rotation.z = Math.PI / 2;
  }
  // roof sign: a cheerful taxi-like slime dome
  ball([0.28, 0.22, 0.2], gloss('#ffffff', 0.2), 0, 1.84, -0.25, g, true);
  return g;
}

function tree(scale = 1, hue = 0): THREE.Group {
  const g = new THREE.Group();
  g.name = 'tree';
  mesh(cyl(0.16, 0.24, 2.2, 16), gloss('#a7744f', 0.5), 0, 1.1, 0, g);
  const r = rng(17 + hue * 13);
  const greens = ['#4cc95f', '#6fdb6a', '#3fb85f', '#88e07a'];
  const blobs: [number, number, number, number][] = [
    [0, 2.9, 0, 1.25], [0.75, 2.5, 0.3, 0.8], [-0.7, 2.6, -0.2, 0.85], [0.2, 3.7, -0.1, 0.75], [-0.25, 2.4, 0.7, 0.7], [0.2, 2.5, -0.75, 0.72],
  ];
  blobs.forEach(([x, y, z, s], k) => ball(s, sheen(greens[(k + hue) % greens.length], '#e6ffd8'), x, y, z, g));
  // a few fruit dots
  for (let k = 0; k < 6; k++) {
    const a = r() * Math.PI * 2, el = r() * 0.8 - 0.1;
    ball(0.08, gloss('#ff5f6d', 0.2), Math.cos(a) * Math.cos(el) * 1.25, 2.9 + Math.sin(el) * 1.25, Math.sin(a) * Math.cos(el) * 1.25, g, true);
  }
  mesh(cyl(0.9, 1.0, 0.35, 32), gloss('#f4f1ea', 0.35), 0, 0.175, 0, g);
  mesh(cyl(0.82, 0.82, 0.02, 32), soft('#8a6a50', 0.9), 0, 0.35, 0, g);
  g.scale.setScalar(scale);
  return g;
}

function bench(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'bench';
  const wood = gloss('#e0a46e', 0.45);
  const iron = gloss('#33405a', 0.3);
  for (let k = 0; k < 3; k++) mesh(rbox(2.4, 0.08, 0.2, 0.04), wood, 0, 0.5, -0.25 + k * 0.23, g);
  for (let k = 0; k < 2; k++) {
    const b = mesh(rbox(2.4, 0.2, 0.07, 0.035), wood, 0, 0.82 + k * 0.26, -0.42 - k * 0.05, g);
    b.rotation.x = -0.18;
  }
  for (const s of [-1, 1]) {
    const leg = mesh(torus(0.28, 0.045, Math.PI, 8, 20), iron, s * 0.95, 0.04, 0, g);
    leg.rotation.y = Math.PI / 2;
    leg.scale.set(1, 1.6, 1);
    limb(v(s * 0.95, 0.5, -0.32), v(s * 0.95, 1.12, -0.5), 0.04, iron, g);
    const arm = mesh(rbox(0.08, 0.06, 0.6, 0.03), iron, s * 1.12, 0.72, -0.05, g);
    arm.rotation.x = 0.05;
    limb(v(s * 1.12, 0.5, 0.2), v(s * 1.12, 0.72, 0.2), 0.035, iron, g);
  }
  return g;
}

function lamp(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'lamp';
  const iron = gloss('#33405a', 0.28);
  mesh(cyl(0.28, 0.34, 0.3, 24), iron, 0, 0.15, 0, g);
  mesh(cyl(0.07, 0.09, 3.6, 16), iron, 0, 2.0, 0, g);
  mesh(torus(0.11, 0.035), gloss('#ffcf4a', 0.25), 0, 1.0, 0, g).rotation.x = Math.PI / 2;
  // curved arm
  const arm = mesh(torus(0.45, 0.045, Math.PI / 2, 8, 20), iron, 0.45, 3.8, 0, g);
  arm.rotation.z = Math.PI / 2;
  const hood = mesh(HEMI(), gloss('#33405a', 0.28), 0.9, 4.15, 0, g);
  hood.scale.set(0.34, 0.24, 0.34);
  mesh(cyl(0.02, 0.02, 0.15, 6), iron, 0.9, 4.32, 0, g);
  const bulb = ball(0.24, glow('#ffe7b0', 2.4), 0.9, 4.08, 0, g);
  bulb.castShadow = false;
  // flower pot hanging
  const pot = mesh(cyl(0.2, 0.15, 0.25, 20), gloss('#ff7eb6', 0.3), -0.25, 2.6, 0, g);
  pot.rotation.z = 0;
  limb(v(-0.08, 2.75, 0), v(-0.25, 2.75, 0), 0.02, iron, g);
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    ball(0.07, gloss(['#ffcf4a', '#ffffff', '#ff5f8f'][k % 3], 0.3), -0.25 + Math.cos(a) * 0.12, 2.78, Math.sin(a) * 0.12, g, true);
  }
  return g;
}

function flowerBed(): THREE.Group {
  const g = new THREE.Group();
  mesh(slabGeo(3.2, 1.2, 0.55, 0.45, 0.1), gloss('#f4f1ea', 0.35), 0, 0, 0, g);
  mesh(flatShapeGeo(2.9, 0.9, 0.42), soft('#7a5a44', 0.9), 0, 0.42, 0, g);
  const r = rng(42);
  const cols = ['#ff5f8f', '#ffcf4a', '#ffffff', '#b388ff', '#ff8a3d'];
  const n = 26;
  const flowers = new THREE.InstancedMesh(SPHERE_LO(), gloss('#ffffff', 0.3), n);
  const leaves = new THREE.InstancedMesh(SPHERE_LO(), sheen('#5cc96b', '#e0ffd0'), n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color();
  for (let k = 0; k < n; k++) {
    const x = (r() - 0.5) * 2.6, z = (r() - 0.5) * 0.7;
    m4.compose(v(x, 0.6 + r() * 0.1, z), q, v(0.09, 0.09, 0.09));
    flowers.setMatrixAt(k, m4);
    flowers.setColorAt(k, c.set(cols[k % cols.length]));
    m4.compose(v(x, 0.48, z), q, v(0.16, 0.1, 0.16));
    leaves.setMatrixAt(k, m4);
  }
  for (const im of [flowers, leaves]) {
    im.castShadow = true;
    im.receiveShadow = true;
    g.add(im);
  }
  return g;
}

export function buildCityProps(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'cityProps';
  g.add(fountain());

  const c = car('#ff5a6e');
  c.position.set(9.5, 0, 3.5);
  c.rotation.y = -0.5;
  g.add(c);

  const t1 = tree(1, 0);
  t1.position.set(-9, 0, -2.5);
  g.add(t1);
  const t2 = tree(0.8, 1);
  t2.position.set(-12.5, 0, 2);
  g.add(t2);
  const t3 = tree(0.9, 2);
  t3.position.set(11.5, 0, -4);
  g.add(t3);

  const b = bench();
  b.position.set(-5.4, 0, 2.6);
  b.rotation.y = 0.9;
  g.add(b);
  const b2 = bench();
  b2.position.set(5.2, 0, -3.4);
  b2.rotation.y = -Math.PI + 0.9;
  g.add(b2);

  const l1 = lamp();
  l1.position.set(-4.4, 0, -3.6);
  l1.rotation.y = -0.6;
  g.add(l1);
  const l2 = lamp();
  l2.position.set(5.6, 0, 1.5);
  l2.rotation.y = Math.PI + 0.3;
  g.add(l2);

  const fb = flowerBed();
  fb.position.set(-7.5, 0, 4.5);
  fb.rotation.y = 0.35;
  g.add(fb);
  const fb2 = flowerBed();
  fb2.position.set(1.5, 0, -6.2);
  g.add(fb2);
  return g;
}
