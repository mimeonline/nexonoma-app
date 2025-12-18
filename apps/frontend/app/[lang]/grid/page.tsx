import { MacroClusterTemplate } from "@/features/grid/templates/MacroCluster"; // Umbenannt für Konsistenz (s.u.)
import { NexonomaApi } from "@/services/api";

export default async function GridPage() {
  const macroClusters = await NexonomaApi.getMacroClusters();

  return <MacroClusterTemplate macroClusters={macroClusters} />;
}
