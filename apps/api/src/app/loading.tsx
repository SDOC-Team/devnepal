import { LoadingSkeleton } from "@/components/modules/common";

/** Global root loading state. */
export default function RootLoading() {
  return <LoadingSkeleton label="Loading…" layout="cards" />;
}
