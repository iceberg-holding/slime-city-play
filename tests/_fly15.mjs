// Probe: level-3 drone flying views at 412x915. Usage: node tests/_fly15.mjs [out-dir] (needs npm run build)
import { preview } from 'vite';
import { chromium } from 'playwright';
const out = process.argv[2] || '/tmp/l3';
const server = await preview({ preview: { port: 4196 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  await page.evaluate(() => { const g = window.__game; g.setSeed(4242); g.startLevel(3); g.setPaused(true); g.collectAll(); g.interact(); });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/garage.png` });
  await page.evaluate(() => { const g = window.__game, v = g.state.vehicles[0]; g.tick(90, { up: true }); g.tick(30, { mx: -Math.sin(v.yaw) * 0.3, mz: -Math.cos(v.yaw) - 0.2 }); g.tick(40, { mx: -Math.sin(v.yaw), mz: -Math.cos(v.yaw) }); g.setCamera(v.yaw, 0.3); });
  await page.evaluate(() => window.__game.setPaused(false));
  await page.waitForTimeout(100);
  await page.evaluate(() => window.__game.setPaused(true));
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => ({ ...window.__game.renderInfo(), y: window.__game.state.vehicles[0].pos.y, hud: document.querySelector('.hud').className }));
  console.log('flying', JSON.stringify(r));
  await page.screenshot({ path: `${out}/flying.png` });
  console.log('errors', errors);
} finally { await browser.close(); await new Promise(r => server.httpServer.close(r)); }
