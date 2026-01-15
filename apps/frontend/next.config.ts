import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  experimental: {
    caseSensitiveRoutes: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "app.nexonoma.de" }],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  async redirects() {
    return [
      // OLD: /:lang/catalog/:contentType/:contentSlug  -> NEW: /:lang/360/:contentType/:contentSlug
      // Example: /de/catalog/concept/12-factor-app -> /de/360/concept/12-factor-app
      {
        source: "/:lang/catalog/:contentType/:contentSlug",
        destination: "/:lang/360/:contentType/:contentSlug",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [{ source: "/:lang/sandbox/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
