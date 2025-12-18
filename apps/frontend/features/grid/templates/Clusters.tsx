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
      {/* --- HEADER SECTION --- */}
      <div className="space-y-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Link href="/grid" className="hover:text-white transition-colors">
            {t("grid.segments.breadcrumbs.grid")}
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-nexo-ocean">{macroCluster.name}</span>
        </nav>

        {/* Title & Context */}
        <SectionTitle
          badge={t("grid.clusters.badge")}
          title={macroCluster.name}
          description={macroCluster.shortDescription || t("grid.clusters.description")}
          className="mb-0"
        />
      </div>

      {/* --- GRID SECTION (via Organism) --- */}
      <ClusterList clusters={clusters} parentSlug={macroCluster.slug} />
    </div>
  );
}
