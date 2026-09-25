import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContributionPath } from "@/components/modules/about";
import { PageHeader } from "@/components/modules/common";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = isLocale(locale) ? getDictionary(locale) : getDictionary("en");
  return {
    title: dict.about.title,
    description:
      "Learn how Dev Nepal works — our contribution path, guiding principles, and how public technology is built in the open.",
    openGraph: {
      title: `${dict.about.title} · Dev Nepal`,
      description:
        "Learn how Dev Nepal works — our contribution path, guiding principles, and how public technology is built in the open.",
    },
  };
}

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
