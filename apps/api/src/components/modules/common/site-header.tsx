import Link from "next/link";

import { getDictionary, type Locale, localePath } from "@/lib/i18n";

import { LanguageSwitch } from "./language-switch";
import { SessionMenu } from "./session-menu";
import { SiteNav } from "./site-nav";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = [
    { href: localePath(locale, "/project"), label: dict.nav.projects },
    { href: localePath(locale, "/members"), label: dict.nav.members },
    { href: localePath(locale, "/about"), label: dict.nav.about },
  ];

  return (
    <header className="sticky top-[calc(var(--gov-strip-h)*-1)] z-40 border-b border-divider bg-paper text-text">
      {/* State band — the deepest step of the platform blue; white on it measures 8.0:1. */}
      <div className="bg-state text-paper text-xs">
        <div className="mx-auto flex min-h-[var(--gov-strip-h)] w-[calc(100%-var(--page-gutter)*2)] max-w-container-max flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <a
            className="inline-flex items-center gap-2 font-semibold tracking-[0.01em] text-inherit no-underline hover:text-paper hover:underline hover:[text-underline-offset:3px]"
            href="https://nepal.gov.np"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* biome-ignore lint/performance/noImgElement: the emblem is a static government asset with srcset, not a dynamic image */}
            <img
              className="h-[26px] w-auto flex-none"
              src="/assets/devnepal/images/emblem-of-nepal-60.png"
              srcSet="/assets/devnepal/images/emblem-of-nepal-60.png 1x, /assets/devnepal/images/emblem-of-nepal-120.png 2x"
              width={36}
              height={30}
              alt={dict.govStrip.emblemAlt}
              decoding="async"
            />
            {dict.govStrip.government}
            <svg
              className="flex-none opacity-80"
              viewBox="0 0 12 12"
              width={10}
              height={10}
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M4.5 2h5.5v5.5M10 2 3 9M8 10H2V4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">{dict.govStrip.opensPortal}</span>
          </a>
          <div className="flex items-center gap-3">
            <LanguageSwitch locale={locale} label={dict.govStrip.language} />
          </div>
        </div>
      </div>

      <div className="mx-auto flex min-h-16 w-[calc(100%-var(--page-gutter)*2)] max-w-container-max items-center gap-4 py-3">
        <Link
          className="inline-flex min-h-[var(--control-lg)] flex-none items-center text-text no-underline hover:text-accent-700"
          href={localePath(locale)}
        >
          {/* biome-ignore lint/performance/noImgElement: static brand asset, not a dynamic image */}
          <img
            className="mr-3 h-9 w-9 flex-none text-accent-700"
            src="/assets/devnepal/images/devnepal-wave.svg"
            width={36}
            height={36}
            alt=""
            decoding="async"
          />
          <span className="flex flex-col gap-0.5 leading-tight">
            <strong className="font-heading text-lg font-semibold">{dict.brand}</strong>
            <span className="text-xs font-normal text-neutral-600">{dict.brandTagline}</span>
          </span>
        </Link>
        <SiteNav items={items} label={dict.nav.primary} />
        <div className="flex flex-none items-center gap-2">
          <SessionMenu
            locale={locale}
            signInLabel={dict.session.signIn}
            signOutLabel={dict.session.signOut}
            statusLabels={dict.profile.statusShort}
            greetingLabel={dict.session.greeting}
            profileLabel={dict.nav.myProfile}
            adminLabel={dict.nav.admin}
          />
        </div>
        <details className="hidden max-[1179px]:block">
          <summary className="flex min-h-[var(--control-lg)] cursor-pointer list-none items-center gap-2 rounded-md border border-divider-strong px-4 font-body text-sm font-semibold hover:border-text hover:bg-neutral-100">
            {dict.nav.menu}
          </summary>
          <nav aria-label={dict.nav.primary}>
            <ul className="absolute inset-x-0 top-full z-[45] m-0 list-none border-t border-b border-divider bg-paper px-[var(--page-gutter)] py-0">
              {items.map((item) => (
                <li key={item.href} className="border-t border-divider first:border-t-0">
                  <Link
                    href={item.href}
                    className="flex min-h-[var(--control-lg)] items-center px-4 font-medium text-text no-underline aria-[current=page]:border-l-[3px] aria-[current=page]:border-l-accent aria-[current=page]:bg-accent-100 aria-[current=page]:pl-3 aria-[current=page]:text-accent-800"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
