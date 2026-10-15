import { Kit, geo } from './materials';
import { TOWER } from '../sim/tower';

/** Teal tile border, slatted pergola and soft striped loungers inspired by the Codex deck. */
export function buildRooftop() {
  const k = new Kit();
  const y = TOWER.roof;
  for (let x = 22.4; x < 26.8; x += 0.3)
    for (const z of [-29.25, -26.95]) k.add(geo.rbox(0.28, 0.04, 0.28, 0.02), 0x15b8b2, { p: [x, y + 0.04, z] });
  k.add(geo.rbox(4, 0.04, 2.2, 0.1), 0x32cce7, { p: [24.5, y + 0.14, -28.1], finish: 'gloss' });
  for (const x of [23, 27]) for (const z of [-24.5, -22.5])
    k.add(geo.cyl(0.06, 0.06, 1.8), 0xdab68a, { p: [x, y + 0.9, z] });
  for (let x = 23; x <= 27; x += 0.35) k.add(geo.rbox(0.13, 0.1, 2.5, 0.04), 0xe9c798, { p: [x, y + 1.85, -23.5] });
  for (const x of [23.6, 25, 26.4]) {
    k.add(geo.rbox(0.7, 0.24, 1.5, 0.1), 0xffffff, { p: [x, y + 0.15, -23.5] });
    k.add(geo.rbox(0.62, 0.06, 1.3, 0.03), 0xff84b1, { p: [x, y + 0.3, -23.5] });
  }
  // Two palms and folded towels around the spa.
  for (const x of [28.7, 23]) {
    k.add(geo.cyl(0.08, 0.13, 1.8), 0xc69262, { p: [x, y + 0.9, -29] });
    for (let a = 0; a < 6; a++) k.add(geo.sphere(0.4, 16, 8), 0x42ba76, { p: [x + Math.cos(a) * 0.35, y + 1.8, -29 + Math.sin(a) * 0.35], s: [1.5, 0.15, 0.6], r: [0, -a, 0] });
  }
  k.add(geo.rbox(0.5, 0.12, 0.35, 0.05), 0xffe5f0, { p: [28.7, y + 0.1, -27.3] });
  return k.build();
}
