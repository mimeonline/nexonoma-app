import { mapToCatalogItem } from "@/features/catalog/utils/catalogMapper";
import type { CatalogItem } from "@/types/catalog";
import { AssetStatus } from "@/types/nexonoma";
import { fetchJsonSafe, getApiBase } from "./apiUtils";

export type SitemapNode = {
  id: string;
  type: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  availableLanguages?: string[];
};

export type SitemapNodePageParams = {
  page: number;
  limit: number;
};

type SystemCatalogIndexResponse = {
  items?: SitemapNode[];
};

type IndexEntry = {
  id: string;
  slug: string;
  type: string;
  updatedAt?: string;
  createdAt?: string;
  availableLanguages: string[];
};

const fetchCatalogForLocale = async (lang: string): Promise<CatalogItem[]> => {
  const baseUrl = getApiBase({ preferInternal: true });
  const url = `${baseUrl}/catalog?lang=${lang}`;
  const data = await fetchJsonSafe<unknown>(url, { logLabel: `catalog index fetch failed (${lang})`, next: { revalidate: 3600 } });

  if (!Array.isArray(data)) return [];

  return data.map(mapToCatalogItem).filter((item) => item.slug && item.type);
};

export const getIndexableCatalogEntries = async (
  locales: readonly string[],
  options?: { includeReview?: boolean }
): Promise<
  {
    id: string;
    slug: string;
    type: string;
    updatedAt?: string;
    createdAt?: string;
    availableLanguages: string[];
  }[]
> => {
  const includeReview = options?.includeReview ?? false;
  const entries = new Map<string, { entry: IndexEntry; locales: Set<string> }>();

  await Promise.all(
    locales.map(async (lang) => {
      const items = await fetchCatalogForLocale(lang);
      items.forEach((item) => {
        const isPublished = item.status === AssetStatus.PUBLISHED;
        const isReview = includeReview && item.status === AssetStatus.REVIEW;
        if (!isPublished && !isReview) return;

        const key = `${item.type}::${item.slug}`;
        const existing = entries.get(key);
        const updatedAt = item.updatedAt;
        const createdAt = item.createdAt;

        if (!existing) {
          entries.set(key, {
            entry: {
              id: item.id,
              slug: item.slug,
              type: item.type?.toString() ?? "",
              updatedAt,
              createdAt,
              availableLanguages: [],
            },
            locales: new Set([lang]),
          });
          return;
        }

        existing.locales.add(lang);
        if (updatedAt && (!existing.entry.updatedAt || new Date(updatedAt) > new Date(existing.entry.updatedAt))) {
          existing.entry.updatedAt = updatedAt;
        }
        if (createdAt && (!existing.entry.createdAt || new Date(createdAt) > new Date(existing.entry.createdAt))) {
          existing.entry.createdAt = createdAt;
        }
      });
    })
  );

  return Array.from(entries.values()).map(({ entry, locales: localeSet }) => ({
    ...entry,
    availableLanguages: Array.from(localeSet),
  }));
};

export function createSystemApi() {
  const baseUrl = getApiBase({ preferInternal: true });

  return {
    async fetchSitemapNodesPage({ page, limit }: SitemapNodePageParams): Promise<SitemapNode[]> {
      const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: "published",
        types: "concept,method,tool,technology",
      });

      const url = `${baseUrl}/system/catalog/index?${searchParams.toString()}`;
      const data = await fetchJsonSafe<SystemCatalogIndexResponse>(url, {
        logLabel: "system catalog index fetch failed",
        cache: "no-store",
      });

      if (!data || !Array.isArray(data.items)) return [];
      return data.items;
    },
  };
}
