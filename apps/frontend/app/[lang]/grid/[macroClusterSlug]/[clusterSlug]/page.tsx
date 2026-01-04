import { SegmentsTemplate } from "@/features/grid/templates/Segments";
import { createParentContext, mapToClusterDetail } from "@/features/grid/utils/segmentMapper";
import { serverLogger } from "@/lib/server-logger";
import { ApiError, createNexonomaApi } from "@/services/api";
import { AssetType } from "@/types/nexonoma";
import { notFound } from "next/navigation";

export default async function ClusterDetailPage({ params }: PageProps<"/[lang]/grid/[macroClusterSlug]/[clusterSlug]">) {
  const { lang, macroClusterSlug, clusterSlug } = await params;

  const api = createNexonomaApi(lang);

  let rawData: unknown;

  try {
    rawData = await api.getSegments(clusterSlug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      rawData = {
        id: "empty",
        name: clusterSlug.charAt(0).toUpperCase() + clusterSlug.slice(1).replace(/-/g, " "),
        slug: clusterSlug,
        type: AssetType.CLUSTER,
        shortDescription: "",
        longDescription: "",
        segments: [],
      };
    } else {
      serverLogger.error("Failed to load cluster", { error });
      notFound();
    }
  }

  if (!rawData) notFound();

  const cluster = mapToClusterDetail(rawData);
  const macroCluster = createParentContext(macroClusterSlug);

  return <SegmentsTemplate macroCluster={macroCluster} cluster={cluster} />;
}
