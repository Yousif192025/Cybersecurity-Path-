# P0-A0 results (2026-11-02)

Source: isolated copies of live `simulation.js` / assessments from cyberpath.vercel.app. No published lab files modified.

## F-01
- Mutation: `key.q2.correctId = "z"`, answers = B1 (`q2=b`)
- Observed: `complete=false`, `parts.q2=false`, q2 feedback message shown
- Classification: **ordinary test** (not known defect / not test.fail)

## F-10
- Mutation: delete `key.q2` then evaluate `answers.q2 === key.q2.correctId` as in fixed-data.js
- Observed current behavior: **TypeError** `Cannot read properties of undefined (reading 'correctId')`
- Note: TypeError is the **observed** behavior, not the desired post-fix contract. Target after fix: safe reject (`complete=false`, no uncaught throw). Characterization may use expected-fail until product fix.

## S-08
- URL: `run.html?id=lab-does-not-exist-01&runner=simulation`
- Observed: no successful lab run; UI error pattern **تعذر تحميل المختبر: المختبر غير موجود في السجل**
- No `complete:true` saved for that id after failed load

## L1-20
- Indicators only, no accepted decision phrases: **q4=false**

## L1-21
- Text includes «عدم التفاعل»: **q4=false** on live engine
- Live `isDecisionOrientedKeyword` matches whole phrases against hint keyword strings; derived decision list is effectively إبلاغ/ابلاغ/لا أفتح/لا افتح

## L1-22
- «أبلغ» without إبلاغ/ابلاغ/لا أفتح: **q4=false**
