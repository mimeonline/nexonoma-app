import { Segments } from "@/features/grid/templates/Segments";
import { NexonomaApi } from "@/services/api";
import type { GridNode } from "@/types/nexonoma";
import type { Cluster, MacroCluster, Segment, SegmentContentItem, SegmentContentType } from "@/types/grid";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ macroClusterSlug: string; clusterSlug: string }> | { macroClusterSlug: string; clusterSlug: string };
};

function mapCluster(node: GridNode, macroClusterSlug: string): { cluster: Cluster; macroCluster: MacroCluster } {
  const segments: Segment[] = (node.children ?? []).map((segment) => {
    const contentItems = segment.children ?? [];
    const mapByType = (type: SegmentContentType) =>
      contentItems
        .filter((item) => item.type === type)
        .map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          type: item.type as SegmentContentType,
          shortDescription: item.shortDescription,
          longDescription: item.longDescription,
        } satisfies SegmentContentItem));

    return {
      id: segment.id,
      name: segment.name,
      slug: segment.slug,
      type: "segment",
      shortDescription: segment.shortDescription,
      longDescription: segment.longDescription ?? segment.shortDescription,
      content: {
        methods: mapByType("method"),
        concepts: mapByType("concept"),
        tools: mapByType("tool"),
        technologies: mapByType("technology"),
      },
    } satisfies Segment;
  });

  const cluster: Cluster = {
    id: node.id,
    name: node.name,
    slug: node.slug,
    type: "cluster",
    shortDescription: node.shortDescription,
    longDescription: node.longDescription ?? node.shortDescription,
    segments,
  } satisfies Cluster;

  const macroCluster: MacroCluster = {
    id: `${macroClusterSlug}-placeholder`,
    name: macroClusterSlug,
    slug: macroClusterSlug,
    type: "macroCluster",
    shortDescription: "",
    longDescription: "",
    clusters: [cluster],
  } satisfies MacroCluster;

  return { cluster, macroCluster };
}

export default async function ClusterDetailPage({ params }: PageProps) {
  const { macroClusterSlug, clusterSlug } = await params;

  let clusterNode: GridNode | null = null;

  try {
    clusterNode = await NexonomaApi.getSegments(clusterSlug);
  } catch (error) {
    console.error("Failed to load cluster", error);
    return notFound();
  }

  if (!clusterNode) return notFound();

  const { cluster, macroCluster } = mapCluster(clusterNode, macroClusterSlug);

  return <Segments macroCluster={macroCluster} cluster={cluster} />;
}
