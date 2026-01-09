"use client";

import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { MacroCluster } from "@/types/grid";
import Link from "next/link";
import { ClusterList } from "../organisms/ClusterList";

interface ClustersTemplateProps {
  macroCluster: MacroCluster;
}

export function ClustersTemplate({ macroCluster }: ClustersTemplateProps) {
  const { t } = useI18n();
  const clusters = macroCluster.children ?? [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="relative">
        {/* Decorative background layer */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none md:block">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(140%_90%_at_85%_20%,rgba(255,255,255,0.14),transparent_70%),radial-gradient(120%_70%_at_70%_55%,rgba(255,255,255,0.08),transparent_75%),repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_28px),repeating-linear-gradient(180deg,rgba(255,255,255,0.07)_0,rgba(255,255,255,0.07)_1px,transparent_1px,transparent_28px)] [mask-image:linear-gradient(90deg,transparent_0%,transparent_20%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,1)_75%,rgba(0,0,0,1)_100%)]" />
          <div className="absolute left-[72%] top-[28%] h-[3px] w-[3px] rounded-full bg-white/18" />
          <div className="absolute left-[84%] top-[54%] h-[3px] w-[3px] rounded-full bg-white/16" />
          <div className="absolute left-[66%] top-[40%] h-0.5 w-0.5 rounded-full bg-white/16" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Link href="/grid" className="hover:text-white transition-colors">
              {t("grid.segments.breadcrumbs.grid")}
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-nexo-ocean">{macroCluster.name}</span>
          </nav>

          {/* Title */}
          <SectionTitle
            badge={t("grid.clusters.badge")}
            title={macroCluster.name}
            description={macroCluster.longDescription || t("grid.clusters.descriptionFallback")}
            className="mb-0"
          />
        </div>
      </div>

      {/* Grid */}
      <ClusterList clusters={clusters} parentSlug={macroCluster.slug} />
    </div>
  );
}
