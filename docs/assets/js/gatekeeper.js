import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://suvpaunulhqfoclepwoz.supabase.co",
    "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b"
);

const ROLE_ROUTES = {
    admin: "/dashboards/admin.html",
    instructor: "/dashboards/instructor.html",
    student: "/dashboards/student.html"
};

async function getMyRole() {
    const { data, error } = await supabase.rpc("get_my_role");

    if (error) {
        console.error("تعذر التحقق من دور المستخدم:", error.message);
        return null;
    }

    const role = typeof data === "string" ? data.toLowerCase() : null;
    return Object.prototype.hasOwnProperty.call(ROLE_ROUTES, role)
        ? role
        : null;
}

function applyGuestUI() {
    document.querySelectorAll(".member-only").forEach(el => {
        el.style.display = "none";
    });
    document.querySelectorAll(".guest-only").forEach(el => {
        el.style.display = "block";
    });
}

function applyMemberUI() {
    document.querySelectorAll(".guest-only").forEach(el => {
        el.style.display = "none";
    });
    document.querySelectorAll(".member-only").forEach(el => {
        el.style.display = "block";
    });
}

async function handleAccessControl() {
    const path = window.location.pathname;
    const isAuthPage =
        path.includes("login.html") || path.includes("signup.html");
    const isDashboard = path.includes("/dashboards/");

    const { data, error } = await supabase.auth.getSession();

    if (error) {
        console.error("تعذر قراءة جلسة المستخدم:", error.message);
    }

    const user = data?.session?.user;

    if (!user) {
        applyGuestUI();

        if (isDashboard) {
            window.location.replace("/login.html");
        }
        return;
    }

    if (isAuthPage || isDashboard) {
        const role = await getMyRole();

        if (!role) {
            console.error("لا يوجد دور صالح لهذا الحساب.");
            window.location.replace("/index.html");
            return;
        }

        const correctRoute = ROLE_ROUTES[role];

        if (isAuthPage || (isDashboard && !path.endsWith(correctRoute.split("/").pop()))) {
            window.location.replace(correctRoute);
            return;
        }
    }

    applyMemberUI();
}

window.logout = async function () {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("تعذر تسجيل الخروج:", error.message);
        return;
    }

    window.location.href = "/index.html";
};

document.addEventListener("DOMContentLoaded", handleAccessControl);

// زر الدعوة إلى المسارات التعليمية
document.addEventListener("DOMContentLoaded", () => {
    const ctaBtn = document.getElementById("main-cta-btn");
    let currentUser = null;

    try {
        currentUser = JSON.parse(localStorage.getItem("currentUser"));
    } catch {
        currentUser = null;
    }

    if (!ctaBtn) return;

    ctaBtn.addEventListener("click", event => {
        event.preventDefault();

        window.location.href = currentUser
            ? "./pathways/index.html"
            : "./academy/enrollment.html";
    });

    if (currentUser) {
        ctaBtn.textContent = "تابع رحلتك التعليمية";
    }
});
