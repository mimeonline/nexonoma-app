import type { CatalogContentType, CatalogItem, ContentDetail } from "@/types/catalog";
import type { Cluster, MacroCluster } from "@/types/grid"; // Import aus grid.ts

function getApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  return apiBase;
}

export function createNexonomaApi(lang: string) {
  return {
    async getMacroClusters(): Promise<MacroCluster[]> {
      const res = await fetch(`${getApiBase()}/grid/macros?lang=${lang}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch macros");
      return res.json();
    },

    async getClusters(macroSlug: string): Promise<MacroCluster> {
      const res = await fetch(`${getApiBase()}/grid/macros/${macroSlug}/clusters?lang=${lang}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch clusters for macro: ${macroSlug}`);
      return res.json();
    },

    async getSegments(clusterSlug: string): Promise<Cluster> {
      const res = await fetch(`${getApiBase()}/grid/clusters/${clusterSlug}/segments?lang=${lang}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch segments for cluster: ${clusterSlug}`);
      return res.json();
    },

    async getCatalog(): Promise<CatalogItem[]> {
      const res = await fetch(`${getApiBase()}/catalog?lang=${lang}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch catalog");
      return res.json();
    },

    async getContentDetail(id: string): Promise<ContentDetail> {
      const res = await fetch(`${getApiBase()}/catalog/${id}?lang=${lang}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch detail for ID: ${id}`);
      return res.json();
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
