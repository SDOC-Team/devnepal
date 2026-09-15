import Link from "next/link";
import { WarnIcon } from "@/components/modules/common/status-icons";
import { StatusPage } from "@/components/modules/common/status-page";
import { Button } from "@/components/ui/button";

/**
 * Root 404 page for unmatched routes or invalid locales.
 */
export default function RootNotFound() {
  return (
    <main>
      <StatusPage
        tone="warn"
        icon={<WarnIcon />}
        code="404"
        title="Page not found"
        titleId="root-not-found-heading"
        body="The page you are looking for does not exist or has been moved."
        actions={<Button render={<Link href="/en" />}>Go to homepage</Button>}
      />
    </main>
  );
}
