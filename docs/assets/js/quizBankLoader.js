document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Element References
    const quizCardsContainer = document.getElementById('quiz-cards-container');
    const loadingMessage = document.querySelector('#quiz-selection .loading-message');
    const modal = document.getElementById('quiz-options-modal');
    const closeBtn = modal ? modal.querySelector('.close-btn') : null;
    const modalQuizTitle = modal ? document.getElementById('modal-quiz-title') : null;
    const difficultyButtons = modal ? document.querySelectorAll('.level-btn') : null;
    const qCountInput = modal ? document.getElementById('question-count-input') : null;
    const startQuizBtn = modal ? document.getElementById('start-custom-quiz-btn') : null;

    // 2. State Variables
    let selectedQuizId = null;
    let selectedDifficulty = null;

    // 3. Constants
    const QUIZZES_DATA_URL = '../assets/data/quizzes_list.json';

    // 4. Initial Setup and Validation
    if (!quizCardsContainer || !loadingMessage) {
        console.error('Quiz cards container or loading message not found. Ensure HTML structure is correct.');
        return;
    }

    quizCardsContainer.style.display = 'none';
    loadingMessage.style.display = 'block';

    // 5. Core Functions (Data Fetching and Display)
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
            loadingMessage.style.display = 'block';
        }
    }

    function displayQuizzes(quizzes) {
        quizCardsContainer.innerHTML = '';
        if (quizzes.length === 0) {
            quizCardsContainer.innerHTML = `<p class="text-center text-muted" data-text="no-quizzes">لا توجد اختبارات متاحة حالياً.</p>`;
            return;
        }
        quizzes.forEach(quiz => {
            const quizCard = createQuizCard(quiz);
            quizCardsContainer.appendChild(quizCard);
        });
        if (typeof langManager !== 'undefined' && langManager.applyTranslations) {
            langManager.applyTranslations();
        }
    }

    function createQuizCard(quiz) {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.innerHTML = `
            <h4>
                <i class="${quiz.icon}" style="margin-left: 10px; color: var(--primary-blue);"></i>
                ${quiz.title}
            </h4>
            <p>${quiz.description}</p>
            <div class="quiz-meta">
                <i class="fas fa-tags"></i>
                <span>${quiz.tags ? quiz.tags.join(', ') : ''}</span>
            </div>
            <a href="#" class="quiz-link open-modal-btn" data-text="start-quiz">
                <span data-text="start-quiz">ابدأ الاختبار</span> <i class="fas fa-arrow-left" style="margin-right: 5px;"></i>
            </a>
        `;
        card.querySelector('.open-modal-btn').addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) {
                showQuizOptionsModal(quiz);
            } else {
                // Fallback direct link
                window.location.href = `./quiz.html?quizId=${quiz.id}`;
            }
        });
        return card;
    }

    // 6. Modal Specific Functions
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

    // 7. Event Listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', hideQuizOptionsModal);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideQuizOptionsModal();
        }
    });
    
    // --- هنا هو التعديل الأساسي لحل مشكلة التسمية ---
    if (difficultyButtons) {
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // خريطة لترجمة مستوى الصعوبة من الأزرار إلى أسماء مفاتيح JSON
                const difficultyMap = {
                    'beginner': 'easy',
                    'intermediate': 'medium',
                    'advanced': 'advanced'
                };
                
                const buttonLevel = btn.dataset.level;
                selectedDifficulty = difficultyMap[buttonLevel];
                
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
                // --- هنا هو التعديل للتوجيه إلى quiz.html ---
                window.location.href = `./quiz.html?quizId=${selectedQuizId}&difficulty=${selectedDifficulty}&qCount=${qCount}`;
            } else {
                alert('الرجاء اختيار مستوى الصعوبة لبدء الاختبار.');
            }
        });
    }

    // 8. Initial Data Load
    loadQuizzes();
});
