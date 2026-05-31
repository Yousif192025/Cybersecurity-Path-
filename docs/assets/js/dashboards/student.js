/**
 * 🎯 وحدة الطالب المطورة (Student Dashboard Module) - النسخة المدمجة والنهائية
 * يتم تحميلها ديناميكياً لتشغيل واجهة الطالب الحية وإدارتها بالكامل
 */

// ============================================
// 1. انتظار تحميل Supabase من الـ CDN
// ============================================
let supabase;

function waitForSupabase() {
    return new Promise((resolve) => {
        if (window.supabaseClient) {
            supabase = window.supabaseClient;
            resolve();
            return;
        }
        const checkInterval = setInterval(() => {
            if (window.supabaseClient) {
                supabase = window.supabaseClient;
                clearInterval(checkInterval);
                resolve();
            }
        }, 50);
        setTimeout(() => {
            clearInterval(checkInterval);
            if (!supabase) {
                console.warn("⚠️ Supabase not found, creating new client");
                const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
                const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";
                window.supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
                supabase = window.supabaseClient;
            }
            resolve();
        }, 3000);
    });
}

// ============================================
// 2. المتغيرات العامة لنطاق الطالب
// ============================================
let currentUser = null;
let currentStudentProfile = null;

// ============================================
// 3. الدالة المفتاحية الكبرى لواجهة الطالب
// ============================================
window.initStudentDashboard = async function() {
    console.log('🎓 جاري تفعيل المزامنة الرقمية وجلب بيانات الطالب...');
    await waitForSupabase();
    
    const isAuthenticated = await window.loadStudentData();
    
    if (isAuthenticated) {
        await window.fetchAndRenderStudentCourses();
    } else {
        window.showUnauthorizedMessage();
    }
};

/**
 * جلب وتدقيق بيانات الطالب من نظام المصادقة وجدول user_profile
 */
window.loadStudentData = async function() {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.warn("⚠️ لم يتم العثور على جلسة صالحة للتحقق الرقمي.");
            return false;
        }

        currentUser = user;
        console.log(`✅ تم تأمين اتصال الحساب: ${user.email}`);

        const { data: profile, error: profileError } = await supabase
            .from('user_profile')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (profileError || !profile) {
            console.warn("⚠️ تعذر جلب السجل الشخصي، سيتم استخدام التوزيع الافتراضي المؤقت.");
            currentStudentProfile = window.getDefaultStudentProfile(user);
        } else {
            currentStudentProfile = profile;
        }

        window.updateStudentTopUI(currentStudentProfile);
        return true;

    } catch (err) {
        console.error("❌ خطأ حرج أثناء فحص بيانات الطالب:", err);
        return false;
    }
};

/**
 * دالة توليد ملف تعريفي وقائي في حال عدم اكتمال السجل في قاعدة البيانات
 */
window.getDefaultStudentProfile = function(user) {
    return {
        full_name: user.email?.split('@')[0] || 'طالب سيبراني جديد',
        rank: 'محلل أمني مبتدئ',
        xp: 1250,
        email: user.email
    };
};

/**
 * تحديث نصوص الترحيب العلوية والصور الرمزية
 */
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
// 4. دالة التنقل والتبديل الذكي بين تبويبات الطالب
// ============================================
window.switchStudentTab = function(tabName, clickedBtn) {
    // إخفاء كافة شاشات لوحة تحكم الطالب
    document.querySelectorAll('.student-pane').forEach(pane => {
        pane.classList.add('hidden');
        pane.style.display = 'none';
    });
    
    // تفعيل الشاشة المختارة
    const targetPane = document.getElementById(`student-pane-${tabName}`);
    if (targetPane) {
        targetPane.classList.remove('hidden');
        targetPane.style.display = 'block';
    }
    
    // تحديث مظهر أزرار التنقل
    if (clickedBtn && clickedBtn.parentElement) {
        clickedBtn.parentElement.querySelectorAll('.student-tab-btn').forEach(btn => {
            btn.style.background = 'var(--bg-card)';
            btn.style.borderColor = 'var(--border)';
            btn.style.color = 'var(--text-muted)';
        });
        clickedBtn.style.background = 'var(--primary)';
        clickedBtn.style.borderColor = 'var(--primary)';
        clickedBtn.style.color = 'white';
    }
    
    // استدعاء البيانات حسب التبويب
    if (tabName === 'courses') {
        window.fetchAndRenderStudentCourses();
    } else if (tabName === 'progress') {
        window.fetchAndRenderStudentProgressTable();
    }
};

// ============================================
// 5. استدعاء المناهج وتوليد الكروت
// ============================================
window.fetchAndRenderStudentCourses = async function() {
    const gridContainer = document.getElementById('dynamic-courses-grid');
    if (!gridContainer) return;

    try {
        if (!currentUser) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            currentUser = user;
        }

        const { data: allCourses, error: errCourses } = await supabase.from("courses").select("*");
        if (errCourses) throw errCourses;

        const { data: myEnrollments, error: errEnrolls } = await supabase
            .from("enrollments")
            .select("course_id, completion_percentage")
            .eq("user_id", currentUser.id);
        if (errEnrolls) throw errEnrolls;

        const enrollmentMap = {};
        if (myEnrollments) {
            myEnrollments.forEach(e => {
                enrollmentMap[e.course_id] = {
                    isEnrolled: true,
                    percentage: e.completion_percentage || 0
                };
            });
        }

        const totalEnrolled = Object.keys(enrollmentMap).length;
        let sumPercentage = 0;
        Object.values(enrollmentMap).forEach(v => sumPercentage += v.percentage);
        const overallAverage = totalEnrolled > 0 ? Math.round(sumPercentage / totalEnrolled) : 0;

        if (document.getElementById('student-general-progress-text')) {
            document.getElementById('student-general-progress-text').textContent = `${overallAverage}%`;
            document.getElementById('student-general-progress-bar').style.width = `${overallAverage}%`;
        }
        if (document.getElementById('student-rank-val') && currentStudentProfile) {
            document.getElementById('student-rank-val').textContent = currentStudentProfile.rank || 'محلل أمني مبتدئ';
        }
        if (document.getElementById('student-xp-val') && currentStudentProfile) {
            document.getElementById('student-xp-val').textContent = `${(currentStudentProfile.xp || 1250).toLocaleString()} XP`;
        }

        if (!allCourses || allCourses.length === 0) {
            gridContainer.innerHTML = `<div style="color:var(--text-muted); text-align:center; padding:2rem; grid-column:1/-1;">📖 لا توجد مقررات دراسية منشورة بالنظام حالياً.</div>`;
            return;
        }

        gridContainer.innerHTML = allCourses.map(course => {
            const enrollment = enrollmentMap[course.course_id];
            const isEnrolled = !!enrollment;
            const percent = isEnrolled ? enrollment.percentage : 0;

            return `
                <div class="stat-card" style="display:flex; flex-direction:column; justify-content:space-between; border:1px solid var(--border); background-color:rgba(30,41,59,0.4); padding:1.5rem; border-radius:10px; transition:all 0.3s ease;">
                    <div>
                        <h3 style="color:var(--text-main); font-size:1.2rem; margin-bottom:8px; display:flex; align-items:center; gap:8px; text-align:right;">
                            <i class="fas fa-bookmark" style="color:${isEnrolled ? 'var(--success)' : 'var(--primary)'}"></i> ${course.title}
                        </h3>
                        <p style="color:var(--text-muted); font-size:0.85rem; line-height:1.5; margin-bottom:15px; text-align:right;">
                            ${course.description || 'مسار مهني متكامل وموجه لتطوير مهارات الدفاع الرقمي والتصدي للثغرات البرمجية.'}
                        </p>
                    </div>
                    <div>
                        ${isEnrolled ? `
                            <div style="margin-bottom:12px; dir:ltr;">
                                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px; direction:rtl;">
                                    <span style="color:var(--success)">✓ مسجل ومستمر</span>
                                    <span>${percent}%</span>
                                </div>
                                <div class="progress-container" style="height:6px; margin:0; background:var(--border);">
                                    <div class="progress-bar" style="width:${percent}%; background:var(--success);"></div>
                                </div>
                            </div>
                            <button class="btn-submit" style="background:linear-gradient(135deg, var(--success), #059669); margin:0; width:100%; padding:10px; color:white; font-weight:bold; border-radius:6px; border:none; cursor:pointer;" onclick="window.redirectStudentToPlayer('${course.course_id}')">
                                <i class="fas fa-play"></i> استكمال المحاضرات والدروس
                            </button>
                        ` : `
                            <button class="btn-submit" style="background:linear-gradient(135deg, var(--primary), var(--accent)); margin:0; width:100%; padding:10px; color:white; font-weight:bold; border-radius:6px; border:none; cursor:pointer;" onclick="window.handleStudentEnrollment('${course.course_id}')">
                                <i class="fas fa-user-plus"></i> انضم للمسار الآن (مجاناً)
                            </button>
                        `}
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error("Error rendering dynamic courses:", err);
        gridContainer.innerHTML = `<div style="color:var(--danger); text-align:center; padding:1.5rem; grid-column:1/-1;">⚠️ فشل استدعاء السجلات الفورية: ${err.message}</div>`;
    }
};

// ============================================
// 6. توليد جدول المتابعة والتقدم
// ============================================
window.fetchAndRenderStudentProgressTable = async function() {
    const tableBody = document.getElementById('dynamic-progress-table-body');
    if (!tableBody) return;

    try {
        if (!currentUser) return;

        const { data: enrollments, error } = await supabase
            .from("enrollments")
            .select(`*, courses(title, course_id)`)
            .eq("user_id", currentUser.id);
            
        if (error) throw error;

        if (!enrollments || enrollments.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:2rem;">📊 لم تقم بالتسجيل في أي كورس تعليمي لمتابعة تقدمك التراكمي حتى الآن.</td></tr>`;
            return;
        }

        tableBody.innerHTML = enrollments.map(e => `
            <tr>
                <td style="padding:12px;"><strong>${e.courses ? e.courses.title : 'مسار أمني غير معرف'}</strong></td>
                <td style="padding:12px;"><span class="role-tag" style="background:rgba(16,185,129,0.1); color:var(--success); padding:3px 8px; border-radius:4px;">${e.completion_status || 'قيد الدراسة'}</span></td>
                <td style="padding:12px;">
                    <div style="display:flex; align-items:center; gap:8px; direction:ltr;">
                        <span style="font-weight:bold; min-width:35px; text-align:right;">${e.completion_percentage || 0}%</span>
                        <div class="progress-container" style="margin:0; height:6px; flex-grow:1; background:var(--border);">
                            <div class="progress-bar" style="width:${e.completion_percentage || 0}%;"></div>
                        </div>
                    </div>
                </td>
                <td style="padding:12px;">
                    <button class="btn-action-small" style="background:var(--primary); padding:6px 12px; color:white; border:none; border-radius:4px; cursor:pointer; font-size:0.85rem;" onclick="window.redirectStudentToPlayer('${e.courses ? e.courses.course_id : ''}')">
                        <i class="fas fa-external-link-alt"></i> فتح المشغل
                    </button>
                </td>
            </tr>
        `).join('');

    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr><td colspan="4" style="color:var(--danger); text-align:center;">❌ حدث خطأ داخلي أثناء تحديث تقارير التقدم التزامنية.</td></tr>`;
    }
};

// ============================================
// 7. دالة معالجة طلب الاشتراك والانضمام الفوري بكورس جديد
// ============================================
window.handleStudentEnrollment = async function(courseId) {
    if (!courseId) return;

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            if (typeof window.showToast === 'function') window.showToast("🛑 يجب تسجيل الدخول للنظام أولاً لتتمكن من الانضمام.", "error");
            return;
        }

        if (typeof window.showLoader === 'function') window.showLoader();

        const { error } = await supabase.from("enrollments").insert({
            user_id: user.id,
            course_id: courseId,
            completion_status: 'in_progress',
            completion_percentage: 0
        });

        if (typeof window.hideLoader === 'function') window.hideLoader();

        if (error) {
            if (typeof window.showToast === 'function') window.showToast(`❌ تعذر الالتحاق بالمسار: ${error.message}`, 'error');
            return;
        }

        if (typeof window.showToast === 'function') window.showToast("🎉 مبروك! تم تسجيلك بالمسار التعليمي بنجاح تام.", "success");
        
        window.fetchAndRenderStudentCourses();
        setTimeout(() => {
            window.fetchAndRenderStudentProgressTable();
            const progressBtn = document.querySelector('button[onclick*="progress"]');
            if (progressBtn) window.switchStudentTab('progress', progressBtn);
        }, 400);

    } catch (e) {
        if (typeof window.hideLoader === 'function') window.hideLoader();
        console.error("Enrollment crash:", e);
    }
};

// ============================================
// 8. التوجيه لمشغل الفيديو والبيئات المعملية الآمنة
// ============================================
window.redirectStudentToPlayer = function(courseId) {
    if (!courseId) return;
    if (typeof window.showToast === 'function') window.showToast("🎬 جاري تحضير البث الآمن وفتح المعامل الرقمية...", "success");
    
    setTimeout(() => {
        window.location.href = `../pages/course-player.html?course_id=${courseId}`;
    }, 500);
};

/**
 * دالة إظهار رسالة الأمان للمستخدمين غير المسجلين
 */
window.showUnauthorizedMessage = function() {
    const gridContainer = document.getElementById('dynamic-courses-grid');
    if (gridContainer) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; border: 1px dashed var(--warning); border-radius:8px; background: rgba(245,158,11,0.02);">
                <i class="fas fa-lock" style="font-size: 2.5rem; color: var(--warning); margin-bottom: 1rem;"></i>
                <h3 style="color:var(--text-main); margin-bottom:0.5rem;">🛑 يرجى تسجيل الدخول أولاً</h3>
                <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size:0.9rem;">يتطلب عرض مسارك التمكيني والاشتراك بالدورات تسجيل الدخول والتحقق من الهوية السيبرانية للمنصة.</p>
                <button class="btn-action-small" style="background: var(--primary); padding: 8px 20px; color:white; border:none; border-radius:5px; cursor:pointer;" onclick="window.location.href='../login.html'">
                    <i class="fas fa-sign-in-alt"></i> الانتقال لصفحة تسجيل الدخول
                </button>
            </div>
        `;
    }
};

// ============================================
// 9. تشغيل وقائي وتلقائي متزامن للموديول
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initStudentDashboard);
} else {
    setTimeout(window.initStudentDashboard, 150);
}
