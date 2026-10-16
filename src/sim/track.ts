// Shared, deterministic northbound polyline. Distance is measured along the road.
export const TRACK = [
  [80, 15], [80, -55], [98, -120], [80, -190], [62, -260],
  [80, -330], [98, -400], [80, -470], [80, -535],
].map(([x, z]) => ({ x, z }));
export const TRACK_LENGTH = TRACK.slice(1).reduce((n, p, i) => n + Math.hypot(p.x - TRACK[i].x, p.z - TRACK[i].z), 0);
export function trackAt(distance: number) {
  let d = Math.max(0, distance);
  for (let i = 1; i < TRACK.length; i++) {
    const a = TRACK[i - 1], b = TRACK[i], length = Math.hypot(b.x - a.x, b.z - a.z);
    if (d <= length || i === TRACK.length - 1) {
      const t = Math.min(1, d / length), dx = (b.x - a.x) / length, dz = (b.z - a.z) / length;
      return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, dx, dz, yaw: Math.atan2(-dx, -dz) };
    }
    d -= length;
  }
  throw new Error('Empty track');
}
export function trackNear(x: number, z: number) {
  let best = { distance: Infinity, progress: 0, x: 80, z: 15, dx: 0, dz: -1 }, progress = 0;
  for (let i = 1; i < TRACK.length; i++) {
    const a = TRACK[i - 1], b = TRACK[i], dx = b.x - a.x, dz = b.z - a.z, length = Math.hypot(dx, dz);
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / length ** 2));
    const px = a.x + dx * t, pz = a.z + dz * t, distance = Math.hypot(x - px, z - pz);
    if (distance < best.distance) best = { distance, progress: progress + length * t, x: px, z: pz, dx: dx / length, dz: dz / length };
    progress += length;
  }
  return best;
}
export const JUMPS = [45, 145, 245, 350, 455];
export const GAP = { start: 358, end: 363 }; // left lane jumps; right lane stays paved

// Shared by collision sampling and rendered jump geometry.
export const RAMP_HEIGHT = 2.7;
export const RAMP_LENGTH = 8;
