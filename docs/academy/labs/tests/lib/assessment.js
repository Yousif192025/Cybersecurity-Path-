const fs = require("fs");

function loadAssessment(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function messageFor(assessment, key) {
  return (assessment.feedback && assessment.feedback[key]) || null;
}

module.exports = { loadAssessment, messageFor };
