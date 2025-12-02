import type { CatalogResponse } from "@/types/catalog";

const CATALOG_ENDPOINT =
  process.env.NEXT_PUBLIC_CATALOG_ENDPOINT?.trim() || "/api/catalog";

function resolveCatalogEndpoint(): string {
  if (CATALOG_ENDPOINT.startsWith("http")) return CATALOG_ENDPOINT;

  if (typeof window !== "undefined") return CATALOG_ENDPOINT;

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ||
    `http://localhost:${process.env.PORT ?? "3000"}`;

  return new URL(CATALOG_ENDPOINT, base).toString();
}

export async function fetchCatalog(): Promise<CatalogResponse> {
  const endpoint = resolveCatalogEndpoint();

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Catalog fetch failed with status ${response.status}`);
  }

  const data: CatalogResponse = await response.json();
  return data;
}

export async function fetchCatalogItemById(id: string) {
  const endpoint = `${resolveCatalogEndpoint().replace(/\/$/, "")}/${id}`;

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Catalog item fetch failed with status ${response.status}`);
  }

  return response.json();
}
