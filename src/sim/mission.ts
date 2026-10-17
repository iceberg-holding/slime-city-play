import { courseAt, courseNear } from './track';
import { addBonus, raceOf } from './race';
import { rand } from './rng';
import { wet } from './harbor';
import { GRAVITY, PAD_LAUNCH, STEP_UP } from './constants';
import { Collider, moveBody } from './physics';
import type { GameEvent, GameState, InputCommand, Player, TrickName, Vehicle } from './types';
import { levelDef } from './levels';
import { VEHICLES, type VehicleKind } from './vehicles';

const TAU = Math.PI * 2;
const MOUNT_RANGE = 2.6;
const AIR_SPIN_RATE = 7;
/** seconds per TRICK-button trick (a plain bike hop is just long enough for one) */
const TRICK_TIME = 0.45;
const BUTTON_TRICKS: TrickName[] = ['flip', 'roll', 'twist'];
const TRICK_POINTS: Record<TrickName, number> = { flip: 100, roll: 120, twist: 80, spin: 60 };
/** number of funny landing phrases (localized by the UI) */
export const TRICK_PHRASES = 6;

function emit(state: GameState, type: GameEvent['type'], x: number, y: number, z: number, who?: number, info?: string) {
  state.events.push({ type, x, y, z, who, info });
}

export function setupMission(state: GameState) {
  const mission = levelDef(state.level).mission;
  const def = VEHICLES[mission.vehicle];
  def.parts.forEach((part, i) => {
    state.pickups.push({
      id: state.nextId++,
      vehicle: def.id,
      part: part.id,
      pos: { ...mission.partSpots[i] },
      status: 'world',
      carrier: null,
    });
  });
  state.garages.push({
    id: state.nextId++,
    vehicle: def.id,
    x: mission.garage.x,
    z: mission.garage.z,
    radius: mission.garage.radius,
    delivered: [],
    built: false,
  });
}

export function spawnVehicle(state: GameState, kind: VehicleKind, x: number, y: number, z: number, yaw: number): Vehicle {
  const def = VEHICLES[kind];
  const v: Vehicle = {
    id: state.nextId++,
    kind,
    pos: { x, y, z },
    vel: { x: 0, y: 0, z: 0 },
    grounded: true,
    radius: def.radius,
    height: def.height,
    padCd: 0,
    yaw,
    speed: 0,
    rider: null,
    airTime: 0,
    spin: 0,
    flip: 0,
    roll: 0,
    twist: 0,
    spinDone: 0,
    trick: null,
    trickT: 0,
    combo: [],
    nextTrick: 0,
    lastClimb: 0,
  };
  state.vehicles.push(v);
  return v;
}

/** Vehicle the player could get on right now (or null). */
export function mountable(state: GameState, p: Player): Vehicle | null {
  if (p.riding !== null) return null;
  let best: Vehicle | null = null;
  let bestD = MOUNT_RANGE;
  for (const v of state.vehicles) {
    if (v.rider !== null) continue;
    const d = Math.hypot(v.pos.x - p.pos.x, v.pos.z - p.pos.z);
    if (d < bestD && Math.abs(v.pos.y - p.pos.y) < 1.5) {
      best = v;
      bestD = d;
    }
  }
  return best;
}

export function interact(state: GameState, p: Player, col: Collider) {
  if (p.riding !== null) {
    const v = state.vehicles.find((x) => x.id === p.riding);
    p.riding = null;
    if (!v) return;
    v.rider = null;
    v.speed = 0;
    // step off to the side (right, then left, then on top)
    const rx = Math.cos(v.yaw);
    const rz = -Math.sin(v.yaw);
    for (const side of [1.2, -1.2]) {
      const x = v.pos.x + rx * side;
      const z = v.pos.z + rz * side;
      if (!col.blocked(x, z, v.pos.y, p.radius, p.height)) {
        p.pos = { x, y: v.pos.y, z };
        break;
      }
    }
    p.vel = { x: 0, y: 0, z: 0 };
    p.grounded = false;
    emit(state, 'dismount', p.pos.x, p.pos.y, p.pos.z, p.id);
    return;
  }
  const v = mountable(state, p);
  if (!v) return;
  v.rider = p.id;
  p.riding = v.id;
  emit(state, 'mount', v.pos.x, v.pos.y, v.pos.z, p.id);
}

export function updatePickups(state: GameState) {
  for (const p of state.players) {
    let carried = 0;
    for (const pk of state.pickups) {
      if (pk.status === 'carried' && pk.carrier === p.id) {
        // stack above the player's head
        const a = state.time * 2 + carried * 1.3;
        pk.pos = { x: p.pos.x + Math.cos(a) * 0.35, y: p.pos.y + 2.3 + carried * 0.55, z: p.pos.z + Math.sin(a) * 0.35 };
        carried++;
        continue;
      }
      if (pk.status !== 'world') continue;
      const dx = pk.pos.x - p.pos.x;
      const dy = pk.pos.y - (p.pos.y + 0.9);
      const dz = pk.pos.z - p.pos.z;
      if (dx * dx + dy * dy + dz * dz < 1.5 * 1.5) {
        pk.status = 'carried';
        pk.carrier = p.id;
        emit(state, 'pickup', pk.pos.x, pk.pos.y, pk.pos.z, p.id, pk.part);
      }
    }
    // deliver at a garage
    for (const g of state.garages) {
      if (Math.hypot(p.pos.x - g.x, p.pos.z - g.z) > g.radius || p.pos.y > 1.5) continue;
      for (const pk of state.pickups) {
        if (pk.status !== 'carried' || pk.carrier !== p.id || pk.vehicle !== g.vehicle) continue;
        pk.status = 'delivered';
        pk.carrier = null;
        g.delivered.push(pk.part);
        emit(state, 'deliver', g.x, 1, g.z, p.id, pk.part);
      }
      const def = VEHICLES[g.vehicle];
      if (!g.built && def.parts.every((part) => part.accessory || g.delivered.includes(part.id))) {
        g.built = true;
        spawnVehicle(state, g.vehicle, g.x, 0, g.z, 0);
        emit(state, 'built', g.x, 1, g.z, p.id, g.vehicle);
      }
    }
  }
}

/** Flying vehicles (drone): joystick forward/back flies along the heading and left/right turns; UP/DOWN climb and
 *  descend; with no altitude input it hovers. Soft ceiling, soft walls round the area (or the course corridor),
 *  bounces off whatever it bumps into. Unpowered (no rider) it sinks gently to the ground. */
function updateDrone(state: GameState, v: Vehicle, inp: InputCommand | undefined, dt: number, col: Collider) {
  const def = VEHICLES[v.kind], powered = v.rider !== null;
  let throttle = 0, steer = 0, lift = 0;
  if (powered && inp) {
    throttle = inp.mx * -Math.sin(v.yaw) + inp.mz * -Math.cos(v.yaw);
    steer = inp.mx * Math.cos(v.yaw) + inp.mz * -Math.sin(v.yaw);
    lift = (inp.up ? 1 : 0) - (inp.down ? 1 : 0);
  }
  v.yaw -= steer * def.turnRate * dt;
  const fx = -Math.sin(v.yaw), fz = -Math.cos(v.yaw);
  const rider = powered ? state.players.find((p) => p.id === v.rider) : undefined;
  const want = throttle > 0 ? throttle * def.maxSpeed * (rider ? rider.stats.rideSpeed : 1) : throttle * def.reverseSpeed;
  // steer the whole horizontal velocity toward the heading: a bounce or a drift dies out on its own
  const rate = (Math.abs(throttle) > 0.05 ? def.accel : def.brake * 0.5) * dt;
  const dvx = fx * want - v.vel.x, dvz = fz * want - v.vel.z, dv = Math.hypot(dvx, dvz);
  const k = dv > rate ? rate / dv : 1;
  v.vel.x += dvx * k;
  v.vel.z += dvz * k;

  // altitude: climb / descend / hover; the ceiling softly takes away climb and nudges you back down
  const climb = def.climb ?? 5, ceil = def.ceiling ?? 25;
  let vy = powered ? lift * climb : -4;
  if (vy > 0) vy *= Math.max(0, Math.min(1, (ceil - v.pos.y) / 4));
  if (v.pos.y > ceil) vy = Math.min(vy, -(v.pos.y - ceil) * 1.5);
  v.vel.y += clampMag(vy - v.vel.y, (powered ? 14 : 9) * dt);

  // horizontal moves with bounces (step-ups like a walker)
  let bumped = false;
  const half = state.world.half, r = v.radius, h = v.height;
  const nx = v.pos.x + v.vel.x * dt;
  if (col.blocked(nx, v.pos.z, v.pos.y, r, h) || Math.abs(nx) > half - r) { bumped ||= Math.abs(v.vel.x) > 2; v.vel.x = -v.vel.x * 0.55; }
  else v.pos.x = nx;
  const nz = v.pos.z + v.vel.z * dt;
  if (col.blocked(v.pos.x, nz, v.pos.y, r, h) || Math.abs(nz) > half - r) { bumped ||= Math.abs(v.vel.z) > 2; v.vel.z = -v.vel.z * 0.55; }
  else v.pos.z = nz;
  // vertical: undersides of balconies, roofs and slabs stop a climb; land on whatever is below
  let ny = v.pos.y + v.vel.y * dt;
  if (v.vel.y > 0) {
    for (const list of [col.statics, col.dynamics]) for (const s of list) {
      if (v.pos.x + r <= s.minX || v.pos.x - r >= s.maxX || v.pos.z + r <= s.minZ || v.pos.z - r >= s.maxZ) continue;
      if (s.minY < v.pos.y + h - 0.01 || s.minY >= ny + h) continue;
      ny = s.minY - h;
      bumped ||= v.vel.y > 2;
      v.vel.y = -Math.min(2, v.vel.y * 0.4);
    }
  }
  const ground = col.groundAt(v.pos.x, v.pos.z, v.pos.y + STEP_UP, r);
  if (ny <= ground) {
    v.pos.y = ground;
    v.vel.y = Math.max(0, v.vel.y);
    v.grounded = true;
  } else {
    v.pos.y = ny;
    v.grounded = false;
  }
  if (bumped) emit(state, 'bonk', v.pos.x, v.pos.y + 0.6, v.pos.z, v.rider ?? undefined);

  // soft walls: the course corridor during a flight race, otherwise the level's area
  const race = raceOf(state), bounds = levelDef(state.level).bounds;
  if (state.race.phase === 'racing' && race) {
    const road = courseNear(race.course, v.pos.x, v.pos.z);
    if (road.distance > race.course.rail) {
      const scale = race.course.rail / road.distance;
      v.pos.x = road.x + (v.pos.x - road.x) * scale;
      v.pos.z = road.z + (v.pos.z - road.z) * scale;
      v.vel.x *= 0.9; v.vel.z *= 0.9;
    }
  } else if (bounds) {
    for (const [axis, lo, hi] of [['x', bounds.minX, bounds.maxX], ['z', bounds.minZ, bounds.maxZ]] as const) {
      const p = v.pos[axis];
      if (p < lo) { v.vel[axis] = Math.max(v.vel[axis], (lo - p) * 4); v.pos[axis] = Math.max(p, lo - 2); }
      else if (p > hi) { v.vel[axis] = Math.min(v.vel[axis], (hi - p) * 4); v.pos[axis] = Math.min(p, hi + 2); }
    }
  }
  v.speed = v.vel.x * fx + v.vel.z * fz;
  if (powered && Math.hypot(v.vel.x, v.vel.z) > 1.5) state.rideTime += dt;
  if (v.pos.y < -5 || wet(state, v.pos.x, v.pos.y, v.pos.z)) {
    const g = levelDef(state.level).mission.garage;
    v.pos = { x: g.x, y: 0, z: g.z };
    v.vel = { x: 0, y: 0, z: 0 };
    v.speed = 0;
  }
}

function clampMag(v: number, m: number) {
  return v > m ? m : v < -m ? -m : v;
}

export function updateVehicle(state: GameState, v: Vehicle, inp: InputCommand | undefined, dt: number, col: Collider) {
  const def = VEHICLES[v.kind];
  if (def.flies) {
    updateDrone(state, v, inp, dt, col);
    return;
  }
  v.padCd -= dt;
  const fx = -Math.sin(v.yaw);
  const fz = -Math.cos(v.yaw);
  let throttle = 0;
  let steer = 0;
  if (v.rider !== null && inp) {
    const rx = Math.cos(v.yaw);
    const rz = -Math.sin(v.yaw);
    throttle = inp.mx * fx + inp.mz * fz;
    steer = inp.mx * rx + inp.mz * rz;
    if (inp.jump && v.grounded) {
      v.vel.y = def.hopVel;
      v.grounded = false;
      emit(state, 'jump', v.pos.x, v.pos.y, v.pos.z, v.rider);
    }
    // the TRICK button only works in the air; one trick at a time, cycling flip → roll → twist
    if (inp.trick && !v.grounded && v.trick === null) {
      v.trick = BUTTON_TRICKS[v.nextTrick++ % BUTTON_TRICKS.length];
      v.trickT = 0;
    }
  }

  if (v.grounded) {
    if (throttle > 0.05) v.speed += throttle * (v.speed < 0 ? def.brake : def.accel) * dt;
    else if (throttle < -0.05) v.speed += throttle * (v.speed > 0 ? def.brake : def.accel * 0.5) * dt;
    else v.speed -= v.speed * def.drag * 2 * dt;
    v.speed -= v.speed * def.drag * 0.2 * dt;
    const rider = v.rider !== null ? state.players.find((p) => p.id === v.rider) : undefined;
    const maxSpeed = def.maxSpeed * (rider ? rider.stats.rideSpeed : 1);
    v.speed = Math.max(-def.reverseSpeed, Math.min(maxSpeed, v.speed));
    const grip = Math.min(1, Math.abs(v.speed) / 3) * Math.sign(v.speed);
    v.yaw -= steer * def.turnRate * grip * dt;
  } else {
    // in the air: steering spins the bike (trick!)
    const d = steer * AIR_SPIN_RATE * dt;
    v.yaw -= d;
    v.spin += d;
  }

  const nfx = -Math.sin(v.yaw);
  const nfz = -Math.cos(v.yaw);
  v.vel.x = nfx * v.speed;
  v.vel.z = nfz * v.speed;
  const wasGrounded = v.grounded;
  const prevY = v.pos.y;
  const bumped = moveBody(v, dt, col, state.world.half);
  if (bumped && Math.abs(v.speed) > 2) {
    v.speed *= -0.3;
    emit(state, 'bonk', v.pos.x, v.pos.y + 0.6, v.pos.z, v.rider ?? undefined);
  }
  if (v.grounded) v.lastClimb = Math.min((v.pos.y - prevY) / dt, Math.abs(v.speed));
  else if (wasGrounded && v.vel.y <= 0 && v.lastClimb > 1) {
    v.vel.y = v.lastClimb * 0.9; // launch off ramps
    v.vel.y += GRAVITY * dt;
  }

  const race = raceOf(state);
  if (state.race.phase === 'racing' && race) {
    const c = race.course, road = courseNear(c, v.pos.x, v.pos.z);
    // Analytic rails follow the same polyline as the rendered road, including bends.
    if (road.distance > c.rail) {
      const scale = c.rail / road.distance;
      v.pos.x = road.x + (v.pos.x - road.x) * scale;
      v.pos.z = road.z + (v.pos.z - road.z) * scale;
      v.speed *= 0.96;
    }
    const lane = (v.pos.x - road.x) * -road.dz + (v.pos.z - road.z) * road.dx;
    const ramp = c.jumps.find(d => road.progress >= d && road.progress <= d + c.rampLength);
    if (ramp !== undefined && (ramp !== c.optionalJump || lane < -0.5)) {
      const slope = c.rampHeight / c.rampLength, height = (road.progress - ramp) * slope;
      // ride the surface (also when the generic slope launch tried to hop us off it mid-ramp)
      if (v.pos.y <= height + 0.3 && (v.vel.y <= 0 || v.pos.y < height)) {
        v.pos.y = height; v.vel.y = 0; v.grounded = true; v.lastClimb = Math.abs(v.speed) * slope;
        if (road.progress > ramp + c.rampLength - 0.3) { v.vel.y = (Math.abs(v.speed) * slope + 2) * def.launch; v.grounded = false; }
      }
    }
    // A missed optional gap resets to its approach; the right half is a safe bypass.
    if (c.gap && road.progress > c.gap.start && road.progress < c.gap.end && lane < -0.5 && v.pos.y < 0.15) {
      const back = courseAt(c, road.progress - 10);
      v.pos.x = back.x; v.pos.z = back.z; v.speed = 0;
    }
  }

  // slime pads
  if (v.padCd <= 0 && v.vel.y <= 0.5) {
    for (const pad of state.pads) {
      if (Math.hypot(v.pos.x - pad.pos.x, v.pos.z - pad.pos.z) > 1.4 * pad.scale || Math.abs(v.pos.y - pad.pos.y) > 0.4) continue;
      v.vel.y = PAD_LAUNCH;
      v.grounded = false;
      v.padCd = 0.4;
      pad.squish = 1;
      if (v.rider !== null && v.trick === null) { v.trick = 'flip'; v.trickT = 0; } // automatic backflip off pads
      emit(state, 'bounce', pad.pos.x, pad.pos.y, pad.pos.z, v.id);
      break;
    }
  }

  // tricks: rotate while in the air, score the whole combo on landing
  if (!v.grounded) {
    v.airTime += dt;
    if (v.trick) {
      v.trickT = Math.min(1, v.trickT + dt / TRICK_TIME);
      const a = TAU * (1 - (1 - v.trickT) ** 2); // fast start, eases into the catch
      v.flip = v.trick === 'flip' ? a : 0;
      v.roll = v.trick === 'roll' ? a : 0;
      v.twist = v.trick === 'twist' ? a : 0;
      if (v.trickT >= 1) {
        v.combo.push(v.trick);
        v.trick = null;
        v.flip = v.roll = v.twist = 0;
      }
    }
    if (Math.abs(v.spin) >= TAU * (v.spinDone + 1) - 0.3) {
      v.spinDone++;
      v.combo.push('spin');
    }
  } else {
    if (v.trick) bail(state, v);
    else if (v.combo.length) land(state, v);
    v.airTime = 0;
    v.spin = 0;
    v.spinDone = 0;
    v.flip = v.roll = v.twist = 0;
    v.trick = null;
    v.combo = [];
  }

  if (v.rider !== null && Math.abs(v.speed) > 1.5) state.rideTime += dt;

  if (v.pos.y < -5 || wet(state, v.pos.x, v.pos.y, v.pos.z)) {
    const g = levelDef(state.level).mission.garage;
    v.pos = { x: g.x, y: 0, z: g.z };
    v.vel = { x: 0, y: 0, z: 0 };
    v.speed = 0;
  }
}

/** Clean landing: points for every trick (doubled per extra trick in the combo), +2 s per trick in a race (max 6). */
function land(state: GameState, v: Vehicle) {
  if (v.rider === null) return;
  const points = v.combo.reduce((n, t) => n + TRICK_POINTS[t], 0) * v.combo.length;
  const phrase = Math.floor(rand(state) * TRICK_PHRASES);
  state.tricks++;
  state.race.points += state.race.phase === 'racing' ? points : 0;
  emit(state, 'trick', v.pos.x, v.pos.y + 1, v.pos.z, v.rider, `${v.combo.join('+')}|${points}|${phrase}`);
  addBonus(state, Math.min(6, 2 * v.combo.length), v.pos.x, v.pos.y + 1.5, v.pos.z, 'trick');
}

/** Landed mid-trick: a wobble and a lost bit of speed, nothing worse. */
function bail(state: GameState, v: Vehicle) {
  v.speed *= 0.5;
  emit(state, 'bail', v.pos.x, v.pos.y + 1, v.pos.z, v.rider ?? undefined);
}

/** Players riding a vehicle are carried by it. */
export function syncRider(state: GameState, p: Player) {
  const v = state.vehicles.find((x) => x.id === p.riding);
  if (!v) {
    p.riding = null;
    return;
  }
  const def = VEHICLES[v.kind];
  p.pos = { x: v.pos.x, y: v.pos.y + def.seatY, z: v.pos.z };
  p.vel = { ...v.vel };
  p.grounded = v.grounded;
  p.yaw = v.yaw;
}

export function missionComplete(state: GameState): boolean {
  return state.tricks > 0 || state.rideTime >= levelDef(state.level).mission.rideGoal;
}
