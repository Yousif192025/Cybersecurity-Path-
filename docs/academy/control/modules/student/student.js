import { bindStudentDashboard } from "./dashboard.behavior.js";

const CSS_HREF = "/academy/control/modules/student/dashboard.css";
const PROFILE_FIELDS = [
  ["full_name", "الاسم الكامل"],
  ["phone", "رقم الهاتف"],
  ["track", "المسار التخصصي"],
  ["student_type", "نوع المتعلم"],
];
const STATUS_LABELS = {
  not_started: "لم يبدأ",
  in_progress: "قيد التقدم",
  completed: "مكتمل",
  passed: "اجتاز",
  failed: "لم يجتز",
  cancelled: "ملغي",
  withdrawn: "منسحب",
};

function el(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined && value !== null) node.textContent = value;
  return node;
}
function valueOr(value, fallback = "غير مسجل") {
  return value === null || value === undefined || String(value).trim() === "" ? fallback : String(value);
}
function humanize(value) {
  if (!value) return "غير محدد";
  const key = String(value).trim().toLowerCase();
  const labels = {
    soc: "مركز العمليات الأمنية (SOC)",
    soc_analyst: "محلل مركز العمليات الأمنية",
    pentest: "اختبار الاختراق",
    penetration_testing: "اختبار الاختراق",
    cloud_security: "أمن الحوسبة السحابية",
    network_security: "أمن الشبكات",
    grc: "الحوكمة والمخاطر والامتثال",
    general: "عام",
    skill_dev: "تطوير المهارات",
    career: "تطوير مهني",
    academic: "تعلم أكاديمي",
  };
  return labels[key] || String(value).replaceAll("_", " ");
}
function statusLabel(status) {
  const key = String(status || "").toLowerCase();
  return STATUS_LABELS[key] || humanize(status);
}
async function loadProfile(supabase, userId) {
  const { data, error } = await supabase.from("user_profile")
    .select("full_name, phone, track, student_type")
    .eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data || null;
}
async function loadEnrollments(supabase, userId) {
  const { data, error } = await supabase.from("enrollments")
    .select("course_id, completion_status")
    .eq("user_id", userId);
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}
function ensureStylesheet() {
  if (document.querySelector("link[data-cp-student-dashboard-css]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = CSS_HREF;
  link.dataset.cpStudentDashboardCss = "1";
  document.head.appendChild(link);
}
function setText(root, selector, value) {
  const node = root.querySelector(selector);
  if (node) node.textContent = value;
}
function updateIdentity(root, profile, user) {
  const name = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "الطالب";
  const initial = [...name.trim()][0] || "ط";
  const sideUser = root.querySelector(".side-user");
  if (sideUser) {
    const avatar = sideUser.querySelector(".avatar");
    const strong = sideUser.querySelector("strong");
    const small = sideUser.querySelector("small");
    if (avatar) avatar.textContent = initial;
    if (strong) strong.textContent = name;
    if (small) small.textContent = valueOr(user.email, "حساب طالب موثق");
  }
  const topProfile = root.querySelector(".top-profile");
  if (topProfile) {
    const avatar = topProfile.querySelector(".avatar");
    const strong = topProfile.querySelector("strong");
    const small = topProfile.querySelector("small");
    if (avatar) avatar.textContent = initial;
    if (strong) strong.textContent = name;
    if (small) small.textContent = "حساب طالب";
  }
  return name;
}
function renderProfile(root, profile, user, profileError) {
  const view = root.querySelector('[data-view-panel="profile"]');
  if (!view) return;
  const old = view.querySelector("[data-cp-profile-data]");
  if (old) old.remove();
  const section = el("section", "card");
  section.dataset.cpProfileData = "1";
  section.append(el("h2", "", "بيانات حسابك الأكاديمي"));
  if (profileError) {
    section.append(el("p", "", "تعذر تحميل بيانات الملف الأكاديمي حالياً."));
  } else {
    const grid = el("div", "profile-grid");
    const rows = PROFILE_FIELDS.map(([key, label]) => [
      label, key === "track" || key === "student_type" ? humanize(profile?.[key]) : valueOr(profile?.[key])
    ]);
    rows.push(["البريد الإلكتروني", valueOr(user.email)]);
    rows.forEach(([label, value]) => {
      const item = el("div", "profile-item");
      item.append(el("small", "", label), el("strong", "", value));
      grid.append(item);
    });
    section.append(grid);
  }
  const disclaimer = el("p", "subhead", "تعرض هذه البيانات ما هو محفوظ في ملفك الأكاديمي. لا تتوفر هنا وظيفة تعديل البيانات.");
  section.append(disclaimer);
  const anchor = view.querySelector(".view-header");
  if (anchor) anchor.after(section);
  else view.prepend(section);
}
function renderEnrollments(root, enrollments, enrollmentError) {
  const view = root.querySelector('[data-view-panel="courses"]');
  if (!view) return;
  const old = view.querySelector("[data-cp-enrollments]");
  if (old) old.remove();
  const section = el("section", "card");
  section.dataset.cpEnrollments = "1";
  section.append(el("h2", "", "تسجيلاتك في الأكاديمية"));
  if (enrollmentError) {
    section.append(el("p", "", "تعذر تحميل تسجيلاتك حالياً. حدّث الصفحة للمحاولة مرة أخرى."));
  } else if (!enrollments.length) {
    section.append(el("p", "", "لا توجد تسجيلات مرتبطة بحسابك حتى الآن."));
  } else {
    const summary = el("div", "course-meta");
    const counts = new Map();
    enrollments.forEach(item => {
      const label = statusLabel(item.completion_status);
      counts.set(label, (counts.get(label) || 0) + 1);
    });
    counts.forEach((count, label) => summary.append(el("span", "tag", `${label}: ${count}`)));
    section.append(summary);
    const list = el("div", "enrollment-list");
    enrollments.forEach((item, index) => {
      const row = el("article", "enrollment-row");
      row.append(el("strong", "", `التسجيل ${index + 1}`));
      row.append(el("span", "tag", statusLabel(item.completion_status)));
      list.append(row);
    });
    section.append(list);
    section.append(el("p", "subhead", "لا يتضمن مصدر التسجيل المتاح اسم المقرر؛ لذلك نعرض حالة التسجيل دون تخمين أسماء الدورات."));
  }
  const header = view.querySelector(".view-header");
  if (header) header.after(section);
  else view.prepend(section);
}
function updateOverview(root, profile, enrollments, profileError, enrollmentError) {
  const stats = root.querySelectorAll(".stat-card");
  if (stats[0]) {
    const value = stats[0].querySelector(".stat-value");
    const foot = stats[0].querySelector(".stat-foot");
    if (value) value.textContent = enrollmentError ? "غير متاح" : String(enrollments.length);
    if (foot) foot.textContent = enrollmentError ? "تعذر تحميل التسجيلات" : "تسجيلات مرتبطة بحسابك";
  }
  const banner = root.querySelector(".demo-banner");
  if (banner) banner.replaceChildren(
    el("strong", "", "لوحة الطالب متصلة بحسابك."),
    el("span", "", "تُعرض بيانات الملف والتسجيلات المتاحة لحسابك؛ أما الدرجات والمهام والشهادات فتحتاج إلى مصادر بيانات معتمدة.")
  );
  const privacy = root.querySelector(".side-privacy");
  if (privacy) privacy.textContent = "بيانات حسابك وتسجيلاتك تُحمّل من الخدمات المتاحة للطالب.";
  const healthRows = root.querySelectorAll(".health-row");
  if (healthRows[0]) {
    const status = healthRows[0].querySelector(".health-status");
    const small = healthRows[0].querySelector("small");
    if (status) status.textContent = "متصل";
    if (small) small.textContent = profileError ? "تعذر تحميل الملف الأكاديمي" : profile ? "تم تحميل الملف الأكاديمي" : "لا يوجد ملف أكاديمي مسجل";
  }
  if (healthRows[1]) {
    const status = healthRows[1].querySelector(".health-status");
    const small = healthRows[1].querySelector("small");
    if (status) status.textContent = enrollmentError ? "تعذر التحميل" : "متصل";
    if (small) small.textContent = enrollmentError ? "تعذر تحميل التسجيلات" : `${enrollments.length} تسجيل مرتبط بالحساب`;
  }
  const footnote = root.querySelector(".page-footnote");
  if (footnote) footnote.textContent = "تعرض اللوحة المعلومات المتاحة من حسابك. لا تُعرض درجات أو مواعيد أو شهادات ما لم تتوفر لها بيانات موثوقة.";
}
function wireLogout(supabase, root) {
  const sideBottom = root.querySelector(".side-bottom");
  if (!sideBottom || sideBottom.querySelector("[data-cp-logout]")) return;
  const btn = el("button", "academy-link", "تسجيل الخروج");
  btn.type = "button";
  btn.dataset.cpLogout = "1";
  btn.style.width = "100%";
  btn.style.cursor = "pointer";
  btn.style.background = "transparent";
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    btn.textContent = "جارٍ تسجيل الخروج...";
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.replace("/academy/account/login.html");
    } catch (error) {
      console.error("Student logout failed:", error);
      btn.disabled = false;
      btn.textContent = "تسجيل الخروج";
    }
  });
  sideBottom.append(btn);
}

export async function init({ supabase, root, role }) {
  if (!root) throw new Error("Student module requires a root element.");
  if (role !== "student") throw new Error("Student module received an unexpected role.");

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  const user = authData?.user;
  if (!user) throw new Error("لا توجد جلسة طالب نشطة.");

  let profile = null, enrollments = [], profileError = null, enrollmentError = null;
  try { profile = await loadProfile(supabase, user.id); }
  catch (error) { profileError = error; console.error("Student profile load failed:", error); }
  try { enrollments = await loadEnrollments(supabase, user.id); }
  catch (error) { enrollmentError = error; console.error("Student enrollments load failed:", error); }

  ensureStylesheet();
  document.body.classList.add("cp-student-dashboard-active");
  const bodyUrl = new URL("./dashboard.body.html", import.meta.url);
  const response = await fetch(bodyUrl);
  if (!response.ok) throw new Error("Failed to load student dashboard shell.");
  const shell = await response.text();
  root.innerHTML = shell;

  const displayName = updateIdentity(root, profile, user);
  setText(root, "#crumb-title", "نظرة عامة");
  updateOverview(root, profile, enrollments, profileError, enrollmentError);
  renderProfile(root, profile, user, profileError);
  renderEnrollments(root, enrollments, enrollmentError);
  bindStudentDashboard();
  wireLogout(supabase, root);
  root.dataset.cpStudentMounted = "1";
}
