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
        className="absolute -top-full left-2 z-[100] inline-flex min-h-[var(--control-lg)] items-center rounded-md border border-divider-strong bg-paper px-4 py-3 text-sm font-bold text-text focus-visible:top-2"
        href="#main"
      >
        {dict.common.skipToContent}
      </a>
      <SiteHeader locale={locale} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </SwrProvider>
  );
}
