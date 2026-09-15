import type { ReactNode } from "react";

const TONE_CLASSES = {
  neutral: "border-l-divider-strong bg-transparent",
  success: "border-l-success bg-success-subtle",
  attention: "border-l-attention bg-attention-subtle",
  danger: "border-l-error bg-error-subtle",
} as const;

/**
 * Left-rule status banner — sign-in prompts, profile/member approval status,
 * and inline form errors all use this same shape with a different tone.
 */
export function StateBanner({
  tone = "neutral",
  role,
  className = "",
  children,
}: {
  tone?: keyof typeof TONE_CLASSES;
  role?: "status" | "alert";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`border-l-[3px] px-5 py-4 ${TONE_CLASSES[tone]} ${className}`} role={role}>
      {children}
    </div>
  );
}
