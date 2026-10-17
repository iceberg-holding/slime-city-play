import assert from 'node:assert/strict';
import { createServer, preview } from 'vite';
import { chromium } from 'playwright';
const loader = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
const load = p => loader.ssrLoadModule(`/src/sim/${p}.ts`);
let browser, web;
try {
  const { createGame, step, makeCollider } = await load('step');
  const { emptyInput } = await load('types');
  const { findWalkPaths } = await load('reach');
  const { moveBody } = await load('physics');
  const { trackAt, trackNear, TRACK_LENGTH, courseAt, courseNear } = await load('track');
  const { levelDef } = await load('levels');
  const { spawnVehicle } = await load('mission');
  const { openGates, startRace, RACE } = await load('race');
  const { STOPS, TOWER } = await load('tower');
  // Flood fill each elevator-connected floor separately: the lift is a dynamic graph edge.
  for (const level of [1, 2]) {
    const s = createGame(42, [0,0,0,0], level), col = makeCollider(s);
    const targets = [...s.pickups.map(p => ({name:p.part, pos:p.pos})),
      {name:'garage',pos:{x:s.garages[0].x,y:0.9,z:s.garages[0].z}},
      {name:'gate approach',pos:{x:levelDef(level).race.gateAt.x,y:0.9,z:levelDef(level).race.gateAt.z+1}}];
    const paths = findWalkPaths(col, 45, s.players[0].pos, targets.map(t=>t.pos));
    assert.deepEqual(targets.filter((_,i)=>!paths[i]).map(t=>t.name), [], `level ${level} unreachable targets`);
    if (level === 1) for (const y of STOPS) {
      s.elevator.y = y;
      const floorTargets = [{x:26,y:y+0.9,z:-26}];
      if (y === TOWER.roof) floorTargets.push({x:24.5,y:y+0.9,z:-28.1},{x:27.755,y:y+0.9,z:-28.21});
      assert.ok(findWalkPaths(makeCollider(s),35,{x:TOWER.liftX,y,z:-26},floorTargets).every(Boolean), `floor ${y}, pool/spa`);
    }
    {
      const course=levelDef(level).race.course, start=courseAt(course,0), end=courseAt(course,course.length);
      const corridor={groundAt:col.groundAt.bind(col),blocked:(x,z,y,r,h)=>courseNear(course,x,z).distance>5.5||col.blocked(x,z,y,r,h)};
      assert.ok(findWalkPaths(corridor,620,{x:start.x,y:0,z:start.z},[{x:end.x,y:0.9,z:end.z}])[0],`level ${level} finish reachable from race entry by road flood fill`);
    }
    if(level===1) {
      const corridor={groundAt:col.groundAt.bind(col),blocked:(x,z,y,r,h)=>trackNear(x,z).distance>5.5||col.blocked(x,z,y,r,h)};
      const finish=trackAt(TRACK_LENGTH);
      assert.ok(findWalkPaths(corridor,620,{x:80,y:0,z:15},[{x:finish.x,y:0.9,z:finish.z}])[0],'finish reachable from race entry by road flood fill');
    }
    // Seeded, collision-aware random walk. Reject intentional wall-facing commands before measuring stalls.
    for (let seed=1; seed<=12; seed++) {
      const game=createGame(seed,[0,0,0,0],level), p=game.players[0], c=makeCollider(game);
      const route=paths[seed % paths.length];
      const point=route[Math.floor(route.length * ((seed % 5) / 5))];
      p.pos={...point};
      if(level===1 && seed>9)p.pos={x:26,y:STOPS[seed%3],z:-26};
      let rng=seed, stalled=0, angle=0;
      for(let frame=0;frame<1200;frame++) {
        if(frame%60===0){rng=(Math.imul(rng,1664525)+1013904223)>>>0;angle=rng/2**32*Math.PI*2;}
        const dx=Math.cos(angle), dz=Math.sin(angle);
        const before={...p.pos};
        const wall=c.blocked(p.pos.x+dx*0.3,p.pos.z+dz*0.3,p.pos.y,p.radius,p.height);
        step(game,{[p.id]:{...emptyInput(),mx:dx,mz:dz}},1/60);
        stalled=!wall && Math.hypot(p.pos.x-before.x,p.pos.z-before.z)<0.001 ? stalled+1 : 0;
        assert.ok(stalled<180,'unintentional >3s stall');
        assert.ok(!c.pointInside(p.pos.x,p.pos.y+0.45,p.pos.z),'player penetration');
        for(const bun of game.creatures) {
          assert.ok(Math.abs(bun.pos.x)<=game.world.half && Math.abs(bun.pos.z)<=game.world.half,'pyshka bounds');
          assert.ok(!c.pointInside(bun.pos.x,bun.pos.y+0.45,bun.pos.z),'pyshka penetration');
        }
      }
    }
    // Drive the full centerline with several seeds; rails and jumps must not trap a vehicle.
    for (const seed of level === 1 ? [11, 27, 93] : [11, 27, 93, 5]) {
      const def=levelDef(level), course=def.race.course, kind=def.mission.vehicle;
      const trackAt=d=>courseAt(course,d);
      const race=createGame(seed,[0,0,0,0],level), p=race.players[0];
      const v=spawnVehicle(race,kind,def.mission.garage.x,0,def.mission.garage.z,0);
      v.rider=p.id;p.riding=v.id;race.garages[0].built=true;openGates(race);startRace(race);
      let stuck=0, previous=0;
      const trackNear=(x,z)=>courseNear(course,x,z), top=def===levelDef(1)?9.75:14*0.75;
      for(let frame=0;frame<(def.race.duration+1)*60&&race.race.phase==='racing';frame++) {
        const near=trackNear(v.pos.x,v.pos.z), target=trackAt(near.progress+9);
        const desired=Math.atan2(-(target.x-v.pos.x),-(target.z-v.pos.z));
        const error=Math.atan2(Math.sin(desired-v.yaw),Math.cos(desired-v.yaw));
        const steer=Math.max(-0.65,Math.min(0.65,-error*2)), throttle=v.speed<top?1:0.18;
        step(race,{[p.id]:{...emptyInput(),mx:-Math.sin(v.yaw)*throttle+Math.cos(v.yaw)*steer,mz:-Math.cos(v.yaw)*throttle-Math.sin(v.yaw)*steer}},1/60);
        stuck=near.progress-previous<0.001?stuck+1:0;previous=near.progress;
        assert.ok(stuck<180,'race >3s stall');assert.ok(v.pos.y>=-1,'race fell through');
      }
      assert.equal(race.race.phase,'finished',`level ${level} race bot finish seed ${seed}: ${JSON.stringify(v.pos)}, ${race.race.remaining}s`);
    }
    // Max-speed horizontal crossings cannot tunnel into thin walls.
    for(const solid of s.world.solids.filter(b=>b.ramp===undefined)) {
      const body={pos:{x:solid.minX-1,z:(solid.minZ+solid.maxZ)/2,y:solid.minY},vel:{x:15,y:0,z:0},radius:0.5,height:1.4,grounded:true};
      if(col.blocked(body.pos.x,body.pos.z,body.pos.y,0.5,1.4))continue;
      for(let i=0;i<12;i++){moveBody(body,1/60,col,s.world.half);assert.ok(!col.pointInside(body.pos.x,body.pos.y+0.45,body.pos.z),'max speed penetration');}
    }
    // Vertical drops over every solid, roofs, ramp edges, and the entire course.
    const points=s.world.solids.flatMap(b=>[{x:(b.minX+b.maxX)/2,z:(b.minZ+b.maxZ)/2,y:b.maxY+8}, {x:b.maxX+0.6,z:b.maxZ+0.6,y:b.maxY+8}]);
    const dropCourse=levelDef(level).race.course;
    for(let d=0;d<=dropCourse.length;d+=4) { const p=courseAt(dropCourse,d); for(const lane of [-6,0,6]) points.push({x:p.x-p.dz*lane,z:p.z+p.dx*lane,y:8}); }
    for(const pos of points) for(const radius of [0.4,0.55]) {
      const body={pos:{...pos},vel:{x:0,y:-40,z:0},radius,height:1.4,grounded:false};
      for(let i=0;i<180;i++) {moveBody(body,1/60,col,s.world.half);assert.ok(body.pos.y>=-1,'drop through floor');}
      assert.ok(!col.pointInside(body.pos.x,body.pos.y+0.1,body.pos.z),'drop penetration');
    }
  }
  console.log('ok sweep: reach graph, 24 seeded walks, creatures, solid/roof/track drops, 7 race bots on both levels');
  web=await preview({preview:{port:4188},logLevel:'error'});
  browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:360,height:740},isMobile:true,hasTouch:true});
  await page.goto(web.resolvedUrls.local[0]);await page.waitForFunction(()=>window.__game);
  for(const [width,height] of [[360,740],[412,915],[768,1024],[915,412]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(()=>window.__game.showCreator());
    async function layout(selectors) {
      const errors=await page.evaluate(selectors=>{
        const boxes=selectors.flatMap(sel=>Array.from(document.querySelectorAll(sel)).map(el=>({el,sel,r:el.getBoundingClientRect()}))).filter(({el,r})=>r.width&&r.height&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none'&&+getComputedStyle(el).opacity>0.05);
        const errors=[];
        for(const {sel,r} of boxes) if(r.x< -1||r.y< -1||r.right>innerWidth+1||r.bottom>innerHeight+1) errors.push(`${sel} outside viewport`);
        for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++) {const a=boxes[i],b=boxes[j];if(a.el.contains(b.el)||b.el.contains(a.el))continue;if(Math.min(a.r.right,b.r.right)-Math.max(a.r.x,b.r.x)>2&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.y,b.r.y)>2)errors.push(`${a.sel} overlaps ${b.sel}`);}
        return errors;
      },selectors);assert.deepEqual(errors,[],`${width}x${height} layout`);
    }
    await layout(['.creator-top','.builder']);
    await page.locator('#play-btn').scrollIntoViewIfNeeded();
    await layout(['#play-btn']);
    await page.evaluate(()=>{const g=window.__game;g.start();g.setPaused(true);g.collectAll();g.interact();});
    await page.waitForTimeout(200);
    await page.evaluate(()=>{const el=document.querySelector('.toast');el.textContent='Pit bike ready!';el.classList.add('on');});
    await page.waitForTimeout(250);
    await layout(['.parts','.hint','.hud-right','.ride-btn','.gate-compass','.toast.on','.act','.shape-btn','.controls-tip','.objective','.race-hint']);
    await page.evaluate(()=>{const g=window.__game;g.startRace();g.setPaused(true);});
    await page.waitForTimeout(200);
    await page.locator('canvas').first().dispatchEvent('pointerdown',{pointerId:81,pointerType:'touch',clientX:72,clientY:height-85,bubbles:true});
    await layout(['.parts','.hint','.hud-right','.ride-btn','.gate-compass','.act','.shape-btn','.joy-base']);
    await page.evaluate(()=>window.dispatchEvent(new PointerEvent('pointerup',{pointerId:81,pointerType:'touch'})));
    if(width===412) {
      const p=trackAt(34);
      await page.evaluate(p=>{const g=window.__game,v=g.state.vehicles[0];v.pos={x:p.x,y:0,z:p.z};v.yaw=p.yaw;g.tick(1);g.setCamera(p.yaw,0.3);},p);
      await page.waitForTimeout(500);await page.screenshot({path:'shots/r8-ramp-lights.png',timeout:120000});
    }
    await page.evaluate(()=>{window.__game.raceFinish();window.__game.setPaused(false);});
    await page.locator('.win').waitFor({state:'visible'});await layout(['.win-card']);
    await page.evaluate(()=>{const g=window.__game;g.startLevel(2);g.setPaused(true);g.collectAll();g.interact();g.startRace();g.raceFinish();g.setPaused(false);});
    await page.waitForFunction(()=>!document.querySelector('.teaser').hidden&&document.querySelector('.win').style.display!=='none');
    await layout(['.win-card']);await layout(['.teaser','.win-buttons','.win-time','.win-title']);
    console.log(`ok sweep layout ${width}x${height}`);
  }
  console.log('ok sweep: creator, gate, race, win and level-complete layouts at four touch viewports');
} finally {await browser?.close();if(web)await new Promise(r=>web.httpServer.close(r));await loader.close();}
