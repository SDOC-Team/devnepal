import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Gov Portal — public technology, built in public",
    template: "%s · Gov Portal",
  },
  description:
    "Public technology, built in public — one project, its open issues, and the people contributing to it.",
  icons: { icon: "/assets/devnepal/images/devnepal-mark.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-color-mode="light" data-light-theme="light">
      <head>
        <link rel="stylesheet" href="/assets/devnepal/vendor/primer.css" />
        <link rel="stylesheet" href="/assets/devnepal/tokens.css" />
        <link rel="stylesheet" href="/assets/devnepal/base.css" />
        <link rel="stylesheet" href="/assets/devnepal/components.css" />
        <link rel="stylesheet" href="/assets/devnepal/devnepal.css" />
        <link rel="stylesheet" href="/assets/devnepal/public-discovery.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
