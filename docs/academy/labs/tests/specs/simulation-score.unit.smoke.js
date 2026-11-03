/** Not part of Playwright smoke; documents harness load for later P0-B. */
const path = require("path");
const { loadScoreAll } = require("../lib/score-harness");

const sim = path.resolve(__dirname, "../../runners/simulation.js");
const scoreAll = loadScoreAll(sim);
if (typeof scoreAll !== "function") {
  console.error("scoreAll missing");
  process.exit(1);
}
console.log("score-harness ok");
