# P0-A0 results (2026-11-02)

Source: live `simulation.js` / assessments from cyberpath.vercel.app (isolated copies under /tmp/labs-a0). No published files modified.

## F-01
- Mutation: `key.q2.correctId = "z"`, answers = B1 (`q2=b`)
- Observed: `complete=false`, `parts.q2=false`, feedback q2_wrong text shown
- Classification: **ordinary test** (not known defect / not test.fail)

## F-10
- Mutation: delete `key.q2` then evaluate `answers.q2 === key.q2.correctId` as in fixed-data.js
- Observed: **TypeError** `Cannot read properties of undefined (reading 'correctId')`
- Classification: ordinary test documenting throw / learner-visible failure path (to assert in UI layer in P0-D)

## S-08
- URL: `run.html?id=lab-does-not-exist-01&runner=simulation`
- Observed path: meta null → simulation throws → UI message pattern: **تعذر تحميل المختبر: المختبر غير موجود في السجل**
- No successful lab form completion; no basis for `complete:true` on that id when load fails before submit

## L1-20
- Text indicators only, no decision phrases: **q4=false** (matches plan)

## L1-21
- Text includes «عدم التفاعل»: **q4=false** on live engine
- Reason (observed): `isDecisionOrientedKeyword` matches whole phrases on **hint keywords**, so derived decision list is essentially إبلاغ/ابلاغ/لا أفتح/لا افتح; answer must contain those substrings. Phrase «عدم التفاعل» in the answer does not alone satisfy decisionList hits.

## L1-22
- «أبلغ» without إبلاغ/ابلاغ/لا أفتح: **q4=false** (matches plan)

## Live note
Live `isDecisionOrientedKeyword` uses phrase list including «عدم التفاعل» as a phrase tested against **keywords**, not a free stem «عدم» alone — differs from some earlier review assumptions; A0 uses live behavior as contract.
