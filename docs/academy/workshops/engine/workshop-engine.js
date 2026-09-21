/**
 * CyberPath Academy — Workshop Engine v1
 * ---------------------------------------------------------------------------
 * Generic, reusable engine for rendering interactive workshops.
 *
 * IMPORTANT — Separation of concerns:
 *   - This file contains ZERO workshop-specific content.
 *   - Each workshop supplies its own `workshop.json` (configuration + section
 *     data) and `questions.json` (true/false + quiz bank).
 *   - Adding a new workshop should never require editing this file.
 *
 * Supported section `type` values:
 *   hero | intro-question | timeline | explainer | cards | content |
 *   scenario | true-false | quiz | completion
 *
 * No eval(), no inline event handlers, no innerHTML with unsanitized data.
 * ---------------------------------------------------------------------------
 */

/* ------------------------------- Utilities ------------------------------- */

/** Safe text node creator — never interprets `text` as HTML. */
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key.startsWith("data-")) {
      node.setAttribute(key, value);
    } else {
      node.setAttribute(key, value);
    }
  }
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === undefined || child === null || child === false) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (e) {
    return date.toISOString().slice(0, 10);
  }
}

/** Minimal, namespaced localStorage wrapper. Never stores sensitive data. */
const Store = {
  key(workshopId, name) {
    return `cwe:${workshopId}:${name}`;
  },
  get(workshopId, name, fallback = null) {
    try {
      const raw = localStorage.getItem(Store.key(workshopId, name));
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(workshopId, name, value) {
    try {
      localStorage.setItem(Store.key(workshopId, name), JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  remove(workshopId, name) {
    try {
      localStorage.removeItem(Store.key(workshopId, name));
    } catch (e) {
      /* ignore */
    }
  },
};

/* ------------------------------ WorkshopEngine ---------------------------- */

export class WorkshopEngine {
  /**
   * @param {Object} options
   * @param {string} options.mountId - id of the container element to render into
   * @param {string} options.configUrl - URL to workshop.json
   * @param {string} [options.questionsUrl] - URL to questions.json (true/false + quiz bank)
   */
  constructor({ mountId, configUrl, questionsUrl }) {
    this.mount = document.getElementById(mountId);
    if (!this.mount) {
      throw new Error(`WorkshopEngine: mount element #${mountId} not found`);
    }
    this.configUrl = configUrl;
    this.questionsUrl = questionsUrl || null;

    this.config = null;
    this.questions = null;
    this.sections = [];
    this.currentIndex = 0;

    // Per-run interactive state, keyed by section id.
    this.state = {};
    this.quizResult = null;
  }

  async init() {
    const [config, questions] = await Promise.all([
      fetch(this.configUrl).then((r) => {
        if (!r.ok) throw new Error(`Failed to load workshop config: ${r.status}`);
        return r.json();
      }),
      this.questionsUrl
        ? fetch(this.questionsUrl).then((r) => {
            if (!r.ok) throw new Error(`Failed to load questions: ${r.status}`);
            return r.json();
          })
        : Promise.resolve(null),
    ]);

    this.config = config;
    this.questions = questions;
    this.sections = config.sections || [];

    document.documentElement.setAttribute("dir", config.direction || "rtl");
    document.documentElement.setAttribute("lang", config.language || "ar");
    if (config.title) {
      document.title = `${config.title} | CyberPath Academy`;
    }

    // Restore saved progress (section index only — answers reset per visit
    // by design, to keep the workshop simple and avoid stale state bugs).
    const saved = Store.get(config.id, "progress");
    if (saved && Number.isInteger(saved.index) && saved.index < this.sections.length) {
      this.currentIndex = saved.index;
    }

    this._buildShell();
    this._renderCurrentStep();
    this._bindKeyboardNav();
  }

  /* --------------------------- Shell / chrome --------------------------- */

  _buildShell() {
    clear(this.mount);
    this.mount.classList.add("cwe-root");

    const page = el("div", { class: "cwe-page" });
    const container = el("div", { class: "cwe-container" });

    // Progress
    this.progressLabel = el("span", { text: "" });
    this.progressLabelTotal = el("span", { text: "" });
    const progressLabelRow = el("div", { class: "cwe-progress-label" }, [
      this.progressLabel,
      this.progressLabelTotal,
    ]);
    this.progressBarFill = el("div", { class: "cwe-progress-bar" });
    const progressTrack = el(
      "div",
      {
        class: "cwe-progress-track",
        role: "progressbar",
        "aria-valuemin": "0",
        "aria-valuemax": "100",
      },
      [this.progressBarFill]
    );
    this.progressTrack = progressTrack;
    const progressWrap = el("div", { class: "cwe-progress-wrap" }, [
      progressLabelRow,
      progressTrack,
    ]);

    // Step content mount point
    this.stepMount = el("div", {
      class: "cwe-card",
      role: "region",
      "aria-live": "polite",
      id: `${this.config.id}-step`,
    });

    // Bottom nav
    this.prevBtn = el("button", {
      type: "button",
      class: "cwe-btn cwe-btn--ghost",
      text: "السابق",
      onClick: () => this.goPrev(),
    });
    this.nextBtn = el("button", {
      type: "button",
      class: "cwe-btn cwe-btn--primary",
      text: "التالي",
      onClick: () => this.goNext(),
    });
    this.stepIndicator = el("span", { class: "cwe-step-indicator" });
    const navBar = el("div", { class: "cwe-nav-bar" }, [
      this.prevBtn,
      this.stepIndicator,
      this.nextBtn,
    ]);
    this.navBar = navBar;

    container.appendChild(progressWrap);
    container.appendChild(this.stepMount);
    container.appendChild(navBar);
    page.appendChild(container);
    this.mount.appendChild(page);

    this.progressWrap = progressWrap;
  }

  _bindKeyboardNav() {
    document.addEventListener("keydown", (event) => {
      const tag = (event.target && event.target.tagName) || "";
      if (["INPUT", "TEXTAREA"].includes(tag)) return;
      // RTL layout: visually-left arrow (ArrowLeft) still means "next"
      // in reading order for an RTL document; we keep it mapped to the
      // visible button positions instead of assuming reading direction.
      if (event.key === "ArrowRight") this.goPrev();
      if (event.key === "ArrowLeft") this.goNext();
    });
  }

  _saveProgress() {
    Store.set(this.config.id, "progress", { index: this.currentIndex });
  }

  goNext() {
    if (this.currentIndex < this.sections.length - 1) {
      this.currentIndex += 1;
      this._saveProgress();
      this._renderCurrentStep();
    }
  }

  goPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
      this._saveProgress();
      this._renderCurrentStep();
    }
  }

  goTo(index) {
    if (index >= 0 && index < this.sections.length) {
      this.currentIndex = index;
      this._saveProgress();
      this._renderCurrentStep();
    }
  }

  _renderCurrentStep() {
    const total = this.sections.length;
    const section = this.sections[this.currentIndex];

    // Progress bar (hero counts as step 1 for display purposes)
    const stepNumber = this.currentIndex + 1;
    const pct = Math.round((stepNumber / total) * 100);
    this.progressBarFill.style.width = `${pct}%`;
    this.progressTrack.setAttribute("aria-valuenow", String(pct));
    this.progressLabel.textContent = `القسم ${stepNumber} من ${total}`;
    this.progressLabelTotal.textContent = section.navLabel || "";

    // Nav buttons
    this.prevBtn.disabled = this.currentIndex === 0;
    const isLast = this.currentIndex === total - 1;
    this.nextBtn.style.display = isLast ? "none" : "";
    this.stepIndicator.textContent = `${stepNumber} / ${total}`;

    clear(this.stepMount);
    this.stepMount.setAttribute("tabindex", "-1");
    this.stepMount.appendChild(this._renderSection(section));
    this.stepMount.focus({ preventScroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------------ Renderers ------------------------------ */

  _renderSection(section) {
    switch (section.type) {
      case "hero":
        return this._renderHero(section);
      case "intro-question":
        return this._renderIntroQuestion(section);
      case "timeline":
        return this._renderTimeline(section);
      case "explainer":
        return this._renderExplainer(section);
      case "cards":
        return this._renderCards(section);
      case "content":
        return this._renderContent(section);
      case "scenario":
        return this._renderScenario(section);
      case "true-false":
        return this._renderTrueFalse(section);
      case "quiz":
        return this._renderQuiz(section);
      case "completion":
        return this._renderCompletion(section);
      default:
        return el("p", { text: `نوع قسم غير معروف: ${section.type}` });
    }
  }

  _renderHero(section) {
    const cfg = this.config;
    const frag = el("div", {}, [
      el("p", { class: "cwe-hero-eyebrow", text: "ورشة تفاعلية" }),
      el("h1", { class: "cwe-hero-title", text: cfg.title }),
      el("p", { class: "cwe-hero-subtitle", text: cfg.subtitle || "" }),
      el("p", { class: "cwe-hero-desc", text: cfg.description || "" }),
      el("div", { class: "cwe-meta-row" }, [
        cfg.duration && el("span", { class: "cwe-meta-pill", text: `⏱ ${cfg.duration}` }),
        cfg.level && el("span", { class: "cwe-meta-pill", text: `🎯 ${cfg.level}` }),
        el("span", { class: "cwe-meta-pill", text: `📚 ${this.sections.length} أقسام` }),
      ]),
    ]);

    if (Array.isArray(cfg.objectives) && cfg.objectives.length) {
      const list = el(
        "ul",
        {},
        cfg.objectives.map((obj) => el("li", { text: obj }))
      );
      frag.appendChild(
        el("div", { class: "cwe-objectives" }, [
          el("h3", { text: "بنهاية هذه الورشة ستكون قادرًا على:" }),
          list,
        ])
      );
    }
    return frag;
  }

  _renderIntroQuestion(section) {
    const data = section.data;
    const wrap = el("div", {}, [
      el("h2", { class: "cwe-step-title", text: section.title }),
      el("p", { class: "cwe-step-intro", text: data.question }),
    ]);

    const optionsWrap = el("div", { class: "cwe-options", role: "group", "aria-label": data.question });
    const feedbackWrap = el("div", { "aria-live": "polite" });

    data.options.forEach((opt, i) => {
      const btn = el(
        "button",
        {
          type: "button",
          class: "cwe-option",
          "aria-pressed": "false",
          onClick: () => {
            const isCorrect = opt.id === data.correct;
            optionsWrap.querySelectorAll(".cwe-option").forEach((b) => {
              b.setAttribute("aria-pressed", "false");
              b.disabled = true;
            });
            btn.setAttribute("aria-pressed", "true");
            btn.classList.add(isCorrect ? "cwe-option--correct" : "cwe-option--incorrect");
            if (!isCorrect) {
              const correctBtn = optionsWrap.querySelector(`[data-opt-id="${data.correct}"]`);
              if (correctBtn) correctBtn.classList.add("cwe-option--correct");
            }
            clear(feedbackWrap);
            feedbackWrap.appendChild(
              el("div", { class: `cwe-feedback ${isCorrect ? "cwe-feedback--correct" : "cwe-feedback--incorrect"}` }, [
                el("p", {
                  class: "cwe-feedback-title",
                  text: isCorrect ? "✅ إجابة دقيقة" : "💡 ليست دقيقة تمامًا",
                }),
                el("p", { text: data.explanation }),
              ])
            );
          },
        },
        [
          el("span", { class: "cwe-option-marker", text: String(i + 1) }),
          el("span", { text: opt.text }),
        ]
      );
      btn.setAttribute("data-opt-id", opt.id);
      optionsWrap.appendChild(btn);
    });

    wrap.appendChild(optionsWrap);
    wrap.appendChild(feedbackWrap);
    return wrap;
  }

  _renderTimeline(section) {
    const data = section.data;
    const wrap = el("div", {}, [
      el("h2", { class: "cwe-step-title", text: section.title }),
      data.intro && el("p", { class: "cwe-step-intro", text: data.intro }),
    ]);
    const list = el("div", { class: "cwe-timeline" });
    data.steps.forEach((step, i) => {
      const panel = el("div", {
        class: "cwe-timeline-panel",
        id: `tl-panel-${i}`,
        hidden: true,
        text: step.description,
      });
      const btn = el(
        "button",
        {
          type: "button",
          class: "cwe-timeline-btn",
          "aria-expanded": "false",
          "aria-controls": `tl-panel-${i}`,
          onClick: () => {
            const expanded = item.getAttribute("aria-expanded") === "true";
            item.setAttribute("aria-expanded", String(!expanded));
            panel.hidden = expanded;
          },
        },
        [el("span", { text: `${i + 1}. ${step.label}` }), el("span", { class: "cwe-timeline-chevron", text: "▾" })]
      );
      const item = el("div", { class: "cwe-timeline-item", "aria-expanded": "false" }, [btn, panel]);
      list.appendChild(item);
    });
    wrap.appendChild(list);
    return wrap;
  }

  _renderExplainer(section) {
    const data = section.data;
    const wrap = el("div", {}, [
      el("h2", { class: "cwe-step-title", text: section.title }),
      data.intro && el("p", { class: "cwe-step-intro", text: data.intro }),
    ]);
    data.items.forEach((item) => {
      wrap.appendChild(
        el("div", { class: "cwe-content-block" }, [
          el("h4", { text: item.term }),
          el("p", { text: item.definition }),
        ])
      );
    });
    if (data.note) {
      wrap.appendChild(el("div", { class: "cwe-callout", text: data.note }));
    }
    return wrap;
  }

  _renderCards(section) {
    const data = section.data;
    const wrap = el("div", {}, [
      el("h2", { class: "cwe-step-title", text: section.title }),
      data.intro && el("p", { class: "cwe-step-intro", text: data.intro }),
    ]);
    const grid = el("div", { class: "cwe-grid" });
    const detail = el("div", { class: "cwe-tile-detail", hidden: true, "aria-live": "polite" });

    data.items.forEach((item) => {
      const tile = el(
        "button",
        {
          type: "button",
          class: "cwe-tile",
          "aria-pressed": "false",
          onClick: () => {
            const wasActive = tile.getAttribute("aria-pressed") === "true";
            grid.querySelectorAll(".cwe-tile").forEach((t) => t.setAttribute("aria-pressed", "false"));
            if (wasActive) {
              detail.hidden = true;
              clear(detail);
              return;
            }
            tile.setAttribute("aria-pressed", "true");
            clear(detail);
            detail.appendChild(el("h4", { text: item.title }));
            detail.appendChild(el("p", { text: item.summary }));
            detail.hidden = false;
          },
        },
        [
          el("span", { class: "cwe-tile-icon", "aria-hidden": "true", text: item.icon || "📄" }),
          el("span", { class: "cwe-tile-label", text: item.title }),
        ]
      );
      grid.appendChild(tile);
    });

    wrap.appendChild(grid);
    wrap.appendChild(detail);
    return wrap;
  }

  _renderContent(section) {
    const data = section.data;
    const wrap = el("div", {}, [
      el("h2", { class: "cwe-step-title", text: section.title }),
      data.intro && el("p", { class: "cwe-step-intro", text: data.intro }),
    ]);

    (data.blocks || []).forEach((block) => {
      const blockEl = el("div", { class: "cwe-content-block" });
      if (block.heading) blockEl.appendChild(el("h4", { text: block.heading }));
      (block.paragraphs || []).forEach((p) => blockEl.appendChild(el("p", { text: p })));
      if (Array.isArray(block.list) && block.list.length) {
        blockEl.appendChild(el("ul", {}, block.list.map((item) => el("li", { text: item }))));
      }
      wrap.appendChild(blockEl);
    });

    if (Array.isArray(data.highlights) && data.highlights.length) {
      const triad = el(
        "div",
        { class: "cwe-triad" },
        data.highlights.map((h) =>
          el("div", { class: "cwe-triad-card" }, [
            el("h5", { text: h.label }),
            el("p", { text: h.description }),
          ])
        )
      );
      wrap.appendChild(triad);
    }

    if (data.note) {
      wrap.appendChild(el("div", { class: "cwe-callout", text: data.note }));
    }
    return wrap;
  }

  _renderScenario(section) {
    const data = section.data;
    const wrap = el("div", {}, [
      el("h2", { class: "cwe-step-title", text: section.title }),
      data.intro && el("p", { class: "cwe-step-intro", text: data.intro }),
    ]);

    const stateKey = section.id;
    if (!this.state[stateKey]) this.state[stateKey] = { current: 0, answered: {} };
    const scState = this.state[stateKey];

    const dotsWrap = el("div", { class: "cwe-scenario-nav" });
    const bodyWrap = el("div", {});

    const renderDots = () => {
      clear(dotsWrap);
      data.scenarios.forEach((sc, i) => {
        const done = scState.answered[i] !== undefined;
        const active = i === scState.current;
        dotsWrap.appendChild(
          el(
            "button",
            {
              type: "button",
              class: `cwe-scenario-dot ${active ? "cwe-scenario-dot--active" : ""} ${
                done ? "cwe-scenario-dot--done" : ""
              }`,
              "aria-current": active ? "true" : "false",
              "aria-label": `سيناريو ${i + 1}`,
              onClick: () => {
                scState.current = i;
                renderAll();
              },
            },
            String(i + 1)
          )
        );
      });
    };

    const renderBody = () => {
      clear(bodyWrap);
      const sc = data.scenarios[scState.current];
      const card = el("div", { class: "cwe-scenario-card" }, [
        el("p", { class: "cwe-scenario-prompt", text: sc.prompt }),
      ]);
      const optionsWrap = el("div", { class: "cwe-options", role: "group" });
      const resultWrap = el("div", { class: "cwe-scenario-result", "aria-live": "polite" });

      const prevAnswer = scState.answered[scState.current];

      sc.options.forEach((opt) => {
        const isCorrect = opt.id === sc.correctId;
        const btn = el(
          "button",
          {
            type: "button",
            class: "cwe-option",
            "aria-pressed": prevAnswer === opt.id ? "true" : "false",
            disabled: prevAnswer !== undefined,
            onClick: () => {
              scState.answered[scState.current] = opt.id;
              renderBody();
              renderDots();
            },
          },
          [el("span", { text: opt.text })]
        );
        if (prevAnswer !== undefined && opt.id === prevAnswer) {
          btn.classList.add(isCorrect ? "cwe-option--correct" : "cwe-option--incorrect");
        }
        if (prevAnswer !== undefined && isCorrect) {
          btn.classList.add("cwe-option--correct");
        }
        optionsWrap.appendChild(btn);
      });

      if (prevAnswer !== undefined) {
        const wasCorrect = prevAnswer === sc.correctId;
        resultWrap.appendChild(
          el("div", { class: `cwe-feedback ${wasCorrect ? "cwe-feedback--correct" : "cwe-feedback--incorrect"}` }, [
            el("h5", { text: wasCorrect ? "✅ قرار سليم" : "💡 هناك ما يستحق إعادة النظر فيه" }),
            el("p", { text: sc.explanation }),
            sc.recommendedAction && el("p", { text: `الإجراء الأمني المناسب: ${sc.recommendedAction}` }),
          ])
        );
      }

      card.appendChild(optionsWrap);
      card.appendChild(resultWrap);
      bodyWrap.appendChild(card);
    };

    const renderAll = () => {
      renderDots();
      renderBody();
    };

    renderAll();
    wrap.appendChild(dotsWrap);
    wrap.appendChild(bodyWrap);
    return wrap;
  }

  _renderTrueFalse(section) {
    const bank = (this.questions && this.questions.trueFalse) || [];
    const wrap = el("div", {}, [
      el("h2", { class: "cwe-step-title", text: section.title }),
      section.data && section.data.intro && el("p", { class: "cwe-step-intro", text: section.data.intro }),
    ]);
    const list = el("div", { class: "cwe-tf-list" });

    bank.forEach((q) => {
      const item = el("div", { class: "cwe-tf-item" }, [el("p", { class: "cwe-tf-statement", text: q.text })]);
      const explain = el("div", { class: "cwe-tf-explain", hidden: true, text: q.explanation });

      const makeBtn = (label, value) =>
        el(
          "button",
          {
            type: "button",
            class: "cwe-tf-btn",
            onClick: () => {
              const isCorrect = value === q.answer;
              trueBtn.disabled = true;
              falseBtn.disabled = true;
              (value === true ? trueBtn : falseBtn).classList.add(
                isCorrect ? "cwe-tf-btn--correct" : "cwe-tf-btn--incorrect"
              );
              if (!isCorrect) {
                (q.answer === true ? trueBtn : falseBtn).classList.add("cwe-tf-btn--correct");
              }
              explain.hidden = false;
            },
          },
          label
        );

      const trueBtn = makeBtn("صح", true);
      const falseBtn = makeBtn("خطأ", false);
      item.appendChild(el("div", { class: "cwe-tf-buttons" }, [trueBtn, falseBtn]));
      item.appendChild(explain);
      list.appendChild(item);
    });

    wrap.appendChild(list);
    return wrap;
  }

  _renderQuiz(section) {
    const bank = (this.questions && this.questions.quiz) || [];
    const wrap = el("div", {}, [
      el("h2", { class: "cwe-step-title", text: section.title }),
      section.data && section.data.intro && el("p", { class: "cwe-step-intro", text: section.data.intro }),
    ]);

    const stateKey = section.id;
    if (!this.state[stateKey]) this.state[stateKey] = { answers: {}, submitted: false };
    const qState = this.state[stateKey];

    const listWrap = el("div", {});
    const submitBar = el("div", { class: "cwe-submit-bar" });
    const resultsWrap = el("div", { "aria-live": "polite" });

    const renderQuestions = () => {
      clear(listWrap);
      bank.forEach((q, qi) => {
        const item = el("div", { class: "cwe-quiz-item" }, [
          el("span", { class: "cwe-quiz-index", text: `سؤال ${qi + 1} من ${bank.length}` }),
          el("p", { class: "cwe-quiz-question", text: q.prompt }),
        ]);
        const optionsWrap = el("div", { class: "cwe-options", role: "group" });
        q.options.forEach((opt) => {
          const selected = qState.answers[q.id] === opt.id;
          const isCorrect = opt.id === q.correctId;
          const btn = el(
            "button",
            {
              type: "button",
              class: "cwe-option",
              "aria-pressed": selected ? "true" : "false",
              disabled: qState.submitted,
              onClick: () => {
                qState.answers[q.id] = opt.id;
                renderQuestions();
                renderSubmitBar();
              },
            },
            [el("span", { text: opt.text })]
          );
          if (qState.submitted && selected) {
            btn.classList.add(isCorrect ? "cwe-option--correct" : "cwe-option--incorrect");
          }
          if (qState.submitted && isCorrect) {
            btn.classList.add("cwe-option--correct");
          }
          optionsWrap.appendChild(btn);
        });
        item.appendChild(optionsWrap);
        listWrap.appendChild(item);
      });
    };

    const computeScore = () => {
      let correct = 0;
      bank.forEach((q) => {
        if (qState.answers[q.id] === q.correctId) correct += 1;
      });
      return { correct, total: bank.length, wrong: bank.length - correct };
    };

    const renderSubmitBar = () => {
      clear(submitBar);
      if (qState.submitted) return;
      const answeredCount = Object.keys(qState.answers).length;
      submitBar.appendChild(
        el(
          "button",
          {
            type: "button",
            class: "cwe-btn cwe-btn--primary",
            disabled: answeredCount < bank.length,
            onClick: () => {
              qState.submitted = true;
              const result = computeScore();
              this.quizResult = { ...result, percentage: Math.round((result.correct / result.total) * 100) };
              Store.set(this.config.id, "result", {
                ...this.quizResult,
                date: new Date().toISOString(),
              });
              renderQuestions();
              renderSubmitBar();
              renderResults();
              this.nextBtn.disabled = false;
            },
          },
          answeredCount < bank.length ? `أجب عن جميع الأسئلة (${answeredCount}/${bank.length})` : "إنهاء الاختبار"
        )
      );
    };

    const renderResults = () => {
      clear(resultsWrap);
      if (!qState.submitted) return;
      const result = computeScore();
      const pct = Math.round((result.correct / result.total) * 100);
      resultsWrap.appendChild(
        el("div", { class: "cwe-result-summary" }, [
          el("div", { class: "cwe-result-stat" }, [
            el("span", { class: "cwe-stat-value", text: `${result.correct}/${result.total}` }),
            el("span", { class: "cwe-stat-label", text: "النتيجة" }),
          ]),
          el("div", { class: "cwe-result-stat" }, [
            el("span", { class: "cwe-stat-value", text: `${pct}%` }),
            el("span", { class: "cwe-stat-label", text: "النسبة" }),
          ]),
          el("div", { class: "cwe-result-stat" }, [
            el("span", { class: "cwe-stat-value", text: String(result.correct) }),
            el("span", { class: "cwe-stat-label", text: "إجابات صحيحة" }),
          ]),
          el("div", { class: "cwe-result-stat" }, [
            el("span", { class: "cwe-stat-value", text: String(result.wrong) }),
            el("span", { class: "cwe-stat-label", text: "إجابات خاطئة" }),
          ]),
        ])
      );

      const review = el("div", { class: "cwe-result-review" });
      bank.forEach((q, qi) => {
        const chosenId = qState.answers[q.id];
        const chosen = q.options.find((o) => o.id === chosenId);
        const wasCorrect = chosenId === q.correctId;
        if (wasCorrect) return; // only show explanations for missed questions, per spec
        const correctOpt = q.options.find((o) => o.id === q.correctId);
        review.appendChild(
          el("div", { class: "cwe-review-item cwe-review-item--wrong" }, [
            el("strong", { text: `سؤال ${qi + 1}: ` }),
            el("span", { text: q.prompt }),
            el("p", { text: `إجابتك: ${chosen ? chosen.text : "—"}` }),
            el("p", { text: `الإجابة الصحيحة: ${correctOpt ? correctOpt.text : "—"}` }),
            el("p", { text: q.explanation }),
          ])
        );
      });
      if (review.childElementCount > 0) {
        resultsWrap.appendChild(el("h3", { text: "مراجعة الأخطاء", style: "margin-top:1.5rem;" }));
        resultsWrap.appendChild(review);
      }
    };

    renderQuestions();
    renderSubmitBar();
    renderResults();

    // Gate "Next" until quiz submitted
    this.nextBtn.disabled = !qState.submitted;

    wrap.appendChild(listWrap);
    wrap.appendChild(submitBar);
    wrap.appendChild(resultsWrap);
    return wrap;
  }

  _renderCompletion(section) {
    const cfg = this.config;
    const result = this.quizResult || Store.get(cfg.id, "result");
    const wrap = el("div", { class: "cwe-completion" });

    wrap.appendChild(el("div", { class: "cwe-completion-emoji", "aria-hidden": "true", text: "🎉" }));
    wrap.appendChild(el("h2", { class: "cwe-completion-title", text: section.title || "أحسنت!" }));
    wrap.appendChild(el("p", { text: "لقد أكملت ورشة:" }));
    wrap.appendChild(el("p", { class: "cwe-completion-workshop", text: cfg.title }));

    if (result) {
      wrap.appendChild(
        el("div", { class: "cwe-result-summary" }, [
          el("div", { class: "cwe-result-stat" }, [
            el("span", { class: "cwe-stat-value", text: `${result.correct}/${result.total}` }),
            el("span", { class: "cwe-stat-label", text: "النتيجة" }),
          ]),
          el("div", { class: "cwe-result-stat" }, [
            el("span", { class: "cwe-stat-value", text: `${result.percentage}%` }),
            el("span", { class: "cwe-stat-label", text: "النسبة" }),
          ]),
        ])
      );
      const dateStr = result.date ? formatDate(new Date(result.date)) : formatDate(new Date());
      wrap.appendChild(el("p", { text: `تاريخ الإكمال: ${dateStr}`, style: "color:var(--cwe-text-faint);" }));
    }

    const actions = el("div", { class: "cwe-completion-actions" }, [
      el(
        "button",
        {
          type: "button",
          class: "cwe-btn cwe-btn--primary",
          text: "إعادة الاختبار",
          onClick: () => {
            // Reset quiz-related state and jump back to the quiz section.
            const quizSection = this.sections.find((s) => s.type === "quiz");
            if (quizSection) delete this.state[quizSection.id];
            this.quizResult = null;
            Store.remove(cfg.id, "result");
            const quizIndex = this.sections.findIndex((s) => s.type === "quiz");
            this.goTo(quizIndex >= 0 ? quizIndex : 0);
          },
        },
        []
      ),
      el(
        "button",
        {
          type: "button",
          class: "cwe-btn",
          text: "مراجعة المحتوى",
          onClick: () => this.goTo(0),
        },
        []
      ),
      el("a", { class: "cwe-btn cwe-btn--ghost", href: section.data && section.data.backHref ? section.data.backHref : "../index.html", text: "العودة إلى الورش" }),
    ]);
    wrap.appendChild(actions);

    // No further "next" from completion
    this.nextBtn.style.display = "none";
    return wrap;
  }
}
