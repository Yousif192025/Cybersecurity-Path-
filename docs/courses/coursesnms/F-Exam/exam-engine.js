/* Shared runtime for specialization exams. Questions remain in question-bank.js only. */
(function (global, document) {
  "use strict";
  const storagePrefix = "f-exam-specialization:";

  function element(tag, attributes, text) {
    const node = document.createElement(tag);
    Object.entries(attributes || {}).forEach(([name, value]) => {
      if (value !== "") node.setAttribute(name, value);
    });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function labelForDifficulty(value) {
    return ({ easy: "سهل", medium: "متوسط", hard: "متقدم" })[value] || "غير مصنف";
  }

  function readState(exam) {
    const empty = { index: 0, answers: Array(exam.questions.length).fill(null) };
    try {
      const saved = JSON.parse(global.sessionStorage.getItem(storagePrefix + exam.id));
      if (!saved || !Array.isArray(saved.answers) || saved.answers.length !== exam.questions.length) return empty;
      return { index: Math.min(Math.max(saved.index || 0, 0), exam.questions.length - 1), answers: saved.answers };
    } catch (_) {
      return empty;
    }
  }

  function saveState(exam, state) {
    global.sessionStorage.setItem(storagePrefix + exam.id, JSON.stringify(state));
  }

  function clearState(exam) {
    global.sessionStorage.removeItem(storagePrefix + exam.id);
  }

  function statusView(exam) {
    const isReady = exam.status === "ready" && Array.isArray(exam.questions) && exam.questions.length > 0;
    const section = element("section", { class: `notice ${isReady ? "notice-ready" : ""}`, "aria-labelledby": "status-title" });
    section.append(element("div", { class: "notice-mark", "aria-hidden": "true" }, isReady ? "✓" : "!"));
    const content = element("div");
    const title = isReady ? `متاح حاليًا: ${exam.questions.length} سؤالًا موثقًا` : (exam.statusMessage || "هذا النموذج قيد استكمال المحتوى التدريبي الموثق.");
    const detail = isReady
      ? (exam.questions.length < (exam.targetQuestionCount || 40) ? "المحتوى الإضافي: قيد الاستكمال. لن تُضاف أسئلة غير موثقة لتعويض النقص." : "الأسئلة مرتبطة بمصادر موضحة داخل بنك الأسئلة المركزي.")
      : "لن يبدأ اختبار فارغ. ستتاح الأسئلة بعد إدخال مصادر معتمدة ومراجعتها.";
    content.append(element("h2", { id: "status-title" }, title), element("p", {}, detail));
    section.append(content);
    return section;
  }

  function topicsView(exam) {
    const section = element("section", { class: "topics-card", "aria-labelledby": "topics-title" });
    section.append(element("h2", { class: "section-heading", id: "topics-title" }, "الموضوعات المعتمدة في نطاق المقرر"));
    section.append(element("p", { class: "section-description" }, "الموضوعات والأسئلة المعروضة مستندة إلى المراجع المحددة في بنك الأسئلة المركزي."));
    const list = element("ul", { class: "topic-list" });
    (exam.topics || []).forEach((topic) => list.append(element("li", {}, topic)));
    section.append(list);
    return section;
  }

  function startScreen(exam, panel) {
    panel.replaceChildren();
    const screen = element("div", { class: "start-screen" });
    screen.append(element("h2", { class: "section-heading" }, "اختبار تدريبي موثق"));
    screen.append(element("p", { class: "section-description" }, `يحتوي هذا النموذج على ${exam.questions.length} سؤالًا. تُحفظ الإجابات داخل جلسة المتصفح أثناء الانتقال بين الأسئلة.`));
    const summary = element("div", { class: "exam-summary" });
    const difficulties = ["easy", "medium", "hard"].map((level) => [labelForDifficulty(level), exam.questions.filter((question) => question.difficulty === level).length]);
    difficulties.forEach(([label, count]) => {
      const item = element("div", { class: "summary-item" });
      item.append(element("strong", {}, String(count)), element("span", {}, label));
      summary.append(item);
    });
    const start = element("button", { type: "button", class: "primary-button" }, "بدء الاختبار");
    start.addEventListener("click", () => renderQuestion(exam, readState(exam), panel));
    screen.append(summary, start);
    panel.append(screen);
  }

  function renderQuestion(exam, state, panel) {
    const current = exam.questions[state.index];
    panel.replaceChildren();
    const answered = state.answers.filter((answer) => answer !== null).length;
    const progress = Math.round((answered / exam.questions.length) * 100);
    const meta = element("div", { class: "question-meta" });
    meta.append(
      element("span", { class: "meta-badge" }, `السؤال ${state.index + 1} من ${exam.questions.length}`),
      element("span", { class: "meta-badge" }, `الموضوع: ${current.topic}`),
      element("span", { class: "meta-badge" }, `الصعوبة: ${labelForDifficulty(current.difficulty)}`)
    );
    const progressWrap = element("div", { class: "progress-wrap" });
    const label = element("div", { class: "progress-label" });
    label.append(element("span", {}, "الإجابات المحفوظة"), element("span", {}, `${answered}/${exam.questions.length}`));
    const track = element("div", { class: "progress-track", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(progress) });
    track.append(element("div", { class: "progress-value", style: `width:${progress}%` }));
    progressWrap.append(label, track);
    panel.append(meta, progressWrap, element("h2", { class: "question-title" }, current.prompt));

    const options = element("div", { class: "option-list", role: "group", "aria-label": "خيارات الإجابة" });
    current.options.forEach((option, optionIndex) => {
      const selected = state.answers[state.index] === optionIndex;
      const letter = ["أ", "ب", "ج", "د"][optionIndex];
      const button = element("button", { type: "button", class: "option-button", "aria-pressed": String(selected) }, `${letter}. ${option}`);
      button.addEventListener("click", () => {
        state.answers[state.index] = optionIndex;
        saveState(exam, state);
        renderQuestion(exam, state, panel);
      });
      options.append(button);
    });
    panel.append(options);

    const navigator = element("div", { class: "navigator", "aria-label": "التنقل بين الأسئلة" });
    exam.questions.forEach((_, itemIndex) => {
      const classes = [itemIndex === state.index ? "current" : "", state.answers[itemIndex] !== null ? "answered" : ""].filter(Boolean).join(" ");
      const button = element("button", { type: "button", class: classes, "aria-label": `انتقل إلى السؤال ${itemIndex + 1}` }, String(itemIndex + 1));
      button.addEventListener("click", () => { state.index = itemIndex; saveState(exam, state); renderQuestion(exam, state, panel); });
      navigator.append(button);
    });
    panel.append(navigator);

    const actions = element("div", { class: "exam-actions" });
    const previous = element("button", { type: "button", class: "nav-button", disabled: state.index === 0 ? "disabled" : "" }, "السؤال السابق");
    previous.addEventListener("click", () => { if (state.index > 0) { state.index -= 1; saveState(exam, state); renderQuestion(exam, state, panel); } });
    const finish = element("button", { type: "button", class: "primary-button" }, "إنهاء وعرض النتيجة");
    finish.addEventListener("click", () => renderResults(exam, state, panel));
    const next = element("button", { type: "button", class: "nav-button", disabled: state.index === exam.questions.length - 1 ? "disabled" : "" }, "السؤال التالي");
    next.addEventListener("click", () => { if (state.index < exam.questions.length - 1) { state.index += 1; saveState(exam, state); renderQuestion(exam, state, panel); } });
    actions.append(previous, finish, next);
    panel.append(actions);
  }

  function renderResults(exam, state, panel) {
    const answered = state.answers.filter((answer) => answer !== null).length;
    const correct = exam.questions.reduce((total, question, index) => total + (state.answers[index] === question.correctAnswer ? 1 : 0), 0);
    const percentage = Math.round((correct / exam.questions.length) * 100);
    panel.replaceChildren();
    panel.append(element("h2", { class: "section-heading" }, "نتيجة الاختبار ومراجعته"));
    const summary = element("div", { class: "exam-summary" });
    [["الدرجة", `${correct}/${exam.questions.length}`], ["النسبة", `${percentage}%`], ["المجاب", String(answered)]].forEach(([label, value]) => {
      const item = element("div", { class: "summary-item" });
      item.append(element("strong", {}, value), element("span", {}, label));
      summary.append(item);
    });
    panel.append(summary);
    exam.questions.forEach((question, index) => {
      const isCorrect = state.answers[index] === question.correctAnswer;
      const item = element("article", { class: `review-item ${isCorrect ? "correct" : "wrong"}` });
      const answer = state.answers[index] === null ? "غير مجاب" : question.options[state.answers[index]];
      item.append(
        element("strong", {}, `السؤال ${index + 1}: ${question.prompt}`),
        element("p", {}, `إجابتك: ${answer}`),
        element("p", {}, `الإجابة الصحيحة: ${question.options[question.correctAnswer]}`),
        element("p", {}, `الشرح: ${question.explanation}`),
        element("p", { class: "source-note" }, `المصدر: ${question.source}`)
      );
      panel.append(item);
    });
    const actions = element("div", { class: "exam-actions" });
    const restart = element("button", { type: "button", class: "primary-button" }, "إعادة الاختبار");
    restart.addEventListener("click", () => { clearState(exam); startScreen(exam, panel); });
    const back = element("button", { type: "button", class: "secondary-button" }, "العودة إلى الأسئلة");
    back.addEventListener("click", () => renderQuestion(exam, state, panel));
    actions.append(restart, back);
    panel.append(actions);
  }

  function activeExamView(exam) {
    const panel = element("section", { class: "exam-panel", "aria-live": "polite" });
    startScreen(exam, panel);
    return panel;
  }

  function boot() {
    const bank = global.SpecializationQuestionBank;
    const app = document.getElementById("specialization-app");
    if (!bank || !app) return;
    const courseId = document.body.dataset.courseId;
    const exam = document.body.dataset.examType === "integration" ? bank.integrationTest : bank.getCourse(courseId);
    if (!exam) {
      app.append(element("p", { class: "empty-state" }, "تعذر العثور على بيانات هذا النموذج."));
      return;
    }
    const name = document.getElementById("course-name");
    const english = document.getElementById("course-name-en");
    if (name) name.textContent = exam.nameAr || "الاختبار التكاملي";
    if (english) english.textContent = exam.nameEn || "Specialization Integration Test";
    app.append(statusView(exam), topicsView(exam));
    if (exam.status === "ready" && Array.isArray(exam.questions) && exam.questions.length > 0) app.append(activeExamView(exam));
  }
  document.addEventListener("DOMContentLoaded", boot);
}(window, document));
