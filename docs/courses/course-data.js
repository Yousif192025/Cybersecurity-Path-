const coursesData = [
    {
        quarter: 'الربع التدريبي الأول',
        code: 'Q1',
        courses: [
            {
                id: 'career_guidance',
                name: 'التوجيه المهني',
                description: 'مقدمة في التوجيه المهني والسلوكيات المطلوبة في بيئة العمل.',
                objectives: [
                    'التعرف على مبادئ السلوك المهني',
                    'تطوير مهارات تحديد الأهداف المهنية'
                ],
                units: [
                    { title: 'الوحدة 1: مفاهيم التوجيه المهني', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: التخطيط الوظيفي والمسار المهني', file: 'unit2.pdf' }
                ],
                references: ['دليل التوجيه المهني - المؤسسة العامة للتدريب التقني']
            },
            {
                id: 'technical_writing_1',
                name: 'الكتابة الفنية',
                description: 'تعلم مهارات كتابة التقارير والمستندات الفنية بشكل احترافي.',
                objectives: [
                    'كتابة تقارير فنية واضحة ودقيقة',
                    'تنظيم المعلومات واستخدام التنسيقات المناسبة'
                ],
                units: [
                    { title: 'الوحدة 1: المبادئ العامة للكتابة الفنية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: هيكلة التقارير الفنية', file: 'unit2.pdf' }
                ],
                references: ['أساسيات الكتابة الفنية - دليل المعهد']
            },
            {
                id: 'intro_computer_apps',
                name: 'مقدمة تطبيقات الحاسب',
                description: 'مقدمة في استخدام الحاسب الآلي وبرامج الأوفيس الأساسية.',
                objectives: [
                    'استخدام برامج معالجة النصوص والجداول والعروض التقديمية',
                    'فهم أنظمة التشغيل الأساسية'
                ],
                units: [
                    { title: 'الوحدة 1: نظام التشغيل Windows', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: برنامج Word وExcel وPowerPoint', file: 'unit2.pdf' }
                ],
                references: ['سلسلة ميكروسوفت أوفيس التدريبية']
            },
            {
                id: 'technical_writing_2',
                name: 'الكتابة الفنية (2)',
                description: 'توسيع مهارات الكتابة الفنية لتشمل التوثيق المتقدم والعروض التقديمية.',
                objectives: [
                    'صياغة الوثائق التقنية المعقدة',
                    'عرض المعلومات التقنية بفعالية'
                ],
                units: [
                    { title: 'الوحدة 1: التوثيق الفني المتقدم', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: مهارات العرض والشرح', file: 'unit2.pdf' }
                ],
                references: ['دليل التوثيق التقني - المؤسسة']
            }
        ]
    },
    {
        quarter: 'الربع التدريبي الثاني',
        code: 'Q2',
        courses: [
            {
                id: 'cyber_basics',
                name: 'أساسيات الأمن السيبراني',
                description: 'مفاهيم ومبادئ الأمن السيبراني والتهديدات الشائعة.',
                objectives: [
                    'فهم مفهوم الأمن السيبراني',
                    'تمييز أنواع التهديدات والثغرات'
                ],
                units: [
                    { title: 'الوحدة 1: مفاهيم الأمن السيبراني', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: أنواع الهجمات السيبرانية', file: 'unit2.pdf' }
                ],
                references: ['مقدمة في الأمن السيبراني - هيئة الأمن السيبراني']
            },
            {
                id: 'networking_basics',
                name: 'مبادئ شبكات الحاسب',
                description: 'أساسيات شبكات الحاسب والبروتوكولات المستخدمة.',
                objectives: [
                    'فهم مكونات الشبكة المحلية',
                    'التعرف على بروتوكولات TCP/IP'
                ],
                units: [
                    { title: 'الوحدة 1: طبقات الشبكة', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: أجهزة الشبكة والبروتوكولات', file: 'unit2.pdf' }
                ],
                references: ['شبكات الحاسب للمبتدئين - سيسكو']
            },
            {
                id: 'english_1',
                name: 'لغة إنجليزية -1',
                description: 'أساسيات اللغة الإنجليزية العامة للمستوى المبتدئ.',
                objectives: [
                    'فهم القواعد الأساسية للغة الإنجليزية',
                    'بناء جمل بسيطة ومحادثات أساسية'
                ],
                units: [
                    { title: 'الوحدة 1: المحادثة الأساسية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: القواعد والمفردات', file: 'unit2.pdf' }
                ],
                references: ['English for Beginners - المستوى الأول']
            }
        ]
    },
    {
        quarter: 'الربع التدريبي الثالث',
        code: 'Q3',
        courses: [
            {
                id: 'advanced_computer_apps',
                name: 'تطبيقات الحاسب المتقدمة',
                description: 'تطبيقات متقدمة في برامج الأوفيس وقواعد البيانات.',
                objectives: [
                    'استخدام دوال Excel المتقدمة',
                    'إنشاء قواعد بيانات بسيطة'
                ],
                units: [
                    { title: 'الوحدة 1: Excel المتقدم', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: إنشاء قاعدة بيانات', file: 'unit2.pdf' }
                ],
                references: ['دليل تطبيقات أوفيس المتقدمة']
            },
            {
                id: 'os',
                name: 'نظم التشغيل',
                description: 'مفاهيم نظم التشغيل وأنواعها وآلية عملها.',
                objectives: [
                    'فهم بنية نظم التشغيل',
                    'إدارة الموارد والعمليات'
                ],
                units: [
                    { title: 'الوحدة 1: مقدمة في نظم التشغيل', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: إدارة العمليات والذاكرة', file: 'unit2.pdf' }
                ],
                references: ['Operating Systems Concepts - Silberschatz']
            },
            {
                id: 'english_2',
                name: 'لغة إنجليزية -2',
                description: 'توسيع المهارات اللغوية إلى مستوى ما قبل المتوسط.',
                objectives: [
                    'قراءة وفهم نصوص بسيطة',
                    'كتابة فقرة قصيرة باللغة الإنجليزية'
                ],
                units: [
                    { title: 'الوحدة 1: مهارات القراءة', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: مهارات الكتابة', file: 'unit2.pdf' }
                ],
                references: ['English for Everyday Use - المستوى الثاني']
            }
        ]
    },
    {
        quarter: 'الربع التدريبي الرابع',
        code: 'Q4',
        courses: [
            {
                id: 'infosec_mgmt',
                name: 'إدارة أمن المعلومات',
                description: 'مبادئ حماية المعلومات وإدارتها في المؤسسات.',
                objectives: [
                    'تطبيق سياسات أمن المعلومات',
                    'تحليل المخاطر ووضع حلول الحماية'
                ],
                units: [
                    { title: 'الوحدة 1: سياسات أمن المعلومات', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: إدارة الحوادث والمخاطر', file: 'unit2.pdf' }
                ],
                references: ['ISO 27001 - أمن المعلومات']
            },
            {
                id: 'programming',
                name: 'برمجة الحاسب',
                description: 'أساسيات البرمجة باستخدام إحدى اللغات البرمجية الشائعة.',
                objectives: [
                    'فهم المنطق البرمجي وبناء الخوارزميات',
                    'كتابة برامج بسيطة بلغات C أو Python'
                ],
                units: [
                    { title: 'الوحدة 1: أساسيات البرمجة', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: كتابة وتنفيذ الأكواد', file: 'unit2.pdf' }
                ],
                references: ['Introduction to Programming - Python Basics']
            },
            {
                id: 'algorithms',
                name: 'الخوارزميات والمنطق',
                description: 'فهم التفكير المنطقي وتصميم الحلول باستخدام الخوارزميات.',
                objectives: [
                    'تحليل المشكلات باستخدام المخططات',
                    'تطبيق خطوات الحل الخوارزمي'
                ],
                units: [
                    { title: 'الوحدة 1: الخوارزميات الأساسية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: منطق الحل البرمجي', file: 'unit2.pdf' }
                ],
                references: ['Algorithms for Beginners']
            }
        ]
    },
    {
        quarter: 'الربع التدريبي الخامس',
        code: 'Q5',
        courses: [
            {
                id: 'professional_behavior',
                name: 'السلوك الوظيفي',
                description: 'أخلاقيات العمل والتواصل المهني في بيئة العمل.',
                objectives: [
                    'بناء علاقات مهنية ناجحة',
                    'الالتزام بالسلوك الأخلاقي داخل المؤسسة'
                ],
                units: [
                    { title: 'الوحدة 1: المبادئ العامة للسلوك', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: العمل ضمن فريق', file: 'unit2.pdf' }
                ],
                references: ['دليل السلوك الوظيفي']
            },
            {
                id: 'os_security',
                name: 'أمن أنظمة التشغيل',
                description: 'حماية أنظمة التشغيل من الاختراق والثغرات.',
                objectives: [
                    'تأمين نظام Windows وLinux',
                    'فهم Permissions والجدران النارية'
                ],
                units: [
                    { title: 'الوحدة 1: تأمين النظام', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: إدارة التحديثات والجدار الناري', file: 'unit2.pdf' }
                ],
                references: ['Hardening Operating Systems']
            },
            {
                id: 'secure_software_dev',
                name: 'تطوير البرمجيات الآمنة',
                description: 'كتابة برمجيات آمنة وخالية من الثغرات.',
                objectives: [
                    'تطبيق مبادئ SDLC الآمن',
                    'تحليل التهديدات ومعالجة الثغرات'
                ],
                units: [
                    { title: 'الوحدة 1: البرمجة الآمنة', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: تحليل الثغرات الشائعة', file: 'unit2.pdf' }
                ],
                references: ['OWASP Secure Coding Guide']
            },
            {
                id: 'english_3',
                name: 'لغة إنجليزية -3',
                description: 'المستوى المتوسط من اللغة الإنجليزية التقنية.',
                objectives: [
                    'قراءة نصوص تقنية متوسطة',
                    'إجراء محادثات مهنية'
                ],
                units: [
                    { title: 'الوحدة 1: اللغة التقنية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: الرسائل والمراسلات المهنية', file: 'unit2.pdf' }
                ],
                references: ['English for IT - المستوى الثالث']
            }
        ]
    },
    {
        quarter: 'الربع التدريبي السادس',
        code: 'Q6',
        courses: [
            {
                id: 'learning_skills',
                name: 'مهارات التعلم',
                description: 'استراتيجيات وتقنيات التعلم الذاتي والفعال.',
                objectives: [
                    'تنظيم الوقت والتخطيط الدراسي',
                    'تنمية مهارات التفكير والتحليل'
                ],
                units: [
                    { title: 'الوحدة 1: استراتيجيات التعلم', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: مهارات التفكير', file: 'unit2.pdf' }
                ],
                references: ['دليل المتدرب - مهارات التعلم']
            },
            {
                id: 'ethical_hacking',
                name: 'الاختراق الأخلاقي وأساليب الحماية',
                description: 'مقدمة إلى اختبار الاختراق والأدوات المستخدمة في الحماية.',
                objectives: [
                    'فهم مراحل اختبار الاختراق',
                    'استخدام أدوات كشف الثغرات'
                ],
                units: [
                    { title: 'الوحدة 1: مقدمة في الاختراق الأخلاقي', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: أدوات Kali Linux', file: 'unit2.pdf' }
                ],
                references: ['CEH - Certified Ethical Hacker Guide']
            },
            {
                id: 'network_security',
                name: 'أمن الشبكات والاتصالات',
                description: 'حماية الشبكات من التهديدات السيبرانية.',
                objectives: [
                    'تحليل بروتوكولات الحماية',
                    'تأمين الاتصالات والبيانات'
                ],
                units: [
                    { title: 'الوحدة 1: أمن الشبكات', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: التشفير والVPN', file: 'unit2.pdf' }
                ],
                references: ['Network Security Essentials - William Stallings']
            },
            {
                id: 'islamic_studies',
                name: 'الدراسات الإسلامية',
                description: 'مدخل إلى القيم الإسلامية والأخلاقيات العامة.',
                objectives: [
                    'فهم الأخلاق الإسلامية',
                    'تطبيق المبادئ في الحياة اليومية'
                ],
                units: [
                    { title: 'الوحدة 1: القيم الإسلامية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: السلوك في العمل', file: 'unit2.pdf' }
                ],
                references: ['المدخل إلى الثقافة الإسلامية']
            }
        ]
    },
    {
        quarter: 'الربع التدريبي السابع',
        code: 'Q7',
        courses: [
            {
                id: 'applied_cryptography',
                name: 'التشفير التطبيقي',
                description: 'فهم خوارزميات التشفير وتطبيقها العملي.',
                objectives: [
                    'استخدام التشفير المتماثل واللامتماثل',
                    'تأمين البيانات باستخدام الشهادات الرقمية'
                ],
                units: [
                    { title: 'الوحدة 1: AES وRSA', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: التوقيع الرقمي', file: 'unit2.pdf' }
                ],
                references: ['Applied Cryptography - Bruce Schneier']
            },
            {
                id: 'iot_security',
                name: 'إنترنت الأشياء الآمنة',
                description: 'تأمين الأجهزة الذكية وتقنيات الـ IoT.',
                objectives: [
                    'تحليل نقاط الضعف في الأجهزة الذكية',
                    'تصميم حلول حماية لإنترنت الأشياء'
                ],
                units: [
                    { title: 'الوحدة 1: مقدمة في IoT', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: مخاطر وحلول الحماية', file: 'unit2.pdf' }
                ],
                references: ['IoT Security Handbook']
            },
            {
                id: 'risk_management',
                name: 'إدارة المخاطر والاستجابة للحوادث',
                description: 'تقييم المخاطر السيبرانية وإجراءات الاستجابة.',
                objectives: [
                    'تحديد وتصنيف المخاطر',
                    'تخطيط الاستجابة للحوادث'
                ],
                units: [
                    { title: 'الوحدة 1: تقييم وتحليل المخاطر', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: إدارة الحوادث السيبرانية', file: 'unit2.pdf' }
                ],
                references: ['NIST Risk Management Framework']
            }
        ]
    },
    {
        quarter: 'الربع التدريبي الثامن',
        code: 'Q8',
        courses: [
            {
                id: 'cyber_law_ethics',
                name: 'الأخلاق والقانون السيبراني',
                description: 'فهم الأنظمة والتشريعات المتعلقة بالأمن السيبراني.',
                objectives: [
                    'التمييز بين الممارسات القانونية وغير القانونية',
                    'تطبيق أخلاقيات التعامل الرقمي'
                ],
                units: [
                    { title: 'الوحدة 1: الجرائم السيبرانية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: القوانين والسياسات المحلية', file: 'unit2.pdf' }
                ],
                references: ['Cyber Law and Ethics Handbook']
            },
            {
                id: 'cloud_security',
                name: 'الحوسبة السحابية وأمن المحاكاة الافتراضية',
                description: 'تأمين بيئات الحوسبة السحابية والخوادم الافتراضية.',
                objectives: [
                    'فهم نماذج الخدمات السحابية',
                    'تطبيق تقنيات الحماية في البيئة السحابية'
                ],
                units: [
                    { title: 'الوحدة 1: مفاهيم الحوسبة السحابية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: الحماية في بيئات VM', file: 'unit2.pdf' }
                ],
                references: ['Cloud Security Alliance (CSA) Guide']
            },
            {
                id: 'advanced_web_tech',
                name: 'تقنيات الإنترنت المتقدمة',
                description: 'بناء التطبيقات الحديثة باستخدام تقنيات الويب المتقدمة.',
                objectives: [
                    'تصميم واجهات متقدمة',
                    'استخدام JavaScript وAPIs'
                ],
                units: [
                    { title: 'الوحدة 1: تطوير الواجهة الأمامية', file: 'unit1.pdf' },
                    { title: 'الوحدة 2: ربط APIs وتطبيقات SPA', file: 'unit2.pdf' }
                ],
                references: ['Modern Web Development Guide']
            },
            {
                id: 'graduation_project',
                name: 'مشروع التخرج',
                description: 'تنفيذ مشروع تطبيقي نهائي يدمج جميع المهارات المكتسبة.',
                objectives: [
                    'تحليل وتصميم وتنفيذ مشروع أمني',
                    'عرض النتائج بشكل مهني'
                ],
                units: [
                    { title: 'المرحلة 1:
