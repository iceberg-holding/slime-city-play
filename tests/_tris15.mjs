// Probe: triangle count per scene object group in level 3 (needs npm run build).
import { preview } from 'vite';
import { chromium } from 'playwright';
const server = await preview({ preview: { port: 4197 }, logLevel: 'error' });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.goto(server.resolvedUrls.local[0]);
  await page.waitForFunction(() => window.__game);
  await page.evaluate(() => { const g = window.__game; g.setSeed(4242); g.startLevel(3); g.setPaused(true); });
  await page.waitForTimeout(800);
  const res = await page.evaluate(() => {
    const scene = window.__game.view.scene, out = [];
    for (const top of scene.children) {
      let tris = 0, meshes = 0;
      top.traverse(o => { if (o.isMesh) { meshes++; const g = o.geometry; const n = (g.index ? g.index.count : g.attributes.position.count) / 3; tris += n * (o.isInstancedMesh ? o.count : 1); } });
      if (tris) out.push([top.name || top.type, meshes, Math.round(tris)]);
    }
    // inside the area root: per child
    const area = scene.children.find(o => o.children.length > 10);
    const sub = area ? area.children.map(o => { let t = 0; o.traverse(m => { if (m.isMesh) { const g = m.geometry; t += (g.index ? g.index.count : g.attributes.position.count) / 3; } }); return [o.name || o.type, o.children.length, Math.round(t)]; }) : [];
    return { out, sub };
  });
  console.log(JSON.stringify(res.out)); console.log(JSON.stringify(res.sub));
} finally { await browser.close(); await new Promise(r => server.httpServer.close(r)); }
