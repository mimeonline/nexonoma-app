"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { BackButton } from "../../../components/BackButton";
import { ContentTypeList } from "../../../components/ContentTypeList";
import { clusters } from "../../../data/categories";

type Params = {
  clusterSlug: string;
  subclusterSlug: string;
  segmentSlug: string;
};

export default function SegmentPage({ params }: { params: Promise<Params> }) {
  const { clusterSlug, subclusterSlug, segmentSlug } = use(params);

  const cluster = clusters.find((c) => c.slug === clusterSlug);
  if (!cluster) return notFound();

  const subcluster = cluster.subclusters.find((s) => s.slug === subclusterSlug);
  if (!subcluster) return notFound();

  const segment = subcluster.segments.find((seg) => seg.slug === segmentSlug);
  if (!segment) return notFound();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <BackButton
          href={`/grid/${cluster.slug}/${subcluster.slug}`}
          label="Zurück zum Sub-Cluster"
        />
        <header className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/70">
            Segment
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">{segment.title}</h1>
          <p className="text-base text-gray-300">
            Wähle einen Content-Typ für {segment.title}.
          </p>
        </header>

        <ContentTypeList
          clusterSlug={cluster.slug}
          subclusterSlug={subcluster.slug}
          segmentSlug={segment.slug}
          contents={segment.contents}
        />
      </main>
    </div>
  );
}
