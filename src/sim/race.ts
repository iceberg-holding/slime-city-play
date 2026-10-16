import { trackAt, trackNear, TRACK_LENGTH } from './track';
import type { GameState } from './types';

export const RACE = { x: 80, start: 15, finish: -535, duration: Math.ceil(TRACK_LENGTH / 9.75 * 1.35) };
export const GATE = { minX: 2, maxX: 9, minY: 0, maxY: 3.5, minZ: 9.7, maxZ: 10.1 };
export function openGates(s: GameState) {
  if (s.level === 1 && s.garages[0]?.built && s.race.phase === 'locked') s.race.phase = 'open';
}
export function startRace(s: GameState) {
  const p = s.players[0], v = s.vehicles.find(v => v.id === p.riding);
  if (!v || s.level !== 1 || s.race.phase === 'locked') return;
  s.status = 'playing'; s.race = { phase: 'racing', remaining: RACE.duration };
  v.pos = { x: RACE.x, y: 0, z: RACE.start }; v.vel = { x: 0, y: 0, z: 0 }; v.speed = 0; v.yaw = 0;
  p.pos = { ...v.pos }; s.projectiles = []; s.pads = [];
  s.creatures.forEach(c => { c.chatUntil = 0; c.stuck = 0; c.talk = 0; });
  populateRace(s);

}
export function raceFinish(s: GameState) {
  if (s.race.phase !== 'racing' || s.race.remaining <= 0) return;
  s.race.phase = 'finished'; s.status = 'won'; s.winTime = RACE.duration - s.race.remaining;
  s.events.push({ type: 'win', x: RACE.x, y: 1, z: RACE.finish });
}
export function updateRace(s: GameState, dt: number) {
  if (s.level !== 1) return;
  const p = s.players[0];
  if (p.riding !== null) openGates(s);
  if (s.race.phase === 'open' && p.riding !== null && p.pos.z < 10.3 && p.pos.z > 7 && p.pos.x > 2 && p.pos.x < 9) startRace(s);
  if (s.race.phase !== 'racing') return;
  s.race.remaining = Math.max(0, s.race.remaining - dt);
  if (s.race.remaining <= 0) { s.race.phase = 'failed'; return; }
  populateRace(s);
  const v = s.vehicles.find(v => v.id === p.riding);
  if (v && v.pos.z <= RACE.finish && Math.abs(v.pos.x - RACE.x) < 6) raceFinish(s);
}

// Seven pooled creatures represent deterministic section spawns, never the whole course.
function populateRace(s: GameState) {
  const progress = trackNear(s.players[0].pos.x, s.players[0].pos.z).progress;
  const section = Math.floor(progress / 70);
  s.creatures.forEach((c, i) => {
    const slot = section + (i % 3) - 1;
    const d = Math.max(8, Math.min(TRACK_LENGTH - 10, slot * 70 + 18 + Math.floor(i / 3) * 19));
    const p = trackAt(d), lane = ((i * 7 + slot * 3) % 5 - 2) * 1.7;
    const x = p.x - p.dz * lane, z = p.z + p.dx * lane;
    if (Math.hypot(c.home.x - x, c.home.z - z) > 1) {
      c.pos = { x, y: 0, z }; c.home = { x, z }; c.target = { x, z };
      c.vel = { x: 0, y: 0, z: 0 }; c.stuck = 0; c.chatUntil = 0; c.talk = 0;
    }
  });
}
