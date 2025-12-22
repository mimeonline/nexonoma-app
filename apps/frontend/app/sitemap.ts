import { MetadataRoute } from "next";
import de from "./[lang]/dictionaries/de.json";
import en from "./[lang]/dictionaries/en.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://app.nexonoma.de";
  const dictionaries = { de, en };
  const locales = Object.keys(dictionaries) as Array<keyof typeof dictionaries>;
  const routes = ["", "/grid", "/matrix", "/city", "/catalog"] as const;

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
