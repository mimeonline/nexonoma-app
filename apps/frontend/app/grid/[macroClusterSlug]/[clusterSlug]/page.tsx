import { SegmentsTemplate } from "@/features/grid/templates/Segments";
import { createParentContext, mapToClusterDetail } from "@/features/grid/utils/segmentMapper";
import { NexonomaApi } from "@/services/api";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ macroClusterSlug: string; clusterSlug: string }>;
};

export default async function ClusterDetailPage({ params }: PageProps) {
  const { macroClusterSlug, clusterSlug } = await params;

  let rawData = null;

  try {
    // 1. Fetch raw data (Wir wissen, api.ts gibt hier Cluster zurück,
    // aber das Mapping stellt sicher, dass alles für die View sitzt)
    rawData = await NexonomaApi.getSegments(clusterSlug);
  } catch (error) {
    console.error("Failed to load cluster", error);
    return notFound();
  }

  if (!rawData) return notFound();

  // 2. Map Data
  const cluster = mapToClusterDetail(rawData);

  // 3. Create Parent Context (für Breadcrumbs)
  const macroCluster = createParentContext(macroClusterSlug);

  // 4. Render Template
  return <SegmentsTemplate macroCluster={macroCluster} cluster={cluster} />;
}
