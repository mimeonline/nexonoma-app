"use client";

import { Badge, getBadgeVariant } from "@/components/ui/atoms/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/features/i18n/I18nProvider";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import {
  decisionTypes,
  layers,
  matrixClusters,
  matrixContents,
  matrixMacroClusters,
  matrixSegments,
  organizationalMaturities,
  profiles,
  roles,
  sdlcStages,
  valueStreamStages,
  domains,
} from "../data/matrixData";
import { AxisDimension, AxisType, useMatrixState } from "../state/MatrixProvider";

const sdlcLabels: Record<string, string> = {
  ANALYZE: "Analyze",
  DESIGN: "Design",
  BUILD: "Build",
  OPERATE: "Operate",
};

type AxisBucket = {
  id: string;
  label: string;
};

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
  item: typeof matrixContents[number];
  bucketLabel: string;
  yAxisLabel: string;
  localePrefix: string;
  t: (key: string) => string;
};

function MiniCard({ item, bucketLabel, yAxisLabel, localePrefix, t }: MiniCardProps) {
  const [open, setOpen] = useState(false);
  const typeLabel = t(`asset.labels.${item.type.toLowerCase()}`);
  const cellHref = `${localePrefix}/catalog/${item.type.toLowerCase()}/${item.slug}`;
  const description = `${item.name} – kurzer Überblick zu Zweck und Einsatz.`;

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

export default function Matrix() {
  const { t, lang } = useI18n();
  const { macroClusterId, clusterId, xAxisType, xAxisDimension, yAxisType, yAxisDimension, contentType } = useMatrixState();
  const localePrefix = lang ? `/${lang}` : "";

  const segmentById = useMemo(() => new Map(matrixSegments.map((segment) => [segment.id, segment])), []);
  const clusterById = useMemo(() => new Map(matrixClusters.map((cluster) => [cluster.id, cluster])), []);

  const segmentsInScope = useMemo(
    () => matrixSegments.filter((segment) => segment.clusterId === clusterId),
    [clusterId]
  );

  const segmentsInScopeIds = useMemo(() => new Set(segmentsInScope.map((segment) => segment.id)), [segmentsInScope]);

  const filteredContents = useMemo(() => {
    return matrixContents
      .filter((item) => (contentType === "all" ? true : item.type === contentType))
      .filter((item) => item.segmentIds.some((segmentId) => segmentsInScopeIds.has(segmentId)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [contentType, segmentsInScopeIds]);

  const axisLabel = (type: AxisType, dimension: AxisDimension) => {
    if (type === "structure") {
      if (dimension === "macroCluster") return "MacroCluster";
      if (dimension === "cluster") return "Cluster";
      return t("matrix.controls.segment");
    }
    if (type === "context") {
      if (dimension === "role") return "Role";
      if (dimension === "profile") return "Profile";
      if (dimension === "domain") return "Domain";
      return "Layer";
    }
    if (dimension === "valueStreamStage") return t("asset.properties.valueStreamStage.label");
    if (dimension === "sdlcStage") return "SDLC";
    if (dimension === "decisionType") return t("asset.properties.decisionType.label");
    return t("asset.properties.organizationalMaturity.label");
  };

  const axisBuckets = (type: AxisType, dimension: AxisDimension): AxisBucket[] => {
    if (type === "structure") {
      if (dimension === "macroCluster") {
        return [...matrixMacroClusters]
          .sort((a, b) => a.order - b.order)
          .map((macro) => ({ id: macro.id, label: macro.name }));
      }
      if (dimension === "cluster") {
        return matrixClusters
          .filter((cluster) => cluster.macroClusterId === macroClusterId)
          .sort((a, b) => a.order - b.order)
          .map((cluster) => ({ id: cluster.id, label: cluster.name }));
      }
      return segmentsInScope.map((segment) => ({ id: segment.id, label: segment.name }));
    }

    if (type === "context") {
      if (dimension === "role") return roles.map((value) => ({ id: value, label: value }));
      if (dimension === "profile") return profiles.map((value) => ({ id: value, label: value }));
      if (dimension === "domain") return domains.map((value) => ({ id: value, label: value }));
      return layers.map((value) => ({ id: value, label: value }));
    }

    if (dimension === "decisionType") {
      return decisionTypes.map((value) => ({ id: value, label: t(`asset.enums.decisionType.${value}.label`) }));
    }
    if (dimension === "organizationalMaturity") {
      return organizationalMaturities.map((value) => ({ id: value, label: t(`asset.enums.organizationalMaturity.${value}.label`) }));
    }
    if (dimension === "sdlcStage") {
      return sdlcStages.map((value) => ({ id: value, label: sdlcLabels[value] ?? value }));
    }

    return valueStreamStages.map((value) => ({ id: value, label: t(`asset.enums.valueStreamStage.${value}.label`) }));
  };

  const matchesAxis = (item: typeof matrixContents[number], type: AxisType, dimension: AxisDimension, bucketId: string) => {
    if (type === "structure") {
      if (dimension === "segment") return item.segmentIds.includes(bucketId);
      if (dimension === "cluster") {
        return item.segmentIds.some((segmentId) => segmentById.get(segmentId)?.clusterId === bucketId);
      }
      return item.segmentIds.some((segmentId) => {
        const clusterIdForSegment = segmentById.get(segmentId)?.clusterId;
        const macroId = clusterById.get(clusterIdForSegment ?? "")?.macroClusterId;
        return macroId === bucketId;
      });
    }

    if (type === "context") {
      if (dimension === "role") return item.role === bucketId;
      if (dimension === "profile") return item.profile === bucketId;
      if (dimension === "domain") return item.domain === bucketId;
      return item.layer === bucketId;
    }

    if (dimension === "decisionType") return item.decisionType === bucketId;
    if (dimension === "organizationalMaturity") return item.organizationalMaturity === bucketId;
    if (dimension === "sdlcStage") return item.sdlcStage === bucketId;
    return item.valueStreamStage === bucketId;
  };

  const xAxisLabel = axisLabel(xAxisType, xAxisDimension);
  const yAxisLabel = axisLabel(yAxisType, yAxisDimension);
  const xAxisTypeLabel = xAxisType.charAt(0).toUpperCase() + xAxisType.slice(1);
  const yAxisTypeLabel = yAxisType.charAt(0).toUpperCase() + yAxisType.slice(1);

  const xAxisBuckets = axisBuckets(xAxisType, xAxisDimension);
  const yAxisBuckets = axisBuckets(yAxisType, yAxisDimension);

  const gridTemplateColumns = `minmax(220px, 1.1fr) repeat(${xAxisBuckets.length}, minmax(160px, 1fr))`;

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
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <Badge variant={getBadgeVariant(contentType === "all" ? "" : contentType)} size="md" radius="md">
            {contentType === "all" ? t("catalog.filtersMeta.typeOptions.all") : t(`asset.labels.${contentType.toLowerCase()}`)}
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
              {xAxisBuckets.map((bucket) => (
                <div
                  key={bucket.id}
                  className="sticky top-0 z-20 border-b border-white/10 px-4 py-3 text-xs font-semibold text-slate-200 bg-nexo-bg/90"
                >
                  {bucket.label}
                </div>
              ))}

              {filteredContents.length === 0 ? (
                <div className="col-span-full border-b border-white/5 px-6 py-8 text-center text-sm text-slate-400">
                  {t("matrix.empty")}
                </div>
              ) : (
                yAxisBuckets.map((rowBucket) => (
                  <Fragment key={rowBucket.id}>
                    <div className="sticky left-0 z-10 border-b border-white/5 bg-nexo-bg/80 px-4 py-3 text-sm text-slate-200">
                      {rowBucket.label}
                    </div>
                    {xAxisBuckets.map((colBucket) => {
                      const items = filteredContents.filter(
                        (item) =>
                          matchesAxis(item, yAxisType, yAxisDimension, rowBucket.id) &&
                          matchesAxis(item, xAxisType, xAxisDimension, colBucket.id)
                      );
                      const visibleItems = items.slice(0, 3);
                      const remainder = items.length - visibleItems.length;

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
                              />
                            ))}
                            {remainder > 0 && (
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
