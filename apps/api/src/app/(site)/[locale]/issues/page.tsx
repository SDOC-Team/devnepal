import Link from "next/link";
import { notFound } from "next/navigation";

import { IssueRow } from "@/components/ui/issue-row";
import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";
import { listIssueLabels, listProjectIssues } from "@/server/projects/service";

export const dynamic = "force-dynamic";

type IssuesSearchParams = {
  q?: string;
  label?: string;
  page?: string;
};

export default async function IssuesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<IssuesSearchParams>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);
  const query = await searchParams;

  const q = typeof query.q === "string" && query.q.trim().length > 0 ? query.q.trim() : undefined;
  const label =
    typeof query.label === "string" && query.label.trim().length > 0
      ? query.label.trim()
      : undefined;
  const parsedPage = Number.parseInt(query.page ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const perPage = 15;

  const [result, labels] = await Promise.all([
    listProjectIssues({
      page,
      perPage,
      ...(q !== undefined ? { q } : {}),
      ...(label !== undefined ? { label } : {}),
    }),
    listIssueLabels(),
  ]);
  const totalPages = Math.max(1, Math.ceil(result.total / perPage));
  const starterCount = labels
    .filter((facet) => facet.name.toLowerCase().includes("good first"))
    .reduce((sum, facet) => sum + facet.count, 0);

  function filterHref(nextLabel: string | undefined): string {
    const search = new URLSearchParams();
    if (nextLabel !== undefined) {
      search.set("label", nextLabel);
    }
    if (q !== undefined) {
      search.set("q", q);
    }
    const suffix = search.size > 0 ? `?${search.toString()}` : "";
    return localePath(activeLocale, `/issues${suffix}`);
  }

  function pageHref(target: number): string {
    const search = new URLSearchParams();
    if (q !== undefined) {
      search.set("q", q);
    }
    if (label !== undefined) {
      search.set("label", label);
    }
    if (target > 1) {
      search.set("page", String(target));
    }
    const suffix = search.size > 0 ? `?${search.toString()}` : "";
    return localePath(activeLocale, `/issues${suffix}`);
  }

  return (
    <section className="dn-catalog" aria-labelledby="issues-heading">
      <div className="container">
        <header className="dn-catalog-heading">
          <div>
            <p className="dn-section-kicker">{dict.issues.kicker}</p>
            <h1 id="issues-heading">{dict.issues.title}</h1>
            <p>{dict.issues.lede}</p>
          </div>
          <dl className="dn-catalog-status-counts" aria-label={dict.issues.title}>
            <div>
              <dt>{dict.issues.openLabel}</dt>
              <dd>{result.total}</dd>
            </div>
            <div>
              <dt>{dict.issues.firstIssueLabel}</dt>
              <dd>{starterCount}</dd>
            </div>
          </dl>
        </header>

        <form
          className="filterbar catalog-filter"
          method="get"
          action={localePath(activeLocale, "/issues")}
        >
          <div className="filterbar__query">
            <label htmlFor="issue-search">{dict.issues.searchLabel}</label>
            <input
              id="issue-search"
              name="q"
              type="search"
              defaultValue={q ?? ""}
              placeholder={dict.issues.searchPlaceholder}
            />
          </div>
          <div className="filterbar__query">
            <label htmlFor="issue-label">{dict.issues.filterBy}</label>
            <select id="issue-label" name="label" defaultValue={label ?? ""}>
              <option value="">{dict.issues.allLabels}</option>
              {labels.map((facet) => (
                <option key={facet.name} value={facet.name}>
                  {facet.name} ({facet.count})
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn--primary filterbar__submit" type="submit">
            {dict.issues.search}
          </button>
        </form>

        <div className="dn-catalog-quick">
          <span>{dict.issues.filterBy}</span>
          {labels.map((facet) => (
            <Link
              key={facet.name}
              href={filterHref(facet.name)}
              aria-current={label === facet.name ? "true" : undefined}
            >
              {facet.name} <span className="Counter">{facet.count}</span>
            </Link>
          ))}
          {label !== undefined || q !== undefined ? (
            <Link className="dn-catalog-quick__clear" href={localePath(activeLocale, "/issues")}>
              {dict.issues.clear}
            </Link>
          ) : null}
        </div>

        {result.issues.length === 0 ? (
          <div className="dn-empty" role="status">
            <strong>{dict.issues.emptyTitle}</strong>
            <p>{dict.issues.emptyBody}</p>
            <Link className="btn" href={localePath(activeLocale, "/issues")}>
              {dict.issues.clear}
            </Link>
          </div>
        ) : (
          <div className="dn-issue-list dn-issue-index">
            {result.issues.map((issue) => (
              <IssueRow key={issue.number} issue={issue} locale={activeLocale} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="pagination dn-catalog-pagination" aria-label={dict.issues.title}>
            {page > 1 ? (
              <Link className="btn btn--secondary" href={pageHref(page - 1)}>
                ←
              </Link>
            ) : null}
            <span>
              {page} / {totalPages}
            </span>
            {page < totalPages ? (
              <Link className="btn btn--secondary" href={pageHref(page + 1)}>
                →
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
