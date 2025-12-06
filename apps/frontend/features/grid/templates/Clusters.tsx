import { Badge } from "@/components/ui/atoms/Badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import type { GridNode } from "@/types/nexonoma";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ClustersProps {
  macroCluster: GridNode;
}

export function Clusters({ macroCluster }: ClustersProps) {
  const clusters: GridNode[] = macroCluster.children ?? [];

  return (
    <div className="space-y-10">
      {/* --- HEADER SECTION --- */}
      <div className="space-y-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Link href="/grid" className="hover:text-white transition-colors">
            Grid
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-nexo-ocean">{macroCluster.name}</span>
        </nav>

        {/* Title & Context */}
        <SectionTitle
          badge="Themen-Cluster"
          title={macroCluster.name}
          description={
            macroCluster.longDescription ||
            macroCluster.shortDescription ||
            "Erkunde die spezifischen Themengebiete innerhalb dieses Wissensbereichs."
          }
          className="mb-0"
        />
      </div>

      {/* --- GRID SECTION --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clusters.map((cluster) => {
          // Meta-Daten berechnen
          const segmentCount = cluster.children?.length || 0;
          const initial = cluster.name.charAt(0).toUpperCase();

          return (
            <Link key={cluster.slug} href={`/grid/${macroCluster.slug}/${cluster.slug}`} passHref>
              <Card variant="interactive" className="h-full min-h-[220px] flex flex-col justify-between group">
                <CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
                  {/* Visual: Initial Letter Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-xl font-bold text-nexo-ocean group-hover:bg-nexo-ocean/10 group-hover:border-nexo-ocean/20 transition-colors shadow-inner">
                    {initial}
                  </div>

                  <Badge variant="ocean" size="md">
                    {segmentCount} {segmentCount === 1 ? "Segment" : "Segmente"}
                  </Badge>
                </CardHeader>

                <CardContent>
                  <CardTitle className="mb-2 text-xl group-hover:text-nexo-ocean transition-colors">{cluster.name}</CardTitle>
                  <p className="text-sm text-nexo-muted leading-relaxed line-clamp-2">
                    {cluster.shortDescription || "Keine Beschreibung verfügbar."}
                  </p>
                </CardContent>

                <CardFooter className="pt-4 mt-auto border-t border-white/5">
                  <span className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors">
                    Erkunden
                    <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          );
        })}

        {/* Empty State */}
        {clusters.length === 0 && (
          <div className="col-span-full flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
            <p className="text-sm text-nexo-muted">In diesem Bereich sind aktuell noch keine Cluster hinterlegt.</p>
          </div>
        )}
      </div>
    </div>
  );
}
