// Seeded RNG (mulberry32) whose state lives inside GameState so the sim is deterministic.

export function nextRandom(seed: number): [number, number] {
  let t = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return [((r ^ (r >>> 14)) >>> 0) / 4294967296, t];
}

export function rand(s: { rng: number }): number {
  const [v, next] = nextRandom(s.rng);
  s.rng = next;
  return v;
}

export function randRange(s: { rng: number }, a: number, b: number): number {
  return a + (b - a) * rand(s);
}
