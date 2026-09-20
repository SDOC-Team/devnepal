import { cn } from "cn";

import heroBackground from "../../assets/images/hero-background.jpg";

export type HeroProps = {
  title?: string;
  subtitle?: string;
  /** Primary call to action. Omitted when the viewer is already signed in. */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

/**
 * Landing hero — 600px tall on desktop per the Figma frame, with the
 * background photo behind a dark scrim so the text stays legible.
 */
export function Hero({
  title = "The people building Nepal's public digital services",
  subtitle = "A public directory of contributors — designers, engineers and researchers working in the open on government platforms.",
  actionLabel,
  onAction,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative flex h-[600px] w-full items-center overflow-hidden max-lg:h-[460px] max-sm:h-[400px]",
        className,
      )}
    >
      <img
        src={heroBackground}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Scrim keeps contrast over an unpredictable photo. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/20"
      />

      <div className="relative mx-auto flex w-full max-w-[1448px] flex-col gap-6 px-8 max-sm:px-4">
        <h1 className="m-0 max-w-[760px] font-bold text-[48px] text-white leading-[56px] max-lg:text-[36px] max-lg:leading-[44px] max-sm:text-[28px] max-sm:leading-9">
          {title}
        </h1>

        <p className="m-0 max-w-[620px] text-[16px] text-white/90 leading-[26px] max-sm:text-[14px]">
          {subtitle}
        </p>

        {actionLabel !== undefined ? (
          <div>
            <button
              type="button"
              onClick={onAction}
              className={cn(
                "inline-flex h-11 items-center rounded-lg bg-(--color-brand-primary) px-5",
                "text-[14px] text-white transition-opacity hover:opacity-90",
                "focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
              )}
            >
              {actionLabel}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
