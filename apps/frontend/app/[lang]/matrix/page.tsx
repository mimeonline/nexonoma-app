import Matrix from "@/features/matrix/templates/Matrix";
import { serverLogger } from "@/lib/server-logger";
import { createGridApi } from "@/services/gridApi";
import { createMatrixApi } from "@/services/matrixApi";
import { MatrixMode, MatrixPerspective } from "@/types/matrix";
import { notFound } from "next/navigation";

type MatrixSearchParams = {
  clusterId?: string;
  clusterSlug?: string;
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

    const api = createMatrixApi(lang);
    data = await api.getMatrixView({
      clusterId,
      mode: MatrixMode.SEGMENT_BY_PERSPECTIVE,
      perspective: MatrixPerspective.VALUE_STREAM,
    });
  } catch (error) {
    serverLogger.error("Failed to load matrix view", { error });
    notFound();
  }

  if (!data) notFound();

  return <Matrix data={data} />;
}
