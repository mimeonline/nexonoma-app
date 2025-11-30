import type { GridResponse } from "@/types/grid";

const GRID_ENDPOINT = "http://localhost:4500/grid";

export async function fetchGrid(): Promise<GridResponse> {
  const response = await fetch(GRID_ENDPOINT, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Grid fetch failed with status ${response.status}`);
  }

  const data: GridResponse = await response.json();
  return data;
}
