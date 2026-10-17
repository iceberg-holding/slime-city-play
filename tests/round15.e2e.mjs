// Round 8 browser flow on a 412x915 phone: level 3 old town (budget, reach, hidden battery in the clock tower with
// glow + hint pyshka), drone garage, real UP-button / Space flight, flight race with rings, stars, hooligan hit,
// a real full-course flight to the finish (medal, record, ghost), "Level 3 complete!" with the level-4 car teaser,
// time's up -> retry. Checks draw-call budgets and console errors.
// Saves shots/r15-l3-{area,hidden-part,drone-garage,flying,course-rings,finish}.png.
// Run: npm run build && node tests/round15.e2e.mjs
import { preview, createServer } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const loader = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
const { courseAt, courseHeightAt, courseStars } = await loader.ssrLoadModule('/src/sim/track.ts');
const { COURSE3 } = await loader.ssrLoadModule('/src/sim/flight.ts');
const { levelDef } = await loader.ssrLoadModule('/src/sim/levels.ts');
const server = await preview({ preview: { port: 4192 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
// Round 8 budgets on a phone viewport.
const BUDGET = { areaCalls: 410, areaTris: 610000, raceCalls: 300 };
try {
  await mkdir('shots', { recursive: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  const shot = async (name, wait = 1200) => { await page.waitForTimeout(wait); await page.screenshot({ path: `shots/r15-l3-${name}.png`, timeout: 120000 }); };
  const text = (sel, want) => page.waitForFunction(([sel, want]) => document.querySelector(sel)?.textContent.includes(want), [sel, want], { timeout: 20000 });
  const info = () => page.evaluate(() => window.__game.renderInfo());
  const visible = name => page.evaluate(name => { const o = window.__game.view.scene.getObjectByName(name); let v = !!o; for (let p = o; p; p = p.parent) v &&= p.visible; return v; }, name);
  const drone = () => page.evaluate(() => { const v = window.__game.state.vehicles[0]; return { x: v.pos.x, y: v.pos.y, z: v.pos.z, grounded: v.grounded }; });
  // In-page flying bot: heading to a point 8 m ahead on the polyline, altitude to the guide 5 m ahead.
  await page.evaluate(() => {
    window.__fly = (P, H, top, ticks, until = () => false) => {
      const g = window.__game, v = g.state.vehicles[0];
      const near = (x, z) => { let best = { d: Infinity, prog: 0 }, prog = 0; for (let i = 1; i < P.length; i++) { const [ax, az] = P[i - 1], [bx, bz] = P[i], dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz); const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L / L)); const d = Math.hypot(x - ax - dx * t, z - az - dz * t); if (d < best.d) best = { d, prog: prog + L * t }; prog += L; } return best; };
      const at = s => { for (let i = 1; i < P.length; i++) { const [ax, az] = P[i - 1], [bx, bz] = P[i], L = Math.hypot(bx - ax, bz - az); if (s <= L || i === P.length - 1) { const k = Math.min(1, s / L); return [ax + (bx - ax) * k, az + (bz - az) * k]; } s -= L; } };
      const height = d => { if (d <= H[0][0]) return H[0][1]; for (let i = 1; i < H.length; i++) if (d <= H[i][0]) return H[i - 1][1] + (H[i][1] - H[i - 1][1]) * (d - H[i - 1][0]) / (H[i][0] - H[i - 1][0]); return H[H.length - 1][1]; };
      for (let i = 0; i < ticks && g.raceState.phase === 'racing' && !until(); i++) {
        const prog = near(v.pos.x, v.pos.z).prog, [tx, tz] = at(prog + 8), want = height(prog + 5);
        const yaw = Math.atan2(-(tx - v.pos.x), -(tz - v.pos.z)), err = Math.atan2(Math.sin(yaw - v.yaw), Math.cos(yaw - v.yaw));
        const steer = Math.max(-1, Math.min(1, -err * 2.5)), thr = Math.hypot(v.vel.x, v.vel.z) < top ? 1 : 0.2;
        g.tick(1, { up: v.pos.y < want - 0.15, down: v.pos.y > want + 0.15, mx: -Math.sin(v.yaw) * thr + Math.cos(v.yaw) * steer, mz: -Math.cos(v.yaw) * thr - Math.sin(v.yaw) * steer });
      }
      return near(v.pos.x, v.pos.z).prog;
    };
  });
  const P3 = COURSE3.points.map(p => [p.x, p.z]), H3 = COURSE3.air.heights;

  // 1) Old town area: theme, objective, every part reachable on foot, budget.
  await page.evaluate(() => { const g = window.__game; g.setSeed(4242); g.startLevel(3); g.setPaused(true); g.teleport(4, 0, 7); g.tick(3); g.setCamera(-0.5, 0.24); });
  assert.equal(await page.evaluate(() => window.__game.state.world.theme), 'oldtown');
  await text('.hint', 'Old town! Find the 6 drone parts');
  await text('.parts .v', '0/6');
  assert.deepEqual(await page.evaluate(() => window.__game.reach()), [true, true, true, true, true, true], 'all six drone parts reachable on foot');
  await shot('area', 1500);
  const area = await info();
  console.log('old town area', area.calls, area.triangles);
  assert.ok(area.calls <= BUDGET.areaCalls && area.triangles <= BUDGET.areaTris, `area budget ${area.calls} calls / ${area.triangles} tris`);

  // 2) Hidden battery: glow in the clock tower, the hint pyshka's line, the clock room through the hatch.
  assert.ok(await visible('battery-glow'), 'battery glow while it is up in the clock tower');
  await page.evaluate(() => { const g = window.__game, h = g.state.creatures.find(c => c.hinter); g.teleport(h.pos.x - 3, 0, h.pos.z + 1); g.tick(2); });
  await page.waitForFunction(() => { const g = window.__game; g.tick(10); return [...document.querySelectorAll('.bubble')].some(b => b.textContent.includes('clock tower')); }, null, { timeout: 30000, polling: 50 });
  await page.evaluate(() => { const g = window.__game; g.teleportTo('battery'); g.tick(3); });
  assert.ok(await page.evaluate(() => { const p = window.__game.state.players[0].pos; return p.y > 9.5 && p.z < -20.4 && p.z > -22; }), 'teleportTo(battery) lands inside the clock room');
  // step aside a little so the camera looks past the hero, through the hatch, at the glowing battery
  await page.evaluate(() => { const g = window.__game; g.teleport(22.4, 9.6, -21.9); g.tick(3); g.state.players[0].yaw = 0.18; g.setCamera(0.18, 0.02); });
  assert.equal(await page.evaluate(() => window.__game.state.pickups.find(p => p.part === 'battery').status), 'world');
  await shot('hidden-part');
  await page.evaluate(() => { const g = window.__game; g.tick(40, { mx: 0, mz: -0.5 }); });
  assert.equal(await page.evaluate(() => window.__game.state.pickups.find(p => p.part === 'battery').status), 'carried', 'walk in and take the battery');
  await text('.toast', 'Battery');
  await page.waitForFunction(() => !window.__game.view.scene.getObjectByName('battery-glow').visible, null, { timeout: 10000 });

  // 3) The rest of the parts to the drone workshop: drone assembled, Fly button.
  await page.evaluate(() => { const g = window.__game; g.collectAll(); g.teleport(9.6, 0, 15.6); g.tick(3); g.setCamera(1.45, 0.3); });
  await text('.parts .v', '6/6');
  assert.equal(await page.evaluate(() => window.__game.state.vehicles[0].kind), 'drone');
  await text('.hint', 'Hop on your drone!');
  await page.waitForFunction(() => document.querySelector('.ride-btn').textContent.includes('🚁'));
  await shot('drone-garage');

  // 4) Get on and fly with the real on-screen UP button, then hover; DOWN lands; Space climbs on a keyboard.
  await page.evaluate(() => { const g = window.__game; g.interact(); g.tick(2); g.setPaused(false); });
  await page.waitForFunction(() => document.querySelector('.hud').classList.contains('flying'), null, { timeout: 10000 });
  assert.ok(await page.isVisible('.act-up') && await page.isVisible('.act-down') && !(await page.isVisible('.act-jump')), 'UP/DOWN replace jump while flying');
  const y0 = (await drone()).y;
  await page.locator('.act-up').dispatchEvent('pointerdown');
  await page.waitForFunction(y0 => window.__game.state.vehicles[0].pos.y > y0 + 3, y0, { timeout: 60000, polling: 50 });
  await page.locator('.act-up').dispatchEvent('pointerup');
  await page.evaluate(() => { window.__game.setPaused(true); window.__game.tick(40); });
  const hover = (await drone()).y;
  await page.evaluate(() => window.__game.tick(90));
  assert.ok(Math.abs((await drone()).y - hover) < 0.05, 'hovers when idle');
  await page.evaluate(() => { const g = window.__game, v = g.state.vehicles[0]; g.tick(150, { up: true }); g.tick(70, { mx: -Math.sin(v.yaw) * 0.6 - 0.4, mz: -Math.cos(v.yaw) * 0.6 }); g.setCamera(v.yaw + 0.35, 0.3); });
  await page.waitForFunction(() => document.querySelector('.hud').classList.contains('flying'));
  await text('.hint', 'Fly through the green gate!');
  await shot('flying');
  const fly = await info();
  console.log('flying', fly.calls, fly.triangles, JSON.stringify(await drone()));
  assert.ok(fly.calls <= BUDGET.areaCalls && fly.triangles <= BUDGET.areaTris, `flying budget ${fly.calls} / ${fly.triangles}`);
  await page.evaluate(() => window.__game.setPaused(false));
  const before = (await drone()).y;
  await page.keyboard.down('Space');
  await page.waitForFunction(b => window.__game.state.vehicles[0].pos.y > b + 0.5, before, { timeout: 30000, polling: 50 }); // Space climbs
  await page.keyboard.up('Space');
  await page.keyboard.down('ShiftLeft');
  await page.waitForFunction(() => window.__game.state.vehicles[0].grounded, null, { timeout: 60000, polling: 50 });
  await page.keyboard.up('ShiftLeft');
  await page.evaluate(() => window.__game.setPaused(true));

  // 5) The flight gate is open; fly into it: race with rings, stars, chevrons; budget.
  assert.equal(await page.evaluate(() => window.__game.raceState.phase), 'open');
  await page.waitForFunction(() => !document.querySelector('.gate-compass').hidden);
  await text('.hint', 'Fly through the green gate!');
  const t = levelDef(3).race.trigger;
  await page.evaluate(t => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: (t.minX + t.maxX) / 2, y: 3, z: (t.minZ + t.maxZ) / 2 }; g.tick(2); }, t);
  assert.equal(await page.evaluate(() => window.__game.raceState.phase), 'racing');
  await text('.hint', 'Flight!');
  await text('.parts .v', `/${courseStars(COURSE3).length}`);
  await page.evaluate(P => window.__fly(P.P, P.H, 9, 150), { P: P3, H: H3 });
  await page.evaluate(() => { const g = window.__game, v = g.state.vehicles[0]; g.setCamera(v.yaw, 0.26); });
  assert.ok(await visible('race-rings') && await visible('race-stars') && await visible('flight-chevrons'), 'rings, stars and chevrons along the route');
  await shot('course-rings');
  let maxCalls = 0;
  for (const d of [100, 250, 360, 497, 640, 740]) {
    const p = courseAt(COURSE3, d);
    await page.evaluate(({ p, y }) => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: p.x, y, z: p.z }; v.yaw = p.yaw; v.vel = { x: 0, y: 0, z: 0 }; g.tick(1); g.setCamera(p.yaw, 0.3); }, { p, y: courseHeightAt(COURSE3, d) });
    await page.waitForTimeout(900);
    maxCalls = Math.max(maxCalls, (await info()).calls);
  }
  console.log('flight race views max calls', maxCalls);
  assert.ok(maxCalls <= BUDGET.raceCalls, `course budget ${maxCalls}`);

  // 6) Hooligans on the roofs spring up at the drone; a sticky shot pays +1 s.
  const hit = await page.evaluate(P => {
    const g = window.__game, s = g.state;
    g.startRace(); g.setPaused(true);
    for (let k = 0; k < 40 && s.race.hits === 0 && s.race.phase === 'racing'; k++) {
      window.__fly(P.P, P.H, 7, 20);
      s.players[0].fireCd = 0; g.fire('sticky');
    }
    return s.race.hits;
  }, { P: P3, H: H3 });
  assert.ok(hit >= 1, 'slime shot hits a rooftop hooligan');
  await text('.bonus-pop', 'Gotcha');

  // 7) A real full-course flight from the start line: medal, record, stars, ghost; Level 3 complete + car teaser.
  const result = await page.evaluate(P => { const g = window.__game; g.startRace(); g.setPaused(true); window.__fly(P.P, P.H, 9, 9000); return { phase: g.raceState.phase, win: g.state.winTime, stars: g.raceState.stars.length, rings: g.raceState.rings.length }; }, { P: P3, H: H3 });
  console.log('level 3 flight', result);
  assert.equal(result.phase, 'finished', 'flight course flown to the finish');
  assert.ok(result.rings >= 9 && result.stars >= 6, 'rings and stars collected on the way');
  await page.evaluate(() => { const g = window.__game; g.setCamera(g.state.vehicles[0].yaw + Math.PI, 0.3); g.setPaused(false); });
  await page.waitForFunction(() => document.querySelector('.win').style.display !== 'none');
  await text('.win-title', 'Level 3 complete!');
  await page.waitForFunction(() => !document.querySelector('.teaser').hidden && !document.querySelector('.car').hidden && document.querySelector('.drone').hidden);
  await text('.teaser-title', 'Level 4: Car');
  await text('.again', 'Fly again');
  assert.equal(await page.locator('.win-medal').isVisible(), true, 'medal shown');
  await text('.win-best', 'New record!');
  const card = await page.locator('.win-card').boundingBox();
  assert.ok(card.y >= 0 && card.y + card.height <= 915 && card.x >= 0 && card.x + card.width <= 412, 'finish card inside the phone viewport');
  const best = await page.evaluate(() => JSON.parse(localStorage.getItem('slimecity.best.L3')));
  assert.ok(Math.abs(best.time - result.win) < 1e-6 && best.medal, 'best time + medal saved for level 3');
  assert.ok((await page.evaluate(() => localStorage.getItem('slimecity.ghost.L3')?.length)) > 1000, 'ghost of the record flight saved');
  await shot('finish', 900);

  // 8) Fly again: the ghost drone flies ahead; then let the clock run out -> time's up -> Try again restarts the race.
  await page.locator('.again').click();
  assert.equal(await page.evaluate(() => window.__game.state.level), 3);
  await page.evaluate(() => { const g = window.__game; g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.setPaused(true); g.tick(150); });
  assert.ok(await visible('ghost-bike'), 'ghost of the best flight replays');
  await page.evaluate(() => { const g = window.__game; g.tick(Math.ceil(g.raceState.remaining * 60) + 30); g.setPaused(false); });
  await page.waitForFunction(() => document.querySelector('.win').style.display !== 'none');
  await text('.again', 'Try again');
  await page.locator('.again').click();
  assert.equal(await page.evaluate(() => window.__game.raceState.phase), 'racing', 'retry restarts the flight race');
  assert.deepEqual(errors, []);
  console.log(`ok round15: old town budget + reach, hidden battery + hint, drone garage, UP/Space flight, flight race (rings, stars, hooligan), full-course ${best.medal} ${best.time.toFixed(1)}s, Level 3 complete + car teaser, retry; six 412x915 shots`);
} finally { await browser.close(); await loader.close(); await new Promise(r => server.httpServer.close(r)); }
