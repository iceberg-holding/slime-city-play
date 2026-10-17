// Visual probe: node tests/_look13.mjs <level> <distance> <y> <out.png>
import { preview, createServer } from 'vite';
import { chromium } from 'playwright';
const [level, d, y] = process.argv.slice(2, 5).map(Number), out = process.argv[5];
const loader = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
const { courseAt } = await loader.ssrLoadModule('/src/sim/track.ts');
const { levelDef } = await loader.ssrLoadModule('/src/sim/levels.ts');
const server = await preview({ preview: { port: 4199 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(server.resolvedUrls.local[0]); await page.waitForFunction(() => window.__game);
await page.evaluate((level) => { const g = window.__game; g.setSeed(7); g.startLevel(level); g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.setPaused(true); }, level);
const p = courseAt(levelDef(level).race.course, d);
await page.evaluate(({ p, y }) => { const g = window.__game, v = g.state.vehicles[0]; v.pos = { x: p.x, y, z: p.z }; v.yaw = p.yaw; g.tick(1); g.setCamera(p.yaw, 0.3); }, { p, y });
await page.waitForTimeout(1500);
await page.screenshot({ path: out });
console.log(JSON.stringify(await page.evaluate(() => window.__game.renderInfo())), errors);
await browser.close(); await loader.close(); await new Promise(r => server.httpServer.close(r));
