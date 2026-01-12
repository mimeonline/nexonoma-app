import { MacroClusterTemplate } from "@/features/grid/templates/MacroCluster"; // Umbenannt für Konsistenz (s.u.)
import { createGridApi } from "@/services/gridApi";

export default async function GridPage({ params }: PageProps<"/[lang]/grid">) {
  const { lang } = await params;
  const api = createGridApi(lang);
  const macroClusters = await api.getOverview();

  return <MacroClusterTemplate macroClusters={macroClusters} />;
}
