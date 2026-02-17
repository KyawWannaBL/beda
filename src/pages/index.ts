// src/pages/index.ts
import React from "react";

import LandingPage from "./LandingPage";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ForcePasswordReset from "./ForcePasswordReset";
import ChangePassword from "./ChangePassword";

// Alias to satisfy App.tsx import
export const EnterprisePortal = LandingPage;

// Pages that exist
export { Login, Dashboard, ForcePasswordReset, ChangePassword };

// If you don’t have a dedicated reset-password page yet,
// reuse ForcePasswordReset for now so the route builds.
export const ResetPassword = ForcePasswordReset;

// Optional placeholders so build never breaks
export function AdminTools() {
  return React.createElement(
    "div",
    { style: { padding: 24 } },
    "AdminTools page is not implemented yet.",
  );
}

export function NotFound() {
  return React.createElement(
    "div",
    { style: { padding: 24 } },
    "404 - Not Found",
  );
}
