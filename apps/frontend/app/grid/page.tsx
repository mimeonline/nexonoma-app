import { MacroCluster } from "@/features/grid/templates/MacroCluster";
import { NexonomaApi } from "@/services/api";
import type { GridNode } from "@/types/nexonoma";

export default async function GridPage() {
  const macroClusters: GridNode[] = await NexonomaApi.getMacroClusters();

  return <MacroCluster macroClusters={macroClusters} />;
}
