# Round 5 sweep

## Item 1 — ramps and lights
- Race jump geometry previously used a 10 m rise direction for full-width ramps while simulation sampled 8 m. Reading the wedge transform exposed the mismatch. Rendered ramps now use the shared 8 m run and 2.7 m height (1.69× the old height); analytic collision and launch slope use the same constants.
- Warm multicolour bulbs follow catenary edge wires, one InstancedMesh per chunk, without point lights or per-frame geometry allocation.
