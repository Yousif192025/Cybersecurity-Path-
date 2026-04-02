// Cybersecurity-Path/assets/js/main.js

// 1. نظام اللغات (المصدر الوحيد للحقيقة في الترجمة)
const langManager = {
    currentLang: 'ar',
    translations: {
        ar: {
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

            // ترجمات لوحة تحكم الطالب
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

            // ترجمات صفحة التسجيل
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

            // ترجمات الدورات
            'course-info-sec-fundamentals': 'أساسيات أمن المعلومات',
            'course-network-security': 'أمن الشبكات',
            'course-pentesting-beginner': 'اختبار اختراق للمبتدئين',
            'course-web-security': 'أمن تطبيقات الويب',
            'course-digital-forensics': 'التحليل الجنائي الرقمي',
            'course-advanced-threat-detection': 'الكشف المتقدم عن التهديدات',

            // ترجمات القاموس والدليل
            'cyber-guide': 'الدليل السيبراني',
            'cyber-guide-desc': 'تعرّف على أهم الخطوات الأساسية للدخول في مجال الأمن السيبراني.',
            'learning-paths': 'المسارات التعليمية',
            'pathways-desc': 'اختر مسارك التعليمي حسب مستواك وأهدافك.',
            'glossary-title': 'قاموس المصطلحات',
            'glossary-desc': 'مرجع شامل لمصطلحات الأمن السيبراني مترجمة ومشروحة.',
            'training-games': 'الألعاب التدريبية',
            'games-desc': 'تعلم من خلال الألعاب التفاعلية والتحديات الأمنية.',
            'digital-skills-tests': 'اختبارات المهارات الرقمية',
            'tests-desc': 'اختبر معلوماتك وحسّن مهاراتك عبر اختبارات متدرجة.',
            'free-platforms-desc': 'منصات مفتوحة للبرمجة وتطبيقات الأمن السيبراني.',
            
            // ترجمات التقويم
            'calendar-page-title': 'تقويم الدورات والفعاليات',
            'calendar-heading': 'تقويم الدورات والفعاليات',
            'sun': 'الأحد', 'mon': 'الإثنين', 'tue': 'الثلاثاء', 'wed': 'الأربعاء', 'thu': 'الخميس', 'fri': 'الجمعة', 'sat': 'السبت',
            'event-date-label': 'التاريخ:',
            'event-time-label': 'الوقت:',
            'event-description-label': 'الوصف:',
            'event-type-label': 'النوع:',
            'event-link-label': 'الرابط:'
        },
        en: {
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
            'welcome-message': 'This is your dashboard. You can track your progress here.',
            'courses-registered': 'Courses Registered',
            'certificates-completed': 'Certificates Completed',
            'completion-rate': 'Completion Rate',
            'my-courses-heading': 'My Courses',
            'progress-label': 'Progress',
            'continue-course': 'Continue Course',
            'view-certificate': 'View Certificate',

            'enrollment-page-title': 'Course Enrollment',
            'enrollment-form-title': 'Enroll Now!',
            'full-name-label': 'Full Name:',
            'email-label': 'Email:',
            'phone-label': 'Phone Number:',
            'course-selection-label': 'Select Course:',
            'select-option': '-- Select a course --',
            'message-label': 'Message (optional):',
            'agree-terms-label': 'I agree to Terms & Privacy Policy',
            'submit-enrollment': 'Complete Enrollment',

            'course-info-sec-fundamentals': 'InfoSec Fundamentals',
            'course-network-security': 'Network Security',
            'course-pentesting-beginner': 'Ethical Hacking Intro',
            'course-web-security': 'Web App Security',
            'course-digital-forensics': 'Digital Forensics',
            'course-advanced-threat-detection': 'Advanced Threat Detection',

            'calendar-page-title': 'Events Calendar',
            'calendar-heading': 'Courses & Events Calendar',
            'sun': 'Sun', 'mon': 'Mon', 'tue': 'Tue', 'wed': 'Wed', 'thu': 'Thu', 'fri': 'Fri', 'sat': 'Sat',
            'event-date-label': 'Date:', 'event-time-label': 'Time:', 'event-description-label': 'Description:',
            'event-type-label': 'Type:', 'event-link-label': 'Link:'
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
        
        // إعادة تهيئة العناصر الديناميكية عند تغيير اللغة (مثل لوحة تحكم الطالب)
        if (typeof renderStudentDashboard === 'function') renderStudentDashboard();
    },

    applyTranslations() {
        document.querySelectorAll('[data-text]').forEach(el => {
            const key = el.getAttribute('data-text');
            if (this.translations[this.currentLang][key]) {
                el.textContent = this.translations[this.currentLang][key];
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
            menuToggle.addEventListener('click', () => mobileNav.classList.toggle('active'));
            mobileNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => mobileNav.classList.remove('active'));
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

        // Scroll Buttons Logic (Vanilla JS)
        this.setupScrollLogic();
        
        // Scroll To Top/Bottom
        this.setupWindowScrolls();
    },

    setupScrollLogic() {
        const scrollMenu = document.getElementById('mainNavLinks');
        const scrollLeftBtn = document.querySelector('.scroll-btn-left');
        const scrollRightBtn = document.querySelector('.scroll-btn-right');
        const navigationWrapper = document.querySelector('.navigation-wrapper');

        if (!scrollMenu || !scrollLeftBtn || !scrollRightBtn) return;

        const checkScrollButtons = () => {
            const isScrollable = scrollMenu.scrollWidth > scrollMenu.clientWidth;
            if (isScrollable) {
                navigationWrapper.querySelectorAll('.scroll-btn').forEach(btn => btn.classList.add('active'));
            } else {
                navigationWrapper.querySelectorAll('.scroll-btn').forEach(btn => btn.classList.remove('active'));
            }

            scrollLeftBtn.classList.toggle('active', scrollMenu.scrollLeft !== 0);
            const isAtEnd = scrollMenu.scrollLeft + scrollMenu.clientWidth >= scrollMenu.scrollWidth - 5;
            scrollRightBtn.classList.toggle('active', !isAtEnd);
        };

        const scrollHorizontally = (direction) => {
            const amount = direction === 'left' ? -200 : 200;
            scrollMenu.scrollBy({ left: amount, behavior: 'smooth' });
        };

        scrollLeftBtn.addEventListener('click', () => scrollHorizontally('left'));
        scrollRightBtn.addEventListener('click', () => scrollHorizontally('right'));
        scrollMenu.addEventListener('scroll', checkScrollButtons);
        window.addEventListener('resize', checkScrollButtons);
        checkScrollButtons();
    },

    setupWindowScrolls() {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
        if (scrollToTopBtn && scrollToBottomBtn) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY > 300;
                scrollToTopBtn.style.display = scrolled ? 'block' : 'none';
                scrollToBottomBtn.style.display = (scrolled && (window.innerHeight + window.scrollY) < document.body.offsetHeight - 50) ? 'block' : 'none';
            });
            scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            scrollToBottomBtn.addEventListener('click', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
        }
    }
};

// 2. محاكاة بيانات لوحة تحكم الطالب (Student Dashboard Logic)
function renderStudentDashboard() {
    const studentNameEl = document.getElementById('studentName');
    if (!studentNameEl) return; // تأكد أننا في صفحة الـ Dashboard

    const studentData = {
        name: 'محمد',
        stats: { registeredCourses: 4, completedCertificates: 2, completionRate: '88' },
        enrolledCourses: [
            { id: 1, titleKey: 'course-info-sec-fundamentals', progress: 80, link: '/Cybersecurity-Path-/courses/info-sec-fundamentals.html' },
            { id: 2, titleKey: 'course-network-security', progress: 50, link: '/Cybersecurity-Path-/courses/network-security.html' },
            { id: 3, titleKey: 'course-pentesting-beginner', progress: 100, link: '/Cybersecurity-Path-/courses/pentesting-beginner.html', certificate: true }
        ]
    };

    // تحديث النصوص الأساسية
    studentNameEl.textContent = studentData.name;
    document.getElementById('coursesRegistered').textContent = studentData.stats.registeredCourses;
    document.getElementById('certificatesCompleted').textContent = studentData.stats.completedCertificates;
    document.getElementById('completionRate').textContent = studentData.stats.completionRate + '%';

    // تعبئة الدورات
    const coursesGrid = document.getElementById('coursesGrid');
    if (coursesGrid) {
        coursesGrid.innerHTML = '';
        const currentLang = langManager.currentLang;
        const trans = langManager.translations[currentLang];

        studentData.enrolledCourses.forEach(course => {
            const courseTitle = trans[course.titleKey] || course.titleKey;
            const btnKey = course.certificate ? 'view-certificate' : 'continue-course';
            const btnText = trans[btnKey] || btnKey;
            const progressLabel = trans['progress-label'] || 'Progress';

            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <h4>${courseTitle}</h4>
                <p>${progressLabel}: <span class="progress-value">${course.progress}%</span></p>
                <a href="${course.link}">${btnText}</a>
            `;
            coursesGrid.appendChild(card);
        });
    }
}

// 3. أكورديون القاموس والوظائف العامة
function setupAccordion() {
    document.querySelectorAll(".accordion-header").forEach(header => {
        header.addEventListener("click", function() {
            this.nextElementSibling.classList.toggle("open");
            this.classList.toggle("active");
        });
    });

    document.querySelectorAll('.quarter h4').forEach(quarter => {
        quarter.addEventListener('click', function() {
            this.nextElementSibling.classList.toggle('open');
            this.classList.toggle('active');
        });
    });
}

// وظائف فتح الطباعة والعرض
function viewFile(url) { window.open(url, '_blank'); }
function printFile(url) {
    const win = window.open(url, '_blank');
    win.onload = () => { win.focus(); win.print(); };
}

// تشغيل الكل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    langManager.init();
    renderStudentDashboard();
    setupAccordion();
});
