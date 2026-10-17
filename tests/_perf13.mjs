// Draw-call/triangle probe: node tests/_perf13.mjs  (after npm run build)
import { preview } from 'vite';
import { chromium } from 'playwright';
const server = await preview({ preview: { port: 4196 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(server.resolvedUrls.local[0]); await page.waitForFunction(() => window.__game);
const probe = async (label, fn, arg) => { await page.evaluate(fn, arg); await page.waitForTimeout(1200); const i = await page.evaluate(() => window.__game.renderInfo()); console.log(label, i.calls, i.triangles); };
await probe('city spawn', () => { const g = window.__game; g.setSeed(4242); g.start(); g.setPaused(true); });
await probe('city tower view', () => { const g = window.__game; g.teleport(10, 0, -8); g.tick(2); g.setCamera(2.4, 0.3); });
for (const level of [1, 2]) {
  await page.evaluate((level) => { const g = window.__game; g.startLevel(level); g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.setPaused(true); }, level);
  const pts = await page.evaluate(() => { const c = window.__game.raceCourse; return c.points; });
  for (let i = 0; i < pts.length - 1; i++) {
    await probe(`L${level} race pt${i}`, ({ a, b }) => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: a.x, y: 0, z: a.z }; v.yaw = Math.atan2(-(b.x - a.x), -(b.z - a.z)); g.tick(1); g.setCamera(v.yaw, 0.3); }, { a: pts[i], b: pts[i + 1] });
  }
}
await browser.close(); await new Promise(r => server.httpServer.close(r));
