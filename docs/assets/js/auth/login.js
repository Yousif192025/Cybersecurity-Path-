import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 1. إعدادات الربط بـ Supabase
const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";

/**
 * 2. تطبيق استراتيجية النسخة الواحدة (Singleton Pattern)
 * نستخدم globalThis لضمان وجود كائن واحد فقط للمكتبة في كامل ذاكرة المتصفح
 * ونضيف إعدادات التحقق من الجلسة لمنع تكرار الـ GoTrueClient
 */
if (!globalThis.supabaseInstance) {
    globalThis.supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'cyberpath-auth-token' // مفتاح مخصص لمنع التعارض مع مشاريع أخرى
        }
    });
}

// تعريف المتغير الثابت لاستخدامه في الدوال أدناه
const supabase = globalThis.supabaseInstance;

/**
 * 3. دالة تسجيل الدخول بالبريد وكلمة المرور
 */
window.login = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // التحقق من الحقول الفارغة
    if (!email || !password) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ 
            email: email, 
            password: password 
        });

        if (error) {
            alert("خطأ في تسجيل الدخول: " + error.message);
        } else if (data.user) {
            console.log("تم الدخول بنجاح", data.user);
            // التوجيه للرئيسية بعد نجاح الدخول
            window.location.href = "/index.html"; 
        }
    } catch (err) {
        console.error("Unexpected login error:", err);
        alert("حدث خطأ غير متوقع أثناء محاولة الدخول.");
    }
};

/**
 * 4. دالة تسجيل الدخول عبر Google
 */
window.loginWithGoogle = async function() {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { 
                redirectTo: window.location.origin + '/landing.html' 
            }
        });

        if (error) {
            alert("خطأ في الاتصال بـ Google: " + error.message);
        }
    } catch (err) {
        console.error("OAuth error:", err);
    }
};
