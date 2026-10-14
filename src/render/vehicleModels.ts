import * as THREE from 'three';
import type { VehicleKind } from '../sim/vehicles';
import { geo, part } from './materials';

// Per-vehicle, per-part mesh builders. Origin at ground under the vehicle, facing -z.

type PartBuilder = () => THREE.Group;

function wheel(z: number, withArm: boolean): THREE.Group {
  const g = new THREE.Group();
  const spinner = new THREE.Group();
  spinner.name = 'spin';
  const tire = part(new THREE.TorusGeometry(0.29, 0.11, 6, 14), 0x222222, 1, 1, 1);
  tire.rotation.y = Math.PI / 2;
  spinner.add(tire);
  const hub = part(geo.cyl(8), 0xdddddd, 0.22, 0.14, 0.22);
  hub.rotation.z = Math.PI / 2;
  spinner.add(hub);
  for (let i = 0; i < 3; i++) {
    const spoke = part(geo.box(), 0xffd23f, 0.05, 0.5, 0.05);
    spoke.rotation.x = (i / 3) * Math.PI;
    spinner.add(spoke);
  }
  g.add(spinner);
  g.position.set(0, 0.4, z);
  if (withArm) {
    const arm = part(geo.box(), 0x555566, 0.08, 0.08, 0.6, 0.12, 0.05, -0.3);
    arm.rotation.x = -0.25;
    g.add(arm, part(geo.box(), 0x555566, 0.08, 0.08, 0.6, -0.12, 0.05, -0.3));
  }
  return g;
}

const PITBIKE: Record<string, PartBuilder> = {
  frontWheel: () => wheel(-0.72, false),
  rearWheel: () => wheel(0.7, true),
  frame: () => {
    const g = new THREE.Group();
    const tube = (x: number, y: number, z: number, len: number, rx: number) => {
      const m = part(geo.box(), 0x444455, 0.09, 0.09, len, x, y, z);
      m.rotation.x = rx;
      return m;
    };
    g.add(tube(0, 0.72, -0.15, 0.85, -0.35), tube(0, 0.55, 0.3, 0.6, 0.6));
    g.add(part(geo.box(), 0xff6b00, 0.34, 0.26, 0.5, 0, 0.9, -0.2)); // tank
    g.add(part(geo.box(), 0x222222, 0.28, 0.1, 0.7, 0, 0.92, 0.3)); // seat
    g.add(part(geo.box(), 0xff6b00, 0.3, 0.06, 0.4, 0, 0.95, 0.78)); // rear fender
    g.add(part(geo.box(), 0xffffff, 0.36, 0.2, 0.3, 0, 0.82, -0.2)); // side plate
    return g;
  },
  handlebar: () => {
    const g = new THREE.Group();
    for (const x of [-0.12, 0.12]) {
      const fork = part(geo.box(), 0xc0c0c0, 0.06, 0.8, 0.06, x, 0.75, -0.6);
      fork.rotation.x = 0.3;
      g.add(fork);
    }
    g.add(part(geo.box(), 0x333333, 0.8, 0.06, 0.06, 0, 1.14, -0.5));
    g.add(part(geo.box(), 0x111111, 0.14, 0.09, 0.09, -0.38, 1.14, -0.5));
    g.add(part(geo.box(), 0x111111, 0.14, 0.09, 0.09, 0.38, 1.14, -0.5));
    g.add(part(geo.box(), 0xffffff, 0.3, 0.24, 0.04, 0, 1.0, -0.66)); // number plate
    g.add(part(geo.box(), 0xff6b00, 0.3, 0.05, 0.36, 0, 0.82, -0.75)); // front fender
    return g;
  },
  engine: () => {
    const g = new THREE.Group();
    g.add(part(geo.box(), 0x8d99ae, 0.32, 0.32, 0.38, 0, 0.48, 0.02));
    for (let i = 0; i < 3; i++) g.add(part(geo.box(), 0x5c677d, 0.38, 0.04, 0.3, 0, 0.62 + i * 0.07, -0.05));
    const pipe = part(geo.cyl(6), 0xd9d9d9, 0.09, 0.9, 0.09, 0.2, 0.55, 0.45);
    pipe.rotation.x = Math.PI / 2 - 0.3;
    g.add(pipe);
    return g;
  },
};

const BUILDERS: Record<VehicleKind, Record<string, PartBuilder>> = { pitbike: PITBIKE };

export function buildPart(kind: VehicleKind, partId: string): THREE.Group {
  return BUILDERS[kind][partId]();
}

export interface VehicleModel {
  root: THREE.Group;
  /** pivot used for flips (child of root) */
  pivot: THREE.Group;
  /** where a rider's feet go (child of pivot) */
  seat: THREE.Group;
  parts: Map<string, THREE.Group>;
  wheels: THREE.Object3D[];
}

export function buildVehicle(kind: VehicleKind, partIds: string[]): VehicleModel {
  const root = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.position.y = 0.6;
  root.add(pivot);
  const body = new THREE.Group();
  body.position.y = -0.6;
  pivot.add(body);
  const parts = new Map<string, THREE.Group>();
  const wheels: THREE.Object3D[] = [];
  for (const id of partIds) {
    const g = buildPart(kind, id);
    body.add(g);
    parts.set(id, g);
    const s = g.getObjectByName('spin');
    if (s) wheels.push(s);
  }
  const seat = new THREE.Group();
  seat.position.set(0, 0.25, 0.15);
  body.add(seat);
  return { root, pivot, seat, parts, wheels };
}
