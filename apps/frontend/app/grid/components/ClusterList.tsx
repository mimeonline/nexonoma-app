import { useState } from "react";
import Link from "next/link";
import type { Cluster } from "../data/categories";
import { ClusterCard } from "./ClusterCard";
import { SubClusterList } from "./SubClusterList";

type Props = {
  clusters: Cluster[];
};

export function ClusterList({ clusters }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (slug: string) => {
    setOpen((prev) => (prev === slug ? null : slug));
  };

  const openCluster = clusters.find((c) => c.slug === open);

  return (
    <div className="space-y-4">
      {clusters.map((cluster) => (
        <div key={cluster.slug} className="space-y-3">
          <ClusterCard cluster={cluster} isOpen={open === cluster.slug} onToggle={toggle} />
          {open === cluster.slug && (
            <div className="rounded-xl border border-white/5 bg-[#0B1220]/60 p-4 animate-fadeIn">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-200/80">
                  Sub-Cluster innerhalb von {cluster.title}
                </p>
                <Link
                  href={`/grid/${cluster.slug}`}
                  className="text-sm font-semibold text-[#4FF4E0] hover:underline"
                >
                  Cluster-Seite öffnen
                </Link>
              </div>
              <SubClusterList cluster={cluster} />
            </div>
          )}
        </div>
      ))}
      {!openCluster && (
        <p className="text-sm text-slate-200/70">
          Wähle ein Makro-Cluster, um Sub-Cluster zu sehen.
        </p>
      )}
    </div>
  );
}
