/**
 * Digital Footprint Workshop — loader
 * This file contains NO workshop content. It only wires the shared
 * WorkshopEngine (docs/academy/workshops/engine/) to this workshop's
 * own data files. Do not add workshop content here.
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
