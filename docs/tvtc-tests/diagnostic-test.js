// ==========================================
// APPLICATION STATE
// ==========================================
const state = {
    studentName: '',
    studentId: '',
    questions: [],
    answers: [],
    currentIndex: 0,
    examStarted: false,
    examEnded: false,
    timeRemaining: 7200,
    timerInterval: null,
    history: JSON.parse(localStorage.getItem('diagnosticHistory')) || [],
    startTime: null,
    score: 0,
    domainScores: {},
    domainCorrect: {},
    domainTotal: {},
    learningMode: false,
    results: null
};

// ==========================================
// DOM REFS
// ==========================================
function $(id) { return document.getElementById(id); }

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function shuffleOptions(question) {
    const opts = question.options.map((o, i) => ({ text: o, index: i }));
    const shuffled = shuffleArray(opts);
    return {
        options: shuffled.map(o => o.text),
        correctAnswer: shuffled.findIndex(o => o.index === question.correctAnswer)
    };
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts = [];
    if (h > 0) parts.push(h + ' ساعة');
    if (m > 0) parts.push(m + ' دقيقة');
    if (s > 0 || parts.length === 0) parts.push(s + ' ثانية');
    return parts.join(' ');
}

// ==========================================
// START EXAM
// ==========================================
function startExam() {
    console.log('🚀 startExam() called');
    
    const nameInput = $('studentName');
    const idInput = $('studentId');
    
    const name = nameInput ? nameInput.value.trim() || 'طالب غير مسجل' : 'طالب غير مسجل';
    const id = idInput ? idInput.value.trim() || 'غير محدد' : 'غير محدد';

    state.studentName = name;
    state.studentId = id;
    state.startTime = Date.now();

    // Prepare questions
    const shuffledQuestions = shuffleArray(DIAGNOSTIC_QUESTIONS);
    state.questions = shuffledQuestions.map(q => {
        const { options, correctAnswer } = shuffleOptions(q);
        return {
            ...q,
            options,
            correctAnswer,
            userAnswer: null,
            answered: false
        };
    });

    state.answers = new Array(state.questions.length).fill(null);
    state.currentIndex = 0;
    state.examStarted = true;
    state.examEnded = false;
    state.timeRemaining = 7200;

    // Show exam area
    const welcomeScreen = $('welcomeScreen');
    const examArea = $('examArea');
    const resultsScreen = $('resultsScreen');
    const headerStats = $('headerStats');

    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (examArea) examArea.style.display = 'block';
    if (resultsScreen) resultsScreen.style.display = 'none';
    if (headerStats) headerStats.style.display = 'flex';

    // Set student name in exam
    const examName = $('examStudentName');
    if (examName) examName.textContent = name;

    const totalQ = $('examTotalQ');
    const qTotal = $('qTotal');
    if (totalQ) totalQ.textContent = state.questions.length;
    if (qTotal) qTotal.textContent = state.questions.length;

    // Start timer
    startTimer();

    // Render first question
    renderQuestion();

    // Save state
    saveState();

    console.log('✅ Exam started with', state.questions.length, 'questions');
}

// ==========================================
// TIMER
// ==========================================
function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);

    state.timerInterval = setInterval(() => {
        state.timeRemaining--;

        const timerEl = $('examTimer');
        if (timerEl) {
            const hours = Math.floor(state.timeRemaining / 3600);
            const minutes = Math.floor((state.timeRemaining % 3600) / 60);
            const seconds = state.timeRemaining % 60;
            timerEl.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timerEl.classList.toggle('warning', state.timeRemaining < 300);
        }

        if (state.timeRemaining <= 0) {
            clearInterval(state.timerInterval);
            submitExam();
        }

        saveState();
    }, 1000);
}

// ==========================================
// RENDER QUESTION
// ==========================================
function renderQuestion() {
    if (!state.questions.length || state.currentIndex >= state.questions.length) return;

    const q = state.questions[state.currentIndex];
    const idx = state.currentIndex;

    // Update question number
    const qNumber = $('qNumber');
    const examCurrentQ = $('examCurrentQ');
    if (qNumber) qNumber.textContent = idx + 1;
    if (examCurrentQ) examCurrentQ.textContent = idx + 1;

    // Update domain
    const qDomain = $('qDomain');
    if (qDomain) qDomain.textContent = q.domainName;

    // Update difficulty
    const qDifficulty = $('qDifficulty');
    if (qDifficulty) {
        const diffMap = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };
        qDifficulty.textContent = diffMap[q.difficulty] || q.difficulty;
        qDifficulty.className = `difficulty ${q.difficulty}`;
    }

    // Update question text
    const qText = $('qText');
    if (qText) qText.textContent = q.question;

    // Render options
    const optionsContainer = $('qOptions');
    if (optionsContainer) {
        const letters = ['أ', 'ب', 'ج', 'د'];
        optionsContainer.innerHTML = q.options.map((opt, i) => {
            const checked = state.answers[idx] === i ? 'checked' : '';
            return `
                <div class="option ${checked ? 'selected' : ''}" data-value="${i}" onclick="selectAnswer(${i})">
                    <input type="radio" name="answer" value="${i}" ${checked}>
                    <label>${letters[i]}. ${opt}</label>
                </div>
            `;
        }).join('');
    }

    // Hide explanation
    const expBox = $('qExplanation');
    if (expBox) expBox.classList.remove('show');

    // If in learning mode and answer exists, show correction
    if (state.learningMode && state.answers[idx] !== null) {
        showCorrection(idx);
    }

    // Update progress
    updateProgress();

    // Update navigator
    renderNavigator();

    // Update navigation buttons
    updateNavButtons();

    // Update header stats
    updateHeaderStats();
}

// ==========================================
// SELECT ANSWER
// ==========================================
function selectAnswer(value) {
    if (state.examEnded) return;

    const idx = state.currentIndex;
    state.answers[idx] = value;
    state.questions[idx].userAnswer = value;
    state.questions[idx].answered = true;

    // Update option styles
    document.querySelectorAll('.option').forEach((opt, i) => {
        opt.classList.toggle('selected', i === value);
    });

    // Update radio
    const radio = document.querySelector(`input[name="answer"][value="${value}"]`);
    if (radio) radio.checked = true;

    // If learning mode, show correction
    if (state.learningMode) {
        showCorrection(idx);
    }

    // Update progress
    updateProgress();
    renderNavigator();
    updateHeaderStats();

    saveState();
}

// ==========================================
// SHOW CORRECTION (Learning Mode)
// ==========================================
function showCorrection(index) {
    const q = state.questions[index];
    const userAns = state.answers[index];
    if (userAns === null) return;

    const isCorrect = userAns === q.correctAnswer;
    const expBox = $('qExplanation');

    // Highlight options
    document.querySelectorAll('.option').forEach((opt, i) => {
        opt.classList.remove('correct-highlight', 'wrong-highlight');
        if (i === q.correctAnswer) {
            opt.classList.add('correct-highlight');
        }
        if (!isCorrect && i === userAns) {
            opt.classList.add('wrong-highlight');
        }
    });

    // Show explanation
    const expText = $('qExplanationText');
    const expSkill = $('qExplanationSkill');
    if (expText) {
        expText.innerHTML = `
            <span style="color:${isCorrect ? '#00b894' : '#e17055'};font-weight:700;display:block;margin-bottom:8px;">
                ${isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة'}
            </span>
            ${q.explanation}
        `;
    }
    if (expSkill) {
        expSkill.textContent = `📌 المهارة: ${q.skill} | المقرر: ${q.courseCode}`;
    }
    if (expBox) expBox.classList.add('show');

    // Disable options in learning mode
    document.querySelectorAll('.option input[type="radio"]').forEach(el => el.disabled = true);
    document.querySelectorAll('.option').forEach(el => el.style.cursor = 'default');
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================
function nextQuestion() {
    if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        renderQuestion();
        saveState();
    }
}

function prevQuestion() {
    if (state.currentIndex > 0) {
        state.currentIndex--;
        renderQuestion();
        saveState();
    }
}

function firstQuestion() {
    state.currentIndex = 0;
    renderQuestion();
    saveState();
}

function lastQuestion() {
    state.currentIndex = state.questions.length - 1;
    renderQuestion();
    saveState();
}

function goToQuestion(index) {
    if (index >= 0 && index < state.questions.length) {
        state.currentIndex = index;
        renderQuestion();
        saveState();
    }
}

// ==========================================
// UPDATE FUNCTIONS
// ==========================================
function updateProgress() {
    const total = state.questions.length;
    const answered = state.answers.filter(a => a !== null).length;
    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

    const fill = $('progressFill');
    const label = $('progressLabel');
    const remaining = $('progressRemaining');

    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = pct + '% مكتمل';
    if (remaining) remaining.textContent = (total - answered) + ' سؤال متبقي';
}

function updateHeaderStats() {
    const answered = state.answers.filter(a => a !== null).length;
    const total = state.questions.length;
    
    const headerAnswered = $('headerAnswered');
    const headerTotal = $('headerTotal');
    
    if (headerAnswered) headerAnswered.textContent = answered;
    if (headerTotal) headerTotal.textContent = total;

    const examAnswered = $('examAnsweredCount');
    if (examAnswered) examAnswered.textContent = answered;

    if (state.examEnded && state.results) {
        const headerScore = $('headerScore');
        if (headerScore) headerScore.textContent = Math.round(state.results.overallScore) + '%';
    }
}

function updateNavButtons() {
    const isLast = state.currentIndex === state.questions.length - 1;
    const nextBtn = $('nextBtn');
    const submitBtn = $('submitBtn');

    if (nextBtn) nextBtn.style.display = isLast ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = isLast ? 'inline-flex' : 'none';
}

function renderNavigator() {
    const container = $('questionNavigator');
    if (!container) return;

    const total = state.questions.length;
    let html = '';
    for (let i = 0; i < total; i++) {
        const isAnswered = state.answers[i] !== null;
        const isCurrent = i === state.currentIndex;
        let cls = 'nav-dot';
        if (isCurrent) cls += ' current';
        if (isAnswered) cls += ' answered';
        html += `
            <button class="${cls}" onclick="goToQuestion(${i})">
                ${i + 1}
            </button>
        `;
    }
    container.innerHTML = html;
}

// ==========================================
// SUBMIT EXAM
// ==========================================
function submitExam() {
    if (state.examEnded) return;

    const unanswered = state.answers.filter(a => a === null).length;

    if (unanswered > 0) {
        if (!confirm(`⚠️ هناك ${unanswered} سؤالاً لم يتم الإجابة عليها. هل أنت متأكد من إنهاء الاختبار؟`)) {
            return;
        }
    }

    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }

    state.examEnded = true;

    const results = calculateResults();
    state.results = results;

    saveHistory(results);
    displayResults(results);

    const headerScore = $('headerScore');
    if (headerScore) headerScore.textContent = Math.round(results.overallScore) + '%';

    saveState();
}

// ==========================================
// CALCULATE RESULTS
// ==========================================
function calculateResults() {
    const total = state.questions.length;
    let correct = 0;
    const domainData = {};

    const allDomains = [...new Set(state.questions.map(q => q.domain))];
    allDomains.forEach(d => {
        domainData[d] = { correct: 0, total: 0, name: state.questions.find(q => q.domain === d).domainName };
    });

    state.questions.forEach((q, i) => {
        const userAns = state.answers[i];
        const isCorrect = userAns === q.correctAnswer;

        if (isCorrect) correct++;

        if (domainData[q.domain]) {
            domainData[q.domain].total++;
            if (isCorrect) domainData[q.domain].correct++;
        }
    });

    const domainScores = {};
    allDomains.forEach(d => {
        const data = domainData[d];
        domainScores[d] = data.total > 0 ? (data.correct / data.total) * 100 : 0;
    });

    const overallScore = (correct / total) * 100;

    let level, levelLabel;
    if (overallScore >= 90) {
        level = 'excellent';
        levelLabel = 'ممتاز - جاهزية عالية جداً';
    } else if (overallScore >= 80) {
        level = 'very-good';
        levelLabel = 'جيد جداً - جاهزية عالية';
    } else if (overallScore >= 70) {
        level = 'good';
        levelLabel = 'جيد - يحتاج إلى مراجعة محددة';
    } else if (overallScore >= 60) {
        level = 'fair';
        levelLabel = 'مقبول - يحتاج إلى خطة مراجعة';
    } else {
        level = 'needs-work';
        levelLabel = 'يحتاج إلى تأهيل مكثف';
    }

    // Readiness
    let readinessScore = 0;
    const domainValues = Object.values(domainScores);
    const avgDomain = domainValues.reduce((a, b) => a + b, 0) / domainValues.length;
    readinessScore += (overallScore / 100) * 0.5;
    readinessScore += (avgDomain / 100) * 0.3;

    const weakDomains = Object.entries(domainScores).filter(([_, score]) => score < 60);
    const weakPenalty = (weakDomains.length / Object.keys(domainScores).length) * 0.2;
    readinessScore = Math.max(0, Math.min(100, (readinessScore - weakPenalty) * 100));

    let readinessLevel, readinessLabel;
    if (readinessScore >= 80) {
        readinessLevel = 'ready';
        readinessLabel = '🟢 جاهز بدرجة جيدة';
    } else if (readinessScore >= 60) {
        readinessLevel = 'needs-review';
        readinessLabel = '🟡 يحتاج إلى مراجعة';
    } else if (readinessScore >= 40) {
        readinessLevel = 'needs-training';
        readinessLabel = '🟠 يحتاج إلى تدريب إضافي';
    } else {
        readinessLevel = 'not-ready';
        readinessLabel = '🔴 غير مستعد بعد';
    }

    const sortedDomains = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);
    const strengths = sortedDomains.filter(([_, score]) => score >= 70);
    const weaknesses = sortedDomains.filter(([_, score]) => score < 60);

    const recommendations = generateRecommendations(domainScores, weaknesses);
    const studyPlan = generateStudyPlan(domainScores, weaknesses);

    const elapsed = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;

    return {
        overallScore,
        correct,
        total,
        incorrect: total - correct - (state.answers.filter(a => a === null).length),
        unanswered: state.answers.filter(a => a === null).length,
        domainScores,
        domainData,
        level,
        levelLabel,
        readinessPct: Math.round(readinessScore),
        readinessLevel,
        readinessLabel,
        strengths: strengths.map(([d, score]) => ({ domain: d, score, name: domainData[d].name })),
        weaknesses: weaknesses.map(([d, score]) => ({ domain: d, score, name: domainData[d].name })),
        recommendations,
        studyPlan,
        elapsed: formatTime(elapsed),
        studentName: state.studentName,
        studentId: state.studentId,
        date: new Date().toLocaleDateString('ar-SA'),
        time: new Date().toLocaleTimeString('ar-SA')
    };
}

// ==========================================
// GENERATE RECOMMENDATIONS
// ==========================================
function generateRecommendations(domainScores, weaknesses) {
    const recs = [];

    const overall = Object.values(domainScores).reduce((a, b) => a + b, 0) / Object.keys(domainScores).length;

    if (overall < 60) {
        recs.push({
            level: 'critical',
            icon: '🔴',
            title: 'تحتاج إلى تأهيل شامل',
            description: 'نتيجتك العامة تشير إلى حاجة ماسة للمراجعة. ننصحك بالبدء من المفاهيم الأساسية والعمل تدريجياً.',
            action: 'المستوى الأول - مبتدئ',
            url: '/courses/coursesnms/Cyber-F-Exam/index.html?level=beginner'
        });
    }

    const sortedWeak = [...weaknesses].sort((a, b) => a[1] - b[1]);

    sortedWeak.slice(0, 3).forEach(([domain, score]) => {
        const resource = STUDY_RESOURCES[domain];
        if (resource) {
            recs.push({
                level: score < 50 ? 'critical' : 'important',
                icon: score < 50 ? '🔴' : '🟠',
                title: resource.name,
                description: `نتيجتك: ${Math.round(score)}%. ${resource.recommendation}`,
                action: `📚 ابدأ المراجعة - المستوى ${resource.level}`,
                url: resource.url,
                domain: domain
            });
        }
    });

    if (recs.length === 0) {
        recs.push({
            level: 'positive',
            icon: '✅',
            title: 'أداء ممتاز!',
            description: 'نتائجك في جميع المجالات جيدة. ننصحك بمراجعة سريعة قبل الاختبار الموحد.',
            action: '📖 مراجعة شاملة سريعة',
            url: '/courses/coursesnms/Cyber-F-Exam/index.html'
        });
    }

    return recs;
}

// ==========================================
// GENERATE STUDY PLAN
// ==========================================
function generateStudyPlan(domainScores, weaknesses) {
    const plan = [];
    const sortedWeak = [...weaknesses].sort((a, b) => a[1] - b[1]);

    const week1 = sortedWeak.slice(0, 2);
    if (week1.length > 0) {
        plan.push({
            week: 1,
            label: 'الأسبوع الأول - التركيز على المجالات الأضعف',
            items: week1.map(([d]) => {
                const r = STUDY_RESOURCES[d];
                return r ? r.name : d;
            })
        });
    }

    const week2 = sortedWeak.slice(2, 4);
    if (week2.length > 0) {
        plan.push({
            week: 2,
            label: 'الأسبوع الثاني - تعزيز المجالات المتوسطة',
            items: week2.map(([d]) => {
                const r = STUDY_RESOURCES[d];
                return r ? r.name : d;
            })
        });
    }

    const allDomains = Object.keys(domainScores);
    const reviewItems = allDomains.slice(0, 4);
    plan.push({
        week: 3,
        label: 'الأسبوع الثالث - مراجعة شاملة وحل الأسئلة التدريبية',
        items: reviewItems.map((d) => {
            const r = STUDY_RESOURCES[d];
            return r ? r.name : d;
        }).concat(['الأسئلة التدريبية - دليل التحضير'])
    });

    return plan;
}

// ==========================================
// SAVE HISTORY
// ==========================================
function saveHistory(results) {
    const entry = {
        date: results.date,
        time: results.time,
        score: Math.round(results.overallScore),
        readiness: results.readinessPct,
        level: results.level,
        levelLabel: results.levelLabel,
        correct: results.correct,
        total: results.total,
        elapsed: results.elapsed
    };

    state.history.push(entry);
    if (state.history.length > 10) {
        state.history = state.history.slice(-10);
    }
    localStorage.setItem('diagnosticHistory', JSON.stringify(state.history));
}

// ==========================================
// SAVE STATE
// ==========================================
function saveState() {
    try {
        const data = {
            studentName: state.studentName,
            studentId: state.studentId,
            answers: state.answers,
            currentIndex: state.currentIndex,
            examStarted: state.examStarted,
            examEnded: state.examEnded,
            timeRemaining: state.timeRemaining,
            startTime: state.startTime,
            learningMode: state.learningMode
        };
        localStorage.setItem('diagnosticState', JSON.stringify(data));
    } catch (e) {
        // ignore
    }
}

// ==========================================
// LOAD STATE
// ==========================================
function loadState() {
    try {
        const data = JSON.parse(localStorage.getItem('diagnosticState'));
        if (data && data.examStarted && !data.examEnded) {
            state.studentName = data.studentName || '';
            state.studentId = data.studentId || '';
            state.currentIndex = data.currentIndex || 0;
            state.timeRemaining = data.timeRemaining || 7200;
            state.startTime = data.startTime || null;
            state.learningMode = data.learningMode || false;

            if (state.questions.length === 0) {
                const shuffledQuestions = shuffleArray(DIAGNOSTIC_QUESTIONS);
                state.questions = shuffledQuestions.map(q => {
                    const { options, correctAnswer } = shuffleOptions(q);
                    return {
                        ...q,
                        options,
                        correctAnswer,
                        userAnswer: null,
                        answered: false
                    };
                });
            }

            if (data.answers && data.answers.length === state.questions.length) {
                state.answers = data.answers;
                state.questions.forEach((q, i) => {
                    q.userAnswer = data.answers[i];
                    q.answered = data.answers[i] !== null;
                });
            }

            const welcomeScreen = $('welcomeScreen');
            const examArea = $('examArea');
            const resultsScreen = $('resultsScreen');
            const headerStats = $('headerStats');

            if (welcomeScreen) welcomeScreen.style.display = 'none';
            if (examArea) examArea.style.display = 'block';
            if (resultsScreen) resultsScreen.style.display = 'none';
            if (headerStats) headerStats.style.display = 'flex';

            const examName = $('examStudentName');
            if (examName) examName.textContent = state.studentName || 'طالب';

            const totalQ = $('examTotalQ');
            const qTotal = $('qTotal');
            if (totalQ) totalQ.textContent = state.questions.length;
            if (qTotal) qTotal.textContent = state.questions.length;

            startTimer();
            renderQuestion();

            return true;
        }
    } catch (e) {
        console.warn('Failed to load state:', e);
    }
    return false;
}

// ==========================================
// DISPLAY RESULTS
// ==========================================
function displayResults(results) {
    const examArea = $('examArea');
    const resultsScreen = $('resultsScreen');
    
    if (examArea) examArea.style.display = 'none';
    if (resultsScreen) {
        resultsScreen.style.display = 'block';
        resultsScreen.innerHTML = '';
    }

    const { overallScore, correct, total, incorrect, unanswered, domainScores, domainData } = results;

    const sortedDomains = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);

    const getStatus = (score) => {
        if (score >= 90) return { icon: '🟢', label: 'متقن' };
        if (score >= 75) return { icon: '🟢', label: 'جيد جداً' };
        if (score >= 60) return { icon: '🟡', label: 'يحتاج إلى تعزيز' };
        if (score >= 45) return { icon: '🟠', label: 'يحتاج إلى مراجعة' };
        return { icon: '🔴', label: 'يحتاج إلى تأهيل' };
    };

    const getBarColor = (score) => {
        if (score >= 75) return 'green';
        if (score >= 60) return 'blue';
        if (score >= 45) return 'orange';
        return 'red';
    };

    let domainsHtml = sortedDomains.map(([domain, score]) => {
        const status = getStatus(score);
        const color = getBarColor(score);
        const name = domainData[domain]?.name || domain;
        return `
            <div class="domain-row">
                <span class="domain-name">${name}</span>
                <div class="domain-bar-container">
                    <div class="domain-bar-fill ${color}" style="width:${Math.round(score)}%;"></div>
                </div>
                <span class="domain-score">${Math.round(score)}%</span>
                <span class="domain-status">${status.icon}</span>
            </div>
        `;
    }).join('');

    const strengthsHtml = results.strengths.slice(0, 3).map(s =>
        `<li>${s.name} <span class="badge-score">${Math.round(s.score)}%</span></li>`
    ).join('');

    const weaknessesHtml = results.weaknesses.slice(0, 3).map(w =>
        `<li>${w.name} <span class="badge-score" style="background:rgba(225,112,85,0.2);color:#e17055;">${Math.round(w.score)}%</span></li>`
    ).join('');

    let recsHtml = results.recommendations.map(rec => `
        <div class="rec-item">
            <div class="rec-icon">${rec.icon}</div>
            <div class="rec-content">
                <div class="rec-title">${rec.title}</div>
                <div class="rec-desc">${rec.description}</div>
                <div class="rec-action">
                    ${rec.url ? `<a href="${rec.url}" target="_blank" class="btn btn-primary btn-sm">${rec.action}</a>` :
                    `<button class="btn btn-secondary btn-sm" onclick="window.location.href='/courses/coursesnms/Cyber-F-Exam/index.html'">${rec.action}</button>`}
                </div>
            </div>
        </div>
    `).join('');

    let planHtml = results.studyPlan.map((week) => `
        <div class="plan-week">
            <div class="week-label">📌 ${week.label}</div>
            <div class="week-items">
                ${week.items.map(item => `<span class="tag">${item}</span>`).join('')}
            </div>
        </div>
    `).join('');

    let historyHtml = '';
    if (state.history.length > 1) {
        const historyRows = [...state.history].reverse().slice(0, 5).map((h, i) => {
            const prev = i < state.history.length - 1 ? state.history[state.history.length - 2 - i] : null;
            let trend = '';
            if (prev) {
                if (h.score > prev.score) trend = `📈 <span class="trend-up">+${h.score - prev.score}%</span>`;
                else if (h.score < prev.score) trend = `📉 <span class="trend-down">${h.score - prev.score}%</span>`;
                else trend = '➖ <span class="trend-same">بدون تغيير</span>';
            }
            return `
                <tr>
                    <td>${h.date}</td>
                    <td>${h.score}%</td>
                    <td>${h.readiness}%</td>
                    <td>${h.levelLabel}</td>
                    <td>${h.elapsed}</td>
                    <td>${trend}</td>
                </tr>
            `;
        }).join('');

        historyHtml = `
            <div class="history-section">
                <h3><i class="fas fa-history"></i> سجل محاولاتي</h3>
                <table class="history-table">
                    <thead>
                        <tr>
                            <th>التاريخ</th>
                            <th>الدرجة</th>
                            <th>الاستعداد</th>
                            <th>المستوى</th>
                            <th>المدة</th>
                            <th>التطور</th>
                        </tr>
                    </thead>
                    <tbody>${historyRows}</tbody>
                </table>
            </div>
        `;
    }

    if (resultsScreen) {
        resultsScreen.innerHTML = `
            <div class="results-header">
                <h2>📊 التقرير التشخيصي لمستوى الأمن السيبراني</h2>
                <div class="sub">
                    ${results.studentName} · ${results.studentId} · ${results.date} ${results.time}
                </div>
            </div>

            <div class="score-circle-container">
                <div class="score-circle" style="--score-percent: ${Math.round(overallScore)}%;">
                    <div class="inner">
                        <div class="score-number">${Math.round(overallScore)}%</div>
                        <div class="score-label">الدرجة العامة</div>
                    </div>
                </div>
            </div>

            <div class="results-grid">
                <div class="result-card">
                    <span class="number blue">${correct}/${total}</span>
                    <span class="label">✅ الإجابات الصحيحة</span>
                </div>
                <div class="result-card">
                    <span class="number red">${incorrect}</span>
                    <span class="label">❌ الإجابات الخاطئة</span>
                </div>
                <div class="result-card">
                    <span class="number orange">${unanswered}</span>
                    <span class="label">⏳ غير مجابة</span>
                </div>
                <div class="result-card">
                    <span class="number purple">${results.elapsed}</span>
                    <span class="label">⏱️ المدة المستغرقة</span>
                </div>
                <div class="result-card">
                    <span class="number ${results.level === 'excellent' ? 'green' : results.level === 'very-good' ? 'blue' : results.level === 'good' ? 'blue' : results.level === 'fair' ? 'orange' : 'red'}">${results.levelLabel}</span>
                    <span class="label">🏅 مستوى الطالب</span>
                </div>
                <div class="result-card">
                    <span class="number ${results.readinessLevel === 'ready' ? 'green' : results.readinessLevel === 'needs-review' ? 'orange' : results.readinessLevel === 'needs-training' ? 'orange' : 'red'}">${results.readinessPct}%</span>
                    <span class="label">${results.readinessLabel}</span>
                </div>
            </div>

            <div class="domain-analysis">
                <h3><i class="fas fa-chart-bar"></i> تحليل المجالات</h3>
                ${domainsHtml}
            </div>

            <div class="sw-container">
                <div class="sw-box">
                    <h4><span class="icon">💪</span> نقاط القوة</h4>
                    ${strengthsHtml || '<li>لا توجد نقاط قوة محددة حتى الآن</li>'}
                </div>
                <div class="sw-box">
                    <h4><span class="icon">📌</span> مجالات تحتاج إلى تحسين</h4>
                    ${weaknessesHtml || '<li>أداء جيد في جميع المجالات! 🎉</li>'}
                </div>
            </div>

            ${results.recommendations.length > 0 ? `
                <div class="recommendations">
                    <h3><i class="fas fa-lightbulb"></i> التوصيات الشخصية</h3>
                    ${recsHtml}
                </div>
            ` : ''}

            <div class="study-plan">
                <h3><i class="fas fa-road"></i> خطة المراجعة المقترحة</h3>
                ${planHtml}
                <div style="margin-top:15px;text-align:center;">
                    <a href="/courses/coursesnms/Cyber-F-Exam/index.html" class="btn btn-primary">
                        <i class="fas fa-book-open"></i>
                        🚀 الانتقال إلى دليل التحضير الشامل
                    </a>
                </div>
            </div>

            ${historyHtml}

            <div class="result-actions">
                <button class="btn btn-primary" onclick="retryExam()">
                    <i class="fas fa-redo-alt"></i>
                    إعادة الاختبار
                </button>
                <button class="btn btn-secondary" onclick="window.print()">
                    <i class="fas fa-print"></i>
                    طباعة التقرير
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='mock-exam.html'">
                    <i class="fas fa-shield-alt"></i>
                    الانتقال إلى اختبار المحاكاة
                </button>
                <button class="btn btn-secondary" onclick="location.reload()">
                    <i class="fas fa-home"></i>
                    الصفحة الرئيسية
                </button>
            </div>
        `;
    }

    const headerScore = $('headerScore');
    if (headerScore) headerScore.textContent = Math.round(overallScore) + '%';

    saveState();
    window.scrollTo(0, 0);
}

// ==========================================
// RETRY EXAM
// ==========================================
function retryExam() {
    state.examStarted = false;
    state.examEnded = false;
    state.results = null;

    const shuffledQuestions = shuffleArray(DIAGNOSTIC_QUESTIONS);
    state.questions = shuffledQuestions.map(q => {
        const { options, correctAnswer } = shuffleOptions(q);
        return {
            ...q,
            options,
            correctAnswer,
            userAnswer: null,
            answered: false
        };
    });
    state.answers = new Array(state.questions.length).fill(null);
    state.currentIndex = 0;
    state.timeRemaining = 7200;

    const resultsScreen = $('resultsScreen');
    const examArea = $('examArea');
    const headerStats = $('headerStats');

    if (resultsScreen) resultsScreen.style.display = 'none';
    if (examArea) examArea.style.display = 'block';
    if (headerStats) headerStats.style.display = 'flex';

    const examName = $('examStudentName');
    if (examName) examName.textContent = state.studentName;

    const totalQ = $('examTotalQ');
    const qTotal = $('qTotal');
    if (totalQ) totalQ.textContent = state.questions.length;
    if (qTotal) qTotal.textContent = state.questions.length;

    startTimer();
    renderQuestion();

    localStorage.removeItem('diagnosticState');
    saveState();
}

// ==========================================
// TOGGLE LEARNING MODE
// ==========================================
function toggleLearningMode() {
    state.learningMode = !state.learningMode;
    if (state.examStarted && !state.examEnded) {
        renderQuestion();
    }
    const btn = document.getElementById('modeToggleBtn');
    if (btn) {
        btn.textContent = state.learningMode ? '📖 تعليمي (نشط)' : '📝 عادي';
        btn.style.borderColor = state.learningMode ? '#00b894' : 'rgba(255,255,255,0.2)';
    }
    saveState();
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', (e) => {
    if (!state.examStarted || state.examEnded) return;

    switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            nextQuestion();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            prevQuestion();
            break;
        case '1':
            selectAnswer(0);
            break;
        case '2':
            selectAnswer(1);
            break;
        case '3':
            selectAnswer(2);
            break;
        case '4':
            selectAnswer(3);
            break;
    }
});

// ==========================================
// WARNING ON PAGE LEAVE
// ==========================================
window.addEventListener('beforeunload', (e) => {
    if (state.examStarted && !state.examEnded) {
        e.preventDefault();
        e.returnValue = '⚠️ أنت في منتصف الاختبار. هل أنت متأكد من مغادرة الصفحة؟';
    }
});

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Diagnostic Test initializing...');

    // Create mode toggle button
    const modeBtn = document.createElement('button');
    modeBtn.id = 'modeToggleBtn';
    modeBtn.className = 'btn btn-secondary btn-sm';
    modeBtn.style.position = 'fixed';
    modeBtn.style.bottom = '20px';
    modeBtn.style.left = '20px';
    modeBtn.style.zIndex = '999';
    modeBtn.style.opacity = '0.8';
    modeBtn.style.borderRadius = '30px';
    modeBtn.style.border = '1px solid rgba(255,255,255,0.2)';
    modeBtn.innerHTML = state.learningMode ? '📖 تعليمي (نشط)' : '📝 عادي';
    modeBtn.onclick = toggleLearningMode;
    document.body.appendChild(modeBtn);

    // Load saved name if exists
    const saved = JSON.parse(localStorage.getItem('diagnosticState') || '{}');
    const studentNameInput = $('studentName');
    const studentIdInput = $('studentId');
    if (studentNameInput && saved.studentName) {
        studentNameInput.value = saved.studentName;
    }
    if (studentIdInput && saved.studentId) {
        studentIdInput.value = saved.studentId;
    }

    // Try to restore state
    const restored = loadState();

    if (!restored) {
        const welcomeScreen = $('welcomeScreen');
        const examArea = $('examArea');
        const resultsScreen = $('resultsScreen');
        const headerStats = $('headerStats');

        if (welcomeScreen) welcomeScreen.style.display = 'block';
        if (examArea) examArea.style.display = 'none';
        if (resultsScreen) resultsScreen.style.display = 'none';
        if (headerStats) headerStats.style.display = 'none';
    }

    console.log('✅ Diagnostic Test ready');
    console.log(`📊 ${DIAGNOSTIC_QUESTIONS.length} questions loaded`);
});

// Make functions globally accessible
window.startExam = startExam;
window.selectAnswer = selectAnswer;
window.nextQuestion = nextQuestion;
window.prevQuestion = prevQuestion;
window.firstQuestion = firstQuestion;
window.lastQuestion = lastQuestion;
window.goToQuestion = goToQuestion;
window.submitExam = submitExam;
window.retryExam = retryExam;
window.toggleLearningMode = toggleLearningMode;

