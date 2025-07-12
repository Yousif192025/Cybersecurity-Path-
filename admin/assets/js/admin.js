// إدارة حالة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل القوائم المنسدلة
    const dropdowns = document.querySelectorAll('.user-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // إدارة التنبيهات
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', function() {
            // سيتم تنفيذ عرض الإشعارات
            console.log('عرض الإشعارات');
        });
    });

    // تسجيل الخروج
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                // تنفيذ عملية تسجيل الخروج
                window.location.href = 'auth/login.html';
            }
        });
    }

    // تحميل البيانات من API
    function loadDashboardData() {
        fetch('/api/dashboard')
            .then(response => response.json())
            .then(data => {
                // تحديث واجهة المستخدم بالبيانات
                console.log('تم تحميل بيانات لوحة التحكم', data);
            })
            .catch(error => {
                console.error('حدث خطأ في جلب البيانات:', error);
            });
    }

    // تهيئة الرسوم البيانية
    function initCharts() {
        // مثال باستخدام Chart.js
        const ctx = document.getElementById('statsChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['يناير', 'فبراير', 'مارس', 'أبريل'],
                    datasets: [{
                        label: 'المستخدمون الجدد',
                        data: [120, 190, 170, 220],
                        backgroundColor: 'rgba(78, 115, 223, 0.5)',
                        borderColor: 'rgba(78, 115, 223, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    // تحميل البيانات والمخططات عند بدء التشغيل
    loadDashboardData();
    initCharts();
});
