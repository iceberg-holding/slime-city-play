# Round 5 sweep

## Item 1 — ramps and lights
- Race jump geometry previously used a 10 m rise direction for full-width ramps while simulation sampled 8 m. Reading the wedge transform exposed the mismatch. Rendered ramps now use the shared 8 m run and 2.7 m height (1.69× the old height); analytic collision and launch slope use the same constants.
- Warm multicolour bulbs follow catenary edge wires, one InstancedMesh per chunk, without point lights or per-frame geometry allocation.

## Item 2 — automated sweep (`npm run test:sweep`)
- **Banner covers Exit and gate compass on a 360×740 phone.** Reproduced by keeping the assembly toast visible while checking pairwise DOM rectangles. Moved the toast to the gap below objectives and reduced its type size, with wrapping and a viewport width cap.
- **Traffic seed 93 exhausted the race timer on the final straight.** Three seeded steering bots exposed a course that the original seed-42 bot passed. Added six seconds for traffic on top of the existing length/speed/slack calculation; all three now finish.
- Coverage: grid routes to both missions' parts and garages, gate approach, separate elevator-connected floors and rooftop pool/spa; 24 seeded walks starting along routes and on tower floors, excluding deliberate wall-facing input from stall detection; player/creature penetration and world bounds; drops onto every solid and its edges, roofs and hundreds of track samples for player/vehicle radii; max-speed wall crossings; three full-course bots checking stalls, falls and finish reachability.
- Browser coverage: 360×740, 412×915, 768×1024, 915×412 touch viewports; creator panel and scrollable Play control, assembly banner, HUD, Exit, compass, action buttons, active joystick, race and win card bounds/overlaps. Parent/child rectangles are intentionally excluded from pairwise overlap checks.
- Limits: seeded sampling is reproducible coverage, not a mathematical proof of every continuous-space trajectory. Elevator floors are connected by the separately tested dynamic lift; race entry is connected by the gate transition and full-course bot, rather than pretending both are static walking edges.
- **Tablet Exit overlaps the active left joystick.** The 768×1024 touch check revealed that the old width-only phone rule left Exit at the bottom on tablets. Touch devices now place Exit below the HUD regardless of viewport width, including landscape.
- **Win-screen delay stretched at low rendering FPS.** Waiting for the actual win screen exposed a delay driven by the simulation's capped frame delta. Use elapsed frame time for this UI delay so the 2.2-second transition remains timely on slow devices. The browser sweep waits for the visible screen before measuring it.
