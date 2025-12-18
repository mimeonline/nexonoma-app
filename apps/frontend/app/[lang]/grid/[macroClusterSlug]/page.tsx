import { ClustersTemplate } from "@/features/grid/templates/Clusters"; // Suffix Import
import { NexonomaApi } from "@/services/api";
import type { MacroCluster } from "@/types/grid";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ macroClusterSlug: string }>;
};

export default async function MacroClusterPage({ params }: PageProps) {
  const { macroClusterSlug } = await params;

  let macroCluster: MacroCluster | null = null;

  try {
    // API gibt jetzt MacroCluster zurück
    macroCluster = await NexonomaApi.getClusters(macroClusterSlug);
  } catch (error) {
    console.error("Failed to load macro cluster:", error);
    return notFound();
  }

  if (!macroCluster) return notFound();

  return <ClustersTemplate macroCluster={macroCluster} />;
}
