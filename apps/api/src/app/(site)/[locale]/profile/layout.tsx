import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile",
  description:
    "Update the bio, skills, affiliation, location, and links shown on your Dev Nepal member profile.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
