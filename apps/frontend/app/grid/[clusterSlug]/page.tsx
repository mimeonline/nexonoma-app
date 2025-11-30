"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { BackButton } from "../components/BackButton";
import { SegmentList } from "../components/SegmentList";
import { fetchGrid } from "@/lib/api/grid";
import type { MacroCluster, Segment } from "@/types/grid";

type Params = {
  clusterSlug: string;
};

export default function ClusterPage({ params }: { params: Promise<Params> }) {
  const { clusterSlug } = use(params);
  const [cluster, setCluster] = useState<MacroCluster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGrid()
      .then((response) => {
        const found = response.data.macroClusters.find((c) => c.slug === clusterSlug) ?? null;
        setCluster(found);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unbekannter Fehler"))
      .finally(() => setLoading(false));
  }, [clusterSlug]);

  if (!loading && !error && !cluster) {
    return notFound();
  }

  const segments =
    cluster?.clusters.flatMap((child) =>
      child.segments.map<{ segment: Segment; subclusterSlug: string }>((segment) => ({
        segment,
        subclusterSlug: child.slug,
      })),
    ) ?? [];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <BackButton href="/grid" label="Zurück zur Grid-Übersicht" />
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Cluster
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {cluster?.name ?? "Lade Cluster..."}
          </h1>
          <p className="text-base text-gray-300">Alle Segmente innerhalb dieses Clusters.</p>
        </header>

        {loading && <p className="text-sm text-slate-200/80">Lade Cluster...</p>}
        {error && <p className="text-sm text-red-300">Fehler: {error}</p>}
        {!loading && !error && cluster && (
          <SegmentList clusterSlug={cluster.slug} segments={segments} />
        )}
      </main>
    </div>
  );
}
