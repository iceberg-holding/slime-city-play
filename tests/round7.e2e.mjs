import { preview } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const server = await preview({ preview: { port: 4187 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  const cues = () => page.evaluate(() => ['race-gate-arrow', 'race-gate-arch'].map(name => {
    const o = window.__game.view.scene.getObjectByName(name);
    let visible = true; for (let p = o; p; p = p.parent) visible &&= p.visible;
    const v = o.position.clone(); if (name.endsWith('arch')) v.set(5.5, 3, 10);
    v.project(window.__game.view.camera);
    return { visible, onScreen: Math.abs(v.x) < 1 && Math.abs(v.y) < 1 && Math.abs(v.z) < 1 };
  }));
  await page.evaluate(() => { const g = window.__game; g.start(); g.setPaused(true); });
  await page.waitForTimeout(300);
  assert.ok((await cues()).every(o => !o.visible), 'locked cues hidden');
  await page.evaluate(() => {
    const g = window.__game; g.collectAll(); g.interact();
    const v = g.state.vehicles[0]; v.pos.x = 0; v.pos.z = 14; v.speed = 0; v.yaw = 0;
    g.tick(); g.setCamera(-0.9, 0.12);
  });
  await page.waitForFunction(() => { const g = window.__game; return g.view.camera.position.distanceTo({x:0,y:0.25,z:14}) > 5; });
  await page.waitForTimeout(2500);
  assert.equal(await page.evaluate(() => window.__game.state.race.phase), 'open');
  assert.ok((await cues()).every(o => o.visible && o.onScreen), 'open arrow and arch visible in camera');
  assert.equal(await page.isVisible('.gate-compass'), true);
  assert.equal(await page.textContent('.hint'), 'Ride through the green gate!');
  await mkdir('shots', { recursive: true });
  await page.screenshot({ path: 'shots/r7-gate-open.png', timeout: 120000 });
  const before = await page.locator('.gate-compass span').getAttribute('style');
  await page.evaluate(() => window.__game.setCamera(Math.PI / 2, 0.3));
  await page.waitForFunction(before => document.querySelector('.gate-compass span').getAttribute('style') !== before, before);
  // Check every supported language through the actual settings language control.
  await page.click('.hud .gear-btn');
  for (const [lang, hint] of [['ru', 'Езжай через зелёные ворота!'], ['pl', 'Przejedź przez zieloną bramę!'], ['lt', 'Važiuok pro žalius vartus!'], ['de', 'Fahre durch das grüne Tor!'], ['en', 'Ride through the green gate!']]) {
    await page.click('.settings-lang');
    await page.waitForFunction(text => document.querySelector('.hint').textContent === text, hint);
  }
  await page.click('.settings-close');
  await page.evaluate(() => { const g = window.__game; g.startRace(); g.setPaused(true); g.setCamera(0, 0.12); });
  await page.waitForTimeout(1000);
  assert.equal(await page.isVisible('.gate-compass'), false);
  assert.ok((await cues()).every(o => !o.visible), 'racing cues hidden');
  await page.screenshot({ path: 'shots/r7-road.png', timeout: 120000 });
  await page.evaluate(() => { const g = window.__game; g.state.level = 2; g.state.race.phase = 'open'; });
  await page.waitForTimeout(300);
  assert.ok((await cues()).every(o => !o.visible), 'level 2 cues hidden');
  assert.equal(await page.isVisible('.gate-compass'), false);
  assert.deepEqual(errors, []);
  console.log('ok round7: gate visibility, camera compass, five languages, phone screenshots');
} finally { await browser.close(); await new Promise(r => server.httpServer.close(r)); }
