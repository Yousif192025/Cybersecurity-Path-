/**
 * Fixed-data runner — static tables/logs labs in-browser.
 */
(function (global) {
  global.LabsRunners = global.LabsRunners || {};

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function pageDataUrl(ref) {
    return new URL("data/" + String(ref).replace(/^data\//, ""), window.location.href).href;
  }

  async function fetchJson(url) {
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function score(assessment, answers, logIds) {
    var key = assessment.key;
    var fb = assessment.feedback || {};
    var messages = [];

    var selected = answers.q1 || [];
    var correct = key.q1.correctIds || [];
    var distractors = key.q1.distractorIds || [];
    var acceptableExtra = key.q1.acceptableExtra || [];
    var hits = selected.filter(function (id) {
      return correct.indexOf(id) !== -1;
    });
    var falsePos = selected.filter(function (id) {
      return distractors.indexOf(id) !== -1;
    });
    // extras that are only acceptableExtra don't count as false pos
    var q1ok =
      hits.length >= (key.q1.minCorrect || 4) &&
      falsePos.length <= (key.q1.maxFalsePositives || 2);

    if (!q1ok) {
      if (falsePos.length > (key.q1.maxFalsePositives || 2)) messages.push(fb.q1_too_many || fb.q1_weak || "");
      else messages.push(fb.q1_weak || "");
    }

    var q2ok = answers.q2 === key.q2.correctId;
    if (!q2ok) messages.push(fb.q2_wrong || "");

    var q3ok = answers.q3 === key.q3.correctId;
    if (!q3ok) messages.push(fb.q3_wrong || "");

    var text = (answers.q4 || "").trim();
    var q4key = key.q4 || {};
    var lower = text.toLowerCase();
    var kwHits = 0;
    (q4key.hintKeywords || []).forEach(function (kw) {
      if (lower.indexOf(String(kw).toLowerCase()) !== -1) kwHits++;
    });
    var q4ok = text.length >= (q4key.minLength || 25) && kwHits >= (q4key.minKeywordHits || 2);
    if (!q4ok) messages.push(fb.q4_weak || "");

    var complete = q1ok && q2ok && q3ok && q4ok;
    if (complete) messages = [fb.success || "أحسنت."];

    var seen = {};
    messages = messages.filter(function (m) {
      if (!m || seen[m]) return false;
      seen[m] = true;
      return true;
    });

    return { complete: complete, q1ok: q1ok, q2ok: q2ok, q3ok: q3ok, q4ok: q4ok, messages: messages };
  }

  function render(ctx, content, assessment) {
    var mount = ctx.mount;
    mount.innerHTML = "";
    mount.classList.add("lab-sim");

    mount.appendChild(el("h2", null, "تشغيل — بيانات ثابتة"));
    if (content.intro) mount.appendChild(el("p", "sim-intro", content.intro));

    if (content.context) {
      var box = el("section", "sim-block");
      box.appendChild(el("h3", null, "السياق"));
      var ul = el("ul");
      Object.keys(content.context).forEach(function (k) {
        ul.appendChild(el("li", null, content.context[k]));
      });
      box.appendChild(ul);
      mount.appendChild(box);
    }

    // Log table
    var logs = content.logs || [];
    var tableWrap = el("section", "sim-block");
    tableWrap.appendChild(el("h3", null, "مقتطف السجلات"));
    var table = document.createElement("table");
    table.className = "sim-log-table";
    table.innerHTML =
      "<thead><tr><th>المعرّف</th><th>الوقت</th><th>المستخدم</th><th>المصدر</th><th>الحدث</th><th>النتيجة</th></tr></thead>";
    var tbody = document.createElement("tbody");
    logs.forEach(function (row) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td><code>" +
        escapeHtml(row.id) +
        "</code></td><td>" +
        escapeHtml(row.time) +
        "</td><td>" +
        escapeHtml(row.user) +
        "</td><td><code>" +
        escapeHtml(row.source) +
        "</code></td><td>" +
        escapeHtml(row.event) +
        "</td><td>" +
        escapeHtml(row.result) +
        "</td>";
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    mount.appendChild(tableWrap);

    if (content.safety && content.safety.length) {
      var saf = el("section", "sim-block");
      saf.appendChild(el("h3", null, "السلامة"));
      var su = el("ul");
      content.safety.forEach(function (s) {
        su.appendChild(el("li", null, s));
      });
      saf.appendChild(su);
      mount.appendChild(saf);
    }

    var form = el("form", "sim-form");
    form.setAttribute("novalidate", "true");
    form.appendChild(el("h3", null, "المهام"));

    var logById = {};
    logs.forEach(function (r) {
      logById[r.id] = r;
    });

    (assessment.questions || []).forEach(function (q, idx) {
      var fieldset = el("fieldset", "sim-q");
      fieldset.appendChild(el("legend", null, "سؤال " + (idx + 1)));
      fieldset.appendChild(el("p", "sim-prompt", q.prompt));

      if (q.type === "multi" && q.optionsFromLogs) {
        (q.optionIds || []).forEach(function (oid) {
          var row = logById[oid] || { id: oid, event: oid };
          var label = el("label", "sim-option");
          var input = document.createElement("input");
          input.type = "checkbox";
          input.name = "q1";
          input.value = oid;
          label.appendChild(input);
          label.appendChild(
            document.createTextNode(
              " " +
                oid +
                " — " +
                (row.time || "") +
                " | " +
                (row.user || "") +
                " | " +
                (row.event || "")
            )
          );
          fieldset.appendChild(label);
        });
      } else if (q.type === "single") {
        (q.options || []).forEach(function (opt) {
          var label = el("label", "sim-option");
          var input = document.createElement("input");
          input.type = "radio";
          input.name = q.id;
          input.value = opt.id;
          label.appendChild(input);
          label.appendChild(document.createTextNode(" " + opt.label));
          fieldset.appendChild(label);
        });
      } else if (q.type === "text") {
        var ta = document.createElement("textarea");
        ta.name = q.id;
        ta.rows = 4;
        ta.className = "sim-textarea";
        ta.placeholder = q.placeholder || "";
        fieldset.appendChild(ta);
      }
      form.appendChild(fieldset);
    });

    var actions = el("div", "sim-actions");
    var submit = el("button", "btn-labs btn-labs-primary", "إرسال الإجابات");
    submit.type = "submit";
    actions.appendChild(submit);
    form.appendChild(actions);

    var resultBox = el("div", "sim-result");
    resultBox.hidden = true;
    form.appendChild(resultBox);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var answers = { q1: [], q2: null, q3: null, q4: "" };
      form.querySelectorAll('input[name="q1"]:checked').forEach(function (inp) {
        answers.q1.push(inp.value);
      });
      answers.q2 = (form.querySelector('input[name="q2"]:checked') || {}).value || null;
      answers.q3 = (form.querySelector('input[name="q3"]:checked') || {}).value || null;
      answers.q4 = (form.querySelector('[name="q4"]') || {}).value || "";

      var outcome = score(assessment, answers);
      resultBox.hidden = false;
      resultBox.className =
        "sim-result " + (outcome.complete ? "sim-result-ok" : "sim-result-bad");
      resultBox.innerHTML = "";
      resultBox.appendChild(
        el("h3", null, outcome.complete ? "اكتمل المختبر" : "لم يكتمل بعد — راجع التغذية الراجعة")
      );
      var list = el("ul");
      list.appendChild(el("li", null, "فرز الأحداث: " + (outcome.q1ok ? "مستوفى" : "غير مستوفى")));
      list.appendChild(el("li", null, "تصنيف السلسلة: " + (outcome.q2ok ? "صحيح" : "غير صحيح")));
      list.appendChild(el("li", null, "ربط e11–e12: " + (outcome.q3ok ? "صحيح" : "غير صحيح")));
      list.appendChild(el("li", null, "الملاحظة: " + (outcome.q4ok ? "مقبولة" : "تحتاج تحسينًا")));
      resultBox.appendChild(list);
      outcome.messages.forEach(function (m) {
        resultBox.appendChild(el("p", null, m));
      });

      try {
        sessionStorage.setItem(
          "labs:result:" + (content.id || "lab-soc-log-triage-01"),
          JSON.stringify({
            at: Date.now(),
            complete: outcome.complete,
            parts: { q1: outcome.q1ok, q2: outcome.q2ok, q3: outcome.q3ok, q4: outcome.q4ok }
          })
        );
      } catch (err) {}

      var resLink = document.createElement("a");
      resLink.className = "btn-labs btn-labs-ghost";
      resLink.href =
        "/academy/labs/results.html?id=" +
        encodeURIComponent(content.id || "lab-soc-log-triage-01");
      resLink.textContent = "عرض صفحة النتائج";
      resultBox.appendChild(resLink);
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    mount.appendChild(form);
  }

  global.LabsRunners["fixed-data"] = {
    id: "fixed-data",
    init: async function (ctx) {
      if (!ctx || !ctx.mount) return;
      var labId = ctx.labId || (ctx.meta && ctx.meta.id);
      if (!labId) {
        ctx.mount.innerHTML =
          "<p class='phase-note'>حدد المعرف: <code>?id=lab-soc-log-triage-01&runner=fixed-data</code></p>";
        return;
      }
      ctx.mount.innerHTML = "<p>جاري تحميل بيانات المختبر…</p>";
      try {
        var meta = ctx.meta;
        if (!meta && global.LabsData) {
          var index = await global.LabsData.loadLabsIndex();
          meta = global.LabsData.getLabById(index, labId);
        }
        if (!meta) throw new Error("المختبر غير موجود في السجل");
        var content = await fetchJson(pageDataUrl(meta.contentRef));
        var assessment = await fetchJson(pageDataUrl(meta.assessmentRef));
        render(ctx, content, assessment);
      } catch (e) {
        ctx.mount.innerHTML =
          "<p class='phase-note'>تعذر التحميل: " + escapeHtml(e.message || String(e)) + "</p>";
        console.warn(e);
      }
    }
  };
})(window);
