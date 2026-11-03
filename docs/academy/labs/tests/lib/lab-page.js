/**
 * Helpers for Labs Center Playwright tests (P0-A scaffold).
 */
async function openRun(page, labId, runner) {
  const q = new URLSearchParams();
  if (labId) q.set("id", labId);
  if (runner) q.set("runner", runner);
  await page.goto(`/academy/labs/run.html?${q.toString()}`, {
    waitUntil: "networkidle",
  });
}

async function openLabDetails(page, labId) {
  await page.goto(`/academy/labs/lab.html?id=${encodeURIComponent(labId)}`, {
    waitUntil: "networkidle",
  });
}

module.exports = { openRun, openLabDetails };
