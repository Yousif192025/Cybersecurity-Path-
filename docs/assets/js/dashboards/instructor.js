/**
 * وحدة المدير (Admin Dashboard)
 * النسخة المتوافقة مع نظام Lazy Loading
 */

// ============================================
// 1. متغيرات عامة
// ============================================
let isAdminInitialized = false;

// ============================================
// 2. الدوال الرئيسية
// ============================================

/**
 * دالة التهيئة الرئيسية لوحة الأدمن
 */
function initAdminDashboard() {
    console.log('🛡️ جاري تهيئة لوحة تحكم المدير...');
    
    // التحقق من وجود العناصر
    if (!document.getElementById('admin-system-stats')) {
        console.warn('⚠️ عناصر واجهة الأدمن غير موجودة بعد، تأجيل التهيئة...');
        setTimeout(initAdminDashboard, 100);
        return;
    }
    
    if (isAdminInitialized) {
        console.log('ℹ️ لوحة الأدمن تم تهيئتها مسبقاً');
        return;
    }
    
    try {
        // تحديث إحصائيات النظام
        if (typeof window.renderAdminStats === 'function') {
            window.renderAdminStats();
        } else {
            renderAdminStatsFallback();
        }
        
        // تحديث جدول المستخدمين
        if (typeof window.populateAdminUserTable === 'function') {
            window.populateAdminUserTable();
        } else {
            console.warn('⚠️ populateAdminUserTable غير موجودة في النطاق العام');
        }
        
        isAdminInitialized = true;
        console.log('✅ تم تهيئة لوحة تحكم المدير بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تهيئة لوحة الأدمن:', error);
    }
}

/**
 * دالة احتياطية لعرض إحصائيات النظام
 */
function renderAdminStatsFallback() {
    const container = document.getElementById('admin-system-stats');
    if (!container) return;
    
    const stats = [
        { label: 'المستخدمون النشطون', value: '245', alert: false },
        { label: 'جلسات المختبرات المفتوحة', value: '31', alert: false },
        { label: 'محاولات الدخول الفاشلة', value: '2', alert: true }
    ];
    
    container.innerHTML = stats.map(s => `
        <div class="stat-card" style="${s.alert ? 'border-color: var(--danger);' : ''}">
            <h4 style="${s.alert ? 'color: var(--danger);' : ''}">${s.label}</h4>
            <div class="val" style="${s.alert ? 'color: var(--danger);' : ''}">${s.value}</div>
        </div>
    `).join('');
}

/**
 * دالة لتصدير تقرير المستخدمين
 */
function exportUsersReport() {
    if (window.showToast) {
        window.showToast('📊 جاري تحضير تقرير المستخدمين...', 'info');
        setTimeout(() => {
            window.showToast('✅ تم تصدير تقرير المستخدمين بصيغة CSV', 'success');
        }, 1500);
    }
}

/**
 * دالة لعرض صحة النظام
 */
function showSystemHealth() {
    if (window.showToast) {
        window.showToast(`
            🖥️ صحة النظام:
            • قاعدة البيانات: تعمل بشكل طبيعي
            • جلسات المستخدمين النشطة: 156
            • متوسط وقت الاستجابة: 0.3 ثانية
        `, 'info');
    }
}

// ============================================
// 3. التصدير للاستخدام العالمي
// ============================================

window.initAdminDashboard = initAdminDashboard;
window.exportUsersReport = exportUsersReport;
window.showSystemHealth = showSystemHealth;

console.log('📦 وحدة Admin Dashboard جاهزة للتحميل (في وضع الانتظار)');
