import type { Vec3 } from './types';

// Data-driven vehicle definitions. Adding a scooter or drone = add a VehicleDef (+ a render builder keyed by id/part).

export type VehicleKind = 'pitbike';

export interface VehiclePartDef {
  id: string;
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
  /** can it leave the ground on its own (drone)? */
  flies: boolean;
}

export const VEHICLES: Record<VehicleKind, VehicleDef> = {
  pitbike: {
    id: 'pitbike',
    parts: [{ id: 'frontWheel' }, { id: 'rearWheel' }, { id: 'frame' }, { id: 'handlebar' }, { id: 'engine' }],
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
}

export const MISSION: MissionDef = {
  vehicle: 'pitbike',
  garage: { x: 5.5, z: 15.5, radius: 2.6 },
  // Every spot is reachable on foot (ground, steps or ramps) — no blocks, pads or jumps needed. See tests/reach.test.mjs.
  partSpots: [
    { x: 0, y: 1.35, z: -1.9 }, // front wheel: on the fountain rim (step ring)
    { x: -13.5, y: 5.9, z: -22.2 }, // rear wheel: north roof, up the long ramp
    { x: -11.5, y: 3.9, z: 22.4 }, // frame: low café roof, up the café ramp
    { x: -15.5, y: 1.45, z: 2.3 }, // handlebar: on the red car's hood
    { x: 19.8, y: 6.9, z: -19.8 }, // engine: east rooftop landing, up the east ramp
  ],
  rideGoal: 10,
};
