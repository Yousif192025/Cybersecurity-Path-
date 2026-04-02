import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";

// 1. التحقق من وجود نسخة مسبقة لتجنب تحذير Multiple Instances
if (!window.supabase) {
    window.supabase = createClient(supabaseUrl, supabaseKey);
}

// 2. استخدام النسخة الموحدة (window.supabase)
const supabase = window.supabase;

// --- دالة تسجيل الدخول العادي ---
window.login = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email, 
        password: password 
    });

    if (error) {
        alert("خطأ في تسجيل الدخول: " + error.message);
    } else {
        console.log("تم الدخول بنجاح", data.user);
        // التوجيه للرئيسية بعد النجاح
        window.location.href = "/index.html"; 
    }
};

// --- دالة تسجيل الدخول عبر جوجل ---
window.loginWithGoogle = async function() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
            redirectTo: window.location.origin + '/index.html' 
        }
    });

    if (error) {
        alert("خطأ في الاتصال بـ Google: " + error.message);
    }
};
