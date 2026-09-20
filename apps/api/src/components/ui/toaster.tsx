"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        className: "font-sans",
        style: {
          background: "var(--card, #ffffff)",
          color: "var(--card-foreground, #09090b)",
          border: "1px solid var(--border, #e4e4e7)",
          borderRadius: "0.625rem",
          fontSize: "0.875rem",
        },
      }}
    />
  );
}
