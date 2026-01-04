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
): { entries: SitemapEntry[]; skipped: number; total: number } => {
  const sortable: SortableSitemapEntry[] = [];
  let skipped = 0;

  assets.forEach((asset) => {
    const typeKey = toTypeKey(asset.type);
    if (!CONTENT_TYPE_ROUTE_MAP[typeKey]) {
      skipped += 1;
      return;
    }
    if (!isValidSlug(asset.slug)) {
      skipped += 1;
      return;
    }

    const assetLastmod = formatLastmod(asset.updatedAt) ?? formatLastmod(asset.createdAt);
    const resolvedLocales = resolveLocales(asset.availableLanguages, locales);
    if (resolvedLocales.length === 0) {
      skipped += 1;
      return;
    }

    resolvedLocales.forEach((locale) => {
      const loc = urlForAsset({ type: typeKey, slug: asset.slug }, { baseUrl, locale });
      if (!loc) {
        skipped += 1;
        return;
      }
      sortable.push({
        loc,
        lastmod: assetLastmod,
        type: typeKey,
        slug: asset.slug,
        id: asset.id,
        locale,
      });
    });
  });

  const ordered = sortEntriesByTypeSlugIdLang(sortable);
  const deduped = dedupeEntries(ordered).map(({ loc, lastmod }) => ({ loc, lastmod }));
  return { entries: deduped, skipped, total: assets.length };
};

export const buildSitemapCatalogEntries = async (baseUrl: string): Promise<{ entries: SitemapEntry[]; skipped: number; total: number }> => {
  const limit = 2000;
  const page = 1;

  const nodes = await fetchSitemapNodesPage({
    page,
    limit,
  });

  return mapAssetsToSitemapEntries(nodes, baseUrl, SEO_SUPPORTED_LOCALES);
};
