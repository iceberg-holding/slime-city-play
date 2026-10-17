// Quick finish-card screenshot probe: node tests/_shot13.mjs W H level
import { preview } from 'vite';
import { chromium } from 'playwright';
const [w, h, level] = process.argv.slice(2).map(Number);
const server = await preview({ preview: { port: 4197 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true });
await page.goto(server.resolvedUrls.local[0]); await page.waitForFunction(() => window.__game);
await page.evaluate((level) => { const g = window.__game; g.startLevel(level); g.setPaused(true); g.collectAll(); g.interact(); g.startRace(); g.tick(600); g.raceFinish(); g.setPaused(false); }, level);
await page.locator('.win').waitFor({ state: 'visible' }); await page.waitForTimeout(800);
await page.screenshot({ path: `/tmp/win-${w}x${h}-L${level}.png` });
await browser.close(); await new Promise(r => server.httpServer.close(r));
