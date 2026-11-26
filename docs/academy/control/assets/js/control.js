import { supabase } from "../../../account/client.js";

const ROLE_MODULES = {
  student: {
    title: "مساحة الطالب",
    description: "تابع مسارك التعليمي وتقدمك في الأكاديمية.",
    path: "../../modules/student/student.js",
    init: "init",
  },
  instructor: {
    title: "مساحة المدرب",
    description: "مساحة إدارة المحتوى والمتابعة التعليمية.",
    path: "../../modules/instructor/instructor.js",
    init: "init",
  },
  admin: {
    title: "الإدارة العامة",
    description: "مساحة الإدارة والإشراف على المنصة.",
    path: "../../modules/admin/admin.js",
    init: "init",
  },
};

const elements = {
  statusPanel: document.getElementById("status-panel"),
  statusMessage: document.getElementById("status-message"),
  content: document.getElementById("control-content"),
  title: document.getElementById("page-title"),
  description: document.getElementById("page-description"),
  logout: document.getElementById("logout-button"),
};

let initialized = false;

function showStatus(message, isError = false) {
  elements.statusPanel.hidden = false;
  elements.statusPanel.dataset.state = isError ? "error" : "loading";
  elements.statusMessage.textContent = message;
  elements.content.hidden = true;
}

function denyAccess(message) {
  showStatus(message, true);
  elements.logout.hidden = false;
}

function normalizeRole(role) {
  if (role == null || role === "") return null;
  return String(role).trim().toLowerCase();
}

async function loadRoleModule(role) {
  const moduleInfo = ROLE_MODULES[role];

  if (!moduleInfo) {
    denyAccess("الدور المسجل غير معروف. تم إيقاف الوصول إلى مركز التحكم.");
    return;
  }

  try {
    showStatus("تم التحقق من الصلاحيات. جارٍ تجهيز مساحتك...");

    const roleModule = await import(moduleInfo.path);

    if (typeof roleModule[moduleInfo.init] !== "function") {
      throw new Error("Role module entry point is missing.");
    }

    elements.title.textContent = moduleInfo.title;
    elements.description.textContent = moduleInfo.description;
    elements.content.replaceChildren();

    await roleModule[moduleInfo.init]({
      supabase,
      root: elements.content,
      role,
    });

    elements.content.hidden = false;
    elements.statusPanel.hidden = true;
    elements.logout.hidden = false;
  } catch (_error) {
    denyAccess("تعذر تحميل مساحة الدور. لم يتم منح وصول بديل.");
  }
}

async function verifyAndStart() {
  showStatus("جارٍ التحقق من الجلسة والصلاحيات...");

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (!data?.session?.user) {
      window.location.replace("/academy/account/login.html");
      return;
    }

    const { data: role, error: roleError } =
      await supabase.rpc("get_my_role");

    if (roleError) {
      denyAccess("تعذر التحقق من صلاحيات الحساب. أعد المحاولة لاحقًا.");
      return;
    }

    const normalizedRole = normalizeRole(role);

    if (!normalizedRole || !ROLE_MODULES[normalizedRole]) {
      denyAccess(
        "الحساب مسجل، لكن لا توجد صلاحية أكاديمية معتمدة لهذا الحساب حاليًا."
      );
      return;
    }

    await loadRoleModule(normalizedRole);
  } catch (_error) {
    denyAccess("تعذر التحقق من الحساب. لم يُسمح بفتح مساحة محمية.");
  }
}

elements.logout.addEventListener("click", async () => {
  elements.logout.disabled = true;
  showStatus("جارٍ تسجيل الخروج...");

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.replace("/academy/account/login.html");
  } catch (_error) {
    elements.logout.disabled = false;
    denyAccess("تعذر تسجيل الخروج. حاول مرة أخرى.");
  }
});

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    window.location.replace("/academy/account/login.html");
  }
});

if (!initialized) {
  initialized = true;
  void verifyAndStart();
}
