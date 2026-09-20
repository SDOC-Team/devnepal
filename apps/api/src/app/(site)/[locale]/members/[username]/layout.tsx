import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const title = `@${username}`;
  const description = `View ${username}'s public profile on Dev Nepal — their skills, contributions, affiliation, and links.`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} · Dev Nepal`,
      description,
      images: [`https://github.com/${username}.png`],
    },
    twitter: {
      card: "summary",
      title: `${title} · Dev Nepal`,
      description,
      images: [`https://github.com/${username}.png`],
    },
  };
}

export default function MemberDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
