/**
 * Labs Center — runner dispatcher (Phase 1 stub)
 * Selects one of four runner modules by ?runner= or lab type. No lab content executed yet.
 */
(function (global) {
  const RUNNERS = {
    simulation: "simulation",
    "fixed-data": "fixed-data",
    "independent-challenge": "independent-challenge",
    "external-guided": "external-guided",
    "network-assessment": "network-assessment",
    "web-vulnerability-assessment": "web-vulnerability-assessment",
    "cloud-security-assessment": "cloud-security-assessment",
    "digital-forensics": "digital-forensics",
    "packet-analysis": "packet-analysis",
    "penetration-testing": "penetration-testing"
  };

  function resolveRunnerKey(searchParams, labMeta) {
    const fromQuery = searchParams.get("runner");
    const fromType =
      labMeta && global.LabsRouter
        ? global.LabsRouter.runnerForType(labMeta.type)
        : null;

    // إذا وُجد نوع المختبر في السجل، لا تسمح لـ runner=simulation الافتراضي
    // أن يتجاوز مشغّلًا مختلفًا (مثل external-guided).
    if (
      fromType &&
      fromQuery === "simulation" &&
      fromType !== "simulation"
    ) {
      return fromType;
    }

    if (fromQuery && RUNNERS[fromQuery]) return fromQuery;
    if (fromType) return fromType;
    return null;
  }

  function mountPlaceholder(container, runnerKey, labId) {
    if (!container) return;
    container.innerHTML = "";
    const title = document.createElement("h2");
    title.textContent = "تهيئة تشغيل المختبر";
    const p = document.createElement("p");
    p.textContent = "جاري تحديد المشغّل وتحميل المحتوى…";
    const ul = document.createElement("ul");
    [["Lab id", labId || "(none)"], ["Runner", runnerKey || "(not selected)"]].forEach(
      function (pair) {
        const li = document.createElement("li");
        li.textContent = pair[0] + ": " + pair[1];
        ul.appendChild(li);
      }
    );
    container.appendChild(title);
    container.appendChild(p);
    container.appendChild(ul);
  }

  function mountRunnerError(container, message) {
    if (!container) return;
    container.innerHTML = "";
    const p = document.createElement("p");
    p.className = "phase-note";
    p.textContent = message;
    container.appendChild(p);
  }

  async function initRunnerPage() {
    const mount = document.getElementById("labs-runner-mount");
    const params = new URLSearchParams(window.location.search);
    const labId = params.get("id");
    let meta = null;
    if (labId && global.LabsData) {
      try {
        const index = await global.LabsData.loadLabsIndex();
        meta = global.LabsData.getLabById(index, labId);
      } catch (e) {
        console.warn(e);
      }
    }
    const runnerKey = resolveRunnerKey(params, meta);
    mountPlaceholder(mount, runnerKey, labId);

    if (!runnerKey) {
      mountRunnerError(
        mount,
        "تعذر تحديد مشغّل المختبر. تحقق من المعرّف أو من حقل type في السجل."
      );
      return;
    }

    if (!global.LabsRunners || !global.LabsRunners[runnerKey]) {
      mountRunnerError(
        mount,
        'المشغّل "' +
          runnerKey +
          '" غير محمّل. تأكد من تضمين سكربت المشغّل في run.html.'
      );
      return;
    }

    try {
      global.LabsRunners[runnerKey].init({
        mount: mount,
        labId: labId,
        meta: meta,
        phase: 1
      });
    } catch (e) {
      console.warn("Runner init failed:", e);
      mountRunnerError(
        mount,
        "فشل تهيئة المشغّل: " + (e && e.message ? e.message : String(e))
      );
    }
  }

  global.LabsRunnerHost = {
    resolveRunnerKey: resolveRunnerKey,
    initRunnerPage: initRunnerPage,
    RUNNERS: RUNNERS
  };
})(window);
