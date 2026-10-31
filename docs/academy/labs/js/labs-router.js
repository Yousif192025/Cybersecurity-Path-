/**
 * Labs Center — internal path helpers (Phase 1)
 * Keeps navigation inside /academy/labs/ without touching the rest of the platform.
 */
(function (global) {
  const BASE = "/academy/labs/";

  function labsHome() {
    return BASE;
  }

  function labDetails(id) {
    const q = id ? ("?id=" + encodeURIComponent(id)) : "";
    return BASE + "lab.html" + q;
  }

  function labRun(id, runner) {
    const params = new URLSearchParams();
    if (id) params.set("id", id);
    if (runner) params.set("runner", runner);
    const qs = params.toString();
    return BASE + "run.html" + (qs ? "?" + qs : "");
  }

  function labResults(id) {
    const q = id ? ("?id=" + encodeURIComponent(id)) : "";
    return BASE + "results.html" + q;
  }

  /** Map lab type metadata to runner key */
  function runnerForType(labType) {
    const map = {
      simulation: "simulation",
      fixed_data: "fixed-data",
      independent_challenge: "independent-challenge",
      external_guided: "external-guided"
    };
    return map[labType] || null;
  }

  global.LabsRouter = {
    BASE: BASE,
    labsHome: labsHome,
    labDetails: labDetails,
    labRun: labRun,
    labResults: labResults,
    runnerForType: runnerForType
  };
})(window);
