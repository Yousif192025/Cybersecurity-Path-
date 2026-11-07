/* CyberPath DOS Course — interactions */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initProgress();
  initCopyButtons();
  initActiveNav();
});

/* ---------- Theme ---------- */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("cyberpath-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  if (btn) {
    btn.textContent = saved === "dark" ? "🌙" : "☀️";
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("cyberpath-theme", next);
      btn.textContent = next === "dark" ? "🌙" : "☀️";
    });
  }
}

/* ---------- Progress bar (based on scroll) ---------- */
function initProgress() {
  const fill = document.getElementById("progress-fill");
  if (!fill) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    fill.style.width = Math.min(100, Math.max(0, scrolled * 100)) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ---------- Copy buttons ---------- */
function initCopyButtons() {
  document.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".copy-btn")) return;
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "نسخ";
    btn.addEventListener("click", async () => {
      const text = pre.querySelector("code")?.innerText ?? pre.innerText;
      try {
        await navigator.clipboard.writeText(text.trim());
        btn.textContent = "تم النسخ ✔";
        btn.classList.add("copied");
      } catch {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text.trim();
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        btn.textContent = "تم النسخ ✔";
        btn.classList.add("copied");
      }
      setTimeout(() => {
        btn.textContent = "نسخ";
        btn.classList.remove("copied");
      }, 1600);
    });
    pre.appendChild(btn);
  });
}

/* ---------- Active nav highlight ---------- */
function initActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href.endsWith(path)) a.classList.add("active");
  });
}
