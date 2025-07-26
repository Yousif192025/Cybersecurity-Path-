document.addEventListener('DOMContentLoaded', () => {
    // Corrected to match your HTML structure
    const quizBankContainer = document.getElementById('quiz-cards-container'); 
    const quizLoadingMessage = document.getElementById('quiz-loading-message'); // This might be null, but we'll handle it

    const modal = document.getElementById('quiz-options-modal');
    const closeBtn = modal.querySelector('.close-btn');
    const modalQuizTitle = document.getElementById('modal-quiz-title');
    const difficultyButtons = document.querySelectorAll('.level-btn');
    const qCountInput = document.getElementById('question-count-input');
    const startQuizBtn = document.getElementById('start-custom-quiz-btn');

    let selectedQuizId = null;
    let selectedDifficulty = null;

    const QUIZZES_DATA_URL = '../assets/data/digital_skills.json';

    // Fetch and display quizzes
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
            // Handling for the loading message inside the container
            if (quizBankContainer) {
                quizBankContainer.innerHTML = '<p class="text-danger">حدث خطأ أثناء تحميل الاختبارات. الرجاء المحاولة لاحقاً.</p>';
            }
        }
    }

    function displayQuizzes(quizzes) {
        // Clear the loading message
        if (quizBankContainer) {
            quizBankContainer.innerHTML = '';
            quizBankContainer.classList.add('loaded'); // Show the grid
        }
        
        quizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.className = 'quiz-card';
            quizCard.innerHTML = `
                <h4>${quiz.title}</h4>
                <p>${quiz.description}</p>
                <button class="btn quiz-link start-quiz-btn" data-quiz-id="${quiz.id}">
                    <i class="fas fa-play"></i> ابدأ الاختبار
                </button>
            `;
            if (quizBankContainer) {
                quizBankContainer.appendChild(quizCard);
            }
        });

        // Add event listeners to the new buttons
        document.querySelectorAll('.start-quiz-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                selectedQuizId = e.target.dataset.quizId;
                openModal(e.target.parentElement);
            });
        });
    }

    // Modal logic
    function openModal(quizCard) {
        const quizTitle = quizCard.querySelector('h4').innerText;
        modalQuizTitle.innerText = `إعدادات: ${quizTitle}`;
        modal.style.display = 'flex'; // Use flex for centering
        resetModal();
    }

    function closeModal() {
        modal.style.display = 'none';
        selectedQuizId = null;
    }

    function resetModal() {
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        selectedDifficulty = null;
        startQuizBtn.disabled = true;
        qCountInput.value = 5;
    }

    // Event Listeners for the modal
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDifficulty = btn.dataset.level;
            startQuizBtn.disabled = false;
        });
    });

    startQuizBtn.addEventListener('click', () => {
        if (selectedQuizId && selectedDifficulty) {
            const qCount = qCountInput.value || 5;
            window.location.href = `digital.html?quizId=${selectedQuizId}&difficulty=${selectedDifficulty}&qCount=${qCount}`;
        }
    });

    // Start loading quizzes when the page loads
    loadQuizzes();
});
