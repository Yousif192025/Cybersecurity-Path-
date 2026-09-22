/**
 * AI Daily Life Workshop — loader
 * This file contains NO workshop content. It only wires the generic
 * WorkshopEngine to this workshop's data files.
 */
import { WorkshopEngine } from "../../engine/workshop-engine.js";

const engine = new WorkshopEngine({
  mountId: "workshop-root",
  configUrl: "./data/workshop.json",
  questionsUrl: "./data/questions.json",
});

engine.init().catch((err) => {
  console.error("Workshop failed to load:", err);
  const root = document.getElementById("workshop-root");
  if (root) {
    root.textContent = "تعذّر تحميل الورشة. يرجى المحاولة مرة أخرى لاحقًا.";
  }
});
