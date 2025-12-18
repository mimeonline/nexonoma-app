import { ClustersTemplate } from "@/features/grid/templates/Clusters";
import { createNexonomaApi } from "@/services/api";
import type { MacroCluster } from "@/types/grid";
import { notFound } from "next/navigation";

export default async function MacroClusterPage({ params }: PageProps<"/[lang]/grid/[macroClusterSlug]">) {
  const { lang, macroClusterSlug } = await params;

  const api = createNexonomaApi(lang);

  let macroCluster: MacroCluster;

  try {
    macroCluster = await api.getClusters(macroClusterSlug);
  } catch (error) {
    console.error("Failed to load macro cluster:", error);
    notFound();
  }

  if (!macroCluster) notFound();

  return <ClustersTemplate macroCluster={macroCluster} />;
}
