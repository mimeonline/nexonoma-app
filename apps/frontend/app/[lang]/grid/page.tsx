import { MacroClusterTemplate } from "@/features/grid/templates/MacroCluster"; // Umbenannt für Konsistenz (s.u.)
import { createNexonomaApi } from "@/services/api";

export default async function GridPage({ params }: PageProps<"/[lang]/grid">) {
  const { lang } = await params;
  const api = createNexonomaApi(lang);
  const macroClusters = await api.getMacroClusters();

  return <MacroClusterTemplate macroClusters={macroClusters} />;
}
