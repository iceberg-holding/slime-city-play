import * as THREE from 'three';
import { Kit, geo, waterMaterial } from './materials';
import { addHouse, addTree } from './oldtown';
import { buildEntrance } from './raceRoad';
import { courseAt, courseHeightAt, courseNear } from '../sim/track';
import { FLIGHT_SECTIONS, flightScenery } from '../sim/flight';
import type { RaceDef } from '../sim/levels';

// Level 3 flight course over the old town: rooftops, two parks, an aqueduct, a cathedral tower. Statics are merged
// into ~70 m chunks by course progress (the view culls distant chunks); guide chevrons and corridor balloons are two
// course-wide InstancedMeshes.

const CHUNK = 70;
const STONE = 0xf1e0bf;
const STONE_DARK = 0xd9c39a;
const COPPER = 0x5fb59a;
const GOLD = 0xffc93c;

export function buildAirCourse(race: RaceDef) {
  const course = race.course, sc = flightScenery(course), L = course.length;
  const root = new THREE.Group();
  const n = Math.ceil(L / CHUNK);
  const kits = Array.from({ length: n }, () => { const k = new Kit(); k.groundAO = 0.2; return k; });
  const decos = Array.from({ length: n }, () => new Kit());
  const at = (d: number) => Math.max(0, Math.min(n - 1, Math.floor(d / CHUNK)));

  // Cobbled ground under the whole quarter; grass bands through the parks, a river under the aqueduct.
  const xs = course.points.map((p) => p.x), zs = course.points.map((p) => p.z);
  const gw = Math.max(...xs) - Math.min(...xs) + 120, gd = Math.max(...zs) - Math.min(...zs) + 120;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(gw, gd).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xd3c2a4, roughness: 0.95 }));
  ground.position.set((Math.max(...xs) + Math.min(...xs)) / 2, -0.01, (Math.max(...zs) + Math.min(...zs)) / 2);
  ground.receiveShadow = true;
  ground.name = 'flight-ground';
  root.add(ground);
  for (const [a, b] of FLIGHT_SECTIONS.parks) {
    for (let d = a; d < b; d += 8) {
      const p = courseAt(course, d);
      kits[at(d)].add(geo.box(), 0x7cc35e, { p: [p.x, 0.01, p.z], r: [0, p.yaw, 0], s: [62, 0.02, 9], finish: 'matte', cast: false });
    }
  }
  const archP = courseAt(course, FLIGHT_SECTIONS.arch);
  {
    const k = kits[at(FLIGHT_SECTIONS.arch)];
    for (let d = FLIGHT_SECTIONS.arch - 40; d < FLIGHT_SECTIONS.arch + 45; d += 6) {
      const p = courseAt(course, d);
      k.add(geo.box(), 0xe9d7a8, { p: [p.x, 0.02, p.z], r: [0, p.yaw, 0], s: [14, 0.02, 6.2], finish: 'matte', cast: false });
    }
    const river = new THREE.Mesh(new THREE.PlaneGeometry(9, 92).rotateX(-Math.PI / 2), waterMaterial(0x2f9fd0, { scale: 1.4, sparkle: 0.6 }));
    river.rotation.y = archP.yaw;
    river.position.set(archP.x, 0.05, archP.z);
    river.receiveShadow = true;
    river.userData.center = { x: archP.x, z: archP.z };
    root.add(river);
  }

  // Houses face the route; trees, chimneys.
  sc.houses.forEach((h, i) => {
    const cx = (h.minX + h.maxX) / 2, cz = (h.minZ + h.maxZ) / 2, near = courseNear(course, cx, cz);
    const vx = near.x - cx, vz = near.z - cz;
    const face = Math.abs(vx) > Math.abs(vz) ? (vx > 0 ? 0 : 2) : vz > 0 ? 1 : 3;
    addHouse(kits[at(h.d)], decos[at(h.d)], h, face, i + 3);
  });
  sc.trees.forEach((t, i) => addTree(kits[at(t.d)], t.x, t.z, i, t.s * 1.25));
  for (const c of sc.chimneys) {
    const k = kits[at(c.d)], w = c.maxX - c.minX;
    k.add(geo.rbox(w, c.maxY - c.minY, w, 0.08), 0xe8b4a0, { p: [(c.minX + c.maxX) / 2, (c.minY + c.maxY) / 2, (c.minZ + c.maxZ) / 2] });
    k.add(geo.rbox(w + 0.2, 0.18, w + 0.2, 0.06), 0xfffaf0, { p: [(c.minX + c.maxX) / 2, c.maxY + 0.09, (c.minZ + c.maxZ) / 2] });
  }

  // Aqueduct: stone piers, an arched deck you can fly under (low ring) or over.
  {
    const k = kits[at(sc.arch.d)], D = sc.arch.deck;
    for (const p of sc.arch.piers) k.add(geo.rbox(p.maxX - p.minX, p.maxY, p.maxZ - p.minZ, 0.12), STONE, { p: [(p.minX + p.maxX) / 2, p.maxY / 2, (p.minZ + p.maxZ) / 2] });
    k.add(geo.rbox(D.maxX - D.minX, D.maxY - D.minY, D.maxZ - D.minZ, 0.12), STONE_DARK, { p: [(D.minX + D.maxX) / 2, (D.minY + D.maxY) / 2, (D.minZ + D.maxZ) / 2] });
    const along = D.maxX - D.minX > D.maxZ - D.minZ;
    k.add(geo.torus(5.6, 0.45, Math.PI, 32), STONE, { p: [archP.x, 0.6, archP.z], r: [0, along ? 0 : Math.PI / 2, 0] });
    for (const s of [-1, 1]) for (let o = -9; o <= 9; o += 1.5) {
      const x = along ? archP.x + o : archP.x + s * 1.5, z = along ? archP.z + s * 1.5 : archP.z + o;
      k.add(geo.rbox(0.5, 0.7, 0.5, 0.08), 0xfffaf0, { p: [along ? x : (s > 0 ? D.maxX : D.minX), D.maxY + 0.35, along ? (s > 0 ? D.maxZ : D.minZ) : z] });
    }
    for (const [x, z] of [[-5, -3], [5, 3], [-6, 4]]) k.add(geo.sphere(0.6, 10, 8), 0x58b85a, { p: [archP.x + x * 0.4, D.maxY + 0.4, archP.z + z * 0.4], s: [1.4, 0.6, 1] });
  }

  // Cathedral bell tower beside the route: stone shaft, clock, belfry arches, copper spire.
  {
    const C = sc.cathedral, k = kits[at(C.d)], cx = (C.minX + C.maxX) / 2, cz = (C.minZ + C.maxZ) / 2, w = C.maxX - C.minX;
    k.add(geo.rbox(w, C.maxY, w, 0.15), STONE, { p: [cx, C.maxY / 2, cz] });
    for (let y = 4; y < C.maxY; y += 5) k.add(geo.rbox(w + 0.3, 0.35, w + 0.3, 0.08), STONE_DARK, { p: [cx, y, cz] });
    for (const [dx, dz, ry] of [[0, 1, 0], [0, -1, Math.PI], [1, 0, Math.PI / 2], [-1, 0, -Math.PI / 2]] as const) {
      k.add(geo.cyl(1.4, 1.4, 0.12, 32), 0xfffaf0, { p: [cx + dx * (w / 2 + 0.05), C.maxY - 5, cz + dz * (w / 2 + 0.05)], r: [Math.PI / 2, ry, 0], finish: 'gloss' });
      k.add(geo.torus(1.4, 0.1, Math.PI * 2, 32), GOLD, { p: [cx + dx * (w / 2 + 0.1), C.maxY - 5, cz + dz * (w / 2 + 0.1)], r: [0, ry, 0], finish: 'metal' });
      k.add(geo.rbox(1.2, 2.4, 0.2, 0.3), 0x3a3f55, { p: [cx + dx * (w / 2 + 0.02), C.maxY - 1.8, cz + dz * (w / 2 + 0.02)], r: [0, ry, 0], finish: 'gloss', cast: false });
    }
    k.add(new THREE.ConeGeometry(w * 0.75, 9, 4, 1), COPPER, { p: [cx, C.maxY + 4.5, cz], r: [0, Math.PI / 4, 0], finish: 'gloss' });
    k.add(geo.sphere(0.4, 12, 8), GOLD, { p: [cx, C.maxY + 9.2, cz], finish: 'metal' });
    // the nave behind it, under the canyon houses' height
    k.add(geo.rbox(12, 9, 8, 0.2), 0xfbe3b4, { p: [cx + (C.minX > courseAt(course, C.d).x ? 7 : -7), 4.5, cz] });
  }

  // Start and finish arches (decorative, high above the route's guide altitude).
  for (const [d, color] of [[0, 0x57ff83], [L, 0xff5d73]] as const) {
    const p = courseAt(course, d), k = kits[at(d)], y = courseHeightAt(course, d);
    for (const s of [-1, 1]) k.add(geo.rbox(0.8, y + 6, 0.8, 0.15), STONE, { p: [p.x - p.dz * s * 9.5, (y + 6) / 2, p.z + p.dx * s * 9.5] });
    k.add(geo.rbox(19.8, 1.1, 0.4, 0.12), color, { p: [p.x, y + 5.8, p.z], r: [0, p.yaw, 0], finish: 'gloss' });
    for (let i = 0; i < 12; i++) for (let j = 0; j < 2; j++) decos[at(d)].add(geo.box(), (i + j) % 2 ? 0xffffff : 0x263046, { p: [p.x - p.dz * (-5.5 + i) + p.dx * j * 0.55, y + 5.3 + j * 0.0, p.z + p.dx * (-5.5 + i) + p.dz * j * 0.55], r: [0, p.yaw, 0], s: [0.98, 0.04, 0.5], cast: false });
    k.add(geo.cyl(6, 6, 0.06, 40), 0xe3d3b5, { p: [p.x, 0.02, p.z], finish: 'matte', cast: false });
  }

  for (let i = 0; i < n; i++) {
    const chunk = new THREE.Group();
    chunk.add(kits[i].build(true), decos[i].build(true));
    const mid = courseAt(course, Math.min(L, (i + 0.5) * CHUNK));
    chunk.userData.center = { x: mid.x, z: mid.z };
    chunk.name = 'flight-chunk';
    root.add(chunk);
  }
  root.add(buildChevrons(race), buildCorridor(race));
  return { root, ...buildEntrance(race, 'oldtown') };
}

/** Glowing chevrons every 12 m along the guide line, pointing the way (one InstancedMesh). */
function buildChevrons(race: RaceDef): THREE.InstancedMesh {
  const course = race.course, shape = new THREE.Shape();
  shape.moveTo(-1.1, 0); shape.lineTo(0, 0.85); shape.lineTo(1.1, 0); shape.lineTo(1.1, -0.45); shape.lineTo(0, 0.4); shape.lineTo(-1.1, -0.45); shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false }).rotateX(-Math.PI / 2);
  const spots: number[] = [];
  const rings = course.air!.rings;
  for (let d = 8; d < course.length - 6; d += 12) if (!rings.some((r) => Math.abs(r - d) < 5)) spots.push(d);
  const m = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ color: 0x9dffd0, transparent: true, opacity: 0.85, depthWrite: false, fog: false, side: THREE.DoubleSide }), spots.length);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), V = new THREE.Vector3(), S = new THREE.Vector3(1, 1, 1);
  spots.forEach((d, i) => {
    const p = courseAt(course, d), y = courseHeightAt(course, d) + 0.6, ahead = courseHeightAt(course, d + 3) + 0.6;
    // chevron shape points along local -z after the rotation above: yaw it along the route, pitch with the climb
    Q.setFromEuler(E.set(Math.atan2(ahead - y, 3), p.yaw, 0, 'YXZ'));
    M.compose(V.set(p.x, y, p.z), Q, S);
    m.setMatrixAt(i, M);
  });
  m.name = 'flight-chevrons';
  m.frustumCulled = false;
  m.renderOrder = 2;
  return m;
}

/** Bobbing balloons marking the corridor edges every 24 m (one InstancedMesh). */
function buildCorridor(race: RaceDef): THREE.InstancedMesh {
  const course = race.course, edge = course.rail + 0.4, colors = [0xff5d73, 0xffd166, 0x4dc9ff, 0xb388eb];
  const spots: [number, number][] = [];
  for (let d = 12; d < course.length - 6; d += 24) for (const s of [-1, 1]) spots.push([d, s]);
  const g = new THREE.SphereGeometry(0.45, 12, 10);
  const m = new THREE.InstancedMesh(g, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, emissive: 0x222222 }), spots.length);
  const M = new THREE.Matrix4(), C = new THREE.Color();
  spots.forEach(([d, s], i) => {
    const p = courseAt(course, d), y = courseHeightAt(course, d) + 1;
    M.makeScale(1, 1.2, 1).setPosition(p.x - p.dz * s * edge, y, p.z + p.dx * s * edge);
    m.setMatrixAt(i, M);
    m.setColorAt(i, C.set(colors[i % colors.length]));
  });
  m.name = 'flight-corridor';
  m.frustumCulled = false;
  return m;
}

