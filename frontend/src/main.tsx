import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeContext";
import CssBaseline from "@mui/material/CssBaseline";

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
