export async function init({ root }) {
  const section = document.createElement("section");
  section.className = "role-workspace";

  const heading = document.createElement("h2");
  heading.textContent = "الإدارة العامة";

  const intro = document.createElement("p");
  intro.textContent =
    "مركز إشرافي موحد لإدارة المنصة ومتابعة خدماتها ومكوناتها وفق الصلاحيات الإدارية المعتمدة.";

  const status = document.createElement("div");
  status.className = "module-notice";
  status.setAttribute("role", "status");
  status.textContent =
    "يجري تجهيز الخدمات الإدارية. عمليات إدارة الحسابات والأدوار والبيانات لن تتاح قبل ربط واجهات خلفية آمنة.";

  section.append(heading, intro, status);
  root.replaceChildren(section);
}
