import { notFound } from "next/navigation";
import { LocaleLang } from "@/components/modules/common/locale-lang";
import { SiteFooter } from "@/components/modules/common/site-footer";
import { SiteHeader } from "@/components/modules/common/site-header";
import { SwrProvider } from "@/components/providers/swr-provider";
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
    <SwrProvider>
      <LocaleLang locale={locale} />
      <a
        className="sr-only focus:not-sr-only focus:block focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
        href="#main-content"
      >
        {dict.common.skipToContent}
      </a>
      <SiteHeader locale={locale} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} />
    </SwrProvider>
  );
}
