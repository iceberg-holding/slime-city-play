# Slime City v0.1 — progress

`npm install && npm run dev` to play; `npm run build` (tsc --noEmit && vite build) passes. Vite `base: './'`, so `dist/` can be dropped onto GitHub Pages under `/slime-city-play/`.

## What works
- **Character creator**: combination-lock UI with 4 spinning wheels (head / body / legs / gun, 6 options each, digits 0–5). Drag a wheel, tap the ▲/▼ arrows or use the mouse wheel. The 4-digit code is shown and saved to localStorage. There's a live 3D turntable preview, a Random button and a Play button. EN/RU toggle is saved in localStorage.
- **City block**: Paris-ish ring of pastel buildings with mansard roofs, chimneys, windows, balconies and shop awnings. Plaza with a fountain, trees, lamps, benches and 6 parked cars. Two long ramps with flat landings lead to rooftops, and a crate staircase climbs another. Repeated geometry uses InstancedMesh. One directional light with a 1024 shadow map that follows the player. About 170–195 draw calls including the shadow pass.
- **Mission (per the SPEC "CHANGE")**: 5 pit-bike parts (front wheel, rear wheel, frame, handlebar, engine), each glowing with a light beam:
  - one on the fountain
  - one on a roof reached by a ramp
  - one on a low café roof (needs blocks or a bounce pad)
  - one on a car roof
  - one floating above the street (bounce pad or a stack of blocks)
  - Parts you pick up float above your head. Walk into the garage (blue beam) to deliver them, and the bike there assembles part by part. When all 5 are in, a Ride button appears (F / Enter on desktop).
- **Riding**: arcade bike physics. Joystick up = throttle, down = brake/reverse, sideways = steer; the bike leans into turns. Ramps launch the bike into the air. Pink slime pads launch it and do an automatic backflip. Steering in the air spins the bike, and Jump in the air starts a flip. Each completed flip or 360 spin shows a "TRICK!" popup. Creatures knock the bike back. You can still fire both slime types while riding, but not place blocks. The camera swings behind the bike unless you're dragging it.
- **Win**: first trick or 10 s of riding. The world keeps running for ~2 s so the trick lands, then the win screen shows the time with Play again / New hero.
- **Creatures**: 5 lumpy procedural blobs (seeded colors, 1–3 eyes, some on stalks, some horns). They wander, chase when you're within 9 m, and hop over obstacles. Touching one knocks you back with a short stun. Nobody gets hurt.
- **Slime gun**:
  - Sticky: lightly aim-assisted at creatures in front. Glues a creature for 5 s inside a green goo shell, or splats on walls.
  - Bouncy: lob that leaves a pink pad on whatever surface it lands on (max 4, 30 s each). Players, creatures and the bike that step on a pad launch about 5.8 m up. A direct hit pops a creature into the air.
- **Blocks**: cube or ramp placed on the 1 m grid in front of you (along the camera direction), stacked on whatever is below. A preview cell shows for a few seconds after placing or toggling, red when the spot is blocked. Max 10; past that the oldest block is recycled. The HUD counter shows how many are left. You can climb blocks and walk up ramps.
- **Controls**:
  - Touch: floating joystick on the left; drag the right side to look; buttons for sticky, bouncy, jump and block, plus a small cube/ramp toggle and the Ride/Exit button.
  - Desktop: WASD or arrows to move, drag to look (←/→ also turn), Space jump, click or J sticky, right-click or K bouncy, E block, Q cube/ramp, F ride/exit.
- **Architecture**:
  - `src/sim` is pure TS with no three.js. `step(state, inputsByPlayerId, dt)` runs at a fixed 60 Hz. RNG is seeded and stored in state, entities have ids, and events go out to the view for sound and particles.
  - `src/sim/vehicles.ts` is data-driven: a `VehicleDef` lists parts and handling, and `MISSION` sets the garage and part spots.
  - `src/render` reads state. `vehicleModels.ts` maps each vehicle kind and part id to a builder, so a scooter or drone = a new def plus builders.
  - `src/input` produces `InputCommand`s; `src/ui` holds the DOM screens.
- **`window.__game`** test hooks: `state`, `mode`, `start()`, `teleport(x,y,z)`, `fire(kind,yaw)`, `place(yaw)`, `tick(n, cmd)`, `interact()`, `collectAll()`, `setCamera()`, `setPaused()`, `renderInfo()`.
- Sound is a few synthesized WebAudio blips; there are no asset files.

## Known issues / not done
- The sim is only tested by scripted headless runs (Playwright + SwiftShader, screenshots in `shots/`). FPS hasn't been measured on a real phone.
- Physics is simple: characters are AABBs and ramp height is sampled at the body's center. Nothing blocks you from below (no ceilings), and the camera only collides with buildings, props and awnings, not creatures.
- The mansard roofs' colliders are vertical boxes, so you stand a little in front of the sloped visual.
- The bike can't climb cube blocks (0.4 m step limit), only ramps. Only the bike's center is tested against pads and walls.
- Hitting the 10-block limit recycles the oldest block, even one you're standing on.
- `VehicleDef.flies` exists for a future drone but isn't used yet.
- Bundle is ~600 kB (three.js isn't code-split).
