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

// السطر 27: استبدال $(document).ready بـ Vanilla JS
document.addEventListener('DOMContentLoaded', () => {
    langManager.init();
});
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="main.js"></script>

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
document.addEventListener("DOMContentLoaded", function () {
    // أكورديون خارجي
    const headers = document.querySelectorAll(".accordion-header");
    headers.forEach(header => {
        header.addEventListener("click", function () {
            const body = this.nextElementSibling;
            body.classList.toggle("open");
            this.classList.toggle("active");
        });
    });

    // أكورديون داخلي للأرباع
    const quarters = document.querySelectorAll('.quarter h4');
    quarters.forEach(quarter => {
        quarter.addEventListener('click', function () {
            const ul = this.nextElementSibling;
            ul.classList.toggle('open');
            this.classList.toggle('active'); // لإضافة/إزالة علامة الزائد/الناقص
        });
    });
});

// هذه الوظائف يمكن أن تبقى هنا أو تُنقل إلى ملف JavaScript مخصص إذا تم استخدامها في العديد من الصفحات
function viewFile(url) {
    window.open(url, '_blank');
}

function printFile(url) {
    const printWindow = window.open(url, '_blank');
    printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
    };
}


// Cybersecurity-Path/assets/js/main.js

// نظام اللغات
const langManager = {
    currentLang: 'ar',
    translations: {
        ar: {
            // ترجمات عامة للموقع (من index, about, contact, etc.)
            'platform-name': 'منصة الأمن السيبراني',
            'home-nav': 'الرئيسية',
            'about-nav': 'عن المنصة',
            'learning-paths-nav': 'المسارات التعليمية',
            'courses-nav': 'الدورات الاحترافية',
            'enrollment-nav': 'التسجيل',
            'student-dashboard-nav': 'لوحة الطالب',
            'calendar-nav': 'التقويم',
            'free-platforms-link': 'منصات مجانية',
            'contact-us-nav': 'تواصل معنا',
            'platform-footer': 'المنصة',
            'about-platform-footer': 'عن المنصة',
            'policies-footer': 'السياسات',
            'terms-footer': 'الشروط والأحكام',
            'privacy-footer': 'سياسة الخصوصية',
            'contact-us-footer': 'تواصل معنا',
            'whatsapp-number': '0502161465',
            'support-center-footer': 'مركز الدعم والمساعدة',
            'more-links-footer': 'روابط أخرى',
            'news-footer': 'الأخبار',
            'email-us-footer': 'راسلنا @',
            'institute-link': 'المعهد الأهلي العالي للتدريب',
            'location-footer': 'محافظة القريات-الجوف-المملكة العربية السعودية',
            'copyright-footer': '© 2025 Yousif E.Hashim جميع الحقوق محفوظة',

            // ترجمات لوحة تحكم الطالب (student-dashboard.html)
            'student-dashboard-title': 'لوحة تحكم الطالب',
            'welcome-heading': 'مرحبًا، ',
            'welcome-message': 'هذه هي لوحة التحكم الخاصة بك. يمكنك متابعة تقدمك والوصول إلى الدورات والشهادات هنا.',
            'courses-registered': 'دورات مسجلة',
            'certificates-completed': 'شهادات مكتملة',
            'completion-rate': 'نسبة الإنجاز',
            'my-courses-heading': 'دوراتي',
            'progress-label': 'نسبة التقدم',
            'continue-course': 'متابعة الدورة',
            'view-certificate': 'عرض الشهادة',

            // ترجمات صفحة التسجيل (enrollment.html)
            'enrollment-page-title': 'التسجيل في الدورات',
            'enrollment-form-title': 'سجل الآن وابدأ رحلتك!',
            'full-name-label': 'الاسم الكامل:',
            'email-label': 'البريد الإلكتروني:',
            'phone-label': 'رقم الهاتف:',
            'course-selection-label': 'اختر الدورة / المسار:',
            'select-option': '-- اختر دورة --',
            'message-label': 'رسالة إضافية (اختياري):',
            'agree-terms-label': 'أوافق على الشروط والأحكام و سياسة الخصوصية',
            'submit-enrollment': 'أكمل التسجيل',

            // ترجمات الدورات (مشتركة بين dashboard و enrollment)
            'course-info-sec-fundamentals': 'أساسيات أمن المعلومات',
            'course-network-security': 'أمن الشبكات',
            'course-pentesting-beginner': 'اختبار اختراق للمبتدئين',
            'course-web-security': 'أمن تطبيقات الويب',
            'course-digital-forensics': 'التحليل الجنائي الرقمي',
            'course-advanced-threat-detection': 'الكشف المتقدم عن التهديدات',

            // ترجمات التقويم (calendar.html)
            'calendar-page-title': 'تقويم الدورات والفعاليات',
            'calendar-heading': 'تقويم الدورات والفعاليات',
            'sun': 'الأحد',
            'mon': 'الإثنين',
            'tue': 'الثلاثاء',
            'wed': 'الأربعاء',
            'thu': 'الخميس',
            'fri': 'الجمعة',
            'sat': 'السبت',
            'event-date-label': 'التاريخ:',
            'event-time-label': 'الوقت:',
            'event-description-label': 'الوصف:',
            'event-type-label': 'النوع:',
            'event-link-label': 'الرابط:'
        },
        en: {
            // English translations
            'platform-name': 'Cybersecurity Platform',
            'home-nav': 'Home',
            'about-nav': 'About Us',
            'learning-paths-nav': 'Learning Paths',
            'courses-nav': 'Professional Courses',
            'enrollment-nav': 'Enrollment',
            'student-dashboard-nav': 'Student Dashboard',
            'calendar-nav': 'Calendar',
            'free-platforms-link': 'Free Platforms',
            'contact-us-nav': 'Contact Us',
            'platform-footer': 'Platform',
            'about-platform-footer': 'About the Platform',
            'policies-footer': 'Policies',
            'terms-footer': 'Terms & Conditions',
            'privacy-footer': 'Privacy Policy',
            'contact-us-footer': 'Contact Us',
            'whatsapp-number': '0502161465',
            'support-center-footer': 'Support Center',
            'more-links-footer': 'More Links',
            'news-footer': 'News',
            'email-us-footer': 'Email Us @',
            'institute-link': 'Al-Ahli Higher Institute for Training',
            'location-footer': 'Al Qurayyat - Al Jawf - Saudi Arabia',
            'copyright-footer': '© 2025 Yousif E.Hashim All Rights Reserved',

            'student-dashboard-title': 'Student Dashboard',
            'welcome-heading': 'Welcome, ',
            'welcome-message': 'This is your dashboard. You can track your progress and access courses and certificates here.',
            'courses-registered': 'Courses Registered',
            'certificates-completed': 'Certificates Completed',
            'completion-rate': 'Completion Rate',
            'my-courses-heading': 'My Courses',
            'progress-label': 'Progress',
            'continue-course': 'Continue Course',
            'view-certificate': 'View Certificate',

            'enrollment-page-title': 'Course Enrollment',
            'enrollment-form-title': 'Enroll Now and Start Your Journey!',
            'full-name-label': 'Full Name:',
            'email-label': 'Email:',
            'phone-label': 'Phone Number:',
            'course-selection-label': 'Select Course / Path:',
            'select-option': '-- Select a course --',
            'message-label': 'Additional Message (optional):',
            'agree-terms-label': 'I agree to the Terms & Conditions and Privacy Policy',
            'submit-enrollment': 'Complete Enrollment',

            'course-info-sec-fundamentals': 'Information Security Fundamentals',
            'course-network-security': 'Network Security',
            'course-pentesting-beginner': 'Penetration Testing for Beginners',
            'course-web-security': 'Web Application Security',
            'course-digital-forensics': 'Digital Forensics',
            'course-advanced-threat-detection': 'Advanced Threat Detection',

            'calendar-page-title': 'Courses & Events Calendar',
            'calendar-heading': 'Courses & Events Calendar',
            'sun': 'Sun',
            'mon': 'Mon',
            'tue': 'Tue',
            'wed': 'Wed',
            'thu': 'Thu',
            'fri': 'Fri',
            'sat': 'Sat',
            'event-date-label': 'Date:',
            'event-time-label': 'Time:',
            'event-description-label': 'Description:',
            'event-type-label': 'Type:',
            'event-link-label': 'Link:'
        }
    },

    init() {
        this.loadLanguage();
        this.setupEventListeners();
    },

    loadLanguage() {
        const savedLang = localStorage.getItem('cyberPathLang') || 'ar';
        this.switchLanguage(savedLang);
    },

    switchLanguage(lang) {
        this.currentLang = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.applyTranslations();
        this.updateLangToggle();
        localStorage.setItem('cyberPathLang', lang);
    },

    applyTranslations() {
        document.querySelectorAll('[data-text]').forEach(el => {
            const key = el.getAttribute('data-text');
            if (this.translations[this.currentLang][key]) {
                el.textContent = this.translations[this.currentLang][key];
            } else {
                console.warn(`Missing translation key: ${key} for language: ${this.currentLang}`);
            }
        });
    },

    updateLangToggle() {
        const toggle = document.getElementById('langToggle');
        if (toggle) {
            toggle.textContent = this.currentLang === 'ar' ? 'EN' : 'AR';
        }
    },

    setupEventListeners() {
        // Toggle Mobile Menu
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
            });
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.classList.remove('active');
                });
            });
        }

        // Language Toggle Button
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
                this.switchLanguage(newLang);
            });
        }

        // Scroll to Top/Bottom Buttons
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
        if (scrollToTopBtn && scrollToBottomBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    scrollToTopBtn.style.display = 'block';
                    scrollToBottomBtn.style.display = 'block';
                } else {
                    scrollToTopBtn.style.display = 'none';
                    scrollToBottomBtn.style.display = 'none';
                }
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
                    scrollToBottomBtn.style.display = 'none';
                } else if (window.scrollY > 300) {
                    scrollToBottomBtn.style.display = 'block';
                }
            });

            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            scrollToBottomBtn.addEventListener('click', () => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            });
        }
    }
};

// Initialize the language manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    langManager.init();
});

