import type { Metadata } from "next";

export const SEO_BASE_URL = "https://app.nexonoma.de";
export const SEO_SUPPORTED_LOCALES = ["de", "en"] as const;

export type SeoLocale = (typeof SEO_SUPPORTED_LOCALES)[number];

const BRAND_SUFFIX = " | Nexonoma";

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
  openGraphType?: "website" | "article";
};

const normalizePath = (path: string) => {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
};

const buildUrl = (lang: SeoLocale, path: string) => `${SEO_BASE_URL}/${lang}${normalizePath(path)}`;

export const buildSeoUrl = (lang: SeoLocale, path: string) => buildUrl(lang, path);

const applyBrandSuffix = (value: string) => (value.endsWith(BRAND_SUFFIX) ? value : `${value}${BRAND_SUFFIX}`);

export const truncateDescription = (value: string, maxLength: number = 160) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

export const buildSeoMetadata = ({
  lang,
  path,
  title,
  description,
  indexable = true,
  includeAlternates = true,
  openGraphType = "website",
}: SeoMetadataOptions): Metadata => {
  const canonical = buildSeoUrl(lang, path);
  const normalizedTitle = applyBrandSuffix(title);
  const normalizedDescription = truncateDescription(description);
  const languages: Record<string, string> = {};

  if (includeAlternates) {
    SEO_SUPPORTED_LOCALES.forEach((locale) => {
      languages[locale] = buildSeoUrl(locale, path);
    });
  } else {
    languages[lang] = canonical;
  }

  languages["x-default"] = canonical;

  const alternateLocale = includeAlternates
    ? SEO_SUPPORTED_LOCALES.filter((locale) => locale !== lang).map((locale) => OG_LOCALE_BY_LANG[locale])
    : undefined;

  const metadata: Metadata = {
    title: normalizedTitle,
    description: normalizedDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: normalizedTitle,
      description: normalizedDescription,
      url: canonical,
      siteName: "Nexonoma",
      type: openGraphType,
      locale: OG_LOCALE_BY_LANG[lang],
      alternateLocale,
    },
    twitter: {
      card: "summary",
      title: normalizedTitle,
      description: normalizedDescription,
    },
  };

  if (!indexable) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
};
