import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MacroCluster } from "@/types/grid";
import Link from "next/link";

type Props = {
  macroCluster: MacroCluster;
};

export function ClusterList({ macroCluster }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {macroCluster.clusters.map((cluster) => (
        <Card
          key={cluster.slug}
          className="border border-white/10 bg-[#0B1220] text-white shadow-md shadow-black/20 transition hover:border-cyan-400"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{cluster.name}</CardTitle>
            <p className="text-xs text-slate-300">{cluster.shortDescription}</p>
          </CardHeader>
          <CardContent className="flex justify-between pt-0 text-sm text-slate-200/80">
            <span>{cluster.segments.length} Segmente</span>
            <Link
              href={`/grid/${macroCluster.slug}/${cluster.slug}`}
              className="font-semibold text-[#4FF4E0] hover:underline"
            >
              Öffnen
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
