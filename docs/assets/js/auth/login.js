import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY");

// ربط الدالة بالنافذة لتكون مرئية للـ HTML
window.login = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        alert("خطأ: " + error.message);
    } else {
        // هنا يتم استدعاء دالة التوجيه (الدور) التي شرحناها سابقاً
        console.log("تم الدخول بنجاح", data.user);
    }
};

window.loginWithGoogle = async function() {
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/index.html' }
    });
};
