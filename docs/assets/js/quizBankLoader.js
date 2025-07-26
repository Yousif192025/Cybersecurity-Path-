document.addEventListener('DOMContentLoaded', () => {
    const quizBankContainer = document.getElementById('quiz-bank-container');
    const modal = document.getElementById('quiz-options-modal');
    const modalTitle = document.getElementById('modal-quiz-title');
    const difficultyButtons = document.querySelectorAll('.level-btn');
    const questionCountInput = document.getElementById('question-count-input');
    const startCustomQuizBtn = document.getElementById('start-custom-quiz-btn');
    const closeBtn = document.querySelector('.close-btn');

    let currentQuizId = null;
    let selectedDifficulty = null;
    const QUIZZES_DATA_URL = '../assets/data/digital_skills.json';

    // تحميل بيانات الاختبارات
    async function loadQuizzes() {
        try {
            const response = await fetch(QUIZZES_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            displayQuizzes(data.quizzes);
        } catch (error) {
            console.error('Failed to load quizzes:', error);
            quizBankContainer.innerHTML = '<p style="color: red;">حدث خطأ أثناء تحميل الاختبارات. الرجاء المحاولة لاحقاً.</p>';
        }
    }

    // عرض بطاقات الاختبارات
    function displayQuizzes(quizzes) {
        quizBankContainer.innerHTML = '';
        quizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.className = 'quiz-card';
            quizCard.innerHTML = `
                <div class="card-icon">
                    <i class="fas fa-microchip"></i>
                </div>
                <div class="card-content">
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                </div>
                <button class="btn primary-btn start-quiz-btn" data-quiz-id="${quiz.id}">ابدأ الاختبار</button>
            `;
            quizBankContainer.appendChild(quizCard);
        });

        // إضافة مستمعي الأحداث لأزرار "ابدأ الاختبار"
        document.querySelectorAll('.start-quiz-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                currentQuizId = event.target.dataset.quizId;
                const quizTitle = event.target.parentElement.querySelector('h3').innerText;
                
                modalTitle.innerText = `إعدادات اختبار: ${quizTitle}`;
                modal.classList.add('active');
                
                // إعادة تعيين الاختيارات السابقة
                difficultyButtons.forEach(btn => btn.classList.remove('selected'));
                selectedDifficulty = null;
                startCustomQuizBtn.disabled = true;
            });
        });
    }

    // التحكم في اختيار مستوى الصعوبة
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            difficultyButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedDifficulty = button.dataset.level;
            startCustomQuizBtn.disabled = false;
        });
    });

    // بدء الاختبار المخصص
    startCustomQuizBtn.addEventListener('click', () => {
        if (currentQuizId && selectedDifficulty) {
            const numQuestions = questionCountInput.value;
            window.location.href = `digital.html?quizId=${currentQuizId}&difficulty=${selectedDifficulty}&qCount=${numQuestions}`;
        }
    });

    // إغلاق النافذة المنبثقة
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // إغلاق النافذة عند النقر خارجها
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    loadQuizzes();
});
