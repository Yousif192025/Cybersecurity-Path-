// videos.js
// بيانات الفيديوهات التعليمية الموسعة لـ CyberPath - منصة مسار الأمن السيبراني
// يمكن تحديث هذا الملف بسهولة عبر GitHub

const cyberPathVideos = {
  // معلومات عامة عن المكتبة
  meta: {
    lastUpdated: "2024-01-15",
    totalVideos: 0, // سيتم تحديثه تلقائياً
    totalCourses: 0, // سيتم تحديثه تلقائياً
    totalTracks: 0, // سيتم تحديثه تلقائياً
    tracks: [] // سيتم تحديثه تلقائياً
  },
  
  // مسارات التعلم الموسعة
  tracks: [
    // 🎯 الأمن السيبراني الأساسي
    {
      id: "cybersecurity_fundamentals",
      name: "أساسيات الأمن السيبراني",
      description: "المفاهيم الأساسية والأساسية في مجال الأمن السيبراني",
      icon: "🛡️",
      color: "blue",
      category: "الأمن السيبراني"
    },
    
    // 🔐 الأمن السيبراني المتقدم
    {
      id: "soc_blue_team",
      name: "SOC & Blue Team",
      description: "عمليات مركز عمليات الأمن وفريق الدفاع الأزرق",
      icon: "🚨",
      color: "indigo",
      category: "الأمن السيبراني"
    },
    {
      id: "malware_analysis",
      name: "تحليل البرمجيات الخبيثة",
      description: "تقنيات تحليل وفهم البرمجيات الخبيثة والبرمجيات الضارة",
      icon: "🦠",
      color: "red",
      category: "الأمن السيبراني"
    },
    {
      id: "cloud_security",
      name: "أمن السحابة",
      description: "تأمين البنى التحتية السحابية وتطبيقاتها",
      icon: "☁️",
      color: "sky",
      category: "الأمن السيبراني"
    },
    {
      id: "grc",
      name: "GRC (الحوكمة والمخاطر والامتثال)",
      description: "إدارة المخاطر والامتثال والحوكمة في الأمن السيبراني",
      icon: "⚖️",
      color: "purple",
      category: "الأمن السيبراني"
    },
    {
      id: "iam",
      name: "إدارة الهوية والصلاحيات (IAM)",
      description: "نظم إدارة الهويات والصلاحيات والوصول",
      icon: "🔑",
      color: "amber",
      category: "الأمن السيبراني"
    },
    {
      id: "mobile_security",
      name: "أمن الأجهزة المحمولة",
      description: "تأمين تطبيقات وأنظمة الأجهزة المحمولة",
      icon: "📱",
      color: "green",
      category: "الأمن السيبراني"
    },
    {
      id: "bug_bounty",
      name: "برامج مكافأة الثغرات",
      description: "مقدمة لبرامج Bug Bounty وتقنيات اكتشاف الثغرات",
      icon: "💰",
      color: "yellow",
      category: "الأمن السيبراني"
    },
    
    // 🧠 علوم الحاسب الأساسية
    {
      id: "cs_fundamentals",
      name: "أساسيات علوم الحاسب",
      description: "المفاهيم الأساسية في علوم الحاسب والبرمجة",
      icon: "🧠",
      color: "blue",
      category: "علوم الحاسب"
    },
    {
      id: "programming",
      name: "البرمجة",
      description: "تعلم لغات البرمجة والتطوير البرمجي",
      icon: "💻",
      color: "green",
      category: "علوم الحاسب"
    },
    {
      id: "data_structures",
      name: "هياكل البيانات والخوارزميات",
      description: "تصميم وتحليل هياكل البيانات والخوارزميات",
      icon: "📊",
      color: "purple",
      category: "علوم الحاسب"
    },
    {
      id: "databases",
      name: "قواعد البيانات",
      description: "تصميم وإدارة قواعد البيانات بأنواعها",
      icon: "🗃️",
      color: "indigo",
      category: "علوم الحاسب"
    },
    {
      id: "web_development",
      name: "تطوير الويب",
      description: "تطوير تطبيقات ومواقع الويب الحديثة",
      icon: "🌐",
      color: "pink",
      category: "علوم الحاسب"
    },
    {
      id: "devops",
      name: "DevOps",
      description: "ممارسات DevOps والأتمتة والتكامل المستمر",
      icon: "🔄",
      color: "orange",
      category: "علوم الحاسب"
    },
    {
      id: "ai_ml",
      name: "الذكاء الاصطناعي وتعلم الآلة",
      description: "مقدمة في الذكاء الاصطناعي وتعلم الآلة",
      icon: "🤖",
      color: "teal",
      category: "علوم الحاسب"
    },
    {
      id: "operating_systems_cs",
      name: "نظم التشغيل (علوم الحاسب)",
      description: "تصميم ومفاهيم أنظمة التشغيل المتقدمة",
      icon: "🖥️",
      color: "gray",
      category: "علوم الحاسب"
    },
    {
      id: "networking_cs",
      name: "شبكات الحاسب (علوم الحاسب)",
      description: "مفاهيم الشبكات المتقدمة وبروتوكولاتها",
      icon: "📡",
      color: "blue",
      category: "علوم الحاسب"
    },
    
    // 🔍 الأمن السيبراني التخصصي
    {
      id: "network_security",
      name: "أمن الشبكات",
      description: "تعلم أساسيات حماية الشبكات والبنية التحتية للأنظمة",
      icon: "🌐",
      color: "blue",
      category: "الأمن السيبراني"
    },
    {
      id: "penetration_testing",
      name: "الاختبار الاختراقي",
      description: "تعلم تقنيات الاختبار الاختراقي الأخلاقي واكتشاف الثغرات",
      icon: "🔍",
      color: "red",
      category: "الأمن السيبراني"
    },
    {
      id: "cyber_forensics",
      name: "التحقيق الرقمي",
      description: "تقنيات التحقيق في الجرائم الإلكترونية وجمع الأدلة الرقمية",
      icon: "🔬",
      color: "purple",
      category: "الأمن السيبراني"
    },
    {
      id: "secure_coding",
      name: "التشفير والبرمجة الآمنة",
      description: "مبادئ التشفير وتطوير تطبيقات آمنة",
      icon: "🔒",
      color: "yellow",
      category: "الأمن السيبراني"
    },
    {
      id: "operating_systems_security",
      name: "أمن نظم التشغيل",
      description: "فهم أنظمة التشغيل وإدارتها وتأمينها",
      icon: "💻",
      color: "green",
      category: "الأمن السيبراني"
    }
  ],
  
  // المقررات الدراسية الموسعة
  courses: [
    // 🎯 أساسيات الأمن السيبراني
    {
      id: "cyber_fundamentals",
      name: "مقدمة في الأمن السيبراني",
      trackId: "cybersecurity_fundamentals",
      description: "المفاهيم الأساسية والأطر المستخدمة في الأمن السيبراني",
      level: "مبتدئ",
      duration: "10 ساعات",
      prerequisites: []
    },
    {
      id: "security_principles",
      name: "مبادئ الأمن السيبراني",
      trackId: "cybersecurity_fundamentals",
      description: "مبادئ CIA والدفاع متعدد الطبقات وإدارة المخاطر",
      level: "مبتدئ",
      duration: "8 ساعات",
      prerequisites: ["cyber_fundamentals"]
    },
    
    // 🔐 SOC & Blue Team
    {
      id: "soc_operations",
      name: "عمليات مركز عمليات الأمن",
      trackId: "soc_blue_team",
      description: "إدارة ورصد وتفاعل مركز عمليات الأمن",
      level: "متوسط",
      duration: "15 ساعة",
      prerequisites: ["cyber_fundamentals"]
    },
    {
      id: "siem_tools",
      name: "أدوات SIEM وتحليل السجلات",
      trackId: "soc_blue_team",
      description: "استخدام أدوات SIEM وتحليل السجلات الأمنية",
      level: "متوسط",
      duration: "12 ساعة",
      prerequisites: ["soc_operations"]
    },
    
    // 🦠 تحليل البرمجيات الخبيثة
    {
      id: "malware_fundamentals",
      name: "أساسيات البرمجيات الخبيثة",
      trackId: "malware_analysis",
      description: "أنواع البرمجيات الخبيثة وطرق انتشارها",
      level: "متوسط",
      duration: "10 ساعات",
      prerequisites: ["cyber_fundamentals"]
    },
    {
      id: "reverse_engineering",
      name: "الهندسة العكسية للبرمجيات",
      trackId: "malware_analysis",
      description: "تقنيات الهندسة العكسية لتحليل البرمجيات",
      level: "متقدم",
      duration: "20 ساعة",
      prerequisites: ["malware_fundamentals"]
    },
    
    // ☁️ أمن السحابة
    {
      id: "cloud_fundamentals",
      name: "أساسيات الحوسبة السحابية",
      trackId: "cloud_security",
      description: "مفاهيم IaaS, PaaS, SaaS ونماذج النشر",
      level: "مبتدئ",
      duration: "8 ساعات",
      prerequisites: []
    },
    {
      id: "aws_security",
      name: "أمن AWS",
      trackId: "cloud_security",
      description: "تأمين خدمات وتطبيقات AWS",
      level: "متوسط",
      duration: "14 ساعة",
      prerequisites: ["cloud_fundamentals"]
    },
    {
      id: "azure_security",
      name: "أمن Microsoft Azure",
      trackId: "cloud_security",
      description: "تأمين بيئة Azure والحلول السحابية",
      level: "متوسط",
      duration: "14 ساعة",
      prerequisites: ["cloud_fundamentals"]
    },
    
    // ⚖️ GRC
    {
      id: "cyber_governance",
      name: "حوكمة الأمن السيبراني",
      trackId: "grc",
      description: "إطار عمل حوكمة الأمن السيبراني والسياسات",
      level: "متوسط",
      duration: "12 ساعة",
      prerequisites: ["security_principles"]
    },
    {
      id: "risk_management",
      name: "إدارة مخاطر الأمن السيبراني",
      trackId: "grc",
      description: "تقييم ومعالجة مخاطر الأمن السيبراني",
      level: "متوسط",
      duration: "10 ساعات",
      prerequisites: ["cyber_governance"]
    },
    
    // 🔑 IAM
    {
      id: "identity_fundamentals",
      name: "أساسيات إدارة الهوية",
      trackId: "iam",
      description: "مفاهيم إدارة الهوية والصلاحيات والوصول",
      level: "مبتدئ",
      duration: "6 ساعات",
      prerequisites: []
    },
    {
      id: "advanced_iam",
      name: "إدارة الهوية المتقدمة",
      trackId: "iam",
      description: "أنظمة IAM المتقدمة وتقنيات المصادقة",
      level: "متوسط",
      duration: "12 ساعة",
      prerequisites: ["identity_fundamentals"]
    },
    
    // 📱 أمن الأجهزة المحمولة
    {
      id: "mobile_platforms",
      name: "منصات الأجهزة المحمولة",
      trackId: "mobile_security",
      description: "أمن أنظمة iOS و Android والتطبيقات",
      level: "متوسط",
      duration: "10 ساعات",
      prerequisites: ["cyber_fundamentals"]
    },
    {
      id: "mobile_app_sec",
      name: "أمن تطبيقات الأجهزة المحمولة",
      trackId: "mobile_security",
      description: "اختبار اختراق وتأمين تطبيقات الموبايل",
      level: "متوسط",
      duration: "12 ساعة",
      prerequisites: ["mobile_platforms"]
    },
    
    // 💰 Bug Bounty
    {
      id: "bug_bounty_basics",
      name: "أساسيات Bug Bounty",
      trackId: "bug_bounty",
      description: "مقدمة لبرامج Bug Bounty والمنصات",
      level: "متوسط",
      duration: "8 ساعات",
      prerequisites: ["cyber_fundamentals"]
    },
    {
      id: "web_vulnerabilities",
      name: "ثغرات الويب المتقدمة",
      trackId: "bug_bounty",
      description: "اكتشاف واستغلال ثغرات الويب لبرامج Bug Bounty",
      level: "متقدم",
      duration: "15 ساعة",
      prerequisites: ["bug_bounty_basics"]
    },
    
    // 🧠 أساسيات علوم الحاسب
    {
      id: "cs_intro",
      name: "مقدمة في علوم الحاسب",
      trackId: "cs_fundamentals",
      description: "المفاهيم الأساسية في علوم الحاسب والمنطق الرقمي",
      level: "مبتدئ",
      duration: "12 ساعة",
      prerequisites: []
    },
    {
      id: "computer_architecture",
      name: "هندسة الحاسوب",
      trackId: "cs_fundamentals",
      description: "مكونات الحاسوب والمعالجات والذاكرة",
      level: "مبتدئ",
      duration: "10 ساعات",
      prerequisites: ["cs_intro"]
    },
    
    // 💻 البرمجة
    {
      id: "python_basics",
      name: "أساسيات بايثون",
      trackId: "programming",
      description: "تعلم لغة Python للمبتدئين",
      level: "مبتدئ",
      duration: "15 ساعة",
      prerequisites: []
    },
    {
      id: "java_fundamentals",
      name: "أساسيات جافا",
      trackId: "programming",
      description: "تعلم لغة Java وبرمجة الكائنات",
      level: "مبتدئ",
      duration: "18 ساعة",
      prerequisites: []
    },
    {
      id: "cpp_programming",
      name: "البرمجة بلغة C++",
      trackId: "programming",
      description: "تعلم لغة C++ والمؤشرات والذاكرة",
      level: "متوسط",
      duration: "20 ساعة",
      prerequisites: ["python_basics"]
    },
    
    // 📊 هياكل البيانات والخوارزميات
    {
      id: "ds_basics",
      name: "أساسيات هياكل البيانات",
      trackId: "data_structures",
      description: "المصفوفات، القوائم، المكدس، الطابور",
      level: "متوسط",
      duration: "15 ساعة",
      prerequisites: ["python_basics"]
    },
    {
      id: "algorithms_design",
      name: "تصميم الخوارزميات",
      trackId: "data_structures",
      description: "تحليل الخوارزميات والتعقيد الزمني",
      level: "متوسط",
      duration: "18 ساعة",
      prerequisites: ["ds_basics"]
    },
    
    // 🗃️ قواعد البيانات
    {
      id: "sql_fundamentals",
      name: "أساسيات SQL",
      trackId: "databases",
      description: "تعلم لغة SQL والاستعلامات الأساسية",
      level: "مبتدئ",
      duration: "10 ساعات",
      prerequisites: []
    },
    {
      id: "database_design",
      name: "تصميم قواعد البيانات",
      trackId: "databases",
      description: "التطبيع، النمذجة، وتصميم قواعد البيانات",
      level: "متوسط",
      duration: "12 ساعة",
      prerequisites: ["sql_fundamentals"]
    },
    {
      id: "nosql_databases",
      name: "قواعد البيانات NoSQL",
      trackId: "databases",
      description: "MongoDB، Redis، وغيرها من قواعد البيانات غير العلائقية",
      level: "متوسط",
      duration: "10 ساعات",
      prerequisites: ["database_design"]
    },
    
    // 🌐 تطوير الويب
    {
      id: "web_fundamentals",
      name: "أساسيات تطوير الويب",
      trackId: "web_development",
      description: "HTML، CSS، JavaScript للمبتدئين",
      level: "مبتدئ",
      duration: "20 ساعة",
      prerequisites: []
    },
    {
      id: "frontend_frameworks",
      name: "أطر عمل الواجهة الأمامية",
      trackId: "web_development",
      description: "React، Vue.js، Angular لتطوير الواجهات",
      level: "متوسط",
      duration: "25 ساعة",
      prerequisites: ["web_fundamentals"]
    },
    {
      id: "backend_development",
      name: "تطوير الواجهة الخلفية",
      trackId: "web_development",
      description: "Node.js، Express، وقواعد البيانات",
      level: "متوسط",
      duration: "22 ساعة",
      prerequisites: ["web_fundamentals"]
    },
    
    // 🔄 DevOps
    {
      id: "devops_intro",
      name: "مقدمة في DevOps",
      trackId: "devops",
      description: "مفاهيم DevOps والأتمتة والتكامل المستمر",
      level: "مبتدئ",
      duration: "10 ساعات",
      prerequisites: []
    },
    {
      id: "docker_kubernetes",
      name: "Docker و Kubernetes",
      trackId: "devops",
      description: "الحاويات والأوركسترا باستخدام Docker و Kubernetes",
      level: "متوسط",
      duration: "18 ساعة",
      prerequisites: ["devops_intro"]
    },
    {
      id: "ci_cd_pipelines",
      name: "خطوط أنابيب CI/CD",
      trackId: "devops",
      description: "بناء خطوط أنابيب التكامل والتسليم المستمر",
      level: "متوسط",
      duration: "15 ساعة",
      prerequisites: ["docker_kubernetes"]
    },
    
    // 🤖 الذكاء الاصطناعي وتعلم الآلة
    {
      id: "ai_fundamentals",
      name: "أساسيات الذكاء الاصطناعي",
      trackId: "ai_ml",
      description: "مقدمة في الذكاء الاصطناعي وتعلم الآلة",
      level: "مبتدئ",
      duration: "12 ساعة",
      prerequisites: ["python_basics"]
    },
    {
      id: "machine_learning",
      name: "تعلم الآلة",
      trackId: "ai_ml",
      description: "خوارزميات تعلم الآلة والتطبيقات العملية",
      level: "متوسط",
      duration: "20 ساعة",
      prerequisites: ["ai_fundamentals"]
    },
    {
      id: "deep_learning",
      name: "التعلم العميق",
      trackId: "ai_ml",
      description: "الشبكات العصبية والتعلم العميق",
      level: "متقدم",
      duration: "25 ساعة",
      prerequisites: ["machine_learning"]
    },
    
    // 🖥️ نظم التشغيل (علوم الحاسب)
    {
      id: "os_concepts",
      name: "مفاهيم نظم التشغيل",
      trackId: "operating_systems_cs",
      description: "إدارة العمليات، الذاكرة، الملفات في أنظمة التشغيل",
      level: "متوسط",
      duration: "15 ساعة",
      prerequisites: ["computer_architecture"]
    },
    {
      id: "linux_internals",
      name: "الهيكل الداخلي لنظام لينكس",
      trackId: "operating_systems_cs",
      description: "نواة لينكس، الأنظمة الفرعية، والبرمجة",
      level: "متقدم",
      duration: "18 ساعة",
      prerequisites: ["os_concepts"]
    },
    
    // 📡 شبكات الحاسب (علوم الحاسب)
    {
      id: "networking_fundamentals",
      name: "أساسيات الشبكات",
      trackId: "networking_cs",
      description: "مقدمة في بروتوكولات الشبكات وطبقات OSI",
      level: "مبتدئ",
      duration: "12 ساعة",
      prerequisites: []
    },
    {
      id: "advanced_networking",
      name: "الشبكات المتقدمة",
      trackId: "networking_cs",
      description: "بروتوكولات التوجيه، QoS، وأمن الشبكات",
      level: "متوسط",
      duration: "16 ساعة",
      prerequisites: ["networking_fundamentals"]
    },
    
    // 🔐 الأمن السيبراني التخصصي (المسارات الأصلية)
    {
      id: "netsec_basics",
      name: "أساسيات أمن الشبكات",
      trackId: "network_security",
      description: "مقدمة شاملة لمفاهيم أمن الشبكات والتقنيات الأساسية",
      level: "مبتدئ",
      duration: "8 ساعات",
      prerequisites: ["cyber_fundamentals"]
    },
    {
      id: "network_protocols",
      name: "بروتوكولات الشبكات",
      trackId: "network_security",
      description: "فهم بروتوكولات الشبكات الشائعة وثغراتها الأمنية",
      level: "متوسط",
      duration: "10 ساعات",
      prerequisites: ["netsec_basics"]
    },
    {
      id: "pentest_methodology",
      name: "منهجية الاختبار الاختراقي",
      trackId: "penetration_testing",
      description: "تعلم الخطوات المنهجية للاختبار الاختراقي",
      level: "مبتدئ",
      duration: "6 ساعات",
      prerequisites: ["cyber_fundamentals"]
    },
    {
      id: "web_pentesting",
      name: "اختبار اختراق الويب",
      trackId: "penetration_testing",
      description: "اكتشاف ثغرات تطبيقات الويب واختبار اختراقها",
      level: "متوسط",
      duration: "12 ساعة",
      prerequisites: ["pentest_methodology"]
    },
    {
      id: "linux_basics",
      name: "أساسيات لينكس",
      trackId: "operating_systems_security",
      description: "تعلم أساسيات نظام لينكس وإدارة الملفات والأوامر",
      level: "مبتدئ",
      duration: "5 ساعات",
      prerequisites: []
    },
    {
      id: "windows_security",
      name: "أمن أنظمة ويندوز",
      trackId: "operating_systems_security",
      description: "تأمين أنظمة ويندوز وإدارة الصلاحيات والسياسات",
      level: "متوسط",
      duration: "7 ساعات",
      prerequisites: ["cyber_fundamentals"]
    },
    {
      id: "digital_evidence",
      name: "جمع الأدلة الرقمية",
      trackId: "cyber_forensics",
      description: "تقنيات جمع الأدلة الرقمية والحفاظ على سلامتها",
      level: "متوسط",
      duration: "9 ساعات",
      prerequisites: ["cyber_fundamentals"]
    },
    {
      id: "cryptography_basics",
      name: "أساسيات التشفير",
      trackId: "secure_coding",
      description: "مقدمة لأنواع التشفير والخوارزميات المشهورة",
      level: "مبتدئ",
      duration: "6 ساعات",
      prerequisites: []
    }
  ],
  
  // الفيديوهات التعليمية الموسعة
  videos: [
    // 🎯 أساسيات الأمن السيبراني
    {
      id: "vid_001",
      title: "مقدمة في الأمن السيبراني",
      description: "نظرة عامة على مفهوم الأمن السيبراني وأهميته في العصر الرقمي",
      youtubeId: "d1YBv2mWll0",
      duration: "18:25",
      courseId: "cyber_fundamentals",
      trackId: "cybersecurity_fundamentals",
      tags: ["أساسيات", "مقدمة", "تعريفات", "أمن معلومات"],
      dateAdded: "2024-01-01",
      instructor: "أحمد السيد",
      views: 12500
    },
    {
      id: "vid_002",
      title: "مبادئ CIA الثلاثة",
      description: "شرح مفصل لمبادئ السرية والتكاملية والتوفر في الأمن السيبراني",
      youtubeId: "k2rKqkQ0kU8",
      duration: "22:10",
      courseId: "security_principles",
      trackId: "cybersecurity_fundamentals",
      tags: ["CIA", "مبادئ", "أساسيات", "نظرية"],
      dateAdded: "2024-01-05",
      instructor: "أحمد السيد",
      views: 9800
    },
    
    // 🔐 SOC & Blue Team
    {
      id: "vid_003",
      title: "مقدمة في عمليات SOC",
      description: "تعرف على مركز عمليات الأمن ودوره في الحماية",
      youtubeId: "mDcWlK2jE7E",
      duration: "25:30",
      courseId: "soc_operations",
      trackId: "soc_blue_team",
      tags: ["SOC", "مركز عمليات", "رصد", "تحليل"],
      dateAdded: "2024-01-10",
      instructor: "سارة القحطاني",
      views: 7600
    },
    {
      id: "vid_004",
      title: "أدوات SIEM الأساسية",
      description: "تعرف على Splunk، QRadar، وأدوات SIEM الأخرى",
      youtubeId: "pVY6Tk6bQ1w",
      duration: "32:15",
      courseId: "siem_tools",
      trackId: "soc_blue_team",
      tags: ["SIEM", "Splunk", "QRadar", "تحليل السجلات"],
      dateAdded: "2024-01-12",
      instructor: "محمد العلي",
      views: 5400
    },
    
    // 🦠 تحليل البرمجيات الخبيثة
    {
      id: "vid_005",
      title: "أنواع البرمجيات الخبيثة",
      description: "تعرف على الفيروسات، الديدان، أحصنة طروادة، والبرمجيات الخبيثة الأخرى",
      youtubeId: "nJ5K7wG8p2M",
      duration: "28:45",
      courseId: "malware_fundamentals",
      trackId: "malware_analysis",
      tags: ["مالوير", "فيروسات", "ديدان", "تروجان"],
      dateAdded: "2024-01-15",
      instructor: "خالد الفهد",
      views: 8900
    },
    {
      id: "vid_006",
      title: "أساسيات الهندسة العكسية",
      description: "مقدمة في تقنيات الهندسة العكسية للبرمجيات",
      youtubeId: "r4sK2GQ3w3N",
      duration: "35:20",
      courseId: "reverse_engineering",
      trackId: "malware_analysis",
      tags: ["هندسة عكسية", "تجميع", "تصحيح", "تحليل"],
      dateAdded: "2024-01-18",
      instructor: "خالد الفهد",
      views: 4200
    },
    
    // ☁️ أمن السحابة
    {
      id: "vid_007",
      title: "مقدمة في الحوسبة السحابية",
      description: "تعرف على نماذج الخدمات السحابية IaaS، PaaS، SaaS",
      youtubeId: "s7s8Q9q7w2T",
      duration: "20:15",
      courseId: "cloud_fundamentals",
      trackId: "cloud_security",
      tags: ["سحابة", "IaaS", "PaaS", "SaaS"],
      dateAdded: "2024-01-20",
      instructor: "نورة الحربي",
      views: 11200
    },
    {
      id: "vid_008",
      title: "تأمين حسابات AWS",
      description: "أفضل ممارسات تأمين حسابات وخدمات AWS",
      youtubeId: "t5u8K7v6w4X",
      duration: "38:10",
      courseId: "aws_security",
      trackId: "cloud_security",
      tags: ["AWS", "أمن سحابي", "حسابات", "IAM"],
      dateAdded: "2024-01-22",
      instructor: "فيصل الشمري",
      views: 6800
    },
    
    // ⚖️ GRC
    {
      id: "vid_009",
      title: "إطار عمل حوكمة الأمن",
      description: "تعرف على أطر عمل حوكمة الأمن السيبراني",
      youtubeId: "u6v9K2l7m8N",
      duration: "26:30",
      courseId: "cyber_governance",
      trackId: "grc",
      tags: ["حوكمة", "سياسات", "إطار عمل", "ISO27001"],
      dateAdded: "2024-01-25",
      instructor: "لينا الناصر",
      views: 5300
    },
    {
      id: "vid_010",
      title: "تقييم مخاطر الأمن السيبراني",
      description: "خطوات تقييم وتحليل مخاطر الأمن السيبراني",
      youtubeId: "v7w8X9y0z1A",
      duration: "31:45",
      courseId: "risk_management",
      trackId: "grc",
      tags: ["مخاطر", "تقييم", "تحليل", "معالجة"],
      dateAdded: "2024-01-28",
      instructor: "لينا الناصر",
      views: 4700
    },
    
    // 🔑 IAM
    {
      id: "vid_011",
      title: "مقدمة في إدارة الهوية",
      description: "مفاهيم المصادقة، التفويض، والمحاسبة AAA",
      youtubeId: "w2x3Y4z5b6C",
      duration: "24:20",
      courseId: "identity_fundamentals",
      trackId: "iam",
      tags: ["هوية", "مصادقة", "تفويض", "AAA"],
      dateAdded: "2024-02-01",
      instructor: "عمر الخالد",
      views: 8200
    },
    {
      id: "vid_012",
      title: "تقنيات المصادقة المتقدمة",
      description: "المصادقة متعددة العوامل، الحيوية، والمستندة إلى السياق",
      youtubeId: "x3y4z5a6b7D",
      duration: "29:15",
      courseId: "advanced_iam",
      trackId: "iam",
      tags: ["MFA", "مصادقة متعددة", "حيوية", "سياقية"],
      dateAdded: "2024-02-05",
      instructor: "عمر الخالد",
      views: 5900
    },
    
    // 📱 أمن الأجهزة المحمولة
    {
      id: "vid_013",
      title: "أمن أنظمة iOS",
      description: "مقدمة في أمن نظام iOS وتطبيقاته",
      youtubeId: "y4z5a6b7c8E",
      duration: "27:40",
      courseId: "mobile_platforms",
      trackId: "mobile_security",
      tags: ["iOS", "أيفون", "أمن محمول", "تطبيقات"],
      dateAdded: "2024-02-10",
      instructor: "ريم العتيبي",
      views: 7100
    },
    {
      id: "vid_014",
      title: "اختبار اختراق تطبيقات Android",
      description: "تقنيات اختبار اختراق وتأمين تطبيقات Android",
      youtubeId: "z5a6b7c8d9F",
      duration: "34:25",
      courseId: "mobile_app_sec",
      trackId: "mobile_security",
      tags: ["Android", "تطبيقات", "اختبار اختراق", "أمن"],
      dateAdded: "2024-02-12",
      instructor: "ريم العتيبي",
      views: 4800
    },
    
    // 💰 Bug Bounty
    {
      id: "vid_015",
      title: "مقدمة في برامج Bug Bounty",
      description: "تعرف على منصات Bug Bounty وكيفية البدء",
      youtubeId: "a6b7c8d9e0G",
      duration: "22:30",
      courseId: "bug_bounty_basics",
      trackId: "bug_bounty",
      tags: ["Bug Bounty", "مكافآت", "ثغرات", "هاكرون"],
      dateAdded: "2024-02-15",
      instructor: "وليد الحارثي",
      views: 12500
    },
    {
      id: "vid_016",
      title: "اكتشاف ثغرات OWASP Top 10",
      description: "كيفية اكتشاف واستغلال ثغرات OWASP Top 10",
      youtubeId: "b7c8d9e0f1H",
      duration: "41:20",
      courseId: "web_vulnerabilities",
      trackId: "bug_bounty",
      tags: ["OWASP", "ثغرات ويب", "استغلال", "أمن"],
      dateAdded: "2024-02-18",
      instructor: "وليد الحارثي",
      views: 8300
    },
    
    // 🧠 أساسيات علوم الحاسب
    {
      id: "vid_017",
      title: "مقدمة في علوم الحاسب",
      description: "نظرة عامة على مجال علوم الحاسب وتخصصاته",
      youtubeId: "c8d9e0f1g2I",
      duration: "19:45",
      courseId: "cs_intro",
      trackId: "cs_fundamentals",
      tags: ["علوم حاسب", "مقدمة", "تخصصات", "مجال"],
      dateAdded: "2024-02-20",
      instructor: "بدر الرشيد",
      views: 15600
    },
    {
      id: "vid_018",
      title: "مكونات الحاسوب الأساسية",
      description: "شرح لوحة الأم، المعالج، الذاكرة، والتخزين",
      youtubeId: "d9e0f1g2h3J",
      duration: "26:10",
      courseId: "computer_architecture",
      trackId: "cs_fundamentals",
      tags: ["مكونات", "معالج", "ذاكرة", "تخزين"],
      dateAdded: "2024-02-22",
      instructor: "بدر الرشيد",
      views: 9200
    },
    
    // 💻 البرمجة
    {
      id: "vid_019",
      title: "أساسيات لغة Python",
      description: "المتغيرات، أنواع البيانات، والعمليات الأساسية في Python",
      youtubeId: "e0f1g2h3i4K",
      duration: "32:25",
      courseId: "python_basics",
      trackId: "programming",
      tags: ["Python", "برمجة", "مبتدئ", "أساسيات"],
      dateAdded: "2024-02-25",
      instructor: "سلمى الغامدي",
      views: 24500
    },
    {
      id: "vid_020",
      title: "البرمجة الكائنية في Java",
      description: "مفاهيم الكلاس، الكائن، الوراثة، والتغليف في Java",
      youtubeId: "f1g2h3i4j5L",
      duration: "38:40",
      courseId: "java_fundamentals",
      trackId: "programming",
      tags: ["Java", "كائنية", "OOP", "برمجة"],
      dateAdded: "2024-02-28",
      instructor: "سلمى الغامدي",
      views: 16700
    },
    
    // 📊 هياكل البيانات والخوارزميات
    {
      id: "vid_021",
      title: "المصفوفات والقوائم المترابطة",
      description: "تعلم هياكل البيانات الأساسية: المصفوفات والقوائم",
      youtubeId: "g2h3i4j5k6M",
      duration: "29:15",
      courseId: "ds_basics",
      trackId: "data_structures",
      tags: ["هياكل بيانات", "مصفوفات", "قوائم", "مترابطة"],
      dateAdded: "2024-03-01",
      instructor: "طارق الوهيبي",
      views: 11800
    },
    {
      id: "vid_022",
      title: "تحليل تعقيد الخوارزميات",
      description: "Big O Notation وتحليل كفاءة الخوارزميات",
      youtubeId: "h3i4j5k6l7N",
      duration: "35:50",
      courseId: "algorithms_design",
      trackId: "data_structures",
      tags: ["خوارزميات", "Big O", "تعقيد", "تحليل"],
      dateAdded: "2024-03-05",
      instructor: "طارق الوهيبي",
      views: 8700
    },
    
    // 🗃️ قواعد البيانات
    {
      id: "vid_023",
      title: "أساسيات لغة SQL",
      description: "جمل SELECT، INSERT، UPDATE، DELETE في SQL",
      youtubeId: "i4j5k6l7m8O",
      duration: "27:30",
      courseId: "sql_fundamentals",
      trackId: "databases",
      tags: ["SQL", "قواعد بيانات", "استعلامات", "أساسيات"],
      dateAdded: "2024-03-10",
      instructor: "نواف القصير",
      views: 14300
    },
    {
      id: "vid_024",
      title: "التطبيع في قواعد البيانات",
      description: "الأشكال الطبيعية والتطبيع في تصميم قواعد البيانات",
      youtubeId: "j5k6l7m8n9P",
      duration: "33:45",
      courseId: "database_design",
      trackId: "databases",
      tags: ["تطبيع", "تصميم", "قواعد بيانات", "علائقية"],
      dateAdded: "2024-03-12",
      instructor: "نواف القصير",
      views: 7600
    },
    
    // 🌐 تطوير الويب
    {
      id: "vid_025",
      title: "HTML5 و CSS3 للمبتدئين",
      description: "تعلم أساسيات HTML5 و CSS3 لبناء صفحات الويب",
      youtubeId: "k6l7m8n9o0Q",
      duration: "42:20",
      courseId: "web_fundamentals",
      trackId: "web_development",
      tags: ["HTML", "CSS", "ويب", "مبتدئ"],
      dateAdded: "2024-03-15",
      instructor: "منى السعدون",
      views: 19800
    },
    {
      id: "vid_026",
      title: "مقدمة في إطار عمل React",
      description: "تعلم أساسيات React.js لتطوير واجهات المستخدم",
      youtubeId: "l7m8n9o0p1R",
      duration: "48:10",
      courseId: "frontend_frameworks",
      trackId: "web_development",
      tags: ["React", "جافاسكريبت", "واجهات", "إطار عمل"],
      dateAdded: "2024-03-18",
      instructor: "منى السعدون",
      views: 12500
    },
    
    // 🔄 DevOps
    {
      id: "vid_027",
      title: "مقدمة في منهجية DevOps",
      description: "مفاهيم DevOps والممارسات الأساسية",
      youtubeId: "m8n9o0p1q2S",
      duration: "26:35",
      courseId: "devops_intro",
      trackId: "devops",
      tags: ["DevOps", "أتمتة", "تكامل", "تسليم"],
      dateAdded: "2024-03-20",
      instructor: "فيصل الرويلي",
      views: 11200
    },
    {
      id: "vid_028",
      title: "أساسيات Docker للحاويات",
      description: "تعلم استخدام Docker لإنشاء وإدارة الحاويات",
      youtubeId: "n9o0p1q2r3T",
      duration: "39:25",
      courseId: "docker_kubernetes",
      trackId: "devops",
      tags: ["Docker", "حاويات", "تقنية", "DevOps"],
      dateAdded: "2024-03-22",
      instructor: "فيصل الرويلي",
      views: 9400
    },
    
    // 🤖 الذكاء الاصطناعي وتعلم الآلة
    {
      id: "vid_029",
      title: "مقدمة في الذكاء الاصطناعي",
      description: "نظرة عامة على مجال الذكاء الاصطناعي وتطبيقاته",
      youtubeId: "o0p1q2r3s4U",
      duration: "31:40",
      courseId: "ai_fundamentals",
      trackId: "ai_ml",
      tags: ["ذكاء اصطناعي", "AI", "مقدمة", "تطبيقات"],
      dateAdded: "2024-03-25",
      instructor: "هند الفارس",
      views: 16700
    },
    {
      id: "vid_030",
      title: "خوارزميات تعلم الآلة الأساسية",
      description: "الشجرة القرارية، الانحدار الخطي، وآلة المتجهات الداعمة",
      youtubeId: "p1q2r3s4t5V",
      duration: "44:15",
      courseId: "machine_learning",
      trackId: "ai_ml",
      tags: ["تعلم آلة", "خوارزميات", "نماذج", "تنبؤ"],
      dateAdded: "2024-03-28",
      instructor: "هند الفارس",
      views: 10800
    },
    
    // 🖥️ نظم التشغيل (علوم الحاسب)
    {
      id: "vid_031",
      title: "مفاهيم إدارة الذاكرة",
      description: "الذاكرة الافتراضية، التقسيم، والصفحات في أنظمة التشغيل",
      youtubeId: "q2r3s4t5u6W",
      duration: "36:20",
      courseId: "os_concepts",
      trackId: "operating_systems_cs",
      tags: ["أنظمة تشغيل", "ذاكرة", "إدارة", "مفاهيم"],
      dateAdded: "2024-04-01",
      instructor: "باسم الكندري",
      views: 8200
    },
    {
      id: "vid_032",
      title: "نواة نظام لينكس",
      description: "هيكل نواة لينكس والأنظمة الفرعية",
      youtubeId: "r3s4t5u6v7X",
      duration: "41:30",
      courseId: "linux_internals",
      trackId: "operating_systems_cs",
      tags: ["لينكس", "نواة", "أنظمة فرعية", "متقدمة"],
      dateAdded: "2024-04-05",
      instructor: "باسم الكندري",
      views: 5600
    },
    
    // 📡 شبكات الحاسب (علوم الحاسب)
    {
      id: "vid_033",
      title: "مقدمة في طبقات OSI",
      description: "شرح نموذج OSI السباعي لطبقات الشبكات",
      youtubeId: "s4t5u6v7w8Y",
      duration: "33:45",
      courseId: "networking_fundamentals",
      trackId: "networking_cs",
      tags: ["شبكات", "OSI", "طبقات", "نموذج"],
      dateAdded: "2024-04-10",
      instructor: "سعود المطيري",
      views: 12400
    },
    {
      id: "vid_034",
      title: "بروتوكولات التوجيه المتقدمة",
      description: "OSPF، BGP، وبروتوكولات التوجيه الأخرى",
      youtubeId: "t5u6v7w8x9Z",
      duration: "47:20",
      courseId: "advanced_networking",
      trackId: "networking_cs",
      tags: ["توجيه", "بروتوكولات", "شبكات", "متقدم"],
      dateAdded: "2024-04-12",
      instructor: "سعود المطيري",
      views: 7200
    },
    
    // 🔐 الأمن السيبراني التخصصي
    {
      id: "vid_035",
      title: "مقدمة في أمن الشبكات",
      description: "نظرة عامة على مفاهيم أمن الشبكات وأهميتها في العصر الرقمي",
      youtubeId: "u6v7w8x9y0A",
      duration: "25:30",
      courseId: "netsec_basics",
      trackId: "network_security",
      tags: ["أمن شبكات", "مقدمة", "أساسيات", "تعريفات"],
      dateAdded: "2024-04-15",
      instructor: "أحمد محمد",
      views: 15600
    },
    {
      id: "vid_036",
      title: "أنواع الهجمات الشبكية",
      description: "تعرف على أشهر أنواع الهجمات التي تستهدف الشبكات وكيفية الوقاية منها",
      youtubeId: "v7w8x9y0z1B",
      duration: "32:10",
      courseId: "netsec_basics",
      trackId: "network_security",
      tags: ["هجمات", "حماية", "DDoS", "مانع اختراق"],
      dateAdded: "2024-04-18",
      instructor: "أحمد محمد",
      views: 11200
    },
    {
      id: "vid_037",
      title: "ما هو الاختبار الاختراقي؟",
      description: "مقدمة شاملة للاختبار الاختراقي الأخلاقي وأهدافه",
      youtubeId: "w8x9y0z1a2C",
      duration: "28:45",
      courseId: "pentest_methodology",
      trackId: "penetration_testing",
      tags: ["اختبار اختراق", "أخلاقي", "منهجية", "مقدمة"],
      dateAdded: "2024-04-20",
      instructor: "سارة خالد",
      views: 18700
    },
    {
      id: "vid_038",
      title: "مراحل الاختبار الاختراقي",
      description: "شرح مفصّل للمراحل الخمس الرئيسية للاختبار الاختراقي",
      youtubeId: "x9y0z1a2b3D",
      duration: "35:20",
      courseId: "pentest_methodology",
      trackId: "penetration_testing",
      tags: ["مراحل", "استكشاف", "اختبار", "اختراق"],
      dateAdded: "2024-04-22",
      instructor: "سارة خالد",
      views: 13400
    },
    {
      id: "vid_039",
      title: "مقدمة في نظام لينكس",
      description: "تعرف على نظام لينكس ومميزاته واستخداماته في الأمن السيبراني",
      youtubeId: "y0z1a2b3c4E",
      duration: "30:15",
      courseId: "linux_basics",
      trackId: "operating_systems_security",
      tags: ["لينكس", "مقدمة", "أنظمة مفتوحة المصدر", "أساسيات"],
      dateAdded: "2024-04-25",
      instructor: "خالد حسن",
      views: 22300
    },
    {
      id: "vid_040",
      title: "الأوامر الأساسية في لينكس",
      description: "تعلم أهم الأوامر التي تحتاجها للتعامل مع نظام لينكس",
      youtubeId: "z1a2b3c4d5F",
      duration: "42:40",
      courseId: "linux_basics",
      trackId: "operating_systems_security",
      tags: ["أوامر", "طرفية", "ملفات", "لينكس"],
      dateAdded: "2024-04-28",
      instructor: "خالد حسن",
      views: 17800
    },
    {
      id: "vid_041",
      title: "أساسيات التشفير",
      description: "مقدمة لمبادئ التشفير وأنواعه واستخداماته في حماية البيانات",
      youtubeId: "a2b3c4d5e6G",
      duration: "38:50",
      courseId: "cryptography_basics",
      trackId: "secure_coding",
      tags: ["تشفير", "أمان", "خوارزميات", "مقدمة"],
      dateAdded: "2024-05-01",
      instructor: "فاطمة علي",
      views: 15600
    },
    {
      id: "vid_042",
      title: "جمع الأدلة الرقمية",
      description: "كيفية جمع الأدلة الرقمية بشكل صحيح مع الحفاظ على سلامتها القانونية",
      youtubeId: "b3c4d5e6f7H",
      duration: "45:15",
      courseId: "digital_evidence",
      trackId: "cyber_forensics",
      tags: ["تحقيق", "أدلة", "قانوني", "رقمي"],
      dateAdded: "2024-05-05",
      instructor: "عمر ناصر",
      views: 9400
    },
    {
      id: "vid_043",
      title: "بروتوكول TCP/IP",
      description: "شرح مفصل لبروتوكول TCP/IP وطبقاته وثغراته الأمنية",
      youtubeId: "c4d5e6f7g8I",
      duration: "50:25",
      courseId: "network_protocols",
      trackId: "network_security",
      tags: ["بروتوكولات", "TCP", "IP", "شبكات"],
      dateAdded: "2024-05-08",
      instructor: "أحمد محمد",
      views: 11200
    },
    {
      id: "vid_044",
      title: "ثغرات الويب الشائعة",
      description: "تعرف على أشهر ثغرات تطبيقات الويب وكيفية استغلالها",
      youtubeId: "d5e6f7g8h9J",
      duration: "48:10",
      courseId: "web_pentesting",
      trackId: "penetration_testing",
      tags: ["ويب", "ثغرات", "SQLi", "XSS"],
      dateAdded: "2024-05-10",
      instructor: "سارة خالد",
      views: 16700
    },
    {
      id: "vid_045",
      title: "تأمين نظام ويندوز",
      description: "خطوات عملية لتأمين أنظمة ويندوز ضد الهجمات الشائعة",
      youtubeId: "e6f7g8h9i0K",
      duration: "39:45",
      courseId: "windows_security",
      trackId: "operating_systems_security",
      tags: ["ويندوز", "تأمين", "سياسات", "أمان"],
      dateAdded: "2024-05-12",
      instructor: "خالد حسن",
      views: 12600
    },
    {
      id: "vid_046",
      title: "التشفير المتماثل والغير متماثل",
      description: "مقارنة بين نوعي التشفير الرئيسيين واستخدامات كل منهما",
      youtubeId: "f7g8h9i0j1L",
      duration: "43:20",
      courseId: "cryptography_basics",
      trackId: "secure_coding",
      tags: ["تشفير", "متماثل", "غير متماثل", "RSA"],
      dateAdded: "2024-05-15",
      instructor: "فاطمة علي",
      views: 8900
    },
    
    // فيديوهات إضافية للمسارات الجديدة
    {
      id: "vid_047",
      title: "مقدمة في أمن تطبيقات الويب",
      description: "مبادئ أمن تطبيقات الويب وحمايتها من الهجمات",
      youtubeId: "g8h9i0j1k2M",
      duration: "34:25",
      courseId: "web_pentesting",
      trackId: "penetration_testing",
      tags: ["ويب", "تطبيقات", "أمان", "حماية"],
      dateAdded: "2024-05-18",
      instructor: "سارة خالد",
      views: 14500
    },
    {
      id: "vid_048",
      title: "أساسيات أمن قواعد البيانات",
      description: "حماية قواعد البيانات من الهجمات والوصول غير المصرح به",
      youtubeId: "h9i0j1k2l3N",
      duration: "41:30",
      courseId: "database_design",
      trackId: "databases",
      tags: ["قواعد بيانات", "أمان", "SQL", "حقوق وصول"],
      dateAdded: "2024-05-20",
      instructor: "نواف القصير",
      views: 9800
    },
    {
      id: "vid_049",
      title: "مقدمة في تحليل البرمجيات الضارة",
      description: "خطوات أساسية لتحليل وفهم البرمجيات الخبيثة",
      youtubeId: "i0j1k2l3m4O",
      duration: "37:15",
      courseId: "malware_fundamentals",
      trackId: "malware_analysis",
      tags: ["برمجيات ضارة", "تحليل", "فيروسات", "أمن"],
      dateAdded: "2024-05-22",
      instructor: "خالد الفهد",
      views: 11200
    },
    {
      id: "vid_050",
      title: "أساسيات الشبكات اللاسلكية",
      description: "مقدمة في شبكات Wi-Fi وتقنيات الأمن اللاسلكي",
      youtubeId: "j1k2l3m4n5P",
      duration: "29:40",
      courseId: "networking_fundamentals",
      trackId: "networking_cs",
      tags: ["لاسلكي", "Wi-Fi", "شبكات", "أمان"],
      dateAdded: "2024-05-25",
      instructor: "سعود المطيري",
      views: 13400
    }
  ]
};

// تحديث البيانات الوصفية تلقائياً
cyberPathVideos.meta.totalVideos = cyberPathVideos.videos.length;
cyberPathVideos.meta.totalCourses = cyberPathVideos.courses.length;
cyberPathVideos.meta.totalTracks = cyberPathVideos.tracks.length;
cyberPathVideos.meta.tracks = cyberPathVideos.tracks.map(track => ({
  name: track.name,
  category: track.category,
  icon: track.icon
}));

// تصدير البيانات للاستخدام في الملفات الأخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = cyberPathVideos;
}

// إضافة دالة مساعدة للبحث عن الفيديوهات حسب المعايير
cyberPathVideos.findVideosByCriteria = function(criteria) {
  return this.videos.filter(video => {
    for (const key in criteria) {
      if (criteria[key] && video[key] !== criteria[key]) {
        return false;
      }
    }
    return true;
  });
};

// إضافة دالة للحصول على المسارات حسب الفئة
cyberPathVideos.getTracksByCategory = function(category) {
  return this.tracks.filter(track => track.category === category);
};

// إضافة دالة للحصول على المقررات حسب المستوى
cyberPathVideos.getCoursesByLevel = function(level) {
  return this.courses.filter(course => course.level === level);
};

// إضافة دالة للحصول على الإحصائيات
cyberPathVideos.getStats = function() {
  const stats = {
    totalVideos: this.meta.totalVideos,
    totalCourses: this.meta.totalCourses,
    totalTracks: this.meta.totalTracks,
    videosByCategory: {},
    videosByLevel: {},
    popularInstructors: {}
  };
  
  // إحصاء الفيديوهات حسب الفئة
  this.tracks.forEach(track => {
    const category = track.category;
    if (!stats.videosByCategory[category]) {
      stats.videosByCategory[category] = 0;
    }
    stats.videosByCategory[category] += 
      this.videos.filter(v => v.trackId === track.id).length;
  });
  
  // إحصاء الفيديوهات حسب مستوى المقرر
  this.courses.forEach(course => {
    const level = course.level;
    if (!stats.videosByLevel[level]) {
      stats.videosByLevel[level] = 0;
    }
    stats.videosByLevel[level] += 
      this.videos.filter(v => v.courseId === course.id).length;
  });
  
  // إحصاء المدربين الشعبيين
  this.videos.forEach(video => {
    const instructor = video.instructor;
    if (!stats.popularInstructors[instructor]) {
      stats.popularInstructors[instructor] = {
        count: 0,
        totalViews: 0
      };
    }
    stats.popularInstructors[instructor].count++;
    stats.popularInstructors[instructor].totalViews += video.views || 0;
  });
  
  return stats;
};

// إضافة دالة للحصول على الفيديوهات الجديدة
cyberPathVideos.getRecentVideos = function(limit = 10) {
  return [...this.videos]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, limit);
};

// إضافة دالة للحصول على الفيديوهات الأكثر مشاهدة
cyberPathVideos.getMostViewedVideos = function(limit = 10) {
  return [...this.videos]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
};
