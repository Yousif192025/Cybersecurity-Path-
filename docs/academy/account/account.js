import { supabase } from "./client.js";

const $ = (id) => document.getElementById(id);

const message = (text, error = false) => {
  const el = $("message");
  if (!el) return;
  el.textContent = text;
  el.dataset.state = error ? "error" : "success";
};

/** رسائل عربية موحّدة — بدون تفاصيل تقنية حساسة */
function friendlyError(err) {
  const raw = (err && err.message ? String(err.message) : "").toLowerCase();
  if (!raw) return "تعذر إكمال العملية. حاول مرة أخرى.";
  if (raw.includes("invalid login") || raw.includes("invalid credentials")) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }
  if (raw.includes("email not confirmed")) {
    return "يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول.";
  }
  if (raw.includes("user already registered") || raw.includes("already been registered")) {
    return "هذا البريد مسجّل مسبقًا. يمكنك تسجيل الدخول.";
  }
  if (raw.includes("rate limit") || raw.includes("too many")) {
    return "محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.";
  }
  if (raw.includes("network") || raw.includes("fetch")) {
    return "تعذر الاتصال بالخدمة. تحقق من الشبكة وحاول مجددًا.";
  }
  return "تعذر إكمال العملية. حاول مرة أخرى.";
}

const DESTINATIONS = {
  student: "/academy/control/",
  instructor: "/academy/control/",
  admin: "/academy/control/",
};

/** أدوار حساب مسجّلة فقط — الزائر ليس دورًا في قاعدة البيانات */
const REGISTERED_ROLES = new Set(["student", "instructor", "admin"]);

let routeInFlight = false;

/**
 * يوجّه حسب get_my_role فقط.
 * - لا يقرأ user_metadata
 * - لا يمنح دورًا افتراضيًا
 * - NULL/فارغ بعد تسجيل الدخول ≠ زائر
 * @returns {Promise<boolean>} true إذا بدأ تحويلًا ناجحًا للوحة
 */
async function routeByRole() {
  if (routeInFlight) return false;
  routeInFlight = true;

  try {
    message("تم التحقق من الحساب. جارٍ تحديد صلاحيات الدخول...");

    const { data: role, error } = await supabase.rpc("get_my_role");

    if (error) {
      message(
        "تعذر التحقق من صلاحيات الحساب. يمكنك استخدام المحتوى المفتوح، ولم نمنحك دخولًا إلى لوحة محمية.",
        true
      );
      routeInFlight = false;
      return false;
    }

    const normalized =
      role == null || role === ""
        ? null
        : String(role).trim().toLowerCase();

    // حساب مسجّل الدخول بلا دور وظيفي مُجهّز — ليس زائرًا
    if (normalized == null || normalized === "guest") {
      message(
        "حسابك موجود، لكن ملف الصلاحيات غير مُجهّز بعد أو قيد المراجعة. لم يُمنح دخول إلى اللوحات المحمية، ولم يُنشأ أي ربط أكاديمي تلقائي. يمكنك تصفح المحتوى المفتوح أو المحاولة لاحقًا.",
        true
      );
      routeInFlight = false;
      return false;
    }

    if (!REGISTERED_ROLES.has(normalized) || !DESTINATIONS[normalized]) {
      message(
        "الدور المسجّل على الحساب غير معروف. تم إيقاف التوجيه إلى اللوحات المحمية.",
        true
      );
      routeInFlight = false;
      return false;
    }

    // تحويل ناجح: أبقِ routeInFlight = true لمنع تكرار التوجيه في نفس التحميل
    window.location.replace(DESTINATIONS[normalized]);
    return true;
  } catch (_err) {
    message("تعذر إكمال التحقق من الصلاحيات. حاول مرة أخرى.", true);
    routeInFlight = false;
    return false;
  }
}

function wireLogin() {
  const loginForm = $("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = $("email")?.value.trim();
    const password = $("password")?.value;

    if (!email || !password) {
      message("أدخل البريد الإلكتروني وكلمة المرور.", true);
      return;
    }

    const button = loginForm.querySelector("button[type=submit]");
    if (button) button.disabled = true;
    message("جارٍ تسجيل الدخول...");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await routeByRole();
    } catch (err) {
      message(friendlyError(err), true);
    } finally {
      if (button) button.disabled = false;
    }
  });

  $("google-login")?.addEventListener("click", async () => {
    message("جارٍ التحويل إلى Google...");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/academy/account/login.html?oauth=1`,
      },
    });
    if (error) message(friendlyError(error), true);
  });

  // استعادة جلسة OAuth: لا توجيه قبل وجود session
  const params = new URLSearchParams(location.search);
  if (params.get("oauth") === "1") {
    let handled = false;
    /** @type {{ unsubscribe?: () => void } | null} */
    let subscription = null;
    let timeoutId = null;

    const safeUnsubscribe = () => {
      try {
        subscription?.unsubscribe?.();
      } catch (_e) {
        /* ignore */
      }
      subscription = null;
      if (timeoutId != null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const finishOAuthFailure = (text) => {
      if (handled) return;
      handled = true;
      safeUnsubscribe();
      message(text, true);
    };

    const tryRouteIfSession = async (session) => {
      if (handled || !session) return;
      handled = true;
      // ألغِ الاشتراك فورًا قبل التوجيه حتى لا تُعالج أحداث لاحقة
      safeUnsubscribe();
      await routeByRole();
    };

    message("جارٍ استعادة الجلسة بعد تسجيل Google...");

    // ابدأ المهلة قبل الاشتراك، حتى تكون قابلة للإلغاء في كل مسارات الخروج.
    timeoutId = setTimeout(() => {
      finishOAuthFailure(
        "تعذر استعادة الجلسة بعد Google. أعد المحاولة أو استخدم البريد الإلكتروني."
      );
    }, 15000);

    try {
      // نؤجل معالجة الحدث إلى microtask لضمان اكتمال إسناد subscription
      // حتى لو أُطلق callback مبكرًا أثناء إنشاء الاشتراك.
      const authListener = supabase.auth.onAuthStateChange((event, session) => {
        if (handled || !session) return;

        if (
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "INITIAL_SESSION"
        ) {
          Promise.resolve().then(() => {
            if (!handled) void tryRouteIfSession(session);
          });
        }
      });
      subscription = authListener?.data?.subscription ?? null;
    } catch (_err) {
      finishOAuthFailure(
        "تعذر تهيئة استعادة جلسة Google. أعد المحاولة أو استخدم البريد الإلكتروني."
      );
      return;
    }

    // Promise.resolve يلتقط الرفض سواء حدث من getSession أو من استدعائه نفسه.
    Promise.resolve()
      .then(() => supabase.auth.getSession())
      .then(({ data, error }) => {
        if (handled) return;
        if (error) {
          finishOAuthFailure(friendlyError(error));
          return;
        }
        if (data?.session) {
          void tryRouteIfSession(data.session);
        }
      })
      .catch((err) => {
        finishOAuthFailure(friendlyError(err));
      });
  }
}

function wireSignup() {
  const signupForm = $("signup-form");
  if (!signupForm) return;

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = $("email")?.value.trim();
    const password = $("password")?.value;
    const confirm = $("confirm-password")?.value;

    if (!email) {
      message("أدخل البريد الإلكتروني.", true);
      return;
    }
    if (!password || password.length < 8) {
      message("كلمة المرور يجب ألا تقل عن 8 أحرف.", true);
      return;
    }
    if (password !== confirm) {
      message("كلمتا المرور غير متطابقتين.", true);
      return;
    }

    const button = signupForm.querySelector("button[type=submit]");
    if (button) button.disabled = true;
    message("جارٍ إنشاء الحساب...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/academy/account/login.html`,
        },
      });
      if (error) throw error;

      if (data.session) {
        message("تم إنشاء الحساب. جارٍ التحقق من صلاحيات الدخول...");
        await routeByRole();
      } else {
        message(
          "تم إنشاء الحساب. أكّد بريدك الإلكتروني من الرسالة المرسلة إليك، ثم سجّل الدخول. إنشاء الحساب لا يمنح صلاحية أكاديمية أو إدارية تلقائيًا."
        );
      }
    } catch (err) {
      message(friendlyError(err), true);
    } finally {
      if (button) button.disabled = false;
    }
  });
}

wireLogin();
wireSignup();

if (new URLSearchParams(location.search).has("created")) {
  message(
    "تم إنشاء الحساب. أكمل تأكيد البريد الإلكتروني إن طُلب منك، ثم سجّل الدخول."
  );
}
