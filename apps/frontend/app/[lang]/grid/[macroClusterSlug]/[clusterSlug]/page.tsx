import { SegmentsTemplate } from "@/features/grid/templates/Segments";
import { createParentContext, mapToClusterDetail } from "@/features/grid/utils/segmentMapper";
import { createNexonomaApi } from "@/services/api";
import { notFound } from "next/navigation";

export default async function ClusterDetailPage({ params }: PageProps<"/[lang]/grid/[macroClusterSlug]/[clusterSlug]">) {
  const { lang, macroClusterSlug, clusterSlug } = await params;

  const api = createNexonomaApi(lang);

  let rawData: unknown;

  try {
    rawData = await api.getSegments(clusterSlug);
  } catch (error) {
    console.error("Failed to load cluster", error);
    notFound();
  }

  if (!rawData) notFound();

  const cluster = mapToClusterDetail(rawData);
  const macroCluster = createParentContext(macroClusterSlug);

  return <SegmentsTemplate macroCluster={macroCluster} cluster={cluster} />;
}
