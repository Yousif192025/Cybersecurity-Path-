/**
 * external-guided runner — Phase 2 Pilot
 * Loads guided JSON, opens official external URL, local self-attested completion + quiz.
 * Does not contact external APIs or verify third-party completion.
 */
(function (global) {
  "use strict";

  global.LabsRunners = global.LabsRunners || {};

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null && text !== "") node.textContent = text;
    return node;
  }

  function storageKey(id) {
    return "labs:guided:" + id;
  }

  function loadState(id) {
    try {
      var raw = global.sessionStorage.getItem(storageKey(id));
      if (!raw) return { status: "not_started" };
      var data = JSON.parse(raw);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return { status: "not_started" };
      }
      var allowedStatuses = ["not_started", "in_progress", "completed_self"];
      if (allowedStatuses.indexOf(data.status) === -1) {
        return { status: "not_started" };
      }
      if (data.labId != null && data.labId !== id) {
        return { status: "not_started" };
      }
      if (data.status === "completed_self" &&
          (data.labId !== id || data.attested !== true ||
           typeof data.completedAt !== "string")) {
        return { status: "not_started" };
      }
      return data;
    } catch (e) {
      return { status: "not_started" };
    }
  }

  function saveState(id, state) {
    try {
      global.sessionStorage.setItem(storageKey(id), JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  function safeExternalUrl(value) {
    try {
      var url = new URL(value, global.location.href);
      var host = url.hostname.toLowerCase();
      if (
        url.protocol !== "https:" ||
        !(host === "portswigger.net" || host.endsWith(".portswigger.net"))
      ) return null;
      return url.href;
    } catch (e) {
      return null;
    }
  }

  function pageDataUrl(ref) {
    if (typeof ref !== "string" || !ref) return null;

    var clean = ref.replace(/\\/g, "/");
    if (clean.charAt(0) === "/" || /^[a-z][a-z0-9+.-]*:/i.test(clean)) {
      return null;
    }
    if (clean.indexOf("data/") === 0) clean = clean.slice(5);

    var segments = clean.split("/");
    if (
      !clean ||
      /[?#]/.test(clean) ||
      segments.some(function (part) {
        return !part || part === "." || part === "..";
      })
    ) return null;

    var base = (global.LabsRouter && global.LabsRouter.BASE) || "/academy/labs/";
    base = base.replace(/\/+$/, "") + "/";
    return base + "data/" + clean;
  }

  function fetchJson(url) {
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
      return res.json();
    });
  }

  function list(items, className) {
    var ul = el("ul", className || "eg-list");
    (items || []).forEach(function (t) {
      ul.appendChild(el("li", null, typeof t === "string" ? t : String(t)));
    });
    return ul;
  }

  function render(ctx, content, meta) {
    var mount = ctx.mount;
    mount.innerHTML = "";
    var root = el("div", "lab-eg");
    var labId = content.id || ctx.labId || (meta && meta.id);

    root.appendChild(el("p", "eg-eyebrow", "تجربة موجّهة عالميًا · Phase 2 Pilot"));
    root.appendChild(el("h2", "eg-title", content.title || labId));
    if (content.titleEn) root.appendChild(el("p", "eg-title-en", content.titleEn));

    var access = content.access || (meta && meta.access) || "";
    var badgeRow = el("div", "eg-badges");
    badgeRow.appendChild(el("span", "labs-badge", "external_guided"));
    if (access) badgeRow.appendChild(el("span", "labs-badge", access));
    if (content.requiresAccount) badgeRow.appendChild(el("span", "labs-badge", "يتطلب حسابًا"));
    else if (content.accountRecommended)
      badgeRow.appendChild(el("span", "labs-badge", "حساب مُوصى به"));
    root.appendChild(badgeRow);

    var disc = el(
      "div",
      "eg-disclaimer",
      (content.completion && content.completion.disclaimer) ||
        "الإكمال داخل CyberPath إقرار تعلّمي ولا يثبت إكمالًا آليًا لدى المنصة الخارجية."
    );
    root.appendChild(disc);

    if (content.learningObjectives && content.learningObjectives.length) {
      root.appendChild(el("h3", "eg-h", "أهداف التعلم"));
      root.appendChild(list(content.learningObjectives));
    }

    if (content.prerequisites && content.prerequisites.length) {
      root.appendChild(el("h3", "eg-h", "متطلبات سابقة"));
      root.appendChild(list(content.prerequisites));
    }

    if (content.preDepartureChecklist && content.preDepartureChecklist.length) {
      root.appendChild(el("h3", "eg-h", "قبل المغادرة إلى المنصة الخارجية"));
      root.appendChild(list(content.preDepartureChecklist));
    }

    if (content.guidedSteps && content.guidedSteps.length) {
      root.appendChild(el("h3", "eg-h", "خطوات موجّهة"));
      var ol = el("ol", "eg-steps");
      content.guidedSteps.forEach(function (s) {
        var li = el("li", "eg-step");
        li.appendChild(el("strong", null, s.title || s.id || ""));
        if (s.detail) li.appendChild(el("p", "eg-step-detail", s.detail));
        ol.appendChild(li);
      });
      root.appendChild(ol);
    }

    if (content.safetyNotes && content.safetyNotes.length) {
      root.appendChild(el("h3", "eg-h", "ملاحظات السلامة"));
      root.appendChild(list(content.safetyNotes, "eg-list eg-safety"));
    }

    var externalUrl = safeExternalUrl(
      content.externalUrl || (meta && meta.externalUrl) || ""
    );
    var actions = el("div", "eg-actions");
    if (externalUrl) {
      var a = el("a", "btn-labs btn-labs-primary eg-external-btn", "افتح المختبر على PortSwigger");
      a.href = externalUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      actions.appendChild(a);
    } else {
      actions.appendChild(
        el("p", "eg-feedback eg-bad", "رابط المختبر غير صالح أو ليس على نطاق PortSwigger الرسمي.")
      );
    }
    if (content.relatedInternalLabId && global.LabsRouter) {
      var back = el("a", "btn-labs btn-labs-ghost", "المختبر الداخلي المرتبط");
      back.href = global.LabsRouter.labDetails(content.relatedInternalLabId);
      actions.appendChild(back);
    }
    root.appendChild(actions);

    var state = loadState(labId);
    var initialSaveFailed = false;
    if (state.status === "not_started") {
      state = { status: "in_progress", startedAt: new Date().toISOString() };
      initialSaveFailed = !saveState(labId, state);
    }

    var completePanel = el("section", "eg-complete-panel");
    completePanel.appendChild(el("h3", "eg-h", "التحقق والإكمال في CyberPath"));
    completePanel.appendChild(
      el("p", "eg-muted", "تنبيه: يُحفظ التقدم في جلسة التبويب الحالية فقط، ولا يُزامن مع حساب أو قاعدة بيانات.")
    );
    if (initialSaveFailed) {
      completePanel.appendChild(
        el("p", "eg-feedback eg-bad", "تعذر حفظ بداية الجلسة في تخزين المتصفح؛ لن يُحتسب التقدم ما لم يعمل التخزين.")
      );
    }
    completePanel.appendChild(
      el(
        "p",
        "eg-muted",
        "بعد محاولتك على المنصة الخارجية، أجب عن السؤال التالي وأقرّ بالإكمال التعلّمي."
      )
    );

    var quiz = (content.reflectionQuestions && content.reflectionQuestions[0]) || null;
    var sel = null;
    if (quiz) {
      completePanel.appendChild(el("p", "eg-quiz-prompt", quiz.prompt || ""));
      sel = document.createElement("select");
      sel.className = "eg-input";
      sel.setAttribute("aria-label", "سؤال التحقق");
      var empty = document.createElement("option");
      empty.value = "";
      empty.textContent = "— اختر إجابة —";
      sel.appendChild(empty);
      (quiz.options || []).forEach(function (o) {
        var opt = document.createElement("option");
        opt.value = o.id;
        opt.textContent = o.label || o.id;
        sel.appendChild(opt);
      });
      if (state.quizAnswer) sel.value = state.quizAnswer;
      completePanel.appendChild(sel);
    }

    var attRow = el("label", "eg-attest");
    var attCb = document.createElement("input");
    attCb.type = "checkbox";
    attCb.className = "eg-attest-cb";
    if (state.attested) attCb.checked = true;
    attRow.appendChild(attCb);
    attRow.appendChild(
      document.createTextNode(
        " أُقرّ بأنني فتحت المختبر الخارجي وحاولت إكمال هدفه، وأن هذا الإكمال تعلّمي داخل CyberPath فقط."
      )
    );
    completePanel.appendChild(attRow);

    var feedback = el("div", "eg-feedback");
    if (state.status === "completed_self") {
      feedback.className = "eg-feedback eg-ok";
      feedback.textContent = "تم حفظ الإكمال التعلّمي محليًا في هذه الجلسة.";
    }
    completePanel.appendChild(feedback);

    var btn = el("button", "btn-labs btn-labs-primary eg-save-btn", "حفظ الإكمال التعلّمي");
    btn.type = "button";
    btn.addEventListener("click", function () {
      feedback.className = "eg-feedback";
      feedback.textContent = "";
      var answer = sel ? sel.value : "";
      if (quiz && answer !== quiz.correctId) {
        feedback.className = "eg-feedback eg-bad";
        feedback.textContent = "إجابة التحقق غير صحيحة. راجع مفهوم شرط WHERE ثم أعد المحاولة.";
        state.quizAnswer = answer;
        state.status = "in_progress";
        if (!saveState(labId, state)) {
          feedback.textContent += " تعذر حفظ الإجابة في جلسة المتصفح.";
        }
        statusLine.textContent = "حالة الجلسة: " + state.status;
        return;
      }
      if (!attCb.checked) {
        feedback.className = "eg-feedback eg-bad";
        feedback.textContent = "يلزم تأشير إقرار الإكمال التعلّمي.";
        return;
      }
      state = {
        status: "completed_self",
        quizAnswer: answer,
        attested: true,
        completedAt: new Date().toISOString(),
        labId: labId
      };
      if (!saveState(labId, state)) {
        feedback.className = "eg-feedback eg-bad";
        feedback.textContent = "تعذر حفظ الإكمال في جلسة المتصفح. تحقق من إعدادات التخزين ثم أعد المحاولة.";
        return;
      }
      statusLine.textContent = "حالة الجلسة: completed_self";
      feedback.className = "eg-feedback eg-ok";
      feedback.textContent =
        "تم الحفظ في جلسة المتصفح الحالية. الإكمال تعلّمي محلي وليس اعتمادًا من PortSwigger.";
    });
    completePanel.appendChild(btn);

    var statusLine = el(
      "p",
      "eg-status-line",
      "حالة الجلسة: " + (state.status || "not_started")
    );
    completePanel.appendChild(statusLine);

    root.appendChild(completePanel);
    mount.appendChild(root);
  }

  global.LabsRunners["external-guided"] = {
    id: "external-guided",
    init: function (ctx) {
      if (!ctx || !ctx.mount) return;
      var mount = ctx.mount;
      mount.innerHTML = "";
      mount.appendChild(el("p", "eg-loading", "جاري تحميل التجربة الموجّهة…"));

      var meta = ctx.meta || null;
      var labId = (meta && meta.id) || ctx.labId;
      if (!labId) {
        mount.innerHTML = "";
        mount.appendChild(el("p", "eg-feedback eg-bad", "معرّف التجربة غير محدد."));
        return;
      }

      function fail(msg) {
        mount.innerHTML = "";
        mount.appendChild(el("p", "eg-feedback eg-bad", msg));
      }

      var ref = (meta && meta.contentRef) || ("guided/" + labId + ".json");
      var url = pageDataUrl(ref);
      if (!url) {
        fail("مسار محتوى التجربة غير صالح.");
        return;
      }

      fetchJson(url)
        .then(function (content) {
          if (
            !content ||
            content.id !== labId ||
            content.type !== "external_guided"
          ) {
            fail("بيانات التجربة غير متطابقة: تحقق من المعرّف ونوع التجربة في ملف JSON.");
            return;
          }
          if (content && content.linkStatus && content.linkStatus.lastStatus === "broken") {
            fail("رابط التجربة موسوم كغير متاح. لا يمكن بدء التشغيل.");
            return;
          }
          render(ctx, content, meta);
        })
        .catch(function (e) {
          fail("تعذر تحميل بيانات التجربة الموجّهة. " + (e && e.message ? e.message : ""));
        });
    }
  };
})(window);
