"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { BackButton } from "../components/BackButton";
import { SegmentList } from "../components/SegmentList";
import { clusters } from "../data/categories";

type Params = {
  clusterSlug: string;
};

export default function ClusterPage({ params }: { params: Promise<Params> }) {
  const { clusterSlug } = use(params);
  const cluster = clusters.find((c) => c.slug === clusterSlug);
  if (!cluster) return notFound();

  const segments = cluster.subclusters.flatMap((s) => s.segments);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <BackButton href="/grid" label="Zurück zur Grid-Übersicht" />
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Cluster
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">{cluster.title}</h1>
          <p className="text-base text-gray-300">
            Alle Segmente innerhalb dieses Clusters.
          </p>
        </header>

        <SegmentList clusterSlug={cluster.slug} segments={segments} />
      </main>
    </div>
  );
}
