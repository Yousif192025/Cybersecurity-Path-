/**
 * Labs Center — Penetration Testing runner (D2-A/B/C)
 * Terminal recon + Findings / Risk / Remediation workspace.
 * Independent of simulation.js / fixed-data.js.
 */
(function (global) {
  "use strict";

  global.LabsRunners = global.LabsRunners || {};

  var World = global.LabsPentestWorld;
  var Session = global.LabsPentestSession;
  var Commands = global.LabsPentestCommands;
  var Findings = global.LabsPentestFindings;

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

  function loadJson(url) {
    return new Promise(function (resolve, reject) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error("load failed " + xhr.status + " " + url));
          }
        };
        xhr.onerror = function () {
          reject(new Error("load error " + url));
        };
        xhr.send();
      } catch (e) {
        reject(e);
      }
    });
  }

  function appendLine(logEl, text, kind) {
    var k = kind || "out";
    var line = el("div", "pt-term-line pt-term-" + k + " pt-line pt-" + k);
    line.textContent = text;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function renderStatus(panel, state, world) {
    panel.innerHTML = "";
    panel.appendChild(el("h3", "pt-side-title", "حالة الجلسة"));
    var ul = el("ul", "pt-status-list");
    function item(label, val) {
      var li = el("li");
      li.appendChild(el("span", "pt-k", label + ": "));
      li.appendChild(el("span", "pt-v", val));
      ul.appendChild(li);
    }
    item("RoE", state.roeAccepted ? "مقبولة" : "غير مقبولة");
    item("مضيفون", String(Object.keys(state.discoveredHosts || {}).length));
    item("أدلة مفتوحة", String((state.unlockedEvidence || []).length));
    item("Findings", String((state.findings || []).length));
    item("مثبتة", String(
      (state.findings || []).filter(function (f) {
        return f.status === "evidence-backed" && f.classification === "confirmed_vuln";
      }).length
    ));
    item("مخالفات نطاق", String((state.roeViolations || []).length));
    item("أوامر", String((state.commandLog || []).length));
    panel.appendChild(ul);

    if (state.unlockedEvidence && state.unlockedEvidence.length) {
      panel.appendChild(el("h4", null, "أدلة مُكتشفة"));
      var ev = el("ul", "pt-evidence-list");
      state.unlockedEvidence.forEach(function (id) {
        ev.appendChild(el("li", "pt-mono", id));
      });
      panel.appendChild(ev);
    }
    panel.appendChild(el("p", "pt-hint", "WorldModel ثابت · SessionState فقط تتغيّر"));
  }

  function runCommand(raw, ctx) {
    var state = ctx.state;
    var world = ctx.world;
    var logEl = ctx.logEl;
    var statusEl = ctx.statusEl;
    var onStateChange = ctx.onStateChange;

    appendLine(logEl, "pt$ " + raw, "in");
    var result = Commands.execute(raw, world, state);
    Commands.commit(state, result);

    if (result.stdout) {
      String(result.stdout).split("\n").forEach(function (ln) {
        appendLine(logEl, ln, "out");
      });
    }
    if (result.stderr) {
      String(result.stderr).split("\n").forEach(function (ln) {
        appendLine(logEl, ln, "err");
      });
    }
    appendLine(logEl, "exit " + result.exitCode, "meta");

    state.terminalLines = state.terminalLines || [];
    state.terminalLines.push({ q: raw, code: result.exitCode });
    if (state.terminalLines.length > 200) state.terminalLines = state.terminalLines.slice(-200);

    Session.saveSession(state);
    renderStatus(statusEl, state, world);
    if (typeof onStateChange === "function") onStateChange();
    return result;
  }

  function reasonLabel(code) {
    var map = {
      MISSING_FINDING_ID: "معرّف النتيجة مفقود",
      UNKNOWN_FINDING_ID: "معرّف غير موجود في الكتالوج",
      NOT_UNLOCKED: "الدليل غير مفتوح في الجلسة",
      SUPPORTING_NOT_PROOF: "دليل داعم وليس إثباتًا مباشرًا",
      BOUND_TO_OTHER_FINDING: "الدليل مرتبط بثغرة أخرى",
      PROOF_NOT_ATTACHED: "لم تُرفق أدلة الإثبات المفتوحة",
      PROOF_NOT_UNLOCKED: "لم تُفتح أدلة الإثبات بعد (نفّذ curl المناسب)",
      NEEDS_PROOF: "يحتاج إثباتًا مباشرًا",
      TRUE_WEAKNESS_MISCLASSIFIED: "ثغرة حقيقية صُنّفت خطأ",
      FALSE_POSITIVE_AS_CONFIRMED: "عنصر آمن/مضلّل اعتُبر ثغرة مؤكدة",
      CLASSIFICATION_REQUIRED: "التصنيف مطلوب",
      BAD_CLASSIFICATION_FOR_NON_WEAKNESS: "تصنيف غير مناسب لهذا العنصر",
      SEVERITY_MISMATCH: "الخطورة لا تطابق المرجع",
      REMEDIATION_MISMATCH: "المعالجة لا تطابق نوع الثغرة",
      INVALID_REMEDIATION: "معالجة غير صالحة / ضارة",
      UNMAPPED_FINDING: "نتيجة غير معرّفة في التقييم"
    };
    return map[code] || code;
  }

  function buildFindingsWorkspace(ctx) {
    var mount = ctx.workspaceMount;
    var state = ctx.state;
    var world = ctx.world;
    var content = ctx.content;
    var assessment = ctx.assessment;
    var statusEl = ctx.statusEl;

    mount.innerHTML = "";
    var root = el("div", "pt-findings");
    mount.appendChild(root);

    root.appendChild(el("h3", "pt-ws-title", "مساحة العمل — Findings / Risk / Remediation"));
    root.appendChild(
      el(
        "p",
        "pt-lead",
        "لا يُقبل الإثبات إلا من أدلة proof المفتوحة في الجلسة. Supporting وDNS وNmap وحدها لا تُثبت ثغرة."
      )
    );

    // --- Claim form ---
    var form = el("div", "pt-finding-form");
    root.appendChild(form);
    form.appendChild(el("h4", null, "1) تسجيل Finding"));

    var selFinding = el("select", "pt-input");
    selFinding.appendChild(el("option", null, "— اختر من الكتالوج —")).value = "";
    (content.findings || []).forEach(function (f) {
      var opt = el("option", null, f.id + " — " + (f.label || ""));
      opt.value = f.id;
      selFinding.appendChild(opt);
    });
    form.appendChild(el("label", "pt-label", "Finding"));
    form.appendChild(selFinding);

    var selClass = el("select", "pt-input");
    [
      ["", "— التصنيف —"],
      ["confirmed_vuln", "ثغرة مؤكدة"],
      ["false_positive", "إيجابية كاذبة"],
      ["secure_control", "ضبط آمن"],
      ["recon_noise", "ضجيج استطلاع"],
      ["out_of_scope", "خارج النطاق"]
    ].forEach(function (pair) {
      var o = el("option", null, pair[1]);
      o.value = pair[0];
      selClass.appendChild(o);
    });
    form.appendChild(el("label", "pt-label", "التصنيف"));
    form.appendChild(selClass);

    form.appendChild(el("label", "pt-label", "أدلة الإثبات (مفتوحة في الجلسة)"));
    var evidenceBox = el("div", "pt-evidence-checks");
    form.appendChild(evidenceBox);

    function refreshEvidenceChecks() {
      evidenceBox.innerHTML = "";
      var unlocked = state.unlockedEvidence || [];
      if (!unlocked.length) {
        evidenceBox.appendChild(el("p", "pt-hint", "لا توجد أدلة مفتوحة بعد — استخدم الطرفية (curl) أولًا."));
        return;
      }
      unlocked.forEach(function (id) {
        var lab = el("label", "pt-check");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = id;
        cb.className = "pt-ev-cb";
        lab.appendChild(cb);
        lab.appendChild(document.createTextNode(" " + id));
        evidenceBox.appendChild(lab);
      });
    }
    refreshEvidenceChecks();

    form.appendChild(el("label", "pt-label", "الوصف التقني"));
    var descIn = el("textarea", "pt-input");
    descIn.rows = 2;
    form.appendChild(descIn);

    form.appendChild(el("label", "pt-label", "التأثير Impact"));
    var impactIn = el("textarea", "pt-input");
    impactIn.rows = 2;
    form.appendChild(impactIn);

    var btnAdd = el("button", "pt-btn", "حفظ / تحديث Finding");
    btnAdd.type = "button";
    form.appendChild(btnAdd);

    var feedback = el("div", "pt-feedback");
    form.appendChild(feedback);

    // --- Risk panel ---
    var riskPanel = el("div", "pt-risk-panel");
    root.appendChild(riskPanel);
    riskPanel.appendChild(el("h4", null, "2) تقييم المخاطر (Severity)"));
    var riskList = el("div", "pt-risk-list");
    riskPanel.appendChild(riskList);

    // --- Priority ---
    var priPanel = el("div", "pt-priority-panel");
    root.appendChild(priPanel);
    priPanel.appendChild(el("h4", null, "3) ترتيب الأولوية (من الأعلى للأدنى)"));
    priPanel.appendChild(
      el("p", "pt-hint", "أدخل معرّفات Findings مفصولة بفواصل حسب الأولوية.")
    );
    var priIn = el("input", "pt-input");
    priIn.placeholder = "f-ssh-password, f-admin-legacy, ...";
    priIn.value = (state.priorityOrder || []).join(", ");
    priPanel.appendChild(priIn);
    var btnPri = el("button", "pt-btn", "حفظ الترتيب");
    btnPri.type = "button";
    priPanel.appendChild(btnPri);

    // --- Remediation ---
    var remPanel = el("div", "pt-rem-panel");
    root.appendChild(remPanel);
    remPanel.appendChild(el("h4", null, "4) المعالجة Remediation"));
    var remList = el("div", "pt-rem-list");
    remPanel.appendChild(remList);

    // --- Summary ---
    var summary = el("div", "pt-findings-summary");
    root.appendChild(summary);

    function renderSummary() {
      summary.innerHTML = "";
      summary.appendChild(el("h4", null, "ملخص النتائج"));
      var score = Findings.scoreAxes(state, assessment);
      var box = el("div", "pt-score-box");
      box.appendChild(
        el(
          "p",
          null,
          "Discover: " +
            score.discover +
            " · Risk: " +
            score.risk +
            " · Priority: " +
            score.priority +
            " · Remediation: " +
            score.remediation +
            " · Σ محاور D2-C: " +
            score.axisTotal
        )
      );
      box.appendChild(
        el(
          "p",
          null,
          "ثغرات مثبتة: " +
            score.confirmedWeaknesses.join(", ") +
            (score.confirmedWeaknesses.length ? "" : "(لا يوجد)")
        )
      );
      if (score.falsePositiveCount) {
        box.appendChild(el("p", "pt-warn", "إيجابيات كاذبة مُحتسبة: " + score.falsePositiveCount));
      }
      summary.appendChild(box);

      var table = el("div", "pt-findings-table");
      (state.findings || []).forEach(function (f) {
        var row = el("div", "pt-finding-row pt-status-" + (f.status || "draft"));
        row.appendChild(
          el(
            "div",
            "pt-finding-head",
            f.findingId + " · " + (f.classification || "?") + " · " + (f.status || "")
          )
        );
        if (f.acceptedEvidence && f.acceptedEvidence.length) {
          row.appendChild(el("div", "pt-mono", "أدلة: " + f.acceptedEvidence.join(", ")));
        }
        if (f.reasons && f.reasons.length) {
          row.appendChild(
            el(
              "div",
              "pt-reasons",
              f.reasons.map(reasonLabel).join(" · ")
            )
          );
        }
        table.appendChild(row);
      });
      if (!(state.findings || []).length) {
        table.appendChild(el("p", "pt-hint", "لم تُسجَّل نتائج بعد."));
      }
      summary.appendChild(table);
    }

    function renderRiskList() {
      riskList.innerHTML = "";
      var confirmed = (state.findings || []).filter(function (f) {
        return f.status === "evidence-backed" && f.classification === "confirmed_vuln";
      });
      if (!confirmed.length) {
        riskList.appendChild(el("p", "pt-hint", "لا توجد ثغرات مثبتة لتقييم خطورتها بعد."));
        return;
      }
      confirmed.forEach(function (f) {
        var row = el("div", "pt-risk-row");
        row.appendChild(el("span", "pt-mono", f.findingId));
        var sel = el("select", "pt-input pt-risk-sel");
        sel.setAttribute("data-fid", f.findingId);
        [["", "— Severity —"]]
          .concat((assessment.riskOptions || []).map(function (o) {
            return [o.id, o.label];
          }))
          .forEach(function (pair) {
            var o = el("option", null, pair[1]);
            o.value = pair[0];
            sel.appendChild(o);
          });
        var cur =
          state.riskAssessments && state.riskAssessments[f.findingId]
            ? state.riskAssessments[f.findingId].severity
            : "";
        sel.value = cur || "";
        sel.addEventListener("change", function () {
          Findings.setRisk(state, f.findingId, sel.value);
          Session.saveSession(state);
          renderSummary();
          renderStatus(statusEl, state, world);
        });
        row.appendChild(sel);
        riskList.appendChild(row);
      });
    }

    function renderRemList() {
      remList.innerHTML = "";
      var confirmed = (state.findings || []).filter(function (f) {
        return f.status === "evidence-backed" && f.classification === "confirmed_vuln";
      });
      if (!confirmed.length) {
        remList.appendChild(el("p", "pt-hint", "لا توجد ثغرات مثبتة لاختيار المعالجة."));
        return;
      }
      confirmed.forEach(function (f) {
        var block = el("div", "pt-rem-row");
        block.appendChild(el("div", "pt-mono", f.findingId));
        var sel = el("select", "pt-input");
        sel.appendChild(el("option", null, "— معالجة —")).value = "";
        (assessment.remediationOptions || content.remediationOptions || []).forEach(function (o) {
          var opt = el("option", null, o.label || o.id);
          opt.value = o.id;
          sel.appendChild(opt);
        });
        var cur =
          state.remediations && state.remediations[f.findingId]
            ? state.remediations[f.findingId].remediationId
            : "";
        sel.value = cur || "";
        var rat = el("textarea", "pt-input");
        rat.rows = 2;
        rat.placeholder = "تبرير فني مختصر";
        if (state.remediations && state.remediations[f.findingId]) {
          rat.value = state.remediations[f.findingId].rationale || "";
        }
        var btn = el("button", "pt-btn pt-btn-small", "حفظ المعالجة");
        btn.type = "button";
        btn.addEventListener("click", function () {
          Findings.setRemediation(state, f.findingId, sel.value, rat.value);
          Session.saveSession(state);
          renderSummary();
          renderStatus(statusEl, state, world);
          feedback.textContent = "تم حفظ معالجة " + f.findingId;
          feedback.className = "pt-feedback pt-ok";
        });
        block.appendChild(sel);
        block.appendChild(rat);
        block.appendChild(btn);
        remList.appendChild(block);
      });
    }

    btnAdd.addEventListener("click", function () {
      feedback.className = "pt-feedback";
      var evidenceIds = [];
      evidenceBox.querySelectorAll(".pt-ev-cb:checked").forEach(function (cb) {
        evidenceIds.push(cb.value);
      });
      var claim = {
        findingId: selFinding.value,
        classification: selClass.value,
        evidenceIds: evidenceIds,
        description: descIn.value,
        impact: impactIn.value,
        title: "",
        severity:
          state.riskAssessments && state.riskAssessments[selFinding.value]
            ? state.riskAssessments[selFinding.value].severity
            : "",
        remediationId:
          state.remediations && state.remediations[selFinding.value]
            ? state.remediations[selFinding.value].remediationId
            : ""
      };
      var meta = (content.findings || []).filter(function (f) {
        return f.id === claim.findingId;
      })[0];
      if (meta) {
        claim.title = meta.label || "";
        claim.category = meta.category || "";
      }
      var validation = Findings.validateClaim(state, assessment, content, claim);
      var rec = Findings.buildFindingRecord(claim, validation);
      Findings.upsertFinding(state, rec);
      Session.saveSession(state);

      if (validation.ok) {
        feedback.className = "pt-feedback pt-ok";
        feedback.textContent =
          "Finding مقبول (" + validation.status + "): " + claim.findingId;
      } else {
        feedback.className = "pt-feedback pt-bad";
        feedback.textContent =
          "مرفوض / غير مكتمل — " +
          (validation.reasons || []).map(reasonLabel).join(" · ");
      }
      renderRiskList();
      renderRemList();
      renderSummary();
      renderStatus(statusEl, state, world);
    });

    btnPri.addEventListener("click", function () {
      var ids = String(priIn.value || "")
        .split(/[,\s]+/)
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
      Findings.setPriorityOrder(state, ids);
      Session.saveSession(state);
      renderSummary();
      feedback.className = "pt-feedback pt-ok";
      feedback.textContent = "تم حفظ ترتيب الأولوية (" + ids.length + ")";
    });

    renderRiskList();
    renderRemList();
    renderSummary();

    return {
      refreshEvidenceChecks: refreshEvidenceChecks,
      renderRiskList: renderRiskList,
      renderRemList: renderRemList,
      renderSummary: renderSummary
    };
  }

  function buildUi(ctx) {
    var mount = ctx.mount;
    var world = ctx.world;
    var state = ctx.state;
    var content = ctx.content;
    var assessment = ctx.assessment;
    var labId = ctx.labId || (state && state.labId) || World.LAB_ID;

    mount.innerHTML = "";
    var root = el("div", "lab-pt");
    mount.appendChild(root);

    root.appendChild(el("h2", "pt-title", "محاكاة دورة اختبار اختراق — D2-C"));
    root.appendChild(
      el(
        "p",
        "pt-lead",
        "طرفية استطلاع + مساحة Findings مرتبطة بالأدلة المفتوحة. لا اتصال شبكي حقيقي."
      )
    );

    var roePanel = el("div", "pt-roe-panel");
    roePanel.appendChild(el("h3", "pt-roe-title", "قواعد الاشتباك (RoE)"));
    var roeBody = el("div", "pt-roe-text");
    var roeLines = (world && world.roeText) || [];
    if (Array.isArray(roeLines) && roeLines.length) {
      roeLines.forEach(function (ln) {
        roeBody.appendChild(el("p", null, String(ln)));
      });
    } else {
      roeBody.appendChild(
        el(
          "p",
          null,
          "اقبل قواعد الاشتباك قبل تنفيذ أوامر الاستطلاع داخل النطاق التدريبي فقط."
        )
      );
    }
    roePanel.appendChild(roeBody);
    var roeBtn = el("button", "pt-btn pt-roe-accept", "قبول قواعد الاشتباك");
    roeBtn.type = "button";
    roeBtn.setAttribute("data-pt-roe-accept", "1");
    function syncRoeButton() {
      if (state.roeAccepted) {
        roeBtn.disabled = true;
        roeBtn.textContent = "تم قبول القواعد";
        roeBtn.setAttribute("aria-disabled", "true");
      } else {
        roeBtn.disabled = false;
        roeBtn.textContent = "قبول قواعد الاشتباك";
        roeBtn.removeAttribute("aria-disabled");
      }
    }
    syncRoeButton();
    roePanel.appendChild(roeBtn);
    root.appendChild(roePanel);

    var layout = el("div", "pt-layout");
    root.appendChild(layout);
    var main = el("div", "pt-main");
    var side = el("div", "pt-side");
    layout.appendChild(main);
    layout.appendChild(side);

    var logEl = el("div", "pt-term-log pt-terminal");
    logEl.setAttribute("role", "log");
    logEl.setAttribute("aria-live", "polite");
    logEl.setAttribute("dir", "ltr");
    main.appendChild(logEl);

    var form = el("form", "pt-term-form pt-cmd-form");
    var input = el("input", "pt-term-input pt-cmd-input");
    input.type = "text";
    input.placeholder = "help | roe accept | nmap host | curl url";
    input.autocomplete = "off";
    input.setAttribute("aria-label", "أمر الطرفية");
    var btn = el("button", "pt-btn", "تنفيذ");
    btn.type = "submit";
    form.appendChild(input);
    form.appendChild(btn);
    main.appendChild(form);

    var statusEl = el("div", "pt-status");
    side.appendChild(statusEl);

    roeBtn.addEventListener("click", function () {
      if (state.roeAccepted) return;
      state.roeAccepted = true;
      Session.saveSession(state);
      syncRoeButton();
      appendLine(
        logEl,
        "RoE accepted via UI. Recon commands are now allowed within scope.",
        "meta"
      );
      renderStatus(statusEl, state, world);
    });

    // D2-B: quick scope panel
    var scopePanel = el("div", "pt-scope-panel");
    scopePanel.appendChild(el("h3", "pt-side-title", "النطاق السريع"));
    var scopeList = el("ul", "pt-scope-list");
    var summary = (world && world.inScopeSummary) || [];
    if (Array.isArray(summary) && summary.length) {
      summary.forEach(function (line) {
        scopeList.appendChild(el("li", "pt-mono", String(line)));
      });
    } else if (world && world.hosts) {
      world.hosts.forEach(function (h) {
        if (h && h.inScope) {
          scopeList.appendChild(
            el("li", "pt-mono", (h.name || "") + (h.ip ? " (" + h.ip + ")" : ""))
          );
        }
      });
    } else {
      scopeList.appendChild(el("li", null, "—"));
    }
    scopePanel.appendChild(scopeList);
    side.appendChild(scopePanel);

    // D2-B: session reset (current lab only)
    var resetBtn = el("button", "pt-btn pt-btn-reset", "إعادة تعيين الجلسة");
    resetBtn.type = "button";
    resetBtn.setAttribute("data-pt-reset", "1");
    side.appendChild(resetBtn);
    resetBtn.addEventListener("click", function () {
      if (
        !global.confirm ||
        global.confirm("إعادة تعيين جلسة هذا المختبر فقط؟ ستُفقد الأوامر والنتائج المحفوظة محليًا.")
      ) {
        Session.clearSession(labId);
        // reload UI with fresh state
        var fresh = Session.emptyState(labId);
        try {
          buildUi({
            mount: mount,
            world: world,
            state: fresh,
            labId: labId,
            content: content,
            assessment: assessment
          });
        } catch (err) {
          mount.innerHTML = "";
          mount.appendChild(
            el("p", "pt-result-bad", "تعذر إعادة التهيئة: " + (err && err.message ? err.message : err))
          );
        }
      }
    });

    var workspaceMount = el("div", "pt-workspace");
    root.appendChild(workspaceMount);

    var wsApi = null;
    function onStateChange() {
      if (wsApi) {
        wsApi.refreshEvidenceChecks();
        wsApi.renderRiskList();
        wsApi.renderRemList();
        wsApi.renderSummary();
      }
    }

    wsApi = buildFindingsWorkspace({
      workspaceMount: workspaceMount,
      state: state,
      world: world,
      content: content,
      assessment: assessment,
      statusEl: statusEl
    });

    appendLine(logEl, "CyberPath Pentest Terminal ready (D2-C).", "meta");
    appendLine(
      logEl,
      "Type 'help'. Accept RoE before recon. Open proof evidence before confirming findings.",
      "meta"
    );
    if (state.commandLog && state.commandLog.length) {
      appendLine(
        logEl,
        "— استُعيدت جلسة (" +
          state.commandLog.length +
          " أوامر، " +
          (state.findings || []).length +
          " findings) —",
        "meta"
      );
    }

    renderStatus(statusEl, state, world);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = input.value;
      input.value = "";
      if (!String(raw).trim()) return;
      try {
        runCommand(raw, {
          state: state,
          world: world,
          logEl: logEl,
          statusEl: statusEl,
          onStateChange: onStateChange
        });
        syncRoeButton();
      } catch (err) {
        appendLine(logEl, "INTERNAL_ERROR: " + (err && err.message ? err.message : err), "err");
      }
      input.focus();
    });

    input.focus();
  }

  async function init(ctx) {
    var mount = ctx && ctx.mount;
    if (!mount) return;
    if (!World || !Session || !Commands || !Findings) {
      mount.innerHTML = "";
      mount.appendChild(
        el(
          "p",
          "pt-result-bad",
          "تعذر تحميل وحدات المحاكاة (World/Session/Commands/Findings)."
        )
      );
      return;
    }

    var labId = (ctx && ctx.labId) || World.LAB_ID;
    var world = World.buildWorldModel();
    var state = Session.loadSession(labId);

    var content = null;
    var assessment = null;
    try {
      var meta = ctx && ctx.meta;
      var cRef =
        (meta && meta.contentRef) || "content/lab-pentest-engagement-01.json";
      var aRef =
        (meta && meta.assessmentRef) || "assessment/lab-pentest-engagement-01.json";
      content = await loadJson(pageDataUrl(cRef));
      assessment = await loadJson(pageDataUrl(aRef));
    } catch (e) {
      mount.innerHTML = "";
      mount.appendChild(
        el(
          "p",
          "pt-result-bad",
          "تعذر تحميل بيانات المحتوى/التقييم: " + (e.message || e)
        )
      );
      return;
    }

    try {
      buildUi({
        mount: mount,
        world: world,
        state: state,
        labId: labId,
        content: content,
        assessment: assessment
      });
    } catch (e) {
      mount.innerHTML = "";
      mount.appendChild(
        el("p", "pt-result-bad", "تعذر تهيئة المختبر: " + (e.message || e))
      );
    }
  }

  global.LabsRunners["penetration-testing"] = {
    init: function (ctx) {
      return init(ctx);
    }
  };

  function runCommandApi(raw, world, state) {
    var result = Commands.execute(raw, world, state);
    Commands.commit(state, result);
    return result;
  }

  // D2-A public test surface (additive; same engine/session)
  global.LabsPentestD2A = {
    init: init,
    runCommand: runCommandApi
  };

  global.LabsPentestD2C = {
    init: init,
    Findings: Findings,
    runCommand: runCommandApi
  };
})(typeof window !== "undefined" ? window : global);
