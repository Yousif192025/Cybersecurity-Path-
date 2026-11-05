const { test, expect } = require("@playwright/test");

const labId = "lab-cloud-security-assessment-01";

const weaknesses = [
  ["c-iam-admin-no-mfa", "high", "enable-mfa"],
  ["c-iam-role-wild", "high", "least-privilege"],
  ["c-s3-public-payroll", "critical", "block-public-encrypt"],
  ["c-ssh-open", "critical", "restrict-ssh"],
  ["c-imdsv1", "medium", "require-imdsv2"],
  ["c-no-access-log", "medium", "enable-access-logs"],
  ["c-alert-off", "medium", "enable-mfa-alerts"],
  ["c-backup-open", "high", "harden-backup"],
];

const resources = [
  "iam-users",
  "storage",
  "network",
  "compute",
  "logging",
  "backup",
];

test("Lab8 full learner journey", async ({ page }) => {
  const jsErrors = [];
  page.on("pageerror", error => jsErrors.push(error.message));

  await page.goto(
    `/academy/labs/run.html?id=${labId}&runner=cloud-security-assessment`,
    { waitUntil: "networkidle" }
  );

  const resourceButtons = page.locator(".cloud-device-btn");
  await expect(resourceButtons).toHaveCount(6, { timeout: 20000 });

  for (const id of resources) {
    const button = page.locator(`[data-device="${id}"]`);
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toHaveClass(/is-active/);
    await expect(page.locator(".cloud-device-detail")).not.toBeEmpty();
  }

  for (const [id, risk] of weaknesses) {
    await page.locator(`input[name="weakness"][value="${id}"]`).check();
    await page.locator(`select[name="risk-${id}"]`).selectOption(risk);
    await page.locator(`select[name="rem-${id}"]`).selectOption(
      weaknesses.find(item => item[0] === id)[2]
    );
  }

  await page.locator('[name="priorityOrder"]').fill(
    "c-s3-public-payroll, c-ssh-open, c-iam-admin-no-mfa, " +
    "c-iam-role-wild, c-backup-open, c-imdsv1, c-no-access-log, c-alert-off"
  );

  await page.locator('[name="reportText"]').fill(
    "تقرير تقييم بيئة أفق السحابية: أظهرت المراجعة والتقييم وجود مخاطر " +
    "عامّة في تخزين بيانات الرواتب وSSH وحسابات MFA. نوصي بحظر الوصول " +
    "وتقييد الإدارة وتفعيل التشفير والمعالجة. لم يُثبت هذا الفحص كل الأثر، " +
    "ويجب إعادة التحقق بعد المعالجة."
  );

  await page.getByRole("button", { name: "إرسال التقييم السحابي" }).click();

  const result = page.locator(".cloud-result");
  await expect(result).toBeVisible();
  await expect(result).toContainText("النتيجة: مكتمل");

  const stored = await page.evaluate(id =>
    sessionStorage.getItem("labs:result:" + id), labId
  );

  expect(stored).toBeTruthy();

  const data = JSON.parse(stored);
  expect(data.complete).toBe(true);

  for (const part of ["discover", "risk", "priority", "remediation", "report"]) {
    expect(data.parts[part], `Expected ${part} to pass`).toBe(true);
  }

  await page.getByRole("link", { name: "عرض صفحة النتائج" }).click();
  await expect(page).toHaveURL(/results\.html/);
  await expect(page.locator("#result-mount")).toContainText(/مكتمل/);

  expect(jsErrors, "Browser JavaScript errors").toEqual([]);
});
