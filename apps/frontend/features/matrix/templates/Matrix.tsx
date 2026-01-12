"use client";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/features/i18n/I18nProvider";
import type { MatrixAssetPreview, MatrixCell, MatrixViewResponseDto } from "@/types/matrix";
import { MatrixPerspective } from "@/types/matrix";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";

type AxisTitleProps = {
  typeLabel: string;
  nameLabel: string;
  align?: "left" | "center";
};

function AxisTitle({ typeLabel, nameLabel, align = "left" }: AxisTitleProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${align === "center" ? "items-center text-center" : "items-start"}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{typeLabel}</span>
      <span className="text-xs font-semibold text-slate-200">{nameLabel}</span>
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

function MiniCard({ item, bucketLabel, yAxisLabel, localePrefix, t, enablePopover }: MiniCardProps) {
  const [open, setOpen] = useState(false);
  const typeLabel = t(`asset.labels.${item.type.toLowerCase()}`);
  const cellHref = `${localePrefix}/catalog/${item.type.toLowerCase()}/${item.slug}`;
  const description = `${item.name} – kurzer Überblick zu Zweck und Einsatz.`;

  if (!enablePopover) {
    return (
      <Link
        href={cellHref}
        className="group flex w-full items-start gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-2 text-left text-xs text-slate-200 hover:bg-white/10"
      >
        <Badge variant={getBadgeVariant(item.type)} size="sm" radius="full" className="mt-0.5 shrink-0">
          {typeLabel}
        </Badge>
        <span className="line-clamp-2 text-[11px] leading-snug text-slate-200 group-hover:text-white">{item.name}</span>
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
          className="group flex w-full items-start gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-2 text-left text-xs text-slate-200 hover:bg-white/10"
        >
          <Badge variant={getBadgeVariant(item.type)} size="sm" radius="full" className="mt-0.5 shrink-0">
            {typeLabel}
          </Badge>
          <span className="line-clamp-2 text-[11px] leading-snug text-slate-200 group-hover:text-white">{item.name}</span>
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
          <div className="text-sm font-semibold text-white">{item.name}</div>
          <div className="text-slate-300">{description}</div>
          <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
            <span>{typeLabel}</span>
            <span>•</span>
            <span>
              {yAxisLabel}: {bucketLabel}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type MatrixProps = {
  data: MatrixViewResponseDto;
};

const toAxisTypeLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

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
  const { t, lang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const localePrefix = lang ? `/${lang}` : "";
  const [enablePopovers, setEnablePopovers] = useState(false);

  useEffect(() => {
    setEnablePopovers(true);
  }, []);

  const columns = data.axes.x.items;
  const rows = data.axes.y.items;

  const cellLookup = useMemo(
    () => new Map<string, MatrixCell>(data.cells.map((cell) => [`${cell.xId}::${cell.yId}`, cell])),
    [data.cells]
  );

  const xAxisLabel = data.axes.x.label;
  const yAxisLabel = data.axes.y.label;
  const xAxisTypeLabel = toAxisTypeLabel(data.axes.x.type);
  const yAxisTypeLabel = toAxisTypeLabel(data.axes.y.type);
  const contentTypes = data.meta.contentTypes ?? [];
  const hasSingleContentType = contentTypes.length === 1;
  const contentTypeLabel = hasSingleContentType
    ? t(`asset.labels.${contentTypes[0].toLowerCase()}`)
    : t("catalog.filtersMeta.typeOptions.all");
  const contentTypeVariant = hasSingleContentType ? contentTypes[0] : "";

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
    { value: MatrixPerspective.VALUE_STREAM, label: t("asset.properties.valueStreamStage.label") },
    { value: MatrixPerspective.DECISION_TYPE, label: t("asset.properties.decisionType.label") },
    { value: MatrixPerspective.ORGANIZATIONAL_MATURITY, label: t("asset.properties.organizationalMaturity.label") },
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
              <span className="text-slate-200">{xAxisLabel}</span>
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
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-nexo-surface/40">
        <div className="border-b border-white/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          <div className="flex items-center">
            <div className="w-[220px]">
              <AxisTitle typeLabel={yAxisTypeLabel} nameLabel={yAxisLabel} align="left" />
            </div>
            <div className="flex-1">
              <AxisTitle typeLabel={xAxisTypeLabel} nameLabel={xAxisLabel} align="center" />
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
                  {bucket.label}
                </div>
              ))}

              {data.stats.totalItems === 0 ? (
                <div className="col-span-full border-b border-white/5 px-6 py-8 text-center text-sm text-slate-400">
                  {t("matrix.empty")}
                </div>
              ) : (
                rows.map((rowBucket) => (
                  <Fragment key={rowBucket.id}>
                    <div className="sticky left-0 z-10 border-b border-white/5 bg-nexo-bg/80 px-4 py-3 text-sm text-slate-200">
                      {rowBucket.label}
                    </div>
                    {columns.map((colBucket) => {
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
                                bucketLabel={rowBucket.label}
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
                                      {rowBucket.label} · {colBucket.label}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      {items.map((item) => (
                                        <Link
                                          key={item.id}
                                          href={`${localePrefix}/catalog/${item.type.toLowerCase()}/${item.slug}`}
                                          className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-2 text-[11px] text-slate-200 hover:bg-white/10"
                                        >
                                          <Badge variant={getBadgeVariant(item.type)} size="sm" radius="full" className="mt-0.5 shrink-0">
                                            {t(`asset.labels.${item.type.toLowerCase()}`)}
                                          </Badge>
                                          <span className="line-clamp-2">{item.name}</span>
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
