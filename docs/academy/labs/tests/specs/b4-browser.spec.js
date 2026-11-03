/**
 * P0-B browser suite: navigation, results page, storage, unknown lab, overwrite.
 */
const { test, expect } = require("@playwright/test");
const { openRun, openLabDetails } = require("../lib/lab-page");
const baselines = require("../cases/baselines");

async function fillLab1(page, answers) {
  for (const id of answers.q1 || []) {
    await page.locator(`input[name="q1"][value="${id}"]`).check();
  }
  if (answers.q2) await page.locator(`input[name="q2"][value="${answers.q2}"]`).check();
  if (answers.q3) await page.locator(`input[name="q3"][value="${answers.q3}"]`).check();
  if (answers.q4 != null) await page.locator('textarea[name="q4"]').fill(answers.q4);
}

async function submit(page) {
  await page.getByRole("button", { name: /إرسال الإجابات/ }).click();
}

test.describe("B4 browser", () => {
  test("NAV-01 lab details Lab1 has start path", async ({ page }) => {
    await openLabDetails(page, "lab-soc-phishing-email-01");
    const link = page.locator("#link-run");
    await expect(link).toBeVisible({ timeout: 15000 });
    await expect
      .poll(async () => link.getAttribute("href"), { timeout: 10000 })
      .toContain("lab-soc-phishing-email-01");
    const href = await link.getAttribute("href");
    expect(href).toMatch(/runner=simulation/);
  });

  test("NAV-02 lab details Lab2 uses fixed-data runner", async ({ page }) => {
    await openLabDetails(page, "lab-soc-log-triage-01");
    const link = page.locator("#link-run");
    await expect
      .poll(async () => link.getAttribute("href"), { timeout: 10000 })
      .toContain("lab-soc-log-triage-01");
    const href = await link.getAttribute("href");
    expect(href).toMatch(/runner=fixed-data/);
  });

  test("S-08 unknown lab does not complete", async ({ page }) => {
    await openRun(page, "lab-does-not-exist-01", "simulation");
    await page.waitForTimeout(1500);
    const body = await page.locator("#labs-runner-mount").innerText();
    expect(body).toMatch(/تعذر|غير موجود|سجل/);
    const stored = await page.evaluate(() =>
      sessionStorage.getItem("labs:result:lab-does-not-exist-01")
    );
    if (stored) {
      const data = JSON.parse(stored);
      expect(data.complete).not.toBe(true);
    }
  });

  test("X-06 Lab1 success stores session result", async ({ page }) => {
    await openRun(page, "lab-soc-phishing-email-01", "simulation");
    await expect(page.getByRole("heading", { name: "تشغيل المحاكاة" })).toBeVisible({
      timeout: 20000,
    });
    await fillLab1(page, baselines.B1);
    await submit(page);
    await page.waitForTimeout(500);
    const raw = await page.evaluate(() =>
      sessionStorage.getItem("labs:result:lab-soc-phishing-email-01")
    );
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw);
    expect(data.complete).toBe(true);
    expect(data.parts.q1).toBe(true);
  });

  test("X-01 Lab1 later failure overwrites prior success in sessionStorage", async ({
    page,
  }) => {
    await openRun(page, "lab-soc-phishing-email-01", "simulation");
    await expect(page.getByRole("heading", { name: "تشغيل المحاكاة" })).toBeVisible({
      timeout: 20000,
    });
    await fillLab1(page, baselines.B1);
    await submit(page);
    await page.waitForTimeout(400);
    let raw = await page.evaluate(() =>
      sessionStorage.getItem("labs:result:lab-soc-phishing-email-01")
    );
    expect(JSON.parse(raw).complete).toBe(true);

    await page.locator('input[name="q2"][value="a"]').check();
    await submit(page);
    await page.waitForTimeout(400);
    raw = await page.evaluate(() =>
      sessionStorage.getItem("labs:result:lab-soc-phishing-email-01")
    );
    const data = JSON.parse(raw);
    expect(data.complete).toBe(false);
    expect(data.parts.q2).toBe(false);
  });

  test("X-04 Lab6 results page reads q1-q4 only (observed defect)", async ({ page }) => {
    await openRun(page, "lab-soc-incident-response-01", "simulation");
    await expect(page.getByRole("heading", { name: "تشغيل المحاكاة" })).toBeVisible({
      timeout: 25000,
    });
    await page.evaluate((payload) => {
      sessionStorage.setItem(
        "labs:result:lab-soc-incident-response-01",
        JSON.stringify(payload)
      );
    }, {
      complete: true,
      critical: false,
      parts: {
        q1: true,
        q1b: true,
        q2: true,
        q2b: true,
        q3a: true,
        q3b: true,
        q3c: true,
        q3d: true,
        q4: true,
        q5: true,
      },
      at: Date.now(),
    });
    await page.goto("/academy/labs/results.html?id=lab-soc-incident-response-01", {
      waitUntil: "networkidle",
    });
    const text = await page.locator("#result-mount").innerText();
    expect(text).toMatch(/مكتمل/);
    expect(text).toMatch(/القرار:\s*لا/);
  });

  test("X-08 Lab2 retry link forces simulation runner (observed defect)", async ({
    page,
  }) => {
    await page.goto("/academy/labs/results.html?id=lab-soc-log-triage-01", {
      waitUntil: "networkidle",
    });
    const href = await page.locator("#link-retry").getAttribute("href");
    expect(href).toContain("simulation");
    expect(href).toContain("lab-soc-log-triage-01");
  });
});
