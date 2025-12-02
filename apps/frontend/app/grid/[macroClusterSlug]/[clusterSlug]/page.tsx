"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { BackButton } from "../../components/BackButton";
import { SegmentList } from "../../components/SegmentList";
import { fetchGrid } from "@/lib/api/grid";
import type { Cluster, MacroCluster } from "@/types/grid";

type Params = {
  clusterSlug: string;
  subclusterSlug: string;
};

export default function SubclusterPage({ params }: { params: Promise<Params> }) {
  const { clusterSlug, subclusterSlug } = use(params);
  const [macroCluster, setMacroCluster] = useState<MacroCluster | null>(null);
  const [subcluster, setSubcluster] = useState<Cluster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGrid()
      .then((response) => {
        const foundMacro =
          response.data?.macroClusters?.find((macro) => macro.slug === clusterSlug) ?? null;
        setMacroCluster(foundMacro);
        const foundSub = foundMacro?.clusters?.find((c) => c.slug === subclusterSlug) ?? null;
        setSubcluster(foundSub);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unbekannter Fehler"))
      .finally(() => setLoading(false));
  }, [clusterSlug, subclusterSlug]);

  if (!loading && !error && (!macroCluster || !subcluster)) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <BackButton href={`/grid/${macroCluster?.slug ?? ""}`} label="Zurück zum Cluster" />
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Sub-Cluster
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {subcluster?.name ?? "Lade Sub-Cluster..."}
          </h1>
          <p className="text-base text-gray-300">
            Segmente innerhalb von {subcluster?.name ?? "diesem Sub-Cluster"}.
          </p>
        </header>

        {loading && <p className="text-sm text-slate-200/80">Lade Sub-Cluster...</p>}
        {error && <p className="text-sm text-red-300">Fehler: {error}</p>}
        {!loading && !error && subcluster && macroCluster && (
          <SegmentList
            clusterSlug={macroCluster.slug}
            segments={(subcluster.segments ?? []).map((segment) => ({
              segment,
              subclusterSlug: subcluster.slug,
            }))}
          />
        )}
      </main>
    </div>
  );
}
