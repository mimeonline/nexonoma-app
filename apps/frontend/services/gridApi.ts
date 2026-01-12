import type { ClusterView, MacroCluster, MacroClusterView } from "@/types/grid";
import { fetchJson, getApiBase } from "./apiUtils";

const isBrowser = typeof window !== "undefined";

const getGridBase = () => {
  if (isBrowser) return "";
  return getApiBase();
};

export function createGridApi(lang: string) {
  const baseUrl = getGridBase();

  return {
    async getOverview(): Promise<MacroCluster[]> {
      const url = isBrowser ? `${baseUrl}/api/grid/overview?lang=${lang}` : `${baseUrl}/grid/overview?lang=${lang}`;
      return fetchJson(url, { errorLabel: "Failed to fetch grid overview" });
    },

    async getMacroClusterView(macroSlug: string): Promise<MacroClusterView> {
      const url = isBrowser
        ? `${baseUrl}/api/grid/macro-clusters/${macroSlug}?lang=${lang}`
        : `${baseUrl}/grid/macroclusters/${macroSlug}?lang=${lang}`;
      return fetchJson(url, { errorLabel: `Failed to fetch macrocluster view for slug: ${macroSlug}` });
    },

    async getClusterView(clusterSlug: string): Promise<ClusterView> {
      const url = isBrowser
        ? `${baseUrl}/api/grid/clusters/${clusterSlug}?lang=${lang}`
        : `${baseUrl}/grid/clusters/${clusterSlug}?lang=${lang}`;
      return fetchJson(url, { errorLabel: `Failed to fetch cluster view for slug: ${clusterSlug}` });
    },
  };
}
