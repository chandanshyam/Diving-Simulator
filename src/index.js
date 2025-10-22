import React from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./components/Dashboard.js";
import { ErrorBoundary } from "./components/UI/index.js";
import "./styles/theme.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ErrorBoundary>
    <Dashboard />
  </ErrorBoundary>
);
