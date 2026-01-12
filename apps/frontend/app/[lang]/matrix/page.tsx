import Matrix from "@/features/matrix/templates/Matrix";
import { serverLogger } from "@/lib/server-logger";
import { createGridApi } from "@/services/gridApi";
import { createMatrixApi } from "@/services/matrixApi";
import { MatrixMode, MatrixPerspective } from "@/types/matrix";
import { AssetType } from "@/types/nexonoma";
import { notFound } from "next/navigation";

type MatrixSearchParams = {
  clusterId?: string;
  clusterSlug?: string;
  xDim?: string;
  yDim?: string;
  macroClusterSlug?: string;
  perspective?: string;
  types?: string;
  cellLimit?: string;
  macro?: string;
  cluster?: string;
  yMacro?: string;
  yCluster?: string;
  persp?: string;
  type?: string;
};

const parsePerspective = (value?: string): MatrixPerspective => {
  if (!value) return MatrixPerspective.VALUE_STREAM;
  const normalized = value.toUpperCase();
  if (normalized === "DECISION_TYPE") return MatrixPerspective.DECISION_TYPE;
  if (normalized === "ORGANIZATIONAL_MATURITY") return MatrixPerspective.ORGANIZATIONAL_MATURITY;
  return MatrixPerspective.VALUE_STREAM;
};

const parseAxisDimension = (value?: string): "STRUCTURE" | "PERSPECTIVE" | "CONTEXT" => {
  if (value === "STRUCTURE" || value === "PERSPECTIVE" || value === "CONTEXT") return value;
  return "STRUCTURE";
};

const parseContentTypes = (value?: string): AssetType[] | undefined => {
  if (!value || value === "all") return undefined;
  const normalized = value.trim().toLowerCase();
  const typeMap: Record<string, AssetType> = {
    concept: AssetType.CONCEPT,
    method: AssetType.METHOD,
    tool: AssetType.TOOL,
    technology: AssetType.TECHNOLOGY,
  };
  const resolved = typeMap[normalized];
  return resolved ? [resolved] : undefined;
};

const parseCellLimit = (value?: string): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return undefined;
  return Math.min(50, parsed);
};

type ClusterSelection = {
  clusterId: string;
  clusterSlug?: string;
  macroClusterId?: string;
  macroClusterSlug?: string;
};

const resolveClusterSelection = async (
  lang: string,
  options?: { clusterSlug?: string; macroSlug?: string }
): Promise<ClusterSelection | null> => {
  if (options?.clusterSlug && !options?.macroSlug) {
    const gridApi = createGridApi(lang);
    const clusterView = await gridApi.getClusterView(options.clusterSlug);
    const clusterId = clusterView.cluster?.id;
    if (!clusterId) return null;
    return {
      clusterId,
      clusterSlug: clusterView.cluster?.slug ?? options.clusterSlug,
    };
  }

  const gridApi = createGridApi(lang);
  const macroSlug = options?.macroSlug;
  if (macroSlug) {
    const macroView = await gridApi.getMacroClusterView(macroSlug);
    const resolvedCluster =
      macroView.clusters?.find((cluster) => cluster.slug === options?.clusterSlug) ?? macroView.clusters?.[0];
    if (!resolvedCluster) return null;
    return {
      clusterId: resolvedCluster.id,
      clusterSlug: resolvedCluster.slug,
      macroClusterId: macroView.macroCluster?.id,
      macroClusterSlug: macroView.macroCluster?.slug ?? macroSlug,
    };
  }

  const macroClusters = await gridApi.getOverview();
  const fallbackMacroSlug = macroClusters[0]?.slug;
  if (!fallbackMacroSlug) return null;

  const macroView = await gridApi.getMacroClusterView(fallbackMacroSlug);
  const fallbackCluster = macroView.clusters?.[0];
  if (!fallbackCluster) return null;
  return {
    clusterId: fallbackCluster.id,
    clusterSlug: fallbackCluster.slug,
    macroClusterId: macroView.macroCluster?.id,
    macroClusterSlug: macroView.macroCluster?.slug ?? fallbackMacroSlug,
  };
};

export default async function MatrixPage({
  params,
  searchParams,
}: PageProps<"/[lang]/matrix"> & { searchParams?: Promise<MatrixSearchParams> }) {
  const { lang } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  let data;
  try {
    const xDim = parseAxisDimension(resolvedSearchParams?.xDim);
    const yDim = parseAxisDimension(resolvedSearchParams?.yDim ?? "PERSPECTIVE");
    const xSelection = await resolveClusterSelection(lang, {
      clusterSlug: resolvedSearchParams?.cluster ?? resolvedSearchParams?.clusterSlug,
      macroSlug: resolvedSearchParams?.macro ?? resolvedSearchParams?.macroClusterSlug,
    });
    if (!xSelection) notFound();

    // Apply defaults when URL params are missing.
    const perspective = parsePerspective(resolvedSearchParams?.persp ?? resolvedSearchParams?.perspective);
    const contentTypes = parseContentTypes(resolvedSearchParams?.type ?? resolvedSearchParams?.types);
    const cellLimit = parseCellLimit(resolvedSearchParams?.cellLimit);
    const isStructureByStructure = xDim === "STRUCTURE" && yDim === "STRUCTURE";
    const ySelection = isStructureByStructure
      ? await resolveClusterSelection(lang, {
          clusterSlug: resolvedSearchParams?.yCluster ?? xSelection.clusterSlug ?? resolvedSearchParams?.cluster,
          macroSlug: resolvedSearchParams?.yMacro ?? xSelection.macroClusterSlug ?? resolvedSearchParams?.macro,
        })
      : null;

    if (isStructureByStructure && !ySelection) notFound();

    const api = createMatrixApi(lang);
    data = await api.getMatrixView({
      xClusterId: xSelection.clusterId,
      mode: isStructureByStructure ? MatrixMode.SEGMENT_BY_SEGMENT : MatrixMode.SEGMENT_BY_PERSPECTIVE,
      xPerspective: perspective,
      contentTypes,
      cellLimit,
      yClusterId: ySelection?.clusterId,
    });
  } catch (error) {
    serverLogger.error("Failed to load matrix view", { error });
    notFound();
  }

  if (!data) notFound();

  return <Matrix data={data} />;
}
