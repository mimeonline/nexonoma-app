"use client";

import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import type { Cluster, MacroCluster, Segment, SegmentContentItem, SegmentContentType } from "@/types/grid";

// --- Types & Helpers ---
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

function flattenContents(cluster: Cluster): ContentWithSegment[] {
  const segments = cluster.segments ?? [];
  const bucket: ContentWithSegment[] = [];
  segments.forEach((segment) => {
    const content = segment.content;
    if (!content) return;
    const pushItems = (items: SegmentContentItem[], type: SegmentContentType) => {
      items.forEach((item) => bucket.push({ ...item, type, segmentSlug: segment.slug, segmentName: segment.name }));
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

// --- Main Component ---
interface SegmentsProps {
  macroCluster: MacroCluster;
  cluster: Cluster;
}

export function Segments({ macroCluster, cluster }: SegmentsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("pipeline");
  const [activeSegment, setActiveSegment] = useState<"all" | string>("all");
  const [activeType, setActiveType] = useState<FilterType>("all");

  const contents = useMemo(() => (cluster ? flattenContents(cluster) : []), [cluster]);
  const filtered = useMemo(() => filterContents(contents, activeSegment, activeType), [contents, activeSegment, activeType]);

  const segments: Segment[] = cluster.segments ?? [];
  const segmentsToRender = segments;

  return (
    <div className="space-y-8">
      {/* --- HEADER PANEL --- */}
      {/* TODO Refactor create a new Component with example the name Panel or something different an change car with the new component. This is semantical not a card. It is a block, a box, a containeer or something different.  */}
      <Card variant="panel" className="p-6 md:p-8 bg-nexo-surface border-white/10">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
          <div className="space-y-3 flex-1 min-w-0">
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Link href="/grid" className="hover:text-white transition-colors">
                Grid
              </Link>
              <span className="text-slate-700">/</span>
              <Link href={`/grid/${macroCluster.slug}`} className="hover:text-white transition-colors">
                {macroCluster.name}
              </Link>
              <span className="text-slate-700">/</span>
              <span className="text-nexo-ocean truncate">{cluster.name}</span>
            </nav>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{cluster.name ?? "Lade..."}</h1>
              {cluster.type && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Live
                </span>
              )}
            </div>
            <p className="max-w-2xl text-base text-nexo-muted leading-relaxed">
              {cluster.shortDescription ?? "Erkunde die Bausteine dieses Clusters."}
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 md:items-end">
            <select
              value={activeType}
              onChange={(e) => setActiveType(e.target.value as FilterType)}
              className="w-full md:w-48 h-10 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 transition-all cursor-pointer shadow-sm"
            >
              <option value="all">Alle Typen</option>
              <option value="concept">Nur Konzepte</option>
              <option value="method">Nur Methoden</option>
              <option value="tool">Nur Tools</option>
              <option value="technology">Nur Technologien</option>
            </select>

            <div className="flex h-10 items-center rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-full items-center gap-2 rounded-lg px-3 text-xs font-medium transition-all ${viewMode === "grid" ? "bg-nexo-ocean/10 text-nexo-ocean shadow-sm " : "text-slate-400 hover:text-white"}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                onClick={() => setViewMode("pipeline")}
                className={`flex h-full items-center gap-2 rounded-lg px-3 text-xs font-medium transition-all ${viewMode === "pipeline" ? "bg-nexo-ocean/10 text-nexo-ocean shadow-sm " : "text-slate-400 hover:text-white"}`}
              >
                <List className="h-3.5 w-3.5" /> Pipeline
              </button>
            </div>
          </div>
        </div>

        {/* Segment Tabs */}
        <div className="pt-8 flex items-center gap-6 overflow-x-auto border-b border-white/5 pb-0 scrollbar-hide">
          <TabButton active={activeSegment === "all"} onClick={() => setActiveSegment("all")} label="Alles anzeigen" />
          {segments.map((segment) => (
            <TabButton
              key={segment.slug}
              active={activeSegment === segment.slug}
              onClick={() => setActiveSegment(segment.slug)}
              label={segment.name}
            />
          ))}
        </div>
      </Card>

      {/* --- CONTENT AREA --- */}
      {viewMode === "grid" ? (
        // GRID MODE: Standard Card Grid
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <Link key={item.slug} href={`/catalog/${item.type}/${item.slug}`}>
              <Card variant="interactive" className="flex flex-col h-full min-h-40 group cursor-pointer">
                <CardHeader className="pb-2 space-y-0">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={getBadgeVariant(item.type)} size="sm">
                      {item.type}
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-mono truncate max-w-[50%]">{item.segmentName}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base group-hover:text-nexo-ocean transition-colors mb-2">{item.name}</CardTitle>
                  {item.shortDescription && <p className="text-xs text-nexo-muted line-clamp-2 leading-relaxed">{item.shortDescription}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        // PIPELINE MODE: Optimized Lanes
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-${Math.min(segmentsToRender.length, 4)}`}>
          {segmentsToRender.map((segment, idx) => {
            const items = filterContents(contents, segment.slug, activeType);
            const colors = ["border-purple-500", "border-sky-500", "border-emerald-500", "border-rose-500", "border-amber-500"];

            // Border Bottom Color
            const borderColor = colors[idx % colors.length].replace("border-", "border-b-");

            return (
              <div key={segment.slug} className="flex flex-col h-full rounded-2xl border border-white/5 bg-[#121926] overflow-hidden">
                {/* Column Header: With colored bottom border */}
                <div className={`px-4 py-3 bg-[#151e2e] flex justify-between items-center border-b-2 ${borderColor}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{segment.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">{items.length}</span>
                </div>

                {/* Items List: Denser Gap & Padding */}
                <div className="flex flex-col gap-3 p-4 flex-1">
                  {items.map((item) => (
                    <Link key={item.slug} href={`/catalog/${item.type}/${item.slug}`}>
                      <Card variant="interactive" className="p-3 shadow-sm hover:shadow-md border-white/5 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={getBadgeVariant(item.type)} size="sm">
                            {item.type}
                          </Badge>
                        </div>
                        <div className="text-sm font-bold text-white mb-1 group-hover:text-nexo-ocean transition-colors">{item.name}</div>
                        {item.shortDescription && <p className="text-[11px] text-nexo-muted line-clamp-2">{item.shortDescription}</p>}
                      </Card>
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <div className="flex flex-1 items-center justify-center min-h-[100px] border-2 border-dashed border-white/5 rounded-lg bg-white/1">
                      <span className="text-[11px] italic text-slate-600">Leer</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Sub-Component: Tab Button ---
function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3.5 text-sm font-medium transition-all relative whitespace-nowrap ${active ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
    >
      {label}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexo-ocean rounded-full" />}
    </button>
  );
}
