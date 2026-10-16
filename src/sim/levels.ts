import { COURSE1, courseAt, type Course } from './track';
import type { Solid, Vec3, World } from './types';
import { MISSION, SCOOTER_MISSION, VEHICLES, type MissionDef } from './vehicles';
import { CREATURE_SPAWNS, PLAYER_SPAWN, createWorld } from './world';

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
  mission: MissionDef;
  race: RaceDef | null;
  /** northeast tower with the elevator and rooftop pool */
  tower: boolean;
}

/** Timer: course length at 75% of stock top speed, 35% slack, plus time for weaving through pyshki. */
export function raceDuration(course: Course, topSpeed: number) {
  return Math.ceil(course.length / (topSpeed * 0.75) * 1.35) + 6;
}

const LEVEL1: LevelDef = {
  id: 1,
  createWorld,
  spawn: PLAYER_SPAWN,
  creatureSpawns: CREATURE_SPAWNS,
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
  createWorld,
  spawn: PLAYER_SPAWN,
  creatureSpawns: CREATURE_SPAWNS,
  mission: SCOOTER_MISSION,
  tower: true,
  race: null,
};

export const LEVELS: Record<number, LevelDef> = { 1: LEVEL1, 2: LEVEL2 };
export const levelDef = (level: number) => LEVELS[level] ?? LEVEL1;

export function raceStart(r: RaceDef) {
  return courseAt(r.course, 0);
}
