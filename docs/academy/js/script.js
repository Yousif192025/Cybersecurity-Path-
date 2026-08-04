/**
 * CyberPath Academy - Main JavaScript
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // 1. Load Data from JSON files
    // ============================================
    function loadData() {
        // Load certifications
        fetch('../data/certifications.json')
            .then(response => response.json())
            .then(data => {
                renderCertifications(data.featured);
            })
            .catch(() => {
                // Fallback data if JSON not available
                renderCertifications(getFallbackCertifications());
            });

        // Load career paths
        fetch('../data/career-paths.json')
            .then(response => response.json())
            .then(data => {
                renderCareerPaths(data);
            })
            .catch(() => {
                renderCareerPaths(getFallbackCareerPaths());
            });

        // Load platforms
        fetch('../data/platforms.json')
            .then(response => response.json())
            .then(data => {
                renderPlatforms(data.featured);
            })
            .catch(() => {
                renderPlatforms(getFallbackPlatforms());
            });

        // Load providers
        fetch('../data/providers.json')
            .then(response => response.json())
            .then(data => {
                renderProviders(data);
            })
            .catch(() => {
                renderProviders(getFallbackProviders());
            });

        // Load jobs
        fetch('../data/jobs.json')
            .then(response => response.json())
            .then(data => {
                renderJobs(data);
            })
            .catch(() => {
                renderJobs(getFallbackJobs());
            });

        // Load articles
        fetch('../data/articles.json')
            .then(response => response.json())
            .then(data => {
                renderArticles(data);
            })
            .catch(() => {
                renderArticles(getFallbackArticles());
            });
    }

    // ============================================
    // 2. Render Functions
    // ============================================
    function renderCertifications(certifications) {
        const container = document.getElementById('certificationsContainer');
        if (!container) return;

        container.innerHTML = certifications.map(cert => `
            <div class="col-lg-4 col-md-6">
                <div class="cert-card">
                    <span class="cert-provider">${cert.provider}</span>
                    <h5 class="cert-name">${cert.name}</h5>
                    <div class="cert-level ${cert.level}">${cert.level}</div>
                    <div class="cert-details">
                        <span class="cert-detail"><i class="fa-regular fa-clock"></i> ${cert.duration || 'متغير'}</span>
                        <span class="cert-detail"><i class="fa-regular fa-building"></i> ${cert.provider}</span>
                    </div>
                    <a href="${cert.url || '#'}" class="cert-link">
                        عرض الشهادة <i class="fa-solid fa-arrow-left"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }

    function renderCareerPaths(paths) {
        const container = document.getElementById('careerPathsContainer');
        if (!container) return;

        container.innerHTML = paths.map(path => `
            <div class="col-lg-3 col-md-6">
                <a href="${path.url || '#'}" class="career-card">
                    <div class="card-icon"><i class="${path.icon || 'fa-solid fa-route'}"></i></div>
                    <h5>${path.name}</h5>
                    <p>${path.description}</p>
                    <div class="card-tags">
                        ${path.skills ? path.skills.slice(0, 3).map(skill => `
                            <span class="card-tag">${skill}</span>
                        `).join('') : ''}
                    </div>
                </a>
            </div>
        `).join('');
    }

    function renderPlatforms(platforms) {
        const container = document.getElementById('platformsContainer');
        if (!container) return;

        container.innerHTML = platforms.map(platform => `
            <div class="col-lg-4 col-md-6">
                <a href="${platform.url || '#'}" class="platform-card" target="_blank">
                    <div class="platform-icon"><i class="${platform.icon || 'fa-solid fa-laptop-code'}"></i></div>
                    <h5 class="platform-name">${platform.name}</h5>
                    <div class="platform-rating">${'★'.repeat(platform.rating || 4)}${'☆'.repeat(5 - (platform.rating || 4))}</div>
                    <span class="platform-level">${platform.level || 'جميع المستويات'}</span>
                    <span class="platform-type">${platform.type || 'تعلم'}</span>
                </a>
            </div>
        `).join('');
    }

    function renderProviders(providers) {
        const container = document.getElementById('providersContainer');
        if (!container) return;

        container.innerHTML = providers.map(provider => `
            <a href="${provider.url || '#'}" class="provider-card">
                <div class="provider-icon"><i class="${provider.icon || 'fa-solid fa-building'}"></i></div>
                <div class="provider-name">${provider.name}</div>
                <div class="provider-count">${provider.count || ''} شهادة</div>
            </a>
        `).join('');
    }

    function renderJobs(jobs) {
        const container = document.getElementById('jobsContainer');
        if (!container) return;

        container.innerHTML = jobs.map(job => `
            <div class="col-lg-4 col-md-6">
                <div class="job-card">
                    <h5 class="job-title">${job.title}</h5>
                    <div class="job-skills">
                        ${job.skills ? job.skills.slice(0, 4).map(skill => `
                            <span class="job-skill">${skill}</span>
                        `).join('') : ''}
                    </div>
                    <div class="job-cert">${job.certifications ? job.certifications.join(' • ') : ''}</div>
                    <div class="job-salary">${job.salary || 'حسب الخبرة'}</div>
                    <a href="${job.url || '#'}" class="job-link">
                        عرض التفاصيل <i class="fa-solid fa-arrow-left"></i>
                    </a>
                </div>
            </div>
        `).join('');
    }

    function renderArticles(articles) {
        const container = document.getElementById('articlesContainer');
        if (!container) return;

        container.innerHTML = articles.slice(0, 3).map(article => `
            <div class="col-lg-4 col-md-6">
                <a href="${article.url || '#'}" class="article-card">
                    <div class="article-date">${article.date || ''}</div>
                    <h5 class="article-title">${article.title}</h5>
                    <p class="article-excerpt">${article.excerpt || ''}</p>
                    <span class="article-read">اقرأ المقال <i class="fa-solid fa-arrow-left"></i></span>
                </a>
            </div>
        `).join('');
    }

    // ============================================
    // 3. Fallback Data (in case JSON fails)
    // ============================================
    function getFallbackCertifications() {
        return [
            { name: 'Security+', provider: 'CompTIA', level: 'beginner', duration: '3 أشهر', url: '/academy/certifications/comptia/security-plus/' },
            { name: 'CCNA', provider: 'Cisco', level: 'intermediate', duration: '4 أشهر', url: '/academy/certifications/cisco/ccna/' },
            { name: 'CEH', provider: 'EC-Council', level: 'advanced', duration: '5 أشهر', url: '/academy/certifications/ec-council/ceh/' },
            { name: 'Certified in Cybersecurity', provider: 'ISC2', level: 'beginner', duration: '2 أشهر', url: '/academy/certifications/isc2/cc/' },
            { name: 'SC-900', provider: 'Microsoft', level: 'beginner', duration: '2 أشهر', url: '/academy/certifications/microsoft/sc-900/' },
            { name: 'OSCP', provider: 'OffSec', level: 'advanced', duration: '6 أشهر', url: '/academy/certifications/offsec/oscp/' }
        ];
    }

    function getFallbackCareerPaths() {
        return [
            { name: 'SOC Analyst', description: 'تحليل التهديدات والاستجابة للحوادث', skills: ['SIEM', 'Threat Hunting'], icon: 'fa-solid fa-shield-halved', url: '/academy/career-paths/soc-analyst/' },
            { name: 'Penetration Tester', description: 'اختبار الاختراق واكتشاف الثغرات', skills: ['Kali Linux', 'Metasploit'], icon: 'fa-solid fa-bug', url: '/academy/career-paths/penetration-tester/' },
            { name: 'Cloud Security', description: 'أمن البيئات السحابية', skills: ['AWS', 'Azure'], icon: 'fa-solid fa-cloud', url: '/academy/career-paths/cloud-security/' },
            { name: 'Network Security', description: 'تأمين البنية التحتية للشبكات', skills: ['Firewalls', 'VPN'], icon: 'fa-solid fa-network-wired', url: '/academy/career-paths/network-security/' }
        ];
    }

    function getFallbackPlatforms() {
        return [
            { name: 'TryHackMe', rating: 5, level: 'مبتدئ', type: 'عملي', icon: 'fa-solid fa-terminal', url: 'https://tryhackme.com' },
            { name: 'Hack The Box', rating: 5, level: 'متوسط', type: 'تحديات', icon: 'fa-solid fa-cubes', url: 'https://hackthebox.com' },
            { name: 'Cybrary', rating: 4, level: 'جميع المستويات', type: 'دورات', icon: 'fa-solid fa-graduation-cap', url: 'https://cybrary.it' },
            { name: 'Coursera', rating: 4, level: 'جميع المستويات', type: 'دورات أكاديمية', icon: 'fa-solid fa-university', url: 'https://coursera.org' },
            { name: 'Udemy', rating: 4, level: 'جميع المستويات', type: 'دورات', icon: 'fa-solid fa-chalkboard-user', url: 'https://udemy.com' },
            { name: 'freeCodeCamp', rating: 5, level: 'مبتدئ', type: 'مجاني', icon: 'fa-solid fa-code', url: 'https://freecodecamp.org' }
        ];
    }

    function getFallbackProviders() {
        return [
            { name: 'CompTIA', count: 5, icon: 'fa-solid fa-certificate', url: '/academy/certifications/comptia/' },
            { name: 'Cisco', count: 4, icon: 'fa-solid fa-network-wired', url: '/academy/certifications/cisco/' },
            { name: 'ISC2', count: 3, icon: 'fa-solid fa-shield', url: '/academy/certifications/isc2/' },
            { name: 'EC-Council', count: 4, icon: 'fa-solid fa-bug', url: '/academy/certifications/ec-council/' },
            { name: 'Microsoft', count: 6, icon: 'fa-brands fa-microsoft', url: '/academy/certifications/microsoft/' },
            { name: 'AWS', count: 3, icon: 'fa-brands fa-aws', url: '/academy/certifications/aws/' },
            { name: 'OffSec', count: 2, icon: 'fa-solid fa-skull', url: '/academy/certifications/offsec/' },
            { name: 'ISACA', count: 3, icon: 'fa-solid fa-scale-balanced', url: '/academy/certifications/isaca/' }
        ];
    }

    function getFallbackJobs() {
        return [
            { title: 'SOC Analyst', skills: ['SIEM', 'Threat Hunting', 'Incident Response'], certifications: ['Security+', 'CySA+'], salary: '8,000 - 15,000 ر.س', url: '/academy/jobs/soc-analyst/' },
            { title: 'Penetration Tester', skills: ['Kali Linux', 'Metasploit', 'Burp Suite'], certifications: ['CEH', 'OSCP'], salary: '12,000 - 20,000 ر.س', url: '/academy/jobs/penetration-tester/' },
            { title: 'Cloud Security Engineer', skills: ['AWS', 'Azure', 'DevSecOps'], certifications: ['SC-900', 'AZ-500'], salary: '15,000 - 25,000 ر.س', url: '/academy/jobs/cloud-security/' }
        ];
    }

    function getFallbackArticles() {
        return [
            { title: 'دليل شامل لاختبار Security+', excerpt: 'كل ما تحتاج معرفته لاجتياز اختبار CompTIA Security+', date: '10 يناير 2026', url: '/academy/blog/security-plus-guide/' },
            { title: 'أساسيات اختبار الاختراق', excerpt: 'تعلم أساسيات اختبار الاختراق من الصفر', date: '5 يناير 2026', url: '/academy/blog/penetration-testing-basics/' },
            { title: 'كيف تصبح محلل أمن سيبراني (SOC)', excerpt: 'دليل شامل للانطلاق في مجال تحليل الأمن', date: '1 يناير 2026', url: '/academy/blog/become-soc-analyst/' }
        ];
    }

    // ============================================
    // 4. Scroll Animations
    // ============================================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    }

    // ============================================
    // 5. Smooth Navigation
    // ============================================
    function initSmoothNav() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ============================================
    // 6. Initialize Everything
    // ============================================
    loadData();
    initScrollAnimations();
    initSmoothNav();

    console.log('🚀 CyberPath Academy initialized successfully!');
});
