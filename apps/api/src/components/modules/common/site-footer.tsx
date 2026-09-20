import { ArrowSquareOutIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { getDictionary, type Locale, localePath } from "@/lib/i18n";

const footerLinkClass =
  "w-fit rounded-sm py-2 text-xs text-primary-foreground/80 outline-none transition-colors hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50 sm:py-0";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const platformLinks = [
    { href: localePath(locale, "/about"), label: dict.footer.aboutPlatform },
    { href: localePath(locale, "/project"), label: dict.footer.departments },
    { href: localePath(locale, "/members"), label: dict.footer.whosWho },
    { href: localePath(locale, "/project"), label: dict.footer.directorates },
  ];

  const governanceLinks = [
    { href: localePath(locale, "/about"), label: dict.footer.codeOfConduct },
    { href: localePath(locale, "/about"), label: dict.footer.security },
    { href: localePath(locale, "/about"), label: dict.footer.privacyNotice },
    { href: localePath(locale, "/about"), label: dict.footer.licence },
  ];

  const legalLinks = [
    { href: localePath(locale, "/about"), label: dict.footer.termsConditions },
    { href: localePath(locale, "/about"), label: dict.footer.privacyPolicy },
    { href: localePath(locale, "/about"), label: dict.footer.contactUs },
  ];

  return (
    <footer
      data-slot="site-footer"
      className="border-t border-border bg-primary text-primary-foreground"
    >
      <div className="flex flex-col gap-10 px-4 py-12 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-16">
        <div className="flex items-center gap-5">
          <span aria-hidden className="size-14 shrink-0 rounded-full bg-primary-foreground" />
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold">{dict.brand}</p>
            <p className="max-w-78 text-xs leading-4.5">{dict.footer.note}</p>
          </div>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap">
          <nav aria-label={dict.footer.platform} className="flex flex-col gap-4 sm:w-50">
            <h2 className="text-sm font-semibold">{dict.footer.platform}</h2>
            {platformLinks.map((link) => (
              <Link key={link.label} href={link.href} className={footerLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <nav aria-label={dict.footer.governance} className="flex flex-col gap-4 sm:w-50">
            <h2 className="text-sm font-semibold">{dict.footer.governance}</h2>
            {governanceLinks.map((link) => (
              <Link key={link.label} href={link.href} className={footerLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              {/* biome-ignore lint/performance/noImgElement: official government emblem */}
              <img
                src="/official-website-bar/emblem-of-nepal.png"
                alt=""
                width={60}
                height={51}
                className="h-auto w-15 shrink-0"
              />
              <div className="flex flex-col">
                <p className="text-base font-semibold">नेपाल सरकार</p>
                <p className="text-sm">Government of Nepal</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs">Office of the Prime Minister and Council of Ministers</p>
              <p className="text-xs">Singhadurbar, Kathmandu</p>
              <a
                href="https://opmcm.gov.np"
                target="_blank"
                rel="noreferrer"
                className={`${footerLinkClass} inline-flex items-center gap-1`}
              >
                opmcm.gov.np
                <ArrowSquareOutIcon size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-chart-5">
        <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-16">
          <p className="text-xs font-medium text-primary-foreground/80">
            {dict.footer.legalCopyright}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-8 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className={footerLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
