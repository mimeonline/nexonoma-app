import { MetadataRoute } from "next";
import de from "./[lang]/dictionaries/de.json";
import en from "./[lang]/dictionaries/en.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://app.nexonoma.de";
  const locales = ["de", "en"] as const;
  const dictionaries = { de, en } satisfies Record<(typeof locales)[number], unknown>;
  const routes = ["", "/grid", "/matrix", "/city", "/catalog"] as const;

  const makeUrl = (lang: keyof typeof dictionaries, route: (typeof routes)[number]) => `${baseUrl}/${lang}${route}`;

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
