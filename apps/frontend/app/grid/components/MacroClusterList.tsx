import type { MacroCluster } from "@/types/grid";
import Link from "next/link";
import { useState } from "react";
import { ClusterList } from "./ClusterList";
import { MacroClusterCard } from "./MacroClusterCard";

type Props = {
  macroClusters: MacroCluster[];
};

export function MacroClusterList({ macroClusters }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (slug: string) => {
    setOpen((prev) => (prev === slug ? null : slug));
  };

  const openMacroluster = macroClusters.find((c) => c.slug === open);

  return (
    <div className="space-y-4">
      {macroClusters.map((macroClusters) => (
        <div key={macroClusters.slug} className="space-y-3">
          <MacroClusterCard cluster={macroClusters} isOpen={open === macroClusters.slug} onToggle={toggle} />
          {open === macroClusters.slug && (
            <div className="rounded-xl border border-white/5 bg-[#0B1220]/60 p-4 animate-fadeIn">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-200/80">
                  Cluster innerhalb von {macroClusters.name}
                </p>
                <Link
                  href={`/grid/${macroClusters.slug}`}
                  className="text-sm font-semibold text-[#4FF4E0] hover:underline"
                >
                  Cluster-Seite öffnen
                </Link>
              </div>
              <ClusterList macroCluster={macroClusters} />
            </div>
          )}
        </div>
      ))}
      {!openMacroluster && (
        <p className="text-sm text-slate-200/70">
          Wähle ein Makro-Cluster, um Cluster zu sehen.
        </p>
      )}
    </div>
  );
}
