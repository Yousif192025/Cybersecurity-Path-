import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabase = createClient(
    "https://suvpaunulhqfoclepwoz.supabase.co", 
    "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b"
);

async function handleAccessControl() {
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('signup.html');
    const isDashboard = path.includes('/dashboards/');

    // جلب الجلسة الحالية
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    // --- 1. حالة الضيف (Guest) ---
    if (!user) {
        applyGuestUI();
        if (isDashboard) {
            // إذا كان في دشبورد وهو ضيف، يطرد لصفحة اللوجن
            window.location.href = "/login.html"; 
        }
        return;
    }

    // --- 2. حالة المسجل (Member) ---
    
    // أ: إذا كان في صفحة اللوجن وهو مسجل أصلاً -> وجهه فوراً لدشبورده
    if (isAuthPage) {
        await redirectToDashboard(user);
        return;
    }

    // ب: إذا كان داخل الدشبورد -> تأكد أن دوره يسمح له بالتواجد في هذه الصفحة تحديداً
    if (isDashboard) {
        await verifyDashboardRole(user, path);
    }

    // ج: تحديث الواجهة (إخفاء/إظهار أزرار)
    applyMemberUI(user);
}

// دالة التوجيه الذكي
async function redirectToDashboard(user) {
    const { data: profile } = await supabase
        .from("user_profile")
        .select("role")
        .eq("user_id", user.id)
        .single();

    const role = profile?.role || 'student';

    if (role === 'admin') window.location.href = "/dashboards/admin.html";
    else if (role === 'instructor') window.location.href = "/dashboards/instructor.html";
    else window.location.href = "/dashboards/student.html";
}

// دالة حماية الدشبوردات من دخول أدوار خاطئة (مثلاً طالب يدخل للأدمن)
async function verifyDashboardRole(user, path) {
    const { data: profile } = await supabase
        .from("user_profile")
        .select("role")
        .eq("user_id", user.id)
        .single();
    
    const role = profile?.role || 'student';

    if (path.includes('admin.html') && role !== 'admin') {
        window.location.href = "/dashboards/student.html";
    }
    if (path.includes('instructor.html') && role === 'student') {
        window.location.href = "/dashboards/student.html";
    }
}

function applyGuestUI() {
    document.querySelectorAll('.member-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'block');
}

function applyMemberUI(user) {
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.member-only').forEach(el => el.style.display = 'block');
}

// دالة تسجيل الخروج (أضفتها لك لتكون جاهزة لربطها بأي زر)
window.logout = async function() {
    await supabase.auth.signOut();
    window.location.href = "/index.html";
}

document.addEventListener('DOMContentLoaded', handleAccessControl);
