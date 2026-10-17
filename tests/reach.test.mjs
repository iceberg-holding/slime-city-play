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
    const before = race.creatures.map(c => ({ x: c.pos.x, z: c.pos.z }));
    step(race, { [racer.id]: cmd }, DT);
    // No pooled race creature may teleport while it is near/in front of the rider (user saw pyshki "jump").
    race.creatures.forEach((c, k) => {
      const jump = Math.hypot(c.pos.x - before[k].x, c.pos.z - before[k].z);
      if (jump < 3) return;
      const near = Math.hypot(before[k].x - vehicle.pos.x, before[k].z - vehicle.pos.z) < 60 || Math.hypot(c.pos.x - vehicle.pos.x, c.pos.z - vehicle.pos.z) < 60;
      const behind = trackNear(before[k].x, before[k].z).progress < trackNear(vehicle.pos.x, vehicle.pos.z).progress - 10;
      assert.ok(!near || behind, `creature ${k} relocated ${jump.toFixed(1)} m in view at tick ${i}`);
    });
  }
  assert.equal(race.race.phase, 'finished', '75% speed steering bot finishes curved road in time');
  console.log(`ok level 1 race: ${TRACK_LENGTH.toFixed(1)}m in ${race.winTime.toFixed(1)}s of ${RACE.duration}s`);
  {
    const { courseStars, COURSE1 } = await load('/src/sim/track.ts');
    const stars = courseStars(COURSE1), high = stars.map((st, i) => st.high ? i : -1).filter(i => i >= 0);
    assert.ok(stars.length >= 20 && high.length === COURSE1.jumps.length, `level 1 has ${stars.length} stars, ${high.length} high`);
    const gotHigh = race.race.stars.filter(i => stars[i].high).length;
    assert.ok(race.race.stars.length >= 10 && gotHigh >= 3, `bot collects stars incl. high ones over ramps (${race.race.stars.length}, high ${gotHigh})`);
    const { courseRings } = await load('/src/sim/track.ts');
    assert.ok(race.race.rings.length >= COURSE1.jumps.length - 1, `bot flies through the fire rings over every main ramp (${race.race.rings.length}/${courseRings(COURSE1).length})`);
    assert.ok(race.race.bonus >= race.race.rings.length * 3, 'each ring adds +3 s');
    console.log(`ok rings: bot flew through ${race.race.rings.length}/${courseRings(COURSE1).length}, bonus ${race.race.bonus.toFixed(0)} s`);
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
  // Hooligans dash onto the road when a rider comes close; a slime hit pays a one-time bonus.
  {
    const h = createGame(31, [0, 0, 0, 0]), hp = h.players[0];
    const hv = spawnVehicle(h, 'pitbike', 5.5, 0, 15.5, 0);
    hp.riding = hv.id; hv.rider = hp.id; ready(h); openGates(h); startRace(h);
    const at = trackAt(138); hv.pos = { x: at.x, y: 0, z: at.z }; hv.yaw = at.yaw; step(h, {}, DT); // hooligans of this section sit at 158 m
    const hool = h.creatures.filter(c => c.dash);
    assert.ok(hool.length >= 2, `race has hooligans (${hool.length})`);
    const me = trackNear(hv.pos.x, hv.pos.z).progress;
    const c = hool.filter(k => trackNear(k.pos.x, k.pos.z).progress > me).reduce((a, b) => (trackNear(a.pos.x, a.pos.z).progress < trackNear(b.pos.x, b.pos.z).progress ? a : b));
    { const cp = trackNear(c.pos.x, c.pos.z).progress, at2 = trackAt(cp - 12); hv.pos = { x: at2.x, y: 0, z: at2.z }; hv.yaw = at2.yaw; }
    const kerb = { ...c.pos };
    for (let i = 0; i < 40; i++) step(h, {}, DT);
    const road = trackNear(c.pos.x, c.pos.z), was = trackNear(kerb.x, kerb.z);
    assert.ok(road.distance < was.distance - 1, `hooligan runs onto the road (${was.distance.toFixed(1)} → ${road.distance.toFixed(1)} m from centre)`);
    const shoot = (kind) => { h.projectiles.push({ id: h.nextId++, kind, owner: hp.id, pos: { x: c.pos.x, y: c.pos.y + 0.6, z: c.pos.z }, vel: { x: 0, y: 0, z: 0 }, life: 2, scale: 1 }); step(h, {}, DT); };
    const before = h.race.bonus;
    shoot('bouncy');
    assert.equal(h.race.bonus - before, 2, 'bouncy hit on a hooligan: +2 s');
    assert.equal(h.race.hits, 1);
    shoot('sticky');
    assert.equal(h.race.bonus - before, 2, 'each hooligan pays only once per spot');
    console.log('ok hooligans: dash onto the road, +2 s bouncy hit, paid once');
  }
  // TRICK button: only in the air; a landed trick scores points + seconds; landing mid-trick is a bail.
  {
    const k = createGame(9, [0, 0, 0, 0]), kp = k.players[0];
    k.creatures = [];
    const kv = spawnVehicle(k, 'pitbike', 5.5, 0, 15.5, 0);
    kp.riding = kv.id; kv.rider = kp.id; ready(k); openGates(k); startRace(k);
    const run = (n, cmd = {}) => { const ev = []; for (let i = 0; i < n; i++) { step(k, { [kp.id]: { ...emptyInput(), ...cmd } }, DT); ev.push(...k.events); } return ev; };
    run(1, { trick: true });
    assert.equal(kv.trick, null, 'TRICK does nothing on the ground');
    run(1, { jump: true }); run(3);
    run(1, { jump: true });
    assert.equal(kv.trick, null, 'jump in the air no longer flips');
    const before = k.race.bonus;
    let ev = run(1, { trick: true });
    assert.equal(kv.trick, 'flip', 'TRICK in the air starts a backflip');
    ev = ev.concat(run(90));
    const landed = ev.find(e => e.type === 'trick');
    assert.ok(landed && landed.info.startsWith('flip|100|'), `landed flip scores (${landed?.info})`);
    assert.equal(k.race.points, 100); assert.equal(k.race.bonus - before, 2, 'landed trick: +2 s');
    // a late press on a small hop lands mid-roll
    run(1, { jump: true }); run(25);
    ev = run(1, { trick: true }).concat(run(60));
    assert.ok(ev.some(e => e.type === 'bail') && !ev.some(e => e.type === 'trick'), 'landing mid-trick is a bail');
    console.log('ok trick button: air-only, backflip +100 pts +2 s, late press bails');
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

  // Level 3 (old town): the battery is hidden in the clock room; only the tower's spiral stair leads up to it.
  {
    const { towerStair, OLDTOWN, inPond } = await load('/src/sim/oldtown.ts');
    const { Collider } = await load('/src/sim/physics.ts');
    const s3 = createGame(42, [0, 0, 0, 0], 3), def = levelDef(3), bi = def.mission.hint[0];
    assert.equal(s3.world.theme, 'oldtown');
    assert.equal(s3.garages[0].vehicle, 'drone');
    assert.equal(s3.pickups.length, 6, 'drone has six parts');
    assert.equal(s3.pickups[bi].part, 'battery');
    const T = OLDTOWN.tower, b = def.mission.partSpots[bi];
    assert.ok(b.x > T.minX && b.x < T.maxX && b.z > T.minZ && b.z < T.maxZ && b.y > T.floor, 'battery sits inside the clock room');
    const all = findWalkPaths(makeCollider(s3), s3.world.half, def.spawn, def.mission.partSpots);
    assert.ok(all.every(Boolean), `all six drone parts walkable: ${all.map(Boolean)}`);
    const ramps = towerStair().ramps.map(r => JSON.stringify(r)), noStair = new Collider(s3.world.solids.filter(x => !ramps.includes(JSON.stringify(x))));
    assert.equal(findWalkPaths(noStair, s3.world.half, def.spawn, [b])[0], null, 'without the spiral stair the battery is out of reach');
    // the hatch is the only way in: the walk path enters the room through the door gap on the south side
    const path = all[bi], inRoom = path.findIndex(p => p.z < T.maxZ - 0.4 && p.y > T.floor - 0.1);
    assert.ok(inRoom > 0 && path[inRoom - 1].x > T.door[0] && path[inRoom - 1].x < T.door[1], 'path goes through the hatch');
    assert.ok(inPond(-26, 0, -12) && !inPond(-22, 0.8, -10), 'pond water vs island');
    const pond = [[-27, -13], [-17, -6], [-16, -14]].map(([x, z]) => ({ x, y: 0.9, z }));
    assert.deepEqual(findWalkPaths(makeCollider(s3), 60, def.spawn, pond).map(Boolean), pond.map(() => false), 'pond water is not walkable');
    const swimmer = s3.players[0]; swimmer.pos = { x: -27, y: 0.1, z: -13 }; step(s3, {}, DT);
    assert.ok(Math.hypot(swimmer.pos.x - def.spawn.x, swimmer.pos.z - def.spawn.z) < 0.5, 'falling into the pond splashes back to the spawn');
    // the clock-tower pyshka gossips about the buzzing battery
    const hs = createGame(5, [0, 0, 0, 0], 3), hinter = hs.creatures.find(c => c.hinter);
    assert.ok(hinter, 'level 3 has a hint pyshka');
    hs.players[0].pos = { x: hinter.pos.x - 4, y: 0, z: hinter.pos.z };
    let said = false;
    for (let i = 0; i < 60 * 12 && !said; i++) { step(hs, {}, DT); said = hinter.phrase === HINT_PHRASE && hinter.talk > 0; }
    assert.ok(said, 'hint pyshka says the battery line');
    hs.pickups[bi].status = 'delivered'; hinter.talk = 0;
    let again = false;
    for (let i = 0; i < 60 * 12; i++) { step(hs, {}, DT); again ||= hinter.phrase === HINT_PHRASE && hinter.talk > 0; }
    assert.ok(!again, 'hint stops once the battery is found');
    console.log('ok level 3: six drone parts walkable, battery only via the tower stair and hatch, pond splash, hint pyshka');
  }

  // Drone flight: UP/DOWN climb and descend, hover when idle, soft ceiling, bounces off walls, joystick turns.
  {
    const f = createGame(8, [0, 0, 0, 0], 3), fp = f.players[0], def = levelDef(3);
    f.creatures = [];
    const g = def.mission.garage, dr = spawnVehicle(f, 'drone', g.x, 0, g.z, 0);
    fp.pos = { x: g.x + 1, y: 0, z: g.z }; step(f, { [fp.id]: { ...emptyInput(), interact: true } }, DT);
    assert.equal(fp.riding, dr.id, 'get on the drone like any vehicle');
    const fly = (n, cmd = {}) => { const ev = []; for (let i = 0; i < n; i++) { step(f, { [fp.id]: { ...emptyInput(), ...cmd } }, DT); ev.push(...f.events); } return ev; };
    fly(60, { up: true });
    assert.ok(dr.pos.y > 3 && !dr.grounded, `UP climbs (${dr.pos.y.toFixed(2)} m)`);
    fly(20); const hover = dr.pos.y; fly(90);
    assert.ok(Math.abs(dr.pos.y - hover) < 0.05, `hovers when idle (${hover.toFixed(2)} → ${dr.pos.y.toFixed(2)})`);
    fly(60 * 12, { up: true });
    const ceil = V.drone.ceiling;
    assert.ok(dr.pos.y <= ceil + 0.3 && dr.pos.y > ceil - 4, `soft altitude ceiling (${dr.pos.y.toFixed(2)} of ${ceil})`);
    fly(60 * 8, { down: true });
    assert.ok(dr.grounded && dr.pos.y < 0.01, 'DOWN lands on the ground');
    // forward flies along the heading, sideways turns
    fly(30, { up: true });
    const yaw0 = dr.yaw; fly(40, { mx: 1, mz: 0 });
    assert.ok(Math.abs(dr.yaw - yaw0) > 0.5, 'joystick sideways turns the drone');
    const x0 = dr.pos.x, z0 = dr.pos.z;
    fly(60, { mx: -Math.sin(dr.yaw), mz: -Math.cos(dr.yaw) });
    assert.ok(dr.speed > 5 && Math.hypot(dr.pos.x - x0, dr.pos.z - z0) > 3, `joystick forward flies (${dr.speed.toFixed(1)} m/s)`);
    // fly at a house wall at full speed: bonk, bounce back, never inside
    const T = (await load('/src/sim/oldtown.ts')).OLDTOWN.tower;
    dr.pos = { x: T.x, y: 3, z: T.maxZ + 8 }; dr.vel = { x: 0, y: 0, z: 0 }; dr.yaw = 0;
    let bonk = false, inside = false, back = false;
    for (let i = 0; i < 150; i++) {
      const ev = fly(1, { mx: 0, mz: -1 });
      bonk ||= ev.some(e => e.type === 'bonk');
      back ||= dr.vel.z > 1;
      inside ||= !!makeCollider(f).pointInside(dr.pos.x, dr.pos.y + 0.5, dr.pos.z);
    }
    assert.ok(bonk && back && !inside, `bumping the tower bounces (bonk ${bonk}, back ${back}, inside ${inside})`);
    // soft walls keep it in the area outside races
    dr.pos = { x: def.bounds.maxX - 1, y: 12, z: 0 }; dr.yaw = -Math.PI / 2;
    fly(60 * 6, { mx: 1, mz: 0, up: false });
    for (let i = 0; i < 60 * 6; i++) fly(1, { mx: -Math.sin(dr.yaw), mz: -Math.cos(dr.yaw) });
    assert.ok(dr.pos.x < def.bounds.maxX + 2.1 && dr.pos.x > def.bounds.minX - 2.1 && dr.pos.z < def.bounds.maxZ + 2.1 && dr.pos.z > def.bounds.minZ - 2.1, `soft walls keep the drone in the area (${dr.pos.x.toFixed(1)}, ${dr.pos.z.toFixed(1)})`);
    // get off in the air: you drop, the drone sinks down unpowered
    dr.pos = { x: 0, y: 6, z: 0 }; dr.vel = { x: 0, y: 0, z: 0 }; fly(2);
    fly(1, { interact: true });
    assert.equal(fp.riding, null, 'get off mid-air');
    fly(60 * 4);
    assert.ok(fp.grounded && fp.pos.y < 0.01 && dr.grounded && dr.pos.y < 0.01, 'rider and drone both come down');
    console.log('ok drone flight: climb, hover, soft ceiling, land, turn, forward, wall bounce, soft walls, get off mid-air');
  }

  // Level 3 flight race: a flying steering bot (heading + altitude along the guide) finishes, flies through the
  // rings and collects stars; hooligans spring up from the roofs; medals ladder; route is clear of scenery.
  {
    const { courseAt, courseNear, courseHeightAt, courseRings, courseStars } = await load('/src/sim/track.ts');
    const def = levelDef(3), course = def.race.course;
    assert.ok(course.air && course.length > 700 && course.length < 820, `flight course ${course.length}`);
    const s3 = createGame(42, [0, 0, 0, 0], 3), p3 = s3.players[0];
    assert.ok(s3.world.raceSolids.length > 200, 'flight course has scenery collision');
    // the guide line is flyable: no solid in the drone's way anywhere along it
    s3.race.phase = 'racing';
    const col = makeCollider(s3);
    for (let d = 0; d <= course.length; d += 1.5) {
      const p = courseAt(course, d), y = courseHeightAt(course, d);
      assert.ok(!col.blocked(p.x, p.z, y, V.drone.radius, V.drone.height) && col.groundAt(p.x, p.z, y + 0.4, V.drone.radius) <= y + 0.01, `route clear at ${d.toFixed(1)} m`);
    }
    s3.race.phase = 'locked';
    for (const r of courseRings(course)) assert.ok(!col.pointInside(r.x, r.y, r.z), 'ring in open air');
    const stars = courseStars(course);
    assert.ok(stars.length >= 18 && stars.some(st => st.high) && stars.some(st => st.y < courseHeightAt(course, st.d)), `stars high and low (${stars.length})`);
    const dr = spawnVehicle(s3, 'drone', def.mission.garage.x, 0, def.mission.garage.z, 0);
    p3.riding = dr.id; dr.rider = p3.id; ready(s3);
    step(s3, {}, DT); assert.equal(s3.race.phase, 'open', 'gate opens once the drone is ready');
    const t = def.race.trigger; dr.pos = { x: (t.minX + t.maxX) / 2, y: 4, z: (t.minZ + t.maxZ) / 2 }; step(s3, {}, DT);
    assert.equal(s3.race.phase, 'racing', 'flying through the gate starts the flight race');
    assert.ok(Math.abs(dr.pos.y - courseHeightAt(course, 0)) < 0.5, 'race starts hovering at the start line');
    let sprang = 0;
    const top = V.drone.maxSpeed * 0.75;
    for (let i = 0; i < (def.race.duration + 1) / DT && s3.race.phase === 'racing'; i++) {
      const near = courseNear(course, dr.pos.x, dr.pos.z), target = courseAt(course, near.progress + 8), want = courseHeightAt(course, near.progress + 5);
      const desired = Math.atan2(-(target.x - dr.pos.x), -(target.z - dr.pos.z));
      const error = Math.atan2(Math.sin(desired - dr.yaw), Math.cos(desired - dr.yaw));
      const steer = Math.max(-1, Math.min(1, -error * 2.5)), throttle = Math.hypot(dr.vel.x, dr.vel.z) < top ? 1 : 0.2;
      step(s3, { [p3.id]: { ...emptyInput(), up: dr.pos.y < want - 0.15, down: dr.pos.y > want + 0.15,
        mx: -Math.sin(dr.yaw) * throttle + Math.cos(dr.yaw) * steer, mz: -Math.cos(dr.yaw) * throttle - Math.sin(dr.yaw) * steer } }, DT);
      sprang = Math.max(sprang, ...s3.creatures.filter(c => c.dash?.bounce).map(c => c.vel.y));
    }
    assert.equal(s3.race.phase, 'finished', `flying bot finishes (${s3.race.remaining.toFixed(1)} s left, at ${JSON.stringify(dr.pos)})`);
    const rings = courseRings(course).length;
    assert.ok(s3.race.rings.length >= rings - 1, `bot flies through the rings (${s3.race.rings.length}/${rings})`);
    assert.ok(s3.race.stars.length >= 6, `bot collects stars (${s3.race.stars.length}/${stars.length})`);
    assert.ok(sprang > 5, 'rooftop hooligans spring up at the drone');
    const m = def.race.medals;
    assert.ok(m.gold < m.silver && m.silver < def.race.duration, `medal ladder ${JSON.stringify(m)} < ${def.race.duration}`);
    console.log(`ok level 3 flight race: ${course.length.toFixed(1)}m in ${s3.winTime.toFixed(1)}s of ${def.race.duration}s, rings ${s3.race.rings.length}/${rings}, stars ${s3.race.stars.length}/${stars.length}, medals ${m.gold}/${m.silver}`);
    // a hooligan hit pays bonus seconds once
    startRace(s3);
    const c = s3.creatures.find(k => k.dash?.bounce);
    assert.ok(c, 'flight race has hooligans');
    const before = s3.race.bonus;
    s3.projectiles.push({ id: s3.nextId++, kind: 'bouncy', owner: p3.id, pos: { x: c.pos.x, y: c.pos.y + 0.6, z: c.pos.z }, vel: { x: 0, y: 0, z: 0 }, life: 2, scale: 1 });
    step(s3, {}, DT);
    assert.equal(s3.race.bonus - before, 2, 'slime hit on a rooftop hooligan: +2 s');
  }

  // Try a few hero builds, including the slowest / lowest-jumping legs, on all levels.
  for (const [level, look] of [
    [1, [0, 0, 0, 0]],
    [1, [3, 2, 5, 2]],
    [1, [5, 2, 4, 1]],
    [2, [0, 0, 0, 0]],
    [2, [5, 2, 4, 1]],
    [3, [0, 0, 0, 0]],
    [3, [5, 2, 4, 1]],
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
