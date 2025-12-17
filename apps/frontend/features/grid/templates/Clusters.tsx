import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import type { MacroCluster } from "@/types/grid";
import Link from "next/link";
import { ClusterList } from "../organisms/ClusterList";

interface ClustersTemplateProps {
  macroCluster: MacroCluster;
}

export function ClustersTemplate({ macroCluster }: ClustersTemplateProps) {
  // Zugriff auf 'clusters' statt 'children'
  const clusters = macroCluster.clusters ?? [];

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
          description={macroCluster.shortDescription || "Erkunde die spezifischen Themengebiete innerhalb dieses Wissensbereichs."}
          className="mb-0"
        />
      </div>

      {/* --- GRID SECTION (via Organism) --- */}
      <ClusterList clusters={clusters} parentSlug={macroCluster.slug} />
    </div>
  );
}
