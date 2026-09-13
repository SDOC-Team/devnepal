import Link from "next/link";

import { getDictionary, type Locale, localePath } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <footer className="dn-footer">
      <div className="dn-container dn-footer-grid">
        <div className="dn-footer-identity">
          <strong className="dn-footer-mark">{dict.brand}</strong>
          <p>{dict.footer.note}</p>
          <a
            className="dn-footer-repo"
            href="https://github.com/voidash/gov-portal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.05-.49.05-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.19c0 .21.15.46.55.38A8 8 0 0 0 8 0Z"
              />
            </svg>
            {dict.footer.repository}
          </a>
        </div>
        <nav className="dn-footer-platform" aria-label={dict.footer.platform}>
          <h2>{dict.footer.platform}</h2>
          <ul>
            <li>
              <Link href={localePath(locale, "/project")}>{dict.nav.project}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/issues")}>{dict.nav.issues}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/members")}>{dict.nav.members}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/about")}>{dict.nav.about}</Link>
            </li>
          </ul>
        </nav>
        <nav className="dn-footer-platform" aria-label={dict.footer.account}>
          <h2>{dict.footer.account}</h2>
          <ul>
            <li>
              <Link href={localePath(locale, "/profile")}>{dict.profile.title}</Link>
            </li>
            <li>
              <Link href={localePath(locale, "/admin")}>{dict.admin.title}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
