/* Shared runtime for new specialization models. It is intentionally inert while a course has no approved questions. */
(function (global, document) {
  "use strict";

  function element(tag, attributes, text) {
    const node = document.createElement(tag);
    Object.entries(attributes || {}).forEach(([name, value]) => node.setAttribute(name, value));
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function labelForDifficulty(value) {
    return ({ easy: "سهل", medium: "متوسط", hard: "متقدم" })[value] || "غير مصنف";
  }

  function pendingView(exam) {
    const wrapper = element("section", { class: "notice", "aria-labelledby": "pending-title" });
    wrapper.append(
      element("div", { class: "notice-mark", "aria-hidden": "true" }, "!"),
      (() => {
        const content = element("div");
        content.append(
          element("h2", { id: "pending-title" }, exam.statusMessage || "هذا النموذج قيد استكمال المحتوى التدريبي الموثق."),
          element("p", {}, "لن يبدأ اختبار فارغ. ستتاح الأسئلة بعد إدخال مصادر معتمدة ومراجعتها ضمن المرحلة الثانية.")
        );
        return content;
      })()
    );
    return wrapper;
  }

  function topicsView(exam) {
    const section = element("section", { class: "topics-card", "aria-labelledby": "topics-title" });
    section.append(element("h2", { class: "section-heading", id: "topics-title" }, "الموضوعات المعتمدة في نطاق المقرر"));
    section.append(element("p", { class: "section-description" }, "هذه موضوعات تنظيمية مستخرجة من الخطة المرجعية؛ وليست أسئلة أو محتوى تدريبيًا مضافًا."));
    const list = element("ul", { class: "topic-list" });
    (exam.topics || []).forEach((topic) => list.append(element("li", {}, topic)));
    section.append(list);
    return section;
  }

  function activeExamView(exam) {
    const state = { index: 0, answers: Array(exam.questions.length).fill(null) };
    const panel = element("section", { class: "exam-panel", "aria-live": "polite" });

    function render() {
      panel.replaceChildren();
      const current = exam.questions[state.index];
      const progress = Math.round(((state.index + 1) / exam.questions.length) * 100);
      const meta = element("div", { class: "question-meta" });
      meta.append(
        element("span", { class: "meta-badge" }, `السؤال ${state.index + 1} من ${exam.questions.length}`),
        element("span", { class: "meta-badge" }, `الموضوع: ${current.topic}`),
        element("span", { class: "meta-badge" }, `الصعوبة: ${labelForDifficulty(current.difficulty)}`)
      );
      const progressWrap = element("div", { class: "progress-wrap" });
      const label = element("div", { class: "progress-label" });
      label.append(element("span", {}, "التقدم"), element("span", {}, `${progress}%`));
      const track = element("div", { class: "progress-track", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(progress) });
      track.append(element("div", { class: "progress-value", style: `width:${progress}%` }));
      progressWrap.append(label, track);
      panel.append(meta, progressWrap, element("h2", { class: "question-title" }, current.prompt));
      const options = element("div", { class: "option-list", role: "group", "aria-label": "خيارات الإجابة" });
      current.options.forEach((option, optionIndex) => {
        const selected = state.answers[state.index] === optionIndex;
        const button = element("button", { type: "button", class: "option-button", "aria-pressed": String(selected) }, `${String.fromCharCode(0x0623 + optionIndex)}. ${option}`);
        button.addEventListener("click", () => { state.answers[state.index] = optionIndex; render(); });
        options.append(button);
      });
      panel.append(options);
      const navigator = element("div", { class: "navigator", "aria-label": "التنقل بين الأسئلة" });
      exam.questions.forEach((_, itemIndex) => {
        const button = element("button", { type: "button", class: `${itemIndex === state.index ? "current " : ""}${state.answers[itemIndex] !== null ? "answered" : ""}`.trim(), "aria-label": `انتقل إلى السؤال ${itemIndex + 1}` }, String(itemIndex + 1));
        button.addEventListener("click", () => { state.index = itemIndex; render(); });
        navigator.append(button);
      });
      panel.append(navigator);
      const actions = element("div", { class: "exam-actions" });
      const previous = element("button", { type: "button", class: "nav-button", disabled: state.index === 0 ? "disabled" : "" }, "السؤال السابق");
      previous.addEventListener("click", () => { if (state.index > 0) { state.index -= 1; render(); } });
      const finish = element("button", { type: "button", class: "primary-button" }, "إنهاء الاختبار");
      finish.addEventListener("click", () => renderResults(exam, state, panel));
      const next = element("button", { type: "button", class: "nav-button", disabled: state.index === exam.questions.length - 1 ? "disabled" : "" }, "السؤال التالي");
      next.addEventListener("click", () => { if (state.index < exam.questions.length - 1) { state.index += 1; render(); } });
      actions.append(previous, finish, next);
      panel.append(actions);
    }
    render();
    return panel;
  }

  function renderResults(exam, state, panel) {
    const answered = state.answers.filter((answer) => answer !== null).length;
    const correct = exam.questions.reduce((count, question, index) => count + (state.answers[index] === question.correctAnswer ? 1 : 0), 0);
    const percentage = Math.round((correct / exam.questions.length) * 100);
    panel.replaceChildren();
    panel.append(element("h2", { class: "section-heading" }, "نتيجة الاختبار"));
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
      item.append(
        element("strong", {}, `السؤال ${index + 1}: ${question.prompt}`),
        element("p", {}, `إجابتك: ${state.answers[index] === null ? "غير مجاب" : question.options[state.answers[index]]}`),
        element("p", {}, `الإجابة الصحيحة: ${question.options[question.correctAnswer]}`),
        element("p", {}, `الشرح: ${question.explanation}`)
      );
      panel.append(item);
    });
    const restart = element("button", { type: "button", class: "primary-button" }, "إعادة الاختبار");
    restart.addEventListener("click", () => global.location.reload());
    panel.append(restart);
  }

  function boot() {
    const bank = global.SpecializationQuestionBank;
    const app = document.getElementById("specialization-app");
    if (!bank || !app) return;
    const courseId = document.body.dataset.courseId;
    const isIntegration = document.body.dataset.examType === "integration";
    const exam = isIntegration ? bank.integrationTest : bank.getCourse(courseId);
    if (!exam) {
      app.append(element("p", { class: "empty-state" }, "تعذر العثور على بيانات هذا النموذج."));
      return;
    }
    const name = document.getElementById("course-name");
    const english = document.getElementById("course-name-en");
    if (name) name.textContent = exam.nameAr || exam.nameAr || exam.name || "الاختبار التكاملي";
    if (english) english.textContent = exam.nameEn || "Specialization Integration Test";
    app.append(pendingView(exam), topicsView(exam));
    if (exam.status === "ready" && Array.isArray(exam.questions) && exam.questions.length > 0) {
      app.append(activeExamView(exam));
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
}(window, document));
