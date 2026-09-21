# CyberPath Workshop Engine v1 (Standalone Package)

A reusable, data-driven engine for building interactive cybersecurity-awareness
workshops for **CyberPath Academy**, plus one fully implemented workshop:
**"أين تذهب البيانات بعد الحذف؟"** (Deleted Data Workshop).

> **This package is standalone.** It does not modify, depend on, or ship
> any file from the CyberPath Academy repository. It is meant to be
> reviewed, tested, and later integrated manually — see `INTEGRATION.md`.

---

## 1. Architecture

```text
Workshop Engine (shared, content-agnostic)
      │
      ├── Deleted Data Workshop      ✅ implemented in this version
      ├── Phishing Workshop          🔜 future (placeholder folder only)
      ├── Password Security Workshop 🔜 future (placeholder folder only)
      ├── Cloud Privacy Workshop     🔜 future (placeholder folder only)
      └── Digital Footprint Workshop 🔜 future (placeholder folder only)
```

```text
cyberpath-workshop-engine/
│
├── index.html                  # redirects to the workshops hub (for preview only)
├── README.md                   # this file
├── INTEGRATION.md              # how to merge this into CyberPath Academy (not applied)
├── VALIDATION.md               # what was tested and the results
│
├── engine/
│   ├── workshop-engine.js      # generic engine — NO workshop content here
│   └── workshop-engine.css     # shared, reusable component styles
│
├── shared/
│   ├── data/
│   │   └── workshops-registry.json   # list of all workshops (available + "soon")
│   └── assets/                       # reserved for shared icons/images
│
└── workshops/
    ├── index.html               # hub page listing all workshops
    ├── hub.js                   # renders the hub from workshops-registry.json
    │
    ├── deleted-data/            # ✅ fully implemented workshop
    │   ├── index.html
    │   ├── data/
    │   │   ├── workshop.json    # workshop metadata + section structure
    │   │   └── questions.json   # true/false bank + final quiz bank
    │   ├── js/
    │   │   └── workshop.js      # 10-line loader, wires engine to this workshop's data
    │   └── assets/
    │
    ├── phishing/README.md              # reserved placeholder, no content
    ├── password-security/README.md     # reserved placeholder, no content
    ├── cloud-privacy/README.md         # reserved placeholder, no content
    └── digital-footprint/README.md     # reserved placeholder, no content
```

**Core principle:** `Engine` (shared logic + styling) is completely
separate from `Workshop Content` (per-workshop JSON + a tiny loader
script). Adding a new workshop never requires touching
`engine/workshop-engine.js` or `engine/workshop-engine.css`.

---

## 2. How the Engine works

`engine/workshop-engine.js` exports a single class, `WorkshopEngine`:

```js
import { WorkshopEngine } from "../../engine/workshop-engine.js";

const engine = new WorkshopEngine({
  mountId: "workshop-root",       // id of the container element
  configUrl: "./data/workshop.json",
  questionsUrl: "./data/questions.json", // optional, only needed if the
                                          // workshop has a "true-false" or
                                          // "quiz" section
});

engine.init();
```

The engine:

- Fetches `workshop.json` (metadata + ordered list of "sections") and
  `questions.json` (question banks).
- Renders one section at a time inside the mount element, with a shared
  progress bar ("القسم 3 من 8"), Previous/Next navigation, and keyboard
  arrow-key navigation.
- Persists only the current section index and the latest quiz result to
  `localStorage`, namespaced as `cwe:<workshop-id>:progress` and
  `cwe:<workshop-id>:result`. No personal or sensitive data is stored.
- Dispatches rendering to one of several built-in **section types** (see
  below), all driven entirely by data — nothing is hard-coded per workshop.

### Supported section types

| `type`            | Used for                                              |
|-------------------|--------------------------------------------------------|
| `hero`            | Title, subtitle, description, meta, learning objectives |
| `intro-question`  | A single interactive opening question with explanation |
| `timeline`        | An expandable step-by-step journey (e.g. data lifecycle) |
| `explainer`       | A list of term → definition items                      |
| `cards`           | A grid of clickable tiles, each revealing a short detail |
| `content`         | Rich text blocks, optional callout, optional 3-card "highlights" (e.g. CIA triad) |
| `scenario`        | One or more decision-based scenarios with feedback      |
| `true-false`      | A set of true/false statements pulled from `questions.json.trueFalse` |
| `quiz`            | The graded final quiz pulled from `questions.json.quiz`  |
| `completion`      | Final score, completion date, restart / review / back actions |

---

## 3. Workshop configuration format (`workshop.json`)

```jsonc
{
  "id": "deleted-data",
  "title": "...",
  "subtitle": "...",
  "description": "...",
  "duration": "ساعتان",
  "level": "مبتدئ",
  "language": "ar",
  "direction": "rtl",
  "objectives": ["...", "..."],
  "sections": [
    { "id": "hero", "type": "hero", "navLabel": "..." },
    { "id": "s01", "type": "intro-question", "title": "...", "data": { /* type-specific */ } }
    // ...
  ]
}
```

Each section needs a unique `id`, a `type` (see table above), a `title`
(shown as the on-screen heading, not needed for `hero`/`completion`), and
a `data` object whose shape depends on `type`. Open
`workshops/deleted-data/data/workshop.json` for a complete, working
example of every section type.

---

## 4. Question bank format (`questions.json`)

```jsonc
{
  "trueFalse": [
    { "id": "tf-1", "text": "...", "answer": true, "explanation": "..." }
  ],
  "quiz": [
    {
      "id": "q1",
      "type": "mc",           // "mc" | "tf" | "scenario" — documentation only
      "prompt": "...",
      "options": [{ "id": "a", "text": "..." }, { "id": "b", "text": "..." }],
      "correctId": "b",
      "explanation": "..."
    }
  ]
}
```

The quiz section renders **10–12** mixed questions (multiple choice,
true/false phrased as a statement, and scenario-based) using the same
`options` + `correctId` shape, so the engine doesn't need special cases
per question type.

---

## 5. How to add a new workshop

1. Create `workshops/<new-id>/` with `index.html`, `data/workshop.json`,
   `data/questions.json` (if it uses `true-false` / `quiz` sections), and
   `js/workshop.js`.
2. Copy `workshops/deleted-data/js/workshop.js` and update the two
   relative paths (`configUrl`, `questionsUrl`) — this file is
   intentionally ~10 lines.
3. Copy `workshops/deleted-data/index.html` and update the `<title>`,
   meta description, breadcrumb text, and script `src`.
4. Add an entry to `shared/data/workshops-registry.json` with
   `"status": "available"` and the correct `href`.
5. **Do not** edit `engine/workshop-engine.js` or
   `engine/workshop-engine.css` unless you are adding a genuinely new,
   reusable section *type* that other workshops could also use.

---

## 6. How to test locally

Because the engine loads `workshop.json` / `questions.json` via
`fetch()`, opening `index.html` directly from disk (`file://`) will fail
in most browsers due to CORS restrictions on local file access. Serve the
folder over HTTP instead, for example:

```bash
cd cyberpath-workshop-engine
python3 -m http.server 8080
# then open http://localhost:8080/
```

or, with Node installed:

```bash
npx serve .
```

See `VALIDATION.md` for the full list of checks already performed.

---

## 7. Design & tech constraints followed

- Vanilla HTML/CSS/JavaScript (ES modules) only — no frameworks or heavy
  libraries.
- No `eval()`, no inline event handlers, no unsafe dynamic HTML (all DOM
  content is built with `createElement`/`textContent`, never
  `innerHTML` with dynamic data).
- Arabic RTL, Tajawal font, dark "cyber" theme, mobile-first responsive
  layout, keyboard navigation, focus states, and answer states that never
  rely on color alone (icons/text accompany every correct/incorrect
  state).
- `localStorage` is used only for workshop progress and quiz results —
  never personal or sensitive data.

## 8. Known limitation / assumption

No CyberPath Academy reference files (existing `style.css`, shared JS,
an example Academy page) were provided in this session, so the visual
design here is an original **dark cyber theme** (colors, spacing, card
style) built to plausibly match an "Academy"-style cybersecurity
platform, not a pixel-match of your actual site. Before integration,
compare this theme's CSS variables (top of `engine/workshop-engine.css`)
against your real `style.css` and adjust colors/fonts/spacing to match
exactly — see `INTEGRATION.md` §4.
