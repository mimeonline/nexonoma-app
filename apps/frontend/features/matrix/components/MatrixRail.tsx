"use client";

import { useI18n } from "@/features/i18n/I18nProvider";
import { createGridApi } from "@/services/gridApi";
import { AssetType } from "@/types/nexonoma";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const axisDimensions = ["structure", "perspective", "context"] as const;

type AxisDimension = (typeof axisDimensions)[number];

type PerspectiveOption = "value_stream" | "decision_type" | "organizational_maturity";

type GridOverviewItem = {
  id: string;
  slug: string;
  name: string;
};

const allowedAxisPair = (x: AxisDimension, y: AxisDimension) => x === "structure" && y === "perspective";

const parseAxisDimension = (value?: string | null): AxisDimension => {
  if (value === "structure" || value === "perspective" || value === "context") return value;
  return "structure";
};

const parsePerspective = (value?: string | null): PerspectiveOption => {
  if (value === "decision_type" || value === "organizational_maturity" || value === "value_stream") return value;
  return "value_stream";
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

  const xDim = parseAxisDimension(searchParams.get("xDim"));
  const yDim = parseAxisDimension(searchParams.get("yDim") ?? "perspective");
  const perspective = parsePerspective(searchParams.get("perspective"));
  const typesParam = searchParams.get("types") ?? "";
  const selectedMacroSlug = searchParams.get("macroClusterSlug");
  const selectedClusterSlug = searchParams.get("clusterSlug");
  const selectedClusterId = searchParams.get("clusterId");

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, value);
        }
      });
      const queryString = nextParams.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
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
    if (!macroClusters.length) return;
    if (!selectedMacroSlug) {
      updateParams({ macroClusterSlug: macroClusters[0]?.slug ?? null });
    }
  }, [macroClusters, selectedMacroSlug, updateParams]);

  useEffect(() => {
    if (!clusters.length) return;
    const clusterBySlug = selectedClusterSlug ? clusters.find((cluster) => cluster.slug === selectedClusterSlug) : null;
    const clusterById = selectedClusterId ? clusters.find((cluster) => cluster.id === selectedClusterId) : null;
    const fallback = clusters[0];
    const resolved = clusterBySlug ?? clusterById ?? fallback;
    if (!resolved) return;

    if (selectedClusterSlug !== resolved.slug || selectedClusterId !== resolved.id) {
      updateParams({ clusterSlug: resolved.slug, clusterId: resolved.id });
    }
  }, [clusters, selectedClusterId, selectedClusterSlug, updateParams]);

  useEffect(() => {
    if (allowedAxisPair(xDim, yDim)) return;
    updateParams({ xDim: "structure", yDim: "perspective" });
  }, [updateParams, xDim, yDim]);

  const perspectiveLabel = (value: PerspectiveOption) => {
    if (value === "decision_type") return t("asset.properties.decisionType.label");
    if (value === "organizational_maturity") return t("asset.properties.organizationalMaturity.label");
    return t("asset.properties.valueStreamStage.label");
  };

  const selectedTypeValue = useMemo(() => {
    if (!typesParam) return "all";
    const entry = typesParam.split(",").map((type) => type.trim().toUpperCase());
    const single = entry.length === 1 ? entry[0] : "";
    if (single === AssetType.CONCEPT || single === AssetType.METHOD || single === AssetType.TOOL || single === AssetType.TECHNOLOGY) {
      return single;
    }
    return "all";
  }, [typesParam]);

  const sectionTitle = "text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500";
  const fieldLabel = "text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600";

  const axisCard = (axis: "x" | "y") => {
    const currentDim = axis === "x" ? xDim : yDim;
    const otherDim = axis === "x" ? yDim : xDim;

    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className={sectionTitle}>{axis === "x" ? "X-Achse" : "Y-Achse"}</div>
          {currentDim === "context" && <span className="text-[11px] text-slate-500">Coming soon</span>}
        </div>

        <div className="space-y-2">
          <div className={fieldLabel}>Dimension</div>
          <div className="relative w-full">
            <select
              value={currentDim}
              onChange={(e) => {
                const nextDim = parseAxisDimension(e.target.value);
                updateParams({
                  [axis === "x" ? "xDim" : "yDim"]: nextDim,
                  ...(axis === "y" && nextDim === "perspective" ? { perspective } : {}),
                });
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
                  {value.charAt(0).toUpperCase() + value.slice(1)}
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

        {currentDim === "structure" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className={fieldLabel}>MacroCluster</div>
              <div className="relative w-full">
                <select
                  value={resolvedMacroSlug}
                  onChange={(e) => updateParams({ macroClusterSlug: e.target.value, clusterSlug: null, clusterId: null })}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
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
              <div className={fieldLabel}>Cluster</div>
              <div className="relative w-full">
                <select
                  value={selectedClusterSlug ?? clusters[0]?.slug ?? ""}
                  onChange={(e) => {
                    const cluster = clusters.find((item) => item.slug === e.target.value);
                    updateParams({
                      clusterSlug: cluster?.slug ?? null,
                      clusterId: cluster?.id ?? null,
                    });
                  }}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {clusters.map((cluster) => (
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

        {currentDim === "perspective" && (
          <div className="space-y-2">
            <div className={fieldLabel}>Perspective</div>
            <div className="grid grid-cols-3 rounded-xl border border-white/10 bg-slate-900/40 p-1 text-[11px]">
              {(["value_stream", "decision_type", "organizational_maturity"] as PerspectiveOption[]).map((option) => {
                const selected = perspective === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateParams({ perspective: option })}
                    className={`rounded-lg px-2 py-2 text-center transition ${
                      selected ? "bg-nexo-ocean/30 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {perspectiveLabel(option)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentDim === "context" && (
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
          <div className={fieldLabel}>{t("matrix.controls.type")}</div>
          <div className="relative w-full">
            <select
              value={selectedTypeValue}
              onChange={(e) => {
                const next = e.target.value;
                if (next === "all") {
                  updateParams({ types: null });
                } else {
                  updateParams({ types: next.toLowerCase() });
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
