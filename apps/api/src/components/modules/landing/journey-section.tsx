import type { Dictionary } from "@/lib/i18n";

/** "How does it work?" — three icon cards. */
export function JourneySection({ dict }: { dict: Dictionary }) {
  const steps = [
    {
      title: dict.home.howStep1Title,
      body: dict.home.howStep1Body,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      ),
    },
    {
      title: dict.home.howStep2Title,
      body: dict.home.howStep2Body,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
    {
      title: dict.home.howStep3Title,
      body: dict.home.howStep3Body,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-12" aria-labelledby="how-heading">
      <div className="container">
        <h2 id="how-heading" className="mb-8 leading-[1.08] tracking-[-0.01em]">
          {dict.home.howItWorksTitle}
        </h2>
        <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-6">
          {steps.map((step) => (
            <article
              key={step.title}
              className="flex flex-col gap-4 rounded-md border border-divider bg-paper p-6"
            >
              <div className="grid size-[var(--target-min)] place-items-center rounded-md bg-accent-100 text-accent-700">
                {step.icon}
              </div>
              <h3 className="m-0 text-base font-semibold">{step.title}</h3>
              <p className="m-0 text-sm leading-normal text-neutral-700">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
