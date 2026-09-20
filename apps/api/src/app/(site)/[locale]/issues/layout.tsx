import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Issues",
  description:
    "Explore open issues on the Dev Nepal project — find tasks to contribute to, track progress, and see what the community is actively working on.",
  openGraph: {
    title: "Open Issues · Dev Nepal",
    description:
      "Explore open issues on the Dev Nepal project — find tasks to contribute to, track progress, and see what the community is actively working on.",
  },
};

export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
