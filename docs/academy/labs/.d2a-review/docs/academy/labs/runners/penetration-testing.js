/**
 * Labs Center — Penetration Testing runner (D2-A).
 * Interactive training terminal + WorldModel/SessionState/CommandEngine.
 * No real network, shell, eval, or external fetch of targets.
 */
(function (global) {
  "use strict";

  global.LabsRunners = global.LabsRunners || {};

  var World = global.LabsPentestWorld;
  var Session = global.LabsPentestSession;
  var Commands = global.LabsPentestCommands;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== "") n.textContent = text;
    return n;
  }

  function appendLine(logEl, text, kind) {
    var line = el("div", "pt-term-line pt-term-" + (kind || "out"));
    line.textContent = text;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function renderStatus(panel, state, world) {
    panel.innerHTML = "";
    panel.appendChild(el("h3", null, "حالة الجلسة"));
    var ul = el("ul", "pt-status-list");
    function item(label, val) {
      var li = el("li", null, label + ": " + val);
      ul.appendChild(li);
    }
    item("المرحلة", state.phaseId || "—");
    item("قبول RoE", state.roeAccepted ? "نعم" : "لا");
    item("أهداف مكتشفة", String(Object.keys(state.discoveredHosts || {}).length));
    item("أدلة مفتوحة", String((state.unlockedEvidence || []).length));
    item("مخالفات نطاق", String((state.roeViolations || []).length));
    item("أوامر مسجّلة", String((state.commandLog || []).length));
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

    appendLine(logEl, "pt$ " + raw, "in");
    var result = Commands.execute(raw, world, state);
    Commands.commit(state, result);

    if (result.stdout) {
      String(result.stdout)
        .split("\n")
        .forEach(function (ln) {
          appendLine(logEl, ln, "out");
        });
    }
    if (result.stderr) {
      String(result.stderr)
        .split("\n")
        .forEach(function (ln) {
          appendLine(logEl, ln, "err");
        });
    }
    appendLine(logEl, "exit " + result.exitCode, "meta");

    state.terminalLines = state.terminalLines || [];
    state.terminalLines.push({ q: raw, code: result.exitCode });
    if (state.terminalLines.length > 200) {
      state.terminalLines = state.terminalLines.slice(-200);
    }

    Session.saveSession(state);
    renderStatus(statusEl, state, world);
    return result;
  }

  function buildUi(ctx) {
    var mount = ctx.mount;
    var world = ctx.world;
    var state = ctx.state;
    var labId = ctx.labId;

    mount.innerHTML = "";
    var root = el("div", "lab-pt");
    mount.appendChild(root);

    root.appendChild(el("h2", "pt-title", "محاكاة دورة اختبار اختراق — D2-A"));
    root.appendChild(
      el(
        "p",
        "pt-lead",
        "طرفية تدريبية مرتبطة بعالم أهداف اصطناعي وحالة جلسة. لا اتصال شبكي حقيقي."
      )
    );

    var layout = el("div", "pt-layout");
    root.appendChild(layout);

    var main = el("div", "pt-main");
    var side = el("div", "pt-side");
    layout.appendChild(main);
    layout.appendChild(side);

    // RoE gate
    var roeBox = el("div", "pt-roe-box");
    roeBox.appendChild(el("h3", null, "قواعد الاشتباك"));
    var roeList = el("ul", null);
    (world.roeText || []).forEach(function (t) {
      roeList.appendChild(el("li", null, t));
    });
    roeBox.appendChild(roeList);
    var roeBtn = el("button", "btn-labs", "قبول قواعد الاشتباك");
    roeBtn.type = "button";
    if (state.roeAccepted) {
      roeBtn.disabled = true;
      roeBtn.textContent = "تم قبول القواعد";
    }
    roeBtn.addEventListener("click", function () {
      state.roeAccepted = true;
      Session.saveSession(state);
      roeBtn.disabled = true;
      roeBtn.textContent = "تم قبول القواعد";
      appendLine(logEl, "تم تسجيل قبول قواعد الاشتباك في SessionState.", "meta");
      renderStatus(statusEl, state, world);
    });
    roeBox.appendChild(roeBtn);
    main.appendChild(roeBox);

    // Terminal
    var term = el("div", "pt-term");
    var logEl = el("div", "pt-term-log");
    logEl.setAttribute("role", "log");
    logEl.setAttribute("aria-live", "polite");
    term.appendChild(logEl);

    var form = el("form", "pt-term-form");
    form.setAttribute("autocomplete", "off");
    var input = el("input", "pt-term-input");
    input.type = "text";
    input.placeholder = "pt$ help";
    input.setAttribute("aria-label", "أمر الطرفية");
    input.dir = "ltr";
    var send = el("button", "btn-labs", "تنفيذ");
    send.type = "submit";
    form.appendChild(input);
    form.appendChild(send);
    term.appendChild(form);
    main.appendChild(term);

    var tools = el("div", "pt-tools");
    var resetBtn = el("button", "btn-labs btn-labs-ghost", "إعادة ضبط الجلسة");
    resetBtn.type = "button";
    resetBtn.addEventListener("click", function () {
      Session.clearSession(labId);
      ctx.state = Session.emptyState(labId);
      buildUi({
        mount: mount,
        world: world,
        state: ctx.state,
        labId: labId
      });
    });
    tools.appendChild(resetBtn);
    main.appendChild(tools);

    var statusEl = el("div", "pt-status");
    side.appendChild(statusEl);
    side.appendChild(el("h3", null, "نطاق سريع"));
    var scopeUl = el("ul", "pt-scope-list");
    (world.inScopeSummary || []).forEach(function (s) {
      scopeUl.appendChild(el("li", "pt-mono", s));
    });
    side.appendChild(scopeUl);

    appendLine(logEl, "CyberPath Pentest Terminal ready (D2-A).", "meta");
    appendLine(logEl, "Type 'help' to list commands. Accept RoE before dig/nslookup.", "meta");

    if (state.commandLog && state.commandLog.length) {
      appendLine(logEl, "— استُعيدت جلسة سابقة (" + state.commandLog.length + " أوامر) —", "meta");
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
          statusEl: statusEl
        });
      } catch (err) {
        appendLine(logEl, "INTERNAL_ERROR: " + (err && err.message ? err.message : err), "err");
      }
      input.focus();
    });

    input.focus();
  }

  function init(ctx) {
    var mount = ctx && ctx.mount;
    if (!mount) return;
    if (!World || !Session || !Commands) {
      mount.innerHTML = "";
      mount.appendChild(
        el("p", "pt-result-bad", "تعذر تحميل وحدات المحاكاة (World/Session/Commands).")
      );
      return;
    }

    var labId = (ctx && ctx.labId) || World.LAB_ID;
    var world = World.buildWorldModel();
    // Guard: world must stay frozen
    if (!Object.isFrozen(world)) {
      /* buildWorldModel freezes deeply */
    }
    var state = Session.loadSession(labId);

    try {
      buildUi({ mount: mount, world: world, state: state, labId: labId });
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

  // Test surface (no scoring engine in D2-A)
  global.LabsPentestD2A = {
    init: init,
    runCommand: function (raw, world, state) {
      var result = Commands.execute(raw, world, state);
      Commands.commit(state, result);
      return result;
    }
  };
})(typeof window !== "undefined" ? window : global);
