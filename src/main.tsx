/// <reference types="vite/client" />

import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { getRouter } from "./router";

const root = document.getElementById("root")!;

if (!root.dataset.hydrated) {
  hydrateRoot(root, <StartClient router={getRouter()} />);
}
