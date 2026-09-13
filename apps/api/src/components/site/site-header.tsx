import Link from "next/link";

import { getDictionary, type Locale, localePath } from "@/lib/i18n";

import { LanguageSwitch } from "./language-switch";
import { SessionMenu } from "./session-menu";
import { SiteNav } from "./site-nav";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const items = [
    { href: localePath(locale, "/issues"), label: dict.nav.issues },
    { href: localePath(locale, "/members"), label: dict.nav.members },
    { href: localePath(locale, "/about"), label: dict.nav.about },
  ];

  return (
    <header className="dn-product-header">
      <div className="dn-gov-strip">
        <div className="dn-gov-strip__inner">
          <a
            className="dn-gov-strip__origin"
            href="https://nepal.gov.np"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* biome-ignore lint/performance/noImgElement: the emblem is a static government asset with srcset, not a dynamic image */}
            <img
              className="dn-gov-strip__emblem"
              src="/assets/devnepal/images/emblem-of-nepal-60.png"
              srcSet="/assets/devnepal/images/emblem-of-nepal-60.png 1x, /assets/devnepal/images/emblem-of-nepal-120.png 2x"
              width={36}
              height={30}
              alt={dict.govStrip.emblemAlt}
              decoding="async"
            />
            {dict.govStrip.government}
            <svg
              className="dn-gov-strip__out"
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
            <span className="visually-hidden">{dict.govStrip.opensPortal}</span>
          </a>
          <div className="dn-gov-strip__tools">
            <LanguageSwitch locale={locale} label={dict.govStrip.language} />
          </div>
        </div>
      </div>
      <div className="dn-header-inner">
        <Link className="dn-brand" href={localePath(locale)}>
          <span className="dn-brand-copy">
            <strong>{dict.brand}</strong>
          </span>
        </Link>
        <SiteNav items={items} label={dict.nav.primary} />
        <div className="dn-header-actions">
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
        <details className="mobile-nav">
          <summary>{dict.nav.menu}</summary>
          <nav aria-label={dict.nav.primary}>
            <ul>
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
