/**
 * Simulation runner — loads content + assessment and runs in-browser lab.
 */
(function (global) {
  global.LabsRunners = global.LabsRunners || {};

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function resolveDataUrl(ref) {
    if (!ref) return null;
    if (/^https?:\/\//i.test(ref)) return ref;
    return new URL("../data/" + ref.replace(/^\/+/, ""), document.currentScript.src).href;
  }

  // Fallback when currentScript is null (deferred): relative to page
  function pageDataUrl(ref) {
    if (!ref) return null;
    return new URL("data/" + ref.replace(/^data\//, ""), window.location.href).href;
  }

  async function fetchJson(url) {
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status + " " + url);
    return res.json();
  }

  function score(assessment, answers) {
    var key = assessment.key;
    var fb = assessment.feedback || {};
    var messages = [];
    var q1ok = false;
    var q2ok = false;
    var q3ok = false;
    var q4ok = false;

    // Q1
    var selected = answers.q1 || [];
    var correctSet = key.q1.correctIds || [];
    var hits = selected.filter(function (id) {
      return correctSet.indexOf(id) !== -1;
    });
    q1ok = hits.length >= (key.q1.minCorrect || 3);
    if (selected.indexOf("i6") !== -1) messages.push(fb.q1_time || "");
    if (!q1ok) messages.push(fb.partialIndicators || "");

    // Q2
    q2ok = answers.q2 === key.q2.correctId;
    if (!q2ok) messages.push(fb.q2_wrong || "");

    // Q3
    q3ok = answers.q3 === key.q3.correctId;
    if (!q3ok) {
      var k = "q3_" + answers.q3;
      if (fb[k]) messages.push(fb[k]);
    }

    // Q4
    var text = (answers.q4 || "").trim();
    var q4key = key.q4 || {};
    var longEnough = text.length >= (q4key.minLength || 20);
    var hitsKw = 0;
    var lower = text.toLowerCase();
    (q4key.hintKeywords || []).forEach(function (kw) {
      if (lower.indexOf(String(kw).toLowerCase()) !== -1) hitsKw++;
    });
    q4ok = longEnough && hitsKw >= (q4key.minKeywordHits || 2);
    if (!q4ok) messages.push(fb.q4_weak || "");

    var complete =
      q2ok &&
      q3ok &&
      q1ok &&
      q4ok;

    if (complete) messages = [fb.success || "أحسنت."];

    // unique non-empty messages
    var seen = {};
    messages = messages.filter(function (m) {
      if (!m || seen[m]) return false;
      seen[m] = true;
      return true;
    });

    return {
      complete: complete,
      q1ok: q1ok,
      q2ok: q2ok,
      q3ok: q3ok,
      q4ok: q4ok,
      messages: messages
    };
  }

  function render(ctx, content, assessment) {
    var mount = ctx.mount;
    mount.innerHTML = "";
    mount.classList.add("lab-sim");

    var title = el("h2", null, "تشغيل المحاكاة");
    mount.appendChild(title);

    if (content.intro) {
      mount.appendChild(el("p", "sim-intro", content.intro));
    }

    // Context
    var ctxBox = el("section", "sim-block");
    ctxBox.appendChild(el("h3", null, "السياق"));
    if (content.context) {
      var c = content.context;
      var ul = el("ul");
      ["role", "situation", "known", "unknown"].forEach(function (k) {
        if (c[k]) {
          var li = el("li", null, c[k]);
          ul.appendChild(li);
        }
      });
      if (c.expectedMailDomain) {
        ul.appendChild(
          el("li", null, "النطاق المتوقع لبريد المؤسسة: " + c.expectedMailDomain)
        );
      }
      ctxBox.appendChild(ul);
    }
    mount.appendChild(ctxBox);

    // Message card
    var msg = content.message || {};
    var msgBox = el("section", "sim-block sim-email");
    msgBox.appendChild(el("h3", null, "الرسالة التدريبية"));
    var meta = el("div", "sim-email-meta");
    meta.innerHTML =
      "<div><strong>المرسل الظاهر:</strong> " +
      escapeHtml(msg.displayName || "") +
      "</div>" +
      "<div><strong>عنوان المرسل:</strong> <code>" +
      escapeHtml(msg.from || "") +
      "</code></div>" +
      "<div><strong>Reply-To:</strong> <code>" +
      escapeHtml(msg.replyTo || "") +
      "</code></div>" +
      "<div><strong>الموضوع:</strong> " +
      escapeHtml(msg.subject || "") +
      "</div>" +
      "<div><strong>وقت الاستلام:</strong> " +
      escapeHtml(msg.receivedAt || "") +
      "</div>";
    msgBox.appendChild(meta);
    var body = el("pre", "sim-email-body", msg.body || "");
    msgBox.appendChild(body);
    if (msg.note) msgBox.appendChild(el("p", "sim-note", msg.note));
    mount.appendChild(msgBox);

    // Safety
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

    // Form
    var form = el("form", "sim-form");
    form.setAttribute("novalidate", "true");
    form.appendChild(el("h3", null, "المهام"));

    (assessment.questions || []).forEach(function (q, idx) {
      var fieldset = el("fieldset", "sim-q");
      var legend = el("legend", null, "سؤال " + (idx + 1));
      fieldset.appendChild(legend);
      fieldset.appendChild(el("p", "sim-prompt", q.prompt));

      if (q.type === "multi" || q.type === "single") {
        (q.options || []).forEach(function (opt) {
          var label = el("label", "sim-option");
          var input = document.createElement("input");
          input.type = q.type === "multi" ? "checkbox" : "radio";
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
        ta.placeholder = q.placeholder || "";
        ta.className = "sim-textarea";
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
      var fd = new FormData(form);
      form.querySelectorAll('input[name="q1"]:checked').forEach(function (inp) {
        answers.q1.push(inp.value);
      });
      answers.q2 = (form.querySelector('input[name="q2"]:checked') || {}).value || null;
      answers.q3 = (form.querySelector('input[name="q3"]:checked') || {}).value || null;
      answers.q4 = (form.querySelector('[name="q4"]') || {}).value || "";

      var outcome = score(assessment, answers);
      resultBox.hidden = false;
      resultBox.innerHTML = "";
      resultBox.className =
        "sim-result " + (outcome.complete ? "sim-result-ok" : "sim-result-bad");

      resultBox.appendChild(
        el(
          "h3",
          null,
          outcome.complete ? "اكتمل المختبر" : "لم يكتمل بعد — راجع التغذية الراجعة"
        )
      );
      var list = el("ul");
      list.appendChild(el("li", null, "المؤشرات: " + (outcome.q1ok ? "مستوفاة" : "غير مستوفاة")));
      list.appendChild(el("li", null, "السياق: " + (outcome.q2ok ? "صحيح" : "غير صحيح")));
      list.appendChild(el("li", null, "القرار: " + (outcome.q3ok ? "صحيح" : "غير صحيح")));
      list.appendChild(el("li", null, "التبرير: " + (outcome.q4ok ? "مقبول" : "يحتاج تحسينًا")));
      resultBox.appendChild(list);
      outcome.messages.forEach(function (m) {
        resultBox.appendChild(el("p", null, m));
      });

      try {
        sessionStorage.setItem(
          "labs:result:lab-soc-phishing-email-01",
          JSON.stringify({
            at: Date.now(),
            complete: outcome.complete,
            parts: {
              q1: outcome.q1ok,
              q2: outcome.q2ok,
              q3: outcome.q3ok,
              q4: outcome.q4ok
            }
          })
        );
      } catch (err) {}

      var resLink = document.createElement("a");
      resLink.className = "btn-labs btn-labs-ghost";
      resLink.href =
        "/academy/labs/results.html?id=" +
        encodeURIComponent(content.id || "lab-soc-phishing-email-01");
      resLink.textContent = "عرض صفحة النتائج";
      resultBox.appendChild(resLink);
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    mount.appendChild(form);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  global.LabsRunners.simulation = {
    id: "simulation",
    init: async function (ctx) {
      if (!ctx || !ctx.mount) return;
      var labId = ctx.labId || (ctx.meta && ctx.meta.id);
      if (!labId) {
        ctx.mount.innerHTML =
          "<p class='phase-note'>حدد معرف المختبر في الرابط: <code>?id=lab-soc-phishing-email-01</code></p>";
        return;
      }
      ctx.mount.innerHTML = "<p>جاري تحميل محتوى المختبر…</p>";
      try {
        var meta = ctx.meta;
        if (!meta && global.LabsData) {
          var index = await global.LabsData.loadLabsIndex();
          meta = global.LabsData.getLabById(index, labId);
        }
        if (!meta) throw new Error("المختبر غير موجود في السجل");
        var contentUrl = pageDataUrl(meta.contentRef);
        var assessUrl = pageDataUrl(meta.assessmentRef);
        var content = await fetchJson(contentUrl);
        var assessment = await fetchJson(assessUrl);
        render(ctx, content, assessment);
      } catch (e) {
        ctx.mount.innerHTML =
          "<p class='phase-note'>تعذر تحميل المختبر: " +
          escapeHtml(e.message || String(e)) +
          "</p>";
        console.warn(e);
      }
    }
  };
})(window);
