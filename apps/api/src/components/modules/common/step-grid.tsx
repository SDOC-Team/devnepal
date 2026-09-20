/** Numbered step cards — the "how this works" pattern used by the About page's
 * contribution path. */
export function StepGrid({ steps }: { steps: { id: string; title: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <article
          aria-labelledby={`${step.id}-heading`}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
          key={step.id}
        >
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-md bg-primary/5 text-base font-semibold text-primary"
          >
            {index + 1}
          </span>
          <h3 id={`${step.id}-heading`} className="m-0 text-base font-semibold">
            {step.title}
          </h3>
          <p className="m-0 leading-[1.6] text-muted-foreground">{step.body}</p>
        </article>
      ))}
    </div>
  );
}
