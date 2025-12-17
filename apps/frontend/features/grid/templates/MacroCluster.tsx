import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import type { MacroCluster } from "@/types/grid";
import { MacroClusterList } from "../organisms/MacroClusterList";

interface MacroClusterTemplateProps {
  macroClusters: MacroCluster[];
}

export function MacroClusterTemplate({ macroClusters }: MacroClusterTemplateProps) {
  return (
    <div className="space-y-12">
      <SectionTitle
        badge="Grid Navigation"
        title="Wissensbereiche"
        description="Die oberste Struktur des Wissensnetzes. Diese Bereiche bündeln verwandte Themen in thematische Räume – von der Strategie über die Architektur bis hin zu User & Kontext."
      />

      <MacroClusterList macroClusters={macroClusters} />
    </div>
  );
}
