/**
 * وحدة الطالب (Student Dashboard) - النسخة المدمجة والمصححة
 * يتم تحميلها ديناميكياً عند التبديل إلى واجهة الطالب
 * 
 * تم الدمج مع:
 * - الاتصال الآمن بـ Supabase (استراتيجية النسخة الواحدة)
 * - جلب بيانات الطالب من user_profile
 * - عرض الكروت والجداول ديناميكياً
 */

// ============================================
// 1. تهيئة اتصال Supabase (نسخة واحدة فقط)
// ============================================
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";

// استخدام استراتيجية النسخة الواحدة لضمان عدم تكرار الاتصال
if (!window.supabaseClient) {
    window.supabaseClient = createClient(supabaseUrl, supabaseKey);
}
const supabase = window.supabaseClient;

// ============================================
// 2. المتغيرات العامة للطالب
// ============================================
let currentStudentProfile = null;
let currentUser = null;

// ============================================
// 3. الدوال الرئيسية لواجهة الطالب
// ============================================

/**
 * دالة التهيئة الرئيسية لواجهة الطالب
 * يتم استدعاؤها من الملف الرئيسي (undashboard.html) أو تلقائياً
 */
async function initStudentDashboard() {
    console.log('🎓 جاري تهيئة لوحة تحكم الطالب...');
    
    // التحقق من الجلسة وجلب بيانات الطالب
    const isAuthenticated = await loadStudentData();
    
    if (isAuthenticated) {
        // تحديث الكروت الإحصائية
        renderStudentStats();
        
        // تحميل جدول المقررات
        await loadStudentCourses();
        
        // تحميل جدول المهام والواجبات
        await loadStudentAssignments();
        
        // تحديث بيانات إضافية (الشهادات، الإنجازات)
        await loadStudentAchievements();
    } else {
        // إذا لم يكن هناك جلسة صالحة، نعرض رسالة للمستخدم
        showUnauthorizedMessage();
    }
}

/**
 * جلب بيانات الطالب من Supabase وعرضها في لوحة التحكم
 * @returns {boolean} true إذا تم التحقق بنجاح، false إذا لم توجد جلسة
 */
async function loadStudentData() {
    try {
        // 1. الحصول على بيانات المستخدم الحالي من نظام Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.warn("⚠️ جلسة غير صالحة، يتم عرض واجهة الزائر فقط");
            return false;
        }

        currentUser = user;
        console.log(`✅ تم التحقق من المستخدم: ${user.email}`);

        // 2. جلب السجل الخاص بهذا الطالب من جدول user_profile
        const { data: profile, error: profileError } = await supabase
            .from('user_profile')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (profileError) {
            console.error("❌ خطأ في جلب بيانات الملف الشخصي:", profileError.message);
            // استخدام بيانات افتراضية للتجربة
            currentStudentProfile = getDefaultStudentProfile(user);
        } else {
            currentStudentProfile = profile;
        }

        // 3. تحديث واجهة المستخدم بالبيانات الحقيقية
        if (currentStudentProfile) {
            updateStudentUI(currentStudentProfile);
        }

        return true;

    } catch (err) {
        console.error("❌ حدث خطأ غير متوقع:", err);
        return false;
    }
}

/**
 * الحصول على بيانات طالب افتراضية (حالة تجريبية)
 */
function getDefaultStudentProfile(user) {
    return {
        full_name: user.email?.split('@')[0] || 'طالب جديد',
        national_id: 'غير محدد',
        track: 'مسار الأمن السيبراني',
        status: 'نشط',
        rank: 'متدرب مبتدئ',
        xp: 1250,
        progress: 34,
        email: user.email
    };
}

/**
 * تحديث واجهة المستخدم ببيانات الطالب
 */
function updateStudentUI(profile) {
    // تحديث اسم الطالب في أي مكان يظهر (كروت، ترحيب)
    const firstName = profile.full_name?.split(' ')[0] || 'طالب';
    updateUIElement('student-name', profile.full_name);
    updateUIElement('student-id', profile.national_id);
    updateUIElement('student-track', profile.track || "لم يتم تحديد مسار");
    updateUIElement('student-status', profile.status || "نشط");
    updateUIElement('welcome-msg', `مرحباً بك، ${firstName}`);
    
    // تحديث الاسم في القائمة الجانبية العلوية (إذا وجد)
    const userNameElement = document.getElementById('user-display-name');
    if (userNameElement && profile.full_name) {
        userNameElement.textContent = profile.full_name;
    }
    
    // تحديث الصورة الرمزية (Avatar)
    const avatarElement = document.getElementById('user-avatar');
    if (avatarElement && profile.full_name) {
        avatarElement.textContent = profile.full_name.charAt(0).toUpperCase();
    }
}

/**
 * دالة مساعدة لتحديث نصوص الـ HTML بأمان
 */
function updateUIElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = value || '---';
    }
}

/**
 * عرض إحصائيات الطالب (الكروت العلوية)
 */
function renderStudentStats() {
    const statsGrid = document.getElementById('student-stats-grid');
    if (!statsGrid) return;
    
    // استخدام البيانات الحقيقية أو الافتراضية
    const rank = currentStudentProfile?.rank || 'صائد ثغرات مبتدئ';
    const xp = currentStudentProfile?.xp || 2450;
    const progress = currentStudentProfile?.progress || 67;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <h4><i class="fas fa-trophy"></i> الرتبة السيبرانية</h4>
            <div class="val" style="color: var(--accent); font-size: 1.2rem;">${rank}</div>
        </div>
        <div class="stat-card">
            <h4><i class="fas fa-star"></i> نقاط الخبرة (XP)</h4>
            <div class="val" style="color: var(--warning);">${xp.toLocaleString()} نقطة</div>
        </div>
        <div class="stat-card" style="grid-column: 1 / -1;">
            <h4><i class="fas fa-chart-line"></i> التقدم في المسار التعليمي</h4>
            <div class="val">${progress}%</div>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%;"></div>
            </div>
            <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 8px;">
                ${getProgressMessage(progress)}
            </p>
        </div>
    `;
}

/**
 * رسالة تحفيزية حسب نسبة التقدم
 */
function getProgressMessage(progress) {
    if (progress >= 80) return '🚀 ممتاز! أنت في المراحل المتقدمة. استمر بهذا المستوى الرائع!';
    if (progress >= 50) return '📚 عمل جيد! أنت في منتصف الطريق. واصل التحديات القادمة.';
    if (progress >= 25) return '💪 بداية موفقة! أكمل المقررات لتعزز مهاراتك.';
    return '🌟 ابدأ رحلتك في الأمن السيبراني اليوم! كل خطوة تقربك من هدفك.';
}

/**
 * تحميل قائمة المقررات الدراسية من Supabase
 */
async function loadStudentCourses() {
    const tableBody = document.getElementById('student-courses-table');
    if (!tableBody) return;
    
    try {
        // محاولة جلب مقررات الطالب من قاعدة البيانات
        const { data: enrollments, error } = await supabase
            .from('user_enrollments')
            .select(`
                course_id,
                progress,
                status,
                courses:course_id (name, schedule, instructor)
            `)
            .eq('user_id', currentUser?.id)
            .eq('status', 'active');
        
        let courses = [];
        
        if (error || !enrollments || enrollments.length === 0) {
            // بيانات تجريبية إذا لم توجد مقررات مسجلة
            console.log('📚 استخدام بيانات تجريبية للمقررات');
            courses = getDefaultCourses();
        } else {
            // تحويل البيانات المسترجعة من Supabase
            courses = enrollments.map(enroll => ({
                name: enroll.courses?.name || 'مقرر غير محدد',
                schedule: enroll.courses?.schedule || 'مرن',
                assessment: getAssessmentStatus(enroll.progress),
                progress: enroll.progress || 0,
                action: enroll.progress >= 100 ? 'مراجعة' : 'دخول الصف'
            }));
        }
        
        if (courses.length > 0) {
            tableBody.innerHTML = courses.map(course => `
                <tr>
                    <td>
                        <strong>${course.name}</strong>
                        ${course.progress >= 100 ? '<span class="role-tag" style="background: var(--success); font-size: 0.7rem;">✓ مكتمل</span>' : ''}
                    </td>
                    <td>${course.schedule || 'جدول مرن'}</td>
                    <td><span style="color: ${course.progress >= 70 ? 'var(--success)' : 'var(--warning)'}">${course.assessment}</span></td>
                    <td>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 0.8rem; min-width: 30px;">${course.progress}%</span>
                            <div class="progress-container" style="flex: 1; margin: 0; height: 6px;">
                                <div class="progress-bar" style="width: ${course.progress}%;"></div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button class="btn-action-small" style="background: var(--success);" onclick="showToast('🚀 جاري فتح ${course.name}...', 'success')">
                            ${course.action}
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">📖 لا توجد مقررات مسجلة حالياً. تواصل مع المشرف الخاص بك.</td></tr>';
        }
        
    } catch (err) {
        console.error('❌ خطأ في تحميل المقررات:', err);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--danger);">⚠️ حدث خطأ في تحميل المقررات. يرجى تحديث الصفحة.</td></tr>';
    }
}

/**
 * الحصول على بيانات مقررات تجريبية
 */
function getDefaultCourses() {
    return [
        { name: 'أمن الشبكات والاتصالات', schedule: 'الأحد والثلاثاء 10:00 ص', assessment: 'كويز أساسيات التشفير', progress: 75, action: 'دخول الصف' },
        { name: 'بناء جدران الحماية وتحليل الثغرات', schedule: 'الإثنين والخميس 01:00 م', assessment: 'لا توجد اختبارات معلقة', progress: 40, action: 'دخول الصف' }
    ];
}

/**
 * تحديد حالة التقييم بناءً على التقدم
 */
function getAssessmentStatus(progress) {
    if (progress >= 100) return '✅ مكتمل';
    if (progress >= 70) return '📝 امتحان نهائي قريب';
    if (progress >= 30) return '⚡ تمارين نشطة';
    return '🚀 بداية المقرر';
}

/**
 * تحميل قائمة المهام والواجبات
 */
async function loadStudentAssignments() {
    const tableBody = document.getElementById('student-assignments-table');
    if (!tableBody) return;
    
    try {
        // محاولة جلب الواجبات من قاعدة البيانات
        const { data: assignments, error } = await supabase
            .from('assignments')
            .select('*')
            .eq('student_id', currentUser?.id)
            .eq('status', 'pending')
            .order('due_date', { ascending: true });
        
        let assignmentsList = [];
        
        if (error || !assignments || assignments.length === 0) {
            // بيانات تجريبية
            assignmentsList = getDefaultAssignments();
        } else {
            assignmentsList = assignments.map(ass => ({
                name: ass.title,
                dueDate: ass.due_date,
                grade: `${ass.max_score} درجات`,
                status: ass.submitted ? 'تم التسليم' : 'بانتظار الحل'
            }));
        }
        
        if (assignmentsList.length > 0) {
            tableBody.innerHTML = assignmentsList.map(assignment => `
                <tr>
                    <td><strong>${assignment.name}</strong></td>
                    <td>📅 ${assignment.dueDate}</td>
                    <td>⭐ ${assignment.grade}</td>
                    <td>
                        <span class="role-tag" style="background: ${assignment.status === 'بانتظار الحل' ? 'var(--warning)' : 'var(--success)'}; color: #fff;">
                            ${assignment.status}
                        </span>
                    </td>
                </tr>
            `).join('');
        } else {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 2rem;">🎉 لا توجد مهام مستحقة! أنت في الموعد النهائي.</td></tr>';
        }
        
    } catch (err) {
        console.error('❌ خطأ في تحميل الواجبات:', err);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">لا توجد واجبات مسجلة حالياً</td></tr>';
    }
}

/**
 * الحصول على واجبات تجريبية
 */
function getDefaultAssignments() {
    return [
        { name: 'تحليل وحظر هجمات الحرمان من الخدمة (DDoS)', dueDate: '2026-05-28', grade: '10 درجات', status: 'بانتظار الحل' },
        { name: 'إعداد أدوات الفحص والتشخيص الإدارية (netstat & nslookup)', dueDate: '2026-06-02', grade: '5 درجات', status: 'بانتظار الحل' }
    ];
}

/**
 * تحميل إنجازات الطالب وشهاداته
 */
async function loadStudentAchievements() {
    // يمكن إضافة جلب الشهادات من Supabase لاحقاً
    console.log('🏆 جاري تحميل إنجازات الطالب...');
}

/**
 * عرض رسالة للمخدم غير مصرح له
 */
function showUnauthorizedMessage() {
    const statsGrid = document.getElementById('student-stats-grid');
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div class="stat-card" style="grid-column: 1 / -1; text-align: center; border-color: var(--warning);">
                <i class="fas fa-lock" style="font-size: 3rem; color: var(--warning); margin-bottom: 1rem;"></i>
                <h3>⚠️ يرجى تسجيل الدخول أولاً</h3>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">للوصول إلى مسارك التعليمي وإحصائياتك الشخصية</p>
                <button class="btn-submit" style="width: auto; padding: 10px 20px;" onclick="if(window.toggleLoginModal) window.toggleLoginModal(true);">
                    <i class="fas fa-sign-in-alt"></i> تسجيل الدخول
                </button>
            </div>
        `;
    }
}

// ============================================
// 4. دوال مساعدة إضافية
// ============================================

/**
 * تحديث بيانات الطالب يدوياً (زر التحديث)
 */
async function refreshStudentData() {
    if (typeof showToast === 'function') showToast('🔄 جاري تحديث بياناتك...', 'info');
    await loadStudentData();
    renderStudentStats();
    await loadStudentCourses();
    await loadStudentAssignments();
    if (typeof showToast === 'function') showToast('✅ تم تحديث بيانات الطالب بنجاح', 'success');
}

/**
 * تسجيل الخروج من النظام
 */
window.handleStudentLogout = async function() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        if (typeof showToast === 'function') showToast('🔒 تم تسجيل الخروج بنجاح', 'success');
        setTimeout(() => {
            if (window.updateUIForRole) {
                window.updateUIForRole('guest', 'زائر المنصة');
            }
        }, 500);
    } else {
        if (typeof showToast === 'function') showToast('❌ فشل تسجيل الخروج: ' + error.message, 'error');
    }
};

// ============================================
// 5. التصدير والتهيئة التلقائية
// ============================================

// تصدير الدوال للاستخدام من الملف الرئيسي (undashboard.html)
window.initStudentDashboard = initStudentDashboard;
window.renderStudentStats = renderStudentStats;
window.refreshStudentData = refreshStudentData;
window.loadStudentData = loadStudentData;

// تشغيل التهيئة تلقائياً عند تحميل السكريبت
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudentDashboard);
} else {
    // تأخير بسيط للتأكد من تحميل DOM بالكامل
    setTimeout(initStudentDashboard, 100);
}
