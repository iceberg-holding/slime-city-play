// Round 7 browser flow on a 412x915 phone: flashlight floor + hint pyshka, locked gate until the headlight is on,
// stars and fire rings, TRICK button, hooligan hit, real full-course finish with medal + record, ghost replay of
// that run, level 2 race. Checks draw-call budgets and console errors.
// Saves shots/r13-{flashlight-floor,gate-locked,race-stars-rings,trick,ghost,hooligan-hit,finish-medal,l2-race}.png.
// Run: npm run build && node tests/round13.e2e.mjs
import { preview, createServer } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const loader = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
const { courseAt, COURSE1, COURSE2, courseStars } = await loader.ssrLoadModule('/src/sim/track.ts');
const { levelDef } = await loader.ssrLoadModule('/src/sim/levels.ts');
const { TOWER } = await loader.ssrLoadModule('/src/sim/tower.ts');
const server = await preview({ preview: { port: 4191 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
// Round 7 budgets on a phone viewport.
const BUDGET = { cityCalls: 410, cityTris: 610000, raceCalls: 300 };
try {
  await mkdir('shots', { recursive: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  const shot = async (name, wait = 1200) => { await page.waitForTimeout(wait); await page.screenshot({ path: `shots/r13-${name}.png`, timeout: 120000 }); };
  const text = (sel, want) => page.waitForFunction(([sel, want]) => document.querySelector(sel)?.textContent.includes(want), [sel, want], { timeout: 20000 });
  const info = () => page.evaluate(() => window.__game.renderInfo());
  const visible = name => page.evaluate(name => { const o = window.__game.view.scene.getObjectByName(name); let v = !!o; for (let p = o; p; p = p.parent) v &&= p.visible; return v; }, name);
  // In-page steering driver along a course polyline: throttle to `top`, optional per-tick extra input.
  await page.evaluate(() => {
    window.__drive = (P, top, ticks, until = () => false) => {
      const g = window.__game, v = g.state.vehicles[0];
      const near = (x, z) => { let best = { d: Infinity, prog: 0 }, prog = 0; for (let i = 1; i < P.length; i++) { const [ax, az] = P[i - 1], [bx, bz] = P[i], dx = bx - ax, dz = bz - az, L = Math.hypot(dx, dz); const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L / L)); const d = Math.hypot(x - ax - dx * t, z - az - dz * t); if (d < best.d) best = { d, prog: prog + L * t }; prog += L; } return best; };
      const at = s => { for (let i = 1; i < P.length; i++) { const [ax, az] = P[i - 1], [bx, bz] = P[i], L = Math.hypot(bx - ax, bz - az); if (s <= L || i === P.length - 1) { const k = Math.min(1, s / L); return [ax + (bx - ax) * k, az + (bz - az) * k]; } s -= L; } };
      for (let i = 0; i < ticks && g.raceState.phase === 'racing' && !until(); i++) {
        const [tx, tz] = at(near(v.pos.x, v.pos.z).prog + 9);
        const want = Math.atan2(-(tx - v.pos.x), -(tz - v.pos.z)), err = Math.atan2(Math.sin(want - v.yaw), Math.cos(want - v.yaw));
        const steer = Math.max(-0.65, Math.min(0.65, -err * 2)), thr = v.speed < top ? 1 : 0.18;
        g.tick(1, { mx: -Math.sin(v.yaw) * thr + Math.cos(v.yaw) * steer, mz: -Math.cos(v.yaw) * thr - Math.sin(v.yaw) * steer });
      }
      return near(v.pos.x, v.pos.z).prog;
    };
  });
  const P1 = COURSE1.points.map(p => [p.x, p.z]), P2 = COURSE2.points.map(p => [p.x, p.z]);

  // City budget at the spawn (seeded so the pyshki looks are reproducible).
  await page.evaluate(() => { const g = window.__game; g.setSeed(4242); g.start(); g.setPaused(true); });
  await page.waitForTimeout(1200);
  const city = await info();
  console.log('city spawn', city.calls, city.triangles);
  assert.ok(city.calls <= BUDGET.cityCalls && city.triangles <= BUDGET.cityTris, `city budget ${city.calls} calls / ${city.triangles} tris`);
  await text('.parts .v', '0/6');
  assert.deepEqual(await page.evaluate(() => window.__game.reach()), [true, true, true, true, true, true], 'five parts on foot, the flashlight via the elevator only');

  // 1) Hint pyshka by the lobby gossips about the flashlight upstairs.
  await page.evaluate(() => { const g = window.__game, h = g.state.creatures.find(c => c.hinter); g.teleport(h.pos.x - 3, 0, h.pos.z + 1); g.tick(2); });
  await page.waitForFunction(() => { const g = window.__game; g.tick(10); return [...document.querySelectorAll('.bubble')].some(b => b.textContent.includes('flashlight upstairs')); }, null, { timeout: 30000, polling: 50 });
  // 2) Mid floor via the elevator: the flashlight glows by the windows (glow visible from outside too).
  assert.ok(await visible('flashlight-window-glow'), 'window glow while the flashlight is upstairs');
  await page.evaluate(({ T }) => { const g = window.__game; g.state.elevator.y = T.mid; g.state.elevator.target = 1; g.state.elevator.wait = 99; g.teleport(27.4, T.mid, -25.4); g.tick(3); g.state.players[0].yaw = 2.95; g.setCamera(2.95, 0); }, { T: TOWER });
  await shot('flashlight-floor');
  // Take the flashlight, ride the lift down and walk out (teleport for speed), assemble without it first.
  await page.evaluate(() => {
    const g = window.__game, s = g.state, p = s.players[0];
    s.pickups.forEach(pk => { if (pk.part !== 'flashlight') { pk.status = 'carried'; pk.carrier = p.id; } });
    g.teleportTo('garage'); g.tick(3); g.interact(); g.tick(2);
  });
  assert.equal(await page.evaluate(() => window.__game.state.garages[0].built), true, 'bike builds from five parts');
  // 3) Ride to the gate: locked, the hint says to find the flashlight; no compass.
  await page.evaluate(() => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: 5.5, y: 0, z: 13.4 }; v.yaw = 0; g.tick(30); g.setCamera(0.25, 0.32); });
  assert.equal(await page.evaluate(() => window.__game.raceState.phase), 'locked');
  await text('.hint', 'Find the flashlight');
  assert.equal(await page.locator('.gate-compass').isHidden(), true);
  await shot('gate-locked');
  // Fit the headlight: gate opens, headlight beam is on.
  await page.evaluate(() => { const g = window.__game, s = g.state, p = s.players[0], f = s.pickups.find(pk => pk.part === 'flashlight'); f.status = 'carried'; f.carrier = p.id; const v = s.vehicles[0]; v.pos = { x: 5.5, y: 0, z: 15.5 }; g.tick(3); });
  await text('.toast', 'Headlight on');
  assert.equal(await page.evaluate(() => window.__game.raceState.phase), 'open');
  assert.equal(await page.evaluate(() => { const v = window.__game.view; let lit = 0; v.scene.traverse(o => { if (o.name === 'headlight-beam') { let vis = true; for (let p = o; p; p = p.parent) vis &&= p.visible; if (vis) lit++; } }); return lit >= 1; }), true, 'headlight visibly on');

  // 4) Real full-course drive from the start line: medal, record, stars and ring bonus on the finish card.
  const result = await page.evaluate(P => { const g = window.__game; g.startRace(); g.setPaused(true); window.__drive(P, 11, 9000); return { phase: g.raceState.phase, win: g.state.winTime, stars: g.raceState.stars.length, rings: g.raceState.rings.length, bonus: g.raceState.bonus }; }, P1);
  console.log('level 1 drive', result);
  assert.equal(result.phase, 'finished', 'level 1 course driven to the finish');
  assert.ok(result.rings >= 5 && result.stars >= 8, 'stars and rings collected on the way');
  await page.evaluate(() => { const g = window.__game; g.setCamera(g.state.vehicles[0].yaw + Math.PI, 0.3); g.setPaused(false); });
  await page.waitForFunction(() => document.querySelector('.win').style.display !== 'none');
  assert.equal(await page.locator('.win-medal').isVisible(), true, 'medal shown');
  await text('.win-best', 'New record!');
  await text('.win-stats', `⭐ ${result.stars}/${courseStars(COURSE1).length}`);
  const card = await page.locator('.win-card').boundingBox();
  assert.ok(card.y >= 0 && card.y + card.height <= 915, 'finish card inside the phone viewport');
  const best = await page.evaluate(() => JSON.parse(localStorage.getItem('slimecity.best.L1')));
  assert.ok(Math.abs(best.time - result.win) < 1e-6 && best.medal, 'best time + medal saved');
  assert.ok((await page.evaluate(() => localStorage.getItem('slimecity.ghost.L1')?.length)) > 1000, 'ghost of the record run saved');
  await shot('finish-medal', 900);

  // 5) Race again (test hook) with the ghost of that run riding ahead.
  await page.evaluate(() => { const g = window.__game; g.startRace(); g.setPaused(true); g.tick(200); const v = g.state.vehicles[0]; g.setCamera(v.yaw, 0.22); });
  await page.waitForTimeout(400);
  const ghost = await page.evaluate(() => { const g = window.__game, gb = g.view.scene.getObjectByName('ghost-bike'), v = g.state.vehicles[0]; return { vis: gb.visible, ahead: v.pos.z - gb.position.z }; });
  assert.ok(ghost.vis && ghost.ahead > 5, `ghost replay rides ahead (${JSON.stringify(ghost)})`);
  await shot('ghost');

  // 6) Stars and a fire ring ahead of the first ramp; star counter in the HUD.
  const d = courseAt(COURSE1, 30);
  await page.evaluate(d => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: d.x, y: 0, z: d.z }; v.yaw = d.yaw; v.speed = 0; g.tick(1); g.setCamera(d.yaw, 0.28); }, d);
  await text('.parts .v', `/${courseStars(COURSE1).length}`);
  assert.ok(await visible('race-rings') && await visible('race-stars'));
  const race = await info();
  console.log('race view', race.calls, race.triangles);
  assert.ok(race.calls <= BUDGET.raceCalls, `race budget ${race.calls}`);
  await shot('race-stars-rings');

  // 7) TRICK over the first ramp: a backflip in the air, then the popup with a funny phrase after landing.
  const trick = await page.evaluate(P => {
    const g = window.__game, v = g.state.vehicles[0];
    window.__drive(P, 12.5, 600, () => !v.grounded && g.raceState.progress > 54);
    g.tick(1, { trick: true }); g.tick(12);
    const mid = { trick: v.trick, air: !v.grounded };
    for (let i = 0; i < 200 && !v.grounded; i++) g.tick(1);
    g.setCamera(v.yaw, 0.3);
    return { ...mid, points: g.raceState.points };
  }, P1);
  assert.ok(trick.air && trick.trick === 'flip' && trick.points >= 100, `backflip landed (${JSON.stringify(trick)})`);
  await text('.trick', 'Backflip');
  assert.ok((await page.textContent('.trick-quip')).length > 3, 'funny landing phrase');
  await shot('trick', 250);

  // 8) Hooligans dash into the road; a sticky shot pays +1 s.
  const hit = await page.evaluate(() => {
    const g = window.__game, s = g.state, v = s.vehicles[0];
    const course = g.raceCourse, P = course.points;
    let prog = 0, at = 166; // section-2 hooligan sits at 177 m (dashes when the rider is close)
    for (let i = 1; i < P.length; i++) { const L = Math.hypot(P[i].x - P[i - 1].x, P[i].z - P[i - 1].z); if (at <= L) { const k = at / L; v.pos = { x: P[i - 1].x + (P[i].x - P[i - 1].x) * k, y: 0, z: P[i - 1].z + (P[i].z - P[i - 1].z) * k }; v.yaw = Math.atan2(-(P[i].x - P[i - 1].x), -(P[i].z - P[i - 1].z)); break; } at -= L; prog += L; }
    v.speed = 0; g.tick(50); window.__dbg = s.creatures.filter(c => c.dash).map(c => [c.slot, Math.round(c.pos.x), Math.round(c.pos.z)]).concat([[Math.round(v.pos.x), Math.round(v.pos.z)]]);
    for (let i = 0; i < 40 && s.race.hits === 0; i++) { s.players[0].fireCd = 0; g.fire('sticky'); g.tick(12); }
    g.setCamera(v.yaw, 0.3);
    return s.race.hits;
  });
  assert.ok(hit >= 1, 'slime shot hits a hooligan ' + JSON.stringify(await page.evaluate(() => window.__dbg)));
  await text('.bonus-pop', 'Gotcha');
  await shot('hooligan-hit', 300);

  // 9) Level 2 race: longer coastal course with stars and rings.
  await page.evaluate(() => { const g = window.__game; g.startLevel(2); g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.setPaused(true); });
  const d2 = courseAt(COURSE2, 103);
  await page.evaluate(d => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: d.x, y: 0, z: d.z }; v.yaw = d.yaw; g.tick(1); g.setCamera(d.yaw, 0.28); }, d2);
  await text('.parts .v', `/${courseStars(COURSE2).length}`);
  const l2 = await info();
  console.log('level 2 race view', l2.calls, l2.triangles);
  assert.ok(l2.calls <= BUDGET.raceCalls, `level 2 race budget ${l2.calls}`);
  assert.ok(COURSE2.length > 1.4 * 518 && COURSE1.length > 1.4 * 563.8, 'both courses ~1.5x longer');
  await shot('l2-race');
  assert.deepEqual(errors, []);
  console.log(`ok round13: flashlight + hint, locked gate, full-course medal ${best.medal} ${best.time.toFixed(1)}s, ghost, stars/rings, backflip, hooligan hit, level 2; eight 412x915 shots`);
} finally { await browser.close(); await loader.close(); await new Promise(r => server.httpServer.close(r)); }
