import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

// Signal Vite SPA mode (Vercel) so RootShell skips rendering a duplicate <html> wrapper
(window as unknown as Record<string, unknown>).__YEMELINK_SPA__ = true;

const router = getRouter();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
