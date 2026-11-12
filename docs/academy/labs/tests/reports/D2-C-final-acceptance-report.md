# D2-C Final Acceptance — Last Repair

## Critical fix
`roeBtn` is now appended with `roePanel.appendChild(roeBtn)` **before** `root.appendChild(roePanel)`.

## API
Restored additive `LabsPentestD2A = { init, runCommand }` sharing the same command engine and session as `LabsPentestD2C`.

## Unit tests (executed)
| Suite | Result |
|-------|--------|
| D2-C unit | **34 PASS / 0 FAIL** |
| D2-B unit | **45 PASS / 0 FAIL** |
| D2-A unit | **32 PASS / 1 FAIL** |

### D2-A C-02 note (pre-existing)
`unit-d2a-pentest.spec.js` C-02 expects `nmap 1.2.3.4` → exit **127** (unknown). After D2-B, `nmap` is a real command and returns a **scope/RoE** result, not UNKNOWN_COMMAND. This mismatch predates the RoE DOM fix and is not caused by attaching `roeBtn`. No change made to command-engine or D2-A test in this repair (out of defect list).

## Browser tests
**NOT_RUN** — Playwright/npm not available in this environment (prior network 502). No browser pass claimed.

Static structure proof: `roePanel.appendChild(roeBtn)` appears before `root.appendChild(roePanel)` (COMPAT-18 PASS).

## Protected
D1 JSON, P0-B, Labs 1–8, simulation.js, fixed-data.js untouched.
No merge/commit/push/deploy.
