import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";
const supabase = createClient(supabaseUrl, supabaseKey);

window.handleTempLogin = async function() {
    const idInput = document.getElementById("nationalId").value.trim();
    const msgElement = document.getElementById("msg");

    if (idInput.length < 10) {
        msgElement.innerText = "يرجى إدخال رقم هوية صحيح.";
        return;
    }

    // المنطق الجديد: البريد هو رقم الهوية + النطاق الذي أنشأناه في SQL
    const userEmail = `${idInput}@cyberpath.edu`;
    const userPass = idInput; // كلمة المرور الافتراضية هي رقم الهوية

    msgElement.style.color = "#007bff";
    msgElement.innerText = "جاري التحقق والربط...";

    // محاولة إنشاء حساب (Signup) لربط الـ UID بالسجل
    const { data, error } = await supabase.auth.signUp({
        email: userEmail,
        password: userPass
    });

    if (error) {
        // إذا كان الحساب موجوداً مسبقاً، نقوم بعمل تسجيل دخول عادي
        if (error.message.includes("already registered")) {
            const { error: loginErr } = await supabase.auth.signInWithPassword({
                email: userEmail,
                password: userPass
            });
            
            if (loginErr) {
                msgElement.style.color = "red";
                msgElement.innerText = "خطأ في الدخول: " + loginErr.message;
            } else {
                msgElement.style.color = "green";
                msgElement.innerText = "تم التحقق بنجاح! سيتم توجيهك...";
                setTimeout(() => window.location.href = "success-page.html", 2000);
            }
        } else {
            msgElement.style.color = "red";
            msgElement.innerText = "حدث خطأ: " + error.message;
        }
    } else {
        msgElement.style.color = "green";
        msgElement.innerText = "تم تفعيل حسابك وربطه بنجاح!";
        // هنا يمكنك توجيه الطالب لصفحة "نجاح العملية"
        setTimeout(() => window.location.href = "success-page.html", 2000);
    }
};
