"use client";

import { Badge } from "@/components/ui/atoms/Badge";
import { Button } from "@/components/ui/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { MacroCluster } from "@/types/grid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  macroClusters: MacroCluster[];
};

export function MacroClusterList({ macroClusters }: Props) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.match(/^\/(de|en)(\/|$)/)?.[1];
  const localePrefix = locale ? `/${locale}` : "";
  const hasMacroClusters = macroClusters && macroClusters.length > 0;

  if (!hasMacroClusters) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center">
        <p className="text-sm font-semibold text-slate-100">{t("emptyStates.curated.title")}</p>
        <p className="text-sm text-nexo-muted">{t("emptyStates.curated.line1")}</p>
        <p className="text-sm text-nexo-muted">{t("emptyStates.curated.line2")}</p>
        <Button variant="secondary" onClick={() => router.push(`${localePrefix}/catalog`)}>
          {t("emptyStates.curated.actionCatalog")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {macroClusters.map((macro) => {
        const clusterCount = macro.childrenCount || 0;

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
