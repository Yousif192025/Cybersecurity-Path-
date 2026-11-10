const { test, expect } = require("@playwright/test");

test("Lab 3 packet analysis completes the full browser workflow", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", error => pageErrors.push(error.message));

  const labId = "lab-network-wireshark-01";

  await page.goto(
    `/academy/labs/run.html?id=${labId}&runner=packet-analysis`
  );

  const lab = page.locator(".lab-pkt");
  await expect(lab).toBeVisible();

  const next = lab.locator(".pkt-nav-bar button").nth(1);

  // Stage 1: case intake -> packet explorer
  await next.click();

  // Stage 2: open at least five distinct packets.
  for (const packetId of ["p02", "p03", "p04", "p05"]) {
    await lab.locator(`[data-pkt="${packetId}"]`).click();
  }

  await expect(lab.locator(".pkt-detail")).toContainText("Ethernet");

  // Stage 3: verify unsupported filters do not prevent valid analysis.
  await next.click();

  const filter = lab.locator(".pkt-filter-input");
  const apply = lab.getByRole("button", { name: "تطبيق" });
  const status = lab.locator(".pkt-filter-status");

  await filter.fill("unsupported.field == 1");
  await apply.click();
  await expect(status).toHaveClass(/is-bad/);

  await filter.fill("dns");
  await apply.click();
  await expect(status).not.toHaveClass(/is-bad/);
  await expect(status).toContainText("النتائج:");

  await filter.fill("tcp.port == 8080");
  await apply.click();
  await expect(status).not.toHaveClass(/is-bad/);

  // Stage 4: select the four evidence-backed suspicious indicators.
  await next.click();

  const suspiciousIndicators = [
    "ind-dns-suspicious",
    "ind-http-install",
    "ind-octet-stream",
    "ind-syn-scan"
  ];

  for (const id of suspiciousIndicators) {
    await lab.locator(`input[type="checkbox"][value="${id}"]`).check();
  }

  // Stage 5: choose the appropriate defensive response and write the report.
  await next.click();

  await lab.locator(
    'input[type="radio"][value="r-block-isolate"]'
  ).check();

  const report = [
    "تحليل DNS أظهر النطاق update-secure-login.example.test.",
    "الحزم تكشف اتصال 10.20.5.42 إلى 198.51.100.66 عبر المنفذ 8080.",
    "طلب HTTP GET /agent/install تلاه application/octet-stream.",
    "كما ظهرت محاولات SYN على المنفذين 22 و445.",
    "ينبغي عزل المحطة وحظر الوجهة وجمع الأدلة، مع تمييز DNS الداخلي وTLS المعتاد."
  ].join(" ");

  await lab.locator(".pkt-report").fill(report);

  // Submit and verify the completion result.
  await next.click();

  const result = lab.locator(".pkt-result");
  await expect(result).toBeVisible();
  await expect(result).toContainText("النتيجة: مكتمل");

  const savedResult = await page.evaluate(id => {
    const raw = sessionStorage.getItem(`labs:result:${id}`);
    return raw ? JSON.parse(raw) : null;
  }, labId);

  expect(savedResult).not.toBeNull();
  expect(savedResult.complete).toBe(true);

  // Open the results page and verify it renders the saved result.
  await result.getByRole("link", { name: "عرض صفحة النتائج" }).click();

  await expect(page).toHaveURL(/results\.html/);
  await expect(page.locator("#result-mount")).toContainText("مكتمل");

  expect(pageErrors).toEqual([]);
});
