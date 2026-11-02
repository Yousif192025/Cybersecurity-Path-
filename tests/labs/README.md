# CyberPath Labs Center — Phase 0 Regression (tests/labs)

Isolated test package. **Does not modify** `docs/academy/labs` content, root `package.json`, or production deploy.

## Install (once)

```bash
cd tests/labs
npm install
npx playwright install --with-deps chromium
```

## Run smoke (P0-A)

```bash
npm run test:smoke
```

Requires a local `docs/` tree (static files) at the repo/docs path used by `playwright.config.js`.

## Scope

- **P0-A0 / P0-A only** until further approval.
- Do not start P0-B without explicit permission.
- Known defects use expected-fail patterns later; smoke only checks page load.

## Published labs under test

1. lab-soc-phishing-email-01 (simulation)
2. lab-soc-log-triage-01 (fixed_data)
3. lab-soc-incident-response-01 (simulation)
