// docs/assets/js/quizBankLoader.js

document.addEventListener('DOMContentLoaded', () => {
    const quizCardsContainer = document.getElementById('quiz-cards-container');
    const loadingMessage = document.querySelector('.loading-message');

    // تأكد من أن المسار هنا يتطابق مع مكان ملف JSON الخاص بك
    // بما أنك ذكرت أن الملف أصبح في Cybersecurity-Path-/docs/assets/data/digital_skills.json
    // فالمسار النسبي من هذا الملف (quizBankLoader.js) سيكون كالتالي:
    const QUIZZES_DATA_URL = '../assets/data/digital_skills.json'; 

    async function loadQuizzes() {
        if (loadingMessage) {
            loadingMessage.style.display = 'block'; // عرض رسالة التحميل
        }
        
        try {
            const response = await fetch(QUIZZES_DATA_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // تأكد من أن لديك مصفوفة quizzes في بياناتك
            const quizzes = data.quizzes; 

            if (!quizzes || quizzes.length === 0) {
                quizCardsContainer.innerHTML = '<p>لا توجد اختبارات متاحة حالياً.</p>';
                return;
            }

            quizCardsContainer.innerHTML = ''; // مسح رسالة التحميل أو أي محتوى سابق

            quizzes.forEach(quiz => {
                const quizCard = document.createElement('div');
                quizCard.className = 'card education-system'; // استخدم نفس فئات بطاقات المسارات لتصميم متناسق

                quizCard.innerHTML = `
                    <div class="card-icon">
                        <img src="../assets/images/quiz-icon.png" alt="أيقونة اختبار">
                    </div>
                    <h2>${quiz.title}</h2>
                    <p>${quiz.description}</p>
                    <div class="card-links">
                        <a href="digital.html?quizId=${quiz.id}" class="btn primary-btn">ابدأ الاختبار</a>
                    </div>
                `;
                quizCardsContainer.appendChild(quizCard);
            });

        } catch (error) {
            console.error('حدث خطأ أثناء تحميل الاختبارات:', error);
            quizCardsContainer.innerHTML = `<p style="color: red;">عذراً، لم نتمكن من تحميل الاختبارات حالياً. الرجاء المحاولة لاحقاً. <br> (${error.message})</p>`;
        } finally {
            if (loadingMessage) {
                loadingMessage.style.display = 'none'; // إخفاء رسالة التحميل
            }
        }
    }

    loadQuizzes();
});
