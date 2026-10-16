// Level 2 (harbor scooter) browser flow on a 412x915 phone: area, parts, garage scooter, race, finish screen.
// Checks budgets against level-1 numbers, the harbor gate cues/compass, localized hints and the drone teaser.
// Saves shots/r9-l2-{area,parts,garage-scooter,race,finish}.png. Run: npm run build && node tests/round9.e2e.mjs
import { preview, createServer } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const loader = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
const { courseAt, COURSE2 } = await loader.ssrLoadModule('/src/sim/track.ts');
const { levelDef } = await loader.ssrLoadModule('/src/sim/levels.ts');
const server = await preview({ preview: { port: 4189 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
// Level 1 measured budgets (PROGRESS R4.2): locked city 387 calls / 585k tris, race ≤ 287 calls.
const BUDGET = { areaCalls: 387, areaTris: 585156, raceCalls: 287 };
try {
  await mkdir('shots', { recursive: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  const shot = async (name, wait = 1200) => { await page.waitForTimeout(wait); await page.screenshot({ path: `shots/r9-l2-${name}.png`, timeout: 120000 }); };
  const text = (sel, want) => page.waitForFunction(([sel, want]) => document.querySelector(sel)?.textContent === want, [sel, want], { timeout: 20000 });
  const info = () => page.evaluate(() => window.__game.renderInfo());

  // Reach level 2 the way a player does: finish the level-1 race, then Next level.
  await page.evaluate(() => { const g = window.__game; g.start(); g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.raceFinish(); g.setPaused(false); });
  await page.waitForFunction(() => document.querySelector('.win').style.display !== 'none');
  await page.locator('.again').click();
  assert.equal(await page.evaluate(() => window.__game.state.level), 2);
  assert.equal(await page.evaluate(() => window.__game.state.world.theme), 'harbor');
  await page.evaluate(() => { const g = window.__game; g.setPaused(true); g.state.creatures.forEach((c, i) => { c.pos = { x: -3 + i, y: 0, z: 1 + (i % 2) }; }); g.tick(2); g.setCamera(0.35, 0.32); });
  await text('.hint', 'Harbor! Find the 4 scooter parts');
  await text('.parts .v', '0/4');
  assert.deepEqual(await page.evaluate(() => window.__game.reach()), [true, true, true, true], 'all scooter parts reachable on foot');
  assert.equal(await page.evaluate(() => !!window.__game.view.scene.getObjectByName('lighthouse-lantern')), true);
  await shot('area');
  const area = await info();
  console.log('harbor area', area.calls, area.triangles);
  assert.ok(area.calls <= BUDGET.areaCalls && area.triangles <= BUDGET.areaTris, 'harbor within level-1 area budget');

  // A part on the pier end, boat behind it.
  await page.evaluate(() => { const g = window.__game; g.teleport(-5.5, 1, -27.5); g.tick(2); g.setCamera(-0.25, 0.3); });
  assert.equal(await page.evaluate(() => window.__game.state.pickups[0].status), 'world');
  await shot('parts');

  // Collect everything, scooter assembled at the shop; the open harbor gate shows its cues.
  await page.evaluate(() => { const g = window.__game; g.collectAll(); g.teleport(10, 0, 11); g.tick(2); g.setCamera(1.05, 0.3); });
  await text('.parts .v', '4/4');
  assert.equal(await page.evaluate(() => window.__game.state.vehicles[0].kind), 'scooter');
  await text('.hint', 'Hop on your scooter!');
  await page.waitForFunction(() => document.querySelector('.ride-btn').textContent.includes('🛴'));
  await shot('garage-scooter');
  await page.evaluate(() => { const g = window.__game; g.interact(); g.tick(2); });
  assert.equal(await page.evaluate(() => window.__game.state.race.phase), 'open');
  await page.waitForFunction(() => !document.querySelector('.gate-compass').hidden);
  assert.equal(await page.evaluate(() => { const o = window.__game.view.scene.getObjectByName('race-gate-arrow'); let v = true; for (let p = o; p; p = p.parent) v &&= p.visible; return v && Math.abs(o.position.x - 29.5) < 0.01; }), true);

  // Drive into the gate trigger to start the coastal race.
  const t = levelDef(2).race.trigger;
  await page.evaluate(t => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: (t.minX + t.maxX) / 2, y: 0, z: (t.minZ + t.maxZ) / 2 }; g.tick(2); }, t);
  assert.equal(await page.evaluate(() => window.__game.state.race.phase), 'racing');
  await text('.hint', 'Race! ↑ Forward · coast road to the lighthouse');
  for (const [name, d, y] of [['race', 236, 0], ['race-loop', 400, 0]]) {
    const p = courseAt(COURSE2, d);
    await page.evaluate(({ p, y }) => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: p.x, y, z: p.z }; v.yaw = p.yaw; v.speed = 0; g.tick(1); g.setCamera(p.yaw, 0.28); }, { p, y });
    if (name === 'race') await shot('race'); else await page.waitForTimeout(1200);
    const r = await info();
    console.log(name, r.calls, r.triangles);
    assert.ok(r.calls <= BUDGET.raceCalls, `${name} calls within level-1 race budget`);
  }

  // Real driving to the finish with a steering bot inside the page.
  const course = { points: COURSE2.points.map(p => [p.x, p.z]) };
  const phase = await page.evaluate(course => {
    const g = window.__game, v = g.state.vehicles[0], P = course.points;
    g.startRace(); g.setPaused(true); // honest time from the start line
    const near = (x, z) => { let best = { d: Infinity, prog: 0 }, prog = 0; for (let i = 1; i < P.length; i++) { const [ax, az] = P[i - 1], [bx, bz] = P[i], dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz); const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L / L)); const d = Math.hypot(x - ax - dx * t, z - az - dz * t); if (d < best.d) best = { d, prog: prog + L * t }; prog += L; } return best; };
    const at = s => { for (let i = 1; i < P.length; i++) { const [ax, az] = P[i - 1], [bx, bz] = P[i], L = Math.hypot(bx - ax, bz - az); if (s <= L || i === P.length - 1) { const k = Math.min(1, s / L); return [ax + (bx - ax) * k, az + (bz - az) * k]; } s -= L; } };
    for (let i = 0; i < 6000 && g.raceState.phase === 'racing'; i++) {
      const [tx, tz] = at(near(v.pos.x, v.pos.z).prog + 9);
      const want = Math.atan2(-(tx - v.pos.x), -(tz - v.pos.z)), err = Math.atan2(Math.sin(want - v.yaw), Math.cos(want - v.yaw));
      const steer = Math.max(-0.65, Math.min(0.65, -err * 2)), thr = v.speed < 10.5 ? 1 : 0.18;
      g.tick(1, { mx: -Math.sin(v.yaw) * thr + Math.cos(v.yaw) * steer, mz: -Math.cos(v.yaw) * thr - Math.sin(v.yaw) * steer });
    }
    g.setCamera(v.yaw + Math.PI, 0.3);
    return g.raceState.phase;
  }, course);
  assert.equal(phase, 'finished', 'scooter finishes the coastal course');
  const won = await page.evaluate(() => window.__game.state.winTime);
  assert.ok(won > 35 && won < levelDef(2).race.duration, `realistic finish time ${won}`);
  await page.evaluate(() => window.__game.setPaused(false));
  await page.waitForFunction(() => document.querySelector('.win').style.display !== 'none');
  await text('.win-title', 'Level 2 complete!');
  await page.waitForFunction(() => !document.querySelector('.teaser').hidden);
  await text('.teaser-title', 'Level 3: Drone');
  const card = await page.locator('.win-card').boundingBox();
  assert.ok(card.x >= 0 && card.y >= 0 && card.x + card.width <= 412 && card.y + card.height <= 915, 'finish card inside phone viewport');
  await shot('finish', 900);
  // Race again restarts level 2.
  await page.locator('.again').click();
  assert.equal(await page.evaluate(() => window.__game.state.level), 2);
  assert.deepEqual(errors, []);
  console.log('ok round9: harbor level flow, budgets, gate cues, coastal race finish, drone teaser; five 412x915 shots');
} finally { await browser.close(); await loader.close(); await new Promise(r => server.httpServer.close(r)); }
