"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TagChip } from "@/components/atoms/TagChip";
import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Button } from "@/components/ui/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { SegmentBoard } from "@/features/grid/components/SegmentBoard";
import { SegmentControlBar } from "@/features/grid/components/SegmentControlBar";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { Cluster, MacroCluster, SegmentContentItem, SegmentContentType } from "@/types/grid";
import { AssetType } from "@/types/nexonoma";
import { getCardTagKeys, getCardTagLabel } from "@/utils/getCardTags";
import { formatTagLabel } from "@/utils/tag-labels";
import { usePathname, useRouter } from "next/navigation";
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

  const segments = useMemo(() => cluster.segments ?? [], [cluster.segments]);
  const hasSegments = segments.length > 0;
  const activeSegmentData = activeSegment === "all" ? null : segments.find((segment) => segment.slug === activeSegment);
  const segmentDescription =
    activeSegmentData?.longDescription || activeSegmentData?.shortDescription || t("grid.segments.segmentDescriptionFallback");
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
      {/* --- HEADER --- */}
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden select-none md:block">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(140%_90%_at_85%_20%,rgba(255,255,255,0.14),transparent_70%),radial-gradient(120%_70%_at_70%_55%,rgba(255,255,255,0.08),transparent_75%),repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_28px),repeating-linear-gradient(180deg,rgba(255,255,255,0.07)_0,rgba(255,255,255,0.07)_1px,transparent_1px,transparent_28px)] [mask-image:linear-gradient(90deg,transparent_0%,transparent_20%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,1)_75%,rgba(0,0,0,1)_100%)]" />
          <div className="absolute left-[72%] top-[28%] h-[3px] w-[3px] rounded-full bg-white/18" />
          <div className="absolute left-[84%] top-[54%] h-[3px] w-[3px] rounded-full bg-white/16" />
          <div className="absolute left-[66%] top-[40%] h-0.5 w-0.5 rounded-full bg-white/16" />
        </div>
        <div className="relative z-10 space-y-4">
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

          <SectionTitle
            badge={t("grid.segments.badge")}
            title={cluster.name}
            description={cluster.longDescription || t("grid.clusters.descriptionFallback")}
            className="mb-0"
          />
        </div>
      </div>

      {/* --- CONTROL BAR --- */}
      {hasSegments && (
        <SegmentControlBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          viewLabel={t("grid.segments.controls.viewLabel")}
          activeType={activeType}
          onTypeChange={(nextType) => {
            setActiveType(nextType as FilterType);
            setPage(1);
          }}
          typeOptions={selectTypeOptions}
          typeLabel={t("grid.segments.filters.typeLabel")}
          showSegmentFilter={viewMode === "grid"}
          segmentLabel={t("grid.segments.filters.segmentLabel")}
          activeSegment={activeSegment}
          onSegmentChange={(nextSegment) => {
            setActiveSegment(nextSegment as SegmentFilter);
            setPage(1);
          }}
          segmentOptions={segmentOptions}
          labels={{
            tiles: t("grid.segments.viewToggle.tiles"),
            board: t("grid.segments.viewToggle.board"),
          }}
        />
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
        <SegmentBoard segments={segments} activeType={activeType} />
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
