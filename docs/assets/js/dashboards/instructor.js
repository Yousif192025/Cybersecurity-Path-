/**
 * وحدة المدرب والمشرف الأكاديمي (Instructor Dashboard)
 * تم الحفاظ على هيكليتك الأصلية مع ضمان التوافق مع التحميل الديناميكي
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://suvpaunulhqfoclepwoz.supabase.co";
const supabaseKey = "sb_publishable_owtViRnQVEiBN3J3yQtpbw_cq-vwR7b";

if (!window.supabaseClient) {
    window.supabaseClient = createClient(supabaseUrl, supabaseKey);
}
const supabase = window.supabaseClient;

// المتغيرات العامة
let isInstructorInitialized = false;
let currentInstructorUser = null;

// ============================================
// الدوال الرئيسية
// ============================================

async function initInstructorDashboard() {
    console.log('👨‍🏫 جاري تهيئة لوحة تحكم المدرب الأكاديمي...');
    
    if (!document.getElementById('instructor-students-table')) {
        console.warn('⚠️ عناصر واجهة المدرس لم تكتمل بعد، إعادة المحاولة...');
        setTimeout(initInstructorDashboard, 100);
        return;
    }

    try {
        const { data: { user } } = await supabase.auth.getUser();
        currentInstructorUser = user;

        await loadInstructorStats();
        await loadSupervisedStudents();
        await loadInstructorCourses();

        isInstructorInitialized = true;
        console.log('✅ تم تهيئة لوحة تحكم المدرب بنجاح');
    } catch (error) {
        console.error('❌ خطأ أثناء تهيئة لوحة تحكم المدرب:', error);
    }
}

async function loadInstructorStats() {
    const studentsCountEl = document.getElementById('instructor-students-count');
    const coursesCountEl = document.getElementById('instructor-courses-count');
    const pendingCountEl = document.getElementById('instructor-pending-count');
    
    if (studentsCountEl) studentsCountEl.innerText = "42";
    if (coursesCountEl) coursesCountEl.innerText = "2";
    if (pendingCountEl) pendingCountEl.innerText = "7";
}

async function loadSupervisedStudents() {
    const tableBody = document.getElementById('instructor-students-table');
    if (!tableBody) return;

    const { data: students, error } = await supabase
        .from('user_profile')
        .select('full_name, track, updated_at')
        .eq('role', 'student')
        .limit(10);

    let studentsList = (error || !students || students.length === 0) ? getDefaultStudents() : students.map(s => ({
        name: s.full_name,
        track: s.track || 'دبلوم الأمن السيبراني',
        grade: '85 / 100',
        lastActive: s.updated_at ? formatLastActive(s.updated_at) : 'منذ فترة'
    }));

    tableBody.innerHTML = studentsList.map(s => `
        <tr>
            <td><strong>${s.name}</strong></td>
            <td><span class="role-tag">${s.track}</span></td>
            <td>${s.grade}</td>
            <td>${s.lastActive}</td>
            <td>
                <button class="btn-action-small" style="background: var(--primary);" 
                    onclick="window.showToast('🔍 استعراض سجل أداء الطالب: ${s.name}', 'info')">
                    استعراض الملف
                </button>
            </td>
        </tr>
    `).join('');
}

async function loadInstructorCourses() {
    const tableBody = document.getElementById('instructor-courses-table');
    if (!tableBody) return;

    const courses = [
        { name: 'أمن الشبكات والاتصالات', students: 24, progress: 78 },
        { name: 'تطوير الويب الآمن والدفاع الرقمي', students: 18, progress: 65 }
    ];

    tableBody.innerHTML = courses.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.students} طالب</td>
            <td>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="min-width: 35px;">${c.progress}%</span>
                    <div class="progress-container" style="margin:0; height:6px; flex-grow:1;"><div class="progress-bar" style="width: ${c.progress}%;"></div></div>
                </div>
            </td>
            <td>
                <button class="btn-link" style="margin-top:0;" onclick="window.showToast('📝 فتح لوحة إدارة مقرر: ${c.name}', 'info')">
                    إدارة <i class="fas fa-arrow-left"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// الدوال المساعدة
// ============================================

function getDefaultStudents() {
    return [
        { name: 'خالد عبد الرحمن', track: 'دبلوم الأمن السيبراني', grade: '88 / 100', lastActive: 'منذ ساعتين' },
        { name: 'سارة الفهد', track: 'دبلوم الأمن السيبراني', grade: '94 / 100', lastActive: 'نشط الآن' }
    ];
}

function formatLastActive(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    return `منذ ${Math.floor(diffMins / 60)} ساعة`;
}

// تصدير الدوال للـ window لتكون متاحة للـ onclick في HTML
window.initInstructorDashboard = initInstructorDashboard;

// التشغيل التلقائي
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstructorDashboard);
} else {
    setTimeout(initInstructorDashboard, 100);
}
