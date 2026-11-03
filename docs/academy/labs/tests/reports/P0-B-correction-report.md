# تقرير جولة التصحيح المحدودة — P0-B

**النطاق:** `tests/labs/` فقط — لا إصلاح إنتاج — لا commit/push

## 1) إصلاح الشروط الضعيفة

| الاختبار | قبل | بعد |
|----------|-----|-----|
| L1-17 | شرط منطقي يقبل أي قيمة لـ q4 | `o.parts.q4 === true` فقط (طول ≥20 + كلمات + قرار عبر إبلاغ) |
| L1-17b | مكرر | حُذف |
| L2-16 | `!q4ok \|\| len<25` | يفرض `len<25` ثم `q4ok === false` |
| L2-22 | `true` دائمًا | `q4ok === true` مع توثيق سلوك الإنتاج (مصدر+متابعة يكفيان) |
| F-08 | `complete \|\| !critical` | `complete === true && critical === false` (عيب واضح) |

## 2) maxFalsePositives: 0

- **L2-maxFP-0:** `maxFalsePositives: 0` + مشتت واحد مع 4 صحيحة.
- النتيجة المرصودة: **`q1ok === true`** لأن الإنتاج يستخدم `maxFalsePositives \|\| 2` فيحوّل 0 إلى 2.
- الاختبار يثبّت هذا العيب على **دالة score المحمّلة من `docs/.../fixed-data.js` وقت التشغيل** (لا نسخة ثابتة قديمة).

## 3) F-11 / F-12 / F-14 / F-16

| ID | المرصود | التفسير |
|----|---------|---------|
| F-11 | complete=true مع q5 مضاف | fixed-data يقيّم q1–q4 فقط |
| F-12 | q2ok=true رغم type=matching | النوع يُتجاهل؛ المقارنة على correctId |
| F-14 | q2 ok بلا options في Lab6 | scoreAll لا يعتمد على options |
| F-16 | critical=false عند criticalIds=["x"] | الحرج لا يُفعَّل |

## 4) استبدال نتيجة المحاولة

- **X-01 (Playwright):** نجاح B1 ثم تغيير q2 وإعادة إرسال → `complete:false` و`parts.q2:false` في sessionStorage.

## 5) Lab2 والمحرك الإنتاجي

- `lib/fixed-data-score.js` يعيد استخراج `score()` من ملف الإنتاج عند كل تحميل للوحدة.

## 6) نتائج إعادة التشغيل

### Unit
```
B1: 26/26
B2: 23/23
B3: 27/27
B4: 18/18
TOTAL: 94 pass, 0 fail
```
السجل: `reports/P0-B-unit-run.log`

### Playwright
```
8 passed (13.1s)
```
(NAV-01, NAV-02, S-08, X-06, X-01, X-04, X-08, smoke)
السجل الخام: `reports/P0-B-playwright-run.log`

## 7) ما يبقى خارج الإغلاق الكامل (موثّق)

- Lab2 تعبئة نموذج كاملة عبر المتصفح غير مضافة (التقييم عبر score الإنتاجي في Node).
- X-04 ما زال يحقن sessionStorage لصفحة النتائج (يختبر العرض لا دورة التشغيل الكاملة لـ Lab6).
- لا CI.

## تأكيدات

لا تعديل خارج tests/labs — لا commit/push — لا إصلاح إنتاج.
