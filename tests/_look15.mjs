// Probe: level-3 views at 412x915 with draw calls. Usage: node tests/_look15.mjs [out-dir] (needs npm run build)
import { preview } from 'vite';
import { chromium } from 'playwright';
const out = process.argv[2] || '/tmp/l3';
const server = await preview({ preview: { port: 4195 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  await page.evaluate(() => { const g = window.__game; g.setSeed(4242); g.startLevel(3); g.setPaused(true); });
  const views = JSON.parse(process.env.VIEWS || '[["spawn",2,0,10,0,0.4],["tower",18,0,-10,0.3,0.25],["park",-12,0,4,1.2,0.3],["pond",-22,0.8,-1,0,0.35],["terrace",8,4.2,-31,-0.4,0.4],["battery",23,9.6,-21.5,0,0.15]]');
  for (const [name, x, y, z, yaw, pitch] of views) {
    await page.evaluate(([x, y, z, yaw, pitch]) => { const g = window.__game; g.teleport(x, y, z); g.tick(3); g.setCamera(yaw, pitch); }, [x, y, z, yaw, pitch]);
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => window.__game.renderInfo());
    console.log(name, r.calls, r.triangles);
    await page.screenshot({ path: `${out}/${name}.png`, timeout: 120000 });
  }
  console.log('errors', errors);
} finally { await browser.close(); await new Promise(r => server.httpServer.close(r)); }
