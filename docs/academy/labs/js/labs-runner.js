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
    if (fromQuery && RUNNERS[fromQuery]) return fromQuery;
    if (labMeta && global.LabsRouter) {
      const key = global.LabsRouter.runnerForType(labMeta.type);
      if (key) return key;
    }
    return null;
  }

  function mountPlaceholder(container, runnerKey, labId) {
    if (!container) return;
    container.innerHTML = "";
    const title = document.createElement("h2");
    title.textContent = "Lab Runner (Phase 1)";
    const p = document.createElement("p");
    p.textContent =
      "Structural placeholder only. No scenario is loaded in Phase 1.";
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

    if (runnerKey && global.LabsRunners && global.LabsRunners[runnerKey]) {
      try {
        global.LabsRunners[runnerKey].init({
          mount: mount,
          labId: labId,
          meta: meta,
          phase: 1
        });
      } catch (e) {
        console.warn("Runner init skipped:", e);
      }
    }
  }

  global.LabsRunnerHost = {
    resolveRunnerKey: resolveRunnerKey,
    initRunnerPage: initRunnerPage,
    RUNNERS: RUNNERS
  };
})(window);
