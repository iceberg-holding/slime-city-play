import { raceOf, updateRace } from './race';
import { levelDef } from './levels';
import { wet } from './harbor';
import { TOWER, liftSolid, updateLift } from './tower';
import {
  BUBBLE_TIME,
  HINT_PHRASE,
  CREATURE_CROWD_SPEED,
  CREATURE_HEIGHT,
  CREATURE_RADIUS,
  CREATURE_WANDER_SPEED,
  CROWD_RADIUS,
  CROWD_START,
  CROWD_STOP,
  JUMP_VEL,
  KNOCKBACK,
  MAX_PADS,
  PAD_LAUNCH,
  PAD_LIFE,
  PAD_RADIUS,
  PHRASE_COUNT,
  PLAYER_HEIGHT,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  SHOVE,
  STEP_UP,
} from './constants';
import { heroStats } from './hero';
import { Collider, blockSolid, moveBody, topAt } from './physics';
import { rand, randRange } from './rng';
import { newRaceState, type Block, type Body, type Creature, type GameEvent, type GameState, type InputCommand, type Look, type Player, type ProjectileKind } from './types';
import { interact, missionComplete, setupMission, syncRider, updatePickups, updateVehicle } from './mission';

export function createGame(seed: number, look: Look, level = 1): GameState {
  const def = levelDef(level);
  const state: GameState = {
    level, race: newRaceState(),
    elevator: { y: 0.26, target: 0, wait: 2 },
    tick: 0,
    time: 0,
    rng: seed | 0,
    nextId: 1,
    world: def.createWorld(),
    players: [],
    creatures: [],
    projectiles: [],
    pads: [],
    blocks: [],
    pickups: [],
    garages: [],
    vehicles: [],
    rideTime: 0,
    tricks: 0,
    splats: [],
    events: [],
    status: 'playing',
    winTime: 0,
  };
  addPlayer(state, look);
  const spawns = [...def.creatureSpawns, ...(def.hintSpawn ? [def.hintSpawn] : [])];
  spawns.forEach((sp, i) => {
    const c: Creature = {
      id: state.nextId++,
      seed: Math.floor(rand(state) * 1e9),
      pos: { x: sp.x, y: 0, z: sp.z },
      vel: { x: 0, y: 0, z: 0 },
      grounded: true,
      radius: CREATURE_RADIUS,
      height: CREATURE_HEIGHT,
      padCd: 0,
      yaw: rand(state) * Math.PI * 2,
      home: { x: sp.x, z: sp.z },
      target: { x: sp.x, z: sp.z },
      mode: 'wander',
      thinkTimer: 0,
      stuck: 0,
      hitCd: 0,
      hopCd: 0,
      orbit: rand(state) * Math.PI * 2,
      orbitDir: rand(state) < 0.5 ? 1 : -1,
      blocker: state.creatures.length % 2 === 1,
      talk: 0,
      phrase: 0,
      talkCd: randRange(state, 0.5, 3),
      chatUntil: 0, chatPartner: null,
      twirl: 0,
      hinter: i >= def.creatureSpawns.length,
    };
    state.creatures.push(c);
  });
  setupMission(state);
  return state;
}

export function addPlayer(state: GameState, look: Look): Player {
  const p: Player = {
    id: state.nextId++,
    look,
    pos: { ...levelDef(state.level).spawn },
    vel: { x: 0, y: 0, z: 0 },
    grounded: true,
    radius: PLAYER_RADIUS,
    height: PLAYER_HEIGHT,
    padCd: 0,
    yaw: 0,
    shape: 'cube',
    fireCd: 0,
    stun: 0,
    jumpBuffer: 0,
    walkPhase: 0,
    riding: null,
    stats: heroStats(look),
  };
  state.players.push(p);
  return p;
}

function emit(state: GameState, type: GameEvent['type'], x: number, y: number, z: number, who?: number) {
  state.events.push({ type, x, y, z, who });
}

export function makeCollider(state: GameState): Collider {
  const def = levelDef(state.level), gate = raceOf(state)?.gate;
  return new Collider([...state.world.solids, ...(state.race.phase === 'locked' && gate ? [gate] : [])], [...state.blocks.map(blockSolid), ...(def.tower ? [liftSolid(state.elevator.y)] : [])]);
}

/** Advance the simulation by dt seconds. `inputs` is keyed by player id. */
export function step(state: GameState, inputs: Record<number, InputCommand>, dt: number): void {
  state.events = [];
  state.tick++;
  // after winning the world keeps running (so the trick can land), but the clock stops
  if (state.status === 'playing') state.time += dt;
  if (levelDef(state.level).tower) updateLift(state, inputs, dt);
  const col = makeCollider(state);

  for (const p of state.players) {
    const inp = inputs[p.id];
    if (inp) handlePlayerActions(state, p, inp, col);
  }
  for (const v of state.vehicles) {
    const rider = v.rider !== null ? state.players.find((p) => p.id === v.rider) : undefined;
    updateVehicle(state, v, rider ? inputs[rider.id] : undefined, dt, col);
  }
  for (const p of state.players) {
    if (p.riding !== null) {
      p.fireCd -= dt;
      p.stun = 0;
      syncRider(state, p);
    } else updatePlayer(state, p, inputs[p.id], dt, col);
  }
  for (const c of state.creatures) updateCreature(state, c, dt, col);
  updateProjectiles(state, dt, col);
  updatePads(state, dt);
  updatePickups(state);

  for (const s of state.splats) s.life -= dt;
  state.splats = state.splats.filter((s) => s.life > 0);

  updateRace(state, dt);
  if (!raceOf(state) && state.status === 'playing' && missionComplete(state)) {
    state.status = 'won';
    state.winTime = state.time;
    emit(state, 'win', 0, 0, 0);
  }
}

function forward(yaw: number): [number, number] {
  return [-Math.sin(yaw), -Math.cos(yaw)];
}

function handlePlayerActions(state: GameState, p: Player, inp: InputCommand, col: Collider) {
  if (inp.interact) interact(state, p, col);
  if (inp.toggleShape) p.shape = p.shape === 'cube' ? 'ramp' : 'cube';
  if (inp.jump && p.riding === null) p.jumpBuffer = 0.15;
  if (p.fireCd <= 0 && (inp.sticky || inp.bouncy)) {
    fire(state, p, inp.sticky ? 'sticky' : 'bouncy', inp.aimYaw);
  }
  if (inp.place && p.riding === null) placeBlock(state, p, inp.aimYaw, col);
}

export function fire(state: GameState, p: Player, kind: ProjectileKind, aimYaw: number) {
  if (p.riding !== null) aimYaw = state.vehicles.find(v => v.id === p.riding)?.yaw ?? aimYaw;
  const st = p.stats;
  p.fireCd = st.fireCooldown;
  p.yaw = aimYaw;
  for (let i = 0; i < st.multishot; i++) {
    const yaw = aimYaw + (i - (st.multishot - 1) / 2) * 0.12;
    shoot(state, p, kind, yaw);
  }
}

function shoot(state: GameState, p: Player, kind: ProjectileKind, yaw: number) {
  const st = p.stats;
  const [fx, fz] = forward(yaw);
  const ox = p.pos.x + fx * 0.6 + -fz * 0.3;
  const oy = p.pos.y + 1.1;
  const oz = p.pos.z + fz * 0.6 + fx * 0.3;
  let vx: number;
  let vy: number;
  let vz: number;
  if (kind === 'sticky') {
    // gentle aim assist: lock onto the closest awake pyshka in a forward cone
    let best: Creature | null = null;
    let bestD = st.aimRange;
    for (const c of state.creatures) {
      if (c.stuck > 0) continue;
      const dx = c.pos.x - p.pos.x;
      const dz = c.pos.z - p.pos.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.5 || d > bestD) continue;
      const dot = (dx * fx + dz * fz) / d;
      if (dot < st.aimCone) continue;
      best = c;
      bestD = d;
    }
    const speed = 22 * st.projSpeed;
    if (best) {
      const tx = best.pos.x - ox;
      const ty = best.pos.y + 0.5 - oy;
      const tz = best.pos.z - oz;
      const d = Math.hypot(tx, ty, tz);
      const t = d / speed;
      vx = (tx / d) * speed;
      vy = (ty / d) * speed + 0.5 * STICKY_GRAVITY * t;
      vz = (tz / d) * speed;
    } else {
      vx = fx * speed;
      vy = 2.5;
      vz = fz * speed;
    }
  } else {
    const speed = 12 * st.projSpeed;
    vx = fx * speed;
    vy = 5;
    vz = fz * speed;
  }
  state.projectiles.push({
    id: state.nextId++,
    kind,
    owner: p.id,
    pos: { x: ox, y: oy, z: oz },
    vel: { x: vx + p.vel.x * 0.3, y: vy, z: vz + p.vel.z * 0.3 },
    life: 3,
    scale: kind === 'sticky' ? st.blobScale : 1,
  });
  emit(state, 'shoot', ox, oy, oz, p.id);
}

const STICKY_GRAVITY = 6;
const BOUNCY_GRAVITY = 16;

function dirFromYaw(yaw: number): 0 | 1 | 2 | 3 {
  const [fx, fz] = forward(yaw);
  if (Math.abs(fx) > Math.abs(fz)) return fx > 0 ? 0 : 2;
  return fz > 0 ? 1 : 3;
}

export interface Placement {
  x: number;
  y: number;
  z: number;
  dir: 0 | 1 | 2 | 3;
  ok: boolean;
}

/** Where a block placed by `p` would go (grid cell in front, on the surface below). */
export function computePlacement(state: GameState, p: Player, aimYaw: number, col: Collider): Placement {
  const dir = dirFromYaw(aimYaw);
  const dx = dir === 0 ? 1 : dir === 2 ? -1 : 0;
  const dz = dir === 1 ? 1 : dir === 3 ? -1 : 0;
  const cx = Math.floor(p.pos.x + dx * 1.4);
  const cz = Math.floor(p.pos.z + dz * 1.4);
  const half = state.world.half;
  const base = col.groundAt(cx + 0.5, cz + 0.5, p.pos.y + 1.2, 0.45);
  const by = Math.round(base * 1000) / 1000;
  const res: Placement = { x: cx, y: by, z: cz, dir, ok: false };
  if (Math.abs(cx + 0.5) > half - 0.5 || Math.abs(cz + 0.5) > half - 0.5) return res;
  // Anything occupying the cell's volume?
  for (const list of [col.statics, col.dynamics]) {
    for (const s of list) {
      if (s.maxX <= cx + 0.01 || s.minX >= cx + 0.99 || s.maxZ <= cz + 0.01 || s.minZ >= cz + 0.99) continue;
      if (s.minY >= by + 1 - 0.01) continue;
      if (topAt(s, cx + 0.5, cz + 0.5) <= by + 0.01) continue;
      return res;
    }
  }
  // Don't trap bodies inside the new block.
  const bodies: Body[] = [...state.players, ...state.creatures];
  for (const b of bodies) {
    if (b.pos.x + b.radius > cx && b.pos.x - b.radius < cx + 1 && b.pos.z + b.radius > cz && b.pos.z - b.radius < cz + 1) {
      if (b.pos.y < by + 1 - 0.01 && b.pos.y + b.height > by) return res;
    }
  }
  res.ok = true;
  return res;
}

export function placeBlock(state: GameState, p: Player, aimYaw: number, col: Collider): boolean {
  const pl = computePlacement(state, p, aimYaw, col);
  p.yaw = aimYaw;
  if (!pl.ok) {
    emit(state, 'noroom', pl.x + 0.5, pl.y + 0.5, pl.z + 0.5, p.id);
    return false;
  }
  if (state.blocks.length >= p.stats.maxBlocks) state.blocks.shift(); // recycle the oldest block
  const blk: Block = { id: state.nextId++, shape: p.shape, x: pl.x, y: pl.y, z: pl.z, dir: pl.dir };
  state.blocks.push(blk);
  col.dynamics = state.blocks.map(blockSolid);
  emit(state, 'block', pl.x + 0.5, pl.y + 0.5, pl.z + 0.5, p.id);
  return true;
}

function checkPad(state: GameState, b: Body, id: number, launch = 1) {
  if (b.padCd > 0 || b.vel.y > 0.5) return;
  for (const pad of state.pads) {
    const dx = b.pos.x - pad.pos.x;
    const dz = b.pos.z - pad.pos.z;
    if (dx * dx + dz * dz > (PAD_RADIUS * pad.scale + b.radius * 0.5) ** 2) continue;
    if (Math.abs(b.pos.y - pad.pos.y) > 0.35) continue;
    b.vel.y = PAD_LAUNCH * launch;
    b.grounded = false;
    b.padCd = 0.4;
    pad.squish = 1;
    const creature = state.creatures.find(c => c.id === id);
    if (creature) { creature.phrase = 100 + Math.floor(rand(state) * 3); creature.talk = 3; creature.stuck = 0; }
    emit(state, 'bounce', pad.pos.x, pad.pos.y, pad.pos.z, id);
    return;
  }
}

function updatePlayer(state: GameState, p: Player, inp: InputCommand | undefined, dt: number, col: Collider) {
  const st = p.stats;
  p.fireCd -= dt;
  p.padCd -= dt;
  p.jumpBuffer -= dt;
  p.stun -= dt;
  let mx = inp ? inp.mx : 0;
  let mz = inp ? inp.mz : 0;
  const len = Math.hypot(mx, mz);
  if (len > 1) {
    mx /= len;
    mz /= len;
  }
  const control = p.stun > 0 ? 0 : 1;
  const accel = (p.grounded ? 40 : 12) * control;
  const water = levelDef(state.level).tower && p.pos.y >= TOWER.roof - 0.2 && p.pos.y < TOWER.roof + 0.5 && ((p.pos.x > 22.5 && p.pos.x < 26.5 && p.pos.z > -29.2 && p.pos.z < -27) || Math.hypot(p.pos.x - 27.755, p.pos.z + 28.21) < 0.8);
  if (water && len > 0.1 && state.tick % 18 === 0) emit(state, 'splat', p.pos.x, p.pos.y + 0.2, p.pos.z);
  const tvx = mx * PLAYER_SPEED * st.speed * (water ? 0.4 : 1);
  const tvz = mz * PLAYER_SPEED * st.speed * (water ? 0.4 : 1);
  p.vel.x += clampMag(tvx - p.vel.x, accel * dt);
  p.vel.z += clampMag(tvz - p.vel.z, accel * dt);
  if (control === 0 && p.grounded) {
    p.vel.x *= 0.92;
    p.vel.z *= 0.92;
  }
  if (len > 0.1 && control) {
    p.yaw = turnToward(p.yaw, Math.atan2(-mx, -mz), dt * 12);
  }
  if (p.jumpBuffer > 0 && p.grounded && p.stun <= 0) {
    p.vel.y = JUMP_VEL * st.jump;
    p.grounded = false;
    p.jumpBuffer = 0;
    emit(state, 'jump', p.pos.x, p.pos.y, p.pos.z, p.id);
  }
  moveBody(p, dt, col, state.world.half);
  checkPad(state, p, p.id, st.padLaunch);
  if (p.grounded) p.walkPhase += Math.hypot(p.vel.x, p.vel.z) * dt * 1.6;
  const splash = wet(state, p.pos.x, p.pos.y, p.pos.z);
  if (p.pos.y < -5 || splash) {
    p.pos = { ...levelDef(state.level).spawn };
    p.vel = { x: 0, y: 0, z: 0 };
  }
}

/** An elevator-only mission part is still lying where it was lost. */
function hintPending(state: GameState) {
  const lift = levelDef(state.level).mission.liftOnly ?? [];
  return lift.some((i) => state.pickups[i]?.status === 'world');
}

function clampMag(v: number, m: number) {
  return v > m ? m : v < -m ? -m : v;
}

function turnToward(a: number, b: number, maxStep: number) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + clampMag(d, maxStep);
}

function nearestPlayer(state: GameState, c: Creature): [Player | null, number] {
  let target: Player | null = null;
  let td = Infinity;
  for (const p of state.players) {
    const d = Math.hypot(p.pos.x - c.pos.x, p.pos.z - c.pos.z);
    if (d < td) {
      td = d;
      target = p;
    }
  }
  return [target, td];
}

/** Pyshki: round slime buns that crowd around you like grannies at a market stall. Harmless. */
function updateCreature(state: GameState, c: Creature, dt: number, col: Collider) {
  c.padCd -= dt;
  c.hitCd -= dt;
  c.hopCd -= dt;
  c.thinkTimer -= dt;
  c.talk = Math.max(0, c.talk - dt);
  c.twirl = Math.max(0, c.twirl - dt);
  const wasStuck = c.stuck > 0;
  c.stuck -= dt;
  const [target, td] = nearestPlayer(state, c);

  let speed = 0;
  let dirX = 0;
  let dirZ = 0;
  if (c.stuck > 0) {
    // glued: quiet and happy
    c.vel.x = 0;
    c.vel.z = 0;
    c.talk = 0;
    c.twirl = 0;
  } else {
    if (wasStuck) c.thinkTimer = 0;
    if (target) {
      const dy = Math.abs(target.pos.y - c.pos.y);
      if (c.mode === 'wander' && td < CROWD_START && dy < 2.5) c.mode = 'crowd';
      else if (c.mode === 'crowd' && (td > CROWD_STOP || dy > 4)) {
        c.mode = 'wander';
        c.thinkTimer = 0;
      }
    }
    const hinting = !!c.hinter && td < 12 && hintPending(state);
    if (hinting) {
      // the lobby pyshka gossips about the flashlight upstairs every few seconds
      c.talkCd -= dt;
      if (c.talkCd <= 0 && !(c.phrase >= 100 && c.phrase !== HINT_PHRASE && c.talk > 0)) {
        c.phrase = HINT_PHRASE;
        c.talk = 3.4;
        c.talkCd = randRange(state, 6, 9);
        emit(state, 'babble', c.pos.x, c.pos.y + 1.4, c.pos.z, c.id);
      }
    }
    if (c.mode === 'crowd' && target) {
      // pick a spot on a ring around the player; "blockers" prefer the spot right in the player's path
      c.orbit += c.orbitDir * dt * 0.5;
      let ang = c.orbit;
      const pv = Math.hypot(target.vel.x, target.vel.z);
      if (c.blocker && pv > 1) ang = Math.atan2(target.vel.z, target.vel.x) + c.orbitDir * 0.45;
      const r = CROWD_RADIUS + target.stats.personalSpace;
      dirX = target.pos.x + Math.cos(ang) * r - c.pos.x;
      dirZ = target.pos.z + Math.sin(ang) * r - c.pos.z;
      const d = Math.hypot(dirX, dirZ);
      speed = Math.min(CREATURE_CROWD_SPEED, d * 2.5);
      // babble
      if (!hinting) c.talkCd -= dt;
      if (!hinting && c.talkCd <= 0 && td < 5 && c.chatUntil <= state.tick / 60 && !(c.phrase >= 100 && c.talk > 0)) {
        c.phrase = Math.floor(rand(state) * PHRASE_COUNT);
        c.talk = BUBBLE_TIME;
        c.talkCd = randRange(state, 4, 10);
        emit(state, 'babble', c.pos.x, c.pos.y + 1.4, c.pos.z, c.id);
      }
      if (c.twirl <= 0 && rand(state) < dt * 0.12) c.twirl = 0.8;
    } else {
      if (c.thinkTimer <= 0 || Math.hypot(c.target.x - c.pos.x, c.target.z - c.pos.z) < 0.6) {
        const a = rand(state) * Math.PI * 2;
        const r = c.hinter ? randRange(state, 0.5, 2) : randRange(state, 2, 7);
        c.target = { x: c.home.x + Math.cos(a) * r, z: c.home.z + Math.sin(a) * r };
        c.thinkTimer = randRange(state, 2.5, 5);
      }
      dirX = c.target.x - c.pos.x;
      dirZ = c.target.z - c.pos.z;
      speed = CREATURE_WANDER_SPEED;
    }
    // keep a little space from other pyshki
    for (const o of state.creatures) {
      if (o === c) continue;
      const ox = c.pos.x - o.pos.x;
      const oz = c.pos.z - o.pos.z;
      const od = Math.hypot(ox, oz);
      if (od > 1.15 || od < 0.001 || Math.abs(c.pos.y - o.pos.y) > 1) continue;
      if (c.id < o.id && c.grounded && o.grounded && c.stuck <= 0 && o.stuck <= 0 && c.chatUntil + 6 < state.tick / 60 && o.chatUntil + 6 < state.tick / 60) {
        c.chatPartner = o.id; o.chatPartner = c.id;
        c.chatUntil = o.chatUntil = state.tick / 60 + 4.8;
        c.twirl = o.twirl = 0.25;
        c.vel.x += ox / od; c.vel.z += oz / od;
        o.vel.x -= ox / od; o.vel.z -= oz / od;
      }
      const push = (1.15 - od) * 3;
      dirX += (ox / od) * push;
      dirZ += (oz / od) * push;
      speed = Math.max(speed, 1.5);
    }
    if (c.chatUntil > state.tick / 60 && c.grounded && !(c.phrase >= 100 && c.talk > 0)) {
      const partner = state.creatures.find(o => o.id === c.chatPartner);
      speed = 0;
      if (partner) {
        c.yaw = turnToward(c.yaw, Math.atan2(c.pos.x - partner.pos.x, c.pos.z - partner.pos.z), dt * 8);
        const speaking = Math.floor((c.chatUntil - state.tick / 60) / 1.2) % 2 === (c.id < partner.id ? 0 : 1);
        if (!speaking && c.phrase < 100) c.talk = 0;
        if (speaking && c.talk <= 0) { c.phrase = Math.floor(rand(state) * PHRASE_COUNT); c.talk = 1.1; emit(state, 'babble', c.pos.x, c.pos.y, c.pos.z, c.id); }
      }
    }
    const d = Math.hypot(dirX, dirZ);
    if (d > 0.01) {
      dirX /= d;
      dirZ /= d;
    }
    if (c.twirl > 0) c.yaw += dt * 14;
    else if (c.mode === 'crowd' && target && td < 3) {
      c.yaw = turnToward(c.yaw, Math.atan2(-(target.pos.x - c.pos.x), -(target.pos.z - c.pos.z)), dt * 8); // look at you
    } else if (d > 0.01) c.yaw = turnToward(c.yaw, Math.atan2(-dirX, -dirZ), dt * 6);
    if (c.chatUntil > state.tick / 60 && c.grounded) {
      const partner = state.creatures.find(o => o.id === c.chatPartner);
      if (partner) c.yaw = turnToward(c.yaw, Math.atan2(c.pos.x - partner.pos.x, c.pos.z - partner.pos.z), dt * 10);
    }
    const accel = c.grounded ? 20 : 5;
    c.vel.x += clampMag(dirX * speed - c.vel.x, accel * dt);
    c.vel.z += clampMag(dirZ * speed - c.vel.z, accel * dt);
  }
  const bumped = moveBody(c, dt, col, state.world.half);
  if (bumped && c.grounded && c.hopCd <= 0 && c.stuck <= 0) {
    c.vel.y = c.mode === 'crowd' ? 7.5 : 6;
    c.grounded = false;
    c.hopCd = 1.2;
    if (c.mode === 'wander') c.thinkTimer = 0;
  }
  checkPad(state, c, c.id);
  if (c.pos.y < -5 || wet(state, c.pos.x, c.pos.y, c.pos.z)) {
    c.pos = { x: c.home.x, y: 0, z: c.home.z };
    c.vel = { x: 0, y: 0, z: 0 };
  }

  for (const p of state.players) pyshkaContact(state, c, p, col);
}

/** Pyshki are soft obstacles: they block your way and give a mild shove. Nobody gets hurt. */
function pyshkaContact(state: GameState, c: Creature, p: Player, col: Collider) {
  const dx = p.pos.x - c.pos.x;
  const dz = p.pos.z - c.pos.z;
  const d = Math.hypot(dx, dz);
  const minD = p.radius + c.radius + 0.05;
  if (d > minD) return;
  if (p.pos.y > c.pos.y + c.height - 0.2 || p.pos.y + p.height < c.pos.y) return;
  if (c.hitCd <= 0) emit(state, 'note', c.pos.x, c.pos.y, c.pos.z, c.id);
  const nx = d > 0.01 ? dx / d : 1;
  const nz = d > 0.01 ? dz / d : 0;
  const ride = p.riding !== null ? state.vehicles.find((v) => v.id === p.riding) : undefined;
  if (ride) {
    if (c.hitCd > 0) return;
    // knock the bike back along its heading
    c.hitCd = 1.2;
    ride.speed = (nx * -Math.sin(ride.yaw) + nz * -Math.cos(ride.yaw)) * KNOCKBACK * p.stats.knockback;
    ride.vel.y = 4;
    ride.grounded = false;
    if (c.stuck <= 0) { c.vel.x = -nx * 3; c.vel.z = -nz * 3; }
    emit(state, 'bonk', p.pos.x, p.pos.y + 1, p.pos.z, p.id);
    return;
  }
  // push apart: the player gets most of it unless the pyshka is glued (then all of it)
  const overlap = minD - d;
  const share = c.stuck > 0 ? 1 : 0.6;
  const px = p.pos.x + nx * overlap * share;
  const pz = p.pos.z + nz * overlap * share;
  if (!col.blocked(px, pz, p.pos.y, p.radius, p.height)) {
    p.pos.x = px;
    p.pos.z = pz;
  }
  if (c.stuck <= 0) {
    c.pos.x -= nx * overlap * (1 - share);
    c.pos.z -= nz * overlap * (1 - share);
  }
  // walking into an awake pyshka: a polite little shove
  const into = -(p.vel.x * nx + p.vel.z * nz);
  if (c.stuck <= 0 && c.hitCd <= 0 && into > 2) {
    c.hitCd = 1.0;
    const k = SHOVE * p.stats.knockback;
    p.vel.x = nx * k;
    p.vel.z = nz * k;
    p.vel.y = 3;
    p.grounded = false;
    p.stun = 0.25 * p.stats.stun;
    emit(state, 'bonk', p.pos.x, p.pos.y + 1, p.pos.z, p.id);
  }
}

function updateProjectiles(state: GameState, dt: number, col: Collider) {
  const keep = [];
  for (const pr of state.projectiles) {
    pr.life -= dt;
    const g = pr.kind === 'sticky' ? STICKY_GRAVITY : BOUNCY_GRAVITY;
    pr.vel.y -= g * dt;
    const px = pr.pos.x;
    const py = pr.pos.y;
    const pz = pr.pos.z;
    pr.pos.x += pr.vel.x * dt;
    pr.pos.y += pr.vel.y * dt;
    pr.pos.z += pr.vel.z * dt;
    let alive = pr.life > 0;

    // creature hits
    if (alive) {
      for (const c of state.creatures) {
        const dx = pr.pos.x - c.pos.x;
        const dy = pr.pos.y - (c.pos.y + 0.6);
        const dz = pr.pos.z - c.pos.z;
        const hr = 0.85 * pr.scale;
        if (dx * dx + dy * dy + dz * dz > hr * hr) continue;
        if (pr.kind === 'sticky') {
          const owner = state.players.find((p) => p.id === pr.owner);
          c.stuck = owner ? owner.stats.glueTime : 5;
          c.mode = 'wander';
          emit(state, 'glue', c.pos.x, c.pos.y + 0.6, c.pos.z, c.id);
        } else {
          c.stuck = 0;
          c.phrase = 100 + Math.floor(rand(state) * 3);
          c.talk = 3;
          c.vel.x = pr.vel.x * 0.65;
          c.vel.z = pr.vel.z * 0.65;
          c.vel.y = 11;
          c.grounded = false;
          emit(state, 'bounce', c.pos.x, c.pos.y, c.pos.z, c.id);
        }
        alive = false;
        break;
      }
    }

    if (alive) {
      const ground = pr.pos.y <= 0;
      const s = ground ? null : col.pointInside(pr.pos.x, pr.pos.y, pr.pos.z);
      if (ground || s) {
        let surfaceY = 0;
        let onTop = ground;
        if (s) {
          const top = topAt(s, pr.pos.x, pr.pos.z);
          if (py >= top - 0.05 || top - pr.pos.y < 0.25) {
            onTop = true;
            surfaceY = top;
          }
        }
        if (pr.kind === 'sticky') {
          state.splats.push({ id: state.nextId++, pos: { x: pr.pos.x, y: onTop ? surfaceY + 0.02 : pr.pos.y, z: pr.pos.z }, life: 2.5 });
          emit(state, 'splat', pr.pos.x, pr.pos.y, pr.pos.z);
          alive = false;
        } else if (onTop) {
          makePad(state, pr.pos.x, surfaceY, pr.pos.z, col, state.players.find((p) => p.id === pr.owner)?.stats.padScale ?? 1);
          alive = false;
        } else {
          // hit a wall: drop straight down along it
          pr.pos.x = px;
          pr.pos.z = pz;
          pr.pos.y = py;
          pr.vel.x = 0;
          pr.vel.z = 0;
        }
      }
    }
    if (Math.abs(pr.pos.x) > state.world.half + 5 || Math.abs(pr.pos.z) > state.world.half + 5) alive = false;
    if (alive) keep.push(pr);
  }
  state.projectiles = keep;
}

function makePad(state: GameState, x: number, y: number, z: number, col: Collider, scale: number) {
  // settle the pad onto the highest surface under it
  const gy = col.groundAt(x, z, y + STEP_UP, 0.05);
  if (state.pads.length >= MAX_PADS) state.pads.shift();
  state.pads.push({ id: state.nextId++, pos: { x, y: Math.max(gy, y), z }, life: PAD_LIFE, squish: 1, scale });
  emit(state, 'pad', x, y, z);
}

function updatePads(state: GameState, dt: number) {
  for (const p of state.pads) {
    p.life -= dt;
    p.squish = Math.max(0, p.squish - dt * 3);
  }
  state.pads = state.pads.filter((p) => p.life > 0);
}
