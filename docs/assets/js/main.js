// Inside your <script> tags in student-dashboard.html
document.addEventListener('DOMContentLoaded', () => {
    // Apply translations first
    const savedLang = localStorage.getItem('lang') || 'ar';
    if (typeof applyTranslations === 'function') {
        applyTranslations(savedLang);
    }

    // --- Simulate fetching student data ---
    // In a real application, this would be an API call after user authentication
    const studentData = {
        name: 'محمد', // Example: Retrieved from user session/profile
        stats: {
            registeredCourses: 4,
            completedCertificates: 2,
            completionRate: '88%'
        },
        enrolledCourses: [
            { id: 1, titleKey: 'course-info-sec-fundamentals', progress: 80, link: '/Cybersecurity-Path-/courses/info-sec-fundamentals.html' },
            { id: 2, titleKey: 'course-network-security', progress: 50, link: '/Cybersecurity-Path-/courses/network-security.html' },
            { id: 3, titleKey: 'course-pentesting-beginner', progress: 100, link: '/Cybersecurity-Path-/courses/pentesting-beginner.html', certificate: true }
        ]
    };
// أضف هذا الكود في ملف glossary.js أو في الجزء الخاص بالسكريبت في صفحة القاموس
// تأكد من تشغيل هذا الكود بعد تحميل DOM بالكامل

$(document).ready(function() {
    const scrollMenu = $('#mainNavLinks');
    const scrollLeftBtn = $('.scroll-btn-left');
    const scrollRightBtn = $('.scroll-btn-right');
    const navigationWrapper = $('.navigation-wrapper');

    // وظيفة للتحقق مما إذا كانت هناك حاجة لأزرار التمرير
    function checkScrollButtons() {
        if (scrollMenu[0].scrollWidth > scrollMenu[0].clientWidth) {
            navigationWrapper.find('.scroll-btn').addClass('active');
        } else {
            navigationWrapper.find('.scroll-btn').removeClass('active');
        }

        // إخفاء/إظهار زر التمرير لليسار
        if (scrollMenu[0].scrollLeft === 0) {
            scrollLeftBtn.removeClass('active');
        } else {
            scrollLeftBtn.addClass('active');
        }

        // إخفاء/إظهار زر التمرير لليمين
        if (scrollMenu[0].scrollLeft + scrollMenu[0].clientWidth >= scrollMenu[0].scrollWidth - 5) { // -5 بكسل للتسامح
            scrollRightBtn.removeClass('active');
        } else {
            scrollRightBtn.addClass('active');
        }
    }

    // وظيفة التمرير
    function scrollHorizontally(direction) {
        const scrollAmount = 200; // مقدار التمرير بالبكسل
        if (direction === 'left') {
            scrollMenu.animate({ scrollLeft: scrollMenu.scrollLeft() - scrollAmount }, 300);
        } else {
            scrollMenu.animate({ scrollLeft: scrollMenu.scrollLeft() + scrollAmount }, 300);
        }
    }

    // إضافة مستمعي الأحداث لأزرار التمرير
    scrollLeftBtn.on('click', function() {
        scrollHorizontally('left');
    });

    scrollRightBtn.on('click', function() {
        scrollHorizontally('right');
    });

    // إضافة مستمع حدث للتمرير اليدوي (بواسطة المستخدم)
    scrollMenu.on('scroll', checkScrollButtons);

    // إضافة مستمع حدث لتغيير حجم النافذة (مهم للاستجابة)
    $(window).on('resize', function() {
        checkScrollButtons();
    });

    // تحقق عند التحميل الأولي وبعد أي تحديثات على DOM
    checkScrollButtons();

    // 🚨 ملاحظة مهمة: إذا كنت تستخدم Bootstrap's Navbar Toggler،
    // فإن القائمة قد تكون مخفية في البداية. يجب إعادة فحص الأزرار
    // بمجرد أن تصبح القائمة مرئية أو بعد انتهاء تأثير الانهيار.
    // يمكن تحقيق ذلك باستخدام أحداث Bootstrap 'shown.bs.collapse'
    $('#navbarNav').on('shown.bs.collapse', function () {
        // عند فتح قائمة النافبار المنهارة، لا نحتاج لأزرار التمرير
        navigationWrapper.find('.scroll-btn').removeClass('active');
    }).on('hidden.bs.collapse', function () {
        // عند إغلاقها، أعد فحص الحاجة لأزرار التمرير
        checkScrollButtons();
    });

});
    // Update Student Name
    document.getElementById('studentName').textContent = studentData.name;

    // Update Stats
    document.getElementById('coursesRegistered').textContent = studentData.stats.registeredCourses;
    document.getElementById('certificatesCompleted').textContent = studentData.stats.completedCertificates;
    document.getElementById('completionRate').textContent = studentData.stats.completionRate + '%';

    // Populate Courses Dynamically
    const coursesGrid = document.getElementById('coursesGrid');
    coursesGrid.innerHTML = ''; // Clear static content if any

    studentData.enrolledCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';

        // Get translated course title and button text
        const currentTranslations = translations[savedLang];
        const courseTitle = currentTranslations[course.titleKey] || course.titleKey; // Fallback to key if no translation
        const buttonTextKey = course.certificate ? 'view-certificate' : 'continue-course';
        const buttonText = currentTranslations[buttonTextKey] || buttonTextKey;
        const progressLabel = currentTranslations['progress-label'] || 'Progress';


        courseCard.innerHTML = `
            <h4>${courseTitle}</h4>
            <p>${progressLabel}: <span class="progress-value">${course.progress}%</span></p>
            <a href="${course.link}">${buttonText}</a>
        `;
        coursesGrid.appendChild(courseCard);
    });
});
// في ملف main.js (أو ملف الترجمة الخاص بك)
const translations = {
    'ar': {
        // ... مفاتيحك الموجودة ...
        'cyber-guide': 'الدليل السيبراني',
        'cyber-guide-desc': 'تعرّف على أهم الخطوات الأساسية للدخول في مجال الأمن السيبراني.',
        'learning-paths': 'المسارات التعليمية',
        'pathways-desc': 'اختر مسارك التعليمي حسب مستواك وأهدافك.',
        'glossary-title': 'قاموس المصطلحات', // تم تعديل الاسم ليكون أكثر تحديداً إذا كان هناك "glossary-desc"
        'glossary-desc': 'مرجع شامل لمصطلحات الأمن السيبراني مترجمة ومشروحة.',
        'training-games': 'الألعاب التدريبية',
        'games-desc': 'تعلم من خلال الألعاب التفاعلية والتحديات الأمنية.',
        'digital-skills-tests': 'اختبارات المهارات الرقمية',
        'tests-desc': 'اختبر معلوماتك وحسّن مهاراتك عبر اختبارات متدرجة.',
        'student-dashboard': 'لوحة تحكم الطالب',
        'student-dashboard-desc': 'تابع تقدمك، وادخل إلى دوراتك وشهاداتك.', // وصف جديد خاص بلوحة تحكم الطالب
        'free-platforms-link': 'منصات مجانية',
        'free-platforms-desc': 'منصات مفتوحة للبرمجة وتطبيقات الأمن السيبراني.', // وصف خاص بالمنصات المجانية
        // ... مفاتيح أخرى ...
    },
    'en': {
        // ... الترجمات الإنجليزية المقابلة ...
    }
};
