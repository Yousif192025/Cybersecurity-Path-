export async function init({ root }) {
  const section = document.createElement("section");
  section.className = "role-workspace";

  const heading = document.createElement("h2");
  heading.textContent = "مساحة الطالب";

  const intro = document.createElement("p");
  intro.textContent =
    "مرحبًا بك في مساحتك التعليمية. ستظهر هنا الدورات والمسارات والتقدم المرتبط بحسابك بعد ربط مصادر البيانات المعتمدة.";

  const status = document.createElement("div");
  status.className = "module-notice";
  status.setAttribute("role", "status");
  status.textContent =
    "يجري تجهيز خدمات الطالب. لم يتم تحميل بيانات تعليمية أو إحصائيات تجريبية.";

  section.append(heading, intro, status);
  root.replaceChildren(section);
}
