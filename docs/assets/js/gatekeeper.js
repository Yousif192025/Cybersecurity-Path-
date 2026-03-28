import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// 1. إعدادات الاتصال بـ Supabase
const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * الدالة الرئيسية للتحكم في الوصول
 */
async function handleAccessControl() {
    // تحديد المسار الحالي للتأكد هل نحن في صفحة دخول أم صفحة محمية
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('signup.html') || path === '/';
    const isDashboardPage = path.includes('/dashboards/');

    // جلب بيانات المستخدم الحالي
    const { data: { user }, error } = await supabase.auth.getUser();

    // --- الحالة الأولى: المستخدم "ضيف" (غير مسجل دخول) ---
    if (!user || error) {
        console.log("الوضعية: ضيف (Guest)");
        applyGuestUI();
        
        // إذا حاول الضيف دخول صفحات الدشبورد، يتم طرده فوراً
        if (isDashboardPage) {
            alert("عذراً، هذه المنطقة للأعضاء فقط. يرجى تسجيل الدخول.");
            window.location.href = "/index.html"; 
        }
        return;
    }

    // --- الحالة الثانية: المستخدم "مسجل" (Member) ---
    console.log("الوضعية: مستخدم مسجل -", user.email);

    // جلب دور المستخدم من قاعدة البيانات (user_profile)
    const { data: profile, error: profileError } = await supabase
        .from("user_profile")
        .select("role")
        .eq("user_id", user.id)
        .single();

    // تحديد الدور (إذا لم يوجد بروفايل، نعتبره طالب افتراضياً)
    const role = (profile && profile.role) ? profile.role : 'student';

    // 1. تحديث شكل الواجهة (إخفاء أزرار الدخول وإظهار أزرار التحكم)
    applyMemberUI(role);

    // 2. إذا كان المستخدم في صفحة الدخول (login) وهو مسجل بالفعل، نوجهه لمكانه الصحيح
    if (isAuthPage) {
        redirectByRole(role);
        return;
    }

    // 3. حماية المسارات المتقاطعة (منع طالب من دخول صفحة أدمن مثلاً)
    verifyInternalAccess(role, path);
}

/**
 * تحديث الواجهة لتناسب الضيف
 */
function applyGuestUI() {
    document.querySelectorAll('.member-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'block');
    document.body.classList.add('is-guest');
}

/**
 * تحديث الواجهة لتناسب العضو حسب دوره
 */
function applyMemberUI(role) {
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.member-only').forEach(el => el.style.display = 'block');

    // إظهار العناصر الخاصة بكل دور (مثل أزرار معينة للأدمن فقط)
    document.querySelectorAll('.role-specific').forEach(el => {
        if (el.classList.contains(`role-${role}`)) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
}

/**
 * التوجيه التلقائي بناءً على الدور
 */
function redirectByRole(role) {
    if (role === 'admin') {
        window.location.href = "/dashboards/admin.html";
    } else if (role === 'instructor') {
        window.location.href = "/dashboards/instructor.html";
    } else {
        window.location.href = "/dashboards/student.html";
    }
}

/**
 * منع المستخدمين من دخول صفحات لا تخص أدوارهم
 */
function verifyInternalAccess(role, path) {
    if (path.includes('admin.html') && role !== 'admin') {
        window.location.href = "/dashboards/student.html";
    }
    if (path.includes('instructor.html') && (role !== 'instructor' && role !== 'admin')) {
        window.location.href = "/dashboards/student.html";
    }
}

/**
 * دالة تسجيل الخروج (يمكنك ربطها بأي زر)
 */
window.logout = async function() {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    window.location.href = "/index.html";
}

// تشغيل الحارس فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', handleAccessControl);
