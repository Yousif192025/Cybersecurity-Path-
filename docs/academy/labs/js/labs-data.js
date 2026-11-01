/**
 * Labs Center — metadata loader (Phase 1)
 * Loads labs-index.json only. No scenario content in Phase 1.
 */
(function (global) {
  const DATA_URL = new URL("../data/labs-index.json", document.currentScript.src).href;

  async function loadLabsIndex() {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to load labs index: " + res.status);
    }
    return res.json();
  }

  function getLabById(index, id) {
    if (!index || !Array.isArray(index.labs)) return null;
    return index.labs.find(function (lab) {
      return lab && lab.id === id;
    }) || null;
  }

  global.LabsData = {
    loadLabsIndex: loadLabsIndex,
    getLabById: getLabById,
    dataUrl: DATA_URL
  };
})(window);
