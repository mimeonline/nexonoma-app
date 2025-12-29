import type { Metadata } from "next";

export const SEO_BASE_URL = "https://app.nexonoma.de";
export const SEO_SUPPORTED_LOCALES = ["de", "en"] as const;

export type SeoLocale = (typeof SEO_SUPPORTED_LOCALES)[number];

const OG_LOCALE_BY_LANG: Record<SeoLocale, string> = {
  de: "de_DE",
  en: "en_US",
};

type SeoMetadataOptions = {
  lang: SeoLocale;
  path: string;
  title: string;
  description: string;
  indexable?: boolean;
  includeAlternates?: boolean;
};

const normalizePath = (path: string) => {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
};

const buildUrl = (lang: SeoLocale, path: string) => `${SEO_BASE_URL}/${lang}${normalizePath(path)}`;

export const buildSeoMetadata = ({
  lang,
  path,
  title,
  description,
  indexable = true,
  includeAlternates = true,
}: SeoMetadataOptions): Metadata => {
  const canonical = buildUrl(lang, path);
  const languages: Record<string, string> = {};

  if (includeAlternates) {
    SEO_SUPPORTED_LOCALES.forEach((locale) => {
      languages[locale] = buildUrl(locale, path);
    });
  } else {
    languages[lang] = canonical;
  }

  languages["x-default"] = canonical;

  const alternateLocale = includeAlternates
    ? SEO_SUPPORTED_LOCALES.filter((locale) => locale !== lang).map((locale) => OG_LOCALE_BY_LANG[locale])
    : undefined;

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Nexonoma",
      type: "website",
      locale: OG_LOCALE_BY_LANG[lang],
      alternateLocale,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };

  if (!indexable) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
};
