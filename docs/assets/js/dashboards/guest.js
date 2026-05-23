/**
 * وحدة الضيف والزائر العام (Guest Dashboard)
 * يتم تحميلها تلقائياً عند زيارة المنصة أو تسجيل الخروج
 */

function initGuestDashboard() {
    console.log('🌐 جاري تهيئة واجهة الزائر العام المفتوحة...');
    
    // التحقق من وجود عناصر واجهة الضيف في الـ DOM
    if (!document.getElementById('public-content-section')) {
        console.warn('⚠️ عناصر واجهة الضيف لم تكتمل في الـ DOM بعد، إعادة المحاولة...');
        setTimeout(initGuestDashboard, 100);
        return;
    }

    try {
        // تأمين الواجهة العلوية وإخفاء معالم الحسابات الخاصة
        const userNameElement = document.getElementById('user-display-name');
        if (userNameElement) {
            userNameElement.textContent = 'زائر المنصة';
        }

        const avatarElement = document.getElementById('user-avatar');
        if (avatarElement) {
            avatarElement.textContent = 'G'; // Guest
        }

        console.log('✅ تم تهيئة واجهة الضيف بنجاح. تصفح آمن ومحدود متاح الآن.');
    } catch (error) {
        console.error('❌ خطأ أثناء تهيئة واجهة الضيف:', error);
    }
}

// تصدير الدالة للنطاق العالمي ليتم استدعاؤها من المتحكم المركزي
window.initGuestDashboard = initGuestDashboard;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuestDashboard);
} else {
    setTimeout(initGuestDashboard, 100);
}
