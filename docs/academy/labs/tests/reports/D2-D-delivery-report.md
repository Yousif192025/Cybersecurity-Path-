# D2-D Delivery Report — lab-pentest-engagement-01

## Summary
Completed Report, Knowledge, final scoring (D1 weights / threshold 80), results.html payload, catalog publish, and D2-C defect fixes (invalid remediation rejection + finding re-save protection).

## Files modified
| File | Reason |
|------|--------|
| runners/pentest/findings-engine.js | scoreReport/Knowledge/Roe/Recon/Surface, computeFinalResult, setRemediation validation, upsertFinding protection |
| runners/pentest/session-state.js | reportFields, knowledgeAnswers persistence |
| runners/penetration-testing.js | Report/Knowledge/Final UI, remediation reject messages, D2-D labels |
| data/labs-index.json | status published + updated summary |
| css/labs.css | completion panel styles |
| tests/specs/unit-d2d-pentest.spec.js | new unit suite |
| tests/reports/D2-D-unit-results.json | results |

## Files NOT modified
- D1 content/assessment JSON
- simulation.js, fixed-data.js
- Labs 1–8 runners/content
- P0-B-unit-results.json
- index.html / main site

## Test results
- D2-D unit: **14 PASS / 0 FAIL**
- D2-B unit: **45 PASS / 0 FAIL**
- D2-C unit: **34 PASS / 0 FAIL**
- D2-A unit: **32 PASS / 1 FAIL** (pre-existing C-02 nmap expectation mismatch; not introduced by D2-D)
- Browser E2E on production after deploy: **NOT RUN** (local package only; no commit/push/deploy)
- Playwright browser suite: **NOT RUN** (environment constraint)

## Acceptance mapping
| Criterion | Status |
|-----------|--------|
| Report stage | Implemented + unit-tested |
| Knowledge stage | Implemented + unit-tested |
| Score weights 100 / threshold 80 | computeFinalResult |
| labs:result:lab-pentest-engagement-01 | Written on final submit |
| Catalog published | labs-index status=published |
| Card → run.html?id=... | Existing catalog filter uses published |
| Labs 1–8 untouched | Confirmed by file list |
| Invalid remediation blocked | Unit + UI message |
| Finding re-save protection | Unit D2D-09 |

## Remaining after manual deploy
1. Upload ZIP paths into repo under docs/academy/labs/
2. Verify production catalog shows 9 labs and pentest card opens run.html
3. Manual browser path: RoE → nmap/curl → findings → risk/priority/remediation → report → knowledge → results.html
