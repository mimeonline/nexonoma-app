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
};

const parsePerspective = (value?: string): MatrixPerspective => {
  if (!value) return MatrixPerspective.VALUE_STREAM;
  const normalized = value.toLowerCase();
  if (normalized === "decision_type") return MatrixPerspective.DECISION_TYPE;
  if (normalized === "organizational_maturity") return MatrixPerspective.ORGANIZATIONAL_MATURITY;
  return MatrixPerspective.VALUE_STREAM;
};

const parseContentTypes = (value?: string): AssetType[] | undefined => {
  if (!value) return undefined;
  const normalized = value
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  if (normalized.length === 0) return undefined;

  const typeMap: Record<string, AssetType> = {
    concept: AssetType.CONCEPT,
    method: AssetType.METHOD,
    tool: AssetType.TOOL,
    technology: AssetType.TECHNOLOGY,
  };

  const resolved = normalized
    .map((entry) => typeMap[entry])
    .filter((entry): entry is AssetType => Boolean(entry));

  return resolved.length > 0 ? resolved : undefined;
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

  if (searchParams?.clusterSlug) {
    const clusterView = await gridApi.getClusterView(searchParams.clusterSlug);
    return clusterView.cluster?.id ?? null;
  }

  const macroClusters = await gridApi.getOverview();
  const macroSlug = macroClusters[0]?.slug;
  if (!macroSlug) return null;

  const macroView = await gridApi.getMacroClusterView(macroSlug);
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

    const perspective = parsePerspective(resolvedSearchParams?.perspective);
    const contentTypes = parseContentTypes(resolvedSearchParams?.types);
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
