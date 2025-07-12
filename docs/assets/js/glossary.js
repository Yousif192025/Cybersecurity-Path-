// بيانات المصطلحات التي ستعرض في القاموس
const terms = [
    {
        term: "التصيد (Phishing)",
        definition: "هو هجوم إلكتروني يستخدم فيه المهاجمون رسائل بريد إلكتروني أو مواقع ويب مزيفة لخداع الضحايا وإغرائهم بتقديم معلومات حساسة مثل كلمات المرور أو أرقام البطاقات الائتمانية.",
        category: "hacking",
        example: "رسالة بريد إلكتروني تبدو وكأنها من البنك تطلب تحديث معلومات الحساب."
    },
    {
        term: "برمجية الفدية (Ransomware)",
        definition: "هو نوع من البرمجيات الخبيثة التي تقوم بتشفير ملفات الضحية وطلب فدية مالية مقابل فك التشفير.",
        category: "malware",
        example: "برنامج WannaCry الذي أصاب مئات الآلاف من الأجهزة حول العالم في 2017."
    },
    {
        term: "جدار الحماية (Firewall)",
        definition: "هو نظام أمان يتحكم في حركة مرور الشبكة الواردة والصادرة بناءً على قواعد أمان محددة مسبقًا.",
        category: "network",
        example: "أداة تمنع الوصول غير المصرح به إلى شبكة المؤسسة من الإنترنت."
    },
    {
        term: "التصيد المستهدف (Spear Phishing)",
        definition: "هو هجوم تصيد يركز على هدف معين (فرد أو منظمة) ويستخدم معلومات شخصية لزيادة فرص النجاح.",
        category: "hacking",
        example: "رسالة بريد إلكتروني موجهة لمدير مالي تبدو وكأنها من الرئيس التنفيذي تطلب تحويل أموال."
    },
    {
        term: "التصيد بالرمح (Whaling)",
        definition: "هو نوع من التصيد المستهدف يستهدف كبار المسؤولين التنفيذيين أو الشخصيات المهمة في المنظمة.",
        category: "hacking",
        example: "هجوم يستهدف الرئيس التنفيذي للشركة بادعاء وجود مشكلة قانونية تتطلب تحويل أموال."
    },
    {
        term: "هندسة اجتماعية (Social Engineering)",
        definition: "هو تكتيك يستخدمه المهاجمون لخداع الأشخاص لكشف معلومات سرية أو القيام بأفعال معينة.",
        category: "hacking",
        example: "الاتصال بالضحية وادعاء أن المتصل من قسم الدعم الفني ويطلب كلمة المرور."
    },
    {
        term: "برمجية خبيثة (Malware)",
        definition: "هو مصطلح عام يشير إلى أي برنامج مصمم لإلحاق الضرر بجهاز كمبيوتر أو شبكة أو مستخدم.",
        category: "malware",
        example: "الفيروسات، الديدان، أحصنة طروادة، برمجيات الفدية."
    },
    {
        term: "حصان طروادة (Trojan Horse)",
        definition: "هو نوع من البرمجيات الخبيثة التي تتنكر في صورة برنامج شرعي لخداع المستخدمين لتنزيلها وتشغيلها.",
        category: "malware",
        example: "برنامج يبدو كبرنامج تشغيل فيديو مجاني ولكنه في الواقع يثبت برنامج تجسس على الجهاز."
    },
    {
        term: "هجوم رفض الخدمة (DoS Attack)",
        definition: "هو هجوم يهدف إلى جعل خدمة أو مورد غير متاح للمستخدمين المقصودين.",
        category: "network",
        example: "إغراق خادم ويب بطلبات كثيرة جدًا بحيث لا يستطيع معالجة الطلبات الشرعية."
    },
    {
        term: "هجوم رفض الخدمة الموزع (DDoS Attack)",
        definition: "هو هجوم DoS يستخدم أجهزة متعددة (غالبًا ما تكون جزءًا من شبكة من الأجهزة المخترقة تسمى البوت نت) لإغراق الهدف بحركة مرور زائفة.",
        category: "network",
        example: "هجوم على موقع حكومي باستخدام آلاف الأجهزة المخترقة حول العالم."
    },
    {
        term: "التشفير (Encryption)",
        definition: "هو عملية تحويل المعلومات إلى شكل غير قابل للقراءة لمنع الوصول غير المصرح به إليها.",
        category: "encryption",
        example: "تشفير رسائل البريد الإلكتروني باستخدام بروتوكول PGP لحماية خصوصية المراسلات."
    },
    {
        term: "نفق VPN (Virtual Private Network)",
        definition: "هو تقنية تخلق اتصالاً مشفرًا عبر شبكة عامة لتوفير اتصال آمن وخاص.",
        category: "encryption",
        example: "استخدام VPN عند الاتصال بشبكة واي فاي عامة لحماية البيانات من المتطفلين."
    }
];

// أسئلة الاختبار التفاعلي
const quizQuestions = [
    {
        question: "ما هو الهجوم الذي يستخدم رسائل بريد إلكتروني مزيفة لخداع الضحايا؟",
        options: ["برمجية الفدية", "التصيد", "هجوم رفض الخدمة", "حصان طروادة"],
        correctAnswer: 1
    },
    {
        question: "أي من هذه الأنواع يصنف كبرمجية خبيثة؟",
        options: ["جدار الحماية", "VPN", "برمجية الفدية", "التشفير"],
        correctAnswer: 2
    },
    {
        question: "ما هو الغرض من جدار الحماية؟",
        options: [
            "تشفير البيانات",
            "منع الوصول غير المصرح به للشبكة",
            "خداع المستخدمين لكشف معلومات",
            "طلب فدية مالية"
        ],
        correctAnswer: 1
    },
    {
        question: "ما الفرق بين هجوم DoS و DDoS؟",
        options: [
            "لا يوجد فرق بينهما",
            "DoS يستهدف الأفراد بينما DDoS يستهدف المؤسسات",
            "DoS يأتي من مصدر واحد بينما DDoS يأتي من مصادر متعددة",
            "DoS يستخدم لسرقة البيانات بينما DDoS لشل الخدمات"
        ],
        correctAnswer: 2
    }
];

// تهيئة التطبيق عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // عرض المصطلحات الافتراضية عند التحميل الأول
    renderTerms(terms);
    
    // إعداد مستمعي الأحداث لأزرار فلترة الفئات
    setupCategoryFilters();
    
    // إعداد مستمعي الأحداث لوظيفة البحث
    setupSearch();
    
    // تهيئة وإعداد قسم الاختبار
    setupQuiz();
    
    // إعداد وظائف أزرار المشاركة
    setupShareButtons();
});

/**
 * دالة لإنشاء وعرض بطاقات المصطلحات في الحاوية المخصصة.
 * @param {Array<Object>} termsToRender - مصفوفة المصطلحات التي سيتم عرضها.
 */
function renderTerms(termsToRender) {
    const container = document.getElementById('termsContainer');
    container.innerHTML = ''; // مسح المحتوى الحالي قبل إضافة الجديد

    // إنشاء بطاقة لكل مصطلح وعرضها
    termsToRender.forEach(term => {
        const termCard = document.createElement('div');
        termCard.className = 'term-card';
        
        termCard.innerHTML = `
            <div class="term-header">
                <h3>${term.term}</h3>
                <span class="category">${getCategoryName(term.category)}</span>
            </div>
            <div class="term-body">
                <p>${term.definition}</p>
                <div class="example">
                    <strong>مثال:</strong> ${term.example}
                </div>
            </div>
        `;
        
        container.appendChild(termCard);
    });
}

/**
 * دالة مساعدة لتحويل اسم الفئة الإنجليزي إلى الاسم العربي المناسب للعرض.
 * @param {string} category - اسم الفئة باللغة الإنجليزية.
 * @returns {string} - اسم الفئة باللغة العربية.
 */
function getCategoryName(category) {
    const categories = {
        'hacking': 'الاختراق',
        'malware': 'البرمجيات الخبيثة',
        'network': 'أمن الشبكات',
        'encryption': 'التشفير'
    };
    return categories[category] || 'عام'; // إرجاع "عام" إذا لم تكن الفئة معرفة
}

/**
 * إعداد وظائف الفلترة حسب الفئات عند النقر على الأزرار.
 */
function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة فئة 'active' من جميع الأزرار ثم إضافتها للزر الحالي
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category; // الحصول على الفئة من سمة data-category
            
            if (category === 'all') {
                renderTerms(terms); // عرض جميع المصطلحات
                return;
            } else {
                // تصفية المصطلحات بناءً على الفئة المختارة
                const filteredTerms = terms.filter(term => term.category === category);
                renderTerms(filteredTerms);
            }
        });
    });
}

/**
 * إعداد وظائف البحث عن المصطلحات عند إدخال النص.
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase(); // تحويل مدخل البحث إلى حروف صغيرة للمقارنة
        
        if (searchTerm.trim() === '') {
            renderTerms(terms); // عرض جميع المصطلحات إذا كان حقل البحث فارغًا
            return;
        }
        
        // تصفية المصطلحات بناءً على وجود مصطلح البحث في اسم المصطلح أو تعريفه
        const filteredTerms = terms.filter(term => {
            return term.term.toLowerCase().includes(searchTerm) || 
                   term.definition.toLowerCase().includes(searchTerm);
        });
        
        renderTerms(filteredTerms);
    });
}

/**
 * إعداد منطق قسم الاختبار التفاعلي.
 */
function setupQuiz() {
    let currentQuestionIndex = 0; // مؤشر لتتبع السؤال الحالي
    let score = 0; // لتتبع نتيجة المستخدم

    const quizQuestionEl = document.getElementById('quizQuestion');
    const quizOptionsEl = document.getElementById('quizOptions');
    const quizResultEl = document.getElementById('quizResult');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');

    // عرض السؤال الأول عند تهيئة الاختبار
    showQuestion(currentQuestionIndex);
    
    /**
     * دالة لعرض سؤال معين في الاختبار.
     * @param {number} index - فهرس السؤال لعرضه.
     */
    function showQuestion(index) {
        if (index >= quizQuestions.length) {
            // إذا انتهت جميع الأسئلة، عرض رسالة انتهاء الاختبار والنتيجة النهائية
            quizQuestionEl.textContent = "انتهى الاختبار!";
            quizOptionsEl.innerHTML = ""; // مسح خيارات الإجابة
            quizResultEl.textContent = `النتيجة النهائية: ${score} من ${quizQuestions.length}`;
            quizResultEl.className = 'quiz-result result-correct'; // إعادة ضبط الفئة للعرض الصحيح للنتيجة النهائية
            nextQuestionBtn.style.display = 'none'; // إخفاء زر السؤال التالي
            return;
        }
        
        const question = quizQuestions[index];
        quizQuestionEl.textContent = question.question;
        quizOptionsEl.innerHTML = ''; // مسح الخيارات من السؤال السابق
        quizResultEl.textContent = ''; // مسح نتيجة السؤال السابق
        quizResultEl.className = 'quiz-result'; // إعادة ضبط الفئة للتحقق الجديد

        // إنشاء خيارات الإجابة لكل سؤال
        question.options.forEach((option, i) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'quiz-option';
            optionEl.textContent = option;
            
            // إضافة مستمع حدث للنقر على الخيار
            optionEl.addEventListener('click', function() {
                checkAnswer(i); // التحقق من الإجابة عند النقر
            });
            
            quizOptionsEl.appendChild(optionEl);
        });
        nextQuestionBtn.textContent = 'السؤال التالي'; // التأكد من نص الزر
        nextQuestionBtn.style.display = 'block'; // التأكد من أن الزر مرئي
    }
    
    /**
     * دالة للتحقق من إجابة المستخدم.
     * @param {number} selectedIndex - فهرس الخيار الذي اختاره المستخدم.
     */
    function checkAnswer(selectedIndex) {
        const question = quizQuestions[currentQuestionIndex];
        const options = document.querySelectorAll('.quiz-option');
        
        // تعطيل جميع الخيارات بعد الإجابة لمنع التغيير
        options.forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        if (selectedIndex === question.correctAnswer) {
            options[selectedIndex].style.backgroundColor = '#2ecc71'; // لون أخضر للإجابة الصحيحة
            quizResultEl.textContent = 'إجابة صحيحة!';
            quizResultEl.classList.add('result-correct');
            score++; // زيادة النتيجة
        } else {
            options[selectedIndex].style.backgroundColor = '#e74c3c'; // لون أحمر للإجابة الخاطئة
            options[question.correctAnswer].style.backgroundColor = '#2ecc71'; // إظهار الإجابة الصحيحة باللون الأخضر
            quizResultEl.textContent = 'إجابة خاطئة!';
            quizResultEl.classList.add('result-incorrect');
        }
    }
    
    // معالج حدث لزر "السؤال التالي"
    nextQuestionBtn.addEventListener('click', function() {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex); // عرض السؤال التالي
    });
}

/**
 * إعداد وظائف أزرار المشاركة الاجتماعية.
 */
function setupShareButtons() {
    const shareUrl = window.location.href; // الحصول على عنوان URL الحالي للصفحة
    const title = 'قاموس مصطلحات الأمن السيبراني';
    
    document.getElementById('shareWhatsapp').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ': ' + shareUrl)}`, '_blank');
    });
    
    document.getElementById('shareTwitter').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    });
    
    document.getElementById('shareFacebook').addEventListener('click', function(e) {
        e.preventDefault();
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    });
    
    document.getElementById('shareLink').addEventListener('click', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('تم نسخ الرابط إلى الحافظة!');
        }).catch(err => {
            console.error('فشل في نسخ الرابط: ', err);
        });
    });
}
