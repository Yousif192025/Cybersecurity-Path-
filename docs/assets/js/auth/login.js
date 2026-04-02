// import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";

// الحل الذكي: التحقق مما إذا كان Supabase موجوداً مسبقاً في الذاكرة
if (!window.supabase) {
    window.supabase = createClient(supabaseUrl, supabaseKey);
}
const supabase = window.supabase;

// بقية الكود الخاص بـ login...
// بيانات مشروعك الحقيقية لربط Supabase
const supabase = createClient(
    "https://suvpaunulhqfoclepwoz.supabase.co", 
    "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b"
);

// ربط الدالة بالنافذة لتكون مرئية للـ HTML
window.login = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        alert("خطأ في تسجيل الدخول: " + error.message);
    } else {
        console.log("تم الدخول بنجاح", data.user);
        // التوجيه التلقائي بعد نجاح الدخول
        window.location.href = "/index.html"; 
    }
};

window.loginWithGoogle = async function() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
            redirectTo: window.location.origin + '/index.html' 
        }
    });

    if (error) alert("خطأ في الاتصال بـ Google: " + error.message);
};
