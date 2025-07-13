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
