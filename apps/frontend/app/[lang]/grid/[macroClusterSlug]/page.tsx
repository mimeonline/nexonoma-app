import { ClustersTemplate } from "@/features/grid/templates/Clusters";
import { serverLogger } from "@/lib/server-logger";
import { createGridApi } from "@/services/gridApi";
import { MacroClusterView } from "@/types/grid";
import { notFound } from "next/navigation";

export default async function MacroClusterPage({ params }: PageProps<"/[lang]/grid/[macroClusterSlug]">) {
  const { lang, macroClusterSlug } = await params;

  const api = createGridApi(lang);

  let macroClusterView: MacroClusterView;

  try {
    macroClusterView = await api.getMacroClusterView(macroClusterSlug);
  } catch (error) {
    serverLogger.error("Failed to load macro cluster", { error });
    notFound();
  }

  if (!macroClusterView) notFound();

  return <ClustersTemplate macroClusterView={macroClusterView} />;
}
