# Validation Report — CyberPath Workshop Engine v1

> **Note:** this report covers the original build (engine + Deleted Data
> Workshop v1). A later content-only revision (scientific accuracy pass:
> HDD/SSD/Flash distinction, TRIM/Wear Leveling/Garbage Collection,
> encryption, media-appropriate secure sanitization, expanded scenarios
> and quiz) is validated separately in `CONTENT-REFINEMENT-REPORT.md` §G.
> The engine and all non-content files are unchanged between the two.

All checks below were run against the package in this repository, served
locally over HTTP (`python3 -m http.server`) and driven with a headless
Chromium browser (Playwright). This is real, executed testing — not a
description of intended behavior.

## 1. What was tested

### Functional
- [x] Hub page (`workshops/index.html`) loads and renders 5 workshop
      cards from `workshops-registry.json` (1 "available", 4 "soon").
- [x] Opening the Deleted Data Workshop renders the hero section with
      correct title/subtitle/objectives.
- [x] Next/Previous navigation through all **11 sections**
      (hero → 8 content/interactive sections → quiz → completion).
- [x] Progress bar and "القسم X من 11" label update correctly at every
      step.
- [x] Interactive opening question (section 01): selecting an option
      shows correct/incorrect state and explanation.
- [x] Timeline (section 02): steps expand/collapse on click.
- [x] Interactive cards grid (section 04): tiles reveal detail text on
      click, collapse on second click.
- [x] Content sections with the CIA-triad highlight cards (section 06)
      render correctly.
- [x] Interactive scenarios (section 07): both scenarios are answerable
      independently via the scenario dots, each shows result +
      explanation + recommended action after answering.
- [x] True/False section (section 08): all 6 statements answerable,
      correct/incorrect state shown, explanation revealed.
- [x] Final quiz (section 09, 11 questions): "Finish quiz" button stays
      disabled with a live "answered X/11" counter until all questions
      are answered, then submits, scores, and shows a result summary
      (score, percentage, correct, wrong) plus **explanations for every
      missed question**, as required.
- [x] Completion screen (section 10): shows workshop title, score,
      percentage, completion date, and three actions — restart quiz,
      review content (jumps back to section 1), return to workshops hub.
- [x] "Restart quiz" clears the stored result and returns to the quiz
      section for a retake.
- [x] `localStorage` used only for `cwe:deleted-data:progress` (current
      section index) and `cwe:deleted-data:result` (score/date) —
      confirmed via direct inspection of `localStorage` keys, and no
      other keys are written.

### Technical
- [x] All 3 JSON files parse successfully (`python3 -m json.load`).
- [x] All 3 JavaScript files pass `node --check` (syntax-valid ES
      modules).
- [x] No duplicate `id` attributes in the DOM at any of the 11 steps
      (checked programmatically at every step during the walkthrough).
- [x] Every `correctId` / `correct` reference in `workshop.json` and
      `questions.json` was verified to exist among that question's own
      `options` (automated check).
- [x] No duplicate ids among the 6 true/false statements or the 11 quiz
      questions.
- [x] All internal asset paths (CSS, JS, JSON) resolve with HTTP 200:
      `engine/workshop-engine.css`, `engine/workshop-engine.js`,
      `workshops/deleted-data/js/workshop.js`,
      `workshops/deleted-data/data/workshop.json`,
      `workshops/deleted-data/data/questions.json`,
      `shared/data/workshops-registry.json`.
- [x] No JavaScript console/page errors from the application itself
      during a full click-through of every section, the true/false set,
      and the full quiz submission. The only console message observed
      was a browser-generated `404` for `/favicon.ico`, which every
      static site without a favicon produces and which is unrelated to
      the application code.

### Responsive
- [x] Verified no horizontal overflow (`scrollWidth <= clientWidth`) at
      a 360×740 mobile viewport.
- [x] Layout uses CSS grid/flexbox with responsive breakpoints (2-column
      tile grid on narrow screens, up to 3 columns from 560px; hub cards
      1 column under 720px, 2 columns above).
- Tablet/desktop breakpoints were reviewed in code (`@media` rules in
  `workshop-engine.css`) but not separately screenshot-tested in this
  session; recommend a quick visual pass at ~768px and ~1280px during
  integration review.

### Accessibility (code-level)
- [x] Semantic headings (`h1`/`h2`/`h3`/`h4`) used for hierarchy.
- [x] All interactive controls are real `<button>` or `<a>` elements
      (keyboard-reachable and activatable by default), not clickable
      `<div>`s.
- [x] `aria-pressed`, `aria-expanded`, `aria-current`, `role="group"`,
      `role="progressbar"`, and `aria-live="polite"` are used where
      state changes need to be conveyed.
- [x] Correct/incorrect states are shown with a border color change
      *and* explanatory text/icon (✅/💡), not color alone.
- [x] Focus-visible outlines defined for all interactive elements.
- [x] A skip link to the workshop content is present on the workshop
      page.

### Security
- [x] No `eval()` anywhere in the codebase.
- [x] No inline `on*` HTML attributes; all listeners attached via
      `addEventListener` (through the small `el()` helper).
- [x] All dynamic content is inserted via `textContent` /
      `createElement`, never `innerHTML`, eliminating injection risk
      from workshop JSON data.

## 2. Bug found and fixed during testing

While scripting the automated quiz walkthrough, the **quiz submit
button never became enabled** after answering questions — the option
click handler only re-rendered the question list, not the submit-bar
component that tracks "answered X/N" and the button's disabled state.
This was a real functional bug, not a hypothetical one: the automated
test failed on this exact interaction. It has been fixed (the option
click handler now refreshes both the question list and the submit bar),
and the fix was re-verified with a second full run: the quiz now submits
correctly and shows a result summary.

## 3. Assumptions used (see also README §8 and INTEGRATION.md §9)

- No CyberPath Academy reference files (existing CSS, shared JS, example
  page, navigation markup, or JSON data example) were provided in this
  session, so `engine/workshop-engine.css` implements an original dark
  cyber theme rather than matching the real site pixel-for-pixel.
- The `docs/academy/...` folder layout mentioned in the original brief
  was taken as given, but not verified against a real repository.

## 4. Not tested in this session (recommend before merging)

- Real cross-browser testing (Safari, Firefox) — only Chromium was
  available in this sandboxed environment.
- Screen-reader testing with an actual assistive technology (NVDA/
  VoiceOver) — only static ARIA-attribute review was performed.
- Visual comparison against the real CyberPath Academy design system,
  since no reference files were supplied.
- Integration inside the actual repository (this package was never
  copied into or tested against CyberPath's codebase, per the task's
  "no repository modification" requirement).
