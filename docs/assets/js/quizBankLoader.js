document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Element References
    //    Get references to all necessary DOM elements at the beginning for clarity.
    const quizCardsContainer = document.getElementById('quiz-cards-container');
    const loadingMessage = document.querySelector('#quiz-selection .loading-message');
    const modal = document.getElementById('quiz-options-modal');
    const closeBtn = modal ? modal.querySelector('.close-btn') : null; // Check if modal exists before querying children
    const modalQuizTitle = modal ? document.getElementById('modal-quiz-title') : null;
    const difficultyButtons = modal ? document.querySelectorAll('.level-btn') : null;
    const qCountInput = modal ? document.getElementById('question-count-input') : null;
    const startQuizBtn = modal ? document.getElementById('start-custom-quiz-btn') : null;

    // 2. State Variables
    //    Declare variables that will hold state information.
    let selectedQuizId = null;
    let selectedDifficulty = null;

    // 3. Constants
    //    Define any constants, like the data source URL.
    const QUIZZES_DATA_URL = '../assets/data/quizzes_list.json';

    // 4. Initial Setup and Validation
    //    Perform initial checks and UI setup (e.g., hiding/showing elements).
    if (!quizCardsContainer || !loadingMessage) {
        console.error('Quiz cards container or loading message not found. Ensure HTML structure is correct.');
        return; // Stop execution if critical elements are missing
    }

    quizCardsContainer.style.display = 'none'; // Hide the container initially
    loadingMessage.style.display = 'block';   // Show loading message

    // 5. Core Functions (Data Fetching and Display)

    /**
     * Fetches quiz data from the specified URL and initiates display.
     */
    async function loadQuizzes() {
        try {
            const response = await fetch(QUIZZES_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const quizzes = await response.json();

            loadingMessage.style.display = 'none'; // Hide loading message
            quizCardsContainer.style.display = 'grid'; // Show quiz cards container

            displayQuizzes(quizzes);

        } catch (error) {
            console.error('Failed to load quizzes:', error);
            loadingMessage.innerHTML = `<p style="color: red;">حدث خطأ أثناء تحميل الاختبارات. الرجاء المحاولة لاحقاً.</p>`;
            loadingMessage.style.display = 'block'; // Ensure message is visible
        }
    }

    /**
     * Renders the fetched quiz data into interactive cards.
     * @param {Array} quizzes - An array of quiz objects.
     */
    function displayQuizzes(quizzes) {
        quizCardsContainer.innerHTML = ''; // Clear existing content
        if (quizzes.length === 0) {
            quizCardsContainer.innerHTML = `<p class="text-center text-muted" data-text="no-quizzes">لا توجد اختبارات متاحة حالياً.</p>`;
            return;
        }

        quizzes.forEach(quiz => {
            const quizCard = createQuizCard(quiz);
            quizCardsContainer.appendChild(quizCard);
        });
        // Important: Re-apply translations for newly created dynamic content
        if (typeof langManager !== 'undefined' && langManager.applyTranslations) {
            langManager.applyTranslations();
        }
    }

    /**
     * Creates a single quiz card DOM element.
     * @param {Object} quiz - The quiz data object.
     * @returns {HTMLElement} The created quiz card element.
     */
    function createQuizCard(quiz) {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        // Ensure that quiz.icon, quiz.title, quiz.description, quiz.tags exist in your quizzes_list.json
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

        // Attach event listener to the "Start Quiz" button on the card
        card.querySelector('.open-modal-btn').addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) { // Only show modal if it exists in HTML
                 showQuizOptionsModal(quiz);
            } else {
                // Fallback if no modal, direct link to a default quiz page
                window.location.href = `digital.html?quizId=${quiz.id}`;
            }
        });

        return card;
    }

    // 6. Modal Specific Functions

    /**
     * Displays the quiz options modal for a selected quiz.
     * @param {Object} quiz - The quiz object for which options are being set.
     */
    function showQuizOptionsModal(quiz) {
        selectedQuizId = quiz.id;
        if (modalQuizTitle) {
            modalQuizTitle.innerText = quiz.title;
        }
        modal.style.display = 'flex';
        resetModal();
    }

    /**
     * Hides the quiz options modal.
     */
    function hideQuizOptionsModal() {
        modal.style.display = 'none';
    }

    /**
     * Resets the modal's input fields and selected options.
     */
    function resetModal() {
        if (difficultyButtons) {
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
        }
        selectedDifficulty = null;
        if (startQuizBtn) {
            startQuizBtn.disabled = true;
        }
        if (qCountInput) {
            qCountInput.value = 5; // Default question count
        }
    }

    // 7. Event Listeners

    // Modal Close Button
    if (closeBtn) {
        closeBtn.addEventListener('click', hideQuizOptionsModal);
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideQuizOptionsModal();
        }
    });

    // Difficulty selection buttons in the modal
    if (difficultyButtons) {
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyButtons.forEach(b => b.classList.remove('active')); // Deactivate others
                btn.classList.add('active'); // Activate clicked button
                selectedDifficulty = btn.dataset.level;
                if (startQuizBtn) {
                    startQuizBtn.disabled = false; // Enable start button once a difficulty is selected
                }
            });
        });
    }

    // Start Quiz button in the modal
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            const qCount = parseInt(qCountInput.value) || 5; // Get question count, default to 5

            if (selectedQuizId && selectedDifficulty) {
                // Redirect to the quiz page with selected parameters
                window.location.href = `digital.html?quizId=${selectedQuizId}&difficulty=${selectedDifficulty}&qCount=${qCount}`;
            } else {
                // Optional: Provide user feedback if selections are missing
                alert('الرجاء اختيار مستوى الصعوبة لبدء الاختبار.');
            }
        });
    }

    // 8. Initial Data Load
    //    Call the function to load quizzes when the page first loads.
    loadQuizzes();
});
