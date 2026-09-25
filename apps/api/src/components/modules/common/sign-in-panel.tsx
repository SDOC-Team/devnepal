"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signInWithGitHub } from "@/lib/auth-client";
import type { Locale } from "@/lib/i18n";

import { StateBanner } from "./state-banner";

export function SignInPanel({ label, locale }: { label: string; locale: Locale }) {
  const [busy, setBusy] = useState(false);
  return (
    <StateBanner>
      <div className="flex flex-wrap gap-3">
        <Button
          disabled={busy}
          onClick={() => {
            setBusy(true);
            signInWithGitHub(`/${locale}/welcome`).catch((error: unknown) => {
              console.error("Failed to start GitHub sign-in", error);
              toast.error(
                error instanceof Error ? error.message : "Could not start GitHub sign-in",
              );
              setBusy(false);
            });
          }}
        >
          {label}
        </Button>
      </div>
    </StateBanner>
  );
}
