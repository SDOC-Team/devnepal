import Link from "next/link";
import { notFound } from "next/navigation";

import { IssueRow } from "@/components/ui/issue-row";
import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";
import { getProjectOverviewOrNull, listProjectIssues } from "@/server/projects/service";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);

  const project = await getProjectOverviewOrNull();
  const recent = project !== null ? await listProjectIssues({ page: 1, perPage: 5 }) : null;

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container">
          <div className="dn-home-hero">
            <div className="hero__panel">
              <div className="dn-trust-tags">
                <span className="tag tag-accent">{dict.home.tag}</span>
              </div>
              <h1 id="hero-heading">
                <span>{dict.home.titleLine1}</span>
                <span>{dict.home.titleLine2}</span>
              </h1>
              <p className="hero__lead">{dict.home.lead}</p>
              <div className="hero__actions">
                <Link className="btn btn--primary" href={localePath(activeLocale, "/issues")}>
                  {dict.home.browseIssues}
                </Link>
                <Link className="btn" href={localePath(activeLocale, "/project")}>
                  {dict.home.browseProject}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section dn-home" aria-labelledby="path-heading">
        <div className="container">
          <div className="dn-contribution-model">
            <header>
              <span className="dn-section-kicker">{dict.home.contributeKicker}</span>
              <h2 id="path-heading">{dict.home.contributeTitle}</h2>
              <p>{dict.home.contributeBody}</p>
              <ul className="dn-way-line" aria-label={dict.home.contributeTitle}>
                {dict.home.ways.map((way) => (
                  <li key={way}>{way}</li>
                ))}
              </ul>
              <Link className="dn-arrow-link" href={localePath(activeLocale, "/about")}>
                {dict.home.howToContribute} →
              </Link>
            </header>
            <div className="dn-contribution-grid">
              <article className="blueprint">
                <h3>
                  <Link href={localePath(activeLocale, "/issues")}>
                    {dict.home.journey.step2Title}
                  </Link>
                </h3>
                <p>{dict.home.journey.step2Body}</p>
              </article>
              <article className="blueprint">
                <h3>
                  <Link href={localePath(activeLocale, "/about")}>
                    {dict.home.journey.step3Title}
                  </Link>
                </h3>
                <p>{dict.home.journey.step3Body}</p>
              </article>
              <article className="blueprint">
                <h3>
                  <Link href={localePath(activeLocale, "/members")}>
                    {dict.home.journey.step4Title}
                  </Link>
                </h3>
                <p>{dict.home.journey.step4Body}</p>
              </article>
            </div>
          </div>

          <div className="dn-path">
            <p className="dn-section-kicker">{dict.home.journeyKicker}</p>
            <h2>{dict.home.journeyTitle}</h2>
            <ol className="dn-journey">
              <li className="dn-journey-step">
                <span className="Counter">1</span>
                <strong>{dict.home.journey.step1Title}</strong>
                <span>{dict.home.journey.step1Body}</span>
              </li>
              <li className="dn-journey-step">
                <span className="Counter">2</span>
                <strong>{dict.home.journey.step2Title}</strong>
                <span>{dict.home.journey.step2Body}</span>
              </li>
              <li className="dn-journey-step">
                <span className="Counter">3</span>
                <strong>{dict.home.journey.step3Title}</strong>
                <span>{dict.home.journey.step3Body}</span>
              </li>
              <li className="dn-journey-step">
                <span className="Counter">4</span>
                <strong>{dict.home.journey.step4Title}</strong>
                <span>{dict.home.journey.step4Body}</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section dn-home dn-home--band" aria-labelledby="project-heading">
        <div className="container">
          <header className="dn-home-section-heading">
            <div>
              <span className="dn-section-kicker">{dict.home.statsKicker}</span>
              <h2 id="project-heading">{dict.home.openWorkTitle}</h2>
              <p>{dict.home.openWorkBody}</p>
            </div>
            <Link className="dn-arrow-link" href={localePath(activeLocale, "/project")}>
              {dict.home.seeProject} →
            </Link>
          </header>
          {project !== null ? (
            <div className="dn-featured-grid">
              <article className="card blueprint dn-featured-card">
                <div className="dn-featured-card__head">
                  <span className="tag tag-accent">{dict.project.publicLabel}</span>
                </div>
                <div>
                  <h3>
                    <Link href={localePath(activeLocale, "/project")}>{project.title}</Link>
                  </h3>
                  <p className="dn-featured-card__owner">{project.fullName}</p>
                </div>
                <p className="dn-featured-card__summary">
                  {project.description ?? dict.project.none}
                </p>
                <dl className="dn-featured-card__facts">
                  <div>
                    <dt>{dict.project.openIssues}</dt>
                    <dd>{project.openIssueCount}</dd>
                  </div>
                  <div>
                    <dt>{dict.project.members}</dt>
                    <dd>{project.memberCount}</dd>
                  </div>
                  <div>
                    <dt>{dict.project.repository}</dt>
                    <dd>{project.fullName}</dd>
                  </div>
                </dl>
              </article>
            </div>
          ) : (
            <div className="dn-empty" role="status">
              <strong>{dict.project.noIssues}</strong>
              <p>{dict.project.contributeBody}</p>
            </div>
          )}
        </div>
      </section>

      {recent !== null && recent.issues.length > 0 ? (
        <section className="section dn-home" aria-labelledby="recent-issues-heading">
          <div className="container">
            <header className="dn-home-section-heading">
              <div>
                <span className="dn-section-kicker">{dict.project.issuesKicker}</span>
                <h2 id="recent-issues-heading">{dict.project.issuesTitle}</h2>
              </div>
              <Link className="dn-arrow-link" href={localePath(activeLocale, "/issues")}>
                {dict.home.browseIssues} →
              </Link>
            </header>
            <div className="dn-issue-list dn-issue-index">
              {recent.issues.map((issue) => (
                <IssueRow key={issue.number} issue={issue} locale={activeLocale} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
