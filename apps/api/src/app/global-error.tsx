"use client";

import "./tailwind.css";

import { ErrorIcon } from "@/components/modules/common/status-icons";
import { StatusPage } from "@/components/modules/common/status-page";
import { Button } from "@/components/ui/button";

/**
 * Root error boundary to catch errors in the root layout or root segments.
 * Next.js requires this to define its own <html> and <body> tags, so it
 * imports the stylesheet itself rather than inheriting the root layout's.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased font-sans">
      <head>
        <title>Error · Dev Nepal</title>
      </head>
      <body className="flex min-h-screen flex-col justify-center bg-background text-foreground selection:bg-primary/15">
        <main>
          <StatusPage
            tone="error"
            icon={<ErrorIcon />}
            code="System Error"
            title="Something went wrong"
            titleId="global-error-heading"
            body="A critical application error occurred."
            digest={error.digest !== undefined ? `Reference: ${error.digest}` : undefined}
            actions={
              <>
                <Button onClick={reset}>Try again</Button>
                <Button variant="outline" render={<a href="/en" />}>
                  Reload application
                </Button>
              </>
            }
          />
        </main>
      </body>
    </html>
  );
}
