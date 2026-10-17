// Race courses: deterministic polylines. Distance is measured along the road.

export interface Course {
  points: { x: number; z: number }[];
  length: number;
  /** progress of each jump ramp's foot */
  jumps: number[];
  /** progress of the narrow optional ramp (left lane only), if any */
  optionalJump: number | null;
  /** left lane drops away here; the right lane stays paved */
  gap: { start: number; end: number } | null;
  rampHeight: number;
  rampLength: number;
  /** distance from centerline to the analytic rails */
  rail: number;
}

export function makeCourse(pts: [number, number][], o: Omit<Course, 'points' | 'length'>): Course {
  const points = pts.map(([x, z]) => ({ x, z }));
  const length = points.slice(1).reduce((n, p, i) => n + Math.hypot(p.x - points[i].x, p.z - points[i].z), 0);
  return { points, length, ...o };
}

export function courseAt(c: Course, distance: number) {
  const T = c.points;
  let d = Math.max(0, distance);
  for (let i = 1; i < T.length; i++) {
    const a = T[i - 1], b = T[i], length = Math.hypot(b.x - a.x, b.z - a.z);
    if (d <= length || i === T.length - 1) {
      const t = Math.min(1, d / length), dx = (b.x - a.x) / length, dz = (b.z - a.z) / length;
      return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, dx, dz, yaw: Math.atan2(-dx, -dz) };
    }
    d -= length;
  }
  throw new Error('Empty track');
}

export function courseNear(c: Course, x: number, z: number) {
  const T = c.points;
  let best = { distance: Infinity, progress: 0, x: T[0].x, z: T[0].z, dx: 0, dz: -1 }, progress = 0;
  for (let i = 1; i < T.length; i++) {
    const a = T[i - 1], b = T[i], dx = b.x - a.x, dz = b.z - a.z, length = Math.hypot(dx, dz);
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / length ** 2));
    const px = a.x + dx * t, pz = a.z + dz * t, distance = Math.hypot(x - px, z - pz);
    if (distance < best.distance) best = { distance, progress: progress + length * t, x: px, z: pz, dx: dx / length, dz: dz / length };
    progress += length;
  }
  return best;
}

// Level 1: northbound city-to-park-to-market road, then a second park/boardwalk lap of S-bends.
export const COURSE1 = makeCourse(
  [[80, 15], [80, -55], [98, -120], [80, -190], [62, -260], [80, -330], [98, -400], [80, -470], [80, -535], [62, -600], [80, -670], [98, -740], [80, -810], [80, -840]],
  { jumps: [45, 145, 245, 350, 455, 575, 690, 790], optionalJump: 350, gap: { start: 358, end: 363 }, rampHeight: 2.7, rampLength: 8, rail: 6.1 },
);

// Level 2: coastal road, pier boardwalk with an optional gap, a loop round the lighthouse, then the cliff road home. Smaller ramps for the scooter.
export const COURSE2 = makeCourse(
  [[120, 10], [120, -40], [135, -90], [120, -140], [135, -190], [135, -290], [135, -330], [150, -356], [180, -356], [195, -330], [205, -300], [205, -250], [190, -190], [205, -130], [205, -60], [190, -10]],
  { jumps: [20, 120, 225, 255, 480, 575, 660, 730], optionalJump: 255, gap: { start: 262, end: 267 }, rampHeight: 1.8, rampLength: 7, rail: 6.1 },
);
/** progress where the boardwalk starts and ends, and the lighthouse the loop goes round */
export const COURSE2_SECTIONS = { boardwalk: [206.6, 306.6], lighthouse: { x: 167, z: -322 }, cliffRoad: 535 };

// Level 1 names kept for existing callers and tests.
export const TRACK = COURSE1.points;
export const TRACK_LENGTH = COURSE1.length;
export const trackAt = (distance: number) => courseAt(COURSE1, distance);
export const trackNear = (x: number, z: number) => courseNear(COURSE1, x, z);
export const JUMPS = COURSE1.jumps;
export const GAP = COURSE1.gap!;
export const RAMP_HEIGHT = COURSE1.rampHeight;
export const RAMP_LENGTH = COURSE1.rampLength;
