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
- R6.5: Fixes from screenshot review: level-1 toasts no longer carry into level 2 (`hud.clearPopups()` on start), sea crests/glints fade with distance (no far-water aliasing), race shot moved off the ramp. Repaired tests/round3.e2e.mjs, which had failed since the R4 curved course (straight-line driver and 60 s timer): it now uses a look-ahead steering driver via the new `__game.raceCourse` hook and ticks past the real remaining time; it passes, as does tests/round4.e2e.mjs.
- R6 validation: final `npm run test:e2e` passes (desktop + mobile e2e, round7, round9; no console errors). Harbor area 332 calls / 509k tris, level-2 race 160–218 calls. shots/r9-l2-{area,parts,garage-scooter,race,finish}.png saved at 412x915 and inspected. No push.
- R13.1 (Round 7 item 1): Level 1 has a 6th required part, the FLASHLIGHT (bike headlight), on the tower's mid floor by the south windows; reachable only via the elevator's mid stop (`MissionDef.liftOnly`). A warm flickering additive glow shows in the mid-floor windows while it is up there. A new lobby pyshka (`LevelDef.hintSpawn`, `Creature.hinter`) keeps near the elevator and says a localized hint every 6–9 s (EN/RU/PL/LT/DE, e.g. RU «Говорят, наверху кто-то фонарик потерял…»). The bike assembles from the 5 core parts (`VehiclePartDef.accessory`), but the gate stays locked (`raceReady`) until the flashlight is fitted, which shows a lit headlight with an additive beam. HUD counts 6/6; objectives, hints, part names and toasts for level 1 are now localized in PL/LT/DE as well. `__game.reach()` checks elevator-only parts from the mid stop and requires them NOT to be walkable. The sim test walks onto the lift, rides up and collects all 6. Sweep checks the flashlight is off the walking graph and on the mid-floor graph. Collider face contact now uses a 1e-6 epsilon, so walk paths that touch a face exactly no longer stall. City spawn view is 381 calls / 585k tris. Build, sim and sweep pass.
- R13.2 (item 2): Race courses are about 1.5× longer.
  - Level 1: 563.8 → 878.1 m. A second lap of S-bends runs north to z = −840, with three new ramps at 575/690/790. Scenery cycles park → boardwalk → viaduct → market. The city world half grew to 900 m.
  - Level 2: 518 → 764.2 m. The cliff road goes home past the lighthouse, with three new ramps at 575/660/730 and pine cliffs after 535 m.
  - Chunked 70 m culling is unchanged.
  - Timer is now length / (0.75 · top) · 1.3 + length / 70. Pyshki traffic scales with length (seed 93 timed out 11 m short with the old flat +6 s). This gives level 1 130 s and level 2 106 s.
  - Bots finish in 117 s (L1) and 75–80 s (L2); all 7 sweep bots finish. Bonus extras will add on top.
  - Build, sim and sweep pass.
- R13.3 (item 3): Medals and records.
  - Race state now tracks `elapsed`, `bonus`, `stars`, `rings`, `points` and `hits`.
  - Bonus seconds go through `addBonus`, which extends the clock. The finish time is elapsed − bonus.
  - `RaceDef.medals`: gold ≤ length / (0.85 · top), silver ≤ length / (0.78 · top), any finish is bronze. This is L1 80/87 s and L2 65/70 s.
  - `ui/records.ts` saves the best time, best medal and most stars per level in localStorage (`slimecity.best.L<n>`).
  - The finish card shows a medal badge, the time, "New record!" or the best time with its medal, and chips for stars / bonus seconds / trick points.
  - Finish, time's-up and race texts are localized in EN/RU/PL/LT/DE.
  - Short landscape screens use a two-column card. The 915×412 sweep caught the level-complete card overflowing.
  - Build, sim and sweep pass.
- R13.4 (item 4): Ghost replay of the best run.
  - `ui/ghost.ts` `GhostRecorder` samples the vehicle's x/y/z/yaw at 10 Hz of race time into one preallocated Int16Array, so there are no per-frame allocations.
  - When a finish sets a new best time, the samples are saved to localStorage `slimecity.ghost.L<n>` as base64 (8 bytes per sample, about 10 kB for a 2-minute run).
  - On every later race the view loads and decodes the path. A single translucent, pulsing, unlit merged mesh (`ghost-bike`, one draw call) follows it, interpolated by `race.elapsed`, and hides when the path ends.
  - Browser check: a recorded 5 s run saves, and on the next race the ghost is visible and moving along the decoded path.
  - Build, sim and sweep pass.
- R13.5 (item 5): Stars along both race tracks.
  - `courseStars(course)` (cached, deterministic) puts low stars every 40 m, alternating three lanes. It skips ramp approaches and the gap.
  - Each ramp also gets a high star just past its lip (rampHeight + 0.85 m) that only a ramp jump reaches. L1 has 23 stars (8 high).
  - The sim collects stars within 1.3 m of the vehicle's centre into `race.stars` and emits `star`.
  - Rendering is one spinning, bobbing gold InstancedMesh for the whole course (one draw call, reused matrices, collected stars scaled to 0).
  - During a race the HUD parts pill becomes ⭐ n/total. A localized "⭐ Star!" popup and chime play on pickup. The finish card shows stars n/total.
  - Sim test: the L1 bot collects 13/23 (7/8 high), and a standing hop under a high star cannot reach it.
  - The headlight beam is softened (narrower, lower opacity).
  - Build, sim and sweep pass.
- R13.6 (item 6): Pyshki hooligans.
  - In each race section, every third pooled pyshka is a hooligan (`Creature.dash`). It waits at a kerb (lane ±5.4) and, once a rider is within 30 m, dashes across to the far lane and back, chattering. It never pairs up to chat.
  - It wears a red polka-dot bandana (one shared merged mesh, cloned on first use).
  - Forward slime shots while riding hit it non-violently (sticky glues, bouncy launches) and pay a bonus once per spot through `hooliganHit`: +1 s sticky, +2 s bouncy. A green "+2s Gotcha!" popup shows and `race.hits` counts up.
  - Sim test: a hooligan runs onto the road as the rider approaches, a bouncy hit pays +2 s, and a second hit pays nothing.
  - Bots still finish: L1 in 115.8 s of 130 s, L2 in 74–76 s of 106 s, and all 7 sweep bots.
  - Build, sim and sweep pass.
- R13.7 (item 7): Flip tricks with a dedicated TRICK button.
  - The old double-tap-jump flip is gone. TRICK (`InputCommand.trick`; T/R on desktop) works only in the air. It starts one 0.45 s trick, cycling backflip → barrel roll → table twist. Pad bounces still do an automatic backflip.
  - The vehicle carries `trick`/`trickT`/`combo`. The rotation eases into the catch on the pivot's x/z/y. Steering spins add "spin" to the combo.
  - On landing the whole combo scores: base points × combo length, plus +2 s per trick in a race (max 6). A big "TRICK! 240" popup shows the localized trick names and a random funny phrase (6 per language in EN/RU/PL/LT/DE, e.g. "Grandma saw that!" / «Бабушка бы ахнула!»).
  - Landing mid-trick is a harmless "Wobbly landing!" bail that halves speed.
  - The purple TRICK button replaces the hidden block button while riding and pulses while airborne.
  - Sim test: TRICK is ignored on the ground, jumping in the air no longer flips, a landed backflip gives 100 pts and +2 s, and a late press bails.
  - Build, sim and sweep pass (TRICK button included in the layout overlap check).
- R13.8 (item 8): Flaming rings over every ramp (`courseRings`, `Course.ringLift`).
  - Each ring hangs just past the ramp lip, framing that ramp's high star.
  - Heights were tuned by driving bots at 60/75/90/105% of top speed on both levels: every main-ramp ring is flown through at every speed. The optional left-lane ring needs the narrow ramp. A grounded ride or hop can't reach any of them.
  - Crossing a ring's plane within 1.6 m of its centre gives +3 s, an orange "+3s Fire ring!" popup and a fire burst.
  - Rendering is one emissive torus InstancedMesh with a flickering emissive intensity, plus one additive InstancedMesh of 12 flame tongues per ring, each flickering on its own beat. That is 2 draw calls, with reused matrices. Passed rings vanish.
  - Medals now count the expected ring bonus: gold = length / (0.85 · top) − 3 s per main ring, silver = length / (0.75 · top) − half that. L1 is 59/80 s, L2 44/63 s. The 75% bot gets bronze on L1 (94.8 s) and silver on L2 (53 s).
  - Build, sim and sweep pass.
- R13.9 (fixes from the Round 7 screenshot pass):
  - **Race ramps (pre-existing bug):** the generic "launch off slopes" code fired mid-ramp, so bikes bunny-hopped up race ramps, sank below the surface and left the lip with almost no upward speed. Race ramps now snap a vehicle that is below their surface and zero its vertical speed, so jumps launch properly from the lip (L1 vy ≈ 6 m/s).
  - Ring lifts were re-tuned to the real trajectories (L1 +1.15 m, L2 +0.9 m over the ramp top). Bots at 60–105% speed pass every main ring within ±0.1 m and collect 7/8 high stars.
  - Silver is now length / (0.8 · top) − ¾ of the ring bonus: L1 59/69 s, L2 44/53 s. The bots with traffic get bronze on L1 (91.6 s) and about silver on L2 (52–56 s).
  - **Level-2 race road (pre-existing since R6):** the harbor-area sea plane (y 0.02) covered the first ~200 m of the coastal causeway (y 0.015), so the scooter appeared to ride on water. The harbor sea now hides while racing; the race sea covers the coast.
  - **Tower mid floor:** camera blockers for the facade walls above the lobby and the mid-floor ceiling keep the camera inside the floor, so the flashlight floor is playable and visible.
  - Pickup models now spin about their own centre instead of orbiting the bike-space origin.
  - The locked-gate hint is shortened to two lines in all five languages. The sweep now checks the locked-gate HUD (long hint + "Pit bike ready!" banner) at all four viewports.
  - The ghost is brighter.
- R13 validation:
  - New `tests/round13.e2e.mjs` (part of `npm run test:e2e`):
    - city budget: 383 calls / 587k tris at the seeded spawn
    - hint pyshka's flashlight line, window glow, flashlight floor
    - five-part bike with the gate locked and the localized hint, then headlight on → gate open
    - a real full-course level-1 drive to the finish: medal, "New record!", stars chip, best time and ghost saved in localStorage
    - next race with the ghost ahead
    - stars and rings (race view 292 calls)
    - TRICK backflip popup with a phrase
    - hooligan hit "+1s Gotcha!"
    - level-2 race view (208 calls)
    - no console errors
  - Race views along both whole courses measured 175–294 calls.
  - Old tests updated for the new rules: e2e expects 6 reachable parts; the round3 driver allows the longer course.
  - Screenshots shots/r13-{flashlight-floor,gate-locked,race-stars-rings,trick,ghost,hooligan-hit,finish-medal,l2-race}.png at 412×915, all visually inspected.
  - Probe scripts: `tests/_perf13.mjs` (draw calls along both courses), `tests/_look13.mjs` (race view shot at a distance), `tests/_rings.mjs` (ring/star heights vs bot trajectories).
  - No push.
- R15.1 (Round 8 items 1–2): Level 3 old town (`sim/oldtown.ts`, `render/oldtown.ts`), theme `oldtown`.
  - Warm late-afternoon sky with ochre/cream/salmon plaster houses, terracotta tile roofs with ribs, ridge caps and chimneys, green shutters and flower boxes, and a honey-stone clock tower with a copper-green spire and four clock faces.
  - Park: pond with lily pads and ducks, a fenced island over a footbridge, a striped bandstand, trees, hedges, flower beds, lamps and benches. The square has café umbrellas, market stalls and two walkable roof terraces (outside stair to A, railed ramp from A to the pergola terrace B).
  - Pond water splashes you back to the spawn. Gable roofs have stacked collision slabs so a drone will land on them, not inside.
  - Data-driven `drone` VehicleDef (flies, climb 5.5 m/s, ceiling 26 m) with 6 parts and toy models: front/rear rotor pairs with spinning rotors and guards, lemon frame with a grip deck, battery, gimbal camera, skids.
  - Hidden part: the battery is in the clock room at the top of the tower's outside spiral stair (4 flights + landings), through a hatch door left ajar. An electric-blue flicker shows in the hatch and behind the clock faces while it is up there.
  - A clock-tower pyshka (`MissionDef.hint`) gossips "Something buzzes up in the clock tower… a battery?" in EN/RU/PL/LT/DE. All level-3 HUD/part/toast texts are localized in the same five languages.
  - Reach test: all 6 parts are walked and delivered by two hero builds. The battery is unreachable without the stair ramps and the path goes through the hatch. The pond is not walkable, a fall splashes back, and the hint pyshka talks until the battery is found. The sweep covers level-3 reachability, walks and drops.
  - Area views 173–233 calls / 416–544k tris.
  - Build, sim and sweep pass.
