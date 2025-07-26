document.addEventListener('DOMContentLoaded', () => {
    const quizContent = document.getElementById('quiz-content');
    const quizHeader = document.getElementById('quiz-header');
    const quizTitleEl = document.getElementById('quiz-title');
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
    const returnToBankBtn = document.getElementById('return-to-bank-btn');
    const quizLoadingMessage = document.getElementById('quiz-loading-message');

    // عناصر العداد الزمني
    const quizTimer = document.getElementById('quiz-timer');
    const timeLeftSpan = document.getElementById('time-left');

    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;

    const QUIZZES_DATA_URL = '../assets/data/digital_skills.json';

    // قراءة متغيرات URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const difficulty = urlParams.get('difficulty');
    const qCount = parseInt(urlParams.get('qCount')) || 5; // عدد الأسئلة الافتراضي 5
    
    // <--- تم إضافة هذا
    quizContent.style.display = 'none';
    quizResultsContainer.style.display = 'none';

    // تحميل بيانات الاختبارات بناءً على ID والمستوى
    async function loadQuiz() {
        // <--- تم إضافة هذا السطر
        quizLoadingMessage.style.display = 'block';

        if (!quizId || !difficulty) {
            quizLoadingMessage.innerHTML = `<p style="color: red;">خطأ: لم يتم تحديد الاختبار أو مستوى الصعوبة.</p>`;
            return;
        }

        try {
            const response = await fetch(QUIZZES_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const currentQuiz = data.quizzes.find(q => q.id === quizId);

            if (!currentQuiz) {
                quizLoadingMessage.innerHTML = `<p style="color: red;">خطأ: الاختبار "${quizId}" غير موجود.</p>`;
                return;
            }

            // التحقق من وجود أسئلة للمستوى المحدد
            const questionsByDifficulty = currentQuiz.questions[difficulty];
            if (!questionsByDifficulty || questionsByDifficulty.length === 0) {
                quizLoadingMessage.innerHTML = `<p style="color: red;">لا توجد أسئلة متاحة في مستوى "${difficulty}" لهذا الاختبار.</p>`;
                return;
            }

            quizTitleEl.innerText = currentQuiz.title;

            // خلط الأسئلة واختيار عدد محدد منها
            const shuffledQuestions = shuffleArray([...questionsByDifficulty]);
            quizQuestions = shuffledQuestions.slice(0, Math.min(qCount, shuffledQuestions.length));

            if (quizQuestions.length > 0) {
                quizLoadingMessage.style.display = 'none';
                quizContent.style.display = 'block';
                startTimer();
                displayQuestion();
            } else {
                showResults();
            }

        } catch (error) {
            console.error('Failed to load quizzes:', error);
            quizLoadingMessage.innerHTML = '<p style="color: red;">حدث خطأ أثناء تحميل الاختبار. الرجاء المحاولة لاحقاً.</p>';
        }
    }

    // عرض السؤال الحالي
    function displayQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const currentQuestion = quizQuestions[currentQuestionIndex];
            questionCounter.innerText = `السؤال ${currentQuestionIndex + 1} من ${quizQuestions.length}`;
            questionTextEl.innerText = currentQuestion.question;
            optionsContainer.innerHTML = '';
            
            const options = shuffleArray([...currentQuestion.options]);
            
            options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.innerHTML = `
                    <input type="radio" name="answer" id="option${index}" value="${index}">
                    <label for="option${index}">${option}</label>
                `;
                optionsContainer.appendChild(optionElement);
            });

            // إضافة مستمعي الأحداث للخيارات الجديدة
            document.querySelectorAll('input[name="answer"]').forEach(input => {
                input.addEventListener('change', (e) => {
                    const selectedValue = parseInt(e.target.value);
                    const isCorrect = selectedValue === currentQuestion.correctAnswerIndex;
                    checkAnswer(isCorrect, selectedValue);
                });
            });

            feedbackMessageEl.style.display = 'none';
            nextBtn.style.display = 'none';
            // إظهار زر "إنهاء" فقط في السؤال الأخير
            if (currentQuestionIndex === quizQuestions.length - 1) {
                finishBtn.style.display = 'block';
            } else {
                finishBtn.style.display = 'none';
            }

        } else {
            showResults();
        }
    }

    // التحقق من الإجابة
    function checkAnswer(isCorrect, selectedValue) {
        if (isCorrect) {
            score++;
            feedbackMessageEl.innerText = 'إجابة صحيحة!';
            feedbackMessageEl.className = 'feedback-message correct';
        } else {
            feedbackMessageEl.innerText = `إجابة خاطئة. الإجابة الصحيحة هي: ${quizQuestions[currentQuestionIndex].options[quizQuestions[currentQuestionIndex].correctAnswerIndex]}`;
            feedbackMessageEl.className = 'feedback-message wrong';
        }
        feedbackMessageEl.style.display = 'block';

        // تعطيل الخيارات بعد الإجابة
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

        // إظهار زر التالي أو الإنهاء
        if (currentQuestionIndex < quizQuestions.length - 1) {
            nextBtn.style.display = 'block';
        } else {
            finishBtn.style.display = 'block';
        }
    }

    // عرض النتائج النهائية
    function showResults() {
        quizContent.style.display = 'none';
        quizResultsContainer.style.display = 'block';
        scoreDisplay.innerText = score;
        totalQuestionsDisplay.innerText = quizQuestions.length;
        const percentage = (score / quizQuestions.length) * 100;
        percentageDisplay.innerText = isNaN(percentage) ? 0 : percentage.toFixed(2);
        
        // إيقاف العداد
        clearInterval(timerInterval);
    }
    
    // بدء العداد الزمني
    function startTimer() {
        const totalTimeInSeconds = quizQuestions.length * 30; // 30 ثانية لكل سؤال
        let timeRemaining = totalTimeInSeconds;

        function updateTimerDisplay() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timeLeftSpan.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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

    // دالة لخلط المصفوفة
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // مستمعو أحداث الأزرار
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        displayQuestion();
    });

    finishBtn.addEventListener('click', showResults);
    returnToBankBtn.addEventListener('click', () => {
        window.location.href = 'quiz-bank.html';
    });

    loadQuiz();
});
