"use client";

import { LayoutGrid, LayoutPanelTop } from "lucide-react";
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
import { SegmentBoard } from "@/features/grid/components/SegmentBoard";
// --- Internal Types ---
type ContentWithSegment = SegmentContentItem & {
  segmentSlug: string;
  segmentName: string;
};

type ViewMode = "grid" | "board";
type FilterType = "all" | SegmentContentType;
type SegmentFilter = "all" | string;

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

function filterContents(contents: ContentWithSegment[], segmentSlug: SegmentFilter, activeType: FilterType): ContentWithSegment[] {
  return contents.filter((item) => {
    const segmentMatch = segmentSlug === "all" || item.segmentSlug === segmentSlug;
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
  const [activeType, setActiveType] = useState<FilterType>("all");
  const [activeSegment, setActiveSegment] = useState<SegmentFilter>("all");
  const itemsPerPage = 24;
  const [page, setPage] = useState(1);
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

  const segments = cluster.segments ?? [];
  const hasSegments = segments.length > 0;
  const activeSegmentData = activeSegment === "all" ? null : segments.find((segment) => segment.slug === activeSegment);
  const segmentDescription =
    activeSegmentData?.longDescription || activeSegmentData?.shortDescription || t("grid.segments.segmentDescriptionFallback");
  const typePrefix = t("grid.segments.filters.typePrefix");
  const segmentOptions = useMemo(
    () =>
      [
        { value: "all", label: t("grid.segments.filters.segmentAll") },
        ...segments.map((segment) => ({ value: segment.slug, label: segment.name })),
      ] as { value: SegmentFilter; label: string }[],
    [segments, t]
  );
  const filteredItems = useMemo(() => filterContents(contents, activeSegment, activeType), [contents, activeSegment, activeType]);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, itemsPerPage, currentPage]);
  const hasAnyContent = contents.length > 0;
  const showFilteredEmptyState = hasSegments && hasAnyContent && filteredItems.length === 0;
  const showCuratedEmptyState = hasSegments && !hasAnyContent;

  return (
    <div className="space-y-8 pb-20" id="segments-top">
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
        </div>
      </Card>

      {/* --- VIEW TOGGLE --- */}
      {hasSegments && (
        <div className="flex h-10 w-full items-center rounded-xl border border-white/10 bg-white/5 p-1 md:w-56">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex-1 flex h-full items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === "grid" ? "bg-nexo-ocean/10 text-nexo-ocean shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> {t("grid.segments.viewToggle.tiles")}
          </button>

          <button
            onClick={() => setViewMode("board")}
            className={`flex-1 flex h-full items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all ${
              viewMode === "board" ? "bg-nexo-ocean/10 text-nexo-ocean shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutPanelTop className="h-3.5 w-3.5" /> {t("grid.segments.viewToggle.board")}
          </button>
        </div>
      )}

      {/* --- FILTER BAR --- */}
      {hasSegments && viewMode === "grid" && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {t("grid.segments.filters.segmentLabel")}
                </div>
                <div className="relative w-full md:w-56">
                  <select
                    value={activeSegment}
                    onChange={(e) => {
                      setActiveSegment(e.target.value as SegmentFilter);
                      setPage(1);
                    }}
                    className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                  >
                    {segmentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {t("grid.segments.filters.typeLabel")}
                </div>
                <div className="relative w-full md:w-56">
                  <select
                    value={activeType}
                    onChange={(e) => {
                      setActiveType(e.target.value as FilterType);
                      setPage(1);
                    }}
                    className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                  >
                    {selectTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                        {`${typePrefix}: ${opt.label}`}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

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
      ) : viewMode === "board" ? (
        <SegmentBoard segments={segments} />
      ) : (
        <div className="space-y-6">
          {activeSegmentData && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <h2 className="text-xl font-bold text-white md:text-2xl">{activeSegmentData.name}</h2>
              <p className="mt-2 max-w-2xl text-sm text-nexo-muted leading-relaxed">{segmentDescription}</p>
            </div>
          )}

          {showCuratedEmptyState ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center">
              <p className="text-sm font-semibold text-slate-100">{t("emptyStates.curated.title")}</p>
              <p className="mt-2 text-sm text-nexo-muted">{t("emptyStates.curated.line1")}</p>
              <p className="text-sm text-nexo-muted">{t("emptyStates.curated.line2")}</p>
              <div className="mt-4 flex justify-center">
                <Button variant="secondary" onClick={() => router.push(`${localePrefix}/catalog`)}>
                  {t("emptyStates.curated.actionCatalog")}
                </Button>
              </div>
            </div>
          ) : showFilteredEmptyState ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center">
              <p className="text-sm font-semibold text-slate-100">{t("emptyStates.filtered.title")}</p>
              <p className="mt-2 text-sm text-nexo-muted">{t("emptyStates.filtered.line1")}</p>
              <p className="text-sm text-nexo-muted">{t("emptyStates.filtered.line2")}</p>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setActiveSegment("all");
                    setActiveType("all");
                    setPage(1);
                  }}
                >
                  {t("emptyStates.filtered.actionReset")}
                </Button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {pagedItems.map((item) => {
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
              </div>

              {filteredItems.length > 0 && totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button variant="ghost" onClick={() => setPage(1)} disabled={currentPage === 1}>
                    {t("catalog.pagination.first")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setPage((prev) => Math.max(1, Math.min(totalPages, prev) - 1))}
                    disabled={currentPage === 1}
                  >
                    {t("catalog.pagination.previous")}
                  </Button>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/60">
                    {t("catalog.pagination.pageLabel", { page: currentPage, total: totalPages })}
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => setPage((prev) => Math.min(totalPages, Math.min(totalPages, prev) + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t("catalog.pagination.next")}
                  </Button>
                  <Button variant="ghost" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>
                    {t("catalog.pagination.last")}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="mx-auto max-w-[760px] space-y-3">
              {pagedItems.map((item) => (
                <Link key={item.slug} href={`/catalog/${toCatalogTypeSlug(item.type)}/${item.slug}`}>
                  <Card variant="interactive" className="rounded-2xl border-white/10 bg-white/5 px-5 py-4 hover:border-white/20">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      <Badge variant={getBadgeVariant(item.type)} size="sm" className="text-[10px] px-1.5 py-0">
                        {translateAssetLabel(item.type)}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="text-base font-semibold text-white group-hover:text-nexo-ocean transition-colors">{item.name}</div>
                      <p className="text-sm text-nexo-muted leading-relaxed line-clamp-2">
                        {item.shortDescription || t("catalog.gridMeta.shortDescriptionFallback")}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}

              {filteredItems.length > 0 && totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button variant="ghost" onClick={() => setPage(1)} disabled={currentPage === 1}>
                    {t("catalog.pagination.first")}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setPage((prev) => Math.max(1, Math.min(totalPages, prev) - 1))}
                    disabled={currentPage === 1}
                  >
                    {t("catalog.pagination.previous")}
                  </Button>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200/60">
                    {t("catalog.pagination.pageLabel", { page: currentPage, total: totalPages })}
                  </span>
                  <Button
                    variant="primary"
                    onClick={() => setPage((prev) => Math.min(totalPages, Math.min(totalPages, prev) + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t("catalog.pagination.next")}
                  </Button>
                  <Button variant="ghost" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>
                    {t("catalog.pagination.last")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
