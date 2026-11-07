const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const labId = "lab-forensics-file-investigation-01";

const content = JSON.parse(fs.readFileSync(
  path.join(root, "data/content", `${labId}.json`), "utf8"
));
const assessment = JSON.parse(fs.readFileSync(
  path.join(root, "data/assessment", `${labId}.json`), "utf8"
));

test("Lab7 complete digital forensics investigation", async ({ page }) => {
  const jsErrors = [];
  page.on("pageerror", error => jsErrors.push(error.message));

  await page.goto(
    `/academy/labs/run.html?id=${labId}&runner=digital-forensics`
  );

  await expect(page.locator(".df-stage-mount")).toBeVisible();
  await expect(page.locator(".df-stage-mount")).toContainText("ملخص القضية");

  // 1. Case intake
  await page.getByRole("button", { name: "التالي" }).click();

  // 2. Open every evidence panel
  await expect(page.locator(".df-side-btn")).toHaveCount(
    content.evidencePanels.length
  );
  await page.locator(".df-side-btn").evaluateAll(buttons => {
    buttons.forEach(button => button.click());
  });
  await page.getByRole("button", { name: "التالي" }).click();

  // 3. Inspect the process tree
  await expect(page.locator(".df-proc-btn").first()).toBeVisible();
  await page.locator(".df-proc-btn").evaluateAll(buttons => {
    buttons.forEach(button => button.click());
  });
  await page.getByRole("button", { name: "التالي" }).click();

  // 4. Rebuild the timeline in the assessment's expected order
  const eventsById = Object.fromEntries(
    content.events.map(event => [event.id, event])
  );

  for (let target = 0; target < assessment.timelineOrder.length; target++) {
    const expectedEvent = eventsById[assessment.timelineOrder[target]];
    if (!expectedEvent) throw new Error("Missing expected timeline event");

    for (;;) {
      const rows = page.locator(".df-tl-row");
      const texts = await rows.locator(".df-tl-body").allTextContents();
      const current = texts.findIndex(text =>
        text.includes(expectedEvent.title)
      );

      if (current < 0) throw new Error(
        `Timeline event not found: ${expectedEvent.title}`
      );
      if (current === target) break;

      await rows.nth(current).locator(".df-mini").first().click();
    }
  }
  await page.getByRole("button", { name: "التالي" }).click();

  // 5. Classify every evidence statement using the answer key
  for (const [id, answer] of Object.entries(assessment.classificationKey)) {
    await page.locator(`[data-class-for="${id}"]`).selectOption(answer);
  }
  await page.getByRole("button", { name: "التالي" }).click();

  // 6. Select the recommended response and write the final report
  await page.locator(
    `input[name="df-response"][value="${assessment.correctResponseId}"]`
  ).check();

  await page.locator(".df-report").fill(
    "التحقيق على HR-WS-027 للمستخدم n.salem كشف Payroll_Export_v2.exe. " +
    "الملف شُغّل بواسطة PID 5188 وأنشأ عملية powershell، ثم اتصل بـ " +
    "updates-cdn.example.test وأنشأ config.dat. " +
    "تم ربط الاستنتاجات بالأدلة مع عدم الجزم بتسريب البيانات أو انتشار الإصابة."
  );

  await page.getByRole("button", { name: "إرسال التقييم" }).click();

  // Verify saved result and all assessment dimensions
  await expect(page.locator(".df-result")).toContainText("النتيجة: مكتمل");

  const saved = await page.evaluate(id => {
    return JSON.parse(sessionStorage.getItem("labs:result:" + id));
  }, labId);

  expect(saved).not.toBeNull();
  expect(saved.complete).toBe(true);
  for (const part of [
    "explore", "timeline", "classification", "response", "report"
  ]) {
    expect(saved.parts[part], `${part} should pass`).toBe(true);
  }

  // Verify the actual results page
  await page.getByRole("link", { name: "عرض صفحة النتائج" }).click();
  await expect(page).toHaveURL(/results\.html/);
  await expect(page.locator("#result-mount")).toContainText("مكتمل");

  expect(jsErrors).toEqual([]);
});
