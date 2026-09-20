import type { Metadata } from "next";

import "./tailwind.css";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Dev Nepal — public technology, built in public",
    template: "%s · Dev Nepal",
  },
  description:
    "Public technology, built in public — one project, its open issues, and the people contributing to it.",
  icons: {
    icon: [
      {
        url: "/assets/devnepal/images/emblem-of-nepal-120.png",
        type: "image/png",
        sizes: "120x120",
      },
    ],
    apple: "/assets/devnepal/images/emblem-of-nepal-120.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased font-sans", notoSans.variable, fontMono.variable)}
    >
      <body className="selection:bg-primary/15">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
