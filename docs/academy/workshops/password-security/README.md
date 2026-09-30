# أمن كلمات المرور (Password Security)

ورشة تفاعلية ضمن CyberPath Academy، مبنية على Workshop Engine المشترك.

## الهدف

مساعدة المتعلم على فهم مخاطر كلمات المرور الضعيفة أو المعاد استخدامها،
والتعرف على ممارسات إنشاء وإدارة كلمات المرور بأمان أكبر، مع فهم دور
مديري كلمات المرور والمصادقة متعددة العوامل (MFA).

## الملفات

```text
password-security/
├── README.md
├── index.html
├── data/
│   ├── workshop.json      — محتوى الورشة والمراحل والأنشطة
│   └── questions.json     — أسئلة "هل هذه الممارسة آمنة؟" والاختبار النهائي
└── js/
    └── workshop.js         — loader بسيط يربط Workshop Engine ببيانات الورشة
```

جميع محتوى الورشة (النصوص، المراحل، الأسئلة) موجود في ملفات JSON تحت
`data/`؛ لا يحتوي `index.html` أو `workshop.js` على أي محتوى تعليمي.

## كيفية التشغيل محليًا

من جذر مشروع Academy (بحيث يبقى المسار النسبي إلى `../engine/` صحيحًا):

```bash
python3 -m http.server 8000
```

ثم افتح:

```text
http://localhost:8000/docs/academy/workshops/password-security/
```

## الاعتماد على Workshop Engine

تعتمد هذه الورشة بالكامل على الملفات المشتركة الموجودة أصلًا في
`docs/academy/workshops/engine/` (`workshop-engine.js` و
`workshop-engine.css`) عبر مسارات نسبية:

- من `index.html`: `../engine/workshop-engine.css`
- من `js/workshop.js`: `../../engine/workshop-engine.js`

لا تحتوي هذه الورشة على أي نسخة من ملفات الـ Engine، ولا على أي CSS أو
JavaScript خاص بها خارج `workshop.js` (وهو loader فقط)، ولا على أي
اعتماد على مكتبات أو ملفات خارجية أخرى.
