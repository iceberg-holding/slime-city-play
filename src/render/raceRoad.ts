import * as THREE from 'three';
import { Kit, geo } from './materials';
import { wedge } from './city';
import { trackAt, TRACK_LENGTH, JUMPS, GAP, TRACK, RAMP_HEIGHT, RAMP_LENGTH } from '../sim/track';

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

export function buildRaceRoad() {
  const root = new THREE.Group();
  for (let start = 0; start < TRACK_LENGTH; start += 70) {
    const k = new Kit(), end = Math.min(start + 70, TRACK_LENGTH);
    const cuts = [start, ...distances.filter(d => d > start && d < end), ...[GAP.start, GAP.end].filter(d => d > start && d < end), end].sort((a, b) => a - b);
    const vertices: number[] = [];
    for (let i = 1; i < cuts.length; i++) {
      const a = cuts[i - 1], b = cuts[i], left = a >= GAP.start && a < GAP.end ? 0 : -7;
      const al = roadPoint(a, left), ar = roadPoint(a, 7), bl = roadPoint(b, left), br = roadPoint(b, 7);
      vertices.push(...al, ...ar, ...bl, ...ar, ...br, ...bl);
    }
    const pavement = new THREE.BufferGeometry();
    pavement.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); pavement.computeVertexNormals();
    k.add(pavement, 0x596b80, { cast: false }); pavement.dispose();
    for (let d = start; d < end; d += 2) {
      const p = trackAt(d + 1), length = Math.min(2.1, end - d + 0.1);
      for (const side of [-1, 1]) k.add(new THREE.BoxGeometry(0.35, 1.1, length), 0xf6cc69, { p: [p.x - p.dz * side * 6.8, 0.55, p.z + p.dx * side * 6.8], r: [0, p.yaw, 0] });
      if (d % 8 < 2) k.add(new THREE.BoxGeometry(0.15, 0.025, 2), 0xffffff, { p: [p.x, 0.065, p.z], r: [0, p.yaw, 0] });
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
        k.add(new THREE.BoxGeometry(0.4, 1.1, Math.hypot(bx - ax, bz - az) + 0.4), 0xf6cc69,
          { p: [(ax + bx) / 2, 0.55, (az + bz) / 2], r: [0, Math.atan2(bx - ax, bz - az), 0] });
      }
    }
    for (let d = start + 8; d < end; d += 14) {
      const p = trackAt(d), section = Math.floor(start / 140);
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
      const p = trackAt(d + 4), optional = d === 350, lane = optional ? -3.5 : 0;
      k.add(wedge(RAMP_LENGTH, RAMP_HEIGHT, optional ? 5 : 10, 0), 0xffae50, { p: [p.x - p.dz * lane, 0, p.z + p.dx * lane], r: [0, Math.PI / 2 + p.yaw, 0] });
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
     chunk.userData.progress = (start + end) / 2;
    root.add(chunk);
  }
  const finish = new Kit(), p = trackAt(TRACK_LENGTH);
  for (let i = 0; i < 14; i++) for (let j = 0; j < 2; j++) finish.add(new THREE.BoxGeometry(1, 0.03, 1), (i + j) % 2 ? 0xffffff : 0x263046, { p: [p.x - 6.5 + i, 0.04, p.z + j] });
  for (const x of [-6.5, 6.5]) finish.add(geo.cyl(0.18, 0.18, 6), 0xff5d73, { p: [p.x + x, 3, p.z] });
  finish.add(new THREE.BoxGeometry(13.5, 1, 0.3), 0xff5d73, { p: [p.x, 5.5, p.z] });
  const arch = finish.build(); arch.userData.progress = TRACK_LENGTH; root.add(arch);
  const entrance = new Kit();
  for (const x of [2, 9]) entrance.add(geo.capsule(0.24, 4.5), 0x57ff83, { p: [x, 2.25, 10], cast: false });
  entrance.add(geo.rbox(7.5, 0.55, 0.55), 0x57ff83, { p: [5.5, 4.3, 10], cast: false });
  const portal = entrance.build(false); portal.name = 'race-gate-arch';
  const archMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, emissive: 0x22ff55, emissiveIntensity: 1, roughness: 0.25 });
  (portal.children[0] as THREE.Mesh).material = archMaterial;
  const pointer = new Kit();
  pointer.add(geo.rbox(0.65, 1.65, 0.65), 0xffda45, { p: [0, 0.8, 0], finish: 'gloss', cast: false });
  pointer.add(geo.cone(1.1, 1.25, 4), 0xffda45, { p: [0, -0.5, 0], r: [Math.PI, 0, 0], finish: 'gloss', cast: false });
  const arrow = pointer.build(false); arrow.name = 'race-gate-arrow'; arrow.position.set(5.5, 6.4, 10);
  // City entrance cues are independent of distant course chunk culling.
  const cues = new THREE.Group(); cues.add(portal, arrow);
  const bars = new Kit();
  for (let x = 0; x <= 7; x += 0.5) bars.add(geo.cyl(0.055, 0.055, 3.3), 0xffd166, { p: [x, 1.65, 0] });
  const gate = bars.build(); gate.position.set(2, 0, 10); root.add(gate);
  return { root, gate, cues, arrow, archMaterial };
}
