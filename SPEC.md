# Slime City v0.1 — single-player 3D kids' prototype
Vite + TypeScript + Three.js (npm three). Mobile-first, 60fps mid-range phones. Vite base './' (will be hosted on GitHub Pages at /slime-city-play/).
Third-person Roblox-like. Kids 11/13. Harmless combat: nobody dies, no blood.
- Character creator screen like a combination lock: 4 spinning wheels (head, body, legs, gun), each with ~6 options (0-5 or 0-9), the combination shown as a 4-digit code; procedural low-poly chunky toy parts. Button Play.
- One city block (Paris-ish: boxy buildings with roofs, a fountain in a plaza, parked cars, climbable rooftops via ramps/stairs or blocks). Use InstancedMesh for repeated geometry, one directional light with a small shadow map, low poly, colorful.
- Mission: collect 5 golden donuts (torus, spinning) placed around, some on rooftops/needing blocks. HUD counter.
- 5 wandering creatures (weird procedural blobs with eyes) that wander then chase the player when near; contact knocks player back (no damage).
- Slime gun two modes: sticky projectile glues enemy in place for ~5s (green goo visual); bouncy projectile creates a pink bounce pad on ground; enemies (and player) stepping on it launch into the air. Simple custom physics (gravity, AABB collision against buildings/blocks), no physics library.
- Block placement: place cube or ramp in front of player on grid, max 10 (counter); player can climb on them.
- Win screen when 5 donuts collected, with time, Play again.
- Controls: left virtual joystick; right-side buttons: sticky, bouncy, jump, block (tap block toggles cube/ramp via small button); drag on right half rotates camera. Desktop: WASD move, mouse drag/pointer to rotate, Space jump, left click/J sticky, right click/K bouncy, E place block, Q toggle shape.
- UI in English (default) and Russian, toggle button EN/RU on creator screen, persist in localStorage.
- Architecture for future multiplayer: src/sim/ (pure game state + fixed-timestep step(state, inputs, dt) with seeded RNG, no three.js imports), src/render/ (three.js view reading state), src/input/ (produces input commands), src/ui/. Entities with ids.
- Expose window.__game for testing (state, and helpers to teleport/fire) in dev and prod is fine.
- No external asset downloads. No console errors. `npm run build` must pass (tsc --noEmit && vite build).
Commit often with git (do not push). When done, write a short summary of what works and known issues to PROGRESS.md.

## CHANGE (overrides donut mission)
Mission is now: collect 5 pit bike parts hidden around the block (front wheel, rear wheel, frame, handlebar, engine). A garage spot shows the bike assembling part by part as parts are brought (delivered on reaching the garage). When all 5 are in, player can get on the pit bike (Enter/Exit button; F on desktop) and ride: simple arcade vehicle physics, joystick steers/throttles, jumps off bouncy slime pads with tricks (spin/flip in air, "TRICK!" popup). Creatures still interfere (knock bike back). Win screen after first trick or ~10s ride. Keep vehicle & part system generic (data-driven VehicleDef with parts list) so a scooter and drone can be added later.
