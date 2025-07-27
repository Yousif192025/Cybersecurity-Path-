document.addEventListener('DOMContentLoaded', () => {
    const quizContent = document.getElementById('quiz-content');
    const quizTitleEl = document.getElementById('quiz-main-title');
    const questionCounter = document.getElementById('question-counter');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackMessageEl = document.getElementById('feedback-message');
    const nextBtn = document.getElementById('next-btn');
    const finishBtn = document.getElementById('finish-btn');
    const quizResultsContainer = document.getElementById('quiz-results-container');
    const scoreDisplay = document.getElementById('score-display');
    const totalQuestionsDisplay = document.getElementById('total-questions-display');
    const percentageDisplay = document.getElementById('percentage-display');
    const retakeQuizBtn = document.getElementById('retake-quiz-btn');
    const returnToBankBtn = document.getElementById('return-to-bank-btn');
    const quizLoadingMessage = document.getElementById('quiz-loading-message');
    const timeLeftSpan = document.getElementById('time-left');

    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;

    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const difficultyParam = urlParams.get('difficulty');
    const qCount = parseInt(urlParams.get('qCount')) || 5;

    // الخريطة الأساسية التي تترجم أسماء مستويات الصعوبة
    const difficultyMap = {
        'beginner': 'easy',
        'intermediate': 'medium',
        'advanced': 'advanced'
    };
    const difficulty = difficultyMap[difficultyParam] || difficultyParam;

    const QUIZZES_DATA_URL = `../assets/data/${quizId}.json`;

    if (quizContent) {
        quizContent.style.display = 'none';
    }
    if (quizResultsContainer) {
        quizResultsContainer.style.display = 'none';
    }

    async function loadQuiz() {
        if (quizLoadingMessage) {
            quizLoadingMessage.style.display = 'block';
        }

        if (!quizId || !difficultyParam) {
            if (quizLoadingMessage) {
                quizLoadingMessage.innerHTML = `<p style="color: red;">خطأ: لم يتم تحديد الاختبار أو مستوى الصعوبة.</p>`;
            }
            return;
        }

        try {
            const response = await fetch(QUIZZES_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const currentQuiz = data;
            
            const questionsByDifficulty = currentQuiz.questions[difficulty];
            
            if (!questionsByDifficulty || questionsByDifficulty.length === 0) {
                if (quizLoadingMessage) {
                    quizLoadingMessage.innerHTML = `<p style="color: red;">لا توجد أسئلة متاحة في مستوى "${difficultyParam}" لهذا الاختبار.</p>`;
                }
                return;
            }

            if (quizTitleEl) {
                quizTitleEl.innerText = currentQuiz.title;
            }

            const shuffledQuestions = shuffleArray([...questionsByDifficulty]);
            quizQuestions = shuffledQuestions.slice(0, Math.min(qCount, shuffledQuestions.length));

            if (quizQuestions.length > 0) {
                if (quizLoadingMessage) {
                    quizLoadingMessage.style.display = 'none';
                }
                if (quizContent) {
                    quizContent.style.display = 'block';
                }
                startTimer();
                displayQuestion();
            } else {
                showResults();
            }
        } catch (error) {
            console.error('Failed to load quizzes:', error);
            if (quizLoadingMessage) {
                quizLoadingMessage.innerHTML = '<p style="color: red;">حدث خطأ أثناء تحميل الاختبار. الرجاء المحاولة لاحقاً.</p>';
            }
        }
    }

    // ... (بقية دوال الكود كما هي، دون تغيير)
    function displayQuestion() { ... }
    function checkAnswer(isCorrect, selectedValue) { ... }
    function showResults() { ... }
    function startTimer() { ... }
    function shuffleArray(array) { ... }
    // ...

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            displayQuestion();
        });
    }

    if (finishBtn) {
        finishBtn.addEventListener('click', showResults);
    }
    
    if (retakeQuizBtn) {
        retakeQuizBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    if (returnToBankBtn) {
        returnToBankBtn.addEventListener('click', () => {
            window.location.href = 'quiz-bank.html';
        });
    }

    loadQuiz();
});
