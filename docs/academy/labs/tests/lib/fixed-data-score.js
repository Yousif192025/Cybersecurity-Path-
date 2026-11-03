/**
 * Load score() from production fixed-data.js at runtime (docs path).
 * Avoids stale extracted copies diverging from the runner.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadFixedDataScore(fixedDataJsPath) {
  const code = fs.readFileSync(fixedDataJsPath, "utf8");
  const start = code.indexOf("function score(");
  if (start < 0) throw new Error("score() not found in fixed-data.js");
  // score ends before render(
  let end = code.indexOf("function render(", start);
  if (end < 0) end = code.indexOf("async function render", start);
  if (end < 0) throw new Error("render() boundary not found");
  const scoreSrc = code.slice(start, end);
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(scoreSrc + "\nmodule.exports = { score };", sandbox);
  if (typeof sandbox.module.exports.score !== "function") {
    throw new Error("failed to export score from fixed-data.js");
  }
  return sandbox.module.exports.score;
}

const defaultPath = path.resolve(
  __dirname,
  "../../runners/fixed-data.js"
);
const score = loadFixedDataScore(defaultPath);

module.exports = { score, loadFixedDataScore };
