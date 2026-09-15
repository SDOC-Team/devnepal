import Link from "next/link";

import { getDictionary, type Locale, localePath } from "@/lib/i18n";

const LINK_CLASS =
  "inline-block whitespace-nowrap text-sm leading-[1.4] text-footer-fg/88 no-underline transition-colors hover:text-footer-fg hover:underline";

/**
 * Site footer:
 * - Top card: "Need Support?" with "Start contributing" pill button
 * - 4-column layout: Brand (logo + desc) | Platform | Governance | Contact
 * - Bottom legal bar on the deepest blue
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const columns = [
    {
      label: dict.footer.platform,
      links: [
        { href: localePath(locale, "/about"), text: dict.footer.aboutPlatform },
        { href: localePath(locale, "/project"), text: dict.footer.departments },
        { href: localePath(locale, "/members"), text: dict.footer.whosWho },
        { href: localePath(locale, "/project"), text: dict.footer.directorates },
      ],
    },
    {
      label: dict.footer.governance,
      links: [
        { href: localePath(locale, "/about"), text: dict.footer.codeOfConduct },
        { href: localePath(locale, "/about"), text: dict.footer.security },
        { href: localePath(locale, "/about"), text: dict.footer.privacyNotice },
        { href: localePath(locale, "/about"), text: dict.footer.licence },
      ],
    },
  ];

  return (
    <footer className="w-full bg-footer pt-10 text-footer-fg" role="contentinfo">
      <div className="container">
        <div className="flex flex-col flex-wrap items-start justify-between gap-5 rounded-lg border border-footer-fg/18 bg-footer-card px-8 py-6 shadow-[0_4px_16px_rgb(0_0_0/0.12)] min-[641px]:flex-row min-[641px]:items-center">
          <div>
            <h2 className="mt-0 mb-1 text-xl leading-tight font-bold text-footer-fg">
              {dict.home.ctaTitle}
            </h2>
            <p className="m-0 text-base leading-[1.4] text-footer-fg/85">{dict.home.ctaBody}</p>
          </div>
          <Link
            href={localePath(locale, "/about")}
            className="inline-flex items-center gap-2.5 rounded-pill bg-footer-fg px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-footer-ink no-underline shadow-[0_2px_8px_rgb(0_0_0/0.12)] transition-transform hover:-translate-y-px"
          >
            <span>{dict.home.ctaAction}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 16 16 12 12 8" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-[44px] pb-[52px] min-[641px]:grid-cols-2 min-[641px]:gap-[36px] min-[1025px]:grid-cols-[3fr_1fr_1fr_1fr] min-[1025px]:gap-12">
          <div className="flex items-start gap-[18px]">
            {/* biome-ignore lint/performance/noImgElement: static brand asset */}
            <img
              className="mt-0.5 size-[52px] shrink-0"
              src="/assets/devnepal/images/devnepal-wave-light.svg"
              width={52}
              height={52}
              alt=""
              decoding="async"
            />
            <div className="flex flex-col">
              <h3 className="mt-0 mb-2 text-lg leading-tight font-bold text-footer-fg">
                Dev Nepal
              </h3>
              <p className="m-0 max-w-[48ch] text-sm leading-[1.55] text-footer-fg/85">
                {dict.footer.note}
              </p>
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.label} className="flex flex-col" aria-label={column.label}>
              <h3 className="mt-0 mb-4 text-base font-semibold text-footer-fg">{column.label}</h3>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {column.links.map((link) => (
                  <li key={link.text} className="m-0 p-0">
                    <Link href={link.href} className={LINK_CLASS}>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav className="flex flex-col" aria-label={dict.footer.contact}>
            <h3 className="mt-0 mb-4 text-base font-semibold text-footer-fg">
              {dict.footer.contact}
            </h3>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              <li className="m-0 p-0">
                <a href={`mailto:${dict.footer.emailSecurity}`} className={LINK_CLASS}>
                  {dict.footer.emailSecurity}
                </a>
              </li>
              <li className="m-0 p-0">
                <a href={`mailto:${dict.footer.emailConduct}`} className={LINK_CLASS}>
                  {dict.footer.emailConduct}
                </a>
              </li>
              <li className="m-0 p-0">
                <Link href={localePath(locale, "/about")} className={LINK_CLASS}>
                  {dict.footer.ministrySignIn}
                </Link>
              </li>
              <li className="m-0 p-0">
                <Link href={localePath(locale, "/about")} className={LINK_CLASS}>
                  {dict.footer.scheme4}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-footer-fg/12 bg-footer-deep py-4">
        <div className="container flex flex-col flex-wrap items-start justify-between gap-4 min-[641px]:flex-row min-[641px]:items-center">
          <p className="m-0 text-sm leading-[1.4] text-footer-fg/70">
            {dict.footer.legalCopyright}
          </p>
          <nav className="flex flex-wrap items-center gap-6" aria-label="Legal">
            <Link
              href={localePath(locale, "/about")}
              className="text-sm whitespace-nowrap text-footer-fg/85 no-underline transition-colors hover:text-footer-fg hover:underline"
            >
              {dict.footer.termsConditions}
            </Link>
            <Link
              href={localePath(locale, "/about")}
              className="text-sm whitespace-nowrap text-footer-fg/85 no-underline transition-colors hover:text-footer-fg hover:underline"
            >
              {dict.footer.privacyPolicy}
            </Link>
            <Link
              href={localePath(locale, "/about")}
              className="text-sm whitespace-nowrap text-footer-fg/85 no-underline transition-colors hover:text-footer-fg hover:underline"
            >
              {dict.footer.contactUs}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
