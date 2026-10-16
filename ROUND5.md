# Round 5 (after gate task). Small commits, no push; npm run build && npm test && npm run test:e2e before commits.
1. Race ramps taller (~1.5-2x height, still rideable/landable; update sim ramp solids + render together; keep bot finish test passing) and add string lights: a catenary of small glowing bulbs (InstancedMesh, emissive, warm multicolour) along each ramp edge/over the ramp. One draw call per chunk max for bulbs.
2. Broad automated bug sweep, write tests/sweep.mjs (node, sim-level + Playwright where needed):
   - stuck spots: random-walk/bot many seeds across city, tower floors, rooftop, race track; detect player not moving for >3s while input applied and not against a wall face on purpose; detect stuck inside solids (penetration).
   - unreachable areas: grid flood-fill of walkable cells from spawn (reuse reach.ts) listing important targets (parts, garage, gate, elevator stops, pool, spa, finish) not reachable.
   - falling through: drop player/vehicle at many points incl. ramps/roofs/track edges; assert y never < -1 and no tunneling at max speed.
   - pyshki: never stuck inside buildings, never leave world bounds.
   - UI overlaps: Playwright at 360x740, 412x915, 768x1024, 915x412 landscape: check bounding rects of HUD elements, buttons, joystick zone, Exit pill, hint, compass don't overlap and are within viewport; in creator, race, win screens.
   Fix every bug found. Write findings + fixes to SWEEP.md (bug, how found, fix). Take shots/r8-ramp-lights.png at 412x915.

# Round 6 (after round 5 is deployed)
3. Full level 2: scooter assembly in a new, varied area (e.g. seaside promenade / harbor district with piers, beach, lighthouse, boats — distinct palette from level 1), its own parts placement (all reachable on foot, add to reach test), own garage, then its own race track with different scenery (coastal road, pier boardwalk, lighthouse loop), scooter-specific handling (lighter, quicker turns, smaller jumps) via VehicleDef. Win -> level complete screen (level 3 drone teaser). Keep chunked culling and budgets (≤ level-1 numbers).
4. Graphics polish pass on both levels: better materials/colour harmony, soft contact shadows, nicer sky gradient/clouds, water shading, small details; no perf regression (check __game.renderInfo()).
Screenshots: shots/r9-l2-*.png (area, parts, garage scooter, race, finish).
   - Known: 'Pit bike ready!' banner overlaps the gate compass at top centre; move compass or shorten banner.
