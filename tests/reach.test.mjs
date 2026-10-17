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
  const { DT, HINT_PHRASE } = await load('/src/sim/constants.ts');
  const { VEHICLES: V } = await load('/src/sim/vehicles.ts');
  const { TOWER } = await load('/src/sim/tower.ts');
  // Test shortcut: a fully assembled vehicle with every accessory fitted.
  const ready = (s) => { const g = s.garages[0]; g.built = true; g.delivered = V[g.vehicle].parts.map(p => p.id); };

  const { openGates, startRace, raceFinish, RACE } = await load('/src/sim/race.ts');
  const { spawnVehicle } = await load('/src/sim/mission.ts');
  const race = createGame(42, [0, 0, 0, 0]);
  const racer = race.players[0];
  const vehicle = spawnVehicle(race, 'pitbike', 5.5, 0, 15.5, 0);
  racer.riding = vehicle.id; vehicle.rider = racer.id; ready(race);
  openGates(race); assert.equal(race.race.phase, 'open'); startRace(race);
  assert.equal(race.race.phase, 'racing');
  for (let i = 0; i < (RACE.duration + 1) / DT; i++) step(race, {}, DT);
  assert.equal(race.race.phase, 'failed', 'race times out');
  startRace(race); assert.equal(race.race.remaining, RACE.duration, 'retry resets timer');
  vehicle.pos.z = RACE.finish - 1; step(race, {}, DT);
  assert.equal(race.race.phase, 'finished', 'crossing finish wins');
  const { trackAt, trackNear, TRACK_LENGTH } = await load('/src/sim/track.ts');
  assert.ok(TRACK_LENGTH > 820 && TRACK_LENGTH < 900, `level 1 course ${TRACK_LENGTH}`);
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
  console.log(`ok level 1 race: ${TRACK_LENGTH.toFixed(1)}m in ${race.winTime.toFixed(1)}s of ${RACE.duration}s`);
  {
    const { courseStars, COURSE1 } = await load('/src/sim/track.ts');
    const stars = courseStars(COURSE1), high = stars.map((st, i) => st.high ? i : -1).filter(i => i >= 0);
    assert.ok(stars.length >= 20 && high.length === COURSE1.jumps.length, `level 1 has ${stars.length} stars, ${high.length} high`);
    const gotHigh = race.race.stars.filter(i => stars[i].high).length;
    assert.ok(race.race.stars.length >= 10 && gotHigh >= 3, `bot collects stars incl. high ones over ramps (${race.race.stars.length}, high ${gotHigh})`);
    console.log(`ok stars: bot collected ${race.race.stars.length}/${stars.length}, ${gotHigh}/${high.length} high`);
    // A plain hop on flat road under a high star never reaches it.
    startRace(race);
    const st = stars[high[1]];
    vehicle.pos = { x: st.x, y: 0, z: st.z }; vehicle.vel = { x: 0, y: 0, z: 0 }; vehicle.speed = 0; vehicle.grounded = true;
    step(race, { [racer.id]: { ...emptyInput(), jump: true } }, DT);
    for (let i = 0; i < 90; i++) step(race, {}, DT);
    assert.ok(!race.race.stars.includes(high[1]), 'high star is out of reach of a standing hop');
  }
  // Level 2: the scooter's own coastal course, same 75%-speed steering bot.
  {
    const { courseAt, courseNear } = await load('/src/sim/track.ts');
    const { VEHICLES } = await load('/src/sim/vehicles.ts');
    const def = levelDef(2), course = def.race.course, top = VEHICLES.scooter.maxSpeed * 0.75;
    assert.ok(course.length > 720 && course.length < 820, `level 2 course length ${course.length}`);
    for (const seed of [42, 7]) {
      const s2 = createGame(seed, [0, 0, 0, 0], 2), p2 = s2.players[0];
      const sc = spawnVehicle(s2, 'scooter', def.mission.garage.x, 0, def.mission.garage.z, 0);
      p2.riding = sc.id; sc.rider = p2.id; ready(s2);
      // Ride into the harbor gate trigger to start, as a player would.
      step(s2, {}, DT); assert.equal(s2.race.phase, 'open');
      const t = def.race.trigger; sc.pos = { x: (t.minX + t.maxX) / 2, y: 0, z: (t.minZ + t.maxZ) / 2 }; step(s2, {}, DT);
      assert.equal(s2.race.phase, 'racing', 'harbor gate starts the coastal race');
      let airborne = 0, maxY = 0;
      for (let i = 0; i < (def.race.duration + 1) / DT && s2.race.phase === 'racing'; i++) {
        const near = courseNear(course, sc.pos.x, sc.pos.z), target = courseAt(course, near.progress + 9);
        const desired = Math.atan2(-(target.x - sc.pos.x), -(target.z - sc.pos.z));
        const error = Math.atan2(Math.sin(desired - sc.yaw), Math.cos(desired - sc.yaw));
        const steer = Math.max(-0.65, Math.min(0.65, -error * 2)), throttle = sc.speed < top ? 1 : 0.18;
        step(s2, { [p2.id]: { ...emptyInput(), mx: -Math.sin(sc.yaw) * throttle + Math.cos(sc.yaw) * steer, mz: -Math.cos(sc.yaw) * throttle - Math.sin(sc.yaw) * steer } }, DT);
        if (!sc.grounded) airborne++;
        maxY = Math.max(maxY, sc.pos.y);
        assert.ok(sc.pos.y > -1, 'scooter stays on the course');
      }
      assert.equal(s2.race.phase, 'finished', `scooter bot finishes level 2 (seed ${seed}, ${s2.race.remaining.toFixed(1)}s left, at ${JSON.stringify(sc.pos)})`);
      assert.ok(airborne > 30 && maxY < 3, `scooter takes small jumps (air frames ${airborne}, max height ${maxY.toFixed(2)})`);
      console.log(`ok level 2 race seed ${seed}: ${course.length.toFixed(1)}m in ${s2.winTime.toFixed(1)}s of ${def.race.duration}s, max jump ${maxY.toFixed(2)}m`);
    }
  }
  // Medals by finish time; bonus seconds extend the clock and shorten the finish time.
  {
    const { medalFor } = await load('/src/sim/levels.ts');
    const { addBonus } = await load('/src/sim/race.ts');
    for (const level of [1, 2]) {
      const r = levelDef(level).race;
      assert.ok(r.medals.gold < r.medals.silver && r.medals.silver < r.duration, `level ${level} medal ladder ${JSON.stringify(r.medals)} < ${r.duration}`);
      assert.equal(medalFor(r, r.medals.gold), 'gold'); assert.equal(medalFor(r, r.medals.gold + 1), 'silver');
      assert.equal(medalFor(r, r.medals.silver + 1), 'bronze');
    }
    startRace(race);
    for (let i = 0; i < 600; i++) step(race, {}, DT);
    const before = race.race.remaining;
    addBonus(race, 3, 0, 0, 0, 'ring');
    assert.ok(Math.abs(race.race.remaining - before - 3) < 1e-9 && race.events.some(e => e.type === 'bonus'), 'bonus adds to the clock');
    step(race, {}, DT); raceFinish(race);
    assert.ok(Math.abs(race.winTime - (race.race.elapsed - 3)) < 1e-9, `finish time subtracts bonus (${race.winTime})`);
  }
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
  assert.equal(towerState.pickups.length, 6, 'level 1 has six bike parts');

  // Flashlight: on the tower's mid floor, reachable from the elevator stop but never on foot from the spawn.
  {
    const s = createGame(42, [0, 0, 0, 0]), def = levelDef(1), fi = def.mission.liftOnly[0];
    assert.equal(s.pickups[fi].part, 'flashlight');
    assert.equal(findWalkPaths(makeCollider(s), s.world.half, def.spawn, [def.mission.partSpots[fi]])[0], null, 'flashlight is not reachable by walking');
    for (const y of [0.26, TOWER.roof]) {
      s.elevator.y = y;
      assert.equal(findWalkPaths(makeCollider(s), s.world.half, { x: TOWER.liftX, y, z: TOWER.z }, [def.mission.partSpots[fi]])[0], null, `flashlight not reachable from the stop at ${y}`);
    }
    s.elevator.y = TOWER.mid;
    assert.ok(findWalkPaths(makeCollider(s), s.world.half, { x: TOWER.liftX, y: TOWER.mid, z: TOWER.z }, [def.mission.partSpots[fi]])[0], 'flashlight reachable from the mid-floor elevator stop');
    // Five parts build a rideable bike, but the gate stays locked until the headlight is fitted.
    const g = s.garages[0], p = s.players[0];
    s.pickups.forEach((pk, i) => { if (i !== fi) { pk.status = 'carried'; pk.carrier = p.id; } });
    p.pos = { x: g.x, y: 0, z: g.z }; step(s, {}, DT);
    assert.ok(g.built && s.vehicles.length === 1, 'bike assembles without the flashlight');
    const bike = s.vehicles[0]; bike.rider = p.id; p.riding = bike.id;
    const t = def.race.trigger; bike.pos = { x: (t.minX + t.maxX) / 2, y: 0, z: t.maxZ + 3 };
    for (let i = 0; i < 30; i++) step(s, {}, DT);
    assert.equal(s.race.phase, 'locked', 'gate stays locked without the headlight');
    s.pickups[fi].status = 'carried'; s.pickups[fi].carrier = p.id;
    bike.pos = { x: g.x, y: 0, z: g.z }; step(s, {}, DT);
    assert.ok(g.delivered.includes('flashlight'), 'flashlight fitted at the garage');
    assert.equal(s.race.phase, 'open', 'gate opens once the headlight is on');
    // The lobby pyshka gossips about the lost flashlight when you come close.
    const hs = createGame(5, [0, 0, 0, 0]), hinter = hs.creatures.find(c => c.hinter);
    assert.ok(hinter, 'level 1 has a hint pyshka');
    hs.players[0].pos = { x: hinter.pos.x - 4, y: 0, z: hinter.pos.z };
    let said = false;
    for (let i = 0; i < 60 * 12 && !said; i++) { step(hs, {}, DT); said = hinter.phrase === HINT_PHRASE && hinter.talk > 0; }
    assert.ok(said, 'hint pyshka says the flashlight line');
    console.log('ok flashlight: elevator-only, bike builds with 5/6, gate locked until headlight, hint pyshka talks');
  }

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

    // 1) Static path check from the spawn (elevator-only parts are checked separately above).
    const lift = MISSION.liftOnly ?? [];
    const paths = findWalkPaths(makeCollider(state), state.world.half, PLAYER_SPAWN, MISSION.partSpots);
    paths.forEach((p, i) => lift.includes(i) || assert.ok(p, `part ${i} (${JSON.stringify(MISSION.partSpots[i])}) is not reachable on foot`));

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
      if (lift.includes(i)) {
        // walk onto the elevator platform, ride it up to the mid floor, then walk over
        const toLift = () => Math.hypot(player.pos.x - TOWER.liftX, player.pos.z - TOWER.z);
        walkTo({ x: TOWER.liftX, y: state.elevator.y + 0.9, z: TOWER.z }, () => toLift() < 1.4, `look ${look} elevator`);
        for (let t = 0; t < 120 && toLift() > 0.2; t++) {
          const d = toLift();
          step(state, { [pid]: { ...emptyInput(0), mx: (TOWER.liftX - player.pos.x) / d * Math.min(0.6, d * 2), mz: (TOWER.z - player.pos.z) / d * Math.min(0.6, d * 2) } }, DT);
        }
        for (let t = 0; t < 60 * 20 && Math.abs(player.pos.y - TOWER.mid) > 0.05; t++) step(state, { [pid]: emptyInput(0) }, DT);
        assert.ok(Math.abs(player.pos.y - TOWER.mid) < 0.05, 'elevator carries the walker to the mid floor');
      }
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
