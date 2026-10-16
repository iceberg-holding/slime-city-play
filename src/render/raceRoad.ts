import { Kit, geo } from './materials';
import { wedge } from './city';
export function buildRaceRoad() {
  const k = new Kit();
  k.add(geo.rbox(14, 0.15, 180, 0.05), 0x596b80, { p: [80, -0.08, -65] });
  for (const x of [73.25, 86.75]) k.add(geo.rbox(0.5, 1.2, 179, 0.1), 0xf6cc69, { p: [x, 0.6, -65] });
  for (let z = 12; z > -145; z -= 8) k.add(geo.rbox(0.12, 0.02, 3, 0.01), 0xffffff, { p: [80, 0.02, z] });
  for (const z of [-35, -90]) k.add(wedge(8, 1.6, 8, 0), 0xffae50, { p: [80, 0, z - 4], r: [0, Math.PI / 2, 0] });
  for (let i = 0; i < 12; i++) for (let j = 0; j < 2; j++) k.add(geo.rbox(1, 0.03, 1, 0), (i + j) % 2 ? 0xffffff : 0x263046, { p: [74.5 + i, 0.04, -145 + j] });
  for (const x of [73.5, 86.5]) k.add(geo.cyl(0.18, 0.18, 6), 0xff5d73, { p: [x, 3, -145] });
  k.add(geo.rbox(13.5, 1, 0.3, 0.1), 0xff5d73, { p: [80, 5.5, -145] });
  for (const x of [2, 9]) k.add(geo.cyl(0.18, 0.18, 4), 0x36c7b0, { p: [x, 2, 10] });
  k.add(geo.rbox(7.5, 0.65, 0.3, 0.1), 0x36c7b0, { p: [5.5, 3.8, 10] });
  const root = k.build();
  const bars = new Kit();
  for (let x = 0; x <= 7; x += 0.5) bars.add(geo.cyl(0.055, 0.055, 3.3), 0xffd166, { p: [x, 1.65, 0] });
  const gate = bars.build(); gate.position.set(2, 0, 10); root.add(gate);
  return { root, gate };
}
