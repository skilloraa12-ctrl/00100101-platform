# patient-workflow-web — audit and 3 design concepts

- `audit.html` — code audit (table of issues: priority, why, how to fix, file:line) + notes on the meeting screenshots.
- `variant-1-clear.html` — modern, simple (left sidebar).
- `variant-2-airy.html` — modern, lighter (top bar, soft cards).
- `variant-3-easy.html` — simplest possible (one step at a time, yellow "what to do now" bar, giant buttons).

All three prototypes share one engine (`src/core.js`, `src/core.css`); `python3 src/build.py` regenerates the pages.
Every prototype has: full-screen white/red confirmation dialogs, `?` help on every field, a Training section with "Show me",
technician-first flow (pick doctor → only that doctor's patients), consent with signature + guardian for minors,
and red safety checks for stronger vials / dose jumps. All patient and doctor names are synthetic.
