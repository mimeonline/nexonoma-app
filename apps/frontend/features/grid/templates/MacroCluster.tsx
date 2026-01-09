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
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none md:block">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(140%_90%_at_85%_20%,rgba(255,255,255,0.14),transparent_70%),radial-gradient(120%_70%_at_70%_55%,rgba(255,255,255,0.08),transparent_75%),repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_28px),repeating-linear-gradient(180deg,rgba(255,255,255,0.07)_0,rgba(255,255,255,0.07)_1px,transparent_1px,transparent_28px)] [mask-image:linear-gradient(90deg,transparent_0%,transparent_20%,rgba(0,0,0,0.5)_45%,rgba(0,0,0,1)_70%,rgba(0,0,0,1)_100%)]" />
          <div className="absolute left-[70%] top-[28%] h-[3px] w-[3px] rounded-full bg-white/20" />
          <div className="absolute left-[82%] top-[56%] h-[3px] w-[3px] rounded-full bg-white/18" />
          <div className="absolute left-[62%] top-[42%] h-0.5 w-0.5 rounded-full bg-white/18" />
        </div>
        <div className="relative z-10">
          <SectionTitle badge={t("grid.macro.badge")} title={t("grid.macro.title")} description={t("grid.macro.description")} />
        </div>
      </div>
      <MacroClusterList macroClusters={macroClusters} />
    </div>
  );
}
