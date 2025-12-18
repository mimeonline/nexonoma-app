"use client";

import { Badge } from "@/components/ui/atoms/Badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Cluster } from "@/types/grid";

type Props = {
  clusters: Cluster[];
  parentSlug: string; // Wichtig für den Link-Pfad (/grid/macro/cluster)
};

export function ClusterList({ clusters, parentSlug }: Props) {
  const { t } = useI18n();
  const hasClusters = clusters && clusters.length > 0;

  if (!hasClusters) {
    return (
      <div className="col-span-full flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
        <p className="text-sm text-nexo-muted">{t("grid.clusters.empty")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {clusters.map((cluster) => {
        const segmentCount = cluster.segments?.length || 0;
        const initial = cluster.name.charAt(0).toUpperCase();

        return (
          <Link key={cluster.slug} href={`/grid/${parentSlug}/${cluster.slug}`} className="block group">
            <Card variant="interactive" className="h-full min-h-[220px] flex flex-col justify-between">
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-xl font-bold text-nexo-ocean group-hover:bg-nexo-ocean/10 group-hover:border-nexo-ocean/20 transition-colors shadow-inner">
                  {initial}
                </div>

                <Badge variant="ocean" size="md">
                  {segmentCount} {segmentCount === 1 ? t("grid.labels.segment") : t("grid.labels.segments")}
                </Badge>
              </CardHeader>

              <CardContent>
                <CardTitle className="mb-2 text-xl group-hover:text-nexo-ocean transition-colors">{cluster.name}</CardTitle>
                <p className="text-sm text-nexo-muted leading-relaxed line-clamp-2">
                  {cluster.shortDescription || t("grid.clusters.descriptionFallback")}
                </p>
              </CardContent>

              <CardFooter className="pt-4 mt-auto border-t border-white/5">
                <span className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors">
                  {t("grid.actions.explore")}
                  <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
