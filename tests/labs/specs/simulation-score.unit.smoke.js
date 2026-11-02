/** Scaffold only for later phases — not executed as part of P0-A smoke. */
const path = require("path");
const { loadScoreAll } = require("../lib/score-harness");

const sim = path.resolve(
  __dirname,
  "../../../docs/academy/labs/runners/simulation.js"
);
const scoreAll = loadScoreAll(sim);
if (typeof scoreAll !== "function") {
  console.error("scoreAll missing");
  process.exit(1);
}
console.log("score-harness ok");
