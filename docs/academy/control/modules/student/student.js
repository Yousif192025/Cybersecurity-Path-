export function init({ supabase, root, role }) {
  if (!root) {
    throw new Error("Student module requires a root element.");
  }

  // S0: لا توجد استدعاءات لبيانات تعليمية في هذه المرحلة.
  void supabase;
  void role;

  root.replaceChildren();

  const main = document.createElement("main");
  main.className = "student-dashboard";
  main.dir = "rtl";
  main.lang = "ar";

  const header = document.createElement("header");
  header.className = "student-welcome";

  const eyebrow = document.createElement("p");
  eyebrow.className = "student-eyebrow";
  eyebrow.textContent = "مساحة الطالب";

  const title = document.createElement("h1");
  title.textContent = "مرحباً بك في رحلتك التعليمية";

  const intro = document.createElement("p");
  intro.textContent =
    "استكشف مسارات الأمن السيبراني، وطوّر مهاراتك، وتابع فرص التعلم المتاحة في الأكاديمية.";

  header.append(eyebrow, title, intro);

  const learning = document.createElement("section");
  learning.className = "student-learning-state";
  learning.setAttribute("aria-labelledby", "learning-state-title");

  const learningTitle = document.createElement("h2");
  learningTitle.id = "learning-state-title";
  learningTitle.textContent = "تعلّمك يبدأ من هنا";

  const learningText = document.createElement("p");
  learningText.textContent =
    "عرض تقدمك ودوراتك المسجل فيها غير متاح حالياً؛ لم يتم ربط مصادر بيانات التعلم الشخصية بعد.";

  learning.append(learningTitle, learningText);

  const resources = document.createElement("section");
  resources.className = "student-resources";
  resources.setAttribute("aria-labelledby", "resources-title");

  const resourcesTitle = document.createElement("h2");
  resourcesTitle.id = "resources-title";
  resourcesTitle.textContent = "استكشف الأكاديمية";

  const nav = document.createElement("nav");
  nav.className = "student-resource-links";
  nav.setAttribute("aria-label", "الأقسام التعليمية");

  const links = [
    ["/academy/traincourses/", "الدورات التدريبية", "اكتشف الدورات المتاحة للتعلم"],
    ["/academy/career-paths/", "المسارات المهنية", "تعرّف على تخصصات الأمن السيبراني"],
    ["/academy/certifications/", "الشهادات الاحترافية", "استكشف الشهادات ومتطلباتها"],
    ["/academy/quizzes/", "الاختبارات", "اختبر معلوماتك ومعرفتك"],
    ["/academy/workshops/", "ورش العمل", "استكشف الأنشطة وورش العمل"],
    ["/academy/guidance/", "الإرشاد الأكاديمي", "احصل على التوجيه والمساعدة"],
  ];

  for (const [href, label, hint] of links) {
    const a = document.createElement("a");
    a.href = href;

    const s1 = document.createElement("span");
    s1.textContent = label;

    const s2 = document.createElement("span");
    s2.textContent = hint;

    a.append(s1, s2);
    nav.append(a);
  }

  resources.append(resourcesTitle, nav);
  main.append(header, learning, resources);
  root.append(main);
}
