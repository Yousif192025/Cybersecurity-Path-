// videos.js
// بيانات الفيديوهات التعليمية لـ CyberPath
// يمكن تحديث هذا الملف بسهولة عبر GitHub

const cyberPathVideos = {
  // معلومات عامة عن المكتبة
  meta: {
    lastUpdated: "2023-11-15",
    totalVideos: 0, // سيتم تحديثه تلقائياً
    tracks: [] // سيتم تحديثه تلقائياً
  },
  
  // مسارات التعلم
  tracks: [
    {
      id: "network_security",
      name: "أمن الشبكات",
      description: "تعلم أساسيات حماية الشبكات والبنية التحتية للأنظمة",
      icon: "🌐",
      color: "blue"
    },
    {
      id: "penetration_testing",
      name: "الاختبار الاختراقي",
      description: "تعلم تقنيات الاختبار الاختراقي الأخلاقي واكتشاف الثغرات",
      icon: "🔍",
      color: "red"
    },
    {
      id: "operating_systems",
      name: "نظم التشغيل",
      description: "فهم أنظمة التشغيل وإدارتها وتأمينها",
      icon: "💻",
      color: "green"
    },
    {
      id: "cyber_forensics",
      name: "التحقيق الرقمي",
      description: "تقنيات التحقيق في الجرائم الإلكترونية وجمع الأدلة الرقمية",
      icon: "🔬",
      color: "purple"
    },
    {
      id: "secure_coding",
      name: "التشفير والبرمجة الآمنة",
      description: "مبادئ التشفير وتطوير تطبيقات آمنة",
      icon: "🔒",
      color: "yellow"
    }
  ],
  
  // المقررات الدراسية
  courses: [
    {
      id: "netsec_basics",
      name: "أساسيات أمن الشبكات",
      trackId: "network_security",
      description: "مقدمة شاملة لمفاهيم أمن الشبكات والتقنيات الأساسية",
      level: "مبتدئ",
      duration: "8 ساعات"
    },
    {
      id: "network_protocols",
      name: "بروتوكولات الشبكات",
      trackId: "network_security",
      description: "فهم بروتوكولات الشبكات الشائعة وثغراتها الأمنية",
      level: "متوسط",
      duration: "10 ساعات"
    },
    {
      id: "pentest_methodology",
      name: "منهجية الاختبار الاختراقي",
      trackId: "penetration_testing",
      description: "تعلم الخطوات المنهجية للاختبار الاختراقي",
      level: "مبتدئ",
      duration: "6 ساعات"
    },
    {
      id: "web_pentesting",
      name: "اختبار اختراق الويب",
      trackId: "penetration_testing",
      description: "اكتشاف ثغرات تطبيقات الويب واختبار اختراقها",
      level: "متوسط",
      duration: "12 ساعة"
    },
    {
      id: "linux_basics",
      name: "أساسيات لينكس",
      trackId: "operating_systems",
      description: "تعلم أساسيات نظام لينكس وإدارة الملفات والأوامر",
      level: "مبتدئ",
      duration: "5 ساعات"
    },
    {
      id: "windows_security",
      name: "أمن أنظمة ويندوز",
      trackId: "operating_systems",
      description: "تأمين أنظمة ويندوز وإدارة الصلاحيات والسياسات",
      level: "متوسط",
      duration: "7 ساعات"
    },
    {
      id: "digital_evidence",
      name: "جمع الأدلة الرقمية",
      trackId: "cyber_forensics",
      description: "تقنيات جمع الأدلة الرقمية والحفاظ على سلامتها",
      level: "متوسط",
      duration: "9 ساعات"
    },
    {
      id: "cryptography_basics",
      name: "أساسيات التشفير",
      trackId: "secure_coding",
      description: "مقدمة لأنواع التشفير والخوارزميات المشهورة",
      level: "مبتدئ",
      duration: "6 ساعات"
    }
  ],
  
  // الفيديوهات التعليمية
  videos: [
    {
      id: "vid_001",
      title: "مقدمة في أمن الشبكات",
      description: "نظرة عامة على مفاهيم أمن الشبكات وأهميتها في العصر الرقمي",
      youtubeId: "dQw4w9WgXcQ", // مثال - يمكن استبداله بروابط حقيقية
      duration: "15:30",
      courseId: "netsec_basics",
      trackId: "network_security",
      tags: ["مقدمة", "أساسيات", "تعريفات"],
      dateAdded: "2023-10-01",
      instructor: "أحمد محمد"
    },
    {
      id: "vid_002",
      title: "أنواع الهجمات الشبكية",
      description: "تعرف على أشهر أنواع الهجمات التي تستهدف الشبكات وكيفية الوقاية منها",
      youtubeId: "dQw4w9WgXcQ",
      duration: "22:10",
      courseId: "netsec_basics",
      trackId: "network_security",
      tags: ["هجمات", "حماية", "DDoS"],
      dateAdded: "2023-10-05",
      instructor: "أحمد محمد"
    },
    {
      id: "vid_003",
      title: "ما هو الاختبار الاختراقي؟",
      description: "مقدمة شاملة للاختبار الاختراقي الأخلاقي وأهدافه",
      youtubeId: "dQw4w9WgXcQ",
      duration: "18:45",
      courseId: "pentest_methodology",
      trackId: "penetration_testing",
      tags: ["مقدمة", "أخلاقي", "منهجية"],
      dateAdded: "2023-10-10",
      instructor: "سارة خالد"
    },
    {
      id: "vid_004",
      title: "مراحل الاختبار الاختراقي",
      description: "شرح مفصّل للمراحل الخمس الرئيسية للاختبار الاختراقي",
      youtubeId: "dQw4w9WgXcQ",
      duration: "25:20",
      courseId: "pentest_methodology",
      trackId: "penetration_testing",
      tags: ["مراحل", "استكشاف", "اختبار"],
      dateAdded: "2023-10-12",
      instructor: "سارة خالد"
    },
    {
      id: "vid_005",
      title: "مقدمة في نظام لينكس",
      description: "تعرف على نظام لينكس ومميزاته واستخداماته في الأمن السيبراني",
      youtubeId: "dQw4w9WgXcQ",
      duration: "20:15",
      courseId: "linux_basics",
      trackId: "operating_systems",
      tags: ["لينكس", "مقدمة", "أنظمة مفتوحة المصدر"],
      dateAdded: "2023-10-15",
      instructor: "خالد حسن"
    },
    {
      id: "vid_006",
      title: "الأوامر الأساسية في لينكس",
      description: "تعلم أهم الأوامر التي تحتاجها للتعامل مع نظام لينكس",
      youtubeId: "dQw4w9WgXcQ",
      duration: "32:40",
      courseId: "linux_basics",
      trackId: "operating_systems",
      tags: ["أوامر", "طرفية", "ملفات"],
      dateAdded: "2023-10-18",
      instructor: "خالد حسن"
    },
    {
      id: "vid_007",
      title: "أساسيات التشفير",
      description: "مقدمة لمبادئ التشفير وأنواعه واستخداماته في حماية البيانات",
      youtubeId: "dQw4w9WgXcQ",
      duration: "28:50",
      courseId: "cryptography_basics",
      trackId: "secure_coding",
      tags: ["تشفير", "أمان", "خوارزميات"],
      dateAdded: "2023-10-20",
      instructor: "فاطمة علي"
    },
    {
      id: "vid_008",
      title: "جمع الأدلة الرقمية",
      description: "كيفية جمع الأدلة الرقمية بشكل صحيح مع الحفاظ على سلامتها القانونية",
      youtubeId: "dQw4w9WgXcQ",
      duration: "35:15",
      courseId: "digital_evidence",
      trackId: "cyber_forensics",
      tags: ["تحقيق", "أدلة", "قانوني"],
      dateAdded: "2023-10-22",
      instructor: "عمر ناصر"
    },
    {
      id: "vid_009",
      title: "بروتوكول TCP/IP",
      description: "شرح مفصل لبروتوكول TCP/IP وطبقاته وثغراته الأمنية",
      youtubeId: "dQw4w9WgXcQ",
      duration: "40:25",
      courseId: "network_protocols",
      trackId: "network_security",
      tags: ["بروتوكولات", "TCP", "IP"],
      dateAdded: "2023-10-25",
      instructor: "أحمد محمد"
    },
    {
      id: "vid_010",
      title: "ثغرات الويب الشائعة",
      description: "تعرف على أشهر ثغرات تطبيقات الويب وكيفية استغلالها",
      youtubeId: "dQw4w9WgXcQ",
      duration: "38:10",
      courseId: "web_pentesting",
      trackId: "penetration_testing",
      tags: ["ويب", "ثغرات", "SQLi", "XSS"],
      dateAdded: "2023-10-28",
      instructor: "سارة خالد"
    },
    {
      id: "vid_011",
      title: "تأمين نظام ويندوز",
      description: "خطوات عملية لتأمين أنظمة ويندوز ضد الهجمات الشائعة",
      youtubeId: "dQw4w9WgXcQ",
      duration: "29:45",
      courseId: "windows_security",
      trackId: "operating_systems",
      tags: ["ويندوز", "تأمين", "سياسات"],
      dateAdded: "2023-11-01",
      instructor: "خالد حسن"
    },
    {
      id: "vid_012",
      title: "التشفير المتماثل والغير متماثل",
      description: "مقارنة بين نوعي التشفير الرئيسيين واستخدامات كل منهما",
      youtubeId: "dQw4w9WgXcQ",
      duration: "33:20",
      courseId: "cryptography_basics",
      trackId: "secure_coding",
      tags: ["تشفير", "متماثل", "غير متماثل", "RSA"],
      dateAdded: "2023-11-05",
      instructor: "فاطمة علي"
    }
  ]
};

// تحديث البيانات الوصفية تلقائياً
cyberPathVideos.meta.totalVideos = cyberPathVideos.videos.length;
cyberPathVideos.meta.tracks = cyberPathVideos.tracks.map(track => track.name);

// تصدير البيانات للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cyberPathVideos;
}
