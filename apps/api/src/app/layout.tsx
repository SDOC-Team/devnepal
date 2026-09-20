import type { Metadata } from "next";

import "./tailwind.css";
import { Noto_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

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
      data-color-mode="light"
      data-light-theme="light"
      className={cn("font-sans", notoSans.variable)}
    >
      <body>{children}</body>
    </html>
  );
}
