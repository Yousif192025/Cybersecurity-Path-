import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";

// استخدام استراتيجية النسخة الواحدة لضمان عدم تكرار الاتصال
if (!window.supabase) {
    window.supabase = createClient(supabaseUrl, supabaseKey);
}
const supabase = window.supabase;

/**
 * جلب بيانات الطالب وعرضها في لوحة التحكم
 */
async function loadStudentData() {
    try {
        // 1. الحصول على بيانات المستخدم الحالي من نظام Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("جلسة غير صالحة، توجيه لتسجيل الدخول...");
            window.location.href = "/docs/login.html";
            return;
        }

        // 2. جلب السجل الخاص بهذا الطالب من جدول user_profile
        // نستخدم user_id المربوط بـ Auth
        const { data: profile, error: profileError } = await supabase
            .from('user_profile')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (profileError) {
            console.error("خطأ في جلب بيانات الملف الشخصي:", profileError.message);
            return;
        }

        // 3. تحديث واجهة المستخدم (تأكد من وجود هذه الـ IDs في student.html)
        if (profile) {
            updateUIElement('student-name', profile.full_name);
            updateUIElement('student-id', profile.national_id);
            updateUIElement('student-track', profile.track || "لم يتم تحديد مسار");
            updateUIElement('student-status', profile.status || "نشط");
            
            // تحديث رسالة الترحيب العلوية إذا وجدت
            updateUIElement('welcome-msg', `مرحباً بك، ${profile.full_name.split(' ')[0]}`);
        }

    } catch (err) {
        console.error("حدث خطأ غير متوقع:", err);
    }
}

/**
 * دالة مساعدة لتحديث نصوص الـ HTML بأمان
 */
function updateUIElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = value;
    }
}

// دالة تسجيل الخروج
window.handleLogout = async function() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        window.location.href = "/docs/login.html";
    } else {
        alert("فشل تسجيل الخروج: " + error.message);
    }
};

// تشغيل الدالة فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadStudentData);
