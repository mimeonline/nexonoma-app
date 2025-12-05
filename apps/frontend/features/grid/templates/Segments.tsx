"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cluster, MacroCluster, Segment, SegmentContentItem, SegmentContentType } from "@/types/grid";

type ContentWithSegment = SegmentContentItem & {
  segmentSlug: string;
  segmentName: string;
};

type ViewMode = "grid" | "pipeline";
type FilterType = "all" | SegmentContentType;

const typeStyles: Record<SegmentContentType, string> = {
  method: "bg-purple-500/15 text-purple-200 border-purple-500/30",
  concept: "bg-sky-500/15 text-sky-200 border-sky-500/30",
  tool: "bg-teal-500/15 text-teal-200 border-teal-500/30",
  technology: "bg-amber-500/15 text-amber-200 border-amber-500/30",
};

const viewToggle = [
  { key: "grid" as const, label: "Grid", icon: "▦" },
  { key: "pipeline" as const, label: "Pipeline", icon: "≡" },
];

function flattenContents(cluster: Cluster): ContentWithSegment[] {
  const segments = cluster.segments ?? [];
  const bucket: ContentWithSegment[] = [];

  segments.forEach((segment) => {
    const content = segment.content;
    if (!content) return;

    const pushItems = (items: SegmentContentItem[], type: SegmentContentType) => {
      items.forEach((item) => {
        bucket.push({ ...item, type, segmentSlug: segment.slug, segmentName: segment.name });
      });
    };

    pushItems(content.methods ?? [], "method");
    pushItems(content.concepts ?? [], "concept");
    pushItems(content.tools ?? [], "tool");
    pushItems(content.technologies ?? [], "technology");
  });

  return bucket;
}

function filterContents(contents: ContentWithSegment[], activeSegment: "all" | string, activeType: FilterType): ContentWithSegment[] {
  return contents.filter((item) => {
    const segmentMatch = activeSegment === "all" || item.segmentSlug === activeSegment;
    const typeMatch = activeType === "all" || item.type === activeType;
    return segmentMatch && typeMatch;
  });
}

interface SegmentsProps {
  macroCluster: MacroCluster;
  cluster: Cluster;
}

export function Segments({ macroCluster, cluster }: SegmentsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeSegment, setActiveSegment] = useState<"all" | string>("all");
  const [activeType, setActiveType] = useState<FilterType>("all");

  const contents = useMemo(() => (cluster ? flattenContents(cluster) : []), [cluster]);
  const filtered = useMemo(() => filterContents(contents, activeSegment, activeType), [contents, activeSegment, activeType]);

  const segments: Segment[] = cluster.segments ?? [];
  const segmentsToRender = activeSegment === "all" ? segments : segments.filter((s) => s.slug === activeSegment);

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <nav className="mb-2 flex items-center gap-2 text-sm text-slate-400">
              <Link href="/grid" className="hover:text-slate-200">
                Start
              </Link>
              <span>/</span>
              <Link href={`/grid/${macroCluster.slug}`} className="hover:text-slate-200">
                {macroCluster.name || "Makro-Cluster"}
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-200">{cluster.name ?? "Cluster"}</span>
            </nav>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold md:text-4xl">{cluster.name ?? "Lade..."}</h1>
              {cluster.type && (
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30">
                  Live
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 md:text-base">{cluster.shortDescription ?? ""}</p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <select
              value={activeType}
              onChange={(e) => setActiveType(e.target.value as FilterType)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-black/20 focus:border-nexo-aqua/60 focus:outline-none md:w-44"
            >
              <option value="all">Alle Typen</option>
              <option value="concept">Nur Konzepte</option>
              <option value="method">Nur Methoden</option>
              <option value="tool">Nur Tools</option>
              <option value="technology">Nur Technologien</option>
            </select>

            <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 p-1 text-sm text-slate-200">
              {viewToggle.map((toggle) => (
                <button
                  key={toggle.key}
                  onClick={() => setViewMode(toggle.key)}
                  className={`flex items-center gap-2 rounded-md px-3 py-1 transition ${
                    viewMode === toggle.key ? "bg-nexo-aqua/20 text-nexo-aqua border border-nexo-aqua/40 shadow" : "hover:bg-slate-800/80"
                  }`}
                  type="button"
                >
                  <span aria-hidden className="text-base leading-none">
                    {toggle.icon}
                  </span>
                  {toggle.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 overflow-x-auto border-b border-white/5 pb-2 text-sm text-slate-300">
          <button
            type="button"
            onClick={() => setActiveSegment("all")}
            className={`pb-2 transition ${activeSegment === "all" ? "border-b-2 border-nexo-aqua text-white" : "hover:text-white/80"}`}
          >
            Alles anzeigen
          </button>
          {segments.map((segment) => (
            <button
              key={segment.slug}
              type="button"
              onClick={() => setActiveSegment(segment.slug)}
              className={`pb-2 transition ${activeSegment === segment.slug ? "border-b-2 border-nexo-aqua text-white" : "hover:text-white/80"}`}
            >
              {segment.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filtered.map((item) => (
              <Link
                key={item.slug}
                href={`/catalog/${item.type}/${item.slug}`}
                className="group relative rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-sm transition hover:border-nexo-aqua/40 hover:shadow-lg"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${typeStyles[item.type]}`}>
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-400">{item.segmentName}</span>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-nexo-aqua">{item.name}</h3>
                {item.shortDescription && <p className="mt-2 text-sm text-slate-400">{item.shortDescription}</p>}
              </Link>
            ))}

            <div className="rounded-2xl border-2 border-dashed border-slate-700/80 bg-slate-900/40 p-6 text-center text-slate-300">
              <div className="text-3xl font-semibold text-slate-200">+20</div>
              <p className="mt-2 text-sm">Weitere Elemente laden</p>
              <Link href="/katalog" className="mt-3 inline-block text-sm font-semibold text-nexo-aqua hover:underline">
                Zum Katalog wechseln →
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {segmentsToRender.map((segment) => {
              const items = filterContents(contents, segment.slug, activeType);
              const color = {
                0: "border-purple-400",
                1: "border-sky-400",
                2: "border-emerald-400",
                3: "border-rose-400",
                4: "border-amber-400",
              } as const;
              const borderClass = color[(segments.indexOf(segment) % 5) as 0 | 1 | 2 | 3 | 4];

              return (
                <div key={segment.slug} className="min-w-60 flex-1 rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-sm">
                  <div className={`mb-4 border-b-2 pb-2 text-xs font-semibold uppercase text-slate-200 ${borderClass}`}>
                    {segment.name} ({items.length})
                  </div>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/catalog/${item.type}/${item.slug}`}
                        className="block rounded-xl border border-white/10 bg-slate-900/70 p-3 transition hover:border-nexo-aqua/40 hover:shadow"
                      >
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className={`rounded-full border px-2 py-0.5 font-semibold uppercase tracking-wide ${typeStyles[item.type]}`}>
                            {item.type}
                          </span>
                          <span className="text-slate-400">{segment.name}</span>
                        </div>
                        <div className="text-sm font-semibold text-white">{item.name}</div>
                        {item.shortDescription && <p className="text-xs text-slate-400">{item.shortDescription}</p>}
                      </Link>
                    ))}
                    {items.length === 0 && <p className="text-xs text-slate-400">Keine Inhalte in diesem Segment.</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
