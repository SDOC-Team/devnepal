import { CaretDown, Info, PersonArmsSpread, Translate } from "@phosphor-icons/react";
import { cn } from "cn";

export type AccessibilityBarProps = {
  /** Official-site assurance text. */
  notice?: string;
  /** Currently selected interface language. */
  language?: string;
  className?: string;
};

/**
 * Government assurance strip shown above the main navigation.
 * Figma: "Accessibility bar" — 46px tall, #1447e6 background.
 */
export function AccessibilityBar({
  notice = "A Nepal Government Official Website",
  language = "English",
  className,
}: AccessibilityBarProps) {
  return (
    <div
      className={cn(
        "flex min-h-[46px] w-full items-center justify-between gap-4",
        "bg-[#1447e6] px-16 max-lg:px-6 max-sm:px-4",
        className,
      )}
    >
      <div className="flex items-center gap-[18px] max-sm:gap-3">
        <div className="flex items-center gap-3">
          <div aria-hidden className="h-[17px] w-5 shrink-0 rounded-[2px] bg-white/25" />
          <span className="font-medium text-[#eff6ff] text-[12px] leading-4">{notice}</span>
        </div>

        <a
          href="#how-to-identify"
          className={cn(
            "inline-flex items-center gap-1 text-[#eff6ff] text-[12px] leading-4 underline-offset-2",
            "hover:underline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
            "max-sm:hidden",
          )}
        >
          <Info aria-hidden size={16} />
          How to identify
          <CaretDown aria-hidden size={12} />
        </a>
      </div>

      <div className="flex items-center gap-4 text-[#fafafa]">
        <button
          type="button"
          aria-label="Accessibility options"
          className="grid size-5 place-items-center focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        >
          <PersonArmsSpread aria-hidden size={16} />
        </button>

        <span aria-hidden className="h-5 w-px bg-white/30" />

        <button
          type="button"
          className="inline-flex items-center gap-2 font-medium text-[12px] leading-4 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        >
          <Translate aria-hidden size={16} />
          {language}
          <CaretDown aria-hidden size={12} />
        </button>
      </div>
    </div>
  );
}
