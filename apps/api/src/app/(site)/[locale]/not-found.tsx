import Link from "next/link";
import { WarnIcon } from "@/components/modules/common/status-icons";
import { StatusPage } from "@/components/modules/common/status-page";
import { Button } from "@/components/ui/button";

/**
 * 404 page for the (site)/[locale] route group.
 * Shown when a page within a valid locale is not found.
 */
export default function SiteNotFound() {
  return (
    <StatusPage
      tone="warn"
      icon={<WarnIcon />}
      code="404"
      title="Page not found"
      titleId="not-found-heading"
      body="That address does not exist on this portal, or the resource is not public."
      actions={
        <>
          <Button render={<Link href="/en" />}>Go to homepage</Button>
          <Button variant="outline" render={<Link href="/en/issues" />}>
            Browse open issues
          </Button>
        </>
      }
    />
  );
}
