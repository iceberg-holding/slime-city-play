// Probe: level-3 flight race views (calls/tris) at 412x915. Usage: node tests/_race15.mjs [out-dir] [d,d,...] (needs npm run build)
import { preview, createServer } from 'vite';
import { chromium } from 'playwright';
const out = process.argv[2] || '/tmp/l3';
const ds = (process.argv[3] || '30,100,170,250,330,420,497,560,640,740').split(',').map(Number);
const loader = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
const { courseAt, courseHeightAt } = await loader.ssrLoadModule('/src/sim/track.ts');
const { COURSE3 } = await loader.ssrLoadModule('/src/sim/flight.ts');
const server = await preview({ preview: { port: 4198 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  await page.evaluate(() => { const g = window.__game; g.setSeed(4242); g.startLevel(3); g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.setPaused(true); });
  let max = 0;
  for (const d of ds) {
    const p = courseAt(COURSE3, d), y = courseHeightAt(COURSE3, d);
    await page.evaluate(({ p, y }) => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: p.x, y, z: p.z }; v.yaw = p.yaw; v.vel = { x: 0, y: 0, z: 0 }; g.tick(2); g.setCamera(p.yaw, 0.3); }, { p, y });
    await page.waitForTimeout(1300);
    const r = await page.evaluate(() => window.__game.renderInfo());
    max = Math.max(max, r.calls);
    console.log('d', d, r.calls, r.triangles);
    await page.screenshot({ path: `${out}/race-${d}.png`, timeout: 120000 });
  }
  console.log('max calls', max, 'errors', errors);
} finally { await browser.close(); await loader.close(); await new Promise(r => server.httpServer.close(r)); }
