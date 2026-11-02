const { defineConfig } = require("@playwright/test");
const path = require("path");

/** Serve static site from repo docs/ (Vercel publish root). */
const docsRoot = path.resolve(__dirname, "../../docs");

module.exports = defineConfig({
  testDir: "./specs",
  timeout: 60000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    locale: "ar",
  },
  webServer: {
    command: `python3 -m http.server 4173 --directory "${docsRoot}"`,
    port: 4173,
    reuseExistingServer: true,
    timeout: 20000,
  },
});
