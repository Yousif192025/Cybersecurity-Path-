document.addEventListener('DOMContentLoaded', () => {
    const quizCardsContainer = document.getElementById('quiz-cards-container');
    const loadingMessage = document.querySelector('#quiz-selection .loading-message');
    const modal = document.getElementById('quiz-options-modal');
    const closeBtn = modal ? modal.querySelector('.close-btn') : null;
    const modalQuizTitle = modal ? document.getElementById('modal-quiz-title') : null;
    const difficultyButtons = modal ? document.querySelectorAll('.level-btn') : null;
    const qCountInput = modal ? document.getElementById('question-count-input') : null;
    const startQuizBtn = modal ? document.getElementById('start-custom-quiz-btn') : null;

    let selectedQuizId = null;
    let selectedDifficulty = null;

    if (!quizCardsContainer || !loadingMessage) {
        console.error('Quiz cards container or loading message not found.');
        return;
    }

    quizCardsContainer.style.display = 'none';
    loadingMessage.style.display = 'block';

    const QUIZZES_DATA_URL = '../assets/data/quizzes_list.json';

    async function loadQuizzes() {
        try {
            const response = await fetch(QUIZZES_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const quizzes = await response.json();
            loadingMessage.style.display = 'none';
            quizCardsContainer.style.display = 'grid';
            displayQuizzes(quizzes);
        } catch (error) {
            console.error('Failed to load quizzes:', error);
            loadingMessage.innerHTML = `<p style="color: red;">حدث خطأ أثناء تحميل الاختبارات. الرجاء المحاولة لاحقاً.</p>`;
        }
    }

    function displayQuizzes(quizzes) {
        quizCardsContainer.innerHTML = '';
        quizzes.forEach(quiz => {
            const quizCard = createQuizCard(quiz);
            quizCardsContainer.appendChild(quizCard);
        });
    }

    function createQuizCard(quiz) {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <h4>
                <i class="${quiz.icon}" style="margin-left: 10px; color: #3498db;"></i>
                ${quiz.title}
            </h4>
            <p>${quiz.description}</p>
            <div class="quiz-meta">
                <i class="fas fa-tags"></i>
                <span>${quiz.tags.join(', ')}</span>
            </div>
            <a href="#" class="quiz-link open-modal-btn">ابدأ الاختبار<i class="fas fa-arrow-left" style="margin-right: 5px;"></i></a>
        `;
        card.querySelector('.open-modal-btn').addEventListener('click', (e) => {
            e.preventDefault();
            showQuizOptionsModal(quiz);
        });
        return card;
    }

    function showQuizOptionsModal(quiz) {
        selectedQuizId = quiz.id;
        if (modalQuizTitle) {
            modalQuizTitle.innerText = quiz.title;
        }
        modal.style.display = 'flex';
        resetModal();
    }

    function hideQuizOptionsModal() {
        modal.style.display = 'none';
    }

    function resetModal() {
        if (difficultyButtons) {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
        }
        selectedDifficulty = null;
        if (startQuizBtn) {
            startQuizBtn.disabled = true;
        }
        if (qCountInput) {
            qCountInput.value = 5;
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hideQuizOptionsModal);
    }
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideQuizOptionsModal();
        }
    });

    if (difficultyButtons) {
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // التأكد من أن قيمة difficulty هي ما نحتاجه
                selectedDifficulty = btn.dataset.level;
                
                if (startQuizBtn) {
                    startQuizBtn.disabled = false;
                }
            });
        });
    }

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            const qCount = parseInt(qCountInput.value) || 5;
            
            if (selectedQuizId && selectedDifficulty) {
                // الحل الشامل: استخدام مسار مطلق (بناءً على مجلدك الرئيسي)
                // يرجى تعديل هذا المسار ليتناسب مع بنية مجلداتك الفعلية
                window.location.href = `quiz.html?quizId=${selectedQuizId}&difficulty=${selectedDifficulty}&qCount=${qCount}`;
            }
        });
    }

    loadQuizzes();
});
