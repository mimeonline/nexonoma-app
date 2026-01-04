import { mapToCatalogItem } from "@/features/catalog/utils/catalogMapper";
import type { CatalogItem } from "@/types/catalog";
import { AssetStatus } from "@/types/nexonoma";

export type IndexableCatalogEntry = {
  id: string;
  slug: string;
  type: string;
  updatedAt?: string;
  createdAt?: string;
  availableLanguages: string[];
};

const getApiBase = () => {
  const apiBase = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return apiBase;
};

const fetchCatalogForLocale = async (lang: string): Promise<CatalogItem[]> => {
  try {
    const res = await fetch(`${getApiBase()}/catalog?lang=${lang}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return [];
    }

    const rawData: unknown = await res.json();
    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData.map(mapToCatalogItem).filter((item) => item.slug && item.type);
  } catch {
    return [];
  }
};

export const getIndexableCatalogEntries = async (
  locales: readonly string[],
  options?: { includeReview?: boolean }
): Promise<IndexableCatalogEntry[]> => {
  const includeReview = options?.includeReview ?? false;
  const entries = new Map<string, { entry: IndexableCatalogEntry; locales: Set<string> }>();

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
