import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";

export const dynamic = "force-static";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);

  return (
    <section className="section" aria-labelledby="about-heading">
      <div className="container dn-container--narrow">
        <p className="dn-section-kicker">{dict.about.kicker}</p>
        <h1 id="about-heading">{dict.about.title}</h1>
        <p className="hero__lead">{dict.about.lede}</p>

        <div className="dn-path" style={{ marginTop: "2rem" }}>
          <section aria-labelledby="find-heading">
            <h2 id="find-heading">{dict.about.sections.findTitle}</h2>
            <p>{dict.about.sections.findBody}</p>
          </section>
          <section aria-labelledby="work-heading" style={{ marginTop: "1.5rem" }}>
            <h2 id="work-heading">{dict.about.sections.workTitle}</h2>
            <p>{dict.about.sections.workBody}</p>
          </section>
          <section aria-labelledby="record-heading" style={{ marginTop: "1.5rem" }}>
            <h2 id="record-heading">{dict.about.sections.recordTitle}</h2>
            <p>{dict.about.sections.recordBody}</p>
          </section>
          <section aria-labelledby="limits-heading" style={{ marginTop: "1.5rem" }}>
            <h2 id="limits-heading">{dict.about.sections.limitsTitle}</h2>
            <p>{dict.about.sections.limitsBody}</p>
          </section>
        </div>

        <div className="hero__actions" style={{ marginTop: "2rem" }}>
          <Link className="btn btn--primary" href={localePath(activeLocale, "/issues")}>
            {dict.about.actions.browseIssues}
          </Link>
          <Link className="btn" href={localePath(activeLocale, "/project")}>
            {dict.about.actions.openProject}
          </Link>
        </div>
      </div>
    </section>
  );
}
