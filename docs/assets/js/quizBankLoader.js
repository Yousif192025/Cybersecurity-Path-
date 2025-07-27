document.addEventListener('DOMContentLoaded', () => {
    // Corrected to match your HTML structure
    const quizCardsContainer = document.getElementById('quiz-cards-container');
    const loadingMessage = document.querySelector('#quiz-selection .loading-message');

    const modal = document.getElementById('quiz-options-modal');
    const closeBtn = modal.querySelector('.close-btn');
    const modalQuizTitle = document.getElementById('modal-quiz-title');
    const difficultyButtons = document.querySelectorAll('.level-btn');
    const qCountInput = document.getElementById('question-count-input');
    const startQuizBtn = document.getElementById('start-custom-quiz-btn');

    let selectedQuizId = null;
    let selectedDifficulty = null;

    // Check if the required elements exist
    if (!quizCardsContainer || !loadingMessage) {
        console.error('Quiz cards container or loading message not found.');
        return;
    }
    
    // Hide the container initially and show loading message
    quizCardsContainer.style.display = 'none';
    loadingMessage.style.display = 'block';

    // Update the data source URL to the new central list
    const QUIZZES_DATA_URL = '../assets/data/quizzes_list.json';

    // Fetch and display quizzes
    async function loadQuizzes() {
        try {
            const response = await fetch(QUIZZES_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const quizzes = await response.json();
            
            // Hide loading message and show container
            loadingMessage.style.display = 'none';
            quizCardsContainer.style.display = 'grid';

            displayQuizzes(quizzes);

        } catch (error) {
            console.error('Failed to load quizzes:', error);
            loadingMessage.innerHTML = `<p style="color: red;">حدث خطأ أثناء تحميل الاختبارات. الرجاء المحاولة لاحقاً.</p>`;
        }
    }

    function displayQuizzes(quizzes) {
        // Clear any previous content and add the cards
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
        modalQuizTitle.innerText = quiz.title;
        modal.style.display = 'flex';
        resetModal();
    }

    function hideQuizOptionsModal() {
        modal.style.display = 'none';
    }

    function resetModal() {
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        selectedDifficulty = null;
        startQuizBtn.disabled = true;
        qCountInput.value = 5;
    }

    // Modal event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', hideQuizOptionsModal);
    }
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideQuizOptionsModal();
        }
    });

    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const difficultyMap = {
                'beginner': 'easy',
                'intermediate': 'medium',
                'advanced': 'advanced'
            };
            
            const buttonLevel = btn.dataset.level;
            selectedDifficulty = difficultyMap[buttonLevel];
            
            startQuizBtn.disabled = false;
        });
    });

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            const qCount = parseInt(qCountInput.value) || 5;
            
            if (selectedQuizId && selectedDifficulty) {
                // *** هذا هو السطر الذي تم تصحيحه: إضافة ./ قبل اسم الملف ***
                window.location.href = `./quiz.html?quizId=${selectedQuizId}&difficulty=${selectedDifficulty}&qCount=${qCount}`;
            }
        });
    }

    // Call the function to load quizzes when the page loads
    loadQuizzes();
});
