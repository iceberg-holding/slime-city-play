import type { Vec3 } from './types';

// Data-driven vehicle definitions. Adding a scooter or drone = add a VehicleDef (+ a render builder keyed by id/part).

export type VehicleKind = 'pitbike' | 'scooter' | 'drone';

export interface VehiclePartDef {
  id: string;
  /** fitted after assembly: the vehicle rides without it, but the race gate needs it */
  accessory?: boolean;
}

export interface VehicleDef {
  id: VehicleKind;
  parts: VehiclePartDef[];
  radius: number;
  height: number;
  /** rider feet height above vehicle origin */
  seatY: number;
  maxSpeed: number;
  reverseSpeed: number;
  accel: number;
  brake: number;
  drag: number;
  turnRate: number;
  hopVel: number;
  /** multiplier on race-ramp launch speed (light vehicles hop smaller) */
  launch: number;
  /** can it leave the ground on its own (drone)? */
  flies: boolean;
  /** flying vehicles: climb / descend speed (m/s) and the soft altitude ceiling (m) */
  climb?: number;
  ceiling?: number;
}

// Light and nimble: quicker acceleration and turns, a little faster, smaller hops and ramp jumps.
const scooter: VehicleDef = {
  id: 'scooter', parts: [{ id: 'frontWheel' }, { id: 'rearWheel' }, { id: 'deck' }, { id: 'handlebar' }],
  radius: 0.45, height: 1.3, seatY: 0.2, maxSpeed: 14, reverseSpeed: 3, accel: 16, brake: 24, drag: 1,
  turnRate: 3.4, hopVel: 5.2, launch: 0.75, flies: false,
};

// Toy quadcopter you stand on: hovers when idle, climbs and descends on its own buttons, bounces off walls.
const drone: VehicleDef = {
  id: 'drone', parts: [{ id: 'propFront' }, { id: 'propRear' }, { id: 'frame' }, { id: 'battery' }, { id: 'camera' }, { id: 'skids' }],
  radius: 0.75, height: 2.1, seatY: 0.87, maxSpeed: 12, reverseSpeed: 4, accel: 9, brake: 14, drag: 1.2,
  turnRate: 2.4, hopVel: 0, launch: 0, flies: true, climb: 5.5, ceiling: 26,
};

export const VEHICLES: Record<VehicleKind, VehicleDef> = {
  scooter,
  drone,
  pitbike: {
    id: 'pitbike',
    parts: [{ id: 'frontWheel' }, { id: 'rearWheel' }, { id: 'frame' }, { id: 'handlebar' }, { id: 'engine' }, { id: 'flashlight', accessory: true }],
    radius: 0.55,
    height: 1.3,
    seatY: 0.25,
    maxSpeed: 13,
    reverseSpeed: 4,
    accel: 12,
    brake: 22,
    drag: 1.1,
    turnRate: 2.6,
    hopVel: 6.5,
    launch: 1,
    flies: false,
  },
};

export interface MissionDef {
  vehicle: VehicleKind;
  garage: { x: number; z: number; radius: number };
  /** one spot per vehicle part, same order as VehicleDef.parts */
  partSpots: Vec3[];
  /** ride this long (seconds) or land a trick to win */
  rideGoal: number;
  /** part indices that can only be reached by riding the tower elevator (never on foot) */
  liftOnly?: number[];
  /** part indices the hint pyshka gossips about while they are still lying around (default: liftOnly) */
  hint?: number[];
}

export const MISSION: MissionDef = {
  vehicle: 'pitbike',
  garage: { x: 5.5, z: 15.5, radius: 2.6 },
  // Every spot but the flashlight is reachable on foot (ground, steps or ramps) — no blocks, pads or jumps needed;
  // the flashlight needs the tower elevator. See tests/reach.test.mjs.
  partSpots: [
    { x: 0, y: 1.35, z: -1.9 }, // front wheel: on the fountain rim (step ring)
    { x: -13.5, y: 5.9, z: -22.2 }, // rear wheel: north roof, up the long ramp
    { x: -11.5, y: 3.9, z: 22.4 }, // frame: low café roof, up the café ramp
    { x: -15.5, y: 1.45, z: 2.3 }, // handlebar: on the red car's hood
    { x: 19.8, y: 6.9, z: -19.8 }, // engine: east rooftop landing, up the east ramp
    { x: 26, y: 12.6, z: -23.4 }, // flashlight: tower mid floor by the south windows, elevator only
  ],
  rideGoal: 10,
  liftOnly: [5],
};

// Harbor level (see sim/harbor.ts). Every spot is reachable on foot via ramps and steps.
export const SCOOTER_MISSION: MissionDef = {
  vehicle: 'scooter', garage: { x: 8, z: 12, radius: 2.6 }, rideGoal: 10,
  partSpots: [
    { x: -5.5, y: 1.75, z: -32 }, // front wheel: end of the wooden pier
    { x: 23.5, y: 4.75, z: -32 }, // rear wheel: lighthouse gallery, up the jetty ramp
    { x: -1, y: 1.95, z: -25.5 }, // deck: aboard the moored fishing boat
    { x: -25.5, y: 3.35, z: -4.5 }, // handlebar: lifeguard tower on the beach
  ],
};

// Old town level (see sim/oldtown.ts). Every spot is reachable on foot via steps, ramps and the tower stair;
// the battery is hidden in the clock room at the top of the clock tower's spiral stair, behind a hatch.
export const DRONE_MISSION: MissionDef = {
  vehicle: 'drone', garage: { x: 8, z: 14, radius: 2.6 }, rideGoal: 10, hint: [3],
  partSpots: [
    { x: -26, y: 1.95, z: 14 }, // front propellers: on the park bandstand, up its steps
    { x: 6, y: 5.1, z: -32 }, // rear propellers: roof terrace A, up the outside stair
    { x: -22, y: 1.75, z: -10 }, // frame: pond island, over the footbridge
    { x: 23, y: 10.55, z: -23.4 }, // battery: inside the clock room, round the tower stair and through the hatch
    { x: 16, y: 8.1, z: -32.5 }, // camera: roof terrace B, up the ramp from terrace A
    { x: 30, y: 1.15, z: -3 }, // landing skids: by the market stalls
  ],
};
