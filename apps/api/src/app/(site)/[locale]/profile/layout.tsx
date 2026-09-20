import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Profile",
  description:
    "Update your Dev Nepal member profile — add your bio, skills, affiliation, location, and links to showcase your contributions.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
