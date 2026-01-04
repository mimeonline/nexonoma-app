import { SEO_SUPPORTED_LOCALES, type SeoLocale } from "@/app/[lang]/seo";
import { getIndexableCatalogEntries } from "@/services/catalogIndex";
import {
  CONTENT_TYPE_ORDER,
  CONTENT_TYPE_ROUTE_MAP,
  dedupeEntries,
  formatLastmod,
  isValidSlug,
  resolveSitemapLocales,
  sortEntriesByTypeSlugIdLang,
  sortEntriesByTypeThenSlug,
  type SitemapEntry,
  type SortableSitemapEntry,
  type SitemapVariant,
  urlForAsset,
} from "@/utils/sitemap";
import { fetchSitemapNodesPage, type SitemapNode } from "@/services/sitemapNodes";

const toTypeKey = (value?: string) => (value ? value.toString().toUpperCase() : "");

const resolveLocales = (available: string[] | undefined, fallback: readonly SeoLocale[]) =>
  resolveSitemapLocales(available, fallback).filter((locale): locale is SeoLocale => fallback.includes(locale as SeoLocale));

const buildCatalogEntriesForTypes = async (
  baseUrl: string,
  variant: SitemapVariant,
  types: string[],
  includeReview = false
) => {
  const catalogEntries = await getIndexableCatalogEntries(SEO_SUPPORTED_LOCALES, { includeReview });
  const entries: SortableSitemapEntry[] = [];

  catalogEntries.forEach((entry) => {
    const typeKey = toTypeKey(entry.type);
    if (!types.includes(typeKey)) return;
    if (!isValidSlug(entry.slug)) return;

    const lastmod = formatLastmod(entry.updatedAt) ?? formatLastmod(entry.createdAt);
    if (!lastmod) return;

    const locales = resolveLocales(entry.availableLanguages, SEO_SUPPORTED_LOCALES);
    locales.forEach((locale) => {
      const loc = urlForAsset({ type: typeKey, slug: entry.slug }, { baseUrl, locale, variant });
      if (!loc) return;
      entries.push({ loc, lastmod, type: typeKey, slug: entry.slug, id: entry.id, locale });
    });
  });

  const ordered = sortEntriesByTypeThenSlug(entries, CONTENT_TYPE_ORDER);
  return dedupeEntries(ordered).map(({ loc, lastmod }) => ({ loc, lastmod }));
};

export const buildCatalogTypeSitemapEntries = async (baseUrl: string, variant: SitemapVariant, type: string) => {
  const includeReview = process.env.INCLUDE_REVIEW_IN_SITEMAP === "true";
  return buildCatalogEntriesForTypes(baseUrl, variant, [toTypeKey(type)], includeReview);
};

export type NodeSitemapStats = {
  loaded: number;
  included: number;
  skipped: number;
  reasonBreakdown: Record<string, number>;
};

export const buildCatalogNodeSitemapPayload = async (
  baseUrl: string,
  variant: SitemapVariant
): Promise<{ entries: SitemapEntry[]; stats: NodeSitemapStats }> => {
  const includeReview = process.env.INCLUDE_REVIEW_IN_SITEMAP === "true";
  const stats: NodeSitemapStats = {
    loaded: 0,
    included: 0,
    skipped: 0,
    reasonBreakdown: {},
  };
  const entries: SortableSitemapEntry[] = [];

  const bump = (reason: string) => {
    stats.reasonBreakdown[reason] = (stats.reasonBreakdown[reason] ?? 0) + 1;
  };

  const limit = 1000;
  let page = 1;
  let nodes: SitemapNode[] = [];

  do {
    nodes = await fetchSitemapNodesPage({
      page,
      limit,
      includeReview,
      langs: SEO_SUPPORTED_LOCALES,
    });
    stats.loaded += nodes.length;

    nodes.forEach((entry) => {
      const typeKey = toTypeKey(entry.type);
    if (!CONTENT_TYPE_ROUTE_MAP[typeKey]) {
      bump("missingTypeMapping");
      return;
    }
    if (!isValidSlug(entry.slug)) {
      bump("invalidSlug");
      return;
    }

    const lastmod = formatLastmod(entry.updatedAt) ?? formatLastmod(entry.createdAt);
    if (!lastmod) {
      bump("missingLastmod");
      return;
    }

    const locales = resolveLocales(entry.availableLanguages, SEO_SUPPORTED_LOCALES);
    if (locales.length === 0) {
      bump("noLocales");
      return;
    }

    locales.forEach((locale) => {
      const loc = urlForAsset({ type: typeKey, slug: entry.slug }, { baseUrl, locale, variant });
      if (!loc) return;
      entries.push({ loc, lastmod, type: typeKey, slug: entry.slug, id: entry.id, locale });
    });
    });

    page += 1;
  } while (nodes.length === limit);

  const ordered = sortEntriesByTypeSlugIdLang(entries, CONTENT_TYPE_ORDER);
  const deduped = dedupeEntries(ordered).map(({ loc, lastmod }) => ({ loc, lastmod }));
  stats.included = deduped.length;
  stats.skipped = Object.values(stats.reasonBreakdown).reduce((sum, value) => sum + value, 0);

  return { entries: deduped, stats };
};

export const buildCatalogNodeSitemapEntries = async (baseUrl: string, variant: SitemapVariant): Promise<SitemapEntry[]> => {
  const payload = await buildCatalogNodeSitemapPayload(baseUrl, variant);
  return payload.entries;
};

export const buildCatalogListSitemapEntries = (baseUrl: string, _variant: SitemapVariant): SitemapEntry[] => {
  const lastmod = formatLastmod(new Date());
  const entries: SortableSitemapEntry[] = SEO_SUPPORTED_LOCALES.map((locale) => ({
    loc: `${baseUrl}/${locale}/catalog`,
    lastmod,
    type: "CATALOG",
    slug: locale,
    locale,
  }));

  const ordered = sortEntriesByTypeThenSlug(entries, ["CATALOG"]);
  return dedupeEntries(ordered).map(({ loc, lastmod: entryLastmod }) => ({ loc, lastmod: entryLastmod }));
};

export const isCatalogType = (value: string) => !!CONTENT_TYPE_ROUTE_MAP[value];
