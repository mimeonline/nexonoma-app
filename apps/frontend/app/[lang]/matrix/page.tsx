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

const resolveClusterId = async (lang: string, searchParams?: MatrixSearchParams): Promise<string | null> => {
  if (searchParams?.clusterId) return searchParams.clusterId;

  const gridApi = createGridApi(lang);
  const clusterSlug = searchParams?.cluster ?? searchParams?.clusterSlug;
  if (clusterSlug) {
    const clusterView = await gridApi.getClusterView(clusterSlug);
    return clusterView.cluster?.id ?? null;
  }

  const macroSlug = searchParams?.macro ?? searchParams?.macroClusterSlug;
  if (macroSlug) {
    const macroView = await gridApi.getMacroClusterView(macroSlug);
    return macroView.clusters?.[0]?.id ?? null;
  }

  const macroClusters = await gridApi.getOverview();
  const fallbackMacroSlug = macroClusters[0]?.slug;
  if (!fallbackMacroSlug) return null;

  const macroView = await gridApi.getMacroClusterView(fallbackMacroSlug);
  return macroView.clusters?.[0]?.id ?? null;
};

export default async function MatrixPage({
  params,
  searchParams,
}: PageProps<"/[lang]/matrix"> & { searchParams?: Promise<MatrixSearchParams> }) {
  const { lang } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  let data;
  try {
    const clusterId = await resolveClusterId(lang, resolvedSearchParams);
    if (!clusterId) notFound();

    // Apply defaults when URL params are missing.
    const perspective = parsePerspective(resolvedSearchParams?.persp ?? resolvedSearchParams?.perspective);
    const contentTypes = parseContentTypes(resolvedSearchParams?.type ?? resolvedSearchParams?.types);
    const cellLimit = parseCellLimit(resolvedSearchParams?.cellLimit);

    const api = createMatrixApi(lang);
    data = await api.getMatrixView({
      clusterId,
      mode: MatrixMode.SEGMENT_BY_PERSPECTIVE,
      perspective,
      contentTypes,
      cellLimit,
    });
  } catch (error) {
    serverLogger.error("Failed to load matrix view", { error });
    notFound();
  }

  if (!data) notFound();

  return <Matrix data={data} />;
}
