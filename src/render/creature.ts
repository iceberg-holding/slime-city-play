import * as THREE from 'three';
import { nextRandom } from '../sim/rng';
import { Kit, geo, lathe } from './materials';

// "Pyshki": round glossy slime buns with big eyes. About half wear a market-granny headscarf.

const COLORS = [0xffb347, 0xff8fb1, 0x8be0ff, 0xb69cff, 0x7ee8a2, 0xffe066, 0xff9b7a];
const SCARF = [0xff4d6d, 0x4d96ff, 0x9b5de5, 0x2ec4b6, 0xff9f1c];
const DARK = 0x1d1f33;

export interface CreatureView {
  root: THREE.Group;
  /** squash & stretch group */
  blob: THREE.Group;
  goo: THREE.Mesh;
  /** open eyes (hidden when happy/glued) */
  eyes: THREE.Group;
  /** ^ ^ closed happy eyes */
  happy: THREE.Group;
  /** smile (quiet) vs open "O" mouth (talking) */
  smile: THREE.Group;
  mouth: THREE.Group;
}

const gooMat = new THREE.MeshPhysicalMaterial({
  color: 0x6dff4a,
  roughness: 0.08,
  clearcoat: 1,
  transparent: true,
  opacity: 0.5,
  depthWrite: false,
});

let bunGeo: THREE.BufferGeometry | null = null;
/** Bun profile: flat-ish bottom, puffy rounded top. Height ~0.95, radius ~0.58. */
function bun(): THREE.BufferGeometry {
  if (bunGeo) return bunGeo;
  const pts: [number, number][] = [];
  const N = 32;
  for (let i = 0; i <= N; i++) {
    const th = -Math.PI / 2 + (Math.PI * i) / N;
    const x = 0.58 * Math.pow(Math.max(0, Math.cos(th)), 0.72);
    const y = th < 0 ? 0.3 + 0.3 * Math.sin(th) : 0.3 + 0.62 * Math.sin(th);
    pts.push([Math.max(0.001, x), y]);
  }
  bunGeo = lathe(pts, 48);
  bunGeo.computeVertexNormals();
  return bunGeo;
}

export function buildCreature(seed: number): CreatureView {
  let s = seed;
  const r = () => {
    const [v, n] = nextRandom(s);
    s = n;
    return v;
  };
  const color = COLORS[Math.floor(r() * COLORS.length)];
  const scarf = r() < 0.55 ? SCARF[Math.floor(r() * SCARF.length)] : null;
  const root = new THREE.Group();
  const blob = new THREE.Group();
  root.add(blob);

  const body = new Kit();
  body.add(bun(), color, { finish: 'gloss' });
  // little feet nubs
  for (const x of [-0.22, 0.22]) body.add(geo.sphere(0.13, 20, 12), shadeHex(color, 0.85), { p: [x, 0.04, -0.12], s: [1, 0.55, 1.2], finish: 'gloss' });
  // cheeks
  for (const x of [-0.3, 0.3]) body.add(geo.sphere(0.08, 16, 10), 0xff6f91, { p: [x, 0.42, -0.47], s: [1.2, 0.7, 0.4], finish: 'soft', cast: false });
  if (scarf) {
    // headscarf: a cap over the top and a knot under the "chin"
    const cap = new THREE.SphereGeometry(0.6, 40, 16, 0, Math.PI * 2, 0, 1.15);
    body.add(cap, scarf, { p: [0, 0.35, 0.02], r: [0.45, 0, 0], s: [1.06, 1, 1.06], finish: 'soft' });
    body.add(geo.sphere(0.07, 16, 10), scarf, { p: [0.4, 0.45, -0.42], finish: 'soft' });
    for (const a of [-0.5, 0.5]) body.add(geo.capsule(0.04, 0.18, 8), scarf, { p: [0.42 + a * 0.08, 0.35, -0.42], r: [0, 0, a], finish: 'soft' });
  } else {
    body.add(geo.sphere(0.09, 20, 14), shadeHex(color, 1.1), { p: [0.18, 0.92, 0.05], s: [1, 0.6, 1], finish: 'gloss' });
  }
  blob.add(body.build());

  const eyeK = new Kit();
  for (const x of [-0.16, 0.16]) {
    eyeK.add(geo.sphere(0.13, 24, 16), 0xffffff, { p: [x, 0.58, -0.44], s: [1, 1.1, 0.6], finish: 'gloss', cast: false });
    eyeK.add(geo.sphere(0.07, 20, 14), DARK, { p: [x, 0.57, -0.52], s: [1, 1.1, 0.5], finish: 'gloss', cast: false });
    eyeK.add(geo.sphere(0.022, 10, 8), 0xffffff, { p: [x + 0.025, 0.6, -0.555], finish: 'glow', cast: false });
  }
  const eyes = eyeK.build();
  blob.add(eyes);

  const happyK = new Kit();
  for (const x of [-0.16, 0.16]) happyK.add(geo.torus(0.07, 0.018, Math.PI, 16), DARK, { p: [x, 0.56, -0.5], cast: false });
  const happy = happyK.build();
  happy.visible = false;
  blob.add(happy);

  const smile = new Kit().add(geo.torus(0.08, 0.02, Math.PI, 16), 0x7a2a3a, { p: [0, 0.4, -0.58], r: [0, 0, Math.PI], cast: false }).build();
  blob.add(smile);
  const mouth = new Kit().add(geo.sphere(0.07, 16, 12), 0x7a2a3a, { p: [0, 0.38, -0.565], s: [1, 0.8, 0.5], cast: false }).build();
  mouth.visible = false;
  blob.add(mouth);

  const goo = new THREE.Mesh(geo.sphere(0.5), gooMat);
  goo.scale.set(1.5, 1.3, 1.5);
  goo.position.y = 0.48;
  goo.visible = false;
  root.add(goo);

  return { root, blob, goo, eyes, happy, smile, mouth };
}

function shadeHex(c: number, k: number): number {
  const col = new THREE.Color(c).multiplyScalar(k);
  col.r = Math.min(1, col.r);
  col.g = Math.min(1, col.g);
  col.b = Math.min(1, col.b);
  return col.getHex();
}
