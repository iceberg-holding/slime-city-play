import type { HeroStats } from './hero';
import type { VehicleKind } from './vehicles';

// Pure game-state types. No three.js imports anywhere in src/sim.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** Axis-aligned solid. If `ramp` is set, the top surface slopes up toward that direction:
 *  0 = +x, 1 = +z, 2 = -x, 3 = -z. */
export interface Solid {
  minX: number;
  minY: number;
  minZ: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  ramp?: 0 | 1 | 2 | 3;
}

export interface Body {
  pos: Vec3;
  vel: Vec3;
  grounded: boolean;
  radius: number;
  height: number;
  padCd: number;
}

/** Character look: [head, body, legs, gun], each 0..5. */
export type Look = [number, number, number, number];

export type BlockShape = 'cube' | 'ramp';

export interface Player extends Body {
  id: number;
  look: Look;
  yaw: number; // facing yaw (forward = (-sin, -cos))
  shape: BlockShape;
  fireCd: number;
  stun: number;
  jumpBuffer: number;
  walkPhase: number;
  riding: number | null;
  /** derived from `look` by the hero builder (pure data) */
  stats: HeroStats;
}

export interface Creature extends Body {
  id: number;
  seed: number;
  yaw: number;
  home: { x: number; z: number };
  target: { x: number; z: number };
  /** 'crowd' = gathering around a player like grannies at a market stall */
  mode: 'wander' | 'crowd';
  thinkTimer: number;
  stuck: number;
  hitCd: number;
  hopCd: number;
  /** angle of this pyshka's spot in the crowd ring */
  orbit: number;
  orbitDir: 1 | -1;
  /** tries to stand right in the player's way */
  blocker: boolean;
  /** seconds left of the current speech bubble (0 = quiet) */
  talk: number;
  /** phrase index (0..PHRASE_COUNT-1), localized by the UI */
  phrase: number;
  talkCd: number;
  chatUntil: number;
  chatPartner: number | null;
  /** seconds left of a happy little twirl */
  twirl: number;
}

export type ProjectileKind = 'sticky' | 'bouncy';

export interface Projectile {
  id: number;
  kind: ProjectileKind;
  owner: number;
  pos: Vec3;
  vel: Vec3;
  life: number;
  /** blob size multiplier (hit radius + visual) */
  scale: number;
}

export interface Pad {
  id: number;
  pos: Vec3;
  life: number;
  squish: number;
  /** size multiplier */
  scale: number;
}

export interface Block {
  id: number;
  shape: BlockShape;
  /** cell min corner */
  x: number;
  y: number;
  z: number;
  dir: 0 | 1 | 2 | 3;
}

/** A vehicle part lying around the city (or carried / delivered). */
export interface Pickup {
  id: number;
  vehicle: VehicleKind;
  part: string;
  pos: Vec3;
  status: 'world' | 'carried' | 'delivered';
  carrier: number | null;
}

export interface Garage {
  id: number;
  vehicle: VehicleKind;
  x: number;
  z: number;
  radius: number;
  delivered: string[];
  built: boolean;
}

export interface Vehicle extends Body {
  id: number;
  kind: VehicleKind;
  yaw: number;
  speed: number;
  rider: number | null;
  airTime: number;
  /** visual trick rotations (radians) */
  spin: number;
  flip: number;
  flipVel: number;
  spinDone: number;
  flipDone: number;
  lastClimb: number;
}

export interface Splat {
  id: number;
  pos: Vec3;
  life: number;
}

export interface Building {
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
  height: number;
  color: number;
  mansard: boolean;
}

export interface Car {
  x: number;
  z: number;
  alongX: boolean;
  color: number;
}

export interface Prop {
  kind: 'tree' | 'lamp' | 'bench' | 'crate';
  x: number;
  z: number;
  /** for crates: box size/height */
  w?: number;
  d?: number;
  h?: number;
  y?: number;
}

export interface World {
  half: number;
  solids: Solid[];
  buildings: Building[];
  ramps: Solid[];
  platforms: Solid[];
  cars: Car[];
  props: Prop[];
  fountain: { x: number; z: number; stepHalf: number; stepH: number; basinHalf: number; basinH: number; pillarHalf: number; pillarH: number };
  plazaRadius: number;
}

export type GameEventType =
  | 'pickup'
  | 'deliver'
  | 'built'
  | 'mount'
  | 'dismount'
  | 'trick'
  | 'shoot'
  | 'glue'
  | 'pad'
  | 'bounce'
  | 'bonk'
  | 'block'
  | 'noroom'
  | 'jump'
  | 'win'
  | 'splat'
  | 'babble';

export interface GameEvent {
  type: GameEventType;
  x: number;
  y: number;
  z: number;
  who?: number;
  /** extra info: part id, trick name… */
  info?: string;
}

export interface GameState {
  elevator: { y: number; target: number; wait: number };
  tick: number;
  time: number;
  rng: number;
  nextId: number;
  world: World;
  players: Player[];
  creatures: Creature[];
  projectiles: Projectile[];
  pads: Pad[];
  blocks: Block[];
  pickups: Pickup[];
  garages: Garage[];
  vehicles: Vehicle[];
  rideTime: number;
  tricks: number;
  splats: Splat[];
  events: GameEvent[];
  status: 'playing' | 'won';
  winTime: number;
}

/** One player's input for one simulation tick. */
export interface InputCommand {
  /** desired world-space move direction, length 0..1 */
  mx: number;
  mz: number;
  /** camera yaw used for aiming / block placement */
  aimYaw: number;
  jump: boolean;
  sticky: boolean;
  bouncy: boolean;
  place: boolean;
  toggleShape: boolean;
  interact: boolean;
}

export function emptyInput(aimYaw = 0): InputCommand {
  return { mx: 0, mz: 0, aimYaw, jump: false, sticky: false, bouncy: false, place: false, toggleShape: false, interact: false };
}
