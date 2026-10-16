import * as THREE from 'three';
import { Kit, geo } from './materials';
import { wedge } from './city';
import { trackAt, TRACK_LENGTH, JUMPS, GAP, TRACK } from '../sim/track';

export function buildRaceRoad() {
  const root = new THREE.Group();
  for (let start = 0; start < TRACK_LENGTH; start += 70) {
    const k = new Kit(), end = Math.min(start + 70, TRACK_LENGTH);
    for (let d = start; d < end; d += 2) {
      const p = trackAt(d + 1), length = Math.min(2.1, end - d + 0.1);
      const gap = d >= GAP.start && d < GAP.end;
      k.add(new THREE.BoxGeometry(gap ? 7 : 14, 0.15, length), 0x596b80, { p: [p.x + (gap ? -p.dz * 3.5 : 0), -0.08, p.z + (gap ? p.dx * 3.5 : 0)], r: [0, p.yaw, 0] });
      for (const side of [-1, 1]) k.add(new THREE.BoxGeometry(0.35, 1.1, length), 0xf6cc69, { p: [p.x - p.dz * side * 6.8, 0.55, p.z + p.dx * side * 6.8], r: [0, p.yaw, 0] });
      if (d % 8 < 2) k.add(new THREE.BoxGeometry(0.15, 0.025, 2), 0xffffff, { p: [p.x, 0.03, p.z], r: [0, p.yaw, 0] });
    }
    // Round off polyline joins so the outside of each bend has continuous pavement.
    let progress = 0;
    for (let i = 1; i < TRACK.length - 1; i++) {
      progress += Math.hypot(TRACK[i].x - TRACK[i - 1].x, TRACK[i].z - TRACK[i - 1].z);
      if (progress < start || progress >= end) continue;
      const node = TRACK[i], a = trackAt(progress - 0.1), b = trackAt(progress + 0.1);
      k.add(new THREE.CylinderGeometry(7, 7, 0.15, 24), 0x596b80, { p: [node.x, -0.08, node.z] });
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
    for (const d of JUMPS.filter(d => d >= start && d < end)) {
      const p = trackAt(d + 4), optional = d === 350, lane = optional ? -3.5 : 0;
      k.add(wedge(optional ? 5 : 10, 1.6, 8, 0), 0xffae50, { p: [p.x - p.dz * lane, 0, p.z + p.dx * lane], r: [0, Math.PI / 2 + p.yaw, 0] });
    }
    const chunk = k.build(); chunk.userData.progress = (start + end) / 2;
    root.add(chunk);
  }
  const finish = new Kit(), p = trackAt(TRACK_LENGTH);
  for (let i = 0; i < 14; i++) for (let j = 0; j < 2; j++) finish.add(new THREE.BoxGeometry(1, 0.03, 1), (i + j) % 2 ? 0xffffff : 0x263046, { p: [p.x - 6.5 + i, 0.04, p.z + j] });
  for (const x of [-6.5, 6.5]) finish.add(geo.cyl(0.18, 0.18, 6), 0xff5d73, { p: [p.x + x, 3, p.z] });
  finish.add(new THREE.BoxGeometry(13.5, 1, 0.3), 0xff5d73, { p: [p.x, 5.5, p.z] });
  const arch = finish.build(); arch.userData.progress = TRACK_LENGTH; root.add(arch);
  const entrance = new Kit();
  for (const x of [2, 9]) entrance.add(geo.cyl(0.18, 0.18, 4), 0x36c7b0, { p: [x, 2, 10] });
  entrance.add(new THREE.BoxGeometry(7.5, 0.65, 0.3), 0x36c7b0, { p: [5.5, 3.8, 10] });
  const portal = entrance.build(); portal.userData.progress = 0; root.add(portal);
  const bars = new Kit();
  for (let x = 0; x <= 7; x += 0.5) bars.add(geo.cyl(0.055, 0.055, 3.3), 0xffd166, { p: [x, 1.65, 0] });
  const gate = bars.build(); gate.position.set(2, 0, 10); root.add(gate);
  return { root, gate };
}
