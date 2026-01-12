import type { CatalogContentType, CatalogItem, ContentDetail } from "@/types/catalog";
import type { ClusterView, MacroCluster, MacroClusterView } from "@/types/grid"; // Import aus grid.ts

export class ApiError extends Error {
  status: number;
  url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.status = status;
    this.url = url;
  }
}

function getApiBase() {
  const isServer = typeof window === "undefined";
  const apiBase = isServer ? (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL) : process.env.NEXT_PUBLIC_API_URL;

  if (!apiBase) {
    throw new Error(isServer ? "API_INTERNAL_URL is not set" : "NEXT_PUBLIC_API_URL is not set");
  }

  return apiBase;
}

async function fetchJson<T>(url: string, errorLabel: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const statusText = res.statusText || "Unknown";
    throw new ApiError(`${errorLabel} (${res.status} ${statusText}) at ${url}`, res.status, url);
  }
  return res.json() as Promise<T>;
}

export function createNexonomaApi(lang: string) {
  return {
    async getMacroClusters(): Promise<MacroCluster[]> {
      const url = `${getApiBase()}/grid/overview?lang=${lang}`;
      return fetchJson(url, "Failed to fetch macros");
    },

    async getClusters(macroSlug: string): Promise<MacroClusterView> {
      const url = `${getApiBase()}/grid/macroclusters/${macroSlug}?lang=${lang}`;
      return fetchJson(url, `Failed to fetch clusters for macro: ${macroSlug}`);
    },

    async getSegments(clusterSlug: string): Promise<ClusterView> {
      const url = `${getApiBase()}/grid/clusters/${clusterSlug}?lang=${lang}`;
      return fetchJson(url, `Failed to fetch segments for cluster: ${clusterSlug}`);
    },

    async getCatalog(): Promise<CatalogItem[]> {
      const url = `${getApiBase()}/catalog?lang=${lang}`;
      return fetchJson(url, "Failed to fetch catalog");
    },

    async getContentDetail(id: string): Promise<ContentDetail> {
      const url = `${getApiBase()}/catalog/${id}?lang=${lang}`;
      return fetchJson(url, `Failed to fetch detail for ID: ${id}`);
    },

    async getContentBySlug(type: CatalogContentType | string, slug: string): Promise<ContentDetail> {
      const slugUrl = `${getApiBase()}/catalog/${type}/${slug}?lang=${lang}`;
      const res = await fetch(slugUrl, { cache: "no-store" });
      if (res.ok) return res.json();

      if (res.status === 404) {
        const catalog = await this.getCatalog();
        const match = catalog.find(
          (item) => (item.type?.toString().toLowerCase() ?? "") === type && (item.slug?.toString().toLowerCase() ?? "") === slug
        );
        if (match?.id) return this.getContentDetail(match.id);
      }
      throw new Error(`Failed to fetch content for type '${type}' and slug '${slug}'`);
    },
  };
}
