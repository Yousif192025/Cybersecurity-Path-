# D2-C Compatibility Repair Report

## Fixes
1. `session-state.js` — `applyPatches` accepts D2-A/B `roeEvent` and `logEntry` (aliases `roeViolation`/`commandLogEntry` additive only).
2. `discoveredHost` merges by `name || host` without wiping prior fields.
3. Restored public `clone` API.
4. v1/v2 session upgrade to v3 preserved.
5. Runner UI: class `pt-term-log` restored (plus `pt-terminal`), `aria-live="polite"`, `dir=ltr`.
6. Session reset button restored (`data-pt-reset` / `pt-btn-reset`) — clears current lab session only.
7. Quick scope panel from `world.inScopeSummary` restored.
8. Findings workspace and D2-C validation kept intact.

## Tests run
- unit-d2c-pentest.spec.js: 23 PASS / 0 FAIL (12 D2-C + 11 COMPAT)
- unit-d2b-pentest.spec.js: 45 PASS / 0 FAIL
- Browser/Playwright: NOT_RUN (install blocked in this environment)

## Protected
- D1 JSON not modified
- P0-B-unit-results.json not touched
- simulation.js / fixed-data.js / Labs 1–8 not modified
- No commit/push/deploy
