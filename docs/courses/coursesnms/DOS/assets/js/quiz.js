/* CyberPath DOS Course — quiz engine */

window.QUIZZES = window.QUIZZES || {};

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("quiz");
  if (!root) return;
  const key = root.dataset.quiz;
  const data = window.QUIZZES[key];
  if (!data) {
    root.innerHTML = "<p class='muted'>لم يتم تحميل أسئلة هذا الاختبار.</p>";
    return;
  }
  renderQuiz(root, data);
});

function renderQuiz(root, data) {
  let html = `<h3>${data.title || "اختبار قصير"}</h3><form class="quiz-form" novalidate>`;
  data.questions.forEach((q, qi) => {
    html += `<fieldset class="quiz-q" data-q="${qi}">
      <legend>${qi + 1}. ${q.q}</legend>`;
    q.options.forEach((opt, oi) => {
      html += `<label class="quiz-opt">
        <input type="radio" name="q${qi}" value="${oi}" />
        <span>${opt}</span>
      </label>`;
    });
    html += `<div class="quiz-feedback" aria-live="polite"></div></fieldset>`;
  });
  html += `<div class="quiz-actions">
      <button type="submit" class="btn primary">تصحيح الإجابات</button>
      <button type="button" class="btn ghost" id="quiz-reset">إعادة</button>
    </div>
    <div class="quiz-result" aria-live="polite"></div>
  </form>`;
  root.innerHTML = html;

  const form = root.querySelector(".quiz-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    gradeQuiz(root, data, form);
  });
  root.querySelector("#quiz-reset").addEventListener("click", () => {
    form.reset();
    root.querySelectorAll(".quiz-feedback").forEach((f) => (f.textContent = ""));
    root.querySelectorAll(".quiz-q").forEach((f) => f.classList.remove("correct", "wrong"));
    root.querySelector(".quiz-result").textContent = "";
  });
}

function gradeQuiz(root, data, form) {
  let score = 0;
  data.questions.forEach((q, qi) => {
    const fieldset = root.querySelector(`.quiz-q[data-q="${qi}"]`);
    const selected = form.querySelector(`input[name="q${qi}"]:checked`);
    const feedback = fieldset.querySelector(".quiz-feedback");
    fieldset.classList.remove("correct", "wrong");
    if (selected && Number(selected.value) === q.answer) {
      score++;
      fieldset.classList.add("correct");
      feedback.innerHTML = `✔ صحيح. ${q.explain || ""}`;
    } else {
      fieldset.classList.add("wrong");
      const correctText = q.options[q.answer];
      feedback.innerHTML = `✘ غير صحيح. الإجابة الصحيحة: <strong>${correctText}</strong>. ${q.explain || ""}`;
    }
  });
  const total = data.questions.length;
  const pct = Math.round((score / total) * 100);
  const result = root.querySelector(".quiz-result");
  result.innerHTML = `النتيجة: <strong>${score} / ${total}</strong> (${pct}%) — ${pct >= 70 ? "ناجح ✅" : "حاول مرة أخرى 🔁"}`;
  result.scrollIntoView({ behavior: "smooth", block: "center" });
}
