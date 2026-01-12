"use client";

import { InfoPopover } from "@/components/atoms/InfoPopover";
import { useI18n } from "@/features/i18n/I18nProvider";
import { createGridApi } from "@/services/gridApi";
import { MatrixPerspective } from "@/types/matrix";
import { AssetType } from "@/types/nexonoma";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const axisDimensions = ["STRUCTURE", "PERSPECTIVE", "CONTEXT"] as const;

type AxisDimension = (typeof axisDimensions)[number];

type GridOverviewItem = {
  id: string;
  slug: string;
  name: string;
};

const allowedAxisPair = (x: AxisDimension, y: AxisDimension) =>
  x === "STRUCTURE" && (y === "PERSPECTIVE" || y === "STRUCTURE");

const parseAxisDimension = (value?: string | null): AxisDimension => {
  if (value === "STRUCTURE" || value === "PERSPECTIVE" || value === "CONTEXT") return value;
  return "STRUCTURE";
};

const parsePerspective = (value?: string | null): MatrixPerspective => {
  if (value === "DECISION_TYPE") return MatrixPerspective.DECISION_TYPE;
  if (value === "ORGANIZATIONAL_MATURITY") return MatrixPerspective.ORGANIZATIONAL_MATURITY;
  return MatrixPerspective.VALUE_STREAM;
};

const contentTypeOptions = [
  { value: "all", labelKey: "catalog.filtersMeta.typeOptions.all" },
  { value: AssetType.CONCEPT, labelKey: "asset.labels.concept" },
  { value: AssetType.METHOD, labelKey: "asset.labels.method" },
  { value: AssetType.TOOL, labelKey: "asset.labels.tool" },
  { value: AssetType.TECHNOLOGY, labelKey: "asset.labels.technology" },
] as const;

export function MatrixRail() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [macroClusters, setMacroClusters] = useState<GridOverviewItem[]>([]);
  const [clusters, setClusters] = useState<GridOverviewItem[]>([]);
  const [yClusters, setYClusters] = useState<GridOverviewItem[]>([]);

  const xDim = parseAxisDimension(searchParams.get("xDim"));
  const yDim = parseAxisDimension(searchParams.get("yDim") ?? "PERSPECTIVE");
  const typesParam = searchParams.get("type") ?? "";
  const selectedMacroSlug = searchParams.get("macro");
  const selectedClusterSlug = searchParams.get("cluster");
  const selectedYMacroSlug = searchParams.get("yMacro");
  const selectedYClusterSlug = searchParams.get("yCluster");
  const selectedPerspective = parsePerspective(searchParams.get("persp"));

  const updateParams = useCallback(
    (updates: Record<string, string | null>, mode: "replace" | "push" = "replace") => {
      const nextParams = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, value);
        }
      });
      const queryString = nextParams.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      if (mode === "push") {
        router.push(nextUrl);
        return;
      }
      router.replace(nextUrl);
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    let cancelled = false;
    const api = createGridApi(lang);

    api
      .getOverview()
      .then((items) => {
        if (cancelled) return;
        setMacroClusters(items.map((item) => ({ id: item.id, slug: item.slug, name: item.name })));
      })
      .catch(() => {
        if (cancelled) return;
        setMacroClusters([]);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const resolvedMacroSlug = useMemo(() => {
    if (selectedMacroSlug) return selectedMacroSlug;
    return macroClusters[0]?.slug ?? "";
  }, [macroClusters, selectedMacroSlug]);

  const resolvedYMacroSlug = useMemo(() => {
    if (selectedYMacroSlug) return selectedYMacroSlug;
    if (yDim === "STRUCTURE") {
      return selectedMacroSlug ?? macroClusters[0]?.slug ?? "";
    }
    return "";
  }, [macroClusters, selectedMacroSlug, selectedYMacroSlug, yDim]);

  useEffect(() => {
    if (!resolvedMacroSlug) return;
    let cancelled = false;
    const api = createGridApi(lang);

    api
      .getMacroClusterView(resolvedMacroSlug)
      .then((view) => {
        if (cancelled) return;
        setClusters(view.clusters.map((item) => ({ id: item.id, slug: item.slug, name: item.name })));
      })
      .catch(() => {
        if (cancelled) return;
        setClusters([]);
      });

    return () => {
      cancelled = true;
    };
  }, [lang, resolvedMacroSlug]);

  useEffect(() => {
    if (yDim !== "STRUCTURE") {
      setYClusters([]);
      return;
    }
    if (!resolvedYMacroSlug) return;
    let cancelled = false;
    const api = createGridApi(lang);

    api
      .getMacroClusterView(resolvedYMacroSlug)
      .then((view) => {
        if (cancelled) return;
        setYClusters(view.clusters.map((item) => ({ id: item.id, slug: item.slug, name: item.name })));
      })
      .catch(() => {
        if (cancelled) return;
        setYClusters([]);
      });

    return () => {
      cancelled = true;
    };
  }, [lang, resolvedYMacroSlug, yDim]);

  useEffect(() => {
    if (!macroClusters.length) return;
    if (!selectedMacroSlug) {
      // Sync default macro via replace to avoid history noise.
      updateParams({ macro: macroClusters[0]?.slug ?? null }, "replace");
    }
  }, [macroClusters, selectedMacroSlug, updateParams]);

  useEffect(() => {
    if (yDim !== "STRUCTURE") return;
    if (!macroClusters.length) return;
    if (!selectedYMacroSlug) {
      const fallbackMacro = selectedMacroSlug ?? macroClusters[0]?.slug ?? null;
      updateParams({ yMacro: fallbackMacro }, "replace");
    }
  }, [macroClusters, selectedMacroSlug, selectedYMacroSlug, updateParams, yDim]);

  useEffect(() => {
    if (!clusters.length) return;
    const clusterBySlug = selectedClusterSlug ? clusters.find((cluster) => cluster.slug === selectedClusterSlug) : null;
    const fallback = clusters[0];
    const resolved = clusterBySlug ?? fallback;
    if (!resolved) return;

    if (selectedClusterSlug !== resolved.slug) {
      // Keep URL in sync with resolved cluster for SSR.
      updateParams({ cluster: resolved.slug }, "replace");
    }
  }, [clusters, selectedClusterSlug, updateParams]);

  useEffect(() => {
    if (yDim !== "STRUCTURE") return;
    if (!yClusters.length) return;
    const clusterBySlug = selectedYClusterSlug ? yClusters.find((cluster) => cluster.slug === selectedYClusterSlug) : null;
    const clusterByXAxis = selectedClusterSlug ? yClusters.find((cluster) => cluster.slug === selectedClusterSlug) : null;
    const fallback = yClusters[0];
    const resolved = clusterBySlug ?? clusterByXAxis ?? fallback;
    if (!resolved) return;

    if (selectedYClusterSlug !== resolved.slug) {
      updateParams({ yCluster: resolved.slug }, "replace");
    }
  }, [selectedClusterSlug, selectedYClusterSlug, updateParams, yClusters, yDim]);

  useEffect(() => {
    if (allowedAxisPair(xDim, yDim)) return;
    // Default axis pair for stable SSR.
    updateParams({ xDim: "STRUCTURE", yDim: "PERSPECTIVE" }, "replace");
  }, [updateParams, xDim, yDim]);

  const selectedTypeValue = useMemo(() => {
    if (!typesParam) return "all";
    const normalized = typesParam.trim().toLowerCase();
    if (normalized === "concept") return AssetType.CONCEPT;
    if (normalized === "method") return AssetType.METHOD;
    if (normalized === "tool") return AssetType.TOOL;
    if (normalized === "technology") return AssetType.TECHNOLOGY;
    return "all";
  }, [typesParam]);

  const sectionTitle = "text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500";
  const fieldLabel = "text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600";
  const axisDimensionLabel = (value: AxisDimension) => t(`asset.enums.dimensions.${value}.label`);
  const perspectiveOptions: { value: MatrixPerspective; label: string }[] = [
    { value: MatrixPerspective.VALUE_STREAM, label: t("asset.enums.perspectives.VALUE_STREAM.label") },
    { value: MatrixPerspective.DECISION_TYPE, label: t("asset.enums.perspectives.DECISION_TYPE.label") },
    { value: MatrixPerspective.ORGANIZATIONAL_MATURITY, label: t("asset.enums.perspectives.ORGANIZATIONAL_MATURITY.label") },
  ];

  const axisCard = (axis: "x" | "y") => {
    const currentDim = axis === "x" ? xDim : yDim;
    const otherDim = axis === "x" ? yDim : xDim;

    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <InfoPopover content={<p>{t("matrix.tooltips.axis")}</p>} icon iconColor="text-slate-500">
            <div className={sectionTitle}>{axis === "x" ? "X-Achse" : "Y-Achse"}</div>
          </InfoPopover>
          {currentDim === "CONTEXT" && <span className="text-[11px] text-slate-500">Coming soon</span>}
        </div>

        <div className="space-y-2">
          <InfoPopover content={<p>{t("matrix.tooltips.dimension")}</p>} icon iconColor="text-slate-500">
            <div className={fieldLabel}>Dimension</div>
          </InfoPopover>
          <div className="relative w-full">
            <select
              value={currentDim}
              onChange={(e) => {
                const nextDim = parseAxisDimension(e.target.value);
                updateParams({
                  [axis === "x" ? "xDim" : "yDim"]: nextDim,
                }, "push");
              }}
              className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
            >
              {axisDimensions.map((value) => (
                <option
                  key={value}
                  value={value}
                  className="bg-slate-900 text-slate-200"
                  disabled={!allowedAxisPair(axis === "x" ? value : otherDim, axis === "x" ? otherDim : value)}
                >
                  {axisDimensionLabel(value)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {currentDim === "STRUCTURE" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <InfoPopover content={<p>{t("matrix.tooltips.macro")}</p>} icon iconColor="text-slate-500">
                <div className={fieldLabel}>
                  {axis === "x" ? t("grid.macro.badge") : t("matrix.axis.y.macroCluster.label")}
                </div>
              </InfoPopover>
              <div className="relative w-full">
                <select
                  value={axis === "x" ? resolvedMacroSlug : resolvedYMacroSlug}
                  onChange={(e) =>
                    updateParams(
                      axis === "x" ? { macro: e.target.value, cluster: null } : { yMacro: e.target.value, yCluster: null },
                      "push"
                    )
                  }
                  disabled={macroClusters.length === 0}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {!macroClusters.length && (
                    <option value="" className="bg-slate-900 text-slate-400">
                      {axis === "x" ? t("grid.macro.badge") : t("matrix.axis.y.macroCluster.label")}
                    </option>
                  )}
                  {macroClusters.length > 0 && !(axis === "x" ? resolvedMacroSlug : resolvedYMacroSlug) && (
                    <option value="" className="bg-slate-900 text-slate-400">
                      {axis === "x" ? t("grid.macro.badge") : t("matrix.axis.y.macroCluster.label")}
                    </option>
                  )}
                  {macroClusters.map((macro) => (
                    <option key={macro.id} value={macro.slug} className="bg-slate-900 text-slate-200">
                      {macro.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <InfoPopover content={<p>{t("matrix.tooltips.cluster")}</p>} icon iconColor="text-slate-500">
                <div className={fieldLabel}>
                  {axis === "x" ? t("grid.clusters.badge") : t("matrix.axis.y.cluster.label")}
                </div>
              </InfoPopover>
              <div className="relative w-full">
                <select
                  value={
                    axis === "x"
                      ? selectedClusterSlug ?? clusters[0]?.slug ?? ""
                      : selectedYClusterSlug ?? yClusters[0]?.slug ?? ""
                  }
                  onChange={(e) => {
                    if (axis === "x") {
                      const cluster = clusters.find((item) => item.slug === e.target.value);
                      updateParams({ cluster: cluster?.slug ?? null }, "push");
                      return;
                    }
                    const cluster = yClusters.find((item) => item.slug === e.target.value);
                    updateParams({ yCluster: cluster?.slug ?? null }, "push");
                  }}
                  disabled={
                    axis === "x"
                      ? !resolvedMacroSlug || clusters.length === 0
                      : !resolvedYMacroSlug || yClusters.length === 0
                  }
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {axis === "x" && !resolvedMacroSlug && (
                    <option value="" className="bg-slate-900 text-slate-400">
                      {t("grid.macro.badge")}
                    </option>
                  )}
                  {axis === "y" && !resolvedYMacroSlug && (
                    <option value="" className="bg-slate-900 text-slate-400">
                      {t("matrix.axis.y.macroCluster.label")}
                    </option>
                  )}
                  {axis === "x" && resolvedMacroSlug && clusters.length === 0 && (
                    <option value="" className="bg-slate-900 text-slate-400">
                      {t("grid.clusters.badge")}
                    </option>
                  )}
                  {axis === "y" && resolvedYMacroSlug && yClusters.length === 0 && (
                    <option value="" className="bg-slate-900 text-slate-400">
                      {t("matrix.axis.y.cluster.label")}
                    </option>
                  )}
                  {axis === "x" && resolvedMacroSlug && clusters.length > 0 && !selectedClusterSlug && (
                    <option value="" className="bg-slate-900 text-slate-400">
                      {t("grid.clusters.badge")}
                    </option>
                  )}
                  {axis === "y" && resolvedYMacroSlug && yClusters.length > 0 && !selectedYClusterSlug && (
                    <option value="" className="bg-slate-900 text-slate-400">
                      {t("matrix.axis.y.cluster.label")}
                    </option>
                  )}
                  {(axis === "x" ? clusters : yClusters).map((cluster) => (
                    <option key={cluster.id} value={cluster.slug} className="bg-slate-900 text-slate-200">
                      {cluster.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {axis === "y" && currentDim === "PERSPECTIVE" && (
          <div className="space-y-2">
            <InfoPopover content={<p>{t("matrix.tooltips.perspective")}</p>} icon iconColor="text-slate-500">
              <div className={fieldLabel}>{t("matrix.axis.y.perspective.label")}</div>
            </InfoPopover>
            <div className="relative w-full">
              <select
                value={selectedPerspective}
                onChange={(e) => updateParams({ persp: e.target.value }, "push")}
                className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
              >
                {perspectiveOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-slate-900 text-slate-200">
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {currentDim === "CONTEXT" && (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-3 py-3 text-xs text-slate-500">
            Context ist aktuell nicht verfügbar.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className={sectionTitle}>Axis Config</div>
        <div className="space-y-3">
          {axisCard("x")}
          {axisCard("y")}
        </div>
      </div>

      <div className="space-y-3">
        <div className={sectionTitle}>Filter</div>
        <div className="space-y-2">
          <InfoPopover content={<p>{t("matrix.tooltips.type")}</p>} icon iconColor="text-slate-500">
            <div className={fieldLabel}>{t("matrix.controls.type")}</div>
          </InfoPopover>
          <div className="relative w-full">
            <select
              value={selectedTypeValue}
              onChange={(e) => {
                const next = e.target.value;
                if (next === "all") {
                  updateParams({ type: null }, "push");
                } else {
                  updateParams({ type: next.toLowerCase() }, "push");
                }
              }}
              className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
            >
              {contentTypeOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-900 text-slate-200">
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
