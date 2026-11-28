import { supabase } from "../../../account/client.js";

const LOGIN_URL = "/academy/account/login.html";

const ROLE_MODULES = {
  student: () => import("../../modules/student/student.js"),
};

const root = document.getElementById("control-root");
const logoutButton = document.getElementById("logout-button");

let initialized = false;
let redirecting = false;

function showMessage(title, message) {
  if (!root) return;

  root.replaceChildren();

  const section = document.createElement("section");
  section.className = "control-message";

  const heading = document.createElement("h1");
  heading.textContent = title;

  const paragraph = document.createElement("p");
  paragraph.textContent = message;

  section.append(heading, paragraph);
  root.append(section);
  root.setAttribute("aria-busy", "false");
}

function redirectToLogin() {
  if (redirecting) return;
  redirecting = true;
  window.location.replace(LOGIN_URL);
}

async function startControlCenter() {
  if (initialized || !root) return;
  initialized = true;

  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData.session) {
      redirectToLogin();
      return;
    }

    const { data: roleData, error: roleError } =
      await supabase.rpc("get_my_role");

    if (roleError) {
      throw roleError;
    }

    const role = typeof roleData === "string"
      ? roleData.trim().toLowerCase()
      : "";

    if (!["student", "instructor", "admin"].includes(role)) {
      showMessage(
        "تعذّر التحقق من الصلاحية",
        "لم نتمكن من تحديد دور صالح لهذا الحساب. سجّل الخروج ثم حاول الدخول مجدداً."
      );
      return;
    }

    const loadModule = ROLE_MODULES[role];

    if (!loadModule) {
      showMessage(
        "المساحة قيد الإعداد",
        "تم التحقق من دور الحساب، لكن واجهة هذا الدور لم تُجهّز بعد."
      );
      return;
    }

    const module = await loadModule();

    if (typeof module.init !== "function") {
      throw new Error("Role module does not export init().");
    }

    await module.init({ supabase, root, role });
    root.setAttribute("aria-busy", "false");
  } catch (error) {
    console.error("Control center initialization failed:", error);

    showMessage(
      "تعذّر تحميل مركز التحكم",
      "حدث خطأ أثناء التحقق أو تحميل مساحة العمل. حاول تحديث الصفحة، وإذا استمرت المشكلة تواصل مع الدعم."
    );
  }
}

logoutButton?.addEventListener("click", async () => {
  logoutButton.disabled = true;
  logoutButton.textContent = "جارٍ تسجيل الخروج...";

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    redirectToLogin();
  } catch (error) {
    console.error("Sign out failed:", error);

    logoutButton.disabled = false;
    logoutButton.textContent = "تسجيل الخروج";

    showMessage(
      "تعذّر تسجيل الخروج",
      "لم تكتمل عملية تسجيل الخروج. حاول مرة أخرى."
    );
  }
});

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    redirectToLogin();
  }
});

startControlCenter();
