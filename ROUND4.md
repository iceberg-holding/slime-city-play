# Round 4: longer race (small steps, commit after each, no push; npm run build && npm test && npm run test:e2e before commits)
Current race road: straight, x≈80, z 12 → -145 (~157 m), 60 s, rails at x 73.25/86.75, 2 ramps.
1. Make the track 3-4x longer (~500-600 m) with variety: gentle curves (S-bends; data-driven centerline polyline/spline in src/sim, rails/collision follow it), more ramps and jumps (incl. a gap jump that is optional/has a safe lane), and scenery sections (e.g. park with trees, seaside/boardwalk, tunnel/bridge, market stalls) — procedural, low-poly-premium style matching the game.
2. Timer scaled to length with ~30-40% slack; add an automated test where a scripted bot follows the centerline at ~75% of top speed and finishes in time (and a timeout test still yields retry).
3. More pyshki spread along the track (spawned/active per section near the player only; deterministic).
4. Perf: build the track in chunks (~60-80 m), merge/instance per chunk, set visible only for chunks within ~120 m of the camera (and hide all chunks when race is locked). In city view draw calls/triangles must not exceed current (≈404 calls / 596k tris via __game.renderInfo()); during race keep calls ≤ 450.
5. Hide the 'Pit bike ready!' banner when the race starts (and any lingering popups). Move the Exit (ride/exit) button out of the road view: on phones place it as a small pill top-left under the HUD or left edge above the joystick zone, never centre-screen.
6. Update PROGRESS.md; take shots/r6-race-*.png at 412x915 (start, a curve, a jump, a scenery section).
