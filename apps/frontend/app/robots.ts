import { MetadataRoute } from "next";
import { SEO_BASE_URL } from "./[lang]/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sandbox"],
    },
    sitemap: `${SEO_BASE_URL}/sitemap.xml`,
  };
}
