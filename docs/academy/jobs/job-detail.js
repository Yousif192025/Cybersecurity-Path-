// ============================================================
// Shared Job Detail Template
// يُستدعى من كل ملف wrapper عبر window.JOB_ID، ويقرأ البيانات
// حصريًا من data/jobs.json — لا بيانات مُختلَقة هنا.
// ============================================================
(function () {
    const NAV_HTML = `
    <nav class="navbar navbar-expand-lg navbar-dark cyber-navbar">
        <div class="container">
            <a class="navbar-brand" href="/academy/">
                <i class="fa-solid fa-shield-halved text-cyber"></i>
                CyberPath <span class="text-cyber">Academy</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarMain">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link" href="/academy/">الرئيسية</a></li>
                    <li class="nav-item"><a class="nav-link" href="/academy/career-paths/">المسارات</a></li>
                    <li class="nav-item"><a class="nav-link" href="/academy/certifications/">الشهادات</a></li>
                    <li class="nav-item"><a class="nav-link" href="/academy/#platforms-section">منصات التعلم</a></li>
                    <li class="nav-item"><a class="nav-link active" href="/academy/jobs/">الوظائف</a></li>
                    <li class="nav-item"><a class="nav-link" href="/academy/blog/">المدونة</a></li>
                </ul>
            </div>
        </div>
    </nav>`;

    const FOOTER_HTML = `
    <footer class="cyber-footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-4">
                    <h5><i class="fa-solid fa-shield-halved text-cyber"></i> CyberPath Academy</h5>
                    <p>رحلتك نحو الاحتراف في الأمن السيبراني تبدأ من هنا.</p>
                    <p class="footer-tagline">Learn • Practice • Certify • Get Hired</p>
                </div>
                <div class="col-lg-2">
                    <h6>الأقسام</h6>
                    <ul>
                        <li><a href="/academy/career-paths/">المسارات</a></li>
                        <li><a href="/academy/certifications/">الشهادات</a></li>
                        <li><a href="/academy/#platforms-section">منصات التعلم</a></li>
                        <li><a href="/academy/jobs/">الوظائف</a></li>
                    </ul>
                </div>
                <div class="col-lg-2">
                    <h6>المصادر</h6>
                    <ul>
                        <li><a href="/academy/downloads/">مركز التحميل</a></li>
                        <li><a href="/academy/resources/">المصادر</a></li>
                        <li><a href="/academy/blog/">المدونة</a></li>
                        <li><a href="/academy/quizzes/">الاختبارات</a></li>
                    </ul>
                </div>
                <div class="col-lg-4">
                    <h6>تابعنا</h6>
                    <div class="social-links">
                        <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                        <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                        <a href="#" aria-label="Telegram"><i class="fa-brands fa-telegram"></i></a>
                    </div>
                    <p class="mt-3 small">© 2026 CyberPath Academy. جميع الحقوق محفوظة</p>
                </div>
            </div>
        </div>
    </footer>`;

    function renderNotFound(root, jobId) {
        root.innerHTML = `
            <div class="container" style="padding:80px 0; text-align:center;">
                <h2>لم يتم العثور على هذه الوظيفة</h2>
                <p>المعرّف المطلوب: <code>${jobId || 'غير محدد'}</code></p>
                <a href="/academy/jobs/" class="btn btn-cyber-primary">العودة لدليل الوظائف</a>
            </div>`;
    }

    function renderJob(root, job) {
        const skillsHtml = job.skills.map(s => `<span class="job-skill">${s}</span>`).join('');
        const salaryHtml = job.salary
            ? `<div class="job-salary">${job.salary}</div>`
            : `<div class="job-salary text-muted">الراتب غير متوفر حاليًا</div>`;
        const certsHtml = (job.certifications && job.certifications.length)
            ? `<div class="mt-3"><h6>الشهادات ذات الصلة</h6>` +
              job.certifications.map(c => `<span class="job-skill">${c}</span>`).join('') + `</div>`
            : '';
        const careerPathsHtml = (job.careerPaths && job.careerPaths.length)
            ? `<div class="mt-3"><h6>المسارات المهنية ذات الصلة</h6>` +
              job.careerPaths.map(cp => `<a href="/academy/career-paths/${cp}/" class="job-skill">${cp}</a>`).join('') +
              `</div>`
            : '';

        document.title = job.title + ' | دليل الوظائف - CyberPath Academy';

        root.innerHTML = `
        ${NAV_HTML}
        <div class="breadcrumb-bar">
            <div class="container">
                <nav aria-label="Breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/academy/"><i class="fa-solid fa-house"></i> الرئيسية</a></li>
                        <li class="breadcrumb-item"><a href="/academy/jobs/">الوظائف</a></li>
                        <li class="breadcrumb-item active" aria-current="page">${job.title}</li>
                    </ol>
                </nav>
            </div>
        </div>
        <section class="jobs-section">
            <div class="container">
                <div class="job-card" style="max-width:720px; margin:0 auto;">
                    <h1 class="job-title" style="font-size:1.8rem;">${job.title}</h1>
                    <div class="job-skills">${skillsHtml}</div>
                    ${salaryHtml}
                    ${certsHtml}
                    ${careerPathsHtml}
                    <a href="/academy/jobs/" class="job-link mt-4">
                        <i class="fa-solid fa-arrow-right"></i> كل الوظائف
                    </a>
                </div>
            </div>
        </section>
        ${FOOTER_HTML}`;
    }

    function init() {
        const root = document.getElementById('job-detail-root');
        const jobId = window.JOB_ID;
        if (!root || !jobId) return;

        fetch('../../data/jobs.json')
            .then(res => res.json())
            .then(jobs => {
                const job = jobs.find(j => j.id === jobId);
                if (!job) {
                    renderNotFound(root, jobId);
                    console.error('Job not found in jobs.json for id:', jobId);
                    return;
                }
                renderJob(root, job);
            })
            .catch(err => {
                renderNotFound(root, jobId);
                console.error('Job detail load error:', err);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

