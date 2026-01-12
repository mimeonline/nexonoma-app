import type { ClusterView, MacroCluster, MacroClusterView } from "@/types/grid";
import { fetchJson, getApiBase } from "./apiUtils";

export function createGridApi(lang: string) {
  const baseUrl = getApiBase();

  return {
    async getOverview(): Promise<MacroCluster[]> {
      const url = `${baseUrl}/grid/overview?lang=${lang}`;
      return fetchJson(url, { errorLabel: "Failed to fetch grid overview" });
    },

    async getMacroClusterView(macroSlug: string): Promise<MacroClusterView> {
      const url = `${baseUrl}/grid/macroclusters/${macroSlug}?lang=${lang}`;
      return fetchJson(url, { errorLabel: `Failed to fetch macrocluster view for slug: ${macroSlug}` });
    },

    async getClusterView(clusterSlug: string): Promise<ClusterView> {
      const url = `${baseUrl}/grid/clusters/${clusterSlug}?lang=${lang}`;
      return fetchJson(url, { errorLabel: `Failed to fetch cluster view for slug: ${clusterSlug}` });
    },
  };
}
