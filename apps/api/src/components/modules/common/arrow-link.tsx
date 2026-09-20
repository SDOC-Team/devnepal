import Link from "next/link";
import type { ReactNode } from "react";

/** Trailing "see all" link that sits at the end of a SectionHeading. */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex-none whitespace-nowrap pb-0.5 text-sm font-medium text-primary hover:text-primary"
    >
      {children}
    </Link>
  );
}
