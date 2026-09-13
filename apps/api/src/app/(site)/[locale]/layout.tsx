import { notFound } from "next/navigation";
import { LocaleLang } from "@/components/site/locale-lang";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";

export function generateStaticParams(): { locale: string }[] {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dict = getDictionary(locale);

  return (
    <>
      <LocaleLang locale={locale} />
      <a className="btn dn-skip-link" href="#main">
        {dict.common.skipToContent}
      </a>
      <SiteHeader locale={locale} />
      <main id="main" className="dn-main">
        {children}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
