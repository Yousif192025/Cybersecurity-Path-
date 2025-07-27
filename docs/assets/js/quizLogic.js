document.addEventListener('DOMContentLoaded', () => {
    const quizContent = document.getElementById('quiz-content');
    const quizHeader = document.getElementById('quiz-header');
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

    const quizTimer = document.getElementById('quiz-timer');
    const timeLeftSpan = document.getElementById('time-left');

    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;

    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const difficultyParam = urlParams.get('difficulty');
    const qCount = parseInt(urlParams.get('qCount')) || 5;

    // --- بداية التعديل: تحويل اسم مستوى الصعوبة ---
    const difficultyMap = {
        'beginner': 'easy',
        'intermediate': 'medium',
        'advanced': 'advanced'
    };
    const difficulty = difficultyMap[difficultyParam] || difficultyParam; // استخدم القيمة المحولة
    // --- نهاية التعديل ---

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

            // الآن، `difficulty` تحتوي على القيمة الصحيحة (easy, medium, advanced)
            const questionsByDifficulty = currentQuiz.questions[difficulty];
            
            if (!questionsByDifficulty || questionsByDifficulty.length === 0) {
                if (quizLoadingMessage) {
                    // عرض رسالة توضيحية باستخدام القيمة الأصلية من الرابط
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

    function displayQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const currentQuestion = quizQuestions[currentQuestionIndex];
            if (questionCounter) {
                questionCounter.innerText = `السؤال ${currentQuestionIndex + 1} من ${quizQuestions.length}`;
            }
            if (questionTextEl) {
                questionTextEl.innerText = currentQuestion.question;
            }
            if (optionsContainer) {
                optionsContainer.innerHTML = '';
            }
            
            const options = shuffleArray([...currentQuestion.options]);
            
            options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.innerHTML = `
                    <input type="radio" name="answer" id="option${index}" value="${index}">
                    <label for="option${index}">${option}</label>
                `;
                if (optionsContainer) {
                    optionsContainer.appendChild(optionElement);
                }
            });

            document.querySelectorAll('input[name="answer"]').forEach(input => {
                input.addEventListener('change', (e) => {
                    const selectedValue = parseInt(e.target.value);
                    const isCorrect = selectedValue === currentQuestion.correctAnswerIndex;
                    checkAnswer(isCorrect, selectedValue);
                });
            });

            if (feedbackMessageEl) {
                feedbackMessageEl.style.display = 'none';
            }
            if (nextBtn) {
                nextBtn.style.display = 'none';
            }
            if (currentQuestionIndex === quizQuestions.length - 1) {
                if (finishBtn) {
                    finishBtn.style.display = 'block';
                }
            } else {
                if (finishBtn) {
                    finishBtn.style.display = 'none';
                }
            }
        } else {
            showResults();
        }
    }

    function checkAnswer(isCorrect, selectedValue) {
        if (isCorrect) {
            score++;
            if (feedbackMessageEl) {
                feedbackMessageEl.innerText = 'إجابة صحيحة!';
                feedbackMessageEl.className = 'feedback-message correct';
            }
        } else {
            if (feedbackMessageEl) {
                feedbackMessageEl.innerText = `إجابة خاطئة. الإجابة الصحيحة هي: ${quizQuestions[currentQuestionIndex].options[quizQuestions[currentQuestionIndex].correctAnswerIndex]}`;
                feedbackMessageEl.className = 'feedback-message wrong';
            }
        }
        if (feedbackMessageEl) {
            feedbackMessageEl.style.display = 'block';
        }

        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.disabled = true;
            if (parseInt(input.value) === selectedValue) {
                input.parentElement.classList.add('selected-option');
            }
            if (parseInt(input.value) === quizQuestions[currentQuestionIndex].correctAnswerIndex) {
                input.parentElement.classList.add('correct-answer');
            } else if (parseInt(input.value) === selectedValue && !isCorrect) {
                input.parentElement.classList.add('wrong-answer');
            }
        });

        if (currentQuestionIndex < quizQuestions.length - 1) {
            if (nextBtn) {
                nextBtn.style.display = 'block';
            }
        } else {
            if (finishBtn) {
                finishBtn.style.display = 'block';
            }
        }
    }

    function showResults() {
        if (quizContent) {
            quizContent.style.display = 'none';
        }
        if (quizResultsContainer) {
            quizResultsContainer.style.display = 'block';
        }
        if (scoreDisplay) {
            scoreDisplay.innerText = score;
        }
        if (totalQuestionsDisplay) {
            totalQuestionsDisplay.innerText = quizQuestions.length;
        }
        const percentage = (score / quizQuestions.length) * 100;
        if (percentageDisplay) {
            percentageDisplay.innerText = isNaN(percentage) ? 0 : percentage.toFixed(2);
        }
        
        clearInterval(timerInterval);
    }
    
    function startTimer() {
        const totalTimeInSeconds = quizQuestions.length * 30;
        let timeRemaining = totalTimeInSeconds;

        function updateTimerDisplay() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            if (timeLeftSpan) {
                timeLeftSpan.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }
        
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                alert('انتهى الوقت!');
                showResults();
            }
        }, 1000);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
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
