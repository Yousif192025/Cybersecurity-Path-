// src/scripts/glossary.js

document.addEventListener('DOMContentLoaded', () => {
    const glossaryTermsContainer = document.querySelector('.ul-cards-glossary');
    const alphabetLinksContainer = document.querySelector('.alphabet-links');
    const pageNumbersContainer = document.querySelector('.page-numbers');
    const glossarySearchInput = document.getElementById('glossarySearch');
    const searchBtn = document.getElementById('searchBtn');

    let allTermsData = {}; // لتخزين جميع المصطلحات المحملة
    let currentFilterLetter = 'أ'; // الحرف الافتراضي عند التحميل
    let currentPage = 1; // الصفحة الافتراضية

    const termsPerPage = 8; // عدد المصطلحات التي تريد عرضها في كل صفحة

    // 1. وظيفة رئيسية لجلب وعرض المصطلحات 🔄
    async function loadAndDisplayTerms(letter, page) {
        if (!letter) letter = 'أ'; // افتراضي إذا لم يتم تحديد حرف
        currentFilterLetter = letter;
        currentPage = page;

        try {
            // جلب البيانات من ملف JSON المناسب
            // تأكد من أن Webpack يقوم بنسخ هذه الملفات إلى docs/assets/data/glossary/
            const response = await fetch(`../assets/data/glossary/terms_${letter}.json`);
            if (!response.ok) {
                // إذا لم يتم العثور على ملف لهذا الحرف، حاول جلب "all" أو عرض رسالة
                if (letter !== 'all') {
                    console.warn(`No specific JSON for letter '${letter}', trying 'all'.`);
                    return loadAndDisplayTerms('all', page); // حاول جلب كل المصطلحات
                }
                throw new Error(`HTTP error! status: ${response.status} for ${letter}.json`);
            }
            allTermsData = await response.json();

            // تطبيق البحث قبل ترقيم الصفحات
            const searchTerm = glossarySearchInput.value.trim().toLowerCase();
            const filteredTerms = searchTerm
                ? allTermsData.filter(term =>
                      term.term.toLowerCase().includes(searchTerm) ||
                      term.definition.toLowerCase().includes(searchTerm)
                  )
                : allTermsData;

            // حساب عدد الصفحات وتحديد المصطلحات للصفحة الحالية
            const totalTerms = filteredTerms.length;
            const totalPages = Math.ceil(totalTerms / termsPerPage);
            const startIndex = (currentPage - 1) * termsPerPage;
            const endIndex = startIndex + termsPerPage;
            const termsToShow = filteredTerms.slice(startIndex, endIndex);

            // عرض المصطلحات
            renderTerms(termsToShow);

            // تحديث أزرار ترقيم الصفحات
            renderPagination(totalPages, currentPage);

            // تحديث حالة الحرف النشط
            updateActiveAlphabetLink(letter);

        } catch (error) {
            console.error("خطأ في جلب بيانات القاموس:", error);
            glossaryTermsContainer.innerHTML = '<p class="error-message">عذرًا، لم نتمكن من تحميل المصطلحات. يرجى التأكد من مسارات ملفات JSON.</p>';
            renderPagination(0, 1); // مسح أزرار الصفحات
        }
    }

    // 2. وظيفة عرض المصطلحات في الواجهة (الـ "بطاقات") 🚀
    function renderTerms(terms) {
        glossaryTermsContainer.innerHTML = ''; // مسح المحتوى القديم
        if (terms.length === 0) {
            glossaryTermsContainer.innerHTML = '<p class="no-terms">لا توجد مصطلحات مطابقة لمعايير البحث أو الحرف المحدد.</p>';
            return;
        }
        terms.forEach(term => {
            const listItem = document.createElement('li');
            listItem.className = 'col-md-12'; // أو col-md-6 إذا كانت ستظهر في عمودين
            listItem.innerHTML = `
                <div class="term-card">
                    <div class="term-header">
                        <h3>${term.term}</h3>
                    </div>
                    <div class="term-body">
                        <p>${term.definition}</p>
                        </div>
                </div>
            `;
            glossaryTermsContainer.appendChild(listItem);
        });
    }

    // 3. وظيفة توليد وتحديث أزرار ترقيم الصفحات 🌐
    function renderPagination(totalPages, currentPage) {
        pageNumbersContainer.innerHTML = '';
        if (totalPages <= 1) return; // لا حاجة لترقيم الصفحات إذا كانت صفحة واحدة أو أقل

        let paginationHtml = '';

        // زر "الصفحة الأولى" <<
        paginationHtml += `<li class="shape"><a href="#" data-page="1" class="page-link-item"> &lt;&lt; </a></li>`;
        // زر "الصفحة السابقة" <
        paginationHtml += `<li class="shape"><a href="#" data-page="${Math.max(1, currentPage - 1)}" class="page-link-item"> &lt; </a></li>`;

        // أرقام الصفحات (عرض 5 صفحات حول الصفحة الحالية)
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // تعديل النطاق إذا كنا قريبين من البداية أو النهاية
        if (currentPage <= 3) {
            endPage = Math.min(totalPages, 5);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = (i === currentPage) ? 'active selected' : '';
            paginationHtml += `<li class="shape ${activeClass}"><a href="#" data-page="${i}" class="page-link-item">${i}</a></li>`;
        }

        // زر "الصفحة التالية" >
        paginationHtml += `<li class="shape"><a href="#" data-page="${Math.min(totalPages, currentPage + 1)}" class="page-link-item"> &gt; </a></li>`;
        // زر "آخر صفحة" >>
        paginationHtml += `<li class="shape"><a href="#" data-page="${totalPages}" class="page-link-item"> &gt;&gt; </a></li>`;

        pageNumbersContainer.innerHTML = paginationHtml;

        // ربط الـ event listeners لأزرار ترقيم الصفحات الجديدة
        pageNumbersContainer.querySelectorAll('.page-link-item').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const page = parseInt(event.target.dataset.page);
                if (page && page !== currentPage) {
                    loadAndDisplayTerms(currentFilterLetter, page);
                }
            });
        });
    }

    // 4. وظيفة تحديث الحرف النشط في قائمة الأبجدية 🅰️
    function updateActiveAlphabetLink(letter) {
        alphabetLinksContainer.querySelectorAll('.link').forEach(link => {
            link.classList.remove('active', 'selected');
            if (link.dataset.artid && link.dataset.artid.toLowerCase() === letter.toLowerCase()) {
                link.classList.add('active', 'selected');
            }
        });
    }

    // 5. الاستماع لأحداث النقر على روابط الأحرف الأبجدية 👂
    alphabetLinksContainer.querySelectorAll('.link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const letter = event.target.dataset.artid;
            if (letter) {
                glossarySearchInput.value = ''; // مسح البحث عند تغيير الحرف
                loadAndDisplayTerms(letter, 1); // دائمًا نبدأ من الصفحة 1 عند تغيير الحرف
            }
        });
    });

    // 6. الاستماع لأحداث البحث 🔍
    searchBtn.addEventListener('click', () => {
        loadAndDisplayTerms(currentFilterLetter, 1); // البحث في الحرف الحالي والبدء من الصفحة 1
    });

    glossarySearchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchBtn.click(); // تفعيل البحث عند الضغط على Enter
        }
    });

    // تحميل المصطلحات الافتراضية عند تحميل الصفحة لأول مرة (مثلاً، حرف "أ" أو "كل المصطلحات")
    loadAndDisplayTerms(currentFilterLetter, currentPage);
});
