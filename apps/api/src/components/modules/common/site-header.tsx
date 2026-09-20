"use client";

import { ListIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDictionary, type Locale, localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { OfficialWebsiteBar } from "./official-website-bar";
import { SessionMenu } from "./session-menu";

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const dict = getDictionary(locale);

  const items = [
    { href: localePath(locale, "/#contribute"), path: "/#contribute", label: dict.nav.about },
    { href: localePath(locale, "/project"), path: "/project", label: dict.nav.projects },
    { href: localePath(locale, "/members"), path: "/members", label: dict.nav.members },
    { href: localePath(locale, "/about"), path: "/about", label: dict.nav.aboutPlatform },
  ];

  return (
    <div className="sticky top-0 z-50 w-full shadow-xs backdrop-blur-md">
      <OfficialWebsiteBar locale={locale} />
      <header
        data-slot="site-navbar"
        className="bg-background/95 border-b border-border/40 px-4 py-3 sm:px-8 lg:px-16"
      >
        <div className="flex h-11 items-center justify-between gap-4">
          <Link
            href={localePath(locale)}
            className="flex min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span aria-hidden className="size-5 shrink-0 rounded-full bg-primary" />
            <span className="text-lg font-semibold text-primary dark:text-foreground">
              {dict.brand}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 lg:gap-8">
            <nav className="hidden items-center gap-1.5 lg:flex" aria-label={dict.nav.primary}>
              {items.map((item) => {
                const isActive =
                  item.path !== "/#contribute" &&
                  (pathname === item.href || pathname?.startsWith(`${item.href}/`));

                return (
                  <Button
                    key={item.href}
                    size="sm"
                    variant={isActive ? "secondary" : "ghost"}
                    aria-current={isActive ? "page" : undefined}
                    render={<Link href={item.href} />}
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15 dark:bg-primary/20 dark:text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            <SessionMenu
              locale={locale}
              signInLabel={dict.session.signIn}
              signOutLabel={dict.session.signOut}
              statusLabels={dict.profile.statusShort}
              greetingLabel={dict.session.greeting}
              profileLabel={dict.nav.myProfile}
              adminLabel={dict.nav.admin}
            />

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={dict.nav.menu}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  "cursor-pointer lg:hidden",
                )}
              >
                <ListIcon className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-44">
                {items.map((item) => {
                  const isActive =
                    item.path !== "/#contribute" &&
                    (pathname === item.href || pathname?.startsWith(`${item.href}/`));
                  return (
                    <DropdownMenuItem
                      key={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(isActive && "bg-accent font-semibold text-accent-foreground")}
                      render={<Link href={item.href} />}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>
  );
}
