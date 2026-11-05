/**
 * Labs Center — Network configuration assessment runner
 * Interactive evidence explorer + worksheet (discover / risk / priority / remediate).
 * Generic over content.devices + content.findings + assessment keys (no labId branching).
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
    // Relative to current labs page directory (works on Vercel and Codespaces)
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

  function includesId(arr, id) {
    return asArray(arr).indexOf(id) !== -1;
  }

  /** Pure scoring — exported for unit tests */
  function scoreNetworkAssessment(assessment, answers) {
    var messages = [];
    var fb = assessment.feedback || {};
    var weaknessIds = asArray(assessment.weaknessIds);
    var secureIds = asArray(assessment.secureIds);
    var selected = asArray(answers && answers.selectedWeaknesses);
    var risks = (answers && answers.risks) || {};
    var priority = asArray(answers && answers.priorityOrder);
    var remediation = (answers && answers.remediation) || {};

    var hits = selected.filter(function (id) {
      return includesId(weaknessIds, id);
    });
    var fps = selected.filter(function (id) {
      return includesId(secureIds, id) || (!includesId(weaknessIds, id) && !includesId(secureIds, id));
    });
    // only count secureIds as FP; unknown ids also FP
    fps = selected.filter(function (id) {
      return !includesId(weaknessIds, id);
    });

    var minW = typeof assessment.minWeaknesses === "number" ? assessment.minWeaknesses : weaknessIds.length;
    var maxFP =
      typeof assessment.maxFalsePositives === "number" ? assessment.maxFalsePositives : 0;

    var discoverOk = hits.length >= minW && fps.length <= maxFP;
    if (!discoverOk) {
      if (hits.length < minW) messages.push(fb.discover_weak || "اكتشاف غير كافٍ");
      if (fps.length > maxFP) messages.push(fb.discover_fp || "إيجابيات كاذبة");
    }

    var riskKey = assessment.riskKey || {};
    var riskHits = 0;
    weaknessIds.forEach(function (wid) {
      if (includesId(selected, wid) && risks[wid] && risks[wid] === riskKey[wid]) {
        riskHits += 1;
      }
    });
    var minRisk =
      typeof assessment.minRiskCorrect === "number" ? assessment.minRiskCorrect : weaknessIds.length;
    // Only grade risk for selected true weaknesses; require min among selected true or overall
    var selectedTrue = hits.length;
    var riskNeed = Math.min(minRisk, Math.max(selectedTrue, 0));
    var riskOk = selectedTrue === 0 ? false : riskHits >= Math.min(minRisk, selectedTrue);
    if (selectedTrue > 0 && riskHits < Math.min(minRisk, selectedTrue)) {
      riskOk = false;
    }
    if (selectedTrue >= minW) {
      riskOk = riskHits >= Math.min(minRisk, selectedTrue);
    } else {
      riskOk = false;
    }
    if (!riskOk) messages.push(fb.risk_weak || "تصنيف خطورة غير كافٍ");

    var top = asArray(assessment.priorityTop);
    var minPri =
      typeof assessment.minPriorityHits === "number" ? assessment.minPriorityHits : 2;
    // Deduplicate while preserving order; only keep true weaknesses the learner selected
    var priSeen = {};
    var priClean = [];
    priority.forEach(function (id) {
      if (!id || priSeen[id]) return;
      priSeen[id] = true;
      if (includesId(weaknessIds, id) && includesId(selected, id)) {
        priClean.push(id);
      }
    });
    // Count how many of the expected high-priority items appear in the leading slots
    var leadN = Math.min(Math.max(top.length, minPri), priClean.length);
    var priHits = 0;
    for (var i = 0; i < leadN; i++) {
      if (includesId(top, priClean[i])) priHits += 1;
    }
    // Also require no leading junk: first minPri entries should all be in priorityTop when enough items listed
    var leadingOk = true;
    var checkN = Math.min(minPri, priClean.length);
    for (var j = 0; j < checkN; j++) {
      if (!includesId(top, priClean[j])) leadingOk = false;
    }
    if (priClean.length < minPri) leadingOk = false;
    var priorityOk = discoverOk && priHits >= minPri && leadingOk;
    if (!priorityOk) messages.push(fb.priority_weak || "أولوية غير مناسبة");

    var remKey = assessment.remediationKey || {};
    var remHits = 0;
    hits.forEach(function (wid) {
      if (remediation[wid] && remediation[wid] === remKey[wid]) remHits += 1;
    });
    var minRem =
      typeof assessment.minRemediationCorrect === "number"
        ? assessment.minRemediationCorrect
        : 4;
    var remediationOk = discoverOk && remHits >= Math.min(minRem, hits.length);
    if (!remediationOk) messages.push(fb.remediation_weak || "معالجة غير مناسبة");

    var complete = !!(discoverOk && riskOk && priorityOk && remediationOk);

    var report = {
      discoveredCorrect: hits.slice(),
      discoveredMissed: weaknessIds.filter(function (id) {
        return !includesId(selected, id);
      }),
      falsePositives: fps.slice(),
      riskHits: riskHits,
      riskNeed: Math.min(minRisk, Math.max(hits.length, 1)),
      priorityHits: priHits,
      remediationHits: remHits,
      messages: messages
    };

    return {
      complete: complete,
      parts: {
        discover: discoverOk,
        risk: riskOk,
        priority: priorityOk,
        remediation: remediationOk
      },
      report: report,
      feedback: complete ? fb.success || "" : fb.partial || messages[0] || ""
    };
  }

  function render(ctx, content, assessment) {
    var mount = ctx.mount;
    mount.innerHTML = "";
    mount.classList.add("lab-net");

    mount.appendChild(el("h2", null, "تقييم إعدادات الشبكة"));
    if (content.intro) mount.appendChild(el("p", "net-intro", content.intro));

    if (content.context) {
      var ctxBox = el("section", "net-block");
      ctxBox.appendChild(el("h3", null, "السياق"));
      var ul = el("ul");
      Object.keys(content.context).forEach(function (k) {
        ul.appendChild(el("li", null, content.context[k]));
      });
      ctxBox.appendChild(ul);
      mount.appendChild(ctxBox);
    }

    if (content.safety && content.safety.length) {
      var saf = el("section", "net-block");
      saf.appendChild(el("h3", null, "السلامة"));
      var su = el("ul");
      content.safety.forEach(function (s) {
        su.appendChild(el("li", null, s));
      });
      saf.appendChild(su);
      mount.appendChild(saf);
    }

    if (content.instructions && content.instructions.length) {
      var ins = el("section", "net-block");
      ins.appendChild(el("h3", null, "المطلوب"));
      var iu = el("ul");
      content.instructions.forEach(function (s) {
        iu.appendChild(el("li", null, s));
      });
      ins.appendChild(iu);
      mount.appendChild(ins);
    }

    var layout = el("div", "net-layout");
    var nav = el("aside", "net-device-nav");
    nav.appendChild(el("h3", null, "الأجهزة"));
    var detail = el("section", "net-device-detail");
    detail.appendChild(el("p", "net-muted", "اختر جهازًا لعرض إعداداته."));
    layout.appendChild(nav);
    layout.appendChild(detail);
    mount.appendChild(layout);

    var devices = asArray(content.devices);
    var findings = asArray(content.findings);

    function showDevice(dev) {
      detail.innerHTML = "";
      detail.appendChild(el("h3", null, dev.name || dev.id));
      detail.appendChild(
        el("p", "net-muted", (dev.role || "") + (dev.ip ? " — " + dev.ip : ""))
      );
      asArray(dev.sections).forEach(function (sec) {
        var box = el("div", "net-section");
        box.appendChild(el("h4", null, sec.title || ""));
        var pre = el("pre", "net-config");
        pre.textContent = asArray(sec.lines).join("\n");
        box.appendChild(pre);
        detail.appendChild(box);
      });
      var related = findings.filter(function (f) {
        return f.deviceId === dev.id;
      });
      if (related.length) {
        var hint = el("p", "net-hint", "ملاحظات مرتبطة بهذا الجهاز تظهر في ورقة العمل.");
        detail.appendChild(hint);
      }
    }

    devices.forEach(function (dev, idx) {
      var btn = el("button", "net-device-btn", dev.name || dev.id);
      btn.type = "button";
      btn.setAttribute("data-device", dev.id);
      btn.addEventListener("click", function () {
        nav.querySelectorAll(".net-device-btn").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        showDevice(dev);
      });
      nav.appendChild(btn);
      if (idx === 0) {
        btn.classList.add("is-active");
        showDevice(dev);
      }
    });

    var sheet = el("section", "net-worksheet net-block");
    sheet.appendChild(el("h3", null, "ورقة عمل التحليل"));

    var discTitle = el("h4", null, "1) اكتشاف نقاط الضعف");
    sheet.appendChild(discTitle);
    sheet.appendChild(
      el("p", "net-muted", "علّم ما تعتبره ضعفًا حقيقيًا. لا تختر الإعدادات الدفاعية السليمة.")
    );

    var findList = el("div", "net-find-list");
    findings.forEach(function (f) {
      var row = el("label", "net-find-row");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.name = "weakness";
      cb.value = f.id;
      cb.setAttribute("data-finding", f.id);
      var body = el("span", "net-find-body");
      body.appendChild(el("strong", null, f.label));
      body.appendChild(el("span", "net-muted", " — " + (f.detail || "")));
      row.appendChild(cb);
      row.appendChild(body);
      findList.appendChild(row);
    });
    sheet.appendChild(findList);

    sheet.appendChild(el("h4", null, "2) تصنيف الخطورة (للعناصر التي اخترتها)"));
    var riskBox = el("div", "net-risk-box");
    var riskOptions = asArray(assessment.riskOptions);
    findings.forEach(function (f) {
      var wrap = el("div", "net-risk-row");
      wrap.setAttribute("data-for-finding", f.id);
      wrap.appendChild(el("span", "net-risk-label", f.label));
      var sel = document.createElement("select");
      sel.name = "risk-" + f.id;
      sel.setAttribute("data-risk-for", f.id);
      sel.appendChild(new Option("— اختر —", ""));
      riskOptions.forEach(function (opt) {
        sel.appendChild(new Option(opt.label, opt.id));
      });
      wrap.appendChild(sel);
      riskBox.appendChild(wrap);
    });
    sheet.appendChild(riskBox);

    sheet.appendChild(el("h4", null, "3) ترتيب أولوية المعالجة"));
    sheet.appendChild(
      el(
        "p",
        "net-muted",
        "أدخل معرّفات نقاط الضعف التي اخترتها بالترتيب (الأهم أولًا)، مفصولة بفاصلة. مثال: f-rdp-any, f-ssh-root-pass"
      )
    );
    var idsHelp = el("p", "net-ids-help");
    idsHelp.textContent =
      "المعرّفات: " +
      findings
        .map(function (f) {
          return f.id;
        })
        .join(" | ");
    sheet.appendChild(idsHelp);
    var priInput = document.createElement("input");
    priInput.type = "text";
    priInput.className = "net-priority-input";
    priInput.name = "priorityOrder";
    priInput.placeholder = "f-…, f-…, f-…";
    priInput.setAttribute("autocomplete", "off");
    sheet.appendChild(priInput);

    sheet.appendChild(el("h4", null, "4) إجراء المعالجة لكل ضعف مختار"));
    var remBox = el("div", "net-rem-box");
    var remOptions = asArray(assessment.remediationOptions);
    findings.forEach(function (f) {
      var wrap = el("div", "net-rem-row");
      wrap.setAttribute("data-for-finding", f.id);
      wrap.appendChild(el("span", "net-risk-label", f.label));
      var sel = document.createElement("select");
      sel.name = "rem-" + f.id;
      sel.setAttribute("data-rem-for", f.id);
      sel.appendChild(new Option("— اختر إجراءً —", ""));
      remOptions.forEach(function (opt) {
        sel.appendChild(new Option(opt.label, opt.id));
      });
      wrap.appendChild(sel);
      remBox.appendChild(wrap);
    });
    sheet.appendChild(remBox);

    var submit = el("button", "btn-labs btn-labs-primary", "إرسال التحليل");
    submit.type = "button";
    sheet.appendChild(submit);

    var out = el("div", "net-result");
    out.hidden = true;
    sheet.appendChild(out);

    mount.appendChild(sheet);

    function collectAnswers() {
      var selected = [];
      findList.querySelectorAll('input[name="weakness"]:checked').forEach(function (cb) {
        selected.push(cb.value);
      });
      var risks = {};
      riskBox.querySelectorAll("select[data-risk-for]").forEach(function (sel) {
        var fid = sel.getAttribute("data-risk-for");
        if (sel.value) risks[fid] = sel.value;
      });
      var priorityOrder = (priInput.value || "")
        .split(/[,،\s]+/)
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
      var remediation = {};
      remBox.querySelectorAll("select[data-rem-for]").forEach(function (sel) {
        var fid = sel.getAttribute("data-rem-for");
        if (sel.value) remediation[fid] = sel.value;
      });
      return {
        selectedWeaknesses: selected,
        risks: risks,
        priorityOrder: priorityOrder,
        remediation: remediation
      };
    }

    submit.addEventListener("click", function () {
      var answers = collectAnswers();
      var scored = scoreNetworkAssessment(assessment, answers);
      try {
        var resultId = content.labKey || content.id || assessment.id || "lab";
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
      } catch (e) {
        /* ignore quota */
      }

      out.hidden = false;
      out.innerHTML = "";
      out.className = "net-result " + (scored.complete ? "net-result-ok" : "net-result-bad");
      out.appendChild(
        el("p", null, scored.complete ? "النتيجة: مكتمل" : "النتيجة: غير مكتمل")
      );
      out.appendChild(el("p", null, scored.feedback || ""));
      var partsUl = el("ul");
      ["discover", "risk", "priority", "remediation"].forEach(function (k) {
        partsUl.appendChild(
          el(
            "li",
            null,
            k + ": " + (scored.parts[k] ? "نعم" : "لا")
          )
        );
      });
      out.appendChild(partsUl);
      if (scored.report) {
        out.appendChild(
          el(
            "p",
            "net-muted",
            "صحيح: " +
              (scored.report.discoveredCorrect || []).join(", ") +
              " | فائت: " +
              (scored.report.discoveredMissed || []).join(", ") +
              " | إيجابيات كاذبة: " +
              (scored.report.falsePositives || []).join(", ")
          )
        );
      }
      var go = el("a", "btn-labs btn-labs-primary", "عرض صفحة النتائج");
      go.href = resultsPageUrl(content.labKey || content.id || assessment.id || "");
      out.appendChild(go);
    });
  }

  global.LabsNetworkAssessmentScore = {
    scoreNetworkAssessment: scoreNetworkAssessment
  };

  global.LabsRunners["network-assessment"] = {
    init: async function (ctx) {
      var mount = ctx && ctx.mount;
      var labId = ctx && ctx.labId;
      if (!mount) return;
      mount.innerHTML = "";
      mount.appendChild(el("p", null, "جاري تحميل مختبر إعدادات الشبكة…"));
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
        // Canonical lab id from registry/query wins over nested content.id
        content.labKey = labId || content.id || assessment.id || "lab";
        render(ctx, content, assessment);
      } catch (e) {
        mount.innerHTML = "";
        mount.appendChild(el("p", "net-result-bad", "تعذر تشغيل المختبر: " + (e.message || e)));
      }
    }
  };
})(window);
