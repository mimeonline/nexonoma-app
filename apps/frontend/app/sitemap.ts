import { MetadataRoute } from "next";
import { SEO_BASE_URL, SEO_SUPPORTED_LOCALES } from "./[lang]/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_BASE_URL;
  const locales = SEO_SUPPORTED_LOCALES;
  const routes = ["", "/catalog", "/grid"] as const;

  const makeUrl = (lang: (typeof locales)[number], route: (typeof routes)[number]) => `${baseUrl}/${lang}${route}`;

  return routes.flatMap((route) => {
    const alternates = {
      languages: Object.fromEntries(locales.map((lang) => [lang, makeUrl(lang, route)])),
    };

    return locales.map((lang) => ({
      url: makeUrl(lang, route),
      lastModified: new Date(),
      alternates,
    }));
  });
}
