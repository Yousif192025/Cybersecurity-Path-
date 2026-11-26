# D2-C Final UI Compatibility Repair

## Changes
1. Restored RoE panel: `world.roeText`, button `قبول قواعد الاشتباك`, disabled state `تم قبول القواعد`, persists `state.roeAccepted`.
2. CLI `roe accept` still works; UI button syncs after commands via `syncRoeButton()`.
3. Terminal classes dual-compatible:
   - form: `pt-term-form pt-cmd-form`
   - input: `pt-term-input pt-cmd-input`
   - log: `pt-term-log`
   - lines: `pt-term-line` + `pt-term-in|out|err|meta`
4. D2-C findings workspace, reset, scope panel preserved.

## Tests
- D2-C unit: 29 PASS / 0 FAIL
- D2-B unit: 45 PASS / 0 FAIL
- Browser (Playwright): NOT_RUN (install unavailable in this environment)

## Protected
D1 JSON, P0-B report, other labs, simulation.js, fixed-data.js untouched.
No commit/push/deploy/merge.
