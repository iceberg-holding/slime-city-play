# Slime City v0.2 — progress

`npm install && npm run dev` to play; `npm run build` (tsc --noEmit && vite build) passes. Vite `base: './'`, so `dist/` can be dropped onto GitHub Pages under `/slime-city-play/`.

Tests:
- `npm test` — pure-sim test (Node + Vite SSR loader, no browser). Walk-path search proves all 5 bike parts are reachable on foot from the spawn. A scripted walk through `step()` (3 hero builds) then collects all 5, delivers them, mounts the bike and checks speed > 0.
- `npm run build && npm run test:e2e` — Playwright against `vite preview` (desktop + mobile touch). Checks:
  - no console errors
  - builder cards change the code and stats
  - pyshki crowd and talk
  - `__game.reach()` is all true
  - `collectAll()` + `interact()` gives a bike with speed > 0
  - tap = sticky, double-tap = bouncy, classic layout shows the buttons
  - the settings toggle persists
  - `SHOTS=1` also saves screenshots to `shots/r2-*.png`.

## Round 2 (what changed)
- **Look**:
  - All models are procedural and rounded: rounded boxes, capsules, lathes and smooth spheres.
  - A `Kit` (`render/materials.ts`) merges each model into one vertex-colored mesh per finish (matte / soft / gloss-clearcoat / metal / glass / rubber / glow), so draw calls stay low.
  - Lighting: RoomEnvironment PMREM env map, hemisphere light, soft PCF shadows (`shadow.radius`), Neutral tone mapping, sRGB output.
  - Gradient sky dome with clouds and fog.
  - Fake AO: vertex AO darkens the city near the ground, plus contact-shadow blobs under props (baked) and under characters, pyshki, the bike and parts (dynamic).
  - Pixel ratio is `min(devicePixelRatio, 2.5)`. `AdaptiveResolution` steps it down when FPS < 50 and won't climb back to a ratio that was too slow.
  - Static city meshes are split into quadrants for frustum culling. About 130–160 draw calls and ~0.4 M triangles per frame, shadow pass included.
- **Pyshki**:
  - Glossy slime buns with big eyes and blush. About half wear a granny headscarf.
  - Within 9 m they crowd you on a ring of ~1.5 m. Half of them try to stand in your path. They face you, sometimes twirl, keep a little space from each other, block you as soft obstacles, and give a mild shove when you walk into them.
  - They babble one of 16 phrases (RU/EN) in DOM speech bubbles.
  - Glued pyshki go quiet, close their eyes happily and show "z z z".
  - All behaviour is in the sim (`talk` / `phrase` state, `babble` events); text lives in the UI.
- **Hero builder** (replaces the combination lock):
  - Tabs for head / body / legs / gun, 6 cards each. Card thumbnails are rendered from the real 3D parts.
  - A live 3D turntable shows the hero.
  - Quirk text plus green/red stat chips (RU/EN), the 4-digit code, and Random.
  - Stats are pure data in `sim/hero.ts` (`heroStats(look)`) and are applied by the sim: speed, jump, push/stun, fire rate, blob size, range/aim, glue time, max blocks, pad boing/size, twin shot, bike speed, personal space.
- **Controls**:
  - Touch default: left-thumb joystick. Right half: tap = sticky, double-tap = bouncy (a single tap fires after the 260 ms double-tap window), drag = camera. Separate Jump and Block buttons, plus the cube/ramp toggle.
  - ⚙ Settings (in the builder and the HUD) has "Classic buttons" (separate Sticky/Bouncy buttons) and language. Saved in localStorage; the game pauses while it's open.
  - Desktop controls are unchanged.
- **Reachability fix**: every part can now be reached on foot.
  - front wheel: fountain rim, via a new step ring
  - rear wheel: north roof via the ramp
  - frame: café roof via a new café ramp
  - handlebar: the red car's hood, from the ground
  - engine: east rooftop landing via the east ramp
  - Previously the fountain-top and car-roof parts needed jumps, and the engine floated in mid-air (pad or blocks only).
- **`window.__game`**: `state`, `mode`, `view`, `look`, `start()`, `showCreator()`, `pickPart(slot, i)`, `heroStats()`, `teleport()`, `fire()`, `place()`, `tick(n, cmd)`, `interact()`, `collectAll()`, `reach()`, `setCamera()`, `setPaused()`, `setClassic()`, `renderInfo()` (now includes pixelRatio and fps).

## Architecture (unchanged principles)
- `src/sim` is pure TS with no three.js. Fixed 60 Hz `step(state, inputs, dt)`, seeded RNG in state, entity ids, events out.
- Vehicles are still data-driven (`VehicleDef`, `MISSION`). Hero parts are data too (`HERO_PARTS`).
- `src/render` reads state, `src/input` makes `InputCommand`s, `src/ui` holds the DOM screens (builder, HUD, settings, bubbles, win).

## Known issues / not done
- Only tested headless (SwiftShader). FPS on a real phone hasn't been measured. The adaptive resolution should absorb fill-rate problems, but the triangle count (~0.4 M with shadows) is the next thing to cut if needed, e.g. by not letting pyshki cast real shadows.
- Physics is still simple: AABB characters, ramp height sampled at the body's center, no ceilings, the camera ignores creatures.
- Pyshki crowding can feel busy with all 7 around you. Gluing them or riding away is the answer.
- A single tap fires sticky about 0.26 s late, because the game waits to see whether it's a double tap.
- Speech bubbles aren't occluded by walls.
- `VehicleDef.flies` is still unused. The bundle is ~680 kB (three.js isn't code-split).

- A1: Added persistent EN/RU/PL/LT/DE phrase picker, fly-off shouts for projectile/pad launches and synthesized vowel babble, whee and blub. Build and reach tests pass.

- A2: Nearby pyshki bump, pause and take alternating voiced conversation turns with a cooldown before returning to crowding. Build and tests pass.

- B: Added northeast tower lobby/floor collision and a sim-driven elevator platform with three stops, automatic boarding rides and interact activation. Existing five walking routes still pass; build and tests pass.

- C: Added teal rooftop water/deck, pergola and loungers, slower wading with splash events, four named teleport hooks; reach suite now also proves elevator travel to mid/roof. All five parts remain in their tested walking locations. Build and tests pass.

- D1: Wired the existing Claude studio module into hero previews/game models, pyshki and skyscraper; rooftop retains Codex-inspired teal tiles/pergola. Studio animation hooks animate spa bubbles; no transmission materials. Build and tests pass.

- D2: Integrated studio trees/benches/lamps; restored visible pyshka glue/speech expressions, hid the decorative elevator cabin, added spa palms/towels and blue rooftop splash particles. Build and tests pass.

- D3: Restored studio head/leg rig animation and batched static studio tower/props by material to reduce draw calls while retaining bubble animation. Build and tests pass.

- Polish: Added nearby touch elevator interaction/calling to the caller’s floor and stronger blue sky after inspecting 412x915 rooftop screenshots. Build and tests pass. Full e2e run was interrupted at the settings-close wait; focused phone views rendered without page errors.

- Regression coverage: Added real sim checks for temporary glue, bouncy freeing/flight shouts and paired chats; prevented chatter from replacing flight shouts and added horizontal launch momentum. Build and tests pass.

- Final interaction polish: Named teleports safely dismount riders; paired pyshki face each other and keep alternating turns quiet. Saved focused 412x915 tower/pool/spa screenshots in shots/r2-tower-phone-*.png. Build and tests pass; fresh desktop e2e passed.

- Validation complete: npm run test:e2e passes desktop and mobile with no console errors (7 crowding/talking pyshki; bike 7.43 m/s). Latest npm run build && npm test pass, including all 5 walking routes, glue/flight/chat regressions and elevator stops. No pushes.
- R3.1: Classic Sticky/Bouncy buttons now default on; versioned storage resets old gesture preferences, with gestures still opt-in. Build and sim tests pass.
- R3.2: Replaced voiced drone-like chatter with per-pyshka pentatonic marimba/bell notes on contact, lower glue notes and rising launch arpeggios; global and per-creature audio cooldowns keep crowds quiet. Build and sim tests pass.
- R3.3: Added closed/open garage gates, a separate 160m road with rails, ramps, roaming pyshki and a 60s race. Riding shots aim forward; glued pyshki stay fixed. Finish offers Next level and a data-driven four-part teal scooter garage; timeout offers a race-only retry. Added openGates/startRace/raceFinish/raceState hooks and sim coverage for timeout, retry, crossing the finish and scooter setup. Build and sim tests pass.
- R3.4: Control reminders fade after about four seconds. Camera now probes actual tower, pergola and rooftop meshes across its width, pulling in immediately before occluders. Updated browser checks for classic defaults and versioned persistence. Build and sim tests pass.
- R3 validation: Added reproducible tests/round3.e2e.mjs for legacy-setting migration, forward riding fire, driving the course to a real finish, Next level and timeout/retry. Saved four 412x915 shots/r3-{gates-open,race-pyshki,finish-next-level,level2-scooter}.png. Hid the level-1 gate in level 2 and gave scooter assembly its own completion message. Build and sim tests pass; focused Round 3 browser flow passes.
- R3 final artifacts: Refreshed and visually inspected all four requested 412x915 screenshots; focused browser flow passes. Launch arpeggios now stay on pentatonic scale degrees across octave boundaries. Made the legacy touch regression advance projectile lifetime through sim ticks so software-rendering speed cannot cause an 8s wall-clock timeout. Build and sim tests pass.
- R3 complete: Full npm run test:e2e passes desktop and mobile with no console errors; focused Round 3 browser test passes, including actual course completion and retry. All requested screenshots are committed. No pushes.
- R4.1: Added a shared 563.8 m centerline, analytic curved rail collision, five jump approaches and an optional left-lane gap with safe right lane. Timer derives from course length with 35% slack at 75% stock speed. Seven deterministic pooled pyshki relocate by nearby section. Steering bot, timeout/retry, build and full desktop/mobile e2e pass. No push.
- R4.2: Race rendering now merges geometry into ~70 m chunks and culls chunk centers beyond 120 m of the camera; all road chunks remain hidden while locked. Added park trees/benches, seaside boardwalk, open viaduct and market sections; rounded pavement joins seal the S-bends. Race start clears toast/trick/control popups, and the phone Exit pill sits at top-left beneath the HUD. Added tests/round4.e2e.mjs for phone/desktop race budgets, locked-city budget, popup/Exit placement and timeout/retry; it saves shots/r6-race-{start,curve,jump,scenery}.png at 412x915. The course is 563.8 m with a 79 s timer. npm run build && npm test && npm run test:e2e and node tests/round4.e2e.mjs pass (one earlier Settings click timeout passed on rerun). Measured locked city 387 calls / 585,156 triangles; phone race views 167–277 calls and desktop race 287 calls. Screenshots visually inspected. No pushes.
- R7: Open level-1 gate now has a bouncing/spinning glossy down arrow and pulsing emissive green arch (two merged meshes, no lights or per-frame geometry allocation). Riding HUD compass tracks the gate relative to camera yaw; gate hint is localized in EN/RU/PL/LT/DE. Cues hide when locked/racing and in level 2. Replaced overlapping road slabs and bend discs with a mitered pavement ribbon sharing exact chunk/bend edges, split at the optional gap; raised lane markings above the surface. Added tests/round7.e2e.mjs to the standard e2e command for cue visibility, camera rotation, translations and level-2 hiding; captures shots/r7-gate-open.png and shots/r7-road.png at 412x915. Screenshots visually inspected; build, sim and full desktop/mobile plus R7 e2e pass. No push.
- R5.1: Race ramps rise 2.7 m (1.69×), with shared simulation/render height and run, slope-based launch velocity and corrected wedge axis dimensions. Added catenary edge wires and warm multicolour emissive InstancedMesh bulbs, at most one bulb draw per chunk. npm run build, npm test (including steering bot finish), and npm run test:e2e pass. No push.
- R6.0: Level/course refactor: `sim/levels.ts` LevelDef (world, spawn, pyshki spawns, mission, race gate/trigger/duration, tower flag) and generic `Course` (`makeCourse/courseAt/courseNear`, per-course jumps, optional jump, gap, ramp size, rails). Race finish is progress-based; ramp launch scales by `VehicleDef.launch`. Level 1 unchanged; build, sim and sweep pass.
- R6.1: Level 2 harbor world (`sim/harbor.ts`, `render/harbor.ts`): seawall promenade, wooden pier with moored boat, stone jetty with striped lighthouse and gallery ramp, beach with lifeguard tower, umbrellas, palms, harbor houses, dunes, warehouses and crane; distinct whitewash/terracotta/sand/sea palette. Four scooter parts on pier end, lighthouse gallery, boat deck and lifeguard tower, all walked and delivered in the reach test; sea is unwalkable, and jumping into water splashes back to the promenade. Level-2 view ~160–280 calls, no city/tower built. Build, sim, sweep pass.
- R6.2: Level 2 coastal race (`COURSE2`, 518 m, 73 s): coastal causeway with sea/cliff pines, pier boardwalk with an optional left-lane gap over water, loop round a lighthouse island; smaller 1.8 m ramps. Scooter VehicleDef is lighter/nimbler (accel 16, turn 3.4, max 14, hop 5.2, ramp launch ×0.75). Race road renderer is parameterized by RaceDef + theme (gate, cues, posts, chunk centers). Two seeded scooter bots finish in ~50 s with small jumps (<1.8 m). Race views 174–277 calls. Build, sim, sweep pass.
- R6.3: Level 2 flow and UI: kick-scooter model (deck you stand on, T-bar, small wheels; rider stands), localized harbor hints/part names/toasts/race hint in EN/RU/PL/LT/DE, 🛴 ride button, compass to the harbor gate, level-complete card with animated CSS drone teaser ('Level 3: Drone'), Race again replays level 2. Harbor statics merged into one shared kit + one furniture batch: area 334–356 calls / ~0.5 M tris (level 1: 387 / 585k), race 158–235. New tests/round9.e2e.mjs (in npm run test:e2e) plays level 1 → Next level → parts → garage → harbor gate → real steering-bot drive to finish → teaser, asserts budgets ≤ level 1, saves shots/r9-l2-*.png. Sweep covers level-2 reachability, road flood fill, 4 scooter bots, course drops and level-complete layouts. Build, sim, sweep pass.
- R6.4 (item 4, graphics polish, both levels): shared `waterMaterial` (PBR + world-space procedural wave normals, fresnel tint, crests, sun glints; one shared clock) on the harbor sea, race sea and level-1 fountain basin; sky dome with horizon haze → mid → zenith gradient, sun glow and a sun disc merged into the cloud mesh, puffier clouds lit from above (blue-grey bellies, warm sun rim), per-level palette and matching fog; Gaussian-falloff contact-shadow blobs; cooler hemisphere fill vs warmer sun; warmer level-1 street; camera blockers for tree crowns; level-1 window flower boxes; harbor fishing crates/barrels/rope/net (with solids). Added `__game.setSeed()` so draw-call probes are reproducible; with seed 4242 the level-1 spawn view is 383→379 calls / 585k→585k tris and harbor views stay within ±2k tris. Build, sim, sweep pass.
