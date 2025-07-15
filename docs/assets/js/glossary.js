// docs/assets/js/glossary.js

// تتبع الصفحة الحالية (مهم للترقيم)
let currentPage = 1;
// العدد الإجمالي لملفات term-X.html. ✅ يجب تحديث هذا بناءً على عدد ملفاتك الفعلية.
const totalTermFiles = 37; 

// --- الوظيفة الأساسية: loadTerms (تحميل المصطلحات) ---
function loadTerms(pageNumber, searchTerm = '', letterFilter = '') {
    const termsContainer = $('#glossaryTermsContainer');
    termsContainer.empty(); // مسح المصطلحات الحالية قبل تحميل مصطلحات جديدة

    // بناء عنوان URL لملف المصطلحات (مثال: term-1.html، term-2.html)
    // ✅ المسار هنا نسبي لملف glossary/index.html (الذي يستدعي هذا السكريبت)
    const fileUrl = `term-${pageNumber}.html`; 

    $.get(fileUrl)
        .done(function(data) {
            const tempDiv = $('<div>').html(data); // إنشاء div مؤقت لتحليل محتوى HTML
            let terms = tempDiv.find('.ul-cards-glossary li'); // الحصول على جميع عناصر القائمة (البطاقات) من الملف المحمل

            // تطبيق فلتر الحروف إذا تم اختياره
            if (letterFilter && letterFilter !== 'الكل' && letterFilter !== '#') { // '#' للأرقام
                terms = terms.filter(function() {
                    const title = $(this).find('.card-title').text().trim();
                    if (letterFilter === '#') {
                        return !isNaN(parseInt(title.charAt(0))); 
                    } else {
                        return title.startsWith(letterFilter);
                    }
                });
            }

            // تطبيق فلتر البحث إذا تم إدخال مصطلح بحث
            if (searchTerm) {
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                terms = terms.filter(function() {
                    const termText = $(this).text().toLowerCase(); 
                    return termText.includes(lowerCaseSearchTerm);
                });
            }

            // إلحاق المصطلحات المفلترة أو رسالة "لا توجد نتائج"
            if (terms.length > 0) {
                termsContainer.append(terms);
            } else {
                termsContainer.append('<li class="col-md-12"><p class="card-text">لم يتم العثور على مصطلحات مطابقة للمعايير المحددة.</p></li>');
            }

            // تحديث الترقيم وعرض فلتر الحروف
            updatePagination(pageNumber); 
            updateLetterFilterUI(letterFilter); 
            updatePageTitle(searchTerm, letterFilter, terms.length);

        })
        .fail(function() {
            termsContainer.html('<li class="col-md-12"><p class="card-text">حدث خطأ أثناء تحميل المصطلحات. الرجاء المحاولة مرة أخرى لاحقًا.</p></li>');
            updatePagination(pageNumber); 
            updatePageTitle(searchTerm, letterFilter, 0);
        });
}

// --- وظائف الترقيم (Pagination) ---

function generatePaginationLinks() {
    const paginationLinksContainer = $('#paginationLinks');
    paginationLinksContainer.empty(); 

    paginationLinksContainer.append(`
        <li class="prev-page ${currentPage === 1 ? 'disabled' : ''}">
            <a href="#" data-page="${currentPage - 1}" ${currentPage === 1 ? 'onclick="return false;"' : ''}>&laquo; السابق</a>
        </li>
    `);

    for (let i = 1; i <= totalTermFiles; i++) {
        paginationLinksContainer.append(`
            <li class="${i === currentPage ? 'active' : ''}">
                <a href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }

    paginationLinksContainer.append(`
        <li class="next-page ${currentPage === totalTermFiles ? 'disabled' : ''}">
            <a href="#" data-page="${currentPage + 1}" ${currentPage === totalTermFiles ? 'onclick="return false;"' : ''}>التالي &raquo;</a>
        </li>
    `);
}

function updatePagination(activePage) {
    currentPage = activePage; 
    generatePaginationLinks(); 

    $('#paginationLinks').off('click', 'a').on('click', 'a', function(e) {
        e.preventDefault();
        const newPage = parseInt($(this).data('page'));
        if (!isNaN(newPage) && newPage >= 1 && newPage <= totalTermFiles) {
            loadTerms(newPage, $('#searchInput').val(), $('.letters-filter-btn.active').data('letter'));
        }
    });
}

// --- وظائف فلتر الأحرف (قاموس الحروف والأرقام) ---

function generateLetterFilter() {
    const lettersFilterContainer = $('#lettersFilter');
    lettersFilterContainer.empty(); 

    const arabicLetters = ['الكل', 'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', '#']; 

    arabicLetters.forEach(letter => {
        lettersFilterContainer.append(`
            <li><a href="#" class="letters-filter-btn" data-letter="${letter}">${letter}</a></li>
        `);
    });

    lettersFilterContainer.off('click', '.letters-filter-btn').on('click', '.letters-filter-btn', function(e) {
        e.preventDefault();
        const selectedLetter = $(this).data('letter');
        $('#searchInput').val(''); 
        loadTerms(1, '', selectedLetter); 
    });
}

function updateLetterFilterUI(activeLetter) {
    $('.letters-filter-btn').removeClass('active'); 
    $(`.letters-filter-btn[data-letter="${activeLetter}"]`).addClass('active'); 
}

// --- وظيفة البحث ---

function setupSearch() {
    $('#searchBtn').on('click', function() {
        const searchTerm = $('#searchInput').val().trim();
        $('.letters-filter-btn').removeClass('active'); 
        loadTerms(1, searchTerm, ''); 
    });

    $('#searchInput').on('keypress', function(e) {
        if (e.which === 13) { 
            $('#searchBtn').click();
        }
    });
}

// --- وظيفة تحديث عنوان الصفحة ---

function updatePageTitle(searchTerm, letterFilter, termCount) {
    let title = 'التعريفات الأمنية';
    if (searchTerm) {
        title = `نتائج البحث عن: "${searchTerm}" (${termCount} مصطلح)`;
    } else if (letterFilter && letterFilter !== 'الكل') {
        title = `مصطلحات تبدأ بحرف: ${letterFilter} (${termCount} مصطلح)`;
    } else if (letterFilter === 'الكل' || (!searchTerm && !letterFilter)) {
        title = `قاموس مصطلحات الأمن السيبراني (${termCount} مصطلح)`;
    }
    $('.PageTitle').text(title);
}

// --- التحميل الأولي عند جاهزية المستند ---

$(document).ready(function() {
    generateLetterFilter(); 
    loadTerms(currentPage); 
    setupSearch(); 
});

// وظائف تغيير حجم الخط (يمكن نقلها إلى main.js إذا كانت عامة للموقع)
function increaseFontSize(event) {
    event.preventDefault();
    var elements = document.querySelectorAll("*");
    var fontSize;
    for (var i = 0; i < elements.length; i++) {
        fontSize = parseInt(window.getComputedStyle(elements[i]).fontSize);
        if (fontSize < 24) {
            fontSize += 2;
            elements[i].style.fontSize = fontSize + "px";
        }
    }
}

function decreaseFontSize(event) {
    event.preventDefault();
    var elements = document.querySelectorAll("*");
    var fontSize;
    for (var i = 0; i < elements.length; i++) {
        fontSize = parseInt(window.getComputedStyle(elements[i]).fontSize);
        if (fontSize > 8) {
            fontSize -= 2;
            elements[i].style.fontSize = fontSize + "px";
        }
    }
}

// سكريبت الاشتراك في النشرة الإخبارية (يمكن نقله إلى contact.js أو main.js إذا كان عامًا)
// تأكد من أن SubscribeMailAction.php في المسار الصحيح بالنسبة لملف index.html الذي يستدعي هذا الفورم
// إذا كان هذا الفورم في glossary/index.html، فقد تحتاج لتعديل url إلى '../blocks/SubscribeMailAction.php'
$('form.SubScribe').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        url: 'blocks/SubscribeMailAction.php', // ✅ راجع هذا المسار حسب مكان blocks/SubscribeMailAction.php
        method: 'POST',
        data: $(this).serialize(),
        beforeSend: function() {
            // ...
        },
        success: function(response) {
            // ...
        },
        error: function(xhr, textStatus, error) {
            // ...
        },
    });
});
