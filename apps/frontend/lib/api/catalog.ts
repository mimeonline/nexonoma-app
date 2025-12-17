// lib/api/catalog.ts
import type { CatalogResponse } from "@/types/catalog";
import { apiClient } from "./client";

// Endpoint Konfiguration
const CATALOG_ENDPOINT = process.env.NEXT_PUBLIC_CATALOG_ENDPOINT?.trim() || "/api/catalog";

export async function fetchCatalog(locale?: string): Promise<CatalogResponse> {
  // Wenn locale da ist, hängen wir es als Query-Parameter an
  const endpoint = locale ? `${CATALOG_ENDPOINT}?locale=${locale}` : CATALOG_ENDPOINT;

  return apiClient<CatalogResponse>(endpoint);
}

export async function fetchCatalogItemById(id: string, locale?: string) {
  // URL bereinigen und ID anhängen
  const baseUrl = CATALOG_ENDPOINT.replace(/\/$/, "");
  let endpoint = `${baseUrl}/${id}`;

  if (locale) {
    endpoint += `?locale=${locale}`;
  }

  try {
    return await apiClient<any>(endpoint);
  } catch (error: any) {
    // Spezielles Handling: Wenn Item nicht gefunden, return null statt Crash
    // (Checke hier auf den Error-String oder Status, falls du den Error erweitert hast)
    if (error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}
