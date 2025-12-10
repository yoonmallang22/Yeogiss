import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { worker } from "@/mocks/mocks.ts";

if (
  import.meta.env.VITE_DEV === "true" &&
  import.meta.env.VITE_MOCK_API === "true"
) {
  worker.start().then(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
