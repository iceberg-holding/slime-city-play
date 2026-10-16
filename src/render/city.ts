import { batchStatic } from './art/batch';
import { tree as studioTree, bench as studioBench, lamp as studioLamp } from './art/studio';
import * as THREE from 'three';
import type { Solid, World } from '../sim/types';
import { mansardBox } from '../sim/world';
import { Kit, blobMaterial, geo, lathe, waterMaterial } from './materials';

/** Rounded wedge rising toward +x, footprint centered on x/z, base at y=0. */
export function wedge(w: number, h: number, d: number, bevel = Math.min(w, h, d) * 0.08): THREE.BufferGeometry {
  const b = Math.min(bevel, w * 0.2, h * 0.2, d * 0.2);
  const shape = new THREE.Shape();
  // shrink the triangle by the bevel so the beveled result matches the footprint
  shape.moveTo(-w / 2 + b * 2.4, b);
  shape.lineTo(w / 2 - b, b);
  shape.lineTo(w / 2 - b, h - b * 2.4);
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 4 });
  g.translate(0, 0, -(d - 2 * b) / 2);
  return g;
}

/** rotation-y + size for a wedge so it fills `s` and rises toward s.ramp */
export function wedgeTransform(s: Solid): { x: number; y: number; z: number; w: number; h: number; d: number; ry: number } {
  const w = s.maxX - s.minX;
  const d = s.maxZ - s.minZ;
  const along = s.ramp === 0 || s.ramp === 2;
  const ry = s.ramp === 0 ? 0 : s.ramp === 2 ? Math.PI : s.ramp === 1 ? -Math.PI / 2 : Math.PI / 2;
  return { x: (s.minX + s.maxX) / 2, y: s.minY, z: (s.minZ + s.maxZ) / 2, w: along ? w : d, h: s.maxY - s.minY, d: along ? d : w, ry };
}

const AWNING = [0xff5d73, 0x2ec4b6, 0x4d96ff, 0xff9f1c, 0x9b5de5];
const SHUTTER = [0x2ec4b6, 0x4d96ff, 0xff7aa2, 0x8bc34a, 0xffb703, 0x9b5de5];
const STONE = 0xf6efe4;

export interface BlobSpot {
  x: number;
  z: number;
  sx: number;
  sz: number;
  y?: number;
}

/** Builds static city meshes. Also returns decoration boxes the camera should not pass through. */
export function buildCity(world: World): { root: THREE.Group; cameraBlockers: Solid[] } {
  const root = new THREE.Group();
  const cameraBlockers: Solid[] = [];
  const blobs: BlobSpot[] = [];

  // Ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), new THREE.MeshStandardMaterial({ color: 0xb4b6bd, roughness: 0.9 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  const flat = new Kit();
  // sidewalk ring in front of the buildings
  flat.add(geo.rbox(42, 0.08, 2.5, 0.04), 0xf3ece0, { p: [0, 0, -19.75], finish: 'matte' });
  flat.add(geo.rbox(42, 0.08, 2.5, 0.04), 0xf3ece0, { p: [0, 0, 19.75], finish: 'matte' });
  flat.add(geo.rbox(2.5, 0.08, 37, 0.04), 0xf3ece0, { p: [-19.75, 0, 0], finish: 'matte' });
  flat.add(geo.rbox(2.5, 0.08, 37, 0.04), 0xf3ece0, { p: [19.75, 0, 0], finish: 'matte' });
  // road dashes
  const dash = geo.rbox(1.4, 0.04, 0.2, 0.02, 1);
  for (let t = -14; t <= 14; t += 3) {
    flat.add(dash, 0xffffff, { p: [t, 0.01, -14.5], finish: 'matte' });
    flat.add(dash, 0xffffff, { p: [t, 0.01, 14.5], finish: 'matte' });
    flat.add(dash, 0xffffff, { p: [-14.5, 0.01, t], r: [0, Math.PI / 2, 0], finish: 'matte' });
    flat.add(dash, 0xffffff, { p: [14.5, 0.01, t], r: [0, Math.PI / 2, 0], finish: 'matte' });
  }
  // plaza
  flat.add(geo.cyl(world.plazaRadius, world.plazaRadius, 0.06, 72), 0xf7e3bd, { p: [0, 0.01, 0], finish: 'matte' });
  flat.add(geo.torus(world.plazaRadius - 0.25, 0.14, Math.PI * 2, 96), 0xe2c48f, { p: [0, 0.05, 0], r: [Math.PI / 2, 0, 0], finish: 'soft' });
  flat.add(geo.cyl(world.plazaRadius - 2.2, world.plazaRadius - 2.2, 0.07, 72), 0xfbecd0, { p: [0, 0.012, 0], finish: 'matte' });
  root.add(flat.build(true));

  // Buildings: split into quadrants so frustum culling (main + shadow pass) can skip what's off screen
  const quadKits = (ao: number) =>
    [0, 1, 2, 3].map(() => {
      const k = new Kit();
      k.groundAO = ao;
      return k;
    });
  const cityQ = quadKits(0.32);
  const decoQ = quadKits(0); // small facade details: no shadow casting
  let city = cityQ[0];
  let deco = decoQ[0];
  let seed = 1;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const coveredByRamp = (minX: number, minZ: number, maxX: number, maxZ: number) =>
    [...world.ramps, ...world.platforms].some((r) => r.minX < maxX + 0.3 && r.maxX > minX - 0.3 && r.minZ < maxZ + 0.3 && r.maxZ > minZ - 0.3);

  const winFrame = geo.rbox(1.2, 1.65, 0.14, 0.07, 1);
  const winGlass = geo.rbox(0.92, 1.36, 0.12, 0.06, 1);
  const unit = geo.box();
  const flower = new THREE.IcosahedronGeometry(0.11, 0);
  const FLOWERS = [0xff5d8f, 0xffd166, 0xffffff, 0xff8a5b, 0xc77dff];

  world.buildings.forEach((b, bi) => {
    const w = b.maxX - b.minX;
    const d = b.maxZ - b.minZ;
    const cx = (b.minX + b.maxX) / 2;
    const cz = (b.minZ + b.maxZ) / 2;
    const accent = SHUTTER[bi % SHUTTER.length];
    const q = (cx < 0 ? 0 : 1) + (cz < 0 ? 0 : 2);
    city = cityQ[q];
    deco = decoQ[q];
    city.add(geo.rbox(w, b.height, d, 0.35, 3), b.color, { p: [cx, b.height / 2, cz], finish: 'soft' });
    city.add(geo.rbox(w + 0.16, 0.55, d + 0.16, 0.2), shade(b.color, 0.86), { p: [cx, 0.27, cz], finish: 'soft' });
    city.add(geo.rbox(w + 0.4, 0.32, d + 0.4, 0.15), STONE, { p: [cx, b.height - 0.1, cz], finish: 'soft' });
    for (let y = 2.5; y < b.height - 1; y += 2.5) city.add(geo.rbox(w + 0.12, 0.14, d + 0.12, 0.06, 1), STONE, { p: [cx, y - 0.05, cz], finish: 'soft' });
    if (b.mansard) {
      const m = mansardBox(b);
      const mw = m.maxX - m.minX;
      const md = m.maxZ - m.minZ;
      const mh = m.maxY - m.minY;
      city.add(taperedRoof(mw + 0.3, mh, md + 0.3), 0x8095c4, { p: [(m.minX + m.maxX) / 2, m.minY + mh / 2, (m.minZ + m.maxZ) / 2], finish: 'gloss' });
      for (const x of [m.minX + 1, m.maxX - 1]) {
        city.add(geo.rbox(0.55, 1.1, 0.55, 0.12, 1), 0xf08a6c, { p: [x, m.maxY + 0.25, (m.minZ + m.maxZ) / 2], finish: 'soft' });
        city.add(geo.rbox(0.7, 0.16, 0.7, 0.07, 1), STONE, { p: [x, m.maxY + 0.82, (m.minZ + m.maxZ) / 2], finish: 'soft' });
      }
    }

    // facades: [axis along, fixed coord, outward normal sign]
    const faces: { alongX: boolean; fixed: number; n: number; from: number; to: number }[] = [
      { alongX: true, fixed: b.maxZ, n: 1, from: b.minX, to: b.maxX },
      { alongX: true, fixed: b.minZ, n: -1, from: b.minX, to: b.maxX },
      { alongX: false, fixed: b.maxX, n: 1, from: b.minZ, to: b.maxZ },
      { alongX: false, fixed: b.minX, n: -1, from: b.minZ, to: b.maxZ },
    ];
    for (const f of faces) {
      if (Math.abs(f.fixed) >= 32 - 0.01) continue; // outer wall nobody sees
      const len = f.to - f.from;
      const n = Math.max(1, Math.floor(len / 2.6));
      const spacing = len / n;
      const inward = Math.abs(f.fixed) < 22; // facing the street
      const ry = f.alongX ? (f.n > 0 ? 0 : Math.PI) : f.n > 0 ? Math.PI / 2 : -Math.PI / 2;
      const at = (along: number, out: number, y: number): [number, number, number] =>
        f.alongX ? [along, y, f.fixed + out * f.n] : [f.fixed + out * f.n, y, along];
      for (let i = 0; i < n; i++) {
        const t = f.from + spacing * (i + 0.5);
        if (t - 0.8 < f.from + 0.4 || t + 0.8 > f.to - 0.4) continue;
        // upper floors
        for (let y = 3.6; y + 0.9 < b.height - 0.3; y += 2.5) {
          deco.add(winFrame, 0xffffff, { p: at(t, 0.02, y), r: [0, ry, 0], cast: false });
          deco.add(winGlass, 0x2f5f9e, { p: at(t, 0.06, y), r: [0, ry, 0], finish: 'glass', cast: false });
          deco.add(unit, accent, { p: at(t - 0.82, 0.05, y), r: [0, ry, 0], s: [0.34, 1.5, 0.07], cast: false });
          deco.add(unit, accent, { p: at(t + 0.82, 0.05, y), r: [0, ry, 0], s: [0.34, 1.5, 0.07], cast: false });
          if (y < 6) deco.add(unit, 0x3b4a6b, { p: at(t, 0.3, y - 0.45), r: [0, ry, 0], s: [1.3, 0.08, 0.08], finish: 'metal', cast: false });
          // flower boxes on the first floor of street-facing windows
          if (y < 4 && inward && i % 2 === 0) {
            deco.add(unit, 0xb5523b, { p: at(t, 0.2, y - 0.92), r: [0, ry, 0], s: [1.1, 0.26, 0.3], cast: false });
            for (const f of [-1, 1]) deco.add(flower, FLOWERS[(bi + f + 1) % FLOWERS.length], { p: at(t + f * 0.25, 0.22, y - 0.72), r: [0, ry, 0], s: [1.6, 1, 1], cast: false });
          }
        }
        if (inward && b.height >= 3) {
          const aw = spacing * 0.85;
          const [ax, , az] = at(t, 0.5, 0);
          const [hx, hz] = f.alongX ? [aw / 2, 0.5] : [0.5, aw / 2];
          if (coveredByRamp(ax - hx, az - hz, ax + hx, az + hz)) continue;
          deco.add(geo.rbox(spacing * 0.72, 1.45, 0.12, 0.06, 1), 0x9fdcf5, { p: at(t, 0.04, 1.05), r: [0, ry, 0], finish: 'glass', cast: false });
          deco.add(geo.rbox(spacing * 0.78, 1.6, 0.1, 0.05, 1), 0xffffff, { p: at(t, 0.01, 1.05), r: [0, ry, 0], cast: false });
          cameraBlockers.push({ minX: ax - hx, minY: 1.7, minZ: az - hz, maxX: ax + hx, maxY: 2.35, maxZ: az + hz });
          const col = AWNING[Math.floor(rnd() * AWNING.length)];
          city.add(geo.rbox(aw, 0.12, 1.0, 0.06, 1), col, { p: at(t, 0.48, 2.05), r: [0.38, ry, 0], finish: 'soft' });
          city.add(geo.rbox(aw + 0.04, 0.14, 0.14, 0.07, 1), 0xffffff, { p: at(t, 0.98, 1.92), r: [0, ry, 0], finish: 'soft' });
        }
      }
    }
  });
  for (const k of [...cityQ, ...decoQ]) root.add(k.build(true));

  // World ramps + landings
  const ramps = new Kit();
  ramps.groundAO = 0.25;
  for (const r of world.ramps) {
    const t = wedgeTransform(r);
    ramps.add(wedge(t.w, t.h, t.d, 0.12), 0xf1d9b5, { p: [t.x, t.y, t.z], r: [0, t.ry, 0], finish: 'soft' });
  }
  for (const p of world.platforms) {
    ramps.add(geo.rbox(p.maxX - p.minX, p.maxY - p.minY, p.maxZ - p.minZ, 0.12), 0xe8cba0, {
      p: [(p.minX + p.maxX) / 2, (p.minY + p.maxY) / 2, (p.minZ + p.maxZ) / 2],
      finish: 'soft',
    });
  }
  root.add(ramps.build(true));

  // Cars
  const cars = new Kit();
  for (const c of world.cars) {
    const ry = c.alongX ? Math.PI / 2 : 0;
    const local = (x: number, y: number, z: number): [number, number, number] => (c.alongX ? [c.x + z, y, c.z - x] : [c.x + x, y, c.z + z]);
    cars.add(geo.rbox(1.9, 0.75, 4, 0.32), c.color, { p: local(0, 0.72, 0), r: [0, ry, 0], finish: 'gloss' });
    cars.add(geo.rbox(1.7, 0.7, 2.2, 0.34), c.color, { p: local(0, 1.38, 0.1), r: [0, ry, 0], finish: 'gloss' });
    cars.add(geo.rbox(1.74, 0.44, 2.0, 0.2), 0x29466e, { p: local(0, 1.36, 0.1), r: [0, ry, 0], finish: 'glass', cast: false });
    cars.add(geo.rbox(1.95, 0.18, 4.05, 0.08), 0xf2f2f2, { p: local(0, 0.42, 0), r: [0, ry, 0], finish: 'soft' });
    for (const s of [-0.62, 0.62]) {
      cars.add(geo.sphere(0.13, 16, 12), 0xfff6c2, { p: local(s, 0.82, -1.97), s: [1, 1, 0.5], finish: 'glow', cast: false });
      cars.add(geo.sphere(0.11, 16, 12), 0xff4d4d, { p: local(s, 0.82, 1.98), s: [1, 1, 0.5], finish: 'glow', cast: false });
    }
    for (const a of [-1.3, 1.3]) {
      for (const s of [-0.88, 0.88]) {
        const rot: [number, number, number] = c.alongX ? [0, 0, 0] : [0, Math.PI / 2, 0];
        cars.add(geo.torus(0.27, 0.12, Math.PI * 2, 18), 0x2b2d3a, { p: local(s, 0.38, a), r: rot, finish: 'rubber' });
        cars.add(geo.cyl(0.2, 0.2, 0.1, 20), 0xdfe6ee, { p: local(s * 1.04, 0.38, a), r: c.alongX ? [Math.PI / 2, 0, 0] : [0, 0, Math.PI / 2], finish: 'metal' });
      }
    }
    blobs.push(c.alongX ? { x: c.x, z: c.z, sx: 5.2, sz: 2.9 } : { x: c.x, z: c.z, sx: 2.9, sz: 5.2 });
  }
  root.add(cars.build(true));

  // Props
  const props = new Kit();
  props.groundAO = 0.2;
  for (const p of world.props) {
    if (p.kind !== 'crate') {
      const model = p.kind === 'tree' ? studioTree(0.85) : p.kind === 'bench' ? studioBench() : studioLamp();
      model.position.set(p.x, 0, p.z);
      if (p.kind === 'bench' && Math.abs(p.x) > Math.abs(p.z)) model.rotation.y = Math.PI / 2;
      // keep the camera out of leafy crowns
      if (p.kind === 'tree') cameraBlockers.push({ minX: p.x - 1, minY: 1.9, minZ: p.z - 1, maxX: p.x + 1, maxY: 3.6, maxZ: p.z + 1 });
      root.add(batchStatic(model));
      continue;
    }
    {
      const h = p.h ?? 1;
      const y = (p.y ?? 0) + h / 2;
      props.add(geo.rbox((p.w ?? 1) - 0.04, h - 0.04, (p.d ?? 1) - 0.04, 0.1), (p.y ?? 0) % 2 ? 0xe2a66b : 0xf0bd83, { p: [p.x, y, p.z], finish: 'soft' });
      if (!p.y) blobs.push({ x: p.x, z: p.z, sx: (p.w ?? 1) + 0.8, sz: (p.d ?? 1) + 0.8 });
    }
  }
  root.add(props.build(true));

  // Fountain
  const f = world.fountain!;
  const fk = new Kit();
  fk.groundAO = 0.25;
  fk.add(geo.rbox(f.stepHalf * 2, f.stepH, f.stepHalf * 2, 0.12), 0xeee3d0, { p: [f.x, f.stepH / 2, f.z], finish: 'soft' });
  fk.add(geo.rbox(f.basinHalf * 2, f.basinH, f.basinHalf * 2, 0.3), STONE, { p: [f.x, f.basinH / 2, f.z], finish: 'soft' });
  fk.add(
    lathe([
      [0.001, 0],
      [f.pillarHalf, 0],
      [f.pillarHalf * 0.95, 0.15],
      [f.pillarHalf * 0.55, 0.4],
      [f.pillarHalf * 0.45, 1.2],
      [f.pillarHalf * 0.55, 1.55],
      [f.pillarHalf * 1.3, 1.75],
      [f.pillarHalf * 1.45, 1.92],
      [f.pillarHalf * 1.2, f.pillarH],
      [0.001, f.pillarH],
    ]),
    STONE,
    { p: [f.x, 0, f.z], finish: 'soft' },
  );
  fk.add(geo.cyl(f.pillarHalf * 1.15, f.pillarHalf * 1.15, 0.05, 40), 0x5cc8ff, { p: [f.x, f.pillarH - 0.02, f.z], finish: 'glass', cast: false });
  fk.add(geo.sphere(0.22), 0xffd166, { p: [f.x, f.pillarH + 0.25, f.z], finish: 'gloss' });
  root.add(fk.build(true));
  const basin = new THREE.Mesh(geo.rbox(f.basinHalf * 2 - 0.5, 0.08, f.basinHalf * 2 - 0.5, 0.04), waterMaterial(0x3cc0e8, { scale: 3, sparkle: 0.6 }));
  basin.position.set(f.x, f.basinH - 0.02, f.z);
  basin.receiveShadow = true;
  root.add(basin);
  // soft translucent water dome over the top bowl
  const spray = new THREE.Mesh(
    geo.sphere(0.9, 32, 16),
    new THREE.MeshPhysicalMaterial({ color: 0xbfeaff, roughness: 0.05, transparent: true, opacity: 0.35, depthWrite: false, clearcoat: 1 }),
  );
  spray.scale.set(1, 0.5, 1);
  spray.position.set(f.x, f.pillarH, f.z);
  spray.name = 'spray';
  root.add(spray);

  root.add(buildBlobs(blobs));
  return { root, cameraBlockers };
}

function shade(c: number, k: number): number {
  const col = new THREE.Color(c).multiplyScalar(k);
  return col.getHex();
}

/** A rounded box whose upper part tapers in (Paris mansard look). */
function taperedRoof(w: number, h: number, d: number): THREE.BufferGeometry {
  const g = geo.rbox(w, h, d, 0.3).clone();
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) + h / 2) / h;
    const k = 1 - 0.22 * t * t;
    pos.setX(i, pos.getX(i) * k);
    pos.setZ(i, pos.getZ(i) * k);
  }
  return g;
}

/** Contact shadows under static props, merged into one transparent mesh. */
export function buildBlobs(spots: BlobSpot[]): THREE.Mesh {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  spots.forEach((s, i) => {
    const y = s.y ?? 0.06;
    const hx = s.sx / 2;
    const hz = s.sz / 2;
    pos.push(s.x - hx, y, s.z - hz, s.x + hx, y, s.z - hz, s.x + hx, y, s.z + hz, s.x - hx, y, s.z + hz);
    uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    const o = i * 4;
    idx.push(o, o + 2, o + 1, o, o + 3, o + 2);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  const m = new THREE.Mesh(g, blobMaterial());
  m.renderOrder = 1;
  return m;
}
