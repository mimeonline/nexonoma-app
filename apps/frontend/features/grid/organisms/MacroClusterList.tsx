import { Badge } from "@/components/ui/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import type { GridNode } from "@/types/nexonoma";
import Link from "next/link";

type Props = {
  macroClusters: GridNode[];
};

export function MacroClusterList({ macroClusters }: Props) {
  const hasMacroClusters = macroClusters && macroClusters.length > 0;

  if (!hasMacroClusters) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
        <p className="text-sm text-nexo-muted">Keine Wissensbereiche verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {macroClusters.map((cluster) => {
        const clusterCount = cluster.children?.length || 0;

        return (
          <Link key={cluster.slug} href={`/grid/${cluster.slug}`} className="block">
            <Card variant="interactive" className="h-full min-h-[180px] flex flex-col">
              <CardHeader className="space-y-0 pb-3">
                <div className="flex items-start justify-between gap-4">
                  {/* Title: min-h ensures alignment, line-clamp limits rows */}
                  <CardTitle className="text-xl group-hover:text-nexo-ocean transition-colors duration-300 min-h-14 flex items-start leading-tight">
                    <span className="line-clamp-2">{cluster.name}</span>
                  </CardTitle>

                  <Badge variant="ocean" size="md">
                    {clusterCount} Cluster
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="mt-auto">
                <p className="text-sm text-nexo-muted leading-relaxed line-clamp-3">{cluster.shortDescription || "Keine Beschreibung verfügbar."}</p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
