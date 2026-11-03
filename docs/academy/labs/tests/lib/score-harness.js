/**
 * Load live-compatible simulation.js in Node and expose scoreAll.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadScoreAll(simulationJsPath) {
  const code = fs.readFileSync(simulationJsPath, "utf8");
  const sandbox = { console, global: {} };
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  if (!sandbox.LabsSimulationScore || !sandbox.LabsSimulationScore.scoreAll) {
    throw new Error("LabsSimulationScore.scoreAll not exported");
  }
  return sandbox.LabsSimulationScore.scoreAll;
}

module.exports = { loadScoreAll };
