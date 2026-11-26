import { supabase } from "./client.js";

const $ = (id) => document.getElementById(id);
const message = (text, error = false) => {
  const el = $("message");
  if (!el) return;
  el.textContent = text;
  el.dataset.state = error ? "error" : "success";
};

async function routeByRole() {
  message("تم التحقق من الحساب. جارٍ تحديد صلاحيات الدخول...");
  const { data: role, error } = await supabase.rpc("get_my_role");

  if (error) {
    message("تعذر التحقق من صلاحيات الحساب. يمكنك استخدام محتوى الأكاديمية المفتوح، ولم نمنحك دخولًا إلى لوحة محمية.", true);
    return;
  }

  const destinations = {
    student: "/dashboards/student.html",
    instructor: "/dashboards/instructor.html",
    admin: "/dashboards/admin.html"
  };

  if (role === "guest" || role == null || role === "") {
    window.location.replace("/academy/?account=active");
    return;
  }

  if (!destinations[role]) {
    message("الدور المسجل غير معروف. تم إيقاف التوجيه إلى اللوحات المحمية.", true);
    return;
  }

  window.location.replace(destinations[role]);
}

const loginForm = $("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = $("email").value.trim();
    const password = $("password").value;

    if (!email || !password) return message("أدخل البريد الإلكتروني وكلمة المرور.", true);

    const button = loginForm.querySelector("button[type=submit]");
    button.disabled = true;
    message("جارٍ تسجيل الدخول...");

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await routeByRole();
    } catch (error) {
      message(error.message || "تعذر تسجيل الدخول.", true);
    } finally {
      button.disabled = false;
    }
  });

  $("google-login")?.addEventListener("click", async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/academy/account/login.html?oauth=1`
      }
    });
    if (error) message(error.message, true);
  });

  // استكمال جلسة Google بعد العودة من مزود الهوية
  if (new URLSearchParams(location.search).get("oauth") === "1") {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) return message(error.message, true);
      if (data.session) routeByRole();
    });
  }
}

const signupForm = $("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = $("email").value.trim();
    const password = $("password").value;
    const confirm = $("confirm-password").value;

    if (password.length < 8) return message("كلمة المرور يجب ألا تقل عن 8 أحرف.", true);
    if (password !== confirm) return message("كلمتا المرور غير متطابقتين.", true);

    const button = signupForm.querySelector("button[type=submit]");
    button.disabled = true;
    message("جارٍ إنشاء الحساب...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/academy/account/login.html`
        }
      });

      if (error) throw error;

      if (data.session) {
        message("تم إنشاء الحساب. يمكنك الآن تسجيل الدخول.");
        window.location.replace("/academy/account/login.html?created=1");
      } else {
        message("تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.");
      }
    } catch (error) {
      message(error.message || "تعذر إنشاء الحساب.", true);
    } finally {
      button.disabled = false;
    }
  });
}

if (new URLSearchParams(location.search).has("created")) {
  message("تم إنشاء الحساب. أكمل تأكيد البريد الإلكتروني ثم سجّل الدخول.");
}
