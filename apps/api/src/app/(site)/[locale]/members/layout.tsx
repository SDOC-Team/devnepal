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
    description: "Browse community member profiles approved for the Dev Nepal directory.",
    openGraph: {
      title: `${dict.members.title} · Dev Nepal`,
      description: "Browse community member profiles approved for the Dev Nepal directory.",
    },
  };
}

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
