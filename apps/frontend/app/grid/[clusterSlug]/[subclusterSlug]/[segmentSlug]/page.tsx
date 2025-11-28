"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { BackButton } from "../../../components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clusters, type ContentItem } from "../../../data/categories";

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

  const [openType, setOpenType] = useState<ContentItem["type"] | null>(null);
  const toggleType = (type: ContentItem["type"]) =>
    setOpenType((prev) => (prev === type ? null : type));

  const types = Object.keys(segment.contents) as Array<ContentItem["type"]>;

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

        <div className="space-y-3">
          {types.map((type) => {
            const items = segment.contents[type];
            const isOpen = openType === type;
            const labelMap: Record<ContentItem["type"], string> = {
              concept: "Concept",
              method: "Method",
              tool: "Tool",
              technology: "Technology",
            };
            return (
              <Card
                key={type}
                className={`overflow-hidden border border-white/10 bg-[#1A2E5D] text-white transition duration-200 ${
                  isOpen ? "border-cyan-400 shadow-[0_0_20px_rgba(79,244,224,0.15)]" : ""
                }`}
              >
                <button
                  onClick={() => toggleType(type)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:text-[#4FF4E0]"
                >
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/80">
                      {labelMap[type]}
                    </p>
                    <p className="text-xs text-slate-300">{items.length} Einträge</p>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-[#4FF4E0] transition" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-300 transition" />
                  )}
                </button>
                <div
                  className={`grid transition-[max-height,opacity] duration-300 ease-out ${
                    isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <CardContent className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
                    {items.map((item) => (
                      <Card
                        key={item.slug}
                        className="border border-white/10 bg-[#0B1220] text-white transition hover:border-cyan-400 hover:text-[#4FF4E0]"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            {labelMap[type]}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-200/85">
                          <p>{item.summary}</p>
                          <Link
                            href={`/grid/${cluster.slug}/${subcluster.slug}/${segment.slug}/${type}/${item.slug}`}
                            className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[#4FF4E0] transition hover:border-cyan-400 hover:bg-white/10"
                          >
                            Öffnen
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
