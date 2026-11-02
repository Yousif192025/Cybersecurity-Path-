// P0-A: single smoke test — open published Lab 1 run page and detect core UI.
const { test, expect } = require("@playwright/test");
const { openRun } = require("../lib/lab-page");

test.describe("P0-A smoke", () => {
  test("Lab 1 run page loads and exposes task form shell", async ({ page }) => {
    await openRun(page, "lab-soc-phishing-email-01", "simulation");

    const mount = page.locator("#labs-runner-mount");
    await expect(mount).toBeVisible({ timeout: 15000 });

    await expect(
      page.getByRole("heading", { name: "تشغيل المحاكاة" })
    ).toBeVisible({ timeout: 20000 });

    const submit = page.getByRole("button", { name: /إرسال الإجابات/ });
    await expect(submit).toBeVisible({ timeout: 15000 });
  });
});
