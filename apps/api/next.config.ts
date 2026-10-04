import type { NextConfig } from "next";

const securityHeaders = [
  // Browsers ignore HSTS over plain HTTP, so local development is unaffected.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // No page is meant to be embedded by another site.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // No page uses next/image, so the image optimiser (sharp and its native
  // libvips, about 19 MB) is left out of the production output.
  images: { unoptimized: true },
  outputFileTracingExcludes: {
    "*": ["../../node_modules/.bun/sharp@*/**", "../../node_modules/.bun/@img+*/**"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
