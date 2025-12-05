import { Clusters } from "@/features/grid/templates/Clusters";
import { NexonomaApi } from "@/services/api";
import type { GridNode } from "@/types/nexonoma";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ macroClusterSlug: string }> | { macroClusterSlug: string };
};

export default async function MacroClusterPage({ params }: PageProps) {
  const { macroClusterSlug } = await params;
  let macroCluster: GridNode | null = null;

  try {
    macroCluster = await NexonomaApi.getClusters(macroClusterSlug);
  } catch (error) {
    console.error("Failed to load macro cluster", error);
    return notFound();
  }

  if (!macroCluster) return notFound();

  return <Clusters macroCluster={macroCluster} />;
}
