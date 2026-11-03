/**
 * In-memory assessment mutation via Playwright route (for later F-* cases).
 * P0-A: scaffold only — not used by smoke.
 */
async function fulfillAssessment(page, urlSubstring, mutator) {
  await page.route(`**/${urlSubstring}`, async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    const next = mutator(JSON.parse(JSON.stringify(json)));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(next),
    });
  });
}

module.exports = { fulfillAssessment };
