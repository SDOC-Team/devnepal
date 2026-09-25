import { LoadingSkeleton } from "@/components/modules/common";

/**
 * Route-segment loading state for (site)/[locale]. Mirrors the shape of a
 * typical directory page so the layout does not shift when content arrives.
 */
export default function SiteLoading() {
  return <LoadingSkeleton label="Loading…" layout="cards" />;
}
