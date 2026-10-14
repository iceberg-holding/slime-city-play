import * as THREE from 'three';
import { nextRandom } from '../sim/rng';
import { geo, mat, part } from './materials';

const COLORS = [0x9b5de5, 0x00bbf9, 0xff8c42, 0xf15bb5, 0x00c49a, 0xfee440];

export interface CreatureView {
  root: THREE.Group;
  blob: THREE.Group;
  goo: THREE.Mesh;
  eyes: THREE.Object3D[];
}

const gooMat = new THREE.MeshLambertMaterial({ color: 0x6dff4a, transparent: true, opacity: 0.55, flatShading: true, depthWrite: false });

export function buildCreature(seed: number): CreatureView {
  let s = seed;
  const r = () => {
    const [v, n] = nextRandom(s);
    s = n;
    return v;
  };
  const color = COLORS[Math.floor(r() * COLORS.length)];
  const root = new THREE.Group();
  const blob = new THREE.Group();
  root.add(blob);

  // Lumpy body: displace icosahedron vertices by a smooth function of direction (keeps seams closed).
  const g = new THREE.IcosahedronGeometry(0.6, 1);
  const pos = g.attributes.position;
  const a1 = 2 + r() * 3;
  const a2 = 2 + r() * 3;
  const ph = r() * 6;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.clone().normalize();
    const k = 1 + 0.14 * Math.sin(n.x * a1 + ph) * Math.cos(n.z * a2 + ph) + 0.08 * n.y;
    v.multiplyScalar(k);
    v.y *= 0.85;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const body = new THREE.Mesh(g, mat(color));
  body.castShadow = true;
  body.position.y = 0.55;
  blob.add(body);

  // Little feet
  for (const x of [-0.25, 0.25]) blob.add(part(geo.sphere(), color, 0.25, 0.18, 0.3, x, 0.08, -0.05));

  // Eyes: 1–3, some on stalks
  const eyes: THREE.Object3D[] = [];
  const count = 1 + Math.floor(r() * 3);
  const stalks = r() < 0.4;
  for (let i = 0; i < count; i++) {
    const ex = count === 1 ? 0 : (i / (count - 1) - 0.5) * 0.5;
    const eye = new THREE.Group();
    const size = count === 1 ? 0.36 : 0.24;
    eye.add(part(geo.sphere(), 0xffffff, size, size, size));
    eye.add(part(geo.sphere(), 0x111111, size * 0.45, size * 0.45, size * 0.3, 0, 0, -size * 0.42));
    if (stalks) {
      eye.position.set(ex, 1.35, -0.2);
      blob.add(part(geo.cyl(5), color, 0.06, 0.4, 0.06, ex, 1.12, -0.2));
    } else {
      eye.position.set(ex, 0.8, -0.48);
    }
    eye.traverse((c) => (c.castShadow = false));
    blob.add(eye);
    eyes.push(eye);
  }
  // Mouth
  blob.add(part(geo.box(), 0x330022, 0.3, 0.08, 0.05, 0, 0.45, -0.6));
  // Optional horns
  if (r() < 0.5) {
    for (const x of [-0.3, 0.3]) {
      const h = part(geo.cone(5), 0xffffff, 0.12, 0.25, 0.12, x, 1.08, 0);
      h.rotation.z = -x;
      blob.add(h);
    }
  }

  const goo = new THREE.Mesh(geo.sphere(), gooMat);
  goo.scale.set(1.7, 1.5, 1.7);
  goo.position.y = 0.6;
  goo.visible = false;
  root.add(goo);

  return { root, blob, goo, eyes };
}
