/**
 * 🎯 وحدة الطالب المطورة (Student Dashboard Module) - النسخة الكاملة والنهائية
 */

// ============================================
// 1. استخدام الـ Supabase client الموجود (بدون تعريف جديد)
// ============================================
const sb = window.supabaseClient;

// ============================================
// 2. المتغيرات العامة
// ============================================
let currentUser = null;
let currentStudentProfile = null;

// ============================================
// 3. دالة التبديل بين التبويبات (للاستدعاء من الأزرار)
// ============================================
window.switchStudentTab = function(tabName, clickedBtn) {
    console.log('🔄 تبديل التبويب إلى:', tabName);
    
    // إخفاء جميع الألواح
    const panes = document.querySelectorAll('.student-pane');
    panes.forEach(pane => {
        pane.style.display = 'none';
    });
    
    // إظهار اللوح المطلوب
    const targetPane = document.getElementById(`student-pane-${tabName}`);
    if (targetPane) {
        targetPane.style.display = 'block';
    }
    
    // تحديث حالة الأزرار
    const allBtns = document.querySelectorAll('.student-tab-btn');
    allBtns.forEach(btn => {
        btn.style.background = 'var(--bg-card)';
        btn.style.border = '1px solid var(--border)';
        btn.style.color = 'var(--text-muted)';
        btn.classList.remove('active-tab');
    });
    
    if (clickedBtn) {
        clickedBtn.style.background = 'var(--primary)';
        clickedBtn.style.border = '1px solid var(--primary)';
        clickedBtn.style.color = 'white';
        clickedBtn.classList.add('active-tab');
    }
    
    // تحميل البيانات حسب التبويب
    if (tabName === 'courses') {
        window.fetchAndRenderStudentCourses();
    } else if (tabName === 'progress') {
        window.fetchAndRenderStudentProgressTable();
    }
};

// ============================================
// 4. تهيئة اللوحة الرئيسية
// ============================================
window.initStudentDashboard = async function() {
    console.log('🎓 جاري تهيئة لوحة الطالب...');
    
    try {
        // التحقق من المستخدم
        const { data: { user }, error: authError } = await sb.auth.getUser();
        
        if (authError || !user) {
            console.warn("⚠️ لا يوجد مستخدم مسجل الدخول");
            window.showUnauthorizedMessage();
            return;
        }
        
        currentUser = user;
        console.log(`✅ المستخدم: ${user.email}`);
        
        // جلب بيانات الملف الشخصي
        const { data: profile, error: profileError } = await sb
            .from('user_profile')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
        
        if (profileError) {
            console.warn("⚠️ خطأ في جلب البروفايل:", profileError);
        }
        
        if (profile) {
            currentStudentProfile = profile;
        } else {
            currentStudentProfile = {
                full_name: user.email?.split('@')[0] || 'طالب سيبراني',
                rank: 'محلل أمني مبتدئ',
                xp: 1250,
                email: user.email
            };
        }
        
        // تحديث واجهة المستخدم العلوية
        window.updateStudentTopUI(currentStudentProfile);
        
        // تحميل المقررات
        await window.fetchAndRenderStudentCourses();
        
        // تحديث الإحصائيات
        await window.updateStudentStats();
        
        console.log('✅ تم تهيئة لوحة الطالب بنجاح');
        
    } catch (err) {
        console.error("❌ خطأ في تهيئة لوحة الطالب:", err);
        window.showUnauthorizedMessage();
    }
};

// ============================================
// 5. تحديث الإحصائيات العلوية
// ============================================
window.updateStudentStats = async function() {
    try {
        if (!currentUser) return;
        
        // جلب بيانات التسجيلات لحساب التقدم العام
        const { data: enrollments } = await sb
            .from("enrollments")
            .select("completion_percentage")
            .eq("user_id", currentUser.id);
        
        let totalProgress = 0;
        if (enrollments && enrollments.length > 0) {
            const sum = enrollments.reduce((acc, e) => acc + (e.completion_percentage || 0), 0);
            totalProgress = Math.round(sum / enrollments.length);
        }
        
        // تحديث شريط التقدم
        const progressText = document.getElementById('student-general-progress-text');
        const progressBar = document.getElementById('student-general-progress-bar');
        if (progressText) progressText.textContent = `${totalProgress}%`;
        if (progressBar) progressBar.style.width = `${totalProgress}%`;
        
        // تحديث الرتبة والنقاط
        const rankEl = document.getElementById('student-rank-val');
        const xpEl = document.getElementById('student-xp-val');
        if (rankEl && currentStudentProfile) rankEl.textContent = currentStudentProfile.rank || 'محلل أمني مبتدئ';
        if (xpEl && currentStudentProfile) xpEl.textContent = `${(currentStudentProfile.xp || 1250).toLocaleString()} XP`;
        
    } catch (err) {
        console.error("خطأ في تحديث الإحصائيات:", err);
    }
};

// ============================================
// 6. تحديث واجهة المستخدم العلوية
// ============================================
window.updateStudentTopUI = function(profile) {
    const firstName = profile.full_name?.split(' ')[0] || 'طالب';
    
    const welcomeElement = document.getElementById('welcome-msg');
    if (welcomeElement) welcomeElement.innerText = `مرحباً بك، ${firstName} 👋`;
    
    const nameElement = document.getElementById('user-display-name');
    if (nameElement) nameElement.textContent = profile.full_name;
    
    const avatarElement = document.getElementById('user-avatar');
    if (avatarElement && profile.full_name) {
        avatarElement.textContent = profile.full_name.charAt(0).toUpperCase();
    }
};

// ============================================
// 7. عرض المقررات والكروت
// ============================================
window.fetchAndRenderStudentCourses = async function() {
    const gridContainer = document.getElementById('dynamic-courses-grid');
    if (!gridContainer) {
        console.warn("⚠️ عنصر dynamic-courses-grid غير موجود");
        return;
    }
    
    try {
        // عرض مؤشر التحميل
        gridContainer.innerHTML = `<div style="text-align:center; padding:2rem; grid-column:1/-1;"><i class="fas fa-spinner fa-spin"></i> جاري تحميل المقررات...</div>`;
        
        if (!currentUser) {
            const { data: { user } } = await sb.auth.getUser();
            if (!user) throw new Error("لا يوجد مستخدم");
            currentUser = user;
        }
        
        // جلب جميع المقررات
        const { data: allCourses, error: coursesError } = await sb.from("courses").select("*");
        if (coursesError) throw coursesError;
        
        // جلب تسجيلات الطالب
        const { data: myEnrollments, error: enrollError } = await sb
            .from("enrollments")
            .select("course_id, completion_percentage, completion_status")
            .eq("user_id", currentUser.id);
        if (enrollError) throw enrollError;
        
        // إنشاء خريطة للتسجيلات
        const enrollmentMap = {};
        if (myEnrollments) {
            myEnrollments.forEach(e => {
                enrollmentMap[e.course_id] = {
                    isEnrolled: true,
                    percentage: e.completion_percentage || 0,
                    status: e.completion_status || 'in_progress'
                };
            });
        }
        
        // تحديث الإحصائيات العامة
        const totalEnrolled = Object.keys(enrollmentMap).length;
        let sumPercentage = 0;
        Object.values(enrollmentMap).forEach(v => sumPercentage += v.percentage);
        const overallAverage = totalEnrolled > 0 ? Math.round(sumPercentage / totalEnrolled) : 0;
        
        const progressText = document.getElementById('student-general-progress-text');
        const progressBar = document.getElementById('student-general-progress-bar');
        if (progressText) progressText.textContent = `${overallAverage}%`;
        if (progressBar) progressBar.style.width = `${overallAverage}%`;
        
        // عرض المقررات
        if (!allCourses || allCourses.length === 0) {
            gridContainer.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding:2rem; grid-column:1/-1;">📖 لا توجد مقررات دراسية منشورة حالياً.</div>`;
            return;
        }
        
        gridContainer.innerHTML = allCourses.map(course => {
            const enrollment = enrollmentMap[course.course_id];
            const isEnrolled = !!enrollment;
            const percent = isEnrolled ? enrollment.percentage : 0;
            
            return `
                <div class="stat-card" style="display:flex; flex-direction:column; justify-content:space-between; border:1px solid var(--border); background:var(--bg-card); padding:1.5rem; border-radius:10px; transition:all 0.3s ease;">
                    <div>
                        <h3 style="color:var(--text-main); font-size:1.2rem; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
                            <i class="fas fa-bookmark" style="color:${isEnrolled ? 'var(--success)' : 'var(--primary)'}"></i> 
                            ${this.escapeHtml ? this.escapeHtml(course.title) : course.title}
                        </h3>
                        <p style="color:var(--text-muted); font-size:0.85rem; line-height:1.5; margin-bottom:15px;">
                            ${course.description || 'مسار مهني متكامل لتطوير مهارات الدفاع الرقمي.'}
                        </p>
                    </div>
                    <div>
                        ${isEnrolled ? `
                            <div style="margin-bottom:12px;">
                                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
                                    <span style="color:var(--success)">✓ مسجل ومستمر</span>
                                    <span>${percent}%</span>
                                </div>
                                <div class="progress-container" style="height:6px; margin:0; background:var(--border); border-radius:3px; overflow:hidden;">
                                    <div class="progress-bar" style="width:${percent}%; height:100%; background:var(--success);"></div>
                                </div>
                            </div>
                            <button class="btn-submit" style="background:linear-gradient(135deg, var(--success), #059669); margin:0; width:100%; padding:10px; color:white; font-weight:bold; border-radius:6px; border:none; cursor:pointer;" onclick="window.redirectStudentToPlayer('${course.course_id}')">
                                <i class="fas fa-play"></i> استكمال المحاضرات
                            </button>
                        ` : `
                            <button class="btn-submit" style="background:linear-gradient(135deg, var(--primary), var(--accent)); margin:0; width:100%; padding:10px; color:white; font-weight:bold; border-radius:6px; border:none; cursor:pointer;" onclick="window.handleStudentEnrollment('${course.course_id}')">
                                <i class="fas fa-user-plus"></i> انضم للمسار (مجاناً)
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (err) {
        console.error("❌ خطأ في عرض المقررات:", err);
        gridContainer.innerHTML = `<div style="color:var(--danger); text-align:center; padding:2rem; grid-column:1/-1;">⚠️ فشل تحميل المقررات: ${err.message}</div>`;
    }
};

// ============================================
// 8. عرض جدول التقدم
// ============================================
window.fetchAndRenderStudentProgressTable = async function() {
    const tableBody = document.getElementById('dynamic-progress-table-body');
    if (!tableBody) return;
    
    try {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:2rem;"><i class="fas fa-spinner fa-spin"></i> جاري التحميل...</td></tr>`;
        
        if (!currentUser) return;
        
        const { data: enrollments, error } = await sb
            .from("enrollments")
            .select(`*, courses(title, course_id)`)
            .eq("user_id", currentUser.id);
            
        if (error) throw error;
        
        if (!enrollments || enrollments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:2rem;">📊 لم تقم بالتسجيل في أي كورس تعليمي بعد.</td></tr>`;
            return;
        }
        
        tableBody.innerHTML = enrollments.map(e => `
            <tr>
                <td style="padding:12px;"><strong>${e.courses ? e.courses.title : 'مسار غير معرف'}</strong>--\n                <td style="padding:12px;">
                    <span class="role-tag" style="background:rgba(16,185,129,0.1); color:var(--success); padding:3px 8px; border-radius:4px;">
                        ${e.completion_status === 'completed' ? '✅ مكتمل' : (e.completion_status === 'in_progress' ? '🔄 قيد الدراسة' : '⏳ لم يبدأ')}
                    </span>
                </td>
                <td style="padding:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-weight:bold; min-width:35px;">${e.completion_percentage || 0}%</span>
                        <div class="progress-container" style="margin:0; height:6px; flex-grow:1; background:var(--border); border-radius:3px; overflow:hidden;">
                            <div class="progress-bar" style="width:${e.completion_percentage || 0}%; height:100%; background:var(--primary);"></div>
                        </div>
                    </div>
                </td>
                <td style="padding:12px;">
                    <button class="btn-action-small" style="background:var(--primary); padding:6px 12px; color:white; border:none; border-radius:4px; cursor:pointer;" onclick="window.redirectStudentToPlayer('${e.courses ? e.courses.course_id : ''}')">
                        <i class="fas fa-external-link-alt"></i> فتح المشغل
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (err) {
        console.error("❌ خطأ في جدول التقدم:", err);
        tableBody.innerHTML = `<tr><td colspan="4" style="color:var(--danger); text-align:center; padding:2rem;">❌ حدث خطأ أثناء تحميل البيانات</td></tr>`;
    }
};

// ============================================
// 9. الاشتراك في مقرر جديد
// ============================================
window.handleStudentEnrollment = async function(courseId) {
    if (!courseId) {
        console.error("❌ معرف المقرر غير صالح");
        return;
    }
    
    try {
        const { data: { user } } = await sb.auth.getUser();
        if (!user) {
            if (typeof window.showToast === 'function') {
                window.showToast("🛑 يجب تسجيل الدخول أولاً", "error");
            } else {
                alert("يرجى تسجيل الدخول أولاً");
            }
            return;
        }
        
        if (typeof window.showLoader === 'function') window.showLoader();
        
        // التحقق من التسجيل المسبق
        const { data: existing } = await sb
            .from("enrollments")
            .select("course_id")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .maybeSingle();
        
        if (existing) {
            if (typeof window.showToast === 'function') {
                window.showToast("ℹ️ أنت مسجل بالفعل في هذا المقرر", "info");
            }
            if (typeof window.hideLoader === 'function') window.hideLoader();
            return;
        }
        
        // إدراج سجل جديد
        const { error } = await sb.from("enrollments").insert({
            user_id: user.id,
            course_id: courseId,
            completion_status: 'in_progress',
            completion_percentage: 0
        });
        
        if (typeof window.hideLoader === 'function') window.hideLoader();
        
        if (error) {
            console.error("❌ خطأ في التسجيل:", error);
            if (typeof window.showToast === 'function') {
                window.showToast(`❌ تعذر الالتحاق: ${error.message}`, 'error');
            }
            return;
        }
        
        if (typeof window.showToast === 'function') {
            window.showToast("🎉 تم تسجيلك في المقرر بنجاح!", "success");
        }
        
        // تحديث الواجهة
        await window.fetchAndRenderStudentCourses();
        await window.fetchAndRenderStudentProgressTable();
        await window.updateStudentStats();
        
    } catch (err) {
        if (typeof window.hideLoader === 'function') window.hideLoader();
        console.error("❌ خطأ في التسجيل:", err);
    }
};

// ============================================
// 10. التوجيه إلى مشغل الدورة
// ============================================
window.redirectStudentToPlayer = function(courseId) {
    if (!courseId) {
        console.error("❌ معرف المقرر غير صالح");
        return;
    }
    window.location.href = `../pages/course-player.html?course_id=${courseId}`;
};

// ============================================
// 11. رسالة للمستخدم غير المسجل
// ============================================
window.showUnauthorizedMessage = function() {
    const gridContainer = document.getElementById('dynamic-courses-grid');
    if (gridContainer) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; border: 1px dashed var(--warning); border-radius:8px; background: rgba(245,158,11,0.02);">
                <i class="fas fa-lock" style="font-size: 2.5rem; color: var(--warning); margin-bottom: 1rem;"></i>
                <h3 style="color:var(--text-main); margin-bottom:0.5rem;">🛑 يرجى تسجيل الدخول أولاً</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem;">يتطلب عرض المسارات والاشتراك بالدورات تسجيل الدخول.</p>
                <button class="btn-action-small" style="background: var(--primary); padding: 8px 20px; color:white; border:none; border-radius:5px; cursor:pointer;" onclick="window.location.href='../login.html'">
                    <i class="fas fa-sign-in-alt"></i> تسجيل الدخول
                </button>
            </div>
        `;
    }
    
    const tableBody = document.getElementById('dynamic-progress-table-body');
    if (tableBody) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:2rem;">🔒 يرجى تسجيل الدخول لعرض تقدمك الدراسي</td></tr>`;
    }
};

// ============================================
// 12. دالة مساعدة لتنظيف النصوص
// ============================================
window.escapeHtml = function(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

// ============================================
// 13. التشغيل التلقائي
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(window.initStudentDashboard, 150);
    });
} else {
    setTimeout(window.initStudentDashboard, 150);
}
