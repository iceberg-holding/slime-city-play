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
  return k.build();
}
