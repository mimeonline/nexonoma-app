import { fetchJson, getApiBase } from "./apiUtils";

export type MatrixQueryParams = {
  clusterId: string;
  mode: string;
  perspective: string;
  contentTypes?: string[];
  lang?: string;
  cellLimit?: number;
  xIds?: string[];
};

export type MatrixResponse = unknown;

export function createMatrixApi(lang: string) {
  const baseUrl = getApiBase();

  return {
    async getMatrix(params: Omit<MatrixQueryParams, "lang">): Promise<MatrixResponse> {
      const searchParams = new URLSearchParams({
        clusterId: params.clusterId,
        mode: params.mode,
        perspective: params.perspective,
        lang,
      });

      if (params.contentTypes?.length) {
        searchParams.set("contentTypes", params.contentTypes.join(","));
      }
      if (params.cellLimit !== undefined) {
        searchParams.set("cellLimit", String(params.cellLimit));
      }
      if (params.xIds?.length) {
        searchParams.set("xIds", params.xIds.join(","));
      }

      const url = `${baseUrl}/matrix?${searchParams.toString()}`;
      return fetchJson(url, { errorLabel: "Failed to fetch matrix" });
    },
  };
}
