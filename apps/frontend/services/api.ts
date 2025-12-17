import type { CatalogContentType, CatalogItem, ContentDetail } from "@/types/catalog";
import type { Cluster, MacroCluster } from "@/types/grid"; // Import aus grid.ts

const API_BASE = "http://localhost:3001";

export const NexonomaApi = {
  // --- PAGE 1: Alle Macro Cluster ---
  async getMacroClusters(): Promise<MacroCluster[]> {
    const res = await fetch(`${API_BASE}/grid/macros`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch macros");
    return res.json();
  },

  // --- PAGE 2: Cluster in einem Macro ---
  async getClusters(macroSlug: string): Promise<MacroCluster> {
    // Gibt vermutlich das Macro-Objekt inkl. seiner Cluster zurück
    const res = await fetch(`${API_BASE}/grid/macros/${macroSlug}/clusters`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch clusters for macro: ${macroSlug}`);
    return res.json();
  },

  // --- PAGE 3: Segmente & Content in einem Cluster ---
  async getSegments(clusterSlug: string): Promise<Cluster> {
    // Gibt das Cluster-Objekt inkl. Segmente zurück
    const res = await fetch(`${API_BASE}/grid/clusters/${clusterSlug}/segments`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch segments for cluster: ${clusterSlug}`);
    return res.json();
  },

  // ... (Katalog Methoden bleiben gleich) ...
  async getCatalog(): Promise<CatalogItem[]> {
    const res = await fetch(`${API_BASE}/catalog`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch catalog");
    return res.json();
  },

  async getContentDetail(id: string): Promise<ContentDetail> {
    const res = await fetch(`${API_BASE}/catalog/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch detail for ID: ${id}`);
    return res.json();
  },

  async getContentBySlug(type: CatalogContentType | string, slug: string): Promise<ContentDetail> {
    const slugUrl = `${API_BASE}/catalog/${type}/${slug}`;
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
