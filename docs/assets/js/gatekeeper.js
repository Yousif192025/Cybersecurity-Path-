import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// إعدادات الاتصال بـ Supabase
const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * دالة التحقق من الصلاحيات والتحكم في واجهة المستخدم
 */
async function handleAccessControl() {
    const { data: { user }, error } = await supabase.auth.getUser();

    // --- أولاً: حالة المستخدم (ضيف - Guest) ---
    if (!user || error) {
        console.log("الوضعية الحالية: ضيف (Guest)");
        applyGuestUI();
        protectPrivatePages(); // منع الضيف من دخول لوحات التحكم
        return;
    }

    // --- ثانياً: حالة المستخدم (مسجل - Member) ---
    console.log("الوضعية الحالية: مستخدم مسجل -", user.email);
    
    // جلب دور المستخدم من قاعدة البيانات
    const { data: profile } = await supabase
        .from("user_profile")
        .select("role")
        .eq("user_id", user.id)
        .single();

    const role = profile ? profile.role : 'student'; // افتراضياً طالب إذا لم يوجد بروفايل
    applyMemberUI(role);
    verifyPageAccess(role); // التأكد أن الأدمن في صفحة الأدمن وهكذا
}

/**
 * وظائف التحكم في واجهة المستخدم للضيف
 */
function applyGuestUI() {
    // إخفاء أزرار لوحات التحكم وإظهار أزرار الدخول
    document.querySelectorAll('.member-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'block');
    
    // إضافة وسم للجسم للتحكم عبر CSS إذا أردت
    document.body.classList.add('is-guest');
}

/**
 * وظائف التحكم في واجهة المستخدم للأعضاء (حسب الدور)
 */
function applyMemberUI(role) {
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.member-only').forEach(el => el.style.display = 'block');

    // إظهار المحتوى المخصص لكل دور فقط
    document.querySelectorAll('.role-specific').forEach(el => {
        if (el.classList.contains(`role-${role}`)) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
}

/**
 * حماية الصفحات من دخول الضيوف عبر الرابط المباشر
 */
function protectPrivatePages() {
    const path = window.location.pathname;
    if (path.includes('/dashboards/')) {
        alert("عذراً، يجب تسجيل الدخول للوصول لهذه الصفحة");
        window.location.href = "/index.html"; // إعادة الضيف للصفحة الرئيسية
    }
}

/**
 * التأكد من أن المستخدم المصرح له في المكان الصحيح
 */
function verifyPageAccess(role) {
    const path = window.location.pathname;
    // إذا حاول طالب دخول صفحة الأدمن
    if (path.includes('admin.html') && role !== 'admin') {
        window.location.href = "/dashboards/student.html";
    }
    // إذا حاول مدرب دخول صفحة الأدمن
    if (path.includes('admin.html') && role === 'instructor') {
         window.location.href = "/dashboards/instructor.html";
    }
}

// تشغيل الحارس فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', handleAccessControl);

// تصدير نسخة supabase لاستخدامها في ملفات أخرى إذا لزم الأمر
export { supabase };
