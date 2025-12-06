import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MacroCluster } from "@/types/grid";

type Props = {
  macroCluster: MacroCluster;
};

export function ClusterList({ macroCluster }: Props) {
  const clusters = macroCluster.clusters ?? [];

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {clusters.map((cluster) => {
        const segmentCount = (cluster.segments ?? []).length;
        return (
          <Card
            key={cluster.slug}
            className="border border-white/10 bg-nexo-surface text-white shadow-md shadow-black/20 transition hover:border-cyan-400"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{cluster.name}</CardTitle>
              <p className="text-xs text-slate-300">{cluster.shortDescription}</p>
            </CardHeader>
            <CardContent className="flex justify-between pt-0 text-sm text-slate-200/80">
              <span>{segmentCount} Segmente</span>
              <Link href={`/grid/${macroCluster.slug}/${cluster.slug}`} className="font-semibold text-nexo-aqua hover:underline">
                Öffnen
              </Link>
            </CardContent>
          </Card>
        );
      })}
      {clusters.length === 0 && <p className="text-sm text-slate-200/75">Keine Cluster vorhanden.</p>}
    </div>
  );
}
