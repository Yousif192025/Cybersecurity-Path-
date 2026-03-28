import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabase = createClient("URL_الخاص_بك", "KEY_الخاص_بك");

// --- 1. دالة فحص حالة المستخدم (الضيف والمسجل) ---
async function checkInitialAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // إذا كان مسجلاً بالفعل، وجهه فوراً لدشبورده ولا تتركه في صفحة اللوجن
        redirectUserByRole(user);
    } else {
        console.log("المستخدم الحالي ضيف - اظهر له فورم الدخول");
    }
}

// --- 2. دالة تسجيل الدخول بجوجل ---
window.loginWithGoogle = async function() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/index.html'
        }
    });
};

// استدعاء الفحص عند تحميل الملف
checkInitialAuth();
