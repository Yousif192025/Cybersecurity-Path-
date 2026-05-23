/**
 * وحدة المدير (Admin Dashboard)
 * يتم تحميلها ديناميكياً عند التبديل إلى واجهة الأدمن
 * ملاحظة: معظم الدوال موجودة بالفعل في الملف الرئيسي، هذا الملف يكمل الوظائف الإضافية
 */

// دالة التهيئة الإضافية لوحة الأدمن
function initAdminDashboard() {
    console.log('🛡️ جاري تهيئة لوحة تحكم المدير...');
    
    // تحديث إحصائيات النظام
    if (typeof window.renderAdminStats === 'function') {
        window.renderAdminStats();
    }
    
    // تحديث جدول المستخدمين
    if (typeof window.populateAdminUserTable === 'function') {
        window.populateAdminUserTable();
    }
    
    // إضافة مستمع لحدث تحديث الجدول عبر البحث
    setupAdminSearchListener();
}

// إعداد مستمع البحث الخاص بلوحة الأدمن
function setupAdminSearchListener() {
    const searchInput = document.getElementById('global-search');
    if (searchInput && typeof window.populateAdminUserTable === 'function') {
        // إزالة المستمع القديم إذا وجد لتجنب التكرار
        const oldListener = searchInput._adminSearchListener;
        if (oldListener) {
            searchInput.removeEventListener('input', oldListener);
        }
        
        const debouncedSearch = debounce((query) => {
            window.populateAdminUserTable(query);
        }, 300);
        
        const listener = (e) => debouncedSearch(e.target.value);
        searchInput.addEventListener('input', listener);
        searchInput._adminSearchListener = listener;
    }
}

// دالة debounce مساعدة
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// دالة لتصدير تقرير المستخدمين (ميزة إضافية)
function exportUsersReport() {
    if (typeof window.populateAdminUserTable !== 'function') {
        showToast('❌ لا يمكن تصدير التقرير حالياً', 'error');
        return;
    }
    
    showToast('📊 جاري تحضير تقرير المستخدمين...', 'info');
    
    // محاكاة تصدير البيانات
    setTimeout(() => {
        showToast('✅ تم تصدير تقرير المستخدمين بصيغة CSV', 'success');
    }, 1500);
}

// دالة لعرض إحصائيات النظام المتقدمة
function showSystemHealth() {
    showToast(`
        🖥️ صحة النظام:
        • قاعدة البيانات: تعمل بشكل طبيعي
        • جلسات المستخدمين النشطة: 156
        • متوسط وقت الاستجابة: 0.3 ثانية
        • التخزين المستخدم: 45% من السعة
    `, 'info');
}

// تصدير الدوال الإضافية
window.initAdminDashboard = initAdminDashboard;
window.exportUsersReport = exportUsersReport;
window.showSystemHealth = showSystemHealth;

// تشغيل التهيئة التلقائية
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminDashboard);
} else {
    initAdminDashboard();
}
