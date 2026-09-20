import { ListIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

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
  const dict = getDictionary(locale);
  const items = [
    { href: localePath(locale, "/#contribute"), label: dict.nav.about },
    { href: localePath(locale, "/project"), label: dict.nav.projects },
    { href: localePath(locale, "/members"), label: dict.nav.members },
    { href: localePath(locale, "/about"), label: dict.nav.aboutPlatform },
  ];

  return (
    <>
      <OfficialWebsiteBar locale={locale} />
      <header data-slot="site-navbar" className="bg-background px-4 py-4 sm:px-8 lg:px-16">
        <div className="flex h-12 items-center justify-between gap-4">
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
            <nav className="hidden items-center gap-2 lg:flex" aria-label={dict.nav.primary}>
              {items.map((item) => (
                <Button
                  key={item.href}
                  size="sm"
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href={item.href} />}
                  className="text-primary hover:text-primary dark:text-foreground dark:hover:text-foreground"
                >
                  {item.label}
                </Button>
              ))}
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
                {items.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    nativeButton={false}
                    render={<Link href={item.href} />}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
