import type { Look } from './types';

// Hero builder parts: pure data. Each part tweaks a few stats; everything else stays at the base value.

export interface HeroStats {
  /** walk speed multiplier */
  speed: number;
  /** jump velocity multiplier */
  jump: number;
  /** how far pyshki / bumps push you (multiplier) */
  knockback: number;
  /** stun time multiplier */
  stun: number;
  /** seconds between shots */
  fireCooldown: number;
  /** sticky blob hit radius multiplier (also its visual size) */
  blobScale: number;
  /** projectile speed multiplier (longer range) */
  projSpeed: number;
  /** sticky auto-aim range (m) */
  aimRange: number;
  /** auto-aim cone: min cos(angle) */
  aimCone: number;
  /** seconds a pyshka stays glued */
  glueTime: number;
  maxBlocks: number;
  /** slime pad launch multiplier */
  padLaunch: number;
  /** slime pad size multiplier */
  padScale: number;
  /** blobs per shot */
  multishot: number;
  /** vehicle top speed multiplier */
  rideSpeed: number;
  /** pyshki keep this much extra distance */
  personalSpace: number;
}

export const BASE_STATS: HeroStats = {
  speed: 1,
  jump: 1,
  knockback: 1,
  stun: 1,
  fireCooldown: 0.28,
  blobScale: 1,
  projSpeed: 1,
  aimRange: 16,
  aimCone: 0.9,
  glueTime: 5,
  maxBlocks: 10,
  padLaunch: 1,
  padScale: 1,
  multishot: 1,
  rideSpeed: 1,
  personalSpace: 0,
};

export type HeroSlot = 'head' | 'body' | 'legs' | 'gun';
export const HERO_SLOTS: HeroSlot[] = ['head', 'body', 'legs', 'gun'];

export interface HeroPartDef {
  /** stable id used for i18n (names + quirk text) */
  id: string;
  stats: Partial<HeroStats>;
}

export const HERO_PARTS: Record<HeroSlot, HeroPartDef[]> = {
  head: [
    { id: 'cube', stats: { glueTime: 6.5 } },
    { id: 'bighead', stats: { blobScale: 1.35 } },
    { id: 'robot', stats: { aimRange: 24 } },
    { id: 'cat', stats: { stun: 0.4 } },
    { id: 'knight', stats: { knockback: 0.75 } },
    { id: 'alien', stats: { aimCone: 0.8 } },
  ],
  body: [
    { id: 'tshirt', stats: { speed: 1.06 } },
    { id: 'hoodie', stats: { maxBlocks: 13 } },
    { id: 'tank', stats: { knockback: 0.45, speed: 0.95 } },
    { id: 'tuxedo', stats: { personalSpace: 0.8 } },
    { id: 'slimesuit', stats: { padLaunch: 1.2 } },
    { id: 'stripes', stats: { rideSpeed: 1.15 } },
  ],
  legs: [
    { id: 'jeans', stats: { knockback: 0.9 } },
    { id: 'shorts', stats: { speed: 1.1 } },
    { id: 'robolegs', stats: { jump: 1.1, speed: 0.96 } },
    { id: 'springs', stats: { jump: 1.28 } },
    { id: 'boots', stats: { knockback: 0.7, speed: 0.95 } },
    { id: 'wheels', stats: { speed: 1.3, jump: 0.9 } },
  ],
  gun: [
    { id: 'blaster', stats: {} },
    { id: 'rapid', stats: { fireCooldown: 0.12 } },
    { id: 'bazooka', stats: { blobScale: 1.8, fireCooldown: 0.55 } },
    { id: 'bubble', stats: { padScale: 1.4 } },
    { id: 'twin', stats: { multishot: 2, fireCooldown: 0.36 } },
    { id: 'ray', stats: { projSpeed: 1.5, aimRange: 26 } },
  ],
};

export const PARTS_PER_SLOT = 6;

/** Multiplicative stats combine by product, absolute ones (cooldown, ranges, counts…) by the last part that sets them. */
const MULTIPLICATIVE: (keyof HeroStats)[] = ['speed', 'jump', 'knockback', 'stun', 'blobScale', 'projSpeed', 'padLaunch', 'padScale', 'rideSpeed'];

export function heroStats(look: Look): HeroStats {
  const s: HeroStats = { ...BASE_STATS };
  HERO_SLOTS.forEach((slot, i) => {
    const def = HERO_PARTS[slot][look[i]] ?? HERO_PARTS[slot][0];
    for (const [k, v] of Object.entries(def.stats) as [keyof HeroStats, number][]) {
      if (MULTIPLICATIVE.includes(k)) s[k] *= v;
      else s[k] = v;
    }
  });
  return s;
}
