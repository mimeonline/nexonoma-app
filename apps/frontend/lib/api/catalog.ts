// lib/api/catalog.ts
import type { CatalogListResponse, ContentDetail } from "@/types/catalog";
import { apiClient } from "./client";

// Endpoint Konfiguration
const CATALOG_ENDPOINT = process.env.NEXT_PUBLIC_CATALOG_ENDPOINT?.trim() || "/api/catalog";

export async function fetchCatalog(locale?: string): Promise<CatalogListResponse> {
  // Wenn locale da ist, hängen wir es als Query-Parameter an
  const endpoint = locale ? `${CATALOG_ENDPOINT}?locale=${locale}` : CATALOG_ENDPOINT;

  return apiClient<CatalogListResponse>(endpoint);
}

export async function fetchCatalogItemById(id: string, locale?: string): Promise<ContentDetail | null> {
  // URL bereinigen und ID anhängen
  const baseUrl = CATALOG_ENDPOINT.replace(/\/$/, "");
  let endpoint = `${baseUrl}/${id}`;

  if (locale) {
    endpoint += `?locale=${locale}`;
  }

  try {
    return await apiClient<ContentDetail>(endpoint);
  } catch (error: unknown) {
    // Spezielles Handling: Wenn Item nicht gefunden, return null statt Crash
    // (Checke hier auf den Error-String oder Status, falls du den Error erweitert hast)
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}
