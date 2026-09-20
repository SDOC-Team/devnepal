import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Project",
  description:
    "Dev Nepal's flagship open-source project — explore the codebase, track milestones, review open pull requests, and see how the community ships public software.",
  openGraph: {
    title: "The Project · Dev Nepal",
    description:
      "Dev Nepal's flagship open-source project — explore the codebase, track milestones, review open pull requests, and see how the community ships public software.",
  },
};

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
