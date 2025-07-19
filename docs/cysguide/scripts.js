// هذا الملف يمكن استخدامه لإضافة وظائف JavaScript تفاعلية للدليل في المستقبل.
// أمثلة:
// - شريط بحث
// - تبديل الثيمات (فاتح/داكن)
// - تأثيرات بصرية إضافية
// - تحميل المحتوى ديناميكيًا
// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Back to Top button functionality
    const backToTopButton = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling down 300px
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Optional: Animate.css integration (if you want elements to fade in as they scroll into view)
    // You'd typically use an Intersection Observer API for this, but for simplicity with existing classes:
    // This part requires the animate.css library linked in the HTML head.
    // If you want full "scroll-into-view" animations, you'd need a more robust JS library or custom IntersectionObserver.
    // For now, the animate.css classes are just added to the elements to give them an initial animation.
});
