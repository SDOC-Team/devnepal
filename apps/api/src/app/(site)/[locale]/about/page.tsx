import { notFound } from "next/navigation";
import { ContributionPath } from "@/components/modules/about";
import { PageHeader } from "@/components/modules/common";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export const dynamic = "force-static";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);

  return (
    <section className="py-12" aria-labelledby="about-heading">
      <div className="container">
        <PageHeader
          kicker={dict.about.kicker}
          lede={dict.about.lede}
          title={dict.about.title}
          titleId="about-heading"
        />

        <ContributionPath dict={dict} locale={activeLocale} />
      </div>
    </section>
  );
}
