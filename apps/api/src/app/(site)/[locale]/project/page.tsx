import Link from "next/link";
import { notFound } from "next/navigation";

import { IssueRow } from "@/components/ui/issue-row";
import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";
import { getProjectOverviewOrNull, listProjectIssues } from "@/server/projects/service";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);

  const project = await getProjectOverviewOrNull();
  if (project === null) {
    return (
      <section className="section" aria-labelledby="project-heading">
        <div className="container">
          <div className="dn-empty" role="status">
            <strong>{dict.project.noIssues}</strong>
            <p>{dict.project.contributeBody}</p>
            <Link className="btn" href={localePath(activeLocale, "/")}>
              {dict.home.seeProject}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const [owner, name] = project.fullName.split("/");
  const recent = await listProjectIssues({ page: 1, perPage: 8 });
  const synced =
    project.lastSyncedAt !== null
      ? new Date(project.lastSyncedAt).toLocaleString(activeLocale === "ne" ? "ne-NP" : "en-GB")
      : dict.project.never;

  return (
    <>
      <header className="dn-page-header">
        <div className="dn-container">
          <nav className="dn-breadcrumbs" aria-label={dict.project.kicker}>
            <Link href={localePath(activeLocale, "/")}>{dict.brand}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>
        </div>
        <div className="dn-container dn-project-hero">
          <div>
            <div className="dn-project-hero__labels">
              <span className="Label Label--outline">{dict.project.publicLabel}</span>
              <span className="Label Label--success">{dict.project.openLabel}</span>
            </div>
            <div className="dn-repo-title">
              <span className="dn-project-owner">{owner}</span>
              <span className="dn-repo-title-separator" aria-hidden="true">
                /
              </span>
              <h1>{name ?? project.fullName}</h1>
            </div>
            <p className="dn-lede">{project.description ?? dict.project.none}</p>
            <p className="dn-project-byline">
              <strong>{dict.project.lastSync}</strong> {synced}
            </p>
          </div>
          <div className="dn-project-hero__actions">
            <Link className="btn btn--primary" href={localePath(activeLocale, "/issues")}>
              {dict.project.chooseIssue}
            </Link>
            <a
              className="btn btn--secondary"
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {dict.project.viewOnGitHub}
            </a>
            <p>{dict.project.githubSourceNote}</p>
          </div>
        </div>
      </header>

      <div className="dn-container dn-github-project">
        <section className="dn-project-about" aria-labelledby="about-heading">
          <div className="dn-section-heading-row">
            <div>
              <p className="dn-section-kicker">{dict.project.aboutKicker}</p>
              <h2 id="about-heading">{dict.project.aboutTitle}</h2>
            </div>
          </div>
          <div className="dn-project-about__grid">
            <div>
              <h3>{dict.project.contributeKicker}</h3>
              <p>{dict.project.contributeBody}</p>
            </div>
            <div>
              <h3>{dict.project.repository}</h3>
              <p>
                <a href={project.htmlUrl} target="_blank" rel="noopener noreferrer">
                  {project.fullName}
                </a>
              </p>
            </div>
            <div>
              <h3>{dict.project.licence}</h3>
              <p>{project.license ?? dict.project.notPublished}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="github-issues-heading">
          <div className="dn-section-heading-row">
            <div>
              <p className="dn-section-kicker">{dict.project.issuesKicker}</p>
              <h2 id="github-issues-heading">{dict.project.issuesTitle}</h2>
            </div>
            <Link className="dn-arrow-link" href={localePath(activeLocale, "/issues")}>
              {dict.project.allIssues} →
            </Link>
          </div>
          {recent.issues.length === 0 ? (
            <div className="dn-empty" role="status">
              <strong>{dict.project.noIssues}</strong>
            </div>
          ) : (
            <div className="dn-issue-list dn-issue-index">
              {recent.issues.map((issue) => (
                <IssueRow key={issue.number} issue={issue} locale={activeLocale} />
              ))}
            </div>
          )}
        </section>

        <section className="dn-project-sheet blueprint dn-sheet" aria-labelledby="sheet-heading">
          <div className="dn-sheet__header">
            <span id="sheet-heading">{dict.project.sheetTitle}</span>
            <span>{project.license ?? dict.project.none}</span>
          </div>
          <div className="dn-accountability">
            <div className="dn-accountability-item">
              <strong>{dict.project.repository}</strong>
              <span>
                <a href={project.htmlUrl} target="_blank" rel="noopener noreferrer">
                  {project.fullName}
                </a>
              </span>
            </div>
            <div className="dn-accountability-item">
              <strong>{dict.project.openIssues}</strong>
              <span>{project.openIssueCount}</span>
            </div>
            <div className="dn-accountability-item">
              <strong>{dict.project.members}</strong>
              <span>{project.memberCount}</span>
            </div>
          </div>
          <p className="dn-sheet__note">
            {dict.project.lastSync} · {synced}
          </p>
        </section>
      </div>
    </>
  );
}
