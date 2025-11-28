"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { BackButton } from "../../../../../components/BackButton";
import { ContentDetail } from "../../../../../components/ContentDetail";
import { clusters, type ContentItem } from "../../../../../data/categories";

type Params = {
  clusterSlug: string;
  subclusterSlug: string;
  segmentSlug: string;
  contentType: ContentItem["type"];
  contentSlug: string;
};

export default function ContentDetailPage({ params }: { params: Promise<Params> }) {
  const { clusterSlug, subclusterSlug, segmentSlug, contentType, contentSlug } = use(params);

  const cluster = clusters.find((c) => c.slug === clusterSlug);
  if (!cluster) return notFound();

  const subcluster = cluster.subclusters.find((s) => s.slug === subclusterSlug);
  if (!subcluster) return notFound();

  const segment = subcluster.segments.find((seg) => seg.slug === segmentSlug);
  if (!segment) return notFound();

  const items = segment.contents[contentType];
  if (!items) return notFound();

  const item = items.find((it) => it.slug === contentSlug);
  if (!item) return notFound();

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <BackButton
          href={`/grid/${cluster.slug}/${subcluster.slug}/${segment.slug}`}
          label="Zurück zum Segment"
        />
        <ContentDetail
          item={item}
          path={{
            cluster: cluster.title,
            segment: segment.title,
            type: contentType,
          }}
        />
      </main>
    </div>
  );
}
