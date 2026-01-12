import type { CatalogContentType, CatalogItem, ContentDetail } from "@/types/catalog";
import { fetchJson, getApiBase } from "./apiUtils";

export function createCatalogApi(lang: string) {
  const baseUrl = getApiBase();

  const getCatalog = async (): Promise<CatalogItem[]> => {
    const url = `${baseUrl}/catalog?lang=${lang}`;
    return fetchJson(url, { errorLabel: "Failed to fetch catalog" });
  };

  const getContentDetail = async (id: string): Promise<ContentDetail> => {
    const url = `${baseUrl}/catalog/${id}?lang=${lang}`;
    return fetchJson(url, { errorLabel: `Failed to fetch catalog detail for ID: ${id}` });
  };

  const getContentBySlug = async (type: CatalogContentType | string, slug: string): Promise<ContentDetail> => {
    const slugUrl = `${baseUrl}/catalog/${type}/${slug}?lang=${lang}`;
    const res = await fetch(slugUrl, { cache: "no-store" });
    if (res.ok) return res.json();

    if (res.status === 404) {
      const catalog = await getCatalog();
      const match = catalog.find(
        (item) => (item.type?.toString().toLowerCase() ?? "") === type && (item.slug?.toString().toLowerCase() ?? "") === slug
      );
      if (match?.id) return getContentDetail(match.id);
    }

    const statusText = res.statusText || "Unknown";
    throw new Error(`Failed to fetch content for type '${type}' and slug '${slug}' (${res.status} ${statusText})`);
  };

  return {
    getCatalog,
    getContentDetail,
    getContentBySlug,
  };
}
