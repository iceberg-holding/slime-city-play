import { courseAt, courseNear } from './track';
import { levelDef, raceStart } from './levels';
import { newRaceState, type GameState } from './types';
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
  v.pos = { x: start.x, y: 0, z: start.z }; v.vel = { x: 0, y: 0, z: 0 }; v.speed = 0; v.yaw = start.yaw;
  p.pos = { ...v.pos }; s.projectiles = []; s.pads = [];
  s.creatures.forEach(c => { c.chatUntil = 0; c.stuck = 0; c.talk = 0; });
  populateRace(s);
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
  const near = courseNear(r.course, v.pos.x, v.pos.z);
  if (near.progress >= r.course.length - 0.01 && near.distance < r.course.rail + 0.5) raceFinish(s);
}

// Seven pooled creatures represent deterministic section spawns, never the whole course.
function populateRace(s: GameState) {
  const course = raceOf(s)!.course;
  const progress = courseNear(course, s.players[0].pos.x, s.players[0].pos.z).progress;
  const section = Math.floor(progress / 70);
  s.creatures.forEach((c, i) => {
    const slot = section + (i % 3) - 1;
    const d = Math.max(8, Math.min(course.length - 10, slot * 70 + 18 + Math.floor(i / 3) * 19));
    const p = courseAt(course, d), lane = ((i * 7 + slot * 3) % 5 - 2) * 1.7;
    const x = p.x - p.dz * lane, z = p.z + p.dx * lane;
    if (Math.hypot(c.home.x - x, c.home.z - z) > 1) {
      c.pos = { x, y: 0, z }; c.home = { x, z }; c.target = { x, z };
      c.vel = { x: 0, y: 0, z: 0 }; c.stuck = 0; c.chatUntil = 0; c.talk = 0;
    }
  });
}
