import type { ContentResponse } from "@/types/content";
import { fetchJson, getApiBase } from "./apiUtils";

export function createContentApi(lang: string) {
  const baseUrl = getApiBase();

  const getContent = async (assetType: string, slug: string): Promise<ContentResponse> => {
    const url = `${baseUrl}/content/${assetType}/${slug}?lang=${lang}`;
    return fetchJson(url, { errorLabel: `Failed to fetch content for type '${assetType}' and slug '${slug}'` });
  };

  return { getContent };
}
