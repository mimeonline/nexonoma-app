"use client";

import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { TagChip } from "@/components/atoms/TagChip";
import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Button } from "@/components/ui/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { Cluster, MacroCluster, SegmentContentItem, SegmentContentType } from "@/types/grid";
import { AssetType } from "@/types/nexonoma";
import { getCardTagKeys, getCardTagLabel } from "@/utils/getCardTags";
import { formatTagLabel } from "@/utils/tag-labels";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
// --- Internal Types ---
type ContentWithSegment = SegmentContentItem & {
  segmentSlug: string;
  segmentName: string;
};

type ViewMode = "grid" | "pipeline";
type FilterType = "all" | SegmentContentType;

// --- Helper Functions (View Logic) ---
function flattenContents(cluster: Cluster): ContentWithSegment[] {
  const segments = cluster.segments ?? [];
  const bucket: ContentWithSegment[] = [];

  segments.forEach((segment) => {
    const { content } = segment;
    if (!content) return;

    const pushItems = (items: SegmentContentItem[], type: SegmentContentType) => {
      items.forEach((item) =>
        bucket.push({
          ...item,
          type,
          segmentSlug: segment.slug,
          segmentName: segment.name,
        })
      );
    };

    pushItems(content.methods ?? [], AssetType.METHOD);
    pushItems(content.concepts ?? [], AssetType.CONCEPT);
    pushItems(content.tools ?? [], AssetType.TOOL);
    pushItems(content.technologies ?? [], AssetType.TECHNOLOGY);
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

// --- Component Interface ---
interface SegmentsTemplateProps {
  macroCluster: MacroCluster;
  cluster: Cluster;
}

// --- Main Component ---
export function SegmentsTemplate({ macroCluster, cluster }: SegmentsTemplateProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [activeSegment, setActiveSegment] = useState<"all" | string>("all");
  const [activeType, setActiveType] = useState<FilterType>("all");
  const { t, lang } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.match(/^\/(de|en)(\/|$)/)?.[1];
  const localePrefix = locale ? `/${locale}` : "";

  const selectTypeOptions = useMemo(
    () =>
      [
        { value: "all", label: t("grid.segments.filters.types.all") },
        { value: AssetType.CONCEPT, label: t("grid.segments.filters.types.concept") },
        { value: AssetType.METHOD, label: t("grid.segments.filters.types.method") },
        { value: AssetType.TOOL, label: t("grid.segments.filters.types.tool") },
        { value: AssetType.TECHNOLOGY, label: t("grid.segments.filters.types.technology") },
      ] as { value: FilterType; label: string }[],
    [t]
  );

  const translateAssetLabel = (value: string) => {
    const key = `asset.labels.${value.toLowerCase()}`;
    return t(key);
  };

  const toCatalogTypeSlug = (value: string) => value.toLowerCase();

  const contents = useMemo(() => (cluster ? flattenContents(cluster) : []), [cluster]);
  const filtered = useMemo(() => filterContents(contents, activeSegment, activeType), [contents, activeSegment, activeType]);
  const hasAnyContent = contents.length > 0;

  const segments = cluster.segments ?? [];
  const hasSegments = segments.length > 0;

  return (
    <div className="space-y-8 pb-20">
      {/* --- HEADER PANEL --- */}
      <Card variant="panel" className="p-6 md:p-8 bg-nexo-surface border-white/10">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-start">
          <div className="space-y-3 flex-1 min-w-0">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Link href="/grid" className="hover:text-white transition-colors">
                {t("grid.segments.breadcrumbs.grid")}
              </Link>
              <span className="text-slate-700">/</span>
              <Link href={`/grid/${macroCluster.slug}`} className="hover:text-white transition-colors">
                {macroCluster.name}
              </Link>
              <span className="text-slate-700">/</span>
              <span className="text-nexo-ocean truncate">{cluster.name}</span>
            </nav>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white sm:text-4xl">{cluster.name}</h1>
              {/* Optional: Live Badge Logic here if needed */}
            </div>
            <p className="max-w-2xl text-base text-nexo-muted leading-relaxed">
              {cluster.longDescription || "Erkunde die Bausteine dieses Clusters."}
            </p>
          </div>

          {/* Controls */}
          {hasSegments && (
            <div className="flex flex-col gap-3 shrink-0 md:items-end w-full md:w-auto">
              {/* 1. SELECT WRAPPER */}
              {/* Änderung: 'md:w-52' statt 'md:w-48' für eine angenehme Breite */}
              <div className="relative w-full md:w-52">
                <select
                  value={activeType}
                  onChange={(e) => setActiveType(e.target.value as FilterType)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {selectTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                      {opt.label}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>

              {/* 2. VIEW MODE TOGGLE */}
              {/* Änderung: Ebenfalls 'md:w-52' und 'w-full'. */}
              <div className="flex h-10 w-full md:w-52 items-center rounded-xl border border-white/10 bg-white/5 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  // Änderung: 'flex-1' und 'justify-center' hinzugefügt, damit der Button 50% der Breite füllt
                  className={`flex-1 flex h-full items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "grid" ? "bg-nexo-ocean/10 text-nexo-ocean shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> {t("grid.segments.viewToggle.grid")}
                </button>

                <button
                  onClick={() => setViewMode("pipeline")}
                  // Änderung: Ebenfalls 'flex-1' und 'justify-center'
                  className={`flex-1 flex h-full items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all ${
                    viewMode === "pipeline" ? "bg-nexo-ocean/10 text-nexo-ocean shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List className="h-3.5 w-3.5" /> {t("grid.segments.viewToggle.pipeline")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Segment Tabs */}
        {hasSegments && (
          <div className="pt-8 flex items-center gap-6 overflow-x-auto border-b border-white/5 pb-0 scrollbar-hide">
            <TabButton active={activeSegment === "all"} onClick={() => setActiveSegment("all")} label={t("grid.segments.tabs.all")} />
            {segments.map((segment) => (
              <TabButton
                key={segment.slug}
                active={activeSegment === segment.slug}
                onClick={() => setActiveSegment(segment.slug)}
                label={segment.name}
              />
            ))}
          </div>
        )}
      </Card>

      {/* --- CONTENT AREA --- */}
      {!hasSegments ? (
        <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center">
          <p className="text-sm font-semibold text-slate-100">{t("emptyStates.curated.title")}</p>
          <p className="text-sm text-nexo-muted">{t("emptyStates.curated.line1")}</p>
          <p className="text-sm text-nexo-muted">{t("emptyStates.curated.line2")}</p>
          <Button variant="secondary" onClick={() => router.push(`${localePrefix}/catalog`)}>
            {t("emptyStates.curated.actionCatalog")}
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        // GRID MODE
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.length > 0 &&
            filtered.map((item) => {
              const tagKeys = getCardTagKeys(item);
              return (
                <Link key={`${item.segmentName}:${item.id}`} href={`/catalog/${toCatalogTypeSlug(item.type)}/${item.slug}`}>
                  <Card variant="interactive" className="flex flex-col h-full min-h-40 group cursor-pointer">
                    <CardHeader className="pb-2 space-y-0">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant={getBadgeVariant(item.type)} size="sm">
                          {translateAssetLabel(item.type)}
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono truncate max-w-[50%]">{item.segmentName}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1">
                      <CardTitle className="text-base group-hover:text-nexo-ocean transition-colors mb-2">{item.name}</CardTitle>
                      {item.shortDescription && <p className="text-xs text-nexo-muted line-clamp-2 leading-relaxed">{item.shortDescription}</p>}
                      {tagKeys.length > 0 && (
                        <div className="mt-auto pt-3 flex items-center gap-2 text-[11px] leading-snug text-slate-500 whitespace-nowrap overflow-hidden">
                          {tagKeys.map((key) => {
                            const fullLabel = getCardTagLabel(item, key, lang);
                            const displayLabel = formatTagLabel(fullLabel, "card");
                            return <TagChip key={key} label={`#${displayLabel}`} title={fullLabel} />;
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center">
              <p className="text-sm font-semibold text-slate-100">{t(hasAnyContent ? "emptyStates.filtered.title" : "emptyStates.curated.title")}</p>
              <p className="mt-2 text-sm text-nexo-muted">{t(hasAnyContent ? "emptyStates.filtered.line1" : "emptyStates.curated.line1")}</p>
              <p className="text-sm text-nexo-muted">{t(hasAnyContent ? "emptyStates.filtered.line2" : "emptyStates.curated.line2")}</p>
              <div className="mt-4 flex justify-center">
                {hasAnyContent ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setActiveSegment("all");
                      setActiveType("all");
                    }}
                  >
                    {t("emptyStates.filtered.actionReset")}
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => router.push(`${localePrefix}/catalog`)}>
                    {t("emptyStates.curated.actionCatalog")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        // PIPELINE MODE
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-${Math.min(segments.length, 4)}`}>
          {segments.map((segment, idx) => {
            const items = filterContents(contents, segment.slug, activeType);
            const colors = ["border-purple-500", "border-sky-500", "border-emerald-500", "border-rose-500", "border-amber-500"];
            const borderColor = colors[idx % colors.length].replace("border-", "border-b-");

            // Wenn wir filtern und dieses Segment leer ist, blenden wir es aus?
            // Nein, in Pipeline Ansicht zeigen wir meist leere Lanes an, damit die Struktur bleibt.

            return (
              <div key={segment.slug} className="flex flex-col h-full rounded-2xl border border-white/5 overflow-hidden bg-white/2">
                <div className={`px-4 py-3 bg-[#151e2e]/80 flex justify-between items-center border-b ${borderColor}`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{segment.name}</h3>
                  <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">{items.length}</span>
                </div>

                <div className="flex flex-col gap-3 p-4 flex-1">
                  {items.map((item) => {
                    const tagKeys = getCardTagKeys(item);
                    return (
                      <Link key={item.slug} href={`/catalog/${toCatalogTypeSlug(item.type)}/${item.slug}`}>
                        <Card
                          variant="interactive"
                          className="p-3 shadow-sm hover:shadow-md border-white/5 cursor-pointer bg-nexo-card flex flex-col h-full"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={getBadgeVariant(item.type)} size="sm" className="text-[10px] px-1.5 py-0">
                              {translateAssetLabel(item.type)}
                            </Badge>
                          </div>
                          <div className="flex flex-col flex-1">
                            <div className="text-sm font-bold text-white mb-1 group-hover:text-nexo-ocean transition-colors">{item.name}</div>
                            {tagKeys.length > 0 && (
                              <div className="mt-auto flex items-center gap-2 text-[11px] leading-snug text-slate-500 whitespace-nowrap overflow-hidden">
                                {tagKeys.map((key) => {
                                  const fullLabel = getCardTagLabel(item, key, lang);
                                  const displayLabel = formatTagLabel(fullLabel, "card");
                                  return <TagChip key={key} label={`#${displayLabel}`} title={fullLabel} />;
                                })}
                              </div>
                            )}
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                  {items.length === 0 && (
                    <div className="flex flex-1 items-center justify-center min-h-[60px] border border-dashed border-white/5 rounded-lg">
                      <span className="text-[10px] italic text-slate-600">{t("grid.segments.emptyLane")}</span>
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

// --- Sub-Component ---
function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${
        active ? "text-white" : "text-slate-400 hover:text-slate-200"
      }`}
    >
      {label}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-nexo-ocean rounded-full" />}
    </button>
  );
}
