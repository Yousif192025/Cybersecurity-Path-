/* CyberPath DOS Course — shared interactions
   - Theme toggle
   - Scroll progress
   - Code copy buttons (new .code-block structure)
   - Active nav highlight
*/
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initProgress();
  initCodeCopy();
  initActiveNav();
});

/* ---------- Theme ---------- */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("cyberpath-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  if (!btn) return;
  btn.textContent = saved === "dark" ? "🌙" : "☀️";
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("cyberpath-theme", next);
    btn.textContent = next === "dark" ? "🌙" : "☀️";
  });
}

/* ---------- Progress bar ---------- */
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

/* ---------- Code copy (header-button pattern) ---------- */
function initCodeCopy() {
  document.querySelectorAll(".code-block").forEach((block) => {
    const btn = block.querySelector(".copy-btn");
    const codeEl = block.querySelector("pre code") || block.querySelector("pre");
    if (!btn || !codeEl) return;

    btn.addEventListener("click", async () => {
      const text = codeEl.innerText.replace(/\n+$/, "");
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch {}
        ta.remove();
      }
      const original = btn.textContent;
      btn.textContent = "تم النسخ ✔";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1600);
    });
  });
}

/* ---------- Active nav ---------- */
function initActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href.endsWith(path)) a.classList.add("active");
  });
}
