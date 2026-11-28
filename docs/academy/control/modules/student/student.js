export function init({ supabase, root, role }) {
  if (!root) {
    throw new Error("Student module requires a root element.");
  }

  // P0: واجهة شخصية صادقة دون بيانات تعليمية غير مرتبطة.
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
  title.textContent = "مرحباً بك في مساحتك التعليمية";

  const intro = document.createElement("p");
  intro.textContent =
    "هنا ستجد تجربتك التعليمية الشخصية. يمكنك الآن مواصلة الاستكشاف والتعلم من خدمات الأكاديمية المتاحة.";

  header.append(eyebrow, title, intro);

  const learning = document.createElement("section");
  learning.className = "student-learning-state";
  learning.setAttribute("aria-labelledby", "learning-state-title");

  const learningTitle = document.createElement("h2");
  learningTitle.id = "learning-state-title";
  learningTitle.textContent = "مساحتك الشخصية قيد التجهيز";

  const learningText = document.createElement("p");
  learningText.textContent =
    "نعمل على ربط ملفك التعليمي وتسجيلاتك بمصادر البيانات المعتمدة. ستظهر هنا معلوماتك وتقدمك عندما تصبح جاهزة، ولن نعرض بيانات غير مكتملة أو تجريبية.";

  learning.append(learningTitle, learningText);

  const resources = document.createElement("section");
  resources.className = "student-resources";
  resources.setAttribute("aria-labelledby", "resources-title");

  const resourcesTitle = document.createElement("h2");
  resourcesTitle.id = "resources-title";
  resourcesTitle.textContent = "تابع رحلتك في الأكاديمية";

  const nav = document.createElement("nav");
  nav.className = "student-resource-links";
  nav.setAttribute("aria-label", "خدمات الأكاديمية");

  const links = [
    ["/academy/career-paths/", "المسارات المهنية", "استكشف تخصصات ومسارات الأمن السيبراني"],
    ["/academy/labs/", "المختبرات", "تدرّب عملياً في بيئات المختبرات"],
    ["/academy/quizzes/", "الاختبارات", "راجع معلوماتك واختبر معرفتك"],
    ["/academy/guidance/", "الإرشاد", "اطّلع على موارد التوجيه والدعم"],
  ];

  for (const [href, label, hint] of links) {
    const a = document.createElement("a");
    a.href = href;

    const name = document.createElement("span");
    name.textContent = label;

    const description = document.createElement("span");
    description.textContent = hint;

    a.append(name, description);
    nav.append(a);
  }

  resources.append(resourcesTitle, nav);
  main.append(header, learning, resources);
  root.append(main);
}