import type { Overview360Response } from "@/types/overview360";
import { fetchJson, getApiBase } from "./apiUtils";

export function createOverview360Api(lang: string) {
  const baseUrl = getApiBase();

  const getOverview = async (): Promise<Overview360Response> => {
    const url = `${baseUrl}/360?lang=${lang}`;
    return fetchJson(url, { errorLabel: "Failed to fetch 360 overview" });
  };

  return {
    getOverview,
  };
}
