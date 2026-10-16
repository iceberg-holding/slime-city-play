import type { GameState } from './types';

export const RACE = { x: 80, start: 15, finish: -145, duration: 60 };
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
  s.creatures.forEach((c, i) => {
    c.pos = { x: RACE.x + (i % 3 - 1) * 2.7, y: 0, z: 2 - i * 19 };
    c.home = { x: c.pos.x, z: c.pos.z }; c.target = { ...c.home };
    c.vel = { x: 0, y: 0, z: 0 }; c.stuck = 0; c.chatUntil = 0;
  });
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
  const v = s.vehicles.find(v => v.id === p.riding);
  if (v && v.pos.z <= RACE.finish && Math.abs(v.pos.x - RACE.x) < 6) raceFinish(s);
}
