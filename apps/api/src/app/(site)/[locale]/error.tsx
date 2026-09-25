"use client";

import Link from "next/link";
import { ErrorIcon } from "@/components/modules/common/status-icons";
import { StatusPage } from "@/components/modules/common/status-page";
import { Button } from "@/components/ui/button";

/**
 * Error boundary for runtime errors inside the (site)/[locale] layout.
 * Next.js requires this to be a Client Component.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StatusPage
      tone="error"
      icon={<ErrorIcon />}
      code="Error"
      title="Something went wrong"
      titleId="error-heading"
      body="An unexpected error occurred while loading this page."
      digest={error.digest !== undefined ? `Reference: ${error.digest}` : undefined}
      actions={
        <>
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" render={<Link href="/en" />}>
            Go to homepage
          </Button>
        </>
      }
    />
  );
}
