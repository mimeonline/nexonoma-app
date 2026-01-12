import { SegmentsTemplate } from "@/features/grid/templates/Segments";
import { serverLogger } from "@/lib/server-logger";
import { ApiError } from "@/services/apiUtils";
import { createGridApi } from "@/services/gridApi";
import type { ClusterView, MacroCluster } from "@/types/grid";
import { AssetType } from "@/types/nexonoma";
import { notFound } from "next/navigation";

export default async function ClusterDetailPage({ params }: PageProps<"/[lang]/grid/[macroClusterSlug]/[clusterSlug]">) {
  const { lang, macroClusterSlug, clusterSlug } = await params;

  const api = createGridApi(lang);

  let response: ClusterView | null = null;

  try {
    response = await api.getClusterView(clusterSlug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      response = {
        cluster: {
          id: "empty",
          name: clusterSlug.charAt(0).toUpperCase() + clusterSlug.slice(1).replace(/-/g, " "),
          slug: clusterSlug,
          type: AssetType.CLUSTER,
          shortDescription: "",
          longDescription: "",
          segments: [],
        },
        segments: [],
      };
    } else {
      serverLogger.error("Failed to load cluster", { error });
      notFound();
    }
  }

  if (!response) notFound();

  const cluster = {
    ...response.cluster,
    segments: response.segments ?? [],
  };
  const macroCluster: MacroCluster = {
    id: "context-only",
    slug: macroClusterSlug,
    name: macroClusterSlug.charAt(0).toUpperCase() + macroClusterSlug.slice(1).replace(/-/g, " "),
    type: AssetType.MACRO_CLUSTER,
    shortDescription: "",
    longDescription: "",
    children: [],
  };

  return <SegmentsTemplate macroCluster={macroCluster} cluster={cluster} />;
}
