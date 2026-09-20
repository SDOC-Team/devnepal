/**
 * Skeleton loader shown while route segments inside (site)/[locale] load.
 * Uses pulse-animated placeholders matching the page's typical content areas.
 */
export default function SiteLoading() {
  return (
    <div className="w-full px-4 py-10" role="status" aria-busy="true" aria-label="Loading">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="17" stroke="var(--color-divider)" strokeWidth="3" />
            <path
              d="M20 3a17 17 0 0 1 17 17"
              stroke="var(--color-accent-700)"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>

        <div>
          <div className="skel mb-3 h-[38px] w-[45%]" />
          <div className="skel mb-2 h-4 w-[75%]" />
          <div className="skel mb-2 h-4 w-[45%]" />
        </div>

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          <div className="skel h-[220px] rounded-md" />
          <div className="skel h-[220px] rounded-md" />
          <div className="skel h-[220px] rounded-md" />
        </div>
      </div>
    </div>
  );
}
