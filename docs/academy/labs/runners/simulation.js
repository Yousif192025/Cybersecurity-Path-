/**
 * simulation runner — Phase 1 stub only.
 * Future: load content + assessment for this runtime type.
 */
(function (global) {
  global.LabsRunners = global.LabsRunners || {};
  global.LabsRunners["simulation"] = {
    id: "simulation",
    init: function (ctx) {
      if (!ctx || !ctx.mount) return;
      const note = document.createElement("p");
      note.className = "phase-note";
      note.textContent =
        "Runner module \"simulation\" is registered (Phase 1). Execution of lab content is deferred.";
      ctx.mount.appendChild(note);
    }
  };
})(window);
