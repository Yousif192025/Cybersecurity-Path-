// src/scripts/pathways/main.js
// سيتم بناء هذا الملف بواسطة Webpack إلى docs/assets/js/pathwaysMain.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Pathways Index page loaded!');

    // مثال على تفاعل بسيط: إضافة فئة عند التمرير لتحسين الرؤية أو الرسوم المتحركة
    const cards = document.querySelectorAll('.pathway-type-card');
    const observerOptions = {
        root: null, // بالنسبة لإطار العرض
        rootMargin: '0px',
        threshold: 0.1 // عندما يكون 10% من العنصر مرئيًا
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in'); // إضافة فئة لتحريك البطاقات
                observer.unobserve(entry.target); // التوقف عن المراقبة بمجرد ظهورها
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });

    // يمكنك إضافة المزيد من المنطق هنا، مثل:
    // - تتبع نقرات المستخدمين على المسارات.
    // - عرض رسائل ترحيب مخصصة بناءً على حالة تسجيل الدخول (يتطلب نظام مصادقة).
});
