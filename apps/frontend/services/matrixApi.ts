import type { MatrixMode, MatrixPerspective, MatrixViewResponseDto } from "@/types/matrix";
import type { AssetType } from "@/types/nexonoma";
import { fetchJson, getApiBase } from "./apiUtils";

export type MatrixQueryParams = {
  clusterId: string;
  mode: MatrixMode;
  perspective: MatrixPerspective;
  contentTypes?: AssetType[];
  lang?: string;
  cellLimit?: number;
  xIds?: string[];
  yDimension?: string;
  yMacroClusterId?: string;
  yClusterId?: string;
};

const toContentTypeParam = (type: AssetType) => type.toLowerCase();

export function createMatrixApi(lang: string) {
  const baseUrl = getApiBase();

  return {
    async getMatrixView(params: Omit<MatrixQueryParams, "lang">): Promise<MatrixViewResponseDto> {
      const searchParams = new URLSearchParams({
        clusterId: params.clusterId,
        mode: params.mode,
        perspective: params.perspective,
        lang,
      });

      if (params.contentTypes?.length) {
        searchParams.set("contentTypes", params.contentTypes.map(toContentTypeParam).join(","));
      }
      if (params.cellLimit !== undefined) {
        searchParams.set("cellLimit", String(params.cellLimit));
      }
      if (params.xIds?.length) {
        searchParams.set("xIds", params.xIds.join(","));
      }
      if (params.yDimension) {
        searchParams.set("yDimension", params.yDimension);
      }
      if (params.yMacroClusterId) {
        searchParams.set("yMacroClusterId", params.yMacroClusterId);
      }
      if (params.yClusterId) {
        searchParams.set("yClusterId", params.yClusterId);
      }

      const url = `${baseUrl}/matrix?${searchParams.toString()}`;
      return fetchJson(url, { errorLabel: "Failed to fetch matrix view" });
    },
  };
}
