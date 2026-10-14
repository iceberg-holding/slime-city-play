import * as THREE from 'three';
import type { Solid, World } from '../sim/types';
import { mansardBox } from '../sim/world';
import { geo, mat } from './materials';

/** Collects transforms + colors for one geometry and emits a single InstancedMesh. */
export class InstanceBatch {
  private mats: THREE.Matrix4[] = [];
  private cols: THREE.Color[] = [];
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();

  constructor(
    private geometry: THREE.BufferGeometry,
    private shadows: { cast: boolean; receive: boolean } = { cast: true, receive: true },
  ) {}

  add(x: number, y: number, z: number, sx: number, sy: number, sz: number, color: number, rx = 0, ry = 0, rz = 0) {
    this.e.set(rx, ry, rz);
    this.q.setFromEuler(this.e);
    this.m.compose(new THREE.Vector3(x, y, z), this.q, new THREE.Vector3(sx, sy, sz));
    this.mats.push(this.m.clone());
    this.cols.push(new THREE.Color(color));
  }

  build(material: THREE.Material = mat(0xffffff)): THREE.InstancedMesh {
    const im = new THREE.InstancedMesh(this.geometry, material, Math.max(1, this.mats.length));
    im.count = this.mats.length;
    this.mats.forEach((m, i) => im.setMatrixAt(i, m));
    this.cols.forEach((c, i) => im.setColorAt(i, c));
    im.castShadow = this.shadows.cast;
    im.receiveShadow = this.shadows.receive;
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    return im;
  }
}

/** Unit wedge: footprint [-0.5,0.5]² , height 0..1, rising toward +x. */
export function wedgeGeometry(): THREE.BufferGeometry {
  const A = [-0.5, 0, -0.5];
  const B = [0.5, 0, -0.5];
  const C = [0.5, 0, 0.5];
  const D = [-0.5, 0, 0.5];
  const E = [0.5, 1, -0.5];
  const F = [0.5, 1, 0.5];
  const tris = [
    [A, C, B], [A, D, C], // bottom
    [B, C, F], [B, F, E], // back (tall side)
    [A, E, F], [A, F, D], // slope
    [A, B, E], // side -z
    [D, F, C], // side +z
  ];
  const pos: number[] = [];
  for (const t of tris) for (const v of [t[0], t[2], t[1]]) pos.push(...v); // listed clockwise; emit CCW
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

/** rotation-y + scale for a wedge so it fills `s` and rises toward s.ramp */
export function wedgeTransform(s: Solid): { x: number; y: number; z: number; sx: number; sy: number; sz: number; ry: number } {
  const w = s.maxX - s.minX;
  const d = s.maxZ - s.minZ;
  const along = s.ramp === 0 || s.ramp === 2;
  const ry = s.ramp === 0 ? 0 : s.ramp === 2 ? Math.PI : s.ramp === 1 ? -Math.PI / 2 : Math.PI / 2;
  return {
    x: (s.minX + s.maxX) / 2,
    y: s.minY,
    z: (s.minZ + s.maxZ) / 2,
    sx: along ? w : d,
    sy: s.maxY - s.minY,
    sz: along ? d : w,
    ry,
  };
}

const AWNING = [0xe63946, 0x2a9d8f, 0x264653, 0xf4a261, 0x6a4c93];

/** Builds static city meshes. Also returns decoration boxes the camera should not pass through. */
export function buildCity(world: World): { root: THREE.Group; cameraBlockers: Solid[] } {
  const root = new THREE.Group();
  const cameraBlockers: Solid[] = [];
  const box = geo.box();

  // Ground, sidewalks, plaza
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), mat(0x707780));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  const flat = new InstanceBatch(box, { cast: false, receive: true });
  // sidewalk ring in front of the buildings
  flat.add(0, 0.01, -19.75, 42, 0.02, 2.5, 0xd8d2c4);
  flat.add(0, 0.01, 19.75, 42, 0.02, 2.5, 0xd8d2c4);
  flat.add(-19.75, 0.01, 0, 2.5, 0.02, 37, 0xd8d2c4);
  flat.add(19.75, 0.01, 0, 2.5, 0.02, 37, 0xd8d2c4);
  // road dashes
  for (let t = -14; t <= 14; t += 3) {
    flat.add(t, 0.015, -14.5, 1.4, 0.02, 0.18, 0xf5f5f5);
    flat.add(t, 0.015, 14.5, 1.4, 0.02, 0.18, 0xf5f5f5);
    flat.add(-14.5, 0.015, t, 0.18, 0.02, 1.4, 0xf5f5f5);
    flat.add(14.5, 0.015, t, 0.18, 0.02, 1.4, 0xf5f5f5);
  }
  root.add(flat.build());

  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(world.plazaRadius, world.plazaRadius, 0.06, 32), mat(0xe2cfa6));
  plaza.position.y = 0.03;
  plaza.receiveShadow = true;
  root.add(plaza);
  const plazaRing = new THREE.Mesh(new THREE.TorusGeometry(world.plazaRadius - 0.3, 0.18, 4, 32), mat(0xb89f74));
  plazaRing.rotation.x = Math.PI / 2;
  plazaRing.position.y = 0.06;
  root.add(plazaRing);

  // Buildings
  const bodies = new InstanceBatch(box);
  const cornices = new InstanceBatch(box);
  const windows = new InstanceBatch(box, { cast: false, receive: false });
  const shops = new InstanceBatch(box, { cast: false, receive: true });
  const awnings = new InstanceBatch(box, { cast: true, receive: false });
  const mansardGeo = new THREE.CylinderGeometry(0.5 * Math.SQRT2 * 0.6, 0.5 * Math.SQRT2, 1, 4, 1);
  mansardGeo.rotateY(Math.PI / 4);
  mansardGeo.translate(0, 0.5, 0);
  const mansards = new InstanceBatch(mansardGeo);
  const chimneys = new InstanceBatch(box);

  let seed = 1;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (const b of world.buildings) {
    const w = b.maxX - b.minX;
    const d = b.maxZ - b.minZ;
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    bodies.add(cx, b.height / 2, cz, w, b.height, d, b.color);
    cornices.add(cx, b.height - 0.12, cz, w + 0.3, 0.25, d + 0.3, 0xf8f4ec);
    cornices.add(cx, 0.15, cz, w + 0.1, 0.3, d + 0.1, 0xb8b0a0);
    if (b.mansard) {
      const m = mansardBox(b);
      mansards.add((m.minX + m.maxX) / 2, m.minY, (m.minZ + m.maxZ) / 2, m.maxX - m.minX, m.maxY - m.minY, m.maxZ - m.minZ, 0x5c6f8a);
      chimneys.add(m.minX + 1, m.maxY + 0.2, (m.minZ + m.maxZ) / 2, 0.5, 0.8, 0.5, 0xc96a4a);
      chimneys.add(m.maxX - 1, m.maxY + 0.2, (m.minZ + m.maxZ) / 2, 0.5, 0.8, 0.5, 0xc96a4a);
    }

    // facades: [axis along, fixed coord, outward normal sign]
    const faces: { alongX: boolean; fixed: number; n: number; from: number; to: number }[] = [
      { alongX: true, fixed: b.maxZ, n: 1, from: b.minX, to: b.maxX },
      { alongX: true, fixed: b.minZ, n: -1, from: b.minX, to: b.maxX },
      { alongX: false, fixed: b.maxX, n: 1, from: b.minZ, to: b.maxZ },
      { alongX: false, fixed: b.minX, n: -1, from: b.minZ, to: b.maxZ },
    ];
    for (const f of faces) {
      if (Math.abs(f.fixed) >= world.half - 0.01) continue; // outer wall nobody sees
      const len = f.to - f.from;
      const n = Math.max(1, Math.floor(len / 2.4));
      const spacing = len / n;
      const inward = Math.abs(f.fixed) < 22; // facing the street
      for (let i = 0; i < n; i++) {
        const t = f.from + spacing * (i + 0.5);
        const px = (along: number, out: number) => (f.alongX ? along : f.fixed + out * f.n);
        const pz = (along: number, out: number) => (f.alongX ? f.fixed + out * f.n : along);
        const sxz = (a: number, o: number): [number, number] => (f.alongX ? [a, o] : [o, a]);
        // upper floors
        for (let y = 2.9; y + 1.0 < b.height - 0.3; y += 2.5) {
          const [sx, sz] = sxz(0.9, 0.1);
          windows.add(px(t, 0.03), y, pz(t, 0.03), sx, 1.4, sz, 0x2e4057);
          const [fx, fz] = sxz(1.15, 0.06);
          windows.add(px(t, 0.01), y, pz(t, 0.01), fx, 1.6, fz, 0xfdfcf7);
          if (y < 6) {
            const [bx, bz] = sxz(1.2, 0.35);
            windows.add(px(t, 0.18), y - 0.65, pz(t, 0.18), bx, 0.12, bz, 0x1f2a36);
          }
        }
        if (inward && b.height >= 3) {
          const [sx, sz] = sxz(spacing * 0.75, 0.1);
          shops.add(px(t, 0.03), 1.0, pz(t, 0.03), sx, 1.4, sz, 0x9ad1d4);
          const [ax, az] = sxz(spacing * 0.85, 0.9);
          const tilt = 0.35 * f.n;
          const ax0 = px(t, 0.45) - ax / 2;
          const az0 = pz(t, 0.45) - az / 2;
          cameraBlockers.push({ minX: ax0, minY: 1.7, minZ: az0, maxX: ax0 + ax, maxY: 2.35, maxZ: az0 + az });
          awnings.add(px(t, 0.45), 2.0, pz(t, 0.45), ax, 0.08, az, AWNING[Math.floor(rnd() * AWNING.length)], f.alongX ? tilt : 0, 0, f.alongX ? 0 : -tilt);
        }
      }
    }
  }
  root.add(bodies.build(), cornices.build(), windows.build(), shops.build(), awnings.build(), mansards.build(), chimneys.build());

  // World ramps
  const wedge = wedgeGeometry();
  const rampBatch = new InstanceBatch(wedge);
  for (const r of world.ramps) {
    const t = wedgeTransform(r);
    rampBatch.add(t.x, t.y, t.z, t.sx, t.sy, t.sz, 0xc9b79c, 0, t.ry, 0);
  }
  const platBatch = new InstanceBatch(box);
  for (const p of world.platforms) {
    platBatch.add((p.minX + p.maxX) / 2, (p.minY + p.maxY) / 2, (p.minZ + p.maxZ) / 2, p.maxX - p.minX, p.maxY - p.minY, p.maxZ - p.minZ, 0xb5a58a);
  }
  root.add(rampBatch.build(), platBatch.build());

  // Cars
  const carBody = new InstanceBatch(box);
  const carCabin = new InstanceBatch(box);
  const wheel = new InstanceBatch(geo.cyl(10));
  for (const c of world.cars) {
    const [L, W] = c.alongX ? [4, 1.9] : [1.9, 4];
    carBody.add(c.x, 0.65, c.z, L, 0.9, W, c.color);
    const [cl, cw] = c.alongX ? [2.2, 1.7] : [1.7, 2.2];
    carCabin.add(c.x, 1.42, c.z, cl, 0.64, cw, c.color);
    const [gl, gw] = c.alongX ? [2.24, 1.5] : [1.5, 2.24];
    carCabin.add(c.x, 1.4, c.z, gl, 0.42, gw, 0xbde0fe);
    const [gl2, gw2] = c.alongX ? [1.9, 1.74] : [1.74, 1.9];
    carCabin.add(c.x, 1.4, c.z, gl2, 0.42, gw2, 0xbde0fe);
    for (const a of [-1.3, 1.3]) {
      for (const s of [-0.95, 0.95]) {
        const wx = c.alongX ? c.x + a : c.x + s;
        const wz = c.alongX ? c.z + s : c.z + a;
        wheel.add(wx, 0.38, wz, 0.76, 0.3, 0.76, 0x222222, c.alongX ? Math.PI / 2 : 0, 0, c.alongX ? 0 : Math.PI / 2);
      }
    }
  }
  root.add(carBody.build(), carCabin.build(), wheel.build());

  // Props
  const trunks = new InstanceBatch(geo.cyl(6));
  const leaves = new InstanceBatch(geo.sphere());
  const poles = new InstanceBatch(geo.cyl(6));
  const lampHeads = new InstanceBatch(geo.sphere(), { cast: false, receive: false });
  const wood = new InstanceBatch(box);
  for (const p of world.props) {
    if (p.kind === 'tree') {
      trunks.add(p.x, 1.1, p.z, 0.35, 2.2, 0.35, 0x8b5a2b);
      leaves.add(p.x, 3.0, p.z, 2.6, 2.2, 2.6, 0x55a630);
      leaves.add(p.x + 0.4, 3.7, p.z - 0.2, 1.6, 1.5, 1.6, 0x80b918);
    } else if (p.kind === 'lamp') {
      poles.add(p.x, 1.8, p.z, 0.18, 3.6, 0.18, 0x264d3b);
      poles.add(p.x, 3.65, p.z, 0.5, 0.15, 0.5, 0x264d3b);
      lampHeads.add(p.x, 3.4, p.z, 0.45, 0.5, 0.45, 0xfff3b0);
    } else if (p.kind === 'bench') {
      const alongX = Math.abs(p.z) > Math.abs(p.x);
      const [sx, sz] = alongX ? [2, 0.7] : [0.7, 2];
      wood.add(p.x, 0.45, p.z, sx, 0.12, sz, 0xa0673a);
      wood.add(p.x, 0.2, p.z, alongX ? 1.7 : 0.5, 0.4, alongX ? 0.5 : 1.7, 0x3a3a3a);
    } else if (p.kind === 'crate') {
      const h = p.h ?? 1;
      wood.add(p.x, (p.y ?? 0) + h / 2, p.z, (p.w ?? 1) - 0.02, h - 0.02, (p.d ?? 1) - 0.02, (p.y ?? 0) % 2 ? 0xc68b59 : 0xd9a66b);
    }
  }
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  root.add(trunks.build(), leaves.build(), poles.build(), lampHeads.build(lampMat), wood.build());

  // Fountain
  const f = world.fountain;
  const basinGeo = new THREE.CylinderGeometry(f.basinHalf * Math.SQRT2, f.basinHalf * Math.SQRT2 * 1.04, f.basinH, 4);
  basinGeo.rotateY(Math.PI / 4);
  const basin = new THREE.Mesh(basinGeo, mat(0xd6d0c4));
  basin.position.set(f.x, f.basinH / 2, f.z);
  basin.castShadow = basin.receiveShadow = true;
  const water = new THREE.Mesh(new THREE.BoxGeometry(f.basinHalf * 2 - 0.5, 0.05, f.basinHalf * 2 - 0.5), mat(0x4cc9f0));
  water.position.set(f.x, f.basinH + 0.005, f.z);
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(f.pillarHalf * 0.8, f.pillarHalf, f.pillarH, 8), mat(0xe8e2d4));
  pillar.position.set(f.x, f.pillarH / 2, f.z);
  pillar.castShadow = true;
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(f.pillarHalf * 1.4, f.pillarHalf * 0.7, 0.3, 8), mat(0xe8e2d4));
  bowl.position.set(f.x, f.pillarH - 0.15, f.z);
  root.add(basin, water, pillar, bowl);

  return { root, cameraBlockers };
}
