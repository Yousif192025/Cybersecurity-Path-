import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
const supabase = createClient("URL_الخاص_بك", "KEY_الخاص_بك");

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
