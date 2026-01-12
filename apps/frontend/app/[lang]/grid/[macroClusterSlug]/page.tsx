import { ClustersTemplate } from "@/features/grid/templates/Clusters";
import { serverLogger } from "@/lib/server-logger";
import { createNexonomaApi } from "@/services/api";
import { MacroClusterView } from "@/types/grid";
import { notFound } from "next/navigation";

export default async function MacroClusterPage({ params }: PageProps<"/[lang]/grid/[macroClusterSlug]">) {
  const { lang, macroClusterSlug } = await params;

  const api = createNexonomaApi(lang);

  let macroClusterView: MacroClusterView;

  try {
    macroClusterView = await api.getClusters(macroClusterSlug);
  } catch (error) {
    serverLogger.error("Failed to load macro cluster", { error });
    notFound();
  }

  if (!macroClusterView) notFound();

  return <ClustersTemplate macroClusterView={macroClusterView} />;
}
