// docs/assets/js/quizLogic.js

document.addEventListener('DOMContentLoaded', async () => {
    const quizPageTitle = document.getElementById('quiz-page-title');
    const quizMainTitle = document.getElementById('quiz-main-title');
    const quizDescription = document.getElementById('quiz-description');
    const quizLoadingMessage = document.getElementById('quiz-loading-message');
    const quizContent = document.getElementById('quiz-content');
    const questionCounter = document.getElementById('question-counter');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackArea = document.getElementById('feedback-area');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const quizResults = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score-display');
    const totalQuestionsDisplay = document.getElementById('total-questions-display');
    const percentageDisplay = document.getElementById('percentage-display');
    const resultMessage = document.getElementById('result-message');
    const retakeQuizBtn = document.getElementById('retake-quiz-btn');

    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let score = 0;
    let quizQuestions = []; // لتخزين الأسئلة بعد جلبها وربما خلطها

    // قم بتعديل هذا المسار إذا قمت بتغيير مكان ملف JSON
    const QUIZZES_DATA_URL = '../assets/data/digital_skills.json';

    // وظيفة للحصول على معرّف الاختبار من عنوان URL
    function getQuizIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('quizId');
    }

    // وظيفة لخلط مصفوفة (Fisher-Yates shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async function loadQuiz() {
        quizLoadingMessage.style.display = 'block';
        quizContent.style.display = 'none';
        quizResults.style.display = 'none';

        const quizId = getQuizIdFromUrl();
        if (!quizId) {
            quizLoadingMessage.innerHTML = '<p style="color: red;">خطأ: لم يتم تحديد معرّف الاختبار.</p>';
            return;
        }

        try {
            const response = await fetch(QUIZZES_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // البحث عن الاختبار المحدد بالـ ID
            currentQuiz = data.quizzes.find(q => q.id === quizId);

            if (!currentQuiz) {
                quizLoadingMessage.innerHTML = `<p style="color: red;">خطأ: الاختبار "${quizId}" غير موجود.</p>`;
                return;
            }

            quizPageTitle.textContent = currentQuiz.title;
            quizMainTitle.textContent = currentQuiz.title;
            quizDescription.textContent = currentQuiz.description;

            quizQuestions = [...currentQuiz.questions]; // نسخ الأسئلة
            shuffleArray(quizQuestions); // خلط الأسئلة

            currentQuestionIndex = 0;
            score = 0;

            quizLoadingMessage.style.display = 'none';
            quizContent.style.display = 'block';

            displayQuestion();

        } catch (error) {
            console.error('حدث خطأ أثناء تحميل الاختبار:', error);
            quizLoadingMessage.innerHTML = `<p style="color: red;">عذراً، لم نتمكن من تحميل الاختبار حالياً. الرجاء المحاولة لاحقاً. <br> (${error.message})</p>`;
        }
    }

    function displayQuestion() {
        feedbackArea.style.display = 'none';
        feedbackArea.textContent = '';
        optionsContainer.innerHTML = ''; // مسح الخيارات السابقة

        if (currentQuestionIndex < quizQuestions.length) {
            const questionData = quizQuestions[currentQuestionIndex];
            questionCounter.textContent = `السؤال ${currentQuestionIndex + 1} من ${quizQuestions.length}`;
            questionText.textContent = questionData.question;

            questionData.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.innerHTML = `
                    <input type="radio" id="option${index}" name="quiz-option" value="${index}">
                    <label for="option${index}">${option}</label>
                `;
                optionsContainer.appendChild(optionDiv);

                // إضافة مستمع لحدث النقر لتغيير خلفية الخيار المحدد
                optionDiv.querySelector('input').addEventListener('change', () => {
                    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected-option'));
                    optionDiv.classList.add('selected-option');
                });
            });

            // إظهار زر "إنهاء الاختبار" إذا كان هذا هو السؤال الأخير
            if (currentQuestionIndex === quizQuestions.length - 1) {
                nextQuestionBtn.style.display = 'none';
                submitQuizBtn.style.display = 'block';
            } else {
                nextQuestionBtn.style.display = 'block';
                submitQuizBtn.style.display = 'none';
            }

            // تعطيل زر "التالي" حتى يتم اختيار إجابة
            nextQuestionBtn.disabled = true;
            submitQuizBtn.disabled = true;
            optionsContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', () => {
                    nextQuestionBtn.disabled = false;
                    submitQuizBtn.disabled = false;
                });
            });

        } else {
            // هذا الجزء لا ينبغي أن يتم الوصول إليه إذا كان المنطق صحيحاً
            // ولكن كإجراء احترازي، يمكننا هنا استدعاء showResults()
            showResults();
        }
    }

    function checkAnswer() {
        const selectedOption = optionsContainer.querySelector('input[name="quiz-option"]:checked');
        if (!selectedOption) {
            feedbackArea.style.display = 'block';
            feedbackArea.textContent = 'الرجاء اختيار إجابة.';
            feedbackArea.style.backgroundColor = '#f8d7da'; // لون أحمر فاتح للخلفية
            feedbackArea.style.color = '#721c24'; // لون أحمر داكن للنص
            return false; // لم يتم اختيار إجابة
        }

        const selectedAnswerIndex = parseInt(selectedOption.value);
        const questionData = quizQuestions[currentQuestionIndex];

        // عرض الإجابة الصحيحة أو الخاطئة بصرياً
        optionsContainer.querySelectorAll('.option').forEach((optionDiv, index) => {
            optionDiv.classList.remove('selected-option'); // إزالة التحديد السابق
            if (index === questionData.correctAnswerIndex) {
                optionDiv.classList.add('correct-answer');
            } else if (index === selectedAnswerIndex) {
                optionDiv.classList.add('wrong-answer');
            }
            // تعطيل جميع الخيارات بعد الإجابة
            optionDiv.querySelector('input').disabled = true;
        });

        if (selectedAnswerIndex === questionData.correctAnswerIndex) {
            score++;
            feedbackArea.textContent = 'إجابة صحيحة! 🎉';
            feedbackArea.style.backgroundColor = '#d4edda'; // لون أخضر فاتح للخلفية
            feedbackArea.style.color = '#155724'; // لون أخضر داكن للنص
        } else {
            feedbackArea.textContent = `إجابة خاطئة. الإجابة الصحيحة كانت: ${questionData.options[questionData.correctAnswerIndex]}.`;
            feedbackArea.style.backgroundColor = '#f8d7da'; // لون أحمر فاتح للخلفية
            feedbackArea.style.color = '#721c24'; // لون أحمر داكن للنص
        }
        feedbackArea.style.display = 'block';

        nextQuestionBtn.disabled = false; // تفعيل الزر بعد الإجابة
        submitQuizBtn.disabled = false; // تفعيل زر إنهاء الاختبار
        return true; // تم التحقق من الإجابة
    }

    function showResults() {
        quizContent.style.display = 'none';
        quizResults.style.display = 'block';

        scoreDisplay.textContent = score;
        totalQuestionsDisplay.textContent = quizQuestions.length;
        const percentage = (score / quizQuestions.length) * 100;
        percentageDisplay.textContent = `نسبة النجاح: ${percentage.toFixed(2)}%`;

        if (percentage >= 70) {
            resultMessage.textContent = 'تهانينا! لقد حققت درجة ممتازة. 🎉';
            resultMessage.style.color = '#27ae60'; // أخضر
        } else if (percentage >= 50) {
            resultMessage.textContent = 'أداء جيد! يمكنك مراجعة بعض النقاط لتحسين درجتك.';
            resultMessage.style.color = '#f39c12'; // برتقالي
        } else {
            resultMessage.textContent = 'تحتاج إلى بعض المراجعة. لا تيأس، استمر في التعلم والمحاولة!';
            resultMessage.style.color = '#e74c3c'; // أحمر
        }
    }

    // معالجات الأحداث للأزرار
    nextQuestionBtn.addEventListener('click', () => {
        if (checkAnswer()) { // تحقق من الإجابة قبل الانتقال
            currentQuestionIndex++;
            displayQuestion();
        }
    });

    submitQuizBtn.addEventListener('click', () => {
        if (checkAnswer()) { // تحقق من الإجابة الأخيرة قبل عرض النتائج
            showResults();
        }
    });

    retakeQuizBtn.addEventListener('click', () => {
        loadQuiz(); // إعادة تحميل الاختبار لبدء من جديد
    });

    // بدء تحميل الاختبار عند تحميل الصفحة
    loadQuiz();
});
