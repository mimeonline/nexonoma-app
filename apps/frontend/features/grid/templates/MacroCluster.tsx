import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import type { GridNode } from "@/types/nexonoma"; // Passe den Pfad ggf. an
import { MacroClusterList } from "../organisms/MacroClusterList";

interface MacroClusterProps {
  macroClusters: GridNode[];
}

export function MacroCluster({ macroClusters }: MacroClusterProps) {
  return (
    <div className="space-y-12">
      {/* Header Bereich basierend auf bereiche.pdf */}
      <SectionTitle
        badge="Grid Navigation"
        title="Wissensbereiche"
        description="Die oberste Struktur des Wissensnetzes. Diese Bereiche bündeln verwandte Themen in thematische Räume – von der Strategie über die Architektur bis hin zu User & Kontext."
      />

      {/* Die Liste der Karten */}
      <MacroClusterList macroClusters={macroClusters} />
    </div>
  );
}
