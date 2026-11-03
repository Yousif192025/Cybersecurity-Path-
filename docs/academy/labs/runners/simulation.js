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

  function isPlainObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  function asArray(v) {
    return Array.isArray(v) ? v : null;
  }

  /** Non-negative finite number bound; invalid -> null (caller fail-closes). */
  function isValidBound(v) {
    return typeof v === "number" && isFinite(v) && v >= 0 && !isNaN(v);
  }

  function scoreMulti(q, keyPart, selected, fb, messages) {
    selected = Array.isArray(selected) ? selected : [];
    keyPart = isPlainObject(keyPart) ? keyPart : {};
    var correctIds = asArray(keyPart.correctIds) || [];
    var distractors = asArray(keyPart.distractorIds) || [];
    var hits = selected.filter(function (id) {
      return includesId(correctIds, id);
    });
    var fps = selected.filter(function (id) {
      return includesId(distractors, id);
    });

    // Fail-closed: missing/invalid/empty correctIds never pass (even minCorrect: 0)
    var ok = false;
    if (Array.isArray(keyPart.correctIds) && correctIds.length) {
      var minCorrect = correctIds.length;
      var minCorrectInvalid = false;
      if (Object.prototype.hasOwnProperty.call(keyPart, "minCorrect")) {
        var mc = keyPart.minCorrect;
        // Must be finite non-negative integer, not exceeding correctIds.length
        if (
          typeof mc !== "number" ||
          !isFinite(mc) ||
          isNaN(mc) ||
          mc < 0 ||
          Math.floor(mc) !== mc ||
          mc > correctIds.length
        ) {
          minCorrectInvalid = true;
        } else {
          minCorrect = mc;
        }
      }
      if (!minCorrectInvalid) {
        ok = hits.length >= minCorrect;
      }
    }
    if (Object.prototype.hasOwnProperty.call(keyPart, "maxFalsePositives")) {
      var maxFP = keyPart.maxFalsePositives;
      if (!isValidBound(maxFP)) {
        ok = false;
      } else if (fps.length > maxFP) {
        ok = false;
      }
    }

    if (fps.length) {
      var map = isPlainObject(keyPart.distractorFeedback)
        ? keyPart.distractorFeedback
        : {};
      fps.forEach(function (fid) {
        if (map[fid] && fb[map[fid]]) pushUnique(messages, fb[map[fid]]);
        else if (fb[q.id + "_distractor_" + fid])
          pushUnique(messages, fb[q.id + "_distractor_" + fid]);
      });
      if (fb[q.id + "_time"]) pushUnique(messages, fb[q.id + "_time"]);
    }

    if (!ok) {
      if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
      if (fb.partialIndicators) pushUnique(messages, fb.partialIndicators);
    }

    return { ok: ok, critical: false };
  }

  function scoreSingle(q, keyPart, val, fb, messages) {
    keyPart = isPlainObject(keyPart) ? keyPart : {};
    val = val == null || val === "" ? null : val;

    var criticalIds = asArray(keyPart.criticalIds) || [];
    if (includesId(criticalIds, val)) {
      if (fb[q.id + "_critical_" + val])
        pushUnique(messages, fb[q.id + "_critical_" + val]);
      else if (fb[q.id + "_" + val]) pushUnique(messages, fb[q.id + "_" + val]);
      else if (fb[q.id + "_wrong"]) pushUnique(messages, fb[q.id + "_wrong"]);
      return { ok: false, critical: true };
    }

    var ok = false;
    var acceptable = asArray(keyPart.acceptableIds);
    if (acceptable && acceptable.length) {
      ok = includesId(acceptable, val);
    } else if (Object.prototype.hasOwnProperty.call(keyPart, "correctId")) {
      // null/undefined correctId is not a valid answer key
      if (keyPart.correctId == null) ok = false;
      else ok = val === keyPart.correctId;
    } else {
      ok = false;
    }

    if (!ok) {
      if (fb[q.id + "_" + val]) pushUnique(messages, fb[q.id + "_" + val]);
      else if (fb[q.id + "_wrong"]) pushUnique(messages, fb[q.id + "_wrong"]);
    }
    return { ok: ok, critical: false };
  }

  function scoreText(q, keyPart, answer, fb, messages) {
    keyPart = isPlainObject(keyPart) ? keyPart : {};
    // Reject non-string answers — no String() coercion
    if (typeof answer !== "string") {
      if (q && fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
      if (q && fb.q4_weak && q.id === "q4") pushUnique(messages, fb.q4_weak);
      return { ok: false, critical: false };
    }
    var text = answer.trim();
    var ok = false;

    // Resolve minLength with fail-closed on invalid explicit values
    var minLen = 20;
    if (Object.prototype.hasOwnProperty.call(keyPart, "minLength")) {
      if (!isValidBound(keyPart.minLength)) {
        if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
        return { ok: false, critical: false };
      }
      minLen = keyPart.minLength;
    } else if (q && Object.prototype.hasOwnProperty.call(q, "minLength")) {
      if (!isValidBound(q.minLength)) {
        if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
        return { ok: false, critical: false };
      }
      minLen = q.minLength;
    }
    var longEnough = text.length >= minLen;
    var lower = text.toLowerCase();

    var axes = asArray(keyPart.axes);
    if (axes && axes.length) {
      var axisHits = 0;
      axes.forEach(function (axis) {
        if (!isPlainObject(axis)) return;
        var kws = asArray(axis.keywords) || [];
        var hit = kws.some(function (kw) {
          return keywordHit(lower, kw);
        });
        if (hit) axisHits++;
      });
      var need = axes.length;
      if (Object.prototype.hasOwnProperty.call(keyPart, "minAxisHits")) {
        if (!isValidBound(keyPart.minAxisHits) || keyPart.minAxisHits > axes.length) {
          if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
          return { ok: false, critical: false };
        }
        need = keyPart.minAxisHits;
      }
      ok = longEnough && axisHits >= need;
    } else {
      var hints = asArray(keyPart.hintKeywords) || [];
      var kwHits = 0;
      hints.forEach(function (kw) {
        if (keywordHit(lower, kw)) kwHits++;
      });
      var minKw = 2;
      if (Object.prototype.hasOwnProperty.call(keyPart, "minKeywordHits")) {
        if (!isValidBound(keyPart.minKeywordHits)) {
          if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
          return { ok: false, critical: false };
        }
        minKw = keyPart.minKeywordHits;
      }
      if (!hints.length) {
        ok = longEnough && minKw === 0;
      } else {
        ok = longEnough && kwHits >= minKw;
      }

      if (ok && keyPart.requireDecisionTheme) {
        var decisionList = asArray(keyPart.decisionKeywords);
        if (!decisionList || !decisionList.length) {
          decisionList = hints.filter(isDecisionOrientedKeyword);
        }
        var decisionHits = 0;
        decisionList.forEach(function (kw) {
          if (keywordHit(lower, kw)) decisionHits++;
        });
        var minDec = 1;
        if (Object.prototype.hasOwnProperty.call(keyPart, "minDecisionHits")) {
          if (!isValidBound(keyPart.minDecisionHits)) {
            ok = false;
          } else {
            minDec = keyPart.minDecisionHits;
            if (decisionHits < minDec) ok = false;
          }
        } else if (decisionHits < minDec) {
          ok = false;
        }
      }
    }

    if (!ok) {
      if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
      if (fb.q4_weak && q.id === "q4") pushUnique(messages, fb.q4_weak);
    }
    return { ok: ok, critical: false };
  }

  function scoreQuestion(q, keyPart, answer, fb, messages) {
    if (!isPlainObject(q) || !q.id) {
      return { ok: false, critical: false };
    }
    if (!isPlainObject(keyPart)) {
      if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
      else if (fb[q.id + "_wrong"]) pushUnique(messages, fb[q.id + "_wrong"]);
      return { ok: false, critical: false };
    }
    if (q.type === "multi") return scoreMulti(q, keyPart, answer, fb, messages);
    if (q.type === "single") return scoreSingle(q, keyPart, answer, fb, messages);
    if (q.type === "text") return scoreText(q, keyPart, answer, fb, messages);
    if (fb[q.id + "_weak"]) pushUnique(messages, fb[q.id + "_weak"]);
    return { ok: false, critical: false };
  }

  function scoreAll(assessment, answers) {
    if (!isPlainObject(assessment)) {
      return {
        complete: false,
        critical: false,
        parts: {},
        messages: ["بيانات التقييم غير صالحة."]
      };
    }
    var key = isPlainObject(assessment.key) ? assessment.key : {};
    var fb = isPlainObject(assessment.feedback) ? assessment.feedback : {};
    var questions = asArray(assessment.questions);
    if (!questions) questions = [];
    answers = isPlainObject(answers) ? answers : {};

    var parts = {};
    var critical = false;
    var allOk = true;
    var messages = [];

    if (!questions.length) {
      allOk = false;
      pushUnique(messages, fb.incomplete || "لا توجد أسئلة قابلة للتقييم.");
    }

    questions.forEach(function (q) {
      if (!isPlainObject(q) || !q.id) {
        allOk = false;
        return;
      }
      var r = scoreQuestion(q, key[q.id], answers[q.id], fb, messages);
      parts[q.id] = !!r.ok;
      if (r.critical) critical = true;
      if (!r.ok) allOk = false;
    });

    if (!Object.keys(key).length && questions.length) {
      allOk = false;
    }

    var complete = allOk && !critical;
    if (complete) {
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
    if (!form || !Array.isArray(questions)) return answers;
    questions.forEach(function (q) {
      if (!isPlainObject(q) || q.id == null || q.id === "") return;
      var id = String(q.id);
      if (q.type === "multi") {
        answers[id] = [];
        var list = form.elements.namedItem(id);
        if (!list) return;
        // RadioNodeList or single element
        if (typeof list.length === "number" && list.nodeType == null) {
          for (var i = 0; i < list.length; i++) {
            if (list[i] && list[i].checked) answers[id].push(list[i].value);
          }
        } else if (list.checked) {
          answers[id].push(list.value);
        }
      } else if (q.type === "single") {
        var sel = null;
        var nodes = form.elements.namedItem(id);
        if (nodes) {
          if (typeof nodes.length === "number" && nodes.nodeType == null) {
            for (var j = 0; j < nodes.length; j++) {
              if (nodes[j] && nodes[j].checked) {
                sel = nodes[j];
                break;
              }
            }
          } else if (nodes.checked) {
            sel = nodes;
          }
        }
        answers[id] = sel ? sel.value : null;
      } else if (q.type === "text") {
        var ta = form.elements.namedItem(id);
        answers[id] = ta && typeof ta.value === "string" ? ta.value : "";
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

    var questions = Array.isArray(assessment && assessment.questions)
      ? assessment.questions
      : [];
    var renderedCount = 0;
    var invalidData = false;
    if (!questions.length) {
      invalidData = true;
      form.appendChild(
        el("p", "sim-note", "بيانات التقييم غير صالحة: لا توجد أسئلة للعرض.")
      );
    }
    questions.forEach(function (q, idx) {
      if (!q || typeof q !== "object" || q.id == null || q.id === "") {
        invalidData = true;
        form.appendChild(
          el("p", "sim-note", "بيانات غير صالحة: سؤال بدون معرّف (#" + (idx + 1) + ").")
        );
        return;
      }
      if (!q.type || (q.type !== "multi" && q.type !== "single" && q.type !== "text")) {
        invalidData = true;
        form.appendChild(
          el(
            "p",
            "sim-note",
            "بيانات غير صالحة: نوع سؤال غير معروف للمعرّف " + String(q.id) + "."
          )
        );
        return;
      }
      var fieldset = el("fieldset", "sim-q");
      fieldset.appendChild(
        el("legend", null, q.section || "سؤال " + (idx + 1))
      );
      fieldset.appendChild(el("p", "sim-prompt", q.prompt || ""));
      if (q.type === "multi" || q.type === "single") {
        var opts = Array.isArray(q.options) ? q.options : [];
        var validOpts = 0;
        opts.forEach(function (opt) {
          if (!opt || typeof opt !== "object" || opt.id == null) {
            invalidData = true;
            return;
          }
          validOpts++;
          var label = el("label", "sim-option");
          var input = document.createElement("input");
          input.type = q.type === "multi" ? "checkbox" : "radio";
          input.name = String(q.id);
          input.value = String(opt.id);
          label.appendChild(input);
          label.appendChild(
            document.createTextNode(" " + (opt.label != null ? String(opt.label) : ""))
          );
          fieldset.appendChild(label);
        });
        if (!validOpts) {
          invalidData = true;
          fieldset.appendChild(
            el("p", "sim-note", "بيانات غير صالحة: لا توجد خيارات صالحة لهذا السؤال.")
          );
        }
      } else if (q.type === "text") {
        var ta = document.createElement("textarea");
        ta.name = String(q.id);
        ta.rows = 4;
        ta.className = "sim-textarea";
        ta.placeholder = q.placeholder || "";
        fieldset.appendChild(ta);
      }
      form.appendChild(fieldset);
      renderedCount++;
    });
    if (invalidData) {
      form.appendChild(
        el(
          "p",
          "sim-note",
          "تعذّر بناء نموذج تقييم كامل بسبب بيانات غير صالحة. لن يُقبل الإرسال."
        )
      );
    }

    var actions = el("div", "sim-actions");
    var submit = el("button", "btn-labs btn-labs-primary", "إرسال الإجابات");
    submit.type = "submit";
    if (invalidData || !renderedCount) {
      submit.disabled = true;
      submit.setAttribute("aria-disabled", "true");
    }
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
