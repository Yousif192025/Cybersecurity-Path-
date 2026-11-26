/**
 * نظام التحكم والتبديل المركزي (Dynamic Dashboard Router)
 * الوظيفة:
 * 1. مراقبة حالة تسجيل الدخول عبر Supabase Auth.
 * 2. جلب دور المستخدم (Role) من جدول user_profile.
 * 3. تحميل وحقن كود الـ HTML والـ JS الخاص باللوحة المناسبة (Lazy Loading).
 * 4. التعامل مع الزوار غير المسجلين وحقن واجهة الضيف (Guest) تلقائياً.
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ============================================
// 1. إعداد الاتصال المركزي (استراتيجية النسخة الواحدة)
// ============================================
const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";

if (!window.supabaseClient) {
    window.supabaseClient = createClient(supabaseUrl, supabaseKey);
}
const supabase = window.supabaseClient;

// تكوين مسارات الملفات للحقن الكسول
const DASHBOARD_ROUTES = {
    guest: {
        html: 'dashboards/guest.html',
        js: 'assets/js/dashboards/guest.js',
        init: 'initGuestDashboard'
    },
    student: {
        html: 'dashboards/student.html',
        js: 'assets/js/dashboards/student.js',
        init: 'initStudentDashboard'
    },
    instructor: {
        html: 'dashboards/instructor.html',
        js: 'assets/js/dashboards/instructor.js',
        init: 'initInstructorDashboard'
    },
    admin: {
        html: 'dashboards/admin.html',
        js: 'assets/js/dashboards/admin.js',
        init: 'initAdminDashboard'
    }
};

// حاوية الحقن الرئيسية في صفحتك الأساسية
const DASHBOARD_CONTAINER_ID = 'main-dashboard-content';

// ============================================
// 2. إدارة الجلسة والتحقق من الأدوار
// ============================================

/**
 * الدالة المحركة للنظام - تفحص المستخدم وتوجهه للوحة الصحيحة
 */
async function checkAuthAndRoute() {
    console.log('🔄 جاري فحص حالة الجلسة والتوجيه المركزي...');
    
    try {
        // الحصول على الجلسة الحالية
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        // إذا لم تكن هناك جلسة نشطة -> توجيه تلقائي لواجهة الضيف المفتوحة
        if (!session || !session.user) {
            console.log('🌐 لا توجد جلسة نشطة، تحويل المستخدم إلى واجهة الضيف المفتوحة.');
            await loadDashboardView('guest');
            return;
        }

        const user = session.user;
        
        // جلب تفاصيل الدور الحقيقي من جدول الملف الشخصي
        const { data: profile, error: profileError } = await supabase
            .from('user_profile')
            .select('role')
            .eq('user_id', user.id)
            .single();

        if (profileError || !profile) {
            console.warn('⚠️ تعذر العثور على صلاحيات مخصصة، سيتم استخدام لوحة الطالب كوضع افتراضي حماية للنظام.');
            await loadDashboardView('student');
            return;
        }

        // التوجيه بناءً على الدور القادم من قاعدة البيانات (admin, instructor, student)
        const userRole = profile.role.toLowerCase();
        if (DASHBOARD_ROUTES[userRole]) {
            await loadDashboardView(userRole);
        } else {
            console.error(`❌ دور المستخدم غير معروف: ${userRole}`);
            await loadDashboardView('guest');
        }

    } catch (err) {
        console.error('❌ خطأ في فحص الصلاحيات المركزي:', err.message);
        // التوجيه للضيف كخط دفاع أخير لضمان عدم تجميد الشاشة
        await loadDashboardView('guest');
    }
}

// ============================================
// 3. آلية التحميل الكسول وحقن الملفات (Lazy Loader)
// ============================================

/**
 * شحن ملفات الـ HTML والـ JS ديناميكياً وتشغيل لوحة التحكم المطلوبة
 * @param {string} role دور المستخدم المستهدف (guest, student, instructor, admin)
 */
async function loadDashboardView(role) {
    const route = DASHBOARD_ROUTES[role];
    const container = document.getElementById(DASHBOARD_CONTAINER_ID);
    
    if (!container) {
        console.error(`❌ عنصر الحاوية #${DASHBOARD_CONTAINER_ID} غير موجود في الصفحة الرئيسية!`);
        return;
    }

    console.log(`⏳ جاري شحن وتجميع لوحة: [${role}]...`);

    try {
        // 1. جلب وحقن ملف الـ HTML الخاص بالواجهة
        const response = await fetch(route.html);
        if (!response.ok) throw new Error(`تعذر تحميل ملف الـ HTML: ${route.html}`);
        const htmlContent = await response.text();
        container.innerHTML = htmlContent;

        // 2. إنشاء وحقن سكريبت الـ JS ديناميكياً (بصيغة Module لدعم الـ Import المصحح)
        const oldScript = document.getElementById(`script-dynamic-${role}`);
        if (oldScript) oldScript.remove(); // تنظيف السكريبتات القديمة لمنع تداخل الحالة

        const script = document.createElement('script');
        script.id = `script-dynamic-${role}`;
        script.type = 'module'; // حل جذري لأخطاء الترجمة وعلامات الـ X
        script.src = `${route.js}?v=${new Date().getTime()}`; // كسر الكاش لضمان التحديث الفوري
        
        // 3. تشغيل دالة التهيئة بعد اكتمال تحميل السكريبت
        script.onload = () => {
            if (typeof window[route.init] === 'function') {
                window[route.init]();
                console.log(`🚀 تم تشغيل دالة التهيئة ${route.init}() بنجاح.`);
            } else {
                console.warn(`⚠️ الدالة ${route.init}() لم تكتشف في النطاق العالمي بعد.`);
            }
        };

        document.head.appendChild(script);

    } catch (err) {
        console.error(`❌ فشل تحميل ملفات واجهة [${role}]:`, err);
        container.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--danger);">⚠️ حدث خطأ أثناء تحميل واجهة المستخدم، يرجى تحديث الصفحة.</div>`;
    }
}

// ============================================
// 4. الاستماع لمتغيرات حالة الحساب (Auth State Changes)
// ============================================

// إعادة الفحص والتوجيه فوراً عند قيام المستخدم بتسجيل الدخول أو الخروج دون الحاجة لتحديث الصفحة
supabase.auth.onAuthStateChange((event, session) => {
    console.log(`🔔 حدث تغيير في حالة الحساب الأمنية: ${event}`);
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        checkAuthAndRoute();
    }
});

// تشغيل الفحص الأولي فور جاهزية الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAuthAndRoute);
} else {
    checkAuthAndRoute();
}

// تصدير دالة التوجيه اليدوي للنطاق العالمي للاستخدام عند الحاجة (مثل أزرار التبديل التجريبية)
window.forceRouteTo = loadDashboardView;
