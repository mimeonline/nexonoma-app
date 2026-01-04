import { SEO_SUPPORTED_LOCALES, type SeoLocale } from "../app/[lang]/seo";
import { fetchSitemapNodesPage, type SitemapNode } from "../services/sitemapNodes";
import {
  CONTENT_TYPE_ROUTE_MAP,
  dedupeEntries,
  formatLastmod,
  isValidSlug,
  resolveSitemapLocales,
  sortEntriesByTypeSlugIdLang,
  type SitemapEntry,
  type SortableSitemapEntry,
  urlForAsset,
} from "./sitemap";

const STATIC_SITEMAP_PAGES = [
  "/de/",
  "/en/",
  "/de/catalog",
  "/en/catalog",
  "/de/grid",
  "/en/grid",
  "/de/preview",
  "/en/preview",
] as const;

const toTypeKey = (value?: string) => (value ? value.toString().toUpperCase() : "");

const resolveLocales = (available: string[] | undefined, fallback: readonly SeoLocale[]) =>
  resolveSitemapLocales(available, fallback).filter((locale): locale is SeoLocale => fallback.includes(locale as SeoLocale));

const buildUrl = (baseUrl: string, path: string) => {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const buildSitemapPagesEntries = (baseUrl: string, now: Date = new Date()): SitemapEntry[] => {
  const lastmod = formatLastmod(now);
  return STATIC_SITEMAP_PAGES.map((path) => ({
    loc: buildUrl(baseUrl, path),
    lastmod,
  }));
};

export const mapAssetsToSitemapEntries = (
  assets: SitemapNode[],
  baseUrl: string,
  locales: readonly SeoLocale[]
): SitemapEntry[] => {
  const entries: SortableSitemapEntry[] = [];

  assets.forEach((asset) => {
    const typeKey = toTypeKey(asset.type);
    if (!CONTENT_TYPE_ROUTE_MAP[typeKey]) return;
    if (!isValidSlug(asset.slug)) return;

    const assetLastmod = formatLastmod(asset.updatedAt) ?? formatLastmod(asset.createdAt);
    const resolvedLocales = resolveLocales(asset.availableLanguages, locales);
    if (resolvedLocales.length === 0) return;

    resolvedLocales.forEach((locale) => {
      const loc = urlForAsset({ type: typeKey, slug: asset.slug }, { baseUrl, locale });
      if (!loc) return;
      entries.push({
        loc,
        lastmod: assetLastmod,
        type: typeKey,
        slug: asset.slug,
        id: asset.id,
        locale,
      });
    });
  });

  const ordered = sortEntriesByTypeSlugIdLang(entries);
  return dedupeEntries(ordered).map(({ loc, lastmod }) => ({ loc, lastmod }));
};

export const buildSitemapCatalogEntries = async (baseUrl: string): Promise<SitemapEntry[]> => {
  const includeReview = process.env.INCLUDE_REVIEW_IN_SITEMAP === "true";
  const limit = 1000;
  let page = 1;
  let nodes: SitemapNode[] = [];
  const all: SitemapNode[] = [];

  do {
    nodes = await fetchSitemapNodesPage({
      page,
      limit,
      includeReview,
      langs: SEO_SUPPORTED_LOCALES,
    });
    all.push(...nodes);
    page += 1;
  } while (nodes.length === limit);

  return mapAssetsToSitemapEntries(all, baseUrl, SEO_SUPPORTED_LOCALES);
};
