import { Clusters } from "@/features/grid/templates/Clusters";
import { NexonomaApi } from "@/services/api";
import type { GridNode } from "@/types/nexonoma";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ macroClusterSlug: string }> | { macroClusterSlug: string };
  searchParams?: { q?: string };
};

export default async function MacroClusterPage({ params, searchParams }: PageProps) {
  const { macroClusterSlug } = await params;
  const filterQuery = searchParams?.q ?? "";
  let macroCluster: GridNode | null = null;

  try {
    macroCluster = await NexonomaApi.getClusters(macroClusterSlug);
  } catch (error) {
    console.error("Failed to load macro cluster", error);
    return notFound();
  }

  if (!macroCluster) return notFound();

  return <Clusters macroCluster={macroCluster} filterQuery={filterQuery} />;
}
