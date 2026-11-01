/**
 * Simulation runner — generic assessment engine.
 * Compatible with Lab 1 keys/feedback and Lab 6 acceptableIds/criticalIds/axes.
 * No per-lab-id branches.
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
    if (!res.ok) throw new Error("HTTP " + res.status + " " + url);
    return res.json();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function includesId(arr, id) {
    return Array.isArray(arr) && arr.indexOf(id) !== -1;
  }

  function pushUnique(list, msg) {
    if (msg && list.indexOf(msg) === -1) list.push(msg);
  }

  function keywordHit(textLower, kw) {
    return textLower.indexOf(String(kw).toLowerCase()) !== -1;
  }

  /**
   * When requireDecisionTheme is true without explicit decisionKeywords,
   * treat hintKeywords matching these stems as decision-oriented.
   */
  function isDecisionOrientedKeyword(kw) {
    var s = String(kw).toLowerCase().trim();
    var phrases = [
      "إبلاغ", "ابلاغ", "بلغ",
      "لا أفتح", "لا افتح", "لا أضغط", "لا اضغط",
      "عدم فتح", "عدم الضغط", "عدم التفاعل",
      "عزل", "تصعيد", "توثيق", "تجاهل",
      "حذف", "احتواء", "توصية"
    ];
    return phrases.some(function (phrase) {
      return s.indexOf(phrase) !== -1;
    });
  }

  function scoreMulti(q, keyPart, selected, fb, messages) {
    selected = Array.isArray(selected) ? selected : [];
    keyPart = keyPart || {};
    var correctIds = keyPart.correctIds || [];
    var distractors = keyPart.distractorIds || [];
    var minCorrect =
      keyPart.minCorrect != null ? keyPart.minCorrect : correctIds.length;
    var hits = selected.filter(function (id) {
      return includesId(correctIds, id);
    });
    var fps = selected.filter(function (id) {
      return includesId(distractors, id);
    });

    // maxFalsePositives: only enforced when the property is present (Lab 1 omits it)
    var ok = hits.length >= minCorrect;
    if (Object.prototype.hasOwnProperty.call(keyPart, "maxFalsePositives")) {
      var maxFP = keyPart.maxFalsePositives;
      if (typeof maxFP === "number" && fps.length > maxFP) ok = false;
    }

    // Distractor feedback (e.g. Lab 1 q1_time) without failing when maxFP absent
    if (fps.length) {
      // Named map in key: distractorFeedback: { "i6": "q1_time" }
      var map = keyPart.distractorFeedback || {};
      fps.forEach(function (fid) {
        if (map[fid] && fb[map[fid]]) pushUnique(messages, fb[map[fid]]);
        else if (fb[q.id + "_distractor_" + fid])
          pushUnique(messages, fb[q.id + "_distractor_" + fid]);
      });
      // Conventional feedback key: <qId>_time when any distractor selected
      if (fb[q.id + "_time"]) pushUnique(messages, fb[q.id + "_time"]);
    }

    if (!ok) {
      if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
      if (fb.partialIndicators) pushUnique(messages, fb.partialIndicators);
    }

    return { ok: ok, critical: false };
  }

  function scoreSingle(q, keyPart, val, fb, messages) {
    keyPart = keyPart || {};
    val = val || null;

    if (includesId(keyPart.criticalIds, val)) {
      if (fb[q.id + "_critical_" + val])
        pushUnique(messages, fb[q.id + "_critical_" + val]);
      else if (fb[q.id + "_" + val]) pushUnique(messages, fb[q.id + "_" + val]);
      else if (fb[q.id + "_wrong"]) pushUnique(messages, fb[q.id + "_wrong"]);
      return { ok: false, critical: true };
    }

    var ok = false;
    if (Array.isArray(keyPart.acceptableIds) && keyPart.acceptableIds.length) {
      ok = includesId(keyPart.acceptableIds, val);
    } else if (keyPart.correctId != null) {
      ok = val === keyPart.correctId;
    } else {
      ok = true;
    }

    if (!ok) {
      if (fb[q.id + "_" + val]) pushUnique(messages, fb[q.id + "_" + val]);
      else if (fb[q.id + "_wrong"]) pushUnique(messages, fb[q.id + "_wrong"]);
    }
    return { ok: ok, critical: false };
  }

  function scoreText(q, keyPart, answer, fb, messages) {
    keyPart = keyPart || {};
    var text = String(answer || "").trim();
    var minLen =
      keyPart.minLength != null
        ? keyPart.minLength
        : q.minLength != null
          ? q.minLength
          : 20;
    var lower = text.toLowerCase();
    var longEnough = text.length >= minLen;
    var ok = false;

    if (Array.isArray(keyPart.axes) && keyPart.axes.length) {
      var axisHits = 0;
      keyPart.axes.forEach(function (axis) {
        var hit = (axis.keywords || []).some(function (kw) {
          return keywordHit(lower, kw);
        });
        if (hit) axisHits++;
      });
      var need =
        keyPart.minAxisHits != null ? keyPart.minAxisHits : keyPart.axes.length;
      ok = longEnough && axisHits >= need;
    } else {
      var hints = keyPart.hintKeywords || [];
      var kwHits = 0;
      hints.forEach(function (kw) {
        if (keywordHit(lower, kw)) kwHits++;
      });
      var minKw = keyPart.minKeywordHits != null ? keyPart.minKeywordHits : 2;
      ok = longEnough && (hints.length ? kwHits >= minKw : longEnough);

      // requireDecisionTheme: must also reflect action/decision, not indicators only
      if (ok && keyPart.requireDecisionTheme) {
        var decisionList = keyPart.decisionKeywords;
        if (!Array.isArray(decisionList) || !decisionList.length) {
          decisionList = hints.filter(isDecisionOrientedKeyword);
        }
        var decisionHits = 0;
        decisionList.forEach(function (kw) {
          if (keywordHit(lower, kw)) decisionHits++;
        });
        var minDec =
          keyPart.minDecisionHits != null ? keyPart.minDecisionHits : 1;
        if (decisionHits < minDec) ok = false;
      }
    }

    if (!ok) {
      if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
      else if (fb.q4_weak) pushUnique(messages, fb.q4_weak);
      else if (fb.q5_weak) pushUnique(messages, fb.q5_weak);
    }
    return { ok: ok, critical: false };
  }

  function scoreQuestion(q, keyPart, answer, fb, messages) {
    if (!keyPart) return { ok: true, critical: false };
    if (q.type === "multi") return scoreMulti(q, keyPart, answer, fb, messages);
    if (q.type === "single") return scoreSingle(q, keyPart, answer, fb, messages);
    if (q.type === "text") return scoreText(q, keyPart, answer, fb, messages);
    return { ok: true, critical: false };
  }

  function scoreAll(assessment, answers) {
    var key = assessment.key || {};
    var fb = assessment.feedback || {};
    var questions = assessment.questions || [];
    var parts = {};
    var critical = false;
    var allOk = true;
    var messages = [];

    questions.forEach(function (q) {
      var r = scoreQuestion(q, key[q.id], answers[q.id], fb, messages);
      parts[q.id] = r.ok;
      if (r.critical) critical = true;
      if (!r.ok) allOk = false;
    });

    var complete = allOk && !critical;
    if (complete) {
      // Keep soft advisories (e.g. distractor time note) after success
      var advisories = messages.slice();
      messages = [fb.success || "أحسنت."];
      advisories.forEach(function (m) {
        if (m && m !== messages[0] && messages.indexOf(m) === -1) messages.push(m);
      });
    }

    return {
      complete: complete,
      critical: critical,
      parts: parts,
      messages: messages
    };
  }

  function collectAnswers(form, questions) {
    var answers = {};
    questions.forEach(function (q) {
      if (q.type === "multi") {
        answers[q.id] = [];
        form
          .querySelectorAll('input[name="' + q.id + '"]:checked')
          .forEach(function (inp) {
            answers[q.id].push(inp.value);
          });
      } else if (q.type === "single") {
        var sel = form.querySelector('input[name="' + q.id + '"]:checked');
        answers[q.id] = sel ? sel.value : null;
      } else if (q.type === "text") {
        var ta = form.querySelector('[name="' + q.id + '"]');
        answers[q.id] = ta ? ta.value : "";
      }
    });
    return answers;
  }

  function render(ctx, content, assessment) {
    var mount = ctx.mount;
    mount.innerHTML = "";
    mount.classList.add("lab-sim");

    mount.appendChild(el("h2", null, "تشغيل المحاكاة"));
    if (content.intro) mount.appendChild(el("p", "sim-intro", content.intro));

    if (content.context) {
      var ctxBox = el("section", "sim-block");
      ctxBox.appendChild(el("h3", null, "السياق"));
      var ul = el("ul");
      Object.keys(content.context).forEach(function (k) {
        ul.appendChild(el("li", null, content.context[k]));
      });
      ctxBox.appendChild(ul);
      mount.appendChild(ctxBox);
    }

    if (content.alertCard) {
      var ac = el("section", "sim-block");
      ac.appendChild(el("h3", null, content.alertCard.title || "التنبيه"));
      var al = el("ul");
      (content.alertCard.lines || []).forEach(function (line) {
        al.appendChild(el("li", null, line));
      });
      ac.appendChild(al);
      if (content.processDetails) {
        var pd = content.processDetails;
        ac.appendChild(
          el(
            "p",
            "sim-note",
            "تفاصيل عملية رمزية: " +
              (pd.name || "") +
              " | " +
              (pd.path || "") +
              " | PID " +
              (pd.pid || "") +
              " | وجهة " +
              (pd.destination || "")
          )
        );
      }
      mount.appendChild(ac);
    }

    if (content.message) {
      var msg = content.message;
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
      msgBox.appendChild(el("pre", "sim-email-body", msg.body || ""));
      if (msg.note) msgBox.appendChild(el("p", "sim-note", msg.note));
      mount.appendChild(msgBox);
    }

    if (content.events && content.events.length) {
      var tb = el("section", "sim-block");
      tb.appendChild(el("h3", null, "الجدول الزمني للأدلة"));
      var table = document.createElement("table");
      table.className = "sim-log-table";
      table.innerHTML =
        "<thead><tr><th>المعرّف</th><th>الوقت</th><th>الحدث</th><th>ملاحظة</th></tr></thead>";
      var tbody = document.createElement("tbody");
      content.events.forEach(function (row) {
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td><code>" +
          escapeHtml(row.id) +
          "</code></td><td>" +
          escapeHtml(row.time || "") +
          "</td><td>" +
          escapeHtml(row.event || "") +
          "</td><td>" +
          escapeHtml(row.note || "") +
          "</td>";
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      tb.appendChild(table);
      mount.appendChild(tb);
    }

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

    if (content.instructions && content.instructions.length) {
      var ins = el("section", "sim-block");
      ins.appendChild(el("h3", null, "التعليمات"));
      var iu = el("ul");
      content.instructions.forEach(function (s) {
        iu.appendChild(el("li", null, s));
      });
      ins.appendChild(iu);
      mount.appendChild(ins);
    }

    var form = el("form", "sim-form");
    form.setAttribute("novalidate", "true");
    form.appendChild(el("h3", null, "المهام"));

    var questions = assessment.questions || [];
    questions.forEach(function (q, idx) {
      var fieldset = el("fieldset", "sim-q");
      fieldset.appendChild(
        el("legend", null, q.section || "سؤال " + (idx + 1))
      );
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
      var answers = collectAnswers(form, questions);
      var outcome = scoreAll(assessment, answers);

      resultBox.hidden = false;
      resultBox.className =
        "sim-result " + (outcome.complete ? "sim-result-ok" : "sim-result-bad");
      resultBox.innerHTML = "";
      resultBox.appendChild(
        el(
          "h3",
          null,
          outcome.complete
            ? "اكتمل المختبر"
            : outcome.critical
              ? "لم يكتمل — خطأ حرج في الاستجابة أو الإجراء"
              : "لم يكتمل بعد — راجع التغذية الراجعة"
        )
      );
      var list = el("ul");
      questions.forEach(function (q) {
        list.appendChild(
          el(
            "li",
            null,
            (q.section || q.id) +
              ": " +
              (outcome.parts[q.id] ? "مستوفى" : "غير مستوفى")
          )
        );
      });
      resultBox.appendChild(list);
      outcome.messages.forEach(function (m) {
        resultBox.appendChild(el("p", null, m));
      });

      try {
        sessionStorage.setItem(
          "labs:result:" + (content.id || assessment.id || "lab"),
          JSON.stringify({
            at: Date.now(),
            complete: outcome.complete,
            critical: outcome.critical,
            parts: outcome.parts
          })
        );
      } catch (err) {}

      var resLink = document.createElement("a");
      resLink.className = "btn-labs btn-labs-ghost";
      resLink.href =
         "results.html?id=" +
        encodeURIComponent(content.id || assessment.id || "");
      resLink.textContent = "عرض صفحة النتائج";
      resultBox.appendChild(resLink);
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    mount.appendChild(form);
  }

  // Export scoreAll for automated tests (Node / console)
  global.LabsSimulationScore = { scoreAll: scoreAll };

  global.LabsRunners.simulation = {
    id: "simulation",
    init: async function (ctx) {
      if (!ctx || !ctx.mount) return;
      var labId = ctx.labId || (ctx.meta && ctx.meta.id);
      if (!labId) {
        ctx.mount.innerHTML =
          "<p class='phase-note'>حدد معرف المختبر: <code>?id=…&runner=simulation</code></p>";
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
        var content = await fetchJson(pageDataUrl(meta.contentRef));
        var assessment = await fetchJson(pageDataUrl(meta.assessmentRef));
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
})(typeof window !== "undefined" ? window : global);
