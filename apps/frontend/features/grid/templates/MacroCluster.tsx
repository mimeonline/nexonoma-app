import type { GridNode } from "@/types/nexonoma";

import { MacroClusterList } from "../organisms/MacroClusterList";

interface MacroClusterProps {
  macroClusters: GridNode[];
}

export function MacroCluster({ macroClusters }: MacroClusterProps) {
  return (
    <>
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">Wissensbereiche</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Grid: Makro-Cluster, Cluster und Segmente</h1>
        <div className="h-px w-full bg-white/10 my-4" />
        <p className="max-w-3xl text-base text-gray-300">
          Wähle einen Makro-Cluster, öffne die Cluster im Accordion und wechsle auf die Segmentseiten.
        </p>
      </header>

      <MacroClusterList macroClusters={macroClusters} />
    </>
  );
}
