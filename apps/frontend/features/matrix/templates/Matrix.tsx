"use client";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { enumAssetKey, useI18n } from "@/features/i18n/I18nProvider";
import type { MatrixAssetPreview, MatrixCell, MatrixViewResponseDto } from "@/types/matrix";
import { MatrixPerspective } from "@/types/matrix";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";

type AxisTitleProps = {
  typeLabel: string;
  nameLabel: string;
  subLabel?: string;
  align?: "left" | "center";
};

function AxisTitle({ typeLabel, nameLabel, subLabel, align = "left" }: AxisTitleProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${align === "center" ? "items-center text-center" : "items-start"}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{typeLabel}</span>
      <span className="text-xs font-semibold text-slate-200">{nameLabel}</span>
      {subLabel && <span className="text-[11px] text-slate-500">{subLabel}</span>}
    </div>
  );
}

type MiniCardProps = {
  item: MatrixAssetPreview;
  bucketLabel: string;
  yAxisLabel: string;
  localePrefix: string;
  t: (key: string) => string;
  enablePopover: boolean;
};

const typeAbbrev = (type: string) => {
  // Single-letter codes keep the cell compact: C=Concept, M=Method, T=Tool, G=Technology.
  const normalized = type.toLowerCase();
  if (normalized.includes("concept")) return "C";
  if (normalized.includes("method")) return "M";
  if (normalized.includes("tool")) return "T";
  if (normalized.includes("tech")) return "G";
  return "?";
};

const typeIndicatorClass = (type: string) => {
  const variant = getBadgeVariant(type);
  if (variant === "concept") return "border-accent-primary/30 bg-accent-primary/10 text-accent-primary";
  if (variant === "method") return "border-success/30 bg-success/10 text-success";
  if (variant === "tool") return "border-warning/30 bg-warning/10 text-warning";
  if (variant === "technology") return "border-error/30 bg-error/10 text-error";
  return "border-slate-500/40 bg-slate-500/10 text-slate-400";
};

type TypeIndicatorProps = {
  type: string;
};

function TypeIndicator({ type }: TypeIndicatorProps) {
  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-semibold ${typeIndicatorClass(type)}`}>
      {typeAbbrev(type)}
    </span>
  );
}

function MiniCard({ item, bucketLabel, yAxisLabel, localePrefix, t, enablePopover }: MiniCardProps) {
  const [open, setOpen] = useState(false);
  const typeLabel = t(`asset.labels.${item.type.toLowerCase()}`);
  const cellHref = `${localePrefix}/catalog/${item.type.toLowerCase()}/${item.slug}`;
  const description = item.shortDescription?.trim();
  const tags = item.tags ?? [];

  if (!enablePopover) {
    return (
      <Link
        href={cellHref}
        className="group flex w-full items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-2 text-left text-xs text-slate-200 hover:bg-white/10"
      >
        <TypeIndicator type={item.type} />
        <span className="line-clamp-2 text-[11px] leading-none text-slate-200 group-hover:text-white">{item.name}</span>
      </Link>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Link
          href={cellHref}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="group flex w-full items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-2 text-left text-xs text-slate-200 hover:bg-white/10"
        >
          <TypeIndicator type={item.type} />
          <span className="line-clamp-2 text-[11px] leading-none text-slate-200 group-hover:text-white">{item.name}</span>
        </Link>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={6}
        className="z-50 w-64 rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 shadow-xl shadow-black/40"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <Badge variant={getBadgeVariant(item.type)} size="sm" radius="full">
              {typeLabel}
            </Badge>
            <span>•</span>
            <span>
              {yAxisLabel}: {bucketLabel}
            </span>
          </div>
          <div className="text-sm font-semibold text-white">{item.name}</div>
          {description && <div className="text-slate-300">{description}</div>}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              {tags.map((tag) => (
                <span key={tag.slug} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
                  #{tag.label ?? tag.slug}
                </span>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

type MatrixProps = {
  data: MatrixViewResponseDto;
};

const parseAxisDimension = (value?: string | null) => {
  if (value === "STRUCTURE" || value === "PERSPECTIVE" || value === "CONTEXT") return value;
  return "STRUCTURE";
};

const parsePerspective = (value?: string | null): MatrixPerspective => {
  if (value === "DECISION_TYPE") return MatrixPerspective.DECISION_TYPE;
  if (value === "ORGANIZATIONAL_MATURITY") return MatrixPerspective.ORGANIZATIONAL_MATURITY;
  return MatrixPerspective.VALUE_STREAM;
};

export default function Matrix({ data }: MatrixProps) {
  const { t, tRaw, lang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const localePrefix = lang ? `/${lang}` : "";
  const [enablePopovers, setEnablePopovers] = useState(false);

  useEffect(() => {
    setEnablePopovers(true);
  }, []);

  const resolveLabel = (key: string, fallback: string) => {
    const raw = tRaw(key);
    return typeof raw === "string" ? raw : fallback;
  };

  const axisTypeLabel = (type: string) => resolveLabel(`asset.enums.dimensions.${type}.label`, type.charAt(0) + type.slice(1).toLowerCase());

  const axisKeyLabel = (key: string, fallback?: string) => {
    if (key === "SEGMENT") {
      return resolveLabel("grid.segments.badge", fallback ?? key);
    }
    if (key === "CLUSTER" || key === "MACRO_CLUSTER" || key === "ROLE") {
      return resolveLabel(`asset.enums.types.${key}.label`, fallback ?? key);
    }
    if (key === "VALUE_STREAM" || key === "DECISION_TYPE" || key === "ORGANIZATIONAL_MATURITY") {
      return resolveLabel(`asset.enums.perspectives.${key}.label`, fallback ?? key);
    }
    return fallback ?? key;
  };

  const axisItemLabel = (axisKey: string, id: string, fallback?: string) => {
    if (axisKey === "VALUE_STREAM") {
      return resolveLabel(enumAssetKey("valueStreamStage", id), fallback ?? id);
    }
    if (axisKey === "DECISION_TYPE") {
      return resolveLabel(enumAssetKey("decisionType", id), fallback ?? id);
    }
    if (axisKey === "ORGANIZATIONAL_MATURITY") {
      return resolveLabel(enumAssetKey("organizationalMaturity", id), fallback ?? id);
    }
    return fallback ?? id;
  };

  const columns = data.axes.x.items;
  const rows = data.axes.y.items;

  const cellLookup = useMemo(() => new Map<string, MatrixCell>(data.cells.map((cell) => [`${cell.xId}::${cell.yId}`, cell])), [data.cells]);

  const yAxisLabel = axisKeyLabel(data.axes.y.key, data.axes.y.label);
  const xAxisTypeLabel = axisTypeLabel(data.axes.x.type);
  const yAxisTypeLabel = axisTypeLabel(data.axes.y.type);
  const xAxisSubLabel = data.meta.scope?.cluster?.name ? axisKeyLabel(data.axes.x.key) : undefined;
  const xAxisNameLabel = data.meta.scope?.cluster?.name ?? data.axes.x.label;
  const contentTypes = data.meta.contentTypes ?? [];
  const hasSingleContentType = contentTypes.length === 1;
  const contentTypeLabel = hasSingleContentType ? t(`asset.labels.${contentTypes[0].toLowerCase()}`) : t("catalog.filtersMeta.typeOptions.all");
  const contentTypeVariant = hasSingleContentType ? contentTypes[0] : "";
  const [showTypeLegend, setShowTypeLegend] = useState(false);

  const xDim = parseAxisDimension(searchParams.get("xDim"));
  const yDim = parseAxisDimension(searchParams.get("yDim") ?? "PERSPECTIVE");
  const activePerspective = parsePerspective(searchParams.get("persp"));
  const showPerspectiveControl = xDim === "PERSPECTIVE" || yDim === "PERSPECTIVE";

  const updatePerspective = (next: MatrixPerspective) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("persp", next);
    // Replace to keep back/forward clean while syncing view state.
    router.replace(`${pathname}?${nextParams.toString()}`);
  };

  const perspectiveOptions: { value: MatrixPerspective; label: string }[] = [
    { value: MatrixPerspective.VALUE_STREAM, label: axisKeyLabel("VALUE_STREAM", t("asset.properties.valueStreamStage.label")) },
    { value: MatrixPerspective.DECISION_TYPE, label: axisKeyLabel("DECISION_TYPE", t("asset.properties.decisionType.label")) },
    {
      value: MatrixPerspective.ORGANIZATIONAL_MATURITY,
      label: axisKeyLabel("ORGANIZATIONAL_MATURITY", t("asset.properties.organizationalMaturity.label")),
    },
  ];

  const typeLegendItems = [
    { type: "concept", label: t("asset.labels.concept") },
    { type: "method", label: t("asset.labels.method") },
    { type: "tool", label: t("asset.labels.tool") },
    { type: "technology", label: t("asset.labels.technology") },
  ];

  const gridTemplateColumns = `minmax(220px, 1.1fr) repeat(${columns.length}, minmax(160px, 1fr))`;

  return (
    <div className="w-full px-6 py-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">{t("matrix.title")}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{xAxisTypeLabel}</span>
              <span className="text-slate-200">{xAxisNameLabel}</span>
            </span>
            <span className="text-slate-500">×</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{yAxisTypeLabel}</span>
              <span className="text-slate-200">{yAxisLabel}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {showPerspectiveControl && (
            <div className="grid grid-cols-3 rounded-xl border border-white/10 bg-slate-900/40 p-1 text-[11px]">
              {perspectiveOptions.map((option) => {
                const selected = activePerspective === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updatePerspective(option.value)}
                    className={`rounded-lg px-2 py-2 text-center transition ${
                      selected ? "bg-nexo-ocean/30 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
          <Badge variant={getBadgeVariant(contentTypeVariant)} size="md" radius="md" className="text-xs text-slate-400">
            {contentTypeLabel}
          </Badge>
          <button type="button" onClick={() => setShowTypeLegend((prev) => !prev)} className="text-[11px] text-slate-400 hover:text-slate-200">
            {t("matrix.controls.type")}
          </button>
        </div>
      </div>
      {showTypeLegend && (
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
          {typeLegendItems.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <TypeIndicator type={item.type} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-nexo-surface/40">
        <div className="border-b border-white/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          <div className="flex items-center">
            <div className="w-[220px]">
              <AxisTitle typeLabel={yAxisTypeLabel} nameLabel={yAxisLabel} align="left" />
            </div>
            <div className="flex-1">
              <AxisTitle typeLabel={xAxisTypeLabel} nameLabel={xAxisNameLabel} subLabel={xAxisSubLabel} align="center" />
            </div>
          </div>
        </div>
        <div className="overflow-auto">
          <div className="min-w-[720px]">
            <div className="grid" style={{ gridTemplateColumns }}>
              <div className="sticky top-0 left-0 z-30 border-b border-white/10 bg-nexo-bg/90 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400" />
              {columns.map((bucket) => (
                <div
                  key={bucket.id}
                  className="sticky top-0 z-20 border-b border-white/10 px-4 py-3 text-xs font-semibold text-slate-200 bg-nexo-bg/90"
                >
                  {axisItemLabel(data.axes.x.key, bucket.id, bucket.label)}
                </div>
              ))}

              {data.stats.totalItems === 0 ? (
                <div className="col-span-full border-b border-white/5 px-6 py-8 text-center text-sm text-slate-400">{t("matrix.empty")}</div>
              ) : (
                rows.map((rowBucket) => (
                  <Fragment key={rowBucket.id}>
                    <div className="sticky left-0 z-10 border-b border-white/5 bg-nexo-bg/80 px-4 py-3 text-sm text-slate-200">
                      {axisItemLabel(data.axes.y.key, rowBucket.id, rowBucket.label)}
                    </div>
                    {columns.map((colBucket) => {
                      const rowLabel = axisItemLabel(data.axes.y.key, rowBucket.id, rowBucket.label);
                      const colLabel = axisItemLabel(data.axes.x.key, colBucket.id, colBucket.label);
                      const cell = cellLookup.get(`${colBucket.id}::${rowBucket.id}`);
                      const items = cell?.items ?? [];
                      const visibleItems = items.slice(0, 3);
                      const remainder = Math.max(0, (cell?.count ?? 0) - visibleItems.length);

                      return (
                        <div key={`${rowBucket.id}:${colBucket.id}`} className="border-b border-white/5 px-3 py-2">
                          <div className="flex flex-col gap-2">
                            {visibleItems.map((item) => (
                              <MiniCard
                                key={item.id}
                                item={item}
                                bucketLabel={rowLabel}
                                yAxisLabel={yAxisLabel}
                                localePrefix={localePrefix}
                                t={t}
                                enablePopover={enablePopovers}
                              />
                            ))}
                            {remainder > 0 && !enablePopovers && (
                              <button className="text-left text-[11px] text-slate-500 hover:text-slate-300">+{remainder}</button>
                            )}
                            {remainder > 0 && enablePopovers && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="text-left text-[11px] text-slate-500 hover:text-slate-300">+{remainder}</button>
                                </PopoverTrigger>
                                <PopoverContent
                                  side="right"
                                  align="start"
                                  sideOffset={8}
                                  className="z-50 w-72 rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-slate-100 shadow-xl shadow-black/40"
                                >
                                  <div className="space-y-2">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                      {rowLabel} · {colLabel}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      {items.map((item) => (
                                        <Link
                                          key={item.id}
                                          href={`${localePrefix}/catalog/${item.type.toLowerCase()}/${item.slug}`}
                                          className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-2 text-[11px] text-slate-200 hover:bg-white/10"
                                        >
                                          <TypeIndicator type={item.type} />
                                          <span className="line-clamp-2 leading-none">{item.name}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </Fragment>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
