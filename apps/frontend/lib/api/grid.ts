import type { GridResponse } from "@/types/grid";

const GRID_ENDPOINT = process.env.NEXT_PUBLIC_GRID_ENDPOINT || "/api/grid";

function resolveGridEndpoint(): string {
  if (GRID_ENDPOINT.startsWith("http")) return GRID_ENDPOINT;

  // In the browser, relative paths are fine.
  if (typeof window !== "undefined") return GRID_ENDPOINT;

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
    `http://localhost:${process.env.PORT ?? "3000"}`;

  return new URL(GRID_ENDPOINT, base).toString();
}

export async function fetchGrid(): Promise<GridResponse> {
  const endpoint = resolveGridEndpoint();

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Grid fetch failed with status ${response.status}`);
  }

  const data: GridResponse = await response.json();
  return data;
}
