# Integration Guide — CyberPath Workshop Engine v1

**Status: documentation only.** Nothing in this file has been applied to
the CyberPath Academy repository. This describes the recommended manual
integration steps for your team to review and carry out.

---

## 1. Where files should go

Assuming the existing Academy structure follows the pattern described in
the original brief:

```text
docs/academy/
docs/academy/css/
docs/academy/js/
docs/academy/data/
```

The recommended target layout is:

```text
docs/
└── academy/
    └── workshops/
        ├── index.html                 ← from workshops/index.html
        ├── hub.js                     ← from workshops/hub.js
        │
        ├── engine/
        │   ├── workshop-engine.js     ← from engine/workshop-engine.js
        │   └── workshop-engine.css    ← from engine/workshop-engine.css
        │
        ├── shared/
        │   ├── data/
        │   │   └── workshops-registry.json
        │   └── assets/
        │
        └── deleted-data/
            ├── index.html
            ├── data/
            │   ├── workshop.json
            │   └── questions.json
            ├── js/
            │   └── workshop.js
            └── assets/
```

If your real repository uses a different existing convention for feature
folders under `docs/academy/`, keep the same **internal** structure
(`engine/` separate from each workshop folder) but place the whole
`workshops/` folder wherever it fits your existing routing.

---

## 2. Files to copy as-is (no changes expected)

- `engine/workshop-engine.js`
- `workshops/deleted-data/data/workshop.json`
- `workshops/deleted-data/data/questions.json`
- `workshops/deleted-data/js/workshop.js`
- `shared/data/workshops-registry.json`

## 3. Files that will need small path/reference edits

- `workshops/index.html` and `workshops/deleted-data/index.html` — update:
  - The `<link rel="stylesheet">` path(s) once merged next to Academy's
    real CSS (see §4).
  - `rel="canonical"` with the real production URL.
  - The breadcrumb link back to Academy's actual navigation, if different
    from a plain `../index.html`.
- `workshops/hub.js` — only if the final path to
  `shared/data/workshops-registry.json` differs from the one used here
  (`../shared/data/workshops-registry.json` relative to `workshops/`).

## 4. CSS integration

This package ships **one** new stylesheet, `engine/workshop-engine.css`,
scoped under a single root class `.cwe-root` (all component classes are
prefixed `cwe-` to avoid colliding with existing Academy CSS). It does
**not** modify or replace `style.css`.

Two integration options, in order of preference:

1. **Keep it as a second stylesheet** (recommended, lowest risk): link
   both `style.css` and `workshop-engine.css` on workshop pages. Because
   every rule is scoped under `.cwe-root`/`cwe-*` classes, there should be
   no conflict with existing Academy styles.
2. **Merge CSS variables**: if Academy already defines root-level design
   tokens (colors, fonts, spacing) in `style.css`, replace the `:root`
   block at the top of `workshop-engine.css` with references to Academy's
   existing variables instead of the new `--cwe-*` values, so the
   workshops inherit the exact same palette automatically. This requires
   someone with access to the real `style.css` to map the two variable
   sets — not done here, since no reference file was provided (see
   README §8).

No existing Academy CSS file needs to be edited either way.

## 5. JavaScript integration

- `workshop-engine.js` is a self-contained ES module with no external
  dependencies. It can be dropped in without touching any existing JS
  file.
- Each workshop's `workshop.js` loader only imports from
  `workshop-engine.js` via a relative path — update that relative path if
  the final folder depth differs from this package's layout.
- Nothing here registers global variables, patches existing objects, or
  adds event listeners outside the workshop's own mount element.

## 6. Navigation integration

- Do **not** create a new, separate navigation system.
- Add a single link/card to the existing Academy navigation (main menu,
  dashboard, or relevant section) pointing to
  `docs/academy/workshops/index.html`. Where exactly that link goes
  depends on Academy's current navigation component, which was not
  provided in this session — a developer with repo access should decide
  the best placement and add one `<a>`/nav item, without restructuring
  existing navigation.

## 7. Files that must NOT be modified

- `docs/academy/css/style.css` (no rewrite, no edits)
- Any existing Academy page, layout, or shared JS file
- Any existing JSON data file unrelated to workshops

## 8. Suggested integration steps (manual, by your team)

1. Copy the `workshops/` folder (including `engine/` and `shared/`) into
   `docs/academy/`.
2. Open `workshops/index.html` and `workshops/deleted-data/index.html`,
   fix the stylesheet `<link>` path(s) per §4.
3. Add one navigation entry linking to the new hub page, per §6.
4. Serve the site locally and click through the full Deleted Data
   Workshop (see `README.md` §6 and `VALIDATION.md`).
5. Once verified, commit as a single, reviewable change.

## 9. Assumptions made in absence of reference files

Since no `style.css`, shared JS, example Academy page, navigation
example, or JSON data example were attached in this session, the
following were assumed and should be re-checked against the real repo:

- Existing Academy pages use a `docs/academy/` root with `css/`, `js/`,
  and `data/` subfolders (as stated in the original brief).
- Academy's navigation is a conventional HTML nav component that can
  accept one more link without structural changes.
- No existing global CSS class names collide with the `cwe-` prefix used
  throughout `workshop-engine.css`.
- Academy does not currently forbid ES modules (`<script type="module">`)
  or `fetch()`-based JSON loading.

If any of these assumptions are inaccurate, the fix is limited to
`workshops/index.html`, `workshops/deleted-data/index.html`, and the
`<link>`/`<script>` paths inside them — the engine and workshop content
itself do not depend on these assumptions.
