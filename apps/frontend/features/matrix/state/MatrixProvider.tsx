"use client";

import { AssetType } from "@/types/nexonoma";
import { createContext, useContext, useState } from "react";
import { matrixClusters, matrixMacroClusters } from "../data/matrixData";

type AxisType = "structure" | "perspective" | "context";

type StructureDimension = "macroCluster" | "cluster" | "segment";

type PerspectiveDimension = "valueStreamStage" | "sdlcStage" | "decisionType" | "organizationalMaturity";

type ContextDimension = "role" | "profile" | "domain" | "layer";

type AxisDimension = StructureDimension | PerspectiveDimension | ContextDimension;

type MatrixState = {
  macroClusterId: string;
  clusterId: string;
  xAxisType: AxisType;
  xAxisDimension: AxisDimension;
  yAxisType: AxisType;
  yAxisDimension: AxisDimension;
  contentType: AssetType | "all";
  role: string;
  profile: string;
  domain: string;
  layer: string;
  setMacroClusterId: (value: string) => void;
  setClusterId: (value: string) => void;
  setXAxisType: (value: AxisType) => void;
  setXAxisDimension: (value: AxisDimension) => void;
  setYAxisType: (value: AxisType) => void;
  setYAxisDimension: (value: AxisDimension) => void;
  setContentType: (value: AssetType | "all") => void;
  setRole: (value: string) => void;
  setProfile: (value: string) => void;
  setDomain: (value: string) => void;
  setLayer: (value: string) => void;
};

const MatrixContext = createContext<MatrixState | null>(null);

const structureDimensions: StructureDimension[] = ["macroCluster", "cluster", "segment"];
const perspectiveDimensions: PerspectiveDimension[] = ["valueStreamStage", "sdlcStage", "decisionType", "organizationalMaturity"];
const contextDimensions: ContextDimension[] = ["role", "profile", "domain", "layer"];

function defaultDimensionFor(type: AxisType): AxisDimension {
  if (type === "structure") return "segment";
  if (type === "context") return "role";
  return "valueStreamStage";
}

function resolveDimensionList(type: AxisType): AxisDimension[] {
  if (type === "structure") return structureDimensions;
  if (type === "context") return contextDimensions;
  return perspectiveDimensions;
}

function normalizeAxisPair(
  xType: AxisType,
  xDim: AxisDimension,
  yType: AxisType,
  yDim: AxisDimension
): { xType: AxisType; xDim: AxisDimension; yType: AxisType; yDim: AxisDimension } {
  let nextXType = xType;
  let nextXDim = xDim;
  let nextYType = yType;
  let nextYDim = yDim;

  if (nextXType === "context" && nextYType === "context") {
    nextYType = "perspective";
    nextYDim = defaultDimensionFor(nextYType);
  }

  if (nextXType === nextYType && (nextXType === "structure" || nextXType === "perspective")) {
    if (nextXDim === nextYDim) {
      const options = resolveDimensionList(nextYType);
      const fallback = options.find((opt) => opt !== nextXDim) ?? defaultDimensionFor(nextYType);
      nextYDim = fallback;
    }
  }

  return { xType: nextXType, xDim: nextXDim, yType: nextYType, yDim: nextYDim };
}

export function MatrixProvider({ children }: { children: React.ReactNode }) {
  const defaultMacro = matrixMacroClusters[0]?.id ?? "";
  const defaultCluster = matrixClusters.find((cluster) => cluster.macroClusterId === defaultMacro)?.id ?? "";
  const [macroClusterId, setMacroClusterId] = useState(defaultMacro);
  const [clusterId, setClusterId] = useState(defaultCluster);
  const [xAxisType, setXAxisTypeState] = useState<AxisType>("structure");
  const [xAxisDimension, setXAxisDimensionState] = useState<AxisDimension>("segment");
  const [yAxisType, setYAxisTypeState] = useState<AxisType>("perspective");
  const [yAxisDimension, setYAxisDimensionState] = useState<AxisDimension>("valueStreamStage");
  const [contentType, setContentType] = useState<AssetType | "all">(AssetType.METHOD);
  const [role, setRole] = useState("all");
  const [profile, setProfile] = useState("all");
  const [domain, setDomain] = useState("all");
  const [layer, setLayer] = useState("all");

  const ensureCluster = (nextMacroId: string) => {
    const nextCluster = matrixClusters.find((cluster) => cluster.macroClusterId === nextMacroId);
    setClusterId(nextCluster?.id ?? "");
  };

  const handleMacroClusterChange = (value: string) => {
    setMacroClusterId(value);
    ensureCluster(value);
  };

  const setXAxisType = (value: AxisType) => {
    const normalized = normalizeAxisPair(value, defaultDimensionFor(value), yAxisType, yAxisDimension);
    setXAxisTypeState(normalized.xType);
    setXAxisDimensionState(normalized.xDim);
    setYAxisTypeState(normalized.yType);
    setYAxisDimensionState(normalized.yDim);
  };

  const setYAxisType = (value: AxisType) => {
    const normalized = normalizeAxisPair(xAxisType, xAxisDimension, value, defaultDimensionFor(value));
    setXAxisTypeState(normalized.xType);
    setXAxisDimensionState(normalized.xDim);
    setYAxisTypeState(normalized.yType);
    setYAxisDimensionState(normalized.yDim);
  };

  const setXAxisDimension = (value: AxisDimension) => {
    const normalized = normalizeAxisPair(xAxisType, value, yAxisType, yAxisDimension);
    setXAxisTypeState(normalized.xType);
    setXAxisDimensionState(normalized.xDim);
    setYAxisTypeState(normalized.yType);
    setYAxisDimensionState(normalized.yDim);
  };

  const setYAxisDimension = (value: AxisDimension) => {
    const normalized = normalizeAxisPair(xAxisType, xAxisDimension, yAxisType, value);
    setXAxisTypeState(normalized.xType);
    setXAxisDimensionState(normalized.xDim);
    setYAxisTypeState(normalized.yType);
    setYAxisDimensionState(normalized.yDim);
  };

  return (
    <MatrixContext.Provider
      value={{
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
        setMacroClusterId: handleMacroClusterChange,
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
      }}
    >
      {children}
    </MatrixContext.Provider>
  );
}

export function useMatrixState() {
  const ctx = useContext(MatrixContext);
  if (!ctx) throw new Error("useMatrixState must be used within MatrixProvider");
  return ctx;
}

export type { AxisType, AxisDimension, StructureDimension, PerspectiveDimension, ContextDimension };
