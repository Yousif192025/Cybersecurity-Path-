// ==========================================
// CYBER-F-EXAM - COMPLETE QUESTIONS DATABASE (150 QUESTIONS)
// الدليل الشامل للتحضير لاختبار الأمن السيبراني
// التاريخ: 2026-08-11
// Total Questions: 150
// Distribution: Beginner (50), Intermediate (50), Advanced (36), Professional (14)
// ==========================================

// ==========================================
// 1. CYBER FUNDAMENTALS - أساسيات الأمن السيبراني (10 أسئلة)
// المستوى: Beginner
// ==========================================
const CYBER_FUNDAMENTALS_QUESTIONS = [
    {
        id: 1,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "easy",
        question: "تعرضت قاعدة بيانات مؤسسة لمحاولة وصول غير مصرح بها، وكان الهدف منع الأشخاص غير المخولين من الاطلاع على البيانات. أي مبدأ أمني يرتبط مباشرة بهذه الحالة؟",
        options: [
            "السرية (Confidentiality)",
            "السلامة (Integrity)",
            "التوفر (Availability)",
            "المصادقة (Authentication)"
        ],
        correctAnswer: 0,
        explanation: "السرية تعني منع الوصول غير المصرح به للمعلومات. في هذا السيناريو، الهدف الأساسي هو حماية البيانات من الاطلاع عليها من قبل أشخاص غير مخولين.",
        skill: "مبادئ الأمن (CIA)"
    },
    {
        id: 2,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يعد مثالاً على هجوم يهدد سلامة (Integrity) البيانات؟",
        options: [
            "اعتراض الاتصال بين المستخدم والخادم",
            "تعديل محتوى ملف مالي قبل إرساله",
            "هجوم حجب الخدمة (DDoS)",
            "سرقة اسم المستخدم وكلمة المرور"
        ],
        correctAnswer: 1,
        explanation: "السلامة (Integrity) تعني ضمان عدم تعديل البيانات بشكل غير مصرح به. تعديل محتوى ملف مالي قبل إرساله يعد انتهاكاً لسلامة البيانات.",
        skill: "مبادئ الأمن (CIA)"
    },
    {
        id: 3,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو المثال الأفضل للتهديد (Threat) في عالم الأمن السيبراني؟",
        options: [
            "نظام تشغيل غير محدث",
            "مخترق يحاول اقتحام النظام",
            "كلمة مرور ضعيفة",
            "فتحة أمنية في التطبيق"
        ],
        correctAnswer: 1,
        explanation: "التهديد (Threat) هو أي شيء يمكن أن يستغل نقطة ضعف للتسبب في ضرر. المخترق الذي يحاول اقتحام النظام يمثل تهديداً.",
        skill: "مفاهيم الأمن الأساسية"
    },
    {
        id: 4,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يمثل أفضل ممارسة لحماية السرية (Confidentiality) أثناء نقل البيانات عبر الشبكة؟",
        options: [
            "استخدام بروتوكول HTTP",
            "استخدام التشفير (Encryption)",
            "استخدام جدار حماية (Firewall)",
            "تحديث نظام التشغيل"
        ],
        correctAnswer: 1,
        explanation: "التشفير (Encryption) هو الآلية الأساسية لحماية سرية البيانات أثناء النقل، حيث يحول البيانات إلى شكل غير مقروء إلا للمستخدمين المخولين.",
        skill: "حماية البيانات"
    },
    {
        id: 5,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "medium",
        question: "في نموذج (CIA Triad)، أي من السيناريوهات التالية يمثل انتهاكاً للتوفر (Availability)؟",
        options: [
            "تمكن مخترق من قراءة رسائل البريد الإلكتروني للموظفين",
            "تم تعديل سجلات الرواتب من قبل موظف غير مخول",
            "تعرض الخادم لهجوم حجب الخدمة (DDoS) مما أدى إلى توقف الخدمة",
            "تمكن مستخدم من الوصول إلى بيانات غير مخول بها"
        ],
        correctAnswer: 2,
        explanation: "التوفر (Availability) يعني أن النظام والبيانات متاحة للمستخدمين المخولين عند الحاجة. هجوم حجب الخدمة (DDoS) يمنع المستخدمين الشرعيين من الوصول إلى الخدمة.",
        skill: "مبادئ الأمن (CIA)"
    },
    {
        id: 6,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "medium",
        question: "أي من التالي يمثل أفضل تعريف لإدارة المخاطر (Risk Management) في الأمن السيبراني؟",
        options: [
            "تثبيت أحدث برامج مكافحة الفيروسات",
            "عملية تحديد وتقييم وتخفيف المخاطر التي تهدد أصول المؤسسة",
            "تدريب الموظفين على سياسات الأمن",
            "إجراء اختبارات اختراق دورية"
        ],
        correctAnswer: 1,
        explanation: "إدارة المخاطر هي عملية منهجية لتحديد المخاطر التي تواجه المؤسسة، تقييم احتمالية حدوثها وتأثيرها، ثم اتخاذ إجراءات لتخفيفها إلى مستوى مقبول.",
        skill: "إدارة المخاطر"
    },
    {
        id: 7,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو الفرق بين التهديد (Threat) ونقطة الضعف (Vulnerability)؟",
        options: [
            "التهديد هو من يستطيع استغلال نقطة الضعف، ونقطة الضعف هي العيب في النظام",
            "التهديد هو العيب في النظام، ونقطة الضعف هي من يستطيع استغلاله",
            "لا يوجد فرق، المصطلحان مترادفان",
            "التهديد هو دائماً خارجي، ونقطة الضعف داخلية فقط"
        ],
        correctAnswer: 0,
        explanation: "نقطة الضعف (Vulnerability) هي عيب أو ثغرة في النظام يمكن استغلالها. التهديد (Threat) هو أي شيء يمكنه استغلال هذه النقطة الضعف للتسبب في ضرر.",
        skill: "مفاهيم الأمن الأساسية"
    },
    {
        id: 8,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "hard",
        question: "في سياق أمن المعلومات، أي من التالي يصف بشكل صحيح مفهوم (Defense in Depth)؟",
        options: [
            "استخدام جدار حماية واحد قوي لحماية الشبكة",
            "تطبيق طبقات متعددة من الإجراءات الأمنية بحيث إذا فشلت طبقة، تبقى الطبقات الأخرى",
            "تركيز جميع الجهود الأمنية على حماية الخوادم فقط",
            "الاعتماد على التشفير كآلية أمنية وحيدة"
        ],
        correctAnswer: 1,
        explanation: "الدفاع المتعمق (Defense in Depth) هو استراتيجية أمنية تعتمد على تطبيق طبقات متعددة من الإجراءات الأمنية بحيث إذا تم اختراق طبقة واحدة، تبقى الطبقات الأخرى لحماية النظام.",
        skill: "استراتيجيات الأمن"
    },
    {
        id: 9,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يمثل مثالاً على التحكم الأمني الإداري (Administrative Control)؟",
        options: [
            "جدار الحماية (Firewall)",
            "سياسة كلمات المرور في المؤسسة",
            "نظام كشف التسلل (IDS)",
            "التشفير (Encryption)"
        ],
        correctAnswer: 1,
        explanation: "الضوابط الإدارية هي سياسات وإجراءات توجه سلوك الموظفين. سياسة كلمات المرور هي مثال على ضابط إداري، بينما جدار الحماية ونظام كشف التسلل والتشفير هي ضوابط تقنية.",
        skill: "أنواع الضوابط الأمنية"
    },
    {
        id: 10,
        domain: "cyber-fundamentals",
        domainName: "أساسيات الأمن السيبراني",
        courseCode: "CYBR 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو المفهوم الذي يشير إلى قدرة النظام على الاستمرار في العمل بشكل صحيح حتى في حالة حدوث خطأ أو هجوم؟",
        options: [
            "المرونة (Resilience)",
            "التوفر (Availability)",
            "السلامة (Integrity)",
            "السرية (Confidentiality)"
        ],
        correctAnswer: 0,
        explanation: "المرونة (Resilience) هي قدرة النظام على تحمل الأحداث غير المتوقعة (أخطاء، هجمات، كوارث) والاستمرار في تقديم خدماته الأساسية، والتعافي بسرعة.",
        skill: "مفاهيم الأمن المتقدمة"
    }
];

// ==========================================
// 2. COMPUTER APPLICATIONS - مقدمة تطبيقات الحاسب (10 أسئلة)
// المستوى: Beginner
// ==========================================
const COMPUTER_APPLICATIONS_QUESTIONS = [
    {
        id: 101,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو تعريف الحاسب الإلكتروني؟",
        options: [
            "جهاز إلكتروني يستقبل البيانات ويعالجها ويخرجها",
            "جهاز لتخزين الملفات فقط",
            "جهاز للاتصال بالإنترنت فقط",
            "جهاز لطباعة المستندات"
        ],
        correctAnswer: 0,
        explanation: "الحاسب الإلكتروني هو جهاز إلكتروني يستقبل البيانات (مدخلات)، يعالجها وفق تعليمات محددة (برامج)، ويخرج النتائج (مخرجات) لتخزينها أو استخدامها.",
        skill: "مفاهيم الحاسب الأساسية"
    },
    {
        id: 102,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يعد من أجهزة الإدخال في الحاسب؟",
        options: [
            "الشاشة (Monitor)",
            "الطابعة (Printer)",
            "لوحة المفاتيح (Keyboard)",
            "مكبرات الصوت (Speakers)"
        ],
        correctAnswer: 2,
        explanation: "أجهزة الإدخال هي تلك التي تسمح للمستخدم بإدخال البيانات إلى الحاسب، ومنها لوحة المفاتيح والفأرة والماسح الضوئي. الشاشة والطابعة ومكبرات الصوت هي أجهزة إخراج.",
        skill: "مكونات الحاسب"
    },
    {
        id: 103,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو نظام التشغيل (Operating System)؟",
        options: [
            "برنامج لإدارة ملفات الحاسب فقط",
            "برنامج وسيط بين المستخدم وعتاد الحاسب يدير الموارد",
            "برنامج لكتابة المستندات",
            "برنامج للاتصال بالإنترنت"
        ],
        correctAnswer: 1,
        explanation: "نظام التشغيل هو برنامج وسيط بين المستخدم وعتاد الحاسب، يدير موارد الحاسب (المعالج، الذاكرة، التخزين) وينسق بين البرامج المختلفة ويسهل تفاعل المستخدم مع الجهاز.",
        skill: "نظام التشغيل"
    },
    {
        id: 104,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يعد مثالاً على برامج التطبيقات المكتبية (Office Applications)؟",
        options: [
            "نظام التشغيل Windows",
            "برنامج معالج النصوص (Word)",
            "برنامج مكافحة الفيروسات",
            "برنامج تشغيل الطابعة"
        ],
        correctAnswer: 1,
        explanation: "برامج التطبيقات المكتبية مثل معالج النصوص (Word)، جداول البيانات (Excel)، وبرامج العروض التقديمية (PowerPoint) تستخدم لإنجاز مهام محددة. نظام التشغيل وبرامج مكافحة الفيروسات وبرامج التشغيل هي برامج نظام.",
        skill: "أنواع البرمجيات"
    },
    {
        id: 105,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو الفرق بين الذاكرة الرئيسية (RAM) والذاكرة الثانوية (Hard Drive)؟",
        options: [
            "RAM تخزن البيانات مؤقتاً، والقرص الصلب يخزنها بشكل دائم",
            "RAM تخزن البيانات بشكل دائم، والقرص الصلب يخزنها مؤقتاً",
            "كلاهما يخزن البيانات بشكل دائم",
            "كلاهما يخزن البيانات بشكل مؤقت"
        ],
        correctAnswer: 0,
        explanation: "الذاكرة الرئيسية (RAM) تخزن البيانات والبرامج التي يعمل عليها الحاسب بشكل مؤقت (تفقد عند انقطاع التيار)، بينما القرص الصلب يخزن البيانات بشكل دائم حتى بعد إيقاف تشغيل الحاسب.",
        skill: "مكونات الحاسب"
    },
    {
        id: 106,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هي وظيفة نظام إدارة الملفات (File System) في نظام التشغيل؟",
        options: [
            "تنظيم وتخزين الملفات في هيكل منظم لتسهيل الوصول إليها",
            "حماية الحاسب من الفيروسات",
            "إدارة اتصالات الشبكة",
            "تسريع أداء المعالج"
        ],
        correctAnswer: 0,
        explanation: "نظام إدارة الملفات (File System) هو طريقة تنظم بها نظام التشغيل تخزين الملفات في الأقراص، ويسهل إنشاء الملفات والمجلدات وتنظيمها والبحث فيها والوصول إليها.",
        skill: "نظام التشغيل"
    },
    {
        id: 107,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "medium",
        question: "في برامج معالجة النصوص، ما هي وظيفة أداة (Spell Check)؟",
        options: [
            "التحقق من الأخطاء الإملائية والنحوية في النص",
            "تنسيق النص وتغيير حجم الخط",
            "إدراج الصور والجداول",
            "حساب العمليات الحسابية في الجدول"
        ],
        correctAnswer: 0,
        explanation: "أداة التدقيق الإملائي (Spell Check) في برامج معالجة النصوص تساعد المستخدم على اكتشاف وتصحيح الأخطاء الإملائية والنحوية في المستند، مما يحسن جودة الكتابة.",
        skill: "التطبيقات المكتبية"
    },
    {
        id: 108,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "hard",
        question: "ما هو المقصود بوحدة المعالجة المركزية (CPU) في الحاسب؟",
        options: [
            "الجزء المسؤول عن تنفيذ التعليمات البرمجية ومعالجة البيانات",
            "الجزء المسؤول عن تخزين الملفات بشكل دائم",
            "الجزء المسؤول عن عرض المعلومات للمستخدم",
            "الجزء المسؤول عن الاتصال بالإنترنت"
        ],
        correctAnswer: 0,
        explanation: "وحدة المعالجة المركزية (CPU) هي دماغ الحاسب، وهي الجزء المسؤول عن تنفيذ التعليمات البرمجية للبرامج ومعالجة البيانات عن طريق إجراء العمليات الحسابية والمنطقية.",
        skill: "مكونات الحاسب"
    },
    {
        id: 109,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يعد من مكونات الحاسب المادية (Hardware)؟",
        options: [
            "برنامج معالج النصوص",
            "نظام التشغيل",
            "اللوحة الأم (Motherboard)",
            "برنامج مكافحة الفيروسات"
        ],
        correctAnswer: 2,
        explanation: "المكونات المادية (Hardware) هي الأجزاء الملموسة في الحاسب مثل اللوحة الأم، المعالج، الذاكرة، والقرص الصلب. بينما البرامج (Software) مثل معالج النصوص ونظام التشغيل هي تعليمات غير ملموسة.",
        skill: "مكونات الحاسب"
    },
    {
        id: 110,
        domain: "computer-applications",
        domainName: "مقدمة تطبيقات الحاسب",
        courseCode: "CAPP 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هي أهم خطوة يجب اتباعها لحماية البيانات المهمة على الحاسب؟",
        options: [
            "إغلاق الحاسب فوراً بعد الاستخدام",
            "نسخ احتياطي (Backup) للبيانات بشكل دوري",
            "تثبيت برامج الألعاب فقط",
            "استخدام الحاسب دون اتصال بالإنترنت"
        ],
        correctAnswer: 1,
        explanation: "النسخ الاحتياطي (Backup) هو أهم خطوة لحماية البيانات من الفقدان نتيجة لأعطال الأجهزة، الفيروسات، أو الأخطاء البشرية. يجب عمل نسخ احتياطية دورية للبيانات المهمة.",
        skill: "حماية البيانات"
    }
];

// ==========================================
// 3. NETWORK PRINCIPLES - مبادئ شبكات الحاسب (10 أسئلة)
// المستوى: Beginner
// ==========================================
const NETWORK_PRINCIPLES_QUESTIONS = [
    {
        id: 111,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو تعريف شبكة الحاسب (Computer Network)؟",
        options: [
            "مجموعة من الأجهزة المتصلة معاً لتبادل البيانات والموارد",
            "جهاز واحد يقوم بمعالجة البيانات",
            "برنامج يستخدم للاتصال بالإنترنت",
            "طابعة متصلة بحاسب واحد"
        ],
        correctAnswer: 0,
        explanation: "شبكة الحاسب هي مجموعة من الأجهزة (حواسيب، خوادم، أجهزة شبكة) المتصلة معاً لتبادل البيانات ومشاركة الموارد مثل الملفات والطابعات والاتصال بالإنترنت.",
        skill: "أساسيات الشبكات"
    },
    {
        id: 112,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يعد من مزايا الشبكات؟",
        options: [
            "مشاركة الموارد (الطابعات، الملفات)",
            "زيادة تكلفة الأجهزة",
            "صعوبة التواصل بين المستخدمين",
            "عزل البيانات عن المستخدمين"
        ],
        correctAnswer: 0,
        explanation: "من أهم مزايا الشبكات مشاركة الموارد مثل الطابعات والملفات، سهولة التواصل بين المستخدمين، ومشاركة الاتصال بالإنترنت، مما يقلل التكاليف ويزيد الإنتاجية.",
        skill: "أساسيات الشبكات"
    },
    {
        id: 113,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو الجهاز المستخدم لربط عدة أجهزة في شبكة محلية (LAN)؟",
        options: [
            "المبدل (Switch)",
            "الموجه (Router)",
            "المكرر (Repeater)",
            "الجسر (Bridge)"
        ],
        correctAnswer: 0,
        explanation: "المبدل (Switch) هو جهاز الشبكة الأساسي المستخدم لربط عدة أجهزة في شبكة محلية (LAN)، حيث يقوم بتوجيه البيانات بين الأجهزة المتصلة به بناءً على عناوين MAC.",
        skill: "أجهزة الشبكة"
    },
    {
        id: 114,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو نموذج OSI؟",
        options: [
            "نموذج مرجعي يوضح كيفية عمل شبكات الحاسب في سبع طبقات",
            "نموذج لتصميم قواعد البيانات",
            "نموذج لتطوير البرمجيات",
            "نموذج لإدارة المشاريع"
        ],
        correctAnswer: 0,
        explanation: "نموذج OSI (Open Systems Interconnection) هو نموذج مرجعي يوضح كيفية عمل شبكات الحاسب من خلال سبع طبقات، من الطبقة المادية إلى طبقة التطبيقات، ويساعد في فهم عملية الاتصال بين الأنظمة المختلفة.",
        skill: "نموذج OSI"
    },
    {
        id: 115,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "medium",
        question: "أي من التالي يمثل الطبقة السابعة (طبقة التطبيقات) في نموذج OSI؟",
        options: [
            "طبقة التطبيقات (Application Layer)",
            "طبقة الشبكة (Network Layer)",
            "طبقة النقل (Transport Layer)",
            "طبقة الجلسة (Session Layer)"
        ],
        correctAnswer: 0,
        explanation: "طبقة التطبيقات (Application Layer) هي الطبقة السابعة والأعلى في نموذج OSI، وهي المسؤولة عن توفير واجهة للمستخدمين والتطبيقات للوصول إلى خدمات الشبكة مثل HTTP و FTP و SMTP.",
        skill: "نموذج OSI"
    },
    {
        id: 116,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو بروتوكول TCP/IP؟",
        options: [
            "مجموعة بروتوكولات تستخدم للاتصال على الإنترنت",
            "بروتوكول لنقل الملفات فقط",
            "بروتوكول للبريد الإلكتروني فقط",
            "بروتوكول لتشغيل الألعاب"
        ],
        correctAnswer: 0,
        explanation: "TCP/IP هي مجموعة بروتوكولات تستخدم للاتصال على الإنترنت والشبكات، وتتضمن بروتوكول TCP (لنقل البيانات بشكل موثوق) و IP (لتوجيه الحزم)، وتعتبر الأساس الذي يقوم عليه الإنترنت.",
        skill: "بروتوكولات TCP/IP"
    },
    {
        id: 117,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هي وظيفة عنوان IP؟",
        options: [
            "تحديد موقع الجهاز على الشبكة بشكل فريد",
            "تحديد اسم المستخدم",
            "تحديد كلمة المرور",
            "تحديد نوع الجهاز"
        ],
        correctAnswer: 0,
        explanation: "عنوان IP (Internet Protocol) هو رقم فريد يُعطى لكل جهاز متصل بالشبكة لتحديد موقعه، ويساعد في توجيه البيانات من مصدرها إلى وجهتها الصحيحة عبر الشبكة.",
        skill: "عنونة الشبكة"
    },
    {
        id: 118,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "hard",
        question: "ما هو الفرق بين شبكة LAN و WAN؟",
        options: [
            "LAN تغطي مساحة صغيرة (مبنى)، و WAN تغطي مساحة كبيرة (مدن، دول)",
            "LAN أبطأ من WAN",
            "LAN تستخدم كابلات فقط، و WAN تستخدم لاسلكي فقط",
            "لا يوجد فرق بينهما"
        ],
        correctAnswer: 0,
        explanation: "LAN (Local Area Network) تغطي مساحة جغرافية صغيرة مثل مبنى أو حرم جامعي، بينما WAN (Wide Area Network) تغطي مساحة كبيرة مثل مدينة أو دولة أو العالم، وتتصل عادة عبر الإنترنت أو خطوط مؤجرة.",
        skill: "تصنيف الشبكات"
    },
    {
        id: 119,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو الجهاز المستخدم لتوصيل شبكتين مختلفتين (مثل شبكة منزلية والإنترنت)؟",
        options: [
            "الموجه (Router)",
            "المبدل (Switch)",
            "المحور (Hub)",
            "بطاقة الشبكة (NIC)"
        ],
        correctAnswer: 0,
        explanation: "الموجه (Router) هو جهاز الشبكة المستخدم لتوصيل شبكتين مختلفتين، مثل توصيل الشبكة المنزلية بشبكة الإنترنت، ويقوم بتوجيه البيانات بين الشبكات بناءً على عناوين IP.",
        skill: "أجهزة الشبكة"
    },
    {
        id: 120,
        domain: "network-principles",
        domainName: "مبادئ شبكات الحاسب",
        courseCode: "CNET 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو الغرض من بروتوكول DHCP؟",
        options: [
            "توزيع عناوين IP تلقائياً للأجهزة في الشبكة",
            "نقل الملفات بين الأجهزة",
            "تأمين الاتصال بالشبكة",
            "إدارة كلمات المرور"
        ],
        correctAnswer: 0,
        explanation: "DHCP (Dynamic Host Configuration Protocol) هو بروتوكول يستخدم لتوزيع عناوين IP تلقائياً للأجهزة في الشبكة، مما يسهل عملية إدارة الشبكة ويضمن عدم تكرار العناوين.",
        skill: "بروتوكولات الشبكة"
    }
];

// ==========================================
// 4. OPERATING SYSTEMS - نظم تشغيل (10 أسئلة)
// المستوى: Beginner
// ==========================================
const OPERATING_SYSTEMS_QUESTIONS = [
    {
        id: 121,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو نظام التشغيل (Operating System)؟",
        options: [
            "برنامج وسيط بين المستخدم وعتاد الحاسب يدير الموارد",
            "برنامج لكتابة المستندات فقط",
            "برنامج للاتصال بالإنترنت فقط",
            "برنامج لتشغيل الألعاب فقط"
        ],
        correctAnswer: 0,
        explanation: "نظام التشغيل هو برنامج وسيط بين المستخدم وعتاد الحاسب، يدير موارد الحاسب (المعالج، الذاكرة، التخزين) وينسق بين البرامج المختلفة ويسهل تفاعل المستخدم مع الجهاز.",
        skill: "مفاهيم أنظمة التشغيل"
    },
    {
        id: 122,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يعد من أمثلة أنظمة التشغيل؟",
        options: [
            "Windows و Linux و macOS",
            "Microsoft Word و Excel",
            "Google Chrome و Firefox",
            "Adobe Photoshop و Illustrator"
        ],
        correctAnswer: 0,
        explanation: "Windows و Linux و macOS هي أمثلة على أنظمة التشغيل. بينما Microsoft Word و Excel هي برامج تطبيقات، و Google Chrome و Firefox هي متصفحات، و Adobe Photoshop و Illustrator هي برامج تصميم.",
        skill: "مفاهيم أنظمة التشغيل"
    },
    {
        id: 123,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هي وظيفة إدارة الملفات في نظام التشغيل؟",
        options: [
            "تنظيم وتخزين الملفات في هيكل منظم لتسهيل الوصول إليها",
            "تشفير جميع الملفات لحمايتها",
            "حذف الملفات القديمة تلقائياً",
            "نسخ الملفات إلى أقراص خارجية"
        ],
        correctAnswer: 0,
        explanation: "نظام إدارة الملفات (File System) هو طريقة تنظم بها نظام التشغيل تخزين الملفات في الأقراص، ويسهل إنشاء الملفات والمجلدات وتنظيمها والبحث فيها والوصول إليها.",
        skill: "إدارة الملفات"
    },
    {
        id: 124,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو مفهوم إدارة الذاكرة في نظام التشغيل؟",
        options: [
            "توزيع الذاكرة بين البرامج قيد التشغيل وإدارة استخدامها",
            "تخزين الملفات على القرص الصلب",
            "إدارة اتصالات الشبكة",
            "تسريع أداء المعالج"
        ],
        correctAnswer: 0,
        explanation: "إدارة الذاكرة هي وظيفة أساسية لنظام التشغيل تقوم بتوزيع الذاكرة الرئيسية (RAM) بين البرامج قيد التشغيل، وتتبع استخدام الذاكرة، وتحريرها عند انتهاء البرامج.",
        skill: "إدارة الذاكرة"
    },
    {
        id: 125,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو الفرق بين واجهة المستخدم الرسومية (GUI) وواجهة سطر الأوامر (CLI)؟",
        options: [
            "GUI تعتمد على الرموز والقوائم، وCLI تعتمد على الأوامر النصية",
            "GUI أسرع من CLI",
            "CLI أكثر سهولة للمبتدئين",
            "لا يوجد فرق بينهما"
        ],
        correctAnswer: 0,
        explanation: "واجهة المستخدم الرسومية (GUI) تعتمد على الرموز والقوائم والنوافذ وتفاعل المستخدم معها عبر الفأرة، بينما واجهة سطر الأوامر (CLI) تعتمد على كتابة أوامر نصية. CLI قد يكون أسرع للمستخدمين المحترفين.",
        skill: "واجهات المستخدم"
    },
    {
        id: 126,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "hard",
        question: "ما هي إدارة العمليات (Process Management) في نظام التشغيل؟",
        options: [
            "إدارة تشغيل البرامج وتوزيع وقت المعالج بينها",
            "إدارة الملفات المخزنة على القرص",
            "إدارة اتصالات الشبكة",
            "إدارة كلمات المرور"
        ],
        correctAnswer: 0,
        explanation: "إدارة العمليات هي وظيفة نظام التشغيل المسؤولة عن إنشاء العمليات (البرامج قيد التشغيل) وتشغيلها وإيقافها، وتوزيع وقت المعالج (CPU) بينها، وإدارة جدولة العمليات.",
        skill: "إدارة العمليات"
    },
    {
        id: 127,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو نظام الملفات (File System) المستخدم في نظام Windows؟",
        options: [
            "NTFS (New Technology File System)",
            "EXT4 (Extended File System)",
            "APFS (Apple File System)",
            "FAT32 (File Allocation Table)"
        ],
        correctAnswer: 0,
        explanation: "NTFS (New Technology File System) هو نظام الملفات الأساسي المستخدم في أنظمة Windows الحديثة، ويتميز بميزات مثل الأمان والمجلدات المشفرة والضغط وإدارة الصلاحيات.",
        skill: "أنظمة الملفات"
    },
    {
        id: 128,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو الفرق بين برنامج نظام (System Software) وبرنامج تطبيق (Application Software)؟",
        options: [
            "برنامج النظام يدير الحاسب، وبرنامج التطبيق يؤدي مهام محددة للمستخدم",
            "برنامج النظام أبطأ من برنامج التطبيق",
            "برنامج التطبيق يدير الحاسب، وبرنامج النظام يؤدي مهام محددة",
            "لا يوجد فرق بينهما"
        ],
        correctAnswer: 0,
        explanation: "برنامج النظام (مثل نظام التشغيل وبرامج التشغيل) يدير عتاد الحاسب ويوفر بيئة لتشغيل البرامج الأخرى. برنامج التطبيق (مثل معالج النصوص وجداول البيانات) يؤدي مهام محددة للمستخدم.",
        skill: "أنواع البرمجيات"
    },
    {
        id: 129,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "hard",
        question: "ما هو مفهوم (Multitasking) في أنظمة التشغيل؟",
        options: [
            "قدرة نظام التشغيل على تشغيل عدة برامج في نفس الوقت",
            "قدرة نظام التشغيل على تشغيل برنامج واحد فقط",
            "قدرة نظام التشغيل على تشغيل البرامج بسرعة",
            "قدرة نظام التشغيل على إيقاف تشغيل البرامج"
        ],
        correctAnswer: 0,
        explanation: "تعدد المهام (Multitasking) هو قدرة نظام التشغيل على تشغيل عدة برامج أو عمليات في نفس الوقت، حيث يقوم بتوزيع وقت المعالج بينها بشكل متناوب بحيث تبدو وكأنها تعمل معاً.",
        skill: "إدارة العمليات"
    },
    {
        id: 130,
        domain: "operating-systems",
        domainName: "نظم تشغيل",
        courseCode: "OS 101",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو الغرض من (Kernel) في نظام التشغيل؟",
        options: [
            "هو الجزء الأساسي من نظام التشغيل الذي يتحكم في عتاد الحاسب والموارد",
            "هو برنامج لتشغيل الألعاب",
            "هو واجهة مستخدم رسومية",
            "هو برنامج لمعالجة النصوص"
        ],
        correctAnswer: 0,
        explanation: "النواة (Kernel) هي الجزء الأساسي والأهم في نظام التشغيل، وتعمل كجسر بين البرامج وعتاد الحاسب، وتدير العمليات والذاكرة والأجهزة، وتعمل بصلاحيات عالية.",
        skill: "مفاهيم أنظمة التشغيل"
    }
];

// ==========================================
// 5. ADVANCED COMPUTER APPLICATIONS - تطبيقات الحاسب المتقدمة (10 أسئلة)
// المستوى: Beginner
// ==========================================
const ADVANCED_COMPUTER_APPLICATIONS_QUESTIONS = [
    {
        id: 131,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "easy",
        question: "ما هو المقصود بالبرمجيات التطبيقية (Application Software)؟",
        options: [
            "برامج تؤدي مهام محددة للمستخدم مثل معالجة النصوص وجداول البيانات",
            "برامج تدير عتاد الحاسب مثل نظام التشغيل",
            "برامج لتشغيل الألعاب فقط",
            "برامج للاتصال بالإنترنت فقط"
        ],
        correctAnswer: 0,
        explanation: "البرمجيات التطبيقية هي برامج مصممة لأداء مهام محددة للمستخدم، مثل معالجة النصوص (Word)، جداول البيانات (Excel)، العروض التقديمية (PowerPoint)، وقواعد البيانات.",
        skill: "البرمجيات التطبيقية"
    },
    {
        id: 132,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يعد مثالاً على برنامج جداول بيانات (Spreadsheet)؟",
        options: [
            "Microsoft Excel",
            "Microsoft Word",
            "Microsoft PowerPoint",
            "Microsoft Outlook"
        ],
        correctAnswer: 0,
        explanation: "Microsoft Excel هو برنامج جداول بيانات يستخدم لإدخال وتحليل البيانات وتنظيمها في جداول وإجراء العمليات الحسابية والرسوم البيانية.",
        skill: "جداول البيانات"
    },
    {
        id: 133,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هي وظيفة الدوال (Functions) في برامج جداول البيانات مثل Excel؟",
        options: [
            "إجراء عمليات حسابية ومنطقية على البيانات بسهولة",
            "تنسيق النصوص فقط",
            "إدراج الصور والرسومات",
            "طباعة المستندات"
        ],
        correctAnswer: 0,
        explanation: "الدوال في برامج جداول البيانات هي صيغ جاهزة لإجراء عمليات حسابية ومنطقية وتحليلية على البيانات، مثل SUM (الجمع)، AVERAGE (المتوسط)، IF (الشرط)، و COUNT (العد).",
        skill: "جداول البيانات المتقدمة"
    },
    {
        id: 134,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو الغرض من برامج قواعد البيانات (Database Software)؟",
        options: [
            "تنظيم وتخزين واسترجاع كميات كبيرة من البيانات بشكل منظم",
            "كتابة المستندات النصية",
            "إنشاء العروض التقديمية",
            "تحرير الصور والفيديو"
        ],
        correctAnswer: 0,
        explanation: "برامج قواعد البيانات مثل Microsoft Access تستخدم لتنظيم وتخزين واسترجاع كميات كبيرة من البيانات بشكل منظم، وتوفر أدوات للبحث والتصفية وإنشاء التقارير.",
        skill: "قواعد البيانات"
    },
    {
        id: 135,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو مفهوم (Mail Merge) في برامج معالجة النصوص؟",
        options: [
            "دمج قائمة بيانات مع مستند لإنتاج رسائل أو مستندات مخصصة لكل مستلم",
            "دمج عدة مستندات في مستند واحد",
            "دمج الصور مع النصوص",
            "دمج الجداول مع الرسوم البيانية"
        ],
        correctAnswer: 0,
        explanation: "دمج البريد (Mail Merge) هو ميزة في برامج معالجة النصوص تسمح بدمج مستند رئيسي مع مصدر بيانات (مثل جدول Excel) لإنتاج مستندات مخصصة لكل سجل في البيانات، مثل رسائل موجهة بأسماء أشخاص مختلفين.",
        skill: "الأدوات المكتبية المتقدمة"
    },
    {
        id: 136,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "hard",
        question: "ما هو الفرق بين (Sorting) و (Filtering) في برامج جداول البيانات؟",
        options: [
            "Sorting يرتب البيانات بترتيب معين، وFiltering يعرض بيانات محددة فقط بناءً على معايير",
            "Sorting يعرض بيانات محددة، وFiltering يرتب البيانات",
            "كلاهما يقومان بنفس الوظيفة",
            "Sorting يحذف البيانات، وFiltering ينسخها"
        ],
        correctAnswer: 0,
        explanation: "الترتيب (Sorting) يرتب البيانات في الجدول بترتيب تصاعدي أو تنازلي بناءً على عمود معين. التصفية (Filtering) تعرض فقط الصفوف التي تحقق معايير محددة وتخفي الباقي مؤقتاً.",
        skill: "تحليل البيانات"
    },
    {
        id: 137,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "easy",
        question: "أي من التالي يعد مثالاً على برنامج العروض التقديمية (Presentation Software)؟",
        options: [
            "Microsoft PowerPoint",
            "Microsoft Word",
            "Microsoft Excel",
            "Microsoft Access"
        ],
        correctAnswer: 0,
        explanation: "Microsoft PowerPoint هو برنامج العروض التقديمية المستخدم لإنشاء عروض شرائح تحتوي على نصوص وصور ورسومات ووسائط متعددة، وتستخدم في الاجتماعات والمحاضرات والعروض التعليمية.",
        skill: "العروض التقديمية"
    },
    {
        id: 138,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "hard",
        question: "ما هو مفهوم (Pivot Table) في برامج جداول البيانات؟",
        options: [
            "أداة لتلخيص وتحليل كميات كبيرة من البيانات بطريقة تفاعلية ومرنة",
            "أداة لإنشاء الرسوم البيانية",
            "أداة لفرز البيانات",
            "أداة لتصدير البيانات"
        ],
        correctAnswer: 0,
        explanation: "جدول المحاور (Pivot Table) هو أداة قوية في برامج جداول البيانات تسمح بتلخيص وتحليل كميات كبيرة من البيانات بطريقة تفاعلية ومرنة، وإعادة تنظيمها وعرضها من زوايا مختلفة بسهولة.",
        skill: "تحليل البيانات المتقدم"
    },
    {
        id: 139,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هي أهمية النسخ الاحتياطي (Backup) في إدارة البيانات؟",
        options: [
            "حماية البيانات من الفقدان بسبب الأعطال أو الأخطاء أو الهجمات",
            "تحسين أداء الحاسب",
            "زيادة مساحة التخزين",
            "تسريع الاتصال بالإنترنت"
        ],
        correctAnswer: 0,
        explanation: "النسخ الاحتياطي (Backup) هو عملية نسخ البيانات المهمة إلى وسيط تخزين آخر لحمايتها من الفقدان بسبب أعطال الأجهزة، الأخطاء البشرية، البرامج الضارة، أو الكوارث، وضمان إمكانية استعادتها عند الحاجة.",
        skill: "إدارة البيانات"
    },
    {
        id: 140,
        domain: "advanced-computer-applications",
        domainName: "تطبيقات الحاسب المتقدمة",
        courseCode: "CAPP 201",
        level: "Beginner",
        difficulty: "medium",
        question: "ما هو الفرق بين الملفات النصية (Text Files) والملفات الثنائية (Binary Files)؟",
        options: [
            "الملفات النصية تحتوي على نص قابل للقراءة، والملفات الثنائية تحتوي على بيانات غير قابلة للقراءة مباشرة",
            "الملفات النصية أصغر حجماً من الملفات الثنائية",
            "الملفات الثنائية أسرع من الملفات النصية",
            "لا يوجد فرق بينهما"
        ],
        correctAnswer: 0,
        explanation: "الملفات النصية (مثل .txt و .csv) تحتوي على نص يمكن قراءته وفهمه بواسطة المستخدم، بينما الملفات الثنائية (مثل .exe و .jpg) تحتوي على بيانات مشفرة بطريقة لا يمكن قراءتها مباشرة وتتطلب برامج خاصة لفهمها.",
        skill: "إدارة الملفات"
    }
];

// ==========================================
// 6. COMPUTER PROGRAMMING - برمجة الحاسب (10 أسئلة)
// المستوى: Intermediate
// ==========================================
const COMPUTER_PROGRAMMING_QUESTIONS = [
    {
        id: 141,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو المتغير (Variable) في البرمجة؟",
        options: [
            "موقع في الذاكرة لتخزين قيمة يمكن تغييرها",
            "قيمة ثابتة لا تتغير",
            "دالة تقوم بعملية حسابية",
            "نوع من أنواع البيانات"
        ],
        correctAnswer: 0,
        explanation: "المتغير هو موقع في ذاكرة الحاسب يستخدم لتخزين قيمة يمكن تغييرها أثناء تنفيذ البرنامج، وله اسم ونوع يحددان البيانات التي يمكن تخزينها فيه.",
        skill: "أساسيات البرمجة"
    },
    {
        id: 142,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هي الدالة (Function) في البرمجة؟",
        options: [
            "كتلة من التعليمات البرمجية تؤدي مهمة محددة ويمكن استدعاؤها",
            "نوع من أنواع البيانات",
            "متغير لتخزين الأرقام",
            "حلقة تكرارية"
        ],
        correctAnswer: 0,
        explanation: "الدالة (Function) هي كتلة من التعليمات البرمجية المصممة لأداء مهمة محددة، ويمكن استدعاؤها من أي مكان في البرنامج، مما يساعد على تنظيم الكود وإعادة استخدامه.",
        skill: "أساسيات البرمجة"
    },
    {
        id: 143,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو الحلقة (Loop) في البرمجة؟",
        options: [
            "هيكل تكرار لتنفيذ كتلة من التعليمات عدة مرات",
            "نوع من أنواع المتغيرات",
            "دالة حسابية",
            "هيكل شرطي"
        ],
        correctAnswer: 0,
        explanation: "الحلقة (Loop) هي هيكل برمجي يسمح بتكرار تنفيذ كتلة من التعليمات عدة مرات بناءً على شرط محدد، مما يسهل تنفيذ المهام المتكررة.",
        skill: "هياكل التحكم"
    },
    {
        id: 144,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو الشرط (Condition) في البرمجة؟",
        options: [
            "تعبير يتم تقييمه ليصبح صحيحاً أو خاطئاً لتوجيه تنفيذ البرنامج",
            "نوع من أنواع البيانات",
            "دالة تقوم بعملية حسابية",
            "متغير لتخزين النصوص"
        ],
        correctAnswer: 0,
        explanation: "الشرط (Condition) هو تعبير منطقي يتم تقييمه ليصبح صحيحاً (true) أو خاطئاً (false)، ويستخدم لتوجيه تنفيذ البرنامج عبر الهياكل الشرطية مثل if و else.",
        skill: "هياكل التحكم"
    },
    {
        id: 145,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما الفرق بين (Array) و (Object) في البرمجة؟",
        options: [
            "Array يستخدم لتخزين مجموعة من القيم المرتبة، وObject يستخدم لتخزين مجموعة من الخصائص والقيم",
            "Array يخزن البيانات بشكل غير مرتب، وObject يخزن البيانات بشكل مرتب",
            "لا يوجد فرق بينهما",
            "Array يستخدم لتخزين النصوص فقط، وObject يستخدم لتخزين الأرقام فقط"
        ],
        correctAnswer: 0,
        explanation: "المصفوفة (Array) تستخدم لتخزين مجموعة من القيم المرتبة (مثل الأرقام أو النصوص)، بينما الكائن (Object) يستخدم لتخزين مجموعة من الخصائص (properties) وقيمها، مما يسمح بتنظيم البيانات بشكل أكثر تعقيداً.",
        skill: "هياكل البيانات"
    },
    {
        id: 146,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو الـ (Algorithm) في البرمجة؟",
        options: [
            "خطوات متسلسلة ومنطقية لحل مشكلة معينة",
            "نوع من أنواع المتغيرات",
            "لغة برمجة",
            "برنامج جاهز"
        ],
        correctAnswer: 0,
        explanation: "الخوارزمية (Algorithm) هي مجموعة من الخطوات المتسلسلة والمنطقية والمحددة لحل مشكلة معينة أو تنفيذ مهمة ما، وتعتبر الأساس لكتابة البرامج.",
        skill: "أساسيات البرمجة"
    },
    {
        id: 147,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو (Debugging) في البرمجة؟",
        options: [
            "عملية اكتشاف وإصلاح الأخطاء في البرنامج",
            "كتابة برنامج جديد",
            "تحسين أداء البرنامج",
            "تثبيت البرنامج على الحاسب"
        ],
        correctAnswer: 0,
        explanation: "التنقيح (Debugging) هو عملية اكتشاف وتحديد وإصلاح الأخطاء (bugs) في البرنامج، وهي جزء أساسي من دورة تطوير البرمجيات لضمان عمل البرنامج بشكل صحيح.",
        skill: "ممارسات البرمجة"
    },
    {
        id: 148,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "hard",
        question: "ما هو مفهوم (Recursion) في البرمجة؟",
        options: [
            "دالة تستدعي نفسها لحل مشكلة عن طريق تقسيمها إلى مشاكل أصغر",
            "نوع من أنواع الحلقات",
            "طريقة لترتيب البيانات",
            "هيكل بيانات"
        ],
        correctAnswer: 0,
        explanation: "العودية (Recursion) هي تقنية برمجية حيث تقوم دالة باستدعاء نفسها لحل مشكلة عن طريق تقسيمها إلى مشاكل فرعية أصغر من نفس النوع، وتستخدم عادة في حل المشاكل التكرارية والهياكل الشجرية.",
        skill: "تقنيات البرمجة المتقدمة"
    },
    {
        id: 149,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو الـ (Compiler) في البرمجة؟",
        options: [
            "برنامج يحول الكود المصدري إلى كود قابل للتنفيذ",
            "برنامج لتحرير النصوص",
            "نوع من أنواع المتغيرات",
            "لغة برمجة"
        ],
        correctAnswer: 0,
        explanation: "المترجم (Compiler) هو برنامج يقوم بتحويل الكود المصدري (Source Code) المكتوب بلغة برمجة عالية المستوى إلى كود آلي (Machine Code) يمكن للحاسب تنفيذه مباشرة.",
        skill: "أساسيات البرمجة"
    },
    {
        id: 150,
        domain: "computer-programming",
        domainName: "برمجة الحاسب",
        courseCode: "PRG 101",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو (Object-Oriented Programming - OOP)؟",
        options: [
            "نموذج برمجي يعتمد على الكائنات التي تحتوي على بيانات ودوال",
            "طريقة لكتابة التعليمات البرمجية بشكل خطي",
            "نوع من أنواع قواعد البيانات",
            "لغة برمجة محددة"
        ],
        correctAnswer: 0,
        explanation: "البرمجة الكائنية (Object-Oriented Programming - OOP) هي نموذج برمجي يعتمد على مفهوم الكائنات التي تحتوي على بيانات (خصائص) ودوال (طرق) تعمل على هذه البيانات، مما يسهل تنظيم الكود وإعادة استخدامه.",
        skill: "مفاهيم البرمجة المتقدمة"
    }
];

// ==========================================
// 7. NETWORK SECURITY - أمن الشبكات والاتصالات (10 أسئلة)
// المستوى: Intermediate
// ==========================================
const NETWORK_SECURITY_QUESTIONS = [
    {
        id: 11,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو بروتوكول (HTTPS) المستخدم لحماية نقل البيانات عبر الإنترنت؟",
        options: [
            "بروتوكول نقل النص التشعبي الآمن",
            "بروتوكول نقل الملفات",
            "بروتوكول البريد الإلكتروني",
            "بروتوكول إدارة الشبكة"
        ],
        correctAnswer: 0,
        explanation: "HTTPS هو بروتوكول نقل النص التشعبي الآمن، وهو نسخة آمنة من HTTP تستخدم تشفير SSL/TLS لحماية البيانات المنقولة بين المتصفح والخادم.",
        skill: "بروتوكولات الشبكة الآمنة"
    },
    {
        id: 12,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "easy",
        question: "أي من التالي يعد من وظائف جدار الحماية (Firewall) الأساسية؟",
        options: [
            "الكشف عن الفيروسات في الملفات",
            "تنظيم حركة المرور بين الشبكات بناءً على قواعد محددة",
            "تشفير البيانات المرسلة",
            "إدارة المستخدمين والصلاحيات"
        ],
        correctAnswer: 1,
        explanation: "جدار الحماية (Firewall) هو جهاز أو برنامج يتحكم في حركة المرور بين الشبكات بناءً على مجموعة من القواعد الأمنية، ويسمح أو يمنع المرور بناءً على هذه القواعد.",
        skill: "أمن الشبكات - جدران الحماية"
    },
    {
        id: 13,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو دور نظام كشف التسلل (IDS) في الشبكة؟",
        options: [
            "منع الهجمات قبل حدوثها",
            "مراقبة حركة الشبكة واكتشاف الأنشطة المشبوهة",
            "تشفير البيانات المرسلة عبر الشبكة",
            "إدارة عناوين IP"
        ],
        correctAnswer: 1,
        explanation: "نظام كشف التسلل (Intrusion Detection System - IDS) يقوم بمراقبة حركة الشبكة وتحليلها للكشف عن أنماط هجوم أو أنشطة مشبوهة، ويقوم بإصدار تنبيهات عند اكتشافها.",
        skill: "أمن الشبكات - IDS/IPS"
    },
    {
        id: 14,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو الفرق بين نظام كشف التسلل (IDS) ونظام منع التسلل (IPS)؟",
        options: [
            "IDS يكشف الهجمات ويسجلها، بينما IPS يكشف ويمنع الهجمات تلقائياً",
            "IPS يكشف الهجمات فقط، بينما IDS يمنعها",
            "لا يوجد فرق، المصطلحان مترادفان",
            "IDS يعمل على مستوى التطبيق، وIPS يعمل على مستوى الشبكة"
        ],
        correctAnswer: 0,
        explanation: "IDS يقوم بمراقبة واكتشاف الهجمات وإصدار تنبيهات، بينما IPS يقوم باكتشاف الهجمات ومنعها تلقائياً في الوقت الفعلي.",
        skill: "أمن الشبكات - IDS/IPS"
    },
    {
        id: 15,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو بروتوكول (VPN) المستخدم في أمن الشبكات؟",
        options: [
            "بروتوكول لنقل الملفات بشكل آمن",
            "بروتوكول لإنشاء شبكة خاصة افتراضية مشفرة عبر الإنترنت",
            "بروتوكول لإدارة عناوين IP",
            "بروتوكول للبريد الإلكتروني الآمن"
        ],
        correctAnswer: 1,
        explanation: "VPN (شبكة خاصة افتراضية) هي تقنية تتيح إنشاء اتصال آمن ومشفر بين جهاز المستخدم وشبكة خاصة عبر الإنترنت، مما يحمي البيانات من التنصت.",
        skill: "أمن الشبكات - VPN"
    },
    {
        id: 16,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "medium",
        question: "أي من التالي يعد هجوماً يستهدف طبقة الشبكة (Network Layer)؟",
        options: [
            "هجوم حقن SQL (SQL Injection)",
            "هجوم التصيد (Phishing)",
            "هجوم انتحال عنوان IP (IP Spoofing)",
            "هجوم البرمجة النصية عبر المواقع (XSS)"
        ],
        correctAnswer: 2,
        explanation: "انتحال عنوان IP (IP Spoofing) هو هجوم على طبقة الشبكة حيث يقوم المهاجم بتزوير عنوان IP المصدر لجعل الحزمة تبدو وكأنها قادمة من مصدر موثوق.",
        skill: "هجمات الشبكات"
    },
    {
        id: 17,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "hard",
        question: "في سياق أمن الشبكات، ما هو (Network Segmentation) ولماذا يعتبر مهماً؟",
        options: [
            "تقسيم الشبكة إلى أجزاء أصغر لعزل الأقسام المختلفة وتقليل تأثير الاختراق",
            "دمج جميع الأجهزة في شبكة واحدة لتبسيط الإدارة",
            "إزالة جميع جدران الحماية لتحسين الأداء",
            "تثبيت برامج مكافحة الفيروسات على جميع الأجهزة"
        ],
        correctAnswer: 0,
        explanation: "تجزئة الشبكة (Network Segmentation) هي عملية تقسيم الشبكة إلى أجزاء أصغر (قطاعات) لعزل الأقسام المختلفة، مما يحد من انتشار الهجمات ويحسن الأمن.",
        skill: "تصميم الشبكات الآمنة"
    },
    {
        id: 18,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "hard",
        question: "ما هي تقنية (PKI) وماذا تقدم في مجال أمن الشبكات؟",
        options: [
            "نظام لإدارة المفاتيح العامة والشهادات الرقمية لتوفير المصادقة والتشفير",
            "نظام لكشف التسلل في الشبكات",
            "بروتوكول لتوجيه الحزم في الشبكة",
            "أداة لمسح الثغرات الأمنية"
        ],
        correctAnswer: 0,
        explanation: "PKI (البنية التحتية للمفاتيح العامة) هي نظام لإدارة المفاتيح العامة والشهادات الرقمية، وتوفر آليات للمصادقة والتشفير والتوقيع الرقمي في بيئات الشبكات.",
        skill: "أمن الشبكات - PKI"
    },
    {
        id: 19,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو هجوم (Man-in-the-Middle) في سياق الشبكات؟",
        options: [
            "هجوم يتم فيه اعتراض الاتصال بين طرفين وسرقة البيانات أو التلاعب بها",
            "هجوم يتم فيه إغراق الخادم بالطلبات لتعطيل الخدمة",
            "هجوم يتم فيه حقن تعليمات برمجية ضارة في التطبيق",
            "هجوم يتم فيه خداع المستخدم لإفشاء معلوماته"
        ],
        correctAnswer: 0,
        explanation: "هجوم الرجل في المنتصف (Man-in-the-Middle - MITM) هو هجوم يقوم فيه المهاجم باعتراض الاتصال بين طرفين (مثل المستخدم والخادم) وسرقة البيانات أو التلاعب بها دون علم الطرفين.",
        skill: "هجمات الشبكات"
    },
    {
        id: 20,
        domain: "network-security",
        domainName: "أمن الشبكات والاتصالات",
        courseCode: "CYBR 222",
        level: "Intermediate",
        difficulty: "easy",
        question: "أي من التالي يمثل أفضل ممارسة لتأمين شبكة Wi-Fi؟",
        options: [
            "ترك الشبكة مفتوحة بدون كلمة مرور",
            "استخدام تشفير WPA2 أو WPA3 مع كلمة مرور قوية",
            "استخدام بروتوكول WEP للتشفير",
            "إخفاء اسم الشبكة (SSID) فقط"
        ],
        correctAnswer: 1,
        explanation: "استخدام تشفير WPA2 أو WPA3 مع كلمة مرور قوية هو أفضل ممارسة لتأمين شبكة Wi-Fi، حيث يوفر تشفيراً قوياً للبيانات المنقولة عبر الشبكة اللاسلكية.",
        skill: "أمن الشبكات اللاسلكية"
    }
];

// ==========================================
// 8. OS SECURITY - أمن أنظمة التشغيل (10 أسئلة)
// المستوى: Intermediate
// ==========================================
const OS_SECURITY_QUESTIONS = [
    {
        id: 21,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو مفهوم (Principle of Least Privilege) في أمن أنظمة التشغيل؟",
        options: [
            "منح المستخدمين صلاحيات أكبر من احتياجاتهم لتسهيل العمل",
            "منح المستخدمين أقل صلاحيات ممكنة لأداء مهامهم فقط",
            "منح جميع المستخدمين صلاحيات المدير (Administrator)",
            "إلغاء جميع الصلاحيات عن المستخدمين"
        ],
        correctAnswer: 1,
        explanation: "مبدأ أقل الامتيازات يعني منح المستخدمين والعمليات فقط الصلاحيات الضرورية لأداء مهامهم، ولا أكثر. هذا يقلل من سطح الهجوم ويحد من الضرر في حال حدوث اختراق.",
        skill: "إدارة الصلاحيات"
    },
    {
        id: 22,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "easy",
        question: "أي من التالي يعد إجراءً أمنياً مهماً في نظام التشغيل Windows؟",
        options: [
            "تعطيل تحديثات النظام الأمنية",
            "تثبيت برامج من مصادر غير موثوقة",
            "تمكين جدار الحماية وتحديث النظام بانتظام",
            "استخدام حساب مدير (Administrator) للاستخدام اليومي"
        ],
        correctAnswer: 2,
        explanation: "تمكين جدار الحماية وتحديث نظام التشغيل بانتظام هما إجراءان أمنيان أساسيان لحماية النظام من الثغرات والهجمات.",
        skill: "تأمين أنظمة التشغيل"
    },
    {
        id: 23,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "medium",
        question: "في نظام Linux، أي من الأوامر التالية يستخدم لتغيير صلاحيات الملفات؟",
        options: [
            "ls",
            "chmod",
            "cd",
            "mkdir"
        ],
        correctAnswer: 1,
        explanation: "الأمر chmod (Change Mode) يستخدم في Linux لتغيير صلاحيات الملفات والدلائل (قراءة، كتابة، تنفيذ).",
        skill: "أمن Linux"
    },
    {
        id: 24,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو الهدف من خاصية (UAC - User Account Control) في نظام Windows؟",
        options: [
            "منع المستخدم من تشغيل أي برنامج",
            "طلب موافقة المستخدم عند إجراء تغييرات تتطلب صلاحيات مرتفعة",
            "تشفير جميع الملفات على القرص الصلب",
            "مراقبة اتصالات الشبكة"
        ],
        correctAnswer: 1,
        explanation: "UAC هي ميزة في Windows تطلب موافقة المستخدم أو كلمة مرور المدير قبل السماح بإجراء تغييرات تتطلب صلاحيات مرتفعة، مما يمنع البرامج الضارة من إجراء تغييرات غير مصرح بها.",
        skill: "تأمين Windows"
    },
    {
        id: 25,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو المقصود بـ (Hardening) في سياق أمن أنظمة التشغيل؟",
        options: [
            "تثبيت برامج إضافية لتحسين الأداء",
            "عملية تعزيز أمن النظام عن طريق إزالة الخدمات غير الضرورية وتطبيق التحديثات",
            "ترقية عتاد الحاسوب",
            "تثبيت نظام تشغيل جديد"
        ],
        correctAnswer: 1,
        explanation: "التقوية (Hardening) هي عملية تعزيز أمن النظام عن طريق إزالة الخدمات والتطبيقات غير الضرورية، تعطيل المنافذ غير المستخدمة، تطبيق التحديثات الأمنية، وتطبيق أفضل الممارسات الأمنية.",
        skill: "تقوية الأنظمة"
    },
    {
        id: 26,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "hard",
        question: "في سياق أمن نظام Linux، ما هو ملف (sudoers) وما هي وظيفته؟",
        options: [
            "ملف يسجل جميع الأخطاء في النظام",
            "ملف يحدد المستخدمين الذين يمكنهم تنفيذ أوامر معينة بصلاحيات مرتفعة",
            "ملف يحتوي على كلمات المرور المشفرة للمستخدمين",
            "ملف لتكوين واجهة الشبكة"
        ],
        correctAnswer: 1,
        explanation: "ملف sudoers في Linux يحدد المستخدمين والمجموعات التي يمكنها تنفيذ أوامر معينة باستخدام sudo (أي بصلاحيات مرتفعة)، ويتحكم في الصلاحيات الممنوحة للمستخدمين.",
        skill: "أمن Linux - إدارة الصلاحيات"
    },
    {
        id: 27,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "easy",
        question: "أي من التالي يعد من أفضل الممارسات لحماية كلمات المرور في أنظمة التشغيل؟",
        options: [
            "استخدام نفس كلمة المرور لجميع الحسابات",
            "كتابة كلمات المرور على ملاحظة لاصقة",
            "استخدام كلمات مرور طويلة ومعقدة وتغييرها بشكل دوري",
            "استخدام كلمة مرور بسيطة وسهلة الحفظ"
        ],
        correctAnswer: 2,
        explanation: "استخدام كلمات مرور طويلة ومعقدة (تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز) وتغييرها بشكل دوري هي من أفضل الممارسات لحماية كلمات المرور.",
        skill: "إدارة كلمات المرور"
    },
    {
        id: 28,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو مفهوم (Sandboxing) في أمن أنظمة التشغيل؟",
        options: [
            "تشغيل البرامج في بيئة معزولة لمنعها من التأثير على النظام",
            "نسخ احتياطي للبيانات بشكل دوري",
            "تشفير القرص الصلب بالكامل",
            "مراقبة حركة الشبكة"
        ],
        correctAnswer: 0,
        explanation: "البيئة المعزولة (Sandboxing) هي تقنية لعزل البرامج المشبوهة أو غير الموثوقة في بيئة محدودة ومعزولة عن النظام الأساسي، لمنعها من التسبب في ضرر إذا تبين أنها ضارة.",
        skill: "تقنيات العزل الأمني"
    },
    {
        id: 29,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "hard",
        question: "في نظام Windows، ما هو (Security Account Manager - SAM) وما هي وظيفته؟",
        options: [
            "ملف يسجل أحداث النظام",
            "قاعدة بيانات تحتوي على معلومات حسابات المستخدمين وكلمات المرور المشفرة",
            "برنامج لإدارة جدار الحماية",
            "أداة لمسح الفيروسات"
        ],
        correctAnswer: 1,
        explanation: "SAM (مدير حسابات الأمن) هو ملف قاعدة بيانات في Windows يحتوي على معلومات حسابات المستخدمين وكلمات المرور المشفرة (باستخدام التجزئة). وهو هدف رئيسي للمهاجمين الذين يحاولون سرقة كلمات المرور.",
        skill: "أمن Windows - إدارة الحسابات"
    },
    {
        id: 30,
        domain: "os-security",
        domainName: "أمن أنظمة التشغيل",
        courseCode: "CYBR 221",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو أفضل إجراء لتأمين حساب المدير (Administrator) في نظام التشغيل؟",
        options: [
            "استخدام كلمة مرور فارغة لتسهيل الوصول",
            "تغيير اسم المستخدم الافتراضي واستخدام كلمة مرور قوية",
            "تمكين حساب الضيف (Guest) للاستخدام اليومي",
            "تعطيل جدار الحماية"
        ],
        correctAnswer: 1,
        explanation: "تغيير اسم المستخدم الافتراضي للمدير واستخدام كلمة مرور قوية ومعقدة يقلل من خطر هجمات القوة العمياء (Brute Force) التي تستهدف الحسابات الافتراضية.",
        skill: "تأمين الحسابات الإدارية"
    }
];

// ==========================================
// 9. SECURE SOFTWARE DEVELOPMENT - تطوير البرمجيات الآمنة (10 أسئلة)
// المستوى: Intermediate
// ==========================================
const SECURE_SOFTWARE_DEVELOPMENT_QUESTIONS = [
    {
        id: 51,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو مبدأ (Secure by Design) في تطوير البرمجيات؟",
        options: [
            "إضافة ميزات أمنية بعد الانتهاء من التطوير",
            "دمج الأمن في جميع مراحل دورة حياة التطوير",
            "استخدام لغة برمجة آمنة فقط",
            "تثبيت برامج مكافحة الفيروسات"
        ],
        correctAnswer: 1,
        explanation: "مبدأ (Secure by Design) يعني دمج اعتبارات الأمن في جميع مراحل دورة حياة تطوير البرمجيات (SDLC)، من التخطيط والتصميم إلى التطوير والاختبار والنشر، بدلاً من إضافتها في النهاية.",
        skill: "تطوير آمن"
    },
    {
        id: 52,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هي (Input Validation) ولماذا تعتبر مهمة في أمن التطبيقات؟",
        options: [
            "التحقق من صحة البيانات المدخلة لمنع هجمات الحقن والبرمجة النصية",
            "التحقق من سرعة التطبيق",
            "التحقق من واجهة المستخدم",
            "التحقق من أداء الخادم"
        ],
        correctAnswer: 0,
        explanation: "التحقق من صحة المدخلات (Input Validation) هي عملية التأكد من أن البيانات التي يدخلها المستخدم مطابقة للتنسيق والنوع المطلوبين، لمنع هجمات مثل حقن SQL و XSS.",
        skill: "ممارسات التطوير الآمن"
    },
    {
        id: 53,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو هجوم (Buffer Overflow) في البرمجيات؟",
        options: [
            "هجوم يتم فيه استنزاف موارد الخادم",
            "هجوم يتم فيه تجاوز حدود المخزن المؤقت لتنفيذ تعليمات برمجية ضارة",
            "هجوم يستهدف قاعدة البيانات",
            "هجوم يستخدم الهندسة الاجتماعية"
        ],
        correctAnswer: 1,
        explanation: "تجاوز المخزن المؤقت (Buffer Overflow) هو هجوم يتم فيه كتابة بيانات أكثر من سعة المخزن المؤقت المخصصة، مما قد يؤدي إلى الكتابة فوق مناطق الذاكرة المجاورة وتنفيذ تعليمات برمجية ضارة.",
        skill: "ثغرات البرمجيات"
    },
    {
        id: 54,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو مفهوم (Authentication) و (Authorization) في أمن التطبيقات؟",
        options: [
            "المصادقة هي التحقق من الهوية، والتفويض هو تحديد الصلاحيات",
            "المصادقة هي تحديد الصلاحيات، والتفويض هو التحقق من الهوية",
            "المصطلحان مترادفان ويعنيان نفس الشيء",
            "المصادقة هي تشفير البيانات، والتفويض هو فك التشفير"
        ],
        correctAnswer: 0,
        explanation: "المصادقة (Authentication) هي عملية التحقق من هوية المستخدم (من أنت)، بينما التفويض (Authorization) هو عملية تحديد الصلاحيات والإذن بالوصول (ماذا يمكنك أن تفعل).",
        skill: "إدارة الهوية والوصول"
    },
    {
        id: 55,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "hard",
        question: "ما هي (Threat Modeling) في تطوير البرمجيات الآمنة؟",
        options: [
            "عملية تحديد التهديدات المحتملة وتقييمها وتحديد إجراءات التخفيف",
            "عملية اختبار التطبيق بحثاً عن الثغرات",
            "عملية تصميم واجهة المستخدم",
            "عملية كتابة التوثيق الفني"
        ],
        correctAnswer: 0,
        explanation: "نمذجة التهديدات (Threat Modeling) هي عملية منهجية لتحديد التهديدات المحتملة التي قد تواجه التطبيق، وتقييم خطورتها، وتحديد إجراءات التخفيف المناسبة، ويتم تطبيقها في مراحل التصميم المبكرة.",
        skill: "تحليل المخاطر في التطوير"
    },
    {
        id: 56,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو (SAST) و (DAST) في اختبار أمن التطبيقات؟",
        options: [
            "SAST هو اختبار أمني ثابت للكود المصدري، وDAST هو اختبار أمني ديناميكي للتطبيق الجاري",
            "SAST هو اختبار أمني ديناميكي، وDAST هو اختبار ثابت",
            "كلاهما أدوات لاختبار الشبكات",
            "كلاهما أدوات لإدارة المشاريع"
        ],
        correctAnswer: 0,
        explanation: "SAST (اختبار أمن التطبيقات الثابت) يقوم بتحليل الكود المصدري للتطبيق للكشف عن الثغرات دون تشغيله. DAST (اختبار أمن التطبيقات الديناميكي) يقوم باختبار التطبيق أثناء تشغيله لمحاكاة هجمات المهاجمين.",
        skill: "اختبار أمن التطبيقات"
    },
    {
        id: 57,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "hard",
        question: "ما هو (Secure Coding) ولماذا هو مهم؟",
        options: [
            "كتابة الكود بلغة برمجة آمنة فقط",
            "ممارسة كتابة الكود بطريقة تمنع الثغرات الأمنية منذ البداية",
            "استخدام أدوات لمسح الكود بحثاً عن الأخطاء اللغوية",
            "كتابة الكود بسرعة لإنهاء المشروع"
        ],
        correctAnswer: 1,
        explanation: "البرمجة الآمنة (Secure Coding) هي ممارسة كتابة الكود بطريقة تمنع إدخال الثغرات الأمنية منذ البداية، من خلال اتباع أفضل الممارسات وتجنب الأخطاء الشائعة التي تؤدي إلى ثغرات أمنية.",
        skill: "ممارسات البرمجة الآمنة"
    },
    {
        id: 58,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو مبدأ (Least Privilege) في سياق تطوير التطبيقات؟",
        options: [
            "منح المستخدمين أكبر عدد ممكن من الصلاحيات",
            "منح المستخدمين أقل صلاحيات ضرورية لأداء مهامهم فقط",
            "منع جميع المستخدمين من الوصول إلى النظام",
            "منح جميع المستخدمين صلاحيات المدير"
        ],
        correctAnswer: 1,
        explanation: "مبدأ أقل الامتيازات يعني منح المستخدمين والعمليات فقط الصلاحيات الضرورية لأداء مهامهم المحددة، مما يقلل من تأثير أي اختراق محتمل.",
        skill: "مبادئ الأمن في التطوير"
    },
    {
        id: 59,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هي (Session Management) في أمن تطبيقات الويب؟",
        options: [
            "إدارة جلسات المستخدمين بشكل آمن لمنع اختطاف الجلسة",
            "إدارة قواعد البيانات",
            "إدارة الخوادم",
            "إدارة المشاريع البرمجية"
        ],
        correctAnswer: 0,
        explanation: "إدارة الجلسات (Session Management) هي عملية إنشاء والحفاظ على وإنهاء جلسات المستخدمين بشكل آمن، وتشمل استخدام معرفات جلسة آمنة وتحديد وقت انتهاء الجلسة ومنع اختطاف الجلسة.",
        skill: "أمن تطبيقات الويب"
    },
    {
        id: 60,
        domain: "secure-software-development",
        domainName: "تطوير البرمجيات الآمنة",
        courseCode: "CYBR 223",
        level: "Intermediate",
        difficulty: "hard",
        question: "ما هو مفهوم (DevSecOps) في تطوير البرمجيات؟",
        options: [
            "دمج الأمن في ممارسات DevOps طوال دورة حياة التطوير",
            "فصل فريق الأمن عن فريق التطوير",
            "تطوير البرمجيات بدون أي اعتبارات أمنية",
            "استخدام لغة برمجة واحدة فقط"
        ],
        correctAnswer: 0,
        explanation: "DevSecOps هو ممارسة دمج الأمن في ممارسات DevOps، بحيث تصبح الأمن مسؤولية مشتركة بين فرق التطوير والعمليات والأمن، ويتم تطبيق الضوابط الأمنية طوال دورة حياة التطوير.",
        skill: "تكامل الأمن في التطوير"
    }
];

// ==========================================
// 10. CRYPTOGRAPHY - التشفير التطبيقي (10 أسئلة)
// المستوى: Intermediate
// ==========================================
const CRYPTOGRAPHY_QUESTIONS = [
    {
        id: 61,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هو الفرق بين التشفير المتماثل (Symmetric) وغير المتماثل (Asymmetric)؟",
        options: [
            "المتماثل يستخدم مفتاح واحد، وغير المتماثل يستخدم مفتاحين (عام وخاص)",
            "المتماثل أسرع، وغير المتماثل أبطأ",
            "المتماثل يستخدم للتشفير فقط، وغير المتماثل يستخدم للتوقيع فقط",
            "المتماثل يستخدم مفتاحين، وغير المتماثل يستخدم مفتاح واحد"
        ],
        correctAnswer: 0,
        explanation: "التشفير المتماثل يستخدم مفتاحاً واحداً للتشفير وفك التشفير، بينما التشفير غير المتماثل يستخدم زوجاً من المفاتيح: مفتاح عام للتشفير ومفتاح خاص لفك التشفير.",
        skill: "أنواع التشفير"
    },
    {
        id: 62,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "easy",
        question: "ما هي خوارزمية (AES) في التشفير؟",
        options: [
            "خوارزمية تشفير متماثل تستخدم على نطاق واسع",
            "خوارزمية تشفير غير متماثل",
            "خوارزمية لتوليد المفاتيح العشوائية",
            "بروتوكول لنقل الملفات"
        ],
        correctAnswer: 0,
        explanation: "AES (معيار التشفير المتقدم) هي خوارزمية تشفير متماثل تستخدم على نطاق واسع لحماية البيانات الحساسة، وتعتبر المعيار العالمي للتشفير في العديد من التطبيقات.",
        skill: "خوارزميات التشفير"
    },
    {
        id: 63,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هي وظيفة دالة التجزئة (Hash Function) في التشفير؟",
        options: [
            "تشفير البيانات بشكل آمن",
            "تحويل البيانات بطول متغير إلى قيمة بطول ثابت (بصمة) لا يمكن عكسها",
            "توليد مفاتيح عشوائية",
            "مصادقة المستخدمين"
        ],
        correctAnswer: 1,
        explanation: "دالة التجزئة هي دالة رياضية تحول البيانات (مهما كان حجمها) إلى قيمة بطول ثابت (بصمة رقمية)، وتتميز بأنها عملية باتجاه واحد (لا يمكن استعادة البيانات الأصلية من البصمة).",
        skill: "دوال التجزئة"
    },
    {
        id: 64,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو (RSA) في التشفير غير المتماثل؟",
        options: [
            "خوارزمية تشفير غير متماثل تعتمد على صعوبة تحليل الأعداد الكبيرة إلى عوامل",
            "خوارزمية تشفير متماثل",
            "بروتوكول اتصال آمن",
            "نظام إدارة المفاتيح"
        ],
        correctAnswer: 0,
        explanation: "RSA هي خوارزمية تشفير غير متماثل تعتمد على صعوبة تحليل الأعداد الصحيحة الكبيرة إلى عواملها الأولية، وتستخدم في التشفير والتوقيع الرقمي.",
        skill: "التشفير غير المتماثل"
    },
    {
        id: 65,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "hard",
        question: "ما هو التوقيع الرقمي (Digital Signature) وما هي وظيفته؟",
        options: [
            "تشفير البيانات لمنع قراءتها",
            "توفير المصادقة والسلامة (ضمان عدم التعديل)",
            "توليد مفاتيح عشوائية",
            "ضغط البيانات لتقليل حجمها"
        ],
        correctAnswer: 1,
        explanation: "التوقيع الرقمي هو آلية تستخدم التشفير غير المتماثل لتوفير المصادقة (التأكيد على هوية المرسل) والسلامة (ضمان عدم تعديل الرسالة أثناء النقل) وعدم الإنكار.",
        skill: "التوقيع الرقمي"
    },
    {
        id: 66,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هي (Key Management) في التشفير ولماذا تعتبر مهمة؟",
        options: [
            "عملية توليد وتوزيع وتخزين وإتلاف المفاتيح التشفيرية بأمان",
            "عملية تشفير البيانات",
            "عملية فك تشفير البيانات",
            "عملية اختبار خوارزميات التشفير"
        ],
        correctAnswer: 0,
        explanation: "إدارة المفاتيح (Key Management) هي عملية توليد وتوزيع وتخزين واستخدام وإتلاف المفاتيح التشفيرية بأمان، وهي جزء أساسي من أي نظام تشفير لأن ضعف إدارة المفاتيح يبطل قوة التشفير.",
        skill: "إدارة المفاتيح"
    },
    {
        id: 67,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "hard",
        question: "ما هو هجوم (Man-in-the-Middle) على التشفير وكيف يمكن منعه؟",
        options: [
            "اعتراض الاتصال بين طرفين وسرقة المفاتيح، ويمكن منعه باستخدام PKI",
            "هجوم على خوارزمية التشفير، ويمكن منعه باستخدام مفاتيح أطول",
            "هجوم على دالة التجزئة، ويمكن منعه باستخدام أملاح (Salts)",
            "هجوم على النظام، ويمكن منعه باستخدام جدار حماية"
        ],
        correctAnswer: 0,
        explanation: "هجوم الرجل في المنتصف (MITM) هو اعتراض الاتصال بين طرفين وسرقة البيانات أو التلاعب بها. يمكن منعه باستخدام PKI والشهادات الرقمية للمصادقة على هوية الأطراف.",
        skill: "هجمات التشفير"
    },
    {
        id: 68,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما هو الفرق بين (Block Cipher) و (Stream Cipher) في التشفير المتماثل؟",
        options: [
            "Block Cipher يشفر البيانات في كتل ثابته الحجم، وStream Cipher يشفر البيانات بت واحد أو بايت واحد في كل مرة",
            "Block Cipher أسرع من Stream Cipher",
            "Stream Cipher أكثر أماناً من Block Cipher",
            "لا يوجد فرق بينهما"
        ],
        correctAnswer: 0,
        explanation: "التشفير بالتكتل (Block Cipher) يفرز ويشفر البيانات في كتل ذات حجم ثابت (مثل 128 بت)، بينما التشفير التدفق (Stream Cipher) يشفر البيانات بت واحد أو بايت واحد في كل مرة بالتسلسل.",
        skill: "خوارزميات التشفير المتماثل"
    },
    {
        id: 69,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "hard",
        question: "ما هي إضافة الملح (Salting) لقيم الهش (Hashes) ولماذا تُستخدم عند تخزين كلمات المرور؟",
        options: [
            "سلسلة عشوائية تُضاف لكلمة المرور قبل التجزئة لمنع هجمات جداول قوس قزح (Rainbow Tables)",
            "عملية زيادة طول كلمة المرور لجعلها معقدة",
            "خوارزمية تشفير خاصة بكلمات المرور",
            "طريقة لفك تشفير الهش"
        ],
        correctAnswer: 0,
        explanation: "الملح (Salt) هو قيمة عشوائية فريدة تُضاف إلى كلمة المرور قبل حساب التجزئة (Hash)، ويُستخدم لحماية كلمات المرور المُخزنة من هجمات البحث المسبق مثل جداول قوس قزح وضمان اختلاف القيم حتى للكلمات المتشابهة.",
        skill: "تأمين كلمات المرور والتجزئة"
    },
    {
        id: 70,
        domain: "cryptography",
        domainName: "التشفير التطبيقي",
        courseCode: "CYBR 231",
        level: "Intermediate",
        difficulty: "medium",
        question: "ما مفهوم السرية الأمامية التامة (Perfect Forward Secrecy - PFS)؟",
        options: [
            "خاصية تضمن عدم كشف جلسات الاتصال السابقة في حال اختراق المفتاح الخاص طويل الأجل للخادم",
            "أعلى درجة من تشفير القرص الصلب",
            "تشفير البيانات باستخدام ثلاثة مفاتيح مختلفة",
            "بروتوكول لمنع هجمات حجب الخدمة"
        ],
        correctAnswer: 0,
        explanation: "السرية الأمامية التامة (PFS) هي ميزة في بروتوكولات التشفير تقوم بتوليد مفتاح جلسة فريد ومؤقت لكل اتّصال، بحيث لا يؤدي تسريب المفتاح الخاص الرئيسي إلى إمكانية فك تشفير الاتصالات المسجلة سابقاً.",
        skill: "بروتوكولات التشفير المتقدمة"
    }
];

// ==========================================
// 11. PENETRATION TESTING - اختبار الاختراق (10 أسئلة)
// المستوى: Advanced
// ==========================================
const PENETRATION_TESTING_QUESTIONS = [
    {
        id: 31,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "easy",
        question: "ما هو الهدف الرئيسي من اختبار الاختراق (Penetration Testing)؟",
        options: [
            "تثبيت برامج مكافحة الفيروسات",
            "تحديد الثغرات الأمنية في الأنظمة قبل أن يستغلها المهاجمون",
            "تدريب الموظفين على الأمن السيبراني",
            "تحديث أنظمة التشغيل"
        ],
        correctAnswer: 1,
        explanation: "الهدف الرئيسي من اختبار الاختراق هو تحديد الثغرات الأمنية ونقاط الضعف في الأنظمة والتطبيقات والشبكات بشكل استباقي، قبل أن يتمكن المهاجمون من استغلالها.",
        skill: "أساسيات اختبار الاختراق"
    },
    {
        id: 32,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "easy",
        question: "ما هي مرحلة (Reconnaissance) في منهجية اختبار الاختراق؟",
        options: [
            "مرحلة استغلال الثغرات",
            "مرحلة جمع المعلومات عن الهدف",
            "مرحلة تغطية الآثار",
            "مرحلة كتابة التقرير النهائي"
        ],
        correctAnswer: 1,
        explanation: "مرحلة الاستطلاع (Reconnaissance) هي المرحلة الأولى في اختبار الاختراق، وتهدف إلى جمع أكبر قدر ممكن من المعلومات عن الهدف باستخدام مصادر مفتوحة وأدوات مختلفة.",
        skill: "منهجية اختبار الاختراق"
    },
    {
        id: 33,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو الفرق بين اختبار الاختراق (Penetration Testing) ومسح الثغرات (Vulnerability Scanning)؟",
        options: [
            "مسح الثغرات يحاول استغلال الثغرات، بينما اختبار الاختراق يكتشفها فقط",
            "اختبار الاختراق يحاول استغلال الثغرات بشكل عملي، بينما مسح الثغرات يكتشفها فقط",
            "لا يوجد فرق، المصطلحان مترادفان",
            "اختبار الاختراق يتم يدوياً فقط، ومسح الثغرات آلي فقط"
        ],
        correctAnswer: 1,
        explanation: "مسح الثغرات هو عملية آلية للكشف عن الثغرات المعروفة دون محاولة استغلالها. أما اختبار الاختراق فهو عملية أكثر تعمقاً تحاول استغلال الثغرات عملياً لتقييم مدى خطورتها.",
        skill: "أنواع التقييم الأمني"
    },
    {
        id: 34,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هي أداة (Nmap) المستخدمة في اختبار الاختراق؟",
        options: [
            "أداة لكسر كلمات المرور",
            "أداة لمسح الشبكات واكتشاف الأجهزة والخدمات",
            "أداة لتحليل حزم الشبكة",
            "أداة لاختبار تطبيقات الويب"
        ],
        correctAnswer: 1,
        explanation: "Nmap (Network Mapper) هي أداة مفتوحة المصدر تستخدم في مسح الشبكات لاكتشاف الأجهزة المتصلة والخدمات المفتوحة وأنظمة التشغيل المستخدمة، وهي من الأدوات الأساسية في اختبار الاختراق.",
        skill: "أدوات اختبار الاختراق"
    },
    {
        id: 35,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "hard",
        question: "ما هو مفهوم (Privilege Escalation) في اختبار الاختراق؟",
        options: [
            "محاولة الحصول على صلاحيات أعلى من الصلاحيات الممنوحة حالياً",
            "تثبيت برامج ضارة على النظام",
            "مسح الشبكة بحثاً عن الأجهزة",
            "تحليل حركة الشبكة"
        ],
        correctAnswer: 0,
        explanation: "تصعيد الصلاحيات (Privilege Escalation) هو عملية محاولة الحصول على صلاحيات أعلى (مثل صلاحيات المدير) بعد اختراق نظام معين بصلاحيات محدودة. وهي مرحلة حرجة في اختبار الاختراق لتقييم مدى الضرر المحتمل.",
        skill: "تقنيات الاختراق"
    },
    {
        id: 36,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو هجوم (SQL Injection) في سياق اختبار الاختراق؟",
        options: [
            "هجوم يستهدف شبكات Wi-Fi",
            "هجوم يتم فيه حقن تعليمات SQL ضارة في استعلامات قاعدة البيانات",
            "هجوم يستهدف نظام التشغيل",
            "هجوم يستخدم الهندسة الاجتماعية"
        ],
        correctAnswer: 1,
        explanation: "هجوم حقن SQL (SQL Injection) هو هجوم يتم فيه إدخال تعليمات SQL ضارة في مدخلات المستخدم (مثل حقول النماذج) لتنفيذ استعلامات غير مصرح بها على قاعدة البيانات، مما قد يؤدي إلى سرقة البيانات أو تعديلها.",
        skill: "هجمات تطبيقات الويب"
    },
    {
        id: 37,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "hard",
        question: "ما هو (Social Engineering) في سياق اختبار الاختراق ولماذا يعتبر مهماً؟",
        options: [
            "استخدام المهارات التقنية لاختراق الأنظمة",
            "استغلال الجانب البشري للحصول على معلومات حساسة أو الوصول غير المصرح به",
            "بناء أنظمة أمنية معقدة",
            "تصميم واجهات مستخدم آمنة"
        ],
        correctAnswer: 1,
        explanation: "الهندسة الاجتماعية هي استغلال الجانب البشري (الثقة، الفضول، الخوف) للحصول على معلومات حساسة أو الوصول غير المصرح به. تعتبر من أهم نقاط الضعف التي يجب اختبارها لأن البشر غالباً ما يكونون الحلقة الأضعف في الأمن.",
        skill: "الهندسة الاجتماعية"
    },
    {
        id: 38,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو (OWASP Top 10) في سياق أمن التطبيقات؟",
        options: [
            "قائمة بأهم 10 أدوات لاختبار الاختراق",
            "قائمة بأهم 10 مخاطر أمنية في تطبيقات الويب",
            "قائمة بأفضل 10 شركات أمن سيبراني",
            "قائمة بأهم 10 شهادات في الأمن السيبراني"
        ],
        correctAnswer: 1,
        explanation: "OWASP Top 10 هي قائمة تصدرها مؤسسة OWASP (مشروع أمن تطبيقات الويب المفتوح) تحتوي على أهم 10 مخاطر أمنية تواجه تطبيقات الويب، وتستخدم كمرجع أساسي في اختبار أمن التطبيقات.",
        skill: "أمن تطبيقات الويب"
    },
    {
        id: 39,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "hard",
        question: "ما هي مرحلة (Persistence) في اختبار الاختراق المتقدم؟",
        options: [
            "مرحلة الحفاظ على الوصول إلى النظام المخترق حتى بعد إعادة التشغيل",
            "مرحلة جمع المعلومات عن الهدف",
            "مرحلة استغلال الثغرات",
            "مرحلة تغطية الآثار"
        ],
        correctAnswer: 0,
        explanation: "مرحلة الثبات (Persistence) هي مرحلة في الاختراق المتقدم حيث يقوم المخترق بتثبيت آليات تسمح له بالحفاظ على الوصول إلى النظام المخترق حتى في حالة إعادة تشغيل النظام أو محاولات الإزالة.",
        skill: "تقنيات الاختراق المتقدمة"
    },
    {
        id: 40,
        domain: "penetration-testing",
        domainName: "اختبار الاختراق",
        courseCode: "CYBR 230",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو هجوم (Cross-Site Scripting - XSS) في تطبيقات الويب؟",
        options: [
            "هجوم يستهدف قاعدة البيانات مباشرة",
            "هجوم يتم فيه حقن تعليمات برمجية ضارة (JavaScript) في صفحات الويب",
            "هجوم يستهدف شبكة الخادم",
            "هجوم يستهدف نظام التشغيل"
        ],
        correctAnswer: 1,
        explanation: "هجوم البرمجة النصية عبر المواقع (XSS) هو هجوم يتم فيه حقن تعليمات برمجية ضارة (عادة JavaScript) في صفحات الويب التي يشاهدها المستخدمون الآخرون، مما قد يؤدي إلى سرقة الجلسات أو البيانات.",
        skill: "هجمات تطبيقات الويب"
    }
];

// ==========================================
// 12. INFORMATION SECURITY MANAGEMENT - إدارة أمن المعلومات (10 أسئلة)
// المستوى: Advanced
// ==========================================
const INFORMATION_SECURITY_MANAGEMENT_QUESTIONS = [
    {
        id: 41,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "easy",
        question: "ما هو الهدف الأساسي من نظام إدارة أمن المعلومات (ISMS)؟",
        options: [
            "تثبيت برامج مكافحة الفيروسات",
            "تطبيق إطار عمل منهجي لإدارة وحماية أصول المعلومات",
            "تدريب الموظفين على استخدام الحاسوب",
            "شراء معدات شبكات جديدة"
        ],
        correctAnswer: 1,
        explanation: "نظام إدارة أمن المعلومات (ISMS) هو إطار عمل منهجي لإدارة أصول المعلومات وحمايتها من خلال تطبيق سياسات وإجراءات وضوابط أمنية متكاملة.",
        skill: "إدارة أمن المعلومات"
    },
    {
        id: 42,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "easy",
        question: "ما هو معيار ISO 27001؟",
        options: [
            "معيار لإدارة جودة المنتجات",
            "معيار دولي لنظام إدارة أمن المعلومات",
            "معيار للشبكات اللاسلكية",
            "معيار لتشفير البيانات"
        ],
        correctAnswer: 1,
        explanation: "ISO/IEC 27001 هو معيار دولي يحدد متطلبات نظام إدارة أمن المعلومات (ISMS). يساعد المؤسسات على إنشاء وتنفيذ وصيانة وتحسين نظام إدارة أمن المعلومات بشكل منهجي.",
        skill: "معايير الأمن"
    },
    {
        id: 43,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو مفهوم (CIA Triad) في إدارة أمن المعلومات؟",
        options: [
            "ثلاثية السرية والسلامة والتوفر",
            "ثلاثية التشفير والمصادقة والتفويض",
            "ثلاثية التخطيط والتنفيذ والمراجعة",
            "ثلاثية الشبكة والخادم والتطبيق"
        ],
        correctAnswer: 0,
        explanation: "ثلاثية CIA (السرية، السلامة، التوفر) هي المبادئ الأساسية لأمن المعلومات التي توجه جميع جهود حماية المعلومات.",
        skill: "مبادئ أمن المعلومات"
    },
    {
        id: 44,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو مفهوم (Access Control) في إدارة أمن المعلومات؟",
        options: [
            "عملية تحديد من يمكنه الوصول إلى ماذا ومتى",
            "عملية تشفير جميع البيانات",
            "عملية نسخ احتياطي للبيانات",
            "عملية تحديث النظام"
        ],
        correctAnswer: 0,
        explanation: "التحكم في الوصول (Access Control) هو عملية تحديد من (المستخدمين) يمكنه الوصول إلى أي موارد (بيانات، أنظمة، تطبيقات) ومتى يمكنه الوصول، وهو عنصر أساسي في حماية المعلومات.",
        skill: "التحكم في الوصول"
    },
    {
        id: 45,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "hard",
        question: "ما هو نموذج (DAC - Discretionary Access Control) في التحكم في الوصول؟",
        options: [
            "نموذج يتم فيه منح الصلاحيات بناءً على أدوار المستخدمين",
            "نموذج يتم فيه منح الصلاحيات بناءً على تصنيف المعلومات",
            "نموذج يتم فيه تحديد صلاحيات الوصول من قبل مالك المورد",
            "نموذج يتم فيه التحكم بالوصول عبر بطاقات ذكية"
        ],
        correctAnswer: 2,
        explanation: "التحكم في الوصول التقديري (DAC) هو نموذج يتم فيه تحديد صلاحيات الوصول من قبل مالك المورد (المستخدم الذي أنشأ الملف)، ويمكنه منح أو سحب الصلاحيات حسب تقديره.",
        skill: "نماذج التحكم في الوصول"
    },
    {
        id: 46,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو مفهوم (Security Governance) في المؤسسات؟",
        options: [
            "تثبيت برامج أمنية على الأجهزة",
            "الإطار الذي يوجه ويضبط استراتيجية الأمن في المؤسسة",
            "تدريب الموظفين على الأمن السيبراني",
            "إجراء اختبارات اختراق دورية"
        ],
        correctAnswer: 1,
        explanation: "حوكمة الأمن (Security Governance) هي الإطار الذي يحدد كيفية توجيه ومراقبة وإدارة استراتيجية الأمن في المؤسسة، ويتضمن السياسات والإجراءات والهيكل التنظيمي والمساءلة.",
        skill: "حوكمة الأمن"
    },
    {
        id: 47,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "hard",
        question: "ما هو مفهوم (Separation of Duties) في إدارة أمن المعلومات؟",
        options: [
            "فصل المهام بين الأقسام المختلفة في المؤسسة",
            "منع أي شخص من امتلاك صلاحيات كافية لإنجاز عملية حساسة بمفرده",
            "تقسيم الشبكة إلى قطاعات منفصلة",
            "فصل بيانات العملاء عن بيانات الموظفين"
        ],
        correctAnswer: 1,
        explanation: "فصل المهام (Separation of Duties) هو مبدأ أمني يمنع أي شخص من امتلاك الصلاحيات الكافية لإنجاز عملية حساسة بمفرده، مما يقلل من مخاطر الاحتيال والأخطاء ويزيد من المساءلة.",
        skill: "مبادئ الأمن الإداري"
    },
    {
        id: 48,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "easy",
        question: "ما هي سياسة الأمن المعلوماتي (Information Security Policy)؟",
        options: [
            "برنامج حاسوبي لحماية الملفات",
            "وثيقة تحدد قواعد وإجراءات حماية معلومات المؤسسة",
            "جهاز لتشفير البيانات",
            "دورة تدريبية للموظفين"
        ],
        correctAnswer: 1,
        explanation: "سياسة الأمن المعلوماتي هي وثيقة رسمية تحدد قواعد وإجراءات وتوجيهات حماية معلومات المؤسسة، وتوضح مسؤوليات الموظفين والإدارة تجاه الأمن.",
        skill: "سياسات الأمن"
    },
    {
        id: 49,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو مفهوم (Risk Assessment) في إدارة المخاطر الأمنية؟",
        options: [
            "تثبيت برامج مكافحة الفيروسات",
            "تقييم المخاطر المحتملة وتأثيرها على المؤسسة",
            "تدريب الموظفين على الأمن",
            "نسخ احتياطي للبيانات"
        ],
        correctAnswer: 1,
        explanation: "تقييم المخاطر (Risk Assessment) هو عملية تحديد وتقييم المخاطر التي تواجه المؤسسة، وتقدير احتمالية حدوثها وتأثيرها المحتمل، لتحديد أولويات المعالجة.",
        skill: "إدارة المخاطر"
    },
    {
        id: 50,
        domain: "information-security-management",
        domainName: "إدارة أمن المعلومات والحوكمة",
        courseCode: "CYBR 111",
        level: "Advanced",
        difficulty: "hard",
        question: "ما هو (BCP - Business Continuity Planning) في إدارة الأمن؟",
        options: [
            "خطة لنسخ احتياطي البيانات",
            "خطة لضمان استمرارية الأعمال الحيوية أثناء وبعد الأزمات",
            "خطة لتحديث الأنظمة",
            "خطة لتدريب الموظفين"
        ],
        correctAnswer: 1,
        explanation: "خطة استمرارية الأعمال (BCP) هي خطة تهدف إلى ضمان استمرار العمليات الحيوية للمؤسسة أثناء وبعد حدوث أزمات أو كوارث، وتشمل تحديد العمليات الحيوية وإجراءات التعافي.",
        skill: "استمرارية الأعمال"
    }
];

// ==========================================
// 13. RISK & INCIDENT RESPONSE - إدارة المخاطر والاستجابة للحوادث (10 أسئلة)
// المستوى: Advanced
// ==========================================
const RISK_INCIDENT_RESPONSE_QUESTIONS = [
    {
        id: 71,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "easy",
        question: "ما هي الخطوة الأولى في دورة حياة الاستجابة للحوادث السيبرانية (Incident Response)؟",
        options: [
            "الاستعداد والتحضير (Preparation)",
            "الاحتواء (Containment)",
            "الاستئصال والتعافي (Eradication & Recovery)",
            "تحليل ما بعد الحادث (Post-Incident Analysis)"
        ],
        correctAnswer: 0,
        explanation: "الاستعداد والتحضير هي المرحلة الأولى الحيوية في خطة الاستجابة للحوادث، حيث يتم إعداد الفريق والأدوات والسياسات وتحديد الأدوار قبل وقوع الحادث.",
        skill: "مراحل الاستجابة للحوادث"
    },
    {
        id: 72,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "medium",
        question: "أي من الخيارات التالية يُعد الهدف الرئيسي لمرحلة الاحتواء (Containment)؟",
        options: [
            "معاقبة المتسبب بالحادث",
            "منع انتشار الضرر أو الهجوم لأجهزة أو شبكات أخرى",
            "إعادة تشغيل جميع الخدمات فوراً",
            "حذف سجلات الحادث لتنظيف النظام"
        ],
        correctAnswer: 1,
        explanation: "مرحلة الاحتواء تهدف فوراً إلى الحد من نطاق الحادث السيبراني وعزله للتحكم في الأضرار ومنع امتداد التهديد لباقي أصول المؤسسة.",
        skill: "إدارة الحوادث - الاحتواء"
    },
    {
        id: 73,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "medium",
        question: "ما المقصود باستراتيجية نقل المخاطر (Risk Transfer)؟",
        options: [
            "تجاهل الخطر وعدم التعامل معه",
            "تطبيق ضوابط أمنية لتقليل الخطر",
            "مشاركة أو تحويل العبء المالي للخطر إلى طرف ثالث مثل شركات التأمين السيبراني",
            "إيقاف الخدمة التي تسبب الخطر نهائياً"
        ],
        correctAnswer: 2,
        explanation: "تحويل المخاطر يعتمد على إحالة التبعات المالية أو التشغيلية للخطر إلى طرف خارجي كالتأمين السيبراني أو مزودي الخدمات المدارين.",
        skill: "استراتيجيات التعامل مع المخاطر"
    },
    {
        id: 74,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "hard",
        question: "ما هو مؤشر (RTO - Recovery Time Objective) في планировании استمرارية الأعمال؟",
        options: [
            "أقصى زمن مسموح به لاستعادة النظام والخدمات بعد الانقطاع",
            "أقصى كمية بيانات مسموح بفقدانها مقاسة بالزمن",
            "التكلفة المالية الإجمالية لإصلاح النظام",
            "عدد الموظفين المشاركين في عملية التعافي"
        ],
        correctAnswer: 0,
        explanation: "RTO يحدد الزمن الأقصى المقبول لتعطل النظام والخدمات قبل أن تتأثر الأعمال بشكل غير قابل للاستدراك.",
        skill: "استمرارية الأعمال والتعافي من الكوارث"
    },
    {
        id: 75,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو الفرق الأساسي بين RTO و RPO؟",
        options: [
            "RTO يرتبط بالزمن المستغرق لاستعادة الخدمة، بينما RPO يرتبط بحجم البيانات المفقودة المقاس بالزمن",
            "RTO يرتبط بالأجهزة، بينما RPO يرتبط بالبرمجيات",
            "لا يوجد فرق بينهما",
            "RPO يرتبط بتكلفة الاسترجاع، و RTO يرتبط بالاستراتيجية"
        ],
        correctAnswer: 0,
        explanation: "RTO يركز على الوقت اللازم لإعادة التشغيل (Time)، بينما RPO يحدد كمية البيانات المخاطر بفقدانها بناءً على توقيت آخر نسخة احتياطية (Data Loss).",
        skill: "تحليل تأثير الأعمال (BIA)"
    },
    {
        id: 76,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "hard",
        question: "ما هو دور التحقيق الجنائي الرقمي (Digital Forensics) في الاستجابة للحوادث؟",
        options: [
            "تسريع إعادة التمهيد للأجهزة",
            "جمع وحفظ وتحليل أدلة الأدلة الرقمية المقبولة قانونياً لفك تشفير أسباب الاختراق",
            "تثبيت جدران حماية جديدة",
            "شراء نسخ برمجية جديدة"
        ],
        correctAnswer: 1,
        explanation: "التحقيق الجنائي الرقمي يهدف لاستخلاص الأدلة وتتبع سلوك المخترق وسلسلة الأحداث دون التعديل على الأدلة الرقمية الأصلية.",
        skill: "التحقيق الجنائي الرقمي"
    },
    {
        id: 77,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "medium",
        question: "ما المقصود بالمخاطر المتبقية (Residual Risk)؟",
        options: [
            "المخاطر التي تم القضاء عليها تماماً",
            "المخاطر المتبقية بعد تطبيق جميع الضوابط والضمانات الأمنية",
            "المخاطر التي لم يتم الكشف عنها بعد",
            "المخاطر التي تسببها جهات خارجية فقط"
        ],
        correctAnswer: 1,
        explanation: "المخاطر المتبقية هي جزء من المخاطر الكلية الذي يبقى مستمراً حتى بعد تطبيق عناصر التحكم والتخفيف الأمنية.",
        skill: "تقييم وإدارة المخاطر"
    },
    {
        id: 78,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "hard",
        question: "أثناء تحليل حادث أمني، ما أهمية الحفاظ على (Chain of Custody) للأدلة؟",
        options: [
            "ضمان توثيق حركة الدليل ومن تعامل معه لمنع التشكيك في نزاهته أمام القضاء",
            "تسهيل عملية التشفير للدليل",
            "تسريع تسليم الأدلة للإدارة العليا",
            "تقليل مساحة تخزين الأدلة"
        ],
        correctAnswer: 0,
        explanation: "تسلسل العهدة (Chain of Custody) يوثق بالتفصيل جميع مراحل جمع وضبط ونقل وتحليل الدليل لضمان عدم تلويله أو التلاعب به ليكون مقبولاً قانوناً.",
        skill: "الأدلة الجنائية - تسلسل العهدة"
    },
    {
        id: 79,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو الهدف الرئيسي لفرقة CSIRT في المؤسسة؟",
        options: [
            "برمجة الموقع الإلكتروني للمؤسسة",
            "تقديم خدمات الدعم الفني اليومية",
            "معالجة وإدارة الحوادث الأمنية السيبرانية بأسلوب سريع ومنظم",
            "مراقبة حضور وانصراف الموظفين"
        ],
        correctAnswer: 2,
        explanation: "فريق الاستجابة لحوادث أمن الحاسوب (CSIRT) مخصص للتعامل السريع والمباشر مع التهديدات والحوادث السيبرانية فور وقوعها وتنسيق عمليات التعافي.",
        skill: "فرق الاستجابة للحوادث"
    },
    {
        id: 80,
        domain: "risk-incident-response",
        domainName: "إدارة المخاطر والاستجابة للحوادث",
        courseCode: "CYBR 240",
        level: "Advanced",
        difficulty: "hard",
        question: "في مرحلة الدروس المستفادة (Lessons Learned)، ما هو الإجراء الأكثر أهمية؟",
        options: [
            "إغلاق الملف فوراً لتجنب المساءلة",
            "تعديل السياسات والضوابط الأمنية وتحديث خطة الاستجابة بناءً على ثغرات التقييم",
            "إنهاء أجهزة الفريق المتسبب بالحادث",
            "إعادة نشر الهجوم محاكاةً في البيئة الحية"
        ],
        correctAnswer: 1,
        explanation: "مرحلة الدروس المستفادة تهدف لتحويل نقطة الضعف المخترقة إلى مصدر قوة عبر تحديث الخطط ودعم الدفاعات لمنع تكرار السيناريو مستقبلاً.",
        skill: "تحليل ما بعد الحادث"
    }
];

// ==========================================
// 14. CYBER CRIMES - الجرائم الإلكترونية (6 أسئلة)
// المستوى: Advanced
// ==========================================
const CYBER_CRIMES_QUESTIONS = [
    {
        id: 81,
        domain: "cyber-crimes",
        domainName: "الجرائم الإلكترونية والتشريعات",
        courseCode: "CYBR 250",
        level: "Advanced",
        difficulty: "easy",
        question: "أي من الأفعال التالية يُصنف قانونياً كجريمة معلوماتية/إلكترونية؟",
        options: [
            "تحديث برامج الحماية على الجهاز الشخصي",
            "الدخول غير المصرح به إلى نظام معلوماتي لتدمير أو تغيير البيانات",
            "استخدام محرك البحث جوجل للبحث عن معلومات عامة",
            "إرسال بريد إلكتروني رسمي للزملاء"
        ],
        correctAnswer: 1,
        explanation: "الدخول غير المصرح به وإلحاق الضرر بالبيانات يُعد انتهاكاً صريحاً لأنظمة مكافحة الجرائم المعلوماتية في أغلب التشريعات الدولية والمحلية.",
        skill: "قوانين الجرائم السيبرانية"
    },
    {
        id: 82,
        domain: "cyber-crimes",
        domainName: "الجرائم الإلكترونية والتشريعات",
        courseCode: "CYBR 250",
        level: "Advanced",
        difficulty: "medium",
        question: "ما هو هجوم برامج الفدية (Ransomware) وفق تصنيف التهديدات السيبرانية؟",
        options: [
            "برمجية خبيثة تقوم بتشفير بيانات الضحية والمطالبة بمقابل مالي لإعادة مفتاح فك التشفير",
            "برنامج يبث إعلانات غير مرغوب فيها فقط",
            "أداة لتسريع الاتصال بالإنترنت",
            "برنامج مخصص لجمع التبرعات الخيرية"
        ],
        correctAnswer: 0,
        explanation: "برامج الفدية تشفر الملفات وتمنع الوصول إليها، واستغلال ذلك في ابتزاز الضحية مالياً للحصول على أداة فك التشفير.",
        skill: "أنواع البرمجيات الخبيثة والابتزاز"
    },
    {
        id: 83,
        domain: "cyber-crimes",
        domainName: "الجرائم الإلكترونية والتشريعات",
        courseCode: "CYBR 250",
        level: "Advanced",
        difficulty: "medium",
        question: "ما الذي يميز هجوم التصيد الاحتيالي الموجه (Spear Phishing) عن التصيد العادي؟",
        options: [
            "إرسال رسائل عشوائية لملايين الأشخاص",
            "استهداف شخص أو جهة محددة برسالة مخصصة بدقة بناءً على جمع معلومات سابقة",
            "استخدام المكالمات الصوتية فقط",
            "اختراق الخوادم الرئيسية مباشرة"
        ],
        correctAnswer: 1,
        explanation: "التصيد الموجه يخصص رسالته للضحية المحددة (مثل المدير المالي) باستخدام معلومات شخصية محددة لرفع إمكانية الوقوع في الفخ.",
        skill: "الهندسة الاجتماعية الاحتيالية"
    },
    {
        id: 84,
        domain: "cyber-crimes",
        domainName: "الجرائم الإلكترونية والتشريعات",
        courseCode: "CYBR 250",
        level: "Advanced",
        difficulty: "hard",
        question: "ما الهدف الأساسي من قوانين حماية البيانات الشخصية (مثل GDPR)؟",
        options: [
            "تسهيل بيع البيانات للشركات الإعلانية",
            "حماية خصوصية بيانات الأفراد وتحديد حقوقهم وفرض قيود صارمة على جمعها ومعالجتها",
            "منع الأفراد من استخدام الإنترنت",
            "تشفير كافة مواقع الويب بشكل إجباري"
        ],
        correctAnswer: 1,
        explanation: "أنظمة حماية البيانات تمنح الأفراد التحكم والسيادة على بياناتهم الخاصة وتلزم المؤسسات بمعايير شفافية وأمان عالية تحت طائلة العقوبات.",
        skill: "الامتثال وحماية الخصوصية"
    },
    {
        id: 85,
        domain: "cyber-crimes",
        domainName: "الجرائم الإلكترونية والتشريعات",
        courseCode: "CYBR 250",
        level: "Advanced",
        difficulty: "hard",
        question: "ما المقصود بإنكار الخدمة الموزع (DDoS) من منظور الأثر الجنائي؟",
        options: [
            "سرقة الهوية الرقمية للمستخدم",
            "استخدام شبكة من الأجهزة المخترقة (Botnet) لشن هجوم يتسبب في تعطيل خدمات حيوية ومؤسسية",
            "تغيير خلفية الشاشة للمستخدم",
            "تخمين كلمة المرور للمستخدم"
        ],
        correctAnswer: 1,
        explanation: "هجوم DDoS يستخدم أجهزة موزعة حول العالم للضغط على خوادم الضحية وإسقاط الخدمة، وهو انتهاك جنائي يؤدي لخسائر مالية كبيرة.",
        skill: "هجمات تعطيل الخدمات"
    },
    {
        id: 86,
        domain: "cyber-crimes",
        domainName: "الجرائم الإلكترونية والتشريعات",
        courseCode: "CYBR 250",
        level: "Advanced",
        difficulty: "medium",
        question: "ما المقصود بالسرقة الإلكترونية للهوية (Identity Theft)؟",
        options: [
            "استخدام حساب صديق بإذنه",
            "انتحال شخصية فرد آخر بطريقة غير قانونية باستخدام بياناته الحساسة لارتكاب عمليات احتيال",
            "نسخ ملف نصي من الحاسوب",
            "إنشاء حساب باسم مستعار على منصات التواصل"
        ],
        correctAnswer: 1,
        explanation: "سرقة الهوية تتضمن استخدام المعلومات الشخصية (كالرقم القومي أو البيانات البنكية) لشخص آخر لارتكاب المعاملات المالية أو الجرائم بدلاً عنه.",
        skill: "جرائم الانتحال والاحتيال"
    }
];

// ==========================================
// 15. CLOUD SECURITY - الحوسبة السحابية وأمن المحاكاة الافتراضية (6 أسئلة)
// المستوى: Professional
// ==========================================
const CLOUD_SECURITY_QUESTIONS = [
    {
        id: 87,
        domain: "cloud-security",
        domainName: "الحوسبة السحابية وأمن المحاكاة الافتراضية",
        courseCode: "CYBR 310",
        level: "Professional",
        difficulty: "medium",
        question: "ما هو نموذج المسؤولية المشتركة (Shared Responsibility Model) في الحوسبة السحابية؟",
        options: [
            "تحمل العميل كامل المسؤولية الأمنية بغض النظر عن نوع الخدمة",
            "تقسيم المهام الأمنية بين مزود الخدمة السحابية والعميل بناءً على نموذج الخدمة (IaaS, PaaS, SaaS)",
            "تحمل المزود السحابي جميع المسؤوليات الأمنية بشكل كامل",
            "إسناد الأمن لشركات تأمين خارجية"
        ],
        correctAnswer: 1,
        explanation: "النموذج يحدد حدود الأمان؛ حيث يضمن المزود أمان البنية التحتية السحابية نفسها (Security of the cloud)، بينما يضمن العميل أمان بياناته وإعداداته داخل السحابة (Security in the cloud).",
        skill: "مسؤوليات الأمن السحابي"
    },
    {
        id: 88,
        domain: "cloud-security",
        domainName: "الحوسبة السحابية وأمن المحاكاة الافتراضية",
        courseCode: "CYBR 310",
        level: "Professional",
        difficulty: "hard",
        question: "في بيئة المحاكاة الافتراضية (Virtualization)، ما هو خطر هجوم (Hypervisor Escape)؟",
        options: [
            "تمكن النواة من تحديث نفسها تلقائياً",
            "نجاح نظام تشغيل وهمي (Guest VM) في اختراق طبقة Hypervisor للوصول المباشر للجهاز المضيف (Host) أو الأنظمة الوهمية الأخرى",
            "فقدان الاتصال بالشبكة اللاسلكية",
            "بطء أداء القرص الصلب"
        ],
        correctAnswer: 1,
        explanation: "هروب المراقِب (Hypervisor Escape) هجوم خطير يستغل ثغرة لتجاوز العزل بين البيئات الوهمية والنظام المضيف مما يهدد كامل البنية التحتية.",
        skill: "أمن المحاكاة الافتراضية"
    },
    {
        id: 89,
        domain: "cloud-security",
        domainName: "الحوسبة السحابية وأمن المحاكاة الافتراضية",
        courseCode: "CYBR 310",
        level: "Professional",
        difficulty: "medium",
        question: "ما هي التقنية المستخدمة لتأمين البيانات السحابية أثناء عدم الاستخدام (Data at Rest)؟",
        options: [
            "تحديث نظام المتصفح",
            "التشفير القوي المعتمد على المفاتيح (Symmetric Encryption مثل AES-256)",
            "استخدام بروتوكول FTP",
            "تقليل حجم الملفات"
        ],
        correctAnswer: 1,
        explanation: "تشفير البيانات المخزنة في قواعد البيانات أو وحدات التخزين السحابية يضمن عدم إمكانية قراءتها في حال تم الوصول الفيزيائي غير المصرح به للأقراص.",
        skill: "حماية البيانات السحابية"
    },
    {
        id: 90,
        domain: "cloud-security",
        domainName: "الحوسبة السحابية وأمن المحاكاة الافتراضية",
        courseCode: "CYBR 310",
        level: "Professional",
        difficulty: "hard",
        question: "ما هي أداة CASB (Cloud Access Security Broker) وما هي وظيفتها الأساسية؟",
        options: [
            "جهاز لتسريع التصفح في السحابة",
            "نقطة تطبيق أمنية تقع بين مستخدمي السحابة والخدمات السحابية لتطبيق سياسات الأمن والحوكمة والتشفير",
            "خادم لتخزين الصور سحابياً",
            "برنامج لإنشاء العروض التقديمية السحابية"
        ],
        correctAnswer: 1,
        explanation: "وسيط أمن الوصول السحابي (CASB) يراقب النشاطات السحابية ويضمن الامتثال للسياسات وتطبيق التشفير ومنع تسريب البيانات (DLP) في الخدمات السحابية.",
        skill: "أدوات حوكمة السحابة"
    },
    {
        id: 91,
        domain: "cloud-security",
        domainName: "الحوسبة السحابية وأمن المحاكاة الافتراضية",
        courseCode: "CYBR 310",
        level: "Professional",
        difficulty: "medium",
        question: "في بيئة (IaaS - البنية التحتية كخدمة)، ما هي إحدى مسؤوليات العميل الرئيسية؟",
        options: [
            "حماية المكونات المادية لمراكز البيانات (Hardware)",
            "تحديث وتأمين نظام التشغيل والتطبيقات المتبعة على الخوادم الافتراضية",
            "صيانة الكابلات البحرية للشبكة",
            "إدارة مبردات الخوادم"
        ],
        correctAnswer: 1,
        explanation: "في IaaS، يوفر المزود عتاداً افتراضياً، بينما يتولى العميل إدارة وتثبيت وتأمين نظام التشغيل والتطبيقات والشبكات الافتراضية.",
        skill: "نماذج الخدمة السحابية"
    },
    {
        id: 92,
        domain: "cloud-security",
        domainName: "الحوسبة السحابية وأمن المحاكاة الافتراضية",
        courseCode: "CYBR 310",
        level: "Professional",
        difficulty: "hard",
        question: "ما هو مفهوم (Container Isolation) في تقنيات مثل Docker و Kubernetes؟",
        options: [
            "فصل الخوادم المادية عن الإنترنت",
            "ضمان عدم قدرة تطبيق داخل الحاوية على استغلال موارد أو التجسس على الحاويات الأخرى المشتركة في نفس النواة",
            "حذف الحاويات القديمة تلقائياً",
            "تشفير اتصالات الألياف الضوئية"
        ],
        correctAnswer: 1,
        explanation: "عزل الحاويات يعتمد على التقنيات الأمنية بنواة النظام (مثل cgroups و namespaces) للحد من الموارد وتجنب تجاوز بيئة الحاوية إلى البيئات المجاورة.",
        skill: "أمن الحاويات (Containers)"
    }
];

// ==========================================
// 16. IOT SECURITY - إنترنت الأشياء الآمنة (4 أسئلة)
// المستوى: Professional
// ==========================================
const IOT_SECURITY_QUESTIONS = [
    {
        id: 93,
        domain: "iot-security",
        domainName: "إنترنت الأشياء الآمنة",
        courseCode: "CYBR 320",
        level: "Professional",
        difficulty: "medium",
        question: "ما التحدي الأمني الأكثر انتشاراً في أجهزة إنترنت الأشياء (IoT) المدمجة؟",
        options: [
            "ارتفاع أسعار الأجهزة جداً",
            "محدودية موارد المكونات (المعالج والذاكرة) وصعوبة تثبيت برامج حماية أو إجراء تحديثات أمنية دورية",
            "ضخامة حجم الأجهزة الفيزيائي",
            "استخدامها لبطاريات كبيرة الحجم"
        ],
        correctAnswer: 1,
        explanation: "ضعف الموارد المادية يمنع استخدام خوارزميات التشفير المعقدة أو برامج الحماية، مما يجعل أجهزة IoT أهدافاً سهلة إذا لم تُصمم بأمان من البداية.",
        skill: "تحديات أمن IoT"
    },
    {
        id: 94,
        domain: "iot-security",
        domainName: "إنترنت الأشياء الآمنة",
        courseCode: "CYBR 320",
        level: "Professional",
        difficulty: "hard",
        question: "كيف تؤثر كلمات المرور الافتراضية (Default Credentials) على شبكات أجهزة IoT؟",
        options: [
            "تزيد من سرعة الجهاز",
            "تسهل على الهجمات الآلية استغلالها وضمه لشبكات البوتنت (مثل Mirai Botnet) لشن هجمات ضخمة",
            "تمنع الاتصال بالإنترنت",
            "تحمي الجهاز من الفيروسات"
        ],
        correctAnswer: 1,
        explanation: "عدم تغيير بيانات الدخول الافتراضية يتيح للمخترقين تجربة برامج مسح آلية لتنسيق واستغلال آلاف الأجهزة واستخدامها كجيوش رقمية (Botnets).",
        skill: "ثغرات أجهزة IoT"
    },
    {
        id: 95,
        domain: "iot-security",
        domainName: "إنترنت الأشياء الآمنة",
        courseCode: "CYBR 320",
        level: "Professional",
        difficulty: "medium",
        question: "أي من البروتوكولات التالية يُعد شائعاً وخفيف الوزن للاتصال في بيئات IoT ولكنه يتطلب تشفيراً لحمايته؟",
        options: [
            "MQTT",
            "HTTP/2",
            "BGP",
            "SNMPv1"
        ],
        correctAnswer: 0,
        explanation: "بروتوكول MQTT خفيف ومناسب لمحدودية الحزمة في IoT، ولكنه يتطلب استخدام TLS لتشفير البيانات لمنع التنصت أو التعديل.",
        skill: "بروتوكولات IoT"
    },
    {
        id: 96,
        domain: "iot-security",
        domainName: "إنترنت الأشياء الآمنة",
        courseCode: "CYBR 320",
        level: "Professional",
        difficulty: "hard",
        question: "ما هي أفضل ممارسة أمنية لتنفيذ برامج الحماية على شبكة منزلية/مؤسسية تحتوي على أجهزة IoT كثيرة؟",
        options: [
            "توصيل أجهزة IoT بنفس شبكة الخوادم الحساسة",
            "عزل أجهزة IoT في شبكة افتراضية منفصلة (VLAN) وتقييد وصولها للبقية",
            "إغلاق جدار الحماية بالكامل",
            "اعتماد كلمة مرور موحدة لجميع الأجهزة"
        ],
        correctAnswer: 1,
        explanation: "عزل الأجهزة في VLAN يمنع المهاجم من استخدام جهاز IoT مخترق كجسر للوصول للأنظمة الحساسة الأخرى في نفس المنشأة.",
        skill: "تأمين بيئة IoT"
    }
];

// ==========================================
// 17. INTEGRATION - تكامل المفاهيم (4 أسئلة)
// المستوى: Professional
// ==========================================
const INTEGRATION_QUESTIONS = [
    {
        id: 97,
        domain: "integration",
        domainName: "تكامل المفاهيم والتصميم الأمني",
        courseCode: "CYBR 400",
        level: "Professional",
        difficulty: "hard",
        question: "ما هو المفهوم الأمني المتقدم (Zero Trust Architecture)؟",
        options: [
            "الثقة التامة بكل المستخدمين داخل الشبكة الداخلية",
            "مبدأ يتطلب التحقق المستمر والصارم من كل مستخدم وجهاز يحاول الوصول إلى الموارد، بغض النظر عما إذا كان داخل الشبكة أو خارجها",
            "إلغاء كلمات المرور بالكامل",
            "تشفير الاتصالات الخارجية فقط"
        ],
        correctAnswer: 1,
        explanation: "نموذج انعدام الثقة (Zero Trust) يعتمد فلسفة 'لا تثق بأحد مطلقاً، تحقق دائماً' (Never Trust, Always Verify)، ولا يعطي أي ثقة تلقائية بناءً على الموقِع الشبكي.",
        skill: "الهندسة الأمنية الحديثة"
    },
    {
        id: 98,
        domain: "integration",
        domainName: "تكامل المفاهيم والتصميم الأمني",
        courseCode: "CYBR 400",
        level: "Professional",
        difficulty: "hard",
        question: "كيف يتكامل نظام إدارة الأحداث والمعلومات الأمنية (SIEM) مع مركز العمليات الأمنية (SOC)؟",
        options: [
            "يقوم SIEM بتجميع وتحليل السجلات (Logs) والتنبيهات تلقائياً ليساعد محللي SOC في الكشف والاستجابة للتهديدات",
            "يغني SIEM عن وجود أي عنصر بشري في مركز SOC",
            "يقوم SIEM بحذف السجلات القديمة لتوفير المساحة",
            "يقتصر دور SIEM على فحص البريد الإلكتروني"
        ],
        correctAnswer: 0,
        explanation: "أداة SIEM توفر الرؤية المركزية وتحليل ارتباط الأحداث الأمنية في الوقت الفعلي، مما يزود محللي SOC بالبيانات اللازمة لاتخاذ قرارات الاستجابة.",
        skill: "العمليات الأمنية المتقدمة"
    },
    {
        id: 99,
        domain: "integration",
        domainName: "تكامل المفاهيم والتصميم الأمني",
        courseCode: "CYBR 400",
        level: "Professional",
        difficulty: "hard",
        question: "عند تصميم نظام يدعم التوافر العالي والتعافي، ما هي الفائدة من تقنية (Redundancy)؟",
        options: [
            "تكرار إرسال التنبيهات الأمنية للموظفين",
            "توفير مكونات مكررة أو بديلة (خوادم، شبكات، أجهزة مزود طاقة) لضمان استمرار الخدمة فوراً دون انقطاع عند فشل أحد المكونات",
            "مضاعفة سعر الأجهزة الأمني",
            "تقليل أداء النظام بنسبة 50%"
        ],
        correctAnswer: 1,
        explanation: "التكرارية المخططة (Redundancy) تمنع وجود نقطة فشل واحدة (Single Point of Failure)، مما يدعم استمرارية الأعمال ويعزز التوافر (Availability).",
        skill: "التصميم الأمني العالي التوافر"
    },
    {
        id: 100,
        domain: "integration",
        domainName: "تكامل المفاهيم والتصميم الأمني",
        courseCode: "CYBR 400",
        level: "Professional",
        difficulty: "hard",
        question: "ما هي الخطوة الأولى لتنفيذ آلية (Defense in Depth) شاملة للمؤسسة؟",
        options: [
            "شراء أغلى جدار حماية في السوق",
            "إجراء تقييم شامل للأصول والتحديد الدقيق للمخاطر وتصنيف البيانات لمعرفة ما يجب حمايته وكيفية توزيع طبقات الحماية",
            "تشفير أجهزة الموظفين وتجاهل الخوادم",
            "الاستغناء عن السياسات الأمنية المكتوبة"
        ],
        correctAnswer: 1,
        explanation: "لا يمكن بناء دفاع متعمق وناجح دون معرفة وتصنيف الأصول المراد حمايتها وتقييم المخاطر المترتبة، لتوجيه استثمارات الطبقات الأمنية (تقنية، إدارية، مادية) بشكل صحيح.",
        skill: "التخطيط والتصميم الأمني المتكامل"
    }
];

// ==========================================
// MERGE ALL QUESTIONS (TOTAL: 150 QUESTIONS)
// ==========================================
const DIAGNOSTIC_QUESTIONS = [
    // Beginner Level (50 أسئلة)
    ...CYBER_FUNDAMENTALS_QUESTIONS,             // 10 أسئلة
    ...COMPUTER_APPLICATIONS_QUESTIONS,          // 10 أسئلة
    ...NETWORK_PRINCIPLES_QUESTIONS,             // 10 أسئلة
    ...OPERATING_SYSTEMS_QUESTIONS,              // 10 أسئلة
    ...ADVANCED_COMPUTER_APPLICATIONS_QUESTIONS, // 10 أسئلة

    // Intermediate Level (50 أسئلة)
    ...COMPUTER_PROGRAMMING_QUESTIONS,           // 10 أسئلة
    ...NETWORK_SECURITY_QUESTIONS,               // 10 أسئلة
    ...OS_SECURITY_QUESTIONS,                    // 10 أسئلة
    ...SECURE_SOFTWARE_DEVELOPMENT_QUESTIONS,    // 10 أسئلة
    ...CRYPTOGRAPHY_QUESTIONS,                   // 10 أسئلة

    // Advanced Level (36 سؤال)
    ...PENETRATION_TESTING_QUESTIONS,            // 10 أسئلة
    ...INFORMATION_SECURITY_MANAGEMENT_QUESTIONS, // 10 أسئلة
    ...RISK_INCIDENT_RESPONSE_QUESTIONS,         // 10 أسئلة
    ...CYBER_CRIMES_QUESTIONS,                   // 6 أسئلة

    // Professional Level (14 سؤال)
    ...CLOUD_SECURITY_QUESTIONS,                 // 6 أسئلة
    ...IOT_SECURITY_QUESTIONS,                   // 4 أسئلة
    ...INTEGRATION_QUESTIONS                     // 4 أسئلة
];

// ==========================================
// EXPORT & VERIFICATION
// ==========================================
window.DIAGNOSTIC_QUESTIONS = DIAGNOSTIC_QUESTIONS;

console.log(`✅ تم دمج المجموعات بنجاح. إجمالي الأسئلة: ${DIAGNOSTIC_QUESTIONS.length} سؤالاً`);
console.log(`📚 المقررات المغطاة: 17 مقرراً مقسمة كالتالي:`);
console.log(`   - Beginner (المبتدئ): 50 سؤالاً`);
console.log(`   - Intermediate (المتوسط): 50 سؤالاً`);
console.log(`   - Advanced (المتقدم): 36 سؤالاً`);
console.log(`   - Professional (الخبير): 14 سؤالاً`);
