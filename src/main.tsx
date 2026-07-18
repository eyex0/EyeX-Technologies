/// <reference types="vite/client" />

import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { getRouter } from "./router";

const root = document.getElementById("root")!;

if (!root.dataset.hydrated) {
  hydrateRoot(root, <StartClient router={getRouter()} />);
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);

document.querySelectorAll("[data-fade-up]").forEach((el) => observer.observe(el));
