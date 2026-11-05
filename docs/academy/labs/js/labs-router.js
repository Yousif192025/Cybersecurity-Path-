/**
 * Labs Center — internal path helpers
 * Base path is derived from the current page URL so the same files work on
 * Vercel (/academy/labs/...) and Codespaces (/docs/academy/labs/... from repo root).
 */
(function (global) {
  function detectBase() {
    try {
      var path = global.location && global.location.pathname ? global.location.pathname : "";
      var marker = "/labs/";
      var i = path.lastIndexOf(marker);
      if (i >= 0) return path.slice(0, i + marker.length);
    } catch (e) {
      /* ignore */
    }
    return "/academy/labs/";
  }

  function labsHome() {
    return detectBase();
  }

  function labDetails(id) {
    var q = id ? "?id=" + encodeURIComponent(id) : "";
    return detectBase() + "lab.html" + q;
  }

  function labRun(id, runner) {
    var params = new URLSearchParams();
    if (id) params.set("id", id);
    if (runner) params.set("runner", runner);
    var qs = params.toString();
    return detectBase() + "run.html" + (qs ? "?" + qs : "");
  }

  function labResults(id) {
    var q = id ? "?id=" + encodeURIComponent(id) : "";
    return detectBase() + "results.html" + q;
  }

  /** Map lab type metadata to runner key */
  function runnerForType(labType) {
    var map = {
      simulation: "simulation",
      fixed_data: "fixed-data",
      independent_challenge: "independent-challenge",
      external_guided: "external-guided",
      network_assessment: "network-assessment",
      web_vulnerability_assessment: "web-vulnerability-assessment",
      cloud_security_assessment: "cloud-security-assessment"
    };
    return map[labType] || null;
  }

  global.LabsRouter = {
    get BASE() {
      return detectBase();
    },
    labsHome: labsHome,
    labDetails: labDetails,
    labRun: labRun,
    labResults: labResults,
    runnerForType: runnerForType
  };
})(window);
