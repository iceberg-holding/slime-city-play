import * as THREE from 'three';
import { Kit, geo, waterMaterial } from './materials';
import { wedge } from './city';
import { courseAt, COURSE2_SECTIONS } from '../sim/track';
import type { RaceDef } from '../sim/levels';

export type RoadTheme = 'city' | 'harbor' | 'oldtown';

export function buildRaceRoad(race: RaceDef, theme: RoadTheme) {
  const course = race.course, TRACK = course.points, TRACK_LENGTH = course.length;
  const trackAt = (d: number) => courseAt(course, d);
  const { jumps: JUMPS, gap: GAP, rampHeight: RAMP_HEIGHT, rampLength: RAMP_LENGTH } = course;
  const harbor = theme === 'harbor';
  const [boardFrom, boardTo] = COURSE2_SECTIONS.boardwalk;
  const onBoardwalk = (d: number) => harbor && d >= boardFrom && d < boardTo;
  // Shared mitered edges: chunks and bends meet at identical vertices without overlapping faces.
  const distances = [0];
for (let i = 1; i < TRACK.length; i++) distances.push(distances[i - 1] + Math.hypot(TRACK[i].x - TRACK[i - 1].x, TRACK[i].z - TRACK[i - 1].z));
const edges = TRACK.map((_, i) => {
  const a = trackAt(Math.max(0, distances[i] - 0.001)), b = trackAt(distances[i] + 0.001);
  const nx = -a.dz - b.dz, nz = a.dx + b.dx;
  const scale = 1 / (nx * -b.dz + nz * b.dx);
  return { x: nx * scale, z: nz * scale };
});
  function roadPoint(d: number, lane: number) {
  let i = 0;
  while (i < TRACK.length - 2 && d > distances[i + 1]) i++;
  const t = (d - distances[i]) / (distances[i + 1] - distances[i]);
  return [TRACK[i].x + (TRACK[i + 1].x - TRACK[i].x) * t + lane * (edges[i].x + (edges[i + 1].x - edges[i].x) * t),
    0.015, TRACK[i].z + (TRACK[i + 1].z - TRACK[i].z) * t + lane * (edges[i].z + (edges[i + 1].z - edges[i].z) * t)];
}

  const root = new THREE.Group();
  const RAIL = harbor ? 0xf4f7fb : 0xf6cc69;
  if (harbor) {
    // One sea plane under the whole coast; the road reads as a causeway.
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(700, 700).rotateX(-Math.PI / 2), waterMaterial(0x1fa8c4));
    sea.position.set(160, -0.3, -170); sea.name = 'race-sea'; sea.receiveShadow = true;
    root.add(sea);
  }
  for (let start = 0; start < TRACK_LENGTH; start += 70) {
    const k = new Kit(), end = Math.min(start + 70, TRACK_LENGTH);
    const gapCuts = GAP ? [GAP.start, GAP.end] : [];
    const cuts = [start, ...distances.filter(d => d > start && d < end), ...gapCuts.filter(d => d > start && d < end), end].sort((a, b) => a - b);
    const surfaces = new Map<number, number[]>();
    for (let i = 1; i < cuts.length; i++) {
      const a = cuts[i - 1], b = cuts[i], left = GAP && a >= GAP.start && a < GAP.end ? 0 : -7;
      const al = roadPoint(a, left), ar = roadPoint(a, 7), bl = roadPoint(b, left), br = roadPoint(b, 7);
      const color = onBoardwalk(a) ? 0xb4794b : harbor ? 0x5d6a7a : 0x596b80;
      if (!surfaces.has(color)) surfaces.set(color, []);
      surfaces.get(color)!.push(...al, ...ar, ...bl, ...ar, ...br, ...bl);
      if (harbor && !onBoardwalk(a)) {
        // stone causeway skirt down to the water on both sides
        for (const side of [-7, 7]) {
          const p0 = roadPoint(a, side), p1 = roadPoint(b, side);
          surfaces.set(0xc9c2b4, [...(surfaces.get(0xc9c2b4) ?? []), p0[0], -0.35, p0[2], p1[0], -0.35, p1[2], p0[0], 0.01, p0[2], p1[0], -0.35, p1[2], p1[0], 0.01, p1[2], p0[0], 0.01, p0[2]]);
        }
      }
    }
    for (const [color, vertices] of surfaces) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); g.computeVertexNormals();
      k.add(g, color, { cast: false, finish: color === 0xb4794b ? 'soft' : 'matte' }); g.dispose();
    }
    for (let d = start; d < end; d += 2) {
      const p = trackAt(d + 1), length = Math.min(2.1, end - d + 0.1), board = onBoardwalk(d);
      if (board) {
        // plank seams, low wooden rail with posts
        k.add(new THREE.BoxGeometry(14, 0.02, 0.06), 0x8a5a38, { p: [p.x, 0.03, p.z], r: [0, p.yaw, 0], cast: false });
        for (const side of [-1, 1]) {
          k.add(new THREE.BoxGeometry(0.2, 0.2, length), 0xfffaf0, { p: [p.x - p.dz * side * 6.8, 1, p.z + p.dx * side * 6.8], r: [0, p.yaw, 0] });
          k.add(new THREE.BoxGeometry(0.22, 1, 0.22), 0x8a5a38, { p: [p.x - p.dz * side * 6.8, 0.5, p.z + p.dx * side * 6.8], r: [0, p.yaw, 0] });
        }
      } else {
        for (const side of [-1, 1]) k.add(new THREE.BoxGeometry(0.35, 1.1, length), RAIL, { p: [p.x - p.dz * side * 6.8, 0.55, p.z + p.dx * side * 6.8], r: [0, p.yaw, 0] });
        if (harbor && d % 4 < 2) for (const side of [-1, 1]) k.add(new THREE.BoxGeometry(0.37, 0.25, 2.12), 0x2f6fb5, { p: [p.x - p.dz * side * 6.8, 0.85, p.z + p.dx * side * 6.8], r: [0, p.yaw, 0], cast: false });
        if (d % 8 < 2) k.add(new THREE.BoxGeometry(0.15, 0.025, 2), 0xffffff, { p: [p.x, 0.065, p.z], r: [0, p.yaw, 0] });
      }
    }
    // Round off polyline joins so the outside of each bend has continuous pavement.
    let progress = 0;
    for (let i = 1; i < TRACK.length - 1; i++) {
      progress += Math.hypot(TRACK[i].x - TRACK[i - 1].x, TRACK[i].z - TRACK[i - 1].z);
      if (progress < start || progress >= end) continue;
      const node = TRACK[i], a = trackAt(progress - 0.1), b = trackAt(progress + 0.1);
      for (const side of [-1, 1]) {
        const ax = node.x - a.dz * side * 6.8, az = node.z + a.dx * side * 6.8;
        const bx = node.x - b.dz * side * 6.8, bz = node.z + b.dx * side * 6.8;
        k.add(new THREE.BoxGeometry(0.4, 1.1, Math.hypot(bx - ax, bz - az) + 0.4), RAIL,
          { p: [(ax + bx) / 2, 0.55, (az + bz) / 2], r: [0, Math.atan2(bx - ax, bz - az), 0] });
      }
    }
    for (let d = start + 8; d < end; d += 14) {
      const p = trackAt(d);
      if (harbor) { harborScenery(k, d, p); continue; }
      const section = Math.floor(start / 140) % 4; // park, boardwalk, viaduct, market, then round again
      for (const side of [-1, 1]) {
        const x = p.x - p.dz * side * 11, z = p.z + p.dx * side * 11;
        if (section === 0) {
          k.add(geo.cyl(0.3, 0.45, 3), 0x967254, { p: [x, 1.5, z] });
          k.add(new THREE.IcosahedronGeometry(2.6, 1), 0x74bd8d, { p: [x, 4, z] });
          k.add(new THREE.BoxGeometry(3, 0.4, 0.8), 0xe2b980, { p: [x, 0.7, z + 4] });
        } else if (section === 1) {
          k.add(new THREE.BoxGeometry(9, 0.12, 14), 0x49bfc9, { p: [x + side * 4, -0.25, z] });
          for (let n = 0; n < 5; n++) k.add(new THREE.BoxGeometry(3, 0.14, 0.7), 0xd8b98b, { p: [x, 0, z + n] });
          k.add(geo.cyl(0.12, 0.12, 3), 0xfaf1d5, { p: [x, 1.5, z] });
        } else if (section === 2) {
          k.add(new THREE.BoxGeometry(1, 7.5, 1), 0xabb8d1, { p: [x - side * 3, 3.75, z] });
        } else {
          k.add(new THREE.BoxGeometry(3.5, 1.5, 2.5), 0xdfae7d, { p: [x, 0.75, z] });
          k.add(new THREE.BoxGeometry(4.2, 0.3, 3), side > 0 ? 0xf38a9c : 0x79c9ba, { p: [x, 2.8, z] });
          for (let n = -1; n <= 1; n++) k.add(new THREE.IcosahedronGeometry(0.35, 0), 0xf3ce62, { p: [x + n, 1.7, z] });
        }
      }
      if (section === 2) k.add(new THREE.BoxGeometry(17, 0.35, 1), 0xabb8d1, { p: [p.x, 7.5, p.z], r: [0, p.yaw, 0] });
    }
    const bulbs: THREE.Vector3[] = [];
    for (const d of JUMPS.filter(d => d >= start && d < end)) {
      const p = trackAt(d + RAMP_LENGTH / 2), optional = d === course.optionalJump, lane = optional ? -3.5 : 0;
      k.add(wedge(RAMP_LENGTH, RAMP_HEIGHT, optional ? 5 : 10, 0), harbor ? 0x4dc9ff : 0xffae50, { p: [p.x - p.dz * lane, 0, p.z + p.dx * lane], r: [0, Math.PI / 2 + p.yaw, 0] });
      for (const side of [-1, 1]) {
        const points: THREE.Vector3[] = [];
        for (let i = 0; i <= 24; i++) {
          const t = i / 24, q = trackAt(d + t * RAMP_LENGTH);
          const offset = lane + side * (optional ? 2.5 : 5);
          const y = t * RAMP_HEIGHT + 1.8 + 0.55 * (Math.cosh(2 * t - 1) - 1);
          const point = new THREE.Vector3(q.x - q.dz * offset, y, q.z + q.dx * offset);
          points.push(point); if (i % 2 === 0) bulbs.push(point);
        }
        k.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 24, 0.025, 3, false), 0x675447, { cast: false });
      }
    }
    const chunk = k.build();
    if (bulbs.length) {
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.3, roughness: 0.35 });
      const lights = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 6, 4), material, bulbs.length);
      const colors = [0xffc875, 0xff8279, 0xffe6a0, 0xa8e4b5];
      bulbs.forEach((p, i) => { lights.setMatrixAt(i, new THREE.Matrix4().makeTranslation(p.x, p.y, p.z)); lights.setColorAt(i, new THREE.Color(colors[i % colors.length])); });
      lights.name = 'ramp-string-lights'; chunk.add(lights);
    }
    const mid = trackAt((start + end) / 2);
    chunk.userData.center = { x: mid.x, z: mid.z };
    root.add(chunk);
  }
  if (harbor) {
    // Lighthouse island the final loop rides round.
    const L = COURSE2_SECTIONS.lighthouse, isle = new Kit();
    isle.add(geo.cyl(20, 22, 0.6, 40), 0xe9d39c, { p: [L.x, -0.25, L.z], cast: false });
    isle.add(geo.cyl(13, 16, 1.2, 32), 0x8cbf5a, { p: [L.x, 0, L.z], cast: false });
    for (let a = 0; a < 9; a++) isle.add(geo.sphere(1.6, 10, 8), 0x9c9587, { p: [L.x + Math.cos(a * 0.7) * 17, 0, L.z + Math.sin(a * 0.7) * 17], s: [1.3, 0.7, 1] });
    for (let b = 0; b < 8; b++) isle.add(geo.cyl(2.6 - b * 0.12, 2.7 - b * 0.12, 2.6, 24), b % 2 ? 0xe63946 : 0xfffaf0, { p: [L.x, 1.3 + b * 2.6, L.z], finish: 'gloss' });
    isle.add(geo.cyl(1.4, 1.4, 1.8, 16), 0xfff4c2, { p: [L.x, 22.6, L.z], finish: 'glow' });
    isle.add(geo.cone(2.2, 2, 20), 0xe63946, { p: [L.x, 24.5, L.z], finish: 'gloss' });
    isle.add(geo.cyl(2.4, 2.4, 0.3, 24), 0x23406e, { p: [L.x, 21.6, L.z] });
    const island = isle.build(); island.userData.center = { x: L.x, z: L.z }; root.add(island);
  }
  const finish = new Kit(), p = trackAt(TRACK_LENGTH);
  for (let i = 0; i < 14; i++) for (let j = 0; j < 2; j++) finish.add(new THREE.BoxGeometry(1, 0.03, 1), (i + j) % 2 ? 0xffffff : 0x263046, { p: [p.x - p.dz * (-6.5 + i) + p.dx * j, 0.04, p.z + p.dx * (-6.5 + i) + p.dz * j], r: [0, p.yaw, 0] });
  for (const x of [-6.5, 6.5]) finish.add(geo.cyl(0.18, 0.18, 6), 0xff5d73, { p: [p.x - p.dz * x, 3, p.z + p.dx * x] });
  finish.add(new THREE.BoxGeometry(13.5, 1, 0.3), 0xff5d73, { p: [p.x, 5.5, p.z], r: [0, p.yaw, 0] });
  const arch = finish.build(); arch.userData.center = { x: p.x, z: p.z }; root.add(arch);
  const G = race.gate, gz = (G.minZ + G.maxZ) / 2, gw = G.maxX - G.minX, gx = (G.minX + G.maxX) / 2;
  const entrance = new Kit();
  for (const x of [G.minX, G.maxX]) entrance.add(geo.capsule(0.24, 4.5), 0x57ff83, { p: [x, 2.25, gz], cast: false });
  entrance.add(geo.rbox(gw + 0.5, 0.55, 0.55), 0x57ff83, { p: [gx, 4.3, gz], cast: false });
  const portal = entrance.build(false); portal.name = 'race-gate-arch';
  const archMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, emissive: 0x22ff55, emissiveIntensity: 1, roughness: 0.25 });
  (portal.children[0] as THREE.Mesh).material = archMaterial;
  const pointer = new Kit();
  pointer.add(geo.rbox(0.65, 1.65, 0.65), 0xffda45, { p: [0, 0.8, 0], finish: 'gloss', cast: false });
  pointer.add(geo.cone(1.1, 1.25, 4), 0xffda45, { p: [0, -0.5, 0], r: [Math.PI, 0, 0], finish: 'gloss', cast: false });
  const arrow = pointer.build(false); arrow.name = 'race-gate-arrow'; arrow.position.set(gx, 6.4, gz);
  // Entrance cues are independent of distant course chunk culling.
  const cues = new THREE.Group(); cues.add(portal, arrow);
  const bars = new Kit();
  for (let x = 0; x <= gw; x += 0.5) bars.add(geo.cyl(0.055, 0.055, 3.3), 0xffd166, { p: [x, 1.65, 0] });
  // Permanent posts so the open gate still reads as an entrance.
  const posts = new Kit();
  for (const x of [G.minX, G.maxX]) posts.add(geo.rbox(0.5, 3.8, 0.5, 0.1), harbor ? 0xfffaf0 : 0xffd166, { p: [x, 1.9, gz], finish: 'gloss', cast: false });
  if (harbor) posts.add(geo.rbox(gw * 0.6, 0.9, 0.12, 0.08), 0x2f6fb5, { p: [gx, 3.4, gz], finish: 'gloss', cast: false });
  const gate = bars.build(); gate.position.set(G.minX, 0, gz);
  const entry = posts.build();
  return { root, gate, cues, arrow, archMaterial, entry, gatePos: { x: G.minX, z: gz } };
}

/** Coastal road: sea on the left, grassy cliffs and pines on the right. Boardwalk: pilings, lamps. Loop: rocks and buoys. */
function harborScenery(k: Kit, d: number, p: { x: number; z: number; dx: number; dz: number; yaw: number }) {
  const [boardFrom, boardTo] = COURSE2_SECTIONS.boardwalk;
  const side = (s: number, o: number) => [p.x - p.dz * s * o, p.z + p.dx * s * o] as const;
  if (d < boardFrom || d > COURSE2_SECTIONS.cliffRoad) {
    const [lx, lz] = side(1, 16);
    k.add(new THREE.BoxGeometry(18, 2.4, 15), 0x8cbf5a, { p: [lx, 0.9, lz], r: [0, p.yaw, 0], cast: false });
    k.add(new THREE.BoxGeometry(18.2, 2, 15.2), 0xd8c08a, { p: [lx, -0.2, lz], r: [0, p.yaw, 0], cast: false });
    const [tx, tz] = side(1, 12 + (d % 3));
    k.add(geo.cyl(0.25, 0.35, 2.6, 8), 0x8a5a38, { p: [tx, 3.2, tz] });
    k.add(geo.cone(2, 4, 8), 0x3f8f5a, { p: [tx, 5.6, tz] });
    const [rx, rz] = side(-1, 9 + (d % 5));
    k.add(geo.sphere(1.2, 8, 6), 0x9c9587, { p: [rx, -0.1, rz], s: [1.4, 0.8, 1.1] });
    if (d % 28 < 14) {
      const [bx, bz] = side(-1, 24);
      k.add(geo.sphere(0.5, 10, 8), 0xff5d5d, { p: [bx, -0.1, bz], finish: 'gloss' });
      k.add(geo.cone(0.25, 0.8, 8), 0xff5d5d, { p: [bx, 0.5, bz], finish: 'gloss' });
    }
  } else if (d < boardTo) {
    for (const s of [-1, 1]) {
      const [px, pz] = side(s, 6.3);
      k.add(geo.cyl(0.25, 0.25, 1.4, 8), 0x6e4a2e, { p: [px, -0.6, pz] });
      if (d % 28 < 14) {
        const [lx, lz] = side(s, 7.2);
        k.add(geo.cyl(0.07, 0.09, 4, 8), 0x23406e, { p: [lx, 2, lz], finish: 'metal' });
        k.add(geo.sphere(0.28, 10, 8), 0xfff3b0, { p: [lx, 4.1, lz], finish: 'glow' });
      }
    }
    if (d % 42 < 14) {
      const [bx, bz] = side(1, 7.05);
      k.add(geo.torus(0.35, 0.1, Math.PI * 2, 16), 0xff5d5d, { p: [bx, 0.9, bz], r: [0, p.yaw + Math.PI / 2, 0], finish: 'gloss', cast: false });
    }
  } else {
    for (const s of [-1, 1]) {
      const [rx, rz] = side(s, 10 + (d % 4));
      k.add(geo.sphere(1.3, 8, 6), 0xa39c8e, { p: [rx, -0.1, rz], s: [1.3, 0.7, 1.2] });
    }
  }
}
