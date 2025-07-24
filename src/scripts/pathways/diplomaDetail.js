// src/scripts/pathways/diplomaDetail.js
// سيتم بناء هذا الملف بواسطة Webpack إلى docs/assets/js/diplomaDetail.js

document.addEventListener('DOMContentLoaded', async () => {
    // تحديد مسار ملف JSON بناءً على اسم الملف الحالي (tvtc-cs-diploma.html أو tvtc-cs-security.html)
    const currentPagePath = window.location.pathname;
    let diplomaDataFile = '';

    if (currentPagePath.includes('tvtc-cs-diploma.html')) {
        diplomaDataFile = '../assets/data/cs_diploma.json'; // مسار افتراضي لـ docs
    } else if (currentPagePath.includes('tvtc-cs-security.html')) {
        diplomaDataFile = '../assets/data/cybersecurity_diploma.json'; // مسار افتراضي لـ docs
    } else {
        console.error('Unknown diploma page. Cannot load data.');
        return;
    }

    try {
        const response = await fetch(diplomaDataFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const diplomaData = await response.json();
        console.log('بيانات الدبلوم المحملة:', diplomaData);

        // تحديث قسم البطل (Hero Section)
        document.querySelector('.diploma-hero h1').textContent = diplomaData.name;
        document.querySelector('.diploma-hero p.lead').textContent = diplomaData.description;
        document.querySelector('.diploma-hero .badge.bg-primary').innerHTML = `<i class="fas fa-calendar-alt me-2"></i> ${diplomaData.duration}`;
        document.querySelector('.diploma-hero .btn-light').href = diplomaData.tvtcOfficialLink;

        // ملء قسم المقررات الدراسية
        const accordionContainer = document.getElementById('diplomaCoursesAccordion');
        accordionContainer.innerHTML = ''; // مسح أي محتوى سابق

        diplomaData.semesters.forEach((semester, semIndex) => {
            const semesterItem = document.createElement('div');
            semesterItem.classList.add('accordion-item');
            const isFirstSemester = semIndex === 0;

            semesterItem.innerHTML = `
                <h3 class="accordion-header" id="headingSemester${semIndex + 1}">
                    <button class="accordion-button ${isFirstSemester ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSemester${semIndex + 1}" aria-expanded="${isFirstSemester ? 'true' : 'false'}" aria-controls="collapseSemester${semIndex + 1}">
                        <i class="fas fa-chalkboard me-2"></i> ${semester.name}
                    </button>
                </h3>
                <div id="collapseSemester${semIndex + 1}" class="accordion-collapse collapse ${isFirstSemester ? 'show' : ''}" aria-labelledby="headingSemester${semIndex + 1}" data-bs-parent="#diplomaCoursesAccordion">
                    <div class="accordion-body">
                        <ul class="list-group list-group-flush">
                            ${semester.courses.map((course, courseIndex) => `
                                <li class="list-group-item course-item">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4 class="mb-0">${course.title} <span class="badge bg-secondary ms-2">${course.code}</span></h4>
                                        <a href="#" class="btn btn-sm btn-outline-primary course-details-toggle" data-bs-toggle="collapse" data-bs-target="#course${semIndex + 1}-${courseIndex + 1}Details">
                                            <i class="fas fa-info-circle me-1"></i> التفاصيل
                                        </a>
                                    </div>
                                    <p class="text-muted mb-2">${course.description}</p>
                                    <div id="course${semIndex + 1}-${courseIndex + 1}Details" class="collapse">
                                        ${course.objectives && course.objectives.length > 0 ? `
                                            <h5>أهداف التعلم:</h5>
                                            <ul>
                                                ${course.objectives.map(obj => `<li>${obj}</li>`).join('')}
                                            </ul>
                                        ` : ''}
                                        ${course.resources && course.resources.length > 0 ? `
                                            <h5>الموارد:</h5>
                                            <div class="course-resources">
                                                ${course.resources.map(res => {
                                                    let iconClass = '';
                                                    let btnClass = '';
                                                    switch (res.type) {
                                                        case 'internal': iconClass = 'fas fa-book'; btnClass = 'btn-info'; break;
                                                        case 'glossary': iconClass = 'fas fa-book-open'; btnClass = 'btn-warning'; break;
                                                        case 'self-test': iconClass = 'fas fa-question-circle'; btnClass = 'btn-danger'; break;
                                                        case 'external': iconClass = 'fas fa-external-link-alt'; btnClass = 'btn-success'; break;
                                                        case 'game': iconClass = 'fas fa-gamepad'; btnClass = 'btn-primary'; break; // for games
                                                        default: iconClass = 'fas fa-link'; btnClass = 'btn-secondary';
                                                    }
                                                    return `<a href="${res.link}" ${res.type === 'external' ? 'target="_blank"' : ''} class="btn btn-sm ${btnClass} me-2 mb-2"><i class="${iconClass} me-1"></i> ${res.label}</a>`;
                                                }).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
            accordionContainer.appendChild(semesterItem);
        });

    } catch (error) {
        console.error('Error loading diploma data:', error);
        // عرض رسالة خطأ للمستخدم
        document.querySelector('.diploma-detail-container').innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                عذرًا، حدث خطأ أثناء تحميل بيانات الدبلوم. يرجى المحاولة مرة أخرى لاحقًا.
            </div>
        `;
    }
});
