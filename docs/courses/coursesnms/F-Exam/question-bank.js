/*
 * بنك أسئلة تخصص علوم الحاسب التطبيقي.
 * المرحلة الأولى: البيانات الوصفية فقط. لا يحتوي هذا الملف على أسئلة تدريبية.
 * لا يضاف سؤال إلا بعد توثيق مصدره في الحقل source.
 */
(function (global) {
  "use strict";

  const questionSchema = Object.freeze({
    id: "معرّف فريد، مثال: computer-applications-001",
    courseId: "معرّف المقرر",
    topic: "موضوع من topics",
    difficulty: "easy | medium | hard",
    source: "مرجع موثق للسؤال: وثيقة/قسم/صفحة أو رابط",
    prompt: "نص السؤال",
    options: "مصفوفة من أربعة خيارات",
    correctAnswer: "فهرس الخيار الصحيح من 0 إلى 3",
    explanation: "شرح مختصر ومسنود إلى المصدر"
  });

  const courses = [
  {
    "id": "computer-applications",
    "nameAr": "مقدمة تطبيقات الحاسب",
    "nameEn": "Introduction to Computer Applications",
    "status": "needs-content",
    "statusMessage": "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.",
    "topics": [
      "بنية الحاسب",
      "نظام التشغيل Windows",
      "معالجة النصوص",
      "الجداول الإلكترونية",
      "العروض التقديمية",
      "استخدام الإنترنت والبريد الإلكتروني"
    ],
    "questions": []
  },
  {
    "id": "computer-assembly",
    "nameAr": "تجميع الحاسب وتشغيله",
    "nameEn": "Computer Assembly and Operation",
    "status": "needs-content",
    "statusMessage": "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.",
    "topics": [
      "إجراءات السلامة والأدوات",
      "مكونات الحاسب",
      "التجميع خطوة بخطوة",
      "BIOS والتشغيل",
      "التخزين والتهيئة",
      "الصيانة والتشخيص"
    ],
    "questions": []
  },
  {
    "id": "operating-systems",
    "nameAr": "نظم التشغيل",
    "nameEn": "Operating System 1",
    "status": "needs-content",
    "statusMessage": "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.",
    "topics": [
      "مفاهيم وأنواع نظم التشغيل",
      "تكوين النظام",
      "الملفات والطابعات المشتركة",
      "إدارة البرامج والأجهزة",
      "صيانة النظام",
      "المستخدمون والمجموعات"
    ],
    "questions": []
  },
  {
    "id": "systems-analysis",
    "nameAr": "تحليل وتصميم النظم",
    "nameEn": "Systems Analysis and Design",
    "status": "needs-content",
    "statusMessage": "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.",
    "topics": [
      "محلل النظم وأدواره",
      "دورة حياة تطوير النظام",
      "تحديد المشروع",
      "إدارة عمليات الأعمال",
      "متطلبات العمل",
      "طلب النظام"
    ],
    "questions": []
  },
  {
    "id": "information-technology",
    "nameAr": "أساسيات تقنية المعلومات",
    "nameEn": "Fundamentals of Information Technology",
    "status": "needs-content",
    "statusMessage": "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.",
    "topics": [
      "مفهوم تقنية المعلومات",
      "الأجهزة والحاسبات",
      "الاتصالات عن بعد",
      "بنية المعلومات والبرامج",
      "تحليل الأنظمة وتصميمها",
      "جمع المعلومات التقنية"
    ],
    "questions": []
  },
  {
    "id": "advanced-internet",
    "nameAr": "تقنيات الإنترنت المتقدمة",
    "nameEn": "Advanced Internet Technologies",
    "status": "needs-content",
    "statusMessage": "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.",
    "topics": [
      "ASP",
      "المتغيرات والإجراءات",
      "Forms",
      "Cookies وSession",
      "Application وGlobal.asa",
      "ASP ADO"
    ],
    "questions": []
  },
  {
    "id": "website-development",
    "nameAr": "تطوير وإدارة المواقع",
    "nameEn": "Website Development and Management",
    "status": "needs-content",
    "statusMessage": "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.",
    "topics": [
      "إدارة مواقع الإنترنت",
      "دور مدير الموقع",
      "البرمجة والإدارة المتقدمة",
      "قواعد بيانات الويب",
      "تطبيقات إدارة المواقع",
      "تقديم المعلومات والخدمات"
    ],
    "questions": []
  },
  {
    "id": "artificial-intelligence",
    "nameAr": "الذكاء الاصطناعي",
    "nameEn": "Artificial Intelligence",
    "status": "needs-content",
    "statusMessage": "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.",
    "topics": [
      "مبادئ الذكاء الاصطناعي",
      "الوكلاء والبيئات",
      "النظم الخبيرة والمنطق الضبابي",
      "معالجة اللغة الطبيعية",
      "تعلم الآلة والشبكات العصبية",
      "الروبوتات والبيانات الضخمة"
    ],
    "questions": []
  }
];

  const integrationTest = Object.freeze({
    id: "integration-test",
    nameAr: "الاختبار التكاملي للتخصص",
    nameEn: "Specialization Integration Test",
    status: "needs-content",
    statusMessage: "قيد استكمال بنك الأسئلة التخصصي",
    targetQuestionCount: 60,
    includedCourseIds: courses.map((course) => course.id),
    topics: courses.map((course) => course.nameAr),
    questions: []
  });

  function getCourse(courseId) {
    return courses.find((course) => course.id === courseId) || null;
  }

  global.SpecializationQuestionBank = Object.freeze({
    version: "1.0.0-phase-1",
    questionSchema,
    courses,
    integrationTest,
    getCourse
  });
}(window));
