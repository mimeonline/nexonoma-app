"use client";

import { Badge } from "@/components/ui/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { MacroCluster } from "@/types/grid";
import Link from "next/link";

type Props = {
  macroClusters: MacroCluster[];
};

export function MacroClusterList({ macroClusters }: Props) {
  const { t } = useI18n();
  const hasMacroClusters = macroClusters && macroClusters.length > 0;

  if (!hasMacroClusters) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5">
        <p className="text-sm text-nexo-muted">{t("grid.macro.empty")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {macroClusters.map((macro) => {
        const clusterCount = macro.clusters?.length || 0;

        return (
          <Link key={macro.slug} href={`/grid/${macro.slug}`} className="block group">
            <Card variant="interactive" className="h-full min-h-[180px] flex flex-col">
              <CardHeader className="space-y-0 pb-3">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl group-hover:text-nexo-ocean transition-colors duration-300 min-h-14 flex items-start leading-tight">
                    <span className="line-clamp-2">{macro.name}</span>
                  </CardTitle>

                  <Badge variant="ocean" size="md">
                    {clusterCount} {clusterCount === 1 ? t("grid.labels.cluster") : t("grid.labels.clusters")}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="mt-auto">
                <p className="text-sm text-nexo-muted leading-relaxed line-clamp-3">
                  {macro.shortDescription || t("grid.clusters.descriptionFallback")}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
