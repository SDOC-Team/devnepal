"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ErrorPanel, LoadingPanel, PageHeader } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { IssueRow } from "@/components/ui/issue-row";
import { useIssueLabels, useLocale, useProjectIssues } from "@/hooks";
import { localePath } from "@/lib/i18n";

const PER_PAGE = 15;

const SELECT_CLASS =
  "h-9 w-full min-w-0 rounded-md border border-input bg-paper px-2.5 py-1 text-sm text-text shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

const QUICK_LINK_CLASS =
  "inline-flex min-h-[var(--control-sm)] items-center gap-2 rounded-pill border border-divider-strong px-3 text-sm text-text no-underline hover:bg-neutral-100 aria-[current=true]:border-accent-700 aria-[current=true]:bg-accent-100 aria-[current=true]:text-accent-800";

export default function IssuesPage() {
  const { locale, dict } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q")?.trim() || undefined;
  const label = searchParams.get("label")?.trim() || undefined;
  const parsedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const {
    issues,
    total,
    isLoading: issuesLoading,
    error,
  } = useProjectIssues({ page, perPage: PER_PAGE, q, label });
  const { labels } = useIssueLabels();

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const starterCount = labels
    .filter((facet) => facet.name.toLowerCase().includes("good first"))
    .reduce((sum, facet) => sum + facet.count, 0);

  function navigate(next: { q?: string; label?: string; page?: number }): void {
    const search = new URLSearchParams();
    const nextQ = next.q ?? q;
    const nextLabel = next.label ?? label;
    const nextPage = next.page ?? 1;
    if (nextQ !== undefined && nextQ.length > 0) {
      search.set("q", nextQ);
    }
    if (nextLabel !== undefined) {
      search.set("label", nextLabel);
    }
    if (nextPage > 1) {
      search.set("page", String(nextPage));
    }
    const suffix = search.size > 0 ? `?${search.toString()}` : "";
    router.push(localePath(locale, `/issues${suffix}`));
  }

  return (
    <section className="py-12" aria-labelledby="issues-heading">
      <div className="container">
        <PageHeader
          aside={
            <dl
              className="m-0 flex flex-none gap-5 whitespace-nowrap"
              aria-label={dict.issues.title}
            >
              <div className="flex flex-col-reverse">
                <dt className="text-sm text-neutral-700">{dict.issues.openLabel}</dt>
                <dd className="m-0 font-heading text-lg font-semibold">{total}</dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-sm text-neutral-700">{dict.issues.firstIssueLabel}</dt>
                <dd className="m-0 font-heading text-lg font-semibold">{starterCount}</dd>
              </div>
            </dl>
          }
          kicker={dict.issues.kicker}
          lede={dict.issues.lede}
          title={dict.issues.title}
          titleId="issues-heading"
        />

        <search>
          <form
            className="mb-6 grid grid-cols-1 items-end gap-4 rounded-md border border-divider bg-paper p-4 sm:grid-cols-[1fr_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              navigate({ q: String(form.get("q") ?? ""), page: 1 });
            }}
          >
            <Field>
              <FieldLabel htmlFor="issue-search">{dict.issues.searchLabel}</FieldLabel>
              <Input
                id="issue-search"
                name="q"
                type="search"
                defaultValue={q ?? ""}
                key={q ?? ""}
                placeholder={dict.issues.searchPlaceholder}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="issue-label">{dict.issues.filterBy}</FieldLabel>
              {/* Native select: the platform control's keyboard and mobile
                  behaviour suits a filter better than a custom listbox. */}
              <select
                id="issue-label"
                name="label"
                defaultValue={label ?? ""}
                key={label ?? ""}
                onChange={(event) => navigate({ label: event.target.value || undefined, page: 1 })}
                className={SELECT_CLASS}
              >
                <option value="">{dict.issues.allLabels}</option>
                {labels.map((facet) => (
                  <option key={facet.name} value={facet.name}>
                    {facet.name} ({facet.count})
                  </option>
                ))}
              </select>
            </Field>
            <Button type="submit">{dict.issues.search}</Button>
          </form>
        </search>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold text-neutral-600">
            {dict.issues.filterBy}
          </span>
          {labels.map((facet) => (
            <Link
              key={facet.name}
              href={localePath(
                locale,
                `/issues?${new URLSearchParams({
                  label: facet.name,
                  ...(q !== undefined ? { q } : {}),
                }).toString()}`,
              )}
              aria-current={label === facet.name ? "true" : undefined}
              className={QUICK_LINK_CLASS}
            >
              {facet.name}
              <span className="inline-flex min-h-[var(--badge-h)] min-w-[var(--badge-h)] items-center justify-center rounded-pill border border-divider px-2 text-xs leading-tight font-semibold tabular-nums text-neutral-700">
                {facet.count}
              </span>
            </Link>
          ))}
          {label !== undefined || q !== undefined ? (
            <Link
              href={localePath(locale, "/issues")}
              className={`${QUICK_LINK_CLASS} border-dashed`}
            >
              {dict.issues.clear}
            </Link>
          ) : null}
        </div>

        {error !== undefined ? (
          <ErrorPanel
            message={error.message}
            retryLabel={dict.common.retry}
            title={dict.common.errorTitle}
            onRetry={() => window.location.reload()}
          />
        ) : issuesLoading ? (
          <LoadingPanel label={dict.common.loading} />
        ) : issues.length === 0 ? (
          <div
            className="grid justify-items-start gap-2 rounded-md border border-dashed border-divider-strong bg-paper px-6 py-8"
            role="status"
          >
            <strong className="m-0 font-heading text-lg leading-tight font-semibold">
              {dict.issues.emptyTitle}
            </strong>
            <p className="m-0 max-w-[62ch]">{dict.issues.emptyBody}</p>
            <Button variant="outline" render={<Link href={localePath(locale, "/issues")} />}>
              {dict.issues.clear}
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-divider bg-paper">
            {issues.map((issue) => (
              <IssueRow key={issue.number} issue={issue} locale={locale} />
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-6 flex flex-wrap items-center gap-2" aria-label={dict.issues.title}>
            {page > 1 ? (
              <Button variant="secondary" onClick={() => navigate({ page: page - 1 })}>
                ←
              </Button>
            ) : null}
            <span className="text-sm text-neutral-700">
              {page} / {totalPages}
            </span>
            {page < totalPages ? (
              <Button variant="secondary" onClick={() => navigate({ page: page + 1 })}>
                →
              </Button>
            ) : null}
          </nav>
        ) : null}
      </div>
    </section>
  );
}
