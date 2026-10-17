// Ring/star height probe: bots at several speeds report vehicle-centre offset at each ring plane.
import { createServer } from 'vite';
const s = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const L = p => s.ssrLoadModule(p);
const { createGame, step } = await L('/src/sim/step.ts');
const { emptyInput } = await L('/src/sim/types.ts');
const { levelDef } = await L('/src/sim/levels.ts');
const { VEHICLES } = await L('/src/sim/vehicles.ts');
const { spawnVehicle } = await L('/src/sim/mission.ts');
const { openGates, startRace } = await L('/src/sim/race.ts');
const { courseAt, courseNear, courseRings, courseStars } = await L('/src/sim/track.ts');
for (const level of [1, 2]) for (const frac of [0.6, 0.75, 0.9, 1.05]) {
  const def = levelDef(level), c = def.race.course, kind = def.mission.vehicle;
  const g = createGame(3, [0,0,0,0], level); g.creatures = [];
  const p = g.players[0], v = spawnVehicle(g, kind, 0, 0, 0, 0);
  p.riding = v.id; v.rider = p.id; g.garages[0].built = true; g.garages[0].delivered = VEHICLES[kind].parts.map(q => q.id);
  openGates(g); startRace(g);
  const top = VEHICLES[kind].maxSpeed * frac, dys = [], rings = courseRings(c);
  for (let i = 0; i < 200 * 60 && g.race.phase === 'racing'; i++) {
    const near = courseNear(c, v.pos.x, v.pos.z), t = courseAt(c, near.progress + 9);
    const want = Math.atan2(-(t.x - v.pos.x), -(t.z - v.pos.z)), err = Math.atan2(Math.sin(want - v.yaw), Math.cos(want - v.yaw));
    const steer = Math.max(-0.65, Math.min(0.65, -err * 2)), thr = v.speed < top ? 1 : 0.18;
    step(g, { [p.id]: { ...emptyInput(), mx: -Math.sin(v.yaw) * thr + Math.cos(v.yaw) * steer, mz: -Math.cos(v.yaw) * thr - Math.sin(v.yaw) * steer } }, 1 / 60);
    for (const [k, r] of rings.entries()) if (Math.abs(near.progress - r.d) < 0.15 && !dys[k]) dys[k] = +(v.pos.y + 0.6 - r.y).toFixed(2);
  }
  const high = courseStars(c).filter(st => st.high).length, gotHigh = g.race.stars.filter(i => courseStars(c)[i].high).length;
  console.log(`L${level} ${frac}: rings ${g.race.rings.length}/${rings.length} high stars ${gotHigh}/${high} ${g.race.phase} t=${g.winTime.toFixed(1)} dy:`, JSON.stringify(dys));
}
await s.close();
