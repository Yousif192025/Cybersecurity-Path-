/**
 * وحدة المدرس (Instructor Dashboard)
 * يتم تحميلها ديناميكياً عند التبديل إلى واجهة المدرس
 */

// دالة التهيئة الرئيسية
function initInstructorDashboard() {
    console.log('👨‍🏫 جاري تهيئة لوحة تحكم المدرس...');
    
    // تحديث الإحصائيات
    updateInstructorStats();
    
    // تحميل قائمة الطلاب
    loadInstructorStudents();
    
    // تحديث عداد التمارين غير المصححة
    updatePendingAssignmentsCount();
}

// تحديث كروت الإحصائيات
function updateInstructorStats() {
    const studentsCount = document.getElementById('instructor-students-count');
    const coursesCount = document.getElementById('instructor-courses-count');
    
    if (studentsCount) studentsCount.textContent = '42 طالب';
    if (coursesCount) coursesCount.textContent = '3 مقررات';
}

// تحديث عدد التمارين غير المصححة
function updatePendingAssignmentsCount() {
    const pendingElement = document.getElementById('instructor-pending-count');
    if (pendingElement) {
        // محاكاة جلب عدد التمارين غير المصححة من قاعدة البيانات
        const pendingCount = 8;
        pendingElement.textContent = `${pendingCount} تمرين`;
        if (pendingCount > 5) {
            pendingElement.style.color = 'var(--danger)';
        }
    }
}

// تحميل قائمة الطلاب
async function loadInstructorStudents() {
    const tableBody = document.getElementById('instructor-students-table');
    if (!tableBody) return;
    
    // بيانات تجريبية - سيتم جلبها من Supabase لاحقاً
    const students = [
        { name: 'خالد بن عبدالله', group: 'المجموعة السيبرانية أ', grade: '92 / 100', lastActivity: 'اليوم', canEdit: true },
        { name: 'سارة الأحمد', group: 'المجموعة السيبرانية ب', grade: '88 / 100', lastActivity: 'أمس', canEdit: true },
        { name: 'محمد العتيبي', group: 'المجموعة السيبرانية أ', grade: '76 / 100', lastActivity: 'منذ يومين', canEdit: true },
        { name: 'نورة القحطاني', group: 'المجموعة السيبرانية ب', grade: '95 / 100', lastActivity: 'اليوم', canEdit: true }
    ];
    
    if (students.length > 0) {
        tableBody.innerHTML = students.map(student => `
            <tr>
                <td><strong>${student.name}</strong></td>
                <td>${student.group}</td>
                <td>${student.grade}</td>
                <td>${student.lastActivity}</td>
                <td>
                    <button class="btn-action-small" style="background: var(--primary);" onclick="showToast('✏️ تعديل تقييم الطالب ${student.name}', 'info')">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn-action-small" style="background: var(--accent);" onclick="showToast('📧 إرسال ملاحظات للطالب ${student.name}', 'info')">
                        <i class="fas fa-comment"></i> ملاحظات
                    </button>
                </td>
            </tr>
        `).join('');
    } else {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">لا يوجد طلاب مسجلين بعد</td></tr>';
    }
}

// التصدير للاستخدام العالمي
window.initInstructorDashboard = initInstructorDashboard;

// تشغيل التهيئة تلقائياً
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstructorDashboard);
} else {
    initInstructorDashboard();
}
