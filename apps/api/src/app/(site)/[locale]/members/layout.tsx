import type { Metadata } from "next";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = isLocale(locale) ? getDictionary(locale) : getDictionary("en");
  return {
    title: dict.members.title,
    description:
      "Browse all Dev Nepal contributors — engineers, designers, researchers, and more — who are building public technology in Nepal.",
    openGraph: {
      title: `${dict.members.title} · Dev Nepal`,
      description:
        "Browse all Dev Nepal contributors — engineers, designers, researchers, and more — who are building public technology in Nepal.",
    },
  };
}

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
