/** Numbered step cards — the "how this works" pattern shared by the landing
 * page's JourneySection and the About page's contribution path. */
export function StepGrid({ steps }: { steps: { id: string; title: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-6">
      {steps.map((step, index) => (
        <article
          aria-labelledby={`${step.id}-heading`}
          className="flex flex-col gap-4 rounded-md border border-divider bg-paper p-6"
          key={step.id}
        >
          <span
            aria-hidden="true"
            className="grid size-[var(--target-min)] place-items-center rounded-md bg-accent-100 text-base font-semibold text-accent-700"
          >
            {index + 1}
          </span>
          <h2 id={`${step.id}-heading`} className="m-0 text-base font-semibold">
            {step.title}
          </h2>
          <p className="m-0 leading-[1.6] text-neutral-700">{step.body}</p>
        </article>
      ))}
    </div>
  );
}
