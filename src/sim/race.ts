import { STAR_RADIUS, courseAt, courseHeightAt, courseNear, courseRings, courseStars, ringRadius } from './track';
import { Collider } from './physics';
import { levelDef, raceStart } from './levels';
import { newRaceState, type Creature, type GameState } from './types';
import { VEHICLES } from './vehicles';

// Level 1 values kept for existing callers and tests.
const L1 = levelDef(1).race!;
export const RACE = { x: 80, start: 15, finish: -840, duration: L1.duration };
export const GATE = L1.gate;

export const raceOf = (s: GameState) => levelDef(s.level).race;

/** Built and every accessory fitted (the pit bike needs its headlight before the race). */
export function raceReady(s: GameState) {
  const g = s.garages[0];
  return !!g?.built && VEHICLES[g.vehicle].parts.every(p => g.delivered.includes(p.id));
}
export function openGates(s: GameState) {
  if (raceOf(s) && raceReady(s) && s.race.phase === 'locked') s.race.phase = 'open';
}
export function startRace(s: GameState) {
  const r = raceOf(s), p = s.players[0], v = s.vehicles.find(v => v.id === p.riding);
  if (!r || !v || s.race.phase === 'locked') return;
  const start = raceStart(r);
  s.status = 'playing'; s.race = newRaceState('racing', r.duration);
  v.pos = { x: start.x, y: courseHeightAt(r.course, 0), z: start.z }; v.vel = { x: 0, y: 0, z: 0 }; v.speed = 0; v.yaw = start.yaw;
  p.pos = { ...v.pos }; s.projectiles = []; s.pads = [];
  s.creatures.forEach(c => { c.chatUntil = 0; c.stuck = 0; c.talk = 0; c.slot = undefined; });
  populateRace(s, true);
}
export function raceFinish(s: GameState) {
  const r = raceOf(s);
  if (!r || s.race.phase !== 'racing' || s.race.remaining <= 0) return;
  const end = courseAt(r.course, r.course.length);
  s.race.phase = 'finished'; s.status = 'won'; s.winTime = s.race.elapsed - s.race.bonus;
  s.events.push({ type: 'win', x: end.x, y: 1, z: end.z });
}
/** Bonus seconds (rings, stars, tricks, hooligan hits) extend the clock and shorten the finish time. */
export function addBonus(s: GameState, seconds: number, x: number, y: number, z: number, info: string) {
  if (s.race.phase !== 'racing') return;
  s.race.bonus += seconds;
  s.race.remaining += seconds;
  s.events.push({ type: 'bonus', x, y, z, who: s.players[0]?.id, info: `${info}:${seconds}` });
}
/** A forward slime shot hit a hooligan: +1 s for sticky, +2 s for bouncy, once per hooligan spot. */
export function hooliganHit(s: GameState, c: Creature, kind: 'sticky' | 'bouncy') {
  if (s.race.phase !== 'racing' || !c.dash || c.paid) return;
  c.paid = true;
  s.race.hits++;
  addBonus(s, kind === 'sticky' ? 1 : 2, c.pos.x, c.pos.y + 1.4, c.pos.z, 'hit');
}
export function updateRace(s: GameState, dt: number) {
  const r = raceOf(s);
  if (!r) return;
  const p = s.players[0], t = r.trigger;
  if (p.riding !== null) openGates(s);
  if (s.race.phase === 'open' && p.riding !== null && p.pos.z < t.maxZ && p.pos.z > t.minZ && p.pos.x > t.minX && p.pos.x < t.maxX) startRace(s);
  if (s.race.phase !== 'racing') return;
  s.race.elapsed += dt;
  s.race.remaining = Math.max(0, r.duration + s.race.bonus - s.race.elapsed);
  if (s.race.remaining <= 0) { s.race.phase = 'failed'; return; }
  populateRace(s);
  const v = s.vehicles.find(v => v.id === p.riding);
  if (!v) return;
  collectStars(s, v.pos.x, v.pos.y + 0.5, v.pos.z);
  const near = courseNear(r.course, v.pos.x, v.pos.z);
  passRings(s, near.progress, v.pos.x, v.pos.y + 0.6, v.pos.z);
  s.race.progress = near.progress;
  if (near.progress >= r.course.length - 0.01 && near.distance < r.course.rail + 0.5) raceFinish(s);
}

/** +3 s for flying through a ring: crossing its plane this tick, within the ring's radius. */
function passRings(s: GameState, progress: number, x: number, y: number, z: number) {
  const course = raceOf(s)!.course, rings = courseRings(course), from = s.race.progress, R = ringRadius(course);
  for (let i = 0; i < rings.length; i++) {
    const g = rings[i];
    if (from >= g.d || progress < g.d || progress - from > 5 || s.race.rings.includes(i)) continue;
    if ((g.x - x) ** 2 + (g.y - y) ** 2 + (g.z - z) ** 2 > R ** 2) continue;
    s.race.rings.push(i);
    addBonus(s, 3, g.x, g.y, g.z, 'ring');
  }
}

function collectStars(s: GameState, x: number, y: number, z: number) {
  const stars = courseStars(raceOf(s)!.course);
  for (let i = 0; i < stars.length; i++) {
    const st = stars[i];
    if ((st.x - x) ** 2 + (st.y - y) ** 2 + (st.z - z) ** 2 > STAR_RADIUS ** 2 || s.race.stars.includes(i)) continue;
    s.race.stars.push(i);
    s.events.push({ type: 'star', x: st.x, y: st.y, z: st.z, who: s.players[0].id, info: st.high ? 'high' : 'low' });
  }
}

// Seven pooled creatures represent deterministic section spawns, never the whole course.
// Each creature owns the slot (section-1..section+1) whose index ≡ its group (i % 3) mod 3, so when the player
// enters a new section only the group left behind (≥14 m behind the player) jumps ahead to section+2 (≥88 m
// ahead) — creatures never relocate while in view.
function populateRace(s: GameState, force = false) {
  const course = raceOf(s)!.course;
  const progress = courseNear(course, s.players[0].pos.x, s.players[0].pos.z).progress;
  if (!Number.isFinite(progress)) return;
  const section = Math.floor(progress / 70);
  const spot = (slot: number, i: number) => Math.max(8, Math.min(course.length - 10, slot * 70 + 18 + Math.floor(i / 3) * 19));
  // flight course: pyshki stand on the roofs and lawns under the route; hooligans spring up at the drone
  const air = !!course.air, ground = air ? new Collider(s.world.raceSolids ?? []) : null;
  s.creatures.forEach((c, i) => {
    const slot = section - 1 + ((((i - (section - 1)) % 3) + 3) % 3);
    if (c.slot === slot) return;
    if (!force && c.slot !== undefined && spot(c.slot, i) > progress - 12) return; // still near/visible: wait
    const d = spot(slot, i);
    const p = courseAt(course, d), hooligan = Math.floor(i / 3) === 1, side = (slot + i) % 2 ? 1 : -1;
    // hooligans lurk at the kerb and dash across; the rest stand about in the lanes
    const lane = air ? (hooligan ? side * 3.6 : ((i * 7 + slot * 3) % 5 - 2) * 2.4) : hooligan ? side * 5.4 : ((i * 7 + slot * 3) % 5 - 2) * 1.7;
    const x = p.x - p.dz * lane, z = p.z + p.dx * lane;
    const y = ground ? ground.groundAt(x, z, courseHeightAt(course, d) - 1.5, 0.5) : 0;
    c.slot = slot;
    {
      c.pos = { x, y, z }; c.home = { x, z }; c.target = { x, z };
      c.vel = { x: 0, y: 0, z: 0 }; c.stuck = 0; c.chatUntil = 0; c.talk = 0;
      c.paid = false;
      c.dash = !hooligan ? undefined : air ? { ax: x, az: z, bx: x, bz: z, toB: false, bounce: true } : { ax: x, az: z, bx: p.x + p.dz * side * 2.2, bz: p.z - p.dx * side * 2.2, toB: false };
    }
  });
}
