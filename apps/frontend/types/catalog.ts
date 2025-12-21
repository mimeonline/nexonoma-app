import { AssetBase, AssetType, FullAsset } from "./nexonoma";

/**
 * CatalogItem:
 * Das Objekt für die Listen-Ansicht.
 * Wir erweitern AssetBase um einige Metadaten aus FullAsset,
 * die oft auf "Karten" im Grid angezeigt werden.
 */
export interface CatalogItem extends AssetBase {
  // Felder aus FullAsset, die wir im Grid vorschauen wollen:
  maturityLevel?: string;
  complexityLevel?: string;
  cognitiveLoad?: string;
  organizationalMaturity?: string[];
  decisionType?: string[];
  valueStreamStage?: string;
  principles?: string[];
  organizationalLevel: string[];
  // Falls du impacts/risks anzeigen willst:
  impacts?: string;
}

// Für die Detail-Page (schweres Objekt)
// Semantisch: "Im Kontext Catalog ist das Detail ein FullAsset"
export type ContentDetail = FullAsset;

/**
 * CatalogContentType:
 * Definiert, was als 'contentType' in der URL erlaubt ist.
 * Bsp: 'method', 'tool', 'technology' (lowercase), abgeleitet vom Enum.
 */
export type CatalogContentType = Lowercase<keyof typeof AssetType>;

/**
 * CatalogResponse:
 * Falls deine API eine Wrapper-Struktur hat.
 * Wenn die API direkt ein Array zurückgibt, brauchst du das hier nicht zwingend,
 * aber es ist gut für die Zukunft (Pagination).
 */
export interface CatalogListResponse {
  data: CatalogItem[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
  };
}
