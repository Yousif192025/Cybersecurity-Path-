/**
 * Workshops hub loader.
 * Renders workshop cards from shared/data/workshops-registry.json.
 * No workshop content lives here — only rendering logic.
 */

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  (Array.isArray(children) ? children : [children]).forEach((child) => {
    if (child === undefined || child === null || child === false) return;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  });
  return node;
}

async function renderHub() {
  const grid = document.getElementById("hub-grid");
  if (!grid) return;
  try {
    const res = await fetch("./shared/data/workshops-registry.json");
    const data = await res.json();
    while (grid.firstChild) grid.removeChild(grid.firstChild);
    data.workshops.forEach((ws) => {
      const isAvailable = ws.status === "available";
      const card = el(
        isAvailable ? "a" : "div",
        {
          class: `cwe-hub-card ${isAvailable ? "" : "cwe-hub-card--disabled"}`,
          href: isAvailable ? ws.href : undefined,
          "aria-disabled": isAvailable ? undefined : "true",
        },
        [
          el("span", {
            class: `cwe-badge ${isAvailable ? "" : "cwe-badge--soon"}`,
            text: isAvailable ? "ورشة متاحة" : "قريبًا",
          }),
          el("h3", { text: ws.title }),
          el("p", { text: ws.summary }),
        ]
      );
      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load workshops registry:", err);
    grid.textContent = "تعذّر تحميل قائمة الورش.";
  }
}

renderHub();
