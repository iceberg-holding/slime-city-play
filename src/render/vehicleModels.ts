import * as THREE from 'three';
import type { VehicleKind } from '../sim/vehicles';
import { Kit, geo } from './materials';

// Per-vehicle, per-part mesh builders. Origin at ground under the vehicle, facing -z.

type PartBuilder = () => THREE.Group;

const ORANGE = 0xff7a1a;
const GRAPHITE = 0x3a3f55;

function wheel(z: number, withArm: boolean): THREE.Group {
  const g = new THREE.Group();
  const spin = new Kit();
  spin.add(geo.torus(0.29, 0.11, Math.PI * 2, 40), 0x262838, { r: [0, Math.PI / 2, 0], finish: 'rubber' });
  spin.add(geo.cyl(0.21, 0.21, 0.08, 32), 0xffd23f, { r: [0, 0, Math.PI / 2], finish: 'gloss' });
  spin.add(geo.cyl(0.07, 0.07, 0.2, 20), 0xe6ebf2, { r: [0, 0, Math.PI / 2], finish: 'metal' });
  for (let i = 0; i < 3; i++) spin.add(geo.capsule(0.022, 0.4, 8), 0xffffff, { r: [(i / 3) * Math.PI, 0, 0], finish: 'metal' });
  const spinner = spin.build();
  spinner.name = 'spin';
  g.add(spinner);
  g.position.set(0, 0.4, z);
  if (withArm) {
    const arm = new Kit();
    for (const x of [-0.12, 0.12]) arm.add(geo.capsule(0.045, 0.66), GRAPHITE, { p: [x, 0.06, -0.3], r: [Math.PI / 2 - 0.2, 0, 0], finish: 'metal' });
    g.add(arm.build());
  }
  return g;
}

const PITBIKE: Record<string, PartBuilder> = {
  frontWheel: () => wheel(-0.72, false),
  rearWheel: () => wheel(0.7, true),
  frame: () => {
    const k = new Kit();
    k.add(geo.capsule(0.05, 0.95), GRAPHITE, { p: [0, 0.7, -0.15], r: [Math.PI / 2 - 0.35, 0, 0], finish: 'metal' });
    k.add(geo.capsule(0.05, 0.7), GRAPHITE, { p: [0, 0.55, 0.3], r: [Math.PI / 2 + 0.6, 0, 0], finish: 'metal' });
    k.add(geo.rbox(0.36, 0.28, 0.52, 0.12), ORANGE, { p: [0, 0.9, -0.2], finish: 'gloss' }); // tank
    k.add(geo.rbox(0.3, 0.1, 0.72, 0.05), 0x22232e, { p: [0, 0.94, 0.3], finish: 'soft' }); // seat
    k.add(geo.rbox(0.3, 0.06, 0.42, 0.03), ORANGE, { p: [0, 0.97, 0.78], r: [-0.15, 0, 0], finish: 'gloss' }); // rear fender
    k.add(geo.rbox(0.38, 0.2, 0.3, 0.08), 0xffffff, { p: [0, 0.8, -0.2], finish: 'gloss' }); // side plate
    k.add(geo.sphere(0.06), 0xff3355, { p: [0, 0.95, 0.98], s: [1.5, 0.7, 0.5], finish: 'glow' });
    const g = new THREE.Group();
    g.add(k.build());
    return g;
  },
  handlebar: () => {
    const k = new Kit();
    for (const x of [-0.12, 0.12]) k.add(geo.capsule(0.035, 0.85), 0xe6ebf2, { p: [x, 0.75, -0.6], r: [0.3, 0, 0], finish: 'metal' });
    k.add(geo.capsule(0.03, 0.78), GRAPHITE, { p: [0, 1.14, -0.5], r: [0, 0, Math.PI / 2], finish: 'metal' });
    for (const x of [-0.36, 0.36]) k.add(geo.capsule(0.045, 0.16), 0x22232e, { p: [x, 1.14, -0.5], r: [0, 0, Math.PI / 2], finish: 'rubber' });
    k.add(geo.rbox(0.3, 0.24, 0.05, 0.05), 0xffffff, { p: [0, 1.0, -0.67], r: [0.3, 0, 0], finish: 'gloss' }); // number plate
    k.add(geo.sphere(0.07), 0xfff3b0, { p: [0, 1.0, -0.71], s: [1, 1, 0.5], finish: 'glow' });
    k.add(geo.rbox(0.3, 0.06, 0.4, 0.03), ORANGE, { p: [0, 0.82, -0.75], r: [0.15, 0, 0], finish: 'gloss' }); // front fender
    const g = new THREE.Group();
    g.add(k.build());
    return g;
  },
  engine: () => {
    const k = new Kit();
    k.add(geo.rbox(0.32, 0.32, 0.38, 0.1), 0xb8c4d2, { p: [0, 0.48, 0.02], finish: 'metal' });
    for (let i = 0; i < 3; i++) k.add(geo.rbox(0.38, 0.04, 0.3, 0.02), 0x7c8aa5, { p: [0, 0.62 + i * 0.07, -0.05], finish: 'metal' });
    k.add(geo.capsule(0.05, 0.9), 0xe6ebf2, { p: [0.2, 0.55, 0.45], r: [Math.PI / 2 - 0.3, 0, 0], finish: 'metal' });
    k.add(geo.cyl(0.07, 0.07, 0.06, 20), 0x22232e, { p: [0.2, 0.68, 0.88], r: [Math.PI / 2 - 0.3, 0, 0], finish: 'rubber' });
    const g = new THREE.Group();
    g.add(k.build());
    return g;
  },
};

const BUILDERS: Record<VehicleKind, Record<string, PartBuilder>> = { pitbike: PITBIKE, scooter: {
  frontWheel: () => wheel(-0.72, false), rearWheel: () => wheel(0.7, false),
  handlebar: PITBIKE.handlebar,
  deck: () => { const k = new Kit(); k.add(geo.rbox(0.48, 0.16, 1.65, 0.07), 0x39d9c4, { p: [0, 0.35, 0], finish: 'gloss' }); const g = new THREE.Group(); g.add(k.build()); return g; },
} };

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
