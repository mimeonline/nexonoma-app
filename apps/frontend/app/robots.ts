import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sandbox"],
    },
    sitemap: "https://app.nexonoma.de/sitemap.xml",
  };
}
