"use client";

import { useI18n } from "@/features/i18n/I18nProvider";
import { AssetType } from "@/types/nexonoma";
import { useMemo } from "react";
import { layers, matrixClusters, matrixMacroClusters, profiles, roles, domains } from "../data/matrixData";
import { AxisType, useMatrixState } from "../state/MatrixProvider";

const axisTypeOptions: { value: AxisType; label: string }[] = [
  { value: "structure", label: "Structure" },
  { value: "perspective", label: "Perspective" },
  { value: "context", label: "Context" },
];

export function MatrixRail() {
  const { t } = useI18n();
  const {
    macroClusterId,
    clusterId,
    xAxisType,
    xAxisDimension,
    yAxisType,
    yAxisDimension,
    contentType,
    role,
    profile,
    domain,
    layer,
    setMacroClusterId,
    setClusterId,
    setXAxisType,
    setXAxisDimension,
    setYAxisType,
    setYAxisDimension,
    setContentType,
    setRole,
    setProfile,
    setDomain,
    setLayer,
  } = useMatrixState();

  const typeOptions = useMemo(
    () => ["all", AssetType.CONCEPT, AssetType.METHOD, AssetType.TOOL, AssetType.TECHNOLOGY] as const,
    []
  );
  const orderedMacroClusters = useMemo(() => [...matrixMacroClusters].sort((a, b) => a.order - b.order), []);
  const orderedClusters = useMemo(
    () =>
      matrixClusters
        .filter((cluster) => cluster.macroClusterId === macroClusterId)
        .sort((a, b) => a.order - b.order),
    [macroClusterId]
  );

  const dimensionOptions = useMemo(() => {
    return {
      structure: [
        { value: "macroCluster", label: "MacroCluster" },
        { value: "cluster", label: "Cluster" },
        { value: "segment", label: t("matrix.controls.segment") },
      ],
      perspective: [
        { value: "valueStreamStage", label: t("asset.properties.valueStreamStage.label") },
        { value: "sdlcStage", label: "SDLC" },
        { value: "decisionType", label: t("asset.properties.decisionType.label") },
        { value: "organizationalMaturity", label: t("asset.properties.organizationalMaturity.label") },
      ],
      context: [
        { value: "role", label: "Role" },
        { value: "profile", label: "Profile" },
        { value: "domain", label: "Domain" },
        { value: "layer", label: "Layer" },
      ],
    } as const;
  }, [t]);

  const isYAxisTypeDisabled = (value: AxisType) => xAxisType === "context" && value === "context";
  const isXAxisTypeDisabled = (value: AxisType) => yAxisType === "context" && value === "context";

  const isYAxisDimensionDisabled = (value: string) =>
    xAxisType === yAxisType && (xAxisType === "structure" || xAxisType === "perspective") && value === xAxisDimension;

  const axisHelperText = (() => {
    if (xAxisType === "context") return "Context cannot be compared directly with Context.";
    if (xAxisType === yAxisType && (xAxisType === "structure" || xAxisType === "perspective") && xAxisDimension === yAxisDimension) {
      return xAxisType === "structure" ? "Choose a different structure level." : "Choose an orthogonal perspective.";
    }
    return "";
  })();

  const showContextFilters = xAxisType !== "context" && yAxisType !== "context";

  const sectionTitle = "text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500";
  const fieldLabel = "text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className={sectionTitle}>Axis Setup</div>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className={fieldLabel}>X Axis</div>
            <div className="space-y-2">
              <div className="relative w-full">
                <select
                  value={xAxisType}
                  onChange={(e) => setXAxisType(e.target.value as AxisType)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {axisTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200" disabled={isXAxisTypeDisabled(opt.value)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="relative w-full">
                <select
                  value={xAxisDimension}
                  onChange={(e) => setXAxisDimension(e.target.value as typeof xAxisDimension)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {dimensionOptions[xAxisType].map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                      {opt.label}
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

          <div className="space-y-3">
            <div className={fieldLabel}>Y Axis</div>
            <div className="space-y-2">
              <div className="relative w-full">
                <select
                  value={yAxisType}
                  onChange={(e) => setYAxisType(e.target.value as AxisType)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {axisTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200" disabled={isYAxisTypeDisabled(opt.value)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="relative w-full">
                <select
                  value={yAxisDimension}
                  onChange={(e) => setYAxisDimension(e.target.value as typeof yAxisDimension)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  {dimensionOptions[yAxisType].map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      className="bg-slate-900 text-slate-200"
                      disabled={isYAxisDimensionDisabled(opt.value)}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              {axisHelperText && <div className="text-[11px] text-slate-500">{axisHelperText}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className={sectionTitle}>Structure</div>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className={fieldLabel}>MacroCluster</div>
            <div className="relative w-full">
              <select
                value={macroClusterId}
                onChange={(e) => setMacroClusterId(e.target.value)}
                className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
              >
                {orderedMacroClusters.map((macro) => (
                  <option key={macro.id} value={macro.id} className="bg-slate-900 text-slate-200">
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
                value={clusterId}
                onChange={(e) => setClusterId(e.target.value)}
                className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
              >
                {orderedClusters.map((cluster) => (
                  <option key={cluster.id} value={cluster.id} className="bg-slate-900 text-slate-200">
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
      </div>

      {showContextFilters && (
        <div className="space-y-4">
          <div className={sectionTitle}>Context</div>
          <div className="space-y-3">
            <div className="space-y-2">
              <div className={fieldLabel}>Role</div>
              <div className="relative w-full">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="all" className="bg-slate-900 text-slate-200">
                    {t("catalog.filtersMeta.typeOptions.all")}
                  </option>
                  {roles.map((value) => (
                    <option key={value} value={value} className="bg-slate-900 text-slate-200">
                      {value}
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
              <div className={fieldLabel}>Profile</div>
              <div className="relative w-full">
                <select
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="all" className="bg-slate-900 text-slate-200">
                    {t("catalog.filtersMeta.typeOptions.all")}
                  </option>
                  {profiles.map((value) => (
                    <option key={value} value={value} className="bg-slate-900 text-slate-200">
                      {value}
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
              <div className={fieldLabel}>Domain</div>
              <div className="relative w-full">
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="all" className="bg-slate-900 text-slate-200">
                    {t("catalog.filtersMeta.typeOptions.all")}
                  </option>
                  {domains.map((value) => (
                    <option key={value} value={value} className="bg-slate-900 text-slate-200">
                      {value}
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
              <div className={fieldLabel}>Layer</div>
              <div className="relative w-full">
                <select
                  value={layer}
                  onChange={(e) => setLayer(e.target.value)}
                  className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
                >
                  <option value="all" className="bg-slate-900 text-slate-200">
                    {t("catalog.filtersMeta.typeOptions.all")}
                  </option>
                  {layers.map((value) => (
                    <option key={value} value={value} className="bg-slate-900 text-slate-200">
                      {value}
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
      )}

      <div className="space-y-4">
        <div className={sectionTitle}>Filter</div>
        <div className="space-y-2">
          <div className={fieldLabel}>{t("matrix.controls.type")}</div>
          <div className="relative w-full">
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as AssetType | "all")}
              className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-white/5 pl-3 pr-10 py-2 text-sm text-slate-200 outline-none focus:border-nexo-ocean/50 focus:bg-slate-900/50 transition-all cursor-pointer shadow-sm"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type} className="bg-slate-900 text-slate-200">
                  {type === "all" ? t("catalog.filtersMeta.typeOptions.all") : t(`asset.labels.${type.toLowerCase()}`)}
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
