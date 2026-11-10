/**
 * Labs Center — Interactive packet analysis runner (educational filter simulation).
 * Not a real Wireshark engine. Supports a fixed set of display-filter-like expressions.
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

  function normFilter(expr) {
    return String(expr || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  /** Educational filter matcher — exported for tests */
  function matchPacketFilter(packet, expr) {
    var f = normFilter(expr);
    if (!f) return { ok: true, all: true, error: null };
    var p = packet || {};
    var layers = p.layers || {};

    function eqIp(a, b) {
      return String(a || "") === String(b || "");
    }
    function hasPort(port) {
      var sp = p.sport;
      var dp = p.dport;
      var n = Number(port);
      return sp === n || dp === n || String(sp) === String(port) || String(dp) === String(port);
    }
    function protoIs(name) {
      return String(p.proto || "").toUpperCase() === String(name).toUpperCase();
    }
    function hasSyn() {
      var flags = (layers.tcp && layers.tcp.flags) || [];
      return asArray(flags).indexOf("SYN") !== -1;
    }

    // bare protocol tokens
    if (f === "dns") return { ok: protoIs("DNS"), error: null };
    if (f === "http") return { ok: protoIs("HTTP"), error: null };
    if (f === "tcp") return { ok: protoIs("TCP") || protoIs("TLS") || protoIs("HTTP"), error: null };
    if (f === "udp") return { ok: protoIs("DNS") || protoIs("UDP"), error: null };
    if (f === "arp") return { ok: protoIs("ARP"), error: null };
    if (f === "tcp.flags.syn") return { ok: hasSyn(), error: null };

    var m;
    m = f.match(/^ip\.addr\s*==\s*([0-9.]+)$/);
    if (m) return { ok: eqIp(p.src, m[1]) || eqIp(p.dst, m[1]), error: null };
    m = f.match(/^ip\.src\s*==\s*([0-9.]+)$/);
    if (m) return { ok: eqIp(p.src, m[1]), error: null };
    m = f.match(/^ip\.dst\s*==\s*([0-9.]+)$/);
    if (m) return { ok: eqIp(p.dst, m[1]), error: null };
    m = f.match(/^tcp\.port\s*==\s*(\d+)$/);
    if (m) {
      var okTcp =
        (protoIs("TCP") || protoIs("TLS") || protoIs("HTTP")) && hasPort(m[1]);
      return { ok: okTcp, error: null };
    }
    m = f.match(/^udp\.port\s*==\s*(\d+)$/);
    if (m) {
      var okUdp = (protoIs("UDP") || protoIs("DNS")) && hasPort(m[1]);
      return { ok: okUdp, error: null };
    }

    return {
      ok: false,
      error:
        "مرشح غير مدعوم في هذه المحاكاة التعليمية. جرّب الصيغ الموضحة في المساعدة."
    };
  }

  function applyFilter(packets, expr) {
    var f = normFilter(expr);
    if (!f) {
      return { packets: packets.slice(), error: null, unsupported: false };
    }
    var sample = matchPacketFilter(packets[0] || {}, expr);
    if (sample.error && !/ip\.|tcp\.|udp\.|^dns$|^http$|^tcp\.flags/.test(f)) {
      // re-check: if pattern completely unknown
    }
    // Detect unsupported: if expression doesn't match any known pattern
    var known =
      /^(dns|http|tcp|udp|arp|tcp\.flags\.syn)$/.test(f) ||
      /^ip\.(addr|src|dst)\s*==\s*[0-9.]+$/.test(f) ||
      /^(tcp|udp)\.port\s*==\s*\d+$/.test(f);
    if (!known) {
      return { packets: [], error: sample.error || "مرشح غير مدعوم", unsupported: true };
    }
    var out = [];
    packets.forEach(function (p) {
      var r = matchPacketFilter(p, expr);
      if (r.ok) out.push(p);
    });
    return { packets: out, error: null, unsupported: false };
  }


  /**
   * Whether a filter application should increment progress.
   * Counts only non-empty, supported expressions; optionally de-dupes by normalized expr.
   */
  function shouldCountFilterApply(expr, res, countedMap) {
    var key = normFilter(expr);
    if (!key) return false;
    if (!res || res.unsupported !== false) return false;
    if (countedMap && countedMap[key]) return false;
    return true;
  }

  function noteFilterApply(expr, res, state) {
    if (!state) return false;
    if (!shouldCountFilterApply(expr, res, state.countedFilters)) return false;
    var key = normFilter(expr);
    state.countedFilters = state.countedFilters || {};
    state.countedFilters[key] = true;
    state.filterApplies = (state.filterApplies || 0) + 1;
    return true;
  }

  function scorePacketAnalysis(assessment, answers) {
    var fb = (assessment && assessment.feedback) || {};
    var parts = { explore: false, indicators: false, response: false, report: false };
    var messages = [];
    answers = answers || {};

    var opened = asArray(answers.packetsOpened);
    var minOpen =
      typeof assessment.minPacketsOpened === "number" ? assessment.minPacketsOpened : 5;
    var filterApplies =
      typeof answers.filterApplies === "number" ? answers.filterApplies : 0;
    var minFilters =
      typeof assessment.minFilterApplies === "number" ? assessment.minFilterApplies : 2;
    parts.explore = opened.length >= minOpen && filterApplies >= minFilters;
    if (!parts.explore) messages.push(fb.explore_bad || "استكشاف غير كافٍ");
    else messages.push(fb.explore_ok || "");

    var sus = asArray(assessment.suspiciousIndicatorIds);
    var benign = asArray(assessment.benignIndicatorIds);
    var selected = asArray(answers.selectedIndicators);
    var hits = selected.filter(function (id) {
      return sus.indexOf(id) !== -1;
    });
    var fps = selected.filter(function (id) {
      return benign.indexOf(id) !== -1 || (sus.indexOf(id) === -1 && benign.indexOf(id) === -1);
    });
    // unknown ids count as FP
    fps = selected.filter(function (id) {
      return sus.indexOf(id) === -1;
    });
    var minHits =
      typeof assessment.minSuspiciousHits === "number"
        ? assessment.minSuspiciousHits
        : Math.min(3, sus.length);
    var maxFP =
      typeof assessment.maxFalsePositives === "number" ? assessment.maxFalsePositives : 1;
    parts.indicators = hits.length >= minHits && fps.length <= maxFP;
    if (!parts.indicators) messages.push(fb.indicators_bad || "مؤشرات غير كافية");
    else messages.push(fb.indicators_ok || "");

    parts.response = answers.responseId === assessment.correctResponseId;
    if (!parts.response) messages.push(fb.response_bad || "استجابة غير مناسبة");
    else messages.push(fb.response_ok || "");

    var reportText = typeof answers.reportText === "string" ? answers.reportText : "";
    var rep = assessment.report || {};
    var minLen = typeof rep.minLength === "number" ? rep.minLength : 50;
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

    var complete = parts.explore && parts.indicators && parts.response && parts.report;
    return {
      complete: complete,
      parts: parts,
      feedback: complete ? fb.complete || "مكتمل" : fb.incomplete || "غير مكتمل",
      report: {
        packetsOpened: opened.slice(),
        filterApplies: filterApplies,
        hits: hits.slice(),
        falsePositives: fps.slice(),
        keywordHits: kwHits,
        messages: messages.filter(Boolean)
      }
    };
  }

  function render(ctx, content, assessment) {
    var mount = ctx.mount;
    mount.innerHTML = "";
    mount.className = (mount.className || "") + " lab-pkt";

    var packets = asArray(content.packets);
    var state = {
      stage: 0,
      selectedId: packets[0] ? packets[0].id : null,
      filterExpr: "",
      filterApplies: 0,
      countedFilters: {},
      packetsOpened: {},
      selectedIndicators: {},
      responseId: "",
      reportText: ""
    };
    if (state.selectedId) state.packetsOpened[state.selectedId] = true;

    var stages = asArray(content.stages);
    if (!stages.length) {
      stages = [
        { id: "intake", title: "استلام القضية" },
        { id: "explore", title: "مستكشف الحزم" },
        { id: "filters", title: "مرشحات" },
        { id: "investigate", title: "تحقيق" },
        { id: "report", title: "تقرير" }
      ];
    }

    var header = el("header", "pkt-header");
    header.appendChild(el("h2", null, content.title || "تحليل حركة مرور الشبكة"));
    header.appendChild(el("p", "pkt-muted", content.intro || ""));
    mount.appendChild(header);

    if (content.safety && content.safety.length) {
      var saf = el("section", "pkt-block");
      saf.appendChild(el("h3", null, "سلامة التدريب"));
      var su = el("ul");
      content.safety.forEach(function (s) {
        su.appendChild(el("li", null, s));
      });
      saf.appendChild(su);
      mount.appendChild(saf);
    }

    var progress = el("nav", "pkt-progress");
    progress.setAttribute("aria-label", "مراحل التحليل");
    mount.appendChild(progress);

    var stageMount = el("div", "pkt-stage-mount");
    mount.appendChild(stageMount);

    var navBar = el("div", "pkt-nav-bar");
    var btnPrev = el("button", "btn-labs btn-labs-ghost", "السابق");
    btnPrev.type = "button";
    var btnNext = el("button", "btn-labs btn-labs-primary", "التالي");
    btnNext.type = "button";
    navBar.appendChild(btnPrev);
    navBar.appendChild(btnNext);
    mount.appendChild(navBar);

    var resultBox = el("div", "pkt-result");
    resultBox.hidden = true;
    mount.appendChild(resultBox);

    function refreshProgress() {
      progress.innerHTML = "";
      stages.forEach(function (st, idx) {
        var b = el(
          "button",
          "pkt-step" + (idx === state.stage ? " is-active" : ""),
          st.title || st.id
        );
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

    function filteredPackets() {
      return applyFilter(packets, state.filterExpr).packets;
    }

    function packetById(id) {
      for (var i = 0; i < packets.length; i++) {
        if (packets[i].id === id) return packets[i];
      }
      return null;
    }

    function formatLayers(p) {
      var lines = [];
      var L = p.layers || {};
      if (L.eth) {
        lines.push("Ethernet");
        lines.push("  Src: " + (L.eth.src || ""));
        lines.push("  Dst: " + (L.eth.dst || ""));
      }
      if (L.ip) {
        lines.push("Internet Protocol");
        lines.push("  Src: " + (L.ip.src || ""));
        lines.push("  Dst: " + (L.ip.dst || ""));
        if (L.ip.ttl != null) lines.push("  TTL: " + L.ip.ttl);
      }
      if (L.tcp) {
        lines.push("Transmission Control Protocol");
        lines.push("  Src Port: " + (L.tcp.sport != null ? L.tcp.sport : ""));
        lines.push("  Dst Port: " + (L.tcp.dport != null ? L.tcp.dport : ""));
        if (L.tcp.flags) lines.push("  Flags: " + asArray(L.tcp.flags).join(","));
        if (L.tcp.seq != null) lines.push("  Seq: " + L.tcp.seq);
        if (L.tcp.ack != null) lines.push("  Ack: " + L.tcp.ack);
      }
      if (L.udp) {
        lines.push("User Datagram Protocol");
        lines.push("  Src Port: " + (L.udp.sport != null ? L.udp.sport : ""));
        lines.push("  Dst Port: " + (L.udp.dport != null ? L.udp.dport : ""));
      }
      if (L.dns) {
        lines.push("Domain Name System");
        lines.push("  QR: " + (L.dns.qr || ""));
        lines.push("  Name: " + (L.dns.name || ""));
        lines.push("  Type: " + (L.dns.type || ""));
        if (L.dns.addr) lines.push("  Addr: " + L.dns.addr);
      }
      if (L.http) {
        lines.push("Hypertext Transfer Protocol");
        if (L.http.method) lines.push("  " + L.http.method + " " + (L.http.path || ""));
        if (L.http.host) lines.push("  Host: " + L.http.host);
        if (L.http.userAgent) lines.push("  User-Agent: " + L.http.userAgent);
        if (L.http.status) lines.push("  Status: " + L.http.status);
        if (L.http.contentType) lines.push("  Content-Type: " + L.http.contentType);
        if (L.http.size) lines.push("  Size hint: " + L.http.size);
      }
      if (L.tls) {
        lines.push("Transport Layer Security");
        lines.push("  " + (L.tls.record || "") + " / " + (L.tls.msg || ""));
      }
      if (L.arp) {
        lines.push("Address Resolution Protocol");
        lines.push("  Op: " + (L.arp.op || ""));
        lines.push("  Sender: " + (L.arp.sender || ""));
        lines.push("  Target: " + (L.arp.target || ""));
      }
      return lines.join("\n");
    }

    function renderPacketTable(container, showFilterBar) {
      var wrap = el("div", "pkt-explorer");
      if (showFilterBar) {
        var bar = el("div", "pkt-filter-bar");
        bar.appendChild(
          el(
            "p",
            "pkt-muted",
            "مرشحات تعليمية مدعومة فقط (ليست Wireshark كاملًا). أمثلة: " +
              asArray(content.filterHelp).slice(0, 4).join(" · ")
          )
        );
        var row = el("div", "pkt-filter-row");
        var input = document.createElement("input");
        input.type = "text";
        input.className = "pkt-filter-input";
        input.placeholder = "مثال: dns   أو   tcp.port == 8080";
        input.value = state.filterExpr || "";
        input.setAttribute("dir", "ltr");
        var applyBtn = el("button", "btn-labs btn-labs-primary", "تطبيق");
        applyBtn.type = "button";
        var clearBtn = el("button", "btn-labs btn-labs-ghost", "مسح");
        clearBtn.type = "button";
        var status = el("span", "pkt-filter-status", "");
        function runFilter() {
          state.filterExpr = input.value;
          var res = applyFilter(packets, state.filterExpr);
          // Count only supported, non-empty filters; de-dupe identical expressions
          noteFilterApply(state.filterExpr, res, state);
          if (res.unsupported) {
            status.textContent = res.error || "مرشح غير مدعوم";
            status.className = "pkt-filter-status is-bad";
          } else {
            status.textContent = "النتائج: " + res.packets.length + " / " + packets.length;
            status.className = "pkt-filter-status";
          }
          redrawTable();
        }
        applyBtn.addEventListener("click", runFilter);
        clearBtn.addEventListener("click", function () {
          input.value = "";
          state.filterExpr = "";
          status.textContent = "النتائج: " + packets.length + " / " + packets.length;
          status.className = "pkt-filter-status";
          redrawTable();
        });
        input.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter") {
            ev.preventDefault();
            runFilter();
          }
        });
        row.appendChild(input);
        row.appendChild(applyBtn);
        row.appendChild(clearBtn);
        bar.appendChild(row);
        bar.appendChild(status);
        // quick chips
        var chips = el("div", "pkt-chips");
        asArray(content.filterHelp).forEach(function (h) {
          var chip = el("button", "pkt-chip", h);
          chip.type = "button";
          chip.addEventListener("click", function () {
            input.value = h;
            runFilter();
          });
          chips.appendChild(chip);
        });
        bar.appendChild(chips);
        wrap.appendChild(bar);
        status.textContent =
          "النتائج: " +
          (state.filterExpr ? applyFilter(packets, state.filterExpr).packets.length : packets.length) +
          " / " +
          packets.length;
      }

      var layout = el("div", "pkt-layout");
      var tableWrap = el("div", "pkt-table-wrap");
      var detail = el("pre", "pkt-detail");
      detail.textContent = "اختر حزمة لعرض التفاصيل.";
      layout.appendChild(tableWrap);
      layout.appendChild(detail);
      wrap.appendChild(layout);

      function redrawTable() {
        var list = filteredPackets();
        tableWrap.innerHTML = "";
        var table = el("table", "pkt-table");
        var thead = el("thead");
        var hr = el("tr");
        ["No", "Time", "Source", "Destination", "Proto", "Sport", "Dport", "Len", "Info"].forEach(
          function (h) {
            hr.appendChild(el("th", null, h));
          }
        );
        thead.appendChild(hr);
        table.appendChild(thead);
        var tbody = el("tbody");
        list.forEach(function (p) {
          var tr = el("tr", state.selectedId === p.id ? "is-selected" : "");
          tr.setAttribute("data-pkt", p.id);
          [
            p.no,
            p.time,
            p.src,
            p.dst,
            p.proto,
            p.sport != null ? p.sport : "—",
            p.dport != null ? p.dport : "—",
            p.length,
            p.info
          ].forEach(function (cell) {
            var td = el("td", null, String(cell));
            if (typeof cell === "string" && /[a-zA-Z0-9.:]/.test(cell)) td.dir = "ltr";
            tr.appendChild(td);
          });
          tr.addEventListener("click", function () {
            state.selectedId = p.id;
            state.packetsOpened[p.id] = true;
            detail.textContent = formatLayers(p);
            redrawTable();
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        tableWrap.appendChild(table);
        if (state.selectedId) {
          var cur = packetById(state.selectedId);
          if (cur && list.indexOf(cur) === -1 && list.length) {
            // keep detail of last selection even if filtered out
          }
          if (cur) detail.textContent = formatLayers(cur);
        }
      }
      redrawTable();
      container.appendChild(wrap);
    }

    function renderIntake() {
      var box = el("section", "pkt-block");
      box.appendChild(el("h3", null, "ملخص القضية"));
      var ctx = content.context || {};
      var grid = el("div", "pkt-meta-grid");
      [
        ["المؤسسة", ctx.org],
        ["المضيف", (ctx.host || "") + (ctx.hostIp ? " — " + ctx.hostIp : "")],
        ["الشبكة", ctx.network],
        ["DNS", ctx.dns],
        ["الدور", ctx.role],
        ["النطاق", ctx.scope],
        ["المهمة", ctx.task]
      ].forEach(function (row) {
        if (!row[1]) return;
        var cell = el("div", "pkt-meta-cell");
        cell.appendChild(el("strong", null, row[0]));
        cell.appendChild(el("span", null, row[1]));
        grid.appendChild(cell);
      });
      box.appendChild(grid);
      box.appendChild(
        el(
          "p",
          "pkt-muted",
          "ستنتقل إلى مستكشف الحزم لتطبيق مرشحات تعليمية واكتشاف مؤشرات مبنية على البيانات فقط."
        )
      );
      return box;
    }

    function renderExplore() {
      var box = el("section", "pkt-block");
      box.appendChild(el("h3", null, "مستكشف الحزم"));
      box.appendChild(
        el("p", "pkt-muted", "انقر أي صف لفتح تفاصيل الطبقات (Ethernet / IP / TCP|UDP / DNS|HTTP…).")
      );
      renderPacketTable(box, false);
      return box;
    }

    function renderFilters() {
      var box = el("section", "pkt-block");
      box.appendChild(el("h3", null, "مرشحات التحليل (محاكاة تعليمية)"));
      renderPacketTable(box, true);
      return box;
    }

    function renderInvestigate() {
      var box = el("section", "pkt-block");
      box.appendChild(el("h3", null, "المؤشرات والاستنتاج"));
      box.appendChild(
        el(
          "p",
          "pkt-muted",
          "علّم المؤشرات التي تدعمها الحزم. بعض الخيارات نشاط معتاد (مشتتات)."
        )
      );
      asArray(content.indicatorOptions).forEach(function (ind) {
        var lab = el("label", "pkt-check-row");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = ind.id;
        if (state.selectedIndicators[ind.id]) cb.checked = true;
        cb.addEventListener("change", function () {
          if (cb.checked) state.selectedIndicators[ind.id] = true;
          else delete state.selectedIndicators[ind.id];
        });
        lab.appendChild(cb);
        lab.appendChild(el("span", null, ind.label || ind.id));
        box.appendChild(lab);
      });
      return box;
    }

    function renderReport() {
      var box = el("section", "pkt-block");
      box.appendChild(el("h3", null, "الاستجابة والتقرير"));
      box.appendChild(el("h4", null, "الإجراء الدفاعي"));
      asArray(content.responseOptions).forEach(function (opt) {
        var lab = el("label", "pkt-radio-row");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "pkt-response";
        input.value = opt.id;
        if (state.responseId === opt.id) input.checked = true;
        input.addEventListener("change", function () {
          state.responseId = opt.id;
        });
        lab.appendChild(input);
        lab.appendChild(el("span", null, opt.label || opt.id));
        box.appendChild(lab);
      });
      box.appendChild(el("h4", null, "تقرير موجز"));
      box.appendChild(
        el(
          "p",
          "pkt-muted",
          "اربط أرقام الحزم أو المنافذ/النطاقات باستنتاجك، واذكر ما هو معتاد وما يستحق المتابعة."
        )
      );
      var ta = document.createElement("textarea");
      ta.className = "pkt-report";
      ta.rows = 7;
      ta.value = state.reportText || "";
      ta.placeholder =
        "مثال: بعد DNS إلى update-secure-login.example.test يظهر اتصال 10.20.5.42 → 198.51.100.66:8080 مع GET /agent/install ثم SYN إضافي على 22/445…";
      ta.addEventListener("input", function () {
        state.reportText = ta.value;
      });
      box.appendChild(ta);
      return box;
    }

    function collectAnswers() {
      return {
        packetsOpened: Object.keys(state.packetsOpened),
        filterApplies: state.filterApplies,
        selectedIndicators: Object.keys(state.selectedIndicators),
        responseId: state.responseId,
        reportText: state.reportText || ""
      };
    }

    function submit() {
      var scored = scorePacketAnalysis(assessment, collectAnswers());
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
        "pkt-result " + (scored.complete ? "pkt-result-ok" : "pkt-result-bad");
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
        resultBox.appendChild(el("p", "pkt-muted", m));
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
      else if (id === "explore") node = renderExplore();
      else if (id === "filters") node = renderFilters();
      else if (id === "investigate") node = renderInvestigate();
      else node = renderReport();
      stageMount.appendChild(node);
    }

    btnPrev.addEventListener("click", function () {
      if (state.stage > 0) {
        state.stage -= 1;
        renderStage();
      }
    });
    btnNext.addEventListener("click", function () {
      if (state.stage >= stages.length - 1) submit();
      else {
        state.stage += 1;
        renderStage();
      }
    });

    renderStage();
  }

  global.LabsPacketAnalysis = {
    matchPacketFilter: matchPacketFilter,
    applyFilter: applyFilter,
    scorePacketAnalysis: scorePacketAnalysis,
    shouldCountFilterApply: shouldCountFilterApply,
    noteFilterApply: noteFilterApply,
    normFilter: normFilter
  };

  global.LabsRunners["packet-analysis"] = {
    init: async function (ctx) {
      var mount = ctx && ctx.mount;
      var labId = ctx && ctx.labId;
      if (!mount) return;
      mount.innerHTML = "";
      mount.appendChild(el("p", null, "جاري تحميل مستكشف الحزم…"));
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
          el("p", "pkt-result-bad", "تعذر تشغيل المختبر: " + (e.message || e))
        );
      }
    }
  };
})(window);
