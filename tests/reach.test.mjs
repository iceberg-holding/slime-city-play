// Pure-sim test (no browser): every pit bike part is reachable on foot from the spawn, a scripted walk
// through step() actually collects them all, delivers them, and the finished bike rides.
// Run: node tests/reach.test.mjs
import { createServer } from 'vite';
import assert from 'node:assert/strict';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(p);
let failed = false;
try {
  const { createGame, step, makeCollider } = await load('/src/sim/step.ts');
  const { findWalkPaths } = await load('/src/sim/reach.ts');
  const { emptyInput } = await load('/src/sim/types.ts');
  const { levelDef } = await load('/src/sim/levels.ts');
  const { DT } = await load('/src/sim/constants.ts');

  const { openGates, startRace, raceFinish, RACE } = await load('/src/sim/race.ts');
  const { spawnVehicle } = await load('/src/sim/mission.ts');
  const race = createGame(42, [0, 0, 0, 0]);
  const racer = race.players[0];
  const vehicle = spawnVehicle(race, 'pitbike', 5.5, 0, 15.5, 0);
  racer.riding = vehicle.id; vehicle.rider = racer.id; race.garages[0].built = true;
  openGates(race); assert.equal(race.race.phase, 'open'); startRace(race);
  assert.equal(race.race.phase, 'racing');
  for (let i = 0; i < (RACE.duration + 1) / DT; i++) step(race, {}, DT);
  assert.equal(race.race.phase, 'failed', 'race times out');
  startRace(race); assert.equal(race.race.remaining, RACE.duration, 'retry resets timer');
  vehicle.pos.z = RACE.finish - 1; step(race, {}, DT);
  assert.equal(race.race.phase, 'finished', 'crossing finish wins');
  const { trackAt, trackNear, TRACK_LENGTH } = await load('/src/sim/track.ts');
  assert.ok(TRACK_LENGTH > 550 && TRACK_LENGTH < 600);
  startRace(race);
  for (let i = 0; i < RACE.duration / DT && race.race.phase === 'racing'; i++) {
    const near = trackNear(vehicle.pos.x, vehicle.pos.z), target = trackAt(near.progress + 9);
    const desired = Math.atan2(-(target.x - vehicle.pos.x), -(target.z - vehicle.pos.z));
    const error = Math.atan2(Math.sin(desired - vehicle.yaw), Math.cos(desired - vehicle.yaw));
    const steer = Math.max(-0.65, Math.min(0.65, -error * 2));
    const throttle = vehicle.speed < 9.75 ? 1 : 0.18;
    const cmd = { ...emptyInput(), mx: -Math.sin(vehicle.yaw) * throttle + Math.cos(vehicle.yaw) * steer,
      mz: -Math.cos(vehicle.yaw) * throttle - Math.sin(vehicle.yaw) * steer };
    step(race, { [racer.id]: cmd }, DT);
  }
  assert.equal(race.race.phase, 'finished', '75% speed steering bot finishes curved road in time');
  const level2 = createGame(42, racer.look, 2);
  assert.equal(level2.garages[0].vehicle, 'scooter');
  assert.equal(level2.pickups.length, 4, 'next level has scooter parts');
  // Seawall, pier/jetty rails and gunwales keep walkers out of the water.
  const sea = [[10, -20], [-20, -25], [-10, -30], [3, -26], [28, -30], [16, -36], [-30, -16]].map(([x, z]) => ({ x, y: 0.9, z }));
  assert.deepEqual(findWalkPaths(makeCollider(level2), 60, levelDef(2).spawn, sea).map(Boolean), sea.map(() => false), 'harbor sea is not walkable');
  startRace(race); // finished races can be replayed through the test hook
  raceFinish(race); assert.equal(race.status, 'won');
  const voices = createGame(777, [0, 0, 0, 0]);
  const bun = voices.creatures[0];
  voices.creatures = [bun];
  const hit = kind => {
    voices.projectiles.push({ id: voices.nextId++, kind, owner: voices.players[0].id,
      pos: { x: bun.pos.x, y: bun.pos.y + 0.6, z: bun.pos.z }, vel: { x: 0, y: 0, z: 0 }, life: 2, scale: 1 });
    step(voices, {}, DT);
  };
  hit('sticky');
  assert.ok(bun.stuck > 0, 'sticky freezes a pyshka');
  hit('bouncy');
  assert.ok(bun.stuck <= 0 && bun.phrase >= 100 && bun.talk > 0 && bun.vel.y > 0, 'bouncy frees and launches with a flight shout');
  hit('sticky');
  for (let i = 0; i < 400; i++) step(voices, {}, DT);
  assert.ok(bun.stuck <= 0, 'glue wears off');
  const chat = createGame(777, [0, 0, 0, 0]);
  chat.creatures = chat.creatures.slice(0, 2);
  chat.creatures[0].pos = { x: 4, y: 0, z: 14 };
  chat.creatures[1].pos = { x: 4.8, y: 0, z: 14 };
  chat.tick = 420;
  step(chat, {}, DT);
  assert.equal(chat.creatures[0].chatPartner, chat.creatures[1].id, 'meeting pyshki pair up to chat');

  // Elevator carries a standing rider to mid floor and roof without jumping.
  const towerState = createGame(1234, [0, 0, 0, 0]);
  towerState.creatures = [];
  const rider = towerState.players[0];
  rider.pos = { x: 30.9075, y: 0.26, z: -26 };
  let reachedMid = false, reachedRoof = false;
  for (let i = 0; i < 1100; i++) {
    step(towerState, { [rider.id]: emptyInput() }, DT);
    reachedMid ||= Math.abs(rider.pos.y - 11.57) < 0.05;
    reachedRoof ||= Math.abs(rider.pos.y - 22.1325) < 0.05;
  }
  assert.ok(reachedMid && reachedRoof, 'standing elevator rider reaches both upper stops');
  assert.equal(towerState.pickups.length, 5, 'tower retains all five reachable bike parts');

  // Try a few hero builds, including the slowest / lowest-jumping legs, on both levels.
  for (const [level, look] of [
    [1, [0, 0, 0, 0]],
    [1, [3, 2, 5, 2]],
    [1, [5, 2, 4, 1]],
    [2, [0, 0, 0, 0]],
    [2, [5, 2, 4, 1]],
  ]) {
    const { spawn: PLAYER_SPAWN, mission: MISSION } = levelDef(level);
    const state = createGame(1234, look, level);
    state.creatures = []; // isolate the walk from pyshki shoving
    const player = state.players[0];
    const pid = player.id;

    // 1) Static path check from the spawn.
    const paths = findWalkPaths(makeCollider(state), state.world.half, PLAYER_SPAWN, MISSION.partSpots);
    paths.forEach((p, i) => assert.ok(p, `part ${i} (${JSON.stringify(MISSION.partSpots[i])}) is not reachable on foot`));

    // 2) Scripted walk using the real simulation.
    const walkTo = (goal, done, label) => {
      for (let attempt = 0; attempt < 4; attempt++) {
        const [path] = findWalkPaths(makeCollider(state), state.world.half, player.pos, [goal]);
        assert.ok(path, `${label}: no path from ${JSON.stringify(player.pos)}`);
        let wi = 0;
        for (let t = 0; t < 60 * 60 && wi < path.length; t++) {
          if (done()) return;
          const w = path[wi];
          const dx = w.x - player.pos.x;
          const dz = w.z - player.pos.z;
          const d = Math.hypot(dx, dz);
          if (d < 0.2) {
            wi++;
            continue;
          }
          if (player.grounded && player.pos.y < w.y - 0.6) break; // fell off: replan
          const k = Math.min(0.6, d * 2) / d;
          step(state, { [pid]: { ...emptyInput(0), mx: dx * k, mz: dz * k } }, DT);
        }
        // settle a moment at the end of the path
        for (let t = 0; t < 30 && !done(); t++) step(state, { [pid]: emptyInput(0) }, DT);
        if (done()) return;
      }
      assert.fail(`${label}: walked the path but did not get there (at ${JSON.stringify(player.pos)})`);
    };

    state.pickups.forEach((pk, i) => {
      walkTo({ ...MISSION.partSpots[i] }, () => pk.status !== 'world', `look ${look} part ${pk.part}`);
    });
    const g = state.garages[0];
    walkTo({ x: g.x, y: 0.9, z: g.z }, () => g.built, `look ${look} garage`);
    const total = MISSION.partSpots.length;
    assert.equal(g.delivered.length, total, `all ${total} parts delivered`);
    assert.equal(state.vehicles.length, 1, 'vehicle spawned');

    // 3) Mount and ride.
    const bike = state.vehicles[0];
    for (let t = 0; t < 60 && !(player.riding !== null); t++) {
      const dx = bike.pos.x - player.pos.x;
      const dz = bike.pos.z - player.pos.z;
      const d = Math.hypot(dx, dz) || 1;
      step(state, { [pid]: { ...emptyInput(0), mx: (dx / d) * 0.3, mz: (dz / d) * 0.3, interact: t % 10 === 0 } }, DT);
    }
    assert.equal(player.riding, bike.id, 'player is riding the bike');
    const fx = -Math.sin(bike.yaw);
    const fz = -Math.cos(bike.yaw);
    for (let t = 0; t < 30; t++) step(state, { [pid]: { ...emptyInput(0), mx: fx, mz: fz } }, DT);
    assert.ok(bike.speed > 0, `bike speed after throttle: ${bike.speed}`);
    console.log(`ok level ${level} look ${look.join('')}: ${total}/${total} parts walked & delivered, ${bike.kind} speed ${bike.speed.toFixed(2)} m/s`);
  }
} catch (e) {
  failed = true;
  console.error(e);
} finally {
  await server.close();
}
process.exit(failed ? 1 : 0);
