import { preview, createServer } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const loader = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
const { trackAt, TRACK_LENGTH } = await loader.ssrLoadModule('/src/sim/track.ts');
const { RACE } = await loader.ssrLoadModule('/src/sim/race.ts');
const server = await preview({ preview: { port: 4184 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  await page.evaluate(() => { const g = window.__game; g.start(); g.setPaused(true); });
  await page.waitForTimeout(1000);
  const city = await page.evaluate(() => window.__game.renderInfo());
  console.log('locked city', city);
  assert.ok(city.calls <= 404 && city.triangles <= 596000, 'locked city performance budget');
  await page.evaluate(() => { const g = window.__game; g.collectAll(); g.interact(); g.startRace(); g.setPaused(true); });
  for (const [name, d, y] of [['start', 0, 0], ['curve', 100, 0], ['jump', 359, 2.3], ['scenery', 420, 0]]) {
    const p = trackAt(d);
    await page.evaluate(({ p, y }) => {
      const g = window.__game, v = g.state.vehicles[0];
      v.pos = { x: p.x, y, z: p.z }; v.yaw = p.yaw;
      g.tick(1); g.setCamera(p.yaw, 0.3);
    }, { p, y });
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => window.__game.renderInfo());
    console.log(name, info.calls, info.triangles);
    assert.ok(info.calls <= 450, `${name}: race calls <=450`);
    assert.equal(await page.locator('.toast.on').count(), 0);
    const pill = await page.locator('.ride-btn').boundingBox();
    assert.ok(pill.x < 30 && pill.y < 220, 'exit is at phone left edge');
    await page.screenshot({ path: `shots/r6-race-${name}.png` });
  }
  await page.evaluate(duration => { const g = window.__game; g.tick(Math.ceil((duration + 1) * 60)); g.setPaused(false); }, RACE.duration);
  await page.waitForFunction(() => document.querySelector('.again').textContent === 'Try again');
  await page.locator('.again').click();
  assert.equal(await page.evaluate(() => window.__game.raceState.phase), 'racing');
  await page.close();
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  desktop.on('pageerror', e => errors.push(e.message));
  await desktop.goto(server.resolvedUrls.local[0]);
  await desktop.waitForFunction(() => window.__game);
  await desktop.evaluate(() => { const g = window.__game; g.start(); g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.setPaused(true); });
  await desktop.waitForTimeout(1200);
  const desktopInfo = await desktop.evaluate(() => window.__game.renderInfo());
  console.log('desktop race', desktopInfo.calls, desktopInfo.triangles);
  assert.ok(desktopInfo.calls <= 450, 'desktop race performance budget');
  assert.deepEqual(errors, []);
  console.log(`ok round4: ${TRACK_LENGTH.toFixed(1)}m, ${RACE.duration}s, mobile shots, budgets, retry`);
} finally { await browser.close(); await loader.close(); await new Promise(r => server.httpServer.close(r)); }
