// docs/assets/js/roadmap-builder.js

document.addEventListener('DOMContentLoaded', () => {
    const generateRoadmapBtn = document.getElementById('generateRoadmapBtn');
    const roadmapResultsDiv = document.getElementById('roadmapResults');

    // Sample roadmap data (you would likely fetch this from a JSON file or API in a real application)
    const roadmapData = {
        beginner: {
            "core": [
                {
                    title: "مقدمة في الأمن السيبراني",
                    description: "فهم المفاهيم الأساسية، التهديدات الشائعة، ومبادئ الحماية.",
                    resources: [
                        { name: "كورس أساسيات الأمن السيبراني (Coursera)", link: "https://www.coursera.org/courses?query=cybersecurity%20basics" },
                        { name: "كتاب CompTIA Security+ Study Guide", link: "https://www.amazon.com/CompTIA-Security-Study-Guide-SY0-601/dp/1119639017" }
                    ],
                    tests: [
                        { name: "اختبار Security+ Practice Exam", link: "https://www.comptia.org/certifications/security" }
                    ]
                },
                {
                    title: "أساسيات الشبكات",
                    description: "فهم بروتوكولات الشبكة (TCP/IP)، نموذج OSI، وعناصر الشبكة الأساسية.",
                    resources: [
                        { name: "كورس Cisco CCNA (NetAcad)", link: "https://www.netacad.com/courses/networking/ccna" },
                        { name: "كتاب Network+ Study Guide", link: "https://www.amazon.com/CompTIA-Network-Study-Guide-N10-008/dp/1119785025" }
                    ],
                    tests: [
                        { name: "اختبار Network+ Practice Exam", link: "https://www.comptia.org/certifications/network" }
                    ]
                },
                {
                    title: "أساسيات أنظمة التشغيل (Linux & Windows)",
                    description: "التعامل مع سطر الأوامر، إدارة الملفات، الأذونات، والخدمات الأساسية.",
                    resources: [
                        { name: "كورس Linux Essentials (edX)", link: "https://www.edx.org/course/linux-basics-for-developers" },
                        { name: "شروحات Microsoft Learn", link: "https://learn.microsoft.com/en-us/training/browse/?products=windows" }
                    ],
                    tests: []
                },
            ],
            "network-security": [
                {
                    title: "أساسيات أمن الشبكات",
                    description: "جدران الحماية، أنظمة كشف/منع التسلل (IDS/IPS)، الشبكات الافتراضية الخاصة (VPN).",
                    resources: [{name: "مصادر إضافية حول جدران الحماية", link: "#"}],
                    tests: []
                }
            ],
            // ... other beginner domains
        },
        intermediate: {
            "core": [
                {
                    title: "اختبار الاختراق (مقدمة)",
                    description: "تعلم المنهجيات والأدوات الأساسية لاختبار الاختراق الأخلاقي.",
                    resources: [
                        { name: "كورس Certified Ethical Hacker (CEH) مقدمة", link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/" }
                    ],
                    tests: [{name: "تحديات TryHackMe للمبتدئين", link: "https://tryhackme.com/path/beginner"}]
                },
                {
                    title: "أمن تطبيقات الويب (OWASP Top 10)",
                    description: "فهم الثغرات الأكثر شيوعًا في تطبيقات الويب وكيفية الحماية منها.",
                    resources: [
                        { name: "أكاديمية PortSwigger Web Security Academy", link: "https://portswigger.net/web-security" },
                        { name: "دليل OWASP Top 10", link: "https://owasp.org/www-project-top-ten/" }
                    ],
                    tests: []
                }
            ],
            "digital-forensics": [
                {
                    title: "أساسيات التحليل الجنائي الرقمي",
                    description: "مقدمة لجمع الأدلة، تحليل البيانات، والاستجابة للحوادث.",
                    resources: [{name: "كورس Cybrary Digital Forensics", link: "https://www.cybrary.it/course/introduction-digital-forensics/"}],
                    tests: []
                }
            ],
            // ... other intermediate domains
        },
        advanced: {
            "core": [
                {
                    title: "هندسة الأمن المتقدمة",
                    description: "تصميم وتنفيذ حلول أمنية معقدة، الأمن في بيئات DevOps.",
                    resources: [],
                    tests: []
                }
            ],
            "malware-analysis": [
                {
                    title: "تحليل البرمجيات الخبيثة المتقدم",
                    description: "التحليل الساكن والديناميكي للبرمجيات الخبيثة، الهندسة العكسية.",
                    resources: [],
                    tests: []
                }
            ],
            // ... other advanced domains
        }
    };

    generateRoadmapBtn.addEventListener('click', () => {
        const selectedLevel = document.querySelector('input[name="experienceLevel"]:checked').value;
        const selectedDomains = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

        displayRoadmap(selectedLevel, selectedDomains);
    });

    function displayRoadmap(level, domains) {
        roadmapResultsDiv.innerHTML = ''; // Clear previous results

        let content = '';

        // Add core recommendations for the selected level
        if (roadmapData[level] && roadmapData[level].core) {
            content += '<h3><i class="fas fa-gem"></i> المقررات الأساسية الموصى بها:</h3>';
            roadmapData[level].core.forEach(item => {
                content += createRoadmapItemHtml(item);
            });
        }

        // Add domain-specific recommendations
        if (domains.length > 0) {
            content += '<h3><i class="fas fa-tools"></i> المجالات المتخصصة المختارة:</h3>';
            domains.forEach(domain => {
                if (roadmapData[level] && roadmapData[level][domain]) {
                    content += `<h4>${getDomainDisplayName(domain)}:</h4>`;
                    roadmapData[level][domain].forEach(item => {
                        content += createRoadmapItemHtml(item);
                    });
                } else {
                    content += `<div class="alert alert-warning">لا توجد توصيات محددة لـ "${getDomainDisplayName(domain)}" في مستوى "${level}".</div>`;
                }
            });
        } else {
            content += '<div class="alert alert-info">لم تختر أي مجالات متخصصة. يرجى اختيار مجال واحد على الأقل للحصول على توصيات مخصصة.</div>';
        }

        if (content === '') {
            roadmapResultsDiv.innerHTML = `<div class="alert alert-warning">لا توجد توصيات متاحة بناءً على اختياراتك.</div>`;
        } else {
            roadmapResultsDiv.innerHTML = content;
        }
    }

    function createRoadmapItemHtml(item) {
        let resourcesHtml = '';
        if (item.resources && item.resources.length > 0) {
            item.resources.forEach(res => {
                resourcesHtml += `<a href="${res.link}" target="_blank"><i class="fas fa-book"></i> ${res.name}</a>`;
            });
        }

        let testsHtml = '';
        if (item.tests && item.tests.length > 0) {
            item.tests.forEach(test => {
                testsHtml += `<a href="${test.link}" target="_blank"><i class="fas fa-vial"></i> ${test.name}</a>`;
            });
        }

        return `
            <div class="roadmap-item">
                <h5>${item.title}</h5>
                <p>${item.description}</p>
                <div class="links">
                    ${resourcesHtml}
                    ${testsHtml}
                </div>
            </div>
        `;
    }

    function getDomainDisplayName(domainValue) {
        // Simple mapping for display names
        const names = {
            "network-security": "أمن الشبكات",
            "web-app-security": "أمن تطبيقات الويب",
            "digital-forensics": "التحليل الجنائي الرقمي",
            "malware-analysis": "تحليل البرمجيات الخبيثة",
            "cloud-security": "أمن الحوسبة السحابية",
            "threat-intelligence": "الاستخبارات التهديدية",
            "cryptography": "التشفير",
            "security-operations": "عمليات الأمن (SOC)",
            "governance-risk-compliance": "الحوكمة والمخاطر والامتثال (GRC)"
        };
        return names[domainValue] || domainValue;
    }
});
