import * as THREE from 'three';
import type { Look } from '../sim/types';
import { geo, part } from './materials';

// Procedural chunky toy character. Origin at the feet, facing -z.

export const PART_COUNT = 6;

const SKIN = 0xffcc99;
const DARK = 0x222233;
const WHITE = 0xffffff;

export interface CharacterRig {
  root: THREE.Group;
  inner: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  head: THREE.Group;
}

function eyes(g: THREE.Group, y: number, z: number, spread = 0.11, size = 0.08, color = DARK) {
  g.add(part(geo.box(), color, size, size * 1.2, 0.04, -spread, y, z));
  g.add(part(geo.box(), color, size, size * 1.2, 0.04, spread, y, z));
}

function buildHead(i: number): THREE.Group {
  const g = new THREE.Group();
  const b = geo.box();
  switch (i) {
    case 0: // blocky
      g.add(part(b, SKIN, 0.5, 0.48, 0.48, 0, 0.24));
      g.add(part(b, 0x6b3e1f, 0.54, 0.14, 0.52, 0, 0.52));
      g.add(part(b, 0x6b3e1f, 0.54, 0.3, 0.12, 0, 0.36, 0.22));
      eyes(g, 0.28, -0.25);
      g.add(part(b, 0xcc5555, 0.18, 0.04, 0.04, 0, 0.12, -0.25));
      break;
    case 1: // round smiley
      g.add(part(geo.sphere(), 0xffd93d, 0.6, 0.58, 0.58, 0, 0.27));
      eyes(g, 0.32, -0.27, 0.1, 0.07);
      g.add(part(b, 0xcc3333, 0.2, 0.05, 0.05, 0, 0.16, -0.27));
      g.add(part(geo.cone(6), 0xff4d6d, 0.3, 0.3, 0.3, 0, 0.66));
      break;
    case 2: // robot
      g.add(part(b, 0x9aa5b1, 0.52, 0.46, 0.48, 0, 0.23));
      g.add(part(b, 0x33e6ff, 0.42, 0.12, 0.04, 0, 0.28, -0.25));
      g.add(part(geo.cyl(6), 0x666677, 0.04, 0.3, 0.04, 0, 0.6));
      g.add(part(geo.sphere(), 0xff3355, 0.12, 0.12, 0.12, 0, 0.78));
      g.add(part(b, 0x666677, 0.08, 0.2, 0.2, -0.3, 0.24));
      g.add(part(b, 0x666677, 0.08, 0.2, 0.2, 0.3, 0.24));
      break;
    case 3: // cat
      g.add(part(b, 0xffa94d, 0.52, 0.46, 0.48, 0, 0.23));
      g.add(part(geo.cone(4), 0xffa94d, 0.2, 0.22, 0.14, -0.16, 0.56));
      g.add(part(geo.cone(4), 0xffa94d, 0.2, 0.22, 0.14, 0.16, 0.56));
      eyes(g, 0.28, -0.25, 0.12, 0.08, 0x2b9348);
      g.add(part(b, 0xff6b9a, 0.08, 0.06, 0.04, 0, 0.18, -0.26));
      g.add(part(b, WHITE, 0.6, 0.02, 0.02, 0, 0.16, -0.26));
      break;
    case 4: // knight helmet
      g.add(part(geo.cyl(8), 0xc0c8d0, 0.5, 0.52, 0.5, 0, 0.26));
      g.add(part(b, DARK, 0.36, 0.06, 0.04, 0, 0.3, -0.25));
      g.add(part(b, DARK, 0.06, 0.24, 0.04, 0, 0.18, -0.25));
      g.add(part(geo.cone(6), 0xe63946, 0.16, 0.42, 0.3, 0, 0.7, 0.05));
      break;
    default: // alien
      g.add(part(geo.sphere(), 0x7ed957, 0.56, 0.7, 0.56, 0, 0.32));
      g.add(part(geo.sphere(), DARK, 0.2, 0.13, 0.08, -0.13, 0.36, -0.25));
      g.add(part(geo.sphere(), DARK, 0.2, 0.13, 0.08, 0.13, 0.36, -0.25));
      g.add(part(geo.cyl(5), 0x7ed957, 0.03, 0.25, 0.03, -0.15, 0.75));
      g.add(part(geo.cyl(5), 0x7ed957, 0.03, 0.25, 0.03, 0.15, 0.75));
      g.add(part(geo.sphere(), 0xfff275, 0.09, 0.09, 0.09, -0.15, 0.88));
      g.add(part(geo.sphere(), 0xfff275, 0.09, 0.09, 0.09, 0.15, 0.88));
      break;
  }
  return g;
}

function bodyColor(i: number): number {
  return [0xe63946, 0x3a86ff, 0xc0c8d0, 0x1d1d2b, 0x55dd55, 0xf1f1f1][i] ?? 0xe63946;
}

function buildBody(i: number): THREE.Group {
  const g = new THREE.Group();
  const b = geo.box();
  const c = bodyColor(i);
  switch (i) {
    case 0:
      g.add(part(b, c, 0.62, 0.6, 0.36, 0, 0.3));
      g.add(part(b, WHITE, 0.2, 0.2, 0.02, 0, 0.36, -0.19));
      break;
    case 1:
      g.add(part(b, c, 0.66, 0.62, 0.4, 0, 0.31));
      g.add(part(b, 0x2a62c9, 0.5, 0.3, 0.12, 0, 0.5, 0.24));
      g.add(part(b, 0x2a62c9, 0.36, 0.16, 0.02, 0, 0.14, -0.21));
      break;
    case 2:
      g.add(part(b, c, 0.66, 0.6, 0.4, 0, 0.3));
      g.add(part(b, 0xffc300, 0.44, 0.34, 0.06, 0, 0.36, -0.22));
      g.add(part(b, 0xa0a8b0, 0.2, 0.14, 0.42, -0.38, 0.54));
      g.add(part(b, 0xa0a8b0, 0.2, 0.14, 0.42, 0.38, 0.54));
      break;
    case 3:
      g.add(part(b, c, 0.62, 0.6, 0.36, 0, 0.3));
      g.add(part(b, WHITE, 0.2, 0.5, 0.02, 0, 0.32, -0.19));
      g.add(part(b, 0xe63946, 0.22, 0.08, 0.04, 0, 0.52, -0.2));
      break;
    case 4:
      g.add(part(geo.sphere(), c, 0.72, 0.68, 0.48, 0, 0.32));
      g.add(part(b, 0x2d6a4f, 0.7, 0.08, 0.5, 0, 0.12));
      g.add(part(geo.sphere(), 0xb7ffb7, 0.16, 0.16, 0.06, 0.12, 0.42, -0.23));
      break;
    default: // marinière
      g.add(part(b, c, 0.62, 0.6, 0.36, 0, 0.3));
      for (let k = 0; k < 3; k++) g.add(part(b, 0x1d3557, 0.64, 0.07, 0.38, 0, 0.12 + k * 0.17));
      break;
  }
  return g;
}

function buildLeg(i: number): THREE.Group {
  const g = new THREE.Group(); // pivot at hip; leg extends down to y=-0.7
  const b = geo.box();
  switch (i) {
    case 0:
      g.add(part(b, 0x3d5a80, 0.24, 0.6, 0.26, 0, -0.3));
      g.add(part(b, 0x333333, 0.26, 0.12, 0.36, 0, -0.64, -0.05));
      break;
    case 1:
      g.add(part(b, 0xe63946, 0.26, 0.26, 0.28, 0, -0.13));
      g.add(part(b, SKIN, 0.18, 0.36, 0.18, 0, -0.42));
      g.add(part(b, WHITE, 0.26, 0.14, 0.38, 0, -0.63, -0.05));
      break;
    case 2:
      g.add(part(geo.cyl(6), 0x8d99ae, 0.16, 0.6, 0.16, 0, -0.3));
      g.add(part(geo.sphere(), 0x555566, 0.22, 0.22, 0.22, 0, -0.32));
      g.add(part(b, 0x555566, 0.28, 0.12, 0.4, 0, -0.64, -0.05));
      break;
    case 3: {
      g.add(part(geo.cyl(6), 0xff8fab, 0.08, 0.6, 0.08, 0, -0.3));
      for (let k = 0; k < 4; k++) {
        const ring = part(geo.torus(), 0xffd23f, 0.45, 0.45, 0.45, 0, -0.12 - k * 0.13);
        ring.rotation.x = Math.PI / 2;
        g.add(ring);
      }
      g.add(part(b, 0xff8fab, 0.28, 0.12, 0.36, 0, -0.64, -0.04));
      break;
    }
    case 4:
      g.add(part(b, 0x52b788, 0.24, 0.4, 0.26, 0, -0.2));
      g.add(part(b, 0x7f4f24, 0.3, 0.32, 0.32, 0, -0.52));
      g.add(part(b, 0x7f4f24, 0.3, 0.12, 0.44, 0, -0.64, -0.06));
      break;
    default: // roller skates
      g.add(part(b, 0xc77dff, 0.22, 0.5, 0.24, 0, -0.25));
      g.add(part(b, WHITE, 0.26, 0.16, 0.36, 0, -0.56, -0.04));
      for (const z of [-0.16, 0.08]) {
        const w = part(geo.cyl(8), 0xff006e, 0.14, 0.08, 0.14, 0, -0.66, z);
        w.rotation.z = Math.PI / 2;
        g.add(w);
      }
      break;
  }
  return g;
}

function buildGun(i: number): THREE.Group {
  // Held in the right hand; barrel points -z.
  const g = new THREE.Group();
  const b = geo.box();
  const barrel = (color: number, r: number, len: number, x = 0, y = 0, z = 0) => {
    const m = part(geo.cyl(8), color, r, len, r, x, y, z);
    m.rotation.x = Math.PI / 2;
    return m;
  };
  switch (i) {
    case 0:
      g.add(part(b, 0xff7b00, 0.16, 0.2, 0.36, 0, 0, -0.1));
      g.add(barrel(0x7ae582, 0.12, 0.3, 0, 0.04, -0.4));
      g.add(part(b, 0x444444, 0.1, 0.18, 0.1, 0, -0.14, 0.02));
      break;
    case 1:
      g.add(part(b, 0x00b4d8, 0.16, 0.16, 0.5, 0, 0, -0.18));
      g.add(part(geo.sphere(), 0xff9f1c, 0.28, 0.28, 0.28, 0, 0.18, -0.05));
      g.add(barrel(0xffd60a, 0.07, 0.3, 0, 0.02, -0.55));
      break;
    case 2:
      g.add(barrel(0x588157, 0.24, 0.9, 0, 0.12, -0.15));
      g.add(barrel(0x344e41, 0.28, 0.12, 0, 0.12, -0.6));
      break;
    case 3: {
      g.add(barrel(0xff70a6, 0.06, 0.55, 0, 0, -0.2));
      const ring = part(geo.torus(), 0x70d6ff, 0.6, 0.6, 0.6, 0, 0, -0.55);
      g.add(ring);
      break;
    }
    case 4:
      g.add(part(b, 0x6a4c93, 0.3, 0.18, 0.34, 0, 0, -0.1));
      g.add(barrel(0xc0c0c0, 0.1, 0.4, -0.07, 0.03, -0.42));
      g.add(barrel(0xc0c0c0, 0.1, 0.4, 0.07, 0.03, -0.42));
      break;
    default:
      g.add(part(b, 0xe5e5e5, 0.14, 0.18, 0.34, 0, 0, -0.08));
      g.add(barrel(0xef476f, 0.08, 0.36, 0, 0.03, -0.38));
      for (const z of [-0.3, -0.42]) {
        const r = part(geo.torus(), 0x06d6a0, 0.4, 0.4, 0.4, 0, 0.03, z);
        g.add(r);
      }
      g.add(part(geo.sphere(), 0xffd166, 0.14, 0.14, 0.14, 0, 0.03, -0.58));
      break;
  }
  return g;
}

export function buildCharacter(look: Look): CharacterRig {
  const root = new THREE.Group();
  const inner = new THREE.Group();
  root.add(inner);
  const [h, bo, l, gn] = look;

  const legL = buildLeg(l);
  legL.position.set(-0.16, 0.7, 0);
  const legR = buildLeg(l);
  legR.position.set(0.16, 0.7, 0);
  inner.add(legL, legR);

  const body = buildBody(bo);
  body.position.y = 0.7;
  inner.add(body);

  const sleeve = bo === 4 ? 0x55dd55 : bodyColor(bo);
  const armL = new THREE.Group();
  armL.position.set(-0.42, 1.24, 0);
  armL.add(part(geo.box(), sleeve, 0.18, 0.26, 0.2, 0, -0.12));
  armL.add(part(geo.box(), SKIN, 0.16, 0.26, 0.16, 0, -0.38));
  const armR = new THREE.Group();
  armR.position.set(0.42, 1.24, 0);
  armR.add(part(geo.box(), sleeve, 0.18, 0.26, 0.2, 0, -0.12));
  armR.add(part(geo.box(), SKIN, 0.16, 0.26, 0.16, 0, -0.38));
  const gun = buildGun(gn);
  gun.position.set(0, -0.42, 0);
  gun.rotation.x = -Math.PI / 2; // compensates the arm raise so the barrel points forward
  armR.add(gun);
  armR.rotation.x = Math.PI / 2;
  inner.add(armL, armR);

  const head = buildHead(h);
  head.position.y = 1.3;
  inner.add(head);

  // tiny face/detail pieces don't need to cast shadows
  root.traverse((c) => {
    if (c instanceof THREE.Mesh && c.scale.x * c.scale.y * c.scale.z < 0.004) c.castShadow = false;
  });
  return { root, inner, legL, legR, armL, armR, head };
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
