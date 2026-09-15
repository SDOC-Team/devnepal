"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
};

export function SiteNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav className="hidden min-w-0 ml-auto min-[1180px]:block" aria-label={label}>
      <ul className="m-0 flex list-none items-center gap-4 p-0">
        {items.map((item) => {
          const active =
            item.exact === true
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="inline-flex min-h-[var(--control-md)] items-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-neutral-800 no-underline hover:bg-neutral-100 hover:text-accent-700 aria-[current=page]:text-accent-700"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
