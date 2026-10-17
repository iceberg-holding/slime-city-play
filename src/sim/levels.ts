import { COURSE1, COURSE2, courseAt, type Course } from './track';
import type { Solid, Vec3, World } from './types';
import { MISSION, SCOOTER_MISSION, VEHICLES, type MissionDef } from './vehicles';
import { CREATURE_SPAWNS, PLAYER_SPAWN, createWorld } from './world';
import { HARBOR_CREATURES, HARBOR_SPAWN, createHarbor } from './harbor';

// Everything that differs between levels. The simulation reads only this, never level numbers directly.

export interface RaceDef {
  course: Course;
  /** solid bars that close the race entrance until the vehicle is built */
  gate: Solid;
  /** riding into this box while the gate is open starts the race */
  trigger: { minX: number; maxX: number; minZ: number; maxZ: number };
  /** where the HUD compass points */
  gateAt: { x: number; z: number };
  duration: number;
}

export interface LevelDef {
  id: number;
  createWorld(): World;
  spawn: Vec3;
  creatureSpawns: { x: number; z: number }[];
  /** a pyshka who hangs around here and hints at the elevator-only part */
  hintSpawn?: { x: number; z: number };
  mission: MissionDef;
  race: RaceDef | null;
  /** northeast tower with the elevator and rooftop pool */
  tower: boolean;
}

/** Timer: course length at 75% of stock top speed, 30% slack, plus ~1 s per 70 m for weaving through pyshki.
 *  Stars, rings, tricks and hooligan hits add bonus seconds on top. */
export function raceDuration(course: Course, topSpeed: number) {
  return Math.ceil(course.length / (topSpeed * 0.75) * 1.3 + course.length / 70);
}

const LEVEL1: LevelDef = {
  id: 1,
  createWorld,
  spawn: PLAYER_SPAWN,
  creatureSpawns: CREATURE_SPAWNS,
  hintSpawn: { x: 30.9, z: -22.4 },
  mission: MISSION,
  tower: true,
  race: {
    course: COURSE1,
    gate: { minX: 2, maxX: 9, minY: 0, maxY: 3.5, minZ: 9.7, maxZ: 10.1 },
    trigger: { minX: 2, maxX: 9, minZ: 7, maxZ: 10.3 },
    gateAt: { x: 5.5, z: 10 },
    duration: raceDuration(COURSE1, VEHICLES.pitbike.maxSpeed),
  },
};

const LEVEL2: LevelDef = {
  id: 2,
  createWorld: createHarbor,
  spawn: HARBOR_SPAWN,
  creatureSpawns: HARBOR_CREATURES,
  mission: SCOOTER_MISSION,
  tower: false,
  race: {
    course: COURSE2,
    gate: { minX: 26, maxX: 33, minY: 0, maxY: 3.5, minZ: 9.7, maxZ: 10.1 },
    trigger: { minX: 26, maxX: 33, minZ: 7, maxZ: 10.3 },
    gateAt: { x: 29.5, z: 10 },
    duration: raceDuration(COURSE2, VEHICLES.scooter.maxSpeed),
  },
};

export const LEVELS: Record<number, LevelDef> = { 1: LEVEL1, 2: LEVEL2 };
export const levelDef = (level: number) => LEVELS[level] ?? LEVEL1;

export function raceStart(r: RaceDef) {
  return courseAt(r.course, 0);
}
