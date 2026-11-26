export async function init({ root }) {
  const section = document.createElement("section");
  section.className = "role-workspace";

  const heading = document.createElement("h2");
  heading.textContent = "مساحة المدرب";

  const intro = document.createElement("p");
  intro.textContent =
    "مساحة موحدة لإدارة الدورات والمحتوى والأنشطة التعليمية ومتابعة المتعلمين وفق الصلاحيات المعتمدة.";

  const status = document.createElement("div");
  status.className = "module-notice";
  status.setAttribute("role", "status");
  status.textContent =
    "يجري تجهيز خدمات المدرب. لم يتم تحميل بيانات أو قوائم تجريبية.";

  section.append(heading, intro, status);
  root.replaceChildren(section);
}
