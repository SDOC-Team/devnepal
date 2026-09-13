"use client";

import { useState } from "react";

import { signInWithGitHub } from "@/lib/auth-client";
import type { Locale } from "@/lib/i18n";

export function SignInPanel({ label, locale }: { label: string; locale: Locale }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="dn-state-banner">
      <div className="hero__actions">
        <button
          className="btn btn--primary"
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            signInWithGitHub(`/${locale}/welcome`).catch(() => setBusy(false));
          }}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
