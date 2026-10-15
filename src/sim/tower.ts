import type { GameState, InputCommand, Solid } from './types';
export const TOWER = { x: 26, z: -26, roof: 22.1325, mid: 11.57, liftX: 30.9075 };
export const STOPS = [0.26, TOWER.mid, TOWER.roof];
export function liftSolid(y: number): Solid {
  return { minX: 30.2, maxX: 31.7, minZ: -26.8, maxZ: -25.2, minY: y - 0.2, maxY: y };
}
export function updateLift(s: GameState, inputs: Record<number, InputCommand>, dt: number) {
  const e = s.elevator;
  const riders = s.players.filter(p => Math.abs(p.pos.x - TOWER.liftX) < 0.7 && Math.abs(p.pos.z + 26) < 0.7 && Math.abs(p.pos.y - e.y) < 0.3);
  if (e.wait > 0) e.wait -= dt;
  if (e.y === STOPS[e.target] && e.wait <= 0 && (riders.length || s.players.some(p => inputs[p.id]?.interact && Math.hypot(p.pos.x - TOWER.liftX, p.pos.z + 26) < 3))) {
    e.target = (e.target + 1) % STOPS.length;
  }
  const old = e.y, goal = STOPS[e.target];
  e.y += Math.sign(goal - e.y) * Math.min(Math.abs(goal - e.y), dt * 3);
  for (const p of riders) { p.pos.y += e.y - old; p.vel.y = 0; p.grounded = true; }
  if (old !== e.y && e.y === goal) e.wait = 3;
}
