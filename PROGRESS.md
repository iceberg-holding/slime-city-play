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
