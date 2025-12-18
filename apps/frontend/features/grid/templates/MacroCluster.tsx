"use client";

import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { MacroCluster } from "@/types/grid";
import { MacroClusterList } from "../organisms/MacroClusterList";

interface MacroClusterTemplateProps {
  macroClusters: MacroCluster[];
}

export function MacroClusterTemplate({ macroClusters }: MacroClusterTemplateProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-12">
      <SectionTitle badge={t("grid.macro.badge")} title={t("grid.macro.title")} description={t("grid.macro.description")} />
      <MacroClusterList macroClusters={macroClusters} />
    </div>
  );
}
