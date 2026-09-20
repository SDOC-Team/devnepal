import { cn } from "cn";

import logo from "../../../assets/images/dev-nepal-logo.png";
import { AccessibilityBar } from "./AccessibilityBar";

export type NavItem = {
  /** Stable identity; labels may repeat. */
  id: string;
  label: string;
  href?: string;
};

export type HeaderProps = {
  platformName?: string;
  description?: string;
  navItems?: NavItem[];
  /** Rendered when nobody is signed in. */
  onSignIn?: () => void;
  /** Replaces the sign-in button once a session exists. */
  sessionSlot?: React.ReactNode;
  className?: string;
};

const DEFAULT_NAV: NavItem[] = [
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "members", label: "Members", href: "#members" },
  { id: "contribute", label: "How to contribute", href: "#contribute" },
  { id: "about", label: "About", href: "#about" },
];

export function Header({
  platformName = "Dev Nepal",
  description = "Description",
  navItems = DEFAULT_NAV,
  onSignIn,
  sessionSlot,
  className,
}: HeaderProps) {
  return (
    <header className={cn("w-full", className)}>
      <AccessibilityBar />

      <div className="w-full border-(--color-border-default) border-b bg-(--color-surface-default)">
        <div className="mx-auto flex h-20 w-full max-w-[1448px] items-center gap-8 px-8 max-sm:px-4">
          {/* Brand */}
          <a
            href="/"
            className="flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2"
          >
            <img src={logo} alt="" className="size-10 shrink-0 object-contain" />
            <span className="flex flex-col max-sm:hidden">
              <span className="font-bold text-[14px] text-(--color-text-primary) leading-5">
                {platformName}
              </span>
              <span className="text-[12px] text-(--color-text-muted) leading-4">{description}</span>
            </span>
          </a>

          {/* Navigation, right-aligned */}
          <nav aria-label="Primary" className="ml-auto flex items-center gap-8 max-lg:hidden">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href ?? "#"}
                className={cn(
                  "text-[14px] text-(--color-text-primary) leading-5",
                  "hover:text-(--color-brand-primary)",
                  "focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2",
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 max-lg:ml-auto">
            {sessionSlot ?? (
              <button
                type="button"
                onClick={onSignIn}
                className={cn(
                  "inline-flex h-10 items-center rounded-lg bg-(--color-brand-primary) px-4",
                  "text-[14px] text-white transition-opacity hover:opacity-90",
                  "focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2",
                )}
              >
                Sign in with Github
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
