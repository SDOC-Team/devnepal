import Link from "next/link";

import { StepGrid } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/** The three-step path plus the closing "what this portal is / isn't" card. */
export function ContributionPath({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const steps = [
    { id: "find", title: dict.about.sections.findTitle, body: dict.about.sections.findBody },
    { id: "work", title: dict.about.sections.workTitle, body: dict.about.sections.workBody },
    {
      id: "record",
      title: dict.about.sections.recordTitle,
      body: dict.about.sections.recordBody,
    },
  ];

  return (
    <>
      <StepGrid steps={steps} />

      <section
        aria-labelledby="limits-heading"
        className="mt-6 rounded-xl border border-border bg-card p-8"
      >
        <h2 id="limits-heading" className="mt-0 mb-3 text-lg">
          {dict.about.sections.limitsTitle}
        </h2>
        <p className="m-0 max-w-[68ch] leading-[1.6] text-muted-foreground">
          {dict.about.sections.limitsBody}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button render={<Link href={localePath(locale, "/issues")} />}>
            {dict.about.actions.browseIssues}
          </Button>
          <Button variant="outline" render={<Link href={localePath(locale, "/project")} />}>
            {dict.about.actions.openProject}
          </Button>
        </div>
      </section>
    </>
  );
}
