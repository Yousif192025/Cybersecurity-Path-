/**
 * Dynamic Dashboard Router
 * يتحقق من جلسة المستخدم ودوره عبر RPC محدود الصلاحيات.
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";

if (!window.supabaseClient) {
    window.supabaseClient = createClient(supabaseUrl, supabaseKey);
}

const supabase = window.supabaseClient;

const DASHBOARD_ROUTES = {
    guest: {
        html: "dashboards/guest.html",
        js: "assets/js/dashboards/guest.js",
        init: "initGuestDashboard"
    },
    student: {
        html: "dashboards/student.html",
        js: "assets/js/dashboards/student.js",
        init: "initStudentDashboard"
    },
    instructor: {
        html: "dashboards/instructor.html",
        js: "assets/js/dashboards/instructor.js",
        init: "initInstructorDashboard"
    },
    admin: {
        html: "dashboards/admin.html",
        js: "assets/js/dashboards/admin.js",
        init: "initAdminDashboard"
    }
};

const DASHBOARD_CONTAINER_ID = "main-dashboard-content";
let currentAuthorizedRole = "guest";

async function getMyRole() {
    const { data, error } = await supabase.rpc("get_my_role");

    if (error) {
        console.error("تعذر التحقق من دور المستخدم:", error.message);
        return null;
    }

    const role = typeof data === "string" ? data.toLowerCase() : null;

    return Object.prototype.hasOwnProperty.call(DASHBOARD_ROUTES, role)
        ? role
        : null;
}

async function checkAuthAndRoute() {
    console.log("جاري التحقق من جلسة المستخدم...");

    try {
        const {
            data: { session },
            error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session?.user) {
            currentAuthorizedRole = "guest";
            await loadDashboardView("guest");
            return;
        }

        const role = await getMyRole();

        if (!role) {
            console.error("تعذر إثبات دور الحساب؛ سيتم عرض واجهة الضيف فقط.");
            currentAuthorizedRole = "guest";
            await loadDashboardView("guest");
            return;
        }

        currentAuthorizedRole = role;
        await loadDashboardView(role);

    } catch (err) {
        console.error("فشل التحقق من الجلسة:", err.message);
        currentAuthorizedRole = "guest";
        await loadDashboardView("guest");
    }
}

async function loadDashboardView(role) {
    // يمنع التبديل اليدوي إلى لوحة لا تطابق الدور الذي تم التحقق منه.
    if (role !== currentAuthorizedRole) {
        console.warn("تم رفض طلب تحميل لوحة لا تطابق الدور المصرح به.");
        role = currentAuthorizedRole;
    }

    const route = DASHBOARD_ROUTES[role];
    const container = document.getElementById(DASHBOARD_CONTAINER_ID);

    if (!route || !container) {
        console.error("تعذر العثور على مسار اللوحة أو حاوية العرض.");
        return;
    }

    console.log(`جاري تحميل لوحة: ${role}`);

    try {
        const response = await fetch(route.html);

        if (!response.ok) {
            throw new Error(`تعذر تحميل ملف الواجهة: ${route.html}`);
        }

        container.innerHTML = await response.text();

        const scriptId = `script-dynamic-${role}`;
        const oldScript = document.getElementById(scriptId);

        if (oldScript) oldScript.remove();

        const script = document.createElement("script");
        script.id = scriptId;
        script.type = "module";
        script.src = route.js;

        script.onload = () => {
            if (typeof window[route.init] === "function") {
                window[route.init]();
            } else {
                console.warn(`لم يتم العثور على ${route.init}().`);
            }
        };

        script.onerror = () => {
            console.error(`تعذر تحميل ملف JavaScript: ${route.js}`);
        };

        document.head.appendChild(script);

    } catch (err) {
        console.error(`فشل تحميل لوحة ${role}:`, err);
        container.textContent =
            "حدث خطأ أثناء تحميل الواجهة. يرجى تحديث الصفحة.";
    }
}

supabase.auth.onAuthStateChange(event => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        // تأجيل الفحص إلى ما بعد انتهاء callback الخاص بالمصادقة.
        queueMicrotask(() => checkAuthAndRoute());
    }
});

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAuthAndRoute);
} else {
    checkAuthAndRoute();
}

window.forceRouteTo = loadDashboardView;
