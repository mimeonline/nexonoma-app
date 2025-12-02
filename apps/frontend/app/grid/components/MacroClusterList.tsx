import type { MacroCluster } from "@/types/grid";
import Link from "next/link";

type Props = {
  macroClusters: MacroCluster[];
};

export function MacroClusterList({ macroClusters }: Props) {
  const hasMacroClusters = macroClusters.length > 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {macroClusters.map((macroCluster) => (
          <Link
            key={macroCluster.slug}
            href={`/grid/${macroCluster.slug}`}
            className="relative w-full rounded-2xl bg-slate-900/70 border border-white/10 p-6 text-left transition cursor-pointer hover:border-nexo-aqua/40 hover:shadow-lg"
          >
            <div className="absolute top-4 right-4">
              <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full border border-white/10">
                {macroCluster.clusters.length} Cluster
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{macroCluster.name}</h3>
            <p className="text-sm text-slate-400">{macroCluster.shortDescription}</p>
          </Link>
        ))}
      </div>
      {!hasMacroClusters && (
        <p className="text-sm text-slate-200/70">Keine Makro-Cluster gefunden.</p>
      )}
    </div>
  );
}
