"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { BackButton } from "../../../../../components/BackButton";
import { ContentDetail } from "../../../../../components/ContentDetail";
import { fetchGrid } from "@/lib/api/grid";
import type { Cluster, ContentGroup, ContentItem, ContentType, MacroCluster, Segment } from "@/types/grid";

type Params = {
  clusterSlug: string;
  subclusterSlug: string;
  segmentSlug: string;
  contentType: ContentType;
  contentSlug: string;
};

const groupKeyMap: Record<ContentType, keyof ContentGroup> = {
  concept: "concepts",
  method: "methods",
  tool: "tools",
  technology: "technologies",
};

export default function ContentDetailPage({ params }: { params: Promise<Params> }) {
  const { clusterSlug, subclusterSlug, segmentSlug, contentType, contentSlug } = use(params);

  const [macroCluster, setMacroCluster] = useState<MacroCluster | null>(null);
  const [subcluster, setSubcluster] = useState<Cluster | null>(null);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGrid()
      .then((response) => {
        const foundMacro =
          response.data.macroClusters.find((macro) => macro.slug === clusterSlug) ?? null;
        setMacroCluster(foundMacro);
        const foundSub = foundMacro?.clusters.find((c) => c.slug === subclusterSlug) ?? null;
        setSubcluster(foundSub);
        const foundSegment = foundSub?.segments.find((seg) => seg.slug === segmentSlug) ?? null;
        setSegment(foundSegment ?? null);
        const groupKey = groupKeyMap[contentType];
        const foundItem =
          foundSegment?.content[groupKey]?.find((entry) => entry.slug === contentSlug) ?? null;
        setItem(foundItem);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unbekannter Fehler"))
      .finally(() => setLoading(false));
  }, [clusterSlug, contentSlug, contentType, segmentSlug, subclusterSlug]);

  if (!loading && !error && (!macroCluster || !subcluster || !segment || !item)) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0B1220] to-[#1A2E5D] text-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12 pt-10 sm:pt-16 sm:pb-16">
        <BackButton
          href={`/grid/${macroCluster?.slug ?? ""}/${subcluster?.slug ?? ""}/${segment?.slug ?? ""}`}
          label="Zurück zum Segment"
        />
        {loading && <p className="text-sm text-slate-200/80">Lade Content...</p>}
        {error && <p className="text-sm text-red-300">Fehler: {error}</p>}
        {!loading && !error && item && segment && macroCluster && (
          <ContentDetail
            item={item}
            path={{
              cluster: macroCluster.name,
              segment: segment.name,
              type: contentType,
            }}
          />
        )}
      </main>
    </div>
  );
}
