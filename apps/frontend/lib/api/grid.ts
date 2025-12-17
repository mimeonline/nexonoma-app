// lib/api/grid.ts
import type { GridResponse } from "@/types/grid";
import { apiClient } from "./client";

const GRID_ENDPOINT = process.env.NEXT_PUBLIC_GRID_ENDPOINT || "/api/grid";

export async function fetchGrid(locale?: string): Promise<GridResponse> {
  const endpoint = locale ? `${GRID_ENDPOINT}?locale=${locale}` : GRID_ENDPOINT;

  return apiClient<GridResponse>(endpoint);
}
