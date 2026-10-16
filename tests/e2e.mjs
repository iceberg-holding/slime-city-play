// Browser test against the production build: no console errors, hero builder works, every bike part is
// reachable on foot, and after collectAll + interact the bike rides. Screenshots go to shots/ when SHOTS=1.
// Run: npm run build && node tests/e2e.mjs
import { preview } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const SHOTS = process.env.SHOTS === '1';
const server = await preview({ preview: { port: 4179, strictPort: false }, logLevel: 'error' });
const url = server.resolvedUrls.local[0];
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const errors = [];
let failed = false;

async function run(viewport, touch, tag) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error' || (m.type() === 'warning' && /THREE/.test(m.text()))) errors.push(`[${tag}] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${tag}] ${e.message}`));
  await page.goto(url);
  await page.waitForFunction(() => window.__game && document.querySelectorAll('.card').length === 6);
  await page.waitForTimeout(600);
  const t0 = Date.now();
  const shot = async (name) => {
    if (process.env.VERBOSE) console.log(`  [${tag}] ${((Date.now() - t0) / 1000).toFixed(1)}s ${name}`);
    if (SHOTS) await page.screenshot({ path: `shots/r2-${tag}-${name}.png` });
  };
  page.setDefaultTimeout(60000);

  // Hero builder: cards change the code + stats
  await page.click('.tab:nth-child(3)'); // legs
  await page.click('.card[data-part="3"]'); // springs
  const look = await page.evaluate(() => window.__game.look);
  assert.equal(look[2], 3, 'picking the springs card sets legs = 3');
  assert.equal(await page.textContent('.code'), look.join(''));
  const jump = await page.evaluate(() => window.__game.heroStats().jump);
  assert.ok(jump > 1.2, `springs give a higher jump (${jump})`);
  assert.ok((await page.textContent('.quirk-text')).length > 5, 'quirk text shown');
  await shot('01-builder');
  if (SHOTS) {
    await page.click('.tab:nth-child(4)');
    await shot('01b-guns');
    await page.click('.creator-top .lang-btn');
    await page.click('.tab:nth-child(2)');
    await shot('01c-ru-body');
    await page.click('.creator-top .lang-btn');
  }

  await page.click('#play-btn');
  await page.waitForFunction(() => window.__game.mode === 'play');
  await page.waitForTimeout(800);
  await shot('02-start');

  // pyshki crowd + babble
  await page.evaluate(() => {
    const g = window.__game;
    const c = g.state.creatures;
    c.forEach((k, i) => {
      k.pos = { x: 2 * Math.cos(i), y: 0, z: 14 + 2 * Math.sin(i) };
      k.talkCd = 0.1 * i;
    });
    g.setCamera(0.3, 0.35);
    g.tick(60);
  });
  await page.waitForTimeout(400);
  const crowd = await page.evaluate(() => window.__game.state.creatures.filter((c) => c.mode === 'crowd').length);
  assert.ok(crowd >= 5, `pyshki crowd around the player (${crowd})`);
  await page.waitForFunction(() => document.querySelectorAll('.bubble').length > 0, null, { timeout: 15000 }).catch(() => {});
  const talkers = await page.evaluate(() => document.querySelectorAll('.bubble').length);
  assert.ok(talkers >= 1, 'speech bubbles shown');
  await shot('03-crowd');
  await page.evaluate(() => {
    const g = window.__game;
    for (let i = 0; i < 4; i++) {
      g.fire('sticky', g.input.camYaw + Math.PI - 0.6 + i * 0.4);
      g.tick(20);
    }
  });
  await page.waitForTimeout(300);
  await shot('04-glued');

  if (touch) {
    assert.equal(await page.isVisible('.act-sticky'), true, 'classic is default');
    await page.evaluate(() => window.__game.setClassic(false));
    // right half: single tap = sticky, double tap = bouncy; buttons hidden in the default layout
    assert.equal(await page.isVisible('.act-sticky'), false, 'no sticky button in tap layout');
    const kinds = async () => page.evaluate(() => window.__game.state.projectiles.map((p) => p.kind));
    await page.evaluate(() => (window.__game.state.creatures = []));
    await shot('03a-before-tap');
    await page.touchscreen.tap(viewport.width * 0.75, viewport.height * 0.4);
    await page.waitForFunction(() => window.__game.state.projectiles.length > 0, null, { timeout: 5000 });
    assert.deepEqual(await kinds(), ['sticky'], 'single tap fires sticky');
    await page.evaluate(() => window.__game.tick(200));
    await page.waitForFunction(() => window.__game.state.projectiles.length === 0);
    // two quick taps (dispatched in-page so slow software-GL frames can't stretch the gap)
    await page.evaluate(([x, y]) => {
      const c = document.getElementById('game');
      for (const id of [11, 12]) {
        const o = { pointerId: id, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, isPrimary: true };
        c.dispatchEvent(new PointerEvent('pointerdown', o));
        c.dispatchEvent(new PointerEvent('pointerup', o));
      }
    }, [viewport.width * 0.75, viewport.height * 0.4]);
    await page.waitForFunction(() => window.__game.state.projectiles.length > 0, null, { timeout: 5000 });
    assert.deepEqual(await kinds(), ['bouncy'], 'double tap fires bouncy');
    await page.evaluate(() => window.__game.setClassic(true));
    assert.equal(await page.isVisible('.act-sticky'), true, 'classic layout shows sticky button');
    await shot('03b-classic');
    await page.evaluate(() => window.__game.setClassic(false));
  }

  // reachability + ride
  const reach = await page.evaluate(() => window.__game.reach());
  assert.deepEqual(reach, [true, true, true, true, true], 'every part reachable on foot');
  const speed = await page.evaluate(() => {
    const g = window.__game;
    g.state.creatures = [];
    g.collectAll();
    const bike = g.state.vehicles[0];
    g.teleport(bike.pos.x + 0.5, 0, bike.pos.z);
    g.tick(5);
    g.interact();
    const p = g.state.players[0];
    if (p.riding !== bike.id) return -1;
    g.setCamera(bike.yaw);
    g.tick(40, { mx: -Math.sin(bike.yaw), mz: -Math.cos(bike.yaw) });
    return bike.speed;
  });
  assert.ok(speed > 0, `bike rides after collectAll + interact (speed ${speed})`);
  await page.waitForTimeout(500);
  await shot('05-ride');
  if (SHOTS) {
    await page.evaluate(() => {
      const g = window.__game;
      g.interact();
      g.teleport(-4, 0, 17);
      g.setCamera(-1.2, 0.35);
      g.tick(30);
    });
    await page.waitForTimeout(600);
    await shot('07-cafe-ramp');
    await page.evaluate(() => {
      const g = window.__game;
      g.teleport(16, 0, 2);
      g.setCamera(-0.4, 0.3);
      g.tick(30);
    });
    await page.waitForTimeout(600);
    await shot('08-east-ramp');
  }

  // settings toggle persists
  await page.evaluate(() => window.__game.setClassic(false));
  await page.click('.hud .gear-btn');
  await page.locator('.settings .switch').check();
  const stored = await page.evaluate(() => localStorage.getItem('slimecity.controls.v3.classicButtons'));
  assert.equal(stored, '1', 'classic buttons setting persisted');
  await shot('06-settings');
  await page.click('.settings-close');
  await page.evaluate(() => window.__game.setClassic(false));
  const info = await page.evaluate(() => window.__game.renderInfo());
  console.log(`ok [${tag}] crowd ${crowd}, bubbles ${talkers}, bike ${speed.toFixed(2)} m/s, draw calls ${info.calls}, tris ${info.triangles}`);
  await ctx.close();
}

try {
  await run({ width: 1280, height: 800 }, false, 'desktop');
  await run({ width: 390, height: 844 }, true, 'mobile');
  assert.deepEqual(errors, [], 'no console errors');
} catch (e) {
  failed = true;
  console.error(e);
  if (errors.length) console.error(errors.join('\n'));
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
process.exit(failed ? 1 : 0);
