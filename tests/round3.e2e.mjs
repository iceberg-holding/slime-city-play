import { preview } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const server = await preview({ preview: { port: 4183 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => localStorage.setItem('slimecity.classicButtons', '0'));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  await page.evaluate(() => { const g = window.__game; g.start(); g.setPaused(true); g.collectAll(); g.interact(); g.state.vehicles[0].pos.z = 11.5; g.tick(); g.setCamera(-0.7, 0.45); });
  assert.ok(await page.isVisible('.act-sticky'), 'old gesture users migrate to classic');
  await mkdir('shots', { recursive: true });
  const shot = async name => { await page.waitForTimeout(800); await page.screenshot({ path: `shots/r3-${name}.png` }); };
  await shot('gates-open');
  await page.evaluate(() => { const g = window.__game; g.startRace(); g.tick(30, { mz: -1 }); g.fire('sticky', Math.PI); });
  assert.equal(await page.evaluate(() => window.__game.state.projectiles.at(-1).vel.z < 0), true, 'riding shoots forward independently of camera');
  await shot('race-pyshki');
  // Drive the actual curved course through physics with a simple look-ahead steering driver.
  const result = await page.evaluate(() => {
    const g = window.__game, v = g.state.vehicles[0], P = g.raceCourse.points;
    const near = (x, z) => { let best = { d: Infinity, prog: 0 }, prog = 0; for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz); const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / L / L)); const d = Math.hypot(x - a.x - dx * t, z - a.z - dz * t); if (d < best.d) best = { d, prog: prog + L * t }; prog += L; } return best; };
    const at = s => { for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], L = Math.hypot(b.x - a.x, b.z - a.z); if (s <= L || i === P.length - 1) { const k = Math.min(1, s / L); return [a.x + (b.x - a.x) * k, a.z + (b.z - a.z) * k]; } s -= L; } };
    for (let i = 0; i < 6000 && g.raceState.phase === 'racing'; i++) {
      const [tx, tz] = at(near(v.pos.x, v.pos.z).prog + 9);
      const want = Math.atan2(-(tx - v.pos.x), -(tz - v.pos.z)), err = Math.atan2(Math.sin(want - v.yaw), Math.cos(want - v.yaw));
      const steer = Math.max(-0.65, Math.min(0.65, -err * 2)), thr = v.speed < 9.75 ? 1 : 0.18;
      g.tick(1, { mx: -Math.sin(v.yaw) * thr + Math.cos(v.yaw) * steer, mz: -Math.cos(v.yaw) * thr - Math.sin(v.yaw) * steer });
    }
    return g.raceState.phase;
  });
  assert.equal(result, 'finished', 'course can be driven in time');
  await page.waitForFunction(() => document.querySelector('.win').style.display !== 'none');
  await shot('finish-next-level');
  await page.locator('.again').click();
  assert.equal(await page.evaluate(() => window.__game.state.level), 2);
  await page.evaluate(() => { const g = window.__game; g.setPaused(true); g.collectAll(); g.teleport(3, 0, 19); g.setCamera(-0.6, 0.65); });
  await shot('level2-scooter');
  await page.evaluate(() => { const g = window.__game; g.start(); g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.tick(Math.ceil((g.raceState.remaining + 1) * 60)); g.setPaused(false); });
  await page.waitForFunction(() => document.querySelector('.again').textContent === 'Try again');
  await page.locator('.again').click();
  assert.equal(await page.evaluate(() => window.__game.raceState.phase), 'racing');
  assert.deepEqual(errors, []);
  console.log('ok round 3: migration, forward shooting, drivable finish, next level, timeout/retry; four 412x915 screenshots');
} finally { await browser.close(); await new Promise(r => server.httpServer.close(r)); }
