# CyberPath Labs Center — Phase 0 Regression (`tests/labs`)

حزمة اختبارات معزولة. **لا تعدّل** محتوى `docs/academy/labs`، ولا `package.json` الجذري، ولا إعدادات النشر.

## التثبيت (مرة واحدة)

```bash
cd tests/labs
npm install
npx playwright install --with-deps chromium
```

## تشغيل دخان P0-A

```bash
npm run test:smoke
```

يتطلب وجود شجرة `docs/` في جذر المستودع (نفس ما يُنشر). الإعداد يخدم `docs/` على المنفذ 4173.

## النطاق

- مكتمل حتى الآن: **P0-A0** (رصد) و**P0-A** (بنية + smoke واحد).
- لا تبدأ **P0-B** دون موافقة صريحة.
- `specs/simulation-score.unit.smoke.js` سقالة فقط — ليس جزءًا من دخان Playwright المنفَّذ في P0-A.

## المختبرات المنشورة ذات الصلة

1. `lab-soc-phishing-email-01` (simulation)
2. `lab-soc-log-triage-01` (fixed_data)
3. `lab-soc-incident-response-01` (simulation)
