import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
// بيانات مشروعك الحقيقية لربط Supabase
const supabase = createClient(
    "https://suvpaunulhqfoclepwoz.supabase.co", 
    "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b"
);
window.createAccount = async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // هنا يمكنك تحديد أن الدور الافتراضي هو "student"
            data: { role: 'student' } 
        }
    });
    
    if (error) alert(error.message);
    else alert("تم إنشاء الحساب! يرجى تأكيد البريد الإلكتروني.");
};
