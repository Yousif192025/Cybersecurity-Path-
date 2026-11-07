/**
 * Labs Center — Digital Forensics investigation runner
 * Multi-stage interactive case: intake → evidence → process tree →
 * timeline rebuild → classification → response/report.
 * Generic over content + assessment JSON (no hard-coded lab branching beyond schema).
 */
(function (global) {
  global.LabsRunners = global.LabsRunners || {};

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== "") n.textContent = text;
    return n;
  }

  function labsPageBase() {
    try {
      var path = global.location && global.location.pathname ? global.location.pathname : "";
      var i = path.lastIndexOf("/");
      if (i >= 0) return path.slice(0, i + 1);
    } catch (e) {}
    return "";
  }

  function pageDataUrl(ref) {
    if (!ref) return null;
    if (/^https?:\/\//i.test(ref)) return ref;
    var clean = String(ref).replace(/^\/?data\//, "");
    return labsPageBase() + "data/" + clean;
  }

  function resultsPageUrl(labId) {
    if (global.LabsRouter && typeof global.LabsRouter.labResults === "function") {
      return global.LabsRouter.labResults(labId || "");
    }
    return labsPageBase() + "results.html?id=" + encodeURIComponent(labId || "");
  }

  async function fetchJson(url) {
    var res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error("fetch failed " + res.status + " " + url);
    return res.json();
  }

  function asArray(v) {
    return Array.isArray(v) ? v : [];
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  /** Pure scoring — unit-testable */
  function scoreForensics(assessment, answers) {
    var fb = (assessment && assessment.feedback) || {};
    var messages = [];
    var parts = {
      explore: false,
      timeline: false,
      classification: false,
      response: false,
      report: false
    };

    answers = answers || {};
    var opened = asArray(answers.panelsOpened);
    var minPanels =
      typeof assessment.minPanelsOpened === "number" ? assessment.minPanelsOpened : 4;
    var processOk = assessment.requireProcessInspect ? !!answers.processInspected : true;
    parts.explore = opened.length >= minPanels && processOk;
    if (!parts.explore) messages.push(fb.explore_bad || "استكشاف غير كافٍ");

    var expected = asArray(assessment.timelineOrder);
    var given = asArray(answers.timelineOrder);
    var tlHits = 0;
    var n = Math.min(expected.length, given.length);
    for (var i = 0; i < n; i++) {
      if (expected[i] === given[i]) tlHits += 1;
    }
    var minTl =
      typeof assessment.minTimelineCorrect === "number"
        ? assessment.minTimelineCorrect
        : expected.length;
    parts.timeline = expected.length > 0 && tlHits >= minTl;
    if (!parts.timeline) messages.push(fb.timeline_bad || "ترتيب زمني غير مكتمل");
    else messages.push(fb.timeline_ok || "");

    var key = assessment.classificationKey || {};
    var classAns = answers.classification || {};
    var classHits = 0;
    Object.keys(key).forEach(function (cid) {
      if (classAns[cid] && classAns[cid] === key[cid]) classHits += 1;
    });
    var minClass =
      typeof assessment.minClassificationHits === "number"
        ? assessment.minClassificationHits
        : Object.keys(key).length;
    parts.classification = classHits >= minClass;
    if (!parts.classification) messages.push(fb.class_bad || "تصنيف غير كافٍ");
    else messages.push(fb.class_ok || "");

    var respOk = answers.responseId === assessment.correctResponseId;
    parts.response = !!respOk;
    if (!parts.response) messages.push(fb.response_bad || "استجابة غير مناسبة");
    else messages.push(fb.response_ok || "");

    var reportText = typeof answers.reportText === "string" ? answers.reportText : "";
    var rep = assessment.report || {};
    var minLen = typeof rep.minLength === "number" ? rep.minLength : 40;
    var kws = asArray(rep.keywords);
    var minKw = typeof rep.minKeywordHits === "number" ? rep.minKeywordHits : 3;
    var lower = reportText.toLowerCase();
    var kwHits = 0;
    kws.forEach(function (k) {
      if (k && lower.indexOf(String(k).toLowerCase()) !== -1) kwHits += 1;
    });
    parts.report = reportText.length >= minLen && kwHits >= minKw;
    if (!parts.report) messages.push(fb.report_bad || "تقرير غير كافٍ");
    else messages.push(fb.report_ok || "");

    var complete =
      parts.explore &&
      parts.timeline &&
      parts.classification &&
      parts.response &&
      parts.report;

    messages = messages.filter(Boolean);
    return {
      complete: complete,
      parts: parts,
      feedback: complete ? fb.complete || "مكتمل" : fb.incomplete || "غير مكتمل",
      report: {
        timelineHits: tlHits,
        classificationHits: classHits,
        keywordHits: kwHits,
        panelsOpened: opened.slice(),
        messages: messages
      }
    };
  }

  function render(ctx, content, assessment) {
    var mount = ctx.mount;
    mount.innerHTML = "";
    mount.className = (mount.className || "") + " lab-df";

    var state = {
      stage: 0,
      panelsOpened: {},
      processInspected: false,
      timelineOrder: shuffle(asArray(content.events).map(function (e) {
        return e.id;
      })),
      classification: {},
      responseId: "",
      reportText: ""
    };

    var stages = asArray(content.stages);
    if (!stages.length) {
      stages = [
        { id: "intake", title: "استلام القضية" },
        { id: "evidence", title: "فحص الأدلة" },
        { id: "process", title: "العمليات" },
        { id: "timeline", title: "الخط الزمني" },
        { id: "classify", title: "التصنيف" },
        { id: "response", title: "التقرير" }
      ];
    }

    var header = el("header", "df-header");
    header.appendChild(el("h2", null, content.title || "تحقيق جنائي رقمي"));
    header.appendChild(el("p", "df-muted", content.intro || ""));
    mount.appendChild(header);

    if (content.safety && content.safety.length) {
      var saf = el("section", "df-block df-safety");
      saf.appendChild(el("h3", null, "سلامة التدريب"));
      var su = el("ul");
      content.safety.forEach(function (s) {
        su.appendChild(el("li", null, s));
      });
      saf.appendChild(su);
      mount.appendChild(saf);
    }

    var progress = el("nav", "df-progress");
    progress.setAttribute("aria-label", "مراحل التحقيق");
    mount.appendChild(progress);

    var stageMount = el("div", "df-stage-mount");
    mount.appendChild(stageMount);

    var navBar = el("div", "df-nav-bar");
    var btnPrev = el("button", "btn-labs btn-labs-ghost", "السابق");
    btnPrev.type = "button";
    var btnNext = el("button", "btn-labs btn-labs-primary", "التالي");
    btnNext.type = "button";
    navBar.appendChild(btnPrev);
    navBar.appendChild(btnNext);
    mount.appendChild(navBar);

    var resultBox = el("div", "df-result");
    resultBox.hidden = true;
    mount.appendChild(resultBox);

    function refreshProgress() {
      progress.innerHTML = "";
      stages.forEach(function (st, idx) {
        var b = el("button", "df-step" + (idx === state.stage ? " is-active" : ""), st.title || st.id);
        b.type = "button";
        if (idx <= state.stage) b.classList.add("is-reached");
        b.addEventListener("click", function () {
          if (idx <= state.stage) {
            state.stage = idx;
            renderStage();
          }
        });
        progress.appendChild(b);
      });
      btnPrev.disabled = state.stage === 0;
      btnNext.textContent = state.stage >= stages.length - 1 ? "إرسال التقييم" : "التالي";
    }

    function eventById(id) {
      return asArray(content.events).filter(function (e) {
        return e.id === id;
      })[0];
    }

    function renderIntake() {
      var box = el("section", "df-block");
      box.appendChild(el("h3", null, "ملخص القضية"));
      var ctx = content.context || {};
      var dl = el("div", "df-meta-grid");
      [
        ["المؤسسة", ctx.org],
        ["الجهاز", ctx.host + (ctx.os ? " — " + ctx.os : "")],
        ["المستخدم", ctx.user],
        ["دورك", ctx.role],
        ["النطاق", ctx.scope]
      ].forEach(function (row) {
        if (!row[1]) return;
        var cell = el("div", "df-meta-cell");
        cell.appendChild(el("strong", null, row[0]));
        cell.appendChild(el("span", null, row[1]));
        dl.appendChild(cell);
      });
      box.appendChild(dl);

      var file = content.file || {};
      var fileCard = el("div", "df-file-card");
      fileCard.appendChild(el("h4", null, "الملف المشبوه"));
      var pre = el("pre", "df-pre");
      pre.textContent = [
        "الاسم: " + (file.name || ""),
        "المسار: " + (file.path || ""),
        "الحجم: " + (file.sizeLabel || file.sizeBytes || ""),
        "SHA-256: " + (file.sha256 || ""),
        "PID عند التشغيل: " + (file.pid || ""),
        "الناشر: " + (file.publisher || "")
      ].join("\n");
      fileCard.appendChild(pre);
      var copyBtn = el("button", "btn-labs btn-labs-ghost df-copy", "نسخ SHA-256");
      copyBtn.type = "button";
      copyBtn.addEventListener("click", function () {
        var h = file.sha256 || "";
        if (global.navigator && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(h).catch(function () {});
        }
        copyBtn.textContent = "تم النسخ";
        setTimeout(function () {
          copyBtn.textContent = "نسخ SHA-256";
        }, 1500);
      });
      fileCard.appendChild(copyBtn);
      box.appendChild(fileCard);
      box.appendChild(
        el(
          "p",
          "df-muted",
          "هدفك: فحص الأدلة، إعادة بناء التسلسل، التمييز بين المؤكد وغير المثبت، ثم اقتراح استجابة مهنية."
        )
      );
      return box;
    }

    function renderEvidence() {
      var wrap = el("section", "df-block");
      wrap.appendChild(el("h3", null, "لوحة الأدلة"));
      wrap.appendChild(
        el("p", "df-muted", "اختر كل لوحة لقراءة التفاصيل. الاستكشاف جزء من التقييم.")
      );
      var layout = el("div", "df-layout");
      var nav = el("aside", "df-side");
      var detail = el("div", "df-detail");
      detail.appendChild(el("p", "df-muted", "اختر دليلًا من القائمة."));
      layout.appendChild(nav);
      layout.appendChild(detail);
      wrap.appendChild(layout);

      asArray(content.evidencePanels).forEach(function (panel, idx) {
        var btn = el("button", "df-side-btn", panel.title || panel.id);
        btn.type = "button";
        btn.addEventListener("click", function () {
          nav.querySelectorAll(".df-side-btn").forEach(function (b) {
            b.classList.remove("is-active");
          });
          btn.classList.add("is-active");
          state.panelsOpened[panel.id] = true;
          detail.innerHTML = "";
          detail.appendChild(el("h4", null, panel.title || panel.id));
          var pre = el("pre", "df-pre");
          pre.textContent = asArray(panel.lines).join("\n");
          detail.appendChild(pre);
          if (panel.id === "panel-file" && content.file && content.file.sha256) {
            var copy = el("button", "btn-labs btn-labs-ghost df-copy", "نسخ SHA-256");
            copy.type = "button";
            copy.addEventListener("click", function () {
              if (navigator.clipboard) navigator.clipboard.writeText(content.file.sha256).catch(function () {});
            });
            detail.appendChild(copy);
          }
        });
        nav.appendChild(btn);
        if (idx === 0) btn.click();
      });
      return wrap;
    }

    function renderProcessNode(node, depth) {
      var row = el("div", "df-proc-node");
      row.style.marginInlineStart = depth * 0.85 + "rem";
      var btn = el("button", "df-proc-btn", node.label || node.id);
      btn.type = "button";
      btn.addEventListener("click", function () {
        state.processInspected = true;
        row.querySelectorAll(".df-proc-meta").forEach(function (m) {
          m.hidden = !m.hidden;
        });
      });
      row.appendChild(btn);
      if (node.meta) {
        var meta = el("div", "df-proc-meta df-muted", node.meta);
        meta.hidden = true;
        row.appendChild(meta);
      }
      var frag = document.createDocumentFragment();
      frag.appendChild(row);
      asArray(node.children).forEach(function (ch) {
        frag.appendChild(renderProcessNode(ch, depth + 1));
      });
      return frag;
    }

    function renderProcess() {
      var wrap = el("section", "df-block");
      wrap.appendChild(el("h3", null, "شجرة العمليات"));
      wrap.appendChild(
        el("p", "df-muted", "انقر العقد لمعاينة التفاصيل وربط الملف بـ PowerShell.")
      );
      var tree = el("div", "df-tree");
      var root = (content.processTree && content.processTree.root) || null;
      if (root) tree.appendChild(renderProcessNode(root, 0));
      wrap.appendChild(tree);
      asArray(content.processTree && content.processTree.notes).forEach(function (n) {
        wrap.appendChild(el("p", "df-hint", n));
      });
      return wrap;
    }

    function renderTimeline() {
      var wrap = el("section", "df-block");
      wrap.appendChild(el("h3", null, "إعادة بناء الخط الزمني"));
      wrap.appendChild(
        el(
          "p",
          "df-muted",
          "رتّب الأحداث من الأقدم إلى الأحدث باستخدام الأسهم. اختر حدثًا لعرض تفاصيله."
        )
      );
      var list = el("div", "df-timeline-list");
      var detail = el("div", "df-timeline-detail df-muted", "اختر حدثًا لعرض التفاصيل.");

      function redraw() {
        list.innerHTML = "";
        state.timelineOrder.forEach(function (id, idx) {
          var ev = eventById(id) || { id: id, title: id, time: "?", detail: "" };
          var row = el("div", "df-tl-row");
          var rank = el("span", "df-tl-rank", String(idx + 1));
          var body = el("button", "df-tl-body", (ev.time || "") + " — " + (ev.title || id));
          body.type = "button";
          body.addEventListener("click", function () {
            detail.textContent = (ev.time || "") + " | " + (ev.title || "") + " — " + (ev.detail || "");
          });
          var actions = el("div", "df-tl-actions");
          var up = el("button", "btn-labs btn-labs-ghost df-mini", "↑");
          up.type = "button";
          up.disabled = idx === 0;
          up.addEventListener("click", function () {
            if (idx === 0) return;
            var t = state.timelineOrder[idx - 1];
            state.timelineOrder[idx - 1] = state.timelineOrder[idx];
            state.timelineOrder[idx] = t;
            redraw();
          });
          var down = el("button", "btn-labs btn-labs-ghost df-mini", "↓");
          down.type = "button";
          down.disabled = idx === state.timelineOrder.length - 1;
          down.addEventListener("click", function () {
            if (idx >= state.timelineOrder.length - 1) return;
            var t = state.timelineOrder[idx + 1];
            state.timelineOrder[idx + 1] = state.timelineOrder[idx];
            state.timelineOrder[idx] = t;
            redraw();
          });
          actions.appendChild(up);
          actions.appendChild(down);
          row.appendChild(rank);
          row.appendChild(body);
          row.appendChild(actions);
          list.appendChild(row);
        });
      }
      redraw();
      wrap.appendChild(list);
      wrap.appendChild(detail);
      return wrap;
    }

    function renderClassify() {
      var wrap = el("section", "df-block");
      wrap.appendChild(el("h3", null, "تصنيف النتائج"));
      wrap.appendChild(
        el(
          "p",
          "df-muted",
          "صنّف كل عبارة: مؤكد بالأدلة / مرجح / غير مثبت / مضلل أو غير كافٍ."
        )
      );
      var labels = assessment.classificationLabels || {
        confirmed: "مؤكد بالأدلة",
        likely: "مرجح",
        unproven: "غير مثبت",
        misleading: "مضلل / غير كافٍ"
      };
      asArray(content.classificationItems).forEach(function (item) {
        var row = el("div", "df-class-row");
        row.appendChild(el("div", "df-class-label", item.label || item.id));
        var sel = document.createElement("select");
        sel.setAttribute("data-class-for", item.id);
        sel.appendChild(new Option("— اختر —", ""));
        Object.keys(labels).forEach(function (k) {
          sel.appendChild(new Option(labels[k], k));
        });
        if (state.classification[item.id]) sel.value = state.classification[item.id];
        sel.addEventListener("change", function () {
          state.classification[item.id] = sel.value;
        });
        row.appendChild(sel);
        wrap.appendChild(row);
      });
      return wrap;
    }

    function renderResponse() {
      var wrap = el("section", "df-block");
      wrap.appendChild(el("h3", null, "الاستجابة والتقرير الختامي"));
      wrap.appendChild(el("h4", null, "إجراء الاستجابة"));
      asArray(content.responseOptions).forEach(function (opt) {
        var lab = el("label", "df-radio-row");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "df-response";
        input.value = opt.id;
        if (state.responseId === opt.id) input.checked = true;
        input.addEventListener("change", function () {
          state.responseId = opt.id;
        });
        lab.appendChild(input);
        lab.appendChild(el("span", null, opt.label || opt.id));
        wrap.appendChild(lab);
      });
      wrap.appendChild(el("h4", null, "تقرير التحقيق"));
      wrap.appendChild(
        el(
          "p",
          "df-muted",
          "اكتب ملخصًا: ما حدث، الأدلة الأساسية، التسلسل، ما ثبت وما لم يثبت، مستوى الثقة، والتوصيات."
        )
      );
      var ta = document.createElement("textarea");
      ta.className = "df-report";
      ta.rows = 8;
      ta.placeholder =
        "مثال: على HR-WS-027 للمستخدم n.salem ظهر Payroll_Export_v2.exe بعد دخول من 203.0.113.88 ثم تشغيل PID 5188 مع powershell واتصال updates-cdn وإنشاء config.dat. لا دليل على تسريب بيانات أو انتشار...";
      ta.value = state.reportText || "";
      ta.addEventListener("input", function () {
        state.reportText = ta.value;
      });
      wrap.appendChild(ta);
      return wrap;
    }

    function collectAnswers() {
      return {
        panelsOpened: Object.keys(state.panelsOpened),
        processInspected: !!state.processInspected,
        timelineOrder: state.timelineOrder.slice(),
        classification: Object.assign({}, state.classification),
        responseId: state.responseId,
        reportText: state.reportText || ""
      };
    }

    function submit() {
      var scored = scoreForensics(assessment, collectAnswers());
      var resultId = content.labKey || content.id || assessment.id || "lab";
      try {
        sessionStorage.setItem(
          "labs:result:" + resultId,
          JSON.stringify({
            complete: scored.complete,
            parts: scored.parts,
            feedback: scored.feedback,
            report: scored.report,
            labId: resultId,
            at: Date.now()
          })
        );
      } catch (e) {}

      resultBox.hidden = false;
      resultBox.innerHTML = "";
      resultBox.className =
        "df-result " + (scored.complete ? "df-result-ok" : "df-result-bad");
      resultBox.appendChild(
        el("p", null, scored.complete ? "النتيجة: مكتمل" : "النتيجة: غير مكتمل")
      );
      resultBox.appendChild(el("p", null, scored.feedback || ""));
      var ul = el("ul");
      Object.keys(scored.parts).forEach(function (k) {
        ul.appendChild(el("li", null, k + ": " + (scored.parts[k] ? "نعم" : "لا")));
      });
      resultBox.appendChild(ul);
      asArray(scored.report && scored.report.messages).forEach(function (m) {
        resultBox.appendChild(el("p", "df-muted", m));
      });
      var go = el("a", "btn-labs btn-labs-primary", "عرض صفحة النتائج");
      go.href = resultsPageUrl(resultId);
      resultBox.appendChild(go);
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function renderStage() {
      refreshProgress();
      stageMount.innerHTML = "";
      var id = stages[state.stage] && stages[state.stage].id;
      var node;
      if (id === "intake") node = renderIntake();
      else if (id === "evidence") node = renderEvidence();
      else if (id === "process") node = renderProcess();
      else if (id === "timeline") node = renderTimeline();
      else if (id === "classify") node = renderClassify();
      else node = renderResponse();
      stageMount.appendChild(node);
    }

    btnPrev.addEventListener("click", function () {
      if (state.stage > 0) {
        state.stage -= 1;
        renderStage();
      }
    });
    btnNext.addEventListener("click", function () {
      if (state.stage >= stages.length - 1) {
        submit();
      } else {
        state.stage += 1;
        renderStage();
      }
    });

    renderStage();
  }

  global.LabsDigitalForensicsScore = {
    scoreForensics: scoreForensics
  };

  global.LabsRunners["digital-forensics"] = {
    init: async function (ctx) {
      var mount = ctx && ctx.mount;
      var labId = ctx && ctx.labId;
      if (!mount) return;
      mount.innerHTML = "";
      mount.appendChild(el("p", null, "جاري تحميل مختبر التحقيق الجنائي…"));
      try {
        var meta = ctx.meta;
        if (!meta && global.LabsData && labId) {
          var index = await global.LabsData.loadLabsIndex();
          meta = global.LabsData.getLabById(index, labId);
        }
        if (!meta || !meta.contentRef || !meta.assessmentRef) {
          throw new Error("تعذر تحديد ملفات المحتوى/التقييم");
        }
        var content = await fetchJson(pageDataUrl(meta.contentRef));
        var assessment = await fetchJson(pageDataUrl(meta.assessmentRef));
        content.labKey = labId || content.id || assessment.id || "lab";
        render(ctx, content, assessment);
      } catch (e) {
        mount.innerHTML = "";
        mount.appendChild(
          el("p", "df-result-bad", "تعذر تشغيل المختبر: " + (e.message || e))
        );
      }
    }
  };
})(window);
